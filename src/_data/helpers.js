export default {
  getNextHeadingLevel(currentLevel) {
    return parseInt(currentLevel, 10) + 1;
  },
  getReadingTime(text) {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  },
  url() {
    // TODO Nunjucks configure access to process.env
    if (typeof process === 'undefined') {
      return "http://localhost:8080";
    }

    // Canonical host: Cloudflare Pages serves www, the apex redirects to it
    if (process.env.ELEVENTY_ENV === "production") {
      return "https://www.sylvain.dev";
    }

    // Cloudflare Pages preview URL (<hash>.<project>.pages.dev)
    if (process.env.CF_PAGES_URL) {
      return process.env.CF_PAGES_URL;
    }

    return "http://localhost:8080";
  },
};
