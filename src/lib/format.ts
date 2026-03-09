/**
 * Shared formatting utilities used across the app and PDF renderer.
 * Extracted from invoice-detail.tsx so the same logic can be reused
 * in both the web UI and @react-pdf/renderer documents.
 */

/**
 * Formats a number as Korean Won currency string.
 * Example: 150000 → "150,000원"
 *
 * @param amount - The numeric amount to format
 * @returns Formatted Korean Won string
 */
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * Formats an ISO 8601 date string into a human-readable Korean date.
 * Example: "2024-01-15" → "2024년 1월 15일"
 *
 * Returns "-" if the input string is empty or falsy,
 * which handles cases where optional date fields are not set.
 *
 * @param isoDate - ISO 8601 date string (e.g. "2024-01-15")
 * @returns Localized Korean date string, or "-" if input is empty
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '-'
  return new Date(isoDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
