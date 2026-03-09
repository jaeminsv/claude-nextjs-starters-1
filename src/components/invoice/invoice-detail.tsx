import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatKRW, formatDate } from '@/lib/format'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'
import { AlertCircle, Clock } from 'lucide-react'

// Props for the InvoiceDetail component
interface InvoiceDetailProps {
  invoice: Invoice
}

/**
 * Determines the expiration status of an invoice.
 * Returns null if validUntil is empty, otherwise returns
 * the status type and days remaining.
 */
function getExpirationStatus(validUntil: string): {
  type: 'expired' | 'expiring-soon' | 'valid'
  daysLeft: number
} | null {
  if (!validUntil) return null
  const expDate = new Date(validUntil)
  expDate.setHours(23, 59, 59, 999) // End of expiration day
  const now = new Date()
  const daysLeft = Math.ceil(
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysLeft < 0) return { type: 'expired', daysLeft }
  if (daysLeft <= 7) return { type: 'expiring-soon', daysLeft }
  return { type: 'valid', daysLeft }
}

/**
 * Returns the appropriate Badge variant and label for each invoice status.
 * - pending: yellow/warning look
 * - approved: green/success look
 * - rejected: red/destructive look
 */
function getStatusBadge(status: InvoiceStatus) {
  const statusConfig = {
    pending: {
      // Using outline variant with custom class for yellow color
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

/**
 * InvoiceDetail component - displays the full content of an invoice.
 * This is a Server Component (no 'use client' directive needed).
 *
 * Layout structure:
 * 1. Invoice header: invoice number + status badge
 * 2. Date info: issue date and expiration date
 * 3. Client info: client name
 * 4. Items table: line items with quantity, unit price, and total
 * 5. Total amount summary
 */
export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const statusBadge = getStatusBadge(invoice.status)
  // Calculate expiration status using server time
  const expirationStatus = getExpirationStatus(invoice.validUntil)

  return (
    <div className="space-y-6">
      {/* Section 1: Invoice header with number and status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">견적서 번호</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {invoice.invoiceNumber}
          </h1>
        </div>
        {/* Right side: status badge + PDF download button */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
          {/* Client component rendered inside this Server Component — valid in Next.js App Router */}
          <PdfDownloadButton invoiceId={invoice.id} />
        </div>
      </div>

      {/* Expiration warning banner — shown only when expired or expiring within 7 days */}
      {expirationStatus?.type === 'expired' && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>견적서가 만료되었습니다</AlertTitle>
          <AlertDescription>
            이 견적서의 유효기간이 지났습니다. 새로운 견적서를 요청해 주세요.
          </AlertDescription>
        </Alert>
      )}
      {expirationStatus?.type === 'expiring-soon' && (
        <Alert className="border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
          <Clock className="size-4 text-yellow-700 dark:text-yellow-300" />
          <AlertTitle>견적서 만료 임박</AlertTitle>
          <AlertDescription>
            {expirationStatus.daysLeft === 0
              ? '이 견적서는 오늘 만료됩니다.'
              : `이 견적서는 ${expirationStatus.daysLeft}일 후에 만료됩니다.`}
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Section 2: Date and client information */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Issue date */}
        <div>
          <p className="text-muted-foreground text-sm">발행일</p>
          <p className="mt-1 font-medium">{formatDate(invoice.issueDate)}</p>
        </div>

        {/* Expiration date */}
        <div>
          <p className="text-muted-foreground text-sm">유효기간</p>
          <p className="mt-1 font-medium">{formatDate(invoice.validUntil)}</p>
        </div>

        {/* Client name */}
        <div>
          <p className="text-muted-foreground text-sm">고객사</p>
          <p className="mt-1 font-medium">{invoice.clientName}</p>
        </div>
      </div>

      <Separator />

      {/* Section 3: Line items */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">견적 항목</h2>

        {/* Desktop view: Table layout (hidden on small screens) */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">항목 설명</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.length === 0 ? (
                // Show a message when there are no items
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground text-center"
                  >
                    항목이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                invoice.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity.toLocaleString('ko-KR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatKRW(item.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view: Card list layout (shown only on small screens) */}
        <div className="space-y-3 md:hidden">
          {invoice.items.length === 0 ? (
            <p className="text-muted-foreground text-center">
              항목이 없습니다.
            </p>
          ) : (
            invoice.items.map(item => (
              <Card key={item.id} className="gap-3 py-4">
                <CardHeader>
                  <CardTitle className="text-base">
                    {item.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {/* Quantity row */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">수량</span>
                      <span>{item.quantity.toLocaleString('ko-KR')}</span>
                    </div>
                    {/* Unit price row */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">단가</span>
                      <span>{formatKRW(item.unitPrice)}</span>
                    </div>
                    {/* Total amount row */}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>금액</span>
                      <span>{formatKRW(item.amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Separator />

      {/* Section 4: Total amount summary */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-muted-foreground text-sm">합계 금액</p>
          <p className="text-2xl font-bold md:text-3xl">
            {formatKRW(invoice.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}
