# Notion Invoice System Development Roadmap

A Notion-backed invoice management system that enables freelancers and small businesses to manage quotes via Notion, while providing clients with a public URL to view and download invoices as PDFs.

## Overview

The Notion Invoice System is designed for freelancers and small businesses who need a lightweight invoicing solution, providing:

- **Notion Database Integration**: Fetch invoice data from Notion via the official API, using Notion as the single source of truth
- **Invoice Viewer**: Public-facing web page to display invoice details with responsive layout
- **PDF Download**: Generate and download invoices as PDF files for saving and printing
- **Admin Dashboard**: Admin interface to view issued invoices and copy client-facing URLs
- **Dark Mode**: User-selectable light/dark/system theme toggle

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

## MVP Summary (Completed)

**Progress: 12/12 tasks completed (100%)**

The MVP was completed across 5 phases (see `docs/roadmaps/ROADMAP_v1.md` for full details):

- **Phase 1: Skeleton** -- Notion database setup, integration verification, bug fixes (Status property type mismatch resolved)
- **Phase 2: Common** -- Loading/error states, metadata enhancement with OG tags, responsive layout polish
- **Phase 3: Core Feature** -- @react-pdf/renderer setup, InvoicePDF component, PDF API route with download button
- **Phase 4: Additional Feature** -- Invoice expiration warning with 3-state logic (expired / expiring-soon / valid)
- **Phase 5: Optimization** -- Lint/type/build verification, E2E testing, documentation update

**Key Deliverables:**

- [x] Notion API integration with dual-database architecture (Invoices + Items)
- [x] Invoice detail page with Server Component rendering
- [x] PDF download with Korean font support (Noto Sans KR)
- [x] Invoice expiration warning banners
- [x] Loading skeleton, error boundary, 404 page
- [x] Responsive layout (mobile 375px, tablet 768px, desktop 1280px)
- [x] ThemeProvider configured (dark mode infrastructure ready)
- [x] `npm run check-all` and `npm run build` passing

---

## Enhancement Phases

### Phase 6: Admin Dashboard -- Invoice List & Management ✅

**Goal:** Provide an admin interface where the invoice issuer can view all issued invoices and quickly copy client-facing URLs for sharing.

