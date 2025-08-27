/**
 * Utilitaires de transformation et validation des données du dashboard
 */

import { 
  BudgetProgress, 
  CollaboratorPerformance, 
  FinancialEntity, 
  FolderStatus,
  TeamMember,
  TimeSheet,
  Project,
  RevenueData
} from '@/types/dashboard';

/**
 * Formate un nombre en string avec séparateurs de milliers
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('fr-FR');
};

/**
 * Formate une valeur monétaire
 */
export const formatCurrency = (value: number, currency: string = '€'): string => {
  return `${formatNumber(value)} ${currency}`;
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formate une durée en heures et minutes
 */
export const formatDuration = (timeString: string): string => {
  // Gère les formats comme "18h", "24h 30m", "0m"
  if (!timeString || timeString === "0m") return "0h 0m";
  
  const match = timeString.match(/(\d+)h?\s*(\d+)?m?/);
  if (!match) return timeString;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  
  return `${hours}h ${minutes}m`;
};

/**
 * Convertit une string de temps en minutes totales
 */
export const timeStringToMinutes = (timeString: string): number => {
  if (!timeString || timeString === "0m") return 0;
  
  const match = timeString.match(/(\d+)h?\s*(\d+)?m?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  
  return hours * 60 + minutes;
};

/**
 * Calcule le pourcentage de progression d'un budget
 */
export const calculateBudgetProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100 * 10) / 10; // Arrondi à 1 décimale
};

/**
 * Valide et nettoie les données d'un collaborateur
 */
export const validateCollaboratorData = (data: any): CollaboratorPerformance => {
  return {
    name: data.name || 'Nom inconnu',
    role: data.role || 'N/A',
    ca: typeof data.ca === 'number' ? Math.max(0, Math.min(100, data.ca)) : undefined,
    va: typeof data.va === 'number' ? Math.max(0, Math.min(100, data.va)) : undefined,
    cp: typeof data.cp === 'number' ? Math.max(0, Math.min(100, data.cp)) : undefined,
  };
};

/**
 * Valide et nettoie les données d'un budget
 */
export const validateBudgetData = (data: any): BudgetProgress => {
  const current = Math.max(0, data.current || 0);
  const target = Math.max(1, data.target || 1); // Évite la division par zéro
  
  return {
    current,
    target,
    unit: data.unit === 'H' || data.unit === '€' ? data.unit : '€',
    percentage: calculateBudgetProgress(current, target)
  };
};

/**
 * Valide et nettoie les données d'une entité financière
 */
export const validateFinancialEntityData = (data: any): FinancialEntity => {
  return {
    name: data.name || 'Entité inconnue',
    budget: Math.max(0, data.budget || 0),
    actual: Math.max(0, data.actual || 0),
    forecast: Math.max(0, data.forecast || 0),
    billable: Math.max(0, data.billable || 0),
  };
};

/**
 * Valide et nettoie les données d'un statut de dossier
 */
export const validateFolderStatusData = (data: any): FolderStatus => {
  return {
    name: data.name || 'Dossier inconnu',
    time: data.time || '0h',
    percentage: Math.max(0, data.percentage || 0),
    status: data.status === 'exceeding' || data.status === 'compliant' ? data.status : 'compliant'
  };
};

/**
 * Valide et nettoie les données d'un membre d'équipe
 */
export const validateTeamMemberData = (data: any): TeamMember => {
  return {
    name: data.name || 'Membre inconnu',
    time: data.time || '0m'
  };
};

/**
 * Valide et nettoie les données d'une feuille de temps
 */
export const validateTimeSheetData = (data: any): TimeSheet => {
  const hours = Math.max(0, data.hours || 0);
  const target = Math.max(1, data.target || 1);
  
  return {
    name: data.name || 'Collaborateur inconnu',
    hours,
    target,
    status: hours > target ? 'exceeded' : 'normal'
  };
};

/**
 * Valide et nettoie les données d'un projet
 */
export const validateProjectData = (data: any): Project => {
  return {
    name: data.name || 'Projet inconnu',
    value: Math.max(0, data.value || 0)
  };
};

