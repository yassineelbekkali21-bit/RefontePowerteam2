// Types et interfaces pour le dashboard de Yassine

// Types de base
export interface BudgetProgress {
  current: number;
  target: number;
  unit: 'H' | '€';
  percentage: number;
}

export interface CollaboratorPerformance {
  name: string;
  role: string; // 'GD' etc.
  ca?: number;  // Chiffre d'affaires %
  va?: number;  // Valeur ajoutée %
  cp?: number;  // Coût de production %
}

export interface FinancialEntity {
  name: string;
  budget: number;
  actual: number;
  forecast: number;
  billable: number;
}

export interface FolderStatus {
  name: string;
  time: string;
  percentage: number;
  status: 'exceeding' | 'compliant';
}

export interface TeamMember {
  name: string;
  time: string; // Format "XXh XXm"
}

export interface TimeSheet {
  name: string;
  hours: number;
  target: number;
  status: 'normal' | 'exceeded';
}

export interface DocumentProduction {
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

export interface BonusPlan {
  name: string;
  role: string;
  bonusCount: number;
}

export interface DevelopmentPlan {
  name: string;
  role: string;
  planCount: number;
}

export interface RevisionStatus {
  name: string;
  status: 'terminal' | 'in-progress';
}

export interface Project {
  name: string;
  value: number;
}

export interface RevenueData {
  period: string;
  value: number;
  adjusted: number;
}

export interface ProductionChartData {
  period: string;
  worked: number;
  result: number;
  expected: number;
}

export interface IndividualTask {
  name: string;
  time: string;
  details: string;
}

export interface PlanningItem {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  type: 'finalization' | 'intermediate' | 'presentation';
}

export interface CalendarData {
  month: string;
  year: number;
  events: any[];
}

// Types principaux pour chaque section
export interface OverviewData {
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

export interface ProductionData {
  teamTime: TeamMember[];
  productionChart: ProductionChartData[];
  timeSheets: TimeSheet[];
  folders: {
    exceeding: FolderStatus[];
    compliant: FolderStatus[];
  };
  individualTasks: IndividualTask[];
  documents: DocumentProduction;
}

export interface FinanceData {
  budgets: {
    hourly: BudgetProgress;
    economic: BudgetProgress;
  };
  maxDeparture: {
    value: string;
    percentage: number;
  };
  revenue2025: RevenueData[];
  profitability: {
    lessRentable: Project[];
    topRentable: Project[];
  };
}

export interface HRData {
  bonusPlans: BonusPlan[];
  developmentPlans: DevelopmentPlan[];
  projectTracking: {
    vpPaje: string[];
    revisionStatus: RevisionStatus[];
  };
}

export interface PlanningData {
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

// Types pour la sidebar contextuelle
export type ContextualDataType = 
  | 'kpi' 
  | 'chart' 
  | 'table' 
  | 'project' 
  | 'user' 
  | 'task'
  | 'collaborator'
  | 'budget'
  | 'folder'
  | 'planning-item'
  | 'financial-entity'
  | 'time-sheet';

export interface ContextualData {
  type: ContextualDataType;
  title: string;
  data: any;
  details?: any;
}