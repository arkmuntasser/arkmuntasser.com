<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const headers = ref([]);
const activeSlug = ref('');
const popoverEl = ref(null);

let rafId;

const INTRO = { slug: '', title: 'Introduction', level: 2 };

// Sections are the intro plus every h2; h3s are numbered within their section (4.1, 4.2…)
const entries = computed(() => {
	let section = 1;
	let sub = 0;
	return [
		{ ...INTRO, label: '01', section: 1 },
		...headers.value.map((h) => {
			if (h.level === 2) {
				section += 1;
				sub = 0;
				return { ...h, label: String(section).padStart(2, '0'), section };
			}
			sub += 1;
			return { ...h, label: `${section}.${sub}`, section };
		}),
	];
});

const sectionCount = computed(() => entries.value.filter((e) => e.level === 2).length);
const activeEntry = computed(() => entries.value.find((e) => e.slug === activeSlug.value) ?? entries.value[0]);
const position = computed(() =>
	activeEntry.value.level === 2 ? String(activeEntry.value.section) : activeEntry.value.label
);

function updateActive() {
	const headingEls = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
	// A heading becomes current once it reaches the top of the viewport (just past its
	// 4rem scroll-margin). Measured from the viewport, since offsetTop is relative to the
	// nearest positioned ancestor and ran ahead of the reader.
	const threshold = 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
	let current = '';

	headingEls.forEach((h) => {
		if (h.getBoundingClientRect().top <= threshold) {
			current = h.id;
		}
	});

	activeSlug.value = current;
}

function collectHeaders() {
	const headingEls = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
	headers.value = Array.from(headingEls).map((h) => ({
		slug: h.id,
		title: h.textContent,
		level: Number(h.tagName[1]),
	}));
	activeSlug.value = '';
	updateActive();
}

function onScroll() {
	cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(updateActive);
}

function closePopover() {
	popoverEl.value?.hidePopover?.();
}

watch(() => route.path, async () => {
	await nextTick();
	collectHeaders();
});

onMounted(() => {
	collectHeaders();
	window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll);
	cancelAnimationFrame(rafId);
});
</script>

<template>
	<div v-if="headers.length" class="toc-wrapper">
		<!-- Mobile: a strip that opens the list in an anchored popover -->
		<button type="button" class="toc__toggle" popovertarget="toc-popover">
			<span class="toc__toggle-label">Contents</span>
			<span class="toc__toggle-now">{{ activeEntry.title }}</span>
			<span class="toc__toggle-pos"
				><span aria-hidden="true">{{ position }}<span class="toc__toggle-total"> / {{ sectionCount }}</span></span
				><span class="sr-only">, section {{ position }} of {{ sectionCount }}</span></span
			>
			<span class="toc__toggle-chevron" aria-hidden="true">▾</span>
		</button>

		<nav class="toc__nav" aria-labelledby="toc-label">
			<p id="toc-label" class="toc__label">Contents</p>
			<ul class="toc__list">
				<li
					v-for="entry in entries"
					:key="entry.slug || 'intro'"
					class="toc__item"
					:class="{ 'toc__item--h3': entry.level === 3 }"
				>
					<a
						:href="entry.slug ? `#${entry.slug}` : '#'"
						class="toc__link"
						:aria-current="entry === activeEntry ? 'location' : undefined"
						><span class="toc__num" aria-hidden="true">{{ entry.label }}</span>{{ entry.title }}</a
					>
				</li>
			</ul>
		</nav>

		<nav id="toc-popover" ref="popoverEl" popover class="toc__popover" aria-label="Contents">
			<ul class="toc__list">
				<li
					v-for="entry in entries"
					:key="entry.slug || 'intro'"
					class="toc__item"
					:class="{ 'toc__item--h3': entry.level === 3 }"
				>
					<a
						:href="entry.slug ? `#${entry.slug}` : '#'"
						class="toc__link"
						:aria-current="entry === activeEntry ? 'location' : undefined"
						@click="closePopover"
						><span class="toc__num" aria-hidden="true">{{ entry.label }}</span>{{ entry.title }}</a
					>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style>
@layer theme.components {
	@scope(.toc-wrapper) {
		:scope {
			--ink: oklch(from var(--brand-color) 20% 0.03 h);
			--ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
			--brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
			--hairline: oklch(from var(--ink) l c h / 0.15);
			--surface: oklch(from var(--bg-color) 100% c h / 1);

			font-size: var(--text-size-8);
		}

		/* List (shared by the sidebar and the popover) */
		.toc__list {
			list-style: none;
			margin: 0;
			padding: 0;
			border-inline-start: 1px solid var(--hairline);
		}

		.toc__link {
			position: relative;
			display: flex;
			align-items: baseline;
			gap: 0.5rem;
			padding: 0.25rem 0 0.25rem 0.75rem;
			line-height: 1.35;
			color: var(--ink-muted);
			text-decoration: none;
			transition: color 0.15s;

			&:hover {
				color: var(--ink);
			}

			&:focus-visible {
				outline: 2px solid var(--brand-ink);
				outline-offset: 2px;
			}

			&[aria-current] {
				color: var(--brand-ink);
				font-weight: 600;

				&::before {
					content: "";
					position: absolute;
					inset-inline-start: -1px;
					inset-block: 0.25rem;
					width: 2px;
					background: var(--brand-color);
				}
			}
		}

		.toc__num {
			flex: none;
			min-width: 1.5rem;
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.625rem;
			font-variant-numeric: tabular-nums;
			color: var(--ink-muted);

			[aria-current] & {
				color: var(--brand-ink);
			}
		}

		.toc__item--h3 .toc__link {
			padding-inline-start: 2rem;
		}

		.toc__item--h3 .toc__num {
			min-width: 1.75rem;
		}

		.toc__label {
			margin: 0 0 0.625rem;
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.6875rem;
			font-weight: 700;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--ink-muted);
		}

		/* Mobile strip */
		.toc__toggle {
			anchor-name: --toc-toggle;
			display: flex;
			align-items: center;
			gap: 0.625rem;
			width: 100%;
			min-height: 2.75rem;
			margin-block-end: 2rem;
			padding: 0 0.875rem;
			border: 1px solid oklch(from var(--ink) l c h / 0.2);
			background: var(--surface);
			color: var(--ink-muted);
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.6875rem;
			text-align: start;
			cursor: pointer;

			&:focus-visible {
				outline: 2px solid var(--brand-ink);
				outline-offset: 2px;
			}
		}

		.toc__toggle-label {
			flex: none;
			color: var(--ink);
			font-weight: 700;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		.toc__toggle-now {
			flex: 1;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: var(--brand-ink);
			font-weight: 700;
		}

		.toc__toggle-pos {
			flex: none;
			color: var(--ink);
			font-weight: 700;
			font-variant-numeric: tabular-nums;
		}

		.toc__toggle-total {
			color: var(--ink-muted);
			font-weight: 500;
		}

		.toc__toggle-chevron {
			flex: none;
			transition: rotate 0.2s;
		}

		.toc__toggle:has(+ .toc__nav + .toc__popover:popover-open) .toc__toggle-chevron {
			rotate: 180deg;
		}

		/* Popover, anchored under the strip */
		.toc__popover {
			position-anchor: --toc-toggle;
			position: fixed;
			inset: auto;
			margin: 0;
			top: anchor(bottom);
			left: anchor(left);
			width: anchor-size(width);
			position-try-fallbacks: flip-block;
			box-sizing: border-box;
			max-height: 70vh;
			max-height: 70dvh;
			overflow: auto;
			overscroll-behavior: contain;
			padding: 0.5rem 0.875rem 0.75rem;
			border: 1px solid var(--ink);
			border-block-start-color: oklch(from var(--ink) l c h / 0.2);
			background: var(--surface);
			color: var(--ink);

			& .toc__link {
				min-height: 2.25rem;
				align-items: center;
				padding-block: 0;
			}
		}

		/* Browsers without anchor positioning: pin under the top of the viewport */
		@supports not (anchor-name: --x) {
			.toc__popover {
				top: 3.25rem;
				left: 1rem;
				right: 1rem;
				width: auto;
			}
		}

		/* Desktop: plain sidebar list, no strip or popover */
		@media (min-width: 901px) {
			.toc__toggle,
			.toc__popover {
				display: none;
			}
		}

		@media (max-width: 900px) {
			.toc__nav {
				display: none;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.toc__toggle-chevron {
				transition: none;
			}
		}
	}
}
</style>
