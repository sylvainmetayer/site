---
title: Ce que j'utilise
permalink: /uses/
layout: layouts/page.njk
translationKey: uses
updated: 2026-10-29
metaDesc: "Le matériel, les logiciels, les outils de développement et l'homelab de Sylvain MÉTAYER."
---

Les outils que j'utilise au quotidien, dans l'esprit des [pages /uses](https://uses.tech/). Mes postes sont installés et configurés par [mes dotfiles](https://github.com/sylvainmetayer/dotfiles), des playbooks Ansible : je peux les recréer à l'identique (j'en ai fait [un talk](https://github.com/sylvainmetayer/talk-workstation-automation)).

## Matériel

- **Fixe** : Intel Core i7-6700K, 16 Go de RAM, NVIDIA GeForce GTX 1070. Il commence à avoir de l'âge, mais il tient.
- **Écrans** : deux 22 pouces, un ASUS VP228 et un Philips 224E.
- **Portable** : un vieux Dell sous Fedora.
- **Téléphone** : un Google Pixel 7.

## Système

- **[Fedora Workstation](https://fedoraproject.org/workstation/)** avec GNOME, sur toutes mes machines.
- **Terminal** : [ddterm](https://github.com/ddterm/gnome-shell-extension-ddterm), qui descend d'un raccourci clavier, avec [Zellij](https://zellij.dev/) pour les onglets et les panneaux, et [Starship](https://starship.rs/).
- **Navigateur** : [Firefox](https://www.mozilla.org/firefox/).
- **Mots de passe** : [KeePassXC](https://keepassxc.org/).
- **Notes** : [Obsidian](https://obsidian.md/).
- **Fichiers** : [kDrive](https://www.infomaniak.com/fr/kdrive) d'Infomaniak, hébergé en Suisse.

## Développement

- **Éditeurs** : [VS Code](https://code.visualstudio.com/) à titre perso, [IntelliJ IDEA](https://www.jetbrains.com/idea/) à titre pro.
- **Versions des outils** : [mise](https://mise.jdx.dev/), après des années d'[asdf](https://asdf-vm.com/) ([talk](https://github.com/sylvainmetayer/talk-asdf)), j'ai fait la bascule, et ne reviendrai plus en arrière, même si asdf reste un excellent outil.
- **Secrets** : [SOPS](https://github.com/getsops/sops), pour ne plus rien committer en clair ([talk](https://github.com/sylvainmetayer/talk-sops)).

## IA

Pour me familiariser avec les agents IA, et tester de petits développements. En général, j'utilise GitHub Copilot et/ou Claude.

## Homelab

Un homelab sous [Proxmox](https://www.proxmox.com/), décrit avec [OpenTofu](https://opentofu.org/) et exposé avec [Pangolin](https://github.com/fosrl/pangolin).

Les services qui y tournent, presque tous derrière une authentification unique :

- **Photos** : [Immich](https://immich.app/).
- **Fichiers** : [Nextcloud](https://nextcloud.com/), et une copie de mon kDrive sur le NAS avec [rclone](https://rclone.org/).
- **Médias** : [Jellyfin](https://jellyfin.org/).
- **Lecture** : [FreshRSS](https://freshrss.org/) pour les flux, [Karakeep](https://karakeep.app/) pour les favoris.
- **Documents** : [BookStack](https://www.bookstackapp.com/) en wiki, [Stirling-PDF](https://www.stirlingpdf.com/) pour les PDF.
- **Maison** : [KitchenOwl](https://kitchenowl.org/) pour les courses et les recettes, [Homebox](https://homebox.software/) pour l'inventaire, [Wishlist](https://github.com/cmintey/wishlist) pour les listes de cadeaux.
- **Voyages** : [TREK](https://github.com/liketrek/TREK).
- **Réseau** : [Blocky](https://0xerr0r.github.io/blocky/), le DNS de la maison, qui bloque publicités et traqueurs.
- **Supervision** : [Beszel](https://beszel.dev/) pour les machines, [VictoriaLogs](https://docs.victoriametrics.com/victorialogs/) pour les logs, [Uptime Kuma](https://uptime.kuma.pet/) pour la disponibilité, [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker) pour la connexion, et [ntfy](https://ntfy.sh/) pour les notifications.
