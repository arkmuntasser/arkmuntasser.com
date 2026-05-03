<script setup>
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
</script>

<template>
  <!-- Images -->
  <div v-if="images" class="bsky-embed__images">
    <img
      v-for="img in images"
      :key="img.fullsize"
      :src="img.thumb"
      :alt="img.alt || ''"
      class="bsky-embed__image"
    />
  </div>

  <!-- Video -->
  <div v-else-if="video" class="bsky-embed__video-wrap">
    <video
      :src="video.playlist"
      :poster="video.thumbnail"
      controls
      class="bsky-embed__video"
      :style="`aspect-ratio: ${video.aspectRatio?.width} / ${video.aspectRatio?.height}`"
    ></video>
  </div>

  <!-- External link / GIF -->
  <a v-else-if="external" :href="external.uri" target="_blank" rel="noopener noreferrer" class="bsky-embed__external">
    <video v-if="isVideo" :src="external.uri" :poster="external.thumb || undefined" autoplay muted loop playsinline class="bsky-embed__gif"></video>
    <img v-else-if="isMediaOnly" :src="external.uri" :alt="external.description?.replace('Alt: ', '') || ''" class="bsky-embed__gif-img" />
    <template v-else>
      <img v-if="external.thumb" :src="external.thumb" alt="" class="bsky-embed__link-thumb" />
      <div class="bsky-embed__link-body">
        <div class="bsky-embed__link-title">{{ external.title }}</div>
        <div v-if="external.description" class="bsky-embed__link-desc">{{ external.description }}</div>
        <div class="bsky-embed__link-url">
          <svg class="bsky-embed__link-icon" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5"/>
            <ellipse cx="8" cy="8" rx="2.75" ry="6.5"/>
            <line x1="1.5" y1="8" x2="14.5" y2="8"/>
          </svg>
          <div>{{ externalHostname }}</div>
        </div>
      </div>
    </template>
  </a>

  <!-- Quoted post -->
  <blockquote v-else-if="quotedRecord && quotedRecord.$type === 'app.bsky.embed.record#viewRecord'" class="bsky-embed__quote">
    <div class="bsky-embed__quote-header">
      <img v-if="quotedRecord.author?.avatar" :src="quotedRecord.author.avatar" :alt="quotedRecord.author.displayName || quotedRecord.author.handle" class="bsky-embed__quote-avatar" />
      <div class="bsky-embed__quote-author-info">
        <strong class="bsky-embed__quote-display-name">{{ quotedRecord.author?.displayName || quotedRecord.author?.handle }}</strong>
        <span v-if="quotedRecord.author?.displayName" class="bsky-embed__quote-handle">@{{ quotedRecord.author.handle }}</span>
      </div>
    </div>
    <p class="bsky-embed__quote-text">{{ quotedRecord.value?.text }}</p>
    <div v-if="quotedRecord.embeds?.length" class="bsky-embed__quote-embeds">
      <BlueskyEmbed v-for="(e, i) in quotedRecord.embeds" :key="i" :embed="e" />
    </div>
  </blockquote>

  <!-- Record with media: show media then quoted post -->
  <div v-else-if="rwmMedia || rwmRecord" class="bsky-embed__rwm">
    <BlueskyEmbed v-if="rwmMedia" :embed="rwmMedia" />
    <blockquote v-if="rwmRecord && rwmRecord.$type === 'app.bsky.embed.record#viewRecord'" class="bsky-embed__quote">
      <div class="bsky-embed__quote-header">
        <img v-if="rwmRecord.author?.avatar" :src="rwmRecord.author.avatar" :alt="rwmRecord.author.displayName || rwmRecord.author.handle" class="bsky-embed__quote-avatar" />
        <div class="bsky-embed__quote-author-info">
          <strong class="bsky-embed__quote-display-name">{{ rwmRecord.author?.displayName || rwmRecord.author?.handle }}</strong>
          <span v-if="rwmRecord.author?.displayName" class="bsky-embed__quote-handle">@{{ rwmRecord.author.handle }}</span>
        </div>
      </div>
      <p class="bsky-embed__quote-text">{{ rwmRecord.value?.text }}</p>
      <div v-if="rwmRecord.embeds?.length" class="bsky-embed__quote-embeds">
        <BlueskyEmbed v-for="(e, i) in rwmRecord.embeds" :key="i" :embed="e" />
      </div>
    </blockquote>
  </div>
</template>

<style scoped>
.bsky-embed__images {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #d0d7de;
}

.bsky-embed__image {
  width: 100%;
  display: block;
  color: transparent;
}

.bsky-embed__video-wrap {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #d0d7de;
}

.bsky-embed__video {
  width: 100%;
  display: block;
  background: #000;
}

.bsky-embed__external {
  display: block;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.bsky-embed__external:hover {
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.bsky-embed__gif-img {
  width: 100%;
  display: block;
  border-radius: 6px;
  color: transparent;
}

.bsky-embed__link-thumb {
  width: 100%;
  display: block;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid #d0d7de;
  color: transparent;
}

.bsky-embed__link-body {
  padding: 0.5rem 0.75rem 0.625rem;
  background: #f6f8fa;
  border-radius: 0 0 6px 6px;
}

.bsky-embed__link-title {
  font-weight: 600;
  color: #1f2328;
  font-size: 0.875rem;
  line-height: 1.4;
}

.bsky-embed__link-desc {
  color: #636c76;
  font-size: 0.75rem;
  line-height: 1.5;
  margin-top: 0.125rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bsky-embed__link-url {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #636c76;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.bsky-embed__link-icon {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  flex-shrink: 0;
}


.bsky-embed__quote {
  margin: 0;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #f6f8fa;
  font-size: 0.8125rem;
  line-height: 1.5;
  overflow: hidden;
  min-width: 0;
}

.bsky-embed__quote-header {
  display: grid;
	grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.bsky-embed__quote-avatar {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.bsky-embed__quote-author-info {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  min-width: 0;
}

.bsky-embed__quote-display-name {
  color: #1f2328;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.bsky-embed__quote-handle {
  color: #636c76;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.bsky-embed__quote-text {
  color: #1f2328;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.bsky-embed__quote-embeds {
  margin-top: 0.5rem;
}

.bsky-embed__rwm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
