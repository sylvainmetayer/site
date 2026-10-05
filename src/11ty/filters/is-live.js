export default function isLive() {
  const now = new Date();
  return post => post.date <= now && !post.data.draft;
}
