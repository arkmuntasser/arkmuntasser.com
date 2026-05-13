<template>
	<main class="intro-copy">
		<h1>hello...</h1>
		<p class="lede">I'm Amir R Muntasser and I'm a <b>web developer</b>, <b>wizard</b>, <b>sneaker enthusiast</b> and current <b>Director of Web Development</b> at <b>Granicus Destinations</b>.</p>
		<p>Who would have thought that a young, boy from the Southwest would one day grow up to be a winner of one the coveted <a href="https://bsky.app/profile/arkmuntasser.com/post/3lbd3hxods226" target="_blank">Vuenicorns</a> from the very first <b>VueConf Toronto</b> by building a <a href="https://codepen.io/arkmuntasser/pen/QJvPeB">clone of Simon</a>? No one, because that would have been absolutely wild for anyone to concieve and yet here we are and that's what happened.</p>
		<p>I don't code as much as I used to, but I think about it a lot…</p>

		<nav class="social-links">
			<a href="https://github.com/arkmuntasser" target="_blank" rel="noopener noreferrer">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
				</svg>
				GitHub
			</a>
			<a href="https://bsky.app/profile/arkm.dev" target="_blank" rel="noopener noreferrer" class="bluesky">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
					<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
				</svg>
				Bluesky
			</a>
		</nav>

	</main>
</template>

<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');



.intro-copy {
	margin-inline: auto;
	width: 100%;
	max-width: 72ch;

	@keyframes rainbow-cycle {
		0% { background-position: 0% center; }
		100% { background-position: 200% center; }
	}

	& > h1 {
		display: inline-block;
		font-family: 'Dancing Script', cursive;
		font-size: 3.5rem;
		background: linear-gradient(to right, #61BB46, #FDB827, #F5821F, #E03A3E, #963D97, #009DDC, #61BB46);
		background-size: 200%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		animation: rainbow-cycle 4s linear infinite;
	}

	& > p {
		font-size: 1.2rem;
		line-height: 1.7;
		margin-block: 1.25rem;
	}

	& > p.lede {
		font-size: 1.5rem;
		font-style: italic;
		line-height: 1.5;
	}

	& > .social-links {
		display: flex;
		gap: 1.5rem;
		margin-top: 2rem;

		& a {
			display: flex;
			align-items: center;
			gap: 0.4em;
			text-decoration: none;
			color: inherit;
			font-size: 1rem;

			&:hover {
				text-decoration: underline;
			}

			& svg {
				width: 1.1em;
				height: 1.1em;
				fill: currentColor;
				flex-shrink: 0;
			}

			&.bluesky svg {
				fill: #0085ff;
			}
		}
	}
}
</style>
