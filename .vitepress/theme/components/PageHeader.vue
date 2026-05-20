<script setup>
defineProps({
	title: String,
	excerpt: String,
	category: Array,
	date: String,
	updated: String,
	changelog: Array
});
</script>

<template>
	<header class="page-header">
		<ul v-if="category" class="page-header__tags">
			<li v-for="cat in category" :key="cat">{{ cat }}</li>
		</ul>
		<h1 class="page-header__title">{{ title }}</h1>
		<p v-if="excerpt" class="page-header__excerpt">{{ excerpt }}</p>
		<p class="page-header__meta">
			<time v-if="date" class="page-header__date" :datetime="date">
				Published on {{ new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}
			</time>
			<span v-if="date && updated">|</span>
			<time v-if="updated" class="page-header__date" :datetime="updated">
				Updated on {{ new Date(updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}
			</time>
			<span v-if="(date || updated) && changelog">&nbsp;</span>
			<a v-if="changelog" href="#changelog" class="page-header__changelog-link">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12.516 8.016v4.219l3.469 2.109-0.703 1.219-4.266-2.578v-4.969h1.5zM21 10.125h-6.797l2.766-2.813q-2.063-2.063-4.945-2.086t-4.945 1.992q-0.844 0.844-1.453 2.273t-0.609 2.602 0.609 2.602 1.453 2.273 2.297 1.453 2.625 0.609 2.648-0.609 2.32-1.453q2.016-2.016 2.016-4.875h2.016q0 3.703-2.625 6.281-2.625 2.625-6.375 2.625t-6.375-2.625q-2.625-2.578-2.625-6.258t2.625-6.305q1.078-1.078 2.93-1.852t3.398-0.773 3.398 0.773 2.93 1.852l2.719-2.813v7.125z"/></svg>
				View changelog
			</a>
		</p>

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

.page-header__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 1ch;
	font-weight: 500;
	color: oklch(0.55 0.005 270);
}

.page-header__date {
	font-size: 0.8125rem;
	font-weight: 500;
	letter-spacing: 0.02em;
	color: oklch(0.55 0.005 270);
}

.page-header__changelog-link {
	display: inline-flex;
	align-items: baseline;
	gap: 0.3em;
	font-size: 0.8125rem;
	font-weight: 400;
	color: var(--brand-color);
	text-decoration-color: color-mix(in oklch, var(--brand-color), transparent 60%);
	transition: color 0.15s, text-decoration-color 0.15s;
}

.page-header__changelog-link svg {
	flex-shrink: 0;
	fill: currentColor;
	align-self: center;
	width: 1.5em;
}
</style>
