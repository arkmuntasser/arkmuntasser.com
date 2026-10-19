import { defineConfig, createContentLoader } from 'vitepress'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))

const siteUrl = 'https://arkmuntasser.com'
const atDid = 'did:plc:2lm4lab5fhnj6kaazrxopv37'

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function buildOGImages(siteConfig) {
	const template = readFileSync(resolve(__dirname, 'og-template.html'), 'utf-8');
	const posts = await createContentLoader('posts/*.md', { excerpt: true }).load();
	const pages = await createContentLoader('*.md', { excerpt: true }).load();
	const content = [...posts, ...pages];

	mkdirSync(resolve(siteConfig.outDir, 'og'), { recursive: true });

	let browser;
	if (process.env.VERCEL) {
		const chromium = (await import('@sparticuz/chromium')).default;
		const puppeteerCore = (await import('puppeteer-core')).default;
		browser = await puppeteerCore.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless,
		});
	} else {
		browser = await puppeteer.launch();
	}
	const page = await browser.newPage();
	await page.setViewport({ width: 1200, height: 630 });

	for (const c of content) {
		const title = escapeXml(c.frontmatter.title);
		let slug = c.url.replace('/posts', '').replace('/', '');
		slug = slug === '' ? 'index' : slug;

		const html = template
			.replace('{{title}}', title)
			.replace('{{url}}', c.url);

		await page.setContent(html, { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		await page.screenshot({
			path: resolve(siteConfig.outDir, 'og', slug + '.png'),
			clip: { x: 0, y: 0, width: 1200, height: 630 },
		});
	}

	await browser.close();
}

async function buildRSSFeed(siteConfig) {
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
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "arkmuntasser",
  description: "I like building things on the web and I'm a big CSS nerd and love to geek out with others about it.",
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    siteUrl,
  },
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
			{ href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=JetBrains+Mono:wght@400;500;700&display=swap', rel: 'stylesheet' }
		],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', title: 'arkm', href: `${siteUrl}/rss.xml` }
    ],
    [
      'link',
      { rel: 'site.standard.publication', href: `at://${atDid}/site.standard.publication/self` }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
    ],
	],

  transformHead({ pageData, siteData }) {
    const head = []

    const title = pageData.frontmatter.title ?? siteData.title
    const description = pageData.frontmatter.excerpt ?? siteData.description

    let slug = pageData.relativePath.replace(/\.md$/, '').replace(/^posts\//, '')
    slug = slug === 'index' ? 'index' : slug

    const ogImage = `${siteUrl}/og/${slug}.png`

    const pagePath = pageData.relativePath
      .replace(/\.md$/, '')
      .replace(/(^|\/)index$/, '$1')
      .replace(/\/$/, '')
    const ogUrl = pagePath ? `${siteUrl}/${pagePath}` : siteUrl

    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:image', content: ogImage }])
    head.push(['meta', { property: 'og:url', content: ogUrl }])
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])

    if (pageData.filePath.startsWith('posts/')) {
      const slug = pageData.filePath.replace(/^posts\//, '').replace(/\.md$/, '')
      head.push(['link', { rel: 'site.standard.document', href: `at://${atDid}/site.standard.document/${slug}` }])
    }

    return head
  },

  vite: {
    build: {
      cssTarget: ['chrome88', 'edge88', 'es2020', 'firefox78', 'safari14'],
    },
  },

  markdown: {
    theme: 'dark-plus',
    // Wrap tables so wide ones scroll sideways instead of widening the page
    config(md) {
      md.renderer.rules.table_open = () => '<div class="table-wrap">\n<table>\n';
      md.renderer.rules.table_close = () => '</table>\n</div>\n';
    },
  },

  buildEnd: async (siteConfig) => {
    await buildRSSFeed(siteConfig);
		await buildOGImages(siteConfig);
  },
})
