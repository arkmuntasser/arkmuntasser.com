<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const frameRef = ref(null)
const primaryStyle = ref({})

function measureInkBounds(text, fontSpec) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = fontSpec
  const m = ctx.measureText(text)
  // actualBoundingBoxLeft: positive = ink extends LEFT of origin (overhang)
  //                        negative = ink starts RIGHT of origin (side bearing)
  // inkWidth = full span of ink pixels regardless of advance width
  return {
    inkWidth: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    leftOverhang: m.actualBoundingBoxLeft,
  }
}

function calculateLayout() {
  if (!frameRef.value) return
  const containerWidth = frameRef.value.getBoundingClientRect().width
  const BASE = 100
  const { inkWidth, leftOverhang } = measureInkBounds('AMIR', `${BASE}px "Keania One"`)
  const scale = containerWidth / inkWidth
  const fontSize = BASE * scale
  // leftOverhang is typically negative (left side bearing), so shiftX is negative = shift left
  // This aligns the ink's left edge with the container's left edge
  const shiftX = leftOverhang * scale
  primaryStyle.value = {
    fontSize: `${fontSize}px`,
    transform: `translateX(${shiftX}px) scaleY(1.8)`,
  }
}

let observer = null

onMounted(async () => {
  await document.fonts.ready
  calculateLayout()
  observer = new ResizeObserver(calculateLayout)
  observer.observe(frameRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
	<div class="hero-frame" ref="frameRef">
		<header>
			<h1>
				<span class="primary" :style="primaryStyle">Amir</span>
				<span class="secondary">@arkmuntasser</span>
			</h1>
			<p class="arabic-name">امير</p>
		</header>
	</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Keania+One&display=swap&text=AMIR');
@import url('https://fonts.googleapis.com/css2?family=Freehand&display=swap&text=@arkmuntasser');
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap&text=امير');
</style>

<style scoped>
.hero-frame {
	--frame-bg: #fff;
	--frame-accent: #31d0fa;
	--frame-text-color: #fff;
	--frame-text-alt-color: #fa04aa;

	display: grid;
	grid-template-columns: 16px 1fr 1fr 16px;
	grid-template-rows: 16px 1fr 16px;
	width: 100%;
	height: 90vh;
	overflow: hidden;
	background-color: var(--frame-background);
	container-type: inline-size;

	&::before {
		content: "";
		grid-column: 1 / -1;
		grid-row: 2 / 3;
		background: var(--frame-accent);
	}

	& header {
		grid-column: 1 / -1;
		grid-row: 1 / 3;
		display: grid;
		grid-template-columns: 16px 1fr 1fr 16px;
		grid-template-rows: 16px 1fr 16px;
		height: 284px;

		& h1 {
			display: contents;
			container-type: inline-size;
		}

		& .primary {
			grid-column: 1 / -1;
			grid-row: 1 / -1;
			margin-top: 0.375rem;
			display: inline-block;
			font-family: "Keania One", sans-serif;
			font-weight: 400;
			font-style: normal;
			color: var(--frame-text-color);
			text-transform: uppercase;
			text-box-trim: trim-both;
			text-box-edge: cap alphabetic;
			transform-origin: top left;
			z-index: 1;
		}

		& .secondary {
			grid-column: 3 / -1;
			grid-row: 3 / -1;
			display: inline-block;
			z-index: 10;
			align-self: self-end;
			font-family: "Freehand", cursive;
			font-size: 2rem;
			color: var(--frame-text-alt-color);
			text-align: right;
		}

		& .arabic-name {
			z-index: 1000;
			rotate: -90deg;
			writing-mode: rl;
			text-align: right;
			transform-origin: top right;
			grid-column: 1;
			grid-row: 1;
			margin: 0;
			padding: 0;
			font-size: 12.5rem;
			justify-self: end;
			text-box-trim: trim-both;
			text-box-edge: cap alphabetic;
			color: var(--frame-text-alt-color);
			padding-right: 4rem;
			font-family: "Tajawal", sans-serif;
			font-weight: 700;
		}
	}
}
</style>
