<template>
	<section class="intro">
		<div class="left-column">
			<slot name="left" />
		</div>
		<div class="right-column">
			<slot name="right" />
		</div>
	</section>
</template>

<style lang="css" scoped>
.intro {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;

	@media (min-width: 48rem) {
		grid-template-columns: 2fr 3fr;
		gap: 0;
	}

	& > .left-column {
		top: 0;
		position: sticky;
		align-self: start;
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 2rem;
	}

	& > .right-column {
		padding: 2rem;
		background-color: whitesmoke;
		box-shadow:
			inset 8px 0 12px -8px rgba(0, 0, 0, 0.2),
			inset -8px 0 12px -8px rgba(0, 0, 0, 0.2),
			inset 0 8px 12px -8px rgba(0, 0, 0, 0.2),
			inset 0 -8px 12px -8px rgba(0, 0, 0, 0.2);
	}
}


</style>
