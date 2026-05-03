<script setup>
import { ref, onMounted } from 'vue';

const reviews = ref([]);
const error = ref(null);
const loading = ref(true);

const TYPE_ICONS = {
  movie: '🎬',
  film: '🎬',
  tv: '📺',
  tvshow: '📺',
  show: '📺',
  series: '📺',
  book: '📚',
  album: '🎵',
  music: '🎵',
  game: '🎮',
  videogame: '🎮',
  podcast: '🎙️',
  comic: '💬',
  comicbook: '💬',
  manga: '📖',
  anime: '✨',
};

function typeIcon(type) {
  if (!type) return '🎭';
  return TYPE_ICONS[type.toLowerCase().replace(/[\s_-]/g, '')] ?? '🎭';
}

function stars(rating) {
  const v = rating / 2;
  return Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1;
    if (pos <= Math.floor(v)) return 'full';
    if (pos === Math.ceil(v) && v % 1 >= 0.5) return 'half';
    return 'empty';
  });
}

onMounted(async () => {
  try {
    const res = await fetch(
      'https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=arkmuntasser.com&collection=social.popfeed.feed.review&limit=6&reverse=false'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    reviews.value = data.records;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="reviews">
		<h2>Recently Reviewed</h2>
    <p v-if="loading">Loading reviews…</p>
    <p v-else-if="error">Failed to load reviews: {{ error }}</p>
    <ul v-else class="reviews-grid">
      <li v-for="review in reviews" :key="review.uri" class="review-card">
        <div class="poster-wrap">
          <img v-if="review.value.posterUrl" :src="review.value.posterUrl" :alt="review.value.title" class="poster" />
          <div v-else class="poster-placeholder" />
        </div>
        <span class="type-badge" :aria-label="review.value.creativeWorkType">{{ typeIcon(review.value.creativeWorkType) }}</span>
        <div class="card-body">
          <p class="title">{{ review.value.title }}</p>
          <div class="rating" :aria-label="`${review.value.rating} out of 10`">
            <span
              v-for="(state, i) in stars(review.value.rating)"
              :key="i"
              class="star"
              :data-state="state"
            >★</span>
          </div>
          <p class="text">{{ review.value.text }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.reviews-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.review-card {
  position: relative;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}

.poster-wrap {
  width: 3.5rem;
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
  min-height: 4.5rem;
  background: #3a3a3a;
}

.card-body {
  padding: 0.5rem 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.type-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.75rem;
  line-height: 1;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  padding: 0.2em 0.25em;
}

.title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  display: flex;
  gap: 0.05em;
  font-size: 0.75rem;
}

.star[data-state="full"] {
  color: oklch(0.64 0.25 15.46);
}

.star[data-state="empty"] {
  color: #555;
}

.star[data-state="half"] {
  background: linear-gradient(to right, oklch(0.64 0.25 15.46) 50%, #555 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
