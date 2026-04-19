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
  <div>
    <p v-if="loading">Loading Bluesky posts…</p>
    <p v-else-if="error">Failed to load posts: {{ error }}</p>
    <ul v-else>
      <BlueskyPost v-for="post in posts" :key="post.uri" :post="post" />
    </ul>
  </div>
</template>
