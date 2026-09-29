/**
 * Minimal Sanity-mutation applier for the local content preview.
 *
 * Supports the subset of the Sanity HTTP mutation format that the staged
 * content patches use, so the same file can be sent to Sanity unchanged at
 * release time:
 *
 *   { "patch": { "id": "...", "ifRevisionID": "...", "set": {...}, "unset": [...] } }
 *
 * Paths follow Sanity's JSONMatch style: `field`, `a.b`, `arr[_key=="k"]`,
 * `arr[_key=="k"].field`, `arr[3]`.
 */

/** Split a JSONMatch path into segments: { key, sel? } */
export function parsePath(path) {
  const segments = []
  const re = /([A-Za-z_$][\w$]*)((?:\[[^\]]+\])*)(?:\.|$)/y
  let m
  let pos = 0
  while (pos < path.length) {
    re.lastIndex = pos
    m = re.exec(path)
    if (!m) throw new Error(`Unsupported path "${path}" near "${path.slice(pos)}"`)
    segments.push({ key: m[1] })
    const selectors = m[2].match(/\[[^\]]+\]/g) ?? []
    for (const raw of selectors) {
      const inner = raw.slice(1, -1).trim()
      const keyMatch = inner.match(/^_key\s*==\s*"([^"]+)"$/)
      if (keyMatch) segments.push({ sel: { type: 'key', value: keyMatch[1] } })
      else if (/^-?\d+$/.test(inner)) segments.push({ sel: { type: 'index', value: Number(inner) } })
      else throw new Error(`Unsupported selector ${raw} in "${path}"`)
    }
    pos = re.lastIndex
  }
  return segments
}

function findIndex(arr, sel, path) {
  if (!Array.isArray(arr)) throw new Error(`Expected array at "${path}"`)
  if (sel.type === 'index') {
    const i = sel.value < 0 ? arr.length + sel.value : sel.value
    if (i < 0 || i >= arr.length) throw new Error(`Index ${sel.value} out of range at "${path}"`)
    return i
  }
  const i = arr.findIndex((item) => item && item._key === sel.value)
  if (i === -1) throw new Error(`No array item with _key "${sel.value}" at "${path}"`)
  return i
}

/** Resolve the container and final accessor for a path. */
function resolve(doc, path, { create }) {
  const segs = parsePath(path)
  let node = doc
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i]
    const next = segs[i + 1]
    if (seg.key !== undefined) {
      if (node[seg.key] === undefined || node[seg.key] === null) {
        if (!create) throw new Error(`Missing field "${seg.key}" in "${path}"`)
        node[seg.key] = next.sel ? [] : {}
      }
      node = node[seg.key]
    } else {
      node = node[findIndex(node, seg.sel, path)]
    }
  }
  const last = segs[segs.length - 1]
  return { node, last }
}

export function setAt(doc, path, value) {
  const { node, last } = resolve(doc, path, { create: true })
  if (last.key !== undefined) node[last.key] = structuredClone(value)
  else node[findIndex(node, last.sel, path)] = structuredClone(value)
}

export function unsetAt(doc, path) {
  const { node, last } = resolve(doc, path, { create: false })
  if (last.key !== undefined) delete node[last.key]
  else node.splice(findIndex(node, last.sel, path), 1)
}

/**
 * Apply mutations to a Map of documents (by _id), in order.
 * Returns a list of human-readable problems; an empty list means success.
 */
export function applyMutations(docsById, mutations, { checkRevisions = true } = {}) {
  const problems = []
  for (const [i, mutation] of mutations.entries()) {
    const patch = mutation.patch
    if (!patch) {
      problems.push(`#${i}: only "patch" mutations are supported`)
      continue
    }
    const doc = docsById.get(patch.id)
    if (!doc) {
      problems.push(`#${i}: document "${patch.id}" is not in the snapshot`)
      continue
    }
    if (checkRevisions && patch.ifRevisionID && doc._rev !== patch.ifRevisionID) {
      problems.push(
        `#${i}: "${patch.id}" changed since the patch was written (snapshot _rev ${doc._rev}, patch expects ${patch.ifRevisionID})`,
      )
      continue
    }
    try {
      // Same order Sanity uses inside one patch: set before unset.
      for (const [path, value] of Object.entries(patch.set ?? {})) setAt(doc, path, value)
      for (const path of patch.unset ?? []) unsetAt(doc, path)
    } catch (err) {
      problems.push(`#${i} (${patch.id}): ${err.message}`)
    }
  }
  return problems
}
