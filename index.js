import { menuItemsArr } from "./menuobj.js";

const menuItems = document.getElementById("menu-items");

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
}

document.getElementById("menu-items").innerHTML = getMenuItemsHtml();

menuItems.addEventListener("click", (e) => {
  // Identify the clicked button
  const targetElement = e.target.closest("[id]");

  if (targetElement) {
    // showOrderModal();
    addClassToModalContainer();

    const menuItem = targetElement.closest(".menu-item");

    if (menuItem) {
      showOrderModal();
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
      computeTotalPrice();
    } else {
      const itemsList = document.getElementById("items");
      if (!itemsList || itemsList.children.length === 0) {
        const modalContainer = document.getElementById("show-order");
        if (modalContainer) {
          modalContainer.classList.remove("active");
        }
      }
    }
    adjustFooterHeight();
  } else {
    if (!itemsList || itemsList.children.length === 0) {
      const modalContainer = document.getElementById("show-order");
      if (modalContainer) {
        modalContainer.classList.remove("active");
      }
    }
  }
});

function addClassToModalContainer() {
  const modalContainer = document.getElementById("show-order");

  if (!modalContainer.classList.contains("active")) {
    modalContainer.innerHTML = showOrderModal();
    modalContainer.classList.add("active");
  }
}

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

  const completeOrderBtn = document.getElementById("complete-order");

  if (completeOrderBtn) {
    completeOrderBtn.addEventListener("click", showPaymentDetailsModal);
  }

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

function computeTotalPrice() {
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

function adjustFooterHeight() {
  const footer = document.getElementById("footer");
  footer.style.height = "25vh";
}

function showPaymentDetailsModal() {
  const paymentDetailsModal = document.getElementById("payment-details");

  paymentDetailsModal.innerHTML = `
    <i class="fa-solid fa-times close-modal" id="close-modal"></i>
    <h3 class="payemnt-heading-text">Enter Card Details</h3>
      <form id="payment-form" class="payment-form">
        <label for="name"></label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          required
        />
        <label for="card-number"></label>
        <input
          type="text"
          id="card-number"
          name="number"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          maxlength="19"
          placeholder="xxxx xxxx xxxx xxxx"
          required
        />
        <label for="cvv"></label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          inputmode="numeric"
          pattern="[0-9]{3,4}"
          maxlength="4"
          placeholder="Enter CVV"
          required
        />
        <button type="submit" id="submit-payment" class="submit-btn">
          Pay
        </button>
      </form>
  `;

  paymentDetailsModal.classList.add("active");

  const closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", closePaymentDetailsModal);

  const paymentForm = document.getElementById("payment-form");
  paymentForm.addEventListener("submit", paymentSubmitted);
}

function closePaymentDetailsModal() {
  const paymentDetailsModal = document.getElementById("payment-details");
  paymentDetailsModal.classList.remove("active");
}

function paymentSubmitted(e) {
  e.preventDefault();
  const nameValue = document.getElementById("name").value;

  const endText = `
    <p class="thank-you-txt">Thanks ${nameValue}, your order is on its way!</p>`;

  const endTextModal = document.getElementById("end-text-modal");

  const paymentDetailsModal = document.getElementById("payment-details");
  paymentDetailsModal.classList.remove("active");

  if (!endTextModal.classList.contains("active")) {
    endTextModal.classList.add("active");
    endTextModal.innerHTML = endText;

    const showOrder = document.getElementById("show-order");
    showOrder.classList.remove("active");

    setTimeout(() => {
      endTextModal.classList.remove("active");
    }, 5000);
  }
}
