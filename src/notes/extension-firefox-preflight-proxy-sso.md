---
title: "Extension Firefox muette derrière un proxy SSO : c'est le preflight"
date: 2026-11-13
---

Mon extension Firefox [Karakeep](https://karakeep.com/) refusait de se connecter à mon instance auto-hébergée, avec une clé d'API comme avec un mot de passe. L'instance est derrière un proxy qui exige une authentification (ici [Pangolin](https://github.com/fosrl/pangolin), mais le cas vaut pour Authelia, Authentik, Cloudflare Access...) ; l'extension passe ce mur grâce à des en-têtes personnalisés, que j'avais bien remis.

## Ce que montrent les journaux

Côté serveur, tout allait bien : l'interface web répondait et le jeton du proxy était valide. Dans le journal d'accès du proxy, les requêtes de l'extension, elles, ressemblaient à ça :

```text
OPTIONS /api/trpc/apiKeys.validate  302
```

Un `OPTIONS`, redirigé vers la page de connexion. La vraie requête (`GET` ou `POST`) n'arrivait jamais.

## La cause

Cet `OPTIONS` est une requête de pré-vérification CORS (*preflight*). Le navigateur l'envoie de lui-même avant une requête vers une autre origine qui porte des en-têtes personnalisés, et **il n'y met ni ces en-têtes ni les identifiants**. Le proxy voit donc une requête anonyme, répond par une redirection vers le SSO, et le navigateur bloque la suite.

Une extension n'est normalement pas soumise à ce contrôle : avec la permission d'accès à un site, ses `fetch` partent sans restriction d'origine, donc sans preflight. Mais sous Manifest V3, Firefox traite ces permissions d'hôte comme **facultatives** : on peut les accorder ou les retirer à tout moment, et une extension peut très bien se retrouver sans. Elle retombe alors sous CORS, et le mur d'authentification devient infranchissable, quels que soient les identifiants saisis.

## La correction

`about:addons` → l'extension → onglet **Permissions** → activer l'accès aux données du site concerné. Reconnexion immédiate, sans toucher au serveur.

À retenir :

- un `OPTIONS` en 302 ou 401 dans le journal du proxy, c'est un preflight rejeté, pas un mauvais mot de passe ;
- inutile de chercher à autoriser les `OPTIONS` côté proxy si les règles se font par chemin : cela reviendrait à sortir l'API du mur ;
- le message d'erreur de l'extension ne dit rien de tout cela, le journal d'accès du proxy, si.

Sources :
- [host_permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions) (MDN : permissions facultatives, accès sans restriction d'origine)
- [Requête de pré-vérification](https://developer.mozilla.org/fr/docs/Glossary/Preflight_request) (MDN)
- [Manifest V3 migration guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/) (Firefox Extension Workshop)
