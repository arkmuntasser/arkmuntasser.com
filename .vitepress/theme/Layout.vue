<script setup>
import { computed } from 'vue';
import { Content, useData } from 'vitepress';
import IntroSection from './components/IntroSection.vue';
import SiteHeader from './components/SiteHeader.vue';
import ChannelContent from './components/ChannelContent.vue';
import SiteFooter from './components/SiteFooter.vue';
import PageHeader from './components/PageHeader.vue';
import BlogPostList from './components/BlogPostList.vue';
import SocialLinks from './components/SocialLinks.vue';
import TableOfContents from './components/TableOfContents.vue';
import Changelog from './components/Changelog.vue';

const { page, frontmatter } = useData();
const isBlogPost = computed(() => page.value?.filePath?.includes('posts'));
</script>

<template>
	<div v-if="page.isNotFound">
		Custom 404 page!
  </div>
  <div v-else-if="frontmatter.home" class="homepage">

		<IntroSection>
			<template #left>
				<SiteHeader />
				<div class="markdown-content markdown-content__homepage">
					<Content />
					<SocialLinks />
				</div>
				<!-- <IntroCopy /> -->
				<SiteFooter />
			</template>
			<template #right>
				<ChannelContent />
			</template>
		</IntroSection>

  </div>
	<div v-else-if="frontmatter.title === 'Blog'" class="page">
		<SiteHeader />
		<section class="page-content">
			<PageHeader
				:title="frontmatter.title"
				:excerpt="frontmatter.excerpt"
				:category="frontmatter.category"
				:date="frontmatter.date"
			/>
			<div class="markdown-content">
				<Content />
			</div>
		</section>
		<main class="widget-content-narrow">
			<BlogPostList />
		</main>
		<SiteFooter />
	</div>
	<div v-else-if="isBlogPost" class="page">
		<SiteHeader />
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
				<div class="markdown-content">
					<Content />
				</div>
				<Changelog :entries="frontmatter.changelog" />
			</main>
		</div>
		<SiteFooter />
	</div>
  <div v-else class="page">
    <SiteHeader />
		<PageHeader
			:title="frontmatter.title"
			:excerpt="frontmatter.excerpt"
			:category="frontmatter.category"
			:date="frontmatter.date"
		/>
		<main class="page-content">
			<div class="markdown-content">
				<Content />
			</div>
		</main>
		<SiteFooter />
  </div>
</template>

<style scoped>
.page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.post-layout {
	display: grid;
	grid-template-columns: 100%;
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

.post-layout :deep(.page-header) {
	grid-area: header;
	max-width: none;
	margin-inline: 0;
}

.post-layout :deep(.page-header :is(h1, p)) {
	max-width: 86ch;
}

.page-content {
	grid-area: content;
}

.toc-sidebar {
	grid-area: aside;
	position: static;
	top: 2rem;
	min-width: 0;
}

@media (min-width: 901px) {
	.post-layout {
		grid-template-columns: minmax(0, 72ch) 16rem;
		grid-auto-rows: min-content;
		grid-template-areas:
			"header header"
			"content aside";
	}

	.toc-sidebar {
		position: sticky;
	}
}
</style>
