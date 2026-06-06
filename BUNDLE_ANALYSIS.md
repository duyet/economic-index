# Bundle Analysis Report

**Generated:** 2025-11-16
**Next.js Version:** 15.5.6
**Build Type:** Static Export (Cloudflare Pages)
**Analyzer Version:** @next/bundle-analyzer 16.0.3

## Executive Summary

Total output directory size: **11 MB**
Total JavaScript bundle size: **~1.1 MB** (uncompressed)
Largest single chunk: **363 KB** (Recharts/D3 visualization library)
Static data files: **~8.8 MB** (countries.json, states.json, api.json, global.json)

**Performance Status:** ⚠️ Above target but acceptable
- Target: <200KB initial JS load
- Current: ~300-400KB initial load (depending on route)
- Data files loaded on-demand via SWR

---

## Bundle Breakdown

### JavaScript Chunks (Top 10)

| File | Size | Gzip (est.) | Contents |
|------|------|-------------|----------|
| `930.92d48e8fff08ff44.js` | 363 KB | ~101 KB | Recharts + D3 (visualization library) |
| `4bd1b696-409494caf8c83275.js` | 169 KB | ~45 KB | React vendor bundle |
| `255-bf407b21685f2318.js` | 169 KB | ~45 KB | Additional vendor code |
| `framework-1ce91eb6f9ecda85.js` | 137 KB | ~35 KB | Next.js framework runtime |
| `main-7bf541634d7ed8a6.js` | 123 KB | ~30 KB | Main application code |
| `polyfills-42372ed130431b0a.js` | 110 KB | ~28 KB | Browser polyfills |
| `313-b22f17ca9d471af8.js` | 29 KB | ~8 KB | Shared utilities |
| `760-5db2e77bbdfd00f4.js` | 25 KB | ~7 KB | Additional shared code |
| `26-a2103e6382a4395a.js` | 11 KB | ~3 KB | Minor utilities |
| `145-d76ba4cdb36a3793.js` | 11 KB | ~3 KB | Minor utilities |

**Estimated Total (Gzipped):** ~305 KB

### Page-Specific Bundles

| Route | Bundle Size | Description |
|-------|-------------|-------------|
| `/jobs` | 11 KB | Jobs explorer page |
| `/compare` | 7.6 KB | Country comparison page |
| `/countries` | 7.1 KB | Countries list page |
| `/us` | 6.1 KB | US states page |
| `/` (home) | ~5 KB | Landing page |

### Static Data Files

| File | Size | Type | Usage |
|------|------|------|-------|
| `countries.json` | 6.0 MB | Geography data | Loaded on-demand per country |
| `states.json` | 2.0 MB | US state data | Loaded on-demand for US view |
| `global.json` | 772 KB | Global aggregates | Loaded for global views |
| `api.json` | 591 KB | API usage data | Loaded for API metrics |
| `metadata.json` | 512 B | Build metadata | Loaded once at startup |

**Total Data:** ~8.8 MB (loaded progressively, not on initial page load)

---

## Largest Dependencies

Analysis of the main visualization chunk (`930.js`) reveals:

### Major Libraries (Parsed Size)

| Package | Parsed Size | Gzip Size | Purpose |
|---------|-------------|-----------|---------|
| **lodash** (partial) | 28.9 KB | 8.9 KB | Utility functions for Recharts |
| **decimal.js-light** | 13.0 KB | 5.5 KB | Precision math for charts |
| **d3-scale** | 3.1 KB | 1.2 KB | Chart scaling (via Recharts) |
| **d3-shape** | 2.5 KB | 1.0 KB | Path generation (via Recharts) |
| **eventemitter3** | 2.7 KB | 1.0 KB | Event handling (via Recharts) |
| **prop-types** | ~2 KB | ~0.7 KB | React prop validation |

**Note:** Recharts includes substantial internal code plus these dependencies.

### Direct Dependencies (package.json)

**Production Dependencies:**
- `next` (15.5.6) - Framework
- `react` (18.3.1) + `react-dom` (18.3.1) - UI library
- `recharts` (2.15.4) - **363 KB** - Charts & visualizations
- `react-simple-maps` (3.0.0) - Geographic maps
- `d3-geo` (3.1.1) - Map projections
- `topojson-client` (3.1.0) - Map data parsing
- `lucide-react` (0.544.0) - Icon library
- `swr` (2.3.6) - Data fetching
- `date-fns` (4.1.0) - Date utilities
- `papaparse` (5.4.1) - CSV parsing (build-time only)
- `dompurify` (3.3.0) - HTML sanitization
- `react-window` (2.2.3) - Virtualization
- `tailwind-merge` (3.3.1) - CSS utilities
- `clsx` (2.1.1) - Class name utilities
- `class-variance-authority` (0.7.1) - Component variants

---

