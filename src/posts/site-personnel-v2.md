---
title: "Nouvelle version du site 💥"
tags:
    - jekyll
excerpt: "Après quelques années d'existence, mon ancien site commençait à vieillir."
metaDesc: "Après quelques années d'existence, mon ancien site commençait à vieillir."
date: 2018-11-15T00:00:00.000Z
---

<!-- {\% include toc.html %\} -->

## Le passage de PHP à Jekyll

Après quelques années d'existence, mon ancien site commençait à vieillir.

([Les sources de mon ancien site sont toujours disponibles sur Github](https://github.com/sylvainmetayer/sylvainmetayer-old), mais remontent à l'époque de mon DUT, soyez indulgents ! 😁)

De plus, [le premier et unique article](/article/l-effet-parthenay) présent sur ce site n'était même pas hébergé sur ce site, mais sur un sous-domaine (désormais inexistant) et avec la plateforme [Ghost](https://ghost.org/fr/) (qui est un excellent logiciel libre au passage !).

Cela faisait donc deux sites à maintenir, pour un trafic plus que faible 😀 !

Le choix de PHP avait été fait à l'époque car il s'agissait du seul langage que je maitrisais.

En y réfléchissant, pour effectuer une refonte du site, j'ai listé les points que je souhaitais avoir.

### 1. Des performances améliorées

Pour cette refonte, je souhaitais obtenir des performances dignes de ce nom. N'ayant pas de logique côté serveur (puisque le but de ce site est simplement de servir du contenu, pas d'effectuer un traitement dessus ou de traiter des données externe), le choix d'un langage côté serveur ne me semblait plus très cohérent.

Etant donné que j'ai que du contenu statique, pourquoi ne pas envoyer au client un simple fichier HTML, plutôt que de consommer du temps CPU et des processus PHP pour générer une page d'une faible complexité ? Pourquoi ne pas construire une fois toutes les pages nécessaire, pour n'avoir plus qu'à les servir ensuite, supprimant le temps de génération de la page côté serveur ?

J'ai donc commencé à creuser la question des générateurs de sites et en ai trouvé plusieurs (le très bon site [StaticGen](https://www.staticgen.com/) m'a beaucoup aidé à trouver des ressources et des avis). C'est ainsi que mon choix s'est porté sur [Jekyll](https://jekyllrb.com/).

Voici une illustration des performances actuelles du site, ainsi qu'un rapport [Dareboost](https://www.dareboost.com/fr/report/d_5bec937de967905e05bb64cb). Je suis assez satisfait du résultat, même s'il me reste du travail à faire dessus (mais comme le produit parfait n'existe pas, le site parfait n'existe pas non plus ! 😜)

![Google page Speed résultat](/static/img/speed-test.png)

### 2. Le contenu prime sur le design (pour moi)

Je suis un très mauvais designer et l'intégration CSS est pour moi un vrai calvaire.

C'est d'ailleurs pour cela que je suis parti d'un template Jekyll que j'ai ensuite adapté à mes besoins.

> [Le thème de base que j'ai utilisé peut être consulté ici](https://github.com/sergiokopplin/indigo)

Néanmoins, je ne voulais pas d'un thème complexe, qui allait ainsi influer sur les performances du site (plus il y a de CSS et de JS, plus le site sera long à charger pour l'utilisateur). C'est pourquoi le thème que j'ai choisi n'intègre aucun javascript. Ainsi, seule une feuille de style, quelques emojis provenant de Github, et une feuille SVG[^5] sont chargées en plus du contenu.

> Je n'exclus pas d'utiliser du javascript lorsque je ferai évoluer le site, mais je vais tenter d'en limiter au maximum l'usage.

Certes, le thème du site semblera au mieux austère à certains, au pire hideux à d'autres, ... Mais au moins, le site est lisible sur (presque, je n'ai pas de montre connectée pour tester !) tous les supports et charge rapidement 😀

### 3. La rédaction doit se faire en [Markdown](https://fr.wikipedia.org/wiki/Markdown) et une séparation style/contenu doit exister

C'est également l'une des raisons qui m'a poussé vers les générateurs de site statiques.

J'aime beaucoup le markdown, et m'en sert beaucoup en cours pour ma prise de note. Il s'agit d'un langage extrêmement simple pour la rédaction, et en même temps, très puissant.

Concernant la séparation style/contenu, les `layouts` de Jekyll répondent parfaitement à ce besoin.

### 4. Sécurité

Je souhaitais un site qui ne sera pas facilement corrompu. Avec des pages HTML, aucune faille PHP / Node / Java / (mettez le nom de votre langage préféré ici) possible. Avec un générateur de site statique, on génère le contenu une fois, on publie le résultat et on sert le contenu, c'est tout !

