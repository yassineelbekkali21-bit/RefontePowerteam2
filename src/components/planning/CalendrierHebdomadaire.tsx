/**
 * Calendrier Hebdomadaire Intelligent
 * Planification des tâches par jour avec gestion de la capacité
 */

import React, { useState, useMemo } from 'react';
import { usePlanning, type TachePlanifiee, type EvenementPlanifie } from '@/contexts/PlanningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModalDepassementCapacite from './ModalDepassementCapacite';
import ModalModificationTache from './ModalModificationTache';
import SelecteurCollaborateurs from './SelecteurCollaborateurs';
import { TeamsService } from '@/services/teamsService';

import {
  Calendar,
  Clock,
  AlertTriangle,
  Edit3,
  Video,
  CheckCircle,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  RotateCcw,
  Zap
} from 'lucide-react';

// Configuration des collaborateurs et leurs capacités
const collaborateurs = [
  { nom: 'BRUNO', couleur: 'bg-blue-500', capaciteJour: 3.5 },
  { nom: 'OLIVIER', couleur: 'bg-green-500', capaciteJour: 3.5 },
  { nom: 'MARIE', couleur: 'bg-purple-500', capaciteJour: 3.5 },
  { nom: 'SARAH', couleur: 'bg-pink-500', capaciteJour: 3.5 },
  { nom: 'PIERRE', couleur: 'bg-orange-500', capaciteJour: 3.5 },
  { nom: 'JULIE', couleur: 'bg-cyan-500', capaciteJour: 3.5 }
];

// Alias pour simplifier
type TacheCalendrier = TachePlanifiee;

// Interface pour le planning d'un jour
interface PlanningJour {
  date: string;
  taches: TacheCalendrier[];
  evenements: EvenementPlanifie[];
  chargeTotal: number;
  capaciteMax: number;
  collaborateur: string;
}

// Utilitaires pour les dates
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
  return new Date(d.setDate(diff));
};

const getWeekDays = (startDate: Date): Date[] => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  return days;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatDateFr = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short' 
  });
};

// Utilitaires pour la vue mensuelle
const getStartOfMonth = (date: Date): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getEndOfMonth = (date: Date): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

const getMonthDays = (date: Date): Date[] => {
  const startOfMonth = getStartOfMonth(date);
  const endOfMonth = getEndOfMonth(date);
  const startOfWeek = getStartOfWeek(startOfMonth);
  
  const days = [];
  const current = new Date(startOfWeek);
  
  // Générer 6 semaines (42 jours) pour couvrir tout le mois
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
    
    // Arrêter si on a dépassé le mois et qu'on est sur un dimanche
    if (current > endOfMonth && current.getDay() === 1) {
      break;
    }
  }
  
  return days;
};

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  });
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

// Estimation de durée par type de tâche
const getDureeEstimee = (type: string): number => {
  switch (type) {
    case 'TVA': return 1.5;
    case 'IPP': return 2;
    case 'ISOC': return 2.5;
    case 'CLOTURE': return 4;
    case 'SITUATION_INTERMEDIAIRE': return 1;
    case 'VERSEMENTS_ANTICIPES': return 0.5;
    case 'COMPLEMENTAIRE': return 2;
    default: return 2;
  }
};

