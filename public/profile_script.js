// Toggle the side menu when the hamburger icon is clicked
function toggleMenu() {
    const sideMenu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");
    
    sideMenu.classList.add("open");
    overlay.style.display = "block";  // Show the overlay to dim background

    // Hide the hamburger icon when side menu is opened
    document.querySelector('.hamburger').style.display = 'none';
}

// Close the side menu when the "X" button or overlay is clicked
function closeMenu() {
    const sideMenu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");

    sideMenu.classList.remove("open");
    overlay.style.display = "none";  // Hide the overlay

    // Show the hamburger icon when side menu is closed
    document.querySelector('.hamburger').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    
    async function handleFetchError(response) {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error}`);
        }
        return response.json();
    }

function fetchUserProfile() {
    fetch("/api/user/get-profile", {
        method: "GET",
        credentials: "include",
    })
    .then(response => handleFetchError(response))
    .then(data => {
        document.getElementById("user-name").textContent = data.name || "Guest";
        document.getElementById("profile-name").textContent = data.name || "No name available";
        document.getElementById("profile-college").textContent = data.college || "No college available";
        document.getElementById("profile-year").textContent = data.year || "N/A";
        document.getElementById("profile-accommodation").textContent = data.accommodation || "No info";
        document.getElementById("profile-phone").textContent = data.phone || "Not available"; // Add this

        document.getElementById("name").value = data.name || "";
        document.getElementById("college").value = data.college || "";
        document.getElementById("year").value = data.year || "";
        document.getElementById("accommodation").value = data.accommodation || "yes";
        document.getElementById("phone").value = data.phone || ""; // Add this

        if (data.qr_code_id) {
            document.getElementById("qr-code").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.qr_code_id}`;
        }
    })
    .catch(error => console.error("Error fetching profile:", error));
}


    function updateRegisteredEvents() {
        fetch("/api/user/get-events", {
            method: "GET",
            credentials: "include",
        })
        .then(response => handleFetchError(response))
        .then(events => {
            const eventsContainer = document.getElementById("registered-events");
            eventsContainer.innerHTML = events.length ? events.map(event => `
                <div class="event-card">
                    <h3>${event.eventName}</h3>
                </div>
            `).join("") : "<p>No events registered yet.</p>";
        })
        .catch(error => {
            console.error("Error fetching events:", error);
            document.getElementById("registered-events").innerHTML = "<p>Failed to load events. Please try again later.</p>";
        });
    }
    
    window.updateRegisteredEvents = updateRegisteredEvents;

    function handleProfileEdit() {
        const editBtn = document.getElementById("edit-btn");
        const saveBtn = document.getElementById("save-btn");
        const profileInfo = document.getElementById("profile-info");
        const editProfile = document.getElementById("edit-profile");

        editBtn.addEventListener("click", () => {
            profileInfo.style.display = "none";
            editProfile.style.display = "flex";
            editBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
        });

        saveBtn.addEventListener("click", async () => {
const formData = {
    name: document.getElementById("name").value.trim(),
    college: document.getElementById("college").value.trim(),
    year: document.getElementById("year").value.trim(),
    accommodation: document.getElementById("accommodation").value.trim(),
    phone: document.getElementById("phone").value.trim(), // Add this
};


            try {
                const response = await fetch("/api/user/update-profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) throw new Error("Failed to update profile");
                
        Object.entries(formData).forEach(([key, value]) => {
            const profileField = document.getElementById(`profile-${key}`);
            if (profileField) profileField.textContent = value || "N/A";
        });

                
                profileInfo.style.display = "block";
                editProfile.style.display = "none";
                saveBtn.style.display = "none";
                editBtn.style.display = "inline-block";
            } catch (error) {
                console.error("Error saving profile:", error);
                alert("There was an error saving your profile.");
            }
        });
    }

function handleLogout() {
    document.getElementById("logoutbutton").addEventListener("click", () => {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            fetch("/api/user/logout", {
                method: "GET",
                credentials: "include",
            })
            .then(response => {
                if (response.ok) {
                    document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                    window.location.href = "/login.html";
                } else {
                    console.error("Logout failed");
                }
            })
            .catch(error => console.error("Error during logout:", error));
        }
    });
}


    function setupEventNavigation() {
        document.getElementById("go-to-events-btn").addEventListener("click", () => {
            window.location.href = "events.html";
        });
    }

 

    fetchUserProfile();
    updateRegisteredEvents();
    handleProfileEdit();
    handleLogout();
    setupEventNavigation();
});
