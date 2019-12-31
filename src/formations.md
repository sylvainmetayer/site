---
layout: page
title: Formations
header: true
---

- TOC
{:toc}

# Expériences professionnelles, certifications et formation
{: .no_toc}

{% if site.companies.size > 0 %}
<section class="list">
    <h2 class="center">Expériences professionnelles</h2>
    {% for company in site.companies reversed %}
        <div class="row">
            {% assign remainder = forloop.index | modulo: 2 %}
            {% assign item = company %}
            {% assign projects = site.pro_projects | where: 'company', company.code %}
            {% include card-company.html %}
        </div>
    {% endfor %}
</section>
{% endif %}

{% if site.certifications.size > 0 %}
<section class="list">
    <h2 class="center">Certifications</h2>
    <div class="row">
        {% for certification in site.certifications reversed %}
            {% assign item = certification %}
            {% include card-certification.html %}
        {% endfor %}
    </div>
</section>
{% endif %}

{% if site.formations.size > 0 %}
<section class="list">
    <h2 class="center">Formations</h2>
    <ul class="collection">
        {% for formation in site.formations reversed %}
            {% assign projects = site.school_projects | where: 'school', formation.code %}
            {% assign item = formation %}
            {% include card-formation.html %}
        {% endfor %}
    </ul>
</section>
{% endif %}
