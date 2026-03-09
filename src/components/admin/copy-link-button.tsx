'use client'

/**
 * CopyLinkButton — Client Component that copies the public invoice URL to clipboard.
 * Uses the Clipboard API and shows a toast notification via Sonner.
 * The URL is constructed dynamically using window.location.origin,
 * so it works on any domain (localhost, Vercel, custom domain).
 */

import { Link2, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface CopyLinkButtonProps {
  /** Notion page ID of the invoice to generate the public URL for */
  invoiceId: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function CopyLinkButton({ invoiceId }: CopyLinkButtonProps) {
  // Track copied state to show check icon briefly after copy
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopy() {
    // Build the public invoice URL using the current domain
    const url = `${window.location.origin}/invoice/${invoiceId}`

    try {
      await navigator.clipboard.writeText(url)
      toast.success('링크가 복사되었습니다')

      // Show check icon for 2 seconds after successful copy
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      title="클라이언트 링크 복사"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
    </Button>
  )
}
