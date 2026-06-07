// https://vitepress.dev/guide/custom-theme
import './style.css'
import Layout from './Layout.vue'

/** @type {import('vitepress').Theme} */
export default {
  Layout,
  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined') {
      // VitePress's popstate handler skips events where e.state === null, which
      // happens when the history entry was created by a hard navigation rather
      // than pushState. When that entry is restored (e.g. pressing back after a
      // 404), the view never updates because VitePress bails out early. This
      // listener fires first (capture phase) and re-triggers the router for
      // those null-state entries so the correct page content loads.
      window.addEventListener('popstate', (e) => {
        if (e.state === null) {
          router.go(location.href)
        }
      }, { capture: true })
    }
  }
}

