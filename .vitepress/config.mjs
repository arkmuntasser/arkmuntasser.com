import { defineConfig, createContentLoader } from 'vitepress'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const siteUrl = 'https://arkmuntasser.com'
const atDid = 'did:plc:2lm4lab5fhnj6kaazrxopv37'

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "arkmuntasser",
  description: "I’m Amir R Muntasser and I’m a web developer, wizard, sneaker enthusiast and current Director of Web Development at Granicus Destinations.",
  cleanUrls: true,
  ignoreDeadLinks: true,
	head: [
		[
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
		[
			'link',
			{ href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap', rel: 'stylesheet' }
		],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', title: 'arkm', href: `${siteUrl}/rss.xml` }
    ],
    [
      'link',
      { rel: 'me', href: `at://${atDid}/site.standard.publication/self` }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
    ],
	],

  transformHead({ pageData }) {
    if (pageData.filePath.startsWith('posts/')) {
      const slug = pageData.filePath.replace(/^posts\//, '').replace(/\.md$/, '')
      return [['link', { rel: 'alternate', href: `at://${atDid}/site.standard.document/${slug}` }]]
    }
  },

  markdown: {
    theme: 'dark-plus',
  },

  buildEnd: async (siteConfig) => {
    const posts = await createContentLoader('posts/*.md', { excerpt: true }).load()

    posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))

    const items = posts.map((post) => {
      const url = `${siteUrl}${post.url.replace(/\.html$/, '')}`
      const pubDate = new Date(post.frontmatter.date).toUTCString()
      return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.frontmatter.excerpt)}</description>
    </item>`
    }).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>arkm</title>
    <link>${siteUrl}</link>
    <description>My website, this time in Vue</description>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

    writeFileSync(resolve(siteConfig.outDir, 'rss.xml'), xml)
  },
})
