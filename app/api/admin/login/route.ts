import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSession,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "L'accès administrateur n'est pas configuré sur ce déploiement." },
      { status: 503 }
    )
  }

  try {
    const body: unknown = await req.json()

    if (
      !body ||
      typeof body !== 'object' ||
      !('email' in body) ||
      !('password' in body) ||
      typeof body.email !== 'string' ||
      typeof body.password !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (!verifyAdminCredentials(body.email, body.password)) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: { email: process.env.ADMIN_DEFAULT_EMAIL, name: 'Direction PREVENIX' },
    })

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSession(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    )
  }
}