## Current Optimizations (Already Implemented)

### ✅ Code Splitting
- Automatic route-based code splitting via Next.js App Router
- Each page loads only required JavaScript
- Shared chunks automatically extracted by webpack

### ✅ Data Loading Strategy
- Static JSON files served separately from JavaScript
- SWR for client-side data fetching with caching
- Data loaded on-demand per route/country

### ✅ Build Configuration
- `swcMinify: true` - Fast JavaScript minification
- `compress: true` - Gzip compression enabled
- `optimizeCss: true` - Experimental CSS optimization
- Static export eliminates server runtime

### ✅ Minimal Client-Side JavaScript
- Server-side rendering disabled (static export)
- Lightweight React usage
- No large state management libraries
- Tailwind CSS for minimal runtime styling

### ✅ Image Optimization Config
- `unoptimized: true` configured for static export
- Images served as static assets

### ✅ Security Headers
- Configured via next.config.js
- X-Frame-Options, CSP, etc.

---

## Optimization Opportunities

### 🔴 HIGH IMPACT

#### 1. Lazy Load Recharts (~363 KB → Load on Demand)
**Problem:** Recharts is loaded on every page, even if charts aren't immediately visible.

**Solution:**
```typescript
// Use dynamic import with loading state
const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { loading: () => <ChartSkeleton />, ssr: false }
)
```

**Expected Savings:** 363 KB (100 KB gzipped) removed from initial load
**Impact:** Faster initial page load, especially on mobile

#### 2. Reduce Lodash Footprint (~29 KB → ~5 KB)
**Problem:** Recharts imports entire lodash modules instead of specific functions.

**Solution A - Replace lodash with native JavaScript:**
```javascript
// Instead of lodash usage in our code, use native methods
array.reduce(), array.map(), array.filter()
```

**Solution B - Use lodash-es for tree-shaking:**
```bash
# If lodash is directly used in our code
npm install lodash-es
# Then import specific functions
import debounce from 'lodash-es/debounce'
```

**Expected Savings:** ~20-25 KB (5-7 KB gzipped)
**Impact:** Moderate - depends on Recharts' lodash usage

#### 3. Compress Static JSON Data (8.8 MB → ~1-2 MB)
**Problem:** JSON files are large and uncompressed.

**Solutions:**
- **Enable Brotli/Gzip compression** on Cloudflare Pages (_headers file)
- **Implement JSON chunking** - Split countries.json into individual country files
- **Use MessagePack or Protocol Buffers** for binary encoding
- **Remove redundant data** from JSON files

**Current Structure:**
```
countries.json (6 MB) → 173 countries
```

**Proposed Structure:**
```
countries/
  index.json (50 KB) → Lightweight country list
  US.json (35 KB) → Full US data
  GB.json (35 KB) → Full GB data
  ...
```

**Expected Savings:** 6-7 MB reduced to on-demand ~35-50 KB per country
**Impact:** Massive improvement in initial data load

### 🟡 MEDIUM IMPACT

#### 4. Tree-Shake D3 Dependencies (~5 KB savings)
**Problem:** D3 modules might include unused functions.

**Solution:**
```javascript
// Import only what's needed
import { geoPath } from 'd3-geo/src/path'
import { geoMercator } from 'd3-geo/src/projection/mercator'
```

**Expected Savings:** ~3-5 KB (1-2 KB gzipped)

#### 5. Optimize lucide-react Icons (~10 KB savings)
**Problem:** Icon library might include unused icons.

**Solution:**
```javascript
// Use tree-shakable imports
import { ChevronDown } from 'lucide-react/dist/esm/icons/chevron-down'
```

**Expected Savings:** ~5-10 KB depending on icon usage

#### 6. Implement Virtual Scrolling for Large Lists
**Problem:** Large country/state lists load all DOM nodes.

**Solution:** Already using `react-window` - ensure it's applied consistently.

**Expected Savings:** Improved runtime performance, not bundle size

### 🟢 LOW IMPACT (Nice to Have)

#### 7. Remove Unused CSS with PurgeCSS
**Problem:** Tailwind CSS might include unused classes.

