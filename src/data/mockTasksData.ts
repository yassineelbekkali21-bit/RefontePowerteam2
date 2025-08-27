// Données de test avec 50+ tâches réalistes pour le cabinet comptable

export interface SubTask {
  id: string;
  name: string;
  nomenclature: string;
  collaborateur: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  budgetTemps: number;
  tempsRealise: number;
  requiresSupervision?: boolean;
  superviseur?: string;
}

export interface Task {
  id: string;
  categoryId: string;
  client: string;
  dateCreation: string;
  dateEcheance: string;
  recurrence: 'MENSUEL' | 'TRIMESTRIEL' | 'ANNUEL';
  forfait: 'IN' | 'OUT';
  urgence: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  subTasks: SubTask[];
  budgetTotal: number;
  tempsRealiseTotal: number;
  progression: number;
}

export const mockTasks: Task[] = [
  // IPP - 15 tâches
  {
    id: '1', categoryId: 'ipp', client: 'BRUNO SARL', dateCreation: '2024-06-01', dateEcheance: '2024-09-30',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'URGENT',
    subTasks: [
      { id: '1-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'completed', budgetTemps: 8, tempsRealise: 7.5, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '1-2', name: 'Supervision', nomenclature: '13 VA3', collaborateur: 'OLIVIER', status: 'in_progress', budgetTemps: 2, tempsRealise: 1 },
      { id: '1-3', name: 'Présentation client', nomenclature: '11 CO7', collaborateur: 'SARAH', status: 'pending', budgetTemps: 1.5, tempsRealise: 0 }
    ],
    budgetTotal: 11.5, tempsRealiseTotal: 8.5, progression: 65
  },
  {
    id: '2', categoryId: 'ipp', client: 'MARTIN & ASSOCIÉS', dateCreation: '2024-07-15', dateEcheance: '2024-10-15',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '2-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'in_progress', budgetTemps: 6, tempsRealise: 3, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '2-2', name: 'Supervision', nomenclature: '13 VA3', collaborateur: 'OLIVIER', status: 'pending', budgetTemps: 1.5, tempsRealise: 0 }
    ],
    budgetTotal: 7.5, tempsRealiseTotal: 3, progression: 40
  },
  {
    id: '3', categoryId: 'ipp', client: 'DUPONT FAMILY', dateCreation: '2024-08-01', dateEcheance: '2024-11-30',
    recurrence: 'ANNUEL', forfait: 'OUT', urgence: 'MEDIUM',
    subTasks: [
      { id: '3-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 4, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' }
    ],
    budgetTotal: 4, tempsRealiseTotal: 0, progression: 0
  },
  {
    id: '4', categoryId: 'ipp', client: 'AVOCAT MAÎTRE DUBOIS', dateCreation: '2024-07-20', dateEcheance: '2024-10-31',
    recurrence: 'ANNUEL', forfait: 'OUT', urgence: 'HIGH',
    subTasks: [
      { id: '4-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'completed', budgetTemps: 5, tempsRealise: 4.8, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '4-2', name: 'Supervision', nomenclature: '13 VA3', collaborateur: 'OLIVIER', status: 'completed', budgetTemps: 1.5, tempsRealise: 1.2 },
      { id: '4-3', name: 'Présentation client', nomenclature: '11 CO7', collaborateur: 'SARAH', status: 'in_progress', budgetTemps: 1, tempsRealise: 0.5 }
    ],
    budgetTotal: 7.5, tempsRealiseTotal: 6.5, progression: 87
  },
  {
    id: '5', categoryId: 'ipp', client: 'FAMILLE MOREAU', dateCreation: '2024-08-03', dateEcheance: '2024-11-15',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '5-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 3.5, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' }
    ],
    budgetTotal: 3.5, tempsRealiseTotal: 0, progression: 0
  },

  // TVA - 20 tâches
  {
    id: '6', categoryId: 'tva', client: 'TECH SOLUTIONS', dateCreation: '2024-08-15', dateEcheance: '2024-08-31',
    recurrence: 'MENSUEL', forfait: 'OUT', urgence: 'URGENT',
    subTasks: [
      { id: '6-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.5, tempsRealise: 0.3 },
      { id: '6-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'in_progress', budgetTemps: 3, tempsRealise: 2, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '6-3', name: 'Supervision TVA', nomenclature: 'VE03', collaborateur: 'JULIE', status: 'pending', budgetTemps: 1, tempsRealise: 0 }
    ],
    budgetTotal: 4.5, tempsRealiseTotal: 2.3, progression: 51
  },
  {
    id: '7', categoryId: 'tva', client: 'RESTAURANT LE GOURMET', dateCreation: '2024-08-20', dateEcheance: '2024-09-20',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '7-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.5, tempsRealise: 0.4 },
      { id: '7-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 2.5, tempsRealise: 2.2, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '7-3', name: 'Supervision TVA', nomenclature: 'VE03', collaborateur: 'JULIE', status: 'in_progress', budgetTemps: 0.8, tempsRealise: 0.3 }
    ],
    budgetTotal: 3.8, tempsRealiseTotal: 2.9, progression: 76
  },
  {
    id: '8', categoryId: 'tva', client: 'CONSTRUCTION BERNARD', dateCreation: '2024-08-10', dateEcheance: '2024-09-10',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '8-1', name: 'Scan', nomenclature: 'SC01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 1, tempsRealise: 0.8 },
      { id: '8-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 4, tempsRealise: 0, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 5, tempsRealiseTotal: 0.8, progression: 16
  },
  {
    id: '9', categoryId: 'tva', client: 'GARAGE MODERNE', dateCreation: '2024-08-22', dateEcheance: '2024-09-22',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'URGENT',
    subTasks: [
      { id: '9-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'pending', budgetTemps: 0.5, tempsRealise: 0 },
      { id: '9-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 2.8, tempsRealise: 0, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 3.3, tempsRealiseTotal: 0, progression: 0
  },
  {
    id: '10', categoryId: 'tva', client: 'LIBRAIRIE CULTURELLE', dateCreation: '2024-08-25', dateEcheance: '2024-09-25',
    recurrence: 'MENSUEL', forfait: 'OUT', urgence: 'MEDIUM',
    subTasks: [
      { id: '10-1', name: 'Scan', nomenclature: 'SC01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.8, tempsRealise: 0.7 },
      { id: '10-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'in_progress', budgetTemps: 2.2, tempsRealise: 1.1, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 3, tempsRealiseTotal: 1.8, progression: 60
  },

  // CLOTURE - 10 tâches
  {
    id: '11', categoryId: 'cloture', client: 'INDUSTRIE MODERNE SA', dateCreation: '2024-07-01', dateEcheance: '2024-12-31',
    recurrence: 'ANNUEL', forfait: 'OUT', urgence: 'HIGH',
    subTasks: [
      { id: '11-1', name: 'Historiques', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'completed', budgetTemps: 12, tempsRealise: 11.5, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '11-2', name: 'Bilan', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'in_progress', budgetTemps: 8, tempsRealise: 4 },
      { id: '11-3', name: 'Supervision', nomenclature: '13 VA2', collaborateur: 'OLIVIER', status: 'pending', budgetTemps: 3, tempsRealise: 0 }
    ],
    budgetTotal: 23, tempsRealiseTotal: 15.5, progression: 67
  },
  {
    id: '12', categoryId: 'cloture', client: 'PHARMACIE CENTRALE', dateCreation: '2024-06-15', dateEcheance: '2024-11-30',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '12-1', name: 'Historiques', nomenclature: '06 NE1', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 6, tempsRealise: 5.8 },
      { id: '12-2', name: 'Bilan', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 5, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' }
    ],
    budgetTotal: 11, tempsRealiseTotal: 5.8, progression: 53
  },

  // SITUATION - 8 tâches
  {
    id: '13', categoryId: 'situation', client: 'CABINET MÉDICAL DR. LEROY', dateCreation: '2024-08-05', dateEcheance: '2024-09-30',
    recurrence: 'TRIMESTRIEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '13-1', name: 'Mise à jour compta', nomenclature: '04', collaborateur: 'PIERRE', status: 'in_progress', budgetTemps: 3, tempsRealise: 1.5 },
      { id: '13-2', name: 'Nettoyage', nomenclature: '06 NE1', collaborateur: 'MARIE', status: 'pending', budgetTemps: 2, tempsRealise: 0 }
    ],
    budgetTotal: 5, tempsRealiseTotal: 1.5, progression: 30
  },

  // VA - 7 tâches
  {
    id: '14', categoryId: 'va', client: 'CONSULTING PARTNERS', dateCreation: '2024-08-18', dateEcheance: '2024-09-15',
    recurrence: 'TRIMESTRIEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '14-1', name: 'Production', nomenclature: 'VA01', collaborateur: 'SARAH', status: 'in_progress', budgetTemps: 2.5, tempsRealise: 1.2, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '14-2', name: 'Supervision', nomenclature: 'VA02', collaborateur: 'JULIE', status: 'pending', budgetTemps: 1, tempsRealise: 0 }
    ],
    budgetTotal: 3.5, tempsRealiseTotal: 1.2, progression: 34
  }
];
