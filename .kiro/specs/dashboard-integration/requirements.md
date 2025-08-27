# Requirements Document

## Principe 0 : Garder le design et le style et le template et le layout  inchangés

## Introduction

Cette fonctionnalité vise à refondre l'application dashboard existante pour intégrer le contenu complet du dashboard analytique de Yassine. L'objectif est de remplacer le contenu actuel par les données métier spécifiques tout en conservant les graphiques existants et le principe de sidebar contextuelle qui s'affiche lors des interactions utilisateur.

## Requirements

### Requirement 1

**User Story:** En tant qu'utilisateur du dashboard, je veux voir une vue d'ensemble avec les indicateurs principaux de performance, afin de pouvoir rapidement évaluer l'état global de l'activité.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la vue d'ensemble THEN le système SHALL afficher le titre "Analytic: Yassine"
2. WHEN la vue d'ensemble se charge THEN le système SHALL afficher l'indicateur principal "32% Followers"
3. WHEN la vue d'ensemble se charge THEN le système SHALL afficher la progression du budget horaire "8.4K H sur un objectif de 12.5K H"
4. WHEN la vue d'ensemble se charge THEN le système SHALL afficher la progression du budget économique "609.5K € sur un objectif de 1.5M €"
5. WHEN la vue d'ensemble se charge THEN le système SHALL afficher la valeur "Max. Départ" de "13.9K €, 107%"
6. WHEN la vue d'ensemble se charge THEN le système SHALL afficher les pourcentages d'offshoring "39.9%" et "Dossiers Horus : 76.7%"

### Requirement 2

**User Story:** En tant qu'utilisateur, je veux consulter les performances des collaborateurs et les données financières par entité, afin de suivre la productivité et la rentabilité.

#### Acceptance Criteria

1. WHEN l'utilisateur consulte les performances THEN le système SHALL afficher les données de Youssef B. (GD) avec C.A. 79%, V.A. 100%
2. WHEN l'utilisateur consulte les performances THEN le système SHALL afficher les données de Mohamed K. (GD) avec C.P. 100%, V.A. 100%
3. WHEN l'utilisateur consulte les performances THEN le système SHALL afficher les données de Vanessa A. (GD) avec C.P. 96%, V.A. 100%
4. WHEN l'utilisateur consulte les données financières THEN le système SHALL afficher les informations de Radius et Atlantis avec leurs budgets respectifs
5. WHEN l'utilisateur consulte la croissance THEN le système SHALL afficher les listes des clients "IN" et "OUT"

### Requirement 3

**User Story:** En tant qu'utilisateur, je veux accéder à une section Production détaillée, afin de suivre le temps de travail, les dossiers et la production de documents.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la section Production THEN le système SHALL afficher le temps de l'équipe pour chaque collaborateur
2. WHEN l'utilisateur consulte le graphique de production THEN le système SHALL afficher les données du 18 au 22 Août
3. WHEN l'utilisateur consulte les TimeSheets THEN le système SHALL afficher les heures avec indicateurs visuels (croix rouge pour dépassements)
4. WHEN l'utilisateur consulte les dossiers THEN le système SHALL permettre de basculer entre les onglets "Horaire" et "Volumétrique"
5. WHEN l'utilisateur consulte les dossiers en dépassement THEN le système SHALL afficher les pourcentages de dépassement
6. WHEN l'utilisateur consulte la production de documents THEN le système SHALL afficher les catégories IDOC, Devis, IPM avec leurs statuts

### Requirement 4

**User Story:** En tant qu'utilisateur, je veux accéder à une section Planification, afin de gérer les échéances et suivre l'avancement des tâches.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la planification THEN le système SHALL afficher les 58 éléments de planification
2. WHEN l'utilisateur consulte les échéances THEN le système SHALL afficher "1 Finalisation d'échéances, 0 Situation intermédiaire, 0 Présentation Bilan"
3. WHEN l'utilisateur consulte les plans THEN le système SHALL afficher les statuts "1 à faire, 0 En cours, 1 Terminé"
4. WHEN l'utilisateur consulte le calendrier THEN le système SHALL afficher le mois d'Août 2023
5. WHEN l'utilisateur consulte l'assistant virtuel THEN le système SHALL afficher le statut des rapports d'erreurs

### Requirement 5

**User Story:** En tant qu'utilisateur, je veux consulter les données financières détaillées, afin d'analyser la rentabilité et les budgets.

#### Acceptance Criteria

1. WHEN l'utilisateur accède aux finances THEN le système SHALL afficher les progressions budgétaires horaires et économiques
2. WHEN l'utilisateur consulte le C.A 2025 THEN le système SHALL afficher les valeurs ajustées pour chaque période
3. WHEN l'utilisateur consulte la rentabilité THEN le système SHALL permettre de basculer entre "Rentabilité" et "Encours"
4. WHEN l'utilisateur consulte les projets moins rentables THEN le système SHALL afficher la liste avec Philox, Solal MSD, etc.
5. WHEN l'utilisateur consulte les projets top rentables THEN le système SHALL afficher Simbio Kai Jonathan, Bric, etc.

### Requirement 6

**User Story:** En tant qu'utilisateur, je veux accéder à une section RH complète, afin de gérer les bonus, plans de développement et suivi des projets.

#### Acceptance Criteria

1. WHEN l'utilisateur accède aux RH THEN le système SHALL afficher le plan de bonus pour chaque collaborateur
2. WHEN l'utilisateur consulte les plans de développement THEN le système SHALL afficher le nombre de plans pour chaque collaborateur
3. WHEN l'utilisateur consulte le suivi détaillé THEN le système SHALL afficher les statuts "VP paje" et de révision
4. WHEN l'utilisateur consulte les révisions THEN le système SHALL distinguer les révisions "terminale" et "en cours"

### Requirement 7

**User Story:** En tant qu'utilisateur, je veux bénéficier d'une sidebar contextuelle interactive, afin d'obtenir des détails supplémentaires sur chaque élément du dashboard.

#### Acceptance Criteria

1. WHEN l'utilisateur clique sur un graphique THEN le système SHALL afficher une sidebar avec les détails contextuels
2. WHEN l'utilisateur clique sur un élément de graphique THEN le système SHALL afficher les informations spécifiques à cet élément
3. WHEN l'utilisateur clique sur une ligne de tableau THEN le système SHALL afficher les détails de cette ligne dans la sidebar
4. WHEN l'utilisateur clique sur une div ou section THEN le système SHALL afficher les informations contextuelles appropriées
5. WHEN la sidebar est ouverte THEN le système SHALL permettre de la fermer facilement
6. WHEN plusieurs éléments sont cliqués THEN le système SHALL mettre à jour la sidebar avec le contenu du dernier élément sélectionné

### Requirement 8

**User Story:** En tant qu'utilisateur, je veux conserver tous les graphiques existants de l'application, afin de maintenir la cohérence visuelle et fonctionnelle.

#### Acceptance Criteria

1. WHEN le nouveau contenu est intégré THEN le système SHALL préserver tous les composants graphiques existants
2. WHEN les graphiques sont affichés THEN le système SHALL adapter les données aux nouveaux contenus métier
3. WHEN les graphiques sont interactifs THEN le système SHALL maintenir leur fonctionnalité avec la sidebar contextuelle
4. WHEN les graphiques sont mis à jour THEN le système SHALL conserver leur style et leur disposition actuels