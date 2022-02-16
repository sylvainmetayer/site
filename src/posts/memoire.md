---
title: "Rédaction d'un mémoire de fin d'étude"
date: 2019-03-17T00:00:00.000Z
metaDesc: Ma dernière année d'étude à l'EPSI Bordeaux signifie également la rédaction d'un mémoire. Afin d'assurer un suivi efficace des tuteurs EPSI, il est demandé aux étudiants de donner des états d'avancements, à des dates jalons, afin que les tuteurs puissent recadrer l'étudiant s'il part dans une mauvaise direction.
excerpt:  Ma dernière année d'étude à l'EPSI Bordeaux signifie également la rédaction d'un mémoire. Afin d'assurer un suivi efficace des tuteurs EPSI, il est demandé aux étudiants de donner des états d'avancements, à des dates jalons, afin que les tuteurs puissent recadrer l'étudiant s'il part dans une mauvaise direction.
tags:
    - epsi
---

Ma dernière année d'étude à l'EPSI Bordeaux signifie également la rédaction d'un mémoire. Afin d'assurer un suivi efficace des tuteurs EPSI, il est demandé aux étudiants de donner des états d'avancements, à des dates jalons, afin que les tuteurs puissent recadrer l'étudiant s'il part dans une mauvaise direction.

J'ai donc décidé de rédiger sur ce blog les avancées de mon mémoire, afin de permettre de garder une trace des étapes de réalisation de ce dernier.

L'objectif est de publier un article, même court, par semaine, indiquant les recherches effectuées, les difficultés rencontrées, notes diverses et variées...

Aux niveaux des différents jalons imposés, les voici :

- [x] 29 mars - première point sur mon mémoire avec mon tuteur EPSI
- [ ] 26 avril - 2ème point sur mon mémoire avec mon tuteur EPSI
- [ ] 31 mai - 3ème point sur mon mémoire avec mon tuteur EPSI
- [ ] 28 juin - 4ème point sur mon mémoire avec mon tuteur EPSI
- [ ] 15 juillet - Rendu du mémoire
- [ ] Début Septembre - Soutenance de mémoire

Concernant le document attendu pour le premier rendez-vous tuteur, voici ci-dessous les éléments attendus.

## Le contexte de l’alternance ainsi que les activités menées en stage ou alternance et le sujet principal des missions d’alternance

J'effectue mon alternance au sein de [onepoint](https://groupeonepoint.com).

Le projet sur lequel je travaille actuellement comporte une équipe de 5 personnes, et nous effectuons le MCO[^2] ainsi que l’ajout de fonctionnalités d’une application web de certification et d’audit pour un client, Bureau Veritas. Cette application est développée avec Symfony (PHP) pour le back-office et AngularJS pour le front-office. De plus, l’architecture du projet est basée sur Docker.

Le back-office était initialement en Symfony 2, et nous avons procédé à sa montée de version, passant ainsi de PHP5 à PHP7 et de Symfony 2.8 à Symfony 3.4.

Également, j’interviens ponctuellement sur le front-office, après avoir reçu une formation en interne, pour des correctifs mineurs.

J’ai également mis en place un LDAP avec un container Docker dans l’environnent de développement, afin de pouvoir tester le comportement du LDAP sans avoir à atteindre les tests en recette ou en plateforme d’intégration.

J'ai auparavant travaillé sur 2 projets.

Le premier était un projet pour un client qui restera inconnu, pour des clauses commerciales liées au contrat. Ce projet consistait à la refonte d'un espace membre, avec un système de souscription, d'avantage, de quizz et de campagne email avec l'aide d'Adobe Campaign. Ce projet a été réalisé avec Drupal 8, un CMS[^3] PHP.

Le second projet est un ensemble de sous projet, consistant à la refonte des sites de la région Nouvelle-Aquitaine, également sous Drupal 8. Ce choix était une contrainte client, puisque tous les utilisateurs (rédacteurs, traducteurs, ...) sont déjà habitués à l'interface d'administration de Drupal 7, et qu'un changement aurait impliqué des frais de formation à un nouvel outil, pas forcément nécessaire et valable.

