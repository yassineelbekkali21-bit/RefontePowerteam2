import type { 
  Collaborateur, 
  MetriqueProduction, 
  EcheanceFiscale, 
  SuiviTemps, 
  DashboardProduction 
} from '@/types/production';

// Types pour le tableau Encodage avec clients
export interface LigneEncodage {
  type: 'Achats' | 'Ventes' | 'Coda' | 'No-Coda' | 'Caisse' | 'Salaires';
  volumetrie: {
    realise: number;
  };
  timesheet: {
    theorique: number;
    realise: number;
    ecart: number;
    productionParPiece: number;
    compensationProd: number;
  };
}

export interface ClientEncodage {
  id: string;
  nom: string;
  lignes: LigneEncodage[];
  expanded?: boolean;
}

export interface TableauEncodage {
  periode: string;
  clients: ClientEncodage[];
}

// Types pour le tableau Nettoyage avec clients
export interface ClientNettoyage {
  id: string;
  nom: string;
  volumetrie: {
    realise: number;
  };
  budget: {
    annuel: number;
    periodique: number;
  };
  operations: {
    encodageRealise: number;
    nettoyageComptable: number;
    nettoyageBilan: number;
    bilanRealise: number;
    rapportComptable: number;
    rapportBilan: number;
    sequences: number;
  };
  situations: {
    situationsIntermediaires: number;
    regimeTVA: string;
  };
}

export interface TableauNettoyage {
  periode: string;
  clients: ClientNettoyage[];
}

// Données de test pour le tableau Encodage
export const donneesEncodage: TableauEncodage = {
  periode: 'Janvier 2024',
  clients: [
    {
      id: 'client-1',
      nom: 'SARL TECH SOLUTIONS',
      expanded: false,
      lignes: [
        {
          type: 'Achats',
          volumetrie: { realise: 45 },
          timesheet: { theorique: 8.5, realise: 7.2, ecart: -1.3, productionParPiece: 0.16, compensationProd: 0.2 }
        },
        {
          type: 'Ventes',
          volumetrie: { realise: 32 },
          timesheet: { theorique: 6.4, realise: 5.8, ecart: -0.6, productionParPiece: 0.18, compensationProd: 0.1 }
        },
        {
          type: 'Coda',
          volumetrie: { realise: 28 },
          timesheet: { theorique: 4.2, realise: 4.5, ecart: 0.3, productionParPiece: 0.15, compensationProd: -0.05 }
        },
        {
          type: 'No-Coda',
          volumetrie: { realise: 15 },
          timesheet: { theorique: 3.0, realise: 2.8, ecart: -0.2, productionParPiece: 0.19, compensationProd: 0.04 }
        },
        {
          type: 'Caisse',
          volumetrie: { realise: 12 },
          timesheet: { theorique: 2.4, realise: 2.1, ecart: -0.3, productionParPiece: 0.18, compensationProd: 0.05 }
        },
        {
          type: 'Salaires',
          volumetrie: { realise: 8 },
          timesheet: { theorique: 1.6, realise: 1.4, ecart: -0.2, productionParPiece: 0.18, compensationProd: 0.04 }
        }
      ]
    },
    {
      id: 'client-2',
      nom: 'SPRL COMMERCE PLUS',
      expanded: false,
      lignes: [
        {
          type: 'Achats',
          volumetrie: { realise: 38 },
          timesheet: { theorique: 7.6, realise: 6.9, ecart: -0.7, productionParPiece: 0.18, compensationProd: 0.13 }
        },
        {
          type: 'Ventes',
          volumetrie: { realise: 42 },
          timesheet: { theorique: 8.4, realise: 7.8, ecart: -0.6, productionParPiece: 0.19, compensationProd: 0.11 }
        },
        {
          type: 'Coda',
          volumetrie: { realise: 22 },
          timesheet: { theorique: 3.3, realise: 3.6, ecart: 0.3, productionParPiece: 0.16, compensationProd: -0.05 }
        },
        {
          type: 'No-Coda',
          volumetrie: { realise: 18 },
          timesheet: { theorique: 3.6, realise: 3.2, ecart: -0.4, productionParPiece: 0.18, compensationProd: 0.07 }
        },
        {
          type: 'Caisse',
          volumetrie: { realise: 10 },
          timesheet: { theorique: 2.0, realise: 1.8, ecart: -0.2, productionParPiece: 0.18, compensationProd: 0.04 }
        },
        {
          type: 'Salaires',
          volumetrie: { realise: 6 },
          timesheet: { theorique: 1.2, realise: 1.1, ecart: -0.1, productionParPiece: 0.18, compensationProd: 0.02 }
        }
      ]
    },
    {
      id: 'client-3',
      nom: 'SA INDUSTRIE MODERNE',
      expanded: false,
      lignes: [
        {
          type: 'Achats',
          volumetrie: { realise: 52 },
          timesheet: { theorique: 10.4, realise: 9.1, ecart: -1.3, productionParPiece: 0.17, compensationProd: 0.22 }
        },
        {
          type: 'Ventes',
          volumetrie: { realise: 48 },
          timesheet: { theorique: 9.6, realise: 8.9, ecart: -0.7, productionParPiece: 0.19, compensationProd: 0.13 }
        },
        {
          type: 'Coda',
          volumetrie: { realise: 35 },
          timesheet: { theorique: 5.3, realise: 5.8, ecart: 0.5, productionParPiece: 0.17, compensationProd: -0.08 }
        },
        {
          type: 'No-Coda',
          volumetrie: { realise: 25 },
          timesheet: { theorique: 5.0, realise: 4.5, ecart: -0.5, productionParPiece: 0.18, compensationProd: 0.09 }
        },
        {
          type: 'Caisse',
          volumetrie: { realise: 16 },
          timesheet: { theorique: 3.2, realise: 2.9, ecart: -0.3, productionParPiece: 0.18, compensationProd: 0.05 }
        },
        {
          type: 'Salaires',
          volumetrie: { realise: 12 },
          timesheet: { theorique: 2.4, realise: 2.2, ecart: -0.2, productionParPiece: 0.18, compensationProd: 0.04 }
        }
      ]
    }
  ]
};

