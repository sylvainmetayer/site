const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const helpers = require('../../_data/helpers');

module.exports = function (value, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    const externalLinks = Array.from(document.querySelectorAll(`a:not([href^="${helpers.url()}"]):not([href^="#"]):not([href^="/"])`));
    externalLinks.forEach(item => {
      item.setAttribute("rel", "external");
      item.setAttribute("data-external", "");
    })

    return document, '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return value;
};
