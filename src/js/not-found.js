// On the 404 page only: the address becomes /404/<requested path> before the
// Cloudflare Web Analytics beacon runs (deferred), so broken links show up in
// the analytics as /404/… pages. The page itself does not change.
(function () {
  if (location.pathname.indexOf('/404/') === 0) return;
  history.replaceState(null, '', '/404' + location.pathname + location.search + location.hash);
})();
