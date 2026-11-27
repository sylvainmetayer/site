---
title: "Planning Équipes : du tableur au solveur"
metaTitle: "Planning Équipes sous le capot : Quarkus, Timefold, Angular · Sylvain"
date: "2026-11-24"
draft: true
tags:
  - projet
  - java
  - quarkus
  - timefold
  - angular
  - ia
excerpt: "Comment les règles d'un planning d'événement sont modélisées pour un solveur, trois décisions d'architecture, et ce que donne un projet développé avec des outils d'IA."
metaDesc: "Planning Équipes côté technique : contraintes Timefold, Quarkus dans la même JVM, cloisonnement par édition, diagnostic, passé figé, et développement assisté par IA."
---

Cet article est la suite technique de [la présentation de Planning Équipes](/article/planning-equipes/), l'outil qui affecte des animateurs à des stands. Il s'adresse aux développeurs ; pour le produit, c'est l'autre article qu'il faut lire.

Le point de départ : un tableur Excel très optimisé, qui demandait plusieurs dizaines d'heures de mise à jour à chaque édition d'un festival, et qui cassait au moindre changement de dernière minute. Ce que je voulais, c'était déclarer les règles une fois, et laisser un programme chercher le planning.

## Du tableur au solveur

Dans un tableur, une règle est une formule quelque part, et un planning est un état qu'on corrige à la main. Un solveur inverse la logique : on décrit le problème et les règles, et il cherche une solution.

J'ai utilisé [Timefold Solver](https://timefold.ai/), avec le modèle classique du *shift rostering* : des animateurs, des stands, des créneaux, et des places à pourvoir ([`PosteAffectation`](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/main/java/dev/sylvain/planning/domain/PosteAffectation.java)) dont le solveur choisit le titulaire. Les noms de classes restent en français métier.

