<script setup>
import { useData, useRoute } from "vitepress";

const { site } = useData();
const route = useRoute();

const isActive = (path) => {
    const normalized = path.replace("./", "/");
    return route.path === normalized || route.path === normalized + ".html";
};

const pageFiles = import.meta.glob("/*.md", { eager: true });

const pages = Object.entries(pageFiles).map(([path, mod]) => {
    const slug = path.split("/").pop().replace(/\.md$/, "");
    return {
        path: `/${slug}`,
        title: mod.__pageData?.frontmatter?.title || slug,
    };
});

const pagesToExclude = [
    "collections",
    "html-styles",
    // 'uses',
    "markdown-examples",
    "index",
    "CLAUDE",
];
const pagesToShow = pages.filter(
    (p) => !pagesToExclude.includes(p.path.replace("/", "")),
);

const sortorder = ["blog", "about", "uses"];

const sortedPages = [
    ...sortorder
        .map((slug) => pagesToShow.find((p) => p.path === `/${slug}`))
        .filter(Boolean),
    ...pagesToShow
        .filter((p) => !sortorder.includes(p.path.slice(1)))
        .sort((a, b) => a.title.localeCompare(b.title)),
];
</script>

<template>
    <header class="site-header">
        <a class="logo" href="/">
            <span><b>@</b>{{ site.title }}</span>
        </a>
        <nav>
            <ul class="row">
                <li v-for="p in sortedPages" :key="p.path">
                    <a :href="p.path" :class="{ active: isActive(p.path) }">{{
                        p.title
                    }}</a>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style>
@layer theme.components {
    @scope (.site-header) {
        :scope {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1rem;
            margin-block-end: 3rem;

            @container (inline-size > 480px) {
                justify-content: space-between;
            }
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            text-decoration: none;
            color: inherit;

            & b {
                color: var(--brand-color);
                font-size: 1.3em;
                opacity: 0.8;
            }
        }

        nav {
            display: flex;
            align-items: center;
        }

        ul {
            --row-gap: 0.25rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        li a {
            display: block;
            color: inherit;
            border-radius: var(--radius-rounded);
            padding-block: 0.375rem;
            padding-inline: 0.875rem;
            text-decoration: none;
            transition:
                background 0.15s,
                color 0.15s;
            white-space: nowrap;

            &:hover {
                background: oklch(from var(--bg-color) 95% c h);
                color: var(--brand-color);
            }

            &.active {
                color: var(--brand-color);
                background: oklch(from var(--brand-color) 99% 0.1 h);
            }
        }
    }
}
</style>
