# Next.js Project Initializer - Agent Memory

## Project: invoice-web

### Stack

- Next.js 15.5.3 + React 19 + TypeScript 5
- TailwindCSS v4 + shadcn/ui (new-york style)
- Notion API (@notionhq/client) for data source
- Husky + lint-staged for pre-commit hooks

### Key File Paths

- `/src/lib/notion.ts` - Notion client + helper functions + data fetching
- `/src/lib/env.ts` - Zod-validated environment variables
- `/src/types/invoice.ts` - Invoice and InvoiceItem TypeScript interfaces
- `/src/app/invoice/[id]/page.tsx` - Dynamic invoice detail page (Server Component)
- `/src/components/invoice/invoice-detail.tsx` - Invoice display component
- `/src/app/not-found.tsx` - Custom 404 page
- `.env.local.example` - Template for required environment variables

### Patterns Established

#### Cleanup: starter -> invoice-web

- Removed: login/, signup/ pages, login-form.tsx, signup-form.tsx
- Removed: sections/ (hero, features, cta), navigation/ (main-nav, mobile-nav)
- Removed: layout/header.tsx, layout/footer.tsx
- Removed: ui/navigation-menu.tsx (after removing @radix-ui/react-navigation-menu dep)
- Kept: layout/container.tsx, theme-toggle.tsx, ui/\*, providers/theme-provider.tsx
- Always clear .next/ cache after deleting pages to avoid stale validator.ts errors

#### env.ts Pattern

- All env vars validated with Zod at module load time
- Server-only vars (no NEXT*PUBLIC* prefix) for sensitive keys like NOTION_API_KEY
- Notion vars: NOTION_API_KEY, NOTION_INVOICES_DATABASE_ID, NOTION_ITEMS_DATABASE_ID

#### notion.ts Pattern

- Use PageObjectResponse type from @notionhq/client/build/src/api-endpoints
- Helper functions: getTextProperty, getNumberProperty, getDateProperty, getSelectProperty
- getInvoiceById: try-catch returning null on error (used with notFound() in page)
- getInvoiceItems: filters Items DB by relation to parent invoice page ID
- Notion property names match exact column names in the Notion database

#### Invoice Page Pattern

- params is a Promise in Next.js 15 App Router - must await it
- generateMetadata + default export both receive PageProps with params: Promise<{id}>
- Server Component fetches data -> passes to presentational component

#### Common Pitfall

- After deleting app routes (login, signup), must delete .next/ cache
  Otherwise tsc fails with "Cannot find module '../../src/app/login/page.js'"
- navigation-menu.tsx in ui/ depends on @radix-ui/react-navigation-menu
  If that dep is removed from package.json, must also delete the UI component file

### Build Commands

- `npm run check-all` = typecheck + lint + format:check
- `npm run format` to auto-fix Prettier issues before check-all
- Build test requires .env.local with Notion vars (even placeholder values work)