- **Task 013: Admin Layout & Route Structure** ✅ - 완료
  - ✅ Create `/admin` route group with dedicated admin layout
  - ✅ Admin layout includes sidebar/header navigation, app branding, and ThemeToggle integration
  - ✅ Create admin root page (`/admin`) that redirects to `/admin/invoices`
  - Related files: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`
  - Acceptance criteria: `/admin` renders the admin layout shell with navigation and theme toggle visible

- **Task 014: Invoice List API & Data Fetching** ✅ - 완료
  - ✅ Create server-side function to fetch all invoices from Notion database with pagination support
  - ✅ Add `getAllInvoices()` to `src/lib/notion.ts` using `databases.query()` with sorting (newest first)
  - ✅ Define `InvoiceListItem` type (subset of Invoice: id, invoiceNumber, clientName, issueDate, validUntil, status, totalAmount)
  - Related files: `src/lib/notion.ts`, `src/types/invoice.ts`
  - Acceptance criteria: `getAllInvoices()` returns paginated invoice list sorted by issue date descending

- **Task 015: Invoice List Page UI** ✅ - 완료
  - ✅ Create `/admin/invoices` page displaying all invoices in a data table
  - ✅ Table columns: Invoice Number, Client Name, Issue Date, Valid Until, Status (Badge), Total Amount (KRW formatted)
  - ✅ Mobile responsive: switch to card layout on small screens (reuse pattern from invoice-detail)
  - ✅ Empty state when no invoices exist
  - Related files: `src/app/admin/invoices/page.tsx`, `src/components/admin/invoice-list.tsx`
  - Acceptance criteria: Invoice list page renders all invoices from Notion database with correct formatting

- **Task 016: Client Link Copy Feature** ✅ - 완료
  - ✅ Add a "Copy Link" button to each invoice row in the admin list
  - ✅ Copy the public invoice URL (`/invoice/[notionPageId]`) to clipboard using `navigator.clipboard.writeText()`
  - ✅ Show sonner toast confirmation on successful copy ("Link copied to clipboard")
  - Related files: `src/components/admin/copy-link-button.tsx`, `src/components/admin/invoice-list.tsx`
  - Acceptance criteria: Clicking "Copy Link" copies the correct public URL and shows a toast notification

- **Task 016-1: Admin Dashboard Integration Test** ✅ - 완료
  - ✅ Playwright MCP E2E test: admin page loads, invoice list displays, copy link works
  - ✅ Verify responsive layout at mobile/desktop breakpoints
  - ✅ Verify theme toggle switches between light/dark/system modes
  - ✅ Test empty state when no invoices are available
  - Related files: Playwright MCP test scenarios
  - Acceptance criteria: All admin dashboard user flows pass E2E testing

---

### Phase 6.5: Admin Authentication ✅

**Goal:** Protect admin pages with password-based authentication so only authorized users can access the admin dashboard.

- **Task 016-2: Auth Utility & Environment Setup** ✅ - 완료
  - ✅ Create `src/lib/auth.ts` with Web Crypto API HMAC-SHA256 token creation/verification
  - ✅ Add `ADMIN_PASSWORD` environment variable to `.env.local` and `src/lib/env.ts`
  - ✅ Edge Runtime compatible (crypto.subtle instead of Node.js crypto)
  - Related files: `src/lib/auth.ts`, `src/lib/env.ts`, `.env.local`

- **Task 016-3: Login Page & Auth API Routes** ✅ - 완료
  - ✅ Create `/admin/login` page with React Hook Form + Zod validation
  - ✅ Create `POST /api/admin/login` route (password validation + HttpOnly session cookie)
  - ✅ Create `POST /api/admin/logout` route (cookie clearing)
  - Related files: `src/app/admin/login/page.tsx`, `src/app/api/admin/login/route.ts`, `src/app/api/admin/logout/route.ts`

- **Task 016-4: Middleware Protection & UI Updates** ✅ - 완료
  - ✅ Create `src/middleware.ts` protecting `/admin/*` routes (except `/admin/login`)
  - ✅ Add "관리자 페이지" link to landing page (`src/app/page.tsx`)
  - ✅ Add LogoutButton to admin layout header (`src/components/admin/logout-button.tsx`)
  - Related files: `src/middleware.ts`, `src/app/page.tsx`, `src/components/admin/logout-button.tsx`

---

### Phase 7: Dark Mode Integration

**Goal:** Wire up the existing ThemeToggle component into the application so users can switch between light, dark, and system themes.

- [ ] **Task 017: Dark Mode Toggle Integration & Verification**
  - Integrate ThemeToggle into the public invoice page header (alongside PDF download button)
  - Verify all existing components render correctly in dark mode (invoice-detail, loading, error, 404, PDF download button)
  - Fix any color contrast or styling issues in dark mode (check Badge, Alert, Card, Table components)
  - Verify dark mode persists across page navigation (next-themes cookie/localStorage)
  - Related files: `src/components/theme-toggle.tsx`, `src/components/invoice/invoice-detail.tsx`, `src/app/not-found.tsx`
  - Acceptance criteria: Theme toggle is visible on all pages, switching themes works instantly, dark mode renders all components correctly

- [ ] **Task 017-1: Dark Mode E2E Test**
  - Playwright MCP test: toggle between light/dark/system on invoice page and admin page
  - Verify visual consistency in both themes (no invisible text, broken borders, or contrast issues)
  - Test theme persistence after page reload
  - Related files: Playwright MCP test scenarios
  - Acceptance criteria: Theme switching works correctly across all pages with no visual regressions

---

### Phase 8: Polish & Deployment

**Goal:** Final quality assurance and production readiness.

- [ ] **Task 018: Build Verification & Documentation Update**
  - Run `npm run check-all` and `npm run build` to confirm zero errors
  - Update README.md with new admin routes and dark mode feature
  - Update PRD.md to reflect completed post-MVP features
  - Add admin page routes to the Pages table in README
  - Related files: `README.md`, `docs/PRD.md`
  - Acceptance criteria: All checks pass, documentation accurately reflects current features

---

## Risk Register

| Risk                                                        | Impact                                       | Mitigation                                                                           |
| ----------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Notion API rate limiting (3 req/sec) on admin list page     | Medium -- slow list loads with many invoices | Implement pagination with cursor-based fetching; consider ISR caching for admin list |
| Notion `databases.query()` returns max 100 results per call | Medium -- incomplete invoice list            | Implement cursor-based pagination to fetch all pages                                 |
| Dark mode styling inconsistencies with shadcn/ui            | Low -- visual bugs                           | shadcn/ui components support dark mode natively; verify with Playwright screenshots  |
| ~~Admin page accessible without authentication~~            | ~~Low -- data exposure for MVP~~             | ✅ Resolved: Password-based auth with HMAC session cookies implemented in Phase 6.5  |

---

## Definition of Done

- [x] ~~MVP: All 12 tasks completed~~
- [x] Admin dashboard displays all invoices from Notion
- [x] Copy link feature works with clipboard and toast feedback
- [x] Admin authentication with password-based login
- [ ] Dark mode toggle visible and functional on all pages
- [ ] `npm run check-all` passes with zero errors
- [ ] `npm run build` succeeds without warnings
- [ ] Responsive layout verified at mobile, tablet, and desktop breakpoints
- [ ] All E2E tests pass via Playwright MCP

---

## Future Roadmap (Out of Scope)

### Phase 9: Authentication & Security (Partially Completed)

- ~~Admin page authentication~~ ✅ (Implemented in Phase 6.5 with HMAC session cookies)
- Role-based access control
- OAuth integration (NextAuth.js or Clerk) for multi-user support

### Phase 10: Automation

- Email delivery via SendGrid or Resend
- Invoice expiry notifications
- Client response tracking

### Phase 11: Advanced Features

- Invoice search and filtering on admin page
- Invoice status management (approve/reject from admin)
- Multiple PDF template designs
- Multi-language invoice support
- Electronic signature integration
- Invoice version history
