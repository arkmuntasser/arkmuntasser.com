<script setup>
import { ref } from "vue";
import { useData, useRoute } from "vitepress";
import { getNavPages } from "../utils/pages.js";

const { theme } = useData();
const route = useRoute();

const year = new Date().getFullYear();
const pages = getNavPages();

const isCurrent = (path) =>
    route.path.replace(/\.html$/, "").replace(/\/$/, "") === path ? "page" : undefined;

const elsewhere = [
    { label: "GitHub", href: "https://github.com/arkmuntasser", color: "#31d0fa" },
    { label: "Bluesky", href: "https://bsky.app/profile/arkmuntasser.com", color: "#0085ff" },
    { label: "Popfeed", href: "https://popfeed.social/profile/arkmuntasser.com", color: "oklch(0.53 0.26 279.22)" },
];

const subscriptions = [
    { key: "RSS", value: `${theme.value.siteUrl}/rss.xml`, label: "RSS feed URL" },
    { key: "AT", value: theme.value.atPublication, label: "AT Protocol publication address" },
];

const copied = ref(null);
const announcement = ref("");
let resetTimer;

async function copy(item, event) {
    const field = event.currentTarget.previousElementSibling;
    try {
        await navigator.clipboard.writeText(item.value);
        copied.value = item.key;
        announcement.value = `Copied ${item.label}`;
    } catch {
        // Clipboard blocked: select the full value so it can be copied by hand
        window.getSelection()?.selectAllChildren(field);
        announcement.value = `Couldn't copy automatically. The ${item.label} is selected: ${item.value}`;
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        copied.value = null;
        announcement.value = "";
    }, 2000);
}

const pad = (n) => String(n).padStart(2, "0");
</script>

<template>
    <footer class="site-footer">
        <span class="site-footer__dots" aria-hidden="true"></span>
        <span class="site-footer__mark" aria-hidden="true">@</span>

        <div class="site-footer__grid">
            <div class="colophon">
                <p>
                    Built with <strong>VitePress</strong> and <strong>Vue</strong>, set in
                    <strong>Outfit</strong> and <strong>JetBrains Mono</strong>, and published to
                    the Atmosphere as an AT Protocol publication.
                </p>
                <a class="colophon__how" href="/posts/how-this-site-was-made">How this site was made →</a>
            </div>

            <nav class="section" aria-labelledby="footer-site">
                <h2 id="footer-site"><span aria-hidden="true">{{ pad(1) }}</span>Site</h2>
                <ul>
                    <li v-for="p in pages" :key="p.path">
                        <a class="link" :href="p.path" :aria-current="isCurrent(p.path)">{{ p.title }}</a>
                    </li>
                </ul>
            </nav>

            <nav class="section" aria-labelledby="footer-elsewhere">
                <h2 id="footer-elsewhere"><span aria-hidden="true">{{ pad(2) }}</span>Elsewhere</h2>
                <ul>
                    <li v-for="s in elsewhere" :key="s.label">
                        <a class="link" :href="s.href" target="_blank" rel="noopener noreferrer">
                            <span class="link__dot" :style="{ background: s.color }" aria-hidden="true"></span>
                            {{ s.label }}
                            <span class="link__ext" aria-hidden="true">↗</span>
                            <span class="sr-only">(opens in a new tab)</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="section section--subscribe">
                <h2><span aria-hidden="true">{{ pad(3) }}</span>Subscribe</h2>
                <div v-for="s in subscriptions" :key="s.key" class="copy">
                    <span class="copy__key">{{ s.key }}</span>
                    <span class="copy__value">{{ s.value }}</span>
                    <button
                        type="button"
                        class="copy__button"
                        :class="{ 'copy__button--done': copied === s.key }"
                        :aria-label="`Copy ${s.label}`"
                        @click="copy(s, $event)"
                    >
                        <span aria-hidden="true">{{ copied === s.key ? "✓" : "copy" }}</span>
                    </button>
                </div>
                <p class="sr-only" aria-live="polite">{{ announcement }}</p>
            </div>
        </div>

        <p class="site-footer__legal">© {{ year }} Amir R Muntasser. All rights reserved.</p>
    </footer>
</template>

<style>
@layer theme.components {
    @scope (.site-footer) {
        :scope {
            --ink: oklch(from var(--brand-color) 20% 0.03 h);
            --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
            --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
            --surface: oklch(from var(--bg-color) 100% c h / 1);
            --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

            position: relative;
            isolation: isolate;
            overflow: hidden;
            margin-block-start: auto;
            border-block-start: 4px solid var(--ink);
            color: var(--ink);
            font-size: 0.875rem;
            line-height: 1.6;
            font-weight: 350;
        }

        .site-footer__grid {
            display: grid;
            grid-template-columns: minmax(0, 1.6fr) repeat(3, minmax(0, 1fr));
            gap: 2rem;
            max-width: 72rem;
            padding-block: 1.5rem 1.75rem;
        }

        /* Colophon */
        .colophon p {
            margin: 0;
            max-width: 40ch;
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.55;

            & strong {
                font-weight: 700;
            }
        }

        .colophon__how {
            display: inline-flex;
            margin-block-start: 0.875rem;
            color: inherit;
            font-weight: 600;
            text-decoration: underline 3px oklch(from var(--brand-color) l c h / 0.8);
            text-underline-offset: 0.25em;

            &:hover {
                text-decoration-color: var(--brand-color);
            }
        }

        /* Numbered sections */
        h2 {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 0 0.625rem;
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.6875rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;

            & span {
                color: var(--brand-ink);
            }
        }

        ul {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .link {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            min-height: 1.75rem;
            color: inherit;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;

            &:hover {
                text-decoration: underline 3px oklch(from var(--brand-color) l c h / 0.8);
                text-underline-offset: 0.25em;
            }

            &[aria-current]::before {
                content: "▸";
                color: var(--brand-color);
            }
        }

        .link__dot {
            flex: none;
            width: 0.625rem;
            height: 0.625rem;
            border: 1px solid var(--ink);
            border-radius: 50%;
        }

        .link__ext {
            font-size: 0.75em;
            color: var(--brand-ink);
        }

        :is(.link, .colophon__how, .copy__button):focus-visible {
            outline: 2px solid var(--brand-ink);
            outline-offset: 2px;
        }

        /* Copy fields */
        .copy {
            display: flex;
            align-items: stretch;
            margin-block-start: 0.375rem;
            border: 1px solid var(--ink);
            background: var(--surface);
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.6875rem;
        }

        .copy__key {
            flex: none;
            padding: 0.375rem 0.5rem;
            background: var(--ink);
            color: var(--surface);
            font-weight: 700;
        }

        .copy__value {
            flex: 1;
            min-width: 0;
            padding: 0.375rem 0.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--ink-muted);
        }

        .copy__button {
            flex: none;
            min-width: 2.75rem;
            padding: 0 0.5rem;
            border: 0;
            border-inline-start: 1px solid var(--ink);
            background: oklch(from var(--brand-color) 95% calc(c / 3) h);
            color: var(--brand-ink);
            font: inherit;
            font-weight: 700;
            cursor: pointer;

            &:hover {
                background: var(--brand-color);
                color: var(--surface);
            }

            &.copy__button--done {
                background: var(--ink);
                color: var(--surface);
            }
        }

        .site-footer__legal {
            margin: 0;
            padding-block: 0.75rem 1rem;
            border-block-start: 1px solid oklch(from var(--ink) l c h / 0.2);
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.6875rem;
            color: var(--ink-muted);
        }

        /* Giant @ printed over halftone dots */
        .site-footer__mark {
            position: absolute;
            z-index: -1;
            inset-inline-end: -0.06em;
            inset-block-end: -0.3em;
            font-size: 16rem;
            font-weight: 900;
            line-height: 1;
            color: oklch(from var(--brand-color) 93% 0.07 h);
            pointer-events: none;
            transition: color 300ms ease;
        }

        .site-footer__dots {
            position: absolute;
            z-index: -2;
            inset-inline-end: -3.75rem;
            inset-block-end: -6.875rem;
            width: 20.625rem;
            aspect-ratio: 1;
            border-radius: 50%;
            background: radial-gradient(
                    circle,
                    oklch(from var(--brand-color) l c h / 0.3) 30%,
                    transparent 32%
                )
                0 0 / 0.5rem 0.5rem;
            transition: background-size 300ms var(--ease-spring);
        }

        :scope:hover .site-footer__mark {
            color: oklch(from var(--brand-color) 88% 0.11 h);
        }

        :scope:hover .site-footer__dots {
            background-size: 0.625rem 0.625rem;
        }

        /* Narrow (homepage column, phones) */
        @container (inline-size <= 48rem) {
            .site-footer__grid {
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem 1.25rem;
            }

            .colophon,
            .section--subscribe {
                grid-column: 1 / -1;
            }

            .site-footer__mark {
                font-size: 9rem;
            }

            .site-footer__dots {
                width: 11.875rem;
                inset-inline-end: -2.5rem;
                inset-block-end: -4.375rem;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .site-footer__mark,
            .site-footer__dots {
                transition: none;
            }
        }
    }
}
</style>
