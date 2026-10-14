<script setup>
const props = defineProps({
    review: {
        type: Object,
        required: true,
    },
});

const TYPE_LABELS = {
    movie: "Film",
    film: "Film",
    tv: "TV Show",
    tvshow: "TV Show",
    show: "TV Show",
    series: "TV Show",
    anime: "TV Show",
    book: "Book",
    comic: "Book",
    comicbook: "Book",
    manga: "Book",
    album: "Music",
    music: "Music",
    podcast: "Music",
    game: "Game",
    videogame: "Game",
};

const value = props.review.value;

const url = `https://popfeed.social/review/${props.review.uri}`;

const typeLabel =
    TYPE_LABELS[value.creativeWorkType?.toLowerCase().replace(/[\s_-]/g, "")] ||
    "Media";

const hasRating = typeof value.rating === "number";

const parsedDate = value.createdAt ? new Date(value.createdAt) : null;

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
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="review-card"
    >
        <div class="review-card__kicker">
            <span class="review-card__source"
                ><span aria-hidden="true">↗ </span>popfeed.social</span
            >
            <span class="review-card__type">{{ typeLabel }}</span>
            <time
                v-if="date"
                class="review-card__date"
                :datetime="value.createdAt"
                ><span aria-hidden="true">{{ stamp }}</span
                ><span class="sr-only">{{ date }}</span></time
            >
        </div>
        <div class="review-card__top">
            <img
                v-if="value.posterUrl"
                :src="value.posterUrl"
                alt=""
                loading="lazy"
                decoding="async"
                class="review-card__cover"
            />
            <span v-else class="review-card__cover" aria-hidden="true"></span>
            <div class="review-card__board">
                <span class="review-card__dots" aria-hidden="true"></span>
                <p v-if="hasRating" class="review-card__score">
                    <b aria-hidden="true">{{ value.rating }}</b
                    ><small aria-hidden="true">/10</small
                    ><span class="sr-only"
                        >Rated {{ value.rating }} out of 10</span
                    >
                </p>
                <p v-if="value.mainCredit" class="review-card__credit">
                    <span>{{ value.mainCredit }}</span>
                    <span v-if="value.mainCreditRole">{{
                        value.mainCreditRole
                    }}</span>
                </p>
            </div>
        </div>
        <div class="review-card__body">
            <p class="review-card__title">{{ value.title }}</p>
            <p v-if="value.text" class="review-card__text">{{ value.text }}</p>
        </div>
        <span class="review-card__bar" aria-hidden="true"
            >read on popfeed <span class="review-card__arrow">↗</span></span
        >
        <span class="sr-only">(opens on Popfeed in a new tab)</span>
    </a>
</template>

<style scoped>
@layer theme.components {
    .review-card {
        --ink: oklch(from var(--brand-color) 20% 0.03 h);
        --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
        --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
        --accent: oklch(0.53 0.26 279.22);
        --accent-soft: oklch(from var(--accent) 94% 0.05 h);
        --accent-light: oklch(from var(--accent) 80% 0.1 h);
        --dots: oklch(from var(--accent) l c h / 0.3);
        --shadow: oklch(from var(--accent) l c h / 0.35);
        --surface: oklch(from var(--bg-color) 100% c h / 1);
        --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
        --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

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

    .review-card:focus-visible {
        outline: 2px solid var(--brand-ink);
        outline-offset: 2px;
    }

    /* Top strip: source tab, media type, date */
    .review-card__kicker {
        display: flex;
        align-items: stretch;
        background: var(--surface);
        border-block-end: 1px solid var(--ink);
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.6875rem;
        font-weight: 500;
    }

    .review-card__kicker > * {
        padding: 0.375rem 0.75rem;
    }

    .review-card__source {
        background: var(--ink);
        color: var(--surface);
        font-weight: 700;
    }

    .review-card__type {
        background: var(--accent-soft);
    }

    .review-card__date {
        margin-inline-start: auto;
        color: var(--ink-muted);
        font-variant-numeric: tabular-nums;
    }

    /* Cover + scoreboard */
    .review-card__top {
        display: flex;
        gap: 1rem;
        padding: 1rem 1rem 0;
    }

    .review-card__cover {
        flex: 0 0 7.5rem;
        width: 7.5rem;
        aspect-ratio: 37 / 54;
        object-fit: cover;
        display: block;
        box-sizing: border-box;
        background: var(--accent-soft);
        border: 1px solid var(--ink);
        box-shadow: 4px 4px 0 var(--shadow);
        transition:
            translate 300ms var(--ease-spring),
            box-shadow 300ms var(--ease-out);
    }

    .review-card__board {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 0.375rem;
        padding-block-end: 0.25rem;
    }

    .review-card__dots {
        position: absolute;
        z-index: -1;
        inset-inline-end: -2.875rem;
        inset-block-start: -1.625rem;
        width: 8.75rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, var(--dots) 30%, transparent 32%)
            0 0 / 0.5rem 0.5rem;
        transition: background-size 300ms var(--ease-spring);
    }

    .review-card__score {
        display: flex;
        align-items: baseline;
        margin: 0 0 auto;
        padding-block-start: 0.25rem;
        line-height: 0.85;
        color: var(--accent);
    }

    .review-card__score b {
        font-size: 4.5rem;
        font-weight: 900;
        letter-spacing: -0.06em;
        transition: text-shadow 300ms var(--ease-spring);
    }

    .review-card__score small {
        margin-inline-start: 0.125rem;
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--ink);
    }

    .review-card__credit {
        display: flex;
        flex-direction: column;
        margin: 0;
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.6875rem;
        line-height: 1.5;
        color: var(--ink-muted);
        word-break: break-word;
    }

    .review-card__body {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.875rem 1rem 1.125rem;
    }

    .review-card__title {
        margin: 0;
        font-size: var(--text-size-6);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.02;
        text-wrap: balance;
    }

    .review-card__text {
        margin: 0;
        font-weight: 300;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        line-clamp: 3;
        overflow: hidden;
    }

    .review-card__bar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.375rem;
        height: 1.375rem;
        padding: 0 0.75rem;
        background: var(--ink);
        color: var(--surface);
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 0.6875rem;
        font-weight: 700;
        transition: height 300ms var(--ease-out);
    }

    .review-card__arrow {
        display: inline-block;
        color: var(--accent-light);
        transition: translate 300ms var(--ease-spring);
    }

    /* Hover & focus */
    .review-card:is(:hover, :focus-visible) .review-card__dots {
        background-size: 0.625rem 0.625rem;
    }

    .review-card:is(:hover, :focus-visible) .review-card__score b {
        text-shadow: 3px 3px 0 oklch(from var(--ink) l c h / 0.18);
    }

    .review-card:is(:hover, :focus-visible) .review-card__title {
        text-decoration: underline 2px var(--accent);
        text-underline-offset: 0.12em;
    }

    @media (prefers-reduced-motion: no-preference) {
        .review-card:hover {
            rotate: 0.6deg;
        }

        .review-card:is(:hover, :focus-visible) .review-card__bar {
            height: 1.75rem;
        }

        .review-card:is(:hover, :focus-visible) .review-card__arrow {
            translate: 0.1875rem -0.1875rem;
        }

        .review-card:is(:hover, :focus-visible) .review-card__cover {
            translate: -2px -4px;
            box-shadow: 6px 8px 0 var(--shadow);
        }
    }
}
</style>
