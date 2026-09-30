<script setup>
import { ref, markRaw, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getBlogPosts } from '../utils/posts.js';
import { fetchAuthorPosts } from '../utils/bluesky.js';
import { fetchReviews } from '../utils/popfeed.js';
import { fetchGithubRepos } from '../utils/github.js';
import GithubProjectCard from './GithubProjectCard.vue';
import BlogPostCard from './BlogPostCard.vue';
import BlueskyPost from './BlueskyPost.vue';
import PopfeedReviewCard from './PopfeedReviewCard.vue';


// Feed registry — add new feeds here; role 'primary' anchors content,
// role 'secondary' fills the gaps between primary items,
// role 'filler' is appended after all primary and secondary content is placed.
const FEEDS = [
  {
    id: 'blog',
    role: 'primary',
    fetch: () => Promise.resolve(getBlogPosts()),
    getDate: (item) => item.date,
    component: markRaw(BlogPostCard),
    getKey: (item) => item.path,
    getProps: (item) => ({ post: item }),
    isWide: (item) => item.featured,
  },
  {
    id: 'bluesky',
    role: 'filler',
    fetch: () => fetchAuthorPosts(20),
    getDate: (item) => item.record.createdAt,
    component: markRaw(BlueskyPost),
    getKey: (item) => item.uri,
    getProps: (item) => ({ post: item }),
  },
  {
    id: 'popfeed',
    role: 'filler',
    fetch: () => fetchReviews(8),
    getDate: (item) => item.value.createdAt,
    component: markRaw(PopfeedReviewCard),
    getKey: (item) => item.uri,
    getProps: (item) => ({ review: item }),
  },
	{
    id: 'github',
    role: 'secondary',
    fetch: () => fetchGithubRepos(10),
    getDate: (item) => item.pushedAt,
    component: markRaw(GithubProjectCard),
    getKey: (item) => item.id,
    getProps: (item) => ({ repo: item }),
  },
];

function buildFeed(primaryEntries, secondaryEntries, fillerEntries) {
  const byDateDesc = (a, b) =>
    new Date(b.feedConfig.getDate(b.item)) - new Date(a.feedConfig.getDate(a.item));

  const primary = [...primaryEntries].sort(byDateDesc);
  const secondary = [...secondaryEntries].sort(byDateDesc);
  const filler = [...fillerEntries].sort(byDateDesc);

  const result = [];
  let secCursor = 0;
  let filCursor = 0;

  for (const entry of primary) {
    result.push(entry);

    const secCount = Math.floor(Math.random() * 2); // 0–3 inclusive
    for (let i = 0; i < secCount && secCursor < secondary.length; i++) {
      result.push(secondary[secCursor++]);
    }

    const filCount = Math.floor(Math.random() * 4); // 0–3 inclusive
    for (let i = 0; i < filCount && filCursor < filler.length; i++) {
      result.push(filler[filCursor++]);
    }
  }

  while (secCursor < secondary.length) {
    result.push(secondary[secCursor++]);
  }

  while (filCursor < filler.length) {
    result.push(filler[filCursor++]);
  }

  return result;
}

const feedItems = ref([]);
const loading = ref(true);
const error = ref(null);
const feedRef = ref(null);

let masonryInstance = null;

watch(loading, async (isLoading) => {
  if (!isLoading) {
    await nextTick();
    if (feedRef.value) {
      const { default: Masonry } = await import('masonry-layout');
      masonryInstance = new Masonry(feedRef.value, {
        itemSelector: '.channel-content__item',
        columnWidth: '.channel-content__sizer',
        percentPosition: true,
        gutter: 16,
      });
    }
  }
});

onUnmounted(() => {
  masonryInstance?.destroy();
});

onMounted(async () => {
  try {
    const primaryFeeds = FEEDS.filter((f) => f.role === 'primary');
    const secondaryFeeds = FEEDS.filter((f) => f.role === 'secondary');
    const fillerFeeds = FEEDS.filter((f) => f.role === 'filler');

    const [primaryResults, secondaryResults, fillerResults] = await Promise.all([
      Promise.all(primaryFeeds.map((f) => f.fetch().then((items) => items.map((item) => ({ item, feedConfig: f }))))),
      Promise.all(secondaryFeeds.map((f) => f.fetch().then((items) => items.map((item) => ({ item, feedConfig: f }))))),
      Promise.all(fillerFeeds.map((f) => f.fetch().then((items) => items.map((item) => ({ item, feedConfig: f }))))),
    ]);

    feedItems.value = buildFeed(primaryResults.flat(), secondaryResults.flat(), fillerResults.flat());
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
      <li class="channel-content__sizer" aria-hidden="true"></li>
      <li
        v-for="entry in feedItems"
        :key="`${entry.feedConfig.id}-${entry.feedConfig.getKey(entry.item)}`"
        class="channel-content__item"
        :class="{ 'channel-content__item--wide': entry.feedConfig.isWide?.(entry.item) }"
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
  color: var(--text-muted);
  font-size: 0.875rem;
}

.channel-content__feed {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.channel-content__item {
  margin-bottom: 1rem;
}

/* Column width is driven by the sizer (not the first item) so a wide
   featured item can never become Masonry's column unit. */
.channel-content__sizer,
.channel-content__item {
  width: 100%;
}

@container (min-width: 640px) {
  .channel-content__sizer,
  .channel-content__item {
    width: calc(50% - 8px);
  }

  .channel-content__item--wide {
    width: 100%;
  }
}

@container (min-width: 1024px) {
  .channel-content__sizer,
  .channel-content__item {
    width: calc(33.333% - 11px);
  }

  /* two columns + one 16px gutter */
  .channel-content__item--wide {
    width: calc((100% - 32px) / 3 * 2 + 16px);
  }
}
</style>
