---
title: Flux RSS
permalink: /flux/
layout: layouts/page.njk
translationKey: feeds
metaDesc: "S'abonner aux articles de Sylvain MÉTAYER avec un lecteur de flux RSS."
---

Un flux RSS permet de suivre les nouveaux articles sans dépendre d'un réseau social ni d'une newsletter : on copie son adresse dans un lecteur de flux ([Feedly](https://feedly.com/), [Inoreader](https://www.inoreader.com/), [NetNewsWire](https://netnewswire.com/), [Miniflux](https://miniflux.app/)…), qui affiche ensuite chaque nouvel article.

- **Articles en français** : `{{ helpers.url() }}/feed.xml` ([ouvrir](/feed.xml))
- **Articles traduits en anglais** : `{{ helpers.url() }}/en/feed.xml` ([ouvrir](/en/feed.xml))
{%- if collections.notes.length %}
- **Notes courtes** : `{{ helpers.url() }}/notes/feed.xml` ([ouvrir](/notes/feed.xml))
{%- endif %}

Les flux contiennent le texte complet des articles.
