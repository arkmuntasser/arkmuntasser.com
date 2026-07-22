<template>
	<div class="markdown-content prose">
		<slot></slot>
	</div>
</template>

<style>
@layer theme.elements {
	@scope (.markdown-content) {
		:scope {
			margin-inline: auto;
			width: 100%;
			max-width: 72ch;
		}

		:where(p, ul, ol, dl, li, dt, dd) {
			font-size: var(--text-size-7, 1rem);

			.markdown-content__homepage & {
				font-size: var(--text-size-6);
			}

			.markdown-content__homepage :where(h1) + & {
				font-size: var(--text-size-4);
			}
		}

		:where(h1, h2, h3, h4, h5, h6) {
			font-weight: 700;
			line-height: 1.25;

			position: relative;

			&::before {
				content: '⁕' "";
				color: var(--brand-color);

				position: absolute;
				inset-inline-start: 0;
				inset-block-start: 0;
				z-index: -1;
				pointer-events: none;
				translate: -50% -25%;
				opacity: 0.8;
			}
		}

		/* Headings */
		:where(h1) {
			font-size: var(--text-size-1);
		}

		:where(h2) {
			font-size: var(--text-size-2);
		}

		:where(h3) {
			font-size: var(--text-size-3);
		}

		:where(h4) {
			font-size: var(--text-size-4);
		}

		:where(h5) {
			font-size: var(--text-size-5);
		}

		:where(h6) {
			font-size: var(--text-size-6);
		}

		/* Links */
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
					font-size: 0.75em;
					color: var(--brand-color);
					margin-left: 0.125em;
					text-decoration: none;
				}
			}
		}

		:where(strong) {
			font-weight: 700;
		}

		:where(em) {
			font-style: italic;
		}

		:where(del) {
			text-decoration: line-through;
		}

		/* Lists */
		:where(ul, ol) {
			padding-inline-start: 1.5rem;

			& > * + * { margin-block-start: var(--prose-flow, 1.5em); }

			& li::marker {
				font-size: 1.2em;
				font-weight: 500;
				color: oklch(from var(--brand-color) l c h / 0.8);
			}

			:where(ul, ol) {
				margin-block: 0.25rem;
			}
		}

		:where(ul li)::marker {
			content: '→  ';
		}

		/* Blockquotes */
		:where(blockquote) {
			display: grid;
			grid-template-areas: "quote content";
			grid-template-columns: 42px 1fr;
			gap: 2rem;

			padding-block: 1rem;
			font-size: var(--text-size-5);
			font-weight: 500;
			font-style: italic;
			border: none;

			&::before {
				content: '“';
				font-size: 4em;
				line-height: 1;
				color: oklch(from var(--brand-color) l c h / 0.8);
				grid-area: quote;
				align-self: start;
			}

			p {
				font: inherit;
				grid-area: content;
			}

			p + p {
				margin-block-start: var(--prose-flow, 1em);
			}
		}

		:where(img) {
			display: block;
			max-width: 100%;
			border-radius: var(--radius);
		}

		:where(:not(pre) > code) {
			font-family: 'Consolas', 'Courier New', monospace;
			font-weight: 400;
			padding: 0.25rem 0.5rem;
			color: var(--text-color);
			background-color: oklch(from var(--bg-color) calc(l * 0.95) c h / 0.8);
			border-radius: var(--radius-sm);
		}

		:where(hr) {
			--prose-flow: 3em;

			border: none;
			height: 1px;
			background-color: oklch(0 0 0 / 0.1);
			margin-block: var(--prose-flow, 3em);
		}

		:where(details) {
			--_duration: .2s;

			border-radius: var(--radius);
			border: #a8a8a8 solid 1px;
			background-color: white;

			@media (prefers-reduced-motion: no-preference) {
				interpolate-size: allow-keywords;
			}

			&::details-content {
				opacity: 0;
				block-size: 0;
				overflow-y: clip;
				transition: content-visibility var(--_duration) allow-discrete,
										opacity var(--_duration),
										block-size var(--_duration);
			}

			&[open]::details-content {
				opacity: 1;
				block-size: auto;
			}

			& > p {
				padding: 1rem;
			}

			& summary {
				--padding: 1rem;

				display: grid;
				grid-template-columns: 1fr 40px;
				align-items: center;
				padding-inline-start: var(--padding);
				padding-block: calc(var(--padding) / 2);
				font-weight: 700;
			}

			& summary::after {
				content: "+";
				display: block;
				justify-self: center;
				font-size: 1.25em;
			}

			&[open] summary::after {
				content: "−";
			}
		}

		/* Custom blocks */
		:where(.custom-block:not(details)) {
			--padding: 1rem;

			font-size: var(--text-size-7);
			line-height: 1.6;
			border-radius: var(--radius);
			border: 1px solid var(--block-color);
			overflow: clip;

			& > .custom-block-title {
				padding-inline: var(--padding);
				padding-block: calc(var(--padding) / 2);
				font-weight: 700;
				color: var(--block-color);
				border-bottom: 1px solid var(--block-color);
				background-color: oklch(from var(--block-color) 0.9 0.1 h);
			}

			& > p:not(.custom-block-title) {
				padding: var(--padding);
				margin: 0;
			}

			&.info {
				--block-color: oklch(0.45 0.18 250);
			}

			&.warning {
				--block-color: oklch(0.52 0.18 70);
			}

			&.danger {
				--block-color: oklch(0.52 0.25 15.46);
			}

			&.tip {
				--block-color: oklch(0.42 0.18 155);
			}
		}

		/* Table */
		:where(table) {
			--prose-flow: 2em;

			margin-block: var(--prose-flow, 2em);
			width: 100%;
			border-collapse: separate;
			border-spacing: 0;
			font-size: var(--text-size-8);
			border: 1px solid oklch(0 0 0 / 0.1);
			border-radius: var(--radius);
			overflow: hidden;

			thead {
				tr {
					background: oklch(0 0 0 / 0.04);
				}

				th {
					padding: 0.625rem 0.875rem;
					text-align: start;
					font-weight: 600;
					font-size: var(--text-size-9);
					text-transform: uppercase;
					letter-spacing: 0.06em;
					color: oklch(0.45 0.005 270);
					border-bottom: 1px solid oklch(0 0 0 / 0.1);
					white-space: nowrap;
				}
			}

			tbody {
				tr {
					transition: background 0.1s;

					&:hover {
						background: oklch(0 0 0 / 0.025);
					}

					&:not(:last-child) td {
						border-bottom: 1px solid oklch(0 0 0 / 0.06);
					}
				}

				td {
					padding: 0.625rem 0.875rem;
					text-align: start;
					color: oklch(0.35 0.005 270);
					font-variant-numeric: tabular-nums;
					vertical-align: top;
				}
			}
		}

		/* Code blocks — VS Code Dark+ */
		@scope (:where(div[class^='language-'], div[class*=' language-'])) {
			:scope {
				--prose-flow: 2em;

				position: relative;
				border-radius: var(--radius);
				overflow: hidden;
				margin: 0;
				margin-block: var(--prose-flow, 2em);
				background-color: #1e1e1e;
			}

			pre {
				margin: 0;
				padding: 2.75rem 1.5rem 1.25rem;
				overflow-x: auto;
				background-color: #1e1e1e;

				code {
					display: block;
					background-color: transparent;
					font-family: 'Consolas', 'Courier New', monospace;
					font-size: 0.875rem;
					line-height: 1.6;
					color: #d4d4d4;
				}
			}

			.lang {
				position: absolute;
				top: 0.75rem;
				left: 1rem;
				font-size: 0.75rem;
				color: #858585;
				font-family: 'Consolas', 'Courier New', monospace;
				user-select: none;
			}

			.copy {
				position: absolute;
				top: 0.5rem;
				right: 0.5rem;
				width: 1.75rem;
				height: 1.75rem;
				border: 1px solid #3e3e3e;
				border-radius: var(--radius-sm);
				background-color: #2d2d2d;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23858585' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
				background-repeat: no-repeat;
				background-position: center;
				cursor: pointer;
				transition: border-color 0.15s, background-color 0.15s;

				&:hover {
					border-color: #858585;
					background-color: #3e3e3e;
				}

				&.copied {
					border-color: #4ec9b0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234ec9b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
				}
			}
		}
	}
}
</style>
