const isLive = post => {
  const now = new Date();
  return !post.draft && post.date && new Date(post.date) <= now;
};

export default {
  eleventyComputed: {
    // Unpublished posts get no page in production (permalink false)
    permalink: data => {
      const publish = process.env.ELEVENTY_ENV !== "production" || isLive(data);
      return publish && "/article/{{ page.fileSlug }}/";
    },
    eleventyExcludeFromCollections: data => {
      if (process.env.ELEVENTY_ENV !== "production") return false;
      return !isLive(data);
    }
  }
};
