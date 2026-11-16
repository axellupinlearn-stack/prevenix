import { NextRequest, NextResponse } from 'next/server'
import { getQuotes, createQuote, updateQuoteStatus, deleteQuote } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const quotes = await getQuotes()
    return NextResponse.json(quotes)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement devis' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.full_name || !body.phone || !body.insurance_type) {
      return NextResponse.json(
        { error: 'Le nom, le numéro de téléphone et le type d’assurance sont requis' },
        { status: 400 }
      )
    }

    const created = await createQuote({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email || '',
      insurance_type: body.insurance_type,
      details: body.details || '',
      notes: body.notes || '',
    })

    return NextResponse.json({ success: true, quote: created })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur enregistrement devis' },
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

    const updated = await updateQuoteStatus(body.id, body.status, body.notes)
    return NextResponse.json({ success: true, quote: updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur mise à jour devis' },
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
    const ok = await deleteQuote(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur suppression devis' },
      { status: 500 }
    )
  }
}
