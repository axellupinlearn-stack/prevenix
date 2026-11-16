import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
