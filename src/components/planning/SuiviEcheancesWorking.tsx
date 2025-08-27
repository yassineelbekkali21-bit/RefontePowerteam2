/**
 * Version fonctionnelle progressive du composant SuiviEcheances
 * Approche step-by-step pour assurer le fonctionnement
 */

import React, { useState, useMemo } from 'react';
import { usePlanning } from '@/contexts/PlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Target,
  Users,
  User,
  Shield,
  DollarSign,
  Search,
  RefreshCw,
  Activity,
  Briefcase,
  FileText,
  Plus,
  Filter,
  Sparkles,
  Accessibility,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Timer,
  BarChart3,
  Play,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';

// Types basiques
interface SimpleEcheance {
  id: string;
  nom: string;
  type: string;
  statut: string;
  urgence: 'low' | 'medium' | 'high' | 'urgent';
  clientNom: string;
  dateEcheance: string;
  responsable: string;
  progression: number;
  description: string;
  partner: string;
  gestionnaire: string;
}

// Configuration des types d'échéances avec couleurs et planification intelligente
// Tâches complémentaires hors-forfait typiques d'un cabinet
const tachesComplementaires = [
  {
    id: 'conseil-fiscal',
    nom: 'Conseil fiscal personnalisé',
    description: 'Optimisation fiscale et conseils stratégiques',
    frequence: 'Ponctuel',
    tarifMoyen: '150€/h',
    icon: '💡',
    clients: ['SARL Consulting Pro', 'SAS Digital Solutions', 'EURL Innovation Plus'],
    urgence: 'moyenne'
  },
  {
    id: 'audit-comptable',
    nom: 'Audit comptable approfondi',
    description: 'Révision complète des comptes et procédures',
    frequence: 'Annuel',
    tarifMoyen: '200€/h',
    icon: '🔍',
    clients: ['SA Industrial Group', 'SARL Consulting Pro'],
    urgence: 'haute'
  },
  {
    id: 'formation-equipe',
    nom: 'Formation équipe comptable',
    description: 'Formation logiciels et nouvelles réglementations',
    frequence: 'Trimestriel',
    tarifMoyen: '120€/h',
    icon: '📚',
    clients: ['SARL Consulting Pro', 'SAS Digital Solutions', 'SA Industrial Group'],
    urgence: 'faible'
  },
  {
    id: 'due-diligence',
    nom: 'Due diligence acquisition',
    description: 'Audit financier pour opérations de croissance externe',
    frequence: 'Ponctuel',
    tarifMoyen: '250€/h',
    icon: '📊',
    clients: ['SA Industrial Group', 'SAS Digital Solutions'],
    urgence: 'haute'
  },
  {
    id: 'restructuration',
    nom: 'Conseil en restructuration',
    description: 'Accompagnement changement statut juridique',
    frequence: 'Ponctuel',
    tarifMoyen: '180€/h',
    icon: '🔄',
    clients: ['EURL Innovation Plus', 'SARL Consulting Pro'],
    urgence: 'moyenne'
  },
  {
    id: 'controle-gestion',
    nom: 'Contrôle de gestion avancé',
    description: 'Tableaux de bord et analyse de performance',
    frequence: 'Mensuel',
    tarifMoyen: '160€/h',
    icon: '📈',
    clients: ['SA Industrial Group', 'SAS Digital Solutions', 'SARL Consulting Pro'],
    urgence: 'moyenne'
  }
];

const echeanceTypes = {
  TVA: {
    name: 'TVA',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: '💰',
    dureeEstimee: 2, // jours
    subtasks: ['Rappel docs', 'Encodage FIni', 'Vérification + Solde', 'Mail client', 'Dépôt']
  },
  COMPLEMENTAIRE: {
    name: 'COMPLÉMENTAIRE',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: '💡',
    dureeEstimee: 4, // jours
    subtasks: ['Non-terminée', 'Terminée']
  },
  IPP: {
    name: 'IPP', 
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: '👤',
    dureeEstimee: 3,
    subtasks: ['Production (I)', 'Supervision (O)', 'Présentation client (I)', 'Accord client (O)', 'Envoi (O)']
  },
  CLOTURE: {
    name: 'CLÔTURE',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    icon: '📊',
    dureeEstimee: 5,
    subtasks: ['Historiques 08 BI2', 'Bilan 08 BI2', 'Supervision 13 VA2', 'Présentation client', 'Déclaration ISOC']
  },
  SITUATION_INTERMEDIAIRE: {
    name: 'SITUATION INTERMÉDIAIRE',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: '📋',
    dureeEstimee: 1,
    subtasks: ['Mise à jour compta 04', 'Nettoyage 06 NE1', 'Ecriture OD 07 BI1', 'Présentation 11 CO6']
  },
  VA: {
    name: 'VERSEMENTS ANTICIPÉS',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    icon: '💸',
    dureeEstimee: 2,
    subtasks: ['Production (VA + Cotisations)', 'Supervision', 'Présentation Client']
  }
};

