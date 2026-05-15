# CICON Launch Redirects

**Status:** Ready to activate — DO NOT enable until DNS is cut over to Vercel.
**Last updated:** May 2026

---

## ⚠️ CRITICAL: Read Before Touching Anything

The old cicon.ca URLs (WordPress) are **still live and indexed**. These redirects must only
be activated **at the moment DNS is switched from WordPress/WP Engine to Vercel**.

Activating redirects before DNS cutover on the Vercel preview URL
(`cicon-marketing.vercel.app`) does no harm — but enabling them in production before
DNS cutover would break nothing because `cicon.ca` still points at WordPress.

**The correct cutover sequence is:**
1. Deploy the `vercel.json` with redirects block (copy from Section 3 below).
2. Switch DNS A-record / CNAME from WP Engine → Vercel.
3. Confirm 301s are firing on the 12 old URLs.
4. Update `sitemap.xml` to use new `/blog/[slug]/` URLs (see Section 4).
5. Submit updated sitemap in Google Search Console.

---

## 1. URL Mapping — 12 Posts (Old WordPress → New Vercel)

All 12 posts migrate from root-level WordPress slugs to `/blog/` prefixed paths.
HTTP status: **301 Permanent Redirect** (preserves SEO equity).

| # | Old URL (WordPress / cicon.ca today) | New URL (Vercel / new site) |
|---|---|---|
| 1 | `https://cicon.ca/local-seo-agency-toronto-guide-2026/` | `https://cicon.ca/blog/local-seo-agency-toronto-guide-2026/` |
| 2 | `https://cicon.ca/marketing-for-dental-clinics-a-practical-growth-playbook/` | `https://cicon.ca/blog/marketing-for-dental-clinics-a-practical-growth-playbook/` |
| 3 | `https://cicon.ca/why-local-seo-is-important-and-how-to-do-it-in-2026/` | `https://cicon.ca/blog/why-local-seo-is-important-and-how-to-do-it-in-2026/` |
| 4 | `https://cicon.ca/dental-seo-services-cdcp-renewal-gta/` | `https://cicon.ca/blog/dental-seo-services-cdcp-renewal-gta/` |
| 5 | `https://cicon.ca/google-ads-management-gta-trades-spring-checklist/` | `https://cicon.ca/blog/google-ads-management-gta-trades-spring-checklist/` |
| 6 | `https://cicon.ca/digital-marketing-agency-in-richmond-hill-2026/` | `https://cicon.ca/blog/digital-marketing-agency-in-richmond-hill-2026/` |
| 7 | `https://cicon.ca/dental-marketin-canada-guide-2026/` | `https://cicon.ca/blog/dental-marketin-canada-guide-2026/` |
| 8 | `https://cicon.ca/cafe-for-working-near-me/` | `https://cicon.ca/blog/cafe-for-working-near-me/` |
| 9 | `https://cicon.ca/social-media-marketing-for-canadian-business-owners-2026-guide/` | `https://cicon.ca/blog/social-media-marketing-for-canadian-business-owners-2026-guide/` |
| 10 | `https://cicon.ca/seo-optimization-near-me-2026/` | `https://cicon.ca/blog/seo-optimization-near-me-2026/` |
| 11 | `https://cicon.ca/digital-marketing-agency-strategies-2026/` | `https://cicon.ca/blog/digital-marketing-agency-strategies-2026/` |
| 12 | `https://cicon.ca/meta-ads-agency-how-to-use/` | `https://cicon.ca/blog/meta-ads-agency-how-to-use/` |

---

## 2. What Happens to SEO Equity

- **301 redirects pass ~99% of link equity** to the new URL. Google re-indexes
  the new URL within days to weeks of seeing the redirect.
- All 12 posts' canonical URLs will update automatically (Astro generates
  `<link rel="canonical" href="https://cicon.ca/blog/[slug]/" />` at build time).
- Google Search Console will show a brief dip in impressions while re-crawling —
  normal and recovers within 2–4 weeks.
- **Do not** create a redirect from `/blog/` to anything — it's a new URL with
  no WordPress equivalent.

---

## 3. vercel.json Redirect Config Block

Add this `redirects` array to `vercel.json` at DNS cutover.
If `vercel.json` doesn't exist yet, create it at the project root.

