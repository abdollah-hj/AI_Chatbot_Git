// Authentication related functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // For demo purposes, we'll use localStorage
            // In a real app, you would make an API call to your backend
            login(email, password, rememberMe);
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showError('registerError', 'Passwords do not match');
                return;
            }
            
            // For demo purposes, we'll use localStorage
            // In a real app, you would make an API call to your backend
            register(fullName, email, password);
        });
    }
    
    // Logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Check if user is logged in
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.getElementById('authButtons');
    const userDropdown = document.getElementById('userDropdown');
    const tryChatButton = document.getElementById('tryChatButton');
    
    if (user) {
        // User is logged in
        if (authButtons) authButtons.classList.add('d-none');
        if (userDropdown) {
            userDropdown.classList.remove('d-none');
            document.getElementById('username').textContent = user.name;
        }
        
        // Update chat button text if on home page
        if (tryChatButton) {
            tryChatButton.textContent = 'Continue Chatting';
        }
    } else {
        // User is not logged in
        if (authButtons) authButtons.classList.remove('d-none');
        if (userDropdown) userDropdown.classList.add('d-none');
    }
}

// Login function
function login(email, password, rememberMe) {
    // In a real app, you would validate credentials with your backend
    // For demo purposes, we'll check if the user exists in localStorage
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            rememberMe: rememberMe
        }));
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        showError('loginError', 'Invalid email or password');
    }
}

// Register function
function register(name, email, password) {
    // In a real app, you would send this data to your backend
    // For demo purposes, we'll store in localStorage
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        showError('registerError', 'Email already in use');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In a real app, NEVER store passwords in plain text
        created: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rememberMe: true
    }));
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('d-none');
        }, 5000);
    }
} 