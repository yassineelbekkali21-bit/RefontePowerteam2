# Implementation Plan

- [x] 1. Créer les types et interfaces TypeScript pour les données du dashboard
  - Définir les interfaces pour OverviewData, ProductionData, FinanceData, HRData, PlanningData
  - Créer les types pour CollaboratorPerformance, BudgetProgress, FinancialEntity, FolderStatus
  - Implémenter les types pour TeamMember, TimeSheet, DocumentProduction, BonusPlan, DevelopmentPlan
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 2. Implémenter le service de données du dashboard
  - Créer le fichier `src/services/dashboardData.ts` avec la classe DashboardDataService
  - Implémenter les méthodes getOverviewData(), getProductionData(), getFinanceData()
  - Implémenter les méthodes getHRData(), getPlanningData()
  - Ajouter la gestion d'erreurs et les données de fallback
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 3. Créer les composants spécialisés pour le nouveau contenu
- [x] 3.1 Créer le composant CollaboratorCard
  - Implémenter `src/components/dashboard/CollaboratorCard.tsx`
  - Ajouter le support pour les données CA, VA, CP avec indicateurs visuels
  - Intégrer les données contextuelles pour la sidebar
  - Écrire les tests unitaires pour CollaboratorCard
  - _Requirements: 2.1, 7.1, 7.2, 7.3, 7.4_

- [x] 3.2 Créer le composant BudgetProgressCard
  - Implémenter `src/components/dashboard/BudgetProgressCard.tsx`
  - Ajouter les barres de progression et indicateurs de pourcentage
  - Intégrer les données contextuelles pour la sidebar
  - Écrire les tests unitaires pour BudgetProgressCard
  - _Requirements: 1.3, 1.4, 5.1, 5.2, 7.1, 7.2_

- [x] 3.3 Créer le composant FolderStatusTable
  - Implémenter `src/components/dashboard/FolderStatusTable.tsx`
  - Ajouter le support pour les dossiers en dépassement et conformes
  - Intégrer les indicateurs visuels (croix rouge pour dépassements)
  - Intégrer les données contextuelles pour la sidebar
  - Écrire les tests unitaires pour FolderStatusTable
  - _Requirements: 3.4, 3.5, 7.1, 7.3_

- [x] 4. Modifier la page Vue d'Ensemble (Overview)
- [x] 4.1 Remplacer le contenu de la page Overview
  - Modifier `src/pages/Overview.tsx` pour utiliser les données de Yassine
  - Implémenter l'affichage du titre "Analytic: Yassine" et l'indicateur "32% Followers"
  - Ajouter les sections budget horaire et économique avec progression
  - Intégrer les données Max. Départ et pourcentages d'offshoring
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4.2 Intégrer les performances des collaborateurs
  - Ajouter l'affichage des performances de Youssef B., Mohamed K., Vanessa A.
  - Utiliser le composant CollaboratorCard pour l'affichage
  - Intégrer les données financières par entité (Radius, Atlantis)
  - Ajouter la section croissance avec clients "IN" et "OUT"
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.3 Conserver et adapter les graphiques existants
  - Adapter les données des graphiques existants au nouveau contenu
  - Maintenir la fonctionnalité interactive avec la sidebar contextuelle
  - Préserver le style et la disposition des graphiques actuels
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 5. Modifier la page Production
- [x] 5.1 Implémenter la section suivi de production
  - Modifier `src/pages/Production.tsx` pour afficher le temps de l'équipe
  - Ajouter l'affichage des données Mohamed Kuda, Youssef Bicheau, Vanessa Amsot, Ismah Abdelhacou
  - Implémenter le graphique de production (18 au 22 Août)
  - _Requirements: 3.1, 3.2_

- [x] 5.2 Implémenter la gestion des TimeSheets
  - Ajouter l'affichage des TimeSheets avec indicateurs visuels
  - Implémenter les croix rouges pour les dépassements (Mohamed Kuda, Zoukira Al Lamin)
  - Intégrer les données contextuelles pour la sidebar
  - _Requirements: 3.3, 7.1, 7.3_

- [x] 5.3 Implémenter la gestion des dossiers
  - Ajouter les onglets "Horaire" et "Volumétrique"
  - Utiliser FolderStatusTable pour les dossiers en dépassement et conformes
  - Implémenter l'affichage des pourcentages de dépassement
  - _Requirements: 3.4, 3.5_

