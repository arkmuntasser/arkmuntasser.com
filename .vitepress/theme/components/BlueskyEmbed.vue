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
</script>

<template>
  <!-- Images -->
  <div v-if="images">
    <img
      v-for="img in images"
      :key="img.fullsize"
      :src="img.thumb"
      :alt="img.alt || ''"
    />
  </div>

  <!-- Video -->
  <div v-else-if="video">
    <video
      :src="video.playlist"
      :poster="video.thumbnail"
      controls
      :style="`aspect-ratio: ${video.aspectRatio?.width} / ${video.aspectRatio?.height}`"
    ></video>
  </div>

  <!-- External link / GIF -->
  <div v-else-if="external">
    <a :href="external.uri" target="_blank" rel="noopener noreferrer">
      <img v-if="external.thumb" :src="external.thumb" :alt="external.title || ''" />
      <div>{{ external.title }}</div>
      <div v-if="external.description">{{ external.description }}</div>
    </a>
  </div>

  <!-- Quoted post -->
  <blockquote v-else-if="quotedRecord && quotedRecord.$type === 'app.bsky.embed.record#viewRecord'">
    <strong>{{ quotedRecord.author?.displayName || quotedRecord.author?.handle }}</strong>
    <p>{{ quotedRecord.value?.text }}</p>
    <div v-if="quotedRecord.embeds?.length">
      <BlueskyEmbed v-for="(e, i) in quotedRecord.embeds" :key="i" :embed="e" />
    </div>
  </blockquote>

  <!-- Record with media: show media then quoted post -->
  <div v-else-if="rwmMedia || rwmRecord">
    <BlueskyEmbed v-if="rwmMedia" :embed="rwmMedia" />
    <blockquote v-if="rwmRecord && rwmRecord.$type === 'app.bsky.embed.record#viewRecord'">
      <strong>{{ rwmRecord.author?.displayName || rwmRecord.author?.handle }}</strong>
      <p>{{ rwmRecord.value?.text }}</p>
      <div v-if="rwmRecord.embeds?.length">
        <BlueskyEmbed v-for="(e, i) in rwmRecord.embeds" :key="i" :embed="e" />
      </div>
    </blockquote>
  </div>
</template>
