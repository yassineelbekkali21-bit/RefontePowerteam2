/**
 * Version simplifiée du composant SuiviEcheances
 * Compatible avec l'infrastructure existante
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
// Suppression des imports date-fns qui causaient le problème de page blanche

import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Filter,
  Users,
  User,
  Timer,
  Zap,
  Trophy,
  Star,
  Flame,
  Shield,
  DollarSign,
  Search,
  Settings,
  RefreshCw,
  Bell,
  Activity,
  Briefcase,
  FileText,
  Plus,
  List,
  BarChart3,
  Sparkles,
  Accessibility,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Flag,
  Minus,
  Edit3,
  Check,
  X
} from 'lucide-react';

// Types simplifiés compatibles
interface SimpleEcheance {
  id: string;
  nom: string;
  type: string;
  statut: 'pending' | 'in_progress' | 'completed' | 'overdue';
  urgence: 'low' | 'medium' | 'high' | 'urgent';
  clientNom: string;
  dateEcheance: string;
  responsable?: string;
  progression: number;
  description?: string;
}

// Configuration des catégories
const categoryConfigs = [
  {
    id: 'TVA',
    name: 'TVA',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Déclarations TVA périodiques'
  },
  {
    id: 'IPP',
    name: 'IPP',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    icon: <Shield className="w-5 h-5" />,
    description: 'Impôts des personnes physiques'
  },
  {
    id: 'ISOC',
    name: 'ISOC',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Impôts des sociétés'
  },
  {
    id: 'BILAN',
    name: 'BILAN',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Bilans comptables'
  },
  {
    id: 'DECLARATION',
    name: 'DECLARATION',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    icon: <FileText className="w-5 h-5" />,
    description: 'Déclarations diverses'
  }
];

// Configuration des types d'échéances avec leurs sous-tâches spécifiques
const echeanceTypesConfig = {
  TVA: {
    name: 'TVA',
    subtasks: [
      'Rappel docs',
      'Encodage FIni', 
      'Vérification + Solde + Remboursement / Paiement / Report',
      'Mail client',
      'Dépôt',
      'Intracommunautaire'
    ]
  },
  SITUATION_INTERMEDIAIRE: {
    name: 'SITUATION INTERMÉDIAIRE', 
    subtasks: [
      'Mise à jour compta 04',
      'Nettoyage 06 NE1',
      'Ecriture OD 07 BI1', 
      'Présentation 11 CO6'
    ]
  },
  IPP: {
    name: 'IPP',
    subtasks: [
      'Production (I)',
      'Supervision (O)', 
      'Présentation client (I)',
      'Accord client (O)',
      'Envoi (O)'
    ]
  },
  CLOTURE: {
    name: 'CLÔTURE',
    subtasks: [
      'Historiques 08 BI2 ou 06 NE1',
      'Bilan 08 BI2',
      'Supervision 13 VA2',
      'Présentation client 11 CO7', 
      'Déclaration ISOC 09 FI4',
      'BNB 08 BI3'
    ]
  },
  VA: {
    name: 'VERSEMENTS ANTICIPÉS',
    subtasks: [
      'Production (VA + Cotisations sociales)',
      'Supervision',
      'Présentation Client'
    ]
  }
};

// Liste des collaborateurs
const collaborateurs = [
  'BRUNO', 'OLIVIER', 'SARAH', 'MARIE', 'PIERRE', 'JULIE'
];

// Génération de 50 échéances de test pour valider la structure avec un volume réaliste
const generateTestEcheances = (): SimpleEcheance[] => {
  const clients = [
    'SARL Martin & Associés', 'Dupont Jean-Claude', 'SAS TechnoVision', 'EURL Innovation Plus',
    'SARL Commerce Digital', 'Cabinet Médical Dupont', 'SPRL BelgaTech', 'SA Constructo',
    'ASBL Sports Plus', 'SCS Family Business', 'SCRL Coopérative Verte', 'SNC Partenaires',
    'Fondation Éducative', 'Association Culturelle', 'SARL Resto Central', 'EURL Art & Design',
    'SAS Digital Solutions', 'SPRL Consulting Pro', 'SA Industrial Group', 'SARL Pharma Plus',
    'Cabinet Dentaire Smile', 'EURL Fashion Store', 'SAS Logistics Europe', 'SPRL Green Energy',
    'SA Transport Express', 'SARL Immobilier Prime', 'EURL Tech Startup', 'SAS Media Agency',
    'SPRL Food Corner', 'SA Bank Services', 'SARL Auto Repair', 'EURL Beauty Salon',
    'SAS Event Planning', 'SPRL Sports Club', 'SA Hotel Chain', 'SARL Garden Center',
    'EURL Music School', 'SAS Travel Agency', 'SPRL Pet Care', 'SA Insurance Group',
    'SARL Bakery Deluxe', 'EURL Yoga Studio', 'SAS Fitness Center', 'SPRL Language School',
    'SA Security Services', 'SARL Cleaning Pro', 'EURL Photo Studio', 'SAS Wine Shop',
    'SPRL Book Store', 'SA Print Solutions'
  ];

  const descriptions = [
    'Forfait IN', 'Forfait OUT', 'Régime normal', 'Micro-entreprise', 'Exemption',
    'Nomenclature 09 FI3', 'Nomenclature 13 VA3', 'Nomenclature 11 CO7', 'Nomenclature 08 BI2',
    'Déclaration trimestrielle', 'Déclaration mensuelle', 'Déclaration annuelle',
    'Exercice comptable 2023', 'Exercice comptable 2024', 'Bilan intermédiaire',
    'Situation consolidée', 'Comptes sociaux', 'Première déclaration', 'Régularisation'
  ];

  const urgences: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const types = Object.keys(echeanceTypesConfig);

  const echeances: SimpleEcheance[] = [];

  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const typeConfig = echeanceTypesConfig[type as keyof typeof echeanceTypesConfig];
    const subtasks = typeConfig.subtasks;
    const statut = subtasks[Math.floor(Math.random() * subtasks.length)];
    
    // Dates réalistes étalées sur 6 mois
    const dateBase = new Date();
    const daysOffset = Math.floor(Math.random() * 180) - 30; // Entre -30 jours et +150 jours
    const dateEcheance = new Date(dateBase);
    dateEcheance.setDate(dateBase.getDate() + daysOffset);

    // Progression réaliste selon le statut
    let progression: number;
    const statutIndex = subtasks.indexOf(statut);
    const totalSteps = subtasks.length;
    
    if (statutIndex === totalSteps - 1) {
      progression = 85 + Math.floor(Math.random() * 15); // Dernière étape: 85-100%
    } else if (statutIndex === 0) {
      progression = Math.floor(Math.random() * 25); // Première étape: 0-25%
    } else {
      const baseProgress = (statutIndex / totalSteps) * 100;
      progression = Math.max(0, Math.min(100, baseProgress + Math.floor(Math.random() * 30) - 15));
    }

    // Quelques échéances terminées (progression 100%)
    if (Math.random() < 0.15) {
      progression = 100;
    }

    // Conversion du statut vers les types autorisés
    let statutFinal: 'pending' | 'in_progress' | 'completed' | 'overdue';
    if (progression >= 100) {
      statutFinal = 'completed';
    } else if (daysOffset < -7) {
      statutFinal = 'overdue';
    } else if (progression > 0) {
      statutFinal = 'in_progress';
    } else {
      statutFinal = 'pending';
    }

    echeances.push({
      id: `${i}`,
      nom: `${typeConfig.name} ${i < 10 ? `0${i}` : i}/2024`,
      type: type,
      statut: statutFinal,
      urgence: urgences[Math.floor(Math.random() * urgences.length)],
      clientNom: clients[Math.floor(Math.random() * clients.length)],
      dateEcheance: dateEcheance.toISOString().split('T')[0],
      responsable: collaborateurs[Math.floor(Math.random() * collaborateurs.length)],
      progression: progression,
      description: `${typeConfig.name} - ${descriptions[Math.floor(Math.random() * descriptions.length)]}`
    });
  }

  // Trier par date d'échéance pour plus de réalisme
  return echeances.sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime());
};

// Données de démonstration avec 50 échéances réalistes
const demoEcheances: SimpleEcheance[] = generateTestEcheances();

export default function SuiviEcheancesSimple() {
  const { toast } = useToast();
  
  // États locaux
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCollaborateur, setSelectedCollaborateur] = useState('all');
  const [viewMode, setViewMode] = useState<'globale' | 'individuelle'>('globale');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'urgence' | 'progression' | 'client'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPage] = useState(12); // Affichage par pages pour une meilleure performance
  const [currentPage, setCurrentPage] = useState(1);
  
  // État pour les priorités des échéances
  const [echeancePriorities, setEcheancePriorities] = useState<Record<string, 'low' | 'medium' | 'high' | 'urgent'>>({});
  
  // État pour le mode édition des priorités
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

  // Fonction pour obtenir les statuts disponibles selon le type sélectionné
  const getAvailableStatuses = () => {
    if (selectedType === 'all') {
      return [
        { value: 'all', label: 'Tous' },
        { value: 'termine', label: 'Terminées' },
        { value: 'non_termine', label: 'Non-Terminées' }
      ];
    } else {
      const typeConfig = echeanceTypesConfig[selectedType as keyof typeof echeanceTypesConfig];
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

  // Fonction pour vérifier si une échéance est terminée
  const isEcheanceTerminee = (echeance: SimpleEcheance) => {
    return echeance.progression >= 100;
  };

  // Fonction pour réinitialiser le statut quand le type change
  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setSelectedStatus('all'); // Réinitialiser le statut
    setCurrentPage(1); // Retourner à la première page
  };

  // Réinitialiser la page lors des changements de filtres
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedCollaborateur, viewMode, showCompleted]);

  // Fonction de tri des échéances
  const sortEcheances = (echeances: SimpleEcheance[]) => {
    return [...echeances].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime();
          break;
        case 'urgence':
          const urgenceOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = urgenceOrder[b.urgence] - urgenceOrder[a.urgence];
          break;
        case 'progression':
          comparison = b.progression - a.progression;
          break;
        case 'client':
          comparison = a.clientNom.localeCompare(b.clientNom);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  // Filtrage et tri des échéances
  const filteredAndSortedEcheances = useMemo(() => {
    const filtered = demoEcheances.filter(echeance => {
      // Filtre par recherche
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchable = `${echeance.nom} ${echeance.clientNom} ${echeance.description || ''}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      // Filtre par type
      if (selectedType !== 'all' && echeance.type !== selectedType) return false;

      // Filtre par statut (logique différente selon le type)
      if (selectedStatus !== 'all') {
        if (selectedType === 'all') {
          // Statuts globaux
          if (selectedStatus === 'termine' && !isEcheanceTerminee(echeance)) return false;
          if (selectedStatus === 'non_termine' && isEcheanceTerminee(echeance)) return false;
        } else {
          // Statuts spécifiques (sous-tâches)
          if (echeance.statut !== selectedStatus) return false;
        }
      }

      // Filtre par collaborateur (uniquement en vue individuelle)
      if (viewMode === 'individuelle' && selectedCollaborateur !== 'all') {
        if (echeance.responsable !== selectedCollaborateur) return false;
      }

      // Masquer les terminées si nécessaire
      if (!showCompleted && isEcheanceTerminee(echeance)) return false;

      return true;
    });

    return sortEcheances(filtered);
  }, [demoEcheances, searchQuery, selectedType, selectedStatus, selectedCollaborateur, viewMode, showCompleted, sortBy, sortOrder]);

  // Pagination
  const paginatedEcheances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedEcheances.slice(startIndex, endIndex);
  }, [filteredAndSortedEcheances, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEcheances.length / itemsPerPage);

  // Statistiques adaptées selon la vue
  const stats = useMemo(() => {
    const total = filteredAndSortedEcheances.length;
    const completed = filteredAndSortedEcheances.filter(e => isEcheanceTerminee(e)).length;
    const inProgress = filteredAndSortedEcheances.filter(e => !isEcheanceTerminee(e) && getDaysUntilDeadline(e.dateEcheance) >= 0).length;
    const overdue = filteredAndSortedEcheances.filter(e => !isEcheanceTerminee(e) && getDaysUntilDeadline(e.dateEcheance) < 0).length;
    const urgent = filteredAndSortedEcheances.filter(e => e.urgence === 'urgent').length;

    // Stats par collaborateur pour vue individuelle
    const statsByCollaborateur = viewMode === 'individuelle' ? 
      collaborateurs.map(collab => ({
        nom: collab,
        total: demoEcheances.filter(e => e.responsable === collab).length,
        enCours: demoEcheances.filter(e => e.responsable === collab && !isEcheanceTerminee(e)).length
      })) : [];

    return { total, completed, inProgress, overdue, urgent, statsByCollaborateur };
  }, [filteredAndSortedEcheances, viewMode]);

  // Fonction pour obtenir la configuration d'une catégorie
  const getCategoryConfig = (type: string) => {
    return categoryConfigs.find(config => config.id === type) || categoryConfigs[0];
  };

  // Fonction pour obtenir les jours restants
  const getDaysUntilDeadline = (dateEcheance: string) => {
    const today = new Date();
    const deadline = new Date(dateEcheance);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Couleurs pour les statuts
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  // Couleurs pour les urgences
  const getUrgenceColor = (urgence: string) => {
    switch (urgence) {
      case 'urgent': return 'border-red-500 text-red-700';
      case 'high': return 'border-orange-500 text-orange-700';
      case 'medium': return 'border-yellow-500 text-yellow-700';
      default: return 'border-gray-500 text-gray-700';
    }
  };

  // Fonctions simplifiées pour les priorités (design minimaliste Web 3.0)
  const getPriorityDot = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    switch (priority) {
      case 'low': return 'bg-slate-400';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-amber-500';
      case 'urgent': return 'bg-red-500';
    }
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Normale';
      case 'high': return 'Élevée';
      case 'urgent': return 'Critique';
    }
  };

  const updateEcheancePriority = (echeanceId: string, echeanceName: string, newPriority: 'low' | 'medium' | 'high' | 'urgent') => {
    setEcheancePriorities(prev => ({
      ...prev,
      [echeanceId]: newPriority
    }));
    setEditingPriority(null);
    
    toast({
      title: "✨ Priorité mise à jour",
      description: `"${echeanceName}" → ${getPriorityLabel(newPriority)}`,
      duration: 2000,
    });
  };

  // Rendu d'une échéance
  const renderEcheance = (echeance: SimpleEcheance) => {
    const categoryConfig = getCategoryConfig(echeance.type);
    const daysUntil = getDaysUntilDeadline(echeance.dateEcheance);
    const isOverdue = daysUntil < 0;
    const isUrgent = daysUntil <= 3 && daysUntil >= 0;

    return (
      <div
        key={echeance.id}
        className={`
          rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200
          hover:shadow-md hover:border-gray-300 cursor-pointer
          ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
          ${isUrgent ? 'border-l-4 border-l-orange-500' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Icône de catégorie */}
            <div className={`
              p-2 rounded-lg bg-gradient-to-br ${categoryConfig.gradient}
              text-white flex-shrink-0
            `}>
              {categoryConfig.icon}
            </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{echeance.nom}</h3>
                <Badge variant="outline" className="text-xs">
                  {categoryConfig.name}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{echeance.clientNom}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}
                  </span>
                
                <span className={`flex items-center gap-1 font-medium ${
                  isOverdue ? 'text-red-600' :
                  isUrgent ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  <Clock className="w-3 h-3" />
                  {isOverdue ? `Retard ${Math.abs(daysUntil)}j` : `${daysUntil}j`}
                </span>
                
                {echeance.responsable && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {echeance.responsable}
                  </span>
                )}
              </div>

              {/* Barre de progression */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium">{echeance.progression}%</span>
                </div>
                <Progress value={echeance.progression} className="h-2" />
              </div>
            </div>
          </div>

                      {/* Actions et Statut - Design Web 3.0 */}
          <div className="flex items-center gap-3 flex-shrink-0 group">
            {/* Indicateur de priorité minimaliste */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(echeancePriorities[echeance.id] || echeance.urgence)}`}></div>
              
              {/* Bouton d'édition priorité (apparaît au hover) */}
              {editingPriority === echeance.id ? (
                <div className="flex items-center space-x-1 bg-white rounded-lg border shadow-sm p-1">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => updateEcheancePriority(echeance.id, echeance.nom, priority)}
                      className={`w-5 h-5 rounded-full ${getPriorityDot(priority)} hover:scale-110 transition-transform`}
                      title={getPriorityLabel(priority)}
                    />
                  ))}
                  <button
                    onClick={() => setEditingPriority(null)}
                    className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPriority(echeance.id)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-opacity"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Statut épuré */}
            {echeance.statut === 'completed' ? (
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
            ) : echeance.statut === 'overdue' ? (
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="w-3 h-3 text-red-600" />
              </div>
            ) : echeance.statut === 'in_progress' ? (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="w-3 h-3 text-blue-600" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border border-gray-200 bg-gray-50"></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" role="main" aria-label="Suivi des échéances comptables">
      {/* En-tête moderne avec navigation des vues */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Échéances</h1>
              <p className="text-gray-500">Suivi intelligent des deadlines</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {viewMode === 'globale' ? 'Vue Globale' : 'Vue Individuelle'}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Accessibility className="w-3 h-3" />
              Accessible
            </Badge>
          </div>
        </div>

        {/* Toggle Vue Globale / Individuelle */}
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

      {/* Barre d'outils */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une échéance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'échéance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                {Object.entries(echeanceTypesConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut/Étape" />
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Collaborateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {collaborateurs.map(collab => (
                    <SelectItem key={collab} value={collab}>{collab}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Contrôles de tri */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="urgence">Urgence</SelectItem>
                <SelectItem value="progression">Progression</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2"
            >
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Switch
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <span>Terminées</span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle échéance
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques selon la vue */}
      {viewMode === 'globale' ? (
        /* Vue Globale - Statistiques générales */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Terminées</p>
                  <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">En cours</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">En retard</p>
                  <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Urgentes</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.urgent}</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Vue Individuelle - Répartition par collaborateur */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Collaborateurs</p>
                    <p className="text-2xl font-bold text-purple-900">{collaborateurs.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Sélectionné</p>
                    <p className="text-2xl font-bold text-green-900">{stats.total}</p>
                  </div>
                  <User className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">En cours</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Urgences</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.urgent}</p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par collaborateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Répartition par Collaborateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.statsByCollaborateur.map(collab => (
                  <div 
                    key={collab.nom} 
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedCollaborateur === collab.nom 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCollaborateur(collab.nom)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{collab.nom}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{collab.enCours}/{collab.total}</div>
                        <div className="text-xs text-gray-500">en cours/total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contenu principal - Liste des échéances */}
      <div className="mt-6">
        {filteredAndSortedEcheances.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune échéance trouvée</h3>
              <p className="text-gray-500">
                {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune échéance correspondant aux filtres'}
              </p>
              {viewMode === 'individuelle' && selectedCollaborateur === 'all' && (
                <p className="text-gray-500 mt-2">
                  Sélectionnez un collaborateur pour voir ses échéances
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Titre de section avec compteur et info de pagination */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewMode === 'globale' 
                    ? `Toutes les échéances` 
                    : `Échéances${selectedCollaborateur !== 'all' ? ` de ${selectedCollaborateur}` : ''}`
                  }
                </h2>
                <Badge variant="secondary" className="gap-1">
                  {filteredAndSortedEcheances.length} résultat{filteredAndSortedEcheances.length > 1 ? 's' : ''}
                </Badge>
                {totalPages > 1 && (
                  <Badge variant="outline" className="gap-1">
                    Page {currentPage}/{totalPages}
                  </Badge>
                )}
              </div>
              
              {selectedType !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  <Filter className="w-3 h-3" />
                  {echeanceTypesConfig[selectedType as keyof typeof echeanceTypesConfig]?.name}
                </Badge>
              )}
            </div>

            {/* Grille d'échéances paginées */}
            <div className={`grid gap-4 ${
              viewMode === 'globale' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}>
              {paginatedEcheances.map(renderEcheance)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
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
                    const isActive = pageNum === currentPage;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
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
          </div>
        )}
      </div>
    </div>
  );
}
