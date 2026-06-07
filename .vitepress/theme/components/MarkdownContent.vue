<template>
	<div class="markdown-content prose">
		<slot></slot>
	</div>
</template>

<style lang="css">
@layer theme.components {
	@scope (.markdown-content) {
		:scope {
			margin-inline: auto;
			width: 100%;
			max-width: 72ch;
		}

		:where(p, ul, ol, dl, li, dt, dd) {
			font-size: var(--text-size-7, 1rem);
		}

		:where(h1, h2, h3, h4, h5, h6) {
			font-weight: 700;
			line-height: 1.25;
		}

		/* Headings */
		:where(h1) {
			font-size: var(--text-size-1);
			letter-spacing: -0.02em;

			&::after {
				content: '.';
				color: var(--brand-color);
			}
		}

		:where(h2) {
			font-size: var(--text-size-2);
			text-decoration: underline;
			text-decoration-thickness: 4px;
			text-decoration-color: var(--brand-color);
			text-underline-offset: 0.25rem;
		}

		:where(h3) {
			font-size: var(--text-size-3);
		}

		:where(h4) {
			font-size: var(--text-size-4);
			text-transform: uppercase;
			letter-spacing: 0.06em;
		}

		:where(h5) {
			font-size: var(--text-size-5);
		}

		:where(h6) {
			font-size: var(--text-size-6);
		}

		/* Links */
		:where(a) {
			color: var(--brand-color);
			text-decoration: underline;
			text-decoration-thickness: 2px;
			text-decoration-color: var(--brand-color);
			text-underline-offset: 0.15em;
			transition: text-underline-offset 0.15s;

			&:hover {
				text-underline-offset: 0.25em;
			}

			&[target="_blank"] {
				&::after {
					content: '↗';
					font-size: 0.75em;
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

		:where(ul, ol) {
			padding-inline-start: 1.5rem;

			li {
				margin-block: 0.5rem;

				&::marker {
					font-size: 1.2em;
					color: var(--brand-color);
				}
			}

			:where(ul, ol) {
				margin-block: 0.25rem;
			}
		}

		:where(ul li)::marker {
			content: '→  ';
		}

		:where(blockquote) {
			display: grid;
			grid-template-areas: "quote content";
			gap: 2rem;

			padding-block: 1rem;
			font-size: var(--text-size-5);
			font-weight: 500;
			font-style: italic;
			border: none;

			&::before {
				content: '“';
				font-size: 4em;
				line-height: 0;
				color: var(--brand-color);
				grid-area: quote;
				align-self: center;
			}

			p {
				font: inherit;
				grid-area: content;
			}

			p + p {
				margin-block-start: var(--prose-flow, 1em);
			}
		}

		/* Code blocks — VS Code Dark+ */
		@scope (:is(div[class^='language-'], div[class*=' language-'])) {
			:scope {
				position: relative;
				border-radius: 6px;
				overflow: hidden;
				margin: 1.5rem 0;
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
				border-radius: 4px;
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
