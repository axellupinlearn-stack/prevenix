import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement paramètres' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const updated = await updateSettings(body)
    return NextResponse.json({ success: true, settings: updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur mise à jour paramètres' },
      { status: 500 }
    )
  }
}
