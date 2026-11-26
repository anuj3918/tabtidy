# TabTidy

**Group all your Chrome tabs by site, subdomain and section — with a single click.**

TabTidy is a minimal Chrome extension that instantly brings order to a messy tab bar. Click the icon (or the popup button) and your tabs are grouped by site (`google.com`), then subdomain (`docs`, `mail`), then section (`/document`, `/spreadsheets`). Pinned tabs stay exactly where they are.

---

## Features

- **One-click sort** — click the toolbar icon or the popup button
- **Smart grouping** — all `google.com` tabs sit together; inside that, Docs are next to Docs and Sheets next to Sheets
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
3. Sorts sortable tabs by a key of `[base domain, subdomain, first path segment]`, e.g. `docs.google.com/document/d/…` → `google.com › docs › document` (`www.` is ignored)
4. Special-scheme tabs (`chrome:`, `about:`, `data:`, etc.) sort to the end
5. Moves each tab to its new index using `chrome.tabs.move`

The popup UI offers the same sort via a button, with an inline status message.

---

## Project structure

```
tabtidy/
├── manifest.json       # Extension manifest (MV3)
├── background.js       # Service worker — handles toolbar icon click
├── sortkey.js          # Shared grouping logic (used by background + popup)
├── test.js             # `node test.js` — checks the grouping order
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

## Development

```bash
node test.js          # grouping logic check, prints "ok"
```

Load the folder via **Load unpacked** (see above). After editing, hit the ↻ reload icon on the TabTidy card in `chrome://extensions`.

## Releasing to the Chrome Web Store

There is no build step — the extension is plain JS. A release is just a zip of the runtime files.

1. Bump `"version"` in `manifest.json` (must be higher than the published one)
2. Create the zip from the repo root:
   ```bash
   zip -r tabtidy-$(node -p "require('./manifest.json').version").zip manifest.json background.js sortkey.js popup.html popup.js icons
   ```
3. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) → TabTidy → **Package** → **Upload new package**, pick the zip
4. Update the store description if behaviour changed → **Submit for review**

---

## Privacy

TabTidy reads tab URLs solely to sort them. No data is collected, stored, or transmitted.
Full policy: [anuj3918.github.io/tabtidy/privacy-policy.html](https://anuj3918.github.io/tabtidy/privacy-policy.html)

---

## License

MIT
