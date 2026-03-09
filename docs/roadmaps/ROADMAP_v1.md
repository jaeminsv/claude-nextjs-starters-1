# Notion Invoice System Development Roadmap

A Notion-backed invoice management system that enables freelancers and small businesses to manage quotes via Notion, while providing clients with a public URL to view and download invoices as PDFs.

## Overview

The Notion Invoice System is designed for freelancers and small businesses who need a lightweight invoicing solution, providing:

- **Notion Database Integration (F001)**: Fetch invoice data from Notion via the official API, using Notion as the single source of truth
- **Invoice Viewer (F002)**: Public-facing web page to display invoice details with responsive layout
- **PDF Download (F003)**: Generate and download invoices as PDF files for saving and printing
- **URL-based Access (F010)**: Each invoice is accessible via a unique URL based on its Notion page ID
- **Validation & Error Handling (F011)**: Graceful handling of invalid or missing invoice IDs
- **Responsive Layout (F012)**: Mobile, tablet, and desktop support for the invoice viewer

## Development Workflow

1. **Task Planning**
   - Review the existing codebase and understand the current state
   - Update `ROADMAP.md` with new tasks as needed
   - Insert priority tasks after the last completed task

2. **Task Creation**
   - Review the existing codebase and understand the current state
   - Create new task files in the `/tasks` directory
   - Naming format: `XXX-description.md` (e.g., `001-setup.md`)
   - Include high-level specification, related files, acceptance criteria, and implementation steps
   - **For API/business logic tasks, include a "## Test Checklist" section with Playwright MCP test scenarios**
   - Reference the last completed tasks in `/tasks` for formatting examples. For example, if the current task is `012`, reference `011` and `010`.
   - These examples reflect completed state (checked boxes and change summaries). New tasks should have unchecked boxes and no change summaries. See `000-sample.md` for initial state formatting.

3. **Task Implementation**
   - Follow the specification in the task file
   - Implement features and functionality
   - **For API integration and business logic, run tests using Playwright MCP**
   - Update step progress in the task file after each step
   - Run E2E tests using Playwright MCP after implementation
   - Confirm tests pass before moving to the next step
   - Pause after each step and wait for further instructions

4. **Roadmap Update**
   - Mark completed tasks with a checkmark in the roadmap

---

## Current Status

**Progress: 12/12 tasks completed (100%) — All Phases done ✅**

### Completed (Pre-Roadmap)

The following foundation work has already been completed:

- [x] Next.js 15.5.3 project initialization with TypeScript, TailwindCSS v4, shadcn/ui
- [x] Starter template cleaned up (removed boilerplate)
- [x] Environment variable validation (`src/lib/env.ts`) using Zod
- [x] Notion client setup with lazy initialization (`src/lib/notion.ts`)
  - `getInvoiceById()` -- fetches invoice page + related items
  - `getInvoiceItems()` -- queries Items database by relation filter
  - Property extractor utilities: `getTextProperty`, `getNumberProperty`, `getDateProperty`, `getSelectProperty`
- [x] TypeScript types defined (`src/types/invoice.ts`) -- `Invoice`, `InvoiceItem`, `InvoiceStatus`
- [x] Invoice detail page (`src/app/invoice/[id]/page.tsx`) -- Server Component with dynamic metadata
- [x] Invoice detail UI component (`src/components/invoice/invoice-detail.tsx`) -- responsive table/card layout, KRW formatting
- [x] 404 Not Found page (`src/app/not-found.tsx`) -- friendly error with guidance message
- [x] Base UI components from shadcn/ui: Badge, Card, Separator, Table, Button, etc.
- [x] Container layout component (`src/components/layout/container.tsx`)

---

## Development Phases

### Phase 1: Skeleton -- Notion Data Verification & Integration Testing ✅

**Goal:** Confirm the existing Notion integration works end-to-end with a real Notion database before building additional features.

- [x] **Task 001: Notion Environment Setup & Database Configuration** (Score: 90)
  - Set up `.env.local` with `NOTION_API_KEY`, `NOTION_INVOICES_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`
  - Created Notion Invoices database (InvoiceNumber, ClientName, IssueDate, ValidUntil, Status, Items)
  - Created Notion Items database (Description, Quantity, UnitPrice, Invoice relation)
  - Connected the Notion Integration to both databases
  - Note: Notion Status column uses `status` type (not `select`), which required a fix in Task 002

