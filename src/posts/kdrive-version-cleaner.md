---
title: 'kdvc : faire le ménage dans les versions d''un kDrive'
tags:
  - projet
  - rust
  - infomaniak
date: "2026-10-29"
short: kdvc
metaDesc: Mon kDrive se remplissait tout seul. La faute aux anciennes versions des fichiers, que l'interface ne permet pas de supprimer en masse.
excerpt: Mon kDrive se remplissait tout seul. La faute aux anciennes versions des fichiers, que l'interface ne permet pas de supprimer en masse.
noToc: false
---

[Sources (GitHub)](https://github.com/sylvainmetayer/kdrive-version-cleaner) [Dernière version](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest)

## Le besoin

Mon quota [kDrive](https://www.infomaniak.com/fr/kdrive) augmentait régulièrement, alors que je n'y ajoutais que peu de fichiers. En cherchant un peu, j'ai trouvé d'où venait cet écart : les **anciennes versions** des fichiers. À chaque modification, kDrive garde une copie de l'ancienne version, ce qui est très pratique pour revenir en arrière, mais beaucoup moins quand un fichier modifié tous les jours finit par peser plusieurs fois sa taille (ma base KeePass par exemple, ou alors un dossier rempli de photos sur lequel on vient changer des métadonnées 🥲).

Grâce à l'outil présenté plus bas, j'ai pu libérer 3,2 Go, soit 686 anciennes versions. Au final, mon quota était largement respecté, mais je souhaitais quand même trouver une solution pour éviter de me retrouver un jour avec un kDrive saturé à cause des anciennes versions.

Ma première idée a été de faire cela via l'interface web de kDrive. Problème : celle d'Infomaniak ne permet de supprimer les versions qu'une par une, fichier par fichier. 😩

En revanche, Infomaniak propose une [API](https://developer.infomaniak.com/docs/api) qui permet de lister les fichiers, leurs versions, et de les supprimer. De quoi se faire un petit outil !

## kdvc

`kdvc` (pour _kDrive Version Cleaner_) est donc une petite TUI[^1], écrite en [Rust](https://www.rust-lang.org/) avec [ratatui](https://ratatui.rs/). Elle scanne le drive une première fois, garde l'arborescence dans un cache SQLite local, puis affiche :

- des statistiques globales : nombre de fichiers, espace occupé par les anciennes versions
- un explorateur, avec le poids des versions cumulé par dossier
- le top des fichiers dont les versions prennent le plus de place
- une recherche par nom, extension, taille ou nombre de versions
- le journal des suppressions, exportable en CSV

Pour faire le ménage, on sélectionne un fichier ou un dossier, et on choisit une règle : garder les N dernières versions, supprimer celles de plus de X jours, ou tout supprimer sauf la version courante.

## Supprimer, oui, mais pas n'importe quoi

Un outil qui supprime des données en masse, ça mérite quelques garde-fous. Voici les deux principaux :

- **La version courante n'est jamais supprimée.** L'API ne renvoie normalement que les anciennes versions, mais l'outil vérifie que la liste correspond exactement à ce que le scan a vu. Au moindre doute, la plus récente est protégée : au pire, on garde une version de trop.
- **Toute suppression passe par un aperçu**, qui liste les versions concernées et l'espace libéré, puis par une confirmation explicite de l'utilisateur.

## Écrit avec un agent de code

Ce projet est aussi l'occasion d'un test : je l'ai développé avec [Claude Code](https://www.anthropic.com/claude-code), en deux soirées. Mon rôle a surtout été de fixer les règles, puis de relire, laissant l'agent choisir le langage et ce qui lui semblait le plus juste.

Sans agent, cet outil serait resté une idée, car je n'aurais pas pris le temps d'apprendre Rust pour ça (ou alors, j'aurais attendu d'atteindre mon quota et sorti un petit script Python à la va-vite, non testé, et certainement moins fiable que cet outil).

Cependant, comme je ne connais pas Rust, je suis bien moins expert du code produit que si je l'avais écrit moi-même. Pour un projet perso de cette taille, c'est acceptable, sachant que la maintenance reste minime, vu le peu de fonctionnalités de l'outil.

## Installation

Le plus simple est de passer par [mise](https://mise.jdx.dev) :

```sh
mise use -g github:sylvainmetayer/kdrive-version-cleaner
```

Des binaires pour Linux, macOS et Windows sont aussi disponibles sur la [page des releases](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest).

Il faudra ensuite créer un [token d'API Infomaniak](https://manager.infomaniak.com/v3/ng/profile/user/token/list) avec le scope `drive` (et `accounts` pour que l'outil trouve vos comptes tout seul), puis l'exporter dans `KDRIVE_TOKEN`. Le [README](https://github.com/sylvainmetayer/kdrive-version-cleaner#readme) détaille le reste.

Si vous venez à utiliser ce projet, n'hésitez pas à faire des retours ou à contribuer sur [GitHub](https://github.com/sylvainmetayer/kdrive-version-cleaner) !

[^1]: Terminal User Interface, une interface utilisateur en mode texte.
