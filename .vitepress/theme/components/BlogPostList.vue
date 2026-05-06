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

import { getBlogPosts } from '../utils/posts.js';
import BlogPostCard from './BlogPostCard.vue';

const allPosts = getBlogPosts();
const blogPosts = props.limit ? allPosts.slice(0, props.limit) : allPosts;
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
  </section>
</template>

<style scoped>
section {
  container-type: inline-size;
}

h2 {
  font-family: "Outfit", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
}


.post-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
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
  background: #16161d;
  color: white;
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  font-family: "Outfit", sans-serif;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background 0.15s;
}

.cta__link:hover,
.cta__link:focus-visible {
  background: oklch(28.502% 0.00003 271.152);
  outline: none;
}
</style>