// Données de test pour le tableau Nettoyage
export const donneesNettoyage: TableauNettoyage = {
  periode: 'Janvier 2024',
  clients: [
    {
      id: 'client-n1',
      nom: 'SARL TECH SOLUTIONS',
      volumetrie: { realise: 145 },
      budget: { annuel: 24000, periodique: 2000 },
      operations: {
        encodageRealise: 98,
        nettoyageComptable: 87,
        nettoyageBilan: 45,
        bilanRealise: 42,
        rapportComptable: 38,
        rapportBilan: 35,
        sequences: 12
      },
      situations: {
        situationsIntermediaires: 4,
        regimeTVA: 'Mensuel'
      }
    },
    {
      id: 'client-n2',
      nom: 'SPRL COMMERCE PLUS',
      volumetrie: { realise: 128 },
      budget: { annuel: 18500, periodique: 1540 },
      operations: {
        encodageRealise: 85,
        nettoyageComptable: 76,
        nettoyageBilan: 38,
        bilanRealise: 35,
        rapportComptable: 32,
        rapportBilan: 28,
        sequences: 9
      },
      situations: {
        situationsIntermediaires: 3,
        regimeTVA: 'Trimestriel'
      }
    },
    {
      id: 'client-n3',
      nom: 'SA INDUSTRIE MODERNE',
      volumetrie: { realise: 167 },
      budget: { annuel: 32000, periodique: 2670 },
      operations: {
        encodageRealise: 112,
        nettoyageComptable: 98,
        nettoyageBilan: 52,
        bilanRealise: 48,
        rapportComptable: 44,
        rapportBilan: 41,
        sequences: 15
      },
      situations: {
        situationsIntermediaires: 6,
        regimeTVA: 'Mensuel'
      }
    },
    {
      id: 'client-n4',
      nom: 'ASBL FORMATION PLUS',
      volumetrie: { realise: 89 },
      budget: { annuel: 12000, periodique: 1000 },
      operations: {
        encodageRealise: 58,
        nettoyageComptable: 52,
        nettoyageBilan: 28,
        bilanRealise: 25,
        rapportComptable: 22,
        rapportBilan: 20,
        sequences: 6
      },
      situations: {
        situationsIntermediaires: 2,
        regimeTVA: 'Annuel'
      }
    }
  ]
};

