import { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/user/',
          '/cart',
          '/place-order',
          '/shipping-address',
          '/payment-method',
          '/order/',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
