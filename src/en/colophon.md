---
title: Colophon
permalink: /en/colophon/
layout: layouts/page.njk
translationKey: colophon
metaDesc: "How sylvain.dev is built: Eleventy, Cloudflare Pages, GitHub Actions, and the choices behind them."
---

How this site is made, and why. The source is [on GitHub](https://github.com/sylvainmetayer/site).

## Building

- **[Eleventy](https://www.11ty.dev/)** {{ global.eleventyVersion }} turns Markdown and Nunjucks templates into static pages.
- **Plain CSS**, with no framework or preprocessor, inlined in every page: no render-blocking request.
- **Fonts**: [IBM Plex Sans](https://www.ibm.com/plex/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/), served from the site itself.
- **Images** are optimised at build time into AVIF and WebP by [eleventy-img](https://www.11ty.dev/docs/plugins/image/).
- Very little JavaScript, and the site works without it: light/dark theme, search palette (<kbd>Ctrl</kbd>+<kbd>K</kbd>), "copy" button on code, offline page through a service worker.

## Hosting and publishing

- **[Cloudflare Pages](https://pages.cloudflare.com/)** builds and serves the site on every push to `main`, with a preview for each branch.
- A **daily build** brings in new [webmentions](https://indieweb.org/Webmention) (received by [webmention.io](https://webmention.io/)) and keeps the age shown on articles current.
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** lets me write from the browser: it commits straight to the repository.
- Audience measurement by **Cloudflare Web Analytics**, without cookies.

## Checks

Every push goes through [GitHub Actions](https://github.com/sylvainmetayer/site/actions): HTML validation, WCAG 2 AA accessibility ([pa11y](https://pa11y.org/)), internal links and redirects, [SonarCloud](https://sonarcloud.io/) and CodeQL analysis. External links are checked every week with [lychee](https://lychee.cli.rs/), and [Renovate](https://docs.renovatebot.com/) keeps the dependencies up to date.

The [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) allows no third-party script, apart from audience measurement.

## 88x31 button

To link to this site the old-school way, with an 88 × 31 pixel button:

![sylvain.dev button, 88 × 31 pixels](/images/88x31.png)

```html
<a href="https://www.sylvain.dev/"><img src="https://www.sylvain.dev/images/88x31.png" width="88" height="31" alt="sylvain.dev"></a>
```