// Collaborateurs de la fiduciaire
export const collaborateurs: Collaborateur[] = [
  {
    id: 'collab-1',
    nom: 'Kalai',
    prenom: 'Mohamed',
    initiales: 'MK',
    role: 'Comptable Senior',
    regime: 'temps_plein',
    tempsAttendu: 40,
    actif: true
  },
  {
    id: 'collab-2',
    nom: 'Behloul',
    prenom: 'Youssef',
    initiales: 'YB',
    role: 'Expert-Comptable',
    regime: 'temps_plein',
    tempsAttendu: 40,
    actif: true
  },
  {
    id: 'collab-3',
    nom: 'Amouri',
    prenom: 'Vanessa',
    initiales: 'VA',
    role: 'Assistante Comptable',
    regime: 'temps_partiel',
    tempsAttendu: 24,
    actif: true
  },
  {
    id: 'collab-4',
    nom: 'Abdelkhalek',
    prenom: 'Ismail',
    initiales: 'IA',
    role: 'Comptable',
    regime: 'temps_plein',
    tempsAttendu: 40,
    actif: true
  },
  {
    id: 'collab-5',
    nom: 'Tekki',
    prenom: 'Ozer',
    initiales: 'OT',
    role: 'Stagiaire',
    regime: 'temps_partiel',
    tempsAttendu: 20,
    actif: true
  }
];