const collaborateurs = ['BRUNO', 'OLIVIER', 'SARAH', 'MARIE', 'PIERRE', 'JULIE'];

const partners = [
  'Cabinet Central', 'Fiduciaire Nord', 'Comptabilité Sud', 'Audit Express', 'Gestion Plus'
];

const gestionnaires = [
  'Alice Dupont', 'Thomas Rousseau', 'Camille Leroy', 'Nicolas Petit', 'Julie Roux'
];

// Génération simple de données de test
const generateSimpleData = (): SimpleEcheance[] => {
  const clients = [
    'SARL Martin & Associés', 'Dupont Jean-Claude', 'SAS TechnoVision', 'EURL Innovation Plus',
    'SARL Commerce Digital', 'Cabinet Médical Dupont', 'SPRL BelgaTech', 'SA Constructo',
    'ASBL Sports Plus', 'SCS Family Business', 'SCRL Coopérative Verte', 'SNC Partenaires',
    'Fondation Éducative', 'Association Culturelle', 'SARL Resto Central', 'EURL Art & Design',
    'SAS Digital Solutions', 'SPRL Consulting Pro', 'SA Industrial Group', 'SARL Pharma Plus'
  ];

  const typeKeys = Object.keys(echeanceTypes);
  const urgences: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const data: SimpleEcheance[] = [];

  for (let i = 1; i <= 50; i++) {
    // Force quelques tâches complémentaires (positions fixes pour éviter le random)
    let typeKey;
    if ([3, 7, 12, 18, 25, 33, 41, 47].includes(i)) {
      typeKey = 'COMPLEMENTAIRE';
    } else {
      const nonComplementaryKeys = typeKeys.filter(k => k !== 'COMPLEMENTAIRE');
      typeKey = nonComplementaryKeys[Math.floor(Math.random() * nonComplementaryKeys.length)];
    }
    
    const type = echeanceTypes[typeKey as keyof typeof echeanceTypes];
    let subtask;
    
    // Pour les tâches complémentaires, le statut dépend de la progression
    if (typeKey === 'COMPLEMENTAIRE') {
      // Sera défini après le calcul de progression
      subtask = '';
    } else {
      subtask = type.subtasks[Math.floor(Math.random() * type.subtasks.length)];
    }
    
    // Date entre -15 et +60 jours
    const today = new Date();
    const daysOffset = Math.floor(Math.random() * 75) - 15;
    const date = new Date(today);
    date.setDate(today.getDate() + daysOffset);

    // Progression basée sur la position de la sous-tâche
    let progression;
    
    if (typeKey === 'COMPLEMENTAIRE') {
      // Pour les tâches complémentaires : soit 0% (non-terminée) soit 100% (terminée)
      progression = Math.random() < 0.3 ? 100 : 0; // 30% de chances d'être terminée
    } else {
      const taskIndex = type.subtasks.indexOf(subtask);
      const totalTasks = type.subtasks.length;
      const baseProgress = (taskIndex / totalTasks) * 100;
      const randomVariation = Math.floor(Math.random() * 30) - 15;
      progression = Math.max(0, Math.min(100, baseProgress + randomVariation));

      // Quelques tâches terminées
      if (Math.random() < 0.2) {
        progression = 100;
      }
    }

    // Définir le statut pour les tâches complémentaires
    if (typeKey === 'COMPLEMENTAIRE') {
      subtask = progression >= 100 ? 'Terminée' : 'Non-terminée';
    }

    // Noms spéciaux pour les tâches complémentaires
    let nomTache;
    if (typeKey === 'COMPLEMENTAIRE') {
      const tacheComplementaire = tachesComplementaires[Math.floor(Math.random() * tachesComplementaires.length)];
      nomTache = tacheComplementaire.nom;
    } else {
      nomTache = `${type.name} ${i.toString().padStart(2, '0')}/2024`;
    }

    data.push({
      id: i.toString(),
      nom: nomTache,
      type: typeKey,
      statut: subtask,
      urgence: urgences[Math.floor(Math.random() * urgences.length)],
      clientNom: clients[Math.floor(Math.random() * clients.length)],
      dateEcheance: date.toISOString().split('T')[0],
      responsable: collaborateurs[Math.floor(Math.random() * collaborateurs.length)],
      progression,
      description: `${type.name} - ${i % 3 === 0 ? 'Forfait IN' : i % 3 === 1 ? 'Régime normal' : 'Première déclaration'}`,
      partner: partners[Math.floor(Math.random() * partners.length)],
      gestionnaire: gestionnaires[Math.floor(Math.random() * gestionnaires.length)]
    });
  }

  return data.sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());
};

