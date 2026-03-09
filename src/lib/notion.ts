import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
import { env } from '@/lib/env'

// Lazy-initialized Notion client instance (created on first API call)
let notionClient: Client | null = null

/**
 * Returns the Notion client instance, creating it on first call.
 * Throws a clear error if NOTION_API_KEY is not configured.
 * This "lazy initialization" pattern avoids crashing at startup
 * when env vars are not yet set up.
 */
function getNotionClient(): Client {
  if (!notionClient) {
    if (!env.NOTION_API_KEY) {
      throw new Error(
        'NOTION_API_KEY is not configured. Please set it in .env.local'
      )
    }
    notionClient = new Client({ auth: env.NOTION_API_KEY })
  }
  return notionClient
}

/**
 * Validates that the Notion Items database ID is configured.
 * Throws a clear error message if missing.
 */
function getItemsDatabaseId(): string {
  if (!env.NOTION_ITEMS_DATABASE_ID) {
    throw new Error(
      'NOTION_ITEMS_DATABASE_ID is not configured. Please set it in .env.local'
    )
  }
  return env.NOTION_ITEMS_DATABASE_ID
}

/**
 * Extracts plain text from a Notion title or rich_text property.
 * Notion stores text as an array of rich text objects, so we need to join them.
 *
 * @param page - The Notion page response object
 * @param propertyName - The name of the property to extract text from
 * @returns The extracted plain text string, or empty string if not found
 */
export function getTextProperty(
  page: PageObjectResponse,
  propertyName: string
): string {
  const property = page.properties[propertyName]
  if (!property) return ''

  // Handle title type (used for the primary name field in a database)
  if (property.type === 'title') {
    return property.title.map(text => text.plain_text).join('')
  }

  // Handle rich_text type (used for regular text fields)
  if (property.type === 'rich_text') {
    return property.rich_text.map(text => text.plain_text).join('')
  }

  return ''
}

/**
 * Extracts a number value from a Notion number property.
 *
 * @param page - The Notion page response object
 * @param propertyName - The name of the number property
 * @returns The number value, or 0 if not found
 */
export function getNumberProperty(
  page: PageObjectResponse,
  propertyName: string
): number {
  const property = page.properties[propertyName]
  if (!property || property.type !== 'number') return 0
  return property.number ?? 0
}

/**
 * Extracts a date string from a Notion date property.
 * Notion date properties contain a start date (and optional end date).
 *
 * @param page - The Notion page response object
 * @param propertyName - The name of the date property
 * @returns The ISO date string (e.g., "2024-01-15"), or empty string if not found
 */
export function getDateProperty(
  page: PageObjectResponse,
  propertyName: string
): string {
  const property = page.properties[propertyName]
  if (!property || property.type !== 'date') return ''
  return property.date?.start ?? ''
}

/**
 * Extracts the selected option value from a Notion select or status property.
 * Both "select" and "status" property types store a single chosen option with a name.
 * Notion's "Status" column uses the "status" type (not "select"), so we handle both.
 *
 * @param page - The Notion page response object
 * @param propertyName - The name of the select/status property
 * @returns The selected option name (lowercased for consistent comparison), or empty string if not found
 */
export function getSelectProperty(
  page: PageObjectResponse,
  propertyName: string
): string {
  const property = page.properties[propertyName]
  if (!property) return ''

  // Handle "select" type (dropdown with custom options)
  if (property.type === 'select') {
    return property.select?.name?.toLowerCase() ?? ''
  }

  // Handle "status" type (Notion's built-in status column: To-do, In progress, Done, etc.)
  if (property.type === 'status') {
    return property.status?.name?.toLowerCase() ?? ''
  }

  return ''
}

/**
 * Fetches all line items from the Items database that belong to a specific invoice.
 * Uses a relation filter to find items linked to the given invoice page ID.
 *
 * @param invoicePageId - The Notion page ID of the parent invoice
 * @returns An array of InvoiceItem objects
 */
export async function getInvoiceItems(
  invoicePageId: string
): Promise<InvoiceItem[]> {
  // Query the Items database, filtering by the relation to the parent invoice
  const response = await getNotionClient().databases.query({
    database_id: getItemsDatabaseId(),
    filter: {
      property: 'Invoice', // This must match the relation property name in your Notion Items database
      relation: {
        contains: invoicePageId,
      },
    },
  })

  // Map each Notion page to our InvoiceItem shape
  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(page => {
      const quantity = getNumberProperty(page, 'Quantity')
      const unitPrice = getNumberProperty(page, 'UnitPrice')

      return {
        id: page.id,
        description: getTextProperty(page, 'Description'),
        quantity,
        unitPrice,
        // Calculate total amount for this line item
        amount: quantity * unitPrice,
      }
    })
}

/**
 * Fetches a single invoice and its line items from Notion by page ID.
 * Combines data from the Invoices database page and the related Items database records.
 *
 * @param pageId - The Notion page ID of the invoice
 * @returns The complete Invoice object, or null if not found or an error occurs
 */
export async function getInvoiceById(pageId: string): Promise<Invoice | null> {
  try {
    // Retrieve the invoice page from Notion
    const page = await getNotionClient().pages.retrieve({ page_id: pageId })

    // Ensure the response is a full page object (not a partial response)
    if (!('properties' in page)) return null

    // Fetch all line items related to this invoice
    const items = await getInvoiceItems(pageId)

    // Calculate the total amount by summing all item amounts
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

    // Extract the status and validate it matches our InvoiceStatus type
    const rawStatus = getSelectProperty(page, 'Status')
    const status: InvoiceStatus = ['pending', 'approved', 'rejected'].includes(
      rawStatus
    )
      ? (rawStatus as InvoiceStatus)
      : 'pending' // Default to 'pending' if an unexpected value is returned

    return {
      id: page.id,
      invoiceNumber: getTextProperty(page, 'InvoiceNumber'),
      clientName: getTextProperty(page, 'ClientName'),
      issueDate: getDateProperty(page, 'IssueDate'),
      validUntil: getDateProperty(page, 'ValidUntil'),
      totalAmount,
      status,
      items,
    }
  } catch (error) {
    // Log the error for debugging purposes, but return null gracefully
    // This handles cases where the page doesn't exist or the ID is invalid
    console.error(`Failed to fetch invoice with ID "${pageId}":`, error)
    return null
  }
}
