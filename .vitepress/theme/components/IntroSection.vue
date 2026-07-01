<template>
	<section class="intro">
		<div class="left-column">
			<div class="breakout-container">
				<slot name="left" />
			</div>
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
				min-height: 100vh;
				padding-block-start: 2rem;

				@media (min-width: 48rem) {
					position: sticky;
				}

				& > .breakout-container {
					min-height: calc(100vh - 2rem);
				}

				.homepage & > .breakout-container {
					gap: 6rem 0;
				}
			}

			& > .right-column {
				padding: 2rem;
			}
		}
	}
}
</style>
