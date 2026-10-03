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
      root.setAttribute('data-theme', value);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  apply(read());

  document.addEventListener('DOMContentLoaded', function () {
    var group = document.querySelector('[data-theme-switch]');
    if (!group) return;

    var buttons = group.querySelectorAll('button[data-theme-value]');

    function sync(value) {
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.themeValue === (value || 'auto')));
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.dataset.themeValue === 'auto' ? null : button.dataset.themeValue;
        try {
          if (value) localStorage.setItem(STORAGE_KEY, value);
          else localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        apply(value);
        sync(value);
      });
    });

    sync(read());
    group.hidden = false;
  });
})();
