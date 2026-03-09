import type { Metadata } from 'next'
import { getAllInvoices } from '@/lib/notion'
import { InvoiceList } from '@/components/admin/invoice-list'

/**
 * Metadata for the admin invoice list page.
 * Shown in the browser tab and used by search engines.
 */
export const metadata: Metadata = {
  title: '견적서 목록 - Invoice Admin',
  description: '발행된 견적서 목록을 확인하고 클라이언트 링크를 복사합니다.',
}

/**
 * Admin invoice list page — Server Component that fetches all invoices
 * from the Notion database and renders them in a responsive table/card layout.
 */
export default async function AdminInvoicesPage() {
  // Fetch all invoices from Notion (sorted by issue date, newest first)
  const invoices = await getAllInvoices()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 목록</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          발행된 견적서를 확인하고 클라이언트에게 보낼 링크를 복사하세요.
        </p>
      </div>

      {/* Invoice list with responsive table/card layout */}
      <InvoiceList invoices={invoices} />
    </div>
  )
}