- [x] **Task 002: Notion Integration Verification & Bug Fixes** (Score: 92)
  - Verified `env.ts` and `notion.ts` reference consistent database ID env var names
  - Added test invoice (INV-001, ABC 디자인) with 3 line items
  - **Bug found & fixed:** `getSelectProperty()` in `notion.ts` only handled `select` type, but Notion's Status column uses `status` type. Added `status` type handling and `toLowerCase()` normalization
  - Playwright MCP verified: invoice page loads correctly, 404 works for invalid IDs, responsive layout at 375px and 1280px

---

### Phase 2: Common -- Loading States, Error Handling & Responsive Foundation ✅

**Goal:** Establish shared UI patterns (loading, error, metadata, responsive) that all features depend on, before building individual features.

- [x] **Task 003: Loading & Error States for Invoice Page** (Score: 92)
  - Created `src/app/invoice/[id]/loading.tsx` — Skeleton UI matching InvoiceDetail structure (header, date grid, items table + mobile cards, total)
  - Created `src/app/invoice/[id]/error.tsx` — Client Component Error Boundary with destructive Alert and retry Button
  - Both files follow responsive pattern: desktop table (md+) and mobile cards (<md)

- [x] **Task 004: Metadata Enhancement & Root Layout Setup** (Score: 93)
  - Added `metadataBase` to root layout with `getBaseUrl()` helper (NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost)
  - Enhanced `generateMetadata()` with `openGraph` fields (title, description, type) for both valid and not-found cases
  - Verified OG tags render in HTML via curl: `og:title="INV-001 - ABC 디자인 견적서"`

- [x] **Task 005: Responsive Layout Verification & Polish** (Score: 90)
  - Verified at 375px (mobile), 768px (tablet), 1280px (desktop) via Playwright screenshots
  - **Fix applied:** Mobile Card layout had excessive gap between CardHeader and CardContent (24px → 12px), overridden with `gap-3 py-4`
  - All breakpoints confirmed: header stacking, grid columns, Table/Card switching all correct

---

### Phase 3: Core Feature -- PDF Download (F003) ✅

**Goal:** Implement the PDF download functionality so clients can save and print invoices.

- [x] **Task 006: Install and Configure @react-pdf/renderer** (Score: 91)
  - Installed `@react-pdf/renderer` and verified Turbopack compatibility
  - Added `serverExternalPackages` to `next.config.ts` (Next.js 15 moved from `experimental`)
  - Registered Noto Sans KR fonts (Regular + Bold) using local OTF files in `/public/fonts/`
  - Extracted `formatKRW`, `formatDate` to `src/lib/format.ts` for PDF/web reuse
  - **Risk resolved:** Turbopack build passes successfully — highest project risk eliminated

- [x] **Task 007: Create InvoicePDF Component** (Score: 90)
  - Created `src/components/invoice/invoice-pdf.tsx` using @react-pdf/renderer primitives (Document, Page, View, Text, StyleSheet)
  - 7 sections matching InvoiceDetail layout: header, info grid, items table, total amount
  - Korean text renders correctly with registered Noto Sans KR fonts
  - Uses shared `formatKRW`, `formatDate` from `src/lib/format.ts`

- [x] **Task 008: PDF Generation API Route & Download Button** (Score: 90)
  - Created GET API route `src/app/api/invoice/[id]/pdf/route.tsx` with Node.js→Web ReadableStream conversion
  - Content-Type: application/pdf, Content-Disposition with invoice number filename
  - Created `src/components/invoice/pdf-download-button.tsx` Client Component with Loader2 spinner and sonner toast error handling
  - Integrated PdfDownloadButton into invoice-detail.tsx header section
  - **Font issue resolved:** jsDelivr CDN returned 403, switched to local OTF files in `/public/fonts/`
  - Verified: 200 application/pdf for valid ID, 404 for invalid ID

---

### Phase 4: Additional Feature -- Invoice Expiration Warning ✅

