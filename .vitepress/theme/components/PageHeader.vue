<script setup>
import { computed } from 'vue';

const props = defineProps({
	title: String,
	excerpt: String,
	category: Array,
	date: String,
	updated: String,
	changelog: Array
});

const stamp = (value) => {
	const d = new Date(value);
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
};

const longDate = (value) =>
	new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const dates = computed(() => [
	props.date && { label: 'Published', value: props.date },
	props.updated && { label: 'Updated', value: props.updated },
].filter(Boolean));
</script>

<template>
	<header class="page-header markdown-content stack">
		<ul v-if="category" class="page-header__tags row">
			<li v-for="cat in category" :key="cat">{{ cat }}</li>
		</ul>
		<h1 class="page-header__title">{{ title }}</h1>
		<p v-if="excerpt" class="page-header__excerpt">{{ excerpt }}</p>
		<p v-if="dates.length || changelog" class="page-header__meta">
			<template v-for="(d, i) in dates" :key="d.label">
				<span v-if="i > 0" class="page-header__sep" aria-hidden="true">·</span>
				<span>
					<span class="page-header__label">{{ d.label }}</span>
					<time class="page-header__date" :datetime="d.value"
						><span aria-hidden="true">{{ stamp(d.value) }}</span
						><span class="sr-only">{{ longDate(d.value) }}</span></time
					>
				</span>
			</template>
			<template v-if="changelog">
				<span v-if="dates.length" class="page-header__sep" aria-hidden="true">·</span>
				<a href="#changelog" class="page-header__changelog-link">Changelog <span aria-hidden="true">↓</span></a>
			</template>
		</p>
	</header>
</template>

<style>
@layer theme.components {
	@scope(.page-header) {
		:scope {
			--stack-gap: 0.75rem;
			--ink: oklch(from var(--brand-color) 20% 0.03 h);
			--brand-ink: oklch(from var(--brand-color) 52% 0.22 h);

			position: relative;
			padding-block-end: 2rem;
			border-bottom: 1px solid oklch(from var(--text-muted) l c h / 0.1);
			margin-block-end: 2.5rem;

			/* Short pink bar on the rule, like the nav and card bars */
			&::after {
				content: "";
				position: absolute;
				inset-inline-start: 0;
				inset-block-end: -2px;
				width: 3rem;
				height: 4px;
				background: var(--brand-color);
			}
		}

		.page-header__tags {
			--row-gap: 0.25rem 1rem;

			list-style: none;
			margin: 0;
			padding: 0;

			& li {
				margin: 0;
				font-family: "JetBrains Mono", ui-monospace, monospace;
				font-size: 0.75rem;
				font-weight: 700;
				text-transform: uppercase;
				letter-spacing: 0.04em;
				color: var(--brand-ink);

				&::marker { content: ""; }
				&::before { content: "+"; }
			}
		}

		.page-header__excerpt {
			font-size: var(--text-size-6);
		}

		.page-header__meta {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: 0.375rem 1rem;
			margin: 0;
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.75rem;
			letter-spacing: 0.02em;
			color: var(--text-muted);
		}

		.page-header__label {
			margin-inline-end: 0.375rem;
			text-transform: uppercase;
		}

		.page-header__date {
			color: var(--ink);
			font-weight: 700;
			font-variant-numeric: tabular-nums;
		}

		.page-header__sep {
			color: var(--brand-color);
		}

		.page-header__changelog-link {
			color: var(--brand-ink);
			background: none;
			font-weight: 700;
			text-transform: uppercase;
			text-decoration: underline 1px transparent;
			text-underline-offset: 0.2em;
			transition: text-decoration-color 0.15s;

			&:hover {
				text-decoration-color: currentColor;
			}

			&:focus-visible {
				outline: 2px solid var(--brand-ink);
				outline-offset: 2px;
			}
		}
	}
}
</style>
