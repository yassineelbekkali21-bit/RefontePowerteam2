// Types pour le système de supervision

export interface SupervisionTemplate {
  id: string;
  name: string;
  theme: SupervisionTheme;
  description: string;
  checklistItems: ChecklistItem[];
  errorCategories: ErrorCategory[];
  requiredDocuments: string[];
  estimatedDuration: number; // en minutes
  targetRoles: string[];
  createdAt: string;
  updatedAt: string;
}

export type SupervisionTheme = 
  | 'encodage'
  | 'bilan-isoc'
  | 'declaration-ipm' 
  | 'declaration-ipp'
  | 'revision-comptable'
  | 'controle-qualite';

export interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  isRequired: boolean;
  weight: number; // importance de 1 à 5
  relatedErrors: string[]; // IDs des erreurs associées
}

export interface ErrorCategory {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number; // fréquence observée
  impact: 'operational' | 'compliance' | 'financial' | 'client';
  commonCauses: string[];
  preventiveMeasures: string[];
  trainingTopics: string[];
}

export interface SupervisionSession {
  id: string;
  templateId: string;
  collaboratorId: string;
  collaboratorName: string;
  supervisorId: string;
  supervisorName: string;
  clientName?: string;
  dossierRef?: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  duration: number; // durée réelle en minutes
  overallScore: number; // score sur 100
  findings: Finding[];
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes: string;
}

export interface Finding {
  id: string;
  checklistItemId: string;
  errorCategoryId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  evidence?: string; // URL ou description de la preuve
  correctiveAction: string;
  responsible: string;
  dueDate: string;
  actualResolutionDate?: string;
}

export interface CollaboratorProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  experience: number; // années d'expérience
  certifications: string[];
  supervisionHistory: SupervisionStats;
  trainingNeeds: TrainingNeed[];
  strengths: string[];
  improvementAreas: string[];
}

export interface SupervisionStats {
  totalSupervisions: number;
  averageScore: number;
  lastSupervisionDate: string;
  improvementTrend: 'improving' | 'stable' | 'declining';
  commonErrors: ErrorFrequency[];
  trainingCompleted: number;
  certificationStatus: 'up-to-date' | 'renewal-due' | 'expired';
}

export interface ErrorFrequency {
  errorCategoryId: string;
  errorName: string;
  frequency: number;
  lastOccurrence: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface TrainingNeed {
  id: string;
  topic: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  basedOnErrors: string[]; // IDs des erreurs qui justifient ce besoin
  estimatedDuration: number;
  format: 'individual' | 'group' | 'online' | 'workshop';
  status: 'identified' | 'planned' | 'in-progress' | 'completed';
  dueDate?: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetErrors: string[]; // IDs des erreurs ciblées
  content: TrainingModule[];
  duration: number; // en minutes
  format: 'presentation' | 'interactive' | 'hands-on' | 'case-study';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  resources: TrainingResource[];
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  type: 'theory' | 'example' | 'exercise' | 'quiz';
  duration: number;
  resources?: string[];
}

export interface TrainingResource {
  id: string;
  name: string;
  type: 'document' | 'video' | 'link' | 'template';
  url: string;
  description?: string;
}

export interface SupervisionReport {
  id: string;
  period: {
    start: string;
    end: string;
  };
  scope: 'individual' | 'team' | 'department' | 'organization';
  targetId?: string; // ID du collaborateur/équipe/département
  metrics: SupervisionMetrics;
  trends: TrendAnalysis;
  recommendations: ReportRecommendation[];
  trainingPlan: TrainingPlan;
  generatedAt: string;
}

export interface SupervisionMetrics {
  totalSupervisions: number;
  averageScore: number;
  scoreDistribution: { range: string; count: number }[];
  errorsByCategory: { category: string; count: number; trend: string }[];
  improvementRate: number; // pourcentage d'amélioration
  complianceRate: number; // pourcentage de conformité
  trainingEffectiveness: number; // efficacité des formations
}

export interface TrendAnalysis {
  scoreEvolution: { date: string; score: number }[];
  errorEvolution: { date: string; category: string; count: number }[];
  trainingImpact: { before: number; after: number; improvement: number }[];
  predictedTrends: { metric: string; prediction: 'improving' | 'stable' | 'declining' }[];
}

export interface ReportRecommendation {
  id: string;
  type: 'immediate' | 'short-term' | 'long-term';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedImpact: string;
  requiredResources: string[];
  estimatedCost?: number;
  implementationDeadline: string;
}

export interface TrainingPlan {
  id: string;
  targetAudience: string;
  objectives: string[];
  plannedSessions: PlannedTrainingSession[];
  totalDuration: number;
  estimatedCost: number;
  expectedOutcomes: string[];
  successMetrics: string[];
}

export interface PlannedTrainingSession {
  id: string;
  contentId: string;
  title: string;
  participants: string[];
  scheduledDate: string;
  duration: number;
  format: string;
  instructor?: string;
  location?: string;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}
