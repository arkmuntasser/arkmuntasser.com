<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Content, useData } from 'vitepress';
import { onContentUpdated } from 'vitepress';
import IntroSection from './components/IntroSection.vue';
import SiteHeader from './components/SiteHeader.vue';
import ChannelContent from './components/ChannelContent.vue';
import SiteFooter from './components/SiteFooter.vue';
import PageHeader from './components/PageHeader.vue';
import BlogPostList from './components/BlogPostList.vue';
import SocialLinks from './components/SocialLinks.vue';
import TableOfContents from './components/TableOfContents.vue';
import Changelog from './components/Changelog.vue';
import WorkPositions from './components/WorkPositions.vue';
import MarkdownContent from './components/MarkdownContent.vue';

const siteUrl = 'https://arkmuntasser.com';

const { page, site, frontmatter } = useData();

const ogTitle = computed(() => frontmatter.value.title ?? site.value.title);
const ogDescription = computed(() => frontmatter.value.excerpt ?? site.value.description);
const ogSlug = computed(() => {
  let slug = page.value.relativePath.replace(/\.md$/, '').replace(/^posts\//, '');
  return slug === 'index' ? 'index' : slug;
});
const ogImage = computed(() => `${siteUrl}/og/${ogSlug.value}.png`);
const ogUrl = computed(() => {
  const pagePath = page.value.relativePath
    .replace(/\.md$/, '')
    .replace(/(^|\/)index$/, '$1')
    .replace(/\/$/, '');
  return pagePath ? `${siteUrl}/${pagePath}` : siteUrl;
});

function setMeta(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function updateOgTags() {
  setMeta('property', 'og:title', ogTitle.value);
  setMeta('property', 'og:description', ogDescription.value);
  setMeta('property', 'og:image', ogImage.value);
  setMeta('property', 'og:url', ogUrl.value);
  setMeta('name', 'twitter:image', ogImage.value);
}

onMounted(updateOgTags);
onContentUpdated(updateOgTags);
const isBlogPost = computed(() => page.value?.filePath?.includes('posts'));

const isWide = ref(false);

function checkWidth() {
  isWide.value = window.matchMedia('(min-width: 48rem)').matches;
}

onMounted(() => {
  checkWidth();
  window.addEventListener('resize', checkWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth);
});
</script>

<template>
	<!-- 404 Page -->
	<div v-if="page.isNotFound">
		Custom 404 page!
  </div>
	<!-- Homepage -->
  <div v-else-if="frontmatter.home" class="homepage">

		<IntroSection>
			<template #left>
				<SiteHeader class="header" />
				<MarkdownContent class="markdown-content__homepage">
					<Content />
					<SocialLinks />
				</MarkdownContent>
				<ChannelContent v-if="!isWide" />
				<SiteFooter />
			</template>
			<template #right>
				<ChannelContent v-if="isWide" />
			</template>
		</IntroSection>

  </div>
	<!-- About Page -->
	<div v-else-if="frontmatter.title === 'About'" class="page breakout-container">
		<SiteHeader class="header" />
		<div class="about-layout">
			<PageHeader
				:title="frontmatter.title"
				:excerpt="frontmatter.excerpt"
				:category="frontmatter.category"
				:date="frontmatter.date"
			/>
			<main class="page-content">
				<MarkdownContent>
					<Content />
				</MarkdownContent>
			</main>
			<aside class="career-history">
				<WorkPositions />
			</aside>
		</div>
		<SiteFooter />
	</div>
	<!-- Blog Page -->
	<div v-else-if="frontmatter.title === 'Blog'" class="page breakout-container">
		<SiteHeader class="header" />
		<div>
			<section class="page-content">
				<PageHeader
					:title="frontmatter.title"
					:excerpt="frontmatter.excerpt"
					:category="frontmatter.category"
					:date="frontmatter.date"
				/>
				<MarkdownContent>
					<Content />
				</MarkdownContent>
			</section>
			<main class="widget-content-narrow">
				<BlogPostList />
			</main>
		</div>
		<SiteFooter />
	</div>
	<!-- Blog Post Page -->
	<div v-else-if="isBlogPost" class="page breakout-container">
		<SiteHeader class="header" />
		<div class="post-layout">
			<PageHeader
				:title="frontmatter.title"
				:excerpt="frontmatter.excerpt"
				:category="frontmatter.category"
				:date="frontmatter.date"
				:updated="frontmatter.updated"
				:changelog="frontmatter.changelog"
			/>
			<aside class="toc-sidebar">
				<TableOfContents />
			</aside>
			<main class="page-content">
				<MarkdownContent>
					<Content />
				</MarkdownContent>
				<Changelog :entries="frontmatter.changelog" />
			</main>
		</div>
		<SiteFooter />
	</div>
	<!-- Default Page Layout -->
  <div v-else class="page breakout-container">
    <SiteHeader class="header" />
		<div>
			<PageHeader
				:title="frontmatter.title"
				:excerpt="frontmatter.excerpt"
				:category="frontmatter.category"
				:date="frontmatter.date"
			/>
			<main class="page-content">
				<MarkdownContent>
					<Content />
				</MarkdownContent>
			</main>
		</div>
		<SiteFooter />
  </div>
</template>

<style scoped>
:is(.post-layout, .about-layout) {
	display: grid;
	grid-template-columns: 100%;
	grid-auto-rows: min-content;
	grid-template-areas:
		"header"
		"aside"
		"content";
	column-gap: 3rem;
	align-items: start;
	max-width: calc(72ch + 3rem + 16rem);
	margin-inline: auto;
	width: 100%;
	flex: 1;
}

.about-layout {
	max-width: calc(72ch + 3rem + 16rem);
	grid-template-areas:
		"header"
		"content"
		"aside";
}

:is(.post-layout, .about-layout) :deep(.page-header) {
	grid-area: header;
	max-width: none;
	margin-inline: 0;
}

:is(.post-layout, .about-layout) :deep(.page-header :is(h1, p)) {
	max-width: 86ch;
}

.career-history {
	grid-area: aside;
}

.toc-sidebar {
	grid-area: aside;
	position: static;
	top: 2rem;
	min-width: 0;
}

@media (min-width: 901px) {
	:is(.post-layout, .about-layout) {
		grid-template-columns: minmax(0, 72ch) 16rem;
		grid-auto-rows: min-content;
		grid-template-areas:
			"header header"
			"content aside";
	}

	.about-layout {
		grid-template-columns: auto 16rem;
	}

	.toc-sidebar {
		position: sticky;
	}
}
</style>
