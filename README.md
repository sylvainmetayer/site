# Personal Website

[![Depfu](https://badges.depfu.com/badges/7a567e824b66dfa3193846d89c9b8e59/overview.svg)](https://depfu.com/github/sylvainmetayer/site?project_id=14116)
![Github Eleventy Build](https://github.com/sylvainmetayer/site/workflows/Eleventy%20Build/badge.svg)

> Sylvain METAYER — [sylvain.dev](https://www.sylvain.dev)

Site statique généré avec [Eleventy 3](https://www.11ty.dev/), design « Prompt » : une colonne de lecture, un thème terminal discret, sombre par défaut et clair selon le système (ou via le sélecteur de l'en-tête).

## Setup

```bash
mise run dev       # http://localhost:8080, rechargement auto
mise run build     # build de production dans dist/
mise run preview   # http://localhost:8788, émulateur Cloudflare Pages (_redirects, _headers)
mise run validate  # validation HTML du build
mise tasks         # liste des tâches
```

Node 22 est installé par mise (`mise install`, voir aussi `.nvmrc`). Sans mise : `npm ci`, `npm start`, `npm run production`.

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

## Déploiement (Cloudflare Pages)

L'infra est décrite dans le dépôt homelab (`tofu/site`, même modèle que ref.sylvain.dev) :

- projet Pages `sylvain-dev`, build `npm run production`, sortie `dist`, Node lu depuis `.nvmrc` ;
- `ELEVENTY_ENV` vaut `production` sur `main` et `preview` sur les autres branches (brouillons visibles en preview) ;
- domaine `www.sylvain.dev` (CNAME OVH vers `sylvain-dev.pages.dev`). Pages n'accepte pas un apex hors zone Cloudflare : `sylvain.dev` pointe vers Pangolin, qui redirige en 301 vers www en gardant le chemin ;
- redirections dans `src/_redirects` (statut explicite, le défaut de Pages est 302), en-têtes et CSP dans `src/_headers` ;
- build quotidien (articles programmés) : `.github/workflows/daily_build.yml` appelle le deploy hook Pages (secret `CLOUDFLARE_PAGES_DEPLOY_HOOK`, posé par homelab) ;
- Web Analytics : jeton du beacon dans `src/_data/site.json` (`cfBeaconToken`, sortie `web_analytics_token` de `tofu/site`), injecté en production seulement.

## Administration (Sveltia CMS)

L'admin est disponible sur `/admin/`. [Sveltia CMS](https://github.com/sveltia/sveltia-cms) utilise le backend GitHub ; chaque modification passe par le workflow éditorial (une PR par contenu).

Connexion par jeton, comme ref.sylvain.dev : créer un [fine-grained PAT GitHub](https://github.com/settings/personal-access-tokens/new) limité au dépôt `sylvainmetayer/site`, permissions **Contents** et **Pull requests** en *Read and write*, puis « Sign In Using Access Token ».

En local, « Work with Local Repository » permet d'éditer directement les fichiers du dépôt cloné (Chrome/Edge).
