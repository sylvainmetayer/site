// pa11y-ci (npm run check:a11y) brings Puppeteer, whose install script would
// download a full Chrome on every `npm ci`, Cloudflare Pages builds included.
// The checks use the system browser instead: PUPPETEER_EXECUTABLE_PATH
// (CI: google-chrome, locally chromium-browser for instance).
module.exports = {
  skipDownload: true,
};
