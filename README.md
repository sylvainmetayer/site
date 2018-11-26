# Personal Website

[![Build Status](https://travis-ci.org/sylvainmetayer/sylvainmetayer.svg?branch=master)](https://travis-ci.org/sylvainmetayer/sylvainmetayer)

> Sylvain METAYER
>
> Based on a modified version of [indigo theme](https://github.com/sergiokopplin/indigo)

## Prerequisite

- `apt-get install build-essential patch ruby-dev zlib1g-dev liblzma-dev libcurl4-openssl-dev` or `dnf install libcurl-devel gcc ruby-devel zlib-devel`
- `ruby` and `gem install bundler`
- run `bundle install`

OR

- docker
- docker-compose

## Start it locally

`bundle exec jekyll serve --config _config.yml,_config-dev.yml --drafts`

## Start it with docker

- `make`

    > The server need some time to intialize at first, because it will install all dependencies.
    >
    > Use `make logs` to check when the server is alive

## Available commands

- Create a draft : `make name=POST_NAME draft`
- Publish a draft : `make name=./_drafts/FILE.md publish`
- Show Jekyll commands : `make help`
- Tests: `make test`
- Clean environment : `make clean`
- Logs: `make logs`
