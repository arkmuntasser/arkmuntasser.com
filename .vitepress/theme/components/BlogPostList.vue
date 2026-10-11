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

import { ref, computed, onMounted } from 'vue';
import { getBlogPosts } from '../utils/posts.js';
import BlogPostCard from './BlogPostCard.vue';

const PAGE_SIZE = 12;

const allPosts = getBlogPosts();
const currentPage = ref(1);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const p = parseInt(params.get('page'), 10);
  if (p && p > 0) currentPage.value = p;
});

const blogPosts = computed(() => {
  if (props.limit) return allPosts.slice(0, props.limit);
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return allPosts.slice(start, start + PAGE_SIZE);
});

const totalPages = computed(() => Math.ceil(allPosts.length / PAGE_SIZE));
const rangeStart = computed(() => (currentPage.value - 1) * PAGE_SIZE + 1);
const rangeEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, allPosts.length));

function goToPage(page) {
  currentPage.value = page;
  const params = new URLSearchParams(window.location.search);
  if (page === 1) {
    params.delete('page');
  } else {
    params.set('page', page);
  }
  const qs = params.toString();
  history.pushState(null, '', qs ? `?${qs}` : window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <section>
    <h2 v-if="title">{{ title }}</h2>
    <ul class="post-grid" :class="`post-grid--${layout}`">
      <li v-for="post in blogPosts" :key="post.path">
        <BlogPostCard :post="post" />
      </li>
    </ul>
    <div v-if="ctaText" class="cta">
      <a class="cta__link" :href="ctaHref">{{ ctaText }}</a>
    </div>
    <div v-if="!props.limit && totalPages > 1" class="pagination">
      <button
        class="pagination__btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >Previous</button>
      <span class="pagination__counter">{{ rangeStart }}–{{ rangeEnd }} of {{ allPosts.length }}</span>
      <button
        class="pagination__btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >Next</button>
    </div>
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
  transition: background var(--duration-fast) var(--ease-out);
}

.cta__link:hover,
.cta__link:focus-visible {
  background: var(--text-color);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination__btn {
  background: var(--text-muted);
  color: oklch(from var(--bg-color) l c h / 1);
  border: none;
  border-radius: var(--radius-rounded);
  padding: 0.5rem 1.5rem;
  font-family: var(--font-brand);
  font-size: var(--text-size-7);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.pagination__btn:hover:not(:disabled),
.pagination__btn:focus-visible:not(:disabled) {
  background: var(--text-color);
}

.pagination__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination__counter {
  font-variant-numeric: tabular-nums;
  font-family: var(--font-brand);
  font-size: var(--text-size-7);
  color: inherit;
}
</style>
