# Design Document

## Overview

Cette conception détaille l'intégration du contenu du dashboard analytique de Yassine dans l'application dashboard existante. L'approche consiste à remplacer le contenu générique actuel par les données métier spécifiques tout en préservant l'architecture existante, les composants graphiques et le système de sidebar contextuelle.

L'application utilise déjà une architecture React avec TypeScript, des composants UI réutilisables (shadcn/ui), et un système de navigation avec sidebar contextuelle fonctionnel. Notre objectif est de réutiliser cette infrastructure en adaptant uniquement le contenu des données.

## Architecture

### Structure Existante Conservée

L'application suit une architecture modulaire bien établie que nous conserverons :

```
src/
├── components/
│   ├── dashboard/          # Composants dashboard réutilisables
│   │   ├── KPICard.tsx    # Cartes d'indicateurs (conservé)
│   │   ├── ChartCard.tsx  # Composants graphiques (conservé)
│   │   └── DataTable.tsx  # Tableaux de données (conservé)
│   ├── layout/            # Composants de mise en page
│   │   ├── DashboardLayout.tsx      # Layout principal (conservé)
│   │   ├── ContextualSidebar.tsx    # Sidebar contextuelle (conservé)
│   │   └── DashboardSidebar.tsx     # Navigation principale (conservé)
│   └── ui/                # Composants UI de base (conservés)
├── pages/                 # Pages principales (contenu à modifier)
│   ├── Index.tsx         # Vue d'ensemble (à modifier)
│   ├── Production.tsx    # Page Production (à modifier)
│   ├── Finance.tsx       # Page Finance (à modifier)
│   ├── RH.tsx           # Page RH (à modifier)
│   └── Planning.tsx     # Page Planification (à modifier)
```

### Système de Sidebar Contextuelle

Le système existant utilise un mécanisme d'événements basé sur les attributs `data-contextual` :

1. **Déclenchement** : Clic sur un élément avec `data-contextual`
2. **Propagation** : Événement capturé par le `DashboardLayout`
3. **Affichage** : Données transmises à `ContextualSidebar`
4. **Rendu** : Contenu contextuel affiché selon le type d'élément

Ce système sera conservé et étendu pour supporter les nouveaux types de données.

## Components and Interfaces

### 1. Modèles de Données

Nous définirons des interfaces TypeScript pour structurer les données du dashboard de Yassine :

```typescript
// Types pour la Vue d'Ensemble
interface OverviewData {
  title: string;
  mainIndicator: {
    label: string;
    value: string;
    percentage: number;
  };
  budgets: {
    hourly: BudgetProgress;
    economic: BudgetProgress;
  };
  maxDeparture: {
    value: string;
    percentage: number;
  };
  offshoring: {
    percentage: number;
    horusFolders: number;
  };
  collaboratorPerformance: CollaboratorPerformance[];
  financialEntities: FinancialEntity[];
  clientGrowth: {
    clientsIn: string[];
    clientsOut: string[];
  };
}

// Types pour la Production
interface ProductionData {
  teamTime: TeamMember[];
  productionChart: ProductionChartData;
  timeSheets: TimeSheet[];
  folders: {
    exceeding: FolderStatus[];
    compliant: FolderStatus[];
  };
  individualTasks: IndividualTask[];
  documents: DocumentProduction;
}

// Types pour les Finances
interface FinanceData {
  budgets: {
    hourly: BudgetProgress;
    economic: BudgetProgress;
  };
  revenue2025: RevenueData[];
  profitability: {
    lessRentable: Project[];
    topRentable: Project[];
  };
}

// Types pour les RH
interface HRData {
  bonusPlans: BonusPlan[];
  developmentPlans: DevelopmentPlan[];
  projectTracking: {
    vpPaje: string[];
    revisionStatus: RevisionStatus[];
  };
}

// Types pour la Planification
interface PlanningData {
  planning: PlanningItem[];
  deadlines: {
    finalization: number;
    intermediate: number;
    presentation: number;
  };
  planManagement: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  calendar: CalendarData;
  virtualAssistant: {
    errorReports: string;
  };
}
```

### 2. Services de Données

Création de services pour gérer les données de chaque section :

```typescript
// services/dashboardData.ts
export class DashboardDataService {
  static getOverviewData(): OverviewData { /* ... */ }
  static getProductionData(): ProductionData { /* ... */ }
  static getFinanceData(): FinanceData { /* ... */ }
  static getHRData(): HRData { /* ... */ }
  static getPlanningData(): PlanningData { /* ... */ }
}
```

### 3. Composants Spécialisés

Création de composants spécifiques pour les nouveaux types de contenu :

```typescript
// components/dashboard/CollaboratorCard.tsx
interface CollaboratorCardProps {
  name: string;
  role: string;
  caPercentage?: number;
  vaPercentage?: number;
  cpPercentage?: number;
}

// components/dashboard/BudgetProgressCard.tsx
interface BudgetProgressCardProps {
  title: string;
  current: string;
  target: string;
  percentage: number;
}

// components/dashboard/FolderStatusTable.tsx
interface FolderStatusTableProps {
  folders: FolderStatus[];
  type: 'exceeding' | 'compliant';
}
```

### 4. Extension de la Sidebar Contextuelle

Extension du système existant pour supporter les nouveaux types de données :

```typescript
// Nouveaux types contextuels
type ContextualDataType = 
  | 'kpi' 
  | 'chart' 
  | 'table' 
  | 'project' 
  | 'user' 
  | 'task'
  | 'collaborator'    // Nouveau
  | 'budget'          // Nouveau
  | 'folder'          // Nouveau
  | 'planning-item'   // Nouveau
  | 'financial-entity' // Nouveau
  | 'time-sheet';     // Nouveau
```

