---
title: 'Tous les articles'
layout: 'layouts/posts.njk'
pagination:
  data: collections.posts
  size: 30
  alias: postListItems
translationKey: articles
permalink: "/articles/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}"
metaDesc: "Tous les articles de Sylvain MÉTAYER sur le développement backend, le DevOps, l'infrastructure et les conférences."
---