- [x] 5.4 Implémenter le suivi des tâches individuelles et production de documents
  - Ajouter la section "06 Open Teku" avec onglets Individual/Both/Semaine
  - Implémenter l'affichage de la production IDOC, Devis, IPM
  - Ajouter les statuts "Non classé", "Non traité", "Traité"
  - _Requirements: 3.6_

- [x] 6. Modifier la page Planification
- [x] 6.1 Implémenter la section planification principale
  - Modifier `src/pages/Planning.tsx` pour afficher les 58 éléments de planification
  - Ajouter l'affichage des échéances (1 Finalisation, 0 Situation intermédiaire, 0 Présentation Bilan)
  - Implémenter la gestion des plans avec statuts (1 à faire, 0 En cours, 1 Terminé)
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 6.2 Implémenter le calendrier et assistant virtuel
  - Ajouter l'affichage du calendrier pour Août 2023
  - Implémenter la fonctionnalité Assistant Virtuel
  - Ajouter l'affichage du statut des rapports d'erreurs
  - _Requirements: 4.4, 4.5_

- [x] 7. Modifier la page Finance
- [x] 7.1 Implémenter les sections budgétaires
  - Modifier `src/pages/Finance.tsx` pour afficher les progressions budgétaires
  - Utiliser BudgetProgressCard pour l'affichage des budgets horaires et économiques
  - Ajouter l'affichage de Max. Départ avec valeur et pourcentage
  - _Requirements: 5.1_

- [x] 7.2 Implémenter le C.A 2025 et la rentabilité
  - Ajouter l'affichage du C.A 2025 avec valeurs ajustées
  - Implémenter les onglets "Rentabilité" et "Encours"
  - Ajouter les listes des projets moins rentables et top rentables
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [x] 8. Modifier la page RH
- [x] 8.1 Implémenter les plans de bonus et développement
  - Modifier `src/pages/RH.tsx` pour afficher les plans de bonus par collaborateur
  - Ajouter l'affichage des plans de développement avec compteurs
  - Utiliser les composants appropriés avec données contextuelles
  - _Requirements: 6.1, 6.2_

- [x] 8.2 Implémenter le suivi détaillé des projets/clients
  - Ajouter l'affichage des statuts "VP paje" avec liste des clients
  - Implémenter l'affichage des statuts de révision (terminale, en cours)
  - Intégrer les données contextuelles pour la sidebar
  - _Requirements: 6.3, 6.4_

- [x] 9. Étendre le système de sidebar contextuelle
- [x] 9.1 Ajouter les nouveaux types contextuels
  - Modifier `src/components/layout/ContextualSidebar.tsx` pour supporter les nouveaux types
  - Ajouter les types 'collaborator', 'budget', 'folder', 'planning-item', 'financial-entity', 'time-sheet'
  - Implémenter le rendu spécifique pour chaque nouveau type
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 9.2 Implémenter les actions contextuelles spécifiques
  - Ajouter les actions rapides appropriées pour chaque type de contenu
  - Implémenter les fonctionnalités "Voir le détail complet", "Exporter", "Partager"
  - Adapter les actions selon le contexte (collaborateur, budget, dossier, etc.)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 10. Créer les utilitaires de transformation de données
  - Implémenter `src/utils/dataTransformation.ts` avec fonctions de formatage
  - Ajouter les fonctions de validation des données avec fallbacks
  - Créer les utilitaires de gestion d'erreurs spécifiques au dashboard
  - Écrire les tests unitaires pour les utilitaires
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [ ] 11. Implémenter les tests d'intégration
- [ ] 11.1 Créer les tests de navigation
  - Écrire les tests de navigation entre toutes les sections du dashboard
  - Tester la cohérence des données affichées lors des transitions
  - Valider le maintien de l'état de la sidebar contextuelle
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 11.2 Créer les tests d'interaction avec la sidebar
  - Tester les interactions de clic sur tous les types d'éléments
  - Valider l'affichage correct des données contextuelles
  - Tester la fermeture et l'ouverture de la sidebar
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 12. Optimiser les performances et l'accessibilité
  - Optimiser le chargement des données avec lazy loading si nécessaire
  - Valider l'accessibilité de tous les nouveaux composants
  - Tester la responsivité sur différentes tailles d'écran
  - Optimiser les animations et transitions de la sidebar
  - _Requirements: 8.1, 8.2, 8.3, 8.4_