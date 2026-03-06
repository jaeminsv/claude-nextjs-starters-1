# Roadmap Generator Memory

## Project: invoice-web

### Key Paths

- PRD: `/Users/jaeminkim/Workplace/Projects/claude-code-mastery/invoice-web/.claude/agents/docs/PRD.md`
- ROADMAP: `/Users/jaeminkim/Workplace/Projects/claude-code-mastery/invoice-web/docs/ROADMAP.md`
- Source root: `src/`

### Completed Foundation (as of 2026-03-06)

- Next.js 15.5.3 + TypeScript + TailwindCSS v4 + shadcn/ui initialized
- `src/lib/env.ts` — Zod env validation (NOTION_API_KEY, NOTION_INVOICES_DATABASE_ID, NOTION_ITEMS_DATABASE_ID)
- `src/lib/notion.ts` — Notion client, getInvoiceById(), getInvoiceItems(), property extractors
- `src/types/invoice.ts` — Invoice, InvoiceItem, InvoiceStatus types
- `src/app/invoice/[id]/page.tsx` — Server Component, dynamic metadata
- `src/components/invoice/invoice-detail.tsx` — responsive table/card layout, KRW formatting
- `src/app/not-found.tsx` — 404 page with user guidance
- shadcn/ui components: Badge, Card, Separator, Table, Button, Alert, Skeleton, etc.
- `src/components/layout/container.tsx`

### Known Issues to Resolve

- `notion.ts` references `env.NOTION_ITEMS_DATABASE_ID` — env.ts defines this correctly. Also defines `NOTION_INVOICES_DATABASE_ID` (separate from NOTION_DATABASE_ID mentioned in PRD). Verify naming consistency (Task 1.4).

### Roadmap Phase Summary

- Phase 1: Notion integration verification + env setup (2-3h)
- Phase 2: PDF download via @react-pdf/renderer (4-6h) — highest risk phase
- Phase 3: UI polish — loading skeleton, error boundary, expiry warning (3-4h)
- Phase 4: Testing + Vercel deployment (2-3h)

### Critical Risks

- @react-pdf/renderer + Turbopack compatibility (test early)
- Korean font in PDF (must register Noto Sans KR or similar)
- Notion property name mismatch (field names in Notion must match strings in notion.ts)

### Conventions

- Notion property names in code use PascalCase (e.g., "InvoiceNumber", "ClientName", "IssueDate", "ValidUntil", "Status", "Description", "Quantity", "UnitPrice", "Invoice")
- API route for PDF: `src/app/api/invoice/[id]/pdf/route.ts`
- PDF component: `src/components/invoice/invoice-pdf.tsx`
- Download button (Client Component): `src/components/invoice/pdf-download-button.tsx`
