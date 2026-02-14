# 📖 Daily Thirukkural PWA

A beautiful Progressive Web App that delivers daily Thirukkural wisdom to your device. Built with vanilla JavaScript and works offline!

## ✨ Features

- 📅 **Daily Kural** - Automatically shows today's Kural based on the day of the year (cycles through all 1330 Kurals)
- 🎨 **Beautiful UI** - Modern gradient design with Tamil font support
- 📱 **PWA Support** - Install as an app on Android/iOS
- 💾 **Offline Support** - Works without internet after first load
- 🔖 **Bookmarks** - Save your favorite Kurals
- 📤 **Share** - Share Kurals via native share or copy to clipboard
- 🌙 **Dark Mode** - Automatic dark mode support
- 📖 **Multiple Meanings** - View interpretations from Mu.Varadarasanar, Solomon Pappayya, and M.Karunanidhi
- 🔄 **Navigation** - Browse through all 1330 Kurals

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in any modern browser.

### Option 2: Serve Locally (Recommended)
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js (npx serve)
npx serve .

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Option 3: Deploy Online
Upload all files to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any web server

## 📱 Install as App

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. Tap "Install"

### iOS (Safari)
1. Open the app in Safari
2. Tap Share button → "Add to Home Screen"
3. Tap "Add"

### Desktop (Chrome/Edge)
1. Open the app
2. Click the install icon (➕) in the address bar
3. Click "Install"

## 📁 Project Structure

```
thirukkural-pwa/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── app.js              # Application logic
├── sw.js               # Service Worker (offline support)
├── manifest.json       # PWA manifest
└── README.md           # This file
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary-color: #764ba2;    /* Change this */
  --secondary-color: #667eea;  /* And this */
}
```

### Change Daily Kural Logic
Edit in `app.js`:
```javascript
getTodaysKuralNumber() {
  // Modify this function to change how daily kurals are selected
}
```

## 📊 Data Source

All Thirukkural data is fetched from:
- [tk120404/thirukkural](https://github.com/tk120404/thirukkural) on GitHub

This includes:
- 1330 Kurals in Tamil
- English translations
- Tamil explanations from three scholars
- Transliterations
- Chapter/section metadata

## 🔧 Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Samsung Internet

## 📄 License

This PWA is open source. Feel free to modify and distribute!

The Thirukkural data is from [tk120404/thirukkural](https://github.com/tk120404/thirukkural) (Apache-2.0 license).

## 🙏 Credits

- **Thiruvalluvar** - Author of Thirukkural
- **tk120404** - For the JSON dataset
- **Mu.Varadarasanar** - Tamil explanations
- **Solomon Pappayya** - Tamil explanations  
- **M.Karunanidhi** - Tamil explanations

---

**அறம் செய விரும்பு** - "Desire to do good deeds"
