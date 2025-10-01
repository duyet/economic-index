# Deployment Guide

## Cloudflare Pages Deployment

This project is optimized for deployment to Cloudflare Pages with full static export.

### Prerequisites

- GitHub account with repository access
- Cloudflare account (free tier works)
- Node.js 18+ locally for testing

### Quick Deploy

**Option 1: Cloudflare Dashboard (Recommended)**

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect to your GitHub account
4. Select repository: `duyet/economic-index`
5. Configure build settings:
   ```
   Build command:    npm run build
   Build output:     out
   Root directory:   /
   ```
6. Advanced settings:
   ```
   Framework preset: Next.js (Static Export)
   Node version:     18
   ```
7. Click "Save and Deploy"

**Option 2: Wrangler CLI**

```bash
# Install Wrangler
npm install -g wrangler

# Build locally
npm run build

# Deploy
npx wrangler pages deploy out --project-name economic-index
```

### Build Configuration

The project is configured for static export in `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

### Build Process

```bash
# 1. Process data (CSV → JSON)
npm run process-data

# 2. Build Next.js app
next build

# 3. Export static files
# (automatic with output: 'export')

# Result: /out directory with 181 HTML pages
```

### Expected Build Output

```
181 static pages generated:
- 1 home page
- 173 country detail pages
- 1 countries listing
- 1 comparison page
- 1 US states page
- 1 jobs explorer
- 3 layout/error pages
```

### Performance Targets

- ✅ Build time: ~45-60 seconds
- ✅ First Load JS: ~106KB (gzipped)
- ✅ Largest page: 216KB (comparison with charts)
- ✅ Lighthouse score: 90+ performance

### Environment Variables

**None required!** All data is bundled at build time.

### Custom Domain Setup

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain (e.g., `economic-index.yourdomain.com`)
4. Follow DNS configuration instructions
5. SSL certificate auto-provisions

### Branch Deployments

- **Production:** `master` branch → economic-index.pages.dev
- **Preview:** All other branches/PRs → preview-{branch}.economic-index.pages.dev

### Continuous Deployment

GitHub Actions workflow (`.github/workflows/build.yml`) runs on every push:
- Lints code
- Builds project
- Uploads artifacts
- Cloudflare Pages auto-deploys on success

### Manual Deployment

```bash
# Build locally
npm run build

# Upload to Cloudflare Pages
npx wrangler pages deploy out \
  --project-name economic-index \
  --branch production
```

### Troubleshooting

**Build fails with "Page missing generateStaticParams"**
- Ensure all dynamic routes have `generateStaticParams()`
- Check `app/country/[code]/page.tsx` implementation

**Images not loading**
- Verify `unoptimized: true` in next.config.js
- Use relative paths for images in `public/`

**Large bundle size**
- Check chart libraries are code-split
- Verify data files are in `public/data/` not bundled

**Slow build times**
- Reduce countries in `generateStaticParams()` for testing
- Use `npm run build -- --debug` for diagnostics

### Monitoring

**Cloudflare Analytics:**
- Page views, unique visitors
- Geographic distribution
- Performance metrics (Core Web Vitals)

**Access:** Cloudflare Dashboard → Your Site → Analytics

### Security

**Headers (configured in Cloudflare):**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Cost

**Cloudflare Pages Free Tier:**
- ✅ 500 builds/month
- ✅ Unlimited bandwidth
- ✅ Unlimited sites
- ✅ SSL included
- ✅ DDoS protection

**Estimated usage:**
- ~30 builds/month (daily updates)
- Well within free tier limits

### Rollback

```bash
# Via Wrangler
wrangler pages deployment list --project-name economic-index
wrangler pages deployment rollback <DEPLOYMENT_ID>

# Or via Dashboard
# Cloudflare Pages → Your Project → Deployments → Rollback
```

### Local Preview

```bash
# Build
npm run build

# Serve locally
npx serve out

# Open http://localhost:3000
```

### Production Checklist

- [ ] All 181 pages build successfully
- [ ] Data processing runs without errors
- [ ] Charts render correctly
- [ ] Mobile responsiveness tested
- [ ] Lighthouse performance >90
- [ ] No console errors
- [ ] Links functional
- [ ] Search & filters working
- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] GitHub Actions passing

### Next Steps

1. Deploy to Cloudflare Pages
2. Configure custom domain
3. Enable analytics
4. Monitor performance
5. Set up alerts for build failures

### Support

- **Issues:** https://github.com/duyet/economic-index/issues
- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Next.js Export:** https://nextjs.org/docs/app/building-your-application/deploying/static-exports
