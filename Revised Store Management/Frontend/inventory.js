document.addEventListener("DOMContentLoaded", () => {
  // Get all item elements
  const items = document.querySelectorAll(".items");

 // Function to get maxQuantity from localStorage
const getMaxQuantity = () => {
  const storedMaxQuantity = localStorage.getItem("maxQuantity");
  return storedMaxQuantity ? parseInt(storedMaxQuantity, 10) : 70;
};

// Function to get maxQuantity from localStorage
const getMaxQuantity = () => {
  const storedMaxQuantity = localStorage.getItem("maxQuantity");
  return storedMaxQuantity ? parseInt(storedMaxQuantity, 10) : 70;
};

  // Function to get maxQuantity from localStorage
const getMaxQuantity = () => {
  const storedMaxQuantity = localStorage.getItem("maxQuantity");
  return storedMaxQuantity ? parseInt(storedMaxQuantity, 10) : 70;
};

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

            const maxQuantity = getMaxQuantity();
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
      });
  };

  const updateInventoryDisplay = (itemElement, change) => {
    const inputField = itemElement.querySelector(".choose input");
    const availableSpan = itemElement.querySelector(".no-items span");
    const progressBar = itemElement.querySelector(".progress-bar");
    const stockSpan = itemElement.querySelector(".available span");

    const maxQuantity = getMaxQuantity();
    let currentQuantity = parseInt(availableSpan.textContent.split("/")[0]);

    if (isNaN(currentQuantity)) {
      currentQuantity = 0;
    }

    currentQuantity -= change; // Reduce the current quantity by change
    if (currentQuantity < 0) currentQuantity = 0;
    if (currentQuantity > maxQuantity) currentQuantity = maxQuantity;

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

    const maxQuantity = getMaxQuantity();
    let currentQuantity = parseInt(inputField.value);

    if (isNaN(currentQuantity)) {
      currentQuantity = 0;
    }

    availableSpan.textContent = `${
      maxQuantity - currentQuantity
    }/${maxQuantity}`;
    progressBar.style.width = `${
      ((maxQuantity - currentQuantity) / maxQuantity) * 100
    }%`;

    // Update stock status and color
    if (maxQuantity - currentQuantity === 0) {
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

    const maxQuantity = getMaxQuantity();
    const initialQuantity = parseInt(availableSpan.textContent.split("/")[0]);
    let currentQuantity = initialQuantity;

    minusButton.addEventListener("click", () => {
      updateInventoryDisplay(item, 1); // Decrease quantity
    });

    plusButton.addEventListener("click", () => {
      updateInventoryDisplay(item, -1); // Increase quantity
    });

    inputField.addEventListener("input", (event) => {
      const newValue = parseInt(event.target.value, 10);
      const change = newValue - (maxQuantity - currentQuantity);
      updateInventoryDisplay(item, change);
    });

    doneButton.addEventListener("click", () => {
      const itemName = item.querySelector("p").textContent;
      fetch("http://localhost:3000/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: itemName,
          quantity: maxQuantity - parseInt(inputField.value, 10),
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
});

// document.addEventListener("DOMContentLoaded", () => {
//   const items = document.querySelectorAll(".items");
//   const bigContainers = document.querySelectorAll(".big-container");

//   const fetchInitialStock = () => {
//     fetch("http://localhost:3000/stock")
//       .then((response) => response.json())
//       .then((data) => {
//         data.forEach((stockItem) => {
//           const itemElement = Array.from(items).find(
//             (item) => item.querySelector("p").textContent === stockItem.item
//           );
//           if (itemElement) {
//             const inputField = itemElement.querySelector(".choose input");
//             const availableSpan = itemElement.querySelector(".no-items span");
//             const progressBar = itemElement.querySelector(".progress-bar");
//             const stockSpan = itemElement.querySelector(".available span");

//             const maxQuantity = stockItem.max_quantity;
//             const currentQuantity = stockItem.quantity;

//             inputField.placeholder = maxQuantity - currentQuantity;
//             availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
//             progressBar.style.width = `${
//               (currentQuantity / maxQuantity) * 100
//             }%`;

//             if (currentQuantity === 0) {
//               stockSpan.textContent = "Out of Stock";
//               stockSpan.style.color = "red";
//               inputField.value = 0;
//               itemElement
//                 .querySelectorAll(".choose button")
//                 .forEach((button) => {
//                   button.disabled = true;
//                 });
//             } else {
//               stockSpan.textContent = "In Stock";
//               stockSpan.style.color = "black";
//             }
//           }

//           // Update big-container spans with max quantity
//           const bigContainerElement = Array.from(bigContainers).find(
//             (container) =>
//               container.querySelector("p").textContent === stockItem.item
//           );
//           if (bigContainerElement) {
//             const maxQuantitySpan =
//               bigContainerElement.querySelectorAll("span")[1];
//             maxQuantitySpan.textContent = stockItem.max_quantity;
//           }
//         });
//         populateItemSelect(data);
//       })
//       .catch((error) => console.error("Error fetching initial stock:", error));
//   };

//   const updateInventoryDisplay = (itemElement, change) => {
//     const inputField = itemElement.querySelector(".choose input");
//     const availableSpan = itemElement.querySelector(".no-items span");
//     const progressBar = itemElement.querySelector(".progress-bar");
//     const stockSpan = itemElement.querySelector(".available span");

//     const maxQuantity = parseInt(availableSpan.textContent.split("/")[1]);
//     let currentQuantity = parseInt(availableSpan.textContent.split("/")[0]);

//     if (isNaN(currentQuantity)) {
//       currentQuantity = 0;
//     }

//     currentQuantity -= change;
//     if (currentQuantity < 0) currentQuantity = 0;
//     if (currentQuantity > maxQuantity) currentQuantity = maxQuantity;

//     inputField.value = maxQuantity - currentQuantity;
//     availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
//     progressBar.style.width = `${(currentQuantity / maxQuantity) * 100}%`;

//     if (currentQuantity === maxQuantity) {
//       progressBar.style.backgroundColor = "green";
//     } else if (currentQuantity > maxQuantity / 2) {
//       progressBar.style.backgroundColor = "orange";
//     } else if (currentQuantity === maxQuantity / 2) {
//       progressBar.style.backgroundColor = "orangered";
//     } else if (currentQuantity > 0) {
//       progressBar.style.backgroundColor = "lightcoral";
//     } else {
//       progressBar.style.backgroundColor = "red";
//     }

//     if (currentQuantity === 0) {
//       stockSpan.style.color = "red";
//       stockSpan.innerHTML = "Out of stock";
//     } else {
//       stockSpan.style.color = "inherit";
//       stockSpan.innerHTML = "In Stock";
//     }

//     const doneButton = itemElement.querySelector(".done-button");
//     doneButton.style.display = "block";
//   };

//   const commitChanges = (itemElement) => {
//     const inputField = itemElement.querySelector(".choose input");
//     const availableSpan = itemElement.querySelector(".no-items span");
//     const progressBar = itemElement.querySelector(".progress-bar");
//     const stockSpan = itemElement.querySelector(".available span");

//     const maxQuantity = parseInt(availableSpan.textContent.split("/")[1]);
//     let currentQuantity = maxQuantity - parseInt(inputField.value);

//     if (isNaN(currentQuantity)) {
//       currentQuantity = 0;
//     }

//     availableSpan.textContent = `${currentQuantity}/${maxQuantity}`;
//     progressBar.style.width = `${(currentQuantity / maxQuantity) * 100}%`;

//     if (currentQuantity === 0) {
//       stockSpan.textContent = "Out of Stock";
//       stockSpan.style.color = "red";
//       itemElement.querySelectorAll(".choose button").forEach((button) => {
//         button.disabled = true;
//       });
//     } else {
//       stockSpan.textContent = "In Stock";
//       stockSpan.style.color = "black";
//       itemElement.querySelectorAll(".choose button").forEach((button) => {
//         button.disabled = false;
//       });
//     }
//   };

//   items.forEach((item) => {
//     const minusButton = item.querySelector(".choose button:first-child");
//     const plusButton = item.querySelector(".choose button:last-child");
//     const inputField = item.querySelector(".choose input");
//     const availableSpan = item.querySelector(".no-items span");
//     const progressBar = item.querySelector(".progress-bar");
//     const doneButton = item.querySelector(".done-button");

//     const initialQuantity = parseInt(availableSpan.textContent.split("/")[0]);
//     let currentQuantity = initialQuantity;

//     minusButton.addEventListener("click", () => {
//       updateInventoryDisplay(item, -1);
//     });

//     plusButton.addEventListener("click", () => {
//       updateInventoryDisplay(item, 1);
//     });

//     inputField.addEventListener("input", (event) => {
//       const newValue = parseInt(event.target.value, 10);
//       const change =
//         newValue -
//         (parseInt(availableSpan.textContent.split("/")[1]) - currentQuantity);
//       updateInventoryDisplay(item, change);
//     });

//     doneButton.addEventListener("click", () => {
//       const itemName = item.querySelector("p").textContent;
//       fetch("http://localhost:3000/update-stock", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           item: itemName,
//           quantity:
//             parseInt(availableSpan.textContent.split("/")[1]) -
//             parseInt(inputField.value),
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(data.message);
//           doneButton.style.display = "none";
//           commitChanges(item);
//         })
//         .catch((error) => console.error("Error updating stock:", error));
//     });

//     commitChanges(item); // Initialize the inventory display
//   });

//   fetchInitialStock(); // Fetch initial stock levels when page loads

//   const populateItemSelect = (data) => {
//     const itemSelect = document.getElementById("item-select");
//     data.forEach((stockItem) => {
//       const option = document.createElement("option");
//       option.value = stockItem.item;
//       option.textContent = stockItem.item;
//       itemSelect.appendChild(option);
//     });
//   };

//   // Function to observe changes in the max quantity spans
//   const observeMaxQuantityChanges = () => {
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (
//           mutation.type === "childList" ||
//           mutation.type === "characterData"
//         ) {
//           const itemName =
//             mutation.target.parentElement.querySelector("p").textContent;
//           const newMaxQuantity = parseInt(mutation.target.textContent, 10);

//           if (!isNaN(newMaxQuantity)) {
//             const itemElement = Array.from(items).find(
//               (item) => item.querySelector("p").textContent === itemName
//             );
//             if (itemElement) {
//               const availableSpan = itemElement.querySelector(".no-items span");
//               const currentQuantity = parseInt(
//                 availableSpan.textContent.split("/")[0]
//               );

//               availableSpan.textContent = `${currentQuantity}/${newMaxQuantity}`;

//               const progressBar = itemElement.querySelector(".progress-bar");
//               progressBar.style.width = `${
//                 (currentQuantity / newMaxQuantity) * 100
//               }%`;

//               const inputField = itemElement.querySelector(".choose input");
//               inputField.placeholder = newMaxQuantity - currentQuantity;
//             }
//           }
//         }
//       });
//     });

//     bigContainers.forEach((container) => {
//       const maxQuantitySpan = container.querySelectorAll("span")[1];
//       observer.observe(maxQuantitySpan, {
//         childList: true,
//         characterData: true,
//         subtree: true,
//       });
//     });
//   };

//   document
//     .getElementById("update-max-quantity-btn")
//     .addEventListener("click", () => {
//       const selectedItem = document.getElementById("item-select").value;
//       const newMaxQuantity = parseInt(
//         document.getElementById("new-max-quantity").value,
//         10
//       );
//       const updateMessage = document.getElementById("update-message");

//       if (isNaN(newMaxQuantity) || newMaxQuantity < 0) {
//         updateMessage.innerText = "Please enter a valid number.";
//         updateMessage.style.color = "red";
//         return;
//       }

//       fetch("http://localhost:3000/update-max-quantity", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           item: selectedItem,
//           max_quantity: newMaxQuantity,
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             updateMessage.innerText = "Max quantity updated successfully!";
//             updateMessage.style.color = "green";

//             const itemElements = document.querySelectorAll(".items");
//             itemElements.forEach((itemElement) => {
//               const itemName = itemElement.querySelector("p").textContent;
//               if (itemName === selectedItem) {
//                 const availableSpan =
//                   itemElement.querySelector(".no-items span");
//                 const currentQuantity = parseInt(
//                   availableSpan.textContent.split("/")[0]
//                 );
//                 availableSpan.textContent = `${currentQuantity}/${newMaxQuantity}`;

//                 const progressBar = itemElement.querySelector(".progress-bar");
//                 progressBar.style.width = `${
//                   (currentQuantity / newMaxQuantity) * 100
//                 }%`;

//                 const inputField = itemElement.querySelector(".choose input");
//                 inputField.placeholder = newMaxQuantity - currentQuantity;
//               }
//             });

//             bigContainers.forEach((container) => {
//               const itemName = container.querySelector("p").textContent;
//               if (itemName === selectedItem) {
//                 const quantitySpan = container.querySelectorAll("span")[1]; // Assuming second span holds the quantity
//                 quantitySpan.textContent = newMaxQuantity;
//               }
//             });
//           } else {
//             updateMessage.innerText = "Failed to update max quantity.";
//             updateMessage.style.color = "red";
//           }
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           updateMessage.innerText = "An error occurred. Please try again.";
//           updateMessage.style.color = "red";
//         });
//     });

//   observeMaxQuantityChanges(); // Start observing changes in the max quantity spans
// });

// A whole new



document.addEventListener("DOMContentLoaded", () => {
  const userDiv = document.getElementById('selector');
  userDiv.innerText = "RN: " + textFieldValue;
})
