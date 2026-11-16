import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, isAdminAuthConfigured } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const user = getAdminSession(request)
  if (!user) {
    return NextResponse.json(
      { success: false, configured: isAdminAuthConfigured() },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    )
  }
  return NextResponse.json(
    { success: true, user },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
