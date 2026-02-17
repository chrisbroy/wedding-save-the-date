// Configuration
const CONFIG = {
    weddingDate: 'August 28, 2026',
    apiEndpoint: 'https://save-the-date-worker.chrisbroy96.workers.dev', // e.g. https://save-the-date-worker.YOUR-SUBDOMAIN.workers.dev
    turnstileSiteKey: '0x4AAAAAACeLwxreribzyIMX'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set wedding date
    document.getElementById('weddingDate').textContent = CONFIG.weddingDate;

    // Setup form submission
    document.getElementById('saveTheDateForm').addEventListener('submit', handleFormSubmit);

    // Setup expand/collapse on mobile
    const expandPrompt = document.getElementById('expandPrompt');
    const formSection = document.getElementById('formSection');
    expandPrompt.addEventListener('click', function() {
        expandPrompt.classList.toggle('expanded');
        formSection.classList.toggle('expanded');
    });
});

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    // Get Turnstile response token
    const turnstileResponse = turnstile.getResponse();

    // Validate Turnstile
    if (!turnstileResponse) {
        showMessage('Please complete the security check.', 'error');
        return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // Submit to backend
        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                turnstileToken: turnstileResponse,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            showMessage('Thank you! We\'ll send you the invitation when it\'s ready.', 'success');
            document.getElementById('saveTheDateForm').reset();
            turnstile.reset();
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showMessage('Oops! Something went wrong. Please try again later.', 'error');
        turnstile.reset();
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Notify Me';
    }
}

// Show message to user
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;

    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}
