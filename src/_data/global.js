module.exports = {
  url() {
    // Netlify deploy URL
    if (process.env.DEPLOY_PRIME_URL) {
      return process.env.DEPLOY_PRIME_URL;
    }

    if (process.env.ELEVENTY_ENV === "production") {
      return "https://sylvain.dev";
    }

    return "http://localhost:8080";
  },
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${segment()}-${segment()}-${segment()}`;
  },
  now: Date.now(),
  environment: process.env.ELEVENTY_ENV ? process.env.ELEVENTY_ENV : 'production'
};
