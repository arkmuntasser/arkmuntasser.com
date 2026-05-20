<script setup>
defineProps({
	entries: Array
});
</script>

<template>
	<aside v-if="entries?.length" id="changelog" class="changelog">
		<h2 class="changelog__heading">Changelog</h2>
		<ul class="changelog__list">
			<li v-for="(entry, i) in entries" :key="i" class="changelog__item">{{ entry }}</li>
		</ul>
	</aside>
</template>

<style scoped>
.changelog {
	margin-block-start: 3rem;
	padding-block-start: 1.5rem;
	border-top: 1px solid oklch(0 0 0 / 0.08);
}

.changelog__heading {
	font-size: 0.6875rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: oklch(0.65 0.005 270);
	margin: 0 0 0.75rem;
}

.changelog__list {
	margin: 0;
	padding-inline-start: 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
}

.changelog__item {
	font-size: 0.8125rem;
	color: oklch(0.6 0.005 270);
	line-height: 1.5;
}
</style>
