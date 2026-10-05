---
title: "Our take on Build & Deploy at Devoxx France 2024"
date: "2024-05-30"
tags:
  - devoxx
  - conference
  - kubernetes
excerpt: "The Build & Deploy talks that stood out to us at Devoxx France 2024: Gateway API, multi-region Kubernetes, supply chain, eBPF, Vault and Boundary."
original: "https://dev.to/onepoint/notre-retour-build-deploy-sur-devoxx-france-2024-kg7"
originalPublisher: onepoint
coauthors:
  - cfarges
  - jtama
socialImage: "/images/devoxx-france-2024.jpg"
---

![Devoxx France 2024 banner: a humanoid robot sprinting on a running track](/images/devoxx-france-2024.jpg)

After our colleagues' write-ups, here is ours on the Build & Deploy track of Devoxx France 2024.

And as every year, the least we can say is that there was plenty to choose from, with dozens of talks on how to package and deploy our applications! Without further ado, here are the topics in this category that stood out to [@cfarges](https://dev.to/cfarges), [@jtama](https://dev.to/jtama) and me.

## GatewayAPI, 10 ans de maturation pour une nouvelle API Kubernetes (GatewayAPI, 10 years in the making for a new Kubernetes API)

This year, [Kévin Davin](https://www.linkedin.com/in/davinkevin/) came to talk to us about the Gateway API. <3

With quite a bit of hindsight, the verdict is clear: the _Ingress_ resource is not enough. It takes on too many responsibilities, isn't specific enough, leaves each implementation free to make different choices for the same problem (poor portability), and doesn't provide enough features either.

The Gateway API is *role*-oriented, with several _kinds_:

- The _GatewayClass_:: For the provider, the one who knows the network
- The _Gateway_ :: For the cluster operator, the one who knows the cluster 🤷
- The _GRPCRoute_ / _HTTPRoute_:: For developers, the ones who know the applications.

Each person has their own skills, knowledge, responsibilities, and _kind_.

This API goes far enough to overlap significantly with some of the features offered by _service meshes_ (including traffic splitting).

<s class="dead-link" title="The replay video is no longer available">Replay</s>

## Multi Kubernetes, Multi Régions, Au-secours ! (Multi Kubernetes, Multi Region, Help!)

Through a REX (experience report) built around a fictional company, [Aurélien Moreau](https://www.linkedin.com/in/aur%C3%A9lien-moreau-32075a105/) and [Nicolas Lavacry](https://www.linkedin.com/in/nicolas-lavacry-13a21415/) present the needs of their new company: CASDAL. It has 2 markets, one in the US and one in France. How do you host this application?

We then learn how to deploy a Kubernetes environment across several regions, and why several clusters are needed to keep latency low, since Kubernetes doesn't like latency when a continent separates its nodes. Their flawlessly executed demo takes us behind the scenes and shows the tools and methods to guarantee quality of service, low latency and data integrity!

[Replay](https://www.youtube.com/watch?v=ADp3fonoDWM)

## Notre dépendance à l'Open Source est effrayante. SLSA, SBOM et Sigstore à la rescousse (Our dependency on Open Source is scary. SLSA, SBOM and Sigstore to the rescue)

This very interesting talk shows how much we rely on third-party software and dependencies in our applications, over which we have no control. Does that mean we should use them without checking their integrity, leaving room for a middleman to inject malicious code during a packaging step of our application?

[Abdellfetah Sghiouar](https://www.linkedin.com/in/sabdelfettah/) then presents tools we can rely on to guarantee the traceability of our applications, such as cosign to sign our images before deploying them to our cluster, or SBOMs to list every package used in our application.

[Replay](https://www.youtube.com/watch?v=MEJ-ae_D8X4)

## Au cœur de la ruche eBPF! (Inside the eBPF hive!)

I had heard about eBPF several times without really knowing what it was. So this talk was an opportunity for me to dig into the subject! Although very technical, [Mohammed Aboullaite](https://www.linkedin.com/in/aboullaite/) clearly explained how a kernel module works and how eBPF has evolved. I don't think I'll be writing my own kernel module tomorrow, but I now better understand all the "hype" around it and the value eBPF brings by making it easier to distribute a new module, with native performance and the same level of security.

[Replay](https://www.youtube.com/watch?v=XaBbxb0r0fc)

## Le cauchemar des attaquants : une infrastructure sans secret (An attacker's nightmare: a secretless infrastructure)

[Thibault Lengagne](https://www.linkedin.com/in/thibault-lengagne-76a35583/) shows us how to use Vault and Boundary to get rid of most passwords
in our environments while keeping a "Secure by design" approach and full traceability of every access to application components.

With a Zero-Credentials architecture, each user has a single password that gives access, through Boundary,
to our applications. Combining Boundary and Vault makes it possible to create temporary credentials and keep full traceability of access, from development environments all the way to production.

Thibault shows us an architecture and the best practices that go with these concepts. Through several short demos, we start wanting to roll this out in our own environments, especially as our teams keep growing.

No more endless password rotations: we have one access, and the rest is handled by the policies defined in our infrastructure's source code.

[Replay](https://www.youtube.com/watch?v=U3AL2pqPg3I)

## Check-list ultime pour rendre vos app cloud native (The ultimate checklist to make your apps cloud native)

In this talk, [Katia Himeur](https://www.linkedin.com/in/katiahimeur/) goes over the various contexts that may lead us to move our applications to the "cloud".

She reminds us that the definition of "cloud" can vary widely depending on who you're talking to. The complexity, the plethora of available solutions (over 2,000 tools in the CNCF landscape, for example) and the diversity of providers must all be taken into account in a cloud project, whether for a new application
or for migrating an existing one.

Part methodology, part experience report, Katia's talk is a goldmine of information and inspiration on how to approach this kind of project.

The points she covers are as much about people as about technology, including team onboarding and change management. The main pain points of these projects are addressed: could this be the ultimate recipe?

[Replay](https://www.youtube.com/watch?v=3s-gtziZ3UU)

## Final words

Thanks to [@onepoint](https://dev.to/onepoint) for allowing us to take part in this special event every year!
Feel free to check out the other articles our colleagues published on the other tracks!

Read our full series of articles on Devoxx:

1. [Intro](https://dev.to/onepoint/devoxx-france-2024-8o)
2. [Frontend](https://dev.to/onepoint/notre-retour-frontend-sur-devoxx-2024-1jgg)
3. [Data/AI](https://dev.to/onepoint/mais-oui-ia-de-la-data-a-devoxx-france-2024--4kpe)
4. [Backend](https://dev.to/onepoint/notre-retour-backend-sur-devoxx-2024-4knc)
