---
layout: page
title: Formations
---

# Expériences professionnelles, certifications et formation

{% if site.companies.size > 0 %}
<section class="list">
    <h2>Expériences professionnelles</h2>
    {% for company in site.companies reversed %}
            <div class="item">
                <h3 class="title">
                    {% if company.link %}
                        <a class="url" href="{{ company.link }}">{{ company.title }}</a>
                    {% else %}
                        {{ company.title }}
                    {% endif %}
                </h3>
                <aside>
                {% asset "{{ company.logo }}" alt='{{ company.alt }}' %}
                <!-- {% asset "{{ company.logo }}" alt='{{ company.alt }}' height="{{company.height}}" width="{{company.width}}" %} -->
                </aside>
                {{ company.content | markdownify }}
                <p>
                    {% if company.more %} {{ company.more }} {% endif %} 
                    <br/>
                    Du {{ company.date | date:"%d-%m-%Y" }} 
                    {% if company.to %}
                        au {{ company.to | date:"%d-%m-%Y" }}
                    {% else %}
                        à Aujourd'hui
                    {% endif %}
                    <br/>
                    {{ company.location }}
                </p>
                {% assign projects = site.pro_projects | where: 'company', company.code %}
                {% if projects.size > 0 %}
                <p>Projets réalisés</p>
                <ul class="post-tags">
                    {% for project in projects %}
                        <li><a href="{{site.url}}{{project.url}}">{{project.title}}</a></li>
                    {% endfor %}
                </ul>
                {% endif %}
            </div>
            <hr/>
    {% endfor %}
</section>
{% endif %}

{% if site.certifications.size > 0 %}
<section class="list">
    <h2>Certifications</h2>
    {% for certification in site.certifications reversed %}
            <div class="item">
                <h3 class="title">
                    {% if certification.link %}
                        <a class="url" href="{{ certification.link }}">{{ certification.name }}</a>
                    {% else %}
                        {{ certification.name }}
                    {% endif %}
                </h3>
                <aside>
                <!-- {% asset "{{ certification.logo }}" alt='{{ certification.alt }}' height="{{certification.height}}" width="{{certification.width}}" %} -->
                {% asset "{{ certification.logo }}" alt='{{ certification.alt }}' %}
                </aside>
                {{ certification.content | markdownify }}
                <p>
                    {% include translated_date.html date=certification.date format="%B %Y" %}
                </p>
            </div>
    {% endfor %}
</section>
{% endif %}

{% if site.formations.size > 0 %}
<section class="list">
    <h2>Formations</h2>
    {% for formation in site.formations reversed %}
            <div class="item">
                <h3 class="title">{{ formation.title }}</h3>
                <aside>
                <!-- {% asset "{{ formation.logo }}" alt='Logo {{ formation.title }}' height="60" width="60" %} -->
                {% asset "{{ formation.logo }}" alt='Logo {{ formation.title }}' %}
                </aside>
                {{ formation.content | markdownify }}
                <p>
                    {% if formation.date_start %} 
                        {{ formation.date_start | date: '%Y' }} -
                    {% endif %}
                    {{ formation.date | date: '%Y' }}
                    <br>
                    {% if formation.link %}
                        <a class="url" href="{{ formation.link }}">  
                    {% endif %}
                    {{ formation.location }}
                    {% if formation.link %}
                        </a>
                    {% endif %}
                </p>
                {% assign projects = site.school_projects | where: 'school', formation.code %}
                {% if projects.size > 0 %}
                <p>Projets réalisés</p>
                <ul class="post-tags">
                    {% for project in projects %}
                        <li><a href="{{site.url}}{{project.url}}">{{project.title}}</a></li>
                    {% endfor %}
                </ul>
                {% endif %}
            </div>
    {% endfor %}
</section>
{% endif %}
