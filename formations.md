---
layout: page
title: Formations
---

<h1>Formations, expériences professionnelles et certifications.</h1>

{% if site.formations.size > 0 %}
<section class="list">
    <h2>Formations</h2>
    {% for formation in site.formations reversed %}
            <div class="item">
                <h3 class="title">{{ formation.name }}</h3>
                <aside>
                    <img
                    {% if formation.width %} width="{{formation.width}}" {% endif %}
                    {% if formation.height %} height="{{formation.height}}" {% endif %}
                    src="{{ formation.logo }}" alt="{{ formation.alt }}"/>
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
            </div>
    {% endfor %}
</section>
{% endif %}

{% if site.enterprises.size > 0 %}
<section class="list">
    <h2>Expériences professionnelles</h2>
    {% for company in site.enterprises reversed %}
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
                    <img
                    {% if company.width %} width="{{company.width}}" {% endif %}
                    {% if company.height %} height="{{company.height}}" {% endif %}
                    src="{{ company.logo }}" alt="{{ company.alt }}"/>
                </aside>
                <p>
                    {% if company.more %} {{ company.more }} {% endif %} 
                    <br/>
                    {% if company.date_start %} {{ company.date_start }} - {% endif %}
                    {{ company.date_end }}
                    <br/>
                    {{ company.location }}
                </p>
            </div>
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
                        <a class="url" href="{{ certification.link }}">  
                    {% endif %}
                    {{ certification.name }}
                    {% if certification.link %}
                        </a>
                    {% endif %}
                </h3>
                <aside>
                    <img
                    {% if certification.width %} width="{{certification.width}}" {% endif %}
                    {% if certification.height %} height="{{certification.height}}" {% endif %}
                    src="{{ certification.logo }}" alt="{{ certification.alt }}"/>
                </aside>
                <p>
                    {% if certification.more %} {{ certification.more }} <br/>{% endif %} 
                    {{ certification.date | date: "%B %Y"  }}
                </p>
            </div>
    {% endfor %}
</section>
{% endif %}
