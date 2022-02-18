---
title: Dotfiles
emoji: 🏠
metaDescription: Ce projet contient mes configurations personnelles versionnées ainsi que la configuration de ma petite infrastructure personnelle
date: 2022-02-15T00:00:00.000Z
summary: Ce projet contient mes configurations personnelles ainsi que la configuration de mon infrastructure personnelle
tags:
  - terraform
  - ansible
---

## Objectif

L'objectif était de réduire le temps de mise en place d'un nouveau poste et de chercher à automatiser au maximum ce qui pouvait l'être. En effet, lorsque j'ai commencé ce projet, j'avais tendance à expérimenter différentes distributions Linux et donc à réinstaller mon environnement très régulièrement.

## Solution

Pour la partie [Ansible](https://ansible.com), j'ai créé un playbook par poste (PC perso, PC pro, et VPS).

Afin de provisonner mon VPS et les quelques services annexes de façon automatique, j'ai utilisé [Terraform](https://terraform.io).

## Statut

Ce projet est maintenu lorsque j'en ai le temps et/ou que je découvre un nouvel outil à ajouter à ma configuration. C'est mon petit bac à sable sur lequel j'expérimente de façon continue les outils que je découvre 🙂

> [Voir le projet](https://github.com/sylvainmetayer/dotfiles)
