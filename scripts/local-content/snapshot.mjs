#!/usr/bin/env node
/**
 * Download a read-only snapshot of the public Sanity dataset for local preview.
 *
 *   npm run content:snapshot
 *
 * Writes .local-content/snapshot.ndjson (gitignored). Uses the unauthenticated
 * export endpoint, so it only ever sees published documents and can never
 * write to Sanity.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT_DIR = path.join(ROOT, '.local-content')

function readEnv() {
  const env = { ...process.env }
  const file = path.join(ROOT, '.env.local')
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
  return env
}

const env = readEnv()
const projectId = (env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
const dataset = (env.PUBLIC_SANITY_DATASET ?? '').trim()
if (!/^[a-z0-9-]+$/.test(projectId) || !dataset) {
  console.error('PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET are missing (.env.local).')
  process.exit(1)
}

const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/export/${dataset}`
const res = await fetch(url)
if (!res.ok) {
  console.error(`Export failed: HTTP ${res.status}`)
  process.exit(1)
}
const body = await res.text()
const docs = body.split('\n').filter(Boolean)
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, 'snapshot.ndjson'), body)
fs.writeFileSync(
  path.join(OUT_DIR, 'snapshot.meta.json'),
  JSON.stringify({ projectId, dataset, takenAt: new Date().toISOString(), documents: docs.length }, null, 2),
)
console.log(`Saved ${docs.length} published documents to .local-content/snapshot.ndjson`)
