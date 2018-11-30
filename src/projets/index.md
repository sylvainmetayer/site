---
layout: page
title: Projets
---

<section class="list">
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% elsif site.paginate %}
		{% for post in paginator.posts %}
            {% if post.hidden == false and post.category == 'projet' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}

		{% include pagination.html%}
	{% else %}
		{% for post in site.posts %}
            {% if post.hidden == false and post.category == 'projet' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}
	{% endif %}
</section>
