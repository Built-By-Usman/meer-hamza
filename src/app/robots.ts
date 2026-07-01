import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/profile/', '/admin/'],
    },
    sitemap: 'https://timelessbymeer.com/sitemap.xml',
  };
}
