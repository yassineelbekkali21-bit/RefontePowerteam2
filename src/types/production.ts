// Types pour le module Production spécialisé fiduciaire

export interface Collaborateur {
  id: string;
  nom: string;
  prenom: string;
  initiales: string;
  role: string;
  regime: 'temps_plein' | 'temps_partiel' | 'freelance';
  tempsAttendu: number; // heures par semaine
  avatar?: string;
  actif: boolean;
}

export interface MetriqueProduction {
  collaborateurId: string;
  date: string;
  heuresTravaillees: number;
  tachesCompletes: number;
  efficacite: number; // en %
  qualite: number; // en %
  prestationsRealisees: PrestationRealisee[];
  categoriesPrestations: CategoriePrestation[];
}

export interface CategoriePrestation {
  id: string;
  nom: string;
  budgetAlloue: number;
  heuresRealisees: number;
  nombreDocuments?: number;
  tauxErreur?: number;
  tempsMoyenParDocument?: number;
  statut: 'en_cours' | 'termine' | 'en_retard';
  details?: DetailCategorie;
}

export interface DetailCategorie {
  documentsTraites: number;
  documentsEnAttente: number;
  documentsRejetes: number;
  qualiteScore: number;
  commentaires?: string;
}

export interface PrestationRealisee {
  id: string;
  type: 'SCAN_ADMIN' | 'ENCODAGE_COMPTABLE' | 'TVA' | 'BILAN' | 'FISCALE' | 'CONSEIL' | 'VALIDATION';
  nom: string;
  clientId: string;
  clientNom: string;
  tempsPreste: number;
  tempsEstime: number;
  statut: 'termine' | 'en_cours' | 'en_attente' | 'bloque';
  qualite: 'excellent' | 'bon' | 'moyen' | 'faible';
  dateDebut: string;
  dateFin?: string;
  echeanceId?: string;
}

export interface EcheanceFiscale {
  id: string;
  type: 'TVA' | 'ISOC' | 'IPP' | 'DECLARATION_ANNUELLE' | 'BILAN';
  nom: string;
  clientId: string;
  clientNom: string;
  dateEcheance: string;
  statut: 'non_commence' | 'en_cours' | 'en_revision' | 'termine' | 'depose';
  priorite: 'haute' | 'moyenne' | 'basse';
  etapes: EtapeEcheance[];
  collaborateurAssigne?: string;
  tempsEstime: number;
  tempsRealise: number;
  avancement: number; // pourcentage
}

export interface EtapeEcheance {
  id: string;
  nom: string;
  ordre: number;
  statut: 'non_commence' | 'en_cours' | 'termine';
  obligatoire: boolean;
  tempsEstime: number;
  tempsRealise: number;
  dateDebut?: string;
  dateFin?: string;
  commentaire?: string;
}

export interface SuiviTemps {
  collaborateurId: string;
  periode: string;
  tempsAttendu: number;
  tempsPreste: number; // timesheet
  tempsPlanifie: number; // planning
  ecartTimesheet: number; // prestés - attendus
  ecartPlanning: number; // planifiés - attendus
  tauxRealisation: number; // prestés / planifiés
  heuresSupplementaires: number;
  congesUtilises: number;
}

export interface IndicateurProduction {
  titre: string;
  valeur: string | number;
  unite?: string;
  evolution: number; // pourcentage d'évolution
  tendance: 'hausse' | 'baisse' | 'stable';
  seuil?: {
    min: number;
    max: number;
    optimal: number;
  };
  couleur: 'vert' | 'orange' | 'rouge' | 'bleu';
}

export interface DashboardProduction {
  periode: {
    debut: string;
    fin: string;
  };
  collaborateurs: Collaborateur[];
  metriques: MetriqueProduction[];
  echeances: EcheanceFiscale[];
  suiviTemps: SuiviTemps[];
  indicateurs: IndicateurProduction[];
}

// Types pour les filtres et vues
export interface FiltreProduction {
  collaborateurs: string[];
  periode: {
    debut: string;
    fin: string;
  };
  typesPrestations: string[];
  statutsEcheances: string[];
  clients: string[];
}

export interface VueProduction {
  type: 'individuel' | 'temps' | 'echeances' | 'global';
  active: boolean;
  configuration: Record<string, any>;
}

// Types pour le tableau hiérarchique de suivi du temps (4 niveaux)
export interface CategoriePrestation4Niveaux {
  id: string;
  nom: string;
  heuresBudgetees: number;
  heuresRealisees: number;
  heuresNonFacturables: number;
  ecartAvecBudget: number;
  tempsSupplementaire: number;
}

export interface Client4Niveaux {
  id: string;
  nom: string;
  role: 'GD' | 'GE' | 'Sup'; // Gestionnaire Dossier, Gestionnaire Encodage, Superviseur
  categories: CategoriePrestation4Niveaux[];
  totalHeuresBudgetees: number;
  totalHeuresRealisees: number;
  totalHeuresNonFacturables: number;
  totalEcart: number;
  totalTempsSupplementaire: number;
}

export interface GroupeClients4Niveaux {
  type: 'attribues' | 'non_attribues';
  nom: string;
  clients: Client4Niveaux[];
  totalHeuresBudgetees: number;
  totalHeuresRealisees: number;
  totalHeuresNonFacturables: number;
  totalEcart: number;
  totalTempsSupplementaire: number;
}

export interface CollaborateurSuiviTemps4Niveaux {
  collaborateurId: string;
  nom: string;
  prenom: string;
  groupesClients: GroupeClients4Niveaux[];
  totalHeuresBudgetees: number;
  totalHeuresRealisees: number;
  totalHeuresNonFacturables: number;
  totalEcart: number;
  totalTempsSupplementaire: number;
}

export interface CategorieTemps {
  id: string;
  nom: string;
  couleur: string;
}
