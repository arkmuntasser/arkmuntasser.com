/**
 * Publishes blog posts to the AT Protocol using the standard.site lexicon.
 *
 * Required environment variables:
 *   ATP_HANDLE       — your AT Protocol handle (e.g. arkmuntasser.com)
 *   ATP_APP_PASSWORD — an app password generated at bsky.app/settings/app-passwords
 *
 * Run:
 *   node --env-file=.env scripts/publish-atproto.mjs
 */

import { AtpAgent } from '@atproto/api'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const POSTS_DIR = resolve(process.cwd(), 'posts')

// ---------------------------------------------------------------------------
// Frontmatter parser — handles scalar values and multi-line YAML arrays
// ---------------------------------------------------------------------------
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return { frontmatter: {}, body: raw }

  const body = raw.slice(match[0].length)
  const lines = match[1].split('\n')
  const fm = {}
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const colon = line.indexOf(':')
    if (colon === -1) { i++; continue }

    const key = line.slice(0, colon).trim()
    const rest = line.slice(colon + 1).trim()

    // Collect multi-line array items (lines starting with "  - ")
    const items = []
    while (i + 1 < lines.length && /^\s+-\s/.test(lines[i + 1])) {
      items.push(lines[i + 1].replace(/^\s+-\s/, '').trim())
      i++
    }

    if (items.length > 0) {
      fm[key] = items
    } else if (rest !== '') {
      fm[key] = rest.replace(/^["']|["']$/g, '')
    }

    i++
  }

  return { frontmatter: fm, body }
}

// ---------------------------------------------------------------------------
// Strip markdown to plain text
// ---------------------------------------------------------------------------
function stripMarkdown(md) {
  return md
    .replace(/`{4,}[\s\S]*?`{4,}/g, '')    // 4+ backtick fenced code blocks (before triple)
    .replace(/```[\s\S]*?```/g, '')         // triple-backtick fenced code blocks
    .replace(/`[^`]*`/g, '')                // inline code
    .replace(/^:::[^\n]*$/gm, '')           // VitePress custom container markers
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → label text
    .replace(/^#{1,6}\s+/gm, '')           // headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2')    // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')       // italic
    .replace(/~~(.*?)~~/g, '$1')           // strikethrough
    .replace(/^[-*_]{3,}\s*$/gm, '')       // horizontal rules
    .replace(/^>\s?/gm, '')                // blockquotes
    .replace(/^\s*\|[\s\-:|]+\|\s*$/gm, '')// table separator rows
    .replace(/^\|(.*)\|$/gm, (_, inner) => // table content rows → space-joined cells
      inner.split('|').map(c => c.trim()).filter(Boolean).join(' '))
    .replace(/^\s*[-*+]\s+/gm, '')         // unordered list markers
    .replace(/^\s*\d+\.\s+/gm, '')         // ordered list markers
    .replace(/<[^>]+>/g, '')               // HTML tags
    .replace(/\n{3,}/g, '\n\n')            // collapse excess blank lines
    .trim()
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const handle = process.env.ATP_HANDLE
  const password = process.env.ATP_APP_PASSWORD

  if (!handle || !password) {
    console.error('Error: ATP_HANDLE and ATP_APP_PASSWORD must be set.')
    console.error('Create an app password at https://bsky.app/settings/app-passwords')
    process.exit(1)
  }

  // Authenticate
  console.log(`Logging in as ${handle}…`)
  const agent = new AtpAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: handle, password })
  const did = agent.session.did

  // Upsert the publication record (idempotent — always at rkey "self")
  console.log('Upserting publication record…')
  await agent.api.com.atproto.repo.putRecord({
    repo: did,
    collection: 'site.standard.publication',
    rkey: 'self',
    record: {
			"$type": "site.standard.publication",
			"url": "https://arkmuntasser.com",
			"icon": {
				"ref": {
					"$link": "bafkreiglvowv3ptmdf2urnvrwrsl5h2vglwhl45k4lpqwszq42246757ia"
				},
				"size": 13635,
				"$type": "blob",
				"mimeType": "image/png"
			},
			"name": "@arkmuntasser",
			"basicTheme": {
				"$type": "site.standard.theme.basic",
				"accent": {
					"b": 87,
					"g": 20,
					"r": 255,
					"$type": "site.standard.theme.color#rgb"
				},
				"background": {
					"b": 255,
					"g": 255,
					"r": 255,
					"$type": "site.standard.theme.color#rgb"
				},
				"foreground": {
					"b": 3,
					"g": 3,
					"r": 4,
					"$type": "site.standard.theme.color#rgb"
				},
				"accentForeground": {
					"b": 255,
					"g": 255,
					"r": 255,
					"$type": "site.standard.theme.color#rgb"
				}
			},
			"description": "My website, this time in Vue"
    },
  })

  const publicationUri = `at://${did}/site.standard.publication/self`
  console.log(`Publication URI: ${publicationUri}\n`)

  // Publish each post
  const files = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()

  let published = 0
  let skipped = 0

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8')
    const { frontmatter: fm, body } = parseFrontmatter(raw)

    if (!fm.title || !fm.date) {
      console.warn(`  skip  ${file} (missing title or date)`)
      skipped++
      continue
    }

    // Build the record — only include optional fields when values exist
    const record = {
      $type: 'site.standard.document',
      site: publicationUri,
      title: fm.title,
      publishedAt: new Date(fm.date).toISOString(),
      path: `/posts/${slug}`,
			description: fm.excerpt,
    }

		if (fm.updated) record.updatedAt = new Date(fm.updated).toISOString();

    const description = fm.excerpt || fm.description
    if (description) record.description = description

    // Tags come from "category" frontmatter field (array or scalar)
    const categories = fm.category
    if (categories) {
      record.tags = Array.isArray(categories) ? categories : [categories]
    }

    // Store full markdown content using the Markpub lexicon type
    if (body.trim()) {
      record.content = {
        $type: 'at.markpub.markdown',
        text: {
					$type: 'at.markpub.text',
					markdown: body.trim()
				},
      }
      record.textContent = stripMarkdown(body)
    }

    process.stdout.write(`  post  ${fm.title} … `)
    await agent.api.com.atproto.repo.putRecord({
      repo: did,
      collection: 'site.standard.document',
      rkey: slug,
      record,
    })
    console.log(`at://${did}/site.standard.document/${slug}`)
    published++
  }

  console.log(`\nDone. ${published} published, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error(err?.message ?? err)
  process.exit(1)
})
