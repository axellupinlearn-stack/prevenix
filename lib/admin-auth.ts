import { createHash, createHmac, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

export const ADMIN_SESSION_COOKIE = 'prevenix_admin_session'
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

interface AdminSession {
  email: string
  expiresAt: number
}

function getAdminConfig() {
  const secret = process.env.ADMIN_SECRET_KEY
  const email = process.env.ADMIN_DEFAULT_EMAIL?.trim()
  const password = process.env.ADMIN_DEFAULT_PASSWORD
  if (
    !secret ||
    secret.length < 32 ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !password ||
    password.length < 12
  ) {
    return null
  }
  return { secret, email, password }
}

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash('sha256').update(left).digest()
  const rightHash = createHash('sha256').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

export function isAdminAuthConfigured(): boolean {
  return getAdminConfig() !== null
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const config = getAdminConfig()
  return Boolean(
    config &&
      safeEqual(email.trim().toLowerCase(), config.email.toLowerCase()) &&
      safeEqual(password, config.password)
  )
}

export function createAdminSession(): string {
  const config = getAdminConfig()
  if (!config) throw new Error('Admin authentication is not configured.')

  const payload: AdminSession = {
    email: config.email,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', config.secret).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function getAdminSession(request: NextRequest): { email: string; name: string } | null {
  const config = getAdminConfig()
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!config || !token) return null

  const [encoded, signature, extra] = token.split('.')
  if (!encoded || !signature || extra) return null

  const expected = createHmac('sha256', config.secret).update(encoded).digest()
  const received = Buffer.from(signature, 'base64url')
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AdminSession
    if (
      !payload ||
      typeof payload.email !== 'string' ||
      typeof payload.expiresAt !== 'number' ||
      payload.expiresAt <= Date.now() ||
      !safeEqual(payload.email.toLowerCase(), config.email.toLowerCase())
    ) {
      return null
    }
    return { email: config.email, name: 'Direction PREVENIX' }
  } catch {
    return null
  }
}
