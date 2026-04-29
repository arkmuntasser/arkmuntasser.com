<script setup>
import { ref, onMounted } from 'vue';
import BlueskyPost from './BlueskyPost.vue';

const posts = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(
      'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=arkmuntasser.com&limit=20&filter=posts_no_replies'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
		console.log('Fetched Bluesky feed data:', data);

    // filter out reposts and replies, keep only original posts, cap at 12
    posts.value = data.feed
      .filter((item) => !item.reason && !item.post.record.reply)
      .slice(0, 12)
      .map((item) => item.post);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="feed-container">
    <p v-if="loading">Loading Bluesky posts…</p>
    <p v-else-if="error">Failed to load posts: {{ error }}</p>
    <ul v-else class="feed">
      <li v-for="post in posts" :key="post.uri" class="feed-item">
        <BlueskyPost :post="post" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.feed-container {
  container-type: inline-size;
}

.feed {
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 1;
  column-gap: 1rem;
}

.feed-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

@container (min-width: 30rem) {
  .feed {
    columns: 2;
  }
}

@container (min-width: 52rem) {
  .feed {
    columns: 3;
  }
}
</style>
