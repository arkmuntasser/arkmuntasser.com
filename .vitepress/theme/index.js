// https://vitepress.dev/guide/custom-theme
import './style.css'
import { nextTick } from 'vue'
import Layout from './Layout.vue'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Page transitions. VitePress routes client-side, so we wrap each route change in
 * document.startViewTransition. When the click came from a blog post card, that card's
 * title and the next page's <h1> share the `post-title` name, so the title morphs into place.
 */
function setupViewTransitions(router) {
  if (!document.startViewTransition) return

  let lastCardTitle = null
  let transitioning = false

  // Remember which card is being activated. pointerdown/keydown fire before the click
  // that VitePress's router turns into a navigation.
  const rememberCard = (e) => {
    const card = e.target.closest?.('.blog-post-card')
    lastCardTitle = card?.querySelector('.blog-post-card__title') ?? null
  }
  window.addEventListener('pointerdown', rememberCard, { capture: true })
  window.addEventListener('keydown', (e) => { if (e.key === 'Enter') rememberCard(e) }, { capture: true })

  const previousHook = router.onBeforeRouteChange
  router.onBeforeRouteChange = async (to) => {
    if (previousHook && (await previousHook(to)) === false) return false
    if (transitioning || prefersReducedMotion()) return true

    const target = new URL(to, location.href)
    if (target.pathname === location.pathname) return true // in-page hash links: no transition

    const cardTitle = lastCardTitle
    lastCardTitle = null

    // The outgoing page's own title must not also claim `post-title`, or the transition is skipped.
    const currentTitle = document.querySelector('.page-header__title')
    if (cardTitle && currentTitle) currentTitle.style.viewTransitionName = 'none'
    if (cardTitle) cardTitle.style.viewTransitionName = 'post-title'

    transitioning = true
    const transition = document.startViewTransition(async () => {
      await router.go(to)
      await nextTick()
    })
    transition.finished.finally(() => {
      transitioning = false
      if (cardTitle) cardTitle.style.viewTransitionName = ''
    })
    return false // the transition performs the navigation
  }
}

/** Heading permalinks copy their URL and briefly show "Copied". */
function setupHeadingCopyLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest?.('.markdown-content .header-anchor')
    if (!anchor || !navigator.clipboard) return
    const url = new URL(anchor.getAttribute('href'), location.href).href
    navigator.clipboard.writeText(url).then(() => {
      anchor.setAttribute('data-copied', '')
      clearTimeout(anchor._copiedTimer)
      anchor._copiedTimer = setTimeout(() => anchor.removeAttribute('data-copied'), 1600)
    }).catch(() => {})
  })
}

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

      setupViewTransitions(router)
      setupHeadingCopyLinks()
    }
  }
}

