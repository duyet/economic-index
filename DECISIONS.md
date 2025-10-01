# Technical Decisions

## Data Processing

**Decision 1: Limited Country Pre-generation**
- **Choice:** Generate static pages for top 20 countries only
- **Rationale:** Full 173 countries would create excessive build time and deployment size
- **Implementation:** Use `generateStaticParams()` with popular countries list
- **Alternative:** Could use dynamic routes with client-side rendering
- **Date:** 2025-10-01

**Decision 2: CSV to JSON Pipeline**
- **Choice:** Process CSV at build time, output to `public/data/*.json`
- **Rationale:** Static hosting requires pre-computed data; reduces client-side processing
- **Implementation:** `scripts/process-data.ts` runs before `next build`
- **Trade-off:** Larger repository size (~10MB JSON) vs runtime performance
- **Date:** 2025-10-01

**Decision 3: Data Schema Normalization**
- **Choice:** Keep raw structure from Anthropic's CSV with minimal transformation
- **Rationale:** Preserve data integrity; transformations documented in code
- **Implementation:** Group by geography, facet structure maintained
- **Date:** 2025-10-01

## UI/UX Design

**Decision 4: Chart Library Selection**
- **Choice:** Recharts for standard charts, react-simple-maps for geography
- **Rationale:**
  - Recharts: React-native, good TypeScript support, smaller bundle than ECharts
  - react-simple-maps: Purpose-built for map visualizations, TopoJSON support
- **Alternatives Considered:** ECharts (heavier), D3 (complex), Victory (limited maps)
- **Bundle Impact:** ~50KB combined (gzipped)
- **Date:** 2025-10-01

**Decision 5: Design System**
- **Choice:** Tailwind CSS with custom color palette matching Anthropic's style
- **Colors:** Teal/sage theme, tier-based gradients
- **Typography:** Serif headings (GT Super style), sans-serif body
- **Rationale:** Rapid development, consistent design, minimal CSS bundle
- **Date:** 2025-10-01

**Decision 6: Navigation Structure**
- **Choice:** Sidebar navigation with Global/US/Countries/Jobs sections
- **Rationale:** Matches Anthropic's pattern, clear information hierarchy
- **Trade-off:** Fixed sidebar reduces content width on desktop
- **Mobile:** Collapsible hamburger menu (planned)
- **Date:** 2025-10-01

## Performance

**Decision 7: Static Generation Strategy**
- **Choice:** Full static export, no ISR or SSR
- **Rationale:** Cloudflare Pages requirement, maximum performance
- **Limitation:** Data updates require rebuild
- **Mitigation:** Automated CI/CD pipeline for data refreshes
- **Date:** 2025-10-01

**Decision 8: Data Loading Pattern**
- **Choice:** Client-side fetch from `/data/*.json` for dynamic pages
- **Rationale:** Enables filtering/sorting without page reload
- **Trade-off:** Initial page load includes fetch time (~100-500ms)
- **Optimization:** Consider inlining critical data in HTML for key pages
- **Date:** 2025-10-01

**Decision 9: Image Optimization**
- **Choice:** `unoptimized: true` in next.config.js
- **Rationale:** Required for static export (no Image Optimization API)
- **Mitigation:** Use SVG for icons, optimize PNGs manually
- **Date:** 2025-10-01

## Development

**Decision 10: TypeScript Strictness**
- **Choice:** Strict mode enabled
- **Rationale:** Catch errors early, better IDE support
- **Challenge:** Some libraries lack types; use `@types/*` packages
- **Date:** 2025-10-01

**Decision 11: Testing Strategy**
- **Choice:** Start without tests, add incrementally
- **Rationale:** Prioritize MVP; tests add later for stability
- **Plan:** Unit tests for data processing, E2E for critical user flows
- **Date:** 2025-10-01 (TO BE IMPROVED)

**Decision 12: Monorepo vs Single Package**
- **Choice:** Single package structure
- **Rationale:** Small project, simple deployment
- **Date:** 2025-10-01

## Deployment

**Decision 13: Cloudflare Pages Configuration**
- **Build Command:** `npm run build`
- **Output Directory:** `out`
- **Node Version:** 18.x
- **Environment:** No env vars required (data bundled)
- **Date:** 2025-10-01

**Decision 14: Git Workflow**
- **Choice:** Direct commits to `master` during initial development
- **Rationale:** Solo developer, rapid iteration
- **Plan:** Switch to feature branches + PR workflow once stable
- **Date:** 2025-10-01

## Data Methodology

**Decision 15: Usage Index (AUI) Calculation**
- **Choice:** Use pre-calculated `usage_per_capita_index` from source data
- **Rationale:** Anthropic's methodology already applied in CSV
- **Formula:** `(usage_pct / population_pct)` where 1.0 = proportional
- **Date:** 2025-10-01

**Decision 16: Collaboration Mode Categorization**
- **Choice:** Follow Anthropic's classification
  - Automation: directive, feedback loop
  - Augmentation: learning, task iteration, validation
- **Rationale:** Established methodology, consistent with report
- **Date:** 2025-10-01

**Decision 17: Missing Data Handling**
- **Choice:** Display "N/A" for missing metrics, exclude from calculations
- **Rationale:** Transparent about data gaps
- **Alternative:** Imputation (rejected for data integrity)
- **Date:** 2025-10-01

## Outstanding Items

**Need Decision:**
- Full 173 countries vs top 50 for static generation
- Add server-side component for real-time data updates?
- Implement caching strategy for `/data/*.json` fetches
- Add Google Analytics or privacy-friendly analytics?

**Technical Debt:**
- Replace `any` types with proper interfaces (37 instances)
- Add comprehensive test suite
- Implement error boundaries
- Mobile responsiveness improvements
