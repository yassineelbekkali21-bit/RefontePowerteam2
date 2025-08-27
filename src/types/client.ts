export interface Client {
  id: number;
  name: string;
  type: string;
  gestionnaire: string;
  encodage: string;
  superviseur: string;
  status: ClientStatus;
  budgetHoraire: number;
  budgetEconomique: number;
  budgetVolumetrique: number;
  realiseHoraire: number;
  realiseEconomique: number;
  realiseVolumetrique: number;
  avancement: number;
  lastActivity: string;
  phone: string;
  email: string;
  address: string;
  echeancesActives?: string[];
  prochaineDateEcheance?: string;
}

export type ClientStatus = 'Actif' | 'En partance' | 'À suivre' | 'Récupéré';

export type ClientSettingsStatus = 'nouveau' | 'a-risque' | 'en-partance' | 'sorti';

export interface ClientFilters {
  gestionnaire: string;
  type: string;
  status: string;
  search: string;
}

export interface BudgetPrestation {
  name: string;
  budgetHoraire: number;
  realiseHoraire: number;
  budgetEconomique: number;
  realiseEconomique: number;
  volumetrieBudget: number;
  volumetrieRealisee: number;
}

export interface VolumetrieData {
  type: string;
  budget: number;
  realise: number;
  ecart: number;
  status: 'good' | 'warning' | 'danger';
}

export interface ClientStatusFormData {
  status: ClientSettingsStatus;
  nouveauClientInfo?: string;
  risqueRaison?: string;
  risqueRecupere?: boolean;
  partanceRaison?: string;
  sortiPrestations?: string;
  sortiDateRenon?: string;
}
