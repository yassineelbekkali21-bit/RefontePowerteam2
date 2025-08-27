/**
 * Types modernes pour le système d'échéances
 * Respecte les standards Web 3.0 et l'accessibilité
 */

// Énumérations pour une meilleure type safety
export enum TypeEcheance {
  TVA = 'TVA',
  IPP = 'IPP', 
  ISOC = 'ISOC',
  BILAN = 'BILAN',
  DECLARATION_ANNUELLE = 'DECLARATION_ANNUELLE',
  VERSEMENTS_ANTICIPES = 'VERSEMENTS_ANTICIPES',
  SITUATION_INTERMEDIAIRE = 'SITUATION_INTERMEDIAIRE',
  CLOTURE = 'CLOTURE'
}

export enum StatutEcheance {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  UNDER_REVIEW = 'under_review'
}

export enum NiveauUrgence {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum TypeForfait {
  INCLUDED = 'included',    // Dans le forfait
  EXCLUDED = 'excluded',    // Hors forfait
  NEGOTIABLE = 'negotiable' // À négocier
}

// Interface pour les étapes détaillées
export interface EtapeEcheance {
  readonly id: string;
  readonly nom: string;
  readonly description?: string;
  readonly statut: StatutEcheance;
  readonly ordre: number;
  readonly dateDebut?: Date;
  readonly dateFin?: Date;
  readonly responsable?: string;
  readonly tempsEstime?: number; // en heures
  readonly tempsRealise?: number; // en heures
  readonly commentaire?: string;
  readonly prerequis?: string[]; // IDs des étapes prérequises
  readonly livrables?: string[]; // Documents ou éléments attendus
}

// Interface pour les notifications et alertes
export interface NotificationEcheance {
  readonly id: string;
  readonly type: 'deadline' | 'overdue' | 'milestone' | 'warning';
  readonly message: string;
  readonly dateCreation: Date;
  readonly dateExpiration?: Date;
  readonly importance: NiveauUrgence;
  readonly destinataires: string[];
  readonly canaux: ('email' | 'sms' | 'app' | 'webhook')[];
}

// Interface principale pour une échéance
export interface Echeance {
  readonly id: string;
  readonly nom: string;
  readonly description?: string;
  readonly type: TypeEcheance;
  readonly statut: StatutEcheance;
  readonly urgence: NiveauUrgence;
  readonly forfait: TypeForfait;
  
  // Informations client
  readonly clientId: string;
  readonly clientNom: string;
  readonly clientType?: 'particulier' | 'entreprise' | 'association';
  
  // Gestion temporelle
  readonly dateCreation: Date;
  readonly dateEcheance: Date;
  readonly dateDebutPrevue?: Date;
  readonly dateFinReelle?: Date;
  readonly recurrence?: {
    type: 'mensuelle' | 'trimestrielle' | 'annuelle' | 'ponctuelle';
    prochaine?: Date;
    finRecurrence?: Date;
  };
  
  // Gestion des ressources
  readonly responsablePrincipal?: string;
  readonly equipe?: string[];
  readonly superviseur?: string;
  readonly budgetTemps?: number; // Budget total en heures
  readonly tempsRealise?: number; // Temps déjà consommé
  readonly tauxHoraire?: number; // Pour le calcul des coûts
  
  // Workflow et progression
  readonly etapes: EtapeEcheance[];
  readonly progression: number; // 0-100%
  readonly dependances?: string[]; // IDs d'autres échéances
  readonly bloqueurs?: string[]; // Éléments bloquants identifiés
  
  // Communication et suivi
  readonly notifications: NotificationEcheance[];
  readonly commentaires?: CommentaireEcheance[];
  readonly documentsJoints?: DocumentJoint[];
  
  // Métadonnées pour Web 3.0
  readonly tags?: string[];
  readonly categorieMetier?: string;
  readonly niveauConfidentialite?: 'public' | 'interne' | 'confidentiel' | 'secret';
  readonly traceabilite?: TraceabiliteAction[];
  
