# AGENTS.md - Daily Thirukkural PWA

Guidelines for AI agents working on this vanilla JavaScript PWA project.

## Project Overview

A Progressive Web App displaying daily Thirukkural verses. Built with vanilla JavaScript (ES6+), HTML5, CSS3. No build tools or frameworks. Data fetched from GitHub raw URLs.

**Files:** `index.html`, `app.js` (ThirukkuralApp class), `sw.js`, `styles.css`, `manifest.json`

## Development Commands

```bash
# Serve locally (required for Service Worker)
python -m http.server 8080
npx serve .
php -S localhost:8080

# Format/Lint (if tools installed)
npx prettier --write "**/*.{js,html,css,json}"
npx html-validate index.html
npx eslint app.js sw.js

# Run tests (if Jest added)
npm test
npm test -- app.test.js              # Single test file
npm test -- -t "should load kural"   # Single test by name
npx playwright test                  # E2E tests
```

## Code Style Guidelines

### JavaScript

**Naming:**
- Classes: `PascalCase` (e.g., `ThirukkuralApp`)
- Methods/vars: `camelCase` (e.g., `getTodaysKuralNumber`)
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_privateMethod`
- DOM IDs: `kebab-case`

**Style:**
- Use ES6+: `const`/`let`, arrow functions, template literals
- Prefer `async/await` over `.then()` chains
- Use `===` and `!==` for comparisons
- Max 30 lines per function

**Error Handling:**
```javascript
try {
  await this.loadData();
} catch (error) {
  console.error('Failed to load:', error);
  this.showError();
}

// Guard clauses
if (!this.kuralData || number < 1 || number > 1330) return;
```

**Event Listeners:**
```javascript
// Arrow functions preserve `this`
element.addEventListener('click', () => this.handleClick());

// Event delegation for dynamic elements
container.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.stopPropagation();
    this.handleDelete(e.target.dataset.number);
  }
});
```

**LocalStorage:**
```javascript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  console.warn('Storage unavailable (private mode)');
}
```

### HTML

- 4-space indentation, double quotes
- Semantic elements: `header`, `main`, `section`
- Data attributes for JS hooks: `data-tab="mv"`
- Viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### CSS

- CSS custom properties in `:root` (minimal grays, no gradients)
- Mobile-first responsive design
- Simple borders, no heavy shadows
- BEM-like naming: `.component__element--modifier`

**Property Order:**
1. Positioning (display, position, z-index)
2. Box Model (width, height, margin, padding)
3. Typography (font, text-align, color)
4. Visual (background, border, box-shadow)
5. Animation (transition)

## PWA Best Practices

**Service Worker:**
- Cache static assets on `install` event
- Cache-first for static files, network-first for APIs
- Update `CACHE_NAME` version when changing assets
- Clean old caches on `activate` event

**Manifest:**
- Required: `name`, `short_name`, `icons` (192x192, 512x512), `start_url`
- Set `theme_color` and `background_color`

**Install Prompt:**
- Listen for `beforeinstallprompt` event
- Show custom install button
- Handle `appinstalled` event

## Testing

### Manual Checklist
- [ ] App works offline after first load
- [ ] Service Worker registers (DevTools → Application)
- [ ] Bookmarks persist after refresh
- [ ] Navigation works (prev/next/today)
- [ ] Tab switching works (mv/sp/mk meanings)
- [ ] Share works on mobile
- [ ] Responsive (320px - 1920px)

### Automated Testing
```bash
npm install --save-dev jest playwright
npm test
npm test -- app.test.js
npm test -- -t "should load kural"
npx playwright test
```

## Security & Deployment

- Use `textContent` instead of `innerHTML` to prevent XSS
- Sanitize user inputs before DOM insertion
- Wrap LocalStorage in try/catch (fails in Safari private mode)
- Deploy only over HTTPS for PWA features
- Deploy to: GitHub Pages, Netlify, Vercel, Firebase

## Data Sources

- Kural data: `https://raw.githubusercontent.com/tk120404/thirukkural/master/thirukkural.json`
- Chapter details: `https://raw.githubusercontent.com/tk120404/thirukkural/master/detail.json`
