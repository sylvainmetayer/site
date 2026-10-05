---
title: "DevoxxFR 2023"
date: "2023-04-27"
tags:
  - devoxx
  - conference
  - kubernetes
excerpt: "Les conférences qui nous ont marqués à la 11e édition de DevoxxFR : OpenTelemetry, modèles de langage, GitOps, géopolitique de la data, Kubernetes et PostgreSQL."
canonical: "https://dev.to/onepoint/devoxxfr-2023-1ei"
originalPublisher: onepoint
coauthors:
  - cfrezier
  - cfarges
  - jtama
  - florianallainmat
socialImage: "/images/devoxx-france-2023.jpg"
---

![Bannière Devoxx France : la tour Eiffel au coucher du soleil, survolée par des drones](/images/devoxx-france-2023.jpg)

Nous sommes (re)venus à [DevoxxFR](https://www.devoxx.fr/) pour cette 11ème édition, et il y avait du choix ! Avec en moyenne 8 conférences/tool-in-action en parallèle, il y en a pour tous les goûts ! Ça tombe bien, ayant tous des préférences différentes, nous avons pu couvrir un bon nombre des conférences sur différents thèmes : front, IA, CI/CD,  Kubernetes...

Pour les moments où il y a trop de choix sur un même créneau, il est toujours possible de compter sur la [chaine Youtube de Devoxx](https://www.youtube.com/@DevoxxFRvideos). En effet, la quasi-totalité des talks sont déjà disponibles en replay ! 

Parmi ce que nous avons eu l'occasion de voir, voici notre top 5 !

## Top 5

### 1<sup>er</sup> dans nos ❤️ "Alice au pays d’OpenTelemetry"

Il s'agit d'un REX de la mise en place de l'observabilité dans un projet avec plusieurs briques logicielles. Après une présentation des concepts de l'observabilité, d'OpenTelemetry, [@jtama](https://dev.to/jtama) nous présente de façon itérative son expérience et les obstacles rencontrés, afin de dompter ce "collecteur magique" et d'unifier nos logs, traces et métriques.

[Replay Youtube](https://www.youtube.com/watch?v=0xSCUgHxZu0)
[Lien vers les slides](https://jtama.github.io/alice-au-pays-d-opentelemetry/#/)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

### Comprendre et utiliser les modèles de langage d'IA

Cette université de 3h présentée par [Sébastien Collet](https://twitter.com/collet_seb) permet de découvrir les modèles de Machine Learning et Deep Learning, leur fonctionnements et limites ainsi que les évolutions des dernières années.

Un focus est également fait sur les modèles de langages prédictifs, ce qui permet de comprendre pourquoi les modèles tel que ChatGPT ont les biais qui ont été relevés récemment (hallucinations, toxicité...).

Si vous souhaitez un cours complet, vulgarisé et abordable, avec un historique des modèles d'IA, ce talk est pour vous !

[Replay Youtube](https://www.youtube.com/watch?v=ZbWL2W53BXY)
[Slides](https://docs.google.com/presentation/d/e/2PACX-1vReIr93Udkzm3S0qn59AyFDYQjuXq0puGNYlFQYqDyoHqio_UgHbqQV1Qm4sUwt0ZeawfvGFdQOCHLc/pub#slide=id.g21f549ddc89_0_0)
[Dépôt Github](https://github.com/sebastien-collet/talks/blob/master/Devoxx%20FR%202023/Ressources.md)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

### Une Architecture GitOps from scratch : Gitlab, Ansible, Terraform, Kubernetes et AWS

Avec cette université de 3 heures, [Loïc Ortola](https://www.twitter.com/@LoicOrtola) et [Aurélien Moreau](https://www.twitter.com/@AurelOps) de [Takima](https://www.takima.fr/), nous propose une plongée dans la mise en place d'un cluster Kubernetes via de l'_Infrastructure as code_.

L'utilisation de chaque outil est justifiée par son rôle. Le talk développe petit à petit la mise en place d'une infrastructure complexe, multi-cluster en partant du provisionning de l'infrastructure jusqu'au déploiement continue des applications dans une approche 100% Gitops.

[Replay Youtube](https://www.youtube.com/watch?v=FyAD_-LAMLo)
[Lien du dépôt Gitlab](https://gitlab.com/takima-school/takione)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

### Géopolitique de la data

Avec cette keynote de 20 minutes, [Benjamin Bayart](https://twitter.com/bayartb) co-fondateur de la quadrature du net, nous décrit à travers différents exemples et vulgarisations, ce qu'est la Géopolitique de la data et comment la réglementation européenne a évolué sur la protection des données personnelles.

Il clôture son discours en passant le message que tout ingénieur informatique fait de la géopolitique de la data.

[Replay Youtube](https://www.youtube.com/watch?v=EOOhYaGGArc)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

### Démystifions les composants internes de Kubernetes

L'objectif de ce talk est de démontrer que Kubernetes n'est pas "un outil automagique" mais qu'il se base sur des briques logicielles individuellement "simple" mais qui assemblées font la robustesse de Kubernetes.

Au travers d'une démonstration live, [Denis Germain](https://twitter.com/zwindler) nous présente les différentes briques composant Kubernetes et leur utilité pour finalement arriver sur une application déployée sur un cluster "fait main" !

Si vous souhaitez savoir ce qui se cache derrière un "kubectl apply -f mon-deploiement.yaml" ou que vous souhaitez comprendre comment les composants "etcd", "api-server", "controller-manager", "scheduler", "kubelet", "containerd" ou "CNI" fonctionnent ensemble, ce talk est pour vous !

[Replay Youtube](https://www.youtube.com/watch?v=OCMNA0dSAzc)
[Slides](https://blog.zwindler.fr/talks/2023-demystifions-kubernetes/index.html)
[Github contenant la démo](https://github.com/zwindler/demystifions-kubernetes)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

### SELECT 'amazing_features' FROM "postgresql"

Dans ce Tools in action, [Kevin Davin](https://twitter.com/davinkevin) nous propose la (re)découverte de features méconnues ou oubliées de postgresql. 

Entre les performances, les sucres syntaxiques et les bonnes pratiques, Kevin nous montre la vaste boite à outil dont dispose postgres pour aider le développeur à proposer des applications plus performantes et maintenables. 

Il nous présente aussi quelques mauvaises pratiques qui sont pourtant monnaie courante lorsque l'on aborde ce SGBD d'un oeil novice. 

Que vous utilisiez ou non postgres, ce talk vous montrera ses super pouvoirs et vous invite à l'essayer.

[Replay Youtube](https://www.youtube.com/watch?v=I1rAkNDv1Ws)
[Slides](https://download.davinkevin.fr/presentations/select-amazing-features-from-postgresql/devoxxfr-2023/select-amazing-features-from-postgresql.pdf)
[Dépôt Gitlab](https://gitlab.com/davinkevin.fr/presentations/select-amazing_features-from-postgresql)
<s class="dead-link" title="Le site du CFP n'est plus en ligne">Lien du CFP</s>

## Pour finir

DevoxxFR, c'est 3 jours de conférences, voyez ça comme un marathon, pas un sprint ! Planifiez votre programme, et prévoyez des temps de pause, pour faire un tour sur les nombreux stands de produits/logiciels que nous utilisons tous les jours (ou que nous avons eu l'occasion de découvrir), qui sont là pour recueillir des retours d'expérience et propositions d'améliorations ! 

Pour faciliter vos prises de notes, nous avons également développé un petit outil pour générer automatiquement vos templates de notes en fonction de vos favoris. [Le dépôt Github](https://github.com/cfrezier/devoxx2adoc/)

Écrit à 10 mains avec les fabuleux [@cfrezier](https://dev.to/cfrezier) [@cfarges](https://dev.to/cfarges) [@jtama](https://dev.to/jtama) et [@florianallainmat](https://dev.to/florianallainmat) !

On en profite pour faire passer un grand merci à [onepoint](https://www.groupeonepoint.com) pour l'organisation de ces 3 jours au top !

Merci ! 😊
