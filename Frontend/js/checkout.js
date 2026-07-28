// ================================
// SMARTBUY CHECKOUT
// ================================

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const totalEl = document.getElementById("checkout-total");
const payBtn = document.getElementById("pay-btn");

let totalAmount = 0;


// Display order summary
function displayCheckout(){

    checkoutItems.innerHTML = "";

    totalAmount = 0;


    if(cart.length === 0){

        checkoutItems.innerHTML = "<p>Your cart is empty</p>";

        subtotalEl.textContent = "₦0";
        totalEl.textContent = "₦0";

        return;
    }


    cart.forEach(function(product){

        let price = Number(
            product.price.replace("₦","").replace(/,/g,"")
        );


        totalAmount += price * product.quantity;


        checkoutItems.innerHTML += `

        <div class="checkout-item">

            <strong>${product.name}</strong>

            <p>
            Quantity: ${product.quantity}
            </p>

            <p>
            Price: ${product.price}
            </p>

        </div>

        `;

    });


    subtotalEl.textContent =
    "₦" + totalAmount.toLocaleString();


    totalEl.textContent =
    "₦" + totalAmount.toLocaleString();

}


displayCheckout();


// Payment button

if(payBtn){

payBtn.addEventListener("click", function(){

    const email = document.getElementById("email").value;

    if(!email){

        alert("Please enter your email");

        return;

    }


    if(typeof PaystackPop === "undefined"){

        alert("Paystack is not loaded");

        return;

    }


    let handler = PaystackPop.setup({

        key: "YOUR_PUBLIC_KEY_HERE",

        email: email,

        amount: totalAmount * 100,

        currency: "NGN",


        callback: function(response){

            alert(
                "Payment successful: " 
                + response.reference
            );

            localStorage.removeItem("cart");

            window.location.href="success.html";

        },


        onClose:function(){

            alert("Payment cancelled");

        }

    });


    handler.openIframe();

});

}
if(payBtn){

    payBtn.addEventListener("click", function(){

        alert("Payment button clicked");

    });

}