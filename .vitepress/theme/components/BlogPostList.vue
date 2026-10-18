<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  limit: {
    type: Number,
    default: null,
  },
  ctaText: {
    type: String,
    default: null,
  },
  ctaHref: {
    type: String,
    default: '/blog',
  },
  layout: {
    type: String,
    default: 'list',
    validator: (v) => ['list', 'grid'].includes(v),
  },
});

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { getBlogPosts } from '../utils/posts.js';
import BlogPostCard from './BlogPostCard.vue';

const PAGE_SIZE = 12;

const allPosts = getBlogPosts();
const currentPage = ref(1);
const listEl = ref(null);

const totalPages = computed(() => Math.ceil(allPosts.length / PAGE_SIZE));

function pageFromUrl() {
  const p = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
  return p > 0 ? Math.min(p, totalPages.value) : 1;
}

function onPopState() {
  currentPage.value = pageFromUrl();
}

onMounted(() => {
  currentPage.value = pageFromUrl();
  window.addEventListener('popstate', onPopState);
});

onUnmounted(() => {
  window.removeEventListener('popstate', onPopState);
});

const blogPosts = computed(() => {
  if (props.limit) return allPosts.slice(0, props.limit);
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return allPosts.slice(start, start + PAGE_SIZE);
});

const rangeStart = computed(() => (currentPage.value - 1) * PAGE_SIZE + 1);
const rangeEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, allPosts.length));

// Page 1 is the bare /blog URL; later pages are real ?page=N links
function hrefFor(page) {
  return page === 1 ? '?' : `?page=${page}`;
}

// First, last, and the current page's neighbours; gaps become an ellipsis
const pageItems = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const items = [];
  for (let n = 1; n <= total; n++) {
    if (keep.has(n)) items.push({ type: 'page', n });
    else if (items.at(-1)?.type !== 'gap') items.push({ type: 'gap', key: `gap-${n}` });
  }
  return items;
});

const pad = (n) => String(n).padStart(2, '0');

async function goToPage(page, event) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  event?.preventDefault();
  currentPage.value = page;

  const params = new URLSearchParams(window.location.search);
  if (page === 1) params.delete('page');
  else params.set('page', page);
  const qs = params.toString();
  history.pushState(null, '', qs ? `?${qs}` : window.location.pathname);

  await nextTick();
  listEl.value?.focus({ preventScroll: true });
  listEl.value?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
</script>

<template>
  <section>
    <h2 v-if="title">{{ title }}</h2>
    <ul ref="listEl" class="post-grid" :class="`post-grid--${layout}`" tabindex="-1" aria-label="Posts">
      <li v-for="post in blogPosts" :key="post.path">
        <BlogPostCard :post="post" />
      </li>
    </ul>
    <div v-if="ctaText" class="cta">
      <a class="cta__link" :href="ctaHref">{{ ctaText }}</a>
    </div>
    <nav v-if="!props.limit && totalPages > 1" class="pager" aria-label="Blog pages">
      <div class="pager__row">
        <a
          v-if="currentPage > 1"
          class="pager__dir"
          :href="hrefFor(currentPage - 1)"
          rel="prev"
          @click="goToPage(currentPage - 1, $event)"
          ><span class="pager__arrow" aria-hidden="true">←</span><span class="pager__word"> Newer<span class="sr-only"> posts</span></span></a
        >
        <span v-else class="pager__dir" aria-disabled="true"
          ><span class="pager__arrow" aria-hidden="true">←</span><span class="pager__word"> Newer<span class="sr-only"> posts</span></span></span
        >

        <ol class="pager__nums">
          <li v-for="item in pageItems" :key="item.type === 'page' ? item.n : item.key">
            <span v-if="item.type === 'gap'" class="pager__gap" aria-hidden="true">…</span>
            <span v-else-if="item.n === currentPage" class="pager__num" aria-current="page"
              ><span class="sr-only">Page </span>{{ pad(item.n) }}</span
            >
            <a
              v-else
              class="pager__num"
              :href="hrefFor(item.n)"
              :aria-label="`Page ${item.n}`"
              @click="goToPage(item.n, $event)"
              >{{ pad(item.n) }}</a
            >
          </li>
        </ol>

        <a
          v-if="currentPage < totalPages"
          class="pager__dir"
          :href="hrefFor(currentPage + 1)"
          rel="next"
          @click="goToPage(currentPage + 1, $event)"
          ><span class="pager__word">Older<span class="sr-only"> posts</span> </span><span class="pager__arrow" aria-hidden="true">→</span></a
        >
        <span v-else class="pager__dir" aria-disabled="true"
          ><span class="pager__word">Older<span class="sr-only"> posts</span> </span><span class="pager__arrow" aria-hidden="true">→</span></span
        >
      </div>
      <p class="pager__count">Posts <b>{{ rangeStart }}–{{ rangeEnd }}</b> of {{ allPosts.length }}</p>
    </nav>
  </section>
