---
# blog page must be named index.html and in its own folder to support pagination
# https://jekyllrb.com/docs/pagination/
layout: page
title: Blog
header: true
---
<section class="list">
	{% if site.posts.size == 0 %}
		<p class="text-center">Nothing published yet!</p>
	{% else %}
		{% for post in site.posts %}
			{% if post.hidden == false %}
				{% include blog-post.html %}
			{% endif %}
		{% endfor %}
	{% endif %}
</section>
