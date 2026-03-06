// Invoice status options for tracking quote lifecycle
export type InvoiceStatus = 'pending' | 'approved' | 'rejected'

// Individual line item in an invoice
export interface InvoiceItem {
  id: string // Notion page ID for this item
  description: string // Item description/name
  quantity: number // Number of units
  unitPrice: number // Price per unit
  amount: number // Total (quantity × unitPrice)
}

// Complete invoice data structure
export interface Invoice {
  id: string // Notion page ID
  invoiceNumber: string // Display invoice number (e.g., "INV-001")
  clientName: string // Client/customer name
  issueDate: string // ISO date string for issue date
  validUntil: string // ISO date string for expiration
  totalAmount: number // Sum of all item amounts
  status: InvoiceStatus // Current invoice status
  items: InvoiceItem[] // Line items
}