</template>

<style scoped>
section {
  container-type: inline-size;
}

h2 {
  font-family: var(--font-brand);
  font-size: var(--text-size-5);
  font-weight: 700;
	margin: 0;
  margin-block-end: 1.5rem;
}


.post-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@container (min-width: 30rem) {
  .post-grid--grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 48rem) {
  .post-grid--grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.cta {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.cta__link {
  display: inline-block;
  background: var(--text-muted);
  color: var(--bg-color);
  border-radius: var(--radius-rounded);
  padding: 0.5rem 1.5rem;
  font-family: var(--font-brand);
  font-size: var(--text-size-7);
  text-decoration: none;
  transition: background 0.15s;
}

.cta__link:hover,
.cta__link:focus-visible {
  background: var(--text-color);
  outline: none;
}

.post-grid:focus-visible {
  outline: 2px solid oklch(from var(--brand-color) 52% 0.22 h);
  outline-offset: 4px;
}

.post-grid:focus:not(:focus-visible) {
  outline: none;
}

/* Pager: quiet numbered index, echoing the header nav */
.pager {
  --ink: oklch(from var(--brand-color) 20% 0.03 h);
  --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
  --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  position: relative;
  margin-block-start: 2.5rem;
  padding-block-start: 1rem;
  border-block-start: 1px solid oklch(from var(--text-muted) l c h / 0.15);
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.75rem;
  color: var(--ink);
}

.pager::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: -2px;
  width: 3rem;
  height: 4px;
  background: var(--brand-color);
}

.pager__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pager__dir {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
  color: var(--ink);
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: underline 1px transparent;
  text-underline-offset: 0.25em;
  transition: text-decoration-color 0.15s;
}

a.pager__dir:hover {
  text-decoration-color: var(--brand-color);
}

.pager__dir[aria-disabled] {
  color: oklch(from var(--ink) l c h / 0.3);
}

.pager__arrow {
  display: inline-block;
  color: var(--brand-ink);
  transition: translate 300ms var(--ease-spring);
}

.pager__dir[aria-disabled] .pager__arrow {
  color: inherit;
}

.pager__nums {
  display: flex;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pager__num,
.pager__gap {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  color: var(--ink-muted);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-decoration: none;
}

.pager__num::after {
  content: "";
  position: absolute;
  inset-inline: 0.5rem;
  inset-block-end: 0.375rem;
  height: 4px;
  background: var(--brand-color);
  scale: 0 1;
  transform-origin: left;
  transition: scale 300ms var(--ease-out);
}

a.pager__num:hover {
  color: var(--ink);
}

a.pager__num:hover::after,
.pager__num[aria-current]::after {
  scale: 1 1;
}

.pager__num[aria-current] {
  color: var(--ink);
  font-weight: 700;
}

.pager__dir:focus-visible,
.pager__num:focus-visible {
  outline: 2px solid var(--brand-ink);
  outline-offset: 2px;
}

.pager__count {
  margin: 0.25rem 0 0;
  color: var(--ink-muted);
  text-align: center;
  font-variant-numeric: tabular-nums;

  & b {
    color: var(--ink);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a.pager__dir[rel="prev"]:hover .pager__arrow {
    translate: -3px 0;
  }

  a.pager__dir[rel="next"]:hover .pager__arrow {
    translate: 3px 0;
  }
}

/* Narrow: arrows only (words stay for screen readers) */
@container (max-width: 30rem) {
  .pager__word {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .pager__dir {
    justify-content: center;
    font-size: 1rem;
  }

  .pager__nums {
    gap: 0.25rem;
  }
}
</style>
