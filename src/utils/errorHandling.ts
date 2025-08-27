/**
 * Utilitaires de gestion d'erreurs spécifiques au dashboard
 */

export interface DashboardError {
  code: string;
  message: string;
  context?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorReport {
  errors: DashboardError[];
  summary: {
    total: number;
    bySeverity: Record<string, number>;
    byContext: Record<string, number>;
  };
}

/**
 * Codes d'erreur spécifiques au dashboard
 */
export const ERROR_CODES = {
  DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',
  INVALID_DATA_FORMAT: 'INVALID_DATA_FORMAT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
  COMPONENT_RENDER_ERROR: 'COMPONENT_RENDER_ERROR',
  SIDEBAR_ERROR: 'SIDEBAR_ERROR',
  CHART_RENDER_ERROR: 'CHART_RENDER_ERROR',
  EXPORT_ERROR: 'EXPORT_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

/**
 * Messages d'erreur localisés
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.DATA_FETCH_FAILED]: 'Échec du chargement des données',
  [ERROR_CODES.INVALID_DATA_FORMAT]: 'Format de données invalide',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Champ requis manquant',
  [ERROR_CODES.CALCULATION_ERROR]: 'Erreur de calcul',
  [ERROR_CODES.COMPONENT_RENDER_ERROR]: 'Erreur de rendu du composant',
  [ERROR_CODES.SIDEBAR_ERROR]: 'Erreur de la sidebar contextuelle',
  [ERROR_CODES.CHART_RENDER_ERROR]: 'Erreur de rendu du graphique',
  [ERROR_CODES.EXPORT_ERROR]: 'Erreur d\'exportation',
  [ERROR_CODES.PERMISSION_DENIED]: 'Accès refusé',
  [ERROR_CODES.NETWORK_ERROR]: 'Erreur réseau'
} as const;

/**
 * Classe pour la gestion centralisée des erreurs
 */
export class DashboardErrorHandler {
  private errors: DashboardError[] = [];
  private maxErrors: number = 100;

  /**
   * Enregistre une nouvelle erreur
   */
  logError(
    code: keyof typeof ERROR_CODES,
    originalError?: Error,
    context?: string,
    severity: DashboardError['severity'] = 'medium'
  ): DashboardError {
    const error: DashboardError = {
      code,
      message: ERROR_MESSAGES[code] || 'Erreur inconnue',
      context,
      timestamp: new Date(),
      severity
    };

    this.errors.unshift(error);

    // Limite le nombre d'erreurs stockées
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Dashboard Error] ${error.code}: ${error.message}`, {
        context: error.context,
        originalError,
        timestamp: error.timestamp
      });
    }

    return error;
  }

  /**
   * Récupère toutes les erreurs
   */
  getErrors(): DashboardError[] {
    return [...this.errors];
  }

  /**
   * Récupère les erreurs par sévérité
   */
  getErrorsBySeverity(severity: DashboardError['severity']): DashboardError[] {
    return this.errors.filter(error => error.severity === severity);
  }

  /**
   * Récupère les erreurs par contexte
   */
  getErrorsByContext(context: string): DashboardError[] {
    return this.errors.filter(error => error.context === context);
  }

  /**
   * Génère un rapport d'erreurs
   */
  generateReport(): ErrorReport {
    const bySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byContext = this.errors.reduce((acc, error) => {
      if (error.context) {
        acc[error.context] = (acc[error.context] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      errors: this.getErrors(),
      summary: {
        total: this.errors.length,
        bySeverity,
        byContext
      }
    };
  }

  /**
   * Efface toutes les erreurs
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Efface les erreurs anciennes (plus de X heures)
   */
  clearOldErrors(hoursOld: number = 24): void {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    this.errors = this.errors.filter(error => error.timestamp > cutoffTime);
  }

  /**
   * Vérifie s'il y a des erreurs critiques récentes
   */
  hasCriticalErrors(withinMinutes: number = 5): boolean {
    const cutoffTime = new Date(Date.now() - withinMinutes * 60 * 1000);
    return this.errors.some(
      error => error.severity === 'critical' && error.timestamp > cutoffTime
    );
  }
}

/**
 * Instance globale du gestionnaire d'erreurs
 */
export const dashboardErrorHandler = new DashboardErrorHandler();

/**
 * Wrapper pour les fonctions async avec gestion d'erreurs
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string,
  errorCode: keyof typeof ERROR_CODES = 'DATA_FETCH_FAILED'
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      dashboardErrorHandler.logError(
        errorCode,
        error as Error,
        context,
        'high'
      );
      return null;
    }
  };
};

/**
 * Wrapper pour les fonctions sync avec gestion d'erreurs
 */
export const withSyncErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R,
  context: string,
  errorCode: keyof typeof ERROR_CODES = 'CALCULATION_ERROR'
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      dashboardErrorHandler.logError(
        errorCode,
        error as Error,
        context,
        'medium'
      );
      return null;
    }
  };
};

/**
 * Utilitaire pour créer des fallbacks de données
 */
export const createDataFallback = <T>(
  defaultValue: T,
  context: string
): T => {
  dashboardErrorHandler.logError(
    'DATA_FETCH_FAILED',
    undefined,
    `Fallback utilisé pour ${context}`,
    'low'
  );
  return defaultValue;
};

/**
 * Valide les données critiques et lève une erreur si invalides
 */
export const validateCriticalData = (
  data: any,
  requiredFields: string[],
  context: string
): boolean => {
  if (!data || typeof data !== 'object') {
    dashboardErrorHandler.logError(
      'INVALID_DATA_FORMAT',
      undefined,
      `Données invalides dans ${context}`,
      'critical'
    );
    return false;
  }

  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null
  );

  if (missingFields.length > 0) {
    dashboardErrorHandler.logError(
      'MISSING_REQUIRED_FIELD',
      undefined,
      `Champs manquants dans ${context}: ${missingFields.join(', ')}`,
      'high'
    );
    return false;
  }

  return true;
};

/**
 * Retry automatique avec backoff exponentiel
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context: string = 'operation'
): Promise<T | null> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        dashboardErrorHandler.logError(
          'DATA_FETCH_FAILED',
          lastError,
          `Échec après ${maxRetries + 1} tentatives: ${context}`,
          'high'
        );
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return null;
};

/**
 * Monitore les performances et signale les problèmes
 */
export const monitorPerformance = (
  operationName: string,
  thresholdMs: number = 1000
) => {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    
    if (duration > thresholdMs) {
      dashboardErrorHandler.logError(
        'CALCULATION_ERROR',
        undefined,
        `Opération lente détectée: ${operationName} (${duration.toFixed(2)}ms)`,
        'medium'
      );
    }
    
    return duration;
  };
};