 // Function to toggle the side menu
 function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const hamburger = document.getElementById('hamburger');
    const closeIcon = document.getElementById('closeIcon');

    // Toggle side menu visibility
    sideMenu.classList.toggle('open');

    // Toggle visibility of hamburger and close icon
    if (sideMenu.classList.contains('open')) {
        hamburger.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        hamburger.style.display = 'flex';
        closeIcon.style.display = 'none';
    }
}

// Function to add ripple effect to a given element
function addRippleEffect(element) {
    setInterval(() => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${Math.random() * 100}%`;
        ripple.style.top = `${Math.random() * 100}%`;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 4000); // Remove the ripple after animation
    }, 1000);
}

// Add ripple effect to header, footer, and side menu
const header = document.querySelector('header');
const footer = document.querySelector('footer');
addRippleEffect(header);
addRippleEffect(footer);