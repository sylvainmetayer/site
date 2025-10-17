---
title: "Importer ses données Google Location dans Phonetrack"
tags:
    - google
    - nextcloud
date: "2021-05-17"
metaDesc: "Guide complet pour migrer votre historique de localisation Google vers Phonetrack sur Nextcloud"
excerpt: "N'utilisant plus Google History location depuis plusieurs années, je souhaite néanmoins récupérer les données existantes dans ma nouvelle instance Phonetrack"
noToc: false
---

# Importer ses données Google Location dans Phonetrack

Si vous ne le saviez pas déjà, Google possède un historique de localisation de vos différents emplacements : [Google Location History](https://www.google.com/maps/timeline). J'ai utilisé ce service de 2011 à 2018, année à laquelle j'ai commencé à m'éloigner des [services Google](https://degooglisons-internet.org/fr/).

> Pour activer ou désactiver ce comportement, rendez-vous sur [les paramètres de votre compte Google](https://myactivity.google.com/activitycontrols?pli=1&settings=location)

Désormais, j'utilise l'application [Phonetrack](https://gitlab.com/eneiluj/phonetrack-oc) sur mon instance [Nextcloud](https://nextcloud.com/). Je souhaitais néanmoins récupérer mes données de 2011 à 2018 (représentant quelques milliers de kilomètres) sur ma nouvelle instance.

Cet article présente les différentes étapes pour réaliser cet import.

## Récupérer les données de Google

Il faut tout d'abord récupérer l'historique des positions de Google. Pour cela, rendez-vous sur [Google Takeout](https://takeout.google.com/), puis :

1. Décocher toutes les options
2. Sélectionner uniquement `Historique des positions`
3. Préciser le format des données en `JSON` (via `Formats multiples` puis `JSON`)
4. Lancer l'export

L'export peut être long selon le nombre de données présentes.

> À titre indicatif, il m'a fallu environ 20 minutes pour avoir l'export à disposition

## Préparer les données

Une fois l'archive ZIP récupérée et extraite, vous trouverez un fichier `Historique des positions.json` dans le dossier `Historique des positions`. C'est ce fichier que nous allons importer dans Phonetrack.

Pour ma part, le fichier contient un peu plus d'un million et demi d'enregistrements, pour un poids de ~450 Mo :

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

### Découpage du fichier

Il existe sûrement une meilleure façon de faire, mais lors de mes tests, un import direct du fichier dans Phonetrack plantait, le fichier étant trop volumineux. Il a donc fallu que je découpe le fichier. Pour cela, j'ai créé un [script Node.js](https://gist.github.com/sylvainmetayer/f4374861c79c669271e8734d8e7d9411) qui divise le fichier en morceaux de 100 000 enregistrements :

```js
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./google_locations.json',
        { encoding: 'utf8', flag: 'r' }));

const locations = data.locations;
let dataFile = [];
let fileSuffix = 0;

console.log(`${locations.length} locations à traiter`);

for (const location of locations) {
        if (dataFile.length % 100000 === 0 && dataFile.length > 0) {
                const filename = `google.${fileSuffix}.json`;
                fs.writeFileSync(filename, JSON.stringify({ locations: dataFile }));
                console.log(`Fichier ${fileSuffix} créé avec ${dataFile.length} locations`);
                fileSuffix++;
                dataFile = [];
        }
        dataFile.push(location);
}

// Écriture du dernier fichier
const filename = `google.${fileSuffix}.json`;
fs.writeFileSync(filename, JSON.stringify({ locations: dataFile }));
console.log(`Dernier fichier créé avec ${dataFile.length} locations`);
```

Le script va lire le fichier `google_locations.json` et le séparer en fichiers de 100 000 éléments chacun :

```bash
~/wip via ⬢ v14.15.0
❯ node split.js
1690273 locations à traiter
Fichier 0 créé avec 100000 locations
Fichier 1 créé avec 100000 locations
Fichier 2 créé avec 100000 locations
Fichier 3 créé avec 100000 locations
Fichier 4 créé avec 100000 locations
Fichier 5 créé avec 100000 locations
Fichier 6 créé avec 100000 locations
Fichier 7 créé avec 100000 locations
Fichier 8 créé avec 100000 locations
Fichier 9 créé avec 100000 locations
Fichier 10 créé avec 100000 locations
Fichier 11 créé avec 100000 locations
Fichier 12 créé avec 100000 locations
Fichier 13 créé avec 100000 locations
Fichier 14 créé avec 100000 locations
Fichier 15 créé avec 100000 locations
Dernier fichier créé avec 90273 locations

# Vérification
❯ bc <<< 16*100000+90273
1690273
```

On retrouve bien nos données séparées dans 17 fichiers. Plus qu'à les importer !

## Import dans Phonetrack

Pour cette partie, vous aurez besoin :
- D'un accès à votre instance Nextcloud avec l'application Phonetrack installée
- D'un accès à un client MySQL/MariaDB pour la base de données

### Comprendre la structure de Phonetrack

Tout d'abord, voici comment sont organisées les données de Phonetrack dans la base de données :

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

Pour faire simple :
- Un `device` (appareil) envoie des `points` de localisation
- Chaque `device` appartient à une `session`
- Une `session` peut contenir plusieurs `device`

Plus de détails sur le [Wiki Phonetrack](https://gitlab.com/eneiluj/phonetrack-oc/-/wikis/home).

### Créer un device pour l'import

Dans Phonetrack, créez une nouvelle session et un nouveau device nommé `google_location` qui servira à regrouper toutes vos données Google.

### Importer les fichiers

Pour chaque fichier créé précédemment (`google.0.json`, `google.1.json`, etc.), importez-le via l'interface Phonetrack :
1. Ouvrez votre session Phonetrack
2. Sélectionnez le device `google_location`
3. Utilisez la fonction d'import de fichier JSON
4. Répétez pour chaque fichier

> **Note** : L'import peut prendre plusieurs minutes par fichier selon la taille.

### État initial des devices

Après l'import de tous les fichiers, vérifiez l'état de vos devices :

```sql
MariaDB [nextcloud]> SELECT * FROM oc_phonetrack_devices;
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
| id | name             | alias | sessionid                        | color   | shape | nametoken                        |
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
|  5 | myPhone          | NULL  | redacted_for_privacy             | #3ea8fa | NULL  | NULL                             |
|  8 | myPhone2         | NULL  | redacted_for_privacy             | #ff0001 | NULL  | NULL                             |
|  9 | google1          | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
| 10 | google10         | NULL  | redacted_for_privacy             | NULL    | NULL  | NULL                             |
...
| 26 | google_location  | NULL  | redacted_for_privacy             | NULL    | NULL  | redacted_for_privacy             |
+----+------------------+-------+----------------------------------+---------+-------+----------------------------------+
20 rows in set (0.001 sec)
```

Vérification du nombre de points importés (hors devices existants) :

```sql
MariaDB [nextcloud]> SELECT COUNT(*) FROM oc_phonetrack_points WHERE deviceid NOT IN(5,8);
+----------+
| COUNT(*) |
+----------+
|  1690271 |
+----------+
1 row in set (1.154 sec)
```

On retrouve bien tous nos points importés en base !

### Consolider les données

Si vous avez importé dans plusieurs devices temporaires (comme moi), vous pouvez maintenant consolider toutes les données dans un seul device `google_location`.

Vérifiez la répartition des points par device :

```sql
MariaDB [nextcloud]> SELECT name, d.id as deviceid, COUNT(p.id) as points 
FROM oc_phonetrack_points p 
RIGHT JOIN oc_phonetrack_devices d ON p.deviceid = d.id 
GROUP BY deviceid, name;
+------------------+----------+----------+
| name             | deviceid | points   |
+------------------+----------+----------+
| myPhone          |        5 |     3162 |
| myPhone2         |        8 |   218854 |
| google1          |        9 |        1 |
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

Pour chaque `deviceid` temporaire de l'import Google, migrez les données vers le device `google_location` (ID 26 dans cet exemple) :

```sql
-- Exemple pour le device ID 10
MariaDB [nextcloud]> UPDATE oc_phonetrack_points SET deviceid=26 WHERE deviceid = 10;
Query OK, 100000 rows affected (21.417 sec)
Rows matched: 100000  Changed: 100000  Warnings: 0

-- Répétez pour tous les autres devices temporaires (9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25)
```

Après consolidation :

```sql
MariaDB [nextcloud]> SELECT name, d.id as deviceid, COUNT(p.id) as points 
FROM oc_phonetrack_points p 
RIGHT JOIN oc_phonetrack_devices d ON p.deviceid = d.id 
GROUP BY deviceid, name;
+------------------+----------+---------+
| name             | deviceid | points  |
+------------------+----------+---------+
| myPhone          |        5 |    3162 |
| myPhone2         |        8 |  218854 |
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
| google_location  |       26 | 1690271 |
+------------------+----------+---------+
19 rows in set, 1 warning (1.820 sec)
```

Parfait ! Tous les points sont maintenant consolidés dans le device `google_location`.

### Nettoyage

Vous pouvez maintenant supprimer les devices temporaires qui ne contiennent plus de points via l'interface Phonetrack.

## Conclusion

Vous avez maintenant récupéré l'intégralité de votre historique de localisation Google dans Phonetrack ! Vous pouvez visualiser vos déplacements depuis 2011 directement dans votre instance Nextcloud.

> **Attention** : Afficher beaucoup de points d'un coup peut ralentir Phonetrack. Pensez à utiliser les filtres temporels pour limiter la période affichée lors de la visualisation de vos données.

## Ressources

- [Documentation Phonetrack](https://gitlab.com/eneiluj/phonetrack-oc/-/wikis/home)
- [Issue GitLab sur l'import Google](https://gitlab.com/eneiluj/phonetrack-oc/-/issues/377)
- [Script de découpage des fichiers](https://gist.github.com/sylvainmetayer/f4374861c79c669271e8734d8e7d9411)

