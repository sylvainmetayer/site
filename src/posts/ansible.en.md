---
title: "Configuring a server with Ansible"
tags:
    - devops
    - projet
metaDesc: "I built this personal project to get familiar with Ansible and be able to recreate an identical server without any human intervention."
excerpt: "I built this personal project to get familiar with Ansible and be able to recreate an identical server without any human intervention."
date: "2018-09-15"
---

[Source code (GitHub)](https://github.com/EPSIBordeaux/ansible-deployment)

[Visit the Ansible website](https://www.ansible.com/)

I built this personal project to get familiar with Ansible and be able to recreate an identical server without any human intervention.

Ansible seemed like an interesting choice because it doesn't require installing an agent on the target server to deploy to it. Only Python is required, and most Linux servers, if not all of them, ship with Python out of the box. On top of that, playbooks (sets of instructions) are written in [YAML](http://yaml.org/), which is easy to read and write.

I tried to make the various playbooks as modular as possible, so that adding features stays simple.

This project lets you:

- Deploy a server and secure it with SSH keys, Fail2Ban and iptables.
- Deploy some of the applications I built during my studies (to try out several kinds of deployment, whether PHP or NodeJS applications)
- Set up monitoring with [Monit](https://mmonit.com/monit/)
- Automatically configure a web server (Nginx) and request HTTPS certificates from [Let's Encrypt](https://letsencrypt.org/), renewals included.

The project isn't finished yet: for instance, backing up and restoring the data of the installed applications still needs to be handled. [You can contribute to the project here](https://github.com/EPSIBordeaux/ansible-deployment/issues).
