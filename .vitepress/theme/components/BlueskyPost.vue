<script setup>
import BlueskyEmbed from './BlueskyEmbed.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const rkey = props.post.uri.split('/').pop();
const url = `https://bsky.app/profile/${props.post.author.handle}/post/${rkey}`;
const date = new Date(props.post.record.createdAt).toLocaleDateString();
</script>

<template>
  <li>
    <a :href="url" target="_blank" rel="noopener noreferrer">{{ post.record.text }}</a>
    <span> — {{ date }}</span>
    <BlueskyEmbed v-if="post.embed" :embed="post.embed" />
  </li>
</template>
