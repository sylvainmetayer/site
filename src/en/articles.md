---
title: 'All articles'
layout: 'layouts/posts.njk'
translationKey: articles
pagination:
  data: collections.postsAllEn
  size: 30
  alias: postListItems
permalink: "/en/articles/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}"
---
Some of the articles are translated into English, the others are in French.
