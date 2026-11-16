import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getAdminSession } from '@/lib/admin-auth'

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Clean filename
    const cleanName = `${randomUUID()}${extension}`
    const filePath = path.join(uploadDir, cleanName)

    fs.writeFileSync(filePath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${cleanName}`,
      name: file.name,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur lors de l’upload' },
      { status: 500 }
    )
  }
}
