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
		<main>
			<h1>{{ site.title }}</h1>
			<p>Hello!</p>
			<p>I’m Amir R Muntasser and I’m a <b>web developer</b>, <b>wizard</b>, <b>sneaker enthusiast</b> and current <b>Director of Web Development</b> at <b>Granicus Destinations</b>.</p>
			<p>Who would have thought that a young, boy from the Southwest would one day grow up to be a winner of one the coveted <a href="https://bsky.app/profile/arkmuntasser.com/post/3lbd3hxods226" target="_blank">Vuenicorns</a> from the very first <b>VueConf Toronto</b> by building a <a href="https://codepen.io/arkmuntasser/pen/QJvPeB">clone of Simon</a>? No one, because that would have been absolutely wild for anyone to concieve and yet here we are and that's what happened.</p>
			<p>I don't code as much as I used to, but I think about it a lot…</p>
		</main>

    <ul>
			<li v-for="p in pages" :key="p.path">
        <a :href="p.path">{{ p.title }}</a>
      </li>
    </ul>
		<BlueskyFeed />
		<h2>Blog Posts</h2>
    <ul>
      <li v-for="post in blogPosts" :key="post.path">
        <a :href="post.path">{{ post.title }}</a>
        <span v-if="post.date">({{ post.date }})</span>
      </li>
    </ul>
		<Content />
  </div>
  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>
</template>