// Métriques de production par collaborateur (dernière semaine)
export const metriquesProduction: MetriqueProduction[] = [
  {
    collaborateurId: 'collab-1',
    date: '2024-01-15',
    heuresTravaillees: 8.5,
    tachesCompletes: 12,
    efficacite: 94,
    qualite: 96,
    prestationsRealisees: [
      {
        id: '1',
        type: 'ENCODAGE_COMPTABLE',
        nom: 'Encodage factures janvier',
        clientId: 'CLI001',
        clientNom: 'Cabinet Médical Dr. Martin',
        tempsPreste: 3.5,
        tempsEstime: 4.0,
        statut: 'termine',
        qualite: 'excellent',
        dateDebut: '2024-01-15',
        dateFin: '2024-01-15'
      }
    ],
    categoriesPrestations: [
      {
        id: '01',
        nom: 'ACCUEIL ET RECEPTION',
        budgetAlloue: 5.0,
        heuresRealisees: 2.8,
        nombreDocuments: 35,
        tempsMoyenParDocument: 4.8,
        statut: 'en_cours',
        details: {
          documentsTraites: 35,
          documentsEnAttente: 8,
          documentsRejetes: 1,
          qualiteScore: 97
        }
      },
      {
        id: '02',
        nom: 'SCAN ET ADMIN',
        budgetAlloue: 7.0,
        heuresRealisees: 3.2,
        nombreDocuments: 45,
        tempsMoyenParDocument: 4.3,
        statut: 'en_cours',
        details: {
          documentsTraites: 45,
          documentsEnAttente: 12,
          documentsRejetes: 2,
          qualiteScore: 96
        }
      },
      {
        id: '03',
        nom: 'CLASSEMENT ET ARCHIVAGE',
        budgetAlloue: 4.5,
        heuresRealisees: 2.1,
        nombreDocuments: 78,
        tempsMoyenParDocument: 1.6,
        statut: 'en_cours',
        details: {
          documentsTraites: 78,
          documentsEnAttente: 15,
          documentsRejetes: 3,
          qualiteScore: 94
        }
      },
      {
        id: '04',
        nom: 'ENCODAGE COMPTABLE',
        budgetAlloue: 13.0,
        heuresRealisees: 6.74,
        nombreDocuments: 156,
        tauxErreur: 2.1,
        tempsMoyenParDocument: 2.6,
        statut: 'en_cours',
        details: {
          documentsTraites: 156,
          documentsEnAttente: 23,
          documentsRejetes: 3,
          qualiteScore: 94
        }
      },
      {
        id: '05',
        nom: 'PRESTATIONS TVA',
        budgetAlloue: 2.0,
        heuresRealisees: 1.17,
        nombreDocuments: 8,
        tempsMoyenParDocument: 8.8,
        statut: 'en_cours',
        details: {
          documentsTraites: 8,
          documentsEnAttente: 2,
          documentsRejetes: 0,
          qualiteScore: 98
        }
      },
      {
        id: '06',
        nom: 'NETTOYAGE ET VERIFICATION COMPTABILITE',
        budgetAlloue: 8.5,
        heuresRealisees: 4.2,
        nombreDocuments: 28,
        tauxErreur: 1.5,
        tempsMoyenParDocument: 9.0,
        statut: 'en_cours',
        details: {
          documentsTraites: 28,
          documentsEnAttente: 8,
          documentsRejetes: 1,
          qualiteScore: 97
        }
      },
      {
        id: '07',
        nom: 'LETTRAGE COMPTABLE',
        budgetAlloue: 6.0,
        heuresRealisees: 3.5,
        nombreDocuments: 42,
        tempsMoyenParDocument: 5.0,
        statut: 'en_cours',
        details: {
          documentsTraites: 42,
          documentsEnAttente: 10,
          documentsRejetes: 2,
          qualiteScore: 95
        }
      },
      {
        id: '08',
        nom: 'PRODUCTION BILAN',
        budgetAlloue: 15.0,
        heuresRealisees: 10.6,
        nombreDocuments: 12,
        tempsMoyenParDocument: 53.0,
        statut: 'en_cours',
        details: {
          documentsTraites: 12,
          documentsEnAttente: 3,
          documentsRejetes: 0,
          qualiteScore: 95
        }
      },
      {
        id: '09',
        nom: 'PRESTATIONS FISCALES',
        budgetAlloue: 6.0,
        heuresRealisees: 3.8,
        nombreDocuments: 15,
        tempsMoyenParDocument: 15.2,
        statut: 'en_cours',
        details: {
          documentsTraites: 15,
          documentsEnAttente: 4,
          documentsRejetes: 1,
          qualiteScore: 93
        }
      },
      {
        id: '10',
        nom: 'SUIVI CLIENTS',
        budgetAlloue: 8.0,
        heuresRealisees: 5.2,
        nombreDocuments: 25,
        tempsMoyenParDocument: 12.5,
        statut: 'en_cours',
        details: {
          documentsTraites: 25,
          documentsEnAttente: 6,
          documentsRejetes: 1,
          qualiteScore: 96
        }
      },
      {
        id: '11',
        nom: 'CONSEILS CLIENT',
        budgetAlloue: 4.0,
        heuresRealisees: 2.5,
        nombreDocuments: 6,
        tempsMoyenParDocument: 25.0,
        statut: 'en_cours',
        details: {
          documentsTraites: 6,
          documentsEnAttente: 1,
          documentsRejetes: 0,
          qualiteScore: 99
        }
      },
      {
        id: '12',
        nom: 'FORMATION ET SUPPORT',
        budgetAlloue: 3.0,
        heuresRealisees: 1.5,
        nombreDocuments: 12,
        tempsMoyenParDocument: 7.5,
        statut: 'en_cours',
        details: {
          documentsTraites: 12,
          documentsEnAttente: 3,
          documentsRejetes: 0,
          qualiteScore: 98
        }
      },
      {
        id: '13',
        nom: 'VALIDATION - RELECTURE',
        budgetAlloue: 3.5,
        heuresRealisees: 1.8,
        nombreDocuments: 22,
        tempsMoyenParDocument: 4.9,
        statut: 'en_cours',
        details: {
          documentsTraites: 22,
          documentsEnAttente: 5,
          documentsRejetes: 2,
          qualiteScore: 96
        }
      }
    ]
  },
  // Youssef Taher  
  {
    collaborateurId: 'collab-2',
    date: '2024-01-16',
    heuresTravaillees: 7.8,
    tachesCompletes: 10,
    efficacite: 87,
    qualite: 92,
    prestationsRealisees: [
      {
        id: 'prest-1',
        type: 'ENCODAGE_COMPTABLE',
        nom: 'Encodage factures SARL MARTIN',
        clientId: '1',
        clientNom: 'SARL MARTIN',
        tempsPreste: 3.5,
        tempsEstime: 3.0,
        statut: 'termine',
        qualite: 'excellent',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      },
      {
        id: 'prest-2',
        type: 'TVA',
        nom: 'Déclaration TVA Q2',
        clientId: 'client-2',
        clientNom: 'SAS DUPONT',
        tempsPreste: 2.0,
        tempsEstime: 2.5,
        statut: 'termine',
        qualite: 'bon',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    categoriesPrestations: [
      {
        id: '04',
        nom: 'ENCODAGE COMPTABLE',
        budgetAlloue: 10.0,
        heuresRealisees: 5.2,
        nombreDocuments: 89,
        tauxErreur: 1.8,
        tempsMoyenParDocument: 3.5,
        statut: 'en_cours',
        details: {
          documentsTraites: 89,
          documentsEnAttente: 15,
          documentsRejetes: 2,
          qualiteScore: 92
        }
      },
      {
        id: '05',
        nom: 'PRESTATIONS TVA',
        budgetAlloue: 3.0,
        heuresRealisees: 2.0,
        nombreDocuments: 12,
        tempsMoyenParDocument: 10.0,
        statut: 'en_cours',
        details: {
          documentsTraites: 12,
          documentsEnAttente: 3,
          documentsRejetes: 0,
          qualiteScore: 96
        }
      }
    ]
  },
  {
    collaborateurId: 'collab-1',
    date: '2024-08-20',
    heuresTravaillees: 7.8,
    tachesCompletes: 8,
    efficacite: 85,
    qualite: 88,
    prestationsRealisees: [
      {
        id: 'prest-3',
        type: 'BILAN',
        nom: 'Révision bilan 2023',
        clientId: '3',
        clientNom: 'EURL TECH',
        tempsPreste: 4.5,
        tempsEstime: 5.0,
        statut: 'en_cours',
        qualite: 'bon',
        dateDebut: '2024-08-20'
      }
    ],
    categoriesPrestations: [
      {
        id: '08',
        nom: 'PRODUCTION BILAN',
        budgetAlloue: 12.0,
        heuresRealisees: 7.8,
        nombreDocuments: 5,
        tempsMoyenParDocument: 93.6,
        statut: 'en_cours',
        details: {
          documentsTraites: 5,
          documentsEnAttente: 2,
          documentsRejetes: 0,
          qualiteScore: 88
        }
      }
    ]
  },
  // Youssef Behloul
  {
    collaborateurId: 'collab-2',
    periode: '2024-08-19',
    tempsPreste: 9.2,
    tempsPlanifie: 8.0,
    tempsAttendu: 8.0,
    prestationsRealisees: [
      {
        id: 'prest-4',
        type: 'FISCALE',
        nom: 'Déclaration ISOC 2023',
        clientId: '4',
        clientNom: 'SA INDUSTRIE',
        tempsPreste: 5.5,
        tempsEstime: 4.0,
        statut: 'en_cours',
        qualite: 'excellent',
        dateDebut: '2024-08-19'
      },
      {
        id: 'prest-5',
        type: 'CONSEIL',
        nom: 'Conseil fiscal restructuration',
        clientId: '5',
        clientNom: 'HOLDING INVEST',
        tempsPreste: 3.0,
        tempsEstime: 3.5,
        statut: 'termine',
        qualite: 'excellent',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    vitesseProduction: 0.22,
    qualiteScore: 95,
    efficacite: 115
  },
  // Vanessa Amouri
  {
    collaborateurId: 'collab-3',
    periode: '2024-08-19',
    tempsPreste: 4.8,
    tempsPlanifie: 4.8,
    tempsAttendu: 4.8,
    prestationsRealisees: [
      {
        id: 'prest-6',
        type: 'SCAN_ADMIN',
        nom: 'Scan et classement documents',
        clientId: 'client-6',
        clientNom: 'SPRL SERVICES',
        tempsPreste: 2.5,
        tempsEstime: 2.0,
        statut: 'termine',
        qualite: 'bon',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    vitesseProduction: 0.40,
    qualiteScore: 85,
    efficacite: 100
  },
  // Ismail Abdelkhalek
  {
    collaborateurId: 'collab-4',
    periode: '2024-08-19',
    tempsPreste: 8.1,
    tempsPlanifie: 8.0,
    tempsAttendu: 8.0,
    prestationsRealisees: [
      {
        id: 'prest-7',
        type: 'ENCODAGE_COMPTABLE',
        nom: 'Encodage mensuel restaurant',
        clientId: 'client-7',
        clientNom: 'RESTAURANT BELLA',
        tempsPreste: 4.0,
        tempsEstime: 4.5,
        statut: 'termine',
        qualite: 'bon',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    vitesseProduction: 0.25,
    qualiteScore: 87,
    efficacite: 101
  },
  // Ozer Tekki
  {
    collaborateurId: 'collab-5',
    periode: '2024-08-19',
    tempsPreste: 4.0,
    tempsPlanifie: 4.0,
    tempsAttendu: 4.0,
    prestationsRealisees: [
      {
        id: 'prest-8',
        type: 'SCAN_ADMIN',
        nom: 'Archivage dossiers clients',
        clientId: 'client-8',
        clientNom: 'Divers clients',
        tempsPreste: 3.5,
        tempsEstime: 4.0,
        statut: 'termine',
        qualite: 'moyen',
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    vitesseProduction: 0.25,
    qualiteScore: 75,
    efficacite: 100
  }
];

// Échéances fiscales et administratives avec plusieurs échéances par client
export const echeancesFiscales: EcheanceFiscale[] = [
  // SARL MARTIN - 3 échéances simultanées
  {
    id: 'ech-1',
    type: 'TVA',
    nom: 'TVA Mensuelle Août 2024',
    clientId: '1',
    clientNom: 'SARL MARTIN',
    dateEcheance: '2024-08-20',
    statut: 'termine',
    priorite: 'haute',
    etapes: [
      {
        id: 'etape-1',
        nom: 'Collecte documents',
        ordre: 1,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 0.5,
        tempsRealise: 0.5,
        dateDebut: '2024-08-15',
        dateFin: '2024-08-15'
      },
      {
        id: 'etape-2',
        nom: 'Saisie déclaration',
        ordre: 2,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 1.5,
        tempsRealise: 1.3,
        dateDebut: '2024-08-16',
        dateFin: '2024-08-16'
      },
      {
        id: 'etape-3',
        nom: 'Contrôle et validation',
        ordre: 3,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 0.5,
        tempsRealise: 0.7,
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      },
      {
        id: 'etape-4',
        nom: 'Dépôt électronique',
        ordre: 4,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 0.3,
        tempsRealise: 0.3,
        dateDebut: '2024-08-19',
        dateFin: '2024-08-19'
      }
    ],
    collaborateurAssigne: 'collab-1',
    tempsEstime: 2.8,
    tempsRealise: 2.8,
    avancement: 100
  },
  {
    id: 'ech-2',
    type: 'BILAN',
    nom: 'Bilan annuel 2023',
    clientId: '1',
    clientNom: 'SARL MARTIN',
    dateEcheance: '2024-08-31',
    statut: 'en_revision',
    priorite: 'haute',
    etapes: [
      {
        id: 'etape-5',
        nom: 'Révision comptes',
        ordre: 1,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 6.0,
        tempsRealise: 6.5,
        dateDebut: '2024-08-10',
        dateFin: '2024-08-15'
      },
      {
        id: 'etape-6',
        nom: 'Établissement bilan',
        ordre: 2,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 4.0,
        tempsRealise: 4.2,
        dateDebut: '2024-08-16',
        dateFin: '2024-08-19'
      },
      {
        id: 'etape-7',
        nom: 'Contrôle final',
        ordre: 3,
        statut: 'en_cours',
        obligatoire: true,
        tempsEstime: 2.0,
        tempsRealise: 0.5,
        dateDebut: '2024-08-20'
      }
    ],
    collaborateurAssigne: 'collab-2',
    tempsEstime: 12.0,
    tempsRealise: 11.2,
    avancement: 85
  },
  {
    id: 'ech-3',
    type: 'IPP',
    nom: 'Déclaration IPP 2023 - Gérant',
    clientId: '1',
    clientNom: 'SARL MARTIN',
    dateEcheance: '2024-10-15',
    statut: 'non_commence',
    priorite: 'moyenne',
    etapes: [
      {
        id: 'etape-8',
        nom: 'Collecte documents personnels',
        ordre: 1,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 1.0,
        tempsRealise: 0
      },
      {
        id: 'etape-9',
        nom: 'Calcul revenus professionnels',
        ordre: 2,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 2.0,
        tempsRealise: 0
      },
      {
        id: 'etape-10',
        nom: 'Optimisation fiscale',
        ordre: 3,
        statut: 'non_commence',
        obligatoire: false,
        tempsEstime: 1.5,
        tempsRealise: 0
      }
    ],
    collaborateurAssigne: 'collab-1',
    tempsEstime: 4.5,
    tempsRealise: 0,
    avancement: 0
  },
  // SA INDUSTRIE - 2 échéances simultanées
  {
    id: 'ech-4',
    type: 'ISOC',
    nom: 'Déclaration ISOC 2023',
    clientId: '4',
    clientNom: 'SA INDUSTRIE',
    dateEcheance: '2024-09-30',
    statut: 'en_cours',
    priorite: 'haute',
    etapes: [
      {
        id: 'etape-11',
        nom: 'Analyse bilan fiscal',
        ordre: 1,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 3.0,
        tempsRealise: 3.2,
        dateDebut: '2024-08-15',
        dateFin: '2024-08-17'
      },
      {
        id: 'etape-12',
        nom: 'Calcul impôt société',
        ordre: 2,
        statut: 'en_cours',
        obligatoire: true,
        tempsEstime: 4.0,
        tempsRealise: 2.5,
        dateDebut: '2024-08-18'
      },
      {
        id: 'etape-13',
        nom: 'Rédaction déclaration',
        ordre: 3,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 2.5,
        tempsRealise: 0
      }
    ],
    collaborateurAssigne: 'collab-2',
    tempsEstime: 9.5,
    tempsRealise: 5.7,
    avancement: 45
  },
  {
    id: 'ech-5',
    type: 'TVA',
    nom: 'TVA Mensuelle Septembre 2024',
    clientId: '4',
    clientNom: 'SA INDUSTRIE',
    dateEcheance: '2024-09-20',
    statut: 'non_commence',
    priorite: 'moyenne',
    etapes: [
      {
        id: 'etape-14',
        nom: 'Collecte factures',
        ordre: 1,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 1.0,
        tempsRealise: 0
      },
      {
        id: 'etape-15',
        nom: 'Saisie TVA',
        ordre: 2,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 2.0,
        tempsRealise: 0
      }
    ],
    collaborateurAssigne: 'collab-3',
    tempsEstime: 3.0,
    tempsRealise: 0,
    avancement: 0
  },
  // EURL TECH - 2 échéances simultanées
  {
    id: 'ech-6',
    type: 'BILAN',
    nom: 'Bilan annuel 2023',
    clientId: '3',
    clientNom: 'EURL TECH',
    dateEcheance: '2024-08-31',
    statut: 'en_revision',
    priorite: 'haute',
    etapes: [
      {
        id: 'etape-16',
        nom: 'Révision comptes',
        ordre: 1,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 5.0,
        tempsRealise: 5.2,
        dateDebut: '2024-08-12',
        dateFin: '2024-08-16'
      },
      {
        id: 'etape-17',
        nom: 'Établissement bilan',
        ordre: 2,
        statut: 'en_cours',
        obligatoire: true,
        tempsEstime: 3.0,
        tempsRealise: 1.5,
        dateDebut: '2024-08-17'
      }
    ],
    collaborateurAssigne: 'collab-2',
    tempsEstime: 8.0,
    tempsRealise: 6.7,
    avancement: 75
  },
  {
    id: 'ech-7',
    type: 'TVA',
    nom: 'TVA Trimestrielle Q3 2024',
    clientId: '3',
    clientNom: 'EURL TECH',
    dateEcheance: '2024-10-20',
    statut: 'non_commence',
    priorite: 'basse',
    etapes: [
      {
        id: 'etape-18',
        nom: 'Préparation documents',
        ordre: 1,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 1.5,
        tempsRealise: 0
      }
    ],
    collaborateurAssigne: 'collab-1',
    tempsEstime: 1.5,
    tempsRealise: 0,
    avancement: 0
  },
  // HOLDING INVEST - 1 échéance complexe
  {
    id: 'ech-8',
    type: 'TVA',
    nom: 'TVA Consolidée Groupe Q2 2024',
    clientId: '5',
    clientNom: 'HOLDING INVEST',
    dateEcheance: '2024-08-25',
    statut: 'en_cours',
    priorite: 'haute',
    etapes: [
      {
        id: 'etape-19',
        nom: 'Consolidation filiales',
        ordre: 1,
        statut: 'termine',
        obligatoire: true,
        tempsEstime: 3.0,
        tempsRealise: 3.5,
        dateDebut: '2024-08-12',
        dateFin: '2024-08-14'
      },
      {
        id: 'etape-20',
        nom: 'Calcul TVA groupe',
        ordre: 2,
        statut: 'en_cours',
        obligatoire: true,
        tempsEstime: 2.0,
        tempsRealise: 1.2,
        dateDebut: '2024-08-15'
      },
      {
        id: 'etape-21',
        nom: 'Validation expert',
        ordre: 3,
        statut: 'non_commence',
        obligatoire: true,
        tempsEstime: 1.0,
        tempsRealise: 0
      }
    ],
    collaborateurAssigne: 'collab-3',
    tempsEstime: 6.0,
    tempsRealise: 4.7,
    avancement: 70
  }
];

// Suivi du temps par collaborateur
export const suiviTemps: SuiviTemps[] = [
  {
    collaborateurId: 'collab-1',
    periode: '2024-08-19_2024-08-23',
    tempsAttendu: 40,
    tempsPreste: 41.5,
    tempsPlanifie: 40,
    ecartTimesheet: 1.5,
    ecartPlanning: 0,
    tauxRealisation: 103.8,
    heuresSupplementaires: 1.5,
    congesUtilises: 0
  },
  {
    collaborateurId: 'collab-2',
    periode: '2024-08-19_2024-08-23',
    tempsAttendu: 40,
    tempsPreste: 43.2,
    tempsPlanifie: 42,
    ecartTimesheet: 3.2,
    ecartPlanning: 2,
    tauxRealisation: 102.9,
    heuresSupplementaires: 3.2,
    congesUtilises: 0
  },
  {
    collaborateurId: 'collab-3',
    periode: '2024-08-19_2024-08-23',
    tempsAttendu: 24,
    tempsPreste: 23.5,
    tempsPlanifie: 24,
    ecartTimesheet: -0.5,
    ecartPlanning: 0,
    tauxRealisation: 97.9,
    heuresSupplementaires: 0,
    congesUtilises: 0.5
  },
  {
    collaborateurId: 'collab-4',
    periode: '2024-08-19_2024-08-23',
    tempsAttendu: 40,
    tempsPreste: 38.7,
    tempsPlanifie: 40,
    ecartTimesheet: -1.3,
    ecartPlanning: 0,
    tauxRealisation: 96.8,
    heuresSupplementaires: 0,
    congesUtilises: 1.3
  },
  {
    collaborateurId: 'collab-5',
    periode: '2024-08-19_2024-08-23',
    tempsAttendu: 20,
    tempsPreste: 19.5,
    tempsPlanifie: 20,
    ecartTimesheet: -0.5,
    ecartPlanning: 0,
    tauxRealisation: 97.5,
    heuresSupplementaires: 0,
    congesUtilises: 0.5
  }
];

// Dashboard complet
export const dashboardProduction: DashboardProduction = {
  periode: {
    debut: '2024-08-19',
    fin: '2024-08-23'
  },
  collaborateurs,
  metriques: metriquesProduction,
  echeances: echeancesFiscales,
  suiviTemps,
  indicateurs: [
    {
      titre: 'Temps Total Équipe',
      valeur: 166.4,
      unite: 'h',
      evolution: 2.1,
      tendance: 'hausse',
      seuil: { min: 150, max: 180, optimal: 165 },
      couleur: 'bleu'
    },
    {
      titre: 'Efficacité Moyenne',
      valeur: 104.1,
      unite: '%',
      evolution: 1.8,
      tendance: 'hausse',
      seuil: { min: 85, max: 120, optimal: 100 },
      couleur: 'vert'
    },
    {
      titre: 'Échéances en Retard',
      valeur: 0,
      evolution: -2,
      tendance: 'baisse',
      seuil: { min: 0, max: 5, optimal: 0 },
      couleur: 'vert'
    },
    {
      titre: 'Score Qualité Moyen',
      valeur: 87.4,
      unite: '/100',
      evolution: 0.8,
      tendance: 'hausse',
      seuil: { min: 70, max: 100, optimal: 90 },
      couleur: 'orange'
    }
  ]
};