Concernant l'hébergement, je me suis tout d'abord dis que j'allais profiter de l'hébergement avec [Github Pages](https://pages.github.com/). Cela fonctionne très simplement, même avec un domaine personnel, puisqu'il suffit simplement d'utiliser le gestionnaire DNS de son registrar pour faire pointer le domaine sur l'IP de Github Page.

Néanmoins, cela un inconvénient majeur à mon sens : la maîtrise des paramètres du site est impossible, que cela soit au niveau du cache, des headers de sécurité, ... Github empêche toute modification des headers sur les sites hébergés par Github Pages[^1]

Au final, nous ne sommes jamais aussi bien servi que par soi-même, j'ai donc utilisé [Travis CI](https://travis-ci.org/) pour déployer le site généré sur mon petit [Raspberry](https://www.raspberrypi.org/) avec un Rsync : pas besoin de plus compliqué, cela me suffit amplement. Un serveur web devant, un certificat [Let's Encrypt](https://letsencrypt.org) et voilà !

J'ai ainsi pu obtenir une note convenable, selon [l'observatoire Mozilla](https://observatory.mozilla.org/analyze/sylvainmetayer.fr) et [Cryptcheck](https://cryptcheck.fr/https/sylvainmetayer.fr). Il me reste néanmoins un peu de travail à faire sur les [CSP (Content Security Policy)](https://developer.mozilla.org/fr/docs/Web/HTTP/CSP), ce concept n'est pas évident à appréhender 😣 !

### 5. SEO

Il s'agit de ma première réelle expérience SEO[^3] et Jekyll offre de nombreux plugins[^4] permettant de générer des sitemap, un flux [RSS](https://fr.wikipedia.org/wiki/RSS), des métadonnées, ... J'ai donc essayé de tirer profit de cela au maximum.

## Workflow

Mon processus de développement est assez simple :

- Je développe en local mes articles et pages.
- Le code est versionné sur [Github](https://github.com/sylvainmetayer/sylvainmetayer)
- Travis s'assure de la qualité du site, avec des tests de validité des liens et des images, ainsi que la structure des pages HTML.
- Travis déploie une version (correspondant à la branche master) de production.
- Je déploie également avec une autre branche une version de développement, qui me permet de tester le site avant d'effectuer un merge sur master :smiley:

## Un nouveau site, pour quoi faire

Ce site va principalement me servir à exposer mes projets réalisés, et à effectuer ma veille technologique. J'y écrirais des articles sur mes expériences de développement, afin de garder une trace de ce qui m'est arrivé. Je ne m'impose cependant aucun rythme de publication, il est donc possible que le site reste quelques mois sans nouveaux contenus.

## Evolutions

Ce site est fonctionnel, mais pourtant il me reste quelques petits éléments à améliorer/régler.

### Système de commentaire

Etant sur un site statique, il n'est pas possible d'inclure des commentaires directement, puisqu'il n'y a aucun traitement côté serveur.

Evidemment, il est possible d'intégrer des solutions tel que [Disqus](https://disqus.com/) ou encore [Facebook Comments](https://developers.facebook.com/docs/plugins/comments/) mais ces solutions étant peu protectrice de notre vie privée, j'ai préféré chercher une alternative.

Après quelques recherches, j'ai trouvé 2 solutions :

1. [Isso](https://posativ.org/isso/)
2. [Staticman](https://staticman.net/)

Le premier est un serveur de commentaire basique et léger écrit en Python. Je n'ai pas encore eu beaucoup de temps à consacrer à ce sujet, notament pour l'auto-héberger, mais je pense qu'il s'agit d'une très bonne solution et risque de me pencher dessus dans les prochaines semaines !

Le deuxième semblait très prometteur mais malheureusement victime de son succès. En effet, il s'agit d'un bot Github, interagissant avec le dépôt Github, et qui ajoute les commentaires directement dans la branche `master` ou créé une pull request si une approbation est nécessaire avant la publication des commentaire.

De plus, comme indiqué sur leur site, cet outil s'intègre très bien avec Jekyll et Github. Néanmoins, il utilise l'API Github, et étant un projet public commençant à prendre de l'ampleur, les limitations de l'API Github semble bloquer/ralentir ce projet, entrainant de nombreuses erreurs.

Une solution pour parer au problème serait d'auto-héberger le projet avec une clé d'API Github personnelle mais semble beaucoup pour "simplement des commentaires", même si j'aimais beaucoup l'idée de pouvoir avoir des pull request pour chaque commentaire !

> Edit : Les commentaires sont maintenant disponible ! 💥
>
> [Voir l'article](/article/ajout-commentaires)

## Conclusion

Merci à tous d'avoir lu cet article, j'espère qu'il vous aura plu.

Si vous avez des remarques, n'hésitez pas à me faire vos retours !

[^1]: Ce qui n'est en soit pas une mauvaise chose, si une totale liberté était donné à tous, ils se retrouveraient sûrement avec des sites mal configurés dans certains cas et leur infrastructure pourrait alors être compromise !
[^3]: [Définition Wikipédia du SEO](https://fr.wikipedia.org/wiki/Optimisation_pour_les_moteurs_de_recherche)
[^4]: Pour en citer quelques uns : `jekyll-sitemap`, `jekyll-seo-tag` et `jekyll-feed`
[^5]: Scalable Vector Graphics