Les sites auquels j'ai participé sont la refonte du [site des transport de la région](https://transports.nouvelle-aquitaine.fr/fr) ainsi que la première version d'une régie publicitaire.

## Le sujet ou projet d’étude envisagé

Concernant mon avancée, j'ai défini mon sujet, qui est le suivant : **Comment l'automatisation peut permettre de réduire les erreurs humaines dans la mise en oeuvre d'une application ?**

Ce sujet va donc concerner en grande partie le déploiement et l'intégration continue d'une application (web, étant donné qu'il s'agit du domaine dans lequel je travaille), du poste du développeur, en passant par les tests automatisés, intégration, recette, pré-production et jusqu'à la phase de production.

Néanmoins, je compte également aborder le sujet de l'automatisation au sein d'une équipe de développeur, afin de faciliter le travail de chacun, et réduire les potentielles erreurs manuelles, que ce soit au niveau des hooks git, des linters, de l'automatisation possible avec des IDE, ...

Je compte également parler de l'automatisation au niveau de l'entreprise, sa mise en place, les personnes réticentes à convaincre pour mettre en place de tel système, le pour et le contre, ainsi que les impacts possible sur les KPI[^1].

## Les compétences professionnelles acquises ou en cours d’acquisition pour ce sujet ou projet d’étude

Ce sujet sera donc assez théorique, mais portera également une partie pratique.

D'une part avec la légère l'expérience personnelle que j'ai avec ce domaine, ou j'ai automatisé certains projets, tel que par exemple [qu'un chatbot réalisé en 4ème année](/projet/projets-epsi/#bot-telegram), ou encore [ma découverte d'Ansible](/projet/ansible), avec lequel j'ai automatisé l'installation d'un serveur Debian.

D'autre part avec le projet sur lequel je suis en train de travailler lors de mon alternance à [onepoint](https://groupeonepoint.com). L'objectif est de faire plus ou moins une refonte, ou du moins une amélioration de la chaine d'industrialisation.

Ce projet va être pour moi une opportunité de pouvoir me confronter à des problématiques réelles d'entreprises, et monter en compétences sur tous les domaines concernant l'intégration et le déploiement continu. Ce projet devrait être lancé dans les semaines à venir.

## Une ébauche de plan

Une première ébauche de plan à déjà été effectuée en décembre, et a continuée d'être agrémentée d'idées, remaniée, ...

Le brouillon est disponible [sur Github](https://github.com/sylvainmetayer/epsi-memoire/issues/8), et en voici son contenu, à ce jour :

0. Introduction
1. Historique
2. Pourquoi automatiser
3. Etat de l'art
4. Automatiser un projet
    1. Localement
    2. Intégration continue
    3. Déploiement continu
    4. Tests
5. Bénéfices constatés
6. Limites
7. Conclusion

[Le PDF de l'état actuel de mon mémoire peut-être consulté ici](https://github.com/sylvainmetayer/epsi-memoire/releases/latest)

## Une première liste bibliographique détaillée

Je suis ainsi en train de lire deux livres :

- The Phoenix Project, plus sur la partie gestion de projet, qui aborde les interactios entres les différentes personnes impliquées dans un projet, et les conditions de succès d'un projet.
- The DevOps Handbook, que je viens de commencer, traitant du monde DevOps, et de la façon de déployer des applications de façon continue.

De plus, le livre [Le plan Copenhague](https://leanpub.com/6cloud/) est un livre numérique, en cours de rédaction, très intéressant sur la façon de migrer des sites sous "Le cloud".

Le site [12Factor](https://12factor.net/) contient également des ressources intéressantes.

Je prévois également de lire un livre traitant d'Ansible, afin d'en savoir plus à ce sujet.


Voici pour cette première édition à propos de mon avancée sur mon mémoire.

Si vous avez des retours ou idées d'amélioration, remarques constructives, n'hésitez pas à laisser un commentaire ou [contactez moi](mailto:{{site.email}}?subject=Commentaire sur le mémoire) !

[^1]: Key Performance Indicator, indicateur clé de performance
[^2]: Maintien en condition opérationnelle
[^3]: Content Management System
