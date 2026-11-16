import { NextRequest, NextResponse } from 'next/server'
import { getArticles, saveArticle, deleteArticle } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const publishedOnly = searchParams.get('publishedOnly') === 'true'
    if (!publishedOnly && !getAdminSession(req)) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }
    const articles = await getArticles(publishedOnly)
    return NextResponse.json(articles)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur chargement articles' },
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
        { error: 'Le titre de l’article est requis' },
        { status: 400 }
      )
    }
    const saved = await saveArticle(body)
    return NextResponse.json({ success: true, article: saved })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur enregistrement article' },
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
    const ok = await deleteArticle(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur suppression' },
      { status: 500 }
    )
  }
}
