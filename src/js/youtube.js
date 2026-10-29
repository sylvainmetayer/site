// Light YouTube embeds ({% youtube %}, 11ty/shortcodes/youtube.js): the
// thumbnail link becomes the player only when it is clicked.
(function () {
  document.querySelectorAll('[data-youtube]').forEach(function (embed) {
    var link = embed.querySelector('a');
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + embed.dataset.youtube + '?autoplay=1';
      iframe.title = embed.dataset.title;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      embed.replaceChildren(iframe);
      iframe.focus();
    });
  });
})();
