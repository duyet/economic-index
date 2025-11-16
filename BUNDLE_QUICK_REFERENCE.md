# Bundle Analysis Quick Reference

## Commands

### Run Bundle Analysis
```bash
npm run analyze
```
This will:
1. Process data (CSV → JSON)
2. Generate sitemap
3. Build the application with bundle analysis enabled
4. Create 3 HTML reports in `.next/analyze/`

### View Reports
```bash
# Open in browser
open .next/analyze/client.html      # macOS
xdg-open .next/analyze/client.html  # Linux
start .next/analyze/client.html     # Windows
```

### Check Bundle Sizes
```bash
# List JavaScript chunks by size
ls -lhS .next/static/chunks/*.js | head -10

# Get total output size
du -sh out/

# Check data file sizes
du -sh public/data/*.json
```

## Quick Wins (Implement First)

### 1. Lazy Load Recharts
**Files to modify:**
- Any component importing from `recharts`

**Before:**
```typescript
import { BarChart, Bar, XAxis, YAxis } from 'recharts'
```

**After:**
```typescript
import dynamic from 'next/dynamic'

const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { loading: () => <div>Loading chart...</div>, ssr: false }
)
```

**Savings:** ~100 KB gzipped

### 2. Enable Compression
**File:** `/public/_headers` (already configured ✅)

Verify these lines exist:
```
/data/*.json
  Cache-Control: public, max-age=604800, must-revalidate
```

### 3. Split countries.json
**Files to create:**
- `scripts/split-data.ts` - Script to split countries.json
- `public/data/countries/` - Directory for individual country files

**Script example:**
```typescript
// Split large countries.json into individual files
const countries = JSON.parse(fs.readFileSync('public/data/countries.json'))
countries.forEach(country => {
  fs.writeFileSync(
    `public/data/countries/${country.geo_id}.json`,
    JSON.stringify(country)
  )
})
```

**Savings:** ~5.9 MB from initial load

## Bundle Size Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial JS Load (gzipped) | <200 KB | ~305 KB | ⚠️ Above target |
| First Load JS (critical) | <150 KB | ~250 KB | ⚠️ Above target |
| Individual chunks | <100 KB | 363 KB max | ❌ Needs fix |
| Total bundle (gzipped) | <500 KB | ~305 KB | ✅ Good |
| Data per page | <100 KB | Variable | ✅ On-demand |

## Current Bundle Composition

### Largest Dependencies
1. Recharts + D3 - 363 KB (chart library)
2. React + React DOM - 169 KB (UI framework)
3. Next.js framework - 137 KB (SSG runtime)
4. Lodash (in Recharts) - 29 KB (utilities)
5. Polyfills - 110 KB (browser support)

### Data Files
1. countries.json - 6.0 MB ⚠️
2. states.json - 2.0 MB
3. global.json - 772 KB
4. api.json - 591 KB

## Monitoring

### Set Bundle Size Budget
Add to `package.json`:
```json
{
  "bundlewatch": {
    "files": [
      {
        "path": ".next/static/chunks/*.js",
        "maxSize": "200kb"
      }
    ]
  }
}
```

### CI/CD Integration
```yaml
# .github/workflows/bundle-check.yml
- name: Analyze bundle
  run: npm run analyze

- name: Check bundle size
  run: |
    SIZE=$(du -sb .next/static/chunks/*.js | awk '{total += $1} END {print total}')
    if [ $SIZE -gt 524288 ]; then
      echo "Bundle too large: $SIZE bytes"
      exit 1
    fi
```

## Resources

- 📄 Full analysis: `/home/user/economic-index/BUNDLE_ANALYSIS.md`
- 📊 Interactive reports: `.next/analyze/client.html`
- 📖 Next.js docs: https://nextjs.org/docs/advanced-features/bundle-analyzer
- 🔍 Bundle analyzer: https://www.npmjs.com/package/@next/bundle-analyzer

## Next Steps

1. ✅ Bundle analyzer configured
2. ⏭️ Implement lazy loading for Recharts
3. ⏭️ Split countries.json into individual files
4. ⏭️ Set up bundle size monitoring in CI
5. ⏭️ Add Lighthouse CI for performance tracking

Last updated: 2025-11-16
