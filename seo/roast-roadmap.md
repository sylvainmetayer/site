# SEO Roast : www.sylvain.dev + ref.sylvain.dev (2026-11-12)

Verdict : rien de cassé techniquement sur les deux sites. Le vrai trou, c'est que ref.sylvain.dev est une île : aucun lien entrant, même pas depuis www.sylvain.dev.

Niveau FATAL : vide. robots.txt en autorisation par défaut, vraies 404, sitemaps XML valides, Bingbot et robots IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) servis en 200, hreflang fr/en réciproque avec x-default, canoniques cohérentes, avantages de parrainage lisibles dans le HTML sans JavaScript.

| # | Niveau | Problème | Ce que ça bloque | Correctif | Qui | État |
|---|---|---|---|---|---|---|
| 1 | REVENUE | www ne fait aucun lien vers ref (seule la redirection `/parrainage` existe) | ref ne reçoit aucune autorité du seul domaine qui en a : les fiches ont peu de chances de sortir de la page 5 | Liens dans le corps du texte : « Infomaniak » dans `/uses/` et dans l'article kdvc vers `ref.sylvain.dev/infomaniak/`, plus une ligne vers l'accueil de ref | Sylvain (contenu perso) | à faire |
| 2 | REVENUE | Indexation de ref non vérifiée (l'opérateur `site:` n'a rien donné de fiable) | Si les 18 fiches ne sont pas indexées, tout le reste est sans effet | Search Console : inspection d'URL sur l'accueil et 3 fiches, soumission du sitemap | Sylvain | à faire |
| 3 | REVENUE | 28 des 34 pages de tag de www listent 1 ou 2 articles | Un tiers du sitemap était du quasi-doublon de `/articles/`, ce qui dilue les 20 vrais articles | `noindex, follow` sous 3 articles et retrait du sitemap (96 → 68 URL) | agent | dans la PR site |
| 4 | REVENUE | ref pointe vers `https://sylvain.dev` (redirection 308) dans la nav et le JSON-LD `author` | Le seul lien ref → www passe par une redirection, et l'entité `Person` ne correspond pas à celle de www | `authorUrl` en `https://www.sylvain.dev` | agent | dans la PR ref |
| 5 | COMPOUNDING | ref a six semaines et aucun lien externe connu ; « parrainage Boursorama / Fortuneo / Revolut » est tenu par les agrégateurs | Les grosses requêtes sont hors de portée pour l'instant | Viser la longue traîne où la concurrence est faible : Famileo, Merci Facteur, Philibert, Potager City, Horace, Linxea. Un article sur www par service réellement utilisé, avec lien vers la fiche | Sylvain | ensuite |
| 6 | COMPOUNDING | ref n'a pas de `llms.txt` (www en a un) | Les assistants IA lisent les fiches une par une au lieu d'une liste service → avantage → URL | Gabarit généré depuis la collection `referrals`, même source que les pages | agent | ensuite |
| 7 | COMPOUNDING | 8 fiches de ref en `draft: true` | Chaque brouillon est une requête longue traîne non couverte | Publier dès qu'un lien de parrainage existe | Sylvain | ensuite |
| 8 | REVENUE | Le H1 de l'accueil de ref ne contient pas « parrainage » (le `<title>` oui) | Faible : l'accueil vise surtout ton nom, les fiches portent les requêtes | À arbitrer avec le design, pas urgent | Sylvain | optionnel |

Non mesuré : autorité et domaines référents (pas d'accès Ahrefs ou DataForSEO), clics réels (pas d'accès Search Console).

## Fluff (à ignorer tant que les lignes du dessus ne sont pas livrées)

- Sitemap de ref sans `lastmod`.
- `changefreq` et `priority` dans le sitemap de www : ignorés par Google.
- `SearchAction` dans le JSON-LD de www : Google n'affiche plus le champ de recherche associé.
