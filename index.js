import { menuItemsArr } from "./menuobj.js";

const menuItems = document.getElementById("menu-items");
const menuModal = document.createElement("div");
menuModal.classList.add("show-order-modal");

function getMenuItemsHtml() {
  const createStarRating = (rating, total = 5) => {
    const stars = Array.from({ length: total }, (_, i) =>
      i < rating
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>'
    ).join("");

    return stars;
  };

  let menuItems = menuItemsArr;

  const getMenu = menuItems
    .map((menu) => {
      return `
        <div class="menu-item">
            <div class="img-container">
                <img src="/images/${menu.image}" alt="${menu.name}" />
            </div>
            <div class="details">
                <h3>${menu.name}</h3>
                <p class="rating" data-stars="4">Rating: ${createStarRating(
                  5
                )}</p>
            <p class="price">${menu.price}</p>
            </div>
            <div class="add-item-container">
                <button class="add-to-cart-btn" id="${menu.id}">+</button>
            </div>
        </div>
        `;
    })
    .join("");
  return getMenu;
  //   console.log(getMenu);
}

document.getElementById("menu-items").innerHTML = getMenuItemsHtml();

menuItems.addEventListener("click", (e) => {
  // Identify the clicked button
  const targetElement = e.target.closest("[id]");

  if (targetElement) {
    showOrderModal();

    const modalContainer = document.getElementById("show-order");

    if (!modalContainer.classList.contains("active")) {
      modalContainer.innerHTML = showOrderModal();
      modalContainer.classList.add("active");
    }
    // else {
    //   modalContainer.classList.remove("active");
    // } //review this part

    const menuItem = targetElement.closest(".menu-item");

    if (menuItem) {
      const menuTitle = menuItem.querySelector(".details h3").textContent;
      const menuPrice = menuItem.querySelector(".details .price").textContent;

      // Get the modal elements
      const itemsList = document.getElementById("items");
      const priceList = document.getElementById("price");

      if (targetElement.innerHTML === '<i class="fa-solid fa-check"></i>') {
        // If button shows a check, remove the item from the modal and reset the button
        targetElement.innerHTML = "+";

        // Find and remove the corresponding item in the modal
        const itemToRemove = [...itemsList.children].find(
          (item) => item.textContent === menuTitle
        );
        const priceToRemove = [...priceList.children].find(
          (price) => price.textContent === `₱ ${menuPrice}`
        );

        if (itemToRemove) itemsList.removeChild(itemToRemove);
        if (priceToRemove) priceList.removeChild(priceToRemove);
      } else {
        // If button shows a plus, add the item to the modal and change the button to check
        targetElement.innerHTML = '<i class="fa-solid fa-check"></i>';

        // Add the item to the modal
        itemsList.innerHTML += `<li>${menuTitle}</li>`;
        priceList.innerHTML += `<li>₱ ${menuPrice}</li>`;
      }

      checkOrderContent();

      // Update the total price
      const getTotalPrice = () => {
        const prices = document.querySelectorAll("#price li");
        let totalPrice = 0;
        prices.forEach((price) => {
          totalPrice += parseInt(price.textContent.slice(2));
        });
        return totalPrice;
      };

      document.getElementById("total-price").innerHTML = `
        ₱ ${getTotalPrice()}
      `;
    }

    adjustFooterHeight();
  }
});

function showOrderModal() {
  const orderModal = `
    <h3>Your Order</h3>
      <div class="order-list top">
        <ul id="items"></ul>
        <ul id="price"></ul>
      </div>
      <div class="order-list">
        <ul>
          <li>Total Price</li>
        </ul>
        <ul id="total-price" class="total-price"></ul>
      </div>
      <button class="complete-order" id="complete-order">Complete Order</button>
    `;
  return orderModal;
}

function checkOrderContent() {
  const itemsList = document.getElementById("items");
  const pricesList = document.getElementById("price");
  const showOrderModal = document.getElementById("show-order");

  if (itemsList.children.length === 0 && pricesList.children.length === 0) {
    showOrderModal.classList.remove("active");
  }
}

function adjustFooterHeight() {
  const footer = document.getElementById("footer");
  footer.style.height = "25vh";
}
