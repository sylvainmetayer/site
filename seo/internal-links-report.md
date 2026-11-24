# Rapport de maillage interne

Exécution du 2026-11-24 : 18 articles modifiés (9 FR et leurs 9 traductions EN), 20 liens ajoutés, aucun encart.

Méthode : `node scripts/internal-link-graph.mjs` analyse `dist/`. Il ne compte que les liens du corps de page (`<main>`, sans nav, fil d'Ariane, partage ni articles voisins). Les liens ajoutés transforment une phrase existante en lien, sans réécriture, en accord avec la règle « vieux articles tels quels ».

| Cible | Avant | Après | Ancre(s) | Article(s) source |
| --- | --- | --- | --- | --- |
| /projets/#ansible-deployment | 0 | 1 | recréer un serveur à l'identique | ansible |
| /projets/#cartographie-gdpr | 0 | 1 | un outil de recherche de données personnelles | cartographie-gdpr |
| /projets/#email-alias-manager | 0 | 1 | un petit gestionnaire d'alias | email-alias-manager |
| /projets/#jekyll-fontawesome-svg | 0 | 1 | créer un plugin Jekyll | jekyll-gem-svg-fontawesome |
| /projets/#kdrive-version-cleaner | 0 | 1 | se faire un petit outil | kdrive-version-cleaner |
| /projets/#latex-starterkit | 0 | 1 | disposer d'un modèle | latex-starterkit |
| /projets/#tbm-interruption-tracker | 0 | 1 | suivi des interruptions des trams bordelais | tbm-interruption |
| /cv/ | 4 | 5 | mon alternance à Atos | cartographie-gdpr |
| /talks/ | 7 | 9 | mon premier meetup live · ma présentation, sur SOPS | meetup-terraform, snowcamp-2025 |

Les mêmes liens existent côté anglais, vers /en/projects/#…, /en/cv/ et /en/talks/.

## Orphelins restants

- **Les ancres de projet ont 1 lien entrant, sous le seuil de 3.** Chaque projet n'a qu'un article qui en parle. Les ajouter ailleurs voudrait dire lier des articles qui ne traitent pas du sujet.
- **/projets/#homelab : 0 lien.** Aucun article ne parle du homelab. Il faudrait un article dédié.
- **/projets/ : 4 liens, sans changement.** Les liens vont vers les ancres de projet plutôt que vers la page.
