let isAdmin = false;


function getTranslateX(element) {
    const style = window.getComputedStyle(element)
    const matrix = new DOMMatrixReadOnly(style.transform)
    return matrix.m41;
}

const box = document.getElementById("box");
const loginbox = document.getElementById("login");
const switchbox = document.getElementById("switch");


function swap(leftItem,rightItem){
    // Get current positions
    const leftRect = leftItem.getBoundingClientRect();
    const rightRect = rightItem.getBoundingClientRect();
   

    let leftNewPosition,rightNewPosition;
    if(!isAdmin){
       leftNewPosition = rightRect.width;
       rightNewPosition = leftRect.left - rightRect.left;
       isAdmin = true;
    }else{
       leftNewPosition = rightRect.left - leftRect.left;
       rightNewPosition = leftRect.width;
       isAdmin = false;
    }

    leftItem.style.transform = `translateX(${getTranslateX(leftItem)})`;
    rightItem.style.transform = `translateX(${getTranslateX(rightItem)})`;
   
      
    // Enable transitions and apply the transformations
    leftItem.style.transition = 'transform .5s cubic-bezier( 0.65, 0, 0.4, 0.6 )'; // Re-enable transition
    rightItem.style.transition = 'transform .5s cubic-bezier( 0.65, 0, 0.4, 0.6 )'; // Re-enable transition
   
    // Apply the transformations
    leftItem.style.transform = `translateX(${leftNewPosition}px)`;
    rightItem.style.transform = `translateX(${rightNewPosition}px)`;
   

    if(isAdmin){
        setTimeout(() => {
            leftItem.style.zIndex = 2;
            rightItem.style.zIndex = 1;
        }, 1000);
    }else{
        setTimeout(() => {
            leftItem.style.zIndex = 1;
            rightItem.style.zIndex = 2;
        }, 1000);
    }
       
   }


function switchLogin(){
    if(isAdmin){
        document.getElementById("login-title").innerHTML = "<p>Login For Participants</p>";
        document.getElementById("switch-title").innerHTML = "Login For Admins";
        document.getElementById("switch-title").style.rotate = "0deg";
        
        setTimeout(() => {
            loginbox.style.transition = ''; // Disable transition for initial state
            switchbox.style.transition = ''; 
            loginbox.style.order= 0;
            loginbox.style.transform = ""
            switchbox.style.transform = ""
            switchbox.style.order = 1;
        }, 1000);
    }
    else{
        document.getElementById("login-title").innerHTML = "<p>Login For Admins</p>";
        document.getElementById("switch-title").innerHTML = "Login For Participants";
        document.getElementById("switch-title").style.rotate = "180deg";

        setTimeout(() => {
            loginbox.style.transition = ''; // Disable transition for initial state
            switchbox.style.transition = ''; 
            loginbox.style.order= 1;
            loginbox.style.transform = ""
            switchbox.style.transform = ""
            switchbox.style.order = 0;
        }, 1000);
        
    }

    swap(loginbox,switchbox);
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include" // Ensure cookies are sent & received
            });

            const result = await response.json();

            if (response.ok) {
                alert("Login successful! Redirecting...");

                // Check the role and redirect accordingly
                if (result.role === "admin") {
                    window.location.href = "/adminprofile.html"; // Redirect for admins
                } else {
                    window.location.href = "/profile.html"; // Redirect for normal users
                }
            } else {
                alert(result.error || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong, please try again.");
        }
    });
});
