<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getBlogPosts } from '../utils/posts.js';
import { fetchAuthorPosts } from '../utils/bluesky.js';
import { fetchReviews } from '../utils/popfeed.js';
import BlogPostCard from './BlogPostCard.vue';
import BlueskyPost from './BlueskyPost.vue';
import PopfeedReviewCard from './PopfeedReviewCard.vue';

// Feed registry — add new feeds here; role 'primary' anchors content,
// role 'secondary' fills the gaps between primary items.
const FEEDS = [
  {
    id: 'blog',
    role: 'primary',
    fetch: () => Promise.resolve(getBlogPosts()),
    getDate: (item) => item.date,
    component: BlogPostCard,
    getKey: (item) => item.path,
    getProps: (item) => ({ post: item }),
  },
  {
    id: 'bluesky',
    role: 'secondary',
    fetch: () => fetchAuthorPosts(20),
    getDate: (item) => item.record.createdAt,
    component: BlueskyPost,
    getKey: (item) => item.uri,
    getProps: (item) => ({ post: item }),
  },
  {
    id: 'popfeed',
    role: 'secondary',
    fetch: () => fetchReviews(8),
    getDate: (item) => item.value.createdAt,
    component: PopfeedReviewCard,
    getKey: (item) => item.uri,
    getProps: (item) => ({ review: item }),
  },
];

function buildFeed(primaryEntries, secondaryEntries) {
  const byDateDesc = (a, b) =>
    new Date(b.feedConfig.getDate(b.item)) - new Date(a.feedConfig.getDate(a.item));

  const primary = [...primaryEntries].sort(byDateDesc);
  const secondary = [...secondaryEntries].sort(byDateDesc);

  const result = [];
  let cursor = 0;

  for (const entry of primary) {
    result.push(entry);
    const count = Math.floor(Math.random() * 4); // 0–3 inclusive
    for (let i = 0; i < count && cursor < secondary.length; i++) {
      result.push(secondary[cursor++]);
    }
  }

  while (cursor < secondary.length) {
    result.push(secondary[cursor++]);
  }

  return result;
}

const feedItems = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const primaryFeeds = FEEDS.filter((f) => f.role === 'primary');
    const secondaryFeeds = FEEDS.filter((f) => f.role === 'secondary');

    const [primaryResults, secondaryResults] = await Promise.all([
      Promise.all(primaryFeeds.map((f) => f.fetch().then((items) => items.map((item) => ({ item, feedConfig: f }))))),
      Promise.all(secondaryFeeds.map((f) => f.fetch().then((items) => items.map((item) => ({ item, feedConfig: f }))))),
    ]);

    feedItems.value = buildFeed(primaryResults.flat(), secondaryResults.flat());
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div ref="containerRef" class="channel-content">
    <p v-if="loading" class="channel-content__status">Loading…</p>
    <p v-else-if="error" class="channel-content__status">Failed to load feed: {{ error }}</p>
    <ul v-else ref="feedRef" class="channel-content__feed">
      <li
        v-for="entry in feedItems"
        :key="`${entry.feedConfig.id}-${entry.feedConfig.getKey(entry.item)}`"
        class="channel-content__item"
      >
        <component :is="entry.feedConfig.component" v-bind="entry.feedConfig.getProps(entry.item)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.channel-content {
  container-type: inline-size;
}

.channel-content__status {
  color: #636c76;
  font-size: 0.875rem;
}

.channel-content__feed {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.channel-content__item {
  align-self: start;
}

@container (min-width: 30rem) {
  .channel-content__feed {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 52rem) {
  .channel-content__feed {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
