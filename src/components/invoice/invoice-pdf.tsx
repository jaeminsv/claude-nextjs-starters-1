/**
 * InvoicePDF component — server-side only.
 * Rendered via @react-pdf/renderer's renderToStream in the API route.
 * Do NOT import this file from any client component or page.
 *
 * Layout sections (mirrors invoice-detail.tsx structure):
 *  1. Header   — invoice number (large bold) + status text
 *  2. Separator
 *  3. Info Grid — issue date / valid until / client name (3-column row)
 *  4. Separator
 *  5. Items Table — header row + data rows
 *  6. Separator
 *  7. Total Amount — right-aligned, large bold
 */

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { formatKRW, formatDate } from '@/lib/format'
import { FONT_FAMILY } from '@/lib/fonts'

// ---------------------------------------------------------------------------
// Styles — all layout is done via StyleSheet, never Tailwind
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  // A4 page with comfortable padding
  page: {
    padding: 40,
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    color: '#111827',
  },

  // Section 1: Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  numberLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },

  // Section 2 & 4 & 6: Horizontal separator line
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 12,
  },

  // Section 3: Info grid (3 columns)
  infoGrid: {
    flexDirection: 'row',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Section 5: Items table
  tableContainer: {
    marginTop: 4,
  },
  tableSectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  emptyRow: {
    paddingVertical: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Column widths (flex proportions matching web layout)
  colDesc: {
    flex: 4,
  },
  colNum: {
    flex: 1,
    textAlign: 'right',
  },

  // Section 7: Total amount
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalWrapper: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

// ---------------------------------------------------------------------------
// Helper — map InvoiceStatus to Korean display text
// ---------------------------------------------------------------------------
function getStatusText(status: InvoiceStatus): string {
  const statusMap: Record<InvoiceStatus, string> = {
    pending: '검토 중',
    approved: '승인됨',
    rejected: '반려됨',
  }
  return statusMap[status]
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface InvoicePDFProps {
  invoice: Invoice
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ---------------------------------------------------------------- */}
        {/* Section 1: Header — invoice number + status */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.numberLabel}>견적서 번호</Text>
            <Text style={styles.title}>{invoice.invoiceNumber}</Text>
          </View>
          <Text style={styles.statusText}>{getStatusText(invoice.status)}</Text>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Section 2: Separator */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.separator} />

        {/* ---------------------------------------------------------------- */}
        {/* Section 3: Info grid — issue date / valid until / client name */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.infoGrid}>
          {/* Issue date column */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>발행일</Text>
            <Text style={styles.infoValue}>
              {formatDate(invoice.issueDate)}
            </Text>
          </View>

          {/* Expiration date column */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>유효기간</Text>
            <Text style={styles.infoValue}>
              {formatDate(invoice.validUntil)}
            </Text>
          </View>

          {/* Client name column */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>고객사</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Section 4: Separator */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.separator} />

        {/* ---------------------------------------------------------------- */}
        {/* Section 5: Items table */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableSectionLabel}>견적 항목</Text>

          {/* Table header row */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDesc}>항목 설명</Text>
            <Text style={styles.colNum}>수량</Text>
            <Text style={styles.colNum}>단가</Text>
            <Text style={styles.colNum}>금액</Text>
          </View>

          {/* Table data rows */}
          {invoice.items.length === 0 ? (
            // Show placeholder when there are no line items
            <Text style={styles.emptyRow}>항목이 없습니다.</Text>
          ) : (
            invoice.items.map(item => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colNum}>
                  {item.quantity.toLocaleString('ko-KR')}
                </Text>
                <Text style={styles.colNum}>{formatKRW(item.unitPrice)}</Text>
                <Text style={styles.colNum}>{formatKRW(item.amount)}</Text>
              </View>
            ))
          )}
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Section 6: Separator */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.separator} />

        {/* ---------------------------------------------------------------- */}
        {/* Section 7: Total amount — right-aligned */}
        {/* ---------------------------------------------------------------- */}
        <View style={styles.totalSection}>
          <View style={styles.totalWrapper}>
            <Text style={styles.totalLabel}>합계 금액</Text>
            <Text style={styles.totalAmount}>
              {formatKRW(invoice.totalAmount)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
