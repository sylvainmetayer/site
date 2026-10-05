// Shows the banner offering the translation of the page (partials/lang-suggest.njk)
// when the browser prefers its language to the language of the page. Closing it,
// or following it, stores the choice: the banner does not come back.
(function () {
  var banner = document.querySelector('[data-lang-suggest]');
  if (!banner) return;

  var STORAGE_KEY = 'lang-suggest-dismissed';
  var offered = banner.dataset.langSuggest;
  var current = document.documentElement.lang;

  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    // Storage blocked: the banner may come back, which is acceptable
  }

  // First of the browser languages that the site has: offer only if it is the other one
  var preferred = (navigator.languages || [navigator.language || ''])
    .map(function (language) { return String(language).slice(0, 2).toLowerCase(); })
    .find(function (language) { return language === offered || language === current; });
  if (preferred !== offered) return;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      // Ignored, see above
    }
  }

  banner.querySelector('[data-lang-suggest-close]').addEventListener('click', function () {
    dismiss();
    banner.hidden = true;
  });
  banner.querySelector('a').addEventListener('click', dismiss);
  banner.hidden = false;
})();
