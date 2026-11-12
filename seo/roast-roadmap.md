# SEO Roast : www.sylvain.dev + ref.sylvain.dev (2026-11-12)

Verdict : rien de cassé techniquement sur les deux sites. Le vrai trou, c'est que ref.sylvain.dev est une île : aucun lien entrant, même pas depuis www.sylvain.dev.

Niveau FATAL : vide. robots.txt en autorisation par défaut, vraies 404, sitemaps XML valides, Bingbot et robots IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) servis en 200, hreflang fr/en réciproque avec x-default, canoniques cohérentes, avantages de parrainage lisibles dans le HTML sans JavaScript.

| # | Niveau | Problème | Ce que ça bloque | Correctif | Qui | État |
|---|---|---|---|---|---|---|
| 1 | REVENUE | www ne fait aucun lien vers ref (seule la redirection `/parrainage` existe) | ref ne reçoit aucune autorité du seul domaine qui en a : les fiches ont peu de chances de sortir de la page 5 | Liens dans le corps du texte : « Infomaniak » dans `/uses/` et dans l'article kdvc vers `ref.sylvain.dev/infomaniak/`, plus une ligne vers l'accueil de ref | agent | dans la PR site (liens Infomaniak) |
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

## Titres (seo-title-optimization, 2026-11-12)

Sur www, seul le `<title>` change, via `metaTitle` : les H1, les slugs et les flux gardent le titre d'origine. Même traitement pour les versions anglaises.

| Page | Titre actuel | Nouveau `<title>` | Pourquoi |
|---|---|---|---|
| `/article/kdrive-version-cleaner/` | kdvc : faire le ménage dans les versions d'un kDrive | Supprimer les anciennes versions d'un kDrive (kdvc) | La requête d'abord, le nom de l'outil ensuite |
| `/article/recuperer-donnees-mysql/` | Dumps SQL d'un MySQL/MariaDB qui ne démarre plus | MySQL/MariaDB ne démarre plus : récupérer ses données | On cherche le symptôme, pas « dumps SQL » |
| `/article/meetup-terraform/` | Premier Meetup | Terraform, REX d'un développeur : mon premier meetup | Le sujet du talk était absent |
| `/article/email-alias-manager/` | Gestionnaire d'alias d'emails | Gestionnaire d'alias email pour Gandi (Angular) | Précise le fournisseur et la techno |
| `/article/jekyll-gem-svg-fontawesome/` | Gem : FontAwesome SVG | Gem Jekyll : icônes FontAwesome en SVG | « Jekyll » manquait |
| `/article/latex-starterkit/` | Latex Starter Kit | LaTeX Starter Kit : un modèle pour rédiger en LaTeX | Dit ce que c'est |
| `/article/tbm-interruption/` | TBM Interruption Tracker Bot | Bot de suivi des interruptions du tram TBM | Titre anglais sur un article français |

Laissés tels quels : les articles d'études (mémoires, projets DUT, DAWIN, EPSI), les deux articles sur le site lui-même et les retours de conférence, dont la canonique pointe vers dev.to ou LinkedIn.

À arbitrer : le nom de famille n'apparaît dans aucun `<title>` de www (« Sylvain · développeur backend & DevOps », « CV · Sylvain »). Pour une recherche « Sylvain Métayer », seuls le JSON-LD et `llms.txt` le portent.

Sur ref, les titres sont déjà construits sur la requête (« Code parrainage X : avantage »). Suggestions seulement, non appliquées : les textes de ref passent par le skill humanizer.

| Fiche | Titre actuel | Suggestion | Pourquoi |
|---|---|---|---|
| `/boursorama/` | Parrainage Boursorama (BoursoBank) : prime selon l'offre en cours · Sylvain (75 c.) | Parrainage Boursorama (BoursoBank) : prime en cours | Coupé dans Google au-delà de 60 caractères environ |
| `/infomaniak/` | Infomaniak : mon lien d'affiliation (kDrive, mail, hébergement) · Sylvain (73 c.) | Lien affilié Infomaniak : kDrive, mail, hébergement | Plus court, aligné sur le H1 |
| `/fever/` | Code parrainage Fever : 5 € 1er événement | Code parrainage Fever : 5 € sur ton 1er événement | `gainLabel` illisible une fois collé au montant |
| `/horace/` | Lien de parrainage Horace : -20 % 1re commande | Lien de parrainage Horace : -20 % sur ta 1re commande | Idem |
| `/philibert/` | Lien de parrainage Philibert | Ajouter l'avantage quand il est connu | Seule fiche sans bénéfice dans le titre |

## Maillage (internal-linking, 2026-11-12)

Le script du skill n'a pas été copié : il suppose des routes Next.js ou Astro et un seul domaine, alors qu'ici les pages cibles sont sur ref et les sources sur www.

| Cible | Liens contextuels avant | Après | Ancres | Sources |
|---|---|---|---|---|
| `ref.sylvain.dev/infomaniak/` | 0 | 2 | « Infomaniak » (×2) | `/uses/`, `/article/kdrive-version-cleaner/` |
| Les 17 autres fiches | 0 | 0 | | Aucun article de www ne parle de ces services |

Candidats restants, non appliqués :

- L'article kdvc cite Claude Code avec un lien vers le site officiel : une phrase vers `ref.sylvain.dev/claude-code/` est possible, à toi de voir si un parrainage a sa place dans cet article.
- Dans l'autre sens, l'avis de la fiche Infomaniak sur ref peut renvoyer vers l'article kdvc (texte de ref, donc humanizer).
- Les fiches orphelines ne se débloqueront qu'avec de nouveaux articles (ligne 5 du tableau principal).
