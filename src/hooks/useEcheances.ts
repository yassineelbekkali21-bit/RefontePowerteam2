/**
 * Hook React moderne pour la gestion des échéances
 * Optimisé pour la performance et l'accessibilité
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Echeance, 
  EcheanceCreation, 
  EcheanceMiseAJour,
  FiltresEcheances,
  VueEcheances,
  EcheancesState,
  EcheancesAction,
  EcheanceEvent,
  StatutEcheance,
  NiveauUrgence,
  TypeEcheance,
  AnalyticsEcheances,
  AccessibilityConfig
} from '@/types/echeances';
import { EcheancesService, EcheancesServiceFactory } from '@/services/echeancesService';
import { useToast } from '@/components/ui/use-toast';

// Reducer pour la gestion de l'état
function echeancesReducer(state: EcheancesState, action: EcheancesAction): EcheancesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_ECHEANCES':
      const echeancesMap = new Map<string, Echeance>();
      action.payload.forEach(echeance => echeancesMap.set(echeance.id, echeance));
      return { 
        ...state, 
        echeances: echeancesMap, 
        loading: false, 
        error: null,
        derniereSync: new Date()
      };
    
    case 'ADD_ECHEANCE':
      const newEcheances = new Map(state.echeances);
      newEcheances.set(action.payload.id, action.payload);
      return { ...state, echeances: newEcheances };
    
    case 'UPDATE_ECHEANCE':
      const updatedEcheances = new Map(state.echeances);
      const existing = updatedEcheances.get(action.payload.id);
      if (existing) {
        updatedEcheances.set(action.payload.id, { ...existing, ...action.payload.changes });
      }
      return { ...state, echeances: updatedEcheances };
    
    case 'DELETE_ECHEANCE':
      const filteredEcheances = new Map(state.echeances);
      filteredEcheances.delete(action.payload);
      return { ...state, echeances: filteredEcheances };
    
    case 'SET_FILTRES':
      return { ...state, filtres: action.payload };
    
    case 'SET_VUE_ACTIVE':
      return { ...state, vueActive: action.payload };
    
    case 'SYNC_SUCCESS':
      return { ...state, derniereSync: action.payload };
    
    case 'ENABLE_COLLABORATION':
      return { 
        ...state, 
        modeCollaboration: true, 
        sessionCollaboration: action.payload 
      };
    
    case 'DISABLE_COLLABORATION':
      return { 
        ...state, 
        modeCollaboration: false, 
        sessionCollaboration: undefined 
      };
    
    default:
      return state;
  }
}

// État initial
const initialState: EcheancesState = {
  echeances: new Map(),
  filtres: {},
  vueActive: null,
  loading: false,
  error: null,
  derniereSync: null,
  modeCollaboration: false
};

// Options du hook
interface UseEcheancesOptions {
  autoLoad?: boolean;
  enableRealtime?: boolean;
  enableCollaboration?: boolean;
  refreshInterval?: number; // en millisecondes
  accessibility?: AccessibilityConfig;
  onError?: (error: Error) => void;
  onDeadlineApproaching?: (echeance: Echeance, daysRemaining: number) => void;
  onOverdue?: (echeance: Echeance, daysOverdue: number) => void;
}

/**
 * Hook principal pour la gestion des échéances
 */
