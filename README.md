# IF Email Signature Generator

A simple web tool for creating consistent email signatures for Indigenous Futures (IF). Hosted on GitHub Pages — quick and easy to use, with stable image links.

**Live tool:** https://roryharnden.github.io/if-email-sig/

## Why is it on GitHub Pages?

Gmail and other email clients cache signature images on their CDN. They need to fetch images from a permanent, reliable URL. GitHub Pages provides:

- **Permanent URLs** that won't change or break
- **Free, reliable hosting** with no maintenance required

If this page moves or URLs change, everyone will need to regenerate their signatures.

## Creating Your Signature

1. Visit the [signature generator](https://roryharnden.github.io/if-email-sig/)
2. Fill in your details (name, job title, email, phone, te reo Māori job title)
3. Click "Copy signature"
4. Paste into your email client's signature settings

Your form data is saved locally in your browser, so you can return to make updates.

## File structure

```
├── index.html      # Main page
├── style.css       # Interface styling
├── main.js         # Signature generation logic
├── images/         # Logo files (served via GitHub Pages)
├── package.json    # Dev dependencies
└── README.md       # This file
```

## Development

1. Clone the repository
2. Run `npm install`
3. Run `npm start` to serve locally
4. Make changes, then manually refresh the browser to test
5. Push to `main` branch — GitHub Pages deploys automatically

## License

All rights reserved.
