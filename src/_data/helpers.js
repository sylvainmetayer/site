module.exports = {
  url() {
    // TODO Nunjucks configure access to process.env
    if (typeof process === 'undefined') {
      return "http://localhost:8080";
    }

    if (process.env.ELEVENTY_ENV === "production") {
      return "https://sylvain.dev";
    }

    // Netlify deploy URL
    if (process.env.DEPLOY_PRIME_URL) {
      return process.env.DEPLOY_PRIME_URL;
    }

    return "http://localhost:8080";
  },
};