```json
{
  "redirects": [
    {
      "source": "/local-seo-agency-toronto-guide-2026/",
      "destination": "/blog/local-seo-agency-toronto-guide-2026/",
      "permanent": true
    },
    {
      "source": "/marketing-for-dental-clinics-a-practical-growth-playbook/",
      "destination": "/blog/marketing-for-dental-clinics-a-practical-growth-playbook/",
      "permanent": true
    },
    {
      "source": "/why-local-seo-is-important-and-how-to-do-it-in-2026/",
      "destination": "/blog/why-local-seo-is-important-and-how-to-do-it-in-2026/",
      "permanent": true
    },
    {
      "source": "/dental-seo-services-cdcp-renewal-gta/",
      "destination": "/blog/dental-seo-services-cdcp-renewal-gta/",
      "permanent": true
    },
    {
      "source": "/google-ads-management-gta-trades-spring-checklist/",
      "destination": "/blog/google-ads-management-gta-trades-spring-checklist/",
      "permanent": true
    },
    {
      "source": "/digital-marketing-agency-in-richmond-hill-2026/",
      "destination": "/blog/digital-marketing-agency-in-richmond-hill-2026/",
      "permanent": true
    },
    {
      "source": "/dental-marketin-canada-guide-2026/",
      "destination": "/blog/dental-marketin-canada-guide-2026/",
      "permanent": true
    },
    {
      "source": "/cafe-for-working-near-me/",
      "destination": "/blog/cafe-for-working-near-me/",
      "permanent": true
    },
    {
      "source": "/social-media-marketing-for-canadian-business-owners-2026-guide/",
      "destination": "/blog/social-media-marketing-for-canadian-business-owners-2026-guide/",
      "permanent": true
    },
    {
      "source": "/seo-optimization-near-me-2026/",
      "destination": "/blog/seo-optimization-near-me-2026/",
      "permanent": true
    },
    {
      "source": "/digital-marketing-agency-strategies-2026/",
      "destination": "/blog/digital-marketing-agency-strategies-2026/",
      "permanent": true
    },
    {
      "source": "/meta-ads-agency-how-to-use/",
      "destination": "/blog/meta-ads-agency-how-to-use/",
      "permanent": true
    }
  ]
}
```

> **Note:** `"permanent": true` outputs HTTP 308 in Vercel (equivalent to 301 for
> browsers and bots). This is the correct value for SEO-preserving permanent redirects.

---

## 4. Sitemap Checklist at Cutover

When DNS is live on Vercel, update `public/sitemap.xml` (or enable Astro's
`@astrojs/sitemap` integration) so Google receives the new URL set:

- [ ] All 12 blog post URLs use `/blog/[slug]/` format.
- [ ] Blog index `/blog/` is included.
- [ ] Homepage `/` is included.
- [ ] No old `https://cicon.ca/[slug]/` paths remain in the sitemap.
- [ ] Submit the updated sitemap in **Google Search Console → Sitemaps**.
- [ ] Request indexing for the 3–5 highest-traffic posts via URL Inspection tool.

---

## 5. WordPress / WP Engine Decommission Checklist

After confirming Vercel is receiving traffic and 301s are working:

- [ ] Set WordPress to "maintenance mode" (do not delete yet — keep for 90 days).
- [ ] Export and archive all WordPress media uploads.
- [ ] Cancel WP Engine hosting once redirect period ends (90+ days post-cutover).
- [ ] Remove WordPress `wp-login.php`, XML-RPC, and any WordPress-specific
  security monitoring rules from Cloudflare (if applicable).

---

## 6. Verification Commands (Run After DNS Cutover)

```bash
# Spot-check 3 redirects — all should show "HTTP/2 301" and Location header
curl -I "https://cicon.ca/local-seo-agency-toronto-guide-2026/"
curl -I "https://cicon.ca/dental-seo-services-cdcp-renewal-gta/"
curl -I "https://cicon.ca/why-local-seo-is-important-and-how-to-do-it-in-2026/"

# Confirm destination pages return 200
curl -o /dev/null -w "%{http_code}" "https://cicon.ca/blog/local-seo-agency-toronto-guide-2026/"
```

Expected output for each redirect: `301` + `Location: https://cicon.ca/blog/[slug]/`
Expected output for each destination: `200`