export function useEcheances(options: UseEcheancesOptions = {}) {
  const {
    autoLoad = true,
    enableRealtime = true,
    enableCollaboration = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes par défaut
    accessibility,
    onError,
    onDeadlineApproaching,
    onOverdue
  } = options;

  const [state, dispatch] = useState<EcheancesState>(initialState);
  const serviceRef = useRef<EcheancesService>();
  const { toast } = useToast();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initialisation du service
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = EcheancesServiceFactory.createDevelopmentService();
      
      // S'abonner aux événements temps réel
      if (enableRealtime) {
        const unsubscribe = serviceRef.current.subscribe(handleRealtimeEvent);
        unsubscribeRef.current = unsubscribe;
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      serviceRef.current?.cleanup();
    };
  }, [enableRealtime]);

  // Gestionnaire d'événements temps réel
  const handleRealtimeEvent = useCallback((event: EcheanceEvent) => {
    switch (event.type) {
      case 'created':
        dispatch({ type: 'ADD_ECHEANCE', payload: event.echeance });
        toast({
          title: "📅 Nouvelle échéance",
          description: `${event.echeance.nom} a été créée`,
        });
        break;
      
      case 'updated':
        dispatch({ type: 'UPDATE_ECHEANCE', payload: { id: event.echeanceId, changes: event.changes } });
        break;
      
      case 'deleted':
        dispatch({ type: 'DELETE_ECHEANCE', payload: event.echeanceId });
        toast({
          title: "🗑️ Échéance supprimée",
          description: "Une échéance a été supprimée",
        });
        break;
      
      case 'deadline_approaching':
        onDeadlineApproaching?.(
          state.echeances.get(event.echeanceId)!,
          event.daysRemaining
        );
        toast({
          title: "⏰ Échéance proche",
          description: `Une échéance arrive dans ${event.daysRemaining} jour${event.daysRemaining > 1 ? 's' : ''}`,
          variant: "destructive"
        });
        break;
      
      case 'overdue':
        onOverdue?.(
          state.echeances.get(event.echeanceId)!,
          event.daysOverdue
        );
        toast({
          title: "🚨 Échéance dépassée",
          description: `Une échéance est en retard de ${event.daysOverdue} jour${event.daysOverdue > 1 ? 's' : ''}`,
          variant: "destructive"
        });
        break;
    }
  }, [state.echeances, toast, onDeadlineApproaching, onOverdue]);

  // Chargement automatique des données
  useEffect(() => {
    if (autoLoad && serviceRef.current) {
      loadEcheances();
    }
  }, [autoLoad]);

  // Rafraîchissement périodique
  useEffect(() => {
    if (refreshInterval > 0 && !enableRealtime) {
      const interval = setInterval(() => {
        loadEcheances(state.filtres);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, enableRealtime, state.filtres]);

  /**
   * Charge les échéances
   */
  const loadEcheances = useCallback(async (filtres?: FiltresEcheances) => {
    if (!serviceRef.current) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const echeances = await serviceRef.current.getEcheances(filtres);
      dispatch({ type: 'SET_ECHEANCES', payload: echeances });
      
      if (accessibility?.announceChanges) {
        // Annoncer le changement pour les lecteurs d'écran
        const announcement = `${echeances.length} échéance${echeances.length > 1 ? 's' : ''} chargée${echeances.length > 1 ? 's' : ''}`;
        announceToScreenReader(announcement);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      onError?.(error as Error);
      
      toast({
        title: "❌ Erreur de chargement",
        description: "Impossible de charger les échéances",
        variant: "destructive"
      });
    }
  }, [accessibility, onError, toast]);

  /**
   * Crée une nouvelle échéance
   */
  const createEcheance = useCallback(async (echeanceData: EcheanceCreation) => {
    if (!serviceRef.current) return;

    try {
      const newEcheance = await serviceRef.current.createEcheance(echeanceData);
      dispatch({ type: 'ADD_ECHEANCE', payload: newEcheance });
      
      toast({
        title: "✅ Échéance créée",
        description: `${newEcheance.nom} a été créée avec succès`,
      });

      return newEcheance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création';
      onError?.(error as Error);
      
      toast({
        title: "❌ Erreur de création",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  }, [onError, toast]);

  /**
   * Met à jour une échéance
   */
  const updateEcheance = useCallback(async (id: string, updates: EcheanceMiseAJour) => {
    if (!serviceRef.current) return;

    try {
      const updatedEcheance = await serviceRef.current.updateEcheance(id, updates);
      dispatch({ type: 'UPDATE_ECHEANCE', payload: { id, changes: updates } });
      
      toast({
        title: "✅ Échéance mise à jour",
        description: "Les modifications ont été sauvegardées",
      });

      return updatedEcheance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      onError?.(error as Error);
      
      toast({
        title: "❌ Erreur de mise à jour",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  }, [onError, toast]);

  /**
   * Supprime une échéance
   */
  const deleteEcheance = useCallback(async (id: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.deleteEcheance(id);
      dispatch({ type: 'DELETE_ECHEANCE', payload: id });
      
      toast({
        title: "✅ Échéance supprimée",
        description: "L'échéance a été supprimée avec succès",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      onError?.(error as Error);
      
      toast({
        title: "❌ Erreur de suppression",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw error;
    }
  }, [onError, toast]);

  /**
   * Applique des filtres
   */
  const applyFilters = useCallback((filtres: FiltresEcheances) => {
    dispatch({ type: 'SET_FILTRES', payload: filtres });
    loadEcheances(filtres);
  }, [loadEcheances]);

  /**
   * Réinitialise les filtres
   */
  const clearFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTRES', payload: {} });
    loadEcheances({});
  }, [loadEcheances]);

  /**
   * Change la vue active
   */
  const setVueActive = useCallback((vue: VueEcheances | null) => {
    dispatch({ type: 'SET_VUE_ACTIVE', payload: vue });
    if (vue) {
      loadEcheances(vue.filtres);
    }
  }, [loadEcheances]);

  /**
   * Démarre la collaboration
   */
  const startCollaboration = useCallback(async (echeanceId: string) => {
    if (!serviceRef.current || !enableCollaboration) return;

    try {
      const session = await serviceRef.current.startCollaboration(echeanceId);
      dispatch({ type: 'ENABLE_COLLABORATION', payload: session });
      
      toast({
        title: "🤝 Collaboration activée",
        description: "La collaboration en temps réel est maintenant active",
      });

      return session;
    } catch (error) {
      onError?.(error as Error);
      toast({
        title: "❌ Erreur de collaboration",
        description: "Impossible d'activer la collaboration",
        variant: "destructive"
      });
    }
  }, [enableCollaboration, onError, toast]);

  /**
   * Arrête la collaboration
   */
  const stopCollaboration = useCallback(async (echeanceId: string) => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.stopCollaboration(echeanceId);
      dispatch({ type: 'DISABLE_COLLABORATION' });
      
      toast({
        title: "🚪 Collaboration arrêtée",
        description: "La collaboration a été désactivée",
      });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError, toast]);

  // Calculs dérivés memoïsés pour la performance
  const computedValues = useMemo(() => {
    const echeancesList = Array.from(state.echeances.values());
    const now = new Date();

    // Statistiques générales
    const stats = {
      total: echeancesList.length,
      completees: echeancesList.filter(e => e.statut === StatutEcheance.COMPLETED).length,
      enCours: echeancesList.filter(e => e.statut === StatutEcheance.IN_PROGRESS).length,
      enRetard: echeancesList.filter(e => e.dateEcheance < now && e.statut !== StatutEcheance.COMPLETED).length,
      urgentes: echeancesList.filter(e => e.urgence === NiveauUrgence.URGENT || e.urgence === NiveauUrgence.CRITICAL).length,
    };

    // Répartition par type
    const repartitionParType = Object.values(TypeEcheance).map(type => ({
      type,
      count: echeancesList.filter(e => e.type === type).length
    }));

    // Répartition par statut
    const repartitionParStatut = Object.values(StatutEcheance).map(statut => ({
      statut,
      count: echeancesList.filter(e => e.statut === statut).length
    }));

    // Échéances prioritaires (prochaines 7 jours)
    const prochaineSemaine = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const echeancesPrioritaires = echeancesList
      .filter(e => e.dateEcheance >= now && e.dateEcheance <= prochaineSemaine)
      .sort((a, b) => a.dateEcheance.getTime() - b.dateEcheance.getTime());

    // Échéances par responsable
    const responsables = new Map<string, number>();
    echeancesList.forEach(e => {
      if (e.responsablePrincipal) {
        responsables.set(e.responsablePrincipal, (responsables.get(e.responsablePrincipal) || 0) + 1);
      }
    });

    return {
      echeancesList,
      stats,
      repartitionParType,
      repartitionParStatut,
      echeancesPrioritaires,
      responsables: Array.from(responsables.entries()).map(([nom, count]) => ({ nom, count }))
    };
  }, [state.echeances]);

  // Fonction utilitaire pour annoncer aux lecteurs d'écran
  const announceToScreenReader = useCallback((message: string) => {
    if (!accessibility?.announceChanges) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [accessibility]);

  return {
    // État
    echeances: state.echeances,
    filtres: state.filtres,
    vueActive: state.vueActive,
    loading: state.loading,
    error: state.error,
    derniereSync: state.derniereSync,
    modeCollaboration: state.modeCollaboration,
    sessionCollaboration: state.sessionCollaboration,

    // Valeurs calculées
    ...computedValues,

    // Actions
    loadEcheances,
    createEcheance,
    updateEcheance,
    deleteEcheance,
    applyFilters,
    clearFilters,
    setVueActive,
    startCollaboration,
    stopCollaboration,

    // Utilitaires
    refresh: () => loadEcheances(state.filtres),
    announceToScreenReader
  };
}

/**
 * Hook pour récupérer une échéance spécifique
 */
export function useEcheance(id: string) {
  const [echeance, setEcheance] = useState<Echeance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<EcheancesService>();

  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = EcheancesServiceFactory.createDevelopmentService();
    }
  }, []);

  const loadEcheance = useCallback(async () => {
    if (!serviceRef.current || !id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await serviceRef.current.getEcheanceById(id);
      setEcheance(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEcheance();
  }, [loadEcheance]);

  return {
    echeance,
    loading,
    error,
    refresh: loadEcheance
  };
}

/**
 * Hook pour les analytics des échéances
 */
export function useEcheancesAnalytics(periode: { debut: Date; fin: Date }) {
  const [analytics, setAnalytics] = useState<AnalyticsEcheances | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<EcheancesService>();

  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = EcheancesServiceFactory.createDevelopmentService();
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    if (!serviceRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await serviceRef.current.getAnalytics(periode);
      setAnalytics(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [periode]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: loadAnalytics
  };
}

export default useEcheances;
