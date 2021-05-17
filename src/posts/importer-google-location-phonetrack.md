---
title: "Importer ses données Google Location dans Phonetrack"
tags:
    - google
    - nextcloud
date: "2021-05-17"
metaDesc: "N'utilisant plus Google History location depuis plusieurs années, je souhaite néanmoins récupérer les données existantes dans ma nouvelle instance phonetrack"
excerpt: "N'utilisant plus Google History location depuis plusieurs années, je souhaite néanmoins récupérer les données existantes dans ma nouvelle instance phonetrack"
noToc: true
---

# Importer ses données Google Location dans Phonetrack

Si vous ne le saviez pas déjà, Google possède un historique de localisation de vos différents emplacements : [Google Location History](https://www.google.com/maps/timeline). J'ai utilisé ce service de 2011 à 2018, année à laquelle j'ai commencé à m'éloigner des [services Google](https://degooglisons-internet.org/fr/).

> Pour activer ou désactiver ce comportement, rendez-vous sur [les paramètres de votre compte Google](https://myactivity.google.com/activitycontrols?pli=1&settings=location)

Désormais, j'utilise l'application [Phonetrack](https://gitlab.com/eneiluj/phonetrack-oc) sur mon instance [Nextcloud](https://nextcloud.com/). Je souhaitais néanmoins récupérer mes données de 2011 à 2018 (représentant quelques milliers de kms) sur ma nouvelle instance.

Cet article présentes les différentes étapes pour réaliser cet import.

## Récupérer les données de Google

Il faut tout d'abord récupérer l'historique des positions de Google. Pour cela, rendez-vous sur [Google Takeout](https://takeout.google.com/), puis décocher tout et sélectionner uniquement `Historique des positions`, et préciser le format des données en `JSON` (`Formats multiples` puis `JSON`). L'export peut-être long selon le nombre de données présentes.

> À titre indicatif, il m'a fallu environ ~20min pour avoir l'export à disposition

## Préparer les données

Une fois l'archive ZIP récupérée et extraite, vous trouverez un fichier `Historique des positions.json` dans le dossier `Historique des positions`. C'est ce fichier que nous allons importer dans phonetrack :)

Pour ma part, le fichier contient un peu plus d'un million et demi d'enregistrement, pour un poids de ~450Mo

```bash
~/wip
❯ mv Historique\ des\ positions.json google_locations.json

~/wip
❯ jq '.locations| length' < google_locations.json
1690273

~/wip took 14s
❯ ls -ailh google_locations.json
2498577 -rw-rw-r--. 1 ocyhc ocyhc 470M 17 mai   13:35 google_locations.json
```

Il existe surement une meilleure façon de faire, mais lors de mes tests, un import direct du fichier dans phonetrack plantait, le fichier étant trop volumineux. Il a donc fallu que je découpe le fichier. Pour cela, j'ai fait un [rapide script](https://gist.github.com/sylvainmetayer/f4374861c79c669271e8734d8e7d9411), qui n'est pas parfait mais qui fait le job :)

```js
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./google.json',
        { encoding: 'utf8', flag: 'r' }));

const locations = data.locations;
let iterations = locations.length;

let dataFile = [];

const fileName = 'google.';
let fileSuffix = 0;

console.log(`${locations.length} locations`);
for (location of locations) {
        if (dataFile.length % 100000 === 0 && dataFile.length > 0) {
                const filename = `google.${fileSuffix}.json`;
                fs.writeFileSync(filename, JSON.stringify({ locations: dataFile }));
                console.log(`Need to write file ${fileSuffix}`);
                fileSuffix++;
                dataFile = [];
        }
        dataFile.push(location);
}

const filename = `google.999.json`;
fs.writeFileSync(filename, JSON.stringify({ locations: dataFile }));
console.log(`Wrote last data file with ${dataFile.length} locations`);
```

Pour l'usage, cela se passe comme ça : Le script va lire un fichier (`google.json`) et le séparer en fichiers de `100 000` éléments chacun

```bash
~/wip via ⬢ v14.15.0
❯ node split.js
1690273 locations
Need to write file 0
Need to write file 1
Need to write file 2
Need to write file 3
Need to write file 4
Need to write file 5
Need to write file 6
Need to write file 7
Need to write file 8
Need to write file 9
Need to write file 10
Need to write file 11
Need to write file 12
Need to write file 13
Need to write file 14
Need to write file 15
Wrote last data file with 90273 locations
❯ bc <<< 16*100000+90273
1690273
```

On retrouve bien nos données séparées, plus qu'à les importer !

## Import dans phonetrack

Pour cette partie, il faut faudra accès à votre instance nextcloud avec l'application phonetrack installée. Il faudra également un accès à un client MySQL.

Tout d'abord, voici comment sont organisées les données de phonetrack dans la base de données :

```sql
MariaDB [nextcloud]> SHOW TABLES WHERE Tables_in_nextcloud LIKE '%phonetrack%';
+--------------------------+
| Tables_in_nextcloud      |
+--------------------------+
| oc_phonetrack_devices    |
| oc_phonetrack_filtersb   |
| oc_phonetrack_geofences  |
| oc_phonetrack_points     |
| oc_phonetrack_proxims    |
| oc_phonetrack_pubshares  |
| oc_phonetrack_sessions   |
| oc_phonetrack_shares     |
| oc_phonetrack_tileserver |
+--------------------------+
```

Je ne vais pas rentrer dans les détails, mais voici la compréhension que j'ai de comment sont structurées les données dans phonetrack :

Un `device` est un appareil qui envoie des points de localisation (`points`). Chaque `device` appartient à une `session`, et une session peut contenir plusieurs `device`. Vous trouverez des détails ici si cela vous intéresse : [Wiki Phonetrack - Gitlab](https://gitlab.com/eneiluj/phonetrack-oc/-/wikis/home)

https://gitlab.com/eneiluj/phonetrack-oc/-/issues/377

TODO :

- savoir devices existantes
- nombre de points avant
- réserver device google_location + screenshot
- import chaque fichiers
- montrer résultat import

```sql
MariaDB [nextcloud]> SELECT * FROM oc_phonetrack_devices;
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
| id | name             | alias | sessionid                        | color   | shape | nametoken                        |
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
|  5 | myPhone          | NULL  | redacted_for_privacy             | #3ea8fa | NULL  | NULL                             |
|  8 | myPhone2         | NULL  | redacted_for_privacy             | #ff0001 | NULL  | NULL                             |
|  9 | google1          | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 10 | google10         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 11 | google11         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 12 | google12         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 13 | google13         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 14 | google14         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 15 | google15         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 16 | google16         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 17 | g2               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 18 | g3               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 19 | g4               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 20 | g5               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 21 | g6               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 22 | g7               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 23 | g8               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 24 | g9               | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 25 | glast            | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 26 | google_location  | NULL  | redacted_for_privacy             | NULL    | NULL  | redacted_for_privacy             |
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
20 rows in set (0.001 sec)

MariaDB [nextcloud]> SELECT COUNT(*) FROM oc_phonetrack_points WHERE deviceid NOT IN(5,8);
+----------+
| COUNT(*) |
+----------+
|  1690271 |
+----------+
1 row in set (1.154 sec)
```

- on retrouve bien tout nos point importés en base.

Reste maintenant à les migrer dans la nouvelle session et dans un seul device.

```sql
MariaDB [nextcloud]> SELECT name, d.id as deviceid, COUNT(p.id) as points FROM oc_phonetrack_points p RIGHT JOIN oc_phonetrack_devices d ON p.deviceid = d.id GROUP BY deviceid, name;
+------------------+----------+----------+
| name             | deviceid | points   |
+------------------+----------+----------+
| google1          |        9 |        1 |
| myPhone          |        5 |     3162 |
| myPhone2         |        8 |   218854 |
| google10         |       10 |   100000 |
| google11         |       11 |   100000 |
| google12         |       12 |   100000 |
| google13         |       13 |   100000 |
| google14         |       14 |   100000 |
| google15         |       15 |   100000 |
| google16         |       16 |   100000 |
| g2               |       17 |   100000 |
| g3               |       18 |    99998 |
| g4               |       19 |   100000 |
| g5               |       20 |   100000 |
| g6               |       21 |   100000 |
| g7               |       22 |   100000 |
| g8               |       23 |   100000 |
| g9               |       24 |   100000 |
| glast            |       25 |    90273 |
| google_location  |       26 |   100000 |
+------------------+----------+----------+
20 rows in set, 1 warning (1.552 sec)
```

Pour chaque `deviceid` de l'import Google séparé, migrer les données des points liés à ce dernier vers le device créé précédemment.

```sql
MariaDB [nextcloud]> UPDATE oc_phonetrack_points SET deviceid=26 WHERE deviceid = 10;
Query OK, 100000 rows affected (21.417 sec)
Rows matched: 100000  Changed: 100000  Warnings: 0
```

APRES

```sql
MariaDB [nextcloud]> SELECT name, d.id as deviceid, COUNT(p.id) as points FROM oc_phonetrack_points p RIGHT JOIN oc_phonetrack_devices d ON p.deviceid = d.id GROUP BY deviceid, name;
+------------------+----------+---------+
| name             | deviceid | points  |
+------------------+----------+---------+
| g2               |       17 |       0 |
| g3               |       18 |       0 |
| g4               |       19 |       0 |
| g5               |       20 |       0 |
| g6               |       21 |       0 |
| g7               |       22 |       0 |
| g8               |       23 |       0 |
| g9               |       24 |       0 |
| glast            |       25 |       0 |
| google10         |       10 |       0 |
| google11         |       11 |       0 |
| google12         |       12 |       0 |
| google13         |       13 |       0 |
| google14         |       14 |       0 |
| google15         |       15 |       0 |
| google16         |       16 |       0 |
| myPhone          |        5 |    3162 |
| myPhone2         |        8 |  218854 |
| google_location  |       26 | 1690271 |
+------------------+----------+---------+
19 rows in set, 1 warning (1.820 sec)
```

delele all g session

enjoy :)

> Afficher beaucoup de points d'un coup peut faire bugger phonetrack, pensez à mettre des filtres lorsque vous visionnez vos données
