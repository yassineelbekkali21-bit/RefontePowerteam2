/**
 * Service moderne pour la gestion des échéances
 * Architecture orientée Web 3.0 avec support de la décentralisation
 */

import { 
  Echeance, 
  EcheanceCreation, 
  EcheanceMiseAJour,
  FiltresEcheances,
  AnalyticsEcheances,
  VueEcheances,
  EcheanceEvent,
  StatutEcheance,
  NiveauUrgence,
  TypeEcheance,
  CollaborationSession,
  NotificationEcheance
} from '@/types/echeances';

// Interface pour les options de configuration du service
interface EcheancesServiceConfig {
  apiEndpoint?: string;
  enableRealtime?: boolean;
  enableBlockchain?: boolean;
  enableCollaboration?: boolean;
  cacheTTL?: number; // en millisecondes
  notificationChannels?: ('websocket' | 'sse' | 'polling')[];
}

// Interface pour les callbacks d'événements
interface EcheancesServiceEvents {
  onEcheanceCreated?: (echeance: Echeance) => void;
  onEcheanceUpdated?: (echeanceId: string, changes: EcheanceMiseAJour) => void;
  onEcheanceDeleted?: (echeanceId: string) => void;
  onDeadlineApproaching?: (echeance: Echeance, daysRemaining: number) => void;
  onOverdue?: (echeance: Echeance, daysOverdue: number) => void;
  onError?: (error: Error) => void;
}

/**
 * Service principal pour la gestion des échéances
 * Implémente les patterns modernes : Observer, Strategy, Factory
 */
export class EcheancesService {
  private static instance: EcheancesService;
  private config: EcheancesServiceConfig;
  private events: EcheancesServiceEvents;
  private cache: Map<string, Echeance> = new Map();
  private subscribers: Set<(event: EcheanceEvent) => void> = new Set();
  private websocket?: WebSocket;
  private eventSource?: EventSource;
  private collaborationSessions: Map<string, CollaborationSession> = new Map();

  private constructor(config: EcheancesServiceConfig = {}, events: EcheancesServiceEvents = {}) {
    this.config = {
      enableRealtime: true,
      enableCollaboration: true,
      enableBlockchain: false,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      notificationChannels: ['websocket', 'sse'],
      ...config
    };
    this.events = events;

    this.initializeRealtime();
    this.initializePeriodicChecks();
  }

  /**
   * Singleton pattern pour une instance unique du service
   */
  public static getInstance(config?: EcheancesServiceConfig, events?: EcheancesServiceEvents): EcheancesService {
    if (!EcheancesService.instance) {
      EcheancesService.instance = new EcheancesService(config, events);
    }
    return EcheancesService.instance;
  }

  /**
   * Initialise les connexions temps réel
   */
  private initializeRealtime(): void {
    if (!this.config.enableRealtime) return;

    if (this.config.notificationChannels?.includes('websocket') && this.config.apiEndpoint) {
      this.initializeWebSocket();
    }

    if (this.config.notificationChannels?.includes('sse') && this.config.apiEndpoint) {
      this.initializeServerSentEvents();
    }
  }

