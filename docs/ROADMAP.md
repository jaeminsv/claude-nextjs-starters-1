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

### Phase 1: Skeleton -- Notion Data Verification & Integration Testing

**Goal:** Confirm the existing Notion integration works end-to-end with a real Notion database before building additional features.

- **Task 001: Notion Environment Setup & Database Configuration** - Priority
  - Set up `.env.local` with `NOTION_API_KEY`, `NOTION_INVOICES_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`
  - Create `.env.local.example` as a template for other developers
  - Create the Notion Invoices database with fields: InvoiceNumber (Title), ClientName (Text), IssueDate (Date), ValidUntil (Date), Status (Select: pending/approved/rejected), Items (Relation)
  - Create the Notion Items database with fields: Description (Title), Quantity (Number), UnitPrice (Number), Amount (Formula), Invoice (Relation)
  - Connect the Notion Integration to both databases

- **Task 002: Notion Integration Verification & Bug Fixes**
  - Verify `env.ts` and `notion.ts` reference consistent database ID env var names
  - Add at least one test invoice with 2-3 line items in Notion
  - Run `npm run dev` and visit `/invoice/[notionPageId]` to confirm data renders correctly
  - Fix any property name mismatches between Notion database fields and `notion.ts` property extractors
  - Playwright MCP test: verify invoice page loads with correct data from Notion API

---

### Phase 2: Common -- Loading States, Error Handling & Responsive Foundation

**Goal:** Establish shared UI patterns (loading, error, metadata, responsive) that all features depend on, before building individual features.

- **Task 003: Loading & Error States for Invoice Page** - Priority
  - Create `src/app/invoice/[id]/loading.tsx` with shadcn/ui Skeleton matching InvoiceDetail layout (header, date grid, table rows, total)
  - Create `src/app/invoice/[id]/error.tsx` as a Client Component for Notion API failure display (distinct from 404) with a "Retry" button using `reset()`
  - Playwright MCP test: verify loading skeleton appears, error page renders with retry functionality

- **Task 004: Metadata Enhancement & Root Layout Setup**
  - Add root layout metadata in `src/app/layout.tsx` with site name and default description
  - Enhance `generateMetadata()` in the invoice page to include Open Graph tags (`og:title`, `og:description`)
  - Playwright MCP test: verify OG tags render correctly in page source

- **Task 005: Responsive Layout Verification & Polish**
  - Verify invoice header stacks cleanly on screens narrower than 640px
  - Confirm mobile card layout shows all data points (description, quantity, unit price, amount) legibly
  - Verify with browser DevTools responsive mode at 375px, 768px, and 1280px breakpoints
  - Playwright MCP test: verify layout renders correctly at mobile, tablet, and desktop viewport sizes

---

### Phase 3: Core Feature -- PDF Download (F003)

**Goal:** Implement the PDF download functionality so clients can save and print invoices.

- **Task 006: Install and Configure @react-pdf/renderer** - Priority
  - Install `@react-pdf/renderer` package
  - Verify compatibility with Next.js 15 App Router and Turbopack
  - Apply any necessary `next.config.ts` adjustments (webpack/Turbopack externals for Node.js APIs)
  - Register Korean fonts (Noto Sans KR or similar) for correct text rendering in PDFs

- **Task 007: Create InvoicePDF Component**
  - Build `src/components/invoice/invoice-pdf.tsx` using `@react-pdf/renderer` primitives (Document, Page, View, Text, StyleSheet)
  - Match the visual layout of the existing `InvoiceDetail` component: header with invoice number and status, date/client info grid, line items table, total amount summary
  - Include KRW currency formatting consistent with the web view
  - Ensure Korean text renders correctly with the registered fonts

