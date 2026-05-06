const REPO = 'arkmuntasser.com';
const BASE_URL = 'https://bsky.social/xrpc/com.atproto.repo.listRecords';

export async function fetchReviews(limit = 6) {
  const res = await fetch(
    `${BASE_URL}?repo=${REPO}&collection=social.popfeed.feed.review&limit=${limit}&reverse=false`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.records;
}
