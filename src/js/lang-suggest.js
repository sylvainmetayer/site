// Language hints, for visitors whose browser prefers the other language:
// - the banner offering the translation of the page (partials/lang-suggest.njk).
//   Closing it stores the choice and it does not come back; following it does not,
//   so the next visit to another page still gets the offer;
// - on a French article without translation, the notice saying so in English
//   (layouts/post.njk), also shown when coming from the English pages.
(function () {
  var STORAGE_KEY = 'lang-suggest-dismissed';
  var current = document.documentElement.lang;

  // First of the browser languages that the site has
  function preferredLanguage(offered) {
    return (navigator.languages || [navigator.language || ''])
      .map(function (language) { return String(language).slice(0, 2).toLowerCase(); })
      .find(function (language) { return language === offered || language === current; });
  }

  function comesFromEnglishPages() {
    try {
      var referrer = new URL(document.referrer);
      return referrer.origin === location.origin && referrer.pathname.startsWith('/en/');
    } catch (e) {
      // No referrer (direct visit, Referrer-Policy): not from the English pages
      return false;
    }
  }

  var untranslated = document.querySelector('[data-untranslated]');
  if (untranslated) {
    var reader = untranslated.dataset.untranslated;
    if (preferredLanguage(reader) === reader || comesFromEnglishPages()) untranslated.hidden = false;
  }

  var banner = document.querySelector('[data-lang-suggest]');
  if (!banner) return;

  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    // Storage blocked: the banner may come back, which is acceptable
  }

  var offered = banner.dataset.langSuggest;
  if (preferredLanguage(offered) !== offered) return;

  banner.querySelector('[data-lang-suggest-close]').addEventListener('click', function () {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      // Ignored, see above
    }
    banner.hidden = true;
  });
  banner.hidden = false;
})();
