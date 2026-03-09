'use client'

/**
 * LogoutButton — Client Component that logs out the admin user.
 * Calls POST /api/admin/logout to clear the session cookie,
 * then redirects to the login page.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)

    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      // Redirect to login page after logout
      router.push('/admin/login')
    } catch {
      // Even if the API call fails, redirect to login
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      disabled={isLoading}
      title="로그아웃"
    >
      <LogOut className="mr-1 h-4 w-4" />
      로그아웃
    </Button>
  )
}
