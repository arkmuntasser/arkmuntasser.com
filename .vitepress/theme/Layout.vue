<script setup>
import { Content, useData } from 'vitepress';
import BlueskyFeed from './components/BlueskyFeed.vue';
import IntroCopy from './components/IntroCopy.vue';
import IntroSection from './components/IntroSection.vue';
import SiteHeader from './components/SiteHeader.vue';

const { page, frontmatter } = useData();

// Dynamically import all markdown files in the posts directory
const postFiles = import.meta.glob('/posts/*.md', { eager: true });

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



		<IntroSection>
			<template #left>
				<SiteHeader />
				<IntroCopy />
			</template>
			<template #right>
				<BlueskyFeed limit="15"/>
			</template>
		</IntroSection>
		<h2>Blog Posts</h2>
    <ul>
      <li v-for="post in blogPosts" :key="post.path">
        <a :href="post.path">{{ post.title }}</a>
        <span v-if="post.date">({{ post.date }})</span>
      </li>
    </ul>

  </div>
  <div v-else>
    <SiteHeader />
		<Content />
  </div>
</template>
