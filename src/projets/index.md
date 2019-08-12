---
layout: page
title: Projets
---

<section class="list">
	<h2>Projets personnels</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% elsif site.paginate %}
		{% for post in paginator.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'personal' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}

		{% include pagination.html%}
	{% else %}
		{% for post in site.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'personal' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}
	{% endif %}
</section>

<section class="list">
	<h2>Projets professionnels</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% elsif site.paginate %}
		{% for post in paginator.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'company' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}

		{% include pagination.html%}
	{% else %}
		{% for post in site.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'company' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}
	{% endif %}
</section>

<section class="list">
	<h2>Projets réalisés durant ma formation</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% elsif site.paginate %}
		{% for post in paginator.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'school' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}

		{% include pagination.html%}
	{% else %}
		{% for post in site.posts %}
            {% if post.hidden == false and post.category == 'projet' and post.project_type == 'school' %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}
	{% endif %}
</section>
