# Global Economic Index 🌍

Interactive visualization of AI adoption patterns across 150+ countries and US states.

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)

## Overview

This project visualizes the [Anthropic Economic Index](https://www.anthropic.com/economic-index) data, expanding from US-only to global coverage. Explore how people worldwide use Claude across different occupations, collaboration patterns, and geographic regions.

**Key Insights:**
- 📊 173 countries and 52 US states analyzed
- 🗺️ Geographic adoption patterns with Usage Index (AUI)
- 💼 974 occupations mapped to O*NET taxonomy
- 🤝 Automation vs Augmentation collaboration modes
- 🌐 Task distribution and specialization by region

## Features

- **Interactive Maps:** US state map and world map with tier-based coloring
- **Usage Analytics:** Per-capita adoption rates, GDP correlations
- **Task Explorer:** Browse 974 occupations with usage patterns
- **Collaboration Modes:** Track automation (directive, feedback) vs augmentation (learning, iteration, validation)
- **Country Filters:** Compare adoption across geographies
- **Request Categories:** Bottom-up taxonomy of user requests

## Quick Start

```bash
# Clone repository
git clone git@github.com:duyet/economic-index.git
cd economic-index

# Install dependencies
npm install

# Process data (required before first run)
npm run process-data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data

### Source

Anthropic Economic Index V3 data (August 4-11, 2025):
- **Claude.ai:** 100K+ conversations across 173 countries and 52 US states
- **1P API:** 33K+ API calls with task-level metrics

### Processing

Data is transformed at build time from CSV to optimized JSON:

```bash
npm run process-data
```

Generated files in `public/data/`:
- `countries.json` - Country-level metrics
- `states.json` - US state metrics
- `global.json` - Global aggregates
- `api.json` - API usage patterns
- `metadata.json` - Build metadata

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts:** Recharts, react-simple-maps
- **Deployment:** Cloudflare Pages (static export)

## Project Structure

```
economic-index/
├── app/                  # Next.js pages
├── components/           # React components
│   ├── maps/             # Geographic visualizations
│   ├── charts/           # Chart components
│   └── ui/               # Base UI components
├── lib/                  # Utilities
│   ├── data/             # Data loading
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helpers
├── public/data/          # Generated JSON files
├── scripts/              # Build scripts
└── aei_v3_download/      # Source CSV data
```

## Build & Deploy

### Local Build

```bash
# Full production build
npm run build

# Preview production build
npx serve out
```

### Deploy to Cloudflare Pages

**Automatic deployment:**
1. Push to GitHub
2. Connect repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `out`
5. Deploy!

**Manual deployment:**
```bash
npm run build
npx wrangler pages deploy out
```

## Development

### Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run process-data` - Transform CSV → JSON

### Adding New Visualizations

1. Create component in `components/charts/`
2. Load data from `public/data/` using `fetch` or import
3. Use TypeScript types from `lib/types/`
4. Follow Tailwind design system in `tailwind.config.ts`

### Design Guidelines

- Use serif fonts for headings (`font-serif`)
- Teal color scheme for usage tiers
- Responsive: mobile-first approach
- Accessibility: WCAG 2.1 AA compliance

## Data Documentation

Full schema documentation: [aei_v3_download/data_documentation.md](aei_v3_download/data_documentation.md)

### Key Metrics

- **AUI (Anthropic AI Usage Index):** Usage per capita compared to expected based on population (1.0 = proportional)
- **Usage Tiers:** Leading (4), Upper Middle (3), Lower Middle (2), Emerging (1), Minimal (0)
- **Collaboration Modes:**
  - Automation: directive, feedback loop
  - Augmentation: learning, task iteration, validation

### Geographic Coverage

- **Countries:** 173 with usage data
- **US States:** All 50 states + DC + territories
- **Minimum observations:** 200 for countries, 100 for states

## Contributing

Contributions welcome! Please see [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

### Workflow

```bash
# Create branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add feature"

# Push and create PR
git push origin feature/my-feature
```

## Resources

- **Report:** [Anthropic Economic Index September 2025](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report)
- **Interactive Demo:** [anthropic.com/economic-index](https://www.anthropic.com/economic-index)
- **O*NET Database:** [onetcenter.org](https://www.onetcenter.org/)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

## License

- **Data:** Open-sourced by Anthropic
- **Code:** MIT License

## Acknowledgments

Data provided by Anthropic. This is an independent visualization project expanding the original US-focused Economic Index to global scope.

---

**Built with ❤️ by the community**

[Report Issues](https://github.com/duet/economic-index/issues) | [View Demo](https://economic-index.pages.dev) | [Read Report](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report)
