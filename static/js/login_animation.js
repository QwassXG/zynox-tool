// Simple Animation Effect
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.login-card');
    
    // Add simple floating animation to the login card
    let floatY = 0;
    let floatDirection = 1;
    
    function animateCard() {
        floatY += 0.05 * floatDirection;
        
        // Reverse direction when reaching limits
        if (floatY > 5 || floatY < -5) {
            floatDirection *= -1;
        }
        
        card.style.transform = `translateY(${floatY}px)`;
        requestAnimationFrame(animateCard);
    }
    
    // Start animation
    animateCard();
    
    // Flash message auto-hide
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});
