---
title: 'kdvc : faire le ménage dans les versions d''un kDrive'
tags:
  - projet
  - rust
  - infomaniak
date: "2026-10-15"
draft: true
metaDesc: Mon kDrive se remplissait tout seul. La faute aux anciennes versions des fichiers, que l'interface ne permet ni de mesurer, ni de supprimer en masse.
excerpt: Mon kDrive se remplissait tout seul. La faute aux anciennes versions des fichiers, que l'interface ne permet ni de mesurer, ni de supprimer en masse.
noToc: false
---

[Sources (Github)](https://github.com/sylvainmetayer/kdrive-version-cleaner) [Dernière version](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest)

## L'idée

Mon [kDrive](https://www.infomaniak.com/fr/kdrive) se remplissait, alors que je n'y ajoutais presque rien. En cherchant un peu, le coupable est vite apparu : les **anciennes versions** des fichiers. À chaque modification, kDrive garde une copie de l'ancienne version, ce qui est très pratique pour revenir en arrière, mais beaucoup moins quand un fichier modifié tous les jours finit par peser plusieurs fois sa taille.

<!-- TODO Sylvain : chiffre réel -->
Au total, ces versions occupaient XX Go sur mon drive.

Problème : l'interface web d'Infomaniak ne montre pas quels dossiers sont concernés, et ne permet de supprimer les versions qu'une par une, fichier par fichier. 😩

En revanche, Infomaniak propose une [API](https://developer.infomaniak.com/docs/api) qui permet de lister les fichiers, leurs versions, et de les supprimer. De quoi se faire un petit outil !

## kdvc

`kdvc` (pour _kDrive Version Cleaner_) est une petite application en terminal, écrite en [Rust](https://www.rust-lang.org/) avec [ratatui](https://ratatui.rs/). Elle scanne le drive une première fois, garde l'arborescence dans un cache SQLite local, puis affiche :

- des statistiques globales : nombre de fichiers, espace occupé par les anciennes versions ;
- un explorateur, avec le poids des versions cumulé par dossier ;
- le top des fichiers dont les versions prennent le plus de place ;
- une recherche par nom, extension, taille ou nombre de versions ;
- le journal des suppressions, exportable en CSV.

Pour faire le ménage, on sélectionne un fichier ou un dossier, et on choisit une règle : garder les N dernières versions, supprimer celles de plus de X jours, ou tout supprimer sauf la version courante.

## Supprimer, oui, mais prudemment

Un outil qui supprime des données en masse, ça mérite quelques garde-fous. Voici ceux que je me suis fixé :

- **La version courante n'est jamais supprimée.** L'API ne renvoie normalement que les anciennes versions, mais l'outil vérifie que la liste correspond exactement à ce que le scan a vu. Au moindre doute, la plus récente est protégée : au pire, on garde une version de trop.
- **Les versions marquées « conservées pour toujours » ne sont jamais touchées.**
- **Toute suppression passe par un aperçu**, qui liste les versions concernées et l'espace libéré, puis par une confirmation où il faut taper `oui`.
- Les suppressions se font **une par une**, et chacune est inscrite au journal, qu'elle ait réussi ou non.
- Une suppression n'est **jamais rejouée** après un timeout : le serveur a pu l'appliquer.

L'API est aussi limitée à 60 requêtes par minute. L'outil espace donc ses appels, et affiche une estimation du temps restant pendant le scan et le chargement des versions.

## Écrit avec un agent de code

<!-- TODO Sylvain : à reformuler avec ton ressenti -->
Ce projet est aussi l'occasion d'un test : je l'ai développé avec un agent de code ([Claude Code](https://www.anthropic.com/claude-code)), en deux jours. Mon rôle a surtout été de fixer les règles, puis de relire.

Les règles sont écrites dans un fichier [AGENTS.md](https://github.com/sylvainmetayer/kdrive-version-cleaner/blob/main/AGENTS.md) : architecture, conventions, et surtout les invariants de sécurité ci-dessus, qui ne doivent jamais être cassés. Toute modification des règles de suppression doit être accompagnée de tests, et les essais de bout en bout se font contre un faux serveur, jamais contre mon vrai drive.

Le code est ensuite passé par neuf code reviews successives, chacune corrigeant son lot de cas limites (pagination, dossier renommé pendant un scan, erreurs réseau…). La CI fait le reste : tests sur Linux, macOS et Windows, clippy, couverture, cargo-deny, CodeQL et SonarQube Cloud.

## Installation

Le plus simple est de passer par [mise](https://mise.jdx.dev) :

```sh
mise use -g github:sylvainmetayer/kdrive-version-cleaner
```

Des binaires pour Linux, macOS et Windows sont aussi disponibles sur la [page des releases](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest), avec leur somme SHA-256 et une attestation de provenance.

Il faudra ensuite créer un [token d'API Infomaniak](https://manager.infomaniak.com/v3/ng/profile/user/token/list) avec le scope `drive` (et `accounts` pour que l'outil trouve vos comptes tout seul), puis l'exporter dans `KDRIVE_TOKEN`. Le [README](https://github.com/sylvainmetayer/kdrive-version-cleaner#readme) détaille le reste.

Les sources du projet sont disponibles sur [Github](https://github.com/sylvainmetayer/kdrive-version-cleaner).