export default function CalendrierHebdomadaire() {
    const { 
    tachesPlanifiees,
    evenementsPlanifies,
    planifierTache, 
    retirerTacheDuCalendrier,
    modifierDureeTache,
    ajouterEvenements
  } = usePlanning();
  
  // États du calendrier
  const [semaineCourante, setSemaineCourante] = useState(new Date());
  const [collaborateursSelectionnes, setCollaborateursSelectionnes] = useState<string[]>(['all']);
  const [vueCalendrier, setVueCalendrier] = useState<'hebdomadaire' | 'mensuelle'>('hebdomadaire');
  
  // États pour le modal de dépassement
  const [modalDepassement, setModalDepassement] = useState({
    isOpen: false,
    tache: null as TacheCalendrier | null,
    jour: '',
    planning: null as any
  });

  // États pour le modal de modification/création
  const [modalModification, setModalModification] = useState({
    isOpen: false,
    mode: 'modifier' as 'modifier' | 'creer-reunion',
    tache: null as TacheCalendrier | null,
    jour: ''
  });

  // Calcul des jours de la semaine ou du mois
  const joursCalendrier = useMemo(() => {
    if (vueCalendrier === 'mensuelle') {
      return getMonthDays(semaineCourante);
    } else {
      const startDate = getStartOfWeek(semaineCourante);
      return getWeekDays(startDate);
    }
  }, [semaineCourante, vueCalendrier]);

  // Fonction helper pour vérifier si un collaborateur est sélectionné
  const estCollaborateurSelectionne = (responsable: string): boolean => {
    return collaborateursSelectionnes.includes('all') || 
           collaborateursSelectionnes.includes(responsable);
  };

  // Tâches disponibles à planifier (pas encore dans le calendrier)
  const tachesDisponibles = useMemo(() => {
    return tachesPlanifiees
      .filter(t => 
        estCollaborateurSelectionne(t.responsable) && 
        !t.jour // Pas encore planifiée dans le calendrier
      )
      .map(t => ({
        ...t,
        dureeEstimee: t.dureeEstimee || getDureeEstimee(t.type)
      }));
  }, [tachesPlanifiees, collaborateursSelectionnes]);

  // Tâches déjà planifiées dans le calendrier
  const tachesPlanifieesCalendrier = useMemo(() => {
    return tachesPlanifiees
      .filter(t => 
        estCollaborateurSelectionne(t.responsable) && 
        t.jour // Déjà planifiée dans le calendrier
      )
      .map(t => ({
        ...t,
        dureeEstimee: t.dureeEstimee || getDureeEstimee(t.type)
      }));
  }, [tachesPlanifiees, collaborateursSelectionnes]);

  // Planning par jour pour le collaborateur sélectionné
  const planningHebdomadaire = useMemo(() => {
    const planning: { [key: string]: PlanningJour } = {};
    
    joursCalendrier.forEach(jour => {
      const dateStr = formatDate(jour);
      
      // Tâches planifiées pour ce jour
      const tachesDuJour = tachesPlanifieesCalendrier.filter(t => t.jour === dateStr);
      
      // Événements pour ce jour et ce collaborateur
      const evenementsDuJour = evenementsPlanifies.filter(e => 
        e.date === dateStr && 
        (collaborateursSelectionnes.includes('all') || 
         e.participants.some(p => collaborateursSelectionnes.includes(p)) || 
         e.participants.includes('TOUS'))
      );
      
      const chargeTaches = tachesDuJour.reduce((acc, t) => acc + (t.dureeEstimee || 0), 0);
      const chargeEvenements = evenementsDuJour.reduce((acc, e) => acc + e.dureeEstimee, 0);
      const chargeTotal = chargeTaches + chargeEvenements;
      
      // Calculer la capacité maximale selon la sélection
      const capaciteMax = collaborateursSelectionnes.includes('all') 
        ? collaborateurs.reduce((total, c) => total + c.capaciteJour, 0) // Capacité totale
        : collaborateursSelectionnes.reduce((total, nom) => {
            const collab = collaborateurs.find(c => c.nom === nom);
            return total + (collab?.capaciteJour || 0);
          }, 0) || 3.5; // Fallback si aucun collaborateur sélectionné
      
      planning[dateStr] = {
        date: dateStr,
        taches: tachesDuJour,
        evenements: evenementsDuJour,
        chargeTotal,
        capaciteMax,
        collaborateur: collaborateursSelectionnes.includes('all') ? 'all' : collaborateursSelectionnes.join(', ')
      };
    });
    
    return planning;
  }, [joursCalendrier, tachesPlanifieesCalendrier, evenementsPlanifies, collaborateursSelectionnes]);

  // Fonctions de gestion
  const ajouterTacheAuJour = (tache: TacheCalendrier, jour: string) => {
    const planning = planningHebdomadaire[jour];
    if (!planning) return;

    // Vérifier la capacité (sauf si urgent et deadline demain)
    const isUrgentDemain = tache.urgence === 'urgent' && 
      new Date(tache.dateEcheance).getTime() - new Date().getTime() <= 24 * 60 * 60 * 1000;
    
    const dureeEstimee = tache.dureeEstimee || getDureeEstimee(tache.type);
    
    // Si dépassement et pas urgent demain, ouvrir le modal
    if (!isUrgentDemain && planning.chargeTotal + dureeEstimee > planning.capaciteMax) {
      setModalDepassement({
        isOpen: true,
        tache: { ...tache, dureeEstimee },
        jour,
        planning: {
          date: jour,
          chargeActuelle: planning.chargeTotal,
          capaciteMax: planning.capaciteMax,
          nombreTaches: planning.taches.length
        }
      });
      return;
    }

    // Utiliser le contexte pour planifier la tâche
    planifierTache(tache.id, jour);
  };

  const retirerTacheDuJour = (tacheId: string) => {
    // Utiliser le contexte pour retirer la tâche du calendrier
    retirerTacheDuCalendrier(tacheId);
  };

  // Gestion du modal de dépassement
  const fermerModalDepassement = () => {
    setModalDepassement({
      isOpen: false,
      tache: null,
      jour: '',
      planning: null
    });
  };

  const confirmerAjoutAvecDepassement = (nouvelleDuree: number) => {
    if (modalDepassement.tache && modalDepassement.jour) {
      // Planifier la tâche avec la nouvelle durée
      planifierTache(modalDepassement.tache.id, modalDepassement.jour, nouvelleDuree);
    }
  };

  // Gestion du modal de modification
  const ouvrirModalModification = (tache: TacheCalendrier, jour?: string) => {
    setModalModification({
      isOpen: true,
      mode: 'modifier',
      tache,
      jour: jour || ''
    });
  };

  const ouvrirModalCreationReunion = (jour: string) => {
    setModalModification({
      isOpen: true,
      mode: 'creer-reunion',
      tache: null,
      jour
    });
  };

  const fermerModalModification = () => {
    setModalModification({
      isOpen: false,
      mode: 'modifier',
      tache: null,
      jour: ''
    });
  };

  const confirmerModificationTache = (tacheId: string, nouvelleDuree: number) => {
    modifierDureeTache(tacheId, nouvelleDuree);
  };

  const confirmerCreationReunion = async (reunionData: any, jour: string) => {
    try {
      // Créer l'événement
      const nouvelEvenement: EvenementPlanifie = {
        id: `reunion-${Date.now()}`,
        titre: reunionData.titre,
        type: 'reunion',
        typeReunion: reunionData.typeReunion,
        date: jour,
        heureDebut: '09:00', // Par défaut, à améliorer avec un time picker
        heureFin: `${9 + reunionData.duree}:00`,
        participants: reunionData.participants,
        lieu: reunionData.lieu,
        description: reunionData.description,
        dureeEstimee: reunionData.duree,
        clientEmail: reunionData.clientEmail,
        invitationEnvoyee: false
      };

      // Ajouter au contexte
      ajouterEvenements([nouvelEvenement]);

      // Envoyer l'invitation si demandée
      if (reunionData.envoyerInvitation && reunionData.typeReunion === 'client') {
        const teamsService = TeamsService.getInstance();
        const dateDebut = new Date(`${jour}T09:00:00`);
        const dateFin = new Date(dateDebut.getTime() + reunionData.duree * 60 * 60 * 1000);

        const invitation = {
          titre: reunionData.titre,
          description: reunionData.description,
          dateDebut,
          dateFin,
          participants: reunionData.participants,
          lieu: reunionData.lieu,
          organisateur: 'cabinet@ysn.com' // À personnaliser
        };

        const resultat = await teamsService.envoyerInvitation(invitation);
        
        if (resultat.success) {
          // Mettre à jour l'événement avec le lien Teams
          const evenementMisAJour = {
            ...nouvelEvenement,
            lienTeams: resultat.lienReunion,
            invitationEnvoyee: true
          };
          
          // Re-ajouter avec les infos mises à jour
          ajouterEvenements([evenementMisAJour]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réunion:', error);
    }
  };

  // Planification automatique intelligente
  const planifierAutomatiquement = () => {
    const tachesAPlannifier = [...tachesDisponibles];
    
    // Trier par urgence et échéance
    tachesAPlannifier.sort((a, b) => {
      const urgenceOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const urgenceA = urgenceOrder[a.urgence] || 1;
      const urgenceB = urgenceOrder[b.urgence] || 1;
      
      if (urgenceA !== urgenceB) return urgenceB - urgenceA;
      return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime();
    });

    // Planifier chaque tâche sur le premier jour disponible
    for (const tache of tachesAPlannifier) {
      let planifiee = false;
      
      for (const jour of joursCalendrier.slice(0, 5)) { // Lun-Ven seulement
        const dateStr = formatDate(jour);
        const planning = planningHebdomadaire[dateStr];
        
        if (!planning) continue;
        
        // Vérifier si on peut ajouter cette tâche
        const isUrgentDemain = tache.urgence === 'urgent' && 
          new Date(tache.dateEcheance).getTime() - new Date().getTime() <= 24 * 60 * 60 * 1000;
        
        const dureeEstimee = tache.dureeEstimee || getDureeEstimee(tache.type);
        const capaciteMax = planning.capaciteMax;
        const peutAjouter = isUrgentDemain || (planning.chargeTotal + dureeEstimee <= capaciteMax);
        
        if (peutAjouter) {
          planifierTache(tache.id, dateStr);
          planifiee = true;
          break;
        }
      }
      
      if (!planifiee) {
        console.warn(`Impossible de planifier la tâche: ${tache.nom}`);
      }
    }
  };

  const changerSemaine = (direction: 'prev' | 'next') => {
    const nouvelleSemaine = new Date(semaineCourante);
    nouvelleSemaine.setDate(semaineCourante.getDate() + (direction === 'next' ? 7 : -7));
    setSemaineCourante(nouvelleSemaine);
  };

  const changerMois = (direction: 'prev' | 'next') => {
    const nouveauMois = new Date(semaineCourante);
    nouveauMois.setMonth(semaineCourante.getMonth() + (direction === 'next' ? 1 : -1));
    setSemaineCourante(nouveauMois);
  };

  const changerPeriode = (direction: 'prev' | 'next') => {
    if (vueCalendrier === 'mensuelle') {
      changerMois(direction);
    } else {
      changerSemaine(direction);
    }
  };

  // Calcul des statistiques
  const statistiques = useMemo(() => {
    const totalTaches = tachesPlanifieesCalendrier.length;
    const totalEvenements = evenementsPlanifies.filter(e => 
      collaborateursSelectionnes.includes('all') ||
      e.participants.some(p => collaborateursSelectionnes.includes(p)) || 
      e.participants.includes('TOUS')
    ).length;
    
    const totalHeures = Object.values(planningHebdomadaire)
      .reduce((acc, p) => acc + p.chargeTotal, 0);
    
    const joursUtilises = Object.values(planningHebdomadaire)
      .filter(p => p.taches.length > 0 || p.evenements.length > 0).length;
    
    const capaciteTotale = collaborateursSelectionnes.includes('all') 
      ? 5 * collaborateurs.reduce((total, c) => total + c.capaciteJour, 0) // 5 jours × capacité totale
      : 5 * collaborateursSelectionnes.reduce((total, nom) => {
          const collab = collaborateurs.find(c => c.nom === nom);
          return total + (collab?.capaciteJour || 0);
        }, 0) || 5 * 3.5; // Fallback
    
    return {
      totalTaches,
      totalEvenements,
      totalHeures,
      joursUtilises,
      capaciteTotale,
      tauxUtilisation: Math.round((totalHeures / capaciteTotale) * 100)
    };
  }, [tachesPlanifieesCalendrier, evenementsPlanifies, planningHebdomadaire, collaborateursSelectionnes]);

  // Couleur selon le niveau d'urgence
  const getCouleurUrgence = (urgence: string) => {
    switch (urgence) {
      case 'urgent': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  // Rendu d'une tâche disponible
  const renderTacheDisponible = (tache: TacheCalendrier) => (
    <div
      key={tache.id}
      className={`p-3 rounded-lg border-2 border-dashed cursor-move transition-all hover:shadow-md ${getCouleurUrgence(tache.urgence)}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify(tache));
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{tache.nom}</h4>
        <Badge variant="outline" className="text-xs">{tache.type}</Badge>
      </div>
      <p className="text-xs text-gray-600 mb-1">{tache.clientNom}</p>
      <div className="flex items-center gap-2 text-xs flex-wrap mb-1">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{tache.dureeEstimee}h</span>
        </div>
        {collaborateursSelectionnes.includes('all') && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{tache.responsable}</span>
          </div>
        )}
        {tache.urgence === 'urgent' && <Zap className="w-3 h-3 text-red-500" />}
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>Échéance: {new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}</span>
      </div>
    </div>
  );

  // Rendu d'une tâche planifiée
  const renderTachePlanifiee = (tache: TacheCalendrier) => (
    <div
      key={tache.id}
      className={`p-2 rounded border-l-4 ${getCouleurUrgence(tache.urgence)} bg-white shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-xs">{tache.nom}</h5>
          <p className="text-xs text-gray-500">{tache.clientNom}</p>
          
          {/* Type de travail */}
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <User className="w-3 h-3" />
            <span>Travail individuel</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 mb-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{tache.dureeEstimee || getDureeEstimee(tache.type)}h</span>
            </div>
            {(collaborateursSelectionnes.includes('all') || collaborateursSelectionnes.length > 1) && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{tache.responsable}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Échéance: {new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
            onClick={() => ouvrirModalModification(tache, tache.jour)}
            title="Modifier la durée"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={() => retirerTacheDuJour(tache.id)}
            title="Retirer du planning"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Rendu d'un événement planifié
  const renderEvenementPlanifie = (evenement: EvenementPlanifie) => {
    const getIconeTypeReunion = () => {
      switch (evenement.typeReunion) {
        case 'client': return '🤝';
        case 'interne': return '🏢';
        case 'externe': return '🌐';
        default: return '📅';
      }
    };

    const getCouleurTypeReunion = () => {
      switch (evenement.typeReunion) {
        case 'client': return 'border-l-blue-500 bg-blue-50';
        case 'interne': return 'border-l-green-500 bg-green-50';
        case 'externe': return 'border-l-orange-500 bg-orange-50';
        default: return 'border-l-purple-500 bg-purple-50';
      }
    };

    return (
      <div
        key={evenement.id}
        className={`p-2 rounded border-l-4 ${getCouleurTypeReunion()} shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">{getIconeTypeReunion()}</span>
              <h5 className="font-medium text-xs">{evenement.titre}</h5>
            </div>
            
            {/* Type de travail - Réunion */}
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
              <Video className="w-3 h-3" />
              <span>Réunion {evenement.typeReunion || 'client'}</span>
              {evenement.invitationEnvoyee && (
                <Badge variant="outline" className="text-xs h-4 px-1 bg-green-50 text-green-600 border-green-200">
                  ✓ Envoyée
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{evenement.heureDebut} - {evenement.heureFin}</span>
              <span>({evenement.dureeEstimee}h)</span>
            </div>
            
            {evenement.participants && evenement.participants.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Users className="w-3 h-3" />
                <span>{evenement.participants.length} participant{evenement.participants.length > 1 ? 's' : ''}</span>
              </div>
            )}

            {evenement.lieu && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <span>📍 {evenement.lieu}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {evenement.lienTeams && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                onClick={() => window.open(evenement.lienTeams, '_blank')}
                title="Rejoindre Teams"
              >
                <Video className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={() => {/* TODO: Supprimer événement */}}
              title="Supprimer événement"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Rendu d'un jour du calendrier (vue hebdomadaire)
  const renderJourCalendrier = (jour: Date) => {
    const dateStr = formatDate(jour);
    const planning = planningHebdomadaire[dateStr];
    const tauxUtilisation = (planning.chargeTotal / planning.capaciteMax) * 100;
    const isWeekend = jour.getDay() === 0 || jour.getDay() === 6;

    return (
      <Card 
        key={dateStr}
        className={`min-h-[200px] ${isWeekend ? 'bg-gray-50' : 'bg-white'} transition-all hover:shadow-md`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (isWeekend) return; // Pas de planification le weekend
          
          const tacheData = e.dataTransfer.getData('application/json');
          if (tacheData) {
            const tache = JSON.parse(tacheData);
            ajouterTacheAuJour(tache, dateStr);
          }
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                {formatDateFr(jour)}
              </CardTitle>
              <p className="text-xs text-gray-500">
                {planning.chargeTotal.toFixed(1)}h / {planning.capaciteMax}h
              </p>
            </div>
            {!isWeekend && (
              <Badge 
                variant={tauxUtilisation > 100 ? 'destructive' : tauxUtilisation > 75 ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {Math.round(tauxUtilisation)}%
              </Badge>
            )}
          </div>
          {!isWeekend && (
            <Progress 
              value={Math.min(tauxUtilisation, 100)} 
              className="h-1"
            />
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {isWeekend ? (
            <div className="flex items-center justify-center h-24 text-gray-400">
              <Calendar className="w-6 h-6 mr-2" />
              <span className="text-sm">Weekend</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Tâches planifiées */}
              {planning.taches.map(renderTachePlanifiee)}
              
              {/* Événements planifiés */}
              {planning.evenements.map(renderEvenementPlanifie)}
              
              {planning.taches.length === 0 && planning.evenements.length === 0 && (
                <div className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-400 mb-2">Glissez une tâche ici</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                    onClick={() => ouvrirModalCreationReunion(dateStr)}
                  >
                    <Video className="w-3 h-3 mr-1" />
                    Réunion
                  </Button>
                </div>
              )}
              
              {/* Bouton de création de réunion (toujours visible) */}
              {(planning.taches.length > 0 || planning.evenements.length > 0) && (
                <div className="flex justify-center mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                    onClick={() => ouvrirModalCreationReunion(dateStr)}
                  >
                    <Video className="w-3 h-3 mr-1" />
                    Ajouter réunion
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Rendu d'un jour du calendrier (vue mensuelle) - plus compact
  const renderJourCalendrierMensuel = (jour: Date) => {
    const dateStr = formatDate(jour);
    const planning = planningHebdomadaire[dateStr];
    const isWeekend = jour.getDay() === 0 || jour.getDay() === 6;
    const estAujourdhui = isToday(jour);
    const estDansMoisCourant = isSameMonth(jour, semaineCourante);

    return (
      <div
        key={dateStr}
        className={`
          min-h-[120px] p-2 border rounded-lg transition-all hover:shadow-sm cursor-pointer
          ${isWeekend ? 'bg-gray-50' : 'bg-white'}
          ${estAujourdhui ? 'ring-2 ring-blue-500' : ''}
          ${!estDansMoisCourant ? 'opacity-50' : ''}
        `}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (isWeekend || !estDansMoisCourant) return;
          
          const tacheData = e.dataTransfer.getData('application/json');
          if (tacheData) {
            const tache = JSON.parse(tacheData);
            ajouterTacheAuJour(tache, dateStr);
          }
        }}
      >
        {/* En-tête du jour */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${estAujourdhui ? 'text-blue-600' : 'text-gray-900'}`}>
            {jour.getDate()}
          </span>
          {planning.chargeTotal > 0 && (
            <Badge 
              variant="outline" 
              className="text-xs h-4 px-1"
            >
              {planning.chargeTotal.toFixed(1)}h
            </Badge>
          )}
        </div>

        {/* Tâches et événements (version compacte) */}
        <div className="space-y-1">
          {planning.taches.slice(0, 2).map(tache => (
            <div
              key={tache.id}
              className={`text-xs p-1 rounded border-l-2 ${getCouleurUrgence(tache.urgence)} bg-white truncate`}
              title={`${tache.nom} - ${tache.clientNom}`}
            >
              {tache.nom}
            </div>
          ))}
          
          {planning.evenements.slice(0, 1).map(evenement => (
            <div
              key={evenement.id}
              className="text-xs p-1 rounded border-l-2 border-l-purple-500 bg-purple-50 truncate"
              title={evenement.titre}
            >
              {evenement.titre}
            </div>
          ))}

          {(planning.taches.length + planning.evenements.length) > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{planning.taches.length + planning.evenements.length - 3} autre{(planning.taches.length + planning.evenements.length - 3) > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Calendrier {vueCalendrier === 'mensuelle' ? 'Mensuel' : 'Hebdomadaire'}
          </h2>
          <p className="text-gray-600">Planification intelligente avec respect des capacités</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={vueCalendrier} onValueChange={(value: 'hebdomadaire' | 'mensuelle') => setVueCalendrier(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hebdomadaire">Vue Hebdomadaire</SelectItem>
              <SelectItem value="mensuelle">Vue Mensuelle</SelectItem>
            </SelectContent>
          </Select>
          
          <SelecteurCollaborateurs
            collaborateurs={collaborateurs.map(c => ({ id: c.nom, ...c }))}
            collaborateursSelectionnes={collaborateursSelectionnes}
            onSelectionChange={setCollaborateursSelectionnes}
            className="w-64"
          />
        </div>
      </div>

      {/* Navigation période */}
      <div className="flex items-center justify-between bg-white rounded-lg border p-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => changerPeriode('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
          {vueCalendrier === 'mensuelle' ? 'Mois précédent' : 'Semaine précédente'}
        </Button>
        
        <div className="text-center">
          <h3 className="font-semibold">
            {vueCalendrier === 'mensuelle' 
              ? formatMonthYear(semaineCourante)
              : `Semaine du ${formatDateFr(joursCalendrier[0])} au ${formatDateFr(joursCalendrier[vueCalendrier === 'mensuelle' ? joursCalendrier.length - 1 : 6])}`
            }
          </h3>
          <p className="text-sm text-gray-500">
            {statistiques.totalTaches} tâches • {statistiques.totalHeures.toFixed(1)}h • {statistiques.tauxUtilisation}% de capacité
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => changerPeriode('next')}
        >
          {vueCalendrier === 'mensuelle' ? 'Mois suivant' : 'Semaine suivante'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tâches planifiées</p>
                <p className="text-2xl font-bold">{statistiques.totalTaches}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Charge totale</p>
                <p className="text-2xl font-bold">{statistiques.totalHeures.toFixed(1)}h</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-bold">{statistiques.totalEvenements}</p>
              </div>
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux utilisation</p>
                <p className="text-2xl font-bold">{statistiques.tauxUtilisation}%</p>
              </div>
              <Users className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tâches disponibles */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tâches à Planifier</CardTitle>
              <p className="text-sm text-gray-600">
                Glissez-déposez sur un jour
              </p>
            </CardHeader>
            <CardContent>
              {/* Boutons d'actions */}
              {tachesDisponibles.length > 0 && (
                <div className="mb-4 space-y-2">
                  <Button 
                    onClick={planifierAutomatiquement}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Planification Auto IA
                  </Button>
                  <Button 
                    onClick={() => {
                      // Retirer toutes les tâches du calendrier (remettre jour à undefined)
                      tachesPlanifieesCalendrier.forEach(t => retirerTacheDuCalendrier(t.id));
                    }}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              )}
              
              <div className="space-y-3">
                {tachesDisponibles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Aucune tâche à planifier</p>
                    <p className="text-xs">
                      pour {collaborateursSelectionnes.includes('all') ? 'tous les collaborateurs' : 
                            collaborateursSelectionnes.length === 1 ? collaborateursSelectionnes[0] :
                            `${collaborateursSelectionnes.length} collaborateurs`}
                    </p>
                  </div>
                ) : (
                  tachesDisponibles.map(renderTacheDisponible)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendrier */}
        <div className="lg:col-span-3">
          {vueCalendrier === 'mensuelle' ? (
            <div className="space-y-4">
              {/* En-têtes des jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
                  <div key={jour} className="text-center text-sm font-medium text-gray-600 py-2">
                    {jour}
                  </div>
                ))}
              </div>
              
              {/* Grille mensuelle */}
              <div className="grid grid-cols-7 gap-2">
                {joursCalendrier.map(renderJourCalendrierMensuel)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {joursCalendrier.slice(0, 5).map(renderJourCalendrier)} {/* Lun-Ven seulement */}
            </div>
          )}
        </div>
      </div>

      {/* Modal de dépassement de capacité */}
      {modalDepassement.tache && modalDepassement.planning && (
        <ModalDepassementCapacite
          isOpen={modalDepassement.isOpen}
          onClose={fermerModalDepassement}
          onConfirm={confirmerAjoutAvecDepassement}
          tache={modalDepassement.tache}
          planning={modalDepassement.planning}
        />
      )}

      {/* Modal de modification/création */}
      <ModalModificationTache
        isOpen={modalModification.isOpen}
        onClose={fermerModalModification}
        onModifierTache={confirmerModificationTache}
        onCreerReunion={confirmerCreationReunion}
        tache={modalModification.tache}
        jour={modalModification.jour}
        mode={modalModification.mode}
      />
    </div>
  );
}
