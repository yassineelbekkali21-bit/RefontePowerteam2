import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Code, Eye, Users, Calendar, Target, TrendingUp, CheckCircle, AlertTriangle, Clock, Plus, Filter, Search, Settings, GitBranch, FileText, X, Save, Edit, Trash2, User, ArrowRight, Zap, Sparkles, Brain, Wand2, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePlans, CorrectionPlan, PlanActivity } from '@/contexts/PlansContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

// Import des composants de supervision
import SupervisionDashboard from '@/components/supervision/SupervisionDashboard';
import SupervisionSessionModal from '@/components/supervision/SupervisionSessionModal';
import { SupervisionSession } from '@/types/supervision';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Données pour les plans de développement
const developmentPlans = [
  {
    id: 1,
    title: 'Amélioration UI/UX Dashboard',
    client: 'GEMBES SA COTE',
    priority: 'high',
    status: 'en-cours',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    assignee: 'Alice Martin',
    description: 'Refonte complète de l\'interface utilisateur pour améliorer l\'expérience client'
  },
  {
    id: 2,
    title: 'Optimisation Performance API',
    client: 'DA PAZ EMILIA',
    priority: 'medium',
    status: 'planifie',
    progress: 20,
    startDate: '2024-02-01',
    endDate: '2024-04-01',
    assignee: 'David Chen',
    description: 'Optimisation des requêtes et amélioration des temps de réponse'
  },
  {
    id: 3,
    title: 'Module de Reporting Avancé',
    client: 'PICKET',
    priority: 'high',
    status: 'termine',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    assignee: 'Claire Leroy',
    description: 'Développement d\'un système de reporting personnalisé'
  }
];

// Données pour les plans Kanban
// Utiliser les interfaces du contexte global
type KanbanPlan = CorrectionPlan;

interface PlanViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: KanbanPlan | null;
  onEdit?: (plan: KanbanPlan) => void;
  onDelete?: (planId: string) => void;
}

interface PlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: KanbanPlan | null;
  onSave: (updatedPlan: KanbanPlan) => void;
}

interface QuickPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPlan: KanbanPlan) => void;
  suggestedClient?: string;
}

// Données pour la supervision
const supervisionData = {
  activeProjects: 12,
  completedThisMonth: 5,
  overdueTasks: 3,
  teamProductivity: 87,
  codeQuality: 92,
  bugReports: 8
};

