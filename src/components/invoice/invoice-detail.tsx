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

// Props for the InvoiceDetail component
interface InvoiceDetailProps {
  invoice: Invoice
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
 * Formats a number as Korean Won currency.
 * Example: 150000 → "150,000원"
 */
function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * Formats an ISO date string to a localized Korean date.
 * Example: "2024-01-15" → "2024년 1월 15일"
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return '-'
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
        <Badge variant="outline" className={statusBadge.className}>
          {statusBadge.label}
        </Badge>
      </div>

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
              <Card key={item.id}>
                <CardHeader className="pb-2">
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
