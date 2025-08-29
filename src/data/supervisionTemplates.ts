import { SupervisionTemplate, ErrorCategory, ChecklistItem } from '@/types/supervision';

// Catégories d'erreurs communes par thème
export const errorCategories: ErrorCategory[] = [
  // Erreurs d'encodage
  {
    id: 'ERR_ENC_001',
    name: 'Erreur de saisie comptable',
    description: 'Erreurs dans l\'enregistrement des écritures comptables',
    severity: 'medium',
    frequency: 15,
    impact: 'operational',
    commonCauses: [
      'Mauvaise interprétation des documents',
      'Fatigue ou inattention',
      'Méconnaissance du plan comptable'
    ],
    preventiveMeasures: [
      'Double vérification systématique',
      'Formation plan comptable',
      'Utilisation de modèles prédéfinis'
    ],
    trainingTopics: [
      'Plan comptable général',
      'Techniques de saisie',
      'Contrôles de cohérence'
    ]
  },
  {
    id: 'ERR_ENC_002',
    name: 'TVA incorrecte',
    description: 'Application incorrecte des taux de TVA',
    severity: 'high',
    frequency: 8,
    impact: 'compliance',
    commonCauses: [
      'Confusion entre taux de TVA',
      'Méconnaissance des exceptions',
      'Erreur de paramétrage'
    ],
    preventiveMeasures: [
      'Tableau récapitulatif des taux',
      'Validation automatique',
      'Formation TVA régulière'
    ],
    trainingTopics: [
      'Réglementation TVA',
      'Cas particuliers TVA',
      'Contrôles TVA'
    ]
  },
  // Erreurs bilan ISOC
  {
    id: 'ERR_ISOC_001',
    name: 'Erreur classification actif/passif',
    description: 'Mauvaise classification des éléments au bilan',
    severity: 'high',
    frequency: 6,
    impact: 'compliance',
    commonCauses: [
      'Méconnaissance des règles de classification',
      'Confusion entre court/long terme',
      'Application incorrecte des normes'
    ],
    preventiveMeasures: [
      'Checklist de classification',
      'Révision des normes comptables',
      'Supervision renforcée'
    ],
    trainingTopics: [
      'Structure du bilan',
      'Normes comptables belges',
      'Classification actif/passif'
    ]
  },
  {
    id: 'ERR_ISOC_002',
    name: 'Calcul amortissements incorrect',
    description: 'Erreurs dans le calcul des amortissements',
    severity: 'medium',
    frequency: 10,
    impact: 'financial',
    commonCauses: [
      'Mauvaise application des taux',
      'Erreur de base amortissable',
      'Oubli de mise à jour'
    ],
    preventiveMeasures: [
      'Tableau de suivi des amortissements',
      'Contrôle automatique',
      'Révision périodique'
    ],
    trainingTopics: [
      'Calcul amortissements',
      'Durées de vie utile',
      'Méthodes d\'amortissement'
    ]
  },
  // Erreurs IPM
  {
    id: 'ERR_IPM_001',
    name: 'Erreur calcul cotisations sociales',
    description: 'Erreurs dans le calcul des cotisations sociales IPM',
    severity: 'critical',
    frequency: 4,
    impact: 'compliance',
    commonCauses: [
      'Méconnaissance des barèmes',
      'Erreur de base de calcul',
      'Oubli d\'exonérations'
    ],
    preventiveMeasures: [
      'Utilisation calculateurs officiels',
      'Vérification croisée',
      'Formation continue IPM'
    ],
    trainingTopics: [
      'Cotisations sociales IPM',
      'Barèmes et taux',
      'Exonérations spécifiques'
    ]
  },
  // Erreurs IPP
  {
    id: 'ERR_IPP_001',
    name: 'Erreur déductions fiscales',
    description: 'Application incorrecte des déductions fiscales IPP',
    severity: 'medium',
    frequency: 12,
    impact: 'financial',
    commonCauses: [
      'Méconnaissance des conditions',
      'Documentation insuffisante',
      'Changements réglementaires'
    ],
    preventiveMeasures: [
      'Checklist déductions',
      'Veille réglementaire',
      'Formation fiscale'
    ],
    trainingTopics: [
      'Déductions fiscales IPP',
      'Justificatifs requis',
      'Évolutions réglementaires'
    ]
  }
];

// Items de checklist par thème
const encodageChecklist: ChecklistItem[] = [
  {
    id: 'CHK_ENC_001',
    category: 'Saisie',
    description: 'Vérification de la cohérence des écritures comptables',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_ENC_001']
  },
  {
    id: 'CHK_ENC_002',
    category: 'TVA',
    description: 'Contrôle de l\'application correcte des taux de TVA',
    isRequired: true,
    weight: 4,
    relatedErrors: ['ERR_ENC_002']
  },
  {
    id: 'CHK_ENC_003',
    category: 'Justificatifs',
    description: 'Vérification de la présence et validité des pièces justificatives',
    isRequired: true,
    weight: 3,
    relatedErrors: []
  },
  {
    id: 'CHK_ENC_004',
    category: 'Balance',
    description: 'Équilibrage de la balance comptable',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_ENC_001']
  }
];

const bilanIsocChecklist: ChecklistItem[] = [
  {
    id: 'CHK_ISOC_001',
    category: 'Structure',
    description: 'Vérification de la structure du bilan ISOC',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_ISOC_001']
  },
  {
    id: 'CHK_ISOC_002',
    category: 'Amortissements',
    description: 'Contrôle des calculs d\'amortissements',
    isRequired: true,
    weight: 4,
    relatedErrors: ['ERR_ISOC_002']
  },
  {
    id: 'CHK_ISOC_003',
    category: 'Provisions',
    description: 'Vérification des provisions constituées',
    isRequired: true,
    weight: 3,
    relatedErrors: []
  },
  {
    id: 'CHK_ISOC_004',
    category: 'Cohérence',
    description: 'Cohérence entre bilan et compte de résultats',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_ISOC_001']
  }
];

