<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  embed: {
    type: Object,
    required: true,
  },
});

const type = props.embed.$type;

// Normalise the nested structures we need
const images = type === 'app.bsky.embed.images#view' ? props.embed.images : null;
const video = type === 'app.bsky.embed.video#view' ? props.embed : null;
const external = type === 'app.bsky.embed.external#view' ? props.embed.external : null;
const quotedRecord = type === 'app.bsky.embed.record#view' ? props.embed.record : null;

// recordWithMedia has both a media embed and a quoted record
const rwmMedia = type === 'app.bsky.embed.recordWithMedia#view' ? props.embed.media : null;
const rwmRecord = type === 'app.bsky.embed.recordWithMedia#view' ? props.embed.record?.record : null;

const MEDIA_EXTENSIONS = /\.(gif|webp|png|jpg|jpeg|avif|webm|mp4)(\?|$)/i;
const isVideo = external ? /\.(webm|mp4)(\?|$)/i.test(external.uri) : false;
const isMediaOnly = external ? MEDIA_EXTENSIONS.test(external.uri) : false;

let externalHostname = null;
if (external && !isMediaOnly) {
  try { externalHostname = new URL(external.uri).hostname.replace(/^www\./, ''); } catch {}
}

// Looping GIF videos: pausable, and paused from the start for reduced motion
const gifEl = ref(null);
const gifPaused = ref(false);

onMounted(() => {
  if (gifEl.value && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gifEl.value.pause();
    gifPaused.value = true;
  }
});

function toggleGif() {
  if (!gifEl.value) return;
  if (gifEl.value.paused) {
    gifEl.value.play();
    gifPaused.value = false;
  } else {
    gifEl.value.pause();
    gifPaused.value = true;
  }
}
</script>

