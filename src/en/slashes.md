---
title: Slashes
permalink: /en/slashes/
layout: layouts/page.njk
translationKey: slashes
metaDesc: "The slash pages of sylvain.dev: now, uses, colophon, blogroll, links, concerts and the others."
---

The [slash pages](https://slashpages.net/) of this site: pages at an agreed address, found from one personal site to the next.

{% if freshrss -%}
- [/blogroll](/blogroll/): the sites I follow (in French).
{% endif -%}
- [/colophon](/en/under-the-hood/): how this site is made.
{% if setlistfm.length -%}
- [/concerts](/concerts/): the concerts I went to (in French).
{% endif -%}
- [/contact](/en/card/): my business card, profiles and email.
- [/feeds](/en/feeds/): the RSS feeds of the site.
- [/glossary](/en/glossary/): the acronyms used here.
{% if links.links.length or karakeep.length -%}
- [/links](/liens/): what I read, watched or used and found worth sharing (in French).
{% endif -%}
- [/now](/en/now/): what I am up to right now.
- [/save](https://ref.sylvain.dev/): my referral links (in French).
- [/self-hosting](/en/uses/#homelab): the services I host myself.
- [/sitemap](/en/sitemap/): every page of the site.
- [/uses](/en/uses/): the hardware and software I use.
