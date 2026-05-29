<script setup>
import { ref, onMounted } from 'vue';

const ACTOR = 'arkmuntasser.com';
const COLLECTION = 'id.sifa.profile.position';

const positions = ref([]);
const error = ref(null);
const loading = ref(true);

function formatYear(dateStr) {
  return dateStr ? new Date(dateStr).getUTCFullYear() : 'Present';
}

onMounted(async () => {
  try {
    const url = `https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${ACTOR}&collection=${COLLECTION}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    positions.value = data.records
      .map(({ value }) => ({
        title: value.title,
        company: value.company,
        startedAt: value.startedAt,
        endedAt: value.endedAt,
      }))
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
      .slice(0, 5);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="work-positions">
    <p v-if="loading">Loading positions…</p>
    <p v-else-if="error">Failed to load positions: {{ error }}</p>
    <ol v-else class="timeline">
      <li v-for="position in positions" :key="`${position.company}-${position.startedAt}`" class="timeline-item">
        <p class="timeline-item__dates">
          <time :datetime="position.startedAt">{{ formatYear(position.startedAt) }}</time>
          <span aria-hidden="true">—</span>
          <time v-if="position.endedAt" :datetime="position.endedAt">{{ formatYear(position.endedAt) }}</time>
          <span v-else>Present</span>
        </p>
        <h3 class="timeline-item__title">{{ position.title }}</h3>
        <p class="timeline-item__company">{{ position.company }}</p>
      </li>
    </ol>
    <a href="https://sifa.id/p/arkmuntasser.com" class="work-positions__cta" target="_blank" rel="noopener noreferrer">Learn more about my career</a>
  </div>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-inline-start: 1.5rem;
  border-inline-start: 2px solid oklch(0.85 0.005 270);
}

.timeline-item {
  position: relative;
  padding-block: 0.25rem;
  margin-block-end: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  inset-inline-start: calc(-1.5rem - 5px);
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--brand-color);
  border: 2px solid oklch(1 0 0);
  outline: 2px solid var(--brand-color);
}

.timeline-item__dates {
  display: flex;
  gap: 0.4ch;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: oklch(0.55 0.005 270);
  margin: 0 0 0.25rem;
}

.timeline-item__title {
  font-size: 1rem;
  font-weight: 700;
  color: oklch(0.1 0.005 270);
  margin: 0 0 0.125rem;
  line-height: 1.3;
}

.timeline-item__company {
  font-size: 0.9375rem;
  color: oklch(0.35 0.005 270);
  margin: 0;
}

.work-positions__cta {
  display: inline-block;
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--brand-color);
  text-underline-offset: 0.2em;
}
</style>
