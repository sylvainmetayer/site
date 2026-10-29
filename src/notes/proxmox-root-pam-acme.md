---
title: "Proxmox : ne désactivez pas root@pam, l'ACME en a besoin"
date: 2026-10-29
---

En sécurisant un Proxmox VE, on a vite envie de désactiver `root@pam` et de travailler avec un compte nominatif :

```bash
pveum group add admin -comment "System Administrators"
pveum acl modify / -group admin -role Administrator
pveum useradd moi@pve
pveum usermod moi@pve -group admin
pveum passwd moi@pve
```

Mais un compte avec le rôle `Administrator` ne peut pas tout faire : **la gestion du compte ACME** (Datacenter → ACME, l'inscription auprès de Let's Encrypt pour les certificats) **est réservée à `root@pam`**. Commander un certificat marche avec un administrateur, créer ou modifier le compte ACME, non.

Deux pièges en plus :

- un **jeton d'API de root** ne suffit pas : le contrôle compare l'utilisateur à `root@pam` exactement, et un jeton s'appelle `root@pam!<id>`. Il faut un ticket, donc une connexion de `root@pam` ;
- avec la **double authentification** activée sur `root`, obtenir ce ticket par l'API devient compliqué.

Donc : garder `root@pam` actif, avec un mot de passe fort et une double authentification, et l'utiliser seulement pour ce genre de réglage.

Sources :
- [Different privileges for root and user with Administrator role?](https://forum.proxmox.com/threads/different-privileges-for-root-and-user-with-administrator-role.120982/) (forum Proxmox)
- [ACME API endpoint: 403 Permission check failed (user != root@pam)](https://forum.proxmox.com/goto/post?id=482008) (forum Proxmox, réponse de l'équipe)
- [proxmox_acme_account](https://docs.ansible.com/projects/ansible/devel/collections/community/proxmox/proxmox_acme_account_module.html) (module Ansible : authentification root@pam obligatoire)
