// Configuration
const CONFIG = {
    weddingDate: 'August 28, 2026',
    apiEndpoint: 'https://save-the-date-worker.chrisbroy96.workers.dev', // e.g. https://save-the-date-worker.YOUR-SUBDOMAIN.workers.dev
    turnstileSiteKey: '0x4AAAAAACeLwxreribzyIMX'
};

// Translations
const TRANSLATIONS = {
    en: {
        pageTitle: 'Save the Date - Christopher & Stephanie',
        tagline: 'Save the Date',
        dateLabel: 'Mark Your Calendar',
        weddingDate: 'August 28, 2026',
        expandPrompt: 'Tap for more details',
        formTitle: 'Stay Updated',
        formIntro: "Enter your details to receive the full invitation when it's ready",
        nameLabel: 'Name',
        namePlaceholder: 'Your full name',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        submitBtn: 'Notify Me',
        submitting: 'Submitting...',
        successMessage: "Thank you! We'll send you the invitation when it's ready.",
        turnstileError: 'Please complete the security check.',
        genericError: 'Oops! Something went wrong. Please try again later.'
    },
    es: {
        pageTitle: 'Reserva la Fecha - Christopher & Stephanie',
        tagline: 'Reserva la Fecha',
        dateLabel: 'Marca tu Calendario',
        weddingDate: '28 de Agosto, 2026',
        expandPrompt: 'Toca para más detalles',
        locationDetail: 'Montreal, Quebec',
        formTitle: 'Mantente al Tanto',
        formIntro: 'Déjanos tus datos para recibir la invitación completa cuando esté lista',
        nameLabel: 'Nombre',
        namePlaceholder: 'Tu nombre completo',
        emailLabel: 'Correo electrónico',
        emailPlaceholder: 'tu@correo.com',
        submitBtn: 'Avísame',
        submitting: 'Enviando...',
        successMessage: '¡Gracias! Te enviaremos la invitación cuando esté lista.',
        turnstileError: 'Por favor completa la verificación de seguridad.',
        genericError: '¡Ups! Algo salió mal. Por favor intenta de nuevo más tarde.'
    }
};

// Detect language from URL query parameter
const LANG = new URLSearchParams(window.location.search).get('lang') === 'es' ? 'es' : 'en';
const t = TRANSLATIONS[LANG];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Apply translations
    document.documentElement.lang = LANG;
    document.title = t.pageTitle;
    document.querySelector('.tagline').textContent = t.tagline;
    document.querySelector('.date-label').textContent = t.dateLabel;
    document.getElementById('weddingDate').textContent = t.weddingDate;
    if (t.locationDetail) {
        document.querySelector('.location-detail').textContent = t.locationDetail;
    }
    document.querySelector('#expandPrompt span').textContent = t.expandPrompt;
    document.querySelector('.form-section h2').textContent = t.formTitle;
    document.querySelector('.form-intro').textContent = t.formIntro;
    document.querySelector('label[for="name"]').textContent = t.nameLabel;
    document.getElementById('name').placeholder = t.namePlaceholder;
    document.querySelector('label[for="email"]').textContent = t.emailLabel;
    document.getElementById('email').placeholder = t.emailPlaceholder;
    document.getElementById('submitBtn').textContent = t.submitBtn;

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
        showMessage(t.turnstileError, 'error');
        return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = t.submitting;

    let submitted = false;

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
            submitted = true;
            document.getElementById('name').disabled = true;
            document.getElementById('email').disabled = true;
            document.getElementById('turnstile-widget').style.display = 'none';
            submitBtn.style.display = 'none';
            showMessage(t.successMessage, 'success');
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showMessage(t.genericError, 'error');
        turnstile.reset();
    } finally {
        if (!submitted) {
            submitBtn.disabled = false;
            submitBtn.textContent = t.submitBtn;
        }
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
