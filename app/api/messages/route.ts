import { NextRequest, NextResponse } from 'next/server'
import { getMessages, createMessage, updateMessageStatus, deleteMessage } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const messages = await getMessages()
    return NextResponse.json(messages)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.full_name || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Nom, téléphone et message sont obligatoires' },
        { status: 400 }
      )
    }

    const created = await createMessage({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email || '',
      subject: body.subject || 'Message depuis le site web',
      message: body.message,
    })

    return NextResponse.json({ success: true, message: created })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur envoi message' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const body = await req.json()
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: 'ID et statut requis' },
        { status: 400 }
      )
    }

    const updated = await updateMessageStatus(body.id, body.status)
    return NextResponse.json({ success: true, message: updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur mise à jour message' },
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
    const ok = await deleteMessage(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur suppression message' },
      { status: 500 }
    )
  }
}
