'use client'

/**
 * Admin login page — password-based authentication form.
 *
 * Uses React Hook Form + Zod for form validation,
 * and shadcn/ui components for consistent UI styling.
 *
 * On successful login, redirects to /admin/invoices.
 * On failure, shows an inline error message.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Container } from '@/components/layout/container'

// ---------------------------------------------------------------------------
// Zod schema for login form validation
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize React Hook Form with Zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.password }),
      })

      if (response.ok) {
        // Login successful — redirect to admin dashboard
        router.push('/admin/invoices')
      } else {
        // Login failed — show error message
        const data = await response.json()
        setError(data.error || '로그인에 실패했습니다.')
      }
    } catch {
      setError('서버에 연결할 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="mx-auto max-w-sm">
          <Card>
            <CardHeader className="text-center">
              {/* Lock icon for visual cue */}
              <div className="bg-muted mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                <Lock className="text-muted-foreground h-5 w-5" />
              </div>
              <CardTitle className="text-xl">관리자 로그인</CardTitle>
              <CardDescription>
                관리자 페이지에 접속하려면 비밀번호를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Password input field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Server-side error message */}
                  {error && <p className="text-destructive text-sm">{error}</p>}

                  {/* Submit button with loading state */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    로그인
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  )
}
