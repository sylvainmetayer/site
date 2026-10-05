---
title: "Email alias manager"
tags:
  - projet
  - angular
  - serverless
date: "2020-01-27"
metaDesc: "Too much spam? Tired of handing out your email address to every service? Email aliases to the rescue!"
excerpt: "Too much spam? Tired of handing out your email address to every service? Email aliases to the rescue!"
noToc: false
---

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sylvainmetayer/alias-gandi-angular)

## The idea

Too much spam? Tired of handing out your email address to every service? Email aliases to the rescue!

Following an idea from [Adrien Chinour](https://web.archive.org/web/20200814055750/https://adrienchinour.me/), I decided to build my own small alias manager for my email addresses. The goal is to quickly generate aliases so you don't have to give out your real email address when signing up on random websites. That way, if a site sends a bit too much email for your taste, if you no longer use the service, or if unsubscribing turns into an obstacle course, you just delete the alias, and no more unwanted email!

Since my domains are managed by [Gandi](https://gandi.net), I looked into how to work with my email addresses and create aliases through their [API](https://api.gandi.net/docs/).

As for the tech stack, I used [Angular](https://angular.io) and [Netlify](https://netlify.com) serverless functions (in NodeJS) to handle the calls to the Gandi API.

The principle is very simple: you log in with a password, predefined in the environment variables of the Netlify serverless functions, you get a JWT signed with a secret known only to the serverless functions, and from then on you are considered authenticated. Since I don't need to handle multiple users, this fits my use case.

Once authenticated, the serverless functions fetch the list of domains along with the mailboxes associated with them, and you land on the following screen, which lets you manage the aliases of each mailbox.

![Desktop view: for each mailbox on the domain, the list of its aliases with Copy and Delete buttons, and a field to add a new one](/images/alias-email-desktop.png)

## What's next

In case other Gandi customers would like to use this project, I tried to integrate OAuth2 so that people could log in through Gandi. It also helped me better understand how OAuth2 works.

So I requested the creation of an application, which gave me an `applicationId` and an `applicationSecret` to set up authentication. To test this locally, I used an [OAuth2 mock server built by AXA](https://github.com/axa-group/oauth2-mock-server)

Unfortunately, Gandi's v5 API is still in beta and its authentication provider doesn't yet allow access to domains and mailboxes. 😢

Until that becomes available, I've left my work on a [dedicated branch](https://github.com/sylvainmetayer/alias-gandi-angular/tree/feature/oauth2).

I also added a one-click Netlify deploy button for anyone who wants to use this small project. You will still need to generate your own [API key from your Gandi account settings](https://web.archive.org/web/20200110154834/https://docs.gandi.net/fr/noms_domaine/utilisateurs_avances/api.html) and fill in a few environment variables, described below.

|Parameter|Description|
|--|--|
|GANDI_API_KEY|Gandi API key|
|JWT_SECRET|A random string used as the JWT secret|
|LOGIN_PASSWORD|The password you want to log in with|
|GANDI_API_HOST|The root URL of the Gandi API: `api.gandi.net` |
|GANDI_API_VERSION|The Gandi API version: `/v5`|

To generate the JWT secret, the following command can come in handy

`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`


The project's source code is available on [GitHub](https://github.com/sylvainmetayer/alias-gandi-angular)
