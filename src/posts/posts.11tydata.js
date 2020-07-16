const isLive = post => {
  const now = new Date();
  return !post.draft && post.date && new Date(post.date) <= now;
}

module.exports = {
  eleventyComputed: {
    permalink: data => {
      let postPermalink = "/article/{{ page.fileSlug }}/";

      if (process.env.ELEVENTY_ENV !== "production") return postPermalink;
      return isLive(data) ? postPermalink : false;
    },
    eleventyExcludeFromCollections: data => {
      if (process.env.ELEVENTY_ENV !== "production") return false;
      return !isLive(data);
    }
  }
};