const declarationIpmChecklist: ChecklistItem[] = [
  {
    id: 'CHK_IPM_001',
    category: 'Identification',
    description: 'Vérification des données d\'identification',
    isRequired: true,
    weight: 3,
    relatedErrors: []
  },
  {
    id: 'CHK_IPM_002',
    category: 'Revenus',
    description: 'Contrôle du calcul des revenus professionnels',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_IPM_001']
  },
  {
    id: 'CHK_IPM_003',
    category: 'Cotisations',
    description: 'Vérification des cotisations sociales',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_IPM_001']
  },
  {
    id: 'CHK_IPM_004',
    category: 'Annexes',
    description: 'Contrôle des annexes obligatoires',
    isRequired: true,
    weight: 2,
    relatedErrors: []
  }
];

const declarationIppChecklist: ChecklistItem[] = [
  {
    id: 'CHK_IPP_001',
    category: 'Revenus',
    description: 'Vérification des déclarations de revenus',
    isRequired: true,
    weight: 4,
    relatedErrors: []
  },
  {
    id: 'CHK_IPP_002',
    category: 'Déductions',
    description: 'Contrôle des déductions fiscales appliquées',
    isRequired: true,
    weight: 5,
    relatedErrors: ['ERR_IPP_001']
  },
  {
    id: 'CHK_IPP_003',
    category: 'Crédits',
    description: 'Vérification des crédits d\'impôt',
    isRequired: true,
    weight: 3,
    relatedErrors: []
  },
  {
    id: 'CHK_IPP_004',
    category: 'Documentation',
    description: 'Contrôle de la documentation justificative',
    isRequired: true,
    weight: 4,
    relatedErrors: ['ERR_IPP_001']
  }
];

// Modèles de supervision prédéfinis
export const supervisionTemplates: SupervisionTemplate[] = [
  {
    id: 'TEMP_ENC_001',
    name: 'Supervision Encodage Comptable',
    theme: 'encodage',
    description: 'Supervision complète des activités d\'encodage comptable',
    checklistItems: encodageChecklist,
    errorCategories: errorCategories.filter(e => e.id.includes('ENC')),
    requiredDocuments: [
      'Pièces justificatives',
      'Journal des écritures',
      'Balance comptable',
      'Rapprochements bancaires'
    ],
    estimatedDuration: 60,
    targetRoles: ['Comptable junior', 'Assistant comptable', 'Encodeur'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'TEMP_ISOC_001',
    name: 'Supervision Bilan & Déclaration ISOC',
    theme: 'bilan-isoc',
    description: 'Supervision de l\'établissement du bilan et de la déclaration ISOC',
    checklistItems: bilanIsocChecklist,
    errorCategories: errorCategories.filter(e => e.id.includes('ISOC')),
    requiredDocuments: [
      'Bilan comptable',
      'Compte de résultats',
      'Annexes',
      'Déclaration ISOC',
      'Justificatifs amortissements'
    ],
    estimatedDuration: 90,
    targetRoles: ['Comptable', 'Responsable comptable', 'Expert-comptable'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'TEMP_IPM_001',
    name: 'Supervision Déclaration IPM',
    theme: 'declaration-ipm',
    description: 'Supervision de la préparation et contrôle des déclarations IPM',
    checklistItems: declarationIpmChecklist,
    errorCategories: errorCategories.filter(e => e.id.includes('IPM')),
    requiredDocuments: [
      'Déclaration IPM',
      'Justificatifs revenus',
      'Calculs cotisations',
      'Attestations'
    ],
    estimatedDuration: 75,
    targetRoles: ['Fiscal', 'Comptable', 'Conseiller fiscal'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'TEMP_IPP_001',
    name: 'Supervision Déclaration IPP',
    theme: 'declaration-ipp',
    description: 'Supervision des déclarations d\'impôt des personnes physiques',
    checklistItems: declarationIppChecklist,
    errorCategories: errorCategories.filter(e => e.id.includes('IPP')),
    requiredDocuments: [
      'Déclaration IPP',
      'Fiches de paie',
      'Justificatifs déductions',
      'Attestations diverses'
    ],
    estimatedDuration: 45,
    targetRoles: ['Fiscal', 'Conseiller fiscal', 'Assistant fiscal'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  }
];

// Modèles de contenu de formation basés sur les erreurs
export const trainingContentTemplates = [
  {
    id: 'TRAIN_ENC_001',
    title: 'Formation Plan Comptable et Saisie',
    description: 'Formation complète sur l\'utilisation du plan comptable et les techniques de saisie',
    targetErrors: ['ERR_ENC_001'],
    modules: [
      {
        title: 'Structure du plan comptable',
        type: 'theory',
        duration: 30
      },
      {
        title: 'Cas pratiques de saisie',
        type: 'hands-on',
        duration: 45
      },
      {
        title: 'Contrôles de cohérence',
        type: 'exercise',
        duration: 15
      }
    ]
  },
  {
    id: 'TRAIN_TVA_001',
    title: 'Formation TVA - Taux et Applications',
    description: 'Formation sur l\'application correcte des taux de TVA',
    targetErrors: ['ERR_ENC_002'],
    modules: [
      {
        title: 'Réglementation TVA',
        type: 'theory',
        duration: 20
      },
      {
        title: 'Cas particuliers et exceptions',
        type: 'case-study',
        duration: 40
      },
      {
        title: 'Quiz TVA',
        type: 'quiz',
        duration: 10
      }
    ]
  }
];