**Solution:** Already configured via Tailwind's JIT mode, but verify:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
}
```

**Expected Savings:** ~5-10 KB

#### 8. Optimize date-fns Usage
**Problem:** Importing entire date-fns library.

**Solution:**
```javascript
// Import only needed functions
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
```

**Expected Savings:** ~2-5 KB

#### 9. Consider Removing decimal.js-light
**Problem:** Used by Recharts for precision math, but might be overkill.

**Solution:** Evaluate if Recharts configuration can avoid precision requirements.

**Expected Savings:** 13 KB (5.5 KB gzipped)

---

## Recommended Action Plan

### Phase 1: Quick Wins (Week 1)
1. ✅ Add bundle analyzer (DONE)
2. ⚡ Implement Cloudflare compression headers for JSON files
3. ⚡ Lazy load Recharts components with dynamic imports
4. ⚡ Audit and tree-shake lucide-react icons

**Expected Result:** ~400 KB → ~250 KB initial JS load

### Phase 2: Data Optimization (Week 2)
1. 📦 Split countries.json into individual country files
2. 📦 Implement progressive loading with SWR
3. 📦 Add loading skeletons for better UX
4. 📦 Compress JSON with Brotli/Gzip via Cloudflare

**Expected Result:** 6 MB → ~50 KB per country on-demand load

### Phase 3: Deep Optimization (Week 3-4)
1. 🔍 Analyze lodash usage - replace with native JavaScript where possible
2. 🔍 Review all D3 imports for tree-shaking opportunities
3. 🔍 Optimize date-fns imports
4. 🔍 Consider alternative chart library (if Recharts remains too large)

**Expected Result:** Additional 20-30 KB savings

### Phase 4: Monitoring & Maintenance (Ongoing)
1. 📊 Set up bundle size monitoring in CI/CD
2. 📊 Add performance budgets (e.g., max 300 KB JS)
3. 📊 Regular bundle analysis runs
4. 📊 Lighthouse CI integration

---

## Performance Metrics

### Current Performance (Estimated)

| Metric | 3G Network | Desktop (Fast) | Target |
|--------|------------|----------------|--------|
| Initial JS Load | ~1.5-2s | ~300-400ms | <500ms |
| Time to Interactive | ~3-4s | ~800ms | <2s |
| Largest Contentful Paint | ~2.5-3s | ~600ms | <2.5s |
| First Contentful Paint | ~1.2s | ~250ms | <1.8s |

### After Optimizations (Projected)

| Metric | 3G Network | Desktop (Fast) | Target |
|--------|------------|----------------|--------|
| Initial JS Load | ~1s | ~200ms | <500ms ✅ |
| Time to Interactive | ~2s | ~500ms | <2s ✅ |
| Largest Contentful Paint | ~1.8s | ~400ms | <2.5s ✅ |
| First Contentful Paint | ~0.9s | ~180ms | <1.8s ✅ |

---

## Alternative Charting Libraries

If Recharts (363 KB) remains too large after optimization:

| Library | Size | Pros | Cons |
|---------|------|------|------|
| **Chart.js** | ~200 KB | Canvas-based, performant | Different API |
| **Victory** | ~250 KB | React-first, declarative | Still large |
| **nivo** | ~300 KB | Beautiful defaults | D3-based |
| **Plotly.js** | ~3 MB | Feature-rich | Too large |
| **uPlot** | ~45 KB | Tiny, fast | Limited features |
| **Apache ECharts** | ~500 KB | Powerful | Large bundle |

**Recommendation:** Stick with Recharts but implement lazy loading. Its bundle size is acceptable when loaded on-demand.

---

## Tools & Commands

### Run Bundle Analysis
```bash
npm run analyze
```

Opens three HTML reports:
- `.next/analyze/client.html` - Client-side bundles (most important)
- `.next/analyze/nodejs.html` - Server-side bundles (not used in static export)
- `.next/analyze/edge.html` - Edge runtime bundles (not used)

### Check Bundle Sizes
```bash
# List all chunks by size
ls -lhS .next/static/chunks/*.js

# Get total output size
du -sh out/
```

### Lighthouse CI (Future)
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

---

## Cloudflare Pages Optimization

### Recommended _headers File

Create `/public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.json
  Cache-Control: public, max-age=3600
  Content-Encoding: br

/data/*.json
  Cache-Control: public, max-age=86400
  Content-Encoding: br
```

### Recommended _redirects File

Create `/public/_redirects`:
```
# SPA fallback
/*    /index.html   200
```

---

## References

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web.dev Performance Budgets](https://web.dev/performance-budgets-101/)
- [Cloudflare Pages Optimization](https://developers.cloudflare.com/pages/platform/limits/)
- [Recharts Documentation](https://recharts.org/)
- [Bundle Size Tracking Tools](https://bundlephobia.com/)

---

## Conclusion

**Current Status:** Acceptable but above target
**Quick Win Potential:** HIGH (lazy loading Recharts can save 100 KB gzipped)
**Data Optimization Potential:** VERY HIGH (splitting JSON can save 6+ MB)
**Overall Grade:** B+ (room for improvement, but functional)

The application is well-structured with good code splitting. The main opportunities are:
1. **Lazy loading** the visualization library (HIGH impact, LOW effort)
2. **Splitting JSON data** into per-country files (VERY HIGH impact, MEDIUM effort)
3. **Cloudflare compression** headers (MEDIUM impact, LOW effort)

Implementing these three optimizations would bring the application well within performance targets.