// Modal de visualisation/édition des plans
const PlanViewModal: React.FC<PlanViewModalProps> = ({ isOpen, onClose, plan, onEdit, onDelete }) => {
  if (!isOpen || !plan) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      case 'inprogress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'validation': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return 'Terminé';
      case 'inprogress': return 'En cours';
      case 'validation': return 'En validation';
      case 'todo': return 'À faire';
      default: return 'Inconnu';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Inconnue';
    }
  };

  const mockActivities: PlanActivity[] = plan.activities || [
    {
      id: '1',
      date: '2024-02-15',
      time: '09:00',
      responsible: plan.assignee,
      action: 'Analyse initiale du problème et identification des causes racines',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-02-16',
      time: '14:00',
      responsible: plan.assignee,
      action: 'Développement de la solution corrective',
      status: plan.status === 'done' ? 'completed' : 'pending'
    },
    {
      id: '3',
      date: '2024-02-18',
      time: '10:00',
      responsible: 'Équipe QA',
      action: 'Tests et validation de la correction',
      status: plan.status === 'done' ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{plan.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Client: {plan.client}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(plan)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete && onDelete(plan.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              {/* Détails du plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Détails du Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {plan.description || `Plan de correction pour résoudre les problèmes identifiés chez ${plan.client}. Ce plan comprend une série d'actions coordonnées pour améliorer la qualité de service et la satisfaction client.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Responsable</h4>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{plan.assignee}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Échéance</h4>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{plan.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Statut</h4>
                      <Badge className={getStatusColor(plan.status)}>
                        {getStatusLabel(plan.status)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Priorité</h4>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {getPriorityLabel(plan.priority)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activités */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Activités Planifiées ({mockActivities.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockActivities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(activity.date).toLocaleDateString('fr-FR')} à {activity.time}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.responsible}
                            </Badge>
                            <Badge className={`text-xs ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {activity.status === 'completed' ? 'Terminé' : 'En attente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Statistiques */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{plan.progress}%</div>
                    <div className="text-sm text-gray-600">Progression actuelle</div>
                  </div>

                  <div>
                    <Progress value={plan.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {mockActivities.filter(a => a.status === 'completed').length}
                      </div>
                      <div className="text-xs text-gray-600">Terminées</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {mockActivities.filter(a => a.status === 'pending').length}
                      </div>
                      <div className="text-xs text-gray-600">En attente</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Créé le</div>
                    <div className="font-medium">{plan.createdDate || '01/02/2024'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Dernière mise à jour</div>
                    <div className="font-medium">Hier</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Type d'erreur</div>
                    <div className="font-medium">{plan.errorType || 'Problème technique'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Plan ID: {plan.id}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button onClick={() => onEdit && onEdit(plan)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier le plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de création rapide de plan (Web 3.0 style)
const QuickPlanModal: React.FC<QuickPlanModalProps> = ({ isOpen, onClose, onSave, suggestedClient }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState<Partial<KanbanPlan> | null>(null);

  // Templates prédéfinis pour une création ultra-rapide
  const templates = [
    {
      id: 'ui-fix',
      title: 'Correction UI/UX',
      icon: '🎨',
      description: 'Problèmes d\'interface utilisateur',
      priority: 'medium' as const,
      estimatedDays: 3,
      activities: ['Audit UI', 'Corrections', 'Tests utilisateur']
    },
    {
      id: 'performance',
      title: 'Optimisation Performance',
      icon: '⚡',
      description: 'Lenteurs et optimisations',
      priority: 'high' as const,
      estimatedDays: 5,
      activities: ['Audit performance', 'Optimisations', 'Tests de charge']
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: '🔒',
      description: 'Failles de sécurité',
      priority: 'high' as const,
      estimatedDays: 7,
      activities: ['Audit sécurité', 'Corrections', 'Tests pénétration']
    },
    {
      id: 'bug-fix',
      title: 'Correction de Bug',
      icon: '🐛',
      description: 'Bugs et erreurs',
      priority: 'medium' as const,
      estimatedDays: 2,
      activities: ['Investigation', 'Correction', 'Tests']
    }
  ];

  const responsibleOptions = ['Alice Martin', 'David Chen', 'Claire Leroy', 'Emma Wilson', 'Bob Martinez'];

  // Simulation IA pour générer un plan intelligent
  const generatePlanWithAI = async () => {
    setIsGenerating(true);
    
    // Simulation d'appel IA (délai réaliste)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = templates.find(t => t.id === selectedTemplate);
    const assignee = responsibleOptions[Math.floor(Math.random() * responsibleOptions.length)];
    
    const plan: Partial<KanbanPlan> = {
      title: template?.title || 'Plan de correction',
      client: suggestedClient || 'Client sélectionné',
      description: description || template?.description || '',
      priority: template?.priority || 'medium',
      assignee: assignee,
      assigneeInitials: assignee.split(' ').map(n => n[0]).join(''),
      status: 'todo',
      progress: 0,
      deadline: new Date(Date.now() + (template?.estimatedDays || 3) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      errorType: template?.description || 'Problème identifié',
      createdDate: new Date().toLocaleDateString('fr-FR'),
      activities: template?.activities.map((activity, index) => ({
        id: (index + 1).toString(),
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00',
        responsible: assignee,
        action: activity,
        status: 'pending' as const
      })) || []
    };
    
    setGeneratedPlan(plan);
    setIsGenerating(false);
    setStep(3);
  };

  const handleSave = () => {
    if (generatedPlan) {
      const finalPlan: KanbanPlan = {
        id: `plan-${Date.now()}`,
        title: generatedPlan.title!,
        client: generatedPlan.client!,
        priority: generatedPlan.priority!,
        progress: generatedPlan.progress!,
        deadline: generatedPlan.deadline!,
        assignee: generatedPlan.assignee!,
        assigneeInitials: generatedPlan.assigneeInitials!,
        status: generatedPlan.status!,
        description: generatedPlan.description,
        errorType: generatedPlan.errorType,
        activities: generatedPlan.activities,
        createdDate: generatedPlan.createdDate
      };
      
      onSave(finalPlan);
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setStep(1);
    setDescription('');
    setSelectedTemplate('');
    setGeneratedPlan(null);
    setIsGenerating(false);
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header moderne */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Création Express</h2>
                  <p className="text-white/90 text-sm">Plan de correction en 30 secondes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress steps */}
            <div className="mt-6 flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= stepNum ? 'bg-white text-indigo-600' : 'bg-white/20 text-white/70'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all ${
                      step > stepNum ? 'bg-white' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Étape 1: Sélection template */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Choisissez un type de correction</h3>
                <p className="text-gray-600">Sélectionnez le template qui correspond le mieux à votre besoin</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg group ${
                      selectedTemplate === template.id 
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <div className="font-semibold">{template.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        <Badge className={
                          template.priority === 'high' ? 'bg-red-100 text-red-700' :
                          template.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {template.priority === 'high' ? 'Urgent' : 
                           template.priority === 'medium' ? 'Normal' : 'Faible'}
                        </Badge>
                        <span className="text-gray-500">{template.estimatedDays}j</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Description rapide */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Décrivez le problème</h3>
                <p className="text-gray-600">En quelques mots, expliquez ce qui doit être corrigé</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Interface de connexion difficile à utiliser, erreurs d'affichage sur mobile..."
                    rows={4}
                    className="resize-none border-2 border-gray-200 rounded-xl focus:border-indigo-500 transition-colors"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {description.length}/500
                  </div>
                </div>
                
                {suggestedClient && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Client détecté:</span>
                      <span className="text-blue-700">{suggestedClient}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Étape 3: Génération IA / Aperçu */}
          {step === 3 && (
            <div className="space-y-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">IA en cours de génération...</h3>
                  <p className="text-gray-600">Création automatique du plan optimal</p>
                </div>
              ) : generatedPlan ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                      Plan généré avec succès !
                    </h3>
                    <p className="text-gray-600">Voici votre plan de correction optimisé</p>
                  </div>
                  
                  <Card className="border-2 border-indigo-200 bg-indigo-50/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{generatedPlan.title}</h4>
                          <Badge className="bg-indigo-100 text-indigo-700">
                            {generatedPlan.priority === 'high' ? 'Urgent' : 
                             generatedPlan.priority === 'medium' ? 'Normal' : 'Faible'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Client:</span>
                            <div className="font-medium">{generatedPlan.client}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Responsable:</span>
                            <div className="font-medium">{generatedPlan.assignee}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Échéance:</span>
                            <div className="font-medium">{generatedPlan.deadline}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Activités:</span>
                            <div className="font-medium">{generatedPlan.activities?.length || 0} étapes</div>
                          </div>
                        </div>
                        
                        {generatedPlan.activities && generatedPlan.activities.length > 0 && (
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Activités planifiées:</div>
                            <div className="space-y-1">
                              {generatedPlan.activities.map((activity, index) => (
                                <div key={activity.id} className="flex items-center text-sm">
                                  <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                    {index + 1}
                                  </div>
                                  <span>{activity.action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {step > 1 && !isGenerating && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Retour
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              
              {step === 1 && (
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedTemplate}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {step === 2 && (
                <Button 
                  onClick={generatePlanWithAI}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Générer avec IA
                </Button>
              )}
              
              {step === 3 && generatedPlan && !isGenerating && (
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Créer le plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal d'édition des plans
const PlanEditModal: React.FC<PlanEditModalProps> = ({ isOpen, onClose, plan, onSave }) => {
  const [editedPlan, setEditedPlan] = useState<KanbanPlan | null>(null);

  // Initialiser le plan édité quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen && plan) {
      setEditedPlan({ ...plan });
    }
  }, [isOpen, plan]);

  if (!isOpen || !plan || !editedPlan) return null;

  const handleSave = () => {
    if (editedPlan) {
      onSave(editedPlan);
      onClose();
    }
  };

  const updateField = (field: keyof KanbanPlan, value: any) => {
    setEditedPlan(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addActivity = () => {
    const newActivity: PlanActivity = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      responsible: editedPlan.assignee,
      action: '',
      status: 'pending'
    };
    
    setEditedPlan(prev => prev ? {
      ...prev,
      activities: [...(prev.activities || []), newActivity]
    } : null);
  };

  const updateActivity = (activityId: string, field: keyof PlanActivity, value: string) => {
    setEditedPlan(prev => prev ? {
      ...prev,
      activities: (prev.activities || []).map(activity =>
        activity.id === activityId ? { ...activity, [field]: value } : activity
      )
    } : null);
  };

  const removeActivity = (activityId: string) => {
    setEditedPlan(prev => prev ? {
      ...prev,
      activities: (prev.activities || []).filter(activity => activity.id !== activityId)
    } : null);
  };

  const responsibleOptions = ['Alice Martin', 'David Chen', 'Claire Leroy', 'Emma Wilson', 'Bob Martinez'];
  const clientOptions = ['GEMBES SA COTE', 'DA PAZ EMILIA', 'PICKET', 'CLASSIC CIVIL MEXIM', 'MAISON VERT COB'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Modifier le Plan</h2>
            <p className="text-sm text-gray-600 mt-1">
              Modification du plan: {editedPlan.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre du plan</Label>
                      <Input
                        id="title"
                        value={editedPlan.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Titre du plan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client">Client</Label>
                      <Select value={editedPlan.client} onValueChange={(value) => updateField('client', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {clientOptions.map(client => (
                            <SelectItem key={client} value={client}>{client}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedPlan.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Description détaillée du plan"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="assignee">Responsable</Label>
                      <Select value={editedPlan.assignee} onValueChange={(value) => updateField('assignee', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {responsibleOptions.map(person => (
                            <SelectItem key={person} value={person}>{person}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select value={editedPlan.priority} onValueChange={(value) => updateField('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select value={editedPlan.status} onValueChange={(value) => updateField('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">À faire</SelectItem>
                          <SelectItem value="inprogress">En cours</SelectItem>
                          <SelectItem value="validation">En validation</SelectItem>
                          <SelectItem value="done">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Échéance</Label>
                      <Input
                        id="deadline"
                        value={editedPlan.deadline}
                        onChange={(e) => updateField('deadline', e.target.value)}
                        placeholder="Ex: 15/02"
                      />
                    </div>
                    <div>
                      <Label htmlFor="progress">Progression (%)</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={editedPlan.progress}
                        onChange={(e) => updateField('progress', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="errorType">Type d'erreur</Label>
                    <Input
                      id="errorType"
                      value={editedPlan.errorType || ''}
                      onChange={(e) => updateField('errorType', e.target.value)}
                      placeholder="Ex: Problème technique"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Gestion des activités */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Activités planifiées</CardTitle>
                    <Button onClick={addActivity} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une activité
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(editedPlan.activities || []).map((activity, index) => (
                      <div key={activity.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Activité {index + 1}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeActivity(activity.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={activity.date}
                              onChange={(e) => updateActivity(activity.id, 'date', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Heure</Label>
                            <Input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivity(activity.id, 'time', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Responsable</Label>
                            <Select 
                              value={activity.responsible} 
                              onValueChange={(value) => updateActivity(activity.id, 'responsible', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {responsibleOptions.map(person => (
                                  <SelectItem key={person} value={person}>{person}</SelectItem>
                                ))}
                                <SelectItem value="Équipe QA">Équipe QA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Description de l'action</Label>
                          <Textarea
                            value={activity.action}
                            onChange={(e) => updateActivity(activity.id, 'action', e.target.value)}
                            placeholder="Description de l'activité"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label>Statut</Label>
                          <Select 
                            value={activity.status} 
                            onValueChange={(value) => updateActivity(activity.id, 'status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="completed">Terminé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Aperçu */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{editedPlan.progress}%</div>
                    <div className="text-sm text-gray-600">Progression</div>
                    <Progress value={editedPlan.progress} className="h-2 mt-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Priorité:</span>
                      <Badge className={
                        editedPlan.priority === 'high' ? 'bg-red-100 text-red-700' :
                        editedPlan.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }>
                        {editedPlan.priority === 'high' ? 'Haute' : 
                         editedPlan.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Statut:</span>
                      <Badge className={
                        editedPlan.status === 'done' ? 'bg-green-100 text-green-700' :
                        editedPlan.status === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                        editedPlan.status === 'validation' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {editedPlan.status === 'done' ? 'Terminé' :
                         editedPlan.status === 'inprogress' ? 'En cours' :
                         editedPlan.status === 'validation' ? 'En validation' : 'À faire'}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t">
                    <div className="text-lg font-bold">{(editedPlan.activities || []).length}</div>
                    <div className="text-sm text-gray-600">Activités planifiées</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Plan ID: {editedPlan.id}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour une carte draggable
interface DraggableCardProps {
  plan: KanbanPlan;
  onView?: (plan: KanbanPlan) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ plan, onView }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg border shadow-sm cursor-move hover:shadow-md transition-shadow ${
        plan.status === 'inprogress' ? 'border-l-4 border-l-blue-500' : 
        plan.status === 'validation' ? 'border-l-4 border-l-orange-500' : 
        plan.status === 'done' ? 'border-l-4 border-l-green-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-sm">{plan.title}</h4>
          {plan.createdFrom === 'client-file' && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              <User className="w-3 h-3 mr-1" />
              Client
            </Badge>
          )}
        </div>
        <Badge className={`${getPriorityColor(plan.priority)} text-xs`}>
          {plan.priority === 'high' ? 'Urgent' : plan.priority === 'medium' ? 'Moyen' : 'Basse'}
        </Badge>
      </div>
      <p className="text-xs text-gray-600 mb-2">Client: {plan.client}</p>
      
      {(plan.status === 'inprogress' || plan.status === 'validation') && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Progrès: {plan.progress}%</div>
          <Progress value={plan.progress} className="h-1" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {plan.status === 'done' ? `Terminé le ${plan.deadline}` : `Échéance: ${plan.deadline}`}
        </span>
        <div className="flex items-center space-x-2">
          {plan.status === 'done' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              plan.priority === 'high' ? 'bg-red-100 text-red-600' :
              plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
              'bg-green-100 text-green-600'
            }`}>
              {plan.assigneeInitials}
            </div>
          )}
        </div>
      </div>
      
      {/* Bouton Voir - arrête la propagation du drag */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs h-7"
          onClick={(e) => {
            e.stopPropagation();
            onView && onView(plan);
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          Voir détails
        </Button>
      </div>
    </div>
  );
};

// Composant pour une colonne droppable
interface DroppableColumnProps {
  id: string;
  title: string;
  count: number;
  plans: KanbanPlan[];
  bgColor: string;
  textColor: string;
  onViewPlan?: (plan: KanbanPlan) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ 
  id, 
  title, 
  count, 
  plans, 
  bgColor, 
  textColor,
  onViewPlan
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
  });

  return (
    <div className="space-y-4">
      <div className={`${bgColor} p-3 rounded-lg`}>
        <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        <div className={`text-xs ${textColor.replace('700', '500')}`}>{count} plans</div>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'bg-transparent'
        }`}
      >
        <SortableContext items={plans.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {plans.map((plan) => (
            <DraggableCard key={plan.id} plan={plan} onView={onViewPlan} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const Developpement: React.FC = () => {
  const { plans: kanbanPlans, getPlansByStatus, updatePlan, addPlan } = usePlans();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Debug : Afficher les plans dans la console
  console.log('🔍 Module Développement - Plans récupérés:', kanbanPlans);
  console.log('📊 Module Développement - Nombre total de plans:', kanbanPlans.length);
  
  const [activeTab, setActiveTab] = useState<'supervision' | 'gestion-plans' | 'plans-developpement'>('supervision');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<KanbanPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [showClientPlansOnly, setShowClientPlansOnly] = useState(false);
  
  // États pour la supervision
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState<'create' | 'edit' | 'conduct'>('create');
  const [selectedSession, setSelectedSession] = useState<SupervisionSession | null>(null);
  const [sessions, setSessions] = useState<SupervisionSession[]>([]);

  // Gestion des paramètres d'URL pour l'onglet actif
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['supervision', 'gestion-plans', 'plans-developpement'].includes(tab)) {
      setActiveTab(tab as 'supervision' | 'gestion-plans' | 'plans-developpement');
    }
  }, [searchParams]);



  // Fonctions de gestion des sessions de supervision
  const handleCreateSession = () => {
    setSelectedSession(null);
    setSessionModalMode('create');
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: SupervisionSession) => {
    setSelectedSession(session);
    setSessionModalMode('edit');
    setIsSessionModalOpen(true);
  };

  const handleConductSession = (session: SupervisionSession) => {
    setSelectedSession(session);
    setSessionModalMode('conduct');
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (session: SupervisionSession) => {
    if (selectedSession) {
      // Mise à jour
      setSessions(prev => prev.map(s => s.id === session.id ? session : s));
    } else {
      // Création
      setSessions(prev => [...prev, session]);
    }
    setIsSessionModalOpen(false);
    setSelectedSession(null);
  };



  // Fonction pour filtrer les plans selon l'origine
  const getFilteredPlans = (status: string) => {
    const statusPlans = getPlansByStatus(status as any);
    if (showClientPlansOnly) {
      return statusPlans.filter(plan => plan.createdFrom === 'client-file');
    }
    return statusPlans;
  };

  // Statistiques des plans créés depuis la fiche client
  const clientPlansStats = {
    total: kanbanPlans.filter(p => p.createdFrom === 'client-file').length,
    todo: kanbanPlans.filter(p => p.createdFrom === 'client-file' && p.status === 'todo').length,
    inprogress: kanbanPlans.filter(p => p.createdFrom === 'client-file' && p.status === 'inprogress').length,
    validation: kanbanPlans.filter(p => p.createdFrom === 'client-file' && p.status === 'validation').length,
    done: kanbanPlans.filter(p => p.createdFrom === 'client-file' && p.status === 'done').length,
  };

  // Les fonctions Drag & Drop et View Plan sont définies plus bas

  const handleSaveQuickPlan = (planData: any) => {
    // Utiliser le contexte pour ajouter le plan
    addPlan({
      title: planData.title,
      client: planData.client,
      priority: planData.priority,
      progress: 0,
      deadline: planData.deadline,
      assignee: planData.assignee,
      assigneeInitials: planData.assigneeInitials,
      status: 'todo',
      description: planData.description,
      errorType: planData.errorType,
      activities: planData.activities,
      createdFrom: 'development-module'
    });
    setIsQuickCreateOpen(false);
  };

  // Utiliser getPlansByStatus du contexte au lieu d'un filtre local


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Si on dépose sur une colonne (droppable zone)
    if (overId.startsWith('column-')) {
      const newStatus = overId.replace('column-', '') as KanbanPlan['status'];
      
      // Utiliser updatePlan du contexte
      const newProgress = newStatus === 'done' ? 100 : 
                         newStatus === 'validation' ? Math.max(kanbanPlans.find(p => p.id === activeId)?.progress || 0, 80) :
                         newStatus === 'inprogress' ? Math.max(kanbanPlans.find(p => p.id === activeId)?.progress || 0, 20) : 
                         kanbanPlans.find(p => p.id === activeId)?.progress || 0;
      
      updatePlan(activeId, { status: newStatus, progress: newProgress });
    }

    setActiveId(null);
  };

  // Utiliser getPlansByStatus du contexte directement

  // Fonctions de gestion du modal
  const handleViewPlan = (plan: KanbanPlan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleClosePlanModal = () => {
    setIsPlanModalOpen(false);
    setSelectedPlan(null);
  };

  const handleEditPlan = (plan: KanbanPlan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(false); // Fermer le modal de visualisation
    setIsEditModalOpen(true);   // Ouvrir le modal d'édition
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleSavePlan = (updatedPlan: KanbanPlan) => {
    setKanbanPlans(plans => 
      plans.map(plan => 
        plan.id === updatedPlan.id ? {
          ...updatedPlan,
          // Mettre à jour les initiales si le responsable a changé
          assigneeInitials: updatedPlan.assignee.split(' ').map(n => n[0]).join('')
        } : plan
      )
    );
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleCreateNewPlan = (newPlan: Omit<KanbanPlan, 'id' | 'createdDate'>) => {
    addPlan(newPlan);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      // Note: Il faudra ajouter deletePlan au contexte si nécessaire
      console.log('Suppression du plan:', planId);
      handleClosePlanModal();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'termine': return 'bg-green-100 text-green-700';
      case 'en-cours': return 'bg-blue-100 text-blue-700';
      case 'planifie': return 'bg-yellow-100 text-yellow-700';
      case 'suspendu': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        {/* Header */}
        <PageHeader
          title="🔧 Développement"
          description="Gestion des projets et plans de développement"
          icon={Code}
          actions={
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-900">{supervisionData.activeProjects}</div>
                <div className="text-sm text-blue-600">Projets actifs</div>
              </div>
            </div>
          }
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'supervision' ? 'default' : 'outline'}
              onClick={() => setActiveTab('supervision')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Supervision
            </Button>
            <Button
              variant={activeTab === 'gestion-plans' ? 'default' : 'outline'}
              onClick={() => setActiveTab('gestion-plans')}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Gestion des plans
            </Button>
            <Button
              variant={activeTab === 'plans-developpement' ? 'default' : 'outline'}
              onClick={() => setActiveTab('plans-developpement')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Plans de développement
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsQuickCreateOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Création Express
            </Button>
          </div>
        </div>

        {/* Supervision Tab */}
        {activeTab === 'supervision' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Système de Supervision</h2>
                <p className="text-gray-600">
                  Gestion intelligente des supervisions et génération de formations
                </p>
              </div>
              <Button onClick={handleCreateSession} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Session de Supervision
              </Button>
            </div>
            
            <SupervisionDashboard />
          </div>
        )}

        {/* Gestion des plans Tab */}
        {activeTab === 'gestion-plans' && (
          <div className="space-y-6">
            {/* Statistiques et filtres des plans clients */}
            {clientPlansStats.total > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800">Plans créés depuis les fiches clients</span>
                      <Badge className="bg-blue-100 text-blue-700">{clientPlansStats.total}</Badge>
                    </div>
                    <Button
                      variant={showClientPlansOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowClientPlansOnly(!showClientPlansOnly)}
                      className={showClientPlansOnly ? "bg-blue-600 hover:bg-blue-700" : "text-blue-700 border-blue-300 hover:bg-blue-50"}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {showClientPlansOnly ? 'Afficher tous' : 'Filtrer clients uniquement'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">{clientPlansStats.todo}</div>
                      <div className="text-sm text-gray-600">À Faire</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{clientPlansStats.inprogress}</div>
                      <div className="text-sm text-gray-600">En Cours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{clientPlansStats.validation}</div>
                      <div className="text-sm text-gray-600">Validation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{clientPlansStats.done}</div>
                      <div className="text-sm text-gray-600">Terminés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Kanban - Gestion des Plans de Correction
                  <Badge variant="outline" className="ml-2">Drag & Drop</Badge>
                  {showClientPlansOnly && (
                    <Badge className="bg-blue-100 text-blue-700">
                      Plans clients uniquement
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid grid-cols-4 gap-6">
                    <DroppableColumn
                      id="todo"
                      title="À Faire"
                      count={getFilteredPlans('todo').length}
                      plans={getFilteredPlans('todo')}
                      bgColor="bg-gray-100"
                      textColor="text-gray-700"
                      onViewPlan={handleViewPlan}
                    />
                    
                    <DroppableColumn
                      id="inprogress"
                      title="En Cours"
                      count={getFilteredPlans('inprogress').length}
                      plans={getFilteredPlans('inprogress')}
                      bgColor="bg-blue-100"
                      textColor="text-blue-700"
                      onViewPlan={handleViewPlan}
                    />
                    
                    <DroppableColumn
                      id="validation"
                      title="En Validation"
                      count={getFilteredPlans('validation').length}
                      plans={getFilteredPlans('validation')}
                      bgColor="bg-orange-100"
                      textColor="text-orange-700"
                      onViewPlan={handleViewPlan}
                    />
                    
                    <DroppableColumn
                      id="done"
                      title="Terminé"
                      count={getFilteredPlans('done').length}
                      plans={getFilteredPlans('done')}
                      bgColor="bg-green-100"
                      textColor="text-green-700"
                      onViewPlan={handleViewPlan}
                    />
                  </div>

                  <DragOverlay>
                    {activeId ? (
                      <DraggableCard 
                        plan={kanbanPlans.find(p => p.id === activeId)!} 
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans de développement Tab */}
        {activeTab === 'plans-developpement' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plans de Développement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {developmentPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <Badge className={getPriorityColor(plan.priority)}>
                            {plan.priority === 'high' ? 'Haute' : plan.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Client: {plan.client}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">{plan.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progrès</span>
                              <span>{plan.progress}%</span>
                            </div>
                            <Progress value={plan.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Statut:</span>
                            <Badge className={getStatusColor(plan.status)}>
                              {plan.status === 'en-cours' ? 'En cours' : 
                               plan.status === 'planifie' ? 'Planifié' : 
                               plan.status === 'termine' ? 'Terminé' : 'Suspendu'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Assigné à:</span>
                            <span className="font-medium">{plan.assignee}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Période:</span>
                            <span>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Settings className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de visualisation des plans */}
        <PlanViewModal
          isOpen={isPlanModalOpen}
          onClose={handleClosePlanModal}
          plan={selectedPlan}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
        />

        {/* Modal d'édition des plans */}
        <PlanEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          plan={selectedPlan}
          onSave={handleSavePlan}
        />

        {/* Modal de création rapide */}
        <QuickPlanModal
          isOpen={isQuickCreateOpen}
          onClose={() => setIsQuickCreateOpen(false)}
          onSave={handleCreateNewPlan}
        />

        {/* Modal de session de supervision */}
        <SupervisionSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          mode={sessionModalMode}
          session={selectedSession}
          onSave={handleSaveSession}
        />
      </div>
    </DashboardLayout>
  );
};

export default Developpement;