  // Optimisation et analytics
  readonly metriques?: {
    tempsPrevu: number;
    tempsReel: number;
    efficacite: number; // %
    satisfaction?: number; // Note de 1 à 5
    retours?: string[];
  };
}

// Interface pour les commentaires
export interface CommentaireEcheance {
  readonly id: string;
  readonly auteur: string;
  readonly contenu: string;
  readonly dateCreation: Date;
  readonly dateModification?: Date;
  readonly replyTo?: string; // ID du commentaire parent
  readonly mentions?: string[]; // Utilisateurs mentionnés
  readonly status?: 'public' | 'interne' | 'prive';
}

// Interface pour les documents joints
export interface DocumentJoint {
  readonly id: string;
  readonly nom: string;
  readonly type: string; // MIME type
  readonly taille: number; // en bytes
  readonly url: string;
  readonly hash?: string; // Pour vérifier l'intégrité
  readonly version?: string;
  readonly dateUpload: Date;
  readonly uploadePar: string;
  readonly description?: string;
}

// Interface pour la traçabilité (Web 3.0 ready)
export interface TraceabiliteAction {
  readonly id: string;
  readonly action: string;
  readonly utilisateur: string;
  readonly timestamp: Date;
  readonly ancienneValeur?: any;
  readonly nouvelleValeur?: any;
  readonly ip?: string;
  readonly userAgent?: string;
  readonly signature?: string; // Signature cryptographique pour l'intégrité
}

// Interface pour les vues personnalisables
export interface VueEcheances {
  readonly id: string;
  readonly nom: string;
  readonly description?: string;
  readonly utilisateur: string;
  readonly estPublique: boolean;
  readonly filtres: FiltresEcheances;
  readonly colonnesVisibles: string[];
  readonly tri: {
    colonne: string;
    direction: 'asc' | 'desc';
  };
  readonly groupement?: {
    par: 'client' | 'type' | 'statut' | 'responsable' | 'urgence';
    ordre: 'asc' | 'desc';
  };
}

// Interface pour les filtres avancés
export interface FiltresEcheances {
  readonly types?: TypeEcheance[];
  readonly statuts?: StatutEcheance[];
  readonly urgences?: NiveauUrgence[];
  readonly forfaits?: TypeForfait[];
  readonly clients?: string[];
  readonly responsables?: string[];
  readonly dateEcheanceDebut?: Date;
  readonly dateEcheanceFin?: Date;
  readonly progressionMin?: number;
  readonly progressionMax?: number;
  readonly retardUniquement?: boolean;
  readonly termineesIncluses?: boolean;
  readonly textRecherche?: string;
  readonly tags?: string[];
}

// Interface pour les analytics et rapports
export interface AnalyticsEcheances {
  readonly periode: {
    debut: Date;
    fin: Date;
  };
  readonly metriques: {
    totalEcheances: number;
    completees: number;
    enRetard: number;
    tauxReussite: number; // %
    tempsMovenTraitement: number; // heures
    efficaciteEquipe: number; // %
  };
  readonly repartitions: {
    parType: { type: TypeEcheance; count: number }[];
    parStatut: { statut: StatutEcheance; count: number }[];
    parResponsable: { responsable: string; count: number; efficacite: number }[];
    parClient: { client: string; count: number; satisfaction?: number }[];
  };
  readonly tendances: {
    evolution: { periode: string; count: number; performance: number }[];
    predictions: {
      prochaineSemaine: number;
      prochainMois: number;
      risquesDetectes: string[];
    };
  };
}

// Interface pour la collaboration en temps réel (Web 3.0)
export interface CollaborationSession {
  readonly id: string;
  readonly echeanceId: string;
  readonly participants: {
    utilisateur: string;
    role: 'viewer' | 'editor' | 'owner';
    statut: 'active' | 'idle' | 'offline';
    derniereActivite: Date;
  }[];
  readonly curseurs?: {
    utilisateur: string;
    position: string; // Selector CSS ou coordonnées
    couleur: string;
  }[];
  readonly modifications?: {
    utilisateur: string;
    champ: string;
    valeur: any;
    timestamp: Date;
  }[];
}

// Interface pour l'intégration blockchain (préparation Web 3.0)
export interface EcheanceBlockchain {
  readonly contractAddress?: string;
  readonly transactionHash?: string;
  readonly blockNumber?: number;
  readonly proof?: {
    merkleRoot: string;
    signature: string;
    witness: string[];
  };
  readonly immutableFields?: string[]; // Champs qui ne peuvent plus être modifiés
}

// Types utilitaires
export type EcheancePartielle = Partial<Echeance>;
export type EcheanceCreation = Omit<Echeance, 'id' | 'dateCreation' | 'notifications' | 'traceabilite'>;
export type EcheanceMiseAJour = Partial<Pick<Echeance, 'nom' | 'description' | 'statut' | 'urgence' | 'progression' | 'responsablePrincipal' | 'dateEcheance'>>;

// Event types pour la réactivité
export type EcheanceEvent = 
  | { type: 'created'; echeance: Echeance }
  | { type: 'updated'; echeanceId: string; changes: EcheanceMiseAJour }
  | { type: 'deleted'; echeanceId: string }
  | { type: 'status_changed'; echeanceId: string; oldStatus: StatutEcheance; newStatus: StatutEcheance }
  | { type: 'deadline_approaching'; echeanceId: string; daysRemaining: number }
  | { type: 'overdue'; echeanceId: string; daysOverdue: number };

// Interface pour les hooks et state management
export interface EcheancesState {
  readonly echeances: Map<string, Echeance>;
  readonly filtres: FiltresEcheances;
  readonly vueActive: VueEcheances | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly derniereSync: Date | null;
  readonly modeCollaboration: boolean;
  readonly sessionCollaboration?: CollaborationSession;
}

// Actions pour le state management
export type EcheancesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ECHEANCES'; payload: Echeance[] }
  | { type: 'ADD_ECHEANCE'; payload: Echeance }
  | { type: 'UPDATE_ECHEANCE'; payload: { id: string; changes: EcheanceMiseAJour } }
  | { type: 'DELETE_ECHEANCE'; payload: string }
  | { type: 'SET_FILTRES'; payload: FiltresEcheances }
  | { type: 'SET_VUE_ACTIVE'; payload: VueEcheances | null }
  | { type: 'SYNC_SUCCESS'; payload: Date }
  | { type: 'ENABLE_COLLABORATION'; payload: CollaborationSession }
  | { type: 'DISABLE_COLLABORATION' };

// Configuration pour l'accessibilité
export interface AccessibilityConfig {
  readonly announceChanges: boolean;
  readonly highContrast: boolean;
  readonly keyboardNavigation: boolean;
  readonly screenReaderOptimized: boolean;
  readonly reducedMotion: boolean;
  readonly fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  readonly customShortcuts: { [key: string]: string };
}

export default {
  TypeEcheance,
  StatutEcheance,
  NiveauUrgence,
  TypeForfait
};
