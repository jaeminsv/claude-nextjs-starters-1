import { redirect } from 'next/navigation'

/**
 * Admin root page — immediately redirects to the invoice list.
 * This ensures /admin always lands on /admin/invoices,
 * which is the primary admin view.
 */
export default function AdminPage() {
  redirect('/admin/invoices')
}
