/**
 * Composant moderne de suivi des échéances pour la production
 * Version spécialisée avec focus sur les flux de production
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  RefreshCw,
  Bell,
  Activity,
  Briefcase,
  FileText, 
  MessageSquare,
  UserPlus,
  Sparkles,
  Factory,
  Layers,
  BarChart3,
  PieChart,
  Plus,
  Eye,
  ChevronDown, 
  ChevronUp,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  Download,
  Upload
} from 'lucide-react';

// Import des types modernes
import { 
  Echeance, 
  TypeEcheance, 
  StatutEcheance, 
  NiveauUrgence,
  AccessibilityConfig,
  EtapeEcheance
} from '@/types/echeances';
import { EcheanceFiscale, Collaborateur } from '@/types/production';
import { useEcheances } from '@/hooks/useEcheances';

// Interface pour les props du composant
interface SuiviEcheancesProps {
  echeances?: EcheanceFiscale[];
  collaborateurs?: Collaborateur[];
  periode?: { debut: string; fin: string };
  mode?: 'production' | 'supervision' | 'quality';
  onEcheanceUpdate?: (echeanceId: string, updates: Partial<Echeance>) => void;
  onWorkflowAction?: (action: 'start' | 'pause' | 'complete' | 'assign', echeanceId: string, data?: any) => void;
}

// Configuration spécialisée pour la production
const productionAccessibilityConfig: AccessibilityConfig = {
  announceChanges: true,
  highContrast: false,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  reducedMotion: false,
  fontSize: 'medium',
  customShortcuts: {
    'ctrl+space': 'Démarrer/Pause tâche sélectionnée',
    'ctrl+enter': 'Marquer comme terminé',
    'ctrl+a': 'Assigner tâche',
    'ctrl+q': 'Mode qualité'
  }
};

// Couleurs pour les statuts de production
const statusColors = {
  [StatutEcheance.PENDING]: 'bg-amber-100 text-amber-800 border-amber-200',
  [StatutEcheance.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [StatutEcheance.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [StatutEcheance.OVERDUE]: 'bg-red-100 text-red-800 border-red-200',
  [StatutEcheance.UNDER_REVIEW]: 'bg-purple-100 text-purple-800 border-purple-200',
  [StatutEcheance.CANCELLED]: 'bg-gray-100 text-gray-800 border-gray-200'
};

// Animations optimisées pour l'environnement de production
const productionAnimations = {
  workflowTransition: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  statusUpdate: {
    initial: { x: -10, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

/**
 * Composant principal pour le suivi des échéances en production
 */
