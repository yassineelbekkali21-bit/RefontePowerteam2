/**
 * Composant moderne de suivi des échéances
 * Respecte les standards Web 3.0, accessibilité et UX/UI moderne
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  AreaChart, 
  Area 
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Filter,
  Users,
  Timer,
  Zap,
  Trophy,
  Star,
  Flame,
  Shield,
  DollarSign,
  Search,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Bell,
  Globe,
  Accessibility,
  Palette,
  Headphones,
  Menu,
  X,
  Plus,
  MoreHorizontal,
  Share2,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Briefcase,
  FileText,
  MessageSquare,
  UserPlus,
  Sparkles,
  Layers,
  Hash,
  Bookmark
} from 'lucide-react';

// Import des types modernes
import { 
  Echeance, 
  FiltresEcheances, 
  TypeEcheance, 
  StatutEcheance, 
  NiveauUrgence,
  AccessibilityConfig 
} from '@/types/echeances';
import { useEcheances } from '@/hooks/useEcheances';

// Configuration d'accessibilité par défaut
const defaultAccessibilityConfig: AccessibilityConfig = {
  announceChanges: true,
  highContrast: false,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  reducedMotion: false,
  fontSize: 'medium',
  customShortcuts: {
    'ctrl+f': 'Recherche rapide',
    'ctrl+n': 'Nouvelle échéance',
    'ctrl+r': 'Actualiser',
    'esc': 'Fermer modal'
  }
};

// Interface pour les préférences utilisateur
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  density: 'compact' | 'normal' | 'spacious';
  viewMode: 'kanban' | 'list' | 'calendar' | 'analytics';
  groupBy: 'none' | 'client' | 'type' | 'status' | 'urgency' | 'responsable';
  showCompletedTasks: boolean;
  enableNotifications: boolean;
  enableCollaboration: boolean;
  autoSave: boolean;
}

// Configuration des catégories modernisée
interface CategoryConfig {
  id: TypeEcheance;
  name: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  description: string;
}

const categoryConfigs: CategoryConfig[] = [
  {
    id: TypeEcheance.TVA,
    name: 'TVA',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Déclarations TVA périodiques'
  },
  {
    id: TypeEcheance.IPP,
    name: 'IPP',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    icon: <Shield className="w-5 h-5" />,
    description: 'Impôts des personnes physiques'
  },
  {
    id: TypeEcheance.ISOC,
    name: 'ISOC',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Impôts des sociétés'
  },
  {
    id: TypeEcheance.BILAN,
    name: 'BILAN',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Bilans comptables'
  },
  {
    id: TypeEcheance.DECLARATION_ANNUELLE,
    name: 'DECLARATION ANNUELLE',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    icon: <FileText className="w-5 h-5" />,
    description: 'Déclarations annuelles'
  },
  {
    id: TypeEcheance.CLOTURE,
    name: 'CLÔTURE',
    color: 'slate',
    gradient: 'from-slate-500 to-gray-600',
    icon: <Target className="w-5 h-5" />,
    description: 'Clôtures d\'exercice'
  }
];

// Animations configurables selon les préférences d'accessibilité
const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  slideIn: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Props du composant principal
interface SuiviEcheancesProps {
  initialFilters?: FiltresEcheances;
  userPreferences?: Partial<UserPreferences>;
  accessibilityConfig?: Partial<AccessibilityConfig>;
  onEcheanceSelect?: (echeance: Echeance) => void;
  onEcheanceCreate?: () => void;
  className?: string;
}

/**
 * Composant principal de suivi des échéances
 */
