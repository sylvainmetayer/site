---
layout: page
title: Projets
---

<section class="list">
	<h2>Projets personnels</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% else %}
		{% for post in site.projects reversed %}
            {% unless post.hidden %}
				{% include blog-post.html %}
			{% endunless %}
		{% endfor %}
	{% endif %}
</section>

<section class="list">
	<h2>Projets professionnels</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% else %}
		{% for post in site.pro_projects reversed %}
            {% unless post.hidden %}
				{% include blog-post.html %}
			{% endunless %}
		{% endfor %}
	{% endif %}
</section>

<section class="list">
	<h2>Projets réalisés durant ma formation</h2>
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% else %}
		{% for post in site.school_projects reversed %}
            {% unless post.hidden %}
				{% include blog-post.html %}
			{% endunless %}
		{% endfor %}
	{% endif %}
</section>
