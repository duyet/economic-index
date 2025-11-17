# Cloudflare Pages Deployment Guide

## Quick Start

This project is optimized for Cloudflare Pages deployment with static export.

### Build Configuration

**Framework preset:** Next.js (Static HTML Export)

```
Build command: npm run build
Build output directory: out
Root directory: /
Node version: 18 or later
Branch: main (or your deployment branch)
```

### Environment Variables

No environment variables required for production build. The site is fully static.

---

## Build Process

The build process runs three steps automatically:

```bash
npm run build
  ↓
1. npm run process-data     # Generate JSON from CSV
2. npm run generate-sitemap # Create sitemap.xml
3. next build              # Build Next.js static site
```

### Data Processing

CSV files in `aei_v3_download/` are processed into JSON files in `public/data/`:
- `countries.json` (172 countries, ~6 MB)
- `states.json` (51 US states, ~2 MB)
- `global.json` (global aggregate)
- `api.json` (API usage data)
- `metadata.json` (build metadata)

### Static Generation

Next.js generates 9 static pages:
- `/` - Homepage
- `/countries` - Countries listing
- `/us` - US states ranking
- `/jobs` - Jobs explorer
- `/compare` - Country comparison
- `/country/us` - Country detail (dynamic template)
- Custom 404 page

---

## Troubleshooting

### Build Errors

**Error: "Export encountered an error on /country/[code]/page"**

This can happen if:
1. Data files are missing (ensure `public/data/countries.json` exists)
2. Node version mismatch (use Node 18+)
3. Out of memory (increase Node heap size)

**Solution:**
```bash
# Verify data files exist
ls -lh public/data/

# Try with more memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# Clean build
rm -rf .next out
npm run build
```

**Error: "useTheme must be used within ThemeProvider"**

This was a previous issue, now fixed. The theme provider is properly configured for SSR/SSG.

**Solution:** Already resolved in latest commit. If you see this:
```bash
git pull origin main
npm install
npm run build
```

### Build Warnings

**Warning: "Specified headers will not automatically work with output: export"**

Expected behavior. Headers are configured via `public/_headers` file for Cloudflare Pages.

**Warning: "No build cache found"**

First-time builds won't have cache. Subsequent builds will be faster with Cloudflare's build cache.

---

## Configuration Files

### `public/_headers`

Security and caching headers for Cloudflare:
- Content-Security-Policy
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- Cache headers for static assets

### `public/_redirects`

URL redirects and 404 handling:
```
/404.html 404
```

### `public/robots.txt`

Search engine crawler configuration:
```
User-agent: *
Allow: /

Sitemap: https://economic-index.pages.dev/sitemap.xml
```

### `public/sitemap.xml`

Auto-generated sitemap with 177 URLs:
- 5 main pages
- 172 country detail pages

---

## Performance Optimization

### Bundle Sizes

```
Total Output: ~11 MB (mostly JSON data)
JavaScript: 131 KB (102 KB shared + 14-29 KB per page)
```

**Optimization opportunities:**
1. Split `countries.json` into individual files (~99% reduction)
2. Lazy load Recharts library (~60% initial JS reduction)
3. Tree-shake lodash (~20 KB reduction)

See `BUNDLE_ANALYSIS.md` for details.

### Cloudflare Settings

**Auto Minify** (enabled in Cloudflare dashboard):
- JavaScript ✓
- CSS ✓
- HTML ✓

**Brotli Compression** (automatic):
- Reduces transfer size by ~70%

**Cache Everything**:
- Static assets cached for 1 year
- HTML cached for 1 hour
- Configured in `_headers` file

---

## Deployment Steps

### 1. Connect Repository

1. Log in to Cloudflare Pages
2. Create new project
3. Connect GitHub repository
4. Select branch (`main` or deployment branch)

### 2. Configure Build

```
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Root directory: /
Node version: 18
```

### 3. Deploy

- **Automatic:** Push to connected branch
- **Manual:** Trigger deployment in Cloudflare dashboard
- **Preview:** PRs get preview deployments automatically

### 4. Verify Deployment

After successful build:
1. Check homepage loads
2. Test navigation
3. Verify dark mode toggle
4. Test mobile responsiveness
5. Check SEO meta tags (view page source)
6. Validate sitemap: `/sitemap.xml`

---

## Custom Domain

### Setup

1. In Cloudflare Pages, go to **Custom domains**
2. Add your domain
3. Cloudflare will configure DNS automatically

### SSL/TLS

- Automatic SSL certificate provisioning
- Force HTTPS enabled by default
- HSTS configured via `_headers`

---

## Monitoring

### Cloudflare Analytics

Available metrics:
- Page views
- Unique visitors
- Bandwidth usage
- Cache hit ratio
- Top pages
- Geographic distribution

### Build Logs

Access in Cloudflare Pages:
- Build duration (~40s typical)
- Deployment status
- Error logs if build fails

---

## CI/CD Integration

### GitHub Actions (Optional)

While Cloudflare handles deployment, you can add pre-deployment checks:

```yaml
# .github/workflows/test.yml
name: Test

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

---

## Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_SITE_URL` in metadata if using custom domain
- [ ] Test build locally: `npm run build`
- [ ] Verify all 9 pages generate successfully
- [ ] Check bundle sizes: `npm run analyze`
- [ ] Review security headers in `_headers`
- [ ] Test on mobile devices
- [ ] Verify accessibility (Lighthouse)
- [ ] Check SEO metadata (Twitter Card validator, Facebook debugger)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (optional)

---

## Rollback Procedure

If deployment has issues:

### Option 1: Cloudflare Dashboard
1. Go to **Deployments**
2. Find previous working deployment
3. Click **Rollback to this deployment**

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

Cloudflare will automatically deploy the reverted version.

---

## Support

### Build Failures

If build fails on Cloudflare but works locally:
1. Check Node version matches (18+)
2. Clear Cloudflare build cache
3. Check for environment-specific code (window, document)
4. Review build logs for specific error

### Performance Issues

If site loads slowly:
1. Check Cloudflare Analytics for cache hit ratio
2. Review `_headers` configuration
3. Consider implementing optimizations from `BUNDLE_ANALYSIS.md`

### Common Questions

**Q: Why is the first build slow?**
A: No build cache. Subsequent builds are faster (~40s vs initial ~2min).

**Q: Can I use ISR or SSR?**
A: No, this is a static export. All pages are pre-rendered at build time.

**Q: How do I update data?**
A: Update CSV files, commit, and push. Cloudflare will rebuild automatically.

**Q: Can I add serverless functions?**
A: Yes, Cloudflare Pages supports Functions. See [Cloudflare Functions documentation](https://developers.cloudflare.com/pages/platform/functions/).

---

## Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Build Configuration](https://developers.cloudflare.com/pages/platform/build-configuration/)
- [Custom Headers](https://developers.cloudflare.com/pages/platform/headers/)

---

**Last Updated:** 2025-11-17
**Next.js Version:** 15.5.6
**Node Version:** 18+
**Deployment Platform:** Cloudflare Pages
