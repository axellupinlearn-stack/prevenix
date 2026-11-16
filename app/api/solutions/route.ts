import { NextRequest, NextResponse } from 'next/server'
import { getSolutions, saveSolution, deleteSolution } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'
    if (!activeOnly && !getAdminSession(req)) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }
    const solutions = await getSolutions(activeOnly)
    return NextResponse.json(solutions)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement solutions' },
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
    if (!body.title) {
      return NextResponse.json(
        { error: 'Le titre de la solution est obligatoire' },
        { status: 400 }
      )
    }
    const saved = await saveSolution(body)
    return NextResponse.json({ success: true, solution: saved })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur enregistrement solution' },
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
    const ok = await deleteSolution(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur suppression' },
      { status: 500 }
    )
  }
}
