import { Container } from '@/components/layout/container'

/**
 * Custom 404 Not Found page.
 * Displayed when a user accesses an invoice URL with an invalid or missing ID.
 * Guides the user to contact the invoice issuer for the correct link.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="text-center">
          {/* Large 404 indicator */}
          <p className="text-muted-foreground text-base font-semibold">404</p>

          {/* Main error message */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            견적서를 찾을 수 없습니다
          </h1>

          {/* Helpful guidance for the user */}
          <p className="text-muted-foreground mt-6 text-base leading-relaxed">
            요청하신 견적서가 존재하지 않거나 삭제되었을 수 있습니다.
            <br />
            올바른 링크는 견적서 발행자에게 문의해 주세요.
          </p>
        </div>
      </Container>
    </main>
  )
}
