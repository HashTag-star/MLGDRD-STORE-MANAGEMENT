document.addEventListener("DOMContentLoaded", () => {
    // Get all item elements
    const items = document.querySelectorAll(".items");
  
    const fetchInitialStock = () => {
      fetch("http://localhost:3000/stock")
        .then((response) => response.json())
        .then((data) => {
          data.forEach((stockItem) => {
            const itemElement = Array.from(items).find((item) => {
              return item.querySelector("p").textContent === stockItem.item;
            });
            if (itemElement) {
              const inputField = itemElement.querySelector(".choose input");
              const availableSpan = itemElement.querySelector(".no-items span");
              const progressBar = itemElement.querySelector(".progress-bar");
              const stockSpan = itemElement.querySelector(".available span");
  
              const maxQuantity = stockItem.max_quantity; // Fetch max quantity from backend
              const currentQuantity = stockItem.quantity;
  
              inputField.placeholder = maxQuantity - currentQuantity;
              availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
              progressBar.style.width = `${
                (currentQuantity / maxQuantity) * 100
              }%`;
  
              // Update stock status and color
              if (currentQuantity === 0) {
                stockSpan.textContent = "Out of Stock";
                stockSpan.style.color = "red";
                inputField.value = 0;
                itemElement
                  .querySelectorAll(".choose button")
                  .forEach((button) => {
                    button.disabled = true;
                  });
              } else {
                stockSpan.textContent = "In Stock";
                stockSpan.style.color = "black";
              }
            }
          });
  
          // Populate item select dropdown for updating max quantity
          populateItemSelect(data);
        })
        .catch((error) => console.error("Error fetching initial stock:", error));
    };
  
    const updateInventoryDisplay = (itemElement, change) => {
      const inputField = itemElement.querySelector(".choose input");
      const availableSpan = itemElement.querySelector(".no-items span");
      const progressBar = itemElement.querySelector(".progress-bar");
      const stockSpan = itemElement.querySelector(".available span");
  
      const maxQuantity = parseInt(availableSpan.textContent.split("/")[1]);
      let currentQuantity = parseInt(availableSpan.textContent.split("/")[0]);
  
      if (isNaN(currentQuantity)) {
        currentQuantity = 0;
      }
  
      currentQuantity -= change;
      if (currentQuantity < 0) currentQuantity = 0;
      if (currentQuantity > maxQuantity) currentQuantity = maxQuantity;
  
      inputField.value = maxQuantity - currentQuantity;
      availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
      progressBar.style.width = `${(currentQuantity / maxQuantity) * 100}%`;
  
      // Update progress bar color
      if (currentQuantity === maxQuantity) {
        progressBar.style.backgroundColor = "green";
      } else if (currentQuantity > maxQuantity / 2) {
        progressBar.style.backgroundColor = "orange";
      } else if (currentQuantity === maxQuantity / 2) {
        progressBar.style.backgroundColor = "orangered";
      } else if (currentQuantity > 0) {
        progressBar.style.backgroundColor = "lightcoral";
      } else {
        progressBar.style.backgroundColor = "red";
      }
  
      // Update stock status
      if (currentQuantity === 0) {
        stockSpan.style.color = "red";
        stockSpan.innerHTML = "Out of stock";
      } else {
        stockSpan.style.color = "inherit";
        stockSpan.innerHTML = "In Stock";
      }
  
      // Show the "Done" button if change was made
      const doneButton = itemElement.querySelector(".done-button");
      doneButton.style.display = "block";
    };
  
    const commitChanges = (itemElement) => {
      const inputField = itemElement.querySelector(".choose input");
      const availableSpan = itemElement.querySelector(".no-items span");
      const progressBar = itemElement.querySelector(".progress-bar");
      const stockSpan = itemElement.querySelector(".available span");
  
      const maxQuantity = parseInt(availableSpan.textContent.split("/")[1]);
      let currentQuantity = maxQuantity - parseInt(inputField.value);
  
      if (isNaN(currentQuantity)) {
        currentQuantity = 0;
      }
  
      availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
      progressBar.style.width = `${(currentQuantity / maxQuantity) * 100}%`;
  
      // Update stock status and color
      if (currentQuantity === 0) {
        stockSpan.textContent = "Out of Stock";
        stockSpan.style.color = "red";
        itemElement.querySelectorAll(".choose button").forEach((button) => {
          button.disabled = true;
        });
      } else {
        stockSpan.textContent = "In Stock";
        stockSpan.style.color = "black";
        itemElement.querySelectorAll(".choose button").forEach((button) => {
          button.disabled = false;
        });
      }
    };
  
    items.forEach((item) => {
      const minusButton = item.querySelector(".choose button:first-child");
      const plusButton = item.querySelector(".choose button:last-child");
      const inputField = item.querySelector(".choose input");
      const availableSpan = item.querySelector(".no-items span");
      const progressBar = item.querySelector(".progress-bar");
      const doneButton = item.querySelector(".done-button");
  
      const initialQuantity = parseInt(availableSpan.textContent.split("/")[0]);
      let currentQuantity = initialQuantity;
  
      minusButton.addEventListener("click", () => {
        updateInventoryDisplay(item, -1);
      });
  
      plusButton.addEventListener("click", () => {
        updateInventoryDisplay(item, 1);
      });
  
      inputField.addEventListener("input", (event) => {
        const newValue = parseInt(event.target.value, 10);
        const change =
          newValue - (parseInt(availableSpan.textContent.split("/")[1]) - currentQuantity);
        updateInventoryDisplay(item, change);
      });
  
      doneButton.addEventListener("click", () => {
        const itemName = item.querySelector("p").textContent;
        fetch("http://localhost:3000/update-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item: itemName,
            quantity:
              parseInt(availableSpan.textContent.split("/")[1]) - parseInt(inputField.value),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.message);
            doneButton.style.display = "none";
            commitChanges(item);
          })
          .catch((error) => console.error("Error updating stock:", error));
      });
  
      commitChanges(item); // Initialize the inventory display
    });
  
    fetchInitialStock(); // Fetch initial stock levels when page loads
  
    // Function to populate the item select dropdown for updating max quantity
    const populateItemSelect = (data) => {
      const itemSelect = document.getElementById("item-select");
      data.forEach((stockItem) => {
        const option = document.createElement("option");
        option.value = stockItem.item;
        option.textContent = stockItem.item;
        itemSelect.appendChild(option);
      });
    };
  
    // Handle update max quantity
    document.getElementById("update-max-quantity-btn").addEventListener("click", () => {
      const selectedItem = document.getElementById("item-select").value;
      const newMaxQuantity = parseInt(document.getElementById("new-max-quantity").value, 10);
      const updateMessage = document.getElementById("update-message");
  
      if (isNaN(newMaxQuantity) || newMaxQuantity < 0) {
        updateMessage.innerText = "Please enter a valid number.";
        updateMessage.style.color = "red";
        return;
      }
  
      // Make a POST request to update the max quantity
      fetch("http://localhost:3000/update-max-quantity",{
        
      }