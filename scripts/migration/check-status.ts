import { createClient } from '@sanity/client'
const c = createClient({ projectId: '26ol0sqj', dataset: 'cicon-marketing', useCdn: false, apiVersion: '2024-01-01', token: 'skULhuo7iMM2IoZOd2QKs2GGIJDkNqlyF5Y4AvEJKRXdT1O0SdVOS4TKy3kXmEg1M14LM6BrlUun5fSxu' })
const docs = await c.fetch<any[]>('*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(status) { "slug": slug.current, status }')
console.log(`Total non-draft: ${docs.length}`)
docs.forEach((d: any) => console.log((d.status || 'NO_STATUS').padEnd(22), d.slug?.slice(0,55)))
