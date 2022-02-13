---
title: "Récupérer les dumps SQL depuis une instance MySQL/Mariadb qui ne démarre plus"
tags:
    - mysql
date: 2021-05-04T00:00:00.000Z
metaDesc: "Suite à une mise à jour de mon raspberry pi qui s'est plus ou moins bien passée, ma base de données MariaDB ne démarrait plus"
excerpt: "Suite à une mise à jour de mon raspberry pi qui s'est plus ou moins bien passée, ma base de données MariaDB ne démarrait plus"
noToc: true
---

Suite à une mise à jour de mon raspberry pi qui s'est plus ou moins bien passée, ma base de données MariaDB ne démarrait plus, indiquant une erreur suite à la mise à jour. J'avais donc un MySQL qui refusait de démarrer, et bien sur, pas de backup !

Néanmoins, je disposais quand même du dossier `/var/lib/mysql` qui semblait intact. J'ai donc fait un tar.gz du dossier avant de le récupérer en local pour voir ce que je pouvais en faire.

```bash
# on créé le tar.gz sur le serveur
$ sudo tar -zcvf ~/mysql.tar.gz /var/lib/mysql
# on le récupère en local
$ scp pi:~mysql.tar.gz .
```

Une fois cela fait, j'ai utilisé Docker et l'image mariadb (dans la version 10.3, qui était celle utilisée sur mon serveur pour éviter toute incompatibilité) pour pouvoir lancer une instance locale de mariadb, avec les données récupérées précédemment.

```bash
# Extraction du tar.gz
$ tar -xzvf mysql.tar.gz
$ cd var/lib
# J'aurais besoin de ce dossier pour récupérer mes dump SQL plus tard
$ mkdir backup

$ docker run --name restore_mariadb -v $(pwd)/data:/var/lib/mysql -v $(pwd):/backup -e MYSQL_ROOT_PASSWORD=root -d mariadb:10.3
```

La variable d'environnement est nécessaire sinon l'image ne démarrera pas, mais il faut bien garder en tête qu'il faudra indiquer le mot de passe de votre instance mySQL telle qu'elle était sur votre serveur.

Une fois cela fait, il suffit de lancer la commande suivante pour se connecter au conteneur :

```bash
$ docker exec -it restore_mariadb bash
root@e11929a58f8b:/# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 8
Server version: 10.3.23-MariaDB-1:10.3.23+maria~focal mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
```

Et enfin, on peut faire des mysqldump et stocker le résultats dans le dossier `/backup` que l'on a également monté pour pouvoir restaurer les données une fois la base de données de nouveau opérationnelle.

```bash
mysqldump -u root -p mabase > /backup/mysql.sql
```

En espérant que cela puisse être utile à d'autres !

> Et si jamais vous n'en avez pas de récentes, allez faire une sauvegarde de vos données dès maintenant :)
