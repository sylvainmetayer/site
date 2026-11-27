---
title: Empreinte
permalink: /green/
layout: layouts/page.njk
translationKey: green
metaDesc: "L'empreinte carbone de sylvain.dev et les choix qui la gardent basse."
---

Ce que ce site fait pour peser le moins possible, dans l'esprit des [pages /green](https://slashpages.net/#green).

{% if carbon -%}
Une visite de la page d'accueil émet environ **{{ carbon }}** de CO₂, d'après le modèle [Sustainable Web Design](https://sustainablewebdesign.org/estimating-digital-emissions/) de la Green Web Foundation ([CO2.js](https://www.thegreenwebfoundation.org/co2-js/)). La mesure est refaite chaque matin sur le site en production.

{% endif -%}
- **Pages statiques** : rien n'est calculé à la visite, tout est généré une fois au build.
- **Très peu de JavaScript**, aucun framework, et le site fonctionne sans.
- **CSS natif**, injecté dans la page : pas de requête supplémentaire.
- **Images** converties en AVIF et WebP, aux dimensions affichées.
- **Polices** servies depuis le site, sans appel à un tiers.
- **Aucun traceur ni script tiers**, à part une mesure d'audience sans cookie.

Le site fait partie de deux clubs :

<p class="badges"><a href="https://512kb.club/"><img src="/images/badges/512kb-club-orange.svg" alt="512KB Club, équipe orange" width="247" height="30"></a> <a href="https://darktheme.club/"><img src="/images/badges/darktheme-club.webp" alt="Darktheme Club" width="88" height="31"></a></p>

Le détail technique est [sous le capot](/sous-le-capot/).
