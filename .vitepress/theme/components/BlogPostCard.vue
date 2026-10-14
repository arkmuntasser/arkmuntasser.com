<script setup>
const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const somber = props.post.tone === "somber";
const [primaryCategory, ...otherCategories] = props.post.categories;

const parsedDate = props.post.date ? new Date(props.post.date) : null;

const date = parsedDate
    ? parsedDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
      })
    : null;

const stamp = parsedDate
    ? [
          parsedDate.getUTCFullYear(),
          String(parsedDate.getUTCMonth() + 1).padStart(2, "0"),
          String(parsedDate.getUTCDate()).padStart(2, "0"),
      ].join(".")
    : null;
</script>

<template>
    <a
        :href="post.path"
        class="blog-post-card"
        :class="{
            'blog-post-card--featured': post.featured,
            'blog-post-card--somber': somber,
        }"
    >
        <span class="blog-post-card__dots" aria-hidden="true"></span>
        <span v-if="!somber" class="blog-post-card__logo" aria-hidden="true"
            >@</span
        >
        <div class="blog-post-card__kicker">
            <span v-if="post.featured" class="blog-post-card__label"
                >Featured</span
            >
            <span v-if="primaryCategory" class="blog-post-card__category">{{
                primaryCategory
            }}</span>
            <time v-if="date" class="blog-post-card__date" :datetime="post.date"
                ><span aria-hidden="true">{{ stamp }}</span
                ><span class="sr-only">{{ date }}</span></time
            >
        </div>
        <div class="blog-post-card__body">
            <p class="blog-post-card__title">{{ post.title }}</p>
            <p v-if="post.excerpt" class="blog-post-card__excerpt">
                {{ post.excerpt }}
            </p>
            <ul v-if="otherCategories.length" class="blog-post-card__tags">
                <li v-for="cat in otherCategories" :key="cat">{{ cat }}</li>
            </ul>
        </div>
        <span class="blog-post-card__bar" aria-hidden="true"></span>
    </a>
</template>

