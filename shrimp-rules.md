# Development Guidelines

## Project Overview

### Purpose

Notion-backed invoice management system for freelancers and small businesses. Clients view invoices via unique URL and download as PDF.

### Technology Stack

| Layer           | Technology                            | Version      |
| --------------- | ------------------------------------- | ------------ |
| Framework       | Next.js (App Router + Turbopack)      | 15.5.3       |
| Runtime         | React + TypeScript                    | 19.1.0 / 5.x |
| Styling         | TailwindCSS v4 + shadcn/ui (new-york) | v4           |
| Forms           | React Hook Form + Zod                 | 7.x / 4.x    |
| Data Source     | Notion API (@notionhq/client)         | 2.x          |
| Icons           | Lucide React                          | latest       |
| Theme           | next-themes                           | 0.4.x        |
| Deployment      | Vercel                                | -            |
| Package Manager | npm                                   | -            |

### Core Data Flow

```
Notion Database → @notionhq/client → Server Component → UI Render → PDF Download
```

---

## Project Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router (pages & routing)
│   ├── layout.tsx                # Root layout (ThemeProvider, fonts, Toaster)
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # Global 404 page
│   ├── globals.css               # TailwindCSS v4 global styles
│   └── invoice/[id]/             # Dynamic invoice route
│       ├── page.tsx              # Invoice detail (Server Component)
│       ├── loading.tsx           # Loading skeleton (planned)
│       └── error.tsx             # Error boundary (planned)
├── components/
│   ├── ui/                       # shadcn/ui auto-generated components (DO NOT EDIT)
│   ├── layout/                   # Layout primitives (Container)
│   ├── invoice/                  # Invoice-specific components
│   └── providers/                # React context providers
├── lib/
│   ├── env.ts                    # Zod-validated environment variables
│   ├── notion.ts                 # Notion API client & data fetchers
│   └── utils.ts                  # Shared utilities (cn)
└── types/
    └── invoice.ts                # TypeScript type definitions
