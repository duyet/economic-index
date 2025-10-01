# Global Economic Index - Project Documentation

## Project Overview

An interactive data visualization platform showcasing global AI adoption patterns across 150+ countries and US states, built with Next.js 15 and deployed as a static site on Cloudflare Pages.

**Live Demo:** Coming soon
**Repository:** https://github.com/duyet/economic-index
**Data Source:** Anthropic Economic Index V3 (Aug 4-11, 2025)

## Architecture

### Technology Stack

- **Framework:** Next.js 15.1.6 (App Router)
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts 2.15, react-simple-maps 3.0
- **Data:** Static JSON generated at build time from CSV
- **Deployment:** Cloudflare Pages (static export)

### Project Structure

```
economic-index/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── maps/               # Geographic visualizations
│   ├── charts/             # Chart components
│   ├── navigation/         # Navigation UI
│   ├── ui/                 # Base UI components
│   └── layout/             # Layout components
├── lib/                    # Utilities and types
│   ├── data/               # Data loading and processing
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
├── public/                 # Static assets
│   ├── data/               # Generated JSON files
│   └── maps/               # TopoJSON map data
├── scripts/                # Build scripts
│   └── process-data.ts     # CSV → JSON processor
└── aei_v3_download/        # Source CSV data
```

## Data Pipeline

### 1. Source Data

Two CSV files from Anthropic Economic Index V3:

- **aei_raw_claude_ai_2025-08-04_to_2025-08-11.csv** (100K+ rows)
  - Geographic data: 173 countries + 52 US states
  - Facets: usage, tasks (O*NET), requests, collaboration modes

- **aei_raw_1p_api_2025-08-04_to_2025-08-11.csv** (33K+ rows)
  - Global API usage patterns
  - Task-level token and cost metrics

### 2. Data Processing (`npm run process-data`)

**Script:** `scripts/process-data.ts`

**Process:**
1. Parse CSV files using Papa Parse
2. Group data by geography (country/state/global)
3. Aggregate metrics by facet (tasks, requests, collaboration)
4. Calculate derived metrics (AUI, indices, automation %)
5. Generate optimized JSON files

**Outputs:** (`public/data/`)
- `countries.json` - 173 country profiles
- `states.json` - 52 US state profiles
- `global.json` - Global aggregate
- `api.json` - 1P API usage data
- `metadata.json` - Build metadata

### 3. Data Loading

Data is loaded at build time (SSG) or client-side for dynamic components.

## Key Features

### Current Implementation (Phase 1)

✅ Project setup with Next.js + TypeScript + Tailwind
✅ Static export configuration for Cloudflare Pages
✅ Data processing pipeline (CSV → JSON)
✅ TypeScript types for all data schemas
✅ Basic layout with sidebar navigation
✅ Home page with overview stats

### Planned Features (Phases 2-10)

**Phase 2:** US state map with tier coloring
**Phase 3:** Country selector and filters
**Phase 4:** Interactive charts (usage index, treemap, waffle)
**Phase 5:** Task and request visualizations
**Phase 6:** Collaboration mode analysis
**Phase 7:** Job explorer with O*NET tasks
**Phase 8:** Comparison mode
**Phase 9:** Mobile responsiveness
**Phase 10:** Performance optimization & deployment

## Design System

### Colors

Based on Anthropic's Economic Index design:

```typescript
// Usage Tiers
LEADING:       #117763 (dark teal)
UPPER_MIDDLE:  #4DCAB6 (medium teal)
LOWER_MIDDLE:  #80D9CB (light sage-teal)
EMERGING:      #B3E8E0 (very light teal)
MINIMAL:       #E6F7F5 (barely visible teal)

// Collaboration Categories
AUTOMATION:    Teal shades
AUGMENTATION:  Sage/green shades
OTHER:         Gray shades

// Task Categories
COMPUTER:      Teal (#4DCAB6)
EDUCATION:     Blue (#6B8DD6)
BUSINESS:      Sage (#96C1A2)
ARTS:          Coral (#F98D7F)
OFFICE:        Gray (#9CA3AF)
```

### Typography

- **Headings:** Serif (GT Super Text style)
- **Body:** Sans-serif (system font stack)
- **Sizes:**
  - Display: 48-64px
  - Heading: 24-36px
  - Body: 14-16px
  - Small: 12px

### Components

**Conventions:**
- Use Tailwind for styling
- Props interfaces with `interface ComponentNameProps`
- Prefer composition over inheritance
- Export default for page components, named for utilities

## Development

### Prerequisites

- Node.js 18+
- npm 8+

### Setup

```bash
# Clone repository
git clone git@github.com:duyet/economic-index.git
cd economic-index

# Install dependencies
npm install

# Process data
npm run process-data

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

### Key Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production + process data
- `npm run process-data` - Generate JSON from CSV
- `npm run lint` - Run ESLint

### Environment Variables

None required for static build.

## Deployment

### Cloudflare Pages Configuration

**Framework preset:** Next.js (Static HTML Export)

**Build settings:**
```
Build command: npm run build
Build output: out
Root directory: /
Node version: 18
```

**Environment variables:** None required

### Deployment Process

1. Push to GitHub
2. Cloudflare Pages auto-builds on push
3. Preview deployments for PRs
4. Production deployment on main branch

### Static Export Notes

- All pages pre-rendered at build time
- No server-side runtime required
- Images must use `unoptimized: true`
- No API routes or middleware
- Client-side interactivity via React

## Data Schema

### Geography Types

```typescript
type GeographyType = 'country' | 'state_us' | 'global';

interface Country {
  geo_id: string;              // ISO-2 code (e.g., "US")
  geography: 'country';
  name: string;
  iso_alpha_3: string;         // ISO-3 code (e.g., "USA")
  working_age_pop?: number;
  gdp_per_working_age_capita?: number;
}
```

### Key Metrics

- **usage_count:** Total conversations/interactions
- **usage_pct:** Percentage of total usage
- **usage_per_capita_index (AUI):** Anthropic AI Usage Index
  - 1.0 = proportional to population
  - >1.0 = over-represented
  - <1.0 = under-represented
- **usage_tier:** 0-4 (minimal to leading)

### Collaboration Modes

- **Automation:** directive, feedback loop
- **Augmentation:** learning, task iteration, validation
- **Other:** none, not_classified

## Performance Targets

- Page load: <2s on 3G, <500ms on desktop
- Interactions: <100ms response time
- Lighthouse: 90+ performance, 100 accessibility
- Bundle size: <200KB initial JS

## Contributing

### Code Style

- Use Prettier defaults
- Follow TypeScript strict mode
- Prefer functional components
- Use descriptive variable names
- Add comments for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add world map visualization"

# Push and create PR
git push origin feature/my-feature
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Build/tooling

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Anthropic Economic Index Report](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report)
- [O*NET Database](https://www.onetcenter.org/)

## License

Data: Open-sourced by Anthropic
Code: MIT License

## Contact

Repository Issues: https://github.com/duet/economic-index/issues
