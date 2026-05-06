<script setup>
import { ref, onMounted } from 'vue';
import { fetchReviews } from '../utils/popfeed.js';
import PopfeedReviewCard from './PopfeedReviewCard.vue';

const props = defineProps({
  limit: {
    type: Number,
    default: 6,
  },
});

const reviews = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    reviews.value = await fetchReviews(props.limit);
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
      <li v-for="review in reviews" :key="review.uri">
        <PopfeedReviewCard :review="review" />
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
</style>
