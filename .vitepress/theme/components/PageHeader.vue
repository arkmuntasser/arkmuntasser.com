<script setup>
defineProps({
	title: String,
	excerpt: String,
	category: Array,
	date: String,
});
</script>

<template>
	<header class="page-header">
		<ul v-if="category" class="page-header__tags">
			<li v-for="cat in category" :key="cat">{{ cat }}</li>
		</ul>
		<h1 class="page-header__title">{{ title }}</h1>
		<p v-if="excerpt" class="page-header__excerpt">{{ excerpt }}</p>
		<time v-if="date" class="page-header__date" :datetime="date">
			{{ new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}
		</time>
	</header>
</template>

<style scoped>
.page-header {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding-block-end: 2rem;
	border-bottom: 1px solid oklch(0 0 0 / 0.1);
	margin-block-end: 2.5rem;
	margin-inline: auto;
	max-width: 86ch;
	width: 100%;
}

.page-header__tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	list-style: none;
	margin: 0;
	padding: 0;
}

.page-header__tags li {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--brand-color);
}

.page-header__tags li::before {
	content: '+';
}

.page-header__title {
	font-size: 3rem;
	font-weight: 800;
	line-height: 1.05;
	letter-spacing: -0.03em;
	color: oklch(0.1 0.005 270);
	margin: 0;
}

.page-header__title::after {
	content: '.';
	color: var(--brand-color);
}

.page-header__excerpt {
	font-size: 1.125rem;
	line-height: 1.6;
	color: oklch(0.35 0.005 270);
	margin: 0;
	font-weight: 300;
}

.page-header__date {
	font-size: 0.8125rem;
	font-weight: 500;
	letter-spacing: 0.02em;
	color: oklch(0.55 0.005 270);
}
</style>