```

### Module Responsibilities

| Module                    | Responsibility                                                  |
| ------------------------- | --------------------------------------------------------------- |
| `src/lib/env.ts`          | Validate all environment variables with Zod schema              |
| `src/lib/notion.ts`       | All Notion API interactions, property extraction, data fetching |
| `src/lib/utils.ts`        | Shared utility functions (currently: `cn` for class merging)    |
| `src/types/invoice.ts`    | TypeScript interfaces for Invoice, InvoiceItem, InvoiceStatus   |
| `src/components/ui/`      | shadcn/ui primitives (auto-generated, do not modify)            |
| `src/components/layout/`  | Reusable layout components (Container)                          |
| `src/components/invoice/` | Invoice domain components (InvoiceDetail, future: InvoicePDF)   |

---

## Code Standards

### Formatting

- **Indentation**: 2 spaces (enforced by Prettier)
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Semicolons**: None (Prettier default for this project)
- **Quotes**: Single quotes for strings
- **Trailing commas**: ES5 style

### Comments

- Write all code comments in **English**
- Write comments detailed enough for beginners to understand
- Every exported function must have a JSDoc comment explaining purpose, params, and return value

### Language Rules

- **Code responses to user**: Korean
- **Commit messages**: English
- **Documentation files**: English
- **Variable/function names**: English (camelCase)
- **UI text (user-facing)**: Korean

### TypeScript

- **Strict mode** is enabled (`strict: true` in tsconfig.json)
- Use `interface` for object shapes, `type` for unions/intersections
- Import types with `import type { ... }` syntax
- Path alias: `@/*` maps to `./src/*`

### Verification Commands

- Run `npm run check-all` before completing any task (typecheck + lint + format check)
- Run `npm run build` to verify production build succeeds
- Fix all errors before marking work as complete

---

## Functionality Implementation Standards

### Server vs Client Components

- **Default to Server Components** (no directive needed)
- Add `'use client'` only when the component requires:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
- Keep Client Components as small as possible; push data fetching to Server Components

### Next.js 15 Specifics

- **Params are Promises**: Always `await params` before accessing properties

  ```typescript
  // CORRECT
  const { id } = await params

  // WRONG - will cause type error
  const id = params.id
  ```

- Use `generateMetadata()` for dynamic page metadata
- Use `notFound()` from `next/navigation` for 404 responses
- Dynamic routes: `src/app/[segment]/page.tsx`

### Notion API Integration

- All Notion interactions go through `src/lib/notion.ts`
- Use existing property extractors: `getTextProperty`, `getNumberProperty`, `getDateProperty`, `getSelectProperty`
- **Property names must exactly match Notion database field names** (case-sensitive):
  - Invoices DB: `InvoiceNumber` (Title), `ClientName` (Text), `IssueDate` (Date), `ValidUntil` (Date), `Status` (Select), `Items` (Relation)
  - Items DB: `Description` (Title), `Quantity` (Number), `UnitPrice` (Number), `Amount` (Formula), `Invoice` (Relation)
- Notion client uses lazy initialization pattern (created on first API call, not at import time)
- Handle errors gracefully: return `null` on fetch failure, let the page call `notFound()`

### Korean Locale Requirements

- **Currency**: Format as KRW with `amount.toLocaleString('ko-KR') + '원'`
- **Dates**: Format with `toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })`
- **HTML lang**: Set to `ko` on the root `<html>` element
- All user-facing text in Korean (error messages, labels, headings)

### Responsive Design Pattern

- **Desktop (md+)**: Use `Table` component from shadcn/ui
- **Mobile (<md)**: Use `Card` component with stacked layout
- Toggle visibility with `hidden md:block` and `md:hidden` classes
- Test at breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
- Use `Container` component for page-level width constraints

---

## Framework & Library Usage Standards

### shadcn/ui

- Style: **new-york** (configured in `components.json`)
- Install new components: `npx shadcn@latest add [component-name]`
- Components are generated into `src/components/ui/`
- **Never manually edit files in `src/components/ui/`** — regenerate if changes needed
- Use `cn()` from `@/lib/utils` for conditional class merging

### TailwindCSS v4

- Uses CSS-based configuration (no `tailwind.config.js`)
- Global styles in `src/app/globals.css`
- Use Tailwind utility classes directly; avoid inline styles
- Use `tw-animate-css` for animations
- Prettier plugin (`prettier-plugin-tailwindcss`) auto-sorts classes

### Zod

- Environment variables: Validated in `src/lib/env.ts`
- Form validation: Use with `@hookform/resolvers` for React Hook Form
- Define schemas co-located with the feature that uses them

### next-themes

- ThemeProvider wraps the entire app in root layout
- Supports `system`, `light`, `dark` themes
- Use `suppressHydrationWarning` on `<html>` to prevent flash

### Sonner (Toast)

- `<Toaster />` is mounted in root layout
- Import `toast` from `sonner` for notifications

---

## Key File Interaction Standards

### Adding a New Notion Property

1. Update Notion database with the new field
2. Add property extractor in `src/lib/notion.ts` (or use existing one)
3. Update `src/types/invoice.ts` interface with the new field
4. Update data fetcher function in `src/lib/notion.ts` to extract the new property
5. Update UI component(s) that display the data

### Adding a New Environment Variable

1. Add to `src/lib/env.ts` Zod schema
2. Add to `src/lib/env.ts` parse object
3. Add to `.env.local.example` with placeholder value
4. Document in README if user-facing

### Adding a New Page

1. Create `src/app/[route]/page.tsx` as a Server Component
2. Add `generateMetadata()` for SEO
3. Use `Container` component for layout
4. Add `loading.tsx` for loading state
5. Add `error.tsx` for error boundary

### Adding a New Feature Component

1. Create in `src/components/[feature-name]/` directory
2. Server Component by default
3. If Client Component needed, create a thin wrapper with `'use client'`
4. Co-locate related components in the same feature directory

### Adding a New API Route

1. Create `src/app/api/[endpoint]/route.ts`
2. Export named functions: `GET`, `POST`, `PUT`, `DELETE`
3. Validate request body with Zod
4. Return proper error responses with appropriate status codes
5. Use Notion client from `src/lib/notion.ts` for data access

---

## AI Decision-Making Standards

### Component Type Decision

```
Need event handlers or hooks?
├── YES → Client Component ('use client')
│   └── Keep as small as possible, receive data as props
└── NO → Server Component (default)
    └── Fetch data directly, pass to child components
```

### Styling Decision

```
Need conditional styles?
├── YES → Use cn() with Tailwind classes
└── NO → Use Tailwind classes directly

Need a standard UI element (Button, Card, Table, etc.)?
├── YES → Check if shadcn/ui has it → npx shadcn@latest add [name]
└── NO → Build with Tailwind utilities
```

### Data Fetching Decision

```
Is data from Notion?
├── YES → Use existing functions in src/lib/notion.ts
│   └── Need new property? → Add extractor to notion.ts first
└── NO → Create new function in appropriate lib/ file

Where to fetch?
├── Page-level data → Fetch in page.tsx (Server Component)
├── Shared data → Fetch in layout.tsx
└── Client-side only → Use API route + fetch in Client Component
```

### Error Handling Decision

```
Notion API returns null/error?
├── Page level → Call notFound() to show 404
├── API route → Return Response with 404/500 status
└── Component level → Show fallback UI with error message
```

---

## Prohibited Actions

- **Never modify files in `src/components/ui/`** — these are auto-generated by shadcn/ui
- **Never hardcode Notion property names outside `src/lib/notion.ts`** — centralize all property access
- **Never use CSS modules, styled-components, or inline styles** — use TailwindCSS only
- **Never skip environment variable validation** — all env vars go through `src/lib/env.ts`
- **Never create pages without `generateMetadata()`** — every page needs proper metadata
- **Never use `params.id` directly in Next.js 15** — always `await params` first
- **Never install packages without checking existing dependencies** — check `package.json` first
- **Never add `tailwind.config.js`** — TailwindCSS v4 uses CSS-based configuration
- **Never commit `.env.local`** — it contains secrets; only `.env.local.example` is committed
- **Never import from relative paths when `@/` alias is available** — use `@/lib/...`, `@/components/...`, etc.
- **Never run `npm run build` with `--turbopack` removed** — Turbopack is the configured bundler
- **Never create Server Actions without proper input validation** — use Zod schemas
