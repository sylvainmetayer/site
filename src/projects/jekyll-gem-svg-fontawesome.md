---
title: 'Gem : FontAwesome SVG'
emoji: 💎
metaDescription: Je souhaitais utiliser FontAwesome sans pour autant intégrer toute la librairie, assez lourde
date: 2018-11-30T00:00:00.000Z
summary: Je souhaitais utiliser FontAwesome sans pour autant intégrer toute la librairie, assez lourde
tags:
  - jekyll
  - ruby
---

## Besoin

Je souhaitais utiliser [FontAwesome](http://fontawesome.com/) sans pour autant intégrer toute la librairie, assez lourde.

J'ai donc cherché un moyen de n'inclure que les icônes utilisés, et c'est comme cela que je suis venu à chercher comment créer un plugin Jekyll.

[La documentation](https://jekyllrb.com/docs/plugins/your-first-plugin/) est assez bien fournie, ce qui m'a permis de rapidement prendre en main Jekyll.

## Réalisation

Ne souhaitant que afficher des icones, je me suis tourné sur 2 `Tag`, qui permettent de définir une balise et de lui passer des paramètres.

Ainsi, je passe à mon premier tag le type de l'icone que je souhaite utiliser (regular, solid ou brand), ainsi que son nom, et je génère la balise HTML[^1] correspondant à l'icone. Il ne me reste donc plus qu'à récupérer la définition SVG[^3] de l'icône et l'inclure dans un namespace, en bas de la page HTML.

Pour cela, j'ai ajouté au données de la page Jekyll les icones que j'utilise, dans un simple tableau.

C'est lors de l'usage du deuxième tag que je récupère tous les icones utilisés sur la page, et que je vais récupérer la définition SVG de l'icône.

J'ai tout d'abord réalisé ce plugin très simplement, en utilisant le répertoire `_plugins` de Jekyll. Mais une fois fonctionnel, j'ai souhaité en faire une Gem, mise à disposition sur [RubyGems](https://rubygems.org/), pour qu'elle soit disponible pour tous, si elle venait à être utile à certains :blush:.

La création d'une Gem à été assez simple, le guide de [Bundler](https://bundler.io/v1.17/guides/creating_gem.html) étant très bien détaillé.

J'ai essayé d'être le plus en accord avec les conventions du langage Ruby, mais n'étant pas familier avec ce dernier, je suis ouvert à toute remarques pour améliorer le code !

Il me reste à tester l'application de façon plus détaillée et à gérer les cas d'erreurs, qui sont pour le moment gérés de façon optimiste !

## Usage

L'usage est le suivant :

Lorsque l'on souhaite afficher un icone, il faut utiliser le tag suivant. Le code ci-dessous va générer l'icone [Twitter](https://fontawesome.com/icons/twitter?style=brands).

```erb
{% raw %}{% fa_svg fab.fa-twitter %}{% endraw %}
```

Il faut ensuite ajouter à un endroit commun à toutes les pages (en général un footer), le tag de génération de la feuille SVG.

```erb
{% raw %}{% fa_svg_generate %}{% endraw %}
```

## Liens

Si vous voulez voir le code, il est disponible sur ce [dépôt](https://github.com/sylvainmetayer/jekyll-fontawesome-svg).

Pour télécharger la Gem, c'est [par ici](https://rubygems.org/gems/jekyll-fontawesome-svg) !

[^1]: HyperText Markup Language
[^2]: Cascading Style Sheets
[^3]: Scalable Vector Graphics
