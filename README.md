# sylvain.dev

<!-- Badges : CI, qualité (SonarCloud), sécurité, production. Les scores Lighthouse et
     l'empreinte carbone viennent de la branche `badges` (.github/workflows/badges.yml). -->

**CI** [![CI : build, HTML, accessibilité](https://github.com/sylvainmetayer/site/actions/workflows/eleventy_build.yml/badge.svg)](https://github.com/sylvainmetayer/site/actions/workflows/eleventy_build.yml) [![Liens externes](https://github.com/sylvainmetayer/site/actions/workflows/links.yml/badge.svg)](https://github.com/sylvainmetayer/site/actions/workflows/links.yml) [![Daily Build](https://github.com/sylvainmetayer/site/actions/workflows/daily_build.yml/badge.svg)](https://github.com/sylvainmetayer/site/actions/workflows/daily_build.yml) [![CodeQL](https://github.com/sylvainmetayer/site/actions/workflows/codeql.yml/badge.svg)](https://github.com/sylvainmetayer/site/actions/workflows/codeql.yml)

**Qualité** [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Fiabilité](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Sécurité](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Maintenabilité](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=bugs)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Vulnérabilités](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Code smells](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Duplication](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site) [![Lignes de code](https://sonarcloud.io/api/project_badges/measure?project=sylvainmetayer_site&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=sylvainmetayer_site)

**Sécurité** [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/sylvainmetayer/site/badge)](https://scorecard.dev/viewer/?uri=github.com/sylvainmetayer/site) [![Mozilla Observatory](https://img.shields.io/mozilla-observatory/grade/www.sylvain.dev?publish&label=observatory)](https://developer.mozilla.org/en-US/observatory/analyze?host=www.sylvain.dev) [![HSTS preload](https://img.shields.io/hsts/preload/sylvain.dev)](https://hstspreload.org/?domain=sylvain.dev)

**Production** [![Statut](https://precise-foxhound.pikapod.net/api/badge/16/status)](https://precise-foxhound.pikapod.net/status/sylvain-dev) [![Disponibilité 30 j](https://precise-foxhound.pikapod.net/api/badge/16/uptime/720?label=disponibilit%C3%A9%2030%20j)](https://precise-foxhound.pikapod.net/status/sylvain-dev) [![Temps de réponse 24 h](https://precise-foxhound.pikapod.net/api/badge/16/ping/24?label=r%C3%A9ponse%2024%20h)](https://precise-foxhound.pikapod.net/status/sylvain-dev) [![Performance](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsylvainmetayer%2Fsite%2Fbadges%2Flighthouse-performance.json&logo=lighthouse)](https://github.com/sylvainmetayer/site/actions/workflows/badges.yml) [![Accessibilité](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsylvainmetayer%2Fsite%2Fbadges%2Flighthouse-accessibility.json&logo=lighthouse)](https://github.com/sylvainmetayer/site/actions/workflows/badges.yml) [![Bonnes pratiques](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsylvainmetayer%2Fsite%2Fbadges%2Flighthouse-best-practices.json&logo=lighthouse)](https://github.com/sylvainmetayer/site/actions/workflows/badges.yml) [![SEO](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsylvainmetayer%2Fsite%2Fbadges%2Flighthouse-seo.json&logo=lighthouse)](https://github.com/sylvainmetayer/site/actions/workflows/badges.yml) [![CO₂ par visite](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsylvainmetayer%2Fsite%2Fbadges%2Fcarbon.json&logo=leaflet)](https://www.thegreenwebfoundation.org/co2-js/)

**Liens** [![Site](https://img.shields.io/badge/site-www.sylvain.dev-0e1621?logo=gnometerminal&logoColor=white)](https://www.sylvain.dev) [![Flux Atom](https://img.shields.io/badge/flux-Atom-f26522?logo=rss&logoColor=white)](https://www.sylvain.dev/feed.xml)

Site personnel de Sylvain MÉTAYER, en ligne sur [www.sylvain.dev](https://www.sylvain.dev). Site statique généré avec [Eleventy 3](https://www.11ty.dev/), en une colonne, avec un thème inspiré du terminal : sombre par défaut, clair si le système le demande, ou au choix via le sélecteur de l'en-tête.

## Développement

```bash
mise run dev       # http://localhost:8080, rechargement auto
mise run naked     # pareil, en mode CSS Naked Day (sans CSS, comme le 9 avril)
mise run build     # build de production dans dist/
mise run preview   # http://localhost:8788, émulateur Cloudflare Pages (_redirects, _headers)
mise run validate  # validation HTML du build
npm test           # tests unitaires des filtres et du Markdown (node --test, test/)
npm run check:spelling  # orthographe des contenus (cSpell, mots connus dans cspell-words.txt)
mise tasks         # liste des tâches
```

mise installe Node 24 (`mise install`, voir aussi `.nvmrc`). Sans mise : `npm ci`, `npm start`, `npm run production`.

## Organisation

| Dossier / fichier | Contenu |
| --- | --- |
| `src/posts/` | Articles (Markdown) |
| `src/projets/` | Projets de `/projets/`, et de l'accueil avec `featured: true` |
| `src/work/` | Expériences, affichées sur `/cv/` |
| `src/_data/` | Données du site : `site.json`, `navigation.json`, `social.json`, `formations.json`, `certifications.json`, `skills.json`, `talks.json`… ; textes de l'interface dans `i18n.js` |
| `src/en/` | Pages anglaises (voir « Version anglaise ») |
| `src/_includes/css/site.css` | Feuille de style (CSS natif, injectée dans chaque page) |
| `src/_includes/layouts/` | Layouts Nunjucks |
| `src/admin/config.yml` | Configuration de Sveltia CMS |

Les polices (JetBrains Mono, IBM Plex Sans) et Sveltia CMS viennent de npm et sont copiés dans `dist/` au build, à cause de la CSP (`font-src 'self'`, `script-src 'self'`).

Les blocs de code sont colorés au build par Shiki (thème `src/utils/shiki-theme.js`). Après le langage : `{2,4-5}` surligne des lignes, `title="fichier.js"` affiche le nom du fichier, `showLineNumbers` numérote les lignes.

Un encadré s'écrit comme sur GitHub : une citation qui commence par `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` ou `[!CAUTION]`.

`{% youtube 'identifiant', 'Titre', 2727 %}` intègre une vidéo YouTube légère : la miniature est téléchargée au build, le lecteur (youtube-nocookie, autorisé par `frame-src` dans `_headers`) ne se charge qu'au clic. Le dernier argument, facultatif, est la durée en secondes, affichée sur la miniature.

Un paragraphe `Tableau : …` (`Table: …` en anglais) juste avant un tableau en devient la légende (`<caption>`).

Les sigles de `src/_data/abbreviations.json` sont expliqués (`<abbr title>`) à leur première occurrence dans chaque page, et listés sur [/glossaire/](https://www.sylvain.dev/glossaire/) : ajouter un sigle là, en français et en anglais.

Dans un article, `{% baseline 'container-queries' %}` affiche le support navigateur d'une fonctionnalité web (identifiant de l'URL `https://webstatus.dev/features/<id>`), récupéré au build. Pas de « {% » dans `site.css` : la feuille passe par Nunjucks.

`/liens/` liste les liens saisis dans le CMS (`src/_data/links.json`) et ceux d'une liste Karakeep, si le build a `KARAKEEP_URL`, `KARAKEEP_API_KEY` et `KARAKEEP_LIST_ID` (la note du favori devient le commentaire). Sans liens, la page n'est pas générée.

`dist/_redirects` est généré (`src/redirects.njk`) : les règles écrites à la main dans `src/_redirects`, puis celles du front matter, `redirect_from: [/ancienne/url/]` et `short: code` (lien court `/s/code`).

L'accueil liste les articles les plus lus sur 30 jours si le build a `CF_ANALYTICS_TOKEN` (droit Account Analytics: Read), `CF_ACCOUNT_ID` et `CF_ANALYTICS_SITE_TAG` (Cloudflare Web Analytics).

Un article avec `repost: dev.to` dans son front matter apparaît dans `/devto.rss.xml`, le flux que dev.to importe.

Chaque matin, `.github/workflows/syndicate.yml` (`scripts/syndicate.mjs`) envoie les webmentions des articles publiés la veille vers les pages qu'ils citent, et publie les nouveaux articles français sur Mastodon (variable `MASTODON_INSTANCE`, secret `MASTODON_TOKEN`) et Bluesky (variable `BLUESKY_HANDLE`, secret `BLUESKY_APP_PASSWORD`, un mot de passe d'application). Un article déjà publié n'est pas republié. Chaque post est noté dans `src/_data/syndication.json` : `main` n'accepte que des PR, le workflow dépose donc le fichier mis à jour en artefact et ouvre une issue avec le diff, à reporter dans une PR (ou à la main pour un post partagé autrement) : les commentaires sous l'article viennent des réponses à ces posts. Lancé à la main, il est en `--dry-run` par défaut.

## Version anglaise

Le français est la langue par défaut, aux URL actuelles ; l'anglais est sous `/en/` (accueil, articles, projets, talks, CV et son PDF, flux Atom, index de la palette).

| Contenu | Français | Anglais |
| --- | --- | --- |
| Articles, projets, expériences | `src/posts/slug.md` | `src/posts/slug.en.md` (même nom + `.en`) |
| Données éditées dans le CMS (`site`, `navigation`, `formations`, `certifications`, `skills`) | à la racine du fichier | sous la clé `en`, version complète (format de Sveltia) |
| Autres données (`talks`, `languages`, `interests`) | champ `title`… | champ voisin `title_en`… : un nouvel élément n'a pas à être recopié |
| Accueil | `src/index.md` | `src/en/index.md` |
| Pages (projets, talks, CV…) | `src/*.njk` : front matter seulement | `src/en/*.njk`, même layout |
| Textes de l'interface | `src/_data/i18n.js`, `fr` | `src/_data/i18n.js`, `en` |

- Les conventions sont réunies dans `src/11ty/i18n.js` (fichiers `.en.md`, localisation des données, index des traductions), utilisé par la config, les données et `scripts/check-cv-ats.mjs`.
- La langue d'une page est la donnée `lang` (`fr` par défaut, `en` sous `src/en/` et pour les `*.en.md`). `src/_data/eleventyComputed.js` remplace alors chaque fichier de données par sa version anglaise et fournit `langPrefix` (`''` ou `/en`) et `otherLang` ; le filtre `t` donne les textes de l'interface : `{{ 'posts.title' | t }}`. Les macros de `partials/macros.njk` s'importent `with context` pour suivre la langue.
- Une page et sa traduction partagent une `translationKey` (calculée pour les articles, les projets et les expériences) : sélecteur FR/EN de l'en-tête, balises `hreflang`, bandeau qui propose la traduction quand le navigateur préfère l'autre langue (`src/js/lang-suggest.js`, fermé une fois pour toutes).
- Sur les pages anglaises, un article sans traduction reste listé, en français et marqué « in French ». Les pages de tags (une par tag des articles publiés) et `/devto.rss.xml` restent en français.
- Pas de `hreflang` pour un article canonique ailleurs (dev.to, LinkedIn…) : les moteurs ignorent les paires qui pointent vers une URL non canonique.
- Une traduction d'article republié porte `original:` (l'URL de l'original) au lieu de `canonical:` : la page anglaise est canonique d'elle-même.
- Le CV anglais est imprimé dans `src/uploads/CV-Sylvain-Metayer-en.pdf` (`mise run cv` génère et vérifie les deux, la CI compare les deux au build).
- Sveltia CMS édite les deux langues (bloc `i18n` de `src/admin/config.yml`) : champ « traduit » ou « dupliqué » (même valeur dans les deux langues).

## Déploiement (Cloudflare Pages)

L'infra est décrite dans le dépôt homelab (`tofu/site`, sur le modèle de ref.sylvain.dev) :

- projet Pages `sylvain-dev`, build `npm run production`, sortie `dist`, version de Node lue dans `.nvmrc` ;
- `eleventy.config.js` déduit `ELEVENTY_ENV` de `CF_PAGES_BRANCH` : `production` sur `main`, `preview` ailleurs (brouillons visibles). Sans variable, le build est en `development` : pas de beacon, et `robots.txt` interdit tout ;
- domaine `www.sylvain.dev` (CNAME OVH vers `sylvain-dev.pages.dev`). Pages n'accepte pas un apex hors zone Cloudflare, donc `sylvain.dev` pointe vers Pangolin, qui redirige en 301 vers www en gardant le chemin ;
- redirections dans `src/_redirects` (statut explicite, Pages renvoie 302 par défaut), en-têtes et CSP dans `src/_headers` ;
- build quotidien pour les articles programmés : `.github/workflows/daily_build.yml` appelle le deploy hook Pages (secret `CLOUDFLARE_PAGES_DEPLOY_HOOK`, posé par homelab) ;
- CI : build de production puis `npm run check:links`, qui vérifie les liens internes, les cibles de `_redirects` et les URLs déjà publiées de `scripts/published-urls.txt`. Chaque nouvelle page publiée y ajoute une ligne ;
- contrôles à chaque push, dans le workflow CI (`eleventy_build.yml`) : un seul build partagé entre les jobs, puis `npm run validate` (HTML, `.htmlvalidate.json`) et `npm run check:a11y` (pa11y-ci, WCAG 2 AA avec axe et HTML_CodeSniffer sur toutes les pages du sitemap, `.pa11yci.json` ; navigateur dans `PUPPETEER_EXECUTABLE_PATH`, Puppeteer n'en télécharge pas : `.puppeteerrc.cjs`). Installation et build communs : `.github/actions/setup` et `.github/actions/build`. Chaque semaine : liens externes (lychee, `lychee.toml`, une issue `liens-casses` liste les liens morts), CodeQL et OpenSSF Scorecard (onglet Security) ;
- badges Lighthouse et CO₂ : `.github/workflows/badges.yml` audite la production chaque matin (`scripts/lighthouse-badges.mjs`) et publie des fichiers JSON sur la branche `badges`, lus par shields.io. Disponibilité : page de statut Uptime Kuma `sylvain-dev` (homelab, `tofu/pangolin_config`) ;
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
