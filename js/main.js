// Add neon background to all pages
function addNeonBackground() {
    // Check if neon background already exists
    if (!document.querySelector('.neon-bg')) {
        const neonBg = document.createElement('div');
        neonBg.className = 'neon-bg';
        
        // Add neon circles
        for (let i = 0; i < 5; i++) {
            const circle = document.createElement('div');
            circle.className = 'neon-circle';
            neonBg.appendChild(circle);
        }
        
        // Add to body as the first child
        document.body.insertBefore(neonBg, document.body.firstChild);
    }
}

// Main website functionality
document.addEventListener('DOMContentLoaded', function() {
    addNeonBackground();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Handle try chat button for non-logged in users
    const tryChatButton = document.getElementById('tryChatButton');
    if (tryChatButton) {
        tryChatButton.addEventListener('click', function(e) {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user) {
                // If not logged in, store a flag to redirect after login
                localStorage.setItem('redirectToChat', 'true');
            }
        });
    }
    
    // Check for redirect flag
    const redirectToChat = localStorage.getItem('redirectToChat');
    if (redirectToChat === 'true' && JSON.parse(localStorage.getItem('user'))) {
        localStorage.removeItem('redirectToChat');
        window.location.href = 'chat.html';
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim()) {
                // In a real app, you would send this to your backend
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
}); 