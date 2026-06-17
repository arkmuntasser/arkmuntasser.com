<script setup>
import SocialLinks from './SocialLinks.vue';
const year = new Date().getFullYear();
</script>

<template>
	<footer class="site-footer row">
		<p>&copy; {{ year }} Amir R Muntasser. <strong>All rights reserved.</strong></p>
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
	}
}
</style>
