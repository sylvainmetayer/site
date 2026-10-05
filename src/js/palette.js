// Ctrl+K / ⌘K palette: jump to a page, an article, a talk, a project or a tag, or switch theme.
// The index (/search.json, /en/search.json) is built by src/_includes/layouts/search-index.njk
// and fetched on first opening. Its URL and the status messages come from the dialog
// (partials/palette.njk), in the language of the page.
(function () {
  var dialog = document.querySelector('[data-palette]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var input = dialog.querySelector('.palette-input');
  var list = dialog.querySelector('.palette-list');
  var status = dialog.querySelector('.palette-status');
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var MAX_RESULTS = 40;
  var text = dialog.dataset;

  // "{count} results": the .one or .other message of the dialog
  function format(message, values) {
    return message.replace(/\{(\w+)\}/g, function (match, name) {
      return name in values ? values[name] : match;
    });
  }

  var entries = null;
  var results = [];
  var active = 0;

  function normalize(text) {
    return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function load() {
    if (entries) return Promise.resolve(entries);
    return fetch(text.index)
      .then(function (response) {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then(function (data) {
        entries = data.map(function (entry, index) {
          entry.index = index;
          entry.title = normalize(entry.t);
          entry.haystack = normalize([entry.t, entry.s, entry.d, entry.k].join(' '));
          return entry;
        });
        return entries;
      });
  }

  // Without a query: pages, the latest articles and actions.
  // Otherwise every word must match; title prefixes, then word starts in titles, rank first.
  function search(query) {
    var words = normalize(query).split(/\s+/).filter(Boolean);
    if (!words.length) {
      var articles = 0;
      return entries.filter(function (entry) {
        if (entry.k === 'article') return ++articles <= 6;
        return entry.k === 'page' || entry.k === 'action';
      });
    }
    return entries
      .map(function (entry) {
        var score = 0;
        for (var word of words) {
          if (!entry.haystack.includes(word)) return null;
          if (entry.title.startsWith(word)) score += 4;
          else if (new RegExp('(^|[^a-z0-9])' + word.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)).test(entry.title)) score += 2;
          else if (entry.title.includes(word)) score += 1;
        }
        return { entry: entry, score: score };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.score - a.score || a.entry.index - b.entry.index;
      })
      .slice(0, MAX_RESULTS)
      .map(function (match) {
        return match.entry;
      });
  }

  function render() {
    results = search(input.value);
    active = 0;
    list.textContent = '';
    results.forEach(function (entry, index) {
      var option = document.createElement('li');
      option.id = 'palette-option-' + index;
      option.className = 'palette-option';
      option.setAttribute('role', 'option');

      var title = document.createElement('span');
      title.className = 'palette-option-title';
      title.textContent = entry.t;

      var meta = document.createElement('span');
      meta.className = 'palette-option-meta';
      meta.textContent = entry.d ? entry.k + ' · ' + entry.d : entry.k;

      option.append(title, meta);
      option.addEventListener('mousemove', function () {
        if (active !== index) select(index);
      });
      option.addEventListener('click', function (event) {
        go(entry, event.ctrlKey || event.metaKey);
      });
      list.appendChild(option);
    });
    select(0);
    var count = results.length === 1 ? text.countOne : text.countOther;
    status.textContent = results.length
      ? format(count, { count: results.length })
      : format(text.none, { query: input.value.trim() });
  }

  function select(index) {
    var options = list.children;
    if (!options.length) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    active = (index + options.length) % options.length;
    for (var i = 0; i < options.length; i++) {
      options[i].setAttribute('aria-selected', String(i === active));
    }
    input.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({ block: 'nearest' });
  }

  function go(entry, newTab) {
    if (entry.a?.startsWith('theme:')) {
      dialog.close();
      if (window.siteTheme) window.siteTheme.set(entry.a.slice(6));
      return;
    }
    if (newTab) {
      window.open(entry.u, '_blank', 'noopener');
      return;
    }
    dialog.close();
    window.location.href = entry.u;
  }

  function open() {
    if (dialog.open) return;
    input.value = '';
    list.textContent = '';
    status.textContent = 'Chargement…';
    dialog.showModal();
    input.focus();
    load().then(render, function () {
      status.textContent = text.unavailable;
    });
  }

  input.addEventListener('input', function () {
    if (entries) render();
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(active + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      var newTab = event.ctrlKey || event.metaKey;
      // Typed before the index arrived: wait for it, then take the first result
      if (!entries) {
        load().then(function () {
          render();
          if (results[0]) go(results[0], newTab);
        }, function () {
          status.textContent = text.unavailable;
        });
        return;
      }
      if (results[active]) go(results[active], newTab);
    }
  });

  // A click on the backdrop lands on the <dialog> itself, outside .palette-box
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });

  document.querySelectorAll('[data-palette-open]').forEach(function (button) {
    // Tooltip of the icon: the shortcut of this platform
    if (isMac) button.title = button.title.replace('ctrl k', '⌘K');
    button.addEventListener('click', open);
    button.hidden = false;
  });
})();
