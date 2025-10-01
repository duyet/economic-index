# Open Questions

## Data & Methodology

**Q1: Should we generate all 173 country pages statically?**
- **Context:** Currently generating top 20 for faster builds
- **Trade-off:** 173 pages = longer build time (~3-5min) vs better SEO
- **Current:** Top 20 popular countries
- **Recommendation:** Generate all if build time <5min acceptable
- **Blocker:** No - can proceed with current approach
- **Status:** OPEN

**Q2: How to handle time-series data?**
- **Context:** Current data is single snapshot (Aug 4-11, 2025)
- **Question:** Should we prepare for multiple time periods?
- **Implication:** Data structure, chart types, storage strategy
- **Current:** Single period only
- **Status:** OPEN - depends on future data availability

**Q3: What's the update frequency for this data?**
- **Context:** Anthropic publishes quarterly reports
- **Question:** Should we design for automated data updates?
- **Implication:** CI/CD pipeline, data versioning, changelog
- **Current:** Manual update by rebuilding
- **Status:** OPEN

## UI/UX

**Q4: Should we support mobile/tablet fully?**
- **Context:** Current design is desktop-first
- **Question:** Priority for responsive design?
- **Current:** Basic responsive (functional but not optimized)
- **Recommendation:** High priority - significant mobile traffic expected
- **Status:** DEFERRED to Phase 2

**Q5: Accessibility requirements?**
- **Context:** No WCAG compliance testing done yet
- **Question:** Target compliance level? (A, AA, AAA)
- **Recommendation:** WCAG 2.1 Level AA minimum
- **Current:** Basic semantic HTML, missing ARIA labels
- **Status:** OPEN - implementing incrementally

**Q6: Do we need print-friendly views?**
- **Context:** Users may want to export/print reports
- **Question:** Add print stylesheets and PDF export?
- **Current:** No print optimization
- **Status:** LOW PRIORITY

## Features

**Q7: Should we add data download functionality?**
- **Context:** Anthropic provides CSV download
- **Question:** Allow users to download filtered/processed data?
- **Implementation:** Generate CSV from JSON client-side
- **Current:** No download feature
- **Status:** MEDIUM PRIORITY

**Q8: Do we need user accounts or saved preferences?**
- **Context:** Static site limits personalization
- **Question:** Store favorite countries, comparison sets in localStorage?
- **Current:** No persistence
- **Recommendation:** localStorage for client-side state
- **Status:** OPEN

**Q9: Should we add social sharing?**
- **Context:** Twitter/LinkedIn cards for charts
- **Question:** OpenGraph tags, share buttons, chart export
- **Current:** Basic OG tags only
- **Status:** MEDIUM PRIORITY

## Performance

**Q10: What's the acceptable bundle size?**
- **Context:** Current ~105KB first load JS
- **Question:** Target threshold? (<200KB recommended)
- **Current:** 105KB (good)
- **Action:** Monitor with each feature addition
- **Status:** ON TRACK

**Q11: Should we implement code splitting for charts?**
- **Context:** Chart libraries add ~50KB
- **Question:** Lazy load charts to reduce initial bundle?
- **Current:** Charts bundled in page
- **Recommendation:** Yes for heavy charts (map, complex viz)
- **Status:** TODO

**Q12: CDN strategy for static assets?**
- **Context:** Cloudflare Pages includes CDN
- **Question:** Additional optimization needed?
- **Current:** Using Cloudflare's default CDN
- **Status:** RESOLVED - sufficient

## Deployment

**Q13: Do we need staging environment?**
- **Context:** Cloudflare Pages supports branch previews
- **Question:** Dedicated staging branch or use PR previews?
- **Current:** Direct to production
- **Recommendation:** Use PR preview feature
- **Status:** TO IMPLEMENT

**Q14: Error tracking and monitoring?**
- **Context:** No error tracking currently
- **Question:** Add Sentry or similar service?
- **Current:** Console errors only
- **Recommendation:** Yes for production
- **Status:** OPEN

**Q15: Analytics requirements?**
- **Context:** Understanding user behavior
- **Question:** Google Analytics, Plausible, or none?
- **Privacy:** Need cookie consent for GA
- **Recommendation:** Plausible (privacy-friendly)
- **Status:** OPEN

## Legal & Compliance

**Q16: What license for the code?**
- **Context:** GitHub repo public
- **Question:** MIT, Apache 2.0, or other?
- **Current:** MIT (default choice)
- **Status:** RESOLVED unless objection

**Q17: Data attribution requirements?**
- **Context:** Using Anthropic's published data
- **Question:** Proper citation format?
- **Current:** "Data from Anthropic Economic Index V3"
- **Action:** Add full citation to footer and About page
- **Status:** TO IMPLEMENT

**Q18: Can we use Anthropic's name/branding?**
- **Context:** "Inspired by Anthropic Economic Index"
- **Question:** Permission needed for name mention?
- **Current:** Using descriptive reference
- **Assumption:** Fair use for attribution
- **Status:** ASSUMED OK - monitoring

## Architecture

**Q19: Should we migrate to App Router everywhere?**
- **Context:** Using App Router currently
- **Question:** Any Pages Router needed?
- **Current:** Full App Router
- **Status:** RESOLVED

**Q20: Database for future dynamic features?**
- **Context:** Fully static now
- **Question:** Plan for optional DB (Cloudflare D1)?
- **Current:** No database
- **Recommendation:** Keep static unless clear need
- **Status:** DEFERRED

---

## Priority Matrix

**CRITICAL (blocking launch):**
- None currently

**HIGH (should resolve soon):**
- Q1: Country page generation strategy
- Q4: Mobile responsiveness
- Q5: Accessibility compliance

**MEDIUM (nice to have):**
- Q7: Data download
- Q9: Social sharing
- Q14: Error tracking

**LOW (future):**
- Q6: Print views
- Q8: User preferences
- Q20: Database

## Decision Process

For each question:
1. **If non-blocking:** Choose sensible default, document here, implement
2. **If blocking:** Create GitHub issue, tag for discussion, implement temporary workaround
3. **Update status:** OPEN → IN PROGRESS → RESOLVED
