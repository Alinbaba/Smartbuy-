// ================================
// SMARTBUY APP
// ================================

// Shopping Cart

let cart = JSON.parse(localStorage.getItem("cart")) || [];
// Cart Counter

const cartCounter = document.getElementById("cart-count");
// Update Cart Counter

function updateCart(){
  if (!cartCounter) return;
  let totalItems = 0;
  cart.forEach(function(item){totalItems += item.quantity;
  });
    cartCounter.textContent = totalItems;

}
// ================================
// ADD TO CART BUTTONS
// ================================

const addCartButtons = document.querySelectorAll(".add-cart-btn");
// ================================
// BUTTON CLICK EVENTS
// ================================

addCartButtons.forEach(function(button){

      button.addEventListener("click", function(){

    // Find the product card
    const productCard = button.closest(".product-card");

    // Get product details
    const productName = productCard.querySelector("h3").textContent;
    const productPrice = productCard.querySelector(".price").textContent;
    const productImage = productCard.querySelector("img").src;
    console.log(productImage);
    // Create product object
    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };

    // Check if product already exists
    const existingProduct = cart.find(function(item){
        return item.name === product.name;
    });

    if(existingProduct){
        existingProduct.quantity++;
    }else{
        cart.push(product);
    }

    // Update counter
    updateCart();
    // Show cart in console
    updateCart();
localStorage.setItem("cart", JSON.stringify(cart));
alert(
    "Product: " + product.name +
    "\nQuantity: " + (existingProduct ? existingProduct.quantity : product.quantity)
);

console.table(cart);
    
});

});
  updateCart();
// ==========================
// ACCOUNT PANEL
// ==========================
document.addEventListener("DOMContentLoaded", function(){

    const userIcon = document.getElementById("userIcon");
    const accountPanel = document.getElementById("accountPanel");
    const closePanel = document.getElementById("closePanel");

    if(userIcon){

        userIcon.addEventListener("click", function(e){

            e.preventDefault();

            accountPanel.classList.add("active");

        });

    }

    if(closePanel){

        closePanel.addEventListener("click", function(){

            accountPanel.classList.remove("active");

        });

    }

});
// ==========================
// SMART ACCOUNT PANEL
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    const loginMenu = document.getElementById("loginMenu");
    const registerMenu = document.getElementById("registerMenu");

    const profileMenu = document.getElementById("profileMenu");
    const ordersMenu = document.getElementById("ordersMenu");
    const wishlistMenu = document.getElementById("wishlistMenu");
    const addressMenu = document.getElementById("addressMenu");
    const paymentMenu = document.getElementById("paymentMenu");
    const settingsMenu = document.getElementById("settingsMenu");
    const logoutBtn = document.getElementById("logoutBtn");
    const languageMenu = document.getElementById("languageMenu");
    const currencyMenu = document.getElementById("currencyMenu");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if(currentUser){
        profileName.textContent = currentUser.fullName;
profileEmail.textContent = currentUser.email || currentUser.phone;

loginMenu.style.display = "none";
registerMenu.style.display = "none";

profileMenu.style.display = "block";
ordersMenu.style.display = "block";
wishlistMenu.style.display = "block";
addressMenu.style.display = "block";
paymentMenu.style.display = "block";
languageMenu.style.display = "block";
currencyMenu.style.display = "block";
settingsMenu.style.display = "block";
logoutBtn.style.display = "block";

    }else {
    profileName.textContent = "Guest";
profileEmail.textContent = "Please Login";

loginMenu.style.display = "block";
registerMenu.style.display = "block";

profileMenu.style.display = "none";
ordersMenu.style.display = "none";
wishlistMenu.style.display = "none";
addressMenu.style.display = "none";
paymentMenu.style.display = "none";
languageMenu.style.display = "none";
currencyMenu.style.display = "none";
settingsMenu.style.display = "none";
logoutBtn.style.display = "none";

}

    logoutBtn.addEventListener("click", function(e){

        e.preventDefault();

        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");

        alert("Logged out successfully.");

        window.location.reload();

    });

});