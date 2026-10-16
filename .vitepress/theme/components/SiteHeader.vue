<script setup>
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import { getNavPages } from "../utils/pages.js";
import { getBlogPosts } from "../utils/posts.js";

const { site, frontmatter } = useData();
const route = useRoute();

const pages = getNavPages();
const postCount = getBlogPosts().length;

const currentPath = computed(() => route.path.replace(/\.html$/, "").replace(/\/$/, "") || "/");

// "page" for the page itself, "true" for its section (e.g. Blog while reading a post)
const current = (path) => {
    if (currentPath.value === path) return "page";
    if (path === "/blog" && currentPath.value.startsWith("/posts/")) return "true";
    return undefined;
};

const crumbs = computed(() => {
    if (frontmatter.value.home) return [];
    const segments = currentPath.value.split("/").filter(Boolean);
    if (!segments.length) return [];

    const trail = [{ label: "~", href: "/" }];
    if (segments[0] === "posts") {
        trail.push({ label: "blog", href: "/blog" });
        trail.push({ label: segments[segments.length - 1] });
        return trail;
    }
    segments.forEach((segment, i) => {
        const isLast = i === segments.length - 1;
        trail.push({
            label: segment,
            href: isLast ? undefined : `/${segments.slice(0, i + 1).join("/")}`,
        });
    });
    return trail;
});

const pad = (n) => String(n).padStart(2, "0");
</script>

<template>
    <header class="site-header">
        <div class="site-header__top">
            <a class="logo" href="/">
                <span class="logo__dots" aria-hidden="true"></span>
                <b data-mark="@">@</b>{{ site.title }}
            </a>
            <nav class="site-nav" aria-label="Main">
                <ul>
                    <li v-for="(p, i) in pages" :key="p.path">
                        <a :href="p.path" :aria-current="current(p.path)">
                            <span class="num" aria-hidden="true">{{ pad(i + 1) }}</span>
                            {{ p.title }}
                            <span v-if="p.slug === 'blog'" class="count"
                                ><span aria-hidden="true">{{ postCount }}</span
                                ><span class="sr-only">, {{ postCount }} posts</span></span
                            >
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <nav v-if="crumbs.length" class="crumbs" aria-label="Breadcrumb">
            <span class="crumbs__here" aria-hidden="true">You are here</span>
            <ol>
                <li v-for="c in crumbs" :key="c.label">
                    <a v-if="c.href" :href="c.href">{{ c.label }}</a>
                    <span v-else aria-current="page">{{ c.label }}</span>
                </li>
            </ol>
        </nav>
    </header>
</template>

<style>
@layer theme.components {
    @scope (.site-header) {
        :scope {
            --ink: oklch(from var(--brand-color) 20% 0.03 h);
            --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
            --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
            --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
            --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

            margin-block-end: 3rem;
            color: var(--ink);
        }

        .site-header__top {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.75rem 2rem;
        }

        /* Logo: wordmark with a halftone patch behind the @ */
        .logo {
            position: relative;
            isolation: isolate;
            display: flex;
            align-items: center;
            margin-inline-end: auto;
            padding: 0.5rem 0.25rem;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1;
            color: inherit;
            text-decoration: none;

            & b {
                /* Reserve the 900-weight width so the wordmark doesn't shift on hover */
                display: inline-grid;
                font-size: 1.3em;
                font-weight: 700;
                color: var(--brand-color);
                opacity: 0.8;
                transition:
                    font-weight 250ms var(--ease-out),
                    opacity 250ms ease;

                &::after {
                    content: attr(data-mark);
                    font-weight: 900;
                    height: 0;
                    visibility: hidden;
                    overflow: hidden;
                }
            }

            &:is(:hover, :focus-visible) b {
                font-weight: 900;
                opacity: 1;
            }

            &:focus-visible {
                outline: 2px solid var(--brand-ink);
                outline-offset: 2px;
            }
        }

        .logo__dots {
            position: absolute;
            z-index: -1;
            inset-inline-start: -1.375rem;
            inset-block-start: -1.625rem;
            width: 5.25rem;
            aspect-ratio: 1;
            border-radius: 50%;
            background: radial-gradient(
                    circle,
                    oklch(from var(--brand-color) l c h / 0.3) 30%,
                    transparent 32%
                )
                0 0 / 0.4375rem 0.4375rem;
            transition: background-size 300ms var(--ease-spring);

            .logo:is(:hover, :focus-visible) & {
                background-size: 0.5625rem 0.5625rem;
            }
        }

        /* Numbered nav */
        .site-nav ul {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem 1.75rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .site-nav a {
            position: relative;
            display: flex;
            align-items: baseline;
            gap: 0.375rem;
            padding-block: 0.5rem 0.625rem;
            color: inherit;
            font-size: 1.0625rem;
            font-weight: 600;
            text-decoration: none;
            white-space: nowrap;

            &::after {
                content: "";
                position: absolute;
                inset-inline: 0;
                inset-block-end: 0;
                height: 4px;
                background: var(--brand-color);
                scale: 0 1;
                transform-origin: left;
                transition: scale 300ms var(--ease-out);
            }

            &:is(:hover, :focus-visible, [aria-current])::after {
                scale: 1 1;
            }

            &:focus-visible {
                outline: 2px solid var(--brand-ink);
                outline-offset: 2px;
            }
        }

        .num {
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.6875rem;
            font-weight: 500;
            color: var(--ink-muted);
            transition: color 150ms ease;

            a:is(:hover, :focus-visible, [aria-current]) & {
                color: var(--brand-ink);
            }
        }

        .count {
            align-self: center;
            padding-inline: 0.3125rem;
            border: 1px solid var(--ink);
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.625rem;
            font-weight: 700;
            line-height: 1.4;
            font-variant-numeric: tabular-nums;
        }

        /* Breadcrumb trail */
        .crumbs {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 0;
            margin-block-start: 0.75rem;
            padding-block-start: 0.5rem;
            border-block-start: 1px solid var(--ink);
            font-family: "JetBrains Mono", ui-monospace, monospace;
            font-size: 0.6875rem;
            color: var(--ink-muted);
        }

        .crumbs__here {
            flex: none;
            padding-inline: 0.375rem;
            background: var(--ink);
            color: var(--bg-color);
            font-weight: 700;
            text-transform: uppercase;
        }

        ol {
            display: flex;
            gap: 0.375rem;
            min-width: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
            list-style: none;

            & li {
                white-space: nowrap;
            }

            & li + li::before {
                content: "/";
                margin-inline-end: 0.375rem;
                color: var(--brand-color);
            }

            & li:last-child {
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--ink);
                font-weight: 700;
            }

            & a {
                color: inherit;
                text-decoration: underline 1px oklch(from var(--brand-color) l c h / 0.6);
                text-underline-offset: 0.2em;

                &:hover {
                    color: var(--ink);
                }
            }
        }

        /* Narrow (homepage column, phones): nav takes its own row */
        @container (inline-size <= 33rem) {
            .site-nav {
                width: 100%;
            }

            .site-nav ul {
                justify-content: space-between;
                gap: 0.25rem 1rem;
            }

            .logo {
                font-size: 1.375rem;
            }

            .crumbs__here {
                display: none;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .logo b,
            .logo__dots,
            .site-nav a::after {
                transition: none;
            }
        }
    }
}
</style>
