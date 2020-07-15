module.exports = (post) => {
  const now = new Date();
  return post => post.date <= now && !post.data.draft
};
