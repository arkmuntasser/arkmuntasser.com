<script setup>
import { Content, useData } from 'vitepress';
import IntroCopy from './components/IntroCopy.vue';
import IntroSection from './components/IntroSection.vue';
import SiteHeader from './components/SiteHeader.vue';
import ChannelContent from './components/ChannelContent.vue';
import SiteFooter from './components/SiteFooter.vue';
import PageHeader from './components/PageHeader.vue';

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
				<ChannelContent />
			</template>
		</IntroSection>

  </div>
  <div v-else class="page">
    <SiteHeader />
		<main class="page-content">
			<PageHeader
				:title="frontmatter.title"
				:excerpt="frontmatter.excerpt"
				:category="frontmatter.category"
				:date="frontmatter.date"
			/>
			<div class="markdown-content">
				<Content />
			</div>
			<footer></footer>
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
