'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary UI for the invoice detail page.
 * Displays a destructive alert with a retry button when
 * an unexpected error occurs during invoice data fetching.
 */
export default function InvoiceError({ error, reset }: ErrorProps) {
  // Log the error to the console for debugging purposes
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        {/* Destructive alert with error details */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류가 발생했습니다</AlertTitle>
          <AlertDescription>
            견적서를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해
            주세요.
          </AlertDescription>
        </Alert>

        {/* Retry button — triggers Next.js error boundary reset */}
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>다시 시도</Button>
        </div>
      </Container>
    </main>
  )
}
