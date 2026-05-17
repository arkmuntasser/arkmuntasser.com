<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const headers = ref([]);
const activeSlug = ref('');

let rafId;

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

function onScroll() {
	cancelAnimationFrame(rafId);
	rafId = requestAnimationFrame(updateActive);
}

onMounted(() => {
	const headingEls = document.querySelectorAll('.markdown-content h2, .markdown-content h3');
	if (!headingEls.length) return;

	headers.value = Array.from(headingEls).map(h => ({
		slug: h.id,
		title: h.textContent,
		level: Number(h.tagName[1]),
	}));

	updateActive();
	window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll);
	cancelAnimationFrame(rafId);
});
</script>

<template>
	<nav v-if="headers.length" class="toc" aria-label="Table of contents">
		<p class="toc__label">On this page</p>
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
</template>

<style scoped>
.toc {
	font-size: 0.875rem;
	line-height: 1.5;
}

.toc__label {
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: oklch(0.55 0.005 270);
	margin: 0 0 0.75rem;
}

.toc__list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.toc__link {
	display: block;
	padding: 0.3rem 0.75rem;
	color: oklch(0.55 0.005 270);
	text-decoration: none;
	border-left: 2px solid oklch(0 0 0 / 0.1);
	transition: color 0.15s, border-color 0.15s;
	line-height: 1.4;

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
	font-weight: 500;
}
</style>
