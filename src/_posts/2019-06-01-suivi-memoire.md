---
layout: post
title: "Suivi mémoire"
category: blog
author: sylvainmetayer
description: "Avancée de la réalisation de mon mémoire de fin d'études pour l'EPSI"
hidden: false
star: false
enable_comments: true
---

Bien que n'ayant pas communiqué sur le suivi de mon mémoire comme cela était [indiqué ici]({{ site.baseurl }}{% post_url 2019-03-17-memoire %}), j'ai bien avancé sur ce dernier. Je vais lister ici mes avancées et ce qu'il me reste à faire.

Tout d'abord, la génération du PDF final était pour moi quelque chose que je souhaitais de façon automatique. Je voulais pouvoir disposer à tout moment de 3 versions présentables. Une version dite de "travail", sur laquelle je retrouve toutes mes notes en cours, une version numérique, avec des marges assez faible, et une version papier avec des marges plus importantes, pour permettre une meilleure lisibilité lors de l'impression. J'ai donc utilisé [Travis CI](https://travis-ci.org/) afin de pouvoir générer ces 3 documents à chaque tag sur mon dépôt.

J'ai également cherché à appliquer les bonnes pratiques LaTeX, avec l'utilisation du paquet [nag](https://ctan.org/pkg/nag) qui permet de relever certaines erreurs et propose des corrections pour ces dernières.

Pour faciliter une diffusion plus facile de mon mémoire, j'ai mis en place une redirection vers la dernière version disponible accessible via le lien suivant : [https://memoire.epsi.sylvainmetayer.fr](https://memoire.epsi.sylvainmetayer.fr)

Un changement important à noter est le changement de ma problématique, afin d'éviter un potentiel hors sujet et de me restreindre à un périmètre trop petit. La nouvelle problématique est la suivante : **Comment l’automatisation peut-elle permettre d’améliorer le cycle de vie d’une application ?**. Concernant le travail sur mon mémoire, j'ai finalisé le plan, qui comporte donc 3 parties. 

1. Le cycle de vie d'une application
2. L'intérêt de la mise en place d'une démarche d'automatisation, via une étude de cas
3. L'automatisation du cycle de vie d'une application

La première partie est désormais bien avancée et la deuxième partie nécessite encore un peu de travail et de reformulation. La troisième partie dispose de la plupart des idées et concepts que je souhaite aborder, il ne restera plus qu'à l'écrire. 

Prochaine deadline, 28 juin, ou je présenterais une version (normalement) finalisée à mon tuteur. Comme indiqué dans l'article précédent, je suis preneur de vos retour, tant sur le fond que sur la forme ! 
