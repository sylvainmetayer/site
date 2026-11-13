---
title: POSSE
permalink: /en/posse/
layout: layouts/page.njk
translationKey: posse
updated: 2026-11-13
metaDesc: "How the articles of sylvain.dev are published here first, then relayed to Mastodon, Bluesky and dev.to."
---

[POSSE](https://indieweb.org/POSSE): publish on your own site first, syndicate elsewhere afterwards. What I write lives here, and the networks only get a link or a copy.

- **Mastodon and Bluesky**: every day, [a script](https://github.com/sylvainmetayer/site/blob/main/scripts/syndicate.mjs) posts the new articles in French to [Mastodon](https://bdx.town/@sylvain) and [Bluesky](https://bsky.app/profile/sylvain.dev), once each.
- **Comments**: the replies to these posts are shown under the article, next to the [webmentions](https://indieweb.org/Webmention) received.
- **Outgoing webmentions**: the same script notifies every external page quoted by a new article.
- **dev.to**: the articles I pick are republished there from [a dedicated RSS feed](/devto.rss.xml).
- **RSS feeds**: to follow without a social network, it is [this way](/en/feeds/).
