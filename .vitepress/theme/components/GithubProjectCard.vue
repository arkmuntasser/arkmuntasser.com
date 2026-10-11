<script setup>
const LANGUAGE_COLORS = {
  'JavaScript':  '#f1e05a',
  'TypeScript':  '#3178c6',
  'Vue':         '#41b883',
  'Svelte':      '#ff3e00',
  'Astro':       '#ff5a03',
  'HTML':        '#e34c26',
  'CSS':         '#563d7c',
  'SCSS':        '#c6538c',
  'Sass':        '#a53b70',
  'Less':        '#1d365d',
  'Python':      '#3572a5',
  'Ruby':        '#701516',
  'Go':          '#00add8',
  'Rust':        '#dea584',
  'Java':        '#b07219',
  'Kotlin':      '#a97bff',
  'Swift':       '#f05138',
  'Dart':        '#00b4ab',
  'C':           '#555555',
  'C++':         '#f34b7d',
  'C#':          '#178600',
  'Shell':       '#89e051',
  'Dockerfile':  '#384d54',
  'Markdown':    '#083fa1',
};

const props = defineProps({
  repo: {
    type: Object,
    required: true,
  },
});

const languageColor = props.repo.language
  ? (LANGUAGE_COLORS[props.repo.language] ?? '#636c76')
  : null;

function formatPushedAt(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24)   return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30)    return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (months < 12)  return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}
</script>

<template>
  <div class="project-card">
    <div class="project-card__body">
      <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="project-card__name">
        {{ repo.name }}
      </a>
      <p v-if="repo.description" class="project-card__description">{{ repo.description }}</p>
    </div>
    <footer class="project-card__footer">
      <div class="project-card__meta">
				<div class="project-card__topics">
					<template v-for="topic in repo.topics" :key="topic">
						<span class="project-card__pill">{{ topic }}</span>
					</template>
				</div>
				<div class="project-card__deets">
					<span v-if="repo.language" class="project-card__language">
						<span class="project-card__language-dot" :style="{ background: languageColor }" aria-hidden="true"></span>
						{{ repo.language }}
					</span>
					<time v-if="repo.pushedAt" class="project-card__pushed" :datetime="repo.pushedAt">Updated {{ formatPushedAt(repo.pushedAt) }}</time>
				</div>
      </div>
      <svg class="project-card__logo" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </footer>
  </div>
</template>

<style scoped>
.project-card {
	--bg: var(--card-bg);
	--border: var(--card-border);
	--shadow: var(--card-ring);

  display: flex;
  flex-direction: column;
  position: relative;
  padding: var(--space-4);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-color);
  font-family: var(--font-brand);
  font-size: var(--text-size-8);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    translate var(--duration-fast) var(--ease-out);
}

.project-card:hover,
.project-card:focus-within {
  border-color: var(--brand-color);
  box-shadow: 0 0 0 3px var(--shadow);
}

@media (prefers-reduced-motion: no-preference) {
  .project-card:hover {
    translate: 0 -2px;
  }
}

.project-card__body {
  flex: 1;
  min-width: 0;
}

.project-card__name {
  display: block;
  margin: 0 0 var(--space-2);
  font-weight: 700;
	color: var(--text-color);
  text-decoration: none;
  word-break: break-word;
}

.project-card__name::after {
  content: '';
  position: absolute;
  inset: 0;
}

.project-card__description {
  margin: 0 0 var(--space-3);
  color: var(--text-color);
  font-size: var(--text-size-9);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-3);
  gap: var(--space-2);
}

.project-card__meta {
  display: grid;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.project-card__topics, .project-card__deets {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-1);
}

.project-card__deets {
	gap: var(--space-4);
}

.project-card__language {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-size-9);
  color: var(--text-muted);
  white-space: nowrap;
}

.project-card__language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-card__pushed {
  font-size: var(--text-size-9);
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.project-card__pill {
  font-size: var(--text-size-9);
  color: var(--text-muted);
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  border-radius: var(--radius-rounded);
  padding: 0 0.375rem;
  white-space: nowrap;
}

.project-card__logo {
  width: 16px;
  height: 16px;
  fill: #1f2328;
  flex-shrink: 0;
	align-self: end;
}
</style>
