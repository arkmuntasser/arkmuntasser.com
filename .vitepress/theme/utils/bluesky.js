const ACTOR = 'arkmuntasser.com';
const BASE_URL = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed';

export async function fetchAuthorPosts(limit = 12) {
  const res = await fetch(`${BASE_URL}?actor=${ACTOR}&limit=${limit * 2}&filter=posts_no_replies`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.feed
    .filter((item) => !item.reason && !item.post.record.reply)
    .slice(0, limit)
    .map((item) => item.post);
}
