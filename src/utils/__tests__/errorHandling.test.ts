/**
 * Tests unitaires pour la gestion d'erreurs du dashboard
 */

import {
  DashboardErrorHandler,
  dashboardErrorHandler,
  ERROR_CODES,
  ERROR_MESSAGES,
  withErrorHandling,
  withSyncErrorHandling,
  createDataFallback,
  validateCriticalData,
  retryWithBackoff,
  monitorPerformance
} from '../errorHandling';

describe('DashboardErrorHandler', () => {
  let errorHandler: DashboardErrorHandler;

  beforeEach(() => {
    errorHandler = new DashboardErrorHandler();
  });

  describe('logError', () => {
    it('enregistre une erreur correctement', () => {
      const error = errorHandler.logError('DATA_FETCH_FAILED', undefined, 'test-context');
      
      expect(error.code).toBe('DATA_FETCH_FAILED');
      expect(error.message).toBe(ERROR_MESSAGES.DATA_FETCH_FAILED);
      expect(error.context).toBe('test-context');
      expect(error.severity).toBe('medium');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('utilise la sévérité spécifiée', () => {
      const error = errorHandler.logError('NETWORK_ERROR', undefined, 'test', 'critical');
      expect(error.severity).toBe('critical');
    });
  });

  describe('getErrors', () => {
    it('retourne toutes les erreurs', () => {
      errorHandler.logError('DATA_FETCH_FAILED');
      errorHandler.logError('NETWORK_ERROR');
      
      const errors = errorHandler.getErrors();
      expect(errors).toHaveLength(2);
    });
  });

  describe('getErrorsBySeverity', () => {
    it('filtre les erreurs par sévérité', () => {
      errorHandler.logError('DATA_FETCH_FAILED', undefined, 'test', 'low');
      errorHandler.logError('NETWORK_ERROR', undefined, 'test', 'critical');
      
      const criticalErrors = errorHandler.getErrorsBySeverity('critical');
      expect(criticalErrors).toHaveLength(1);
      expect(criticalErrors[0].code).toBe('NETWORK_ERROR');
    });
  });

  describe('getErrorsByContext', () => {
    it('filtre les erreurs par contexte', () => {
      errorHandler.logError('DATA_FETCH_FAILED', undefined, 'overview');
      errorHandler.logError('NETWORK_ERROR', undefined, 'production');
      
      const overviewErrors = errorHandler.getErrorsByContext('overview');
      expect(overviewErrors).toHaveLength(1);
      expect(overviewErrors[0].context).toBe('overview');
    });
  });

  describe('generateReport', () => {
    it('génère un rapport complet', () => {
      errorHandler.logError('DATA_FETCH_FAILED', undefined, 'overview', 'low');
      errorHandler.logError('NETWORK_ERROR', undefined, 'production', 'critical');
      
      const report = errorHandler.generateReport();
      
      expect(report.summary.total).toBe(2);
      expect(report.summary.bySeverity.low).toBe(1);
      expect(report.summary.bySeverity.critical).toBe(1);
      expect(report.summary.byContext.overview).toBe(1);
      expect(report.summary.byContext.production).toBe(1);
    });
  });

  describe('clearErrors', () => {
    it('efface toutes les erreurs', () => {
      errorHandler.logError('DATA_FETCH_FAILED');
      errorHandler.clearErrors();
      
      expect(errorHandler.getErrors()).toHaveLength(0);
    });
  });

  describe('hasCriticalErrors', () => {
    it('détecte les erreurs critiques récentes', () => {
      errorHandler.logError('NETWORK_ERROR', undefined, 'test', 'critical');
      expect(errorHandler.hasCriticalErrors()).toBe(true);
    });

    it('ignore les erreurs non-critiques', () => {
      errorHandler.logError('DATA_FETCH_FAILED', undefined, 'test', 'low');
      expect(errorHandler.hasCriticalErrors()).toBe(false);
    });
  });
});

describe('Wrappers de gestion d\'erreurs', () => {
  beforeEach(() => {
    dashboardErrorHandler.clearErrors();
  });

  describe('withErrorHandling', () => {
    it('gère les erreurs async correctement', async () => {
      const failingFunction = async () => {
        throw new Error('Test error');
      };
      
      const wrappedFunction = withErrorHandling(failingFunction, 'test-context');
      const result = await wrappedFunction();
      
      expect(result).toBeNull();
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });

    it('retourne le résultat en cas de succès', async () => {
      const successFunction = async () => 'success';
      
      const wrappedFunction = withErrorHandling(successFunction, 'test-context');
      const result = await wrappedFunction();
      
      expect(result).toBe('success');
      expect(dashboardErrorHandler.getErrors()).toHaveLength(0);
    });
  });

  describe('withSyncErrorHandling', () => {
    it('gère les erreurs sync correctement', () => {
      const failingFunction = () => {
        throw new Error('Test error');
      };
      
      const wrappedFunction = withSyncErrorHandling(failingFunction, 'test-context');
      const result = wrappedFunction();
      
      expect(result).toBeNull();
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });
  });
});

describe('Utilitaires de validation', () => {
  beforeEach(() => {
    dashboardErrorHandler.clearErrors();
  });

  describe('createDataFallback', () => {
    it('crée un fallback et enregistre l\'erreur', () => {
      const fallback = createDataFallback({ default: true }, 'test-data');
      
      expect(fallback).toEqual({ default: true });
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });
  });

  describe('validateCriticalData', () => {
    it('valide les données correctes', () => {
      const data = { name: 'John', age: 30 };
      const isValid = validateCriticalData(data, ['name', 'age'], 'user-data');
      
      expect(isValid).toBe(true);
      expect(dashboardErrorHandler.getErrors()).toHaveLength(0);
    });

    it('détecte les données invalides', () => {
      const data = null;
      const isValid = validateCriticalData(data, ['name'], 'user-data');
      
      expect(isValid).toBe(false);
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });

    it('détecte les champs manquants', () => {
      const data = { name: 'John' };
      const isValid = validateCriticalData(data, ['name', 'age'], 'user-data');
      
      expect(isValid).toBe(false);
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });
  });
});

describe('Retry et performance', () => {
  beforeEach(() => {
    dashboardErrorHandler.clearErrors();
  });

  describe('retryWithBackoff', () => {
    it('réussit au premier essai', async () => {
      const successFunction = jest.fn().mockResolvedValue('success');
      
      const result = await retryWithBackoff(successFunction, 3, 10);
      
      expect(result).toBe('success');
      expect(successFunction).toHaveBeenCalledTimes(1);
    });

    it('retry après échec puis réussit', async () => {
      const failThenSucceed = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockResolvedValueOnce('success');
      
      const result = await retryWithBackoff(failThenSucceed, 3, 10);
      
      expect(result).toBe('success');
      expect(failThenSucceed).toHaveBeenCalledTimes(2);
    });

    it('échoue après tous les retries', async () => {
      const alwaysFail = jest.fn().mockRejectedValue(new Error('Always fail'));
      
      const result = await retryWithBackoff(alwaysFail, 2, 10);
      
      expect(result).toBeNull();
      expect(alwaysFail).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });
  });

  describe('monitorPerformance', () => {
    it('ne signale pas les opérations rapides', () => {
      const monitor = monitorPerformance('test-operation', 1000);
      const duration = monitor();
      
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(dashboardErrorHandler.getErrors()).toHaveLength(0);
    });

    it('signale les opérations lentes', async () => {
      const monitor = monitorPerformance('test-operation', 10);
      
      // Simule une opération lente
      await new Promise(resolve => setTimeout(resolve, 20));
      
      const duration = monitor();
      
      expect(duration).toBeGreaterThan(10);
      expect(dashboardErrorHandler.getErrors()).toHaveLength(1);
    });
  });
});