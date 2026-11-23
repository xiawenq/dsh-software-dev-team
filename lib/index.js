/**
 * Bundled `software-dev-team` skill provider.
 *
 * Registers the software-dev-team skill shipped inside this package
 * (assets/software-dev-team.md) directly on `ctx.skills`, so installing the
 * package is self-contained: no `~/.dsh/skills` copy and no external
 * `link:` workspace dependency.
 *
 * Modeled on the official `@deepseek-ai/dsh-skill-badge` provider pattern.
 *
 * @module dsh-software-dev-team
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'software-dev-team'
const SKILL_BODY_URL = new URL('../assets/software-dev-team.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/', import.meta.url)),
}
const INVOCATION = { modelInvocable: true, userInvocable: true }

/**
 * Same value as `BUNDLED_SKILL_RANK` in `@deepseek-ai/dsh-skill` (600).
 * Hardcoded to keep this package dependency-free: a local
 * `~/.dsh/skills/software-dev-team` copy (rank 400) still wins if present.
 */
const BUNDLED_SKILL_RANK = 600

/** Minimal frontmatter parser for the bundled asset (simple key: value lines). */
function stripFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { meta: {}, body: content }
  }
  const end = content.indexOf('\n---', 3)
  if (end === -1) return { meta: {}, body: content }
  const block = content.slice(4, end)
  const meta = {}
  for (const line of block.split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: content.slice(end + 4).replace(/^\n/, '') }
}

const cached = { content: undefined }
async function loadAsset() {
  if (cached.content === undefined) {
    cached.content = await readFile(SKILL_BODY_URL, 'utf8')
  }
  const { meta, body } = stripFrontmatter(cached.content)
  return { meta, body }
}

const provider = {
  name: PROVIDER_NAME,
  async list() {
    const { meta } = await loadAsset()
    return [
      {
        name: meta.name || 'software-dev-team',
        description: meta.description || '',
        invocation: INVOCATION,
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: RESOURCE_BASE,
        metadata: meta.whenToUse ? { whenToUse: meta.whenToUse } : undefined,
        rank: BUNDLED_SKILL_RANK,
        locator: SKILL_BODY_URL,
      },
    ]
  },
  async get(candidate) {
    const { body } = await loadAsset()
    return {
      name: candidate.name,
      description: candidate.description,
      invocation: candidate.invocation,
      provider: PROVIDER_NAME,
      source: candidate.source,
      resourceBase: RESOURCE_BASE,
      metadata: candidate.metadata,
      content: body,
    }
  },
}

/** Cordis plugin name. */
export const name = 'software-dev-team-skill'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `software-dev-team` provider on `ctx.skills`. */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
