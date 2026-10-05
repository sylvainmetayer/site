// Loaded synchronously in <head> so the stored theme applies before first paint.
// Without JavaScript the site follows the system preference.
(function () {
  var STORAGE_KEY = 'user-color-scheme';
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(value) {
    if (value === 'light' || value === 'dark') {
      root.dataset.theme = value;
    } else {
      delete root.dataset.theme;
    }
  }

  apply(read());

  function sync(value) {
    document.querySelectorAll('[data-theme-switch] button[data-theme-value]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.themeValue === (value || 'auto')));
    });
  }

  // 'dark', 'light' or 'auto': stores the choice, applies it and updates the header switch
  function set(choice) {
    var value = choice === 'light' || choice === 'dark' ? choice : null;
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    apply(value);
    sync(value);
  }

  // Used by the Ctrl+K palette (palette.js)
  window.siteTheme = { set: set };

  document.addEventListener('DOMContentLoaded', function () {
    var group = document.querySelector('[data-theme-switch]');
    if (!group) return;

    group.querySelectorAll('button[data-theme-value]').forEach(function (button) {
      button.addEventListener('click', function () {
        set(button.dataset.themeValue);
      });
    });

    sync(read());
    group.hidden = false;
  });
})();
