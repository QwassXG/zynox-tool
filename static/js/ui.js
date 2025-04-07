/**
 * UI Control Functions
 * Handles interactions and UI effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // Main navigation buttons
    const tokenBtn = document.getElementById('token-btn');
    const comboBtn = document.getElementById('combo-btn');
    const promoBtn = document.getElementById('promo-btn');
    
    // Card sections
    const tokenCheckerSection = document.getElementById('token-checker');
    const comboFormatterSection = document.getElementById('combo-formatter'); 
    const promoCheckerSection = document.getElementById('promo-checker');
    
    // Add active class to token checker by default
    tokenCheckerSection.classList.add('active');
    
    // Make showSection global to be accessible from HTML onclick
    window.showSection = function(sectionId) {
        // Remove active class from all sections
        tokenCheckerSection.classList.remove('active');
        comboFormatterSection.classList.remove('active');
        promoCheckerSection.classList.remove('active');
        
        // Add active class to selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Scroll to section
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
    
    // Add button click handlers
    tokenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('token-checker');
    });
    
    comboBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('combo-formatter');
    });
    
    promoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('promo-checker');
    });
});

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification if there is one
    const existingNotification = document.querySelector('.notification.show');
    if (existingNotification) {
        existingNotification.classList.remove('show');
        setTimeout(() => {
            existingNotification.remove();
        }, 300);
    }
    
    // Create notification element
    const notification = document.getElementById('notification');
    notification.className = `notification ${type}`;
    
    // Add icon based on type
    let icon = 'check-circle';
    if (type === 'error') {
        icon = 'exclamation-circle';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span id="notification-message">${message}</span>
    `;
    
    // Trigger show animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after timeout
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
