<script setup>
import { Content, useData } from 'vitepress';
import BlueskyFeed from './components/BlueskyFeed.vue';

const { site, page, frontmatter } = useData();

// Dynamically import all markdown files in the root and posts directories
const postFiles = import.meta.glob('/posts/*.md', { eager: true });
const pageFiles = import.meta.glob('/*.md', { eager: true });

// Process the imported files to extract paths, titles, and dates
const pages = Object.entries(pageFiles).map(([path, mod]) => {
  const slug = path.split('/').pop().replace(/\.md$/, '');
  return {
    path: `./${slug}`,
    title: mod.__pageData?.frontmatter?.title || slug,
    date: mod.__pageData?.frontmatter?.date,
  };
});

const blogPosts = Object.entries(postFiles).map(([path, mod]) => {
  const slug = path.split('/').pop().replace(/\.md$/, '');
  return {
    path: `/posts/${slug}`,
    title: mod.__pageData?.frontmatter?.title || slug,
    date: mod.__pageData?.frontmatter?.date,
  };
});

// Sort blog posts by date (newest first), then by title
blogPosts.sort((a, b) => {
	if (a.date && b.date) {
		return new Date(b.date) - new Date(a.date);
	}
	return a.title.localeCompare(b.title);
});
</script>

<template>
	<div v-if="page.isNotFound">
		Custom 404 page!
  </div>
  <div v-else-if="frontmatter.home">
    <h1>{{ site.title }}</h1>
    <p>{{ site.description }}</p>
    <ul>
			<li v-for="p in pages" :key="p.path">
        <a :href="p.path">{{ p.title }}</a>
      </li>
    </ul>
		<h2>Blog Posts</h2>
    <ul>
      <li v-for="post in blogPosts" :key="post.path">
        <a :href="post.path">{{ post.title }}</a>
        <span v-if="post.date">({{ post.date }})</span>
      </li>
    </ul>
		<h2>Bluesky</h2>
		<BlueskyFeed />
		<Content />
  </div>
  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>
</template>
