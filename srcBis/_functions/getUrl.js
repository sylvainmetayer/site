module.exports = () => {
  // Netlify deploy URL
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL
  }

  if (process.env.ELEVENTY_ENV === "production") {
    return "https://sylvainmetayer.fr";
  }

  return "http://localhost:8080";
}
