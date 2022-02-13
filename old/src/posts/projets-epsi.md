---
title: 'Projets réalisés - EPSI Bordeaux'
date: '2017-07-31'
tags:
  - android
  - javascript
  - php
  - epsi
  - projet
metaDesc: "Le présent article liste les différents projets que j'ai pu réaliser durant mes deux années à l'EPSI Bordeaux"
excerpt: "Le présent article liste les différents projets que j'ai pu réaliser durant mes deux années à l'EPSI Bordeaux"
---

Le présent article liste une partie des projets que j'ai pu réaliser durant mes deux années à l'EPSI Bordeaux. La plupart du code réalisé sur ces deux années est disponible au sein de l'organisation Github [EPSIBordeaux](https://github.com/EPSIBordeaux)

## Open innovation

> {{ "2019-02-25" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/memoryProject) [Tester l'application](https://expo.io/@sylvainmetayer/memoryProject)

Ce projet, réalisé en équipe s'inscrivait dans la démarche Open Innovation de l'EPSI, impliquant plusieurs promotions et nécessitant donc d'être organisé. L'objectif était de réaliser un jeu de "Jeu dont vous êtes le héro" sur mobile, en laissant la possiblité de personnaliser simplement le parcours de jeu.

Nous avons développé la première version avec [React Native](https://facebook.github.io/react-native/) afin de fournir un support pour Android et iOS.

## AR-Cube

> {{ "2019-02-01" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/ar-cube) [Testez le sur mobile !](https://epsibordeaux.github.io/ar-cube/)

Ce projet, réalisé avec une équipe de 4 personnes avait pour objectif d'être une introduction à la réalité augmentée.

A l'aide de la librairie Javascript [AR.js](https://github.com/jeromeetienne/AR.js), il fallait réaliser le dessin d'un cube en réalité virtuelle, lorsque les marqueurs était détécté à l'aide de la caméra du téléphone utilisé. Il fallait également que ce dernier puisse évoluer si l'on venait à bouger le téléphone.

Pour tester le résultat, imprimez le patron du cube présent sur le dépôt Github. Colorier les faces de différentes couleurs et rendez-vous sur [cette adresse](https://epsibordeaux.github.io/ar-cube/) depuis votre mobile. Après avoir autorisé l'usage de la caméra, pointez votre téléphone vers le patron et observez le résultat !

## Earthquake

> {{ "2019-02-01" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/earthquake) [Voir le résultat](https://epsibordeaux.github.io/earthquake/)

Ce projet, réalisé avec une équipe de 3 personnes avait pour objectif d'être une introduction à WebGL

A l'aide de la librairie Javascript [three.js](https://threejs.org/), il fallait réaliser une carte du monde indiquant les différents séimes (récupéré à l'aide de l'API [Earthquake.usgs.gov](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson)) ainsi que leur gravité/épicentre.

## Pong

> {{ "2018-09-30" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/temps-reel)

Ce projet, réalisé en binome durant ma formation à l'EPSI avait pour but de concevoir un jeu avec un système temps réel.

Nous avons donc décidé de réaliser un pong, en utilisant l'API mise à notre disposition pour ce projet.

![Illustration du jeu de Pong](/images/pong.png)

## Système Expert

> {{ "2018-05-20" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/epsi-expert-system)

Ce projet avait pour but de concevoir un système expert capable de détecter des formes (rectangle, carré, triangle, ...).

Pour ce faire, nous avions à notre dispositions une base de fait et de règles. Pour résoudre le problème, nous ajoutons nos faits et faisons tourner notre algorithme avec la base de règles, qui va comparer les différentes conditions et retourner la bonne réponse.

Le projet a été réalisé avec NodeJS et a été testé avec [Cypress](https://www.cypress.io/).

## Bot Telegram

> {{ "2018-03-30" | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/Telegram_Bot) [~~Parler avec le Bot~~ Bot hors ligne](https://telegram.me/EPSI_UsainBot)

Ce projet, réalisé en binome, avait pour but de réaliser un chatbot de recrutement.

Nous avons choisi de réaliser ce bot sur la plateforme [Telegram](https://telegram.org/). L'objectif du bot était de poser quelques questions de développement puis de réseau afin de déterminer le niveau du candidat. Si le candidat a un niveau suffisant, alors une proposition lui ai faite et il est invité à renseigner ses coordonnées pour être recontacté. Dans le cas contraire, on lui demande s'il souhaite laisser ses coordonnées afin d'être recontacté lorsque de nouvelle offres seront disponibles.

## Machine Learning

> {{ '2018-02-20' | date }}

[Sources (Github)](https://github.com/EPSIBordeaux/epsi-expert-system)

Ce projet, réalisé en binome durant ma formation à l'EPSI avait pour but de découvrir le fonctionnement des algorithmes de machine learning.

<video controls muted preload="metadata" width="600" height="400">

  <source src="/images/machine_learning.mp4"
            type="video/mp4">

    Désolé, votre navigateur ne permet pas de lire la vidéo.

</video>
