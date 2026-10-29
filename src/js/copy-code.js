// "Copy" button on the code blocks of an article. The labels come from the
// attributes of this script tag (layouts/post.njk), in the language of the page.
// Without the Clipboard API (http, old browser) the blocks stay as they are.
(function () {
  var script = document.currentScript;
  if (!script || !navigator.clipboard) return;

  var label = script.dataset.label;
  var copied = script.dataset.copied;

  document.querySelectorAll('.prose pre').forEach(function (pre) {
    // The button sits outside <pre>, which scrolls horizontally
    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = label;
    // Screen readers announce the change to "copied"
    button.setAttribute('aria-live', 'polite');
    wrapper.appendChild(button);

    var timer;
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.innerText).then(function () {
        button.textContent = copied;
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.textContent = label;
        }, 2000);
      }).catch(function () {
        // Permission denied or page not focused: the text stays selectable by hand
      });
    });
  });
})();
