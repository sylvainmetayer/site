---
layout: page
title: Formations
---

# Formation, expériences professionnelles et certifications

{% if site.data.formations.size > 0 %}
<section class="list">
    <h2>Formations</h2>
    {% for formation in site.data.formations reversed %}
            <div class="item">
                <h3 class="title">{{ formation.name }}</h3>
                <aside>
                {% if formation.width and formation.height %}
                    {% asset "{{ formation.logo }}" alt='{{ formation.alt }}' height="{{formation.height}}" width="{{formation.width}}" %}
                {% else %}
                    {% asset "{{ formation.logo }}" alt='{{ formation.alt }}' %}
                {% endif %}
                </aside>
                <p>
                    {% if formation.more %} {{ formation.more }}, {% endif %}
                    {% if formation.date_start %} {{ formation.date_start }} - {% endif %}
                    {{ formation.date_end }}
                    <br>
                    {% if formation.link %}
                        <a class="url" href="{{ formation.link }}">  
                    {% endif %}
                        {{ formation.location }}
                    {% if formation.link %}
                        </a>
                    {% endif %}
                </p>
                {% if formation.project_tag %}
                    <div class="post-tags">
                        <a class="item" href="{{ site.url }}/tags/#{{ formation.project_tag | slugify }}">Voir les projets réalisés</a>
                    </div>
                {% endif %}
            </div>
    {% endfor %}
</section>
{% endif %}

{% if site.data.enterprises.size > 0 %}
<section class="list">
    <h2>Expériences professionnelles</h2>
    {% for company in site.data.enterprises reversed %}
            <div class="item">
                <h3 class="title">
                    {% if company.link %}
                        <a class="url" href="{{ company.link }}">  
                    {% endif %}
                    {{ company.name }}
                    {% if company.link %}
                        </a>
                    {% endif %}
                </h3>
                <aside>
                {% if company.width and company.height %}
                    {% asset "{{ company.logo }}" alt='{{ company.alt }}' height="{{company.height}}" width="{{company.width}}" %}
                {% else %}
                    {% asset "{{ company.logo }}" alt='{{ company.alt }}' %}
                {% endif %}
                </aside>
                <p>
                    {% if company.more %} {{ company.more }} {% endif %} 
                    <br/>
                    {% if company.date_start %} {{ company.date_start }} - {% endif %}
                    {{ company.date_end }}
                    <br/>
                    {{ company.location }}
                </p>
                {% if company.project_tag %}
                    <div class="post-tags">
                        <a class="item" href="{{ site.url }}/tags/#{{ company.project_tag | slugify }}">Voir les projets réalisés</a>
                    </div>
                {% endif %}
            </div>
    {% endfor %}
</section>
{% endif %}

{% if site.data.certifications.size > 0 %}
<section class="list">
    <h2>Certifications</h2>
    {% for certification in site.data.certifications %}
            <div class="item">
                <h3 class="title">
                    {% if certification.link %}
                        <a class="url" href="{{ certification.link }}">  
                    {% endif %}
                    {{ certification.name }}
                    {% if certification.link %}
                        </a>
                    {% endif %}
                </h3>
                <aside>
                {% if certification.width and certification.height %}
                    {% asset "{{ certification.logo }}" alt='{{ certification.alt }}' height="{{certification.height}}" width="{{certification.width}}" %}
                {% else %}
                    {% asset "{{ certification.logo }}" alt='{{ certification.alt }}' %}
                {% endif %}
                </aside>
                <p>
                    {% if certification.more %} {{ certification.more }} <br/>{% endif %}
                    {% include translated_date.html date=certification.date format="%B %Y" %}
                </p>
            </div>
    {% endfor %}
</section>
{% endif %}
