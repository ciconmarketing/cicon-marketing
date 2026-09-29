#!/usr/bin/env node
/**
 * Build the local preview dataset: snapshot + staged content patches.
 *
 *   npm run content:build
 *
 * Reads .local-content/snapshot.ndjson, applies every
 * content-staging/<change>/sanity-patches.json in name order, and writes
 * .local-content/dataset.ndjson. Fails if a patched document changed in the
 * snapshot since the patch was written (ifRevisionID mismatch), so stale
 * patches can never be previewed silently.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyMutations } from './patch-utils.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SNAPSHOT = path.join(ROOT, '.local-content/snapshot.ndjson')
const OUT = path.join(ROOT, '.local-content/dataset.ndjson')
const STAGING = path.join(ROOT, 'content-staging')

if (!fs.existsSync(SNAPSHOT)) {
  console.error('No snapshot yet. Run: npm run content:snapshot')
  process.exit(1)
}

const docs = fs.readFileSync(SNAPSHOT, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
const byId = new Map(docs.map((d) => [d._id, d]))

const patchFiles = fs.existsSync(STAGING)
  ? fs.readdirSync(STAGING).sort()
      .map((dir) => path.join(STAGING, dir, 'sanity-patches.json'))
      .filter((f) => fs.existsSync(f))
  : []

let failed = false
for (const file of patchFiles) {
  const mutations = JSON.parse(fs.readFileSync(file, 'utf8'))
  const problems = applyMutations(byId, mutations)
  const rel = path.relative(ROOT, file)
  if (problems.length) {
    failed = true
    console.error(`✗ ${rel}`)
    for (const p of problems) console.error(`  - ${p}`)
  } else {
    console.log(`✓ ${rel} (${mutations.length} patches)`)
  }
}
if (failed) process.exit(1)

fs.writeFileSync(OUT, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to .local-content/dataset.ndjson`)