<style scoped>
@layer theme.components {
    .blog-post-card {
        --ink: oklch(from var(--brand-color) 20% 0.03 h);
        --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
        --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
        --accent: #31d0fa;
        --dots: oklch(from var(--brand-color) l c h / 0.35);
        --logo: oklch(from var(--brand-color) 90% 0.1 h);
        --surface: oklch(from var(--bg-color) 100% c h / 1);
        --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
        --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

        container: blog-post-card / inline-size;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        height: 100%;
        box-sizing: border-box;
        background: var(--surface);
        border: 1px solid var(--ink);
        color: var(--ink);
        text-decoration: none;
        font-family: var(--font-brand);
        font-size: var(--text-size-8);
        line-height: 1.6;
        font-weight: 350;
        transition: rotate 300ms var(--ease-spring);
    }

    .blog-post-card:focus-visible {
        outline: 2px solid var(--brand-ink);
        outline-offset: 2px;
    }

    /* Decoration: halftone dots with the @ printed over them */
    .blog-post-card__dots {
        position: absolute;
        z-index: -1;
        inset-inline-end: -2.5rem;
        inset-block-end: -3rem;
        width: 8.125rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, var(--dots) 30%, transparent 32%)
            0 0 / 0.5rem 0.5rem;
        transition: background-size 300ms var(--ease-spring);
    }

    .blog-post-card__logo {
        position: absolute;
        z-index: -1;
        inset-inline-end: -0.06em;
        inset-block-end: -0.24em;
        font-size: 6rem;
        font-weight: 900;
        line-height: 1;
        color: var(--logo);
        pointer-events: none;
        transition: color 300ms var(--ease-out);
    }

    /* Top strip: featured tab, primary category, date */
    .blog-post-card__kicker {
        display: flex;
        align-items: stretch;
        background: var(--surface);
        border-block-end: 1px solid var(--ink);
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .blog-post-card__kicker > * {
        padding: 0.375rem 0.75rem;
    }

    .blog-post-card__label {
        background: var(--ink);
        color: var(--surface);
        font-weight: 700;
    }

    .blog-post-card__category {
        background: var(--accent);
        color: var(--ink);
    }

    .blog-post-card__date {
        margin-inline-start: auto;
        color: var(--ink-muted);
        font-variant-numeric: tabular-nums;
    }

    .blog-post-card__body {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem 1rem 1.25rem;
    }

    .blog-post-card__title {
        margin: 0;
        font-size: var(--text-size-5);
        font-weight: 800;
        letter-spacing: -0.035em;
        line-height: 0.98;
        text-wrap: balance;
    }

    .blog-post-card__excerpt {
        margin: 0;
        font-weight: 300;
        line-height: 1.5;
        word-break: break-word;
    }

    .blog-post-card__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 1rem;
        margin: 0;
        margin-block-start: auto;
        padding: 0;
        padding-inline-end: 5rem;
        list-style: none;
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.6875rem;
        color: var(--brand-ink);
    }

    .blog-post-card__tags li::before {
        content: "+" / "";
    }

    .blog-post-card__bar {
        position: relative;
        overflow: hidden;
        height: 0.5rem;
        background: var(--brand-color);
        transition: height 300ms var(--ease-out);
    }

    /* Hover & focus */
    .blog-post-card:is(:hover, :focus-visible) .blog-post-card__logo {
        color: var(--brand-color);
    }

    .blog-post-card:is(:hover, :focus-visible) .blog-post-card__dots {
        background-size: 0.625rem 0.625rem;
    }

    .blog-post-card:is(:hover, :focus-visible) .blog-post-card__title {
        text-decoration: underline 2px var(--brand-color);
        text-underline-offset: 0.12em;
    }

    /* Featured: wider cards get the big headline and graphic */
    @container blog-post-card (min-width: 32rem) {
        .blog-post-card:not(.blog-post-card--featured) .blog-post-card__excerpt {
            padding-inline-end: 5rem;
        }

        .blog-post-card--featured .blog-post-card__body {
            gap: 1rem;
            min-height: 17.5rem;
            padding: 1.25rem 1.25rem 1.5rem;
        }

        .blog-post-card--featured .blog-post-card__title {
            font-size: var(--text-size-2);
        }

        .blog-post-card--featured .blog-post-card__excerpt {
            max-width: 42ch;
            font-size: 0.9375rem;
        }

        .blog-post-card--featured .blog-post-card__tags {
            padding-inline-end: 12rem;
        }

        .blog-post-card--featured .blog-post-card__dots {
            width: 18.75rem;
            inset-inline-end: -5.5rem;
            inset-block-end: -7rem;
        }

        .blog-post-card--featured .blog-post-card__logo {
            font-size: 13rem;
            inset-inline-end: -0.08em;
            inset-block-end: -0.28em;
        }
    }

    /* Somber: one ink, faint grey texture, no logo, no motion */
    .blog-post-card--somber {
        --ink: oklch(from var(--brand-color) 30% 0.02 h);
        --brand-ink: oklch(from var(--brand-color) 45% 0.02 h);
        --dots: oklch(from var(--brand-color) 88% 0.01 h);
    }

    .blog-post-card--somber .blog-post-card__dots {
        width: 6.875rem;
        inset-inline-end: -2.25rem;
        inset-block-end: -2.5rem;
        background-size: 0.375rem 0.375rem;
    }

    .blog-post-card--somber:is(:hover, :focus-visible) .blog-post-card__dots {
        background-size: 0.375rem 0.375rem;
    }

    .blog-post-card--somber .blog-post-card__category {
        background: none;
    }

    .blog-post-card--somber .blog-post-card__title {
        font-weight: 600;
        letter-spacing: -0.015em;
        line-height: 1.1;
    }

    .blog-post-card--somber:is(:hover, :focus-visible) .blog-post-card__title {
        text-decoration-color: currentColor;
    }

    .blog-post-card--somber .blog-post-card__tags {
        padding-inline-end: 3.5rem;
    }

    .blog-post-card--somber .blog-post-card__bar {
        height: 1px;
        margin: 0 1rem 0.75rem;
        background: var(--ink);
    }

    @media (prefers-reduced-motion: no-preference) {
        .blog-post-card:not(.blog-post-card--somber):hover {
            rotate: -0.6deg;
        }

        .blog-post-card:not(.blog-post-card--somber):is(
                :hover,
                :focus-visible
            )
            .blog-post-card__bar {
            height: 0.875rem;
        }

        .blog-post-card--featured:not(.blog-post-card--somber)
            .blog-post-card__bar::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                90deg,
                transparent,
                oklch(1 0 0 / 0.55),
                transparent
            );
            translate: -100% 0;
            animation: blog-post-card-sheen 2.4s var(--ease-out) 0.6s 2;
        }

        .blog-post-card--featured:not(.blog-post-card--somber)
            .blog-post-card__dots {
            animation: blog-post-card-breathe 2.8s ease-in-out 0.4s 2;
        }
    }

    @keyframes blog-post-card-sheen {
        to {
            translate: 100% 0;
        }
    }

    @keyframes blog-post-card-breathe {
        50% {
            background-size: 0.59375rem 0.59375rem;
        }
    }
}
</style>
