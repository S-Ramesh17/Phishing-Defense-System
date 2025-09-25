# AntiPhishingSuite

PhishShield (Chrome extension) + PhishGuard (GitHub Pages portal) — educational anti-phishing suite demo.

## Structure
- `extension/` — PhishShield Chrome extension (Manifest V3)
- `portal/` — PhishGuard training portal (deploy this folder to GitHub Pages)

## Setup

### Portal (GitHub Pages)
1. Create a GitHub repository named `USERNAME.github.io` (replace `USERNAME` with your GitHub username).
2. Copy the `portal/` folder into the repository root and push.
3. GitHub Pages will serve `https://USERNAME.github.io/PhishGuard/index.html` (or `https://USERNAME.github.io/` depending on configuration).

### Extension (Local install)
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `extension/` folder inside this project.
4. The extension will be available in the toolbar.

## Notes & Integration
- The extension popup opens links pointing to `https://USERNAME.github.io/PhishGuard/...`. Replace `USERNAME` in `extension/popup/popup.js` with your GitHub username before loading the extension for full integration.
- The extension stores reports in `chrome.storage.sync` under the key `phishshield_reports`. Use the popup to export the JSON and paste into `portal/report.html` to view/export PDF.
- This project uses simple heuristics for detection for demo purposes. For production, use server-side proxies and required API keys for Google Safe Browsing & PhishTank under their free tiers. Don't embed sensitive API keys into extension/client code.

## Files of interest
- `extension/manifest.json`
- `extension/scripts/background.js`
- `extension/scripts/content/dom-scanner.js`
- `portal/report.html` + `portal/js/pdf-generator.js`

## Licenses
Open-source libs used (client-side):
- jsPDF (MIT) — included via CDN in `report.html` instructions.

## Disclaimer
This project is an educational demo. It is not a substitute for a professional security product. Use with caution and never enter real credentials in training pages.

