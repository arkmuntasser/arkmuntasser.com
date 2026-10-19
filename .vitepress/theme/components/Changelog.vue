<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
	entries: Array,
	date: String,
	updated: String,
	tone: String
});

const details = ref(null);

const stamp = (value) => {
	const d = new Date(value);
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
};

const longDate = (value) =>
	new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Open the panel when a reader arrives via #changelog (direct load or the header link).
// Runs on click in the capture phase so it is open before the router scrolls to it.
function openFromHash() {
	if (details.value && window.location.hash === '#changelog') details.value.open = true;
}

function onClick(event) {
	const link = event.target.closest?.('a[href="#changelog"]');
	if (link && details.value) details.value.open = true;
}

onMounted(() => {
	openFromHash();
	window.addEventListener('hashchange', openFromHash);
	document.addEventListener('click', onClick, true);
});

onUnmounted(() => {
	window.removeEventListener('hashchange', openFromHash);
	document.removeEventListener('click', onClick, true);
});
</script>

<template>
	<details
		v-if="entries?.length"
		id="changelog"
		ref="details"
		class="changelog"
		:class="{ 'changelog--somber': tone === 'somber' }"
	>
		<summary class="changelog__summary">
			<span class="changelog__heading">Changelog</span>
			<span class="changelog__sep" aria-hidden="true">·</span>
			<span><b>{{ entries.length }}</b> {{ entries.length === 1 ? 'change' : 'changes' }}</span>
			<template v-if="updated">
				<span class="changelog__sep" aria-hidden="true">·</span>
				<span
					>Revised
					<time :datetime="updated"
						><span aria-hidden="true">{{ stamp(updated) }}</span
						><span class="sr-only">{{ longDate(updated) }}</span></time
					></span
				>
			</template>
			<span class="changelog__toggle" aria-hidden="true"></span>
		</summary>
		<ol class="changelog__list">
			<li v-for="(entry, i) in entries" :key="i" class="changelog__item">{{ entry }}</li>
		</ol>
		<p v-if="date" class="changelog__published">
			First published
			<time :datetime="date"
				><span aria-hidden="true">{{ stamp(date) }}</span
				><span class="sr-only">{{ longDate(date) }}</span></time
			>
		</p>
	</details>
</template>

<style>
@layer theme.components {
	@scope(.changelog) {
		:scope {
			--ink: oklch(from var(--brand-color) 20% 0.03 h);
			--ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
			--brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
			--ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);

			position: relative;
			container-type: inline-size;
			margin-block-start: 3rem;
			border-block: 1px solid oklch(from var(--text-muted) l c h / 0.15);
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.75rem;
			color: var(--ink-muted);
			interpolate-size: allow-keywords;
		}

		/* Pink segment on the top hairline, echoing the pager */
		:scope::before {
			content: "";
			position: absolute;
			inset-inline-start: 0;
			inset-block-start: -2px;
			width: 3rem;
			height: 4px;
			background: var(--brand-color);
		}

		.changelog__summary {
			position: relative;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			column-gap: 0.75rem;
			min-height: 2.75rem;
			padding-block: 0.375rem;
			padding-inline-end: 2.5rem;
			list-style: none;
			cursor: pointer;
			font-variant-numeric: tabular-nums;

			&::-webkit-details-marker {
				display: none;
			}

			& b {
				color: var(--ink);
			}
		}

		.changelog__heading {
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--ink);
			text-decoration: underline 1px transparent;
			text-underline-offset: 0.25em;
			transition: text-decoration-color 0.15s;
		}

		.changelog__sep {
			opacity: 0.5;
		}

		.changelog__toggle {
			position: absolute;
			inset-inline-end: 0;
			inset-block-start: 50%;
			translate: 0 -50%;
			display: grid;
			place-items: center;
			width: 1.5rem;
			height: 1.5rem;
			border: 1px solid var(--ink);
			color: var(--ink);
			font-size: 0.875rem;
			font-weight: 700;
			line-height: 1;
			transition: background-color 0.15s;

			&::before {
				content: "+";
			}
		}

		:scope[open] .changelog__toggle::before {
			content: "\2212";
		}

		.changelog__summary:hover {
			& .changelog__heading {
				text-decoration-color: var(--brand-color);
			}

			& .changelog__toggle {
				background: oklch(from var(--brand-color) 95% 0.08 h);
			}
		}

		.changelog__summary:focus-visible {
			outline: 2px solid var(--brand-ink);
			outline-offset: 2px;
		}

		.changelog__list {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin: 0;
			padding: 0.25rem 0 0.75rem;
			list-style: none;
			counter-reset: changelog;
		}

		.changelog__item {
			display: grid;
			grid-template-columns: 2.25rem 1fr;
			align-items: baseline;
			counter-increment: changelog;
			font-family: var(--font-brand);
			font-size: var(--text-size-8);
			line-height: 1.45;
			color: var(--ink);

			&::before {
				content: counter(changelog, decimal-leading-zero);
				font-family: "JetBrains Mono", ui-monospace, monospace;
				font-size: 0.75rem;
				font-weight: 700;
				color: var(--brand-ink);
			}
		}

		.changelog__published {
			margin: 0 0 1rem 2.25rem;
			font-size: 0.6875rem;
		}

		/* Somber posts: neutral ink instead of pink */
		:scope.changelog--somber::before {
			background: var(--ink);
		}

		:scope.changelog--somber .changelog__item::before {
			color: var(--ink-muted);
		}

		/* Narrow: heading on its own line so separators never dangle */
		@container (max-width: 30rem) {
			.changelog__heading {
				flex-basis: 100%;
			}

			.changelog__heading + .changelog__sep {
				display: none;
			}

			.changelog__published {
				margin-inline-start: 0;
			}
		}

		@media (prefers-reduced-motion: no-preference) {
			:scope::details-content {
				height: 0;
				overflow: clip;
				transition:
					height 300ms var(--ease-out),
					content-visibility 300ms allow-discrete;
			}

			:scope[open]::details-content {
				height: auto;
			}
		}
	}
}
</style>
