import { NextResponse, type NextRequest } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth'

/**
 * Next.js middleware that protects /admin/* routes.
 * Runs on Edge Runtime — only Web Crypto API is available (no Node.js crypto).
 *
 * Flow:
 *   1. Check for admin-session cookie
 *   2. If missing: redirect to /admin/login
 *   3. If present: verify HMAC signature
 *   4. If invalid: clear cookie and redirect to /admin/login
 *   5. If valid: allow request through
 *
 * The matcher config excludes /admin/login to prevent redirect loops.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value

  // No session cookie — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Verify the token signature
  const isValid = await verifySessionToken(token)

  if (!isValid) {
    // Invalid token — clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    })
    return response
  }

  // Valid session — allow request through
  return NextResponse.next()
}

/**
 * Middleware matcher configuration.
 * Protects all /admin/* routes EXCEPT /admin/login (to prevent redirect loops).
 *
 * Two patterns are needed:
 *   1. '/admin' — matches the exact /admin path (no trailing slash)
 *   2. '/admin/((?!login).*)' — matches /admin/* sub-routes, excluding /admin/login
 *
 * Without the first pattern, /admin would bypass the middleware entirely,
 * causing Turbopack chunk loading issues with the server-side redirect.
 */
export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
}
