import { Container } from '@/components/layout/container'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading skeleton for the invoice detail page.
 * Mirrors the exact layout structure of InvoiceDetail component
 * to prevent layout shift during data fetching.
 */
export default function InvoiceLoading() {
  return (
    <main className="min-h-screen py-8 md:py-12">
      <Container size="md">
        <div className="space-y-6">
          {/* Section 1: Header — invoice number + status badge */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              {/* Label: "견적서 번호" */}
              <Skeleton className="h-4 w-20" />
              {/* Invoice number title */}
              <Skeleton className="h-8 w-48" />
            </div>
            {/* Status badge */}
            <Skeleton className="h-6 w-20" />
          </div>

          <Separator />

          {/* Section 2: Date and client info grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Issue date */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            {/* Expiry date */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            {/* Client name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          <Separator />

          {/* Section 3: Invoice items */}
          <div>
            {/* Section title: "견적 항목" */}
            <Skeleton className="mb-4 h-6 w-24" />

            {/* Desktop: table layout (visible on md and above) */}
            <div className="hidden md:block">
              {/* Table header row */}
              <div className="mb-3 grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Table data rows — 3 items */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="mb-3 grid grid-cols-4 gap-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>

            {/* Mobile: card layout (visible below md) */}
            <div className="space-y-3 md:hidden">
              {/* Card items — 3 cards */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2 rounded-lg border p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Section 4: Total amount — right-aligned */}
          <div className="flex justify-end">
            <div className="space-y-2 text-right">
              {/* Label: "합계 금액" */}
              <Skeleton className="ml-auto h-4 w-16" />
              {/* Total amount */}
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
