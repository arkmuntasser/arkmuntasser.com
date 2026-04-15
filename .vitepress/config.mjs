import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "arkm",
  description: "My website, this time in Vue",
  cleanUrls: true,
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
      { href: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap', rel: 'stylesheet' }
    ],
		[
			'link',
			{ href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap', rel: 'stylesheet' }
		]
	]
})
