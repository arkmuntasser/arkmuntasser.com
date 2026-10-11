<script setup>
import SocialLinks from './SocialLinks.vue';
const year = new Date().getFullYear();
</script>

<template>
	<footer class="site-footer row">
	    <div>
			<p>&copy; {{ year }} Amir R Muntasser. <strong>All rights reserved.</strong></p>
			<p><a href="./posts/how-this-site-was-made">How this site was made</a>.</p>
		</div>
		<SocialLinks />
	</footer>
</template>

<style>
@layer theme.components {
	@scope(.site-footer) {
		:scope {
			align-items: center;
			justify-content: space-between;
			margin-top: auto;
			padding-block: 1.5rem;
			padding-inline: 0;
			font-size: var(--text-size-8);
			color: var(--text-muted);
		}

		:where(a:not(.header-anchor)) {
			font-weight: 400;
			background: linear-gradient(to bottom, oklch(from var(--brand-color) l c h / 0.8) 0%, oklch(from var(--brand-color) l c h / 0.8) 100%);
			background-position: 0 100%;
			background-repeat: repeat-x;
			background-size: 3px 3px;

			@media (prefers-reduced-motion: no-preference) {
				&:hover {
					background-image: url("data:image/svg+xml;charset=utf8,%3Csvg id='squiggle-link' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:ev='http://www.w3.org/2001/xml-events' viewBox='0 0 20 4'%3E%3Cstyle type='text/css'%3E.squiggle{animation:shift 450ms linear infinite;}@keyframes shift {from {transform:translateX(0);}to {transform:translateX(-20px);}}%3C/style%3E%3Cpath fill='none' stroke='oklch(0.64 0.25 15.46)' stroke-width='2' class='squiggle' d='M0,3.5 c 5,0,5,-3,10,-3 s 5,3,10,3 c 5,0,5,-3,10,-3 s 5,3,10,3'/%3E%3C/svg%3E");
					background-position: 0 100%;
					background-size: auto 6px;
					background-repeat: repeat-x;
					text-decoration: none;
				}
			}

			&[target="_blank"] {
				&::after {
					content: '↗';
					display: inline-block;
					font-size: 0.75em;
					color: var(--brand-color);
					margin-left: 0.125em;
					text-decoration: none;

					@media (prefers-reduced-motion: no-preference) {
						transition: translate var(--duration-fast) var(--ease-spring);
					}
				}

				&:hover::after {
					translate: 0.15em -0.15em;
				}
			}
		}
	}
}
</style>
