// EmailJS Configuration from config.js
// config.js is loaded before this script and sets window.EMAILJS_CONFIG
const EMAILJS_CONFIG = window.EMAILJS_CONFIG || {
    PUBLIC_KEY: "EqQi8B4TsUDRQVyf3",
    SERVICE_ID: "service_wikafgs",
    TEMPLATE_ID: "template_i7u75g3"
};

console.log("✓ EmailJS Config loaded from config.js:", EMAILJS_CONFIG);

// Function to initialize form handler
function initContactForm() {
    console.log("Form handler initializing...");
    console.log("EmailJS Config:", EMAILJS_CONFIG);
    
    // Check if EmailJS config is loaded
    if (!EMAILJS_CONFIG || !EMAILJS_CONFIG.PUBLIC_KEY || !EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID) {
        console.error("EmailJS configuration missing!");
        console.error("Config object:", EMAILJS_CONFIG);
        return;
    }

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    } else {
        console.error("EmailJS library not loaded. Make sure the script tag is included in your HTML.");
        return;
    }

    const contactForm = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formResponse = document.getElementById('form-response');

    // Check if form elements exist
    if (!contactForm || !submitBtn || !formResponse) {
        console.error("Contact form elements not found.");
        return;
    }

    // Function to handle form submission
    function handleFormSubmit(event) {
        // CRITICAL: This stops the page from refreshing/jumping to top
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        
        console.log("Form submitted, handling submission");

        // Get form elements
        const name = document.getElementById('form_name');
        const email = document.getElementById('form_email');
        const message = document.getElementById('form_message');

        // Reset previous states
        let isValid = true;
        document.querySelectorAll('.error-msg').forEach(el => el.innerText = "");
        [name, email, message].forEach(el => el.classList.remove('invalid'));

        // --- Specific Field Validation ---
        
        // Name: Only letters, min 2
        if (name.value.trim().length < 2) {
            document.getElementById('name-error').innerText = "Please enter your name.";
            name.classList.add('invalid');
            isValid = false;
        }

        // Email: Standard format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            document.getElementById('email-error').innerText = "Please enter a valid email.";
            email.classList.add('invalid');
            isValid = false;
        }

        // Message: Min 10 chars
        if (message.value.trim().length < 10) {
            document.getElementById('message-error').innerText = "Message must be at least 10 characters.";
            message.classList.add('invalid');
            isValid = false;
        }

        if (isValid) {
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            // Send email using EmailJS with environment variables
            emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, contactForm)
                .then(() => {
                    submitBtn.innerText = "Message Sent! ✅";
                    formResponse.innerText = "Thank you! I will contact you soon.";
                    formResponse.className = "form-success success";
                    
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerText = "Send Message";
                        submitBtn.disabled = false;
                        formResponse.innerText = "";
                        formResponse.className = "";
                    }, 5000);

                }, (err) => {
                    submitBtn.innerText = "Error! ❌";
                    submitBtn.disabled = false;
                    formResponse.innerText = "Something went wrong. Please try again.";
                    formResponse.className = "error";
                    console.error("EmailJS Error:", err);
                });
        } else {
            console.log("Form validation failed");
        }
    }

    // Attach handler to form submit event
    contactForm.addEventListener('submit', handleFormSubmit);
    console.log("Form submit handler attached");
    
    // Also attach to button click as backup
    submitBtn.addEventListener('click', function(event) {
        console.log("Button clicked");
        event.preventDefault();
        handleFormSubmit(event);
    });
    console.log("Button click handler attached");
    
    console.log("Form handler attached successfully!");
    console.log("Form element:", contactForm);
    console.log("Button element:", submitBtn);
}

// Try to initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    // DOM is already ready
    initContactForm();
}