## Data Models

### Structure des Données Principales

```typescript
// Collaborateur
interface CollaboratorPerformance {
  name: string;
  role: string; // 'GD' etc.
  ca?: number;  // Chiffre d'affaires %
  va?: number;  // Valeur ajoutée %
  cp?: number;  // Coût de production %
}

// Progression budgétaire
interface BudgetProgress {
  current: number;
  target: number;
  unit: 'H' | '€';
  percentage: number;
}

// Entité financière
interface FinancialEntity {
  name: string;
  budget: number;
  actual: number;
  forecast: number;
  billable: number;
}

// Statut de dossier
interface FolderStatus {
  name: string;
  time: string;
  percentage: number;
  status: 'exceeding' | 'compliant';
}

// Membre d'équipe
interface TeamMember {
  name: string;
  time: string; // Format "XXh XXm"
}

// Feuille de temps
interface TimeSheet {
  name: string;
  hours: number;
  target: number;
  status: 'normal' | 'exceeded';
}

// Production de documents
interface DocumentProduction {
  idoc: {
    total: number;
    status: 'unclassified';
  };
  quotes: {
    ipm: number;
    status: 'untreated' | 'treated';
    date?: string;
  };
}

// Plan de bonus
interface BonusPlan {
  name: string;
  role: string;
  bonusCount: number;
}

// Plan de développement
interface DevelopmentPlan {
  name: string;
  role: string;
  planCount: number;
}

// Statut de révision
interface RevisionStatus {
  name: string;
  status: 'terminal' | 'in-progress';
}
```

## Error Handling

### Gestion des Erreurs de Données

1. **Données Manquantes** : Valeurs par défaut et indicateurs visuels
2. **Erreurs de Format** : Validation et transformation des données
3. **Erreurs de Réseau** : États de chargement et retry automatique
4. **Erreurs de Rendu** : Fallbacks pour les composants défaillants

```typescript
// utils/errorHandling.ts
export const handleDataError = (error: Error, fallbackData: any) => {
  console.error('Dashboard data error:', error);
  return fallbackData;
};

export const validateData = <T>(data: unknown, schema: any): T => {
  // Validation avec fallback
};
```

### États de Chargement

```typescript
// hooks/useDashboardData.ts
export const useDashboardData = (section: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Logique de chargement avec gestion d'erreurs
};
```

## Testing Strategy

### 1. Tests Unitaires

- **Composants** : Tests de rendu et d'interaction pour chaque composant modifié
- **Services** : Tests des services de données avec mocks
- **Utilitaires** : Tests des fonctions de transformation de données

### 2. Tests d'Intégration

- **Navigation** : Tests de navigation entre les sections
- **Sidebar Contextuelle** : Tests d'interaction avec les éléments cliquables
- **Responsive** : Tests sur différentes tailles d'écran

### 3. Tests de Données

- **Validation** : Tests de validation des structures de données
- **Transformation** : Tests de transformation des données brutes
- **Fallbacks** : Tests des comportements en cas de données manquantes

### 4. Tests Visuels

- **Snapshots** : Tests de régression visuelle pour chaque page
- **Interactions** : Tests des animations et transitions
- **Accessibilité** : Tests d'accessibilité avec axe-core

### Structure des Tests

```
src/
├── __tests__/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── KPICard.test.tsx
│   │   │   ├── ChartCard.test.tsx
│   │   │   └── DataTable.test.tsx
│   │   └── layout/
│   │       └── ContextualSidebar.test.tsx
│   ├── pages/
│   │   ├── Overview.test.tsx
│   │   ├── Production.test.tsx
│   │   ├── Finance.test.tsx
│   │   ├── RH.test.tsx
│   │   └── Planning.test.tsx
│   ├── services/
│   │   └── dashboardData.test.ts
│   └── utils/
│       └── dataTransformation.test.ts
```

### Outils de Test

- **Jest** : Framework de test principal
- **React Testing Library** : Tests de composants React
- **MSW** : Mock Service Worker pour les tests d'API
- **Storybook** : Documentation et tests visuels des composants

## Implementation Approach

### Phase 1 : Préparation des Données

1. **Création des Types** : Définition des interfaces TypeScript
2. **Services de Données** : Implémentation des services de récupération
3. **Utilitaires** : Fonctions de transformation et validation

### Phase 2 : Modification des Pages

1. **Vue d'Ensemble** : Remplacement du contenu de la page Overview
2. **Production** : Mise à jour de la page Production
3. **Finance** : Adaptation de la page Finance
4. **RH** : Modification de la page RH
5. **Planification** : Mise à jour de la page Planning

### Phase 3 : Extension de la Sidebar

1. **Nouveaux Types** : Ajout des types contextuels spécifiques
2. **Rendu Contextuel** : Adaptation du rendu selon les nouveaux types
3. **Actions** : Ajout d'actions spécifiques aux nouveaux contenus

### Phase 4 : Tests et Optimisation

1. **Tests Unitaires** : Couverture complète des nouveaux composants
2. **Tests d'Intégration** : Validation des interactions
3. **Optimisation** : Performance et accessibilité
4. **Documentation** : Mise à jour de la documentation

### Stratégie de Migration

- **Remplacement Progressif** : Migration page par page
- **Compatibilité** : Maintien de la compatibilité avec l'existant
- **Rollback** : Possibilité de retour en arrière
- **Validation** : Tests à chaque étape

Cette approche garantit une intégration fluide du nouveau contenu tout en préservant l'architecture et les fonctionnalités existantes de l'application dashboard.