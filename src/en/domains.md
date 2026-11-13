---
title: Domains
permalink: /en/domains/
layout: layouts/page.njk
translationKey: domains
metaDesc: "The domain names of Sylvain MÉTAYER and what they are used for."
---

The domain names I own.

- **sylvain.dev**: this site, and a few subdomains:
  - [ref.sylvain.dev](https://ref.sylvain.dev/), my referral links;
  - r.sylvain.dev, short links;
  - [betisier.sylvain.dev](https://betisier.sylvain.dev/), a student project from my DUT, kept online as a souvenir;
  - one `talks.sylvain.dev` subdomain per [talk](/en/talks/), for the slides of each conference:
{%- for talk in talks.talks %}
{%- set shown = false %}
{%- for session in talk.sessions %}
{%- if session.slides and '.talks.sylvain.dev' in session.slides %}
{%- if not shown %}{% set shown = true %}
    - **{{ session.slides | replace('https://', '') | truncate(session.slides.indexOf('.dev') - 4, true, '') }}** ({{ talk.title }}): {% else %}, {% endif -%}
[{{ session.event }} {{ session.date | truncate(4, true, '') }}]({{ session.slides }})
{%- endif %}
{%- endfor %}
{%- endfor %}
- **sylvain.cloud**: my homelab and the services I host.
- **sylvainmetayer.fr**: my first domain name, kept for the record. [memoire.epsi.sylvainmetayer.fr](https://memoire.epsi.sylvainmetayer.fr/) still redirects to my final-year dissertation.
