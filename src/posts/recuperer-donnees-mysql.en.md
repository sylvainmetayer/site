---
title: "Recovering SQL dumps from a MySQL/MariaDB instance that won't start"
metaTitle: "SQL dumps from a MySQL/MariaDB that won't start · Sylvain"
tags:
    - mysql
date: "2021-05-04"
metaDesc: "After a somewhat bumpy update of my Raspberry Pi, my MariaDB database would no longer start"
excerpt: "After a somewhat bumpy update of my Raspberry Pi, my MariaDB database would no longer start"
noToc: true
---

After a somewhat bumpy update of my Raspberry Pi, my MariaDB database would no longer start, reporting an error caused by the update. So I had a MySQL that refused to start and, of course, no backup!

However, I still had the `/var/lib/mysql` folder, which seemed intact. So I made a tar.gz of the folder and copied it to my machine to see what I could do with it.

```bash
# create the tar.gz on the server
$ sudo tar -zcvf ~/mysql.tar.gz /var/lib/mysql
# copy it locally
$ scp pi:~mysql.tar.gz .
```

Once that was done, I used Docker and the mariadb image (version 10.3, the one running on my server, to avoid any incompatibility) to start a local mariadb instance with the data I had just recovered.

```bash
# Extract the tar.gz
$ tar -xzvf mysql.tar.gz
$ cd var/lib
# I'll need this folder later to retrieve my SQL dumps
$ mkdir backup

$ docker run --name restore_mariadb -v $(pwd)/data:/var/lib/mysql -v $(pwd):/backup -e MYSQL_ROOT_PASSWORD=root -d mariadb:10.3
```

The environment variable is required, otherwise the image won't start, but keep in mind that you'll have to use the password of your MySQL instance as it was on your server.

Once that's done, just run the following command to connect to the container:

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

And finally, we can run mysqldump and store the output in the `/backup` folder we also mounted, so we can restore the data once the database is up and running again.

```bash
mysqldump -u root -p mabase > /backup/mysql.sql
```

Hopefully this will be useful to others!

> And if you don't have a recent backup, go back up your data right now :)
