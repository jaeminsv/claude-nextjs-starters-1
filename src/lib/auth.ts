/**
 * Simple password-based authentication utility for admin routes.
 *
 * Uses Web Crypto API (crypto.subtle) for HMAC-SHA256 token signing,
 * which is compatible with both Node.js runtime and Edge Runtime
 * (required for Next.js middleware).
 *
 * Flow:
 *   1. User submits password via login form
 *   2. API route compares password against ADMIN_PASSWORD env var
 *   3. On match: creates HMAC-signed session token, stores in HttpOnly cookie
 *   4. Middleware checks cookie on /admin/* routes and verifies token signature
 *
 * NOTE: Uses process.env.ADMIN_PASSWORD directly (not the env.ts module)
 * because Edge Runtime cannot import the full Zod-based env module.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Cookie name for the admin session token */
export const COOKIE_NAME = 'admin-session'

/** Session duration in seconds (24 hours) */
export const SESSION_MAX_AGE = 60 * 60 * 24

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Shared TextEncoder instance for converting strings to bytes */
const encoder = new TextEncoder()

/**
 * Derives an HMAC-SHA256 signing key from the ADMIN_PASSWORD env var.
 * Falls back to a default password in development if not configured.
 */
async function getSigningKey(): Promise<CryptoKey> {
  const password = process.env.ADMIN_PASSWORD || 'default-dev-password'
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false, // not extractable
    ['sign', 'verify']
  )
}

/**
 * Converts an ArrayBuffer to a hex string.
 * Used to serialize HMAC signatures for cookie storage.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Converts a hex string back to a Uint8Array.
 * Used to deserialize HMAC signatures from cookie values.
 */
function hexToBuffer(hex: string): Uint8Array {
  const matches = hex.match(/.{2}/g)
  if (!matches) return new Uint8Array(0)
  return new Uint8Array(matches.map(byte => parseInt(byte, 16)))
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Creates a new HMAC-SHA256 signed session token.
 * Format: "admin-session:<timestamp>.<hex-signature>"
 *
 * The timestamp payload ensures each token is unique.
 * The HMAC signature prevents token forgery without knowing the password.
 *
 * @returns A signed session token string
 */
export async function createSessionToken(): Promise<string> {
  const payload = `admin-session:${Date.now()}`
  const key = await getSigningKey()
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  )
  return `${payload}.${bufferToHex(signature)}`
}

/**
 * Verifies an HMAC-SHA256 signed session token.
 * Returns true if the signature is valid (token was created with the same password).
 *
 * @param token - The session token string to verify
 * @returns true if valid, false otherwise
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  // Split into payload and signature parts
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return false

  const payload = token.substring(0, dotIndex)
  const sigHex = token.substring(dotIndex + 1)

  if (!payload || !sigHex) return false

  try {
    const key = await getSigningKey()
    const sigBytes = hexToBuffer(sigHex)
    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as BufferSource,
      encoder.encode(payload)
    )
  } catch {
    // Any crypto error means the token is invalid
    return false
  }
}
