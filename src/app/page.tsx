import { Container } from '@/components/layout/container'

/**
 * Home page for the Invoice Management System.
 * Since this system is link-based (invoices are accessed via shared URLs),
 * the home page simply guides users to access their invoice via the shared link.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="text-center">
          {/* App title */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            견적서 관리 시스템
          </h1>

          {/* Instruction message */}
          <p className="text-muted-foreground mt-6 text-base leading-relaxed">
            이 페이지는 견적서 관리 시스템입니다.
            <br />
            공유받은 링크를 통해 견적서에 접속해 주세요.
          </p>
        </div>
      </Container>
    </main>
  )
}
