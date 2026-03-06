# Invoice Web — Notion-Based Invoice Management System

A lightweight invoice management system that uses Notion as a database. Freelancers and small businesses manage invoices in Notion, then share a unique URL with clients so they can view and download the invoice as a PDF.

## Project Overview

**Purpose**: Use Notion as the data source to manage invoices and allow clients to view and download them as PDFs via a web URL.

**Target Users**:

- Invoice issuers (freelancers / small businesses) — manage invoices directly in Notion
- Clients (invoice recipients) — access invoices via a shared link

**MVP Scope**: Public invoice viewer with Notion API integration and PDF download. No admin dashboard — Notion is used directly as the CMS.

## Pages

| Route                     | Description                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `/invoice/[notionPageId]` | Invoice detail page — displays invoice data fetched from Notion and provides a PDF download button |
| `404`                     | Shown when an invalid or deleted invoice ID is accessed                                            |

## Core Features

- **F001 — Notion Integration**: Fetch invoice data in real time via the Notion API
- **F002 — Invoice Viewer**: Display invoice details (number, client, dates, line items, total) from a unique URL
- **F003 — PDF Download**: Generate and download the invoice as a PDF file
- **F010 — URL Generation**: Notion page ID is used as the unique invoice URL segment
- **F011 — Validation**: Returns a 404 page for invalid or missing invoice IDs
- **F012 — Responsive Layout**: Works on mobile, tablet, and desktop

## Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Framework          | Next.js 15.5.3 (App Router + Turbopack)     |
| Runtime            | React 19.1.0 + TypeScript 5                 |
| Styling            | TailwindCSS v4 + shadcn/ui (new-york style) |
| Notion Integration | @notionhq/client (official SDK)             |
| PDF Generation     | @react-pdf/renderer                         |
| Deployment         | Vercel                                      |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your Notion credentials:

```bash
cp .env.local.example .env.local
```

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_INVOICES_DATABASE_ID=xxxxxxxxxxxxx
NOTION_ITEMS_DATABASE_ID=xxxxxxxxxxxxx
```

### 3. Set up Notion

1. Go to [Notion Integrations](https://www.notion.so/my-integrations) and create a new integration
2. Copy the **Internal Integration Token** → paste as `NOTION_API_KEY`
3. Create an **Invoices** database in Notion with these properties:

   | Property Name | Type                                   |
   | ------------- | -------------------------------------- |
   | InvoiceNumber | Title                                  |
   | ClientName    | Text                                   |
   | IssueDate     | Date                                   |
   | ValidUntil    | Date                                   |
   | Status        | Select (pending / approved / rejected) |
   | Items         | Relation → Items database              |

4. Create an **Items** database with these properties:

   | Property Name | Type                                             |
   | ------------- | ------------------------------------------------ |
   | Description   | Title                                            |
   | Quantity      | Number                                           |
   | UnitPrice     | Number                                           |
   | Amount        | Formula (`prop("Quantity") * prop("UnitPrice")`) |
   | Invoice       | Relation → Invoices database                     |

5. Share both databases with your integration (open database → "..." → "Add connections")
6. Copy each database ID from its URL and paste into `.env.local`

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000/invoice/YOUR_NOTION_PAGE_ID](http://localhost:3000) to view an invoice.

### 5. Build for production

```bash
npm run build
npm run start
```

## Development

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run check-all    # Run typecheck + lint + format check
npm run typecheck    # TypeScript type check
npm run lint         # ESLint
npm run format       # Prettier (write)
```

## Project Structure

```
src/
  app/
    invoice/[id]/
      page.tsx         # Invoice detail page (Server Component)
    not-found.tsx      # 404 page for invalid invoice IDs
    layout.tsx         # Root layout
    globals.css        # Global styles
  components/
    invoice/
      invoice-detail.tsx    # Invoice display component
    layout/
      container.tsx         # Responsive container wrapper
    ui/                     # shadcn/ui components
  lib/
    notion.ts          # Notion API client and data fetchers
    env.ts             # Environment variable validation (Zod)
    utils.ts           # Utility helpers
  types/
    invoice.ts         # TypeScript types (Invoice, InvoiceItem, InvoiceStatus)
```

## Deployment

Deploy to Vercel in one command:

```bash
vercel deploy
```

Add the following environment variables in the Vercel project settings:

- `NOTION_API_KEY`
- `NOTION_INVOICES_DATABASE_ID`
- `NOTION_ITEMS_DATABASE_ID`

## Documentation

- [PRD — Product Requirements](./docs/PRD.md)
- [Development Roadmap](./docs/ROADMAP.md)
- [Development Guide](./CLAUDE.md)
