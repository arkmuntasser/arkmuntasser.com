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

<style>
@layer theme.components {
	@scope(.intro) {
		:scope {
			display: grid;
			grid-template-columns: 1fr;
			gap: 2rem;

			@media (min-width: 48rem) {
				grid-template-columns: 2fr 3fr;
				gap: 0;
			}

			& > .left-column {
				top: 0;
				align-self: start;
				display: flex;
				gap: 8rem;
				flex-direction: column;
				height: 100vh;
				padding: 2rem;
				padding-bottom: 0;

				@media (min-width: 48rem) {
					position: sticky;
				}
			}

			& > .right-column {
				padding: 2rem;
			}
		}
	}
}
</style>
