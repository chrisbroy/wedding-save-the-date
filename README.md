# Save the Date - Christopher & Stephanie

A simple and elegant save-the-date website for our wedding at Le Mont Blanc, Laval, Quebec.

## Setup Instructions

### 1. Add Your Photos

The carousel currently uses placeholder images. To add your own photos:

1. Add 5 photos of you as a couple to the `images` folder
2. Name them: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`
3. Recommended size: 1200x900 pixels (4:3 aspect ratio)
4. Update `script.js` line 5-9 to replace the placeholder URLs with your local image paths:
   ```javascript
   carouselImages: [
       'images/photo1.jpg',
       'images/photo2.jpg',
       'images/photo3.jpg',
       'images/photo4.jpg',
       'images/photo5.jpg'
   ],
   ```

If you want to use different names or add more/fewer photos, edit the `carouselImages` array in `script.js`.

### 2. Update the Wedding Date

Open `script.js` and update line 3:
```javascript
weddingDate: 'June 15, 2026', // Change to your actual date
```

### 3. Set Up Cloudflare Turnstile (Free CAPTCHA)

1. Go to [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) (free account)
2. Click "Add Site"
3. Enter your domain (or use "localhost" for testing)
4. Choose "Managed" mode
5. Copy your Site Key
6. Update two places:
   - In `index.html` line 40: Replace `YOUR_SITE_KEY_HERE` with your Site Key
   - In `script.js` line 5: Replace `YOUR_SITE_KEY_HERE` with your Site Key
7. Copy your Secret Key for backend verification (you'll need this later)

Note: Turnstile is completely free with no limits and more privacy-friendly than reCAPTCHA.

### 4. Test Locally

Simply open `index.html` in your web browser to see the website.

### 5. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push these files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to your repository settings
4. Navigate to "Pages" section
5. Select "main" branch as the source
6. Your site will be available at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### 6. Connect the Backend (Later)

Once you have a backend service ready to collect email submissions:
1. Update the `apiEndpoint` in `script.js` (line 4)
2. The form will automatically POST data to that endpoint including:
   - `name`: Guest name
   - `email`: Guest email
   - `turnstileToken`: Token to verify on backend
   - `timestamp`: Submission time

Backend must verify the Turnstile token by sending a POST request to:
`https://challenges.cloudflare.com/turnstile/v0/siteverify`
with your Secret Key and the token.

## Features

- ✨ Beautiful sage green gradient design
- 📸 Large auto-rotating image carousel with overlaid date information
- 📧 Email collection form with validation
- 🔒 Cloudflare Turnstile CAPTCHA (free, privacy-friendly)
- 📱 Mobile-responsive design (16:9 on desktop, 4:3 on mobile)
- 💻 Wide layout for desktop with full-width images
- 🎨 Easy to customize colors and styling
- 🌟 Semi-transparent overlay for date information with backdrop blur

## Customization

### Change Colors

The site uses CSS custom properties (variables) defined at the top of `styles.css`:
- `--sage-green`: Primary sage green color
- `--sage-dark`: Darker sage for accents
- `--sage-light`: Light sage for gradients
- `--cream`: Cream background color
- `--dusty-rose`: Complementary dusty rose color

Edit these values in the `:root` section of `styles.css` to customize your color scheme.

### Carousel Settings

In `script.js`, you can adjust:
- `carouselAutoplayInterval`: Speed of auto-rotation (default: 4000ms)
- `carouselImages`: Array of image paths
- Recommended image size: 1920x1080 pixels (16:9 ratio) for best quality on desktop

### Overlay Customization

In `styles.css`, you can adjust the date overlay appearance:
- `.date-overlay`: Change opacity, padding, or background blur
- Current setting: 95% opaque white with 10px blur for readability

## File Structure

```
save-the-date/
├── index.html          # Main HTML structure
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── images/             # Your photos go here
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   ├── photo4.jpg
│   └── photo5.jpg
└── README.md           # This file
```