export default function SuiviEcheances({
  echeances = [],
  collaborateurs = [],
  periode = { debut: '', fin: '' },
  mode = 'production',
  onEcheanceUpdate,
  onWorkflowAction
}: SuiviEcheancesProps) {
  const shouldReduceMotion = useReducedMotion();

  // États locaux pour la production
  const [selectedCollaborateur, setSelectedCollaborateur] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'workflow' | 'timeline' | 'dashboard'>('workflow');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTaskTime, setCurrentTaskTime] = useState(0);

  // Hook pour la gestion des échéances avec configuration de production
  const {
    echeancesList,
    stats,
    loading,
    error,
    loadEcheances,
    updateEcheance,
    announceToScreenReader
  } = useEcheances({
    autoLoad: true,
    enableRealtime: true,
    accessibility: productionAccessibilityConfig,
    onError: (error) => {
      console.error('Erreur production échéances:', error);
    }
  });

  // Conversion et filtrage des données pour l'environnement de production
  const productionEcheances = useMemo(() => {
    // Combine les échéances modernes avec les données legacy si nécessaire
    const combined = echeancesList.length > 0 ? echeancesList : [];
    
    return combined.filter(echeance => {
      // Filtres spécifiques à la production
      if (filterStatus === 'active') {
        return echeance.statut !== StatutEcheance.COMPLETED && echeance.statut !== StatutEcheance.CANCELLED;
      }
      if (filterStatus === 'completed') {
        return echeance.statut === StatutEcheance.COMPLETED;
      }
      if (filterStatus === 'overdue') {
        return echeance.statut === StatutEcheance.OVERDUE;
      }
      
      // Filtre par collaborateur
      if (selectedCollaborateur !== 'all') {
        return echeance.responsablePrincipal === selectedCollaborateur ||
               echeance.equipe?.includes(selectedCollaborateur);
      }
      
      return true;
    });
  }, [echeancesList, filterStatus, selectedCollaborateur]);

  // Calculs spécifiques à la production
  const productionStats = useMemo(() => {
    const totalTasks = productionEcheances.length;
    const activeTasks = productionEcheances.filter(e => e.statut === StatutEcheance.IN_PROGRESS).length;
    const completedToday = productionEcheances.filter(e => {
      const today = new Date().toDateString();
      return e.statut === StatutEcheance.COMPLETED && 
             e.dateFinReelle && 
             new Date(e.dateFinReelle).toDateString() === today;
    }).length;
    
    const efficiency = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;
    const avgTimePerTask = productionEcheances.reduce((acc, e) => {
      return acc + (e.tempsRealise || 0);
    }, 0) / totalTasks || 0;

    return {
      totalTasks,
      activeTasks,
      completedToday,
      efficiency: Math.round(efficiency),
      avgTimePerTask: Math.round(avgTimePerTask * 10) / 10,
      workload: Math.round((activeTasks / totalTasks) * 100) || 0
    };
  }, [productionEcheances]);

  // Gestionnaires pour les actions de workflow
  const handleWorkflowAction = useCallback(async (action: string, echeanceId: string, data?: any) => {
    try {
      let updates: Partial<Echeance> = {};
      
      switch (action) {
        case 'start':
          updates = { 
            statut: StatutEcheance.IN_PROGRESS,
            dateDebutPrevue: new Date()
          };
          setSelectedTask(echeanceId);
          setIsTimerRunning(true);
          announceToScreenReader('Tâche démarrée');
          break;
          
        case 'pause':
          updates = { statut: StatutEcheance.PENDING };
          setIsTimerRunning(false);
          announceToScreenReader('Tâche mise en pause');
          break;
          
        case 'complete':
          updates = { 
            statut: StatutEcheance.COMPLETED,
            progression: 100,
            dateFinReelle: new Date()
          };
          setSelectedTask(null);
          setIsTimerRunning(false);
          announceToScreenReader('Tâche terminée');
          break;
          
        case 'assign':
          updates = { 
            responsablePrincipal: data?.collaborateur,
            statut: StatutEcheance.PENDING
          };
          announceToScreenReader(`Tâche assignée à ${data?.collaborateur}`);
          break;
      }

      await updateEcheance(echeanceId, updates);
      onWorkflowAction?.(action as any, echeanceId, data);
      onEcheanceUpdate?.(echeanceId, updates);
      
    } catch (error) {
      console.error('Erreur action workflow:', error);
    }
  }, [updateEcheance, onWorkflowAction, onEcheanceUpdate, announceToScreenReader]);

  // Calcul du temps jusqu'à l'échéance
  const getTimeUntilDeadline = useCallback((dateEcheance: Date): { days: number; hours: number; status: 'safe' | 'warning' | 'critical' } => {
    const now = new Date();
    const deadline = new Date(dateEcheance);
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (diffDays < 0) status = 'critical';
    else if (diffDays <= 1) status = 'critical';
    else if (diffDays <= 3) status = 'warning';
    
    return { days: Math.max(0, diffDays), hours: Math.max(0, diffHours), status };
  }, []);

  // Rendu des statistiques de production
  const renderProductionStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-blue-700">Tâches Actives</p>
              <p className="text-2xl font-bold text-blue-900">{productionStats.activeTasks}</p>
              </div>
            <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-green-700">Terminées Aujourd'hui</p>
              <p className="text-2xl font-bold text-green-900">{productionStats.completedToday}</p>
              </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-purple-700">Efficacité</p>
              <p className="text-2xl font-bold text-purple-900">{productionStats.efficiency}%</p>
              </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
              <p className="text-sm font-medium text-amber-700">Temps Moyen</p>
              <p className="text-2xl font-bold text-amber-900">{productionStats.avgTimePerTask}h</p>
              </div>
            <Timer className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-700">Charge</p>
              <p className="text-2xl font-bold text-rose-900">{productionStats.workload}%</p>
            </div>
            <Factory className="w-8 h-8 text-rose-500" />
          </div>
        </CardContent>
      </Card>
              </div>
  );

  // Rendu d'une carte d'échéance en mode production
  const renderProductionTask = (echeance: Echeance) => {
    const timeInfo = getTimeUntilDeadline(echeance.dateEcheance);
    const isSelected = selectedTask === echeance.id;
    const canStart = echeance.statut === StatutEcheance.PENDING;
    const canPause = echeance.statut === StatutEcheance.IN_PROGRESS;
    const canComplete = echeance.statut === StatutEcheance.IN_PROGRESS && echeance.progression >= 90;

    return (
      <motion.div
        key={echeance.id}
        {...(shouldReduceMotion ? {} : productionAnimations.workflowTransition)}
        className={`
          rounded-lg border bg-white p-4 shadow-sm transition-all duration-300
          ${isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200'}
          ${timeInfo.status === 'critical' ? 'border-l-4 border-l-red-500' : ''}
          ${timeInfo.status === 'warning' ? 'border-l-4 border-l-orange-500' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{echeance.nom}</h3>
              <Badge className={statusColors[echeance.statut]} variant="outline">
                {echeance.statut}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{echeance.clientNom}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(echeance.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
              </span>
              
              <span className={`flex items-center gap-1 font-medium ${
                timeInfo.status === 'critical' ? 'text-red-600' :
                timeInfo.status === 'warning' ? 'text-orange-600' :
                'text-green-600'
              }`}>
                <Clock className="w-3 h-3" />
                {timeInfo.days}j {timeInfo.hours}h
              </span>
              
              {echeance.responsablePrincipal && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {echeance.responsablePrincipal}
                </span>
              )}
                            </div>
                          </div>

          {/* Actions de workflow */}
          <div className="flex items-center gap-1">
            {canStart && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleWorkflowAction('start', echeance.id)}
                className="h-8 w-8 p-0"
                title="Démarrer la tâche"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            
            {canPause && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleWorkflowAction('pause', echeance.id)}
                className="h-8 w-8 p-0"
                title="Mettre en pause"
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}
            
            {canComplete && (
              <Button
                size="sm"
                variant="default"
                onClick={() => handleWorkflowAction('complete', echeance.id)}
                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                title="Marquer comme terminé"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Plus d'actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
                            </div>
                          </div>

        {/* Barre de progression */}
        {echeance.progression !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progression</span>
              <span className="font-medium">{echeance.progression}%</span>
                        </div>
            <Progress 
              value={echeance.progression} 
              className="h-2"
              aria-label={`Progression: ${echeance.progression}%`}
            />
                          </div>
        )}

        {/* Étapes si disponibles */}
        {echeance.etapes && echeance.etapes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Étapes:</p>
            <div className="flex gap-1">
              {echeance.etapes.slice(0, 4).map((etape, index) => (
                <div
                  key={etape.id}
                  className={`h-2 flex-1 rounded ${
                    etape.statut === StatutEcheance.COMPLETED ? 'bg-green-400' :
                    etape.statut === StatutEcheance.IN_PROGRESS ? 'bg-blue-400' :
                    'bg-gray-200'
                  }`}
                  title={etape.nom}
                />
              ))}
              {echeance.etapes.length > 4 && (
                <span className="text-xs text-gray-500">+{echeance.etapes.length - 4}</span>
              )}
                        </div>
                      </div>
        )}
      </motion.div>
    );
  };

  // Rendu de la barre d'outils de production
  const renderProductionToolbar = () => (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={selectedCollaborateur} onValueChange={setSelectedCollaborateur}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les collaborateurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les collaborateurs</SelectItem>
              {collaborateurs.map(collab => (
                <SelectItem key={collab.id} value={collab.nom}>
                  {collab.nom} - {collab.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actives</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
              <SelectItem value="all">Toutes</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          <Badge variant="outline" className="gap-1">
            <Factory className="w-3 h-3" />
            Mode {mode}
                                    </Badge>
                                  </div>
                                  
        <div className="flex items-center gap-2">
          {isTimerRunning && selectedTask && (
            <Badge className="bg-green-100 text-green-800 gap-1 animate-pulse">
              <Timer className="w-3 h-3" />
              En cours...
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={() => loadEcheances()}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle tâche
          </Button>
                                </div>
                              </div>
                            </div>
                          );
                
                return (
    <div className="space-y-6" role="main" aria-label="Suivi des échéances en production">
      {/* En-tête spécialisé production */}
      <motion.div 
        {...(shouldReduceMotion ? {} : productionAnimations.workflowTransition)}
        className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-indigo-200/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <Factory className="w-6 h-6 text-white" />
                        </div>
                        <div>
              <h1 className="text-2xl font-bold text-gray-900">Production - Suivi des Échéances</h1>
              <p className="text-gray-600">Gestion optimisée des flux de production comptable</p>
                        </div>
                    </div>
                    
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Temps réel
                              </Badge>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Optimisé
                              </Badge>
                            </div>
                          </div>
      </motion.div>

      {/* Barre d'outils */}
      {renderProductionToolbar()}

      {/* Statistiques de production */}
      {renderProductionStats()}

      {/* Contenu principal avec onglets spécialisés */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow" className="gap-2">
            <Activity className="w-4 h-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="mt-6">
          <div className="space-y-4">
            {loading && productionEcheances.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des tâches de production...</p>
                </CardContent>
              </Card>
            ) : productionEcheances.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune tâche en production</h3>
                  <p className="text-gray-500">Toutes les tâches sont terminées ou il n'y a pas de tâches assignées.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productionEcheances.map(renderProductionTask)}
                    </div>
            )}
                  </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Vue Timeline</h3>
              <p className="text-gray-500">Bientôt disponible - Visualisation chronologique des tâches</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Dashboard Analytics</h3>
              <p className="text-gray-500">Bientôt disponible - Métriques avancées de production</p>
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>

      {/* Zone pour annonces d'accessibilité */}
      <div aria-live="polite" aria-atomic="true" className="sr-only"></div>
    </div>
  );
}