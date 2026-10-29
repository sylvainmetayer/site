---
title: "Importer ses données Google Location dans PhoneTrack"
tags:
    - google
    - nextcloud
date: "2021-05-17"
metaDesc: "N'utilisant plus Google History location depuis plusieurs années, je souhaite néanmoins récupérer les données existantes dans ma nouvelle instance PhoneTrack"
excerpt: "N'utilisant plus Google History location depuis plusieurs années, je souhaite néanmoins récupérer les données existantes dans ma nouvelle instance PhoneTrack"
noToc: true
---

> [!NOTE]
> Rédigé en 2021, publié en 2026 : certaines étapes ont pu changer depuis.

Si vous ne le saviez pas déjà, Google possède un historique de localisation de vos différents emplacements : [Google Location History](https://www.google.com/maps/timeline). J'ai utilisé ce service de 2011 à 2018, année à laquelle j'ai commencé à m'éloigner des [services Google](https://degooglisons-internet.org/fr/).

> Pour activer ou désactiver ce comportement, rendez-vous sur [les paramètres de votre compte Google](https://myactivity.google.com/activitycontrols?pli=1&settings=location)

Désormais, j'utilise l'application [PhoneTrack](https://gitlab.com/eneiluj/phonetrack-oc) sur mon instance [Nextcloud](https://nextcloud.com/). Je souhaitais néanmoins récupérer mes données de 2011 à 2018 (représentant quelques milliers de km) sur ma nouvelle instance.

Cet article présente les différentes étapes pour réaliser cet import.

## Récupérer les données de Google

Il faut tout d'abord récupérer l'historique des positions de Google. Pour cela, rendez-vous sur [Google Takeout](https://takeout.google.com/), puis décochez tout, sélectionnez uniquement `Historique des positions`, et précisez le format des données en `JSON` (`Formats multiples` puis `JSON`). L'export peut être long selon le nombre de données présentes.

> À titre indicatif, il m'a fallu environ ~20min pour avoir l'export à disposition

## Préparer les données

Une fois l'archive ZIP récupérée et extraite, vous trouverez un fichier `Historique des positions.json` dans le dossier `Historique des positions`. C'est ce fichier que nous allons importer dans PhoneTrack :)

Pour ma part, le fichier contient un peu plus d'un million et demi d'enregistrements, pour un poids de ~450 Mo.

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

Il existe sûrement une meilleure façon de faire, mais lors de mes tests, un import direct du fichier dans PhoneTrack plantait, le fichier étant trop volumineux. Il a donc fallu que je découpe le fichier. Pour cela, j'ai fait un [rapide script](https://gist.github.com/sylvainmetayer/f4374861c79c669271e8734d8e7d9411), qui n'est pas parfait mais qui fait le job :)

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

Pour l'usage, cela se passe comme ça : le script va lire un fichier (`google.json`) et le séparer en fichiers de `100 000` éléments chacun (j'ai renommé le fichier `google_locations.json` en `google.json` au passage).

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

## Import dans PhoneTrack

Pour cette partie, il vous faudra un accès à votre instance Nextcloud avec l'application PhoneTrack installée, ainsi qu'un accès à sa base de données (client MySQL / MariaDB).

Tout d'abord, voici comment sont organisées les données de PhoneTrack dans la base de données :

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

Je ne vais pas rentrer dans les détails, mais voici la compréhension que j'ai de comment sont structurées les données dans PhoneTrack :

Un `device` est un appareil qui envoie des points de localisation (`points`). Chaque `device` appartient à une `session`, et une session peut contenir plusieurs `device`. Vous trouverez des détails ici si cela vous intéresse : [Wiki PhoneTrack - Gitlab](https://gitlab.com/eneiluj/phonetrack-oc/-/wikis/home)

Problème : PhoneTrack ne permet pas de fusionner deux devices depuis l'interface ([une issue](https://gitlab.com/eneiluj/phonetrack-oc/-/issues/377) le demandait d'ailleurs). Or, chaque fichier importé arrive dans son propre device. Le plan est donc le suivant :

1. importer chaque fichier depuis l'interface de PhoneTrack ;
2. créer un device dédié, `google_location`, qui accueillera tout l'historique ;
3. déplacer en base les points de chaque device importé vers ce device ;
4. supprimer les devices devenus vides.

> [!WARNING]
> On modifie directement la base de Nextcloud : pensez à faire une sauvegarde avant de vous lancer.

Une fois les imports terminés, voici les devices présents (`myPhone` et `myPhone2` sont mes téléphones, les autres viennent de l'import) :

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

À deux points près, on retrouve bien tous nos points importés en base. 🎉

Reste maintenant à les regrouper dans un seul device. Voici le nombre de points par device :

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

Pour chaque device de l'import, on rattache ses points au device `google_location` (ici, l'id `26`). Un point appartient à un device, et un device à une session : en changeant le `deviceid` des points, ils rejoignent donc aussi la session de `google_location`.

```sql
MariaDB [nextcloud]> UPDATE oc_phonetrack_points SET deviceid=26 WHERE deviceid = 10;
Query OK, 100000 rows affected (21.417 sec)
Rows matched: 100000  Changed: 100000  Warnings: 0
```

Une vingtaine de secondes par device, à répéter pour chacun d'eux. Une fois tous les devices traités :

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

Tous les points sont désormais rattachés à `google_location`. Il ne reste plus qu'à supprimer les devices vides (et leurs sessions) depuis l'interface de PhoneTrack, et à profiter de quelques années d'historique sur sa propre instance :)

> [!TIP]
> Afficher beaucoup de points d'un coup peut faire planter PhoneTrack : pensez à utiliser les filtres (par date notamment) lorsque vous consultez vos données.

