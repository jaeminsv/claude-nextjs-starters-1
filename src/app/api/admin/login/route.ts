import { NextResponse } from 'next/server'
import { createSessionToken, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth'

/**
 * POST /api/admin/login
 *
 * Validates the submitted password against ADMIN_PASSWORD env var.
 * On success: sets an HttpOnly session cookie with a signed token.
 * On failure: returns 401 Unauthorized.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body as { password: string }

    // Compare submitted password against the configured admin password
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // Create a signed session token and set it as an HttpOnly cookie
    const token = await createSessionToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: '요청을 처리할 수 없습니다.' },
      { status: 400 }
    )
  }
}
