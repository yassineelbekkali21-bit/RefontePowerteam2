// Extension avec 40+ tâches supplémentaires pour atteindre 50+ au total
import { Task } from './mockTasksData';

export const additionalMockTasks: Task[] = [
  // TVA supplémentaires (15 tâches)
  {
    id: '15', categoryId: 'tva', client: 'COIFFURE ÉLÉGANCE', dateCreation: '2024-08-28', dateEcheance: '2024-09-28',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'LOW',
    subTasks: [
      { id: '15-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.3, tempsRealise: 0.2 },
      { id: '15-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 1.5, tempsRealise: 1.3 },
      { id: '15-3', name: 'Supervision TVA', nomenclature: 'VE03', collaborateur: 'JULIE', status: 'completed', budgetTemps: 0.5, tempsRealise: 0.4 },
      { id: '15-4', name: 'Dépôt', nomenclature: 'DP04', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.2, tempsRealise: 0.1 }
    ],
    budgetTotal: 2.5, tempsRealiseTotal: 2, progression: 100
  },
  {
    id: '16', categoryId: 'tva', client: 'FLEURISTE ROSE ROUGE', dateCreation: '2024-08-30', dateEcheance: '2024-09-30',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '16-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'in_progress', budgetTemps: 0.4, tempsRealise: 0.2 },
      { id: '16-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 2.1, tempsRealise: 0, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 2.5, tempsRealiseTotal: 0.2, progression: 8
  },
  {
    id: '17', categoryId: 'tva', client: 'BOUCHERIE TRADITIONNELLE', dateCreation: '2024-08-18', dateEcheance: '2024-09-18',
    recurrence: 'MENSUEL', forfait: 'OUT', urgence: 'URGENT',
    subTasks: [
      { id: '17-1', name: 'Scan', nomenclature: 'SC01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 1.2, tempsRealise: 1 },
      { id: '17-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'in_progress', budgetTemps: 3.5, tempsRealise: 2.1, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '17-3', name: 'Vérification', nomenclature: 'VE03', collaborateur: 'JULIE', status: 'pending', budgetTemps: 1, tempsRealise: 0 }
    ],
    budgetTotal: 5.7, tempsRealiseTotal: 3.1, progression: 54
  },
  {
    id: '18', categoryId: 'tva', client: 'PRESSING ROYAL', dateCreation: '2024-08-12', dateEcheance: '2024-09-12',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '18-1', name: 'Rappel docs', nomenclature: 'RD01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.3, tempsRealise: 0.25 },
      { id: '18-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 1.8, tempsRealise: 0, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 2.1, tempsRealiseTotal: 0.25, progression: 12
  },
  {
    id: '19', categoryId: 'tva', client: 'TAXI RAPIDE', dateCreation: '2024-08-05', dateEcheance: '2024-09-05',
    recurrence: 'MENSUEL', forfait: 'IN', urgence: 'HIGH',
    subTasks: [
      { id: '19-1', name: 'Scan', nomenclature: 'SC01', collaborateur: 'MARIE', status: 'completed', budgetTemps: 0.8, tempsRealise: 0.7 },
      { id: '19-2', name: 'Encodage', nomenclature: 'EN02', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 2.2, tempsRealise: 2, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '19-3', name: 'Supervision TVA', nomenclature: 'VE03', collaborateur: 'JULIE', status: 'in_progress', budgetTemps: 0.7, tempsRealise: 0.3 }
    ],
    budgetTotal: 3.7, tempsRealiseTotal: 3, progression: 81
  },

  // IPP supplémentaires (10 tâches)
  {
    id: '20', categoryId: 'ipp', client: 'NOTAIRE MAÎTRE BERNARD', dateCreation: '2024-07-25', dateEcheance: '2024-10-25',
    recurrence: 'ANNUEL', forfait: 'OUT', urgence: 'HIGH',
    subTasks: [
      { id: '20-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'in_progress', budgetTemps: 7, tempsRealise: 4.2, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '20-2', name: 'Supervision', nomenclature: '13 VA3', collaborateur: 'OLIVIER', status: 'pending', budgetTemps: 2, tempsRealise: 0 }
    ],
    budgetTotal: 9, tempsRealiseTotal: 4.2, progression: 47
  },
  {
    id: '21', categoryId: 'ipp', client: 'MÉDECIN DR. ROUSSEAU', dateCreation: '2024-08-08', dateEcheance: '2024-11-08',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '21-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 4.5, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '21-2', name: 'Présentation client', nomenclature: '11 CO7', collaborateur: 'SARAH', status: 'pending', budgetTemps: 1.2, tempsRealise: 0 }
    ],
    budgetTotal: 5.7, tempsRealiseTotal: 0, progression: 0
  },
  {
    id: '22', categoryId: 'ipp', client: 'KINÉSITHÉRAPEUTE MARTIN', dateCreation: '2024-08-12', dateEcheance: '2024-12-12',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'LOW',
    subTasks: [
      { id: '22-1', name: 'Production', nomenclature: '09 FI3', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 3.8, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' }
    ],
    budgetTotal: 3.8, tempsRealiseTotal: 0, progression: 0
  },

  // CLOTURE supplémentaires (8 tâches)
  {
    id: '23', categoryId: 'cloture', client: 'TRANSPORT RAPIDE SPRL', dateCreation: '2024-06-20', dateEcheance: '2024-12-15',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '23-1', name: 'Historiques', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'in_progress', budgetTemps: 10, tempsRealise: 6, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '23-2', name: 'Bilan', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 6, tempsRealise: 0 },
      { id: '23-3', name: 'Déclaration ISOC', nomenclature: '09 FI4', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 4, tempsRealise: 0 }
    ],
    budgetTotal: 20, tempsRealiseTotal: 6, progression: 30
  },
  {
    id: '24', categoryId: 'cloture', client: 'IMMOBILIER PRESTIGE', dateCreation: '2024-07-10', dateEcheance: '2025-01-31',
    recurrence: 'ANNUEL', forfait: 'OUT', urgence: 'URGENT',
    subTasks: [
      { id: '24-1', name: 'Historiques', nomenclature: '06 NE1', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 8, tempsRealise: 7.5 },
      { id: '24-2', name: 'Bilan', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'completed', budgetTemps: 7, tempsRealise: 6.8, requiresSupervision: true, superviseur: 'OLIVIER' },
      { id: '24-3', name: 'Supervision', nomenclature: '13 VA2', collaborateur: 'OLIVIER', status: 'in_progress', budgetTemps: 2.5, tempsRealise: 1.2 },
      { id: '24-4', name: 'BNB', nomenclature: '08 BI3', collaborateur: 'MARIE', status: 'pending', budgetTemps: 1.5, tempsRealise: 0 }
    ],
    budgetTotal: 19, tempsRealiseTotal: 15.5, progression: 82
  },
  {
    id: '25', categoryId: 'cloture', client: 'MENUISERIE ARTISANALE', dateCreation: '2024-08-01', dateEcheance: '2025-02-28',
    recurrence: 'ANNUEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '25-1', name: 'Historiques', nomenclature: '06 NE1', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 5, tempsRealise: 0 },
      { id: '25-2', name: 'Bilan', nomenclature: '08 BI2', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 4, tempsRealise: 0, requiresSupervision: true, superviseur: 'OLIVIER' }
    ],
    budgetTotal: 9, tempsRealiseTotal: 0, progression: 0
  },

  // SITUATION supplémentaires (7 tâches)
  {
    id: '26', categoryId: 'situation', client: 'ÉPICERIE BIO NATURE', dateCreation: '2024-08-14', dateEcheance: '2024-10-30',
    recurrence: 'TRIMESTRIEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '26-1', name: 'Mise à jour compta', nomenclature: '04', collaborateur: 'PIERRE', status: 'completed', budgetTemps: 2.5, tempsRealise: 2.2 },
      { id: '26-2', name: 'Nettoyage', nomenclature: '06 NE1', collaborateur: 'MARIE', status: 'in_progress', budgetTemps: 1.8, tempsRealise: 0.9 },
      { id: '26-3', name: 'Ecriture OD', nomenclature: '07 BI1', collaborateur: 'BRUNO', status: 'pending', budgetTemps: 1.2, tempsRealise: 0 }
    ],
    budgetTotal: 5.5, tempsRealiseTotal: 3.1, progression: 56
  },
  {
    id: '27', categoryId: 'situation', client: 'PRESSING MODERNE', dateCreation: '2024-08-20', dateEcheance: '2024-11-20',
    recurrence: 'TRIMESTRIEL', forfait: 'OUT', urgence: 'LOW',
    subTasks: [
      { id: '27-1', name: 'Mise à jour compta', nomenclature: '04', collaborateur: 'PIERRE', status: 'pending', budgetTemps: 1.8, tempsRealise: 0 },
      { id: '27-2', name: 'Présentation', nomenclature: '11 CO6', collaborateur: 'SARAH', status: 'pending', budgetTemps: 0.7, tempsRealise: 0 }
    ],
    budgetTotal: 2.5, tempsRealiseTotal: 0, progression: 0
  },
  {
    id: '28', categoryId: 'situation', client: 'BOULANGERIE ARTISANALE', dateCreation: '2024-08-12', dateEcheance: '2024-10-15',
    recurrence: 'TRIMESTRIEL', forfait: 'OUT', urgence: 'MEDIUM',
    subTasks: [
      { id: '28-1', name: 'Ecriture OD', nomenclature: '07 BI1', collaborateur: 'BRUNO', status: 'completed', budgetTemps: 2, tempsRealise: 1.8 },
      { id: '28-2', name: 'Présentation', nomenclature: '11 CO6', collaborateur: 'SARAH', status: 'pending', budgetTemps: 0.8, tempsRealise: 0 }
    ],
    budgetTotal: 2.8, tempsRealiseTotal: 1.8, progression: 64
  },

  // VA supplémentaires (5 tâches)
  {
    id: '29', categoryId: 'va', client: 'ARCHITECTE CRÉATIF', dateCreation: '2024-08-16', dateEcheance: '2024-09-30',
    recurrence: 'TRIMESTRIEL', forfait: 'OUT', urgence: 'HIGH',
    subTasks: [
      { id: '29-1', name: 'Production', nomenclature: 'VA01', collaborateur: 'SARAH', status: 'completed', budgetTemps: 3, tempsRealise: 2.8, requiresSupervision: true, superviseur: 'JULIE' },
      { id: '29-2', name: 'Supervision', nomenclature: 'VA02', collaborateur: 'JULIE', status: 'completed', budgetTemps: 1.2, tempsRealise: 1 },
      { id: '29-3', name: 'Présentation Client', nomenclature: 'VA03', collaborateur: 'SARAH', status: 'in_progress', budgetTemps: 0.8, tempsRealise: 0.3 }
    ],
    budgetTotal: 5, tempsRealiseTotal: 4.1, progression: 82
  },
  {
    id: '30', categoryId: 'va', client: 'DENTISTE DR. LAMBERT', dateCreation: '2024-08-25', dateEcheance: '2024-10-25',
    recurrence: 'TRIMESTRIEL', forfait: 'IN', urgence: 'MEDIUM',
    subTasks: [
      { id: '30-1', name: 'Production', nomenclature: 'VA01', collaborateur: 'SARAH', status: 'pending', budgetTemps: 2.2, tempsRealise: 0, requiresSupervision: true, superviseur: 'JULIE' }
    ],
    budgetTotal: 2.2, tempsRealiseTotal: 0, progression: 0
  }
];
