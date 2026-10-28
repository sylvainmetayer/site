// Highlights in the table of contents the section being read (aria-current).
// On wide screens the table of contents stays beside the text (site.css).
(function () {
  var links = document.querySelectorAll('.toc a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  links.forEach(function (link) {
    byId[decodeURIComponent(link.getAttribute('href').slice(1))] = link;
  });
  var headings = Array.prototype.filter.call(document.querySelectorAll('.prose h2[id], .prose h3[id]'), function (heading) {
    return byId[heading.id];
  });

  function update() {
    // The last heading above the upper quarter of the screen
    var current = headings[0];
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top < window.innerHeight / 4) current = heading;
    });
    links.forEach(function (link) {
      link.removeAttribute('aria-current');
    });
    if (current) byId[current.id].setAttribute('aria-current', 'location');
  }

  // Recomputed only when a heading crosses the viewport, not on every scroll event
  var observer = new IntersectionObserver(update);
  headings.forEach(function (heading) {
    observer.observe(heading);
  });
  update();
})();
