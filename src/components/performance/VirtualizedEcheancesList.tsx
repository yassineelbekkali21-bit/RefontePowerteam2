/**
 * Liste virtualisée d'échéances pour optimiser les performances
 * Utilise react-window pour gérer efficacement de grandes listes
 */

import React, { memo, useMemo, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Users,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Echeance, StatutEcheance, NiveauUrgence } from '@/types/echeances';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

// Interface pour les props du composant de liste
interface VirtualizedEcheancesListProps {
  echeances: Echeance[];
  height: number;
  itemHeight?: number;
  onEcheanceClick?: (echeance: Echeance) => void;
  onWorkflowAction?: (action: string, echeanceId: string) => void;
  selectedEcheanceId?: string;
  className?: string;
  enableAnimation?: boolean;
}

// Interface pour les props de l'élément de liste
interface EcheanceItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    echeances: Echeance[];
    onEcheanceClick?: (echeance: Echeance) => void;
    onWorkflowAction?: (action: string, echeanceId: string) => void;
    selectedEcheanceId?: string;
    enableAnimation: boolean;
    announceToScreenReader: (message: string) => void;
  };
}

// Configuration pour les couleurs de statut
const statusConfig = {
  [StatutEcheance.PENDING]: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock
  },
  [StatutEcheance.IN_PROGRESS]: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Play
  },
  [StatutEcheance.COMPLETED]: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  },
  [StatutEcheance.OVERDUE]: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle
  },
  [StatutEcheance.UNDER_REVIEW]: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Clock
  },
  [StatutEcheance.CANCELLED]: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: MoreHorizontal
  }
};

/**
 * Composant mémoïsé pour un élément d'échéance individuel
 */
const EcheanceItem = memo<EcheanceItemProps>(({ index, style, data }) => {
  const {
    echeances,
    onEcheanceClick,
    onWorkflowAction,
    selectedEcheanceId,
    enableAnimation,
    announceToScreenReader
  } = data;

  const echeance = echeances[index];
  
  if (!echeance) {
    return <div style={style} />;
  }

  const isSelected = selectedEcheanceId === echeance.id;
  const statusInfo = statusConfig[echeance.statut];
  const StatusIcon = statusInfo.icon;

  // Calcul du temps jusqu'à l'échéance
  const getDaysUntilDeadline = (dateEcheance: Date): { days: number; status: 'safe' | 'warning' | 'critical' } => {
    const now = new Date();
    const deadline = new Date(dateEcheance);
    const diffTime = deadline.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (days < 0) status = 'critical';
    else if (days <= 1) status = 'critical';
    else if (days <= 3) status = 'warning';
    
    return { days: Math.max(0, days), status };
  };

  const timeInfo = getDaysUntilDeadline(echeance.dateEcheance);

  // Gestionnaire de clic optimisé
  const handleClick = useCallback(() => {
    onEcheanceClick?.(echeance);
    announceToScreenReader(`Échéance sélectionnée: ${echeance.nom} pour ${echeance.clientNom}`);
  }, [echeance, onEcheanceClick, announceToScreenReader]);

  // Gestionnaire d'action workflow optimisé
  const handleWorkflowAction = useCallback((action: string) => {
    onWorkflowAction?.(action, echeance.id);
    announceToScreenReader(`Action ${action} sur ${echeance.nom}`);
  }, [echeance.id, echeance.nom, onWorkflowAction, announceToScreenReader]);

  // Gestionnaire de clavier
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleClick();
        break;
      case 's':
        if (echeance.statut === StatutEcheance.PENDING) {
          event.preventDefault();
          handleWorkflowAction('start');
        }
        break;
      case 'p':
        if (echeance.statut === StatutEcheance.IN_PROGRESS) {
          event.preventDefault();
          handleWorkflowAction('pause');
        }
        break;
      case 'c':
        if (echeance.statut === StatutEcheance.IN_PROGRESS) {
          event.preventDefault();
          handleWorkflowAction('complete');
        }
        break;
    }
  }, [echeance.statut, handleClick, handleWorkflowAction]);

  const itemContent = (
    <div
      className={`
        group cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all duration-200
        hover:shadow-md hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500
        ${isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200'}
        ${timeInfo.status === 'critical' ? 'border-l-4 border-l-red-500' : ''}
        ${timeInfo.status === 'warning' ? 'border-l-4 border-l-orange-500' : ''}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Échéance ${echeance.nom} pour ${echeance.clientNom}, statut: ${echeance.statut}`}
      aria-selected={isSelected}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Informations principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate text-sm">{echeance.nom}</h3>
            <Badge className={`${statusInfo.color} text-xs`} variant="outline">
              <StatusIcon className="w-3 h-3 mr-1" />
              {echeance.statut}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-2 truncate">{echeance.clientNom}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
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
              {timeInfo.days}j
            </span>

            {echeance.responsablePrincipal && (
              <span className="flex items-center gap-1 truncate">
                <Users className="w-3 h-3" />
                {echeance.responsablePrincipal}
              </span>
            )}
          </div>

          {/* Barre de progression compacte */}
          {echeance.progression !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progression</span>
                <span className="font-medium">{echeance.progression}%</span>
              </div>
              <Progress value={echeance.progression} className="h-1.5" />
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {echeance.statut === StatutEcheance.PENDING && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleWorkflowAction('start');
              }}
              className="h-6 w-6 p-0"
              title="Démarrer (S)"
            >
              <Play className="w-3 h-3" />
            </Button>
          )}

          {echeance.statut === StatutEcheance.IN_PROGRESS && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWorkflowAction('pause');
                }}
                className="h-6 w-6 p-0"
                title="Pause (P)"
              >
                <Pause className="w-3 h-3" />
              </Button>
              
              {echeance.progression >= 90 && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkflowAction('complete');
                  }}
                  className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                  title="Terminer (C)"
                >
                  <CheckCircle2 className="w-3 h-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={style} className="px-2 py-1">
      {enableAnimation ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.02 }}
        >
          {itemContent}
        </motion.div>
      ) : (
        itemContent
      )}
    </div>
  );
}, areEqual);

