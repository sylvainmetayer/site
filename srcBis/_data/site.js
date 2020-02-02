const url = require("../_functions/getUrl");
const authors = require("./authors")

const productionUrl = "https://sylvainmetayer.fr";

module.exports = {
  title: "Sylvain METAYER",
  description: "Développeur web sur Bordeaux",
  url: url(),
  baseUrl: "/",
  buildTime: new Date(),
  environment: url() === productionUrl ? "production" : "dev",
  productionUrl: productionUrl,
  author: () => {
    return authors.sylvainmetayer;
  }
};
