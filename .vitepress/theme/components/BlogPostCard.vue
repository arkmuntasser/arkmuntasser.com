<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const date = props.post.date
  ? new Date(props.post.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  : null;
</script>

<template>
  <a :href="post.path" class="blog-post-card">
    <p class="blog-post-card__title">{{ post.title }}</p>
    <p v-if="post.excerpt" class="blog-post-card__excerpt">{{ post.excerpt }}</p>
    <footer class="blog-post-card__footer">
      <div class="blog-post-card__meta">
        <time v-if="date" class="blog-post-card__date" :datetime="post.date">{{ date }}</time>
        <ul v-if="post.categories.length" class="blog-post-card__categories">
          <li v-for="cat in post.categories" :key="cat">{{ cat }}</li>
        </ul>
      </div>
      <span class="blog-post-card__logo" aria-hidden="true"><b>@</b></span>
    </footer>
  </a>
</template>

<style scoped>
.blog-post-card {
	--bg: oklch(from var(--bg-color) 100% c h / 1);
	--border: oklch(from var(--brand-color) 92% calc(c / 2) h);
	--shadow: oklch(from var(--brand-color) 53.994% 0.19066 h / 0.1);

  display: block;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-color);
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: var(--text-size-8);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.blog-post-card:hover,
.blog-post-card:focus-visible {
  border-color: var(--brand-color);
  box-shadow: 0 0 0 3px var(--shadow);
  outline: none;
}

.blog-post-card__title {
  margin: 0 0 8px;
  font-weight: 700;
  color: var(--text-color);
}

.blog-post-card__excerpt {
  margin: 0 0 12px;
  color: var(--text-color);
  word-break: break-word;
}

.blog-post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.blog-post-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.blog-post-card__date {
  color: var(--text-muted);
  font-size: var(--text-size-9);
}

.blog-post-card__categories {
  display: flex;
	flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.blog-post-card__categories li {
  font-size: var(--text-size-9);
  color: var(--text-muted);
  background: oklch(from var(--bg) 98% c h / 0.9);
  border: 1px solid oklch(from var(--border) l c h / 0.8);
  border-radius: var(--radius-rounded);
  padding: 0 6px;
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
  color: var(--brand-color);
	font-family: 'Outfit';
	font-size: 22px;
	font-weight: 700;
}
</style>