  /**
   * Initialise WebSocket pour les mises à jour temps réel
   */
  private initializeWebSocket(): void {
    try {
      const wsUrl = this.config.apiEndpoint?.replace('http', 'ws') + '/ws/echeances';
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('🔗 WebSocket connection established');
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as EcheanceEvent;
          this.handleRealtimeEvent(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.events.onError?.(new Error('WebSocket connection failed'));
      };

      this.websocket.onclose = () => {
        console.log('🔌 WebSocket connection closed, attempting to reconnect...');
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
    }
  }

  /**
   * Initialise Server-Sent Events pour les notifications
   */
  private initializeServerSentEvents(): void {
    try {
      if (this.config.apiEndpoint) {
        this.eventSource = new EventSource(`${this.config.apiEndpoint}/sse/echeances`);

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as EcheanceEvent;
            this.handleRealtimeEvent(data);
          } catch (error) {
            console.error('❌ Error parsing SSE message:', error);
          }
        };

        this.eventSource.onerror = () => {
          console.error('❌ SSE connection error');
          this.eventSource?.close();
          setTimeout(() => this.initializeServerSentEvents(), 10000);
        };
      }
    } catch (error) {
      console.error('❌ Failed to initialize SSE:', error);
    }
  }

  /**
   * Gère les événements temps réel
   */
  private handleRealtimeEvent(event: EcheanceEvent): void {
    // Notifier tous les abonnés
    this.subscribers.forEach(callback => callback(event));

    // Mettre à jour le cache local
    switch (event.type) {
      case 'created':
        this.cache.set(event.echeance.id, event.echeance);
        this.events.onEcheanceCreated?.(event.echeance);
        break;
      case 'updated':
        const existingEcheance = this.cache.get(event.echeanceId);
        if (existingEcheance) {
          const updatedEcheance = { ...existingEcheance, ...event.changes };
          this.cache.set(event.echeanceId, updatedEcheance);
          this.events.onEcheanceUpdated?.(event.echeanceId, event.changes);
        }
        break;
      case 'deleted':
        this.cache.delete(event.echeanceId);
        this.events.onEcheanceDeleted?.(event.echeanceId);
        break;
      case 'deadline_approaching':
        const approachingEcheance = this.cache.get(event.echeanceId);
        if (approachingEcheance) {
          this.events.onDeadlineApproaching?.(approachingEcheance, event.daysRemaining);
        }
        break;
      case 'overdue':
        const overdueEcheance = this.cache.get(event.echeanceId);
        if (overdueEcheance) {
          this.events.onOverdue?.(overdueEcheance, event.daysOverdue);
        }
        break;
    }
  }

  /**
   * Initialise les vérifications périodiques des échéances
   */
  private initializePeriodicChecks(): void {
    // Vérification des échéances approchantes toutes les heures
    setInterval(() => {
      this.checkUpcomingDeadlines();
    }, 60 * 60 * 1000); // 1 heure

    // Vérification des échéances en retard tous les jours à 8h
    setInterval(() => {
      this.checkOverdueEcheances();
    }, 24 * 60 * 60 * 1000); // 24 heures
  }

  /**
   * Vérifie les échéances approchantes
   */
  private async checkUpcomingDeadlines(): Promise<void> {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    for (const echeance of this.cache.values()) {
      if (echeance.statut !== StatutEcheance.COMPLETED && 
          echeance.dateEcheance >= now && 
          echeance.dateEcheance <= threeDaysFromNow) {
        
        const daysRemaining = Math.ceil((echeance.dateEcheance.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        this.events.onDeadlineApproaching?.(echeance, daysRemaining);
      }
    }
  }

  /**
   * Vérifie les échéances en retard
   */
  private async checkOverdueEcheances(): Promise<void> {
    const now = new Date();

    for (const echeance of this.cache.values()) {
      if (echeance.statut !== StatutEcheance.COMPLETED && 
          echeance.dateEcheance < now) {
        
        const daysOverdue = Math.ceil((now.getTime() - echeance.dateEcheance.getTime()) / (24 * 60 * 60 * 1000));
        this.events.onOverdue?.(echeance, daysOverdue);
      }
    }
  }

  /**
   * Récupère toutes les échéances avec filtres optionnels
   */
  public async getEcheances(filtres?: FiltresEcheances): Promise<Echeance[]> {
    try {
      // Si les données sont en cache et récentes, les utiliser
      if (this.cache.size > 0 && this.isCacheValid()) {
        return this.applyFilters(Array.from(this.cache.values()), filtres);
      }

      // Sinon, récupérer depuis l'API
      const response = await fetch(`${this.config.apiEndpoint}/echeances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filtres })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const echeances: Echeance[] = await response.json();
      
      // Mettre à jour le cache
      this.cache.clear();
      echeances.forEach(echeance => {
        this.cache.set(echeance.id, echeance);
      });

      return echeances;
    } catch (error) {
      console.error('❌ Error fetching echeances:', error);
      this.events.onError?.(error as Error);
      
      // Retourner les données du cache en cas d'erreur
      return this.applyFilters(Array.from(this.cache.values()), filtres);
    }
  }

  /**
   * Récupère une échéance par son ID
   */
  public async getEcheanceById(id: string): Promise<Echeance | null> {
    try {
      // Vérifier d'abord le cache
      const cached = this.cache.get(id);
      if (cached && this.isCacheValid()) {
        return cached;
      }

      // Récupérer depuis l'API
      const response = await fetch(`${this.config.apiEndpoint}/echeances/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const echeance: Echeance = await response.json();
      
      // Mettre à jour le cache
      this.cache.set(id, echeance);
      
      return echeance;
    } catch (error) {
      console.error(`❌ Error fetching echeance ${id}:`, error);
      this.events.onError?.(error as Error);
      return this.cache.get(id) || null;
    }
  }

  /**
   * Crée une nouvelle échéance
   */
  public async createEcheance(echeanceData: EcheanceCreation): Promise<Echeance> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/echeances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(echeanceData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newEcheance: Echeance = await response.json();
      
      // Mettre à jour le cache
      this.cache.set(newEcheance.id, newEcheance);
      
      // Déclencher l'événement
      this.events.onEcheanceCreated?.(newEcheance);
      
      return newEcheance;
    } catch (error) {
      console.error('❌ Error creating echeance:', error);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Met à jour une échéance existante
   */
  public async updateEcheance(id: string, updates: EcheanceMiseAJour): Promise<Echeance> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/echeances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedEcheance: Echeance = await response.json();
      
      // Mettre à jour le cache
      this.cache.set(id, updatedEcheance);
      
      // Déclencher l'événement
      this.events.onEcheanceUpdated?.(id, updates);
      
      return updatedEcheance;
    } catch (error) {
      console.error(`❌ Error updating echeance ${id}:`, error);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Supprime une échéance
   */
  public async deleteEcheance(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/echeances/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Supprimer du cache
      this.cache.delete(id);
      
      // Déclencher l'événement
      this.events.onEcheanceDeleted?.(id);
    } catch (error) {
      console.error(`❌ Error deleting echeance ${id}:`, error);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Récupère les analytics des échéances
   */
  public async getAnalytics(periode: { debut: Date; fin: Date }): Promise<AnalyticsEcheances> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/echeances/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periode })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Applique les filtres aux échéances
   */
  private applyFilters(echeances: Echeance[], filtres?: FiltresEcheances): Echeance[] {
    if (!filtres) return echeances;

    return echeances.filter(echeance => {
      // Filtre par types
      if (filtres.types && filtres.types.length > 0 && !filtres.types.includes(echeance.type)) {
        return false;
      }

      // Filtre par statuts
      if (filtres.statuts && filtres.statuts.length > 0 && !filtres.statuts.includes(echeance.statut)) {
        return false;
      }

      // Filtre par urgences
      if (filtres.urgences && filtres.urgences.length > 0 && !filtres.urgences.includes(echeance.urgence)) {
        return false;
      }

      // Filtre par forfaits
      if (filtres.forfaits && filtres.forfaits.length > 0 && !filtres.forfaits.includes(echeance.forfait)) {
        return false;
      }

      // Filtre par clients
      if (filtres.clients && filtres.clients.length > 0 && !filtres.clients.includes(echeance.clientId)) {
        return false;
      }

      // Filtre par responsables
      if (filtres.responsables && filtres.responsables.length > 0 && 
          echeance.responsablePrincipal && !filtres.responsables.includes(echeance.responsablePrincipal)) {
        return false;
      }

      // Filtre par dates d'échéance
      if (filtres.dateEcheanceDebut && echeance.dateEcheance < filtres.dateEcheanceDebut) {
        return false;
      }
      if (filtres.dateEcheanceFin && echeance.dateEcheance > filtres.dateEcheanceFin) {
        return false;
      }

      // Filtre par progression
      if (filtres.progressionMin !== undefined && echeance.progression < filtres.progressionMin) {
        return false;
      }
      if (filtres.progressionMax !== undefined && echeance.progression > filtres.progressionMax) {
        return false;
      }

      // Filtre retard uniquement
      if (filtres.retardUniquement && echeance.dateEcheance >= new Date()) {
        return false;
      }

      // Filtre terminées incluses
      if (!filtres.termineesIncluses && echeance.statut === StatutEcheance.COMPLETED) {
        return false;
      }

      // Filtre par recherche textuelle
      if (filtres.textRecherche) {
        const recherche = filtres.textRecherche.toLowerCase();
        const texteEcheance = `${echeance.nom} ${echeance.description} ${echeance.clientNom}`.toLowerCase();
        if (!texteEcheance.includes(recherche)) {
          return false;
        }
      }

      // Filtre par tags
      if (filtres.tags && filtres.tags.length > 0 && echeance.tags) {
        const hasTag = filtres.tags.some(tag => echeance.tags?.includes(tag));
        if (!hasTag) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Vérifie si le cache est valide
   */
  private isCacheValid(): boolean {
    // Pour simplifier, on considère que le cache est toujours valide en mode réel-time
    return this.config.enableRealtime === true;
  }

  /**
   * S'abonne aux événements d'échéances
   */
  public subscribe(callback: (event: EcheanceEvent) => void): () => void {
    this.subscribers.add(callback);
    
    // Retourne une fonction pour se désabonner
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Nettoyage des ressources
   */
  public cleanup(): void {
    this.websocket?.close();
    this.eventSource?.close();
    this.cache.clear();
    this.subscribers.clear();
    this.collaborationSessions.clear();
  }

  /**
   * Démarrer une session de collaboration
   */
  public async startCollaboration(echeanceId: string): Promise<CollaborationSession> {
    if (!this.config.enableCollaboration) {
      throw new Error('Collaboration is not enabled');
    }

    try {
      const response = await fetch(`${this.config.apiEndpoint}/echeances/${echeanceId}/collaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session: CollaborationSession = await response.json();
      this.collaborationSessions.set(echeanceId, session);
      
      return session;
    } catch (error) {
      console.error(`❌ Error starting collaboration for echeance ${echeanceId}:`, error);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Arrêter une session de collaboration
   */
  public async stopCollaboration(echeanceId: string): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/echeances/${echeanceId}/collaborate`, {
        method: 'DELETE'
      });

      this.collaborationSessions.delete(echeanceId);
    } catch (error) {
      console.error(`❌ Error stopping collaboration for echeance ${echeanceId}:`, error);
      this.events.onError?.(error as Error);
    }
  }
}

// Factory pour créer des instances avec des configurations prédéfinies
export class EcheancesServiceFactory {
  static createDevelopmentService(): EcheancesService {
    return EcheancesService.getInstance({
      apiEndpoint: 'http://localhost:3001/api',
      enableRealtime: true,
      enableCollaboration: true,
      enableBlockchain: false,
      notificationChannels: ['websocket']
    });
  }

  static createProductionService(): EcheancesService {
    return EcheancesService.getInstance({
      apiEndpoint: process.env.REACT_APP_API_ENDPOINT || '/api',
      enableRealtime: true,
      enableCollaboration: true,
      enableBlockchain: true,
      notificationChannels: ['websocket', 'sse']
    });
  }

  static createOfflineService(): EcheancesService {
    return EcheancesService.getInstance({
      enableRealtime: false,
      enableCollaboration: false,
      enableBlockchain: false,
      cacheTTL: 24 * 60 * 60 * 1000 // 24 heures
    });
  }
}

// Hook pour utiliser le service dans les composants React
export function useEcheancesService(config?: EcheancesServiceConfig, events?: EcheancesServiceEvents) {
  return EcheancesService.getInstance(config, events);
}

export default EcheancesService;
