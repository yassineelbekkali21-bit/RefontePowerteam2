/**
 * Fournisseur d'accessibilité avancée
 * Implémente les standards WCAG 2.1 AA et les bonnes pratiques modernes
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AccessibilityConfig } from '@/types/echeances';

// Interface pour le contexte d'accessibilité
interface AccessibilityContextType {
  config: AccessibilityConfig;
  updateConfig: (updates: Partial<AccessibilityConfig>) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (elementId: string) => void;
  registerShortcut: (key: string, handler: () => void, description?: string) => void;
  unregisterShortcut: (key: string) => void;
  isHighContrast: boolean;
  fontSize: string;
  reducedMotion: boolean;
}

// Configuration par défaut
const defaultConfig: AccessibilityConfig = {
  announceChanges: true,
  highContrast: false,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  reducedMotion: false,
  fontSize: 'medium',
  customShortcuts: {}
};

// Contexte d'accessibilité
const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// Hook pour utiliser le contexte d'accessibilité
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<AccessibilityConfig>;
}

/**
 * Fournisseur d'accessibilité qui enveloppe l'application
 */
export function AccessibilityProvider({ children, initialConfig = {} }: AccessibilityProviderProps) {
  // État de la configuration d'accessibilité
  const [config, setConfig] = useState<AccessibilityConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  // Références pour les fonctionnalités d'accessibilité
  const announceRef = useRef<HTMLDivElement>(null);
  const shortcutsRef = useRef<Map<string, { handler: () => void; description?: string }>>(new Map());
  const focusTracker = useRef<string[]>([]);

  // Détection automatique des préférences système
  useEffect(() => {
    // Détection du mode sombre/contraste élevé
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, highContrast: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handleContrastChange);
    setConfig(prev => ({ ...prev, highContrast: mediaQuery.matches }));

    // Détection de la préférence pour la réduction de mouvement
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    motionQuery.addEventListener('change', handleMotionChange);
    setConfig(prev => ({ ...prev, reducedMotion: motionQuery.matches }));

    return () => {
      mediaQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Application des styles d'accessibilité au document
  useEffect(() => {
    const root = document.documentElement;
    
    // Application du contraste élevé
    if (config.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Application de la taille de police
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${config.fontSize}`);

    // Application de la réduction de mouvement
    if (config.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus visible amélioré
    if (config.keyboardNavigation) {
      root.classList.add('keyboard-nav');
    } else {
      root.classList.remove('keyboard-nav');
    }

  }, [config.highContrast, config.fontSize, config.reducedMotion, config.keyboardNavigation]);

  // Mise à jour de la configuration
  const updateConfig = useCallback((updates: Partial<AccessibilityConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    
    // Sauvegarder dans localStorage pour persistance
    const newConfig = { ...config, ...updates };
    localStorage.setItem('accessibility-config', JSON.stringify(newConfig));
  }, [config]);

  // Annonce pour les lecteurs d'écran
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!config.announceChanges) return;

    // Créer un élément d'annonce temporaire
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Nettoyer après l'annonce
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    // Log pour le développement
    console.log(`[Accessibility] Announced: ${message}`);
  }, [config.announceChanges]);

  // Focus programmé sur un élément
  const focusElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      
      // Ajouter à l'historique de focus
      focusTracker.current.push(elementId);
      if (focusTracker.current.length > 10) {
        focusTracker.current.shift();
      }
      
      announceToScreenReader(`Focus sur ${element.getAttribute('aria-label') || elementId}`);
    }
  }, [announceToScreenReader]);

  // Enregistrement de raccourcis clavier
  const registerShortcut = useCallback((key: string, handler: () => void, description?: string) => {
    shortcutsRef.current.set(key, { handler, description });
  }, []);

  // Désenregistrement de raccourcis clavier
  const unregisterShortcut = useCallback((key: string) => {
    shortcutsRef.current.delete(key);
  }, []);

  // Gestionnaire global des raccourcis clavier
  useEffect(() => {
    if (!config.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Construction de la clé du raccourci
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.altKey) modifiers.push('alt');
      if (event.shiftKey) modifiers.push('shift');
      if (event.metaKey) modifiers.push('meta');
      
      const key = [...modifiers, event.key.toLowerCase()].join('+');
      
      // Vérifier si un raccourci est enregistré
      const shortcut = shortcutsRef.current.get(key);
      if (shortcut) {
        event.preventDefault();
        shortcut.handler();
        announceToScreenReader(`Raccourci activé: ${shortcut.description || key}`);
      }

      // Raccourcis globaux d'accessibilité
      switch (key) {
        case 'alt+a':
          event.preventDefault();
          announceCurrentFocus();
          break;
        case 'alt+h':
          event.preventDefault();
          showShortcutsHelp();
          break;
        case 'alt+s':
          event.preventDefault();
          skipToMainContent();
          break;
      }
    };

    // Fonction pour annoncer l'élément actuellement focus
    const announceCurrentFocus = () => {
      const activeElement = document.activeElement;
      if (activeElement) {
        const label = activeElement.getAttribute('aria-label') || 
                     activeElement.getAttribute('title') || 
                     activeElement.textContent || 
                     'Élément sans label';
        announceToScreenReader(`Focus actuel: ${label}`);
      }
    };

    // Fonction pour afficher l'aide des raccourcis
    const showShortcutsHelp = () => {
      const shortcuts = Array.from(shortcutsRef.current.entries())
        .map(([key, { description }]) => `${key}: ${description || 'Action personnalisée'}`)
        .join(', ');
      
      const globalShortcuts = [
        'Alt+A: Annoncer l\'élément actuel',
        'Alt+H: Afficher cette aide',
        'Alt+S: Aller au contenu principal'
      ].join(', ');
      
      announceToScreenReader(`Raccourcis disponibles: ${globalShortcuts}, ${shortcuts}`, 'assertive');
    };

    // Fonction pour aller au contenu principal
    const skipToMainContent = () => {
      const main = document.querySelector('main, [role="main"]') as HTMLElement;
      if (main) {
        main.focus();
        announceToScreenReader('Navigation vers le contenu principal');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [config.keyboardNavigation, announceToScreenReader]);

  // Chargement de la configuration depuis localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('accessibility-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erreur lors du chargement de la configuration d\'accessibilité:', error);
      }
    }
  }, []);

  // Valeur du contexte
  const contextValue: AccessibilityContextType = {
    config,
    updateConfig,
    announceToScreenReader,
    focusElement,
    registerShortcut,
    unregisterShortcut,
    isHighContrast: config.highContrast,
    fontSize: config.fontSize,
    reducedMotion: config.reducedMotion
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Région pour les annonces de lecteur d'écran */}
      <div
        ref={announceRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      
      {/* Lien de saut vers le contenu principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        onFocus={() => announceToScreenReader('Lien de saut vers le contenu principal')}
      >
        Aller au contenu principal
      </a>
      
      {children}
      
      {/* Styles d'accessibilité intégrés */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .high-contrast {
          filter: contrast(150%) saturate(150%);
        }
        
        .font-small { font-size: 14px; }
        .font-medium { font-size: 16px; }
        .font-large { font-size: 18px; }
        .font-extra-large { font-size: 20px; }
        
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .keyboard-nav *:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .keyboard-nav button:focus,
        .keyboard-nav input:focus,
        .keyboard-nav select:focus,
        .keyboard-nav textarea:focus,
        .keyboard-nav [tabindex]:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </AccessibilityContext.Provider>
  );
}

// Hook pour les raccourcis clavier dans les composants
export function useKeyboardShortcuts(shortcuts: Record<string, { handler: () => void; description?: string }>) {
  const { registerShortcut, unregisterShortcut } = useAccessibility();

  useEffect(() => {
    // Enregistrer tous les raccourcis
    Object.entries(shortcuts).forEach(([key, { handler, description }]) => {
      registerShortcut(key, handler, description);
    });

    // Nettoyer lors du démontage
    return () => {
      Object.keys(shortcuts).forEach(key => {
        unregisterShortcut(key);
      });
    };
  }, [shortcuts, registerShortcut, unregisterShortcut]);
}

// Hook pour les annonces automatiques
export function useScreenReaderAnnouncements() {
  const { announceToScreenReader } = useAccessibility();

  const announceNavigation = useCallback((from: string, to: string) => {
    announceToScreenReader(`Navigation de ${from} vers ${to}`);
  }, [announceToScreenReader]);

  const announceDataLoad = useCallback((itemCount: number, itemType: string) => {
    announceToScreenReader(`${itemCount} ${itemType}${itemCount > 1 ? 's' : ''} chargé${itemCount > 1 ? 's' : ''}`);
  }, [announceToScreenReader]);

  const announceError = useCallback((error: string) => {
    announceToScreenReader(`Erreur: ${error}`, 'assertive');
  }, [announceToScreenReader]);

  const announceSuccess = useCallback((message: string) => {
    announceToScreenReader(`Succès: ${message}`);
  }, [announceToScreenReader]);

  return {
    announceNavigation,
    announceDataLoad,
    announceError,
    announceSuccess,
    announce: announceToScreenReader
  };
}

// Composant de paramètres d'accessibilité
export function AccessibilitySettings() {
  const { config, updateConfig } = useAccessibility();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200" role="region" aria-labelledby="accessibility-settings">
      <h2 id="accessibility-settings" className="text-lg font-semibold text-gray-900">
        Paramètres d'accessibilité
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="announce-changes" className="text-sm font-medium text-gray-700">
            Annonces pour lecteurs d'écran
          </label>
          <input
            id="announce-changes"
            type="checkbox"
            checked={config.announceChanges}
            onChange={(e) => updateConfig({ announceChanges: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
            Contraste élevé
          </label>
          <input
            id="high-contrast"
            type="checkbox"
            checked={config.highContrast}
            onChange={(e) => updateConfig({ highContrast: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="keyboard-nav" className="text-sm font-medium text-gray-700">
            Navigation clavier
          </label>
          <input
            id="keyboard-nav"
            type="checkbox"
            checked={config.keyboardNavigation}
            onChange={(e) => updateConfig({ keyboardNavigation: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="font-size" className="text-sm font-medium text-gray-700">
            Taille de police
          </label>
          <select
            id="font-size"
            value={config.fontSize}
            onChange={(e) => updateConfig({ fontSize: e.target.value as any })}
            className="w-full rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="small">Petite</option>
            <option value="medium">Moyenne</option>
            <option value="large">Grande</option>
            <option value="extra-large">Très grande</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700">
            Réduire les animations
          </label>
          <input
            id="reduced-motion"
            type="checkbox"
            checked={config.reducedMotion}
            onChange={(e) => updateConfig({ reducedMotion: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Raccourcis clavier globaux</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Alt + A : Annoncer l'élément actuel</div>
          <div>Alt + H : Afficher l'aide des raccourcis</div>
          <div>Alt + S : Aller au contenu principal</div>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityProvider;
