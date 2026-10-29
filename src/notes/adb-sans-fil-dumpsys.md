---
title: "Diagnostiquer un Android avec adb sans fil"
date: 2026-10-29
---

Pour comprendre pourquoi un téléphone vide sa batterie ou rame, pas besoin de câble ni de root : depuis Android 11, `adb` passe par le Wi-Fi, et `dumpsys` lit l'état du système sans rien modifier.

## Connexion

Sur le téléphone : Options pour les développeurs → Débogage sans fil → Associer l'appareil avec un code.

```bash
sudo dnf install android-tools        # ou le paquet platform-tools de votre système
adb pair <IP>:<PORT_ASSOCIATION>      # une seule fois, avec le code à 6 chiffres
adb connect <IP>:<PORT_CONNEXION>     # le port de l'écran Débogage sans fil, il change à chaque activation
adb devices -l
```

Le port d'association et le port de connexion sont **différents**.

## Lire, sans rien changer

```bash
adb shell dumpsys battery                    # niveau, température, état
adb shell dumpsys batterystats --charged     # consommation depuis la dernière charge complète : wakelocks, GPS, radio
adb shell dumpsys procstats --hours 24       # mémoire et temps d'exécution des processus
adb shell dumpsys usagestats                 # utilisation des applications
adb shell dumpsys deviceidle                 # état de Doze
adb shell pm list packages -3                # applications installées par l'utilisateur
```

Le groupe de mise en veille de chaque application (5 exempt, 10 active, 20 working set, 30 frequent, 40 rare, 45 restricted, 50 never) :

```bash
adb shell 'for p in $(pm list packages -3 | cut -d: -f2); do echo "$p $(am get-standby-bucket $p)"; done'
```

La santé de la batterie, quand le fabricant l'expose :

```bash
adb shell cat /sys/class/power_supply/battery/cycle_count \
  /sys/class/power_supply/battery/charge_full \
  /sys/class/power_supply/battery/charge_full_design
```

À prendre avec précaution : sur certains téléphones, `charge_full` vaut toujours `charge_full_design`, et ces valeurs ne disent alors rien de l'usure.

Pour aller plus loin, la sortie de `batterystats` se lit dans [Battery Historian](https://developer.android.com/topic/performance/power/setup-battery-historian).

Sources :
- [Android Debug Bridge (adb)](https://developer.android.com/tools/adb) (débogage sans fil, Android 11 et plus)
- [App Standby Buckets](https://developer.android.com/topic/performance/appstandby)
- [Battery Historian](https://developer.android.com/topic/performance/power/setup-battery-historian)
