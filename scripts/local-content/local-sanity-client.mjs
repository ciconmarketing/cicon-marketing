/**
 * Local stand-in for `@sanity/client`, used only by `npm run dev:local-content`.
 *
 * astro.config.mjs aliases `@sanity/client` to this file when
 * LOCAL_CONTENT_DATASET is set (and never on Vercel). Every GROQ query the
 * site runs is then answered from the local NDJSON dataset with groq-js, so
 * staged content can be reviewed on localhost without touching Sanity.
 * Every write method throws: this client cannot mutate anything.
 */
import fs from 'node:fs'
import path from 'node:path'
import { parse, evaluate } from 'groq-js'

let cache = { file: null, mtimeMs: 0, docs: [] }

function loadDataset() {
  const file = path.resolve(process.env.LOCAL_CONTENT_DATASET ?? '')
  const { mtimeMs } = fs.statSync(file)
  if (cache.file !== file || cache.mtimeMs !== mtimeMs) {
    const docs = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    cache = { file, mtimeMs, docs }
    console.log(`[local-content] Serving ${docs.length} documents from ${path.relative(process.cwd(), file)}`)
  }
  return cache.docs
}

function readOnly(method) {
  return () => {
    throw new Error(`[local-content] ${method}() is disabled: the local preview client is read-only.`)
  }
}

export function createClient(config = {}) {
  if (process.env.VERCEL) throw new Error('[local-content] Refusing to run on Vercel.')
  const client = {
    config: () => ({ ...config }),
    withConfig: (next) => createClient({ ...config, ...next }),
    async fetch(query, params = {}) {
      const tree = parse(query, { params })
      const result = await evaluate(tree, { dataset: loadDataset(), params })
      return result.get()
    },
  }
  for (const m of ['create', 'createOrReplace', 'createIfNotExists', 'patch', 'delete', 'mutate', 'transaction']) {
    client[m] = readOnly(m)
  }
  return client
}

export default createClient
