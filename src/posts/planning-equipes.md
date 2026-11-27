---
title: "Planning Équipes, un outil pour planifier animateurs et bénévoles"
metaTitle: "Planning Équipes : planifier animateurs et bénévoles · Sylvain"
date: "2026-11-24"
draft: true
tags:
  - projet
  - open-source
excerpt: "Planning Équipes place automatiquement des animateurs sur des stands en tenant compte des règles du travail, des disponibilités et de l'équité de charge. Voici ce qu'il fait."
metaDesc: "Présentation de Planning Équipes, un outil libre (AGPL-3.0) qui affecte automatiquement animateurs et bénévoles aux stands d'un événement."
---

Sur un événement associatif, j'ai vu le fichier Excel qui servait à faire le planning des équipes. Un fichier « de l'enfer », au sens le plus admiratif : très optimisé, avec des années de réglages dedans. Il faut saluer la personne qui le maintient, parce que ce n'est pas un travail qu'on fait à la légère.

Mais il fallait plusieurs dizaines d'heures pour le remettre à jour à chaque édition, la complexité était énorme, et un changement de dernière minute pouvait tout casser. Je me suis dit qu'on pouvait faire mieux. C'est comme ça qu'est né [Planning Équipes](https://planning.sylvain.dev/), déjà utilisé pour un festival.

Sa promesse, telle qu'elle est écrite sur le site : « Planifiez en minutes, pas en week-ends. »

## À quoi ça sert

On décrit un événement : des stands, des horaires, des animateurs avec leurs compétences et leurs disponibilités. L'application place ensuite les personnes sur les créneaux, en tenant compte du cadre légal (notamment pour les mineurs), des compétences, des disponibilités et de l'équité de charge entre animateurs.

![Page Planning de l'application pour le premier jour : un tableau avec une ligne par stand et deux colonnes de créneaux (10:00-13:00 et 14:00-18:00), les noms des animateurs affectés dans chaque case](/images/planning-equipes/planning.webp "La grille d'une journée : les stands en lignes, les créneaux en colonnes, avec le scénario fictif de démonstration.")

Le site met en avant trois types d'événements : festivals, salons et foires, événements sportifs.

## Les règles du travail, prises en compte

L'outil tient compte des règles du travail des mineurs : durées, pauses, horaires. Elles suivent l'âge de la personne à la date de chaque créneau, pas un simple « mineur oui ou non ». Le détail est sur la page [Code du travail](https://planning.sylvain.dev/code-du-travail/) du site.

Pour les bénévoles, les règles s'appliquent par défaut. Une organisation peut en désactiver une, mais l'outil lui demande de confirmer son choix.

![Page Règles du planning, onglet Légal : une liste de règles avec leur référence au Code du travail, un interrupteur pour l'activer, les réglages éventuels (durée maximale, durée de pause) et l'état de chaque règle, toutes tenues](/images/planning-equipes/regles.webp "Les règles du planning : chacune peut être activée ou non, avec ses réglages.")

## Le jour J

Le site décrit neuf écrans : état de l'édition, planning de la journée, vue en rail, planning par personne, horaires des stands, règles, diagnostic, diffusion et un affichage « mural » pour une régie.

Le jour même, on saisit une absence, l'écran montre le créneau vide et propose des remplaçants éligibles. C'est précisément le cas qui faisait casser le tableur.

![Affichage mural pour une salle de contrôle : l'heure en grand (15:00) et des cartes par stand avec le créneau et les prénoms des animateurs présents](/images/planning-equipes/mural.webp "L'affichage mural, pensé pour une salle de contrôle le jour J.")

## Côté animateurs

Chaque animateur reçoit un code par email et accède à son espace depuis un navigateur, sans rien installer. Il peut confirmer sa présence, voir son planning et ses coéquipiers, et proposer un échange de créneau. Le planning s'exporte en PDF avec un QR code ou en abonnement calendrier, et les annonces peuvent partir vers Slack, Discord, Matrix ou Telegram, « avec des chiffres et jamais de noms ».

![Planning d'une personne sur la semaine : une ligne par animateur, une colonne par jour, avec le stand et l'horaire de chaque vacation](/images/planning-equipes/personne.webp "Le planning par personne, vu côté organisateur, sur la semaine.")

## Libre, et à héberger chez soi

Le code est sous licence AGPL-3.0, sources sur [GitHub](https://github.com/sylvainmetayer/planning-equipes). On peut héberger l'outil soi-même, ou le faire héberger ; le site ne donne pas de prix, le devis dépend de la taille de l'événement.

Côté technique, c'est du Java (Quarkus, Timefold), du PostgreSQL et de l'Angular. Le détail pour les développeurs fera l'objet d'un second article.

<!-- TODO: décommenter à la publication de B : Je raconte le détail dans [l'article pour les développeurs](/article/planning-equipes-technique/). -->

Le projet figure aussi dans [mes projets](/projets/#planning-equipes).

Il est développé avec l'aide d'outils d'IA, sous relecture humaine systématique ; les choix d'architecture, le modèle de domaine et l'interprétation du cadre légal restent les miens.

## Pour aller plus loin

- [le site](https://planning.sylvain.dev/)
- [les questions fréquentes](https://planning.sylvain.dev/questions/)
- [comment marche le calcul](https://planning.sylvain.dev/comment-marche-le-calcul/)

<!-- TODO: conclusion personnelle : ce que je retiens, suite prévue (facultatif). -->
