---
title: Ce que j'utilise
permalink: /uses/
layout: layouts/page.njk
translationKey: uses
updated: 2026-10-28
metaDesc: "Le matériel, les logiciels, les outils en ligne de commande et l'homelab de Sylvain MÉTAYER."
---

Les outils que j'utilise au quotidien, dans l'esprit des [pages /uses](https://uses.tech/). Mes postes sont installés et configurés par [mes dotfiles](https://github.com/sylvainmetayer/dotfiles), des playbooks Ansible : je peux les recréer à l'identique (j'en ai fait [un talk](https://github.com/sylvainmetayer/talk-workstation-automation)).

## Matériel

- **Fixe** : Intel Core i7-6700K, 16 Go de RAM, NVIDIA GeForce GTX 1070. Il commence à avoir de l'âge, mais il tient.
- **Portable** : un Dell sous Fedora.

## Système

- **[Fedora Workstation](https://fedoraproject.org/workstation/)** avec GNOME, sur toutes mes machines.
- **Terminal** : [Guake](https://guake.github.io/), qui descend d'un raccourci clavier, avec [Zellij](https://zellij.dev/) pour les onglets et les panneaux, et l'invite [Starship](https://starship.rs/).
- **Navigateur** : [Brave](https://brave.com/).
- **Mots de passe** : [KeePassXC](https://keepassxc.org/), qui sert aussi d'aide aux identifiants Git.
- **Notes** : [Obsidian](https://obsidian.md/).
- **Fichiers** : [kDrive](https://www.infomaniak.com/fr/kdrive) d'Infomaniak, hébergé en Suisse.
- **Pare-feu applicatif** : [Portmaster](https://safing.io/).

## Développement

- **Éditeurs** : [VS Code](https://code.visualstudio.com/) au quotidien, les IDE JetBrains (via la Toolbox) pour Java et PHP, et Vim pour les retouches rapides.
- **Versions des outils** : [mise](https://mise.jdx.dev/), après des années d'[asdf](https://asdf-vm.com/) ([talk](https://github.com/sylvainmetayer/talk-asdf)), avec [direnv](https://direnv.net/) pour les variables par projet.
- **Conteneurs** : [Podman](https://podman.io/) ; [kubectl](https://kubernetes.io/docs/reference/kubectl/) et [k9s](https://k9scli.io/) pour Kubernetes.
- **Secrets** : [SOPS](https://github.com/getsops/sops), pour ne plus rien committer en clair ([talk](https://github.com/sylvainmetayer/talk-sops)).
- **En ligne de commande** : [ripgrep](https://github.com/BurntSushi/ripgrep), [fzf](https://github.com/junegunn/fzf), [bat](https://github.com/sharkdp/bat), [zoxide](https://github.com/ajeetdsouza/zoxide) et la CLI [GitHub](https://cli.github.com/).

## Homelab

Un homelab sous [Proxmox](https://www.proxmox.com/), décrit avec [OpenTofu](https://opentofu.org/) et exposé avec [Pangolin](https://github.com/fosrl/pangolin).
