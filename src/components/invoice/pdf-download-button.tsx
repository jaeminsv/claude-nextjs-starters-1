'use client'

/**
 * PdfDownloadButton — client component that triggers PDF download.
 *
 * Flow:
 *   1. User clicks the button
 *   2. fetch() calls GET /api/invoice/[id]/pdf
 *   3. Response blob is converted to an object URL
 *   4. A temporary <a> element is programmatically clicked to trigger download
 *   5. The object URL is revoked to free memory
 *
 * On error, a toast notification is shown via Sonner.
 */

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface PdfDownloadButtonProps {
  /** Notion page ID of the invoice to download */
  invoiceId: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PdfDownloadButton({ invoiceId }: PdfDownloadButtonProps) {
  // Track loading state to show spinner and disable button during fetch
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    setIsLoading(true)

    try {
      // Request PDF generation from the API route
      const response = await fetch(`/api/invoice/${invoiceId}/pdf`)

      if (!response.ok) {
        // Handle non-2xx responses (e.g., 404 Not Found, 500 Server Error)
        throw new Error(`서버 오류: ${response.status}`)
      }

      // Convert the response stream to a Blob for download
      const blob = await response.blob()

      // Create a temporary object URL pointing to the blob data
      const url = URL.createObjectURL(blob)

      // Create a hidden anchor element and programmatically trigger the download
      const anchor = document.createElement('a')
      anchor.href = url
      // Extract filename from Content-Disposition header if available,
      // otherwise fall back to a generic name
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      anchor.download = filenameMatch ? filenameMatch[1] : 'invoice.pdf'

      // Append to DOM, click, then immediately remove to clean up
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)

      // Release the object URL to free browser memory
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download failed:', error)
      toast.error('PDF 다운로드에 실패했습니다.')
    } finally {
      // Always reset loading state regardless of success or failure
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        // Show spinner while fetching / rendering PDF
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        // Show download icon when idle
        <Download className="mr-2 h-4 w-4" />
      )}
      PDF 다운로드
    </Button>
  )
}
