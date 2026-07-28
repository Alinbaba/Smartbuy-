const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if(!email && !phone){

        alert("Enter your email or phone number.");

        return;

    }

    try{

        const response = await fetch(`${API_URL}/api/auth/login`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                phone,
                password

            })

        });

        const data = await response.json();

        if(response.ok){

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));
            
            console.log("User saved:", data.user);
            console.log(localStorage.getItem("user"));

            alert("Login Successful!");
            window.location.href="index.html";

        }else{

            alert(data.message);

        }

    }catch(error){

        console.log(error);

        alert("Unable to connect to SmartBuy Server.");

    }

});