---
title: "Ajout des commentaires sur le site"
tags:
    - jekyll
date: 2018-11-18T00:00:00.000Z
metaDesc: "Les commentaires sont maintenant disponible sur le site"
excerpt: "Les commentaires sont maintenant disponible sur le site"
---

Les commentaires sont maintenant disponible sur le site !

Comme indiqué dans [l'article précédent](/article/site-personnel-v2), je cherchais désormais à intégrer une solution de commentaire, tout en évitant les solutions peu respectueuse de notre vie privée.

Mon choix s'était alors porté sur [isso](https://posativ.org/isso/), bien qu'il existe de nombreuses alternatives[^1].

La chose que j'ai apprécié avec Isso, en plus du fait qu'il est libre et auto-hébergé, est qu'il ne requiert aucune inscription pour commenter. Il est possible d'indiquer son nom, site web et adresse email (qui ne sera jamais publiée), chaque champ étant optionnel. Une modération est également possible (étant donné que j'ai fait le choix de laisser la possibilité de commenter anonymement, j'ai également fait le choix d'activer la modération avant publication).

## Installation

L'installation a été assez simple, de nombreux tutoriels[^2] existent sur internet et la [documentation](https://posativ.org/isso/docs/install/) est assez claire.

Voici les différentes étapes pour installer isso.

1. Installer les dépendances Python et virtualenv.

    > Bien que virtualenv ne soit pas obligatoire, il est recommandé afin d'éviter d'interférer avec les dépendances existantes sur le système.

    ```bash
    sudo apt-get install build-essential python-dev python-pip virtualenv
    ```
2. Une fois les dépendances installées, on initialise un environnement virtualenv

    ```bash
    sudo virtualenv /opt/isso
    ```

    On active l'environnemment, en tant que root.

    ```bash
    sudo su
    source /opt/isso/bin/activate
    ```

    > Etant donné que `/opt` n'est pas accessible en écriture aux utilisateurs, on utilise sudo. Mais rien n'empêche de l'installer dans le répertoire personnel de l'utilisateur.

3. Installation des dépendances

    ```bash
    pip install isso gunicorn
    ```

    On peut désormais quitter virtualenv.

    ```bash
    deactivate
    ```

## Configuration

On ne souhaite pas que isso soit exécuté en tant que root car s'il venait à y avoir une faille, l'attaquant aurait alors tous les droits. On va donc créer un utilisateur dédié et lui donner les droits sur les répertoires nécessaire (log et données). On créé également un répertoire `/etc/isso` qui contiendra les différentes configurations.

```bash
sudo adduser isso
sudo mkdir /var/lib/isso /var/log/isso
sudo chown isso:isso /var/lib/isso
sudo chown isso:isso /var/log/isso
sudo mkdir /etc/isso
```

Il reste maintenant à configurer Isso. Mon cas d'usage est le suivant : je souhaite avoir deux sites, un pour l'environnement de développement, l'autre pour la production. Voici ma configuration (`/etc/isso/isso.cfg` et `/etc/isso/isso.prod.cfg`).

La documentation du site isso ne semble pas à jour, pour des détails sur chaque paramètre, il est préférable de se référer à [la documentation présente sur Github](https://github.com/posativ/isso/blob/master/docs/docs/configuration/server.rst)

```ini
[general]
dbpath = /var/lib/isso/prod.comments.db
# Etant donné que je configure plusieurs sites, il est nécessaire de mettre une valeur au champ name
name = main
host = https://sylvainmetayer.fr
max-age = 15m
# Pour recevoir les notifications de nouveaux commentaires par email
notify = smtp
reply-notifications=false
log-file =
# Permet d'accéder à une interface d'administration permettant de visualiser les commentaires et de les approuver/rejeter/supprimer.
admin_password = MySuperSecurePassword

[moderation]
enabled = true
purge-after = 30d

[server]
listen = http://localhost:8080

[smtp]
username = me@mon.email.fr
# Malheureusement, le mot de passe doit être en clair.
# Il est donc recommandé de créer un compte email dédié pour l'envoi des notifications.
password = MonMotDePasseEmail
host = mail.gandi.net
port = 587
security = starttls
# L'adresse qui reçoit les notifications
to = you@your.email.com
from = me@mon.email.fr
timeout = 10

[guard]
# Enable basic spam protection features, e.g. rate-limit per IP address (/24
# for IPv4, /48 for IPv6).
enabled = true
ratelimit = 2
direct-reply = 2
reply-to-self = false
require-author = false
require-email = false

[markup]
options = strikethrough, autolink, fenced_code, no_intra_emphasis
# default, only a, blockquote, br, code, del, em, h1, h2, h3, h4, h5, h6, hr,
# ins, li, ol, p, pre, strong, table, tbody, td, th, thead and ul are allowed.
allowed-elements =
allowed-attributes =

[hash]
# Utilisé pour générer des identicons sur les commentaires
salt = SaltDe25Caractère
algorithm = pbkdf2
```

La configuration pour le site de développemnt est identique, il suffit donc de copier/coller le fichier et d'éditer quelques champs.

```ini
[general]
dbpath = /var/lib/isso/dev.comments.db
name = development
host = https://development_url
```

```bash
sudo chown root: /etc/isso/isso.cfg
sudo chown root: /etc/isso/isso.prod.cfg
```

Une fois la configuration terminée, il faut configurer le service pour qu'il démarre au lancement de l'OS.

On créé donc le script de démarrage du service dans `/opt/isso/isso-start.sh`

```bash
#!/bin/bash
set -e
source /opt/isso/bin/activate
export LANG=C.UTF-8
export ISSO_SETTINGS="/etc/isso/isso.cfg;/etc/isso/isso.prod.cfg"
exec gunicorn -n gunicorn-isso -b 127.0.0.1:8080 --preload -w 2 --log-file /var/log/isso/isso.log isso.dispatch 2>>/var/log/isso/isso.log
```

```bash
sudo chown root: /opt/isso/isso-start.sh
sudo chmod 755 /opt/isso/isso-start.sh
```

On créé maintenant le service.

```ini
[Unit]
Description=isso commenting system

[Service]
ExecStart=/opt/isso/isso-start.sh

Restart=on-failure
TimeoutSec=1
User=isso

LimitNOFILE=16384
LimitNPROC=16384
LimitLOCKS=16384

# ensures that the service process and all its children can never gain new
# privileges.
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

On redémarre `systemctl` et on active isso au démarrage, puis on le lance !

```bash
sudo chown root: /lib/systemd/system/isso.service
sudo chmod 644 /lib/systemd/system/isso.service
sudo systemctl daemon-reload
sudo systemctl enable isso
sudo systemctl start isso
```

Il reste maintenant à configurer le reverse proxy (nginx dans mon cas).

```nginx
location / {
    proxy_pass http://127.0.0.1:8080/;
    proxy_redirect default;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Les headers sont importants, puisque s'ils ne sont pas présents, isso enverra des emails avec des liens pointant vers `localhost:8080` et ne fonctionnera pas bien côté client.

Il ne reste maintenant plus qu'à configurer notre client ! Voici le code que j'ai ajouté dans mon fichier `_layouts/post.html`. J'ai également ajouté un attribut `enable_comments` dans mes posts, lorsque je souhaite activer les commentaires.

Le script est chargé en asynchrone, afin de ne pas gêner le chargement de la page.

```js
{% raw %}
{% if page.enable_comments %}
    <hr>
    <h2>Commentaires</h2>
    <script async
    data-isso="{{site.isso.url}}"
    data-isso-id="{{page.id}}"
    data-isso-feed="true"
    src="{{site.isso.script}}"></script>

    <section id="isso-thread"></section>
    <hr>
{% endif %}
{% endraw %}
```

Pour plus d'informations que les paramètres disponibles côté client, [voir la documentation sur Github](https://github.com/posativ/isso/blob/master/docs/docs/configuration/client.rst).

⚠ Lorsqu'un fil de commentaire est vide (ce qui est le cas lorsqu'un article ne contient pas encore de commentaire), isso répond avec une erreur HTTP 404, ce qui peut faire croire qu'une page est manquante ou invalide. [Une issue est ouverte sur le dépôt Github](https://github.com/posativ/isso/issues/301) pour renvoyer un code HTTP 204 (no content) à la place.

Et voici le résultat !

![Affichage des commentaires](/static/img/isso.png)

> Ce n'est qu'une image, les commentaires se trouvent plus bas 😉

> Edit 16.07.2020 : Les commentaires ne sont pour le moment plus disponibles. Migration vers Eleventy en cours, ils devraient être remplacés à l'aide des Webmentions d'ici les prochaines semaines/mois.

[^1]: [Voici un site répertoriant plusieurs solutions existant](https://lisakov.com/projects/open-source-comments/)
[^2]: [Ce tutoriel très similaire à cet article m'a été bien utile](https://blog.phusion.nl/2018/08/16/isso-simple-self-hosted-commenting-system/)
