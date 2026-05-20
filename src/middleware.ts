/**
 * Astro middleware — noindex guard for non-production hostnames
 *
 * Problem: this is a static Astro site. The `<meta name="robots">` tags
 * in every page's HTML are baked in at build time. Because cicon-marketing
 * .vercel.app is the Vercel *production* deployment, VERCEL_ENV === 'production'
 * during build — so all pages get `index, follow` baked in, even on staging.
 *
 * Solution: this middleware runs at the edge on every request and injects
 * an `X-Robots-Tag: noindex, nofollow` response header whenever the request
 * host is NOT cicon.ca. Google (and all major crawlers) honour X-Robots-Tag
 * with equal authority to the <meta robots> tag — the most restrictive signal
 * wins. So staging stays locked until domain cutover, at which point the
 * header is simply not added and the baked-in `index, follow` takes effect.
 *
 * No code change is needed after domain cutover — it auto-switches on host.
 */
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()

  const host = context.request.headers.get('host') ?? ''
  const isLiveDomain = host === 'cicon.ca' || host === 'www.cicon.ca'

  if (!isLiveDomain) {
    // Clone the response so we can mutate headers (Response is immutable)
    const headers = new Headers(response.headers)
    headers.set('X-Robots-Tag', 'noindex, nofollow')
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  return response
})
