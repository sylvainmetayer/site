---
title: JSDOM réécrit les entités HTML en clair
date: 2026-10-28
draft: true
---

Pour cacher une adresse e-mail aux robots, je l'encodais en entités HTML (`&#98;&#111;…`) dans les gabarits. Dans le HTML généré, elle était pourtant en clair.

La faute à la transform du site, qui passe chaque page dans [JSDOM](https://github.com/jsdom/jsdom) pour optimiser les images : au moment de resérialiser le document, JSDOM n'échappe que `&`, `<`, `>`, `"` et l'espace insécable. Toutes les autres entités redeviennent des caractères.

La solution : encoder **après** `outerHTML`, sur la chaîne finale.
