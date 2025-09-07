export type ErrorType = 'Encodage' | 'TVA' | 'Bilan' | 'ISOC' | 'IPP' | 'IPM' | 'Autre';
export type Severity = 'Mineure' | 'Modérée' | 'Majeure' | 'Critique';
export type TrainingFormat = 'Pratique' | 'Théorique' | 'Interactif' | 'Étude de cas';

export interface SupervisionChecklistItem {
  id: string;
  category: string;
  description: string;
  isRequired: boolean;
  weight: number;
  relatedErrors: string[];
  status?: 'ok' | 'nok' | 'na'; // Pour les sessions en cours
  comment?: string; // Pour les sessions en cours
}

export interface SupervisionTemplate {
  id: string;
  name: string;
  description: string;
  theme: string;
  checklistItems: SupervisionChecklistItem[];
  errorCategories?: any[];
  requiredDocuments?: string[];
  estimatedDuration?: number;
  targetRoles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SupervisionFinding {
  id: string;
  sessionId: string;
  collaboratorId: string;
  collaboratorName: string;
  errorType: ErrorType;
  severity: Severity;
  description: string;
  correctiveAction: string;
  dateIdentified: string;
  dateResolved?: string;
  resolvedBy?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface SupervisionImage {
  id: string;
  name: string;
  url: string;
  annotations: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    type: 'highlight' | 'outline'; // surlignage jaune ou contour rouge
  }>;
}

export interface SupervisionSession {
  id: string;
  templateId: string;
  templateName: string;
  collaboratorId: string;
  collaboratorName: string;
  supervisorId: string;
  supervisorName: string;
  date: string;
  score: number; // Score global de la supervision
  status: 'Planned' | 'In Progress' | 'Completed';
  findings: SupervisionFinding[];
  notes?: string;
  images?: SupervisionImage[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  format: TrainingFormat;
  durationMinutes: number;
  content: string; // Markdown ou HTML pour le contenu
  relatedErrorTypes: ErrorType[];
  targetCollaborators: string[]; // IDs des collaborateurs ciblés
}

export interface TrainingContent {
  id: string;
  title: string;
  description: string;
  modules: TrainingModule[];
  generatedDate: string;
  sourceFindings: string[]; // IDs des findings qui ont généré ce contenu
}