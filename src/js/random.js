// /hasard/: opens one of the listed articles, picked at random. replace(): the
// back button returns to the page the reader came from, not to /hasard/.
(function () {
  var links = document.querySelectorAll('[data-random] a');
  if (!links.length) return;
  location.replace(links[Math.floor(Math.random() * links.length)].href);
})();
