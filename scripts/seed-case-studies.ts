#!/usr/bin/env tsx
/**
 * seed-case-studies.ts
 *
 * Seeds 8 placeholder caseStudy documents in Sanity — one per service type.
 * Safe to re-run: skips any serviceType that already has a placeholder document.
 *
 * Usage: npm run seed-case-studies
 *
 * Required env vars: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN
 */

import { createClient } from '@sanity/client'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../')

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadDotEnv()

const projectId = (process.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
const dataset   = (process.env.PUBLIC_SANITY_DATASET ?? 'production').trim()
const token     = (process.env.SANITY_WRITE_TOKEN ?? '').trim()

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, useCdn: false, apiVersion: '2024-01-01' })

const SERVICE_TYPES = [
  { type: 'dental',    name: 'Dental Marketing',      stat: { value: '+340%', label: 'New patient inquiries' } },
  { type: 'paid-ads',  name: 'Paid Advertising',       stat: { value: '4.2×', label: 'Return on ad spend' } },
  { type: 'seo',       name: 'AI SEO',                 stat: { value: '+280%', label: 'Organic traffic' } },
  { type: 'local-seo', name: 'Local SEO',              stat: { value: 'Top 3', label: 'Google Maps ranking' } },
  { type: 'social',    name: 'Social Media Marketing', stat: { value: '+190%', label: 'Engagement rate' } },
  { type: 'web-dev',   name: 'Website Development',    stat: { value: '+65%', label: 'Conversion rate' } },
  { type: 'media',     name: 'Media Production',       stat: { value: '12×', label: 'Video completion rate' } },
  { type: 'crm',       name: 'CRM Integration',        stat: { value: '-40%', label: 'Lead response time' } },
]

async function main() {
  console.log('\n🌱 Seeding placeholder case studies...\n')

  for (const svc of SERVICE_TYPES) {
    // Idempotency — skip if already exists
    const existing = await client.fetch(
      `*[_type == "caseStudy" && serviceType == $type && isPlaceholder == true][0]{ _id }`,
      { type: svc.type },
    )

    if (existing) {
      console.log(`  ⏭  ${svc.name} — placeholder already exists (${existing._id})`)
      continue
    }

    const doc = {
      _type: 'caseStudy',
      clientName: '[Client Name — Placeholder]',
      serviceType: svc.type,
      isPlaceholder: true,
      summary: `Client overview placeholder. A ${svc.name.toLowerCase()} client in the Greater Toronto Area came to CiCon with specific growth targets. Specific situation placeholder — replace with real data in Sanity Studio. Outcome and timeline placeholder — MJ swaps to real client data after obtaining written approval.`,
      heroStat: svc.stat,
    }

    const created = await client.create(doc)
    console.log(`  ✅ Created ${svc.name} placeholder → ${created._id}`)
  }

  console.log('\n✅ Done. Open Sanity Studio → Case Studies to review.\n')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