export default function SuiviEcheances({
  initialFilters = {},
  userPreferences = {},
  accessibilityConfig = {},
  onEcheanceSelect,
  onEcheanceCreate,
  className = ""
}: SuiviEcheancesProps) {
  // Configuration finale d'accessibilité
  const finalAccessibilityConfig = { ...defaultAccessibilityConfig, ...accessibilityConfig };
  const shouldReduceMotion = useReducedMotion();
  
  // États locaux
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    density: 'normal',
    viewMode: 'list',
    groupBy: 'type',
    showCompletedTasks: false,
    enableNotifications: true,
    enableCollaboration: false,
    autoSave: true,
    ...userPreferences
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEcheances, setSelectedEcheances] = useState<Set<string>>(new Set());

  // Hook pour la gestion des échéances
  const {
    echeancesList,
    stats,
    loading,
    error,
    loadEcheances,
    createEcheance,
    updateEcheance,
    deleteEcheance,
    applyFilters,
    clearFilters,
    announceToScreenReader
  } = useEcheances({
    autoLoad: true,
    enableRealtime: true,
    accessibility: finalAccessibilityConfig,
    onError: (error) => {
      console.error('Erreur échéances:', error);
    },
    onDeadlineApproaching: (echeance, daysRemaining) => {
      announceToScreenReader(`Attention: ${echeance.nom} arrive à échéance dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`);
    }
  });

  // Ref pour la gestion du focus
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrage et tri des échéances
  const filteredAndSortedEcheances = useMemo(() => {
    let filtered = echeancesList;

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(echeance => 
        echeance.nom.toLowerCase().includes(query) ||
        echeance.clientNom.toLowerCase().includes(query) ||
        echeance.description?.toLowerCase().includes(query)
      );
    }

    // Filtrage par date sélectionnée
    if (selectedDate) {
      filtered = filtered.filter(echeance => {
        const echeanceDate = new Date(echeance.dateEcheance);
        return echeanceDate.toDateString() === selectedDate.toDateString();
      });
    }

    // Masquer les tâches terminées si nécessaire
    if (!preferences.showCompletedTasks) {
      filtered = filtered.filter(echeance => echeance.statut !== StatutEcheance.COMPLETED);
    }

    // Tri par urgence et date d'échéance
    return filtered.sort((a, b) => {
      // D'abord par urgence
      const urgenceOrder = {
        [NiveauUrgence.CRITICAL]: 5,
        [NiveauUrgence.URGENT]: 4,
        [NiveauUrgence.HIGH]: 3,
        [NiveauUrgence.MEDIUM]: 2,
        [NiveauUrgence.LOW]: 1
      };
      
      const urgenceDiff = urgenceOrder[b.urgence] - urgenceOrder[a.urgence];
      if (urgenceDiff !== 0) return urgenceDiff;
      
      // Puis par date d'échéance
      return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime();
    });
  }, [echeancesList, searchQuery, selectedDate, preferences.showCompletedTasks]);

  // Groupement des échéances selon les préférences
  const groupedEcheances = useMemo(() => {
    if (preferences.groupBy === 'none') {
      return new Map([['Toutes', filteredAndSortedEcheances]]);
    }

    const groups = new Map<string, Echeance[]>();

    filteredAndSortedEcheances.forEach(echeance => {
      let groupKey = '';
      
      switch (preferences.groupBy) {
        case 'client':
          groupKey = echeance.clientNom;
          break;
        case 'type':
          groupKey = echeance.type;
          break;
        case 'status':
          groupKey = echeance.statut;
          break;
        case 'urgency':
          groupKey = echeance.urgence;
          break;
        case 'responsable':
          groupKey = echeance.responsablePrincipal || 'Non assigné';
          break;
        default:
          groupKey = 'Autres';
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(echeance);
    });

    return groups;
  }, [filteredAndSortedEcheances, preferences.groupBy]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const urgencyData = Object.values(NiveauUrgence).map(urgence => ({
      name: urgence,
      value: filteredAndSortedEcheances.filter(e => e.urgence === urgence).length,
      color: getUrgenceColor(urgence)
    }));

    const statusData = Object.values(StatutEcheance).map(statut => ({
      name: statut,
      value: filteredAndSortedEcheances.filter(e => e.statut === statut).length,
      color: getStatusColor(statut)
    }));

    const typeData = Object.values(TypeEcheance).map(type => ({
      name: type,
      value: filteredAndSortedEcheances.filter(e => e.type === type).length,
      color: getCategoryConfig(type)?.color || '#gray'
    }));

    return { urgencyData, statusData, typeData };
  }, [filteredAndSortedEcheances]);

  // Fonctions utilitaires
  const getUrgenceColor = useCallback((urgence: NiveauUrgence): string => {
    switch (urgence) {
      case NiveauUrgence.CRITICAL: return '#dc2626';
      case NiveauUrgence.URGENT: return '#ea580c';
      case NiveauUrgence.HIGH: return '#d97706';
      case NiveauUrgence.MEDIUM: return '#65a30d';
      case NiveauUrgence.LOW: return '#16a34a';
      default: return '#6b7280';
    }
  }, []);

  const getStatusColor = useCallback((statut: StatutEcheance): string => {
    switch (statut) {
      case StatutEcheance.COMPLETED: return '#16a34a';
      case StatutEcheance.IN_PROGRESS: return '#2563eb';
      case StatutEcheance.PENDING: return '#d97706';
      case StatutEcheance.OVERDUE: return '#dc2626';
      case StatutEcheance.CANCELLED: return '#6b7280';
      case StatutEcheance.UNDER_REVIEW: return '#7c3aed';
      default: return '#6b7280';
    }
  }, []);

  const getCategoryConfig = useCallback((type: TypeEcheance): CategoryConfig | undefined => {
    return categoryConfigs.find(config => config.id === type);
  }, []);

  const getDaysUntilDeadline = useCallback((dateEcheance: Date): number => {
    const today = new Date();
    const deadline = new Date(dateEcheance);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  const formatRelativeDate = useCallback((date: Date): string => {
    const days = getDaysUntilDeadline(date);
    
    if (days < 0) {
      return `Retard de ${Math.abs(days)} jour${Math.abs(days) > 1 ? 's' : ''}`;
    } else if (days === 0) {
      return "Aujourd'hui";
    } else if (days === 1) {
      return "Demain";
    } else if (days <= 7) {
      return `Dans ${days} jours`;
    } else {
      return format(date, 'dd MMM yyyy', { locale: fr });
    }
  }, [getDaysUntilDeadline]);

  // Gestionnaires d'événements
  const handleEcheanceClick = useCallback((echeance: Echeance) => {
    onEcheanceSelect?.(echeance);
    announceToScreenReader(`Échéance sélectionnée: ${echeance.nom}`);
  }, [onEcheanceSelect, announceToScreenReader]);

  const handleCreateNew = useCallback(() => {
    onEcheanceCreate?.();
    announceToScreenReader('Ouverture du formulaire de création d\'échéance');
  }, [onEcheanceCreate, announceToScreenReader]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      announceToScreenReader(`Recherche pour "${query}". ${filteredAndSortedEcheances.length} résultat${filteredAndSortedEcheances.length > 1 ? 's' : ''} trouvé${filteredAndSortedEcheances.length > 1 ? 's' : ''}`);
    }
  }, [filteredAndSortedEcheances.length, announceToScreenReader]);

  const handleRefresh = useCallback(async () => {
    await loadEcheances();
    announceToScreenReader('Données actualisées');
  }, [loadEcheances, announceToScreenReader]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    announceToScreenReader(isFullscreen ? 'Mode plein écran désactivé' : 'Mode plein écran activé');
  }, [isFullscreen, announceToScreenReader]);

  // Raccourcis clavier
  useEffect(() => {
    if (!finalAccessibilityConfig.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+F pour la recherche
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl+N pour créer une nouvelle échéance
      if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        handleCreateNew();
      }
      
      // Ctrl+R pour actualiser
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        handleRefresh();
      }
      
      // Escape pour fermer les modals
      if (event.key === 'Escape') {
        setShowSettings(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [finalAccessibilityConfig.keyboardNavigation, handleCreateNew, handleRefresh]);

  // Rendu de la barre d'outils moderne
  const renderToolbar = () => (
    <motion.div 
      {...(shouldReduceMotion ? {} : animations.slideIn)}
      className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 mb-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Section gauche - Recherche et filtres */}
          <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              placeholder="Rechercher une échéance..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
              aria-label="Rechercher dans les échéances"
            />
            </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          <Select 
            value={preferences.groupBy} 
            onValueChange={(value) => setPreferences(prev => ({ ...prev, groupBy: value as any }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Grouper par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="status">Statut</SelectItem>
              <SelectItem value="urgency">Urgence</SelectItem>
              <SelectItem value="responsable">Responsable</SelectItem>
            </SelectContent>
          </Select>
            </div>

        {/* Section droite - Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Switch
              checked={preferences.showCompletedTasks}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, showCompletedTasks: checked }))
              }
              aria-label="Afficher les tâches terminées"
            />
            <span>Terminées</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4" />
          </Button>

          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle échéance
          </Button>
          </div>
        </div>
    </motion.div>
  );

  // Rendu des statistiques en temps réel
  const renderStats = () => (
    <motion.div 
      {...(shouldReduceMotion ? {} : animations.fadeIn)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
              </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Terminées</p>
              <p className="text-2xl font-bold text-green-900">{stats.completees}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">En retard</p>
              <p className="text-2xl font-bold text-orange-900">{stats.enRetard}</p>
              </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Urgentes</p>
              <p className="text-2xl font-bold text-red-900">{stats.urgentes}</p>
                </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <Flame className="w-5 h-5 text-red-600" />
              </div>
                </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Rendu d'une échéance individuelle
  const renderEcheance = (echeance: Echeance) => {
    const categoryConfig = getCategoryConfig(echeance.type);
    const daysUntil = getDaysUntilDeadline(echeance.dateEcheance);
    const isOverdue = daysUntil < 0;
    const isUrgent = daysUntil <= 3 && daysUntil >= 0;

    return (
      <motion.div
        key={echeance.id}
        {...(shouldReduceMotion ? {} : animations.scaleIn)}
        className={`
          group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm 
          transition-all duration-300 hover:shadow-md hover:border-gray-300
          ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
          ${isUrgent ? 'border-l-4 border-l-orange-500' : ''}
        `}
        onClick={() => handleEcheanceClick(echeance)}
        tabIndex={0}
        role="button"
        aria-label={`Échéance ${echeance.nom} pour ${echeance.clientNom}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEcheanceClick(echeance);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Icône de catégorie */}
            <div className={`
              p-2 rounded-lg bg-gradient-to-br ${categoryConfig?.gradient || 'from-gray-400 to-gray-500'}
              text-white flex-shrink-0
            `}>
              {categoryConfig?.icon || <FileText className="w-4 h-4" />}
              </div>

            {/* Informations principales */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{echeance.nom}</h3>
                <Badge variant="outline" className="text-xs">
                  {categoryConfig?.name || echeance.type}
                </Badge>
                </div>
              
              <p className="text-sm text-gray-600 mb-2">{echeance.clientNom}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatRelativeDate(echeance.dateEcheance)}
                </span>
                
                {echeance.responsablePrincipal && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {echeance.responsablePrincipal}
                  </span>
                )}
            </div>

              {/* Barre de progression */}
              {echeance.progression !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium">{echeance.progression}%</span>
                    </div>
                  <Progress value={echeance.progression} className="h-2" />
                      </div>
              )}
                    </div>
                  </div>

          {/* Badges de statut et urgence */}
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            <Badge 
              variant={echeance.statut === StatutEcheance.COMPLETED ? 'default' : 'secondary'}
              className={`text-xs ${
                echeance.statut === StatutEcheance.COMPLETED ? 'bg-green-100 text-green-800' :
                echeance.statut === StatutEcheance.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                echeance.statut === StatutEcheance.OVERDUE ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {echeance.statut}
            </Badge>
            
            {echeance.urgence !== NiveauUrgence.LOW && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  echeance.urgence === NiveauUrgence.CRITICAL ? 'border-red-500 text-red-700' :
                  echeance.urgence === NiveauUrgence.URGENT ? 'border-orange-500 text-orange-700' :
                  echeance.urgence === NiveauUrgence.HIGH ? 'border-amber-500 text-amber-700' :
                  'border-gray-500 text-gray-700'
                }`}
              >
                {echeance.urgence}
              </Badge>
                )}
              </div>
            </div>
      </motion.div>
    );
  };

  // Rendu du contenu principal selon le mode de vue
  const renderContent = () => {
    if (loading && echeancesList.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des échéances...</p>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (filteredAndSortedEcheances.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune échéance trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Aucune échéance correspondant aux filtres'}
            </p>
            {(searchQuery || selectedDate) && (
              <Button onClick={() => { setSearchQuery(''); setSelectedDate(undefined); }} variant="outline">
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    // Rendu en mode liste groupée
    return (
      <div className="space-y-6">
        {Array.from(groupedEcheances.entries()).map(([groupName, echeances]) => (
          <motion.div key={groupName} {...(shouldReduceMotion ? {} : animations.fadeIn)}>
      <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {preferences.groupBy === 'type' && getCategoryConfig(groupName as TypeEcheance)?.icon}
                    {groupName}
                  </span>
                  <Badge variant="outline">{echeances.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {echeances.map(renderEcheance)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
            </div>
    );
  };

  // Rendu principal
  return (
    <div 
      ref={containerRef}
      className={`
        ${className} 
        ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''} 
        ${preferences.density === 'compact' ? 'space-y-4' : preferences.density === 'spacious' ? 'space-y-8' : 'space-y-6'}
      `}
      role="main"
      aria-label="Suivi des échéances comptables"
    >
      {/* En-tête moderne avec gradient */}
      <motion.div 
        {...(shouldReduceMotion ? {} : animations.fadeIn)}
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
              <div>
              <h1 className="text-2xl font-bold text-gray-900">Suivi des Échéances</h1>
              <p className="text-gray-600">Gestion intelligente et moderne des deadlines comptables</p>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Web 3.0 Ready
            </Badge>
            {finalAccessibilityConfig.announceChanges && (
              <Badge variant="outline" className="gap-1">
                <Accessibility className="w-3 h-3" />
                Accessible
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Barre d'outils */}
      {renderToolbar()}

      {/* Statistiques */}
      {renderStats()}

      {/* Contenu principal avec onglets pour différentes vues */}
      <Tabs value={preferences.viewMode} onValueChange={(value) => setPreferences(prev => ({ ...prev, viewMode: value as any }))}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list" className="gap-2">
            <List className="w-4 h-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Grid3X3 className="w-4 h-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="w-4 h-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Grid3X3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Vue Kanban</h3>
              <p className="text-gray-500">Bientôt disponible...</p>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Vue Calendrier</h3>
              <p className="text-gray-500">Bientôt disponible...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                Répartition par Urgence
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.urgencyData}
                      cx="50%"
                      cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                      dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartData.urgencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Répartition par Type
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.typeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>

      {/* Zone pour annonces d'accessibilité */}
      <div aria-live="polite" aria-atomic="true" className="sr-only"></div>
    </div>
  );
}
