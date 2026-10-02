# Personal Website

[![Depfu](https://badges.depfu.com/badges/7a567e824b66dfa3193846d89c9b8e59/overview.svg)](https://depfu.com/github/sylvainmetayer/site?project_id=14116)
![Github Eleventy Build](https://github.com/sylvainmetayer/site/workflows/Eleventy%20Build/badge.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/eea326e0-9c5d-443f-a0e5-ba949add331a/deploy-status)](https://app.netlify.com/sites/wizardly-aryabhata-f4e800/deploys)

> Sylvain METAYER — [sylvain.dev](https://sylvain.dev)

Site statique généré avec [Eleventy 3](https://www.11ty.dev/), design « Prompt » : une colonne de lecture, un thème terminal discret, sombre par défaut et clair selon le système (ou via le sélecteur de l'en-tête).

## Setup

- Node.js 22 (voir `.nvmrc`)
- `npm ci`
- `npm start` : serveur de développement sur <http://localhost:8080>
- `npm run production` : build dans `dist/`
- `npm run validate` : validation HTML du build

### Docker

- `docker-compose up -d`

## Organisation

| Dossier / fichier | Contenu |
| --- | --- |
| `src/posts/` | Articles (Markdown) |
| `src/projets/` | Projets affichés sur `/projets/` et sur l'accueil (`featured: true`) |
| `src/work/` | Expériences, affichées sur `/cv/` |
| `src/_data/` | Données du site : `site.json`, `navigation.json`, `social.json`, `formations.json`, `certifications.json`, `skills.json` |
| `src/_includes/css/site.css` | Toute la feuille de style (CSS natif, injectée dans chaque page) |
| `src/_includes/layouts/` | Layouts Nunjucks |
| `src/admin/config.yml` | Configuration de Sveltia CMS |

Les polices (JetBrains Mono, IBM Plex Sans) et Sveltia CMS sont installés via npm et copiés dans `dist/` au build, pour respecter la CSP (`font-src 'self'`, `script-src 'self'`).

## Administration (Sveltia CMS)

L'admin est disponible sur `/admin/`. [Sveltia CMS](https://github.com/sveltia/sveltia-cms) remplace Netlify/Decap CMS et utilise le backend GitHub (Git Gateway n'est pas supporté).

Deux façons de se connecter :

- **Jeton d'accès** : bouton « Sign In Using Access Token », avec un fine-grained token GitHub limité au dépôt `sylvainmetayer/site` (permission *Contents: read & write*, plus *Pull requests: read & write* pour le workflow éditorial).
- **OAuth GitHub via Netlify** : créer une OAuth App GitHub (callback `https://api.netlify.com/auth/done`), puis l'ajouter dans Netlify, *Site configuration > Access & security > OAuth > Install provider > GitHub*.

En local, « Work with Local Repository » permet d'éditer directement les fichiers du dépôt cloné (Chrome/Edge).
