---
title: Blank
permalink: /blank/
layout: layouts/base.njk
metaDesc: "Une page laissée blanche intentionnellement."
---
{% from 'partials/macros.njk' import breadcrumb with context %}
{{ breadcrumb([], 'blank') }}
<h1 class="visually-hidden">Page laissée blanche intentionnellement</h1>
