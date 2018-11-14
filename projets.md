---
layout: page
title: Projets
---
<section class="list">
    {% for post in site.posts %}
        {% if post.hidden == false and post.category == 'projet' %}
            <div class="item {% if post.star %}star{% endif %}">
                <a class="url" href="{% if post.externalLink %}{{ post.externalLink }}{% else %}{{ site.url }}{{ post.url }}{% endif %}">
                    <h3 class="title">{{ post.date | date: "%b %d %Y" }} - {{ post.title }}</h3>
                </a>
            </div>
        {% endif %}
    {% endfor %}
</section>
