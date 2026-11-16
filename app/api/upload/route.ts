import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getAdminSession } from '@/lib/admin-auth'
import { getSupabaseConfig, uploadToSupabaseStorage } from '@/lib/supabase-rest'

export async function POST(req: NextRequest) {
  if (!getAdminSession(req)) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 })
    }

    const extensions: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/avif': '.avif',
    }
    const extension = extensions[file.type]
    if (!extension) {
      return NextResponse.json({ error: 'Format d’image non pris en charge' }, { status: 400 })
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'La taille maximale autorisée est de 15 Mo' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const cleanName = `${randomUUID()}${extension}`
    let url: string
    if (getSupabaseConfig()) {
      url = await uploadToSupabaseStorage(cleanName, buffer, file.type)
    } else {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Le stockage Supabase doit être configuré avant les téléversements.' },
          { status: 503 }
        )
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      fs.writeFileSync(path.join(uploadDir, cleanName), buffer)
      url = `/uploads/${cleanName}`
    }

    return NextResponse.json({
      success: true,
      url,
      name: file.name,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur lors de l’upload' },
      { status: 500 }
    )
  }
}
