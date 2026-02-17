# Save the Date - Christopher & Stephanie

A beautiful save-the-date website for our wedding at Le Mont Blanc, Laval, Quebec with a full-page photo background.

## Setup Instructions

### 1. Background Photo

The website uses a single photo as a full-page background. Your photo should be:
- High resolution (minimum 1920x1080 pixels recommended)
- Landscape orientation works best
- Named `_21A9712.jpg` and placed in the `images/` folder (or update line 20 of `styles.css` with your photo filename)

**Important:** The content box appears in the top-left corner, so make sure important elements of your photo (like faces) are positioned in the bottom-right area of the image.

### 2. Update the Wedding Date

The wedding date is already set to August 28, 2026. To change it, open `script.js` and update line 3:
```javascript
weddingDate: 'Your Date Here', // Change to your actual date
```

### 3. Test Locally

Simply open `index.html` in your web browser to see the website.

### 4. Deploy to GitHub Pages

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

### 5. Connect the Backend (Later)

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

- 📸 Full-page background image
- 🎨 Content box positioned in top-left with semi-transparent background
- ✨ Olive green, burgundy, and gold color scheme
- 📧 Email collection form with validation
- 🔒 Cloudflare Turnstile CAPTCHA (free, privacy-friendly)
- 📱 Mobile-responsive design
- 💻 Clean, elegant typography with Cormorant and Lato fonts
- 🌟 Backdrop blur effect on content box for better readability

## Customization

### Change Colors

The site uses CSS custom properties (variables) defined at the top of `styles.css`:
- `--olive-green`: Primary olive green color
- `--olive-dark`: Darker olive for gradients
- `--olive-light`: Light olive for accents
- `--burgundy`: Burgundy accent color
- `--gold`: Gold accent color
- `--cream`: Cream color
- `--text-dark`: Dark text color

Edit these values in the `:root` section of `styles.css` to customize your color scheme.

### Change Background Image

In `styles.css` line 20, update the background image path:
```css
background: url('images/YOUR_IMAGE.jpg') no-repeat center center;
```

### Adjust Content Box Position

By default, the content box is positioned in the top-left. To change its position, modify the `body` padding in `styles.css` around line 24.

### Content Box Transparency

To adjust the transparency of the white content box, modify line 36 in `styles.css`:
```css
background: rgba(255, 255, 255, 0.95); /* Change 0.95 to adjust opacity (0.0-1.0) */
```

## File Structure

```
save-the-date/
├── index.html          # Main HTML structure
├── styles.css          # Styling
├── script.js           # JavaScript functionality
├── images/             # Your photo goes here
│   └── _21A9712.jpg    # Background image
└── README.md           # This file
```
