<script setup>
import BlueskyEmbed from './BlueskyEmbed.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const rkey = props.post.uri.split('/').pop();
const url = `https://bsky.app/profile/${props.post.author.handle}/post/${rkey}`;

const created = new Date(props.post.record.createdAt);

const pad = (n) => String(n).padStart(2, '0');
const stamp = `${created.getFullYear()}.${pad(created.getMonth() + 1)}.${pad(created.getDate())} · ${pad(created.getHours())}:${pad(created.getMinutes())}`;

const date = created.toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const likes = props.post.likeCount ?? 0;
const replies = props.post.replyCount ?? 0;

const statsShort = [likes && `♥ ${likes}`, replies && `↩ ${replies}`].filter(Boolean).join('  ');
const statsLong = [
  likes && `${likes} ${likes === 1 ? 'like' : 'likes'}`,
  replies && `${replies} ${replies === 1 ? 'reply' : 'replies'}`,
].filter(Boolean).join(', ');
</script>

<template>
  <article class="bsky-post">
    <div class="bsky-post__rail">
      <svg class="bsky-post__logo" viewBox="0 0 568 501" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.889-129.52 80.454-149.07-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.293 0 57.947 0-28.906 76.135-1.612 123.121 33.664Z"/>
      </svg>
      <time class="bsky-post__stamp" :datetime="post.record.createdAt"
        ><span aria-hidden="true">{{ stamp }}</span
        ><span class="sr-only">{{ date }}</span></time
      >
    </div>
    <div class="bsky-post__main">
      <span class="bsky-post__dots" aria-hidden="true"></span>
      <p class="bsky-post__source"><b>@{{ post.author.handle }}</b> on bsky.app</p>
      <div class="bsky-post__body">
        <p v-if="post.record.text" class="bsky-post__text">{{ post.record.text }}</p>
        <BlueskyEmbed v-if="post.embed" :embed="post.embed" />
      </div>
      <a :href="url" target="_blank" rel="noopener noreferrer" class="bsky-post__bar">
        <span v-if="statsShort" class="bsky-post__stats"
          ><span aria-hidden="true">{{ statsShort }}</span
          ><span class="sr-only">{{ statsLong }}</span></span
        >
        <span class="bsky-post__go"
          >view post <span class="bsky-post__arrow" aria-hidden="true">↗</span
          ><span class="sr-only"> on Bluesky (opens in a new tab)</span></span
        >
      </a>
    </div>
  </article>
</template>

<style scoped>
@layer theme.components {
  .bsky-post {
    --ink: oklch(from var(--brand-color) 20% 0.03 h);
    --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
    --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
    --accent: #0085ff;
    --accent-soft: oklch(from var(--accent) 72% 0.12 h);
    --accent-light: oklch(from var(--accent) 78% 0.12 h);
    --dots: oklch(from var(--accent) 65% 0.18 h / 0.35);
    --surface: oklch(from var(--bg-color) 100% c h / 1);
    --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    position: relative;
    overflow: hidden;
    isolation: isolate;
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    height: 100%;
    box-sizing: border-box;
    background: var(--surface);
    border: 1px solid var(--ink);
    color: var(--ink);
    font-family: var(--font-brand);
    font-size: var(--text-size-8);
    line-height: 1.6;
    font-weight: 350;
    transition: rotate 300ms var(--ease-spring);
  }

  .bsky-post:has(.bsky-post__bar:focus-visible) {
    outline: 2px solid var(--brand-ink);
    outline-offset: 2px;
  }

  /* Rail: butterfly + vertical timestamp */
  .bsky-post__rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-inline-end: 1px solid oklch(from var(--ink) l c h / 0.25);
    color: var(--ink-muted);
    transition: border-color 300ms var(--ease-out);
  }

  .bsky-post__logo {
    width: 1.25rem;
    height: 1.1rem;
    flex-shrink: 0;
    fill: var(--accent-soft);
    transition:
      fill 300ms var(--ease-out),
      scale 300ms var(--ease-spring);
  }

  .bsky-post__stamp {
    writing-mode: vertical-rl;
    rotate: 180deg;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Main column */
  .bsky-post__main {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .bsky-post__dots {
    position: absolute;
    z-index: -1;
    inset-inline-end: -2.25rem;
    inset-block-start: -2.25rem;
    width: 6.875rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, var(--dots) 30%, transparent 32%)
      0 0 / 0.5rem 0.5rem;
    transition: background-size 300ms var(--ease-spring);
  }

  .bsky-post__source {
    margin: 0;
    padding: 0.625rem 0.875rem 0;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    color: var(--ink-muted);
  }

  .bsky-post__source b {
    color: var(--ink);
  }

  .bsky-post__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.375rem 0.875rem 0.875rem;
  }

  .bsky-post__text {
    margin: 0;
    padding-inline-end: 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Bottom bar: the post link, stretched over the whole card */
  .bsky-post__bar {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    height: 1.375rem;
    margin-block-start: auto;
    padding: 0 0.75rem;
    background: var(--ink);
    color: var(--surface);
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 700;
    text-decoration: none;
    transition: height 300ms var(--ease-out);
  }

  .bsky-post__bar:focus-visible {
    outline: none;
  }

  .bsky-post__bar::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .bsky-post__stats {
    color: oklch(from var(--accent) 82% 0.03 h);
    font-weight: 500;
  }

  .bsky-post__go {
    margin-inline-start: auto;
  }

  .bsky-post__arrow {
    display: inline-block;
    color: var(--accent-light);
    transition: translate 300ms var(--ease-spring);
  }

  /* Hover & focus */
  .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__logo {
    fill: var(--accent);
  }

  .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__rail {
    border-inline-end-color: var(--ink);
  }

  .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__dots {
    background-size: 0.625rem 0.625rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    .bsky-post:hover {
      rotate: 0.6deg;
    }

    .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__bar {
      height: 1.75rem;
    }

    .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__arrow {
      translate: 0.1875rem -0.1875rem;
    }

    .bsky-post:is(:hover, :has(.bsky-post__bar:focus-visible)) .bsky-post__logo {
      scale: 1.2 0.85;
    }
  }
}
</style>
