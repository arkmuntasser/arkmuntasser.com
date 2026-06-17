<script setup>
defineProps({
	entries: Array
});
</script>

<template>
	<aside v-if="entries?.length" id="changelog" class="changelog">
		<h2 class="changelog__heading">Changelog</h2>
		<ul class="changelog__list stack">
			<li v-for="(entry, i) in entries" :key="i" class="changelog__item">{{ entry }}</li>
		</ul>
	</aside>
</template>

<style>
@layer theme.components {
	@scope(.changelog) {
		:scope {
			margin-block-start: 3rem;
			padding-block-start: 1.5rem;
			border-top: 1px solid oklch(0 0 0 / 0.1);
		}

		.changelog__heading {
			font-size: var(--text-size-9);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: var(--text-muted);
			margin: 0;
			margin-block-end: 0.75rem;
		}

		.changelog__list {
			--stack-gap: 0.375rem;

			margin: 0;
			padding-inline-start: 1.25rem;
		}

		.changelog__item {
			font-size: var(--text-size-8);
			color: var(--text-muted);
		}
	}
}
</style>
