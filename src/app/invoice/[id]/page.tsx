import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInvoiceById } from '@/lib/notion'
import { InvoiceDetail } from '@/components/invoice/invoice-detail'
import { Container } from '@/components/layout/container'

// Props type for dynamic route pages in Next.js App Router
interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * Generates dynamic metadata for the invoice page.
 * This runs on the server before the page renders, allowing us to set
 * the browser tab title and other SEO metadata based on the invoice data.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Await the params since Next.js 15 makes params a Promise
  const { id } = await params
  const invoice = await getInvoiceById(id)

  // If invoice not found, return generic metadata
  if (!invoice) {
    return {
      title: '견적서를 찾을 수 없습니다',
    }
  }

  return {
    title: `${invoice.invoiceNumber} - ${invoice.clientName} 견적서`,
    description: `${invoice.clientName}에게 발행된 견적서 ${invoice.invoiceNumber}`,
  }
}

/**
 * Invoice detail page - a Server Component that fetches and displays a single invoice.
 * The [id] segment in the URL corresponds to the Notion page ID of the invoice.
 *
 * Example URL: /invoice/abc123def456...
 */
export default async function InvoicePage({ params }: PageProps) {
  // Await the params since Next.js 15 makes params a Promise
  const { id } = await params

  // Fetch the invoice data from Notion using the page ID from the URL
  const invoice = await getInvoiceById(id)

  // If no invoice is found (invalid ID or deleted page), show the 404 page
  if (!invoice) {
    notFound()
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <Container size="md">
        <InvoiceDetail invoice={invoice} />
      </Container>
    </main>
  )
}
