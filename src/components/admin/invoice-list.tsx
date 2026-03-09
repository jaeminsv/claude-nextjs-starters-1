import type { InvoiceListItem } from '@/types/invoice'
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
import { formatKRW, formatDate } from '@/lib/format'
import { getStatusBadge } from '@/lib/invoice-utils'
import { CopyLinkButton } from '@/components/admin/copy-link-button'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface InvoiceListProps {
  invoices: InvoiceListItem[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * InvoiceList — displays all invoices in a responsive layout.
 * Desktop (md+): data table with sortable columns.
 * Mobile (<md): card list with key information.
 *
 * Each row/card includes a CopyLinkButton to copy the public invoice URL.
 * Follows the same responsive pattern as invoice-detail.tsx.
 */
export function InvoiceList({ invoices }: InvoiceListProps) {
  // Empty state when no invoices exist in the database
  if (invoices.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center">
        <p>등록된 견적서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Desktop view: Table layout (hidden on small screens) */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>견적서 번호</TableHead>
              <TableHead>고객사</TableHead>
              <TableHead>발행일</TableHead>
              <TableHead>유효기간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">합계</TableHead>
              <TableHead className="w-[60px]">링크</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => {
              const statusBadge = getStatusBadge(invoice.status)
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.validUntil)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatKRW(invoice.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <CopyLinkButton invoiceId={invoice.id} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view: Card list layout (shown only on small screens) */}
      <div className="space-y-3 md:hidden">
        {invoices.map(invoice => {
          const statusBadge = getStatusBadge(invoice.status)
          return (
            <Card key={invoice.id} className="gap-3 py-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {invoice.invoiceNumber}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                    <CopyLinkButton invoiceId={invoice.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  {/* Client name */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">고객사</span>
                    <span>{invoice.clientName}</span>
                  </div>
                  {/* Issue date */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">발행일</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  {/* Valid until */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">유효기간</span>
                    <span>{formatDate(invoice.validUntil)}</span>
                  </div>
                  {/* Total amount */}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>합계</span>
                    <span>{formatKRW(invoice.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
