import 'server-only'

type SupabaseMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface SupabaseRequestOptions {
  method?: SupabaseMethod
  query?: Record<string, string>
  body?: unknown
  prefer?: string
}

interface SupabaseConfig {
  url: string
  serviceRoleKey: string
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, '')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && serviceRoleKey ? { url, serviceRoleKey } : null
}

export async function supabaseRequest<T>(
  table: string,
  options: SupabaseRequestOptions = {}
): Promise<T> {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error('Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use persistent storage.')
  }

  const endpoint = new URL(`${config.url}/rest/v1/${table}`)
  for (const [key, value] of Object.entries(options.query || {})) {
    endpoint.searchParams.set(key, value)
  }

  const headers: Record<string, string> = {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.prefer) headers.Prefer = options.prefer

  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const error = (await response.json()) as { message?: string }
      if (error.message) detail = error.message
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(`Supabase request to ${table} failed (${response.status}): ${detail}`)
  }

  if (response.status === 204) return [] as T
  const text = await response.text()
  return (text ? JSON.parse(text) : []) as T
}

export async function uploadToSupabaseStorage(
  fileName: string,
  content: Buffer,
  contentType: string
): Promise<string> {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error('Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use persistent storage.')
  }

  const bucket = 'prevenix-uploads'
  const response = await fetch(
    `${config.url}/storage/v1/object/${bucket}/${fileName}`,
    {
      method: 'POST',
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: new Uint8Array(content),
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Supabase Storage upload failed (${response.status}).`)
  }

  return `${config.url}/storage/v1/object/public/${bucket}/${fileName}`
}
