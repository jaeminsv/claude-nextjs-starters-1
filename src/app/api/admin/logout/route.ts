import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

/**
 * POST /api/admin/logout
 *
 * Clears the admin session cookie and returns success.
 * After this, the middleware will redirect to /admin/login.
 */
export async function POST() {
  const response = NextResponse.json({ success: true })

  // Delete the session cookie by setting it with maxAge 0
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
