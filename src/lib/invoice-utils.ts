import type { InvoiceStatus } from '@/types/invoice'

/**
 * Returns the appropriate Badge variant and label for each invoice status.
 * Shared between invoice-detail.tsx (public view) and invoice-list.tsx (admin view).
 *
 * - pending: yellow/warning look ("검토 중")
 * - approved: green/success look ("승인됨")
 * - rejected: red/destructive look ("반려됨")
 */
export function getStatusBadge(status: InvoiceStatus): {
  className: string
  label: string
} {
  const statusConfig = {
    pending: {
      className:
        'border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      label: '검토 중',
    },
    approved: {
      className:
        'border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
      label: '승인됨',
    },
    rejected: {
      className:
        'border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
      label: '반려됨',
    },
  }

  return statusConfig[status]
}
