// Configuration
const CONFIG = {
    weddingDate: 'June 15, 2026', // Update this with your actual wedding date
    apiEndpoint: 'YOUR_API_ENDPOINT_HERE', // Will be updated when backend is ready
    turnstileSiteKey: '0x4AAAAAACeLwxreribzyIMX', // Get this from Cloudflare Turnstile
    carouselImages: [
        'https://placehold.co/1920x1080/9caf88/ffffff?text=Photo+1',
        'https://placehold.co/1920x1080/b8c9a8/ffffff?text=Photo+2',
        'https://placehold.co/1920x1080/7a8f6f/ffffff?text=Photo+3',
        'https://placehold.co/1920x1080/d4a5a5/ffffff?text=Photo+4',
        'https://placehold.co/1920x1080/9caf88/ffffff?text=Photo+5'
    ],
    carouselAutoplayInterval: 4000 // milliseconds
};

// Carousel state
let currentSlide = 0;
let carouselInterval;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set wedding date
    document.getElementById('weddingDate').textContent = CONFIG.weddingDate;

    // Initialize carousel
    initCarousel();

    // Setup form submission
    document.getElementById('saveTheDateForm').addEventListener('submit', handleFormSubmit);
});

// Initialize the image carousel
function initCarousel() {
    const slidesContainer = document.getElementById('carouselSlides');
    const dotsContainer = document.getElementById('carouselDots');

    // Create slides and dots
    CONFIG.carouselImages.forEach((imagePath, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Christopher and Stephanie - Photo ${index + 1}`;
        slide.appendChild(img);
        slidesContainer.appendChild(slide);

        // Create dot
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Setup navigation buttons
    document.getElementById('prevBtn').addEventListener('click', previousSlide);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);

    // Start autoplay
    startCarouselAutoplay();

    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopCarouselAutoplay);
    carouselContainer.addEventListener('mouseleave', startCarouselAutoplay);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Set new current slide
    currentSlide = index;

    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % CONFIG.carouselImages.length;
    goToSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = (currentSlide - 1 + CONFIG.carouselImages.length) % CONFIG.carouselImages.length;
    goToSlide(prevIndex);
}

function startCarouselAutoplay() {
    stopCarouselAutoplay();
    carouselInterval = setInterval(nextSlide, CONFIG.carouselAutoplayInterval);
}

function stopCarouselAutoplay() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

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
