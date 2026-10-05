---
title: "DevoxxFR 2023"
date: "2023-04-27"
tags:
  - devoxx
  - conference
  - kubernetes
excerpt: "The talks that stood out to us at the 11th edition of DevoxxFR: OpenTelemetry, language models, GitOps, the geopolitics of data, Kubernetes and PostgreSQL."
original: "https://dev.to/onepoint/devoxxfr-2023-1ei"
originalPublisher: onepoint
coauthors:
  - cfrezier
  - cfarges
  - jtama
  - florianallainmat
socialImage: "/images/devoxx-france-2023.jpg"
---

![Devoxx France banner: the Eiffel Tower at sunset, with drones flying overhead](/images/devoxx-france-2023.jpg)

We came (back) to [DevoxxFR](https://www.devoxx.fr/) for this 11th edition, and there was plenty to choose from! With an average of 8 talks/tools-in-action running in parallel, there's something for everyone! Which works out well: since we all have different preferences, we were able to cover a good number of talks across various topics: front-end, AI, CI/CD, Kubernetes...

When there's too much to choose from in the same slot, you can always count on the [Devoxx YouTube channel](https://www.youtube.com/@DevoxxFRvideos). Almost all the talks are already available as replays!

Out of everything we got to see, here is our top 5!

## Top 5

### 1<sup>st</sup> in our ❤️ "Alice au pays d’OpenTelemetry" (Alice in OpenTelemetry Land)

This is an experience report on setting up observability in a project made of several software components. After introducing the concepts of observability and OpenTelemetry, [@jtama](https://dev.to/jtama) iteratively walks us through his experience and the obstacles he ran into while taming this "magic collector" to unify our logs, traces and metrics.

[YouTube replay](https://www.youtube.com/watch?v=0xSCUgHxZu0)
[Slides](https://jtama.github.io/alice-au-pays-d-opentelemetry/#/)
[CFP page](https://cfp.devoxx.fr/2023/talk/ZHL-4882/_Alice_au_pays_d'OpenTelemetry)

### Comprendre et utiliser les modèles de langage d'IA (Understanding and using AI language models)

This 3-hour deep-dive session by [Sébastien Collet](https://twitter.com/collet_seb) introduces Machine Learning and Deep Learning models, how they work, their limits and how they have evolved in recent years.

It also focuses on predictive language models, which helps understand why models such as ChatGPT have the flaws that have been pointed out recently (hallucinations, toxicity...).

If you want a complete, accessible course for non-specialists, including a history of AI models, this talk is for you!

[YouTube replay](https://www.youtube.com/watch?v=ZbWL2W53BXY)
[Slides](https://docs.google.com/presentation/d/e/2PACX-1vReIr93Udkzm3S0qn59AyFDYQjuXq0puGNYlFQYqDyoHqio_UgHbqQV1Qm4sUwt0ZeawfvGFdQOCHLc/pub#slide=id.g21f549ddc89_0_0)
[GitHub repository](https://github.com/sebastien-collet/talks/blob/master/Devoxx%20FR%202023/Ressources.md)
[CFP page](https://cfp.devoxx.fr/2023/talk/OOZ-7789/Comprendre_et_utiliser_les_modeles_de_langage_d'IA)

### Une Architecture GitOps from scratch : Gitlab, Ansible, Terraform, Kubernetes et AWS (A GitOps architecture from scratch: Gitlab, Ansible, Terraform, Kubernetes and AWS)

In this 3-hour deep-dive session, [Loïc Ortola](https://www.twitter.com/@LoicOrtola) and [Aurélien Moreau](https://www.twitter.com/@AurelOps) from [Takima](https://www.takima.fr/) take us on a dive into setting up a Kubernetes cluster with _Infrastructure as code_.

Each tool is justified by the role it plays. The talk gradually builds up a complex, multi-cluster infrastructure, from provisioning the infrastructure all the way to continuous deployment of the applications, in a 100% GitOps approach.

[YouTube replay](https://www.youtube.com/watch?v=FyAD_-LAMLo)
[Gitlab repository](https://gitlab.com/takima-school/takione)
[CFP page](https://cfp.devoxx.fr/2023/talk/EJI-3118/Une_Architecture_GitOps_from_scratch_:_Gitlab,_Ansible,_Terraform,_Kubernetes_et_AWS)

### Géopolitique de la data (The geopolitics of data)

In this 20-minute keynote, [Benjamin Bayart](https://twitter.com/bayartb), co-founder of La Quadrature du Net, uses various examples and plain-language explanations to describe what the geopolitics of data is and how European regulation on personal data protection has evolved.

He closes with the message that every software engineer is involved in the geopolitics of data.

[YouTube replay](https://www.youtube.com/watch?v=EOOhYaGGArc)
[CFP page](https://cfp.devoxx.fr/2023/talk/ITD-6079/Geopolitique_de_la_data)

### Démystifions les composants internes de Kubernetes (Demystifying Kubernetes internals)

The goal of this talk is to show that Kubernetes isn't an "automagic tool", but that it relies on software components that are individually "simple" and that, put together, make Kubernetes robust.

Through a live demo, [Denis Germain](https://twitter.com/zwindler) presents the various components that make up Kubernetes and what each one does, ending up with an application deployed on a "handmade" cluster!

If you want to know what's behind a "kubectl apply -f mon-deploiement.yaml", or understand how "etcd", "api-server", "controller-manager", "scheduler", "kubelet", "containerd" or "CNI" work together, this talk is for you!

[YouTube replay](https://www.youtube.com/watch?v=OCMNA0dSAzc)
[Slides](https://blog.zwindler.fr/talks/2023-demystifions-kubernetes/index.html)
[GitHub repository with the demo](https://github.com/zwindler/demystifions-kubernetes)
[CFP page](https://cfp.devoxx.fr/2023/talk/NSW-2452/Demystifions_les_composants_internes_de_Kubernetes)

### SELECT 'amazing_features' FROM "postgresql"

In this Tools in action, [Kevin Davin](https://twitter.com/davinkevin) helps us (re)discover little-known or forgotten PostgreSQL features.

From performance to syntactic sugar and best practices, Kevin shows us the vast toolbox Postgres offers to help developers build faster, more maintainable applications.

He also points out a few bad practices that are nonetheless common when approaching this database as a newcomer.

Whether or not you use Postgres, this talk will show you its superpowers and make you want to give it a try.

[YouTube replay](https://www.youtube.com/watch?v=I1rAkNDv1Ws)
[Slides](https://download.davinkevin.fr/presentations/select-amazing-features-from-postgresql/devoxxfr-2023/select-amazing-features-from-postgresql.pdf)
[Gitlab repository](https://gitlab.com/davinkevin.fr/presentations/select-amazing_features-from-postgresql)
[CFP page](https://cfp.devoxx.fr/2023/talk/OFK-3682/SELECT_'amazing_features'_FROM_%22postgresql%22)

## Wrapping up

DevoxxFR is 3 days of talks: think of it as a marathon, not a sprint! Plan your schedule and keep some breaks to visit the many booths of the products and software we use every day (or that we got to discover), which are there to collect feedback and suggestions for improvement!

To make note-taking easier, we also built a small tool that automatically generates note templates from your favorites. [The GitHub repository](https://github.com/cfrezier/devoxx2adoc/)

Written by five of us, with the fabulous [@cfrezier](https://dev.to/cfrezier) [@cfarges](https://dev.to/cfarges) [@jtama](https://dev.to/jtama) and [@florianallainmat](https://dev.to/florianallainmat)!

We'd also like to say a big thank you to [onepoint](https://www.groupeonepoint.com) for organizing these 3 great days!

Thanks! 😊
