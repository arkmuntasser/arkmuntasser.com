<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    review: {
        type: Object,
        required: true,
    },
});

const MOVIE_ICON =
    "https://popfeed.social/assets/assets/mediaIcons/movie.e20dfcc0ad79de61ebd5a588dc8e6207.png";
const TV_ICON =
    "https://popfeed.social/assets/assets/mediaIcons/tv.28de12e7da66d4f722cf9de72c71387b.png";
const BOOK_ICON =
    "https://popfeed.social/assets/assets/mediaIcons/books.aad6a5bd03f4430d1a68d797b1dbd46b.png";
const MUSIC_ICON =
    "https://popfeed.social/assets/assets/mediaIcons/cd.37c5713c392926bd403799e0df86f48a.png";
const GAME_ICON =
    "https://popfeed.social/assets/assets/mediaIcons/joystick.fe2e21264e31dd785707a779c118e20a.png";

const TYPE_ICONS = {
    movie: MOVIE_ICON,
    film: MOVIE_ICON,
    tv: TV_ICON,
    tvshow: TV_ICON,
    show: TV_ICON,
    series: TV_ICON,
    anime: TV_ICON,
    book: BOOK_ICON,
    comic: BOOK_ICON,
    comicbook: BOOK_ICON,
    manga: BOOK_ICON,
    album: MUSIC_ICON,
    music: MUSIC_ICON,
    podcast: MUSIC_ICON,
    game: GAME_ICON,
    videogame: GAME_ICON,
};

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

function typeIcon(type) {
    if (!type) return MOVIE_ICON;
    return TYPE_ICONS[type.toLowerCase().replace(/[\s_-]/g, "")] ?? MOVIE_ICON;
}

function formatDate(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
}

function stars(rating) {
    const v = rating / 2;
    return { full: Math.floor(v), half: v % 1 >= 0.5 };
}

const textEl = ref(null);
const popoverEl = ref(null);
const isTruncated = ref(false);
const uid = Math.random().toString(36).slice(2, 8);
const popoverId = `rp-${uid}`;
const anchorName = `--ra-${uid}`;

onMounted(() => {
    if (textEl.value) {
        isTruncated.value =
            textEl.value.scrollHeight > textEl.value.clientHeight;
    }
});

function openPopover() {
    popoverEl.value?.showPopover();
}
</script>

<template>
    <div class="review-card">
        <div class="poster-wrap">
            <img
                v-if="review.value.posterUrl"
                :src="review.value.posterUrl"
                :alt="review.value.title"
                class="poster"
            />
            <div v-else class="poster-placeholder" />
        </div>
        <div class="card-body">
            <p class="title">{{ review.value.title }}</p>
            <div
                class="rating"
                :aria-label="`${review.value.rating} out of 10`"
            >
                <span
                    v-for="i in stars(review.value.rating).full"
                    :key="i"
                    class="star"
                    >★</span
                >
                <span v-if="stars(review.value.rating).half" class="star half"
                    >½</span
                >
            </div>
            <p
                ref="textEl"
                class="text"
                :class="{ 'text--expandable': isTruncated }"
                :style="isTruncated ? `anchor-name: ${anchorName}` : undefined"
                @click="openPopover"
            >
                {{ review.value.text }}
            </p>
            <button
                v-if="isTruncated"
                class="read-more"
                :popovertarget="popoverId"
            >
                read more
            </button>
            <footer class="card-footer">
                <div class="card-meta">
                    <time
                        v-if="review.value.createdAt"
                        class="card-date"
                        :datetime="review.value.createdAt"
                        >{{ formatDate(review.value.createdAt) }}</time
                    >
                    <div
                        class="type-badge"
                        :aria-label="review.value.creativeWorkType ?? 'media'"
                    >
                        <img
                            :src="typeIcon(review.value.creativeWorkType)"
                            alt=""
                            class="type-icon"
                        />
                        <span>{{
                            TYPE_LABELS[
                                review.value.creativeWorkType
                                    ?.toLowerCase()
                                    .replace(/[\s_-]/g, "")
                            ] || "Media"
                        }}</span>
                    </div>
                </div>
                <div class="popfeed-logo" aria-hidden="true">
                    <img
                        src="https://popfeed.social/brand-icons/popfeed.png"
                        alt=""
                        class="popfeed-icon"
                    />
                </div>
            </footer>
        </div>
        <div
            v-if="isTruncated"
            :id="popoverId"
            ref="popoverEl"
            popover
            class="text-popover"
            :style="`position-anchor: ${anchorName}`"
        >
            <p class="text-popover-body">{{ review.value.text }}</p>
            <button
                class="text-popover-close"
                :popovertarget="popoverId"
                popovertargetaction="hide"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    </div>
