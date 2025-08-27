/**
 * Tests unitaires pour les utilitaires de transformation de données
 */

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDuration,
  timeStringToMinutes,
  calculateBudgetProgress,
  validateCollaboratorData,
  validateBudgetData,
  validateFinancialEntityData,
  validateFolderStatusData,
  validateTeamMemberData,
  validateTimeSheetData,
  validateProjectData,
  validateRevenueData,
  handleDataError,
  validateRequiredFields,
  validateAndCleanArray,
  calculateStats,
  generateId,
  truncateText,
  getIndicatorColor,
  formatDate,
  isValidNumber,
  clampNumber,
  objectToQueryParams,
  groupBy,
  sortBy,
  compact,
  range,
  unique,
  intersection,
  difference,
  chunk,
  coalesce,
  isValidEmail,
  capitalize,
  toKebabCase,
  toCamelCase,
  hexToRgb,
  getLuminance,
  isLightColor
} from '../dataTransformation';

describe('Formatage des données', () => {
  describe('formatNumber', () => {
    it('formate correctement les nombres avec séparateurs', () => {
      expect(formatNumber(1234)).toMatch(/1.234/);
      expect(formatNumber(1234567)).toMatch(/1.234.567/);
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('formate correctement les valeurs monétaires', () => {
      expect(formatCurrency(1234)).toMatch(/1.234.*€/);
      expect(formatCurrency(1234, '$')).toMatch(/1.234.*\$/);
      expect(formatCurrency(0)).toMatch(/0.*€/);
    });
  });

  describe('formatPercentage', () => {
    it('formate correctement les pourcentages', () => {
      expect(formatPercentage(12.345)).toBe('12.3%');
      expect(formatPercentage(100, 0)).toBe('100%');
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });

  describe('formatDuration', () => {
    it('formate correctement les durées', () => {
      expect(formatDuration('18h')).toBe('18h 0m');
      expect(formatDuration('24h 30m')).toBe('24h 30m');
      expect(formatDuration('0m')).toBe('0h 0m');
      expect(formatDuration('')).toBe('0h 0m');
    });
  });

  describe('timeStringToMinutes', () => {
    it('convertit correctement les strings de temps en minutes', () => {
      expect(timeStringToMinutes('1h')).toBe(60);
      expect(timeStringToMinutes('1h 30m')).toBe(90);
      expect(timeStringToMinutes('0m')).toBe(0);
      expect(timeStringToMinutes('')).toBe(0);
    });
  });
});

describe('Calculs', () => {
  describe('calculateBudgetProgress', () => {
    it('calcule correctement les pourcentages de progression', () => {
      expect(calculateBudgetProgress(50, 100)).toBe(50);
      expect(calculateBudgetProgress(75, 100)).toBe(75);
      expect(calculateBudgetProgress(100, 0)).toBe(0);
    });
  });

  describe('calculateStats', () => {
    it('calcule correctement les statistiques', () => {
      const stats = calculateStats([1, 2, 3, 4, 5]);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(5);
      expect(stats.avg).toBe(3);
      expect(stats.sum).toBe(15);
    });

    it('gère les tableaux vides', () => {
      const stats = calculateStats([]);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.avg).toBe(0);
      expect(stats.sum).toBe(0);
    });
  });
});

describe('Validation des données', () => {
  describe('validateCollaboratorData', () => {
    it('valide et nettoie les données de collaborateur', () => {
      const input = { name: 'John Doe', role: 'Developer', ca: 85, va: 90, cp: 75 };
      const result = validateCollaboratorData(input);
      
      expect(result.name).toBe('John Doe');
      expect(result.role).toBe('Developer');
      expect(result.ca).toBe(85);
      expect(result.va).toBe(90);
      expect(result.cp).toBe(75);
    });

    it('gère les données manquantes', () => {
      const input = {};
      const result = validateCollaboratorData(input);
      
      expect(result.name).toBe('Nom inconnu');
      expect(result.role).toBe('N/A');
      expect(result.ca).toBeUndefined();
    });

    it('limite les valeurs entre 0 et 100', () => {
      const input = { ca: 150, va: -10, cp: 50 };
      const result = validateCollaboratorData(input);
      
      expect(result.ca).toBe(100);
      expect(result.va).toBe(0);
      expect(result.cp).toBe(50);
    });
  });

  describe('validateBudgetData', () => {
    it('valide et nettoie les données de budget', () => {
      const input = { current: 75000, target: 100000, unit: '€' };
      const result = validateBudgetData(input);
      
      expect(result.current).toBe(75000);
      expect(result.target).toBe(100000);
      expect(result.unit).toBe('€');
      expect(result.percentage).toBe(75);
    });

    it('évite la division par zéro', () => {
      const input = { current: 50, target: 0 };
      const result = validateBudgetData(input);
      
      expect(result.target).toBe(1);
    });
  });

  describe('validateRequiredFields', () => {
    it('valide la présence des champs requis', () => {
      const data = { name: 'Test', value: 100 };
      expect(validateRequiredFields(data, ['name', 'value'])).toBe(true);
      expect(validateRequiredFields(data, ['name', 'missing'])).toBe(false);
      expect(validateRequiredFields(null, ['name'])).toBe(false);
    });
  });

  describe('validateAndCleanArray', () => {
    it('valide et nettoie un tableau', () => {
      const input = [
        { name: 'Item 1', value: 100 },
        null,
        { name: 'Item 2', value: 200 },
        undefined
      ];
      
      const validator = (item: any) => ({ name: item.name || 'Default', value: item.value || 0 });
      const result = validateAndCleanArray(input, validator);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Item 1');
      expect(result[1].name).toBe('Item 2');
    });

    it('retourne le fallback en cas d\'erreur', () => {
      const result = validateAndCleanArray(null as any, () => ({}), [{ default: true }]);
      expect(result).toEqual([{ default: true }]);
    });
  });
});

describe('Utilitaires', () => {
  describe('generateId', () => {
    it('génère des IDs uniques', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^item-\d+-[a-z0-9]+$/);
    });

    it('utilise le préfixe fourni', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test-\d+-[a-z0-9]+$/);
    });
  });

  describe('truncateText', () => {
    it('tronque le texte correctement', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('', 5)).toBe('');
    });
  });

  describe('getIndicatorColor', () => {
    it('retourne la bonne couleur selon les seuils', () => {
      const thresholds = { success: 80, warning: 60 };
      
      expect(getIndicatorColor(90, thresholds)).toBe('success');
      expect(getIndicatorColor(70, thresholds)).toBe('warning');
      expect(getIndicatorColor(50, thresholds)).toBe('destructive');
    });
  });

  describe('formatDate', () => {
    it('formate correctement les dates', () => {
      const date = new Date('2023-08-22');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('gère les dates invalides', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('isValidNumber', () => {
    it('valide correctement les nombres', () => {
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-10)).toBe(true);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber('42')).toBe(false);
    });
  });

  describe('clampNumber', () => {
    it('limite les valeurs dans les bornes', () => {
      expect(clampNumber(50, 0, 100)).toBe(50);
      expect(clampNumber(-10, 0, 100)).toBe(0);
      expect(clampNumber(150, 0, 100)).toBe(100);
    });
  });
});