Les règles sont des contraintes, rangées sur trois niveaux du [`HardMediumSoftScore`](https://docs.timefold.ai/timefold-solver/latest/constraints-and-score/score-calculation) de Timefold, d'après [`docs/contraintes.md`](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/contraintes.md) :

- **dur** : bloquant (le cadre légal des mineurs, les repas, une place pourvue) ;
- **medium** : fortement pénalisé et signalé à l'organisateur ;
- **soft** : une préférence, qui départage deux plannings valides.

![Page Règles du planning, onglet Légal : un tableau des règles avec leur référence, un interrupteur pour les activer, leurs réglages numériques (durées, pauses) et l'état de chaque règle](/images/planning-equipes/regles.webp "Les règles dures côté interface : on les active, on règle leurs seuils.")

Le dépôt a pour règle de ne jamais reclasser une contrainte dure en medium ou soft sans validation explicite, surtout si elle touche aux mineurs. Le catalogue ([`ConstraintCatalog`](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/main/java/dev/sylvain/planning/solver/ConstraintCatalog.java)) compte 43 contraintes.

Deux choix de modélisation m'ont paru importants :

- **Le statut de mineur n'est jamais stocké.** Il est dérivé de la date de naissance à la date du créneau, parce que trois régimes différents en dépendent et qu'un booléen se désynchronise.
- **Les pauses sont les trous entre les vacations.** Les journées d'ouverture sont découpées en vacations, et la pause qui coupe un travail continu se règle depuis l'écran des règles.

![Vue en rail d'une journée : une ligne par animateur et une frise horaire de 10:00 à 18:00 sur laquelle chaque vacation est une barre colorée par typologie de stand](/images/planning-equipes/rail.webp "Le rail : les vacations de chacun sur la journée, une place par stand et par créneau.")

Les règles qui lient plusieurs jours (repos entre deux journées, cumul d'heures sur la semaine, pause entre deux vacations) se mesurent sur le passé autant que sur l'avenir. Cela a des conséquences, que je décris plus bas avec le passé figé.

![Page Solveur : ce que le prochain calcul prendra en compte, les boutons pour calculer le planning, corriger après un changement ou recommencer de zéro, et la lecture du score du dernier calcul](/images/planning-equipes/film-calcul.webp "La page Solveur, d'où l'on lance un calcul.")

### Pourquoi la même JVM

D'après [`docs/architecture.md`](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/architecture.md), c'est un seul service Quarkus (Java 25) qui embarque le solveur Timefold dans la même JVM, sert le frontend Angular statique, et parle à PostgreSQL. Pas de micro-service, pas de serveur Node en production.

La documentation décrit ce choix sans l'argumenter. Son revers, que l'ADR de cloisonnement assume : un seul calcul à la fois pour toute l'instance, parce que deux solveurs Timefold simultanés dans la même JVM ne sont pas prévus par le dimensionnement mémoire. Quand ce n'est pas assez, le calcul peut être confié à un worker sur une autre machine, avec la même image.

<!-- TODO: la raison de départ du choix Quarkus + Timefold (familiarité avec Java, autre option écartée ?). Les docs décrivent le choix mais pas son origine. -->

## Trois décisions d'architecture

Le dépôt tient un journal de décisions ([`docs/decisions/`](https://github.com/sylvainmetayer/planning-equipes/tree/main/docs/decisions)), une par fichier. En voici trois.

### Cloisonner par édition

Au début, la base ne contenait qu'un seul référentiel (stands, animateurs, paramètres, planning). Préparer l'édition suivante revenait à écraser la précédente, et le résultat du solveur qu'on aurait voulu relire avec elle.

La décision ([ADR 0001](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0001-cloisonnement-par-edition.md)) : toutes les tables métier portent un `edition_id`, avec une clé primaire composite `(edition_id, id)`. Les identifiants métier saisis à la main (le nom d'un stand, par exemple) peuvent ainsi être les mêmes d'une année sur l'autre sans collision. L'autre solution, préfixer les identifiants, aurait pollué les URLs et les fichiers de scénario.

Le serveur sait quelle édition est demandée grâce à un en-tête `X-Edition-Id` (lu par [`EditionHeaderFilter`](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/main/java/dev/sylvain/planning/api/EditionHeaderFilter.java)) envoyé à chaque requête, et non par un drapeau « actif » en base : deux onglets peuvent ainsi travailler sur deux éditions différentes.

Ce que je trouve le plus intéressant, c'est le garde-fou. Un bug a laissé passer une requête sans prédicat d'édition, et un test ([`IsolationEditionStructurelleTest`](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/test/java/dev/sylvain/planning/service/IsolationEditionStructurelleTest.java)) lit désormais le SQL de tout le backend et échoue sur toute requête visant une table métier sans ce prédicat. Le filet est structurel, pas humain. L'ADR note aussi ses limites : ce que le test ne sait pas lire le fait échouer au lieu d'être ignoré en silence, et le SQL passé par un `Statement` nu n'est couvert nulle part.

Cette décision a ensuite été révisée ([ADR 0009](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0009-edition-unique-porteur-de-variantes.md)) : une édition est maintenant l'unique porteur de variantes d'un plan. L'ADR garde la trace du raisonnement d'origine, ce qui est utile pour comprendre pourquoi le modèle est ce qu'il est.

### Un diagnostic qui ne dépend pas de l'offre du solveur

Le diagnostic (« quelles contraintes sont violées, combien de fois, par quels postes ») reposait sur `SolutionManager.analyze()`, qui est réservé à l'édition Enterprise de Timefold à partir de la version 2.x. Chaque écran de diagnostic ajouté rendait la migration plus coûteuse.

L'[ADR 0002](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0002-diagnostic-decouple-du-solveur.md) proposait deux implémentations, une détaillée et une dégradée. L'[ADR 0013](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0013-diagnostic-par-le-score-director.md), qui la remplace, retient mieux : l'examen de la bibliothèque a montré que seule la façade `analyze()` est verrouillée, pas le score director qui fait le travail. Il y a donc une seule analyse, produite par le score director, exposée par [`ConstraintDiagnosticService`](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/main/java/dev/sylvain/planning/service/diagnostic/ConstraintDiagnosticService.java) sous un type que le projet possède. L'ancienne implémentation reste comme oracle : un [test de contrat](https://github.com/sylvainmetayer/planning-equipes/blob/main/src/test/java/dev/sylvain/planning/service/diagnostic/ConstraintDiagnosticServiceContractTest.java) les compare sur un planning de référence et échoue si elles divergent.

La contrepartie est notée dans l'ADR : une dépendance à `ai.timefold.solver.core.impl`, qui n'est pas couverte par semver.

![Page Diagnostic, onglet Problèmes : lecture du score, compteurs (0 bloquant, 6 avertissements, 1 mineur) et pour chaque problème les endroits concernés avec des actions suggérées](/images/planning-equipes/diagnostic.webp "Le diagnostic : ce qui bloque, ce qui manque, ce qui est fragile.")

### Le passé est figé

Un événement est en cours. Un désistement tombe, l'organisateur relance un calcul, et le solveur réécrit une journée déjà travaillée parce qu'il y trouve un meilleur score. Le planning enregistré ne dit plus ce qui s'est passé, et les gens reçoivent un « votre emploi du temps a changé » pour une journée derrière eux.

L'[ADR 0044](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0044-le-passe-est-fige.md) pose trois faits : personne ne peut tenir hier, le passé conditionne la suite (repos, heures, jours d'affilée), et le passé ne se corrige pas. La solution écartée est de retirer le passé du problème, ce qui permettrait demain ce que hier interdit. À la place, toute résolution reprend du plan enregistré les places des créneaux commencés et les épingle. L'[ADR 0066](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/decisions/0066-le-passe-est-fige-a-la-minute.md) l'a ensuite affiné : le passé est figé à la minute, pas au créneau.

## Construit avec l'IA

Le [README](https://github.com/sylvainmetayer/planning-equipes/blob/main/README.md) du projet le dit en deux phrases : il est développé avec l'assistance d'outils d'IA, sous revue humaine systématique ; les choix d'architecture, le modèle de domaine et l'interprétation du cadre légal sont assumés par l'auteur.

Ce que j'ai pu constater dans le dépôt :

- **Un fichier de consignes unique.** [`AGENTS.md`](https://github.com/sylvainmetayer/planning-equipes/blob/main/AGENTS.md) est la seule mémoire du dépôt pour tous les agents (Copilot, Claude Code, etc.) ; il interdit de recréer un `CLAUDE.md` ou un fichier d'instructions Copilot, fusionnés dedans. Les agents de relecture sont maintenus en double pour les deux écosystèmes, et doivent rester synchronisés.
- **Des garde-fous mécaniques.** Le document [`docs/memoire-du-projet.md`](https://github.com/sylvainmetayer/planning-equipes/blob/main/docs/memoire-du-projet.md) raconte en six temps le développement privé de juillet et août 2026, et indique qu'une bonne moitié des garde-fous mécaniques est née d'un défaut réellement rencontré (le test de cloisonnement en est un). Il évoque aussi une campagne de tests vérifiés par mutation.
- **Une règle d'écriture.** Ce document de mémoire s'interdit d'affirmer quoi que ce soit qui ne soit pas reproductible sur un scénario versionné.

Je ne tire pas de conclusion générale de tout ça. Ce que je peux dire : avec cet outillage, la relecture humaine compte davantage que la génération, et ce qui tient dans la durée, ce sont les tests et les décisions écrites.

<!-- TODO: ton retour d'expérience personnel sur le développement assisté (ce qui a bien marché, ce qui a posé problème, ce que tu referais). Je n'ai que ce que disent le README et les docs. -->

## Pour aller plus loin

- [le code source](https://github.com/sylvainmetayer/planning-equipes), avec le journal de décisions dans `docs/decisions/`
- [la présentation du produit](/article/planning-equipes/)
- [comment marche le calcul](https://planning.sylvain.dev/comment-marche-le-calcul/), côté utilisateur
