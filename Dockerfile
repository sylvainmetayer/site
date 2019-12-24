FROM jekyll/jekyll:3.8.6
ADD Gemfile /srv/jekyll
ADD Gemfile.lock /srv/jekyll

WORKDIR /srv/jekyll
RUN bundle install