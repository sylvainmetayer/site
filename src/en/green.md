---
title: Footprint
permalink: /en/green/
layout: layouts/page.njk
translationKey: green
metaDesc: "The carbon footprint of sylvain.dev and the choices that keep it low."
---

What this site does to weigh as little as possible, in the spirit of [/green pages](https://slashpages.net/#green).

{% if carbon -%}
A visit to the home page emits about **{{ carbon }}** of CO₂, according to the [Sustainable Web Design](https://sustainablewebdesign.org/estimating-digital-emissions/) model of the Green Web Foundation ([CO2.js](https://www.thegreenwebfoundation.org/co2-js/)). The measurement is taken again every morning on the production site.

{% endif -%}
- **Static pages**: nothing is computed on a visit, everything is generated once at build time.
- **Very little JavaScript**, no framework, and the site works without it.
- **Native CSS**, inlined in the page: no extra request.
- **Images** converted to AVIF and WebP, at the displayed size.
- **Fonts** served from the site, with no call to a third party.
- **No tracker or third-party script**, apart from audience measurement without cookies.

The technical details are [under the hood](/en/under-the-hood/).
