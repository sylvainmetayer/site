// /hasard/: opens one of the listed articles, picked at random, other than the
// one the reader comes from. replace(): the back button returns to the page the
// reader came from, not to /hasard/.
(function () {
  var links = Array.prototype.filter.call(document.querySelectorAll('[data-random] a'), function (link) {
    return link.href !== document.referrer;
  });
  if (!links.length) return;
  location.replace(links[Math.floor(Math.random() * links.length)].href);
})();
