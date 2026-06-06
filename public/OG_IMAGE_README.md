# Open Graph Image Generation

## Quick Start

A template SVG exists at `og-image.svg`. To create the production PNG:

### Option 1: Online Converter (Easiest)
1. Open https://cloudconvert.com/svg-to-png
2. Upload `og-image.svg`
3. Download as PNG (1200x630px)
4. Save as `og-image.png` in this directory

### Option 2: Using ImageMagick (if installed)
```bash
convert -background white -size 1200x630 og-image.svg og-image.png
```

### Option 3: Using Figma/Design Tool
1. Import `og-image.svg` into Figma/Sketch/Adobe XD
2. Export as PNG at 1200x630px
3. Save as `og-image.png`

## Specifications
- Size: 1200x630px (recommended for Facebook, Twitter, LinkedIn)
- Format: PNG (24-bit with transparency, or JPG)
- Max file size: 8MB (ideally < 300KB for fast loading)
- Design: Matches project color scheme with teal accents

## Testing
After creating the image, test it with:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Current Status
✅ SVG template created
⏳ PNG conversion needed (manual step required)

See `/docs/SEO_IMAGES.md` for detailed documentation and advanced options.
