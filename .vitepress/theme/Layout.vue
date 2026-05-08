<script setup>
import { Content, useData } from 'vitepress';
import BlueskyFeed from './components/BlueskyFeed.vue';
import BlogPostList from './components/BlogPostList.vue';
import IntroCopy from './components/IntroCopy.vue';
import IntroSection from './components/IntroSection.vue';
import PopfeedReviews from './components/PopfeedReviews.vue';
import SiteHeader from './components/SiteHeader.vue';
import ChannelContent from './components/ChannelContent.vue';
import GithubProjects from './components/GithubProjects.vue';
import SiteFooter from './components/SiteFooter.vue';

const { page, frontmatter } = useData();
</script>

<template>
	<div v-if="page.isNotFound">
		Custom 404 page!
  </div>
  <div v-else-if="frontmatter.home" class="homepage">



		<IntroSection>
			<template #left>
				<SiteHeader />
				<IntroCopy />
				<SiteFooter />
			</template>
			<template #right>
				<!-- <BlueskyFeed limit="15"/> -->
				<ChannelContent />
			</template>
		</IntroSection>
		<!-- <GithubProjects :limit="10" /> -->
		<!-- <PopfeedReviews :limit="12" /> -->
		<!-- <BlogPostList :limit="6" title="Blog Posts" cta-text="See All blog posts" layout="grid"/> -->



  </div>
  <div v-else class="page">
    <SiteHeader />
		<main class="markdown-content">
			<Content />
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
</style>
