---
title: Configuration d'un serveur avec Ansible
emoji: 🔧
metaDescription: J'ai réalisé ce projet personnel afin de me familiariser avec Ansible et pouvoir récréer un serveur à l'identique sans intervention humaine.
date: 2018-09-15T00:00:00.000Z
summary: J'ai réalisé ce projet personnel afin de me familiariser avec Ansible et pouvoir récréer un serveur à l'identique sans intervention humaine.
tags:
  - devops
  - ansible
---

[Sources (Github)](https://github.com/EPSIBordeaux/ansible-deployment)

[Consulter le site d'Ansible](https://www.ansible.com/)

J'ai réalisé ce projet personnel afin de me familiariser avec Ansible et pouvoir récréer un serveur à l'identique sans intervention humaine.

Le choix d'Ansible m'a semblé intéressant car il ne nécessite pas l'installation d'un agent sur le serveur cible pour effectuer le déploiement. Seul Python est requis, et la plupart, pour ne pas dire la totalité des serveurs linux dispose de python de base. De plus, la syntaxe pour écrire les playbooks (jeu d'instructions) est du [YAML](http://yaml.org/), simple à lire et à écrire.

J'ai tenté de réaliser les différents playbooks de façon la plus modulaire possible, rendant l'ajout de fonctionnalités simple.

Ce projet permet ainsi de :

- Déployer un serveur et le sécuriser avec des clés SSH, Fail2Ban, Iptables.
- Déployer certaines applications réalisées lors de ma formation (afin de tester plusieurs type de déploiement, que ce soit des applications en PHP ou en NodeJS)
- Mettre en place une solution de monitoring avec [Monit](https://mmonit.com/monit/)
- Configurer automatique un serveur Web (Nginx) et effectuer des demandes de certificats HTTPS auprès de [Let's Encrypt](https://letsencrypt.org/) de façon automatique, y compris pour le renouvellement.

Le travail sur ce projet n'est pas encore terminé, puisqu'il reste encore par exemple à gérer la question de la sauvegarde et de la restauration des données des différentes applications installées. [Vous pouvez contribuer au projet à cette adresse](https://github.com/EPSIBordeaux/ansible-deployment/issues).
