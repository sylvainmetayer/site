---
title: RSS feeds
permalink: /en/feeds/
layout: layouts/page.njk
translationKey: feeds
metaDesc: "Follow Sylvain MÉTAYER's articles with an RSS feed reader."
---

An RSS feed lets you follow new articles without relying on a social network or a newsletter: copy its address into a feed reader ([Feedly](https://feedly.com/), [Inoreader](https://www.inoreader.com/), [NetNewsWire](https://netnewswire.com/), [Miniflux](https://miniflux.app/)…), which then shows every new article.

- **Articles translated into English**: `{{ helpers.url() }}/en/feed.xml` ([open](/en/feed.xml))
- **All articles, in French**: `{{ helpers.url() }}/feed.xml` ([open](/feed.xml))
{%- if collections.notes.length %}
- **Short notes, in French**: `{{ helpers.url() }}/notes/feed.xml` ([open](/notes/feed.xml))
{%- endif %}

The feeds contain the full text of the articles.
