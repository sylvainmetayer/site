---
title: 'Gestionnaire d''alias d''emails'
layout: post
tag:
  - angular
  - serverless
author: sylvainmetayer
star: true
enable_comments: true
date: 2020-01-27
repost: dev.to
excerpt: Trop de spam ? Marre de donner son addresse email à chaque service ? Les alias mail sont là à la rescousse ! 
---

[![](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sylvainmetayer/alias-gandi-angular)

## L'idée

{{ page.excerpt }}

Suite à une idée d'[Adrien Chinour](https://adrienchinour.me), j'ai décidé de créer à mon tour un petit gestionnaire d'alias pour mes adresses emails. L'objectif est de pouvoir générer rapidement des alias afin de ne pas donner sa véritable adresse email lors d'inscription sur des sites divers. Ainsi, si l'on constate que le site envoie un peu trop de mail à notre goût, que l'on utilise plus le service, ou que réussir à se désinscrire relève du parcours du combattant, on supprime l'alias, et plus de mail indésirables !

Ayant mes domaines gérés par [Gandi](https://gandi.net), j'ai regardé comment interagir avec mes adresses emails pour créer des alias depuis leur [API](https://api.gandi.net/docs/).

Au niveau des technologies utilisées, j'ai utilisé [Angular](https://angular.io) et les fonctions serverless de [Netlify](https://netlify.com) (en NodeJS) afin de gérer les appels à l'API Gandi.

Le principe est très simple: on s'authentifie avec un mot de passe, prédéfini dans les variables d'environnements des fonctions serverless de Netlify, on obtient un JWT Token signé avec un secret connu seulement par les fonctions serverless, et on peut ensuite considéré que l'on est authentifié. N'ayant pas besoin de gérer plusieurs utilisateurs, cela convient à mon cas d'utilisation.

Une fois authentifé, les fonctions serverless se chargent de récupérer la liste des domaines, ainsi que la listes des boites mails associées à ces domaines et on arrive ensuite sur l'écran suivant, qui nous permet de gérer les alias de chaque boite mail.

{% asset alias-email-desktop.png alt='Rendu bureau' %}

## La suite

Dans le cas ou d'éventuels clients de Gandi souhaiteraient utiliser ce projet, j'ai tenté d'intégrer l'Oauth2, afin de permettre de s'authentifier via Gandi. Cela m'a également permis de comprendre mieux le fonctionnement de l'Oauth2. 

J'ai donc demandé la création d'une application, obtenant ainsi un `applicationId` et un `applicationSecret` me permettant de mettre en place l'authentification. Afin de tester cela en local, j'ai utilisé un [mock oauth2 réalisé par le groupe AXA](https://github.com/axa-group/oauth2-mock-server)

Malheureusement, l'API v5 de Gandi est encore en beta et le fournisseur d'authentification ne permet pas encore d'interagir avec les domaines et boites mails. {% fa_svg fas.fa-sad-tear %} 

En attendant que cela soit disponible, j'ai laissé mon travail disponible sur une [branche dédiée](https://github.com/sylvainmetayer/alias-gandi-angular/tree/feature/oauth2). 

J'ai également ajouté un bouton de déploiement Netlify en un clic pour ceux souhaitant se servir de ce petit projet. Il faudra néanmoins générer sa propre clé d'[API depuis les paramètres de son compte Gandi](https://docs.gandi.net/fr/noms_domaine/utilisateurs_avances/api.html) et renseigner quelques variables d'environnement, décrite ci-dessous.

|Paramètre|Description|
|--|--|
|GANDI_API_KEY|Clé d'API Gandi|
|JWT_SECRET|Une chaine de caractères aléatoire utilisée comme secret JWT|
|LOGIN_PASSWORD|Le mot de passe souhaité pour se connecter|
|GANDI_API_HOST|La racine de l'URL de l'API Gandi : `api.gandi.net` |
|GANDI_API_VERSION|La version de l'API Gandi : `/v5`|

Pour générer le JWT Secret, la commande suivante peut être utile

`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`


Les sources du projet sont disponibles sur [Github](https://github.com/sylvainmetayer/alias-gandi-angular)