export default function SuiviEcheancesWorking() {
  // Contexte de planification
  const { ajouterTaches } = usePlanning();
  
  // États principaux
  const [echeances] = useState<SimpleEcheance[]>(generateSimpleData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCollaborateur, setSelectedCollaborateur] = useState('all');
  const [viewMode, setViewMode] = useState<'globale' | 'individuelle'>('globale');
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPartner, setSelectedPartner] = useState('all');
  const [selectedGestionnaire, setSelectedGestionnaire] = useState('all');
  const itemsPerPage = 12;

  // Fonctions utilitaires pour la planification intelligente
  const isTerminee = (echeance: SimpleEcheance) => echeance.progression >= 100;
  
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  // Logique d'urgence intelligente : urgent si < 5 jours OU tag manuel urgent
  const isUrgentIntelligent = (echeance: SimpleEcheance) => {
    const daysUntil = getDaysUntil(echeance.dateEcheance);
    return echeance.urgence === 'urgent' || (daysUntil <= 5 && daysUntil >= 0 && !isTerminee(echeance));
  };

  // Obtenir la configuration de type avec couleurs
  const getTypeConfig = (type: string) => {
    return echeanceTypes[type as keyof typeof echeanceTypes] || echeanceTypes.TVA;
  };

  // Calculer la charge de travail restante estimée
  const getChargeRestante = (echeance: SimpleEcheance) => {
    const typeConfig = getTypeConfig(echeance.type);
    const progressionRestante = (100 - echeance.progression) / 100;
    return Math.ceil(typeConfig.dureeEstimee * progressionRestante);
  };

  // Calcul du budget total en heures pour cette prestation
  const getBudgetPrestation = (echeance: SimpleEcheance) => {
    const typeConfig = getTypeConfig(echeance.type);
    // Budget basé sur la durée estimée convertie en heures (1 jour = 8h)
    const budgetHeures = typeConfig.dureeEstimee * 8;
    
    // Ajouter une variabilité stable basée sur l'ID (simulation réaliste)
    const hash = echeance.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const facteurClient = 0.75 + (hash % 50) / 100; // Entre 0.75x et 1.25x, stable pour chaque échéance
    return Math.round(budgetHeures * facteurClient);
  };

  // Fonction pour calculer l'étape actuelle basée sur la progression
  const getEtapeActuelle = (echeance: SimpleEcheance) => {
    const typeConfig = getTypeConfig(echeance.type);
    
    // Pour les tâches complémentaires, utiliser le statut direct
    if (echeance.type === 'COMPLEMENTAIRE') {
      return {
        actuelle: echeance.progression >= 100 ? 2 : 1,
        total: 2,
        nomEtape: echeance.statut // 'Non-terminée' ou 'Terminée'
      };
    }
    
    // Pour les autres types, utiliser la logique existante
    const totalEtapes = typeConfig.subtasks.length;
    const etapeActuelle = Math.ceil((echeance.progression / 100) * totalEtapes);
    
    return {
      actuelle: Math.max(1, etapeActuelle), // Au minimum étape 1
      total: totalEtapes,
      nomEtape: typeConfig.subtasks[Math.min(etapeActuelle - 1, totalEtapes - 1)] || typeConfig.subtasks[0]
    };
  };

  // Calcul des statistiques détaillées par catégorie et sous-tâches
  const getStatistiquesDetaillees = () => {
    const statsDetaillees: Record<string, {
      config: any;
      total: number;
      terminees: number;
      sousTaskes: Record<string, {
        nom: string;
        aCommencer: number;
        enCours: number;
        terminees: number;
      }>;
    }> = {};

    // Initialiser les catégories
    Object.entries(echeanceTypes).forEach(([type, config]) => {
      statsDetaillees[type] = {
        config,
        total: 0,
        terminees: 0,
        sousTaskes: {}
      };

      // Initialiser les sous-tâches
      config.subtasks.forEach(subtask => {
        statsDetaillees[type].sousTaskes[subtask] = {
          nom: subtask,
          aCommencer: 0,
          enCours: 0,
          terminees: 0
        };
      });
    });

    // Calculer les statistiques
    filteredEcheances.forEach(echeance => {
      const type = echeance.type;
      if (statsDetaillees[type]) {
        statsDetaillees[type].total++;
        
        if (isTerminee(echeance)) {
          statsDetaillees[type].terminees++;
        }

        // Logique spéciale pour les tâches COMPLÉMENTAIRE
        if (type === 'COMPLEMENTAIRE') {
          const statut = echeance.statut; // 'Non-terminée' ou 'Terminée'
          if (statsDetaillees[type].sousTaskes[statut]) {
            statsDetaillees[type].sousTaskes[statut].terminees++;
          }
        } else {
          // Logique normale pour les autres types
          if (isTerminee(echeance)) {
            // Toutes les sous-tâches sont terminées
            Object.keys(statsDetaillees[type].sousTaskes).forEach(sousTache => {
              statsDetaillees[type].sousTaskes[sousTache].terminees++;
            });
          } else {
            // Échéance en cours
            const etape = getEtapeActuelle(echeance);
            const typeConfig = getTypeConfig(echeance.type);
            
            typeConfig.subtasks.forEach((sousTache, index) => {
              if (index < etape.actuelle - 1) {
                // Étapes déjà terminées
                statsDetaillees[type].sousTaskes[sousTache].terminees++;
              } else if (index === etape.actuelle - 1) {
                // Étape actuelle (en cours)
                statsDetaillees[type].sousTaskes[sousTache].enCours++;
              } else {
                // Étapes restantes (à commencer)
                statsDetaillees[type].sousTaskes[sousTache].aCommencer++;
              }
            });
          }
        }
      }
    });

    return statsDetaillees;
  };

  // Déterminer la priorité pour la planification automatique
  const getPrioritesPlanification = (echeance: SimpleEcheance) => {
    const daysUntil = getDaysUntil(echeance.dateEcheance);
    const chargeRestante = getChargeRestante(echeance);
    
    if (isUrgentIntelligent(echeance)) return 'critique';
    if (daysUntil <= chargeRestante + 2) return 'haute';
    if (daysUntil <= chargeRestante * 2) return 'moyenne';
    return 'normale';
  };

  // Statuts disponibles selon le type
  const getAvailableStatuses = () => {
    if (selectedType === 'all') {
      return [
        { value: 'all', label: 'Tous' },
        { value: 'termine', label: 'Terminées' },
        { value: 'non_termine', label: 'Non-Terminées' }
      ];
    } else {
      const typeConfig = echeanceTypes[selectedType as keyof typeof echeanceTypes];
      if (typeConfig) {
        return [
          { value: 'all', label: 'Toutes étapes' },
          ...typeConfig.subtasks.map(subtask => ({
            value: subtask,
            label: subtask
          }))
        ];
      }
    }
    return [{ value: 'all', label: 'Tous' }];
  };

  // Filtrage des données
  const filteredEcheances = useMemo(() => {
    return echeances.filter(echeance => {
      // Recherche
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchable = `${echeance.nom} ${echeance.clientNom} ${echeance.description}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      // Type
      if (selectedType !== 'all' && echeance.type !== selectedType) return false;

      // Statut
      if (selectedStatus !== 'all') {
        if (selectedType === 'all') {
          if (selectedStatus === 'termine' && !isTerminee(echeance)) return false;
          if (selectedStatus === 'non_termine' && isTerminee(echeance)) return false;
        } else {
          if (echeance.statut !== selectedStatus) return false;
        }
      }

      // Collaborateur (vue individuelle)
      if (viewMode === 'individuelle' && selectedCollaborateur !== 'all') {
        if (echeance.responsable !== selectedCollaborateur) return false;
      }

      // Filtrer par partner
      if (selectedPartner !== 'all') {
        if (echeance.partner !== selectedPartner) return false;
      }

      // Filtrer par gestionnaire
      if (selectedGestionnaire !== 'all') {
        if (echeance.gestionnaire !== selectedGestionnaire) return false;
      }

      // Masquer terminées
      if (!showCompleted && isTerminee(echeance)) return false;

      return true;
    });
  }, [echeances, searchQuery, selectedType, selectedStatus, selectedCollaborateur, selectedPartner, selectedGestionnaire, viewMode, showCompleted]);

  // Pagination
  const totalPages = Math.ceil(filteredEcheances.length / itemsPerPage);
  const paginatedEcheances = filteredEcheances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  // Gestion des tâches individuelles sélectionnées pour le planning
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  
  const toggleTaskForPlanning = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  // Fonction pour estimer la durée d'une tâche
  const getDureeEstimee = (type: string): number => {
    switch (type) {
      case 'TVA': return 1.5;
      case 'IPP': return 2;
      case 'ISOC': return 2.5;
      case 'CLOTURE': return 4;
      case 'SITUATION_INTERMEDIAIRE': return 1;
      case 'VERSEMENTS_ANTICIPES': return 0.5;
      case 'COMPLEMENTAIRE': return 2;
      default: return 2;
    }
  };

  // Fonction pour ajouter les tâches sélectionnées au planning IA
  const ajouterAuPlanningIA = () => {
    const tachesSelectionnees = filteredEcheances
      .filter(tache => selectedTasks.has(tache.id))
      .map(tache => {
        const etape = getEtapeActuelle(tache);
        return {
          id: tache.id,
          nom: tache.nom,
          type: tache.type,
          clientNom: tache.clientNom,
          dateEcheance: tache.dateEcheance,
          responsable: tache.responsable,
          etapeActuelle: etape.nomEtape,
          urgence: tache.urgence,
          dateAjout: new Date().toISOString(),
          dureeEstimee: getDureeEstimee(tache.type)
        };
      });

    if (tachesSelectionnees.length > 0) {
      ajouterTaches(tachesSelectionnees);
      // Réinitialiser la sélection
      setSelectedTasks(new Set());
      // Optionnel : notification de succès
      console.log(`${tachesSelectionnees.length} tâche(s) ajoutée(s) au planning IA`);
    }
  };

  // Statistiques intelligentes pour la planification
  // Fonction pour calculer urgents et retards par type
  const getTypeMetrics = (type: string) => {
    const typeEcheances = filteredEcheances.filter(e => type === 'all' ? true : e.type === type);
    const urgents = typeEcheances.filter(isUrgentIntelligent).length;
    const retards = typeEcheances.filter(e => getDaysUntil(e.dateEcheance) < 0).length;
    const terminees = typeEcheances.filter(isTerminee).length;
    return { urgents, retards, terminees };
  };

  const stats = useMemo(() => {
    const total = filteredEcheances.length;
    const completed = filteredEcheances.filter(isTerminee).length;
    const inProgress = filteredEcheances.filter(e => !isTerminee(e) && getDaysUntil(e.dateEcheance) >= 0).length;
    const overdue = filteredEcheances.filter(e => !isTerminee(e) && getDaysUntil(e.dateEcheance) < 0).length;
    const urgentIntelligent = filteredEcheances.filter(isUrgentIntelligent).length;
    
    // Répartition par priorité de planification
    const critiques = filteredEcheances.filter(e => getPrioritesPlanification(e) === 'critique').length;
    const chargeRestante = filteredEcheances
      .filter(e => !isTerminee(e))
      .reduce((acc, e) => acc + getChargeRestante(e), 0);
    
    // Répartition par type pour vue d'ensemble
    const parType = Object.keys(echeanceTypes).map(type => ({
      type,
      count: filteredEcheances.filter(e => e.type === type).length,
      config: getTypeConfig(type)
    }));
    
    return { 
      total, 
      completed, 
      inProgress, 
      overdue, 
      urgentIntelligent, 
      critiques, 
      chargeRestante,
      parType 
    };
  }, [filteredEcheances]);

  // Handlers
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // Rendu Vue Globale : Focus sur les métriques et vue d'ensemble
  const renderEcheanceGlobale = (echeance: SimpleEcheance) => {
    const daysUntil = getDaysUntil(echeance.dateEcheance);
    const isOverdue = daysUntil < 0;
    const typeConfig = getTypeConfig(echeance.type);
    const chargeRestante = getChargeRestante(echeance);

    return (
      <tr key={echeance.id} className={`border-b hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-${typeConfig.color}-500`}></div>
            <span className="text-sm font-medium">{echeance.clientNom}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge variant="outline" className="text-xs">{echeance.type}</Badge>
        </td>
        <td className="px-4 py-3 text-sm">{echeance.responsable}</td>
        <td className="px-4 py-3 text-sm">{formatDate(echeance.dateEcheance)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {(() => {
                const etape = getEtapeActuelle(echeance);
                return `${etape.actuelle}/${etape.total}`;
              })()}
            </Badge>
            <span className="text-xs text-gray-500">
              {(() => {
                const etape = getEtapeActuelle(echeance);
                return etape.nomEtape;
              })()}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">
              {getBudgetPrestation(echeance)}h
            </span>
            <span className="text-xs text-gray-500">
              budgétées
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <Badge className={`text-xs ${
            isOverdue ? 'bg-red-100 text-red-800' :
            daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {isOverdue ? `${Math.abs(daysUntil)}j retard` : `${daysUntil}j`}
          </Badge>
        </td>
      </tr>
    );
  };

  // Vue Individuelle Stratégique : Par catégories + sélection priorités
  // Vue individuelle avec tâches par client pour planification
  const renderVueIndividuelleTaches = () => {
    // Prendre les tâches non terminées et les plus prioritaires
    const tachesATraiter = filteredEcheances
      .filter(e => !isTerminee(e))
      .sort((a, b) => {
        // Tri par urgence puis par date d'échéance
        const urgentA = isUrgentIntelligent(a) ? 1 : 0;
        const urgentB = isUrgentIntelligent(b) ? 1 : 0;
        if (urgentA !== urgentB) return urgentB - urgentA;
        
        const daysA = getDaysUntil(a.dateEcheance);
        const daysB = getDaysUntil(b.dateEcheance);
        return daysA - daysB;
      })
      .slice(0, 12); // Limiter à 12 tâches pour éviter la surcharge

    return (
      <div className="space-y-6">
        {/* Header avec tâches sélectionnées pour planning */}
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <Calendar className="w-5 h-5" />
              Tâches Sélectionnées pour Planification
            </CardTitle>
            <p className="text-sm text-indigo-600">
              {selectedTasks.size} tâche{selectedTasks.size > 1 ? 's' : ''} prête{selectedTasks.size > 1 ? 's' : ''} à ajouter au calendrier
            </p>
          </CardHeader>
          {selectedTasks.size > 0 && (
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-500 text-white">
                    {selectedTasks.size} sélectionnée{selectedTasks.size > 1 ? 's' : ''}
                  </Badge>
                </div>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={ajouterAuPlanningIA}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ajouter au Planning IA
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Liste des tâches individuelles */}
        <div className="grid gap-4 md:grid-cols-2">
          {tachesATraiter.map(tache => {
            const daysUntil = getDaysUntil(tache.dateEcheance);
            const isOverdue = daysUntil < 0;
            const isUrgent = isUrgentIntelligent(tache);
            const typeConfig = getTypeConfig(tache.type);
            const isSelected = selectedTasks.has(tache.id);
            const etapeActuelle = getEtapeActuelle(tache);

            return (
              <Card 
                key={tache.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                    : isOverdue 
                    ? 'border-l-4 border-l-red-500 bg-red-50'
                    : isUrgent
                    ? 'border-l-4 border-l-orange-500 bg-orange-50'
                    : 'hover:shadow-md border-l-4 border-l-gray-200'
                }`}
                onClick={() => toggleTaskForPlanning(tache.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* En-tête de tâche */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full bg-${typeConfig.color}-500`}></div>
                        <h3 className="font-semibold text-sm">{tache.clientNom}</h3>
                        <Badge variant="outline" className="text-xs">{tache.type}</Badge>
                      </div>

                      {/* Statut et progression */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">{tache.statut}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-700">Étape actuelle:</span>
                          <span className="text-xs font-bold text-blue-600">{etapeActuelle.nomEtape}</span>
                        </div>
                      </div>

                      {/* Informations clés */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{tache.responsable}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(tache.dateEcheance)}</span>
                        </div>
                      </div>

                      {/* Délai */}
                      <div className="mt-2">
                        {isOverdue ? (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            🚨 {Math.abs(daysUntil)} jour{Math.abs(daysUntil) > 1 ? 's' : ''} de retard
                          </Badge>
                        ) : daysUntil <= 5 ? (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            ⏰ Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            📅 Dans {daysUntil} jours
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-2">
                      {isSelected ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-600">Sélectionnée</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Plus className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-colors" />
                          <span className="text-xs text-gray-500">Ajouter</span>
                        </div>
                      )}
                      
                      {isUrgent && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs animate-pulse">
                          🔥 Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {tachesATraiter.length === 0 && (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold text-gray-800 mb-2">Excellent travail !</h3>
              <p className="text-sm text-gray-600">
                Toutes les tâches prioritaires sont terminées ou aucune tâche ne correspond aux filtres actuels.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suivi des Échéances</h1>
              <p className="text-gray-600">50 échéances de test - Interface optimisée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {viewMode === 'globale' ? 'Vue Globale' : 'Vue Individuelle'}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Accessibility className="w-3 h-3" />
              Version Stable
            </Badge>
          </div>
        </div>

        {/* Toggle vues */}
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-1 border border-white/50 w-fit">
          <Button
            size="sm"
            variant={viewMode === 'globale' ? 'default' : 'ghost'}
            onClick={() => setViewMode('globale')}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            Vue Globale
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'individuelle' ? 'default' : 'ghost'}
            onClick={() => setViewMode('individuelle')}
            className="text-xs"
          >
            <User className="w-3 h-3 mr-1" />
            Vue Individuelle
          </Button>
        </div>
      </div>

      {/* 1. Vue d'ensemble globale - Statistiques détaillées (indépendantes des filtres) */}
      {viewMode === 'globale' && (
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <BarChart3 className="w-5 h-5" />
                  Vue d'Ensemble Globale
                </CardTitle>
                <p className="text-sm text-gray-600">Répartition complète de toutes les échéances par type et sous-tâches</p>
              </div>
              
              {/* Filtres rapides Partner et Gestionnaire */}
              <div className="flex items-center gap-3">
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les partners</SelectItem>
                    {partners.map(partner => (
                      <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedGestionnaire} onValueChange={setSelectedGestionnaire}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Gestionnaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les gestionnaires</SelectItem>
                    {gestionnaires.map(gestionnaire => (
                      <SelectItem key={gestionnaire} value={gestionnaire}>{gestionnaire}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(getStatistiquesDetaillees()).map(([type, stats]) => (
                <Card key={type} className="border border-gray-200 bg-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <span className="text-sm text-gray-600">{stats.config.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{stats.config.name}</h3>
                        <p className="text-xs text-gray-500">{stats.total} échéances • {stats.terminees} terminées</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {Object.values(stats.sousTaskes).map((sousTache) => (
                        <div key={sousTache.nom} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-100">
                          <span className="font-medium text-gray-700 truncate flex-1 mr-2">
                            {sousTache.nom}
                          </span>
                          <div className="flex items-center gap-1 text-xs">
                            {/* Pour les tâches COMPLÉMENTAIRE, afficher seulement le nombre total */}
                            {type === 'COMPLEMENTAIRE' ? (
                              <span className="px-2 py-1 bg-gray-800 text-white rounded font-medium">
                                {sousTache.terminees}
                              </span>
                            ) : (
                              <>
                                {sousTache.aCommencer > 0 && (
                                  <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded font-medium border border-gray-200">
                                    {sousTache.aCommencer} à commencer
                                  </span>
                                )}
                                {sousTache.enCours > 0 && (
                                  <span className="px-2 py-1 bg-gray-400 text-white rounded font-medium">
                                    {sousTache.enCours} en cours
                                  </span>
                                )}
                                {sousTache.terminees > 0 && (
                                  <span className="px-2 py-1 bg-gray-800 text-white rounded font-medium">
                                    {sousTache.terminees} ✓
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tâches Complémentaires - Version compacte */}
      {viewMode === 'globale' && (
        <Card className="border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Tâches Complémentaires</h3>
              </div>
              <span className="text-xs text-amber-600">Hors-forfait</span>
            </div>
            
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {tachesComplementaires.slice(0, 6).map((tache) => (
                <div key={tache.id} className="flex items-center gap-2 p-2 bg-white/60 rounded border border-amber-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                  <span className="text-sm">{tache.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-800 truncate block">{tache.nom}</span>
                    <span className="text-xs text-amber-700">{tache.tarifMoyen}</span>
                  </div>
                  {tache.urgence === 'haute' && (
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-amber-700 text-center">
              💰 Potentiel: ~15k€/mois • Détails dans le tableau de bord
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Barre d'outils et filtres */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                {Object.entries(echeanceTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatuses().map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {viewMode === 'individuelle' && (
              <Select value={selectedCollaborateur} onValueChange={setSelectedCollaborateur}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Collab." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {collaborateurs.map(collab => (
                    <SelectItem key={collab} value={collab}>{collab}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedPartner} onValueChange={setSelectedPartner}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les partners</SelectItem>
                {partners.map(partner => (
                  <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGestionnaire} onValueChange={setSelectedGestionnaire}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Gestionnaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les gestionnaires</SelectItem>
                {gestionnaires.map(gestionnaire => (
                  <SelectItem key={gestionnaire} value={gestionnaire}>{gestionnaire}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
              <span>Terminées</span>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Métriques filtrées - Indicateurs basés sur les filtres sélectionnés - uniquement en vue globale */}
      {viewMode === 'globale' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total</p>
                  <p className="text-xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Terminées</p>
                  <p className="text-xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">En cours</p>
                  <p className="text-xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Retard</p>
                  <p className="text-xl font-bold text-red-900">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Charge Restante</p>
                  <p className="text-xl font-bold text-orange-900">{stats.chargeRestante}j</p>
                  <p className="text-xs text-orange-600">jours de travail</p>
                </div>
                <Timer className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}



      {/* Vue d'ensemble par type - uniquement en vue individuelle pour filtrage rapide */}
      {viewMode === 'individuelle' && (
        <Card className="border-2 border-dashed border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Filtrage Rapide par Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Bouton "Tous" pour désélectionner */}
              <div
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedType === 'all' 
                    ? 'bg-indigo-50 border-indigo-400 border-indigo-400' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTypeChange('all')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📋</span>
                  <span className="font-medium text-sm">Tous</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-2">{filteredEcheances.length}</div>
                <div className="text-xs text-gray-600 mb-2">échéances</div>
                
                {/* Compteurs urgents, retards et terminées pour tous les types */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-xs font-medium text-orange-700">{stats.urgentIntelligent}</span>
                      <span className="text-xs text-gray-500">urgent{stats.urgentIntelligent > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs font-medium text-red-700">{stats.overdue}</span>
                      <span className="text-xs text-gray-500">retard{stats.overdue > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-green-700">{stats.completed}</span>
                      <span className="text-xs text-gray-500">terminée{stats.completed > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {stats.parType.map(({ type, count, config }) => {
                const metrics = getTypeMetrics(type);
                return (
                  <div
                    key={type}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type 
                        ? `${config.bgColor} ${config.borderColor} border-${config.color}-400` 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTypeChange(type)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{config.icon}</span>
                      <span className="text-xs font-medium">{config.name}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-2">{count}</div>
                    <div className="text-xs text-gray-600 mb-2">tâches</div>
                    
                    {/* Compteurs urgents, retards et terminées */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-xs font-medium text-orange-700">{metrics.urgents}</span>
                          <span className="text-xs text-gray-500">urgent{metrics.urgents > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-xs font-medium text-red-700">{metrics.retards}</span>
                          <span className="text-xs text-gray-500">retard{metrics.retards > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-medium text-green-700">{metrics.terminees}</span>
                          <span className="text-xs text-gray-500">terminée{metrics.terminees > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Tableau de bord détaillé - Données filtrées */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {viewMode === 'globale' ? 'Toutes les échéances' : 
             selectedCollaborateur !== 'all' ? `Échéances de ${selectedCollaborateur}` : 'Échéances par collaborateur'}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{filteredEcheances.length} résultats</Badge>
            {totalPages > 1 && (
              <Badge variant="outline">Page {currentPage}/{totalPages}</Badge>
            )}
          </div>
        </div>

        {filteredEcheances.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune échéance</h3>
              <p className="text-gray-500">Aucun résultat pour les filtres sélectionnés</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Contenu selon la vue */}
            {viewMode === 'globale' ? (
              /* Vue Globale : Tableau de bord direction */
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tableau de Bord Cabinet</CardTitle>
                  <p className="text-sm text-gray-600">Vue d'ensemble des échéances et charges de travail</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Client</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Responsable</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Échéance</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Statut</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Budget</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Délai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEcheances.map(renderEcheanceGlobale)}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Vue Individuelle : Tâches par client pour planification */
              renderVueIndividuelleTaches()
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'default' : 'outline'}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
