---
title: "Notre retour (Build & Deploy) sur Devoxx France 2024"
date: "2024-05-30"
tags:
  - devoxx
  - conference
  - kubernetes
excerpt: "Les conférences Build & Deploy qui nous ont marqués à Devoxx France 2024 : Gateway API, Kubernetes multi-régions, supply chain, eBPF, Vault et Boundary."
canonical: "https://dev.to/onepoint/notre-retour-build-deploy-sur-devoxx-france-2024-kg7"
originalPublisher: onepoint
coauthors:
  - cfarges
  - jtama
socialImage: "/images/devoxx-france-2024.jpg"
---

![Bannière de l'article](/images/devoxx-france-2024.jpg)

Après les retours de nos collègues, nous allons faire les notres sur la partie Build & Deploy de l'édition 2024 de Devoxx France. 

Et comme chaque année, le moins que l'on puisse dire, c'est qu'il y avait du choix, avec plusieurs dizaines de conférences sur les façons de packager et déployer nos applications ! Sans plus attendre, voici les sujets qui nous ont marqué avec [@cfarges](https://dev.to/cfarges) et [@jtama](https://dev.to/jtama) dans cette catégorie.

## GatewayAPI, 10 ans de maturation pour une nouvelle API Kubernetes

Cette année [Kévin Davin](https://www.linkedin.com/in/davinkevin/) est venu nous parler de la Gateway API. <3

En effet, avec pas mal de recul, le constat est clair : la ressource _Ingress_ n'est pas suffisante. Elle prend en charge trop de responsabilité, n'est pas suffisamment spécifique, laissant chacune de ses implémentations faire différent choix pour la même solution (manque de portabilité), et ne rend pas non plus suffisamment de service.

La Gateway API est orientée *rôle* avec plusieurs _kinds_:

- La _GatewayClass_:: Pour le provider, celui qui connait le réseau
- La _Gateway_ :: Pour le cluster operator, celui qui connait le cluster 🤷
- Les _GRPCRoute_ / _HTTPRoute_:: Pour les développeurs, ceux qui connaissent les applications.

Chaque personne ayant ses compétences, ses connaissances, ses responsabilités, et ses _kind_.

Cette api va suffisamment loin pour empiéter largement sur une partie des services offerts par les _service mesh_ (dont le traffic splitting).

[Replay](https://www.youtube.com/watch?v=zaLEpr0)

## Multi Kubernetes, Multi Régions, Au-secours !

[Aurélien Moreau](https://www.linkedin.com/in/aur%C3%A9lien-moreau-32075a105/) et [Nicolas Lavacry](https://www.linkedin.com/in/nicolas-lavacry-13a21415/) présentent, au travers d'un REX avec pour exemple une entreprise fictive, les besoins de leur nouvelle entreprise : CASDAL. Cette dernière a en effet 2 marchés : un marché américain, et un français. Comment gérer l'hébergement de cette application ? 

On découvre alors comment déployer un environnement Kubernetes sur plusieurs régions, et le besoin de créer plusieurs clusters pour assurer une latence faible, Kubernetes n'aimant en effet pas les latences si un continent sépare plusieurs noeuds. Leur démo, parfaitement maitrisée permet de nous montrer l'envers du décor et des outils/méthodes pour garantir qualité de service, latence faible et  l'intégrité de nos données !

[Replay](https://www.youtube.com/watch?v=ADp3fonoDWM)

## Notre dépendance à l'Open Source est effrayante. SLSA, SBOM et Sigstore à la rescousse

Cette conférence, très intéressante, nous montre à quel point nous dépendons de logiciels/dépendances tierces dans nos applications, sur lesquelles nous n'avons pas la main. Cela signifie-t-il pour autant qu'il faut les utiliser sans valider leur intégrité, pour éviter qu'un intermédiaire vienne injecter du code malveillant lors d'une étape de packaging de notre application ?

[Abdellfetah Sghiouar](https://www.linkedin.com/in/sabdelfettah/) nous présente alors des outils sur lesquels nous pouvons nous appuyer pour garantir la tracabilité de nos applications, tel que cosign pour signer nos images avant de les déployer dans notre cluster, ou encore SBOM pour lister tous les paquets utilisés dans notre application.

[Replay](https://www.youtube.com/watch?v=MEJ-ae_D8X4)

## Au cœur de la ruche eBPF!

J'avais déjà entendu parler plusieurs fois d'eBPF, sans vraiment savoir ce dont il s'agissait. Cette conférence était donc l'opportunité pour moi de creuser un peu le sujet ! Bien que très technique, [Mohammed Aboullaite](https://www.linkedin.com/in/aboullaite/) a bien expliqué le fonctionnement d'un module du kernel et l'évolution d'eBPF. Je ne pense pas avoir l'usage dès demain d'écrire mon propre module kernel, mais je comprends mieux toute la "hype" autour de ça et la plus-value d'eBPF afin de pouvoir simplifier la distribution d'un nouveau module, tout en ayant des performances natives et en gardant la même sécurité.

[Replay](https://www.youtube.com/watch?v=XaBbxb0r0fc)

## Le cauchemar des attaquants : une infrastructure sans secret

[Thibault Lengagne](https://www.linkedin.com/in/thibault-lengagne-76a35583/) nous montre comment s'appuyer sur Vault et Boundary afin de supprimer la plupart des mots de passes 
de nos environnements tout en conservant une approche "Secure by design" et avoir une traçabilité complète des différents accès aux composants applicatifs.

Avec une architecture Zero-Credentials, on dispose d'un seul mot de passe par utilisateur qui permettra d’accéder à travers Boundary 
à nos applications. L'association de Boundary et Vault permet de créer des identifiants temporaires et de garder une traçabilité complète des accès aussi bien en environnement de développement que jusqu'à la production.

Thibault nous montre une solution d'architecture et les bonnes pratiques associées à ces concepts. A travers plusieurs petites démo, on commence à avoir envie de déployer ça dans nos environnements après avoir vu la taille de l'équipe grandir.

Fini les rotations de mot de passe à n'en plus finir, on a un accès et le reste est géré par les politiques définies dans le code source de notre infrastructure.
 
[Replay](https://www.youtube.com/watch?v=U3AL2pqPg3I) 

## Check-list ultime pour rendre vos app cloud native

Dans cette conférence [Katia Himeur](https://www.linkedin.com/in/katiahimeur/) revient sur les différents contextes qui peuvent nous amener à déplacer nos applications sur le "cloud".

Elle nous rappelle que la définition du "cloud" peut être vastement différente suivant nos interlocuteurs. La complexité, la pléthore de solutions disponibles (plus de 2000 outils disponibles chez la CNCF par exemple) et la diversité des fournisseurs doivent être pris en compte lors d'un projet cloud, que ce soit pour une nouvelle application
ou le portage d'un existant.
 
Entre la méthodologie et le REX, la conférence de Katia est une mine d'informations et d'inspiration sur la manière d'aborder ce type de projet.

Les points présentés se situent autant au niveau de la technique que de l'humain, avec l'onboarding des équipes et la conduite du changement. Les principaux points durs de ces projets sont pris en compte, serait-ce la recette ultime ?
 
[Replay](https://www.youtube.com/watch?v=3s-gtziZ3UU)

## Le mot de la fin

Merci à [@onepoint](https://dev.to/onepoint) pour nous permettre de participer chaque année à ce moment privilégié !
N'hésitez pas à aller regarder les autres articles publiés par nos collègues sur les autres thèmes ! 

Retrouvez notre série d'articles sur Devoxx :

1. [Intro](https://dev.to/onepoint/devoxx-france-2024-8o)
2. [Frontend](https://dev.to/onepoint/notre-retour-frontend-sur-devoxx-2024-1jgg)
3. [Data/IA](https://dev.to/onepoint/mais-oui-ia-de-la-data-a-devoxx-france-2024--4kpe)
4. [Backend](https://dev.to/onepoint/notre-retour-backend-sur-devoxx-2024-4knc)
