---
title: Sous le capot
permalink: /sous-le-capot/
layout: layouts/page.njk
translationKey: under-the-hood
metaDesc: "Comment sylvain.dev est construit : Eleventy, Cloudflare Pages, GitHub Actions, et les choix derrière."
---

Comment ce site est fait, et pourquoi. Les sources sont [sur GitHub](https://github.com/sylvainmetayer/site).

## Construction

- **[Eleventy](https://www.11ty.dev/)** {{ global.eleventyVersion }} génère des pages statiques à partir de Markdown et de gabarits Nunjucks.
- **CSS natif**, sans framework ni préprocesseur, injecté dans chaque page : pas de requête bloquante.
- **Polices** [IBM Plex Sans](https://www.ibm.com/plex/) et [JetBrains Mono](https://www.jetbrains.com/lp/mono/), servies depuis le site.
- **Images** optimisées au build en AVIF et WebP par [eleventy-img](https://www.11ty.dev/docs/plugins/image/).
- Très peu de JavaScript, et le site fonctionne sans : thème clair/sombre, palette de recherche (<kbd>Ctrl</kbd>+<kbd>K</kbd>), bouton « copier » sur le code, page hors ligne via un service worker.

## Hébergement et publication

- **[Cloudflare Pages](https://pages.cloudflare.com/)** construit et sert le site à chaque push sur `main`, avec une préversion pour chaque branche.
- Un **build quotidien** ramène les nouvelles [webmentions](https://indieweb.org/Webmention) (reçues par [webmention.io](https://webmention.io/)) et tient à jour l'âge affiché des articles.
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** permet d'écrire depuis le navigateur : il commite directement dans le dépôt.
- Mesure d'audience par **Cloudflare Web Analytics**, sans cookie.

## Contrôles

Chaque push passe par [GitHub Actions](https://github.com/sylvainmetayer/site/actions) : validation HTML, accessibilité [WCAG 2](https://www.w3.org/TR/WCAG22/) AA ([pa11y](https://pa11y.org/)), liens internes et redirections, analyse [SonarCloud](https://sonarcloud.io/) et CodeQL. Les liens externes sont vérifiés chaque semaine avec [lychee](https://lychee.cli.rs/), et [Renovate](https://docs.renovatebot.com/) tient les dépendances à jour.

La [politique de sécurité du contenu](https://developer.mozilla.org/fr/docs/Web/HTTP/CSP) n'autorise aucun script tiers, à part la mesure d'audience. Celle-ci est chargée sans contrôle d'intégrité ([SRI](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity)) : Cloudflare met le script à jour sans changer son adresse, une empreinte figée le bloquerait.
