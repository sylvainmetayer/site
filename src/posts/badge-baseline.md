---
title: "Badge Baseline"
date: "2026-10-29"
draft: true
tags:
  - eleventy
  - blog
series: "Vitrine"
short: vitrine
excerpt: "Article de démonstration, jamais publié : tout ce qu'un article peut contenir, du badge Baseline aux notes en marge."
metaDesc: "Article de démonstration : badge Baseline, encadrés, blocs de code, figures, vidéos, notes en marge, tableaux."
---

Article de démonstration, en brouillon : il n'est pas publié en production, mais s'affiche en local et sur les préversions Cloudflare Pages. Chaque section montre une syntaxe et ce qu'elle donne.

## Badge Baseline

Le support d'une fonctionnalité web par les navigateurs, lu sur [webstatus.dev](https://webstatus.dev/) au build : `{% raw %}{% baseline 'grid' %}{% endraw %}`.

- {% baseline 'grid' %}
- {% baseline 'view-transitions' %}
- {% baseline 'anchor-positioning' %}

## Texte

Du **gras**, de l'*italique*, du `code en ligne`, ~~du texte barré~~, un [lien interne](/articles/) et un [lien externe](https://www.11ty.dev/). Une URL brute devient un lien : https://www.sylvain.dev. Les guillemets "droits" deviennent typographiques, et `--` devient un tiret : --.

Une touche : <kbd>Ctrl</kbd> + <kbd>K</kbd> ouvre la palette.

Les emojis portent un nom lu par les lecteurs d'écran (`src/_data/emojis.json`) : 🚀 ❤️ 🤷

### Listes

1. Premier point
2. Deuxième point
   - Un sous-point
   - Un autre

### Citation

> Une citation simple, sur plusieurs lignes,
> sans titre d'encadré.

## Encadrés

> [!NOTE]
> Une information utile à connaître.

> [!TIP]
> Un conseil pour aller plus vite.

> [!IMPORTANT]
> Ce qu'il ne faut pas manquer.

> [!WARNING]
> Un piège à éviter.

> [!CAUTION]
> Une action risquée, aux conséquences fâcheuses.

## Blocs de code

Coloration Shiki aux couleurs du site, et bouton « copier » :

```bash
npm ci && mise run dev
```

Avec un nom de fichier, des lignes numérotées et des lignes surlignées (`{2,4-5}`) :

```js {2,4-5} title="eleventy.config.js" showLineNumbers
export default function eleventyConfig(config) {
  config.addShortcode('baseline', baseline);
  config.addFilter('related', related);
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/uploads');
  return { dir: { input: 'src', output: 'dist' } };
}
```

```yaml title="docker-compose.yml"
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

## Notes en marge

Une note de bas de page devient une note en marge sur les grands écrans[^1], et reste en fin d'article ailleurs[^2].

[^1]: Dans la marge gauche, à hauteur de son appel.
[^2]: Sur mobile et à l'impression.

## Images

Une image avec un titre devient une figure numérotée :

![Image de démonstration](/images/demo-image-1.jpg "Une légende, numérotée automatiquement.")

![Seconde image de démonstration](/images/demo-image-2.jpg "La seconde figure, numérotée à la suite.")

Une image sans titre reste une simple image (avec un aperçu flou pendant le chargement) :

![Capture de la page markdown](/images/markdown.jpg)

## Vidéos

Une vidéo YouTube, chargée seulement au clic (miniature locale, domaine youtube-nocookie) : `{% raw %}{% youtube 'id', 'Titre' %}{% endraw %}`.

{% youtube "ADp3fonoDWM", "Multi Kubernetes, Multi Régions, Au-secours !" %}

Une vidéo hébergée sur le site, en HTML :

<video controls muted preload="none" poster="/images/machine_learning-poster.webp" width="960" height="468" aria-label="Vidéo de démonstration, sans son, 4 min">
  <source src="/images/machine_learning.mp4" type="video/mp4">
  <track kind="captions" src="/images/machine_learning.fr.vtt" srclang="fr" label="Français">
  Désolé, votre navigateur ne permet pas de lire la vidéo.
</video>

## Tableau

| Syntaxe | Rendu | Où |
| --- | --- | --- |
| `> [!NOTE]` | encadré | `utils/markdown.js` |
| `[^1]` | note en marge | `transforms/parse-transform.js` |
| `{% raw %}{% baseline 'id' %}{% endraw %}` | badge | `11ty/shortcodes/baseline.js` |

## Bloc dépliable

<details>
<summary>Afficher le détail</summary>

Le contenu caché, en **Markdown**.

</details>

## Front matter

Ce que montre l'en-tête de cet article :

- `series: "Vitrine"` : l'encadré de série en haut de page ;
- `short: vitrine` : le lien court /s/vitrine (`_redirects`, servi par Cloudflare : préversion et production) ;
- `draft: true` : pas de page en production, ni d'image de partage ;
- `tags` : les pages de tags et les articles liés en bas de page.

Les autres champs : `updated` (date de mise à jour), `redirect_from` (anciennes URL), `socialImage` (image de partage choisie à la main), `canonical` et `original` (article publié ailleurs), `star` (mis en avant), `repost: dev.to`.

Autour de l'article : le sommaire (à droite sur grand écran), le fil d'Ariane, les liens de partage et de source, la version Markdown ([index.md](./index.md)) et le QR code à l'impression.