<template>
  <!-- Images -->
  <div v-if="images" class="bsky-embed bsky-embed__images" :class="`bsky-embed__images--${images.length}`">
    <span
      v-for="img in images"
      :key="img.fullsize"
      class="bsky-embed__shot"
      :style="images.length === 1 && img.aspectRatio ? `aspect-ratio: ${img.aspectRatio.width} / ${img.aspectRatio.height}` : undefined"
    >
      <img :src="img.thumb" :alt="img.alt || ''" loading="lazy" decoding="async" class="bsky-embed__image" />
      <span v-if="img.alt" class="bsky-embed__badge" aria-hidden="true">ALT</span>
    </span>
  </div>

  <!-- Video -->
  <div v-else-if="video" class="bsky-embed bsky-embed__video-wrap">
    <video
      :src="video.playlist"
      :poster="video.thumbnail"
      controls
      preload="none"
      class="bsky-embed__video"
      :aria-label="video.alt || undefined"
      :style="video.aspectRatio ? `aspect-ratio: ${video.aspectRatio.width} / ${video.aspectRatio.height}` : undefined"
    ></video>
  </div>

  <!-- External GIF as video -->
  <div v-else-if="external && isVideo" class="bsky-embed bsky-embed__gif-wrap">
    <video
      ref="gifEl"
      :src="external.uri"
      :poster="external.thumb || undefined"
      :aria-label="external.description?.replace('Alt: ', '') || undefined"
      autoplay
      muted
      loop
      playsinline
      class="bsky-embed__gif"
    ></video>
    <span class="bsky-embed__badge" aria-hidden="true">GIF</span>
    <button type="button" class="bsky-embed__gif-toggle" :aria-label="gifPaused ? 'Play GIF' : 'Pause GIF'" @click="toggleGif">
      <span aria-hidden="true">{{ gifPaused ? '▶' : '❚❚' }}</span>
    </button>
  </div>

  <!-- External GIF / image -->
  <div v-else-if="external && isMediaOnly" class="bsky-embed bsky-embed__gif-wrap">
    <img :src="external.uri" :alt="external.description?.replace('Alt: ', '') || ''" loading="lazy" decoding="async" class="bsky-embed__gif" />
    <span class="bsky-embed__badge" aria-hidden="true">GIF</span>
  </div>

  <!-- External link -->
  <a v-else-if="external" :href="external.uri" target="_blank" rel="noopener noreferrer" class="bsky-embed bsky-embed__external">
    <img v-if="external.thumb" :src="external.thumb" alt="" loading="lazy" decoding="async" class="bsky-embed__link-thumb" />
    <span class="bsky-embed__link-body">
      <span class="bsky-embed__link-url">{{ externalHostname }} <span aria-hidden="true">↗</span></span>
      <span class="bsky-embed__link-title">{{ external.title }}</span>
      <span v-if="external.description" class="bsky-embed__link-desc">{{ external.description }}</span>
    </span>
    <span class="sr-only">(opens in a new tab)</span>
  </a>

  <!-- Quoted post -->
  <blockquote v-else-if="quotedRecord && quotedRecord.$type === 'app.bsky.embed.record#viewRecord'" class="bsky-embed bsky-embed__quote">
    <p class="bsky-embed__quote-header">
      <img v-if="quotedRecord.author?.avatar" :src="quotedRecord.author.avatar" alt="" loading="lazy" class="bsky-embed__quote-avatar" />
      <strong class="bsky-embed__quote-display-name">{{ quotedRecord.author?.displayName || quotedRecord.author?.handle }}</strong>
      <span v-if="quotedRecord.author?.displayName" class="bsky-embed__quote-handle">@{{ quotedRecord.author.handle }}</span>
    </p>
    <p class="bsky-embed__quote-text">{{ quotedRecord.value?.text }}</p>
    <div v-if="quotedRecord.embeds?.length" class="bsky-embed__quote-embeds">
      <BlueskyEmbed v-for="(e, i) in quotedRecord.embeds" :key="i" :embed="e" />
    </div>
  </blockquote>

  <!-- Record with media: show media then quoted post -->
  <div v-else-if="rwmMedia || rwmRecord" class="bsky-embed bsky-embed__rwm">
    <BlueskyEmbed v-if="rwmMedia" :embed="rwmMedia" />
    <blockquote v-if="rwmRecord && rwmRecord.$type === 'app.bsky.embed.record#viewRecord'" class="bsky-embed__quote">
      <p class="bsky-embed__quote-header">
        <img v-if="rwmRecord.author?.avatar" :src="rwmRecord.author.avatar" alt="" loading="lazy" class="bsky-embed__quote-avatar" />
        <strong class="bsky-embed__quote-display-name">{{ rwmRecord.author?.displayName || rwmRecord.author?.handle }}</strong>
        <span v-if="rwmRecord.author?.displayName" class="bsky-embed__quote-handle">@{{ rwmRecord.author.handle }}</span>
      </p>
      <p class="bsky-embed__quote-text">{{ rwmRecord.value?.text }}</p>
      <div v-if="rwmRecord.embeds?.length" class="bsky-embed__quote-embeds">
        <BlueskyEmbed v-for="(e, i) in rwmRecord.embeds" :key="i" :embed="e" />
      </div>
    </blockquote>
  </div>
</template>

