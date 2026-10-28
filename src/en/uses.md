---
title: What I use
permalink: /en/uses/
layout: layouts/page.njk
translationKey: uses
updated: 2026-10-28
metaDesc: "The hardware, software, command-line tools and homelab of Sylvain MÉTAYER."
---

The tools I use every day, in the spirit of [/uses pages](https://uses.tech/). My computers are installed and configured by [my dotfiles](https://github.com/sylvainmetayer/dotfiles), a set of Ansible playbooks, so I can rebuild them identically (I gave [a talk](https://github.com/sylvainmetayer/talk-workstation-automation) about it).

## Hardware

- **Desktop**: Intel Core i7-6700K, 16 GB of RAM, NVIDIA GeForce GTX 1070. Getting old, but still going.
- **Laptop**: a Dell running Fedora.

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

## Homelab

A [Proxmox](https://www.proxmox.com/) homelab, described with [OpenTofu](https://opentofu.org/) and exposed through [Pangolin](https://github.com/fosrl/pangolin).
