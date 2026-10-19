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
			font-family: "JetBrains Mono", ui-monospace, monospace;
			font-size: 0.875em;
			font-weight: 400;
			padding: 0.125rem 0.375rem;
			color: oklch(from var(--brand-color) 20% 0.03 h);
			background-color: oklch(from var(--brand-color) 20% 0.03 h / 0.06);
		}

		:where(hr) {
			--prose-flow: 3em;

			border: none;
			height: 1px;
			background-color: oklch(0 0 0 / 0.1);
			margin-block: var(--prose-flow, 3em);
		}

		/* Details: folded note (hairlines, pink segment, square +/− toggle) */
		:where(details) {
			--_duration: 0.3s;
			--_ink: oklch(from var(--brand-color) 20% 0.03 h);

			position: relative;
			padding: 0;
			border: 0;
			border-block: 1px solid oklch(from var(--text-muted) l c h / 0.15);
			border-radius: 0;
			background: none;
			interpolate-size: allow-keywords;

			&::before {
				content: "";
				position: absolute;
				inset-inline-start: 0;
				inset-block-start: -2px;
				width: 3rem;
				height: 4px;
				background: var(--brand-color);
			}

			@media (prefers-reduced-motion: no-preference) {
				&::details-content {
					block-size: 0;
					overflow-y: clip;
					transition:
						content-visibility var(--_duration) allow-discrete,
						block-size var(--_duration) cubic-bezier(0.2, 0.7, 0.2, 1);
				}

				&[open]::details-content {
					block-size: auto;
				}
			}

			& > :not(summary) {
				margin-block: 0 1rem;
			}

			& summary {
				position: relative;
				display: flex;
				align-items: center;
				min-height: 2.75rem;
				margin: 0;
				padding: 0;
				padding-inline-end: 2.5rem;
				border-radius: 0;
				background: none;
				list-style: none;
				cursor: pointer;
				font-weight: 500;
				color: var(--_ink);

				&::-webkit-details-marker {
					display: none;
				}

				&::after {
					content: "+";
					position: absolute;
					inset-inline-end: 0;
					inset-block-start: 50%;
					translate: 0 -50%;
					display: grid;
					place-items: center;
					width: 1.5rem;
					height: 1.5rem;
					border: 1px solid var(--_ink);
					font-family: "JetBrains Mono", ui-monospace, monospace;
					font-size: 0.875rem;
					font-weight: 700;
					line-height: 1;
					transition: background-color 0.15s;
				}

				&:hover::after {
					background: oklch(from var(--brand-color) 95% 0.08 h);
				}

				&:focus-visible {
					outline: 2px solid oklch(from var(--brand-color) 52% 0.22 h);
					outline-offset: 2px;
				}
			}

			&[open] summary::after {
				content: "\2212";
			}
		}

		/* Custom blocks: ink box, tinted kicker strip, colour bar */
		:where(.custom-block:not(details)) {
			--_ink: oklch(from var(--brand-color) 20% 0.03 h);
			--_pad: 0.875rem;

			position: relative;
			font-size: var(--text-size-7);
			line-height: 1.6;
			border: 1px solid var(--_ink);
			background-color: oklch(from var(--brand-color) 100% 0.01 h);
			padding-block-end: calc(var(--_pad) + 4px);

			&::after {
				content: "";
				position: absolute;
				inset-inline: 0;
				inset-block-end: 0;
				height: 4px;
				background: oklch(0.62 0.17 var(--_h));
			}

			& > .custom-block-title {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin: 0;
				padding: 0.375rem var(--_pad);
				border-block-end: 1px solid var(--_ink);
				background-color: oklch(0.96 0.03 var(--_h));
				font-family: "JetBrains Mono", ui-monospace, monospace;
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.06em;
				text-transform: uppercase;
				color: oklch(0.42 0.14 var(--_h));

				&::before {
					content: var(--_glyph) / "";
					display: grid;
					place-items: center;
					flex-shrink: 0;
					width: 1.125rem;
					height: 1.125rem;
					background: oklch(0.5 0.15 var(--_h));
					color: #fff;
					letter-spacing: 0;
					text-transform: none;
				}
			}

			& > :not(.custom-block-title) {
				margin-block: 0;
				margin-inline: var(--_pad);
			}

			& > .custom-block-title + * {
				margin-block-start: var(--_pad);
			}

			& > :not(.custom-block-title) + :not(.custom-block-title) {
				margin-block-start: 0.75em;
			}

			&.info {
				--_h: 250;
				--_glyph: "i";
			}

			&.tip {
				--_h: 155;
				--_glyph: "\2713";
			}

			&.warning {
				--_h: 70;
				--_glyph: "!";
			}

			/* A true red, so brand pink stays the site's own mark */
			&.danger {
				--_h: 27;
				--_glyph: "\2715";
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

		/* Code blocks: ink slab with a kicker strip (language + copy) */
		@scope (:where(div[class^='language-'], div[class*=' language-'])) {
			:scope {
				--prose-flow: 2em;
				--_ink: oklch(from var(--brand-color) 20% 0.03 h);
				--_strip: 2.25rem;
				--_rule: oklch(100% 0 0 / 0.12);

				position: relative;
				margin: 0;
				margin-block: var(--prose-flow, 2em);
				padding-block-start: var(--_strip);
				border: 1px solid var(--_ink);
				background-color: var(--_ink);

				&::before {
					content: "";
					position: absolute;
					inset-inline: 0;
					inset-block-start: 0;
					height: var(--_strip);
					border-block-end: 1px solid var(--_rule);
					pointer-events: none;
				}
			}

			pre {
				max-inline-size: none;
				margin: 0;
				padding-block: 1rem 1.125rem;
				overflow-x: auto;
				background-color: transparent;

				&:focus-visible {
					outline: 2px solid var(--brand-color);
					outline-offset: -2px;
				}

				code {
					display: block;
					width: max-content;
					min-width: 100%;
					background-color: transparent;
					font-family: "JetBrains Mono", ui-monospace, monospace;
					font-size: 0.8125rem;
					font-weight: 400;
					line-height: 1.7;
					color: #d4d4d4;
				}
			}

			.line {
				display: inline-block;
				box-sizing: border-box;
				width: 100%;
				padding-inline: 1.25rem;
			}

			.line.highlighted {
				background-color: oklch(from var(--brand-color) l c h / 0.16);
				box-shadow: inset 3px 0 0 var(--brand-color);
			}

			.lang {
				position: absolute;
				inset-block-start: 0;
				inset-inline-start: 0.875rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;
				height: var(--_strip);
				font-family: "JetBrains Mono", ui-monospace, monospace;
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.06em;
				text-transform: uppercase;
				color: oklch(100% 0 0 / 0.7);
				user-select: none;

				&::before {
					content: "";
					width: 0.5rem;
					height: 0.5rem;
					background: var(--brand-color);
				}
			}

			/* VitePress wires the click and toggles .copied; we only label it */
			.copy {
				position: absolute;
				inset-block-start: 0;
				inset-inline-end: 0;
				z-index: 1;
				display: flex;
				align-items: center;
				gap: 0.4rem;
				height: var(--_strip);
				padding-inline: 0.875rem;
				border: 0;
				border-inline-start: 1px solid var(--_rule);
				background: none;
				color: oklch(100% 0 0 / 0.7);
				font-family: "JetBrains Mono", ui-monospace, monospace;
				font-size: 0.6875rem;
				font-weight: 700;
				letter-spacing: 0.06em;
				text-transform: uppercase;
				cursor: pointer;
				transition: background-color 0.15s, color 0.15s;

				&::before {
					content: "";
					width: 0.75rem;
					height: 0.75rem;
					background-color: currentColor;
					mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5'%3E%3Crect x='9' y='9' width='13' height='13'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E") center / contain no-repeat;
				}

				&::after {
					content: "Copy";
				}

				&:hover {
					color: #fff;
					background-color: oklch(100% 0 0 / 0.06);
				}

				&:focus-visible {
					outline: 2px solid var(--brand-color);
					outline-offset: -2px;
				}

				&.copied {
					color: #fff;

					&::before {
						mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
						background-color: var(--brand-color);
					}

					&::after {
						content: "Copied";
					}
				}
			}
		}
	}
}
</style>
