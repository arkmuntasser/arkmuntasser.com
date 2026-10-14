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

const OWNER = 'arkmuntasser';

const props = defineProps({
  repo: {
    type: Object,
    required: true,
  },
});

const languageColor = props.repo.language
  ? (LANGUAGE_COLORS[props.repo.language] ?? '#636c76')
  : null;

function elapsed(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);
  if (minutes < 60) return [minutes, 'minute', 'm'];
  if (hours < 24)   return [hours, 'hour', 'h'];
  if (days < 30)    return [days, 'day', 'd'];
  if (months < 12)  return [months, 'month', 'mo'];
  return [years, 'year', 'y'];
}

const pushed = props.repo.pushedAt ? elapsed(props.repo.pushedAt) : null;
const pushedShort = pushed ? `pushed ${pushed[0]}${pushed[2]} ago` : null;
const pushedLong = pushed
  ? `Updated ${pushed[0]} ${pushed[1]}${pushed[0] !== 1 ? 's' : ''} ago`
  : null;
</script>

<template>
  <a :href="repo.url" target="_blank" rel="noopener noreferrer" class="project-card">
    <span class="project-card__dots" aria-hidden="true"></span>
    <svg class="project-card__logo" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.070 3.633 17.700 3.633 17.700c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.070 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.760-1.605-2.665-.3-5.466-1.332-5.466-5.930 0-1.310.465-2.380 1.235-3.220-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.300 1.230.96-.267 1.980-.399 3-.405 1.020.006 2.040.138 3 .405 2.280-1.552 3.285-1.230 3.285-1.230.645 1.653.24 2.873.12 3.176.765.840 1.230 1.910 1.230 3.220 0 4.610-2.805 5.625-5.475 5.920.42.36.81 1.096.81 2.220 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
    <div class="project-card__kicker">
      <span class="project-card__source"><span aria-hidden="true">↗ </span>github.com</span>
      <time v-if="pushed" class="project-card__pushed" :datetime="repo.pushedAt"
        ><span aria-hidden="true">{{ pushedShort }}</span
        ><span class="sr-only">{{ pushedLong }}</span></time
      >
    </div>
    <div class="project-card__body">
      <p class="project-card__name"><span>{{ OWNER }}/</span>{{ repo.name }}</p>
      <p v-if="repo.description" class="project-card__description">{{ repo.description }}</p>
      <ul v-if="repo.language || repo.stars || repo.topics.length" class="project-card__meta">
        <li v-if="repo.language">
          <span class="project-card__language-dot" :style="{ background: languageColor }" aria-hidden="true"></span>
          {{ repo.language }}
        </li>
        <li v-if="repo.stars">
          <span aria-hidden="true">★</span><span class="sr-only">Stars:</span> {{ repo.stars }}
        </li>
        <li v-for="topic in repo.topics" :key="topic" class="project-card__topic">{{ topic }}</li>
      </ul>
    </div>
    <span class="project-card__bar" aria-hidden="true">view repo <span class="project-card__arrow">↗</span></span>
    <span class="sr-only">(opens on GitHub in a new tab)</span>
  </a>
</template>

<style scoped>
@layer theme.components {
  .project-card {
    --ink: oklch(from var(--brand-color) 20% 0.03 h);
    --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
    --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
    --accent: #31d0fa;
    --dots: oklch(0.82 0.13 220 / 0.45);
    --logo: oklch(0.93 0.05 220);
    --surface: oklch(from var(--bg-color) 100% c h / 1);
    --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    container: project-card / inline-size;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    height: 100%;
    box-sizing: border-box;
    background: var(--surface);
    border: 1px solid var(--ink);
    color: var(--ink);
    text-decoration: none;
    font-family: var(--font-brand);
    font-size: var(--text-size-8);
    line-height: 1.6;
    font-weight: 350;
    transition: rotate 300ms var(--ease-spring);
  }

  .project-card:focus-visible {
    outline: 2px solid var(--brand-ink);
    outline-offset: 2px;
  }

  /* Decoration: cyan halftone dots with the GitHub mark printed over them */
  .project-card__dots {
    position: absolute;
    z-index: -1;
    inset-inline-end: -2.5rem;
    inset-block-end: -1.625rem;
    width: 8.125rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, var(--dots) 30%, transparent 32%)
      0 0 / 0.5rem 0.5rem;
    transition: background-size 300ms var(--ease-spring);
  }

  .project-card__logo {
    position: absolute;
    z-index: -1;
    inset-inline-end: -0.75rem;
    inset-block-end: 0.625rem;
    width: 5.25rem;
    height: 5.25rem;
    fill: var(--logo);
    transition: fill 300ms var(--ease-out);
  }

  /* Top strip: source tab and last push */
  .project-card__kicker {
    display: flex;
    align-items: stretch;
    background: var(--surface);
    border-block-end: 1px solid var(--ink);
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
  }

  .project-card__kicker > * {
    padding: 0.375rem 0.75rem;
  }

  .project-card__source {
    background: var(--ink);
    color: var(--surface);
    font-weight: 700;
  }

  .project-card__pushed {
    margin-inline-start: auto;
    color: var(--ink-muted);
  }

  .project-card__body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    min-height: 5.75rem;
    padding: 1rem 1rem 1.25rem;
  }

  .project-card__name {
    margin: 0;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -0.01em;
    word-break: break-word;
  }

  .project-card__name span {
    color: var(--ink-muted);
    font-weight: 500;
  }

  .project-card__description {
    margin: 0;
    font-weight: 300;
    line-height: 1.5;
  }

  .project-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin: 0;
    margin-block-start: auto;
    padding: 0;
    padding-inline-end: 5rem;
    list-style: none;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    color: var(--ink-muted);
  }

  .project-card__meta li {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .project-card__topic::before {
    content: "#" / "";
  }

  .project-card__language-dot {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
    box-shadow: inset 0 0 0 1px oklch(0 0 0 / 0.15);
    flex-shrink: 0;
  }

  .project-card__bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.375rem;
    height: 1.375rem;
    padding: 0 0.75rem;
    background: var(--ink);
    color: var(--surface);
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 700;
    transition: height 300ms var(--ease-out);
  }

  .project-card__arrow {
    display: inline-block;
    color: var(--accent);
    transition: translate 300ms var(--ease-spring);
  }

  @container project-card (min-width: 32rem) {
    .project-card__description {
      padding-inline-end: 5rem;
    }
  }

  /* Hover & focus */
  .project-card:is(:hover, :focus-visible) .project-card__logo {
    fill: var(--accent);
  }

  .project-card:is(:hover, :focus-visible) .project-card__dots {
    background-size: 0.625rem 0.625rem;
  }

  .project-card:is(:hover, :focus-visible) .project-card__name {
    text-decoration: underline 2px var(--accent);
    text-underline-offset: 0.15em;
  }

  @media (prefers-reduced-motion: no-preference) {
    .project-card:hover {
      rotate: 0.6deg;
    }

    .project-card:is(:hover, :focus-visible) .project-card__bar {
      height: 1.75rem;
    }

    .project-card:is(:hover, :focus-visible) .project-card__arrow {
      translate: 0.1875rem -0.1875rem;
    }
  }
}
</style>
