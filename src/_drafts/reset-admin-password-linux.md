---
title: "Réinitialiser un mot de passe administrateur sous linux"
layout: post
tag:
- linux
category: blog
author: sylvainmetayer
description: "Réinitialiser le mot de passe administrateur de sa machine Linux peut parfois être nécessaire, dans le cas d'un oubli de mot de passe par exemple."
hidden: false
star: true
published: false
enable_comments: true
---

{{ page.description }}

> Attention : Ce post explique la façon de procéder, dans une démarche pédagogique. Il est bien sur évident que reproduire cela sur une machine qui ne vous appartient pas est illégal, et engage votre responsabilité.

Cette méthode est uniquement valable si la partition sur laquelle est présente le système d'exploitation n'est pas chiffrée. Dans le cas contraire, le mot de passe de chiffrement du disque sera demandé avant le démarrage de la partition. Si vous avez donc oublié le mot de passe du chiffrement de votre disque, il faudra se tourner vers d'autres méthodes, celle-ci ne vous sera pas utile.

Afin de comprendre comment réinitialiser le mot de passe, quelques détails sur le démarrage de linux.

# TODO

- rd.break et les différents mode de démarrage (classique, dégradé, et dernier recours)
- monter la partition en lecture/écriture
- chroot et update du mot de passe
- reboot
- ajout de lien/sources
