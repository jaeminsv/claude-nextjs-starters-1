import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/layout/container'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/admin/logout-button'

/**
 * Admin layout wrapping all /admin/* pages.
 * Provides a consistent header with app branding and theme toggle,
 * and a main content area wrapped in a responsive Container.
 *
 * ThemeProvider is already configured in the root layout,
 * so ThemeToggle works without any additional setup here.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      {/* Admin header with branding and theme toggle */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/admin" className="text-lg font-semibold tracking-tight">
          Invoice Admin
        </Link>
        <div className="flex items-center gap-2">
          <LogoutButton />
          <ThemeToggle />
        </div>
      </header>

      <Separator />

      {/* Main content area with responsive container */}
      <main className="py-6">
        <Container size="lg">{children}</Container>
      </main>
    </div>
  )
}
