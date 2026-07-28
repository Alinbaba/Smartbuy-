const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    const userData = {

        name: fullName,
        email: email,
        phone: phone,
        password: password

    };

    try{

        const response = await fetch(`${API_URL}/api/auth/register`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(userData)

        });

        const data = await response.json();

        if(response.ok){

            alert("Registration Successful!");

            window.location.href="login.html";

        }else{

            alert(data.message || "Registration Failed.");

        }

    }catch(error){

        console.log(error);

        alert("Cannot connect to SmartBuy server.");

    }

});