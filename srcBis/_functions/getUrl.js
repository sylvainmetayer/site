module.exports = () => {
  if (process.env.ELEVENTY_ENV === "production") {
    return "https://sylvainmetayer.fr";
  }

  if( process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL
  }

  // TODO Netlify preview deploy

  return "http://localhost:8080";
}