describe('Gestion d\'erreurs', () => {
  describe('handleDataError', () => {
    it('gère les erreurs et retourne le fallback', () => {
      const error = new Error('Test error');
      const fallback = { default: true };
      
      // Mock console.error pour éviter les logs pendant les tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = handleDataError(error, fallback, 'test');
      
      expect(result).toBe(fallback);
      expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du traitement des test:', error);
      
      consoleSpy.mockRestore();
    });
  });
});

describe('Utilitaires supplémentaires', () => {
  describe('objectToQueryParams', () => {
    it('convertit un objet en paramètres d\'URL', () => {
      const obj = { name: 'John', age: 30, active: true };
      const result = objectToQueryParams(obj);
      expect(result).toBe('name=John&age=30&active=true');
    });

    it('ignore les valeurs null/undefined/vides', () => {
      const obj = { name: 'John', age: null, city: undefined, country: '' };
      const result = objectToQueryParams(obj);
      expect(result).toBe('name=John');
    });
  });

  describe('groupBy', () => {
    it('groupe les éléments par propriété', () => {
      const items = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ];
      
      const grouped = groupBy(items, 'category');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('trie par propriété en ordre croissant', () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
      const sorted = sortBy(items, 'value');
      expect(sorted.map(item => item.value)).toEqual([1, 2, 3]);
    });

    it('trie par propriété en ordre décroissant', () => {
      const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
      const sorted = sortBy(items, 'value', 'desc');
      expect(sorted.map(item => item.value)).toEqual([3, 2, 1]);
    });
  });

  describe('compact', () => {
    it('filtre les valeurs falsy', () => {
      const array = [1, null, 2, undefined, 3, false, 4, 0, 5, ''];
      const result = compact(array);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('range', () => {
    it('crée une plage de nombres', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe('unique', () => {
    it('retourne les éléments uniques', () => {
      const array = [1, 2, 2, 3, 3, 3, 4];
      expect(unique(array)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('intersection', () => {
    it('retourne l\'intersection de deux tableaux', () => {
      const array1 = [1, 2, 3, 4];
      const array2 = [3, 4, 5, 6];
      expect(intersection(array1, array2)).toEqual([3, 4]);
    });
  });

  describe('difference', () => {
    it('retourne la différence entre deux tableaux', () => {
      const array1 = [1, 2, 3, 4];
      const array2 = [3, 4, 5, 6];
      expect(difference(array1, array2)).toEqual([1, 2]);
    });
  });

  describe('chunk', () => {
    it('divise un tableau en chunks', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = chunk(array, 3);
      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('coalesce', () => {
    it('retourne la première valeur non-null', () => {
      expect(coalesce(null, undefined, 'hello')).toBe('hello');
      expect(coalesce(null, undefined)).toBeUndefined();
    });
  });

  describe('isValidEmail', () => {
    it('valide les emails correctement', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('capitalise la première lettre', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('')).toBe('');
    });
  });

  describe('toKebabCase', () => {
    it('convertit en kebab-case', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('toCamelCase', () => {
    it('convertit en camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });
  });

  describe('hexToRgb', () => {
    it('convertit hex en RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('getLuminance', () => {
    it('calcule la luminosité', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 2);
      expect(getLuminance('#000000')).toBeCloseTo(0, 2);
    });
  });

  describe('isLightColor', () => {
    it('détermine si une couleur est claire', () => {
      expect(isLightColor('#ffffff')).toBe(true);
      expect(isLightColor('#000000')).toBe(false);
    });
  });
});