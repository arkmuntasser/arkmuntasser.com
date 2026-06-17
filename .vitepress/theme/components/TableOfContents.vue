<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const headers = ref([]);
const activeSlug = ref('');
const isDesktop = ref(false);
const mobileOpen = ref(false);
const isOpen = computed(() => isDesktop.value || mobileOpen.value);

let rafId;
let mq;
let mqListener;

function toggle() {
	if (!isDesktop.value) {
		mobileOpen.value = !mobileOpen.value;
	}
}

function updateActive() {
	const headingEls = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
	if (!headingEls.length) return;

	const scrollY = window.scrollY + 120;
	let current = '';

	headingEls.forEach(h => {
		if (h.offsetTop <= scrollY) {
			current = h.id;
		}
	});

	activeSlug.value = current;
}

function collectHeaders() {
	const headingEls = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
	headers.value = Array.from(headingEls).map(h => ({
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

watch(() => route.path, async () => {
	await nextTick();
	collectHeaders();
});

onMounted(() => {
	collectHeaders();
	window.addEventListener('scroll', onScroll, { passive: true });

	mq = window.matchMedia('(min-width: 901px)');
	isDesktop.value = mq.matches;
	mqListener = e => { isDesktop.value = e.matches; };
	mq.addEventListener('change', mqListener);
});

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll);
	cancelAnimationFrame(rafId);
	mq?.removeEventListener('change', mqListener);
});
</script>

<template>
	<div class="toc-wrapper">
		<details v-if="headers.length" class="toc" :open="isOpen">
			<summary class="toc__toggle" @click.prevent="toggle">Table of Contents</summary>
			<nav class="toc__nav" aria-label="Table of contents">
				<p class="toc__label">Table of Contents</p>
				<ul class="toc__list">
					<li class="toc__item" :class="{ 'toc__item--active': activeSlug === '' }">
						<a href="#" class="toc__link">Introduction</a>
					</li>
					<li
						v-for="header in headers"
						:key="header.slug"
						class="toc__item"
						:class="{ 'toc__item--active': activeSlug === header.slug, 'toc__item--h3': header.level === 3 }"
						>
						<a :href="`#${header.slug}`" class="toc__link">{{ header.title }}</a>
					</li>
				</ul>
			</nav>
		</details>
	</div>
</template>

<style>
@layer theme.components {
	@scope(.toc-wrapper) {
		.toc {
			margin-block-end: 2rem;
			font-size: var(--text-size-8);
			border: 1px solid oklch(0 0 0 / 0.12);
			border-radius: var(--radius);
			overflow: hidden;
			width: 100%;
		}

		.toc__toggle {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0.75rem 1rem;
			font-size: var(--text-size-8);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			color: oklch(0.25 0.005 270);
			background: oklch(0.94 0.005 270);
			cursor: pointer;
			list-style: none;
			user-select: none;

			&::-webkit-details-marker {
				display: none;
			}

			&::after {
				content: '';
				flex-shrink: 0;
				width: 0.5rem;
				height: 0.5rem;
				border-right: 2px solid currentColor;
				border-bottom: 2px solid currentColor;
				transform: rotate(45deg);
				transition: transform 0.2s;
			}
		}

		.toc[open] .toc__toggle::after {
			transform: rotate(-135deg);
		}

		.toc__nav {
			padding: 0.5rem 0;
		}

		.toc__label {
			display: none;
		}

		.toc__list {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.toc__link {
			display: block;
			padding: 0.35rem 1rem;
			color: oklch(0.55 0.005 270);
			text-decoration: none;
			transition: color 0.15s;

			&:hover {
				color: oklch(0.2 0.005 270);
			}
		}

		.toc__item--h3 .toc__link {
			padding-inline-start: 2rem;
		}

		.toc__item--active > .toc__link {
			color: var(--brand-color);
			font-weight: 700;
		}

		/* Desktop: plain sticky sidebar nav */
		@media (min-width: 901px) {
			.toc {
				border: none;
				border-radius: 0;
				overflow: visible;
			}

			.toc__toggle {
				display: none;
			}

			.toc__nav {
				padding: 0;
			}

			.toc__label {
				display: block;
				font-size: 0.75rem;
				font-weight: 700;
				text-transform: uppercase;
				letter-spacing: 0.08em;
				color: var(--text-muted);
				margin: 0;
				margin-block-end:0.75rem;
			}

			.toc__link {
				padding: 0.3rem 0.75rem;
				border-left: 2px solid oklch(0 0 0 / 0.1);
				transition: color 0.15s, border-color 0.15s;

				&:hover {
					color: oklch(0.2 0.005 270);
					border-left-color: oklch(0.4 0.005 270);
				}
			}

			.toc__item--h3 .toc__link {
				padding-inline-start: 1.5rem;
			}

			.toc__item--active > .toc__link {
				color: var(--brand-color);
				border-left-color: var(--brand-color);
			}
		}
	}
}
</style>
