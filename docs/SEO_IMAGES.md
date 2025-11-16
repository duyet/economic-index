# SEO and Social Sharing Images

## Current Implementation

### Open Graph Image

The project includes a basic SVG-based Open Graph image at `/public/og-image.svg`. This serves as a template and reference design.

**Specifications:**
- Size: 1200x630px (recommended OG image size)
- Format: SVG (source), PNG (production)
- Design: Matches project design system with teal colors (#117763, #B3E8E0, #E6F7F5)
- Content: Title, subtitle, and key statistics (173 countries, 974 jobs, 1M+ conversations)

### Converting SVG to PNG

To convert the SVG to a production-ready PNG, you can use one of these methods:

#### Method 1: Using ImageMagick

```bash
# Install ImageMagick if not already installed
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Convert SVG to PNG
convert -background none -size 1200x630 public/og-image.svg public/og-image.png
```

#### Method 2: Using Inkscape

```bash
# Install Inkscape if not already installed
# Ubuntu/Debian: sudo apt-get install inkscape
# macOS: brew install inkscape

# Convert SVG to PNG
inkscape --export-type=png --export-filename=public/og-image.png --export-width=1200 --export-height=630 public/og-image.svg
```

#### Method 3: Using Node.js (sharp + svg2img)

```bash
npm install sharp svg2img --save-dev
```

Create a script `scripts/convert-og-image.js`:

```javascript
const fs = require('fs');
const svg2img = require('svg2img');
const sharp = require('sharp');

const svgBuffer = fs.readFileSync('public/og-image.svg');

svg2img(svgBuffer, { width: 1200, height: 630 }, (error, buffer) => {
  if (error) {
    console.error(error);
    return;
  }

  sharp(buffer)
    .png()
    .toFile('public/og-image.png')
    .then(() => console.log('OG image created successfully!'))
    .catch(err => console.error('Error creating PNG:', err));
});
```

Run with: `node scripts/convert-og-image.js`

#### Method 4: Online Converter

1. Open the SVG file in your browser
2. Take a screenshot at 1200x630px
3. Or use an online tool like:
   - CloudConvert (https://cloudconvert.com/svg-to-png)
   - SVG to PNG Converter (https://svgtopng.com/)

## Dynamic OG Images (Future Enhancement)

For page-specific Open Graph images (e.g., different images for each country), consider:

### Option 1: Next.js OG Image Generation

Use `@vercel/og` to generate dynamic images:

```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'Global';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#F9FAFB',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>{country} AI Adoption</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Note:** This requires a server-side runtime, which conflicts with Cloudflare Pages static export. Would need to:
1. Deploy the API route to a separate serverless function
2. Pre-generate images at build time for key countries
3. Use Cloudflare Workers/Pages Functions

### Option 2: Pre-generated Images

Generate country-specific images at build time:

```typescript
// scripts/generate-og-images.ts
import fs from 'fs';
import { loadCountries } from '@/lib/data/loaders';

async function generateOGImages() {
  const countries = await loadCountries();

  // Generate for top 50 countries
  const topCountries = countries
    .sort((a, b) => (b.metrics.usage_count || 0) - (a.metrics.usage_count || 0))
    .slice(0, 50);

  for (const country of topCountries) {
    // Generate SVG with country-specific data
    const svg = generateCountrySVG(country);

    // Save SVG
    fs.writeFileSync(
      `public/og/${country.geo_id.toLowerCase()}.svg`,
      svg
    );

    // Convert to PNG (using one of the methods above)
    // ...
  }
}
```

Then update metadata:

```typescript
export async function generateMetadata({ params }) {
  const { code } = await params;

  return {
    openGraph: {
      images: [
        {
          url: `/og/${code}.png`, // Country-specific image
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
```

### Option 3: Cloudflare Images or CDN

1. Generate images programmatically
2. Upload to Cloudflare Images or CDN
3. Reference in metadata

## Image Optimization Checklist

- [ ] Convert SVG to optimized PNG (1200x630px)
- [ ] Ensure file size < 8MB (ideally < 300KB)
- [ ] Test images with:
  - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
  - Twitter Card Validator: https://cards-dev.twitter.com/validator
  - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- [ ] Verify images work on mobile and desktop
- [ ] Add alt text for accessibility
- [ ] Consider generating country-specific images for top countries

## Current SEO Metadata

All pages now include:
- Title templates
- Descriptions
- Open Graph tags
- Twitter Card tags
- JSON-LD structured data

See the Next.js App Router metadata for each page:
- Root layout: `/app/layout.tsx`
- Home page: `/app/page.tsx`
- Countries: `/app/countries/page.tsx`
- Jobs: `/app/jobs/page.tsx`
- Compare: `/app/compare/page.tsx`
- US States: `/app/us/page.tsx`
- Country detail: `/app/country/[code]/page.tsx` (with `generateMetadata`)
