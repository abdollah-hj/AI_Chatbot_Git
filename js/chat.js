// Chat functionality with embedded Dify chat
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const startChatButton = document.getElementById('startChatButton');
    const chatWelcome = document.getElementById('chatWelcome');
    const difyChat = document.getElementById('difyChat');
    const clearChatButton = document.getElementById('clearChatButton');
    const saveChatButton = document.getElementById('saveChatButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Dify API configuration
    const DIFY_API_URL = 'http://18.181.173.223:8080/chat/pN9hZGV0DTkEjxdX'; // Your Dify API URL
    const DIFY_API_KEY = 'app-dAycGgHcjh3yb8SiFDIAYsA9'; // Your Dify API key
    
    // Check if chat was previously started
    const chatStarted = localStorage.getItem('chatStarted') === 'true';
    
    // If chat was previously started, show the iframe immediately
    if (chatStarted) {
        startChat();
    }
    
    // Start chat button
    if (startChatButton) {
        startChatButton.addEventListener('click', function() {
            startChat();
        });
    }
    
    // Clear chat button
    if (clearChatButton) {
        clearChatButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                // Reset the iframe
                difyChat.src = 'about:blank';
                setTimeout(() => {
                    difyChat.src = DIFY_API_URL;
                }, 100);
                
                // Save state
                localStorage.setItem('chatStarted', 'true');
            }
        });
    }
    
    // Save chat button
    if (saveChatButton) {
        saveChatButton.addEventListener('click', function() {
            alert('Chat saved successfully!');
            // In a real implementation, you would need to use Dify's API to save the chat
            // This is just a placeholder
        });
    }
    
    // Function to start the chat
    function startChat() {
        // Show loading spinner
        loadingSpinner.classList.remove('d-none');
        
        // Hide welcome screen
        chatWelcome.classList.add('hidden');
        
        // Set iframe source to Dify chat
        difyChat.src = DIFY_API_URL;
        
        // Show iframe
        difyChat.style.display = 'block';
        
        // Save state
        localStorage.setItem('chatStarted', 'true');
        
        // Handle iframe load event
        difyChat.onload = function() {
            // Hide loading spinner
            loadingSpinner.classList.add('d-none');
            
            // Inject CSS to hide Dify branding
            try {
                const iframeDocument = difyChat.contentDocument || difyChat.contentWindow.document;
                
                // Create a style element
                const style = iframeDocument.createElement('style');
                style.textContent = `
                    /* Hide Dify branding */
                    .footer, 
                    [class*="powered-by"],
                    [class*="dify-footer"],
                    [class*="dify-brand"],
                    [class*="logo-container"],
                    [class*="brand-container"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    /* Add padding to the bottom to compensate for hidden footer */
                    .chat-container, 
                    .conversation-container,
                    .message-container {
                        padding-bottom: 20px !important;
                    }
                `;
                
                // Append the style element to the iframe document
                iframeDocument.head.appendChild(style);
            } catch (error) {
                console.error('Error injecting CSS into iframe:', error);
            }
        };
        
        // Handle iframe load error
        difyChat.onerror = function() {
            // Hide loading spinner
            loadingSpinner.classList.add('d-none');
            
            // Show error message
            alert('Failed to load the chat interface. Please try again later.');
            
            // Show welcome screen again
            chatWelcome.classList.remove('hidden');
            
            // Hide iframe
            difyChat.style.display = 'none';
            
            // Reset state
            localStorage.setItem('chatStarted', 'false');
        };
    }
    
    // Handle messages from iframe (if Dify supports postMessage)
    window.addEventListener('message', function(event) {
        // Check if the message is from Dify
        if (event.origin.includes('udify.app')) {
            // Process message
            console.log('Message from Dify:', event.data);
            
            // You can handle specific messages here
            // For example, if Dify sends a message when the chat is cleared
            if (event.data.type === 'chat_cleared') {
                console.log('Chat was cleared in Dify');
            }
        }
    });
}); 