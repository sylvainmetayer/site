---
title: "Gem: FontAwesome SVG"
tags:
  - jekyll
  - ruby
  - projet
date: "2018-11-30"
excerpt: "I wanted to use FontAwesome without bundling the whole library, which is rather heavy."
metaDesc: "I wanted to use FontAwesome without bundling the whole library, which is rather heavy."
---

## The need

I wanted to use [FontAwesome](http://fontawesome.com/) without bundling the whole library, which is rather heavy.

So I looked for a way to include only the icons I actually use, and that's how I ended up figuring out how to write a Jekyll plugin.

[The documentation](https://jekyllrb.com/docs/plugins/your-first-plugin/) is quite thorough, which helped me get up to speed with Jekyll quickly.

## Implementation

Since I only wanted to display icons, I went with 2 `Tag`s, which let you define a tag and pass parameters to it.

I pass my first tag the type of icon I want (regular, solid or brand) and its name, and it generates the matching HTML[^1] markup for the icon. All that's left is to fetch the icon's SVG[^3] definition and include it in a namespace at the bottom of the HTML page.

To do this, I add the icons I use to the Jekyll page data, in a simple array.

The second tag is where I collect all the icons used on the page and fetch their SVG definitions.

I first wrote this plugin in the simplest possible way, using Jekyll's `_plugins` directory. Once it worked, I wanted to turn it into a Gem published on [RubyGems](https://rubygems.org/), so that it's available to everyone, should it be useful to anyone :blush:.

Creating a Gem was fairly easy, as the [Bundler](https://bundler.io/v1.17/guides/creating_gem.html) guide is very detailed.

I tried to follow Ruby conventions as closely as possible, but since I'm not familiar with the language, I'm open to any feedback to improve the code!

I still need to test it more thoroughly and handle error cases, which are handled rather optimistically for now!

## Usage

Here is how to use it:

To display an icon, use the following tag. The code below renders the [Twitter](https://fontawesome.com/icons/twitter?style=brands) icon.

```erb
{% raw %}{% fa_svg fab.fa-twitter %}{% endraw %}
```

Here is the result:

{\% fa_svg fab.fa-twitter %}

Then add the tag that generates the SVG sprite sheet somewhere shared by every page (usually a footer).

```erb
{% raw %}{% fa_svg_generate %}{% endraw %}
```

## Links

If you want to look at the code, it's available in this [repository](https://github.com/sylvainmetayer/jekyll-fontawesome-svg).

To download the Gem, [head over here](https://rubygems.org/gems/jekyll-fontawesome-svg)!

[^1]: HyperText Markup Language
[^2]: Cascading Style Sheets
[^3]: Scalable Vector Graphics