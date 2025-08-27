import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface pour une tâche planifiée
export interface TachePlanifiee {
  id: string;
  nom: string;
  type: string;
  clientNom: string;
  dateEcheance: string;
  responsable: string;
  etapeActuelle: string;
  urgence: 'low' | 'medium' | 'high' | 'urgent';
  dateAjout: string;
  dureeEstimee?: number; // en heures
  jour?: string; // Format: YYYY-MM-DD si planifiée dans le calendrier
}

// Interface pour un événement/réunion
export interface EvenementPlanifie {
  id: string;
  titre: string;
  type: 'interne' | 'client' | 'formation' | 'reunion';
  typeReunion?: 'interne' | 'client' | 'externe'; // nouveau champ pour distinguer les types
  date: string; // Format: YYYY-MM-DD
  heureDebut: string;
  heureFin: string;
  participants: string[];
  lieu?: string;
  description?: string;
  dureeEstimee: number; // calculée automatiquement
  clientEmail?: string; // pour les invitations
  lienTeams?: string; // lien de la réunion Teams
  invitationEnvoyee?: boolean; // statut d'envoi
}

// Interface du contexte
interface PlanningContextType {
  tachesPlanifiees: TachePlanifiee[];
  evenementsPlanifies: EvenementPlanifie[];
  ajouterTaches: (taches: TachePlanifiee[]) => void;
  ajouterEvenements: (evenements: EvenementPlanifie[]) => void;
  supprimerTache: (id: string) => void;
  supprimerEvenement: (id: string) => void;
  planifierTache: (tacheId: string, jour: string, nouvelleDuree?: number) => void;
  retirerTacheDuCalendrier: (tacheId: string) => void;
  modifierDureeTache: (tacheId: string, nouvelleDuree: number) => void;
  viderPlanning: () => void;
}

// Création du contexte
const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

// Provider du contexte
export const PlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tachesPlanifiees, setTachesPlanifiees] = useState<TachePlanifiee[]>([]);
  const [evenementsPlanifies, setEvenementsPlanifies] = useState<EvenementPlanifie[]>([]);

  const ajouterTaches = (nouvellesTaches: TachePlanifiee[]) => {
    setTachesPlanifiees(prev => {
      // Éviter les doublons
      const existingIds = new Set(prev.map(t => t.id));
      const tachesUniques = nouvellesTaches.filter(t => !existingIds.has(t.id));
      return [...prev, ...tachesUniques];
    });
  };

  const ajouterEvenements = (nouveauxEvenements: EvenementPlanifie[]) => {
    setEvenementsPlanifies(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      const evenementsUniques = nouveauxEvenements.filter(e => !existingIds.has(e.id));
      return [...prev, ...evenementsUniques];
    });
  };

  const supprimerTache = (id: string) => {
    setTachesPlanifiees(prev => prev.filter(t => t.id !== id));
  };

  const supprimerEvenement = (id: string) => {
    setEvenementsPlanifies(prev => prev.filter(e => e.id !== id));
  };

  // Planifier une tâche dans le calendrier (ajouter le jour et optionnellement modifier la durée)
  const planifierTache = (tacheId: string, jour: string, nouvelleDuree?: number) => {
    setTachesPlanifiees(prev => 
      prev.map(t => t.id === tacheId ? { 
        ...t, 
        jour,
        ...(nouvelleDuree !== undefined && { dureeEstimee: nouvelleDuree })
      } : t)
    );
  };

  // Retirer une tâche du calendrier (enlever le jour)
  const retirerTacheDuCalendrier = (tacheId: string) => {
    setTachesPlanifiees(prev => 
      prev.map(t => t.id === tacheId ? { ...t, jour: undefined } : t)
    );
  };

  // Modifier la durée estimée d'une tâche
  const modifierDureeTache = (tacheId: string, nouvelleDuree: number) => {
    setTachesPlanifiees(prev => 
      prev.map(t => t.id === tacheId ? { ...t, dureeEstimee: nouvelleDuree } : t)
    );
  };

  const viderPlanning = () => {
    setTachesPlanifiees([]);
    setEvenementsPlanifies([]);
  };

  return (
    <PlanningContext.Provider value={{
      tachesPlanifiees,
      evenementsPlanifies,
      ajouterTaches,
      ajouterEvenements,
      supprimerTache,
      supprimerEvenement,
      planifierTache,
      retirerTacheDuCalendrier,
      modifierDureeTache,
      viderPlanning
    }}>
      {children}
    </PlanningContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
