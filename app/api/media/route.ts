import { NextRequest, NextResponse } from 'next/server'
import { getMedia, saveMedia, deleteMedia } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const media = await getMedia(category)
    return NextResponse.json(media)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement médias' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const body = await req.json()
    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: 'Titre et URL requis' },
        { status: 400 }
      )
    }
    const saved = await saveMedia(body)
    return NextResponse.json({ success: true, media: saved })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur enregistrement média' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }
    const ok = await deleteMedia(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur suppression' },
      { status: 500 }
    )
  }
}