<style scoped>
@layer theme.components {
  .bsky-embed,
  .bsky-embed__quote {
    --ink: oklch(from var(--brand-color) 20% 0.03 h);
    --ink-muted: oklch(from var(--brand-color) 45% 0.04 h);
    --brand-ink: oklch(from var(--brand-color) 52% 0.22 h);
    --surface: oklch(from var(--bg-color) 100% c h / 1);
    --tint: oklch(from #0085ff 98.5% 0.008 h);
  }

  /* Interactive embeds sit above the card's stretched post link */
  .bsky-embed__video-wrap,
  .bsky-embed__gif-wrap,
  .bsky-embed__external {
    position: relative;
    z-index: 2;
  }

  /* Badges (ALT / GIF) */
  .bsky-embed__badge {
    position: absolute;
    inset-inline-start: 0.375rem;
    inset-block-end: 0.375rem;
    padding: 0.0625rem 0.3125rem;
    background: oklch(from var(--ink) l c h / 0.85);
    color: #fff;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.5625rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    pointer-events: none;
  }

  /* Images */
  .bsky-embed__images {
    display: grid;
    gap: 2px;
    background: var(--ink);
    border: 1px solid var(--ink);
    overflow: hidden;
  }

  .bsky-embed__shot {
    position: relative;
    display: block;
    min-height: 0;
  }

  .bsky-embed__image {
    width: 100%;
    height: 100%;
    display: block;
    color: transparent;
    object-fit: cover;
  }

  .bsky-embed__images--1 .bsky-embed__shot {
    max-height: 20rem;
  }

  .bsky-embed__images--2,
  .bsky-embed__images--3,
  .bsky-embed__images--4 {
    grid-template-columns: 1fr 1fr;
  }

  .bsky-embed__images--2 .bsky-embed__shot {
    aspect-ratio: 1 / 1;
  }

  .bsky-embed__images--3 .bsky-embed__shot:first-child {
    grid-row: span 2;
  }

  .bsky-embed__images--3 .bsky-embed__shot:not(:first-child) {
    aspect-ratio: 2 / 1;
  }

  .bsky-embed__images--4 .bsky-embed__shot {
    aspect-ratio: 3 / 2;
  }

  /* Video */
  .bsky-embed__video-wrap {
    border: 1px solid var(--ink);
  }

  .bsky-embed__video {
    width: 100%;
    display: block;
    background: #000;
  }

  /* GIFs */
  .bsky-embed__gif-wrap {
    border: 1px solid var(--ink);
  }

  .bsky-embed__gif {
    width: 100%;
    display: block;
    color: transparent;
  }

  .bsky-embed__gif-toggle {
    position: absolute;
    inset-inline-end: 0.375rem;
    inset-block-end: 0.375rem;
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: oklch(from var(--ink) l c h / 0.85);
    color: #fff;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .bsky-embed__gif-toggle:focus-visible {
    outline: 2px solid var(--brand-ink);
    outline-offset: 2px;
  }

  /* External link card */
  .bsky-embed__external {
    display: block;
    border: 1px solid var(--ink);
    background: var(--surface);
    color: inherit;
    text-decoration: none;
    transition: background-color 150ms ease;
  }

  .bsky-embed__external:hover {
    background: var(--tint);
  }

  .bsky-embed__external:focus-visible {
    outline: 2px solid var(--brand-ink);
    outline-offset: 2px;
  }

  .bsky-embed__link-thumb {
    width: 100%;
    aspect-ratio: 1.91 / 1;
    object-fit: cover;
    display: block;
    border-block-end: 1px solid var(--ink);
    color: transparent;
  }

  .bsky-embed__link-body {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.5rem 0.75rem 0.625rem;
  }

  .bsky-embed__link-url {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.625rem;
    color: var(--ink-muted);
  }

  .bsky-embed__link-title {
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bsky-embed__link-desc {
    font-size: 0.75rem;
    font-weight: 300;
    line-height: 1.4;
    color: var(--ink-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Quoted post */
  .bsky-embed__quote {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;
    margin: 0;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--ink);
    background: var(--tint);
    line-height: 1.45;
  }

  .bsky-embed__quote-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 0;
    margin: 0;
    font-size: 0.8125rem;
  }

  .bsky-embed__quote-avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .bsky-embed__quote-display-name {
    flex: 0 1 auto;
    min-width: 0;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bsky-embed__quote-handle {
    flex: 0 100 auto;
    min-width: 0;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.625rem;
    color: var(--ink-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bsky-embed__quote-text {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .bsky-embed__quote-embeds {
    margin-block-start: 0.25rem;
  }

  .bsky-embed__rwm {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }
}
</style>