**Goal:** Add business logic enhancements that improve the invoice viewing experience.

- [x] **Task 009: Invoice Expiration Warning** (Score: 92)
  - Created `getExpirationStatus()` helper with 3-state logic: expired (daysLeft < 0), expiring-soon (daysLeft ≤ 7), valid
  - Expired: destructive Alert with AlertCircle icon — "견적서가 만료되었습니다"
  - Expiring-soon: yellow warning Alert with Clock icon — "N일 후에 만료됩니다" (0일 = "오늘 만료됩니다")
  - Uses `expDate.setHours(23, 59, 59, 999)` for end-of-day precision
  - Playwright MCP verified: expired invoice shows destructive banner, near-expiration shows yellow countdown

---

### Phase 5: Optimization -- Testing, Deployment & Documentation ✅

**Goal:** Ensure the application is stable, passes all checks, and is ready for Vercel deployment.

- [x] **Task 010: Lint, Type Check & Build Verification** (Score: 93)
  - `npm run check-all` passes: TypeScript, ESLint, Prettier all zero errors
  - `npm run build` succeeds with Turbopack — no warnings
  - `/invoice/[id]` confirmed as `ƒ (Dynamic)` — server-rendered on demand, not statically generated

- [x] **Task 011: End-to-End Testing & Deployment** (Score: 91)
  - Playwright MCP E2E tests passed: invoice page load, data display, expiration banner, PDF download (200, 67KB), 404 for invalid ID
  - Responsive verified: mobile 375px (Card layout), desktop 1280px (Table layout)
  - Vercel deployment instructions documented in README.md (environment variables, setup steps)
  - Note: Actual Vercel deployment deferred — requires project owner to configure environment variables in Vercel dashboard

- [x] **Task 012: Documentation Update** (Score: 92)
  - README.md updated: Notion Status property type corrected (`status` not `select`), project structure reflects all new files
  - Added complete Data Flow diagram: Notion DB → API → Server Component → InvoiceDetail → PDF API route
  - Deployment section expanded with Vercel dashboard steps and environment variable table

---

## Risk Register

| Risk                                                                         | Impact                        | Mitigation                                                                                                                                |
| ---------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `@react-pdf/renderer` incompatibility with Next.js 15 Turbopack              | High -- blocks PDF feature    | ✅ **Resolved in Task 006.** Turbopack build passes. Used `serverExternalPackages` (top-level in Next.js 15, not experimental).           |
| Notion API rate limiting (3 requests/second)                                 | Medium -- slow page loads     | Invoice page makes 2 API calls (page + items). Monitor in production. Add caching (ISR or in-memory) if needed.                           |
| Korean font rendering in PDF                                                 | Medium -- garbled text in PDF | ✅ **Resolved in Task 006-007.** Local OTF files in `/public/fonts/` (CDN 403 issue bypassed). Korean renders correctly.                  |
| Notion property name mismatch                                                | High -- data fails to load    | ✅ **Resolved in Task 002.** Property names match. Additionally found `status` vs `select` type mismatch — fixed with dual-type handling. |
| `NOTION_ITEMS_DATABASE_ID` vs `NOTION_INVOICES_DATABASE_ID` naming confusion | Medium -- wrong data queried  | ✅ **Resolved in Task 002.** Env var names are consistent across `env.ts` and `notion.ts`.                                                |

---

## Definition of Done

- [x] All tasks above are checked off
- [x] `npm run check-all` passes with zero errors
- [x] `npm run build` succeeds without warnings
- [x] Invoice page loads correctly with real Notion data
- [x] PDF download works and renders Korean text correctly
- [x] 404 page displays for invalid invoice IDs
- [x] Layout is usable on mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Application is deployed and accessible on Vercel

---

## Post-MVP Roadmap (Out of Scope)

### Phase 6: Admin Dashboard

- Invoice list page with search and filtering
- Invoice status management (approve/reject)
- Basic analytics (total invoices, pending/approved counts)

### Phase 7: Automation

- Email delivery via SendGrid or Resend
- Invoice expiry notifications
- Client response tracking

### Phase 8: Advanced Features

- Multiple PDF template designs
- Multi-language invoice support
- Electronic signature integration
- Invoice version history
