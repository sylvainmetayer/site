# Personal Website

[![Build Status](https://travis-ci.org/sylvainmetayer/sylvainmetayer.svg?branch=master)](https://travis-ci.org/sylvainmetayer/sylvainmetayer)
[![Depfu](https://badges.depfu.com/badges/8854fd930f182d7c719d31bc443abd5e/overview.svg)](https://depfu.com/github/sylvainmetayer/sylvainmetayer?project_id=6389)

WIP :

- Companies : Récupérer les projets liés aux entreprises et faire une page dédiée par entreprise, avec tous les projets réalisés.

> Sylvain METAYER
>
> Based on a modified version of [indigo theme](https://github.com/sergiokopplin/indigo)

## Setup

- `npm` is required

- `npm ci`

- `npm start`

## Setup (docker)

- `docker-compose up -d`

<details>
  <summary>Travis configuration</summary>
  If you want to use travis, you will have to generate the following variables with the [Travis CLI (ruby)](https://docs.travis-ci.com/user/encryption-keys/#usage):

- `travis login` to log in your travis account.

- a private SSH key, to connect to the deploy server.

  To do so, first generate a SSH key and run this command (replacing FILE with the **private** key) : `travis encrypt-file FILE --add`

  The public key must be added to the user `authorized_keys` ssh config, on the remote host

  **Do not version the unencrypted ssh private key !!**

- `travis encrypt DEPLOY_USER=SOME_USER --add`

  This is used to tell travis which user is used to connect to the remote server.

- `travis encrypt DEPLOY_HOST=DOMAIN.FR --add`

  This tells travis where your SSH server is located (can be an IP or a domain)

- `travis encrypt DEPLOY_DIRECTORY_DEV=/var/www/dev.sylvainmetayer.fr --add`

  This tells travis where to deploy your development application on the remote host.

- `travis encrypt DEPLOY_DIRECTORY=SOME_REMOTE_PATH --add`

  This tells travis where to deploy your application on the remote host.

</details>
