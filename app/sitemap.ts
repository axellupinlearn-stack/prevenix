import { MetadataRoute } from 'next'
import { getArticles } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const articles = await getArticles(true)

  const articleUrls = articles.map((art) => ({
    url: `${baseUrl}/actualites/${art.slug}`,
    lastModified: new Date(art.published_at || art.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleUrls,
  ]
}
