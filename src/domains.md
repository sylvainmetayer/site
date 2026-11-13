---
title: Domaines
permalink: /domains/
layout: layouts/page.njk
translationKey: domains
metaDesc: "Les noms de domaine de Sylvain MÉTAYER et ce à quoi ils servent."
---

Les noms de domaine que je possède.

- **sylvain.dev** : ce site, et quelques sous-domaines :
  - [ref.sylvain.dev](https://ref.sylvain.dev/), mes liens de parrainage ;
  - r.sylvain.dev, des liens courts ;
  - [betisier.sylvain.dev](https://betisier.sylvain.dev/), un projet d'études de DUT, que je garde en ligne pour le souvenir ;
  - un sous-domaine en `talks.sylvain.dev` par [talk](/talks/), pour les slides de chaque conférence :
{%- for talk in talks.talks %}
{%- set shown = false %}
{%- for session in talk.sessions %}
{%- if session.slides and '.talks.sylvain.dev' in session.slides %}
{%- if not shown %}{% set shown = true %}
    - **{{ session.slides | replace('https://', '') | truncate(session.slides.indexOf('.dev') - 4, true, '') }}** ({{ talk.title }}) : {% else %}, {% endif -%}
[{{ session.event }} {{ session.date | truncate(4, true, '') }}]({{ session.slides }})
{%- endif %}
{%- endfor %}
{%- endfor %}
- **sylvain.cloud** : mon homelab et les services que j'héberge.
- **sylvainmetayer.fr** : mon premier nom de domaine, que je garde pour l'historique. [memoire.epsi.sylvainmetayer.fr](https://memoire.epsi.sylvainmetayer.fr/) redirige encore vers mon mémoire de fin d'études.
