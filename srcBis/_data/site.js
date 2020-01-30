const environment = process.env.ELEVENTY_ENV ? process.env.ELEVENTY_ENV : "production";

const url = require("../_functions/getUrl");
const authors = require("./authors")

module.exports = {
  title: "Sylvain METAYER",
  description: "Développeur web sur Bordeaux",
  url: url(),
  baseUrl: "/",
  buildTime: new Date(),
  environment: environment,
  author: () => {
    return authors.sylvainmetayer;
  }
};
