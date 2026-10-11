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
const date = new Date(props.post.record.createdAt).toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
</script>

<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="bsky-post">
    <p class="bsky-post__text">{{ post.record.text }}</p>

    <BlueskyEmbed v-if="post.embed" :embed="post.embed" />

    <footer class="bsky-post__footer">
      <time class="bsky-post__date" :datetime="post.record.createdAt">{{ date }}</time>
      <svg class="bsky-post__logo" viewBox="0 0 568 501" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.889-129.52 80.454-149.07-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.293 0 57.947 0-28.906 76.135-1.612 123.121 33.664Z"/>
      </svg>
    </footer>
    <span class="bsky-post__sr-only">(opens in new tab)</span>
  </a>
</template>

<style scoped>
.bsky-post {
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

.bsky-post:hover,
.bsky-post:focus-visible {
  border-color: var(--brand-color);
  box-shadow: 0 0 0 3px var(--shadow);
  text-decoration: none;
}

@media (prefers-reduced-motion: no-preference) {
  .bsky-post:hover {
    translate: 0 -2px;
  }
}

.bsky-post__text {
  margin: 0 0 var(--space-3);
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;
}

.bsky-post__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-3);
}

.bsky-post__date {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  font-size: var(--text-size-9);
}

.bsky-post__logo {
  width: 16px;
  height: 16px;
  fill: #0085ff;
  flex-shrink: 0;
}

.bsky-post__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
