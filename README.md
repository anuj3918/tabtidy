# TabTidy

**Sort all your Chrome tabs alphabetically by domain — with a single click.**

TabTidy is a minimal Chrome extension that instantly brings order to a messy tab bar. Click the icon (or the popup button) and your tabs are sorted A→Z by hostname. Pinned tabs stay exactly where they are.

---

## Features

- **One-click sort** — click the toolbar icon or the popup button
- **Sorts by domain** — groups tabs from the same site together
- **Respects pinned tabs** — pinned tabs are never moved
- **Badge feedback** — a brief ✓ or ! badge confirms success or failure
- **No data collected** — reads tab URLs in-memory only, never stores or transmits anything

---

## Installation

### From the Chrome Web Store *(recommended)*
Coming soon — submission in review.

### Manual (Developer Mode)
1. Clone or download this repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `tabtidy/` folder
5. The TabTidy icon appears in your toolbar

---

## How it works

Clicking the icon triggers the background service worker, which:

1. Queries all tabs in the current window
2. Separates pinned tabs (untouched) from sortable tabs
3. Sorts sortable tabs alphabetically by `hostname` (case-insensitive)
4. Special-scheme tabs (`chrome:`, `about:`, `data:`, etc.) sort to the end
5. Moves each tab to its new index using `chrome.tabs.move`

The popup UI offers the same sort via a button, with an inline status message.

---

## Project structure

```
tabtidy/
├── manifest.json       # Extension manifest (MV3)
├── background.js       # Service worker — handles toolbar icon click
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── docs/
    └── privacy-policy.html
```

---

## Privacy

TabTidy reads tab URLs solely to sort them. No data is collected, stored, or transmitted.
Full policy: [anuj3918.github.io/tabtidy/privacy-policy.html](https://anuj3918.github.io/tabtidy/privacy-policy.html)

---

## License

MIT
