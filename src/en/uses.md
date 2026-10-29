---
title: What I use
permalink: /en/uses/
layout: layouts/page.njk
translationKey: uses
updated: 2026-10-29
metaDesc: "The hardware, software, command-line tools and homelab of Sylvain MÉTAYER."
---

The tools I use every day, in the spirit of [/uses pages](https://uses.tech/). My computers are installed and configured by [my dotfiles](https://github.com/sylvainmetayer/dotfiles), a set of Ansible playbooks, so I can rebuild them identically (I gave [a talk](https://github.com/sylvainmetayer/talk-workstation-automation) about it).

## Hardware

- **Desktop**: Intel Core i7-6700K, 16 GB of RAM, NVIDIA GeForce GTX 1070. Getting old, but still going.
- **Screens**: two 22-inch monitors, an ASUS VP228 and a Philips 224E.
- **Laptop**: a Dell running Fedora.
- **Phone**: a Google Pixel 7.

## System

- **[Fedora Workstation](https://fedoraproject.org/workstation/)** with GNOME, on all my machines.
- **Terminal**: [Guake](https://guake.github.io/), which drops down on a keyboard shortcut, with [Zellij](https://zellij.dev/) for tabs and panes, and the [Starship](https://starship.rs/) prompt.
- **Browser**: [Brave](https://brave.com/).
- **Passwords**: [KeePassXC](https://keepassxc.org/), which is also my Git credential helper.
- **Notes**: [Obsidian](https://obsidian.md/).
- **Files**: [kDrive](https://www.infomaniak.com/en/kdrive) by Infomaniak, hosted in Switzerland.
- **Application firewall**: [Portmaster](https://safing.io/).

## Development

- **Editors**: [VS Code](https://code.visualstudio.com/) every day, JetBrains IDEs (through the Toolbox) for Java and PHP, and Vim for quick edits.
- **Tool versions**: [mise](https://mise.jdx.dev/), after years of [asdf](https://asdf-vm.com/) ([talk](https://github.com/sylvainmetayer/talk-asdf)), with [direnv](https://direnv.net/) for per-project variables.
- **Containers**: [Podman](https://podman.io/); [kubectl](https://kubernetes.io/docs/reference/kubectl/) and [k9s](https://k9scli.io/) for Kubernetes.
- **Secrets**: [SOPS](https://github.com/getsops/sops), so nothing is committed in plain text ([talk](https://github.com/sylvainmetayer/talk-sops)).
- **Command line**: [ripgrep](https://github.com/BurntSushi/ripgrep), [fzf](https://github.com/junegunn/fzf), [bat](https://github.com/sharkdp/bat), [zoxide](https://github.com/ajeetdsouza/zoxide) and the [GitHub CLI](https://cli.github.com/).

## AI

- **[Claude Code](https://claude.com/product/claude-code)** in the terminal: exploring a repository, writing code, reviewing a PR. I review and approve every change; this site and my homelab move forward a lot this way, in small PRs.

## Homelab

A [Proxmox](https://www.proxmox.com/) homelab, described with [OpenTofu](https://opentofu.org/) and exposed through [Pangolin](https://github.com/fosrl/pangolin).

The services running on it, nearly all behind single sign-on:

- **Photos**: [Immich](https://immich.app/).
- **Files**: [Nextcloud](https://nextcloud.com/), and a copy of my kDrive on the NAS with [rclone](https://rclone.org/).
- **Media**: [Jellyfin](https://jellyfin.org/).
- **Reading**: [FreshRSS](https://freshrss.org/) for feeds, [Karakeep](https://karakeep.app/) for bookmarks.
- **Documents**: [BookStack](https://www.bookstackapp.com/) as a wiki, [Stirling-PDF](https://www.stirlingpdf.com/) for PDFs.
- **Home**: [KitchenOwl](https://kitchenowl.org/) for groceries and recipes, [Homebox](https://homebox.software/) for the home inventory, [Wishlist](https://github.com/cmintey/wishlist) for gift lists.
- **Travel**: [TREK](https://github.com/liketrek/TREK).
- **Network**: [Blocky](https://0xerr0r.github.io/blocky/), the house DNS, which blocks ads and trackers.
- **Monitoring**: [Beszel](https://beszel.dev/) for the machines, [VictoriaLogs](https://docs.victoriametrics.com/victorialogs/) for logs, [Uptime Kuma](https://uptime.kuma.pet/) for uptime, [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker) for the internet line, and [ntfy](https://ntfy.sh/) for notifications.
