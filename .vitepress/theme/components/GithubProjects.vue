<script setup>
import { ref, onMounted } from 'vue';
import { fetchGithubRepos } from '../utils/github.js';
import GithubProjectCard from './GithubProjectCard.vue';

const props = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
});

const repos = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    repos.value = await fetchGithubRepos(props.limit);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="github-projects">
    <p v-if="loading">Loading GitHub projects…</p>
    <p v-else-if="error">Failed to load projects: {{ error }}</p>
    <ul v-else class="projects-list">
      <li v-for="repo in repos" :key="repo.id" class="project-item">
        <GithubProjectCard :repo="repo" />
      </li>
    </ul>
  </div>
</template>
