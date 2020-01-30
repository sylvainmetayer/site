module.exports = () => {
  if (process.env.ELEVENTY_ENV === "production") {
    return "https://sylvainmetayer.fr";
  }

  // TODO Netlify preview deploy

  return "http://localhost:8080";
}