EcheanceItem.displayName = 'EcheanceItem';

/**
 * Interface pour la référence de la liste
 */
export interface VirtualizedEcheancesListRef {
  scrollToItem: (index: number, align?: 'auto' | 'smart' | 'center' | 'end' | 'start') => void;
  scrollToTop: () => void;
  getVisibleRange: () => [number, number] | null;
}

/**
 * Composant principal de liste virtualisée
 */
const VirtualizedEcheancesList = forwardRef<VirtualizedEcheancesListRef, VirtualizedEcheancesListProps>(
  ({
    echeances,
    height,
    itemHeight = 140,
    onEcheanceClick,
    onWorkflowAction,
    selectedEcheanceId,
    className = '',
    enableAnimation = false
  }, ref) => {
    const listRef = useRef<List>(null);
    const { announceToScreenReader } = useAccessibility();

    // Données mémoïsées pour éviter les re-renders inutiles
    const itemData = useMemo(() => ({
      echeances,
      onEcheanceClick,
      onWorkflowAction,
      selectedEcheanceId,
      enableAnimation,
      announceToScreenReader
    }), [echeances, onEcheanceClick, onWorkflowAction, selectedEcheanceId, enableAnimation, announceToScreenReader]);

    // Exposition des méthodes de contrôle via ref
    useImperativeHandle(ref, () => ({
      scrollToItem: (index: number, align = 'auto') => {
        listRef.current?.scrollToItem(index, align);
      },
      scrollToTop: () => {
        listRef.current?.scrollToItem(0, 'start');
      },
      getVisibleRange: () => {
        // Cette méthode devrait être exposée par react-window mais ne l'est pas directement
        // On peut l'implémenter en utilisant les callbacks de la liste
        return null;
      }
    }), []);

    // Gestionnaire de scroll optimisé
    const handleScroll = useCallback(({ scrollDirection, scrollOffset }: { scrollDirection: 'forward' | 'backward'; scrollOffset: number }) => {
      // Optionnel: logique personnalisée lors du scroll
      // Par exemple, précharger des données ou mettre à jour l'état
    }, []);

    // Rendu conditionnel si pas d'échéances
    if (echeances.length === 0) {
      return (
        <Card className={className}>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune échéance</h3>
            <p className="text-gray-500">Aucune échéance à afficher pour le moment.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div 
        className={`${className} border border-gray-200 rounded-lg overflow-hidden`}
        role="grid"
        aria-label={`Liste de ${echeances.length} échéances`}
        aria-rowcount={echeances.length}
      >
        <List
          ref={listRef}
          height={height}
          itemCount={echeances.length}
          itemSize={itemHeight}
          itemData={itemData}
          onScroll={handleScroll}
          overscanCount={5} // Pré-rendre 5 éléments supplémentaires pour la fluidité
        >
          {EcheanceItem}
        </List>
      </div>
    );
  }
);

VirtualizedEcheancesList.displayName = 'VirtualizedEcheancesList';

// Hook personnalisé pour la gestion optimisée des échéances virtualisées
export function useVirtualizedEcheances(echeances: Echeance[]) {
  // Tri optimisé des échéances
  const sortedEcheances = useMemo(() => {
    return [...echeances].sort((a, b) => {
      // Priorité par urgence
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
  }, [echeances]);

  // Index des échéances par ID pour un accès rapide
  const echeanceIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedEcheances.forEach((echeance, index) => {
      map.set(echeance.id, index);
    });
    return map;
  }, [sortedEcheances]);

  // Fonction pour trouver l'index d'une échéance
  const getEcheanceIndex = useCallback((echeanceId: string): number => {
    return echeanceIndexMap.get(echeanceId) ?? -1;
  }, [echeanceIndexMap]);

  // Statistiques rapides
  const stats = useMemo(() => {
    const total = sortedEcheances.length;
    const critical = sortedEcheances.filter(e => {
      const days = Math.ceil((new Date(e.dateEcheance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days <= 1 && e.statut !== StatutEcheance.COMPLETED;
    }).length;
    
    const inProgress = sortedEcheances.filter(e => e.statut === StatutEcheance.IN_PROGRESS).length;
    const completed = sortedEcheances.filter(e => e.statut === StatutEcheance.COMPLETED).length;
    
    return { total, critical, inProgress, completed };
  }, [sortedEcheances]);

  return {
    sortedEcheances,
    getEcheanceIndex,
    stats
  };
}

export default VirtualizedEcheancesList;
