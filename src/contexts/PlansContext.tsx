import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interface pour les activités d'un plan
export interface PlanActivity {
  id: string;
  date: string;
  time: string;
  responsible: string;
  action: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Interface pour un plan de correction
export interface CorrectionPlan {
  id: string;
  title: string;
  client: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  deadline: string;
  assignee: string;
  assigneeInitials: string;
  status: 'todo' | 'inprogress' | 'validation' | 'done';
  description?: string;
  errorType?: string;
  activities?: PlanActivity[];
  createdDate?: string;
  createdFrom?: 'client-file' | 'development-module'; // Pour tracer l'origine
}

interface PlansContextType {
  plans: CorrectionPlan[];
  addPlan: (plan: Omit<CorrectionPlan, 'id' | 'createdDate'>) => string;
  updatePlan: (id: string, updates: Partial<CorrectionPlan>) => void;
  deletePlan: (id: string) => void;
  getPlanById: (id: string) => CorrectionPlan | undefined;
  getPlansByStatus: (status: CorrectionPlan['status']) => CorrectionPlan[];
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

// Plans initiaux pour démonstration
const initialPlans: CorrectionPlan[] = [
  {
    id: 'plan-1',
    title: 'Plan correctif UI',
    client: 'GEMBES SA COTE',
    priority: 'high',
    progress: 0,
    deadline: '15/02',
    assignee: 'Alice Martin',
    assigneeInitials: 'AM',
    status: 'todo',
    description: 'Correction de l\'interface utilisateur suite aux retours clients concernant la navigation difficile et les erreurs d\'affichage récurrentes.',
    errorType: 'Problème d\'ergonomie',
    createdDate: '01/02/2024',
    createdFrom: 'development-module',
    activities: [
      {
        id: '1',
        date: '2024-02-15',
        time: '09:00',
        responsible: 'Alice Martin',
        action: 'Audit de l\'interface utilisateur existante',
        status: 'pending'
      },
      {
        id: '2',
        date: '2024-02-16',
        time: '14:00',
        responsible: 'Alice Martin',
        action: 'Implémentation des corrections UI',
        status: 'pending'
      }
    ]
  },
  {
    id: 'plan-2',
    title: 'Optimisation BD',
    client: 'DA PAZ EMILIA',
    priority: 'medium',
    progress: 45,
    deadline: '28/02',
    assignee: 'David Chen',
    assigneeInitials: 'DC',
    status: 'inprogress',
    description: 'Amélioration des performances de la base de données pour réduire les temps de réponse.',
    errorType: 'Performance',
    createdDate: '28/01/2024',
    createdFrom: 'development-module'
  },
  {
    id: 'plan-3',
    title: 'Sécurité API',
    client: 'PICKET',
    priority: 'high',
    progress: 80,
    deadline: '10/02',
    assignee: 'Claire Leroy',
    assigneeInitials: 'CL',
    status: 'validation',
    description: 'Renforcement de la sécurité des API suite à un audit de sécurité.',
    errorType: 'Sécurité',
    createdDate: '15/01/2024',
    createdFrom: 'development-module'
  },
  {
    id: 'plan-4',
    title: 'Module reporting',
    client: 'LAURENT SPRL',
    priority: 'low',
    progress: 100,
    deadline: '31/01',
    assignee: 'Emma Wilson',
    assigneeInitials: 'EW',
    status: 'done',
    description: 'Développement d\'un module de reporting personnalisé pour le client.',
    errorType: 'Fonctionnalité',
    createdDate: '10/01/2024',
    createdFrom: 'development-module'
  }
];

export const PlansProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<CorrectionPlan[]>(initialPlans);

  const addPlan = (planData: Omit<CorrectionPlan, 'id' | 'createdDate'>): string => {
    const newId = `plan-${Date.now()}`;
    const newPlan: CorrectionPlan = {
      ...planData,
      id: newId,
      createdDate: new Date().toLocaleDateString('fr-FR'),
      status: 'todo', // Tous les nouveaux plans commencent en "À Faire"
      progress: 0
    };
    
    console.log('📝 PlansContext - Ajout d\'un nouveau plan:', newPlan);
    
    setPlans(prev => {
      const updatedPlans = [...prev, newPlan];
      console.log('📊 PlansContext - Total des plans après ajout:', updatedPlans.length);
      console.log('📋 PlansContext - Tous les plans:', updatedPlans.map(p => ({ id: p.id, title: p.title, client: p.client })));
      return updatedPlans;
    });
    return newId;
  };

  const updatePlan = (id: string, updates: Partial<CorrectionPlan>) => {
    setPlans(prev => 
      prev.map(plan => 
        plan.id === id ? { ...plan, ...updates } : plan
      )
    );
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const getPlanById = (id: string): CorrectionPlan | undefined => {
    return plans.find(plan => plan.id === id);
  };

  const getPlansByStatus = (status: CorrectionPlan['status']): CorrectionPlan[] => {
    return plans.filter(plan => plan.status === status);
  };

  const value: PlansContextType = {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    getPlansByStatus
  };

  return (
    <PlansContext.Provider value={value}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = (): PlansContextType => {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error('usePlans must be used within a PlansProvider');
  }
  return context;
};