- **Task 008: Create PDF Generation API Route & Download Button**
  - Create `src/app/api/invoice/[id]/pdf/route.ts` as a POST endpoint
  - Fetch invoice from Notion using `getInvoiceById(id)`, render `<InvoicePDF>` to PDF buffer, return with proper Content-Type and Content-Disposition headers
  - Return 404 response if invoice is not found
  - Create `src/components/invoice/pdf-download-button.tsx` as a Client Component (`'use client'`)
  - Implement download flow: fetch PDF blob, create object URL, trigger download via temporary `<a>` element, revoke URL
  - Add loading spinner during PDF generation and error toast on failure
  - Integrate the download button into `src/components/invoice/invoice-detail.tsx`
  - Playwright MCP test: verify PDF download triggers correctly, file downloads with expected filename, Korean text renders in PDF

---

### Phase 4: Additional Feature -- Invoice Expiration Warning

**Goal:** Add business logic enhancements that improve the invoice viewing experience.

- **Task 009: Invoice Expiration Warning** - Priority
  - In `InvoiceDetail`, compare `invoice.validUntil` against current date and display a warning banner (shadcn/ui Alert, destructive variant) if expired
  - Show remaining days if invoice is close to expiration (e.g., within 7 days)
  - Playwright MCP test: verify expired invoice shows warning banner, near-expiration shows countdown

---

### Phase 5: Optimization -- Testing, Deployment & Documentation

**Goal:** Ensure the application is stable, passes all checks, and is ready for Vercel deployment.

- **Task 010: Lint, Type Check & Build Verification** - Priority
  - Run `npm run check-all` and fix all ESLint and TypeScript errors
  - Run `npm run build` and verify production build succeeds without warnings
  - Verify the invoice page is rendered dynamically (not statically) since data is fetched per request

- **Task 011: End-to-End Testing & Deployment**
  - Manual E2E test of the complete user flow: access invoice URL, verify data displays, download PDF, verify 404 for invalid ID
  - Playwright MCP test: complete user journey (navigate to invoice, verify content, download PDF, test invalid URL redirects to 404)
  - Configure Vercel deployment with environment variables (`NOTION_API_KEY`, `NOTION_INVOICES_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`)
  - Trigger deployment and verify invoice page loads correctly in production
  - Test on desktop Chrome, mobile Safari (iOS), and mobile Chrome (Android)

- **Task 012: Documentation Update**
  - Update `README.md` with setup instructions: Notion Integration creation, database setup with correct property names, `.env.local` configuration, and Vercel deployment steps
  - Document the complete data flow: Notion database -> API -> Server Component -> UI -> PDF

---

## Risk Register

| Risk                                                                         | Impact                        | Mitigation                                                                                                                                |
| ---------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `@react-pdf/renderer` incompatibility with Next.js 15 Turbopack              | High -- blocks PDF feature    | Test early in Phase 3. Fall back to Puppeteer (server-side HTML-to-PDF) if needed.                                                        |
| Notion API rate limiting (3 requests/second)                                 | Medium -- slow page loads     | Invoice page makes 2 API calls (page + items). Monitor in production. Add caching (ISR or in-memory) if needed.                           |
| Korean font rendering in PDF                                                 | Medium -- garbled text in PDF | `@react-pdf/renderer` requires explicit font registration for non-Latin characters. Register Noto Sans KR in Task 006.                    |
| Notion property name mismatch                                                | High -- data fails to load    | Carefully match Notion database field names to property names in `notion.ts` (e.g., "InvoiceNumber", "ClientName"). Verified in Task 002. |
| `NOTION_ITEMS_DATABASE_ID` vs `NOTION_INVOICES_DATABASE_ID` naming confusion | Medium -- wrong data queried  | Verify env var names are consistent across `env.ts` and `notion.ts` in Task 002.                                                          |

---

## Definition of Done

- [ ] All tasks above are checked off
- [ ] `npm run check-all` passes with zero errors
- [ ] `npm run build` succeeds without warnings
- [ ] Invoice page loads correctly with real Notion data
- [ ] PDF download works and renders Korean text correctly
- [ ] 404 page displays for invalid invoice IDs
- [ ] Layout is usable on mobile (375px), tablet (768px), and desktop (1280px)
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
