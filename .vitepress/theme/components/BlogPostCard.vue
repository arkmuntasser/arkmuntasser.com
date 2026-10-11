<script setup>
const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const date = props.post.date
    ? new Date(props.post.date).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
      })
    : null;
</script>

<template>
    <a
        :href="post.path"
        class="blog-post-card"
        :class="{ 'blog-post-card--featured': post.featured }"
    >
        <p v-if="post.featured" class="blog-post-card__label">Featured</p>
        <p class="blog-post-card__title">{{ post.title }}</p>
        <p v-if="post.excerpt" class="blog-post-card__excerpt">
            {{ post.excerpt }}
        </p>
        <footer class="blog-post-card__footer">
            <div class="blog-post-card__meta">
                <time
                    v-if="date"
                    class="blog-post-card__date"
                    :datetime="post.date"
                    >{{ date }}</time
                >
                <ul
                    v-if="post.categories.length"
                    class="blog-post-card__categories"
                >
                    <li v-for="cat in post.categories" :key="cat">{{ cat }}</li>
                </ul>
            </div>
            <span class="blog-post-card__logo" aria-hidden="true"
                ><b>@</b></span
            >
        </footer>
    </a>
</template>

<style scoped>
.blog-post-card {
    --bg: var(--card-bg);
    --border: var(--card-border);
    --shadow: var(--card-ring);

    display: block;
    padding: var(--space-4);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-color);
    text-decoration: none;
    font-family: var(--font-brand);
    font-size: var(--text-size-8);
    transition:
        border-color var(--duration-fast) var(--ease-out),
        box-shadow var(--duration-fast) var(--ease-out),
        translate var(--duration-fast) var(--ease-out);
}

.blog-post-card:hover,
.blog-post-card:focus-visible {
    border-color: var(--brand-color);
    box-shadow: 0 0 0 3px var(--shadow);
}

@media (prefers-reduced-motion: no-preference) {
    .blog-post-card:hover {
        translate: 0 -2px;
    }
}

.blog-post-card--featured {
    --bg: oklch(from var(--brand-color) 98.5% calc(c / 8) h);
    --border: oklch(from var(--brand-color) 88% calc(c / 2) h);

    border-inline-start: 3px solid var(--brand-color);
}

.blog-post-card__label {
    display: inline-block;
    margin: 0 0 var(--space-2);
    padding: 0 var(--space-2);
    font-size: var(--text-size-9);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--brand-ink);
    background: oklch(from var(--brand-color) 95% calc(c / 3) h);
    border-radius: var(--radius-rounded);
}

.blog-post-card__title {
    margin: 0 0 var(--space-2);
    font-weight: 700;
    color: var(--text-color);
}

.blog-post-card--featured .blog-post-card__title {
    font-size: var(--text-size-5);
    line-height: 1.2;
    letter-spacing: -0.01em;
    text-wrap: balance;
}

.blog-post-card__excerpt {
    margin: 0 0 var(--space-3);
    color: var(--text-color);
    word-break: break-word;
}

.blog-post-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--space-3);
}

.blog-post-card__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
}

.blog-post-card__date {
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    font-size: var(--text-size-9);
}

.blog-post-card__categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    list-style: none;
    margin: 0;
    padding: 0;
}

.blog-post-card__categories li {
    font-size: var(--text-size-9);
    color: var(--text-muted);
    background: var(--pill-bg);
    border: 1px solid var(--pill-border);
    border-radius: var(--radius-rounded);
    padding: 0 0.375rem;
    white-space: nowrap;
}

.blog-post-card__logo {
    font-size: 1rem;
    font-weight: 700;
    flex-shrink: 0;
    line-height: 1;
    align-self: end;
}

.blog-post-card__logo b {
    display: inline-block;
    color: var(--brand-color);
    font-size: 1.375rem;
    font-weight: 700;
}

@media (prefers-reduced-motion: no-preference) {
    .blog-post-card__logo b {
        transition: rotate var(--duration-slow) var(--ease-spring);
    }

    .blog-post-card:hover .blog-post-card__logo b {
        rotate: -14deg;
    }
}
</style>