/**
 * Valide et nettoie les données de revenus
 */
export const validateRevenueData = (data: any): RevenueData => {
  return {
    period: data.period || 'Période inconnue',
    value: Math.max(0, data.value || 0),
    adjusted: Math.max(0, data.adjusted || data.value || 0)
  };
};

/**
 * Gère les erreurs de données avec des valeurs de fallback
 */
export const handleDataError = <T>(error: Error, fallbackData: T, context: string = 'données'): T => {
  console.error(`Erreur lors du traitement des ${context}:`, error);
  return fallbackData;
};

/**
 * Valide qu'un objet a les propriétés requises
 */
export const validateRequiredFields = (data: any, requiredFields: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
};

/**
 * Nettoie et valide un tableau de données
 */
export const validateAndCleanArray = <T>(
  data: any[], 
  validator: (item: any) => T,
  fallbackArray: T[] = []
): T[] => {
  try {
    if (!Array.isArray(data)) return fallbackArray;
    
    return data
      .filter(item => item !== null && item !== undefined)
      .map(item => {
        try {
          return validator(item);
        } catch (error) {
          console.warn('Erreur lors de la validation d\'un élément:', error);
          return null;
        }
      })
      .filter((item): item is T => item !== null);
  } catch (error) {
    return handleDataError(error as Error, fallbackArray, 'tableau');
  }
};

/**
 * Calcule des statistiques de base sur un tableau de nombres
 */
export const calculateStats = (values: number[]) => {
  if (!values.length) return { min: 0, max: 0, avg: 0, sum: 0 };
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return { min, max, avg, sum };
};

/**
 * Génère un ID unique pour les éléments
 */
export const generateId = (prefix: string = 'item'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Détermine la couleur d'un indicateur basé sur sa valeur et ses seuils
 */
export const getIndicatorColor = (
  value: number, 
  thresholds: { success: number; warning: number }
): 'success' | 'warning' | 'destructive' => {
  if (value >= thresholds.success) return 'success';
  if (value >= thresholds.warning) return 'warning';
  return 'destructive';
};

/**
 * Formate une date en string localisée
 */
export const formatDate = (date: Date | string, locale: string = 'fr-FR'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Vérifie si une valeur est un nombre valide
 */
export const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Sécurise une valeur numérique avec des limites
 */
export const clampNumber = (value: number, min: number = 0, max: number = Infinity): number => {
  return Math.max(min, Math.min(max, value));
};/**
 * Conv
ertit un objet en paramètres d'URL
 */
export const objectToQueryParams = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};

/**
 * Debounce une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Groupe un tableau d'objets par une propriété
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Trie un tableau d'objets par une propriété
 */
export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filtre les valeurs falsy d'un tableau
 */
export const compact = <T>(array: (T | null | undefined | false | 0 | '')[]): T[] => {
  return array.filter(Boolean) as T[];
};

/**
 * Crée un tableau de nombres dans une plage
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Retourne une valeur aléatoire d'un tableau
 */
export const sample = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Mélange un tableau (Fisher-Yates shuffle)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Retourne les éléments uniques d'un tableau
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Retourne l'intersection de deux tableaux
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => array2.includes(item));
};

/**
 * Retourne la différence entre deux tableaux
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item));
};

/**
 * Divise un tableau en chunks de taille donnée
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Retourne le premier élément non-null/undefined
 */
export const coalesce = <T>(...values: (T | null | undefined)[]): T | undefined => {
  return values.find(value => value !== null && value !== undefined);
};

/**
 * Vérifie si une string est un email valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalise la première lettre d'une string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convertit une string en kebab-case
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Convertit une string en camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, char => char.toLowerCase());
};

/**
 * Escape les caractères HTML
 */
export const escapeHtml = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Retourne une couleur hexadécimale aléatoire
 */
export const randomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Convertit une couleur hex en RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calcule la luminosité d'une couleur
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

/**
 * Détermine si une couleur est claire ou sombre
 */
export const isLightColor = (hex: string): boolean => {
  return getLuminance(hex) > 0.5;
};