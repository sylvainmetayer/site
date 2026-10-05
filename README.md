# sylvain.dev

![Eleventy Build](https://github.com/sylvainmetayer/site/workflows/Eleventy%20Build/badge.svg)

Site personnel de Sylvain MÉTAYER, en ligne sur [www.sylvain.dev](https://www.sylvain.dev). Site statique généré avec [Eleventy 3](https://www.11ty.dev/), en une colonne, avec un thème inspiré du terminal : sombre par défaut, clair si le système le demande, ou au choix via le sélecteur de l'en-tête.

## Développement

```bash
mise run dev       # http://localhost:8080, rechargement auto
mise run build     # build de production dans dist/
mise run preview   # http://localhost:8788, émulateur Cloudflare Pages (_redirects, _headers)
mise run validate  # validation HTML du build
mise tasks         # liste des tâches
```

mise installe Node 22 (`mise install`, voir aussi `.nvmrc`). Sans mise : `npm ci`, `npm start`, `npm run production`.

## Organisation

| Dossier / fichier | Contenu |
| --- | --- |
| `src/posts/` | Articles (Markdown) |
| `src/projets/` | Projets de `/projets/`, et de l'accueil avec `featured: true` |
| `src/work/` | Expériences, affichées sur `/cv/` |
| `src/_data/` | Données du site : `site.json`, `navigation.json`, `social.json`, `formations.json`, `certifications.json`, `skills.json` |
| `src/_includes/css/site.css` | Feuille de style (CSS natif, injectée dans chaque page) |
| `src/_includes/layouts/` | Layouts Nunjucks |
| `src/admin/config.yml` | Configuration de Sveltia CMS |

Les polices (JetBrains Mono, IBM Plex Sans) et Sveltia CMS viennent de npm et sont copiés dans `dist/` au build, à cause de la CSP (`font-src 'self'`, `script-src 'self'`).

Un article avec `repost: dev.to` dans son front matter apparaît dans `/devto.rss.xml`, le flux que dev.to importe.

## Déploiement (Cloudflare Pages)

L'infra est décrite dans le dépôt homelab (`tofu/site`, sur le modèle de ref.sylvain.dev) :

- projet Pages `sylvain-dev`, build `npm run production`, sortie `dist`, version de Node lue dans `.nvmrc` ;
- `eleventy.config.js` déduit `ELEVENTY_ENV` de `CF_PAGES_BRANCH` : `production` sur `main`, `preview` ailleurs (brouillons visibles). Sans variable, le build est en `development` : pas de beacon, et `robots.txt` interdit tout ;
- domaine `www.sylvain.dev` (CNAME OVH vers `sylvain-dev.pages.dev`). Pages n'accepte pas un apex hors zone Cloudflare, donc `sylvain.dev` pointe vers Pangolin, qui redirige en 301 vers www en gardant le chemin ;
- redirections dans `src/_redirects` (statut explicite, Pages renvoie 302 par défaut), en-têtes et CSP dans `src/_headers` ;
- build quotidien pour les articles programmés : `.github/workflows/daily_build.yml` appelle le deploy hook Pages (secret `CLOUDFLARE_PAGES_DEPLOY_HOOK`, posé par homelab) ;
- CI : build de production puis `npm run check:links`, qui vérifie les liens internes, les cibles de `_redirects` et les URLs déjà publiées de `scripts/published-urls.txt`. Chaque nouvelle page publiée y ajoute une ligne ;
- SonarCloud (`.github/workflows/sonarcloud.yml`, `sonar-project.properties`) : analyse de `main` et des PR, informative. Nécessite le secret `SONAR_TOKEN` et l'Automatic Analysis désactivée sur sonarcloud.io ; sans secret, le job est ignoré ;
- flux Atom : les `<id>` restent sur `https://sylvain.dev` (`feedIdBase`) pour que les lecteurs RSS ne revoient pas tous les articles comme nouveaux ;
- `src/service-worker-retired.js` : Pangolin le sert à la place de `/service-worker.js` sur l'apex. Il désinstalle le service worker de l'ancien site, qu'un navigateur ne mettrait pas à jour derrière une redirection ;
- webmentions : reçues par webmention.io pour `www.sylvain.dev` (`webmentionDomain`), récupérées au build par `src/_data/webmentions.js` et affichées sous les articles. Le build lit la variable `WEBMENTION_IO_TOKEN` (production uniquement, à poser dans `tofu/site`) ; sans elle, rien ne s'affiche. Le build quotidien fait apparaître les nouvelles ;
- images des articles : converties au build en AVIF, WebP et format d'origine, en plusieurs largeurs, par `@11ty/eleventy-img` (`src/transforms/parse-transform.js`), servies sous `/img/` avec un cache `immutable` ;
- Web Analytics : jeton du beacon dans `src/_data/site.json` (`cfBeaconToken`), celui du site Web Analytics existant, importé dans `tofu/site` pour garder l'historique (sortie `web_analytics_token`). Le beacon n'est injecté qu'en production.

## Administration (Sveltia CMS)

L'admin est sur `/admin/`. [Sveltia CMS](https://github.com/sveltia/sveltia-cms) utilise le backend GitHub, et chaque modification passe par le workflow éditorial (une PR par contenu).

Connexion par jeton, comme pour ref.sylvain.dev : créer un [fine-grained PAT GitHub](https://github.com/settings/personal-access-tokens/new) limité au dépôt `sylvainmetayer/site`, avec les permissions Contents et Pull requests en Read and write, puis choisir « Sign In Using Access Token ».

En local, « Work with Local Repository » édite directement les fichiers du dépôt cloné (Chrome et Edge).
