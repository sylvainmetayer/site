---
title: 'Tous les articles'
layout: 'layouts/posts.njk'
pagination:
  data: collections.posts
  size: 30
  alias: postListItems
permalink: "/articles/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}"
---