</template>

<style scoped>
.review-card {
    --bg: oklch(from var(--bg-color) 100% c h / 1);
    --border: oklch(from var(--brand-color) 92% calc(c / 2) h);
    --shadow: oklch(from var(--brand-color) 53.994% 0.19066 h / 0.1);
    --popfeed: oklch(0.53 0.26 279.22);

    display: grid;
    grid-template-columns: 111px 1fr;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-color);
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
        sans-serif;
    font-size: var(--text-size-8);
    overflow: hidden;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.poster-wrap {
    width: 111px;
    aspect-ratio: 37 / 54;
    flex-shrink: 0;
    overflow: hidden;
}

.poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.poster-placeholder {
    width: 100%;
    height: 100%;
    min-height: 5rem;
    background: oklch(var(--bg) 99% c h);
}

.card-body {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
}

.title {
    margin: 0;
    font-weight: 700;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rating {
    display: flex;
    gap: 0.05em;
    font-size: 0.75rem;
}

.star {
    color: var(--brand-color);
}

.star.half {
    font-style: normal;
}

.text {
    margin: 0;
    color: var(--text-color);
    font-size: var(--text-size-9);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}

.text--expandable {
    cursor: pointer;
}

.read-more {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-size: var(--text-size-9);
    color: var(--brand-color);
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    text-underline-offset: 2px;
    text-align: left;
    line-height: 1;
}

.read-more:hover {
    text-decoration: underline;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.card-date {
    font-size: var(--text-size-9);
    color: var(--text-muted);
}

.type-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 18px;
    background: oklch(from var(--bg) 98% c h / 0.9);
    border: 1px solid oklch(from var(--border) l c h / 0.8);
    border-radius: var(--radius-rounded);
    padding: 3px;
    box-sizing: border-box;
    gap: 2px;
    white-space: nowrap;
    font-size: var(--text-size-9);
}

.type-icon {
    height: 100%;
    object-fit: contain;
    display: block;
}

.popfeed-logo {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background-color: oklch(0.53 0.26 279.22);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 2px;
    box-sizing: border-box;
}

.popfeed-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

/* Popover */

.text-popover {
    position: fixed;
    inset: unset;
    margin: 0;
    top: anchor(top);
    left: anchor(left);
    width: anchor-size(width);

    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 2rem 1rem 1rem;
    box-shadow: 0 8px 24px var(--shadow);

    /* Exit state — also the @starting-style base for entry */
    opacity: 0;
    transform-origin: top center;

    transition:
        opacity 0.2s ease,
        overlay 0.2s ease allow-discrete;
}

.text-popover:popover-open {
    opacity: 1;
}

@starting-style {
    .text-popover:popover-open {
        opacity: 0;
        transform: scaleY(0.4);
    }
}

.text-popover-body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
        sans-serif;
    font-size: var(--text-size-9);
    line-height: 1.5;
    color: var(--text-color);
}

.text-popover-close {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: none;
    border: none;
    width: 1.375rem;
    height: 1.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: var(--text-size-9);
    color: var(--text-muted);
    border-radius: calc(var(--radius) / 2);
    padding: 0;
    line-height: 1;
}

.text-popover-close:hover {
    background: oklch(from var(--bg-color) 99% c h / 1);
    color: var(--text-color);
}
</style>
