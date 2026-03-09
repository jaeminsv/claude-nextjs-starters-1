/**
 * GET /api/invoice/[id]/pdf
 *
 * Generates a PDF for the given invoice ID and streams it to the client.
 * Uses @react-pdf/renderer (server-only) to render the InvoicePDF component.
 *
 * Response:
 *   200 — application/pdf stream with Content-Disposition: attachment
 *   404 — JSON { error: 'Not found' } when the invoice does not exist
 *   500 — JSON { error: 'PDF generation failed' } on render errors
 */

import React from 'react'
import { NextResponse, type NextRequest } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { getInvoiceById } from '@/lib/notion'
import { registerKoreanFonts } from '@/lib/fonts'
import { InvoicePDF } from '@/components/invoice/invoice-pdf'

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Next.js 15: params is a Promise, must be awaited
  const { id } = await params

  // Fetch invoice data from Notion
  const invoice = await getInvoiceById(id)

  if (!invoice) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    // Register Korean fonts before rendering — safe to call multiple times
    registerKoreanFonts()

    // Render the PDF component to a Node.js Readable stream
    const nodeStream = await renderToStream(<InvoicePDF invoice={invoice} />)

    // Convert Node.js Readable → Web ReadableStream (required by Next.js Response)
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer | string) => {
          // Enqueue each chunk as it arrives from the PDF renderer
          controller.enqueue(chunk)
        })
        nodeStream.on('end', () => {
          // Signal the end of the stream to the consumer
          controller.close()
        })
        nodeStream.on('error', (err: Error) => {
          // Propagate errors to the Web stream consumer
          controller.error(err)
        })
      },
    })

    // Return the PDF stream with appropriate headers
    return new Response(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        // Use the invoice number as the suggested filename for the download
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}
