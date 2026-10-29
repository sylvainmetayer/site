---
title: 'kdvc: cleaning up old versions on a kDrive'
tags:
  - projet
  - rust
  - infomaniak
date: "2026-10-29"
metaDesc: My kDrive kept filling up on its own. The culprit was old file versions, which the web interface can't delete in bulk.
excerpt: My kDrive kept filling up on its own. The culprit was old file versions, which the web interface can't delete in bulk.
noToc: false
---

[Sources (GitHub)](https://github.com/sylvainmetayer/kdrive-version-cleaner) [Latest release](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest)

## The need

My [kDrive](https://www.infomaniak.com/en/kdrive) usage kept growing, even though I was only adding a few files to it. After a bit of digging, I found where the gap came from: **old versions** of files. Every time a file changes, kDrive keeps a copy of the previous version. That's very handy to go back in time, much less so when a file edited every day ends up weighing several times its own size (my KeePass database for instance, or a folder full of photos whose metadata you just changed 🥲).

With the tool described below, I was able to free up 3.2 GB, or 686 old versions. In the end, I was well within my quota, but I still wanted a way to avoid one day ending up with a kDrive full of old versions.

My first idea was to do it through the kDrive web interface. The problem: Infomaniak's only lets you delete versions one at a time, file by file. 😩

However, Infomaniak provides an [API](https://developer.infomaniak.com/docs/api) to list files and their versions, and to delete them. Good enough for a small tool!

## kdvc

`kdvc` (for _kDrive Version Cleaner_) is a small TUI[^1], written in [Rust](https://www.rust-lang.org/) with [ratatui](https://ratatui.rs/). It scans the drive once, keeps the file tree in a local SQLite cache, then shows:

- global statistics: number of files, space used by old versions
- a file explorer, with the versions' size summed up per folder
- the files whose versions take up the most space
- a search by name, extension, size or number of versions
- the deletion log, which can be exported to CSV

To clean up, you select a file or a folder and pick a rule: keep the last N versions, delete those older than X days, or delete everything except the current version.

## Deleting, yes, but not just anything

A tool that deletes data in bulk deserves a few safeguards. Here are the two main ones:

- **The current version is never deleted.** The API normally only returns old versions, but the tool checks that the list exactly matches what the scan saw. At the slightest doubt, the most recent one is protected: worst case, one extra version is kept.
- **Every deletion goes through a preview**, listing the affected versions and the space freed, then through an explicit confirmation from the user.

## Written with a coding agent

This project was also an experiment: I built it with [Claude Code](https://www.anthropic.com/claude-code), over two evenings. My role was mostly to set the rules, then review, leaving the agent to pick the language and whatever it saw fit.

Without an agent, this tool would have stayed an idea, as I wouldn't have taken the time to learn Rust for it (or I would have waited until I hit my quota, then thrown together a quick Python script, untested, and most likely less reliable than this tool).

However, since I don't know Rust, I'm much less of an expert on the resulting code than if I had written it myself. For a personal project of this size, that's acceptable, given that maintenance stays minimal, with so few features.

## Installation

The easiest way is through [mise](https://mise.jdx.dev):

```sh
mise use -g github:sylvainmetayer/kdrive-version-cleaner
```

Binaries for Linux, macOS and Windows are also available on the [releases page](https://github.com/sylvainmetayer/kdrive-version-cleaner/releases/latest).

You'll then need to create an [Infomaniak API token](https://manager.infomaniak.com/v3/ng/profile/user/token/list) with the `drive` scope (and `accounts` so the tool finds your accounts on its own), then export it as `KDRIVE_TOKEN`. The [README](https://github.com/sylvainmetayer/kdrive-version-cleaner#readme) covers the rest. Note that the tool's interface is in French.

If you end up using this project, feel free to share feedback or contribute on [GitHub](https://github.com/sylvainmetayer/kdrive-version-cleaner)!

[^1]: Terminal User Interface: a text-based user interface that runs in the terminal.
