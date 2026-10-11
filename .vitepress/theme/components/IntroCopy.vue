<script setup>
import SocialLinks from './SocialLinks.vue';
</script>

<template>
	<main class="intro-copy">
		<h1>Hello, I'm Amir</h1>
		<p class="lede">I'm a <b>web developer</b>, <b>wizard</b>, <b>sneaker enthusiast</b> and current <b>Director of Web Development</b> at <b>Granicus Destinations</b>.</p>
		<p>Who would have thought that a young, boy from the Southwest would one day grow up to be a winner of one the coveted <a href="https://bsky.app/profile/arkmuntasser.com/post/3lbd3hxods226" target="_blank">Vuenicorns</a> from the very first <b>VueConf Toronto</b> by building a <a href="https://codepen.io/arkmuntasser/pen/QJvPeB">clone of Simon</a>? No one, because that would have been absolutely wild for anyone to concieve and yet here we are and that's what happened.</p>
		<p>I don't code as much as I used to, but I think about it a lot…</p>

		<SocialLinks />
	</main>
</template>

<style lang="css" scoped>
.intro-copy {
	margin-inline: auto;
	margin-block-start: 8rem;
	width: 100%;
	max-width: 72ch;

	h1 {
		font-family: "Outfit", sans-serif;
		line-height: 1.2;
		margin-block: 2rem 0.75rem;
		font-weight: 700;
		font-size: 2rem;
		color: oklch(0.1 0.005 270);
		letter-spacing: -0.02em;

		&::after {
			content: '.';
			color: var(--brand-color);
		}
	}

	& > p {
		font-size: 1.2rem;
		line-height: 1.7;
		margin-block: 1.25rem;
	}

	& > p.lede {
		font-weight: 300;
		font-size: 1.5rem;
		font-style: italic;
		line-height: 1.5;
	}

}
</style>
