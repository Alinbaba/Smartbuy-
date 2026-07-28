// ================================
// SMARTBUY CART PAGE
// ================================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get HTML elements
const cartItems = document.getElementById("cart-items");
const cartTotal = document.querySelector("#cart-total");
const grandTotal = document.querySelector("#grand-total");

console.log("cartTotal =", cartTotal);
console.log("grandTotal =", grandTotal);
console.log(cartTotal);
console.log(grandTotal);
const clearCartBtn = document.getElementById("clear-cart-btn");


// Show cart when page loads
displayCart();

function displayCart() {

    // Make sure the HTML elements exist
    if (!cartItems) {
    console.error("cartItems NOT FOUND");
    return;
}

if (!cartTotal) {
    console.error("cartTotal NOT FOUND");
    return;
}

    // Clear previous content
    cartItems.innerHTML = "";

    // Empty cart
    if (cart.length === 0) {

    cartItems.innerHTML = "<h2>Your cart is empty.</h2>";

    cartTotal.textContent = "₦0";
    grandTotal.textContent = "₦0";

    return;
}

    let total = 0;

    cart.forEach(function(product, index) {

        total += getPrice(product.price) * product.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${product.image}" width="100">

                <h3>${product.name}</h3>

                <p>${product.price}</p>

                <p>Quantity: ${product.quantity}</p>

                <div class="cart-controls">

    <button onclick="decreaseQuantity(${index})">−</button>

    <span>${product.quantity}</span>

    <button onclick="increaseQuantity(${index})">+</button>

    <button onclick="removeItem(${index})">
        Remove
    </button>

</div>

                <hr>
            </div>
        `;
    });

    cartTotal.textContent = "₦" + total.toLocaleString();
grandTotal.textContent = "₦" + total.toLocaleString();

}

// Convert price text to number
function getPrice(price) {

    return Number(
        price.replace("₦", "")
             .replace(/,/g, "")
    );

}

// Remove item
function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

}

// Increase quantity
function increaseQuantity(index) {

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

}

// Decrease quantity
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

}
// Empty Cart
clearCartBtn.addEventListener("click", function () {

    const confirmClear = confirm("Are you sure you want to empty your cart.if Yes Clik Ok and if No Cancel?");

    if (confirmClear) {

        cart = [];

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();

    }

});
// ================================
// CHECKOUT BUTTON
// ================================

const checkoutBtn = document.getElementById("checkout-btn");

checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    window.location.href = "checkout.html";

});