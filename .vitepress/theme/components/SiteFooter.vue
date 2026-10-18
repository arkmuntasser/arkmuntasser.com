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
    { label: "GitHub", href: "https://github.com/arkmuntasser", icon: "github" },
    { label: "Bluesky", href: "https://bsky.app/profile/arkmuntasser.com", icon: "bluesky" },
    { label: "Popfeed", href: "https://popfeed.social/profile/arkmuntasser.com", icon: "popfeed" },
];

const subscriptions = [
    { key: "RSS", value: `${theme.value.siteUrl}/rss.xml`, label: "RSS feed URL" },
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
                            <svg v-if="s.icon === 'github'" class="link__icon link__icon--github" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                            <svg v-else-if="s.icon === 'bluesky'" class="link__icon link__icon--bluesky" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
                            </svg>
                            <span v-else-if="s.icon === 'popfeed'" class="link__icon link__icon--popfeed" aria-hidden="true">
                                <img src="/popfeed-icon.png" alt="" width="18" height="18" loading="lazy" decoding="async" />
                            </span>
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
                <p class="subscribe__hint">
                    Paste it into any feed reader, or <a href="/rss.xml">open the feed ↗</a>.
                </p>
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

        .link__icon {
            flex: none;
            width: 1.125rem;
            height: 1.125rem;
            transition: scale 300ms var(--ease-spring);

            .link:is(:hover, :focus-visible) & {
                scale: 1.12;
            }
        }

        .link__icon--github {
            fill: #1f2328;
        }

        .link__icon--bluesky {
            fill: #0085ff;
        }

        /* Popfeed's mark is white; it sits on their purple tile */
        .link__icon--popfeed {
            display: grid;
            place-items: center;
            box-sizing: border-box;
            padding: 0.125rem;
            border-radius: 4px;
            background: oklch(0.53 0.26 279.22);

            & img {
                width: 100%;
                height: 100%;
                display: block;
            }
        }

        .subscribe__hint {
            margin: 0.5rem 0 0;
            max-width: 26ch;
            font-size: 0.8125rem;
            color: var(--ink-muted);

            & a {
                color: var(--ink);
                text-decoration: underline 1px oklch(from var(--brand-color) l c h / 0.8);
                text-underline-offset: 0.2em;
            }
        }

        .link__ext {
            font-size: 0.75em;
            color: var(--brand-ink);
        }

        :is(.link, .colophon__how, .copy__button, .subscribe__hint a):focus-visible {
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
            .site-footer__dots,
            .link__icon {
                transition: none;
            }
        }
    }
}
</style>
