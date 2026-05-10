<script setup>
import { useData, useRoute } from 'vitepress';

const { site } = useData();
const route = useRoute();

const isActive = (path) => {
  const normalized = path.replace('./', '/');
  return route.path === normalized || route.path === normalized + '.html';
};

const pageFiles = import.meta.glob('/*.md', { eager: true });

const pages = Object.entries(pageFiles).map(([path, mod]) => {
  const slug = path.split('/').pop().replace(/\.md$/, '');
  return {
    path: `/${slug}`,
    title: mod.__pageData?.frontmatter?.title || slug,
  };
});

const pagesToExclude = [
	'collections',
	'html-styles',
	// 'uses',
	'markdown-examples',
	'index'
];
const pagesToShow = pages.filter(p => !pagesToExclude.includes(p.path.replace('/', '')));
</script>

<template>
  <header>
    <a class="logo" href="/"><span><b>@</b>{{ site.title }}</span></a>
    <nav>
      <ul>
        <li v-for="p in pagesToShow" :key="p.path">
          <a :href="p.path" :class="{ active: isActive(p.path) }">{{ p.title }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
	margin-block-end: 3rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: inherit;
}

.logo b {
  color: var(--brand-color);
}

nav {
  display: flex;
  align-items: center;
  background: #16161d;
  border-radius: 9999px;
  padding: 0.25rem;
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.35), 0 1px 4px oklch(0 0 0 / 0.2);
}

ul {
  display: flex;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

li a {
  display: block;
  background: #16161d;
  color: white;
  border-radius: 9999px;
  padding: 0.375rem 0.875rem;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background 0.15s;
	white-space: nowrap;
}

li a:hover {
  background: oklch(28.502% 0.00003 271.152);
}

li a.active {
	font-weight: 700;
  color: var(--brand-color);
	background: oklch(28.502% 0.00003 271.152);
}
</style>
