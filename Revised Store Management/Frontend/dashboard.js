const links = document.querySelectorAll(".linkks");

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((link) => link.classList.remove("active"));
    link.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const inventoryList = document.getElementById("inventoryList");

  // Fetch inventory data from the server
  fetch("http://localhost:3000/inventory")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <span>${item.item_name}</span>
                    <input type="number" value="${item.quantity}" data-id="${item.id}">
                    <button class="update-btn">Update</button>
                `;
        inventoryList.appendChild(li);
      });

      // Add event listeners to update buttons
      document.querySelectorAll(".update-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const input = event.target.previousElementSibling;
          const id = input.getAttribute("data-id");
          const quantity = input.value;

          // Send update request to the server
          fetch("http://localhost:3000/update-inventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, quantity }),
          })
            .then((response) => response.json())
            .then((data) => {
              alert(data.message);
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Error updating inventory");
            });
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

const toggleButton = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const body = document.body;

function toggleSidebar() {
  sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");

  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    ul.previousElementSibling.classList.remove("rotate");
  });
}

if (sidebar.classList.contains("close")) {
  body.style.gridTemplateColumns = "auto 1fr";
} else {
  body.style.gridTemplateColumns = "auto 1100px";
}

function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling.querySelector(".sub-menu");
  button.classList.toggle("rotate");

  const menuItems = document.querySelectorAll("li");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  if (subMenu) {
    subMenu.classList.toggle("show");
  }

  if (sidebar.classList.contains("close")) {
    sidebar.classList.toggle("close");
    toggleButton.classList.toggle("rotate");
  }
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".home-hero");
  sections.forEach((section) => {
    section.classList.remove("activ");
  });
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("activ");
    activeSection.scrollIntoView({ behavior: "smooth" }); // Scrolls the active section into view
  }
}

// Example usage: Attach this function to a link click event
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.getAttribute("href").substring(1); // Assuming href is in the format #sectionId
    showSection(targetId);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addItemForm = document.getElementById("add-item-form");

  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const itemName = document.getElementById("item-name").value;
    const itemQuantity = parseInt(
      document.getElementById("item-quantity").value,
      10
    );
    const maxQuantity = parseInt(
      document.getElementById("max-quantity").value,
      10
    );

    const newItem = {
      item: itemName,
      quantity: itemQuantity,
      max_quantity: maxQuantity,
    };

    fetch("http://localhost:3000/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        addItemToUI(newItem);
      })
      .catch((error) => console.error("Error adding item:", error));
  });

  const addItemToUI = (item) => {
    const itemsContainer = document.querySelector(".container .wrapper");

    const itemElement = document.createElement("div");
    itemElement.classList.add("items");

    itemElement.innerHTML = `
            <div class="items-wrapper">
                <img src="Assets/${item.item
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.png" alt="${item.item}">
                <p>${item.item}</p>
                <div class="available">
                    <span>In Stock</span>
                    <div class="indicator"></div>
                </div>
                <div class="inventory">
                    <div class="no-items">
                        <div class="choose">
                            <button>-</button>
                            <input type="text" placeholder="0" disabled>
                            <button>+</button>
                        </div>
                        <span>${item.quantity}/${item.max_quantity}</span>
                    </div>
                    <div class="progress-bar" style="width: ${
                      (item.quantity / item.max_quantity) * 100
                    }%;"></div>
                </div>
                <button class="done-button" style="display: none;">Done</button>
            </div>
        `;

    itemsContainer.appendChild(itemElement);

    // Add event listeners to the new item
    itemElement
      .querySelector(".choose button:first-child")
      .addEventListener("click", () => {
        updateInventoryDisplay(itemElement, -1);
      });

    itemElement
      .querySelector(".choose button:last-child")
      .addEventListener("click", () => {
        updateInventoryDisplay(itemElement, 1);
      });

    itemElement.querySelector(".done-button").addEventListener("click", () => {
      const itemName = item.item;
      const inputField = itemElement.querySelector(".choose input");
      const currentQuantity = parseInt(inputField.placeholder);
      const maxQuantity = parseInt(
        itemElement.querySelector(".no-items span").textContent.split("/")[1]
      );
      fetch("http://localhost:3000/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: itemName,
          quantity: currentQuantity,
          max_quantity: maxQuantity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          itemElement.querySelector(".done-button").style.display = "none";
          commitChanges(itemElement);
        })
        .catch((error) => console.error("Error updating stock:", error));
    });
  };
});

// document.addEventListener("DOMContentLoaded", function () {
//   // Function to generate a unique ID
//   function generateUniqueId() {
//       return 'id-' + Math.random().toString(36).substr(2, 9);
//   }

//   // Add unique data-id to each .ind-item
//   const items = document.querySelectorAll(".ind-item");
//   items.forEach((item) => {
//       if (!item.hasAttribute('data-id')) {
//           item.setAttribute('data-id', generateUniqueId());
//       }
//   });

//   // Add event listeners for "more" buttons
//   const moreButtons = document.querySelectorAll(".more");
//   moreButtons.forEach((button) => {
//       button.addEventListener("click", function (event) {
//           event.stopPropagation();
//           closeAllDropdowns();
//           const dropdown = this.parentNode.querySelector(".dropdow");
//           dropdown.style.display = "block";
//       });
//   });

//   // Close dropdowns when clicking outside
//   document.addEventListener("click", function (event) {
//       if (!event.target.matches(".more")) {
//           closeAllDropdowns();
//       }
//   });

//   function closeAllDropdowns() {
//       const dropdowns = document.querySelectorAll(".dropdow");
//       dropdowns.forEach((dropdown) => {
//           dropdown.style.display = "none";
//       });
//   }
//  closeAllForms()
//   window.editItem = function(event) {
//       event.preventDefault();
//       closeAllForms();
//       const item = event.target.closest(".ind-item");
//       const name = item.querySelector(".item-name").textContent;
//       const status = item.querySelector(".stock-status").textContent;
//       const quantity = item.querySelector(".item-quantity").textContent;
//       const form = item.querySelector(".edit-form");

//       // Populate form fields with the current values
//       form.querySelector(".edit-name").value = name;
//       form.querySelector(".edit-status").value = status;
//       form.querySelector(".edit-quantity").value = quantity;

//       // Show the form
//       form.style.display = "block";
//   }

//   window.saveEdit = function(event) {
//       const item = event.target.closest(".ind-item");
//       const name = item.querySelector(".edit-name").value;
//       const status = item.querySelector(".edit-status").value;
//       const quantity = item.querySelector(".edit-quantity").value;

//       item.querySelector(".item-name").textContent = name;
//       item.querySelector(".stock-status").textContent = status;
//       item.querySelector(".item-quantity").textContent = quantity;

//       // Save the updated data to Local Storage
//       const itemId = item.dataset.id;
//       const updatedData = { name, status, quantity };
//       localStorage.setItem(`item-${itemId}`, JSON.stringify(updatedData));

//       closeAllForms();

//       // Update the indicator color and status based on quantity
//       updateIndicator(item, quantity);

//       // Update the user panel with the new data
//       updateUserPanel(itemId, name, status, quantity);
//   }

//   window.cancelEdit = function(event) {
//       closeAllForms();
//   }

//   function closeAllForms() {
//       const forms = document.querySelectorAll(".edit-form");
//       forms.forEach((form) => {
//           form.style.display = "none";
//       });
//   }

//   // Load data from Local Storage
//   items.forEach((item) => {
//       const itemId = item.dataset.id;
//       const savedData = localStorage.getItem(`item-${itemId}`);
//       if (savedData) {
//           const { name, status, quantity } = JSON.parse(savedData);
//           item.querySelector(".item-name").textContent = name;
//           item.querySelector(".stock-status").textContent = status;
//           item.querySelector(".item-quantity").textContent = quantity;

//           // Update the indicator color and status based on loaded quantity
//           updateIndicator(item, quantity);

//           // Update the user panel with the loaded data
//           updateUserPanel(itemId, name, status, quantity);
//       }
//   });

//   function updateIndicator(item, quantity) {
//       const indicator = item.querySelector('.indicator');
//       const status = item.querySelector('.stock-status');

//       if (quantity === '0') {
//           indicator.style.backgroundColor = 'orangered';
//           status.textContent = 'Out of Stock';
//       } else {
//           indicator.style.backgroundColor = 'green';
//           status.textContent = 'In Stock';
//       }
//   }

//   function updateUserPanel(itemId, name, status, quantity) {
//       const userPanelItem = document.querySelector(`.items-wrapper[data-id="${itemId}"]`);
//       if (userPanelItem) {
//           // Update existing item
//           userPanelItem.querySelector("p").textContent = name;
//           userPanelItem.querySelector("#stocking").textContent = status;
//           userPanelItem.querySelector(".no-items span").textContent = `${quantity}/${quantity}`;
//           const indicator = userPanelItem.querySelector(".indicator");
//           indicator.style.backgroundColor = (quantity === '0') ? 'orangered' : 'green';
//       }
//   }

//   // Initial update for all items
//   items.forEach((item) => {
//       const quantity = item.querySelector('.item-quantity').textContent;
//       updateIndicator(item, quantity);
//   });

//   // Add event listener for the delete button
//   const deleteButtons = document.querySelectorAll(".dropdow a[href='#'][onclick='deleteItem(event)']");
//   deleteButtons.forEach(button => {
//       button.addEventListener("click", function(event) {
//           event.preventDefault();
//           const item = event.target.closest(".ind-item");

//           // Remove item from Local Storage
//           const itemId = item.dataset.id;
//           localStorage.removeItem(`item-${itemId}`);

//           // Remove item from DOM
//           item.remove();

//           // Remove item from User Panel
//           const userPanelItem = document.querySelector(`.items-wrapper[data-id="${itemId}"]`);
//           if (userPanelItem) {
//               userPanelItem.remove();
//           }
//       });
//   });
// });

// // User Panel Script (user.html)
// document.addEventListener("DOMContentLoaded", function () {
//   const userItemsContainer = document.querySelector(".items");

//   // Function to load data from Local Storage and update user panel
//   function loadUserData() {
//       Object.keys(localStorage).forEach(key => {
//           if (key.startsWith("item-")) {
//               const itemId = key.split("item-")[1];
//               const { name, status, quantity } = JSON.parse(localStorage.getItem(key));

//               // Update existing item in user panel
//               const userPanelItem = document.querySelector(`.items-wrapper[data-id="${itemId}"]`);
//               if (userPanelItem) {
//                   userPanelItem.querySelector("p").textContent = name;
//                   userPanelItem.querySelector("#stocking").textContent = status;
//                   userPanelItem.querySelector(".no-items span").textContent = `${quantity}/${quantity}`;
//                   const indicator = userPanelItem.querySelector(".indicator");
//                   indicator.style.backgroundColor = (quantity === '0') ? 'orangered' : 'green';
//               }
//           }
//       });
//   }

//   // Load user data on page load
//   loadUserData();
// });



// document.addEventListener("DOMContentLoaded", function () {
//   // Function to generate a unique ID
//   function generateUniqueId() {
//     return "id-" + Math.random().toString(36).substr(2, 9);
//   }

//   // Add unique data-id to each .ind-item
//   const items = document.querySelectorAll(".ind-item");
//   items.forEach((item) => {
//     if (!item.hasAttribute("data-id")) {
//       item.setAttribute("data-id", generateUniqueId());
//     }
//   });

//   // Add event listeners for "more" buttons
//   const moreButtons = document.querySelectorAll(".more");
//   moreButtons.forEach((button) => {
//     button.addEventListener("click", function (event) {
//       event.stopPropagation();
//       closeAllDropdowns();
//       const dropdown = this.parentNode.querySelector(".dropdow");
//       dropdown.style.display = "block";
//     });
//   });

//   // Close dropdowns when clicking outside
//   document.addEventListener("click", function (event) {
//     if (!event.target.matches(".more")) {
//       closeAllDropdowns();
//     }
//   });

//   function closeAllDropdowns() {
//     const dropdowns = document.querySelectorAll(".dropdow");
//     dropdowns.forEach((dropdown) => {
//       dropdown.style.display = "none";
//     });
//   }
//   closeAllForms()
//   window.editItem = function (event) {
//     event.preventDefault();
//     closeAllForms();
//     const item = event.target.closest(".ind-item");
//     const name = item.querySelector(".item-name").textContent;
//     const status = item.querySelector(".stock-status").textContent;
//     const quantity = item.querySelector(".item-quantity").textContent;
//     const form = item.querySelector(".edit-form");

//     // Populate form fields with the current values
//     form.querySelector(".edit-name").value = name;
//     form.querySelector(".edit-status").value = status;
//     form.querySelector(".edit-quantity").value = quantity;

//     // Show the form
//     form.style.display = "block";
//   };

//   window.saveEdit = function (event) {
//     const item = event.target.closest(".ind-item");
//     const name = item.querySelector(".edit-name").value;
//     const status = item.querySelector(".edit-status").value;
//     const quantity = item.querySelector(".edit-quantity").value;

//     item.querySelector(".item-name").textContent = name;
//     item.querySelector(".stock-status").textContent = status;
//     item.querySelector(".item-quantity").textContent = quantity;

//     // Save the updated data to Local Storage
//     const itemId = item.dataset.id;
//     const updatedData = { name, status, quantity };
//     localStorage.setItem(`item-${itemId}`, JSON.stringify(updatedData));

//     closeAllForms();

//     // Update the indicator color and status based on quantity
//     updateIndicator(item, quantity);

//     // Update the user panel with the new data
//     updateUserPanel(itemId, name, status, quantity);
//   };

//   window.cancelEdit = function (event) {
//     closeAllForms();
//   };

//   function closeAllForms() {
//     const forms = document.querySelectorAll(".edit-form");
//     forms.forEach((form) => {
//       form.style.display = "none";
//     });
//   }

//   // Load data from Local Storage
//   items.forEach((item) => {
//     const itemId = item.dataset.id;
//     const savedData = localStorage.getItem(`item-${itemId}`);
//     if (savedData) {
//       const { name, status, quantity } = JSON.parse(savedData);
//       item.querySelector(".item-name").textContent = name;
//       item.querySelector(".stock-status").textContent = status;
//       item.querySelector(".item-quantity").textContent = quantity;

//       // Update the indicator color and status based on loaded quantity
//       updateIndicator(item, quantity);

//       // Update the user panel with the loaded data
//       updateUserPanel(itemId, name, status, quantity);
//     }
//   });

//   function updateIndicator(item, quantity) {
//     const indicator = item.querySelector(".indicator");
//     const status = item.querySelector(".stock-status");

//     if (quantity === "0") {
//       indicator.style.backgroundColor = "orangered";
//       status.textContent = "Out of Stock";
//     } else {
//       indicator.style.backgroundColor = "green";
//       status.textContent = "In Stock";
//     }
//   }

//   function updateUserPanel(itemId, name, status, quantity) {
//     // This function updates the user panel
//     // You can skip this part as the user panel is in a separate HTML file
//   }

//   // Add event listener for the delete button
//   window.deleteItem = function (event) {
//     event.preventDefault();
//     const item = event.target.closest(".ind-item");

//     // Remove item from Local Storage
//     const itemId = item.dataset.id;
//     localStorage.removeItem(`item-${itemId}`);

//     // Remove item from DOM
//     item.remove();

//     // Remove item from User Panel
//     const userPanelItem = document.querySelector(
//       `.items-wrapper[data-id="${itemId}"]`
//     );
//     if (userPanelItem) {
//       userPanelItem.remove();
//     }
//   };
// });


document.addEventListener("DOMContentLoaded", function () {
  // Function to generate a unique ID
  function generateUniqueId() {
      return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  // Add unique data-id to each .ind-item
  const items = document.querySelectorAll(".ind-item");
  items.forEach((item) => {
      if (!item.hasAttribute('data-id')) {
          item.setAttribute('data-id', generateUniqueId());
      }
      console.log(`Admin Panel Item ID: ${item.dataset.id}`); // Log the item IDs
  });

  // Add event listeners for "more" buttons
  const moreButtons = document.querySelectorAll(".more");
  moreButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
          event.stopPropagation();
          closeAllDropdowns();
          const dropdown = this.parentNode.querySelector(".dropdow");
          dropdown.style.display = "block";
      });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
      if (!event.target.matches(".more")) {
          closeAllDropdowns();
      }
  });

  function closeAllDropdowns() {
      const dropdowns = document.querySelectorAll(".dropdow");
      dropdowns.forEach((dropdown) => {
          dropdown.style.display = "none";
      });
  }
  closeAllForms();
  window.editItem = function(event) {
      event.preventDefault();
      closeAllForms();
      const item = event.target.closest(".ind-item");
      const name = item.querySelector(".item-name").textContent;
      const status = item.querySelector(".stock-status").textContent;
      const quantity = item.querySelector(".item-quantity").textContent;
      const form = item.querySelector(".edit-form");

      // Populate form fields with the current values
      form.querySelector(".edit-name").value = name;
      form.querySelector(".edit-status").value = status;
      form.querySelector(".edit-quantity").value = quantity;

      // Show the form
      form.style.display = "block";
  }

  window.saveEdit = function(event) {
      const item = event.target.closest(".ind-item");
      const name = item.querySelector(".edit-name").value;
      const status = item.querySelector(".edit-status").value;
      const quantity = item.querySelector(".edit-quantity").value;

      item.querySelector(".item-name").textContent = name;
      item.querySelector(".stock-status").textContent = status;
      item.querySelector(".item-quantity").textContent = quantity;

      // Save the updated data to Local Storage
      const itemId = item.dataset.id;
      const updatedData = { name, status, quantity };
      localStorage.setItem(`item-${itemId}`, JSON.stringify(updatedData));

      console.log(`Saved to Local Storage: ${itemId}`, updatedData); // Log the saved data

      closeAllForms();

      // Update the indicator color and status based on quantity
      updateIndicator(item, quantity);

      // Update the user panel with the new data
      updateUserPanel(itemId, name, status, quantity);
  }

  window.cancelEdit = function(event) {
      closeAllForms();
  }

  function closeAllForms() {
      const forms = document.querySelectorAll(".edit-form");
      forms.forEach((form) => {
          form.style.display = "none";
      });
  }

  // Load data from Local Storage
  items.forEach((item) => {
      const itemId = item.dataset.id;
      const savedData = localStorage.getItem(`item-${itemId}`);
      if (savedData) {
          const { name, status, quantity } = JSON.parse(savedData);
          item.querySelector(".item-name").textContent = name;
          item.querySelector(".stock-status").textContent = status;
          item.querySelector(".item-quantity").textContent = quantity;

          // Update the indicator color and status based on loaded quantity
          updateIndicator(item, quantity);

          // Update the user panel with the loaded data
          updateUserPanel(itemId, name, status, quantity);
      }
  });

  function updateIndicator(item, quantity) {
      const indicator = item.querySelector('.indicator');
      const status = item.querySelector('.stock-status');
      
      if (quantity === '0') {
          indicator.style.backgroundColor = 'orangered';
          status.textContent = 'Out of Stock';
      } else {
          indicator.style.backgroundColor = 'green';
          status.textContent = 'In Stock';
      }
  }

  function updateUserPanel(itemId, name, status, quantity) {
      // This function updates the user panel
      // Log the user panel update
      console.log(`Admin Panel updating User Panel: ${itemId}`, { name, status, quantity });
  }

  // Add event listener for the delete button
  window.deleteItem = function(event) {
      event.preventDefault();
      const item = event.target.closest(".ind-item");

      // Remove item from Local Storage
      const itemId = item.dataset.id;
      localStorage.removeItem(`item-${itemId}`);

      // Remove item from DOM
      item.remove();

      // Log item deletion
      console.log(`Deleted from Local Storage and DOM: ${itemId}`);

      // Remove item from User Panel
      const userPanelItem = document.querySelector(`.items-wrapper[data-id="${itemId}"]`);
      if (userPanelItem) {
          userPanelItem.remove();
      }
  }
});

