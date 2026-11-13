---
title: Slashes
permalink: /slashes/
layout: layouts/page.njk
translationKey: slashes
metaDesc: "Les slash pages de sylvain.dev : now, uses, colophon, blogroll, liens, concerts et les autres."
---

Les [slash pages](https://slashpages.net/) de ce site : des pages à l'adresse convenue, que l'on retrouve d'un site personnel à l'autre.

- [/ai](/ai/) : comment j'utilise l'IA.
- [/blank](/blank/) : une page laissée blanche.
{% if freshrss -%}
- [/blogroll](/blogroll/) : les sites que je suis.
{% endif -%}
- [/changelog](/changelog/) : les grands changements du site.
- [/colophon](/sous-le-capot/) : comment ce site est fait.
{% if setlistfm.length -%}
- [/concerts](/concerts/) : les concerts auxquels j'ai assisté.
{% endif -%}
- [/contact](/carte/) : ma carte de visite, mes profils et mon e-mail.
- [/death](/death/) : mes consignes en cas de décès (en cours de rédaction).
- [/defaults](/defaults/) : mes applications par défaut.
- [/domains](/domains/) : mes noms de domaine.
- [/elsewhere](/elsewhere/) : ce que je publie ailleurs.
- [/feeds](/flux/) : les flux RSS du site.
- [/glossary](/glossaire/) : les sigles employés ici.
- [/green](/green/) : l'empreinte de ce site.
- [/interests](/interests/) : ce qui m'occupe en dehors du travail.
- [/languages](/languages/) : les langues que je parle.
{% if links.links.length or karakeep.length -%}
- [/links](/liens/) : ce que j'ai lu, vu ou utilisé et qui vaut le détour.
{% endif -%}
- [/now](/now/) : ce que je fais en ce moment.
- [/pfp](/pfp/) : mes photos de profil au fil des années.
- [/posse](/posse/) : publier ici d'abord, relayer ensuite.
- [/save](https://ref.sylvain.dev/) : mes liens de parrainage.
- [/self-hosting](/uses/#homelab) : les services que j'héberge moi-même.
- [/since](/since/) : depuis combien de temps.
- [/sitemap](/plan/) : toutes les pages du site.
{% if collections.notes.length -%}
- [/til](/notes/) : des notes courtes, ce que j'apprends au fil des jours.
{% endif -%}
- [/uses](/uses/) : le matériel et les logiciels que j'utilise.
- [/verify](/verify/) : mes comptes en ligne, et comment les vérifier.
- [/where](/where/) : où je suis.
- [/why](/why/) : pourquoi ce site existe.

Les noms anglais d'usage redirigent vers la page : [/colophon](/colophon), [/feeds](/feeds), [/sitemap](/sitemap)…
