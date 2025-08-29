import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePlans } from '@/contexts/PlansContext';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationsContext';
import { 
  X, 
  Sparkles,
  Brain,
  Wand2,
  Send,
  ArrowRight, 
  Edit3,
  Check,
  Plus,
  Trash2
} from 'lucide-react';

interface CorrectionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
}

export const CorrectionPlanModal: React.FC<CorrectionPlanModalProps> = ({ isOpen, onClose, client }) => {
  const { addPlan } = usePlans();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  // États pour l'édition inline
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<any>(null);

  // Templates prédéfinis pour une création ultra-rapide
  const templates = [
    {
      id: 'client-departure',
    title: 'Client en partance',
      icon: '🚨',
      description: 'Plan de rétention client',
      priority: 'high' as const,
      estimatedDays: 2,
      activities: ['Audit relation client', 'Plan d\'action immédiat', 'Suivi personnalisé']
    },
    {
      id: 'budget-overrun',
    title: 'Dépassement budgétaire',
      icon: '💰',
      description: 'Optimisation des coûts',
      priority: 'medium' as const,
      estimatedDays: 5,
      activities: ['Analyse des coûts', 'Optimisation processus', 'Renégociation']
    },
    {
      id: 'quality-issue',
    title: 'Problème de qualité',
      icon: '⚠️',
      description: 'Amélioration qualité',
      priority: 'high' as const,
      estimatedDays: 7,
      activities: ['Audit qualité', 'Plan d\'amélioration', 'Formation équipe']
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: '💬',
      description: 'Amélioration communication',
      priority: 'medium' as const,
      estimatedDays: 3,
      activities: ['Audit communication', 'Process communication', 'Suivi régulier']
    }
  ];

  const responsibleOptions = ['Emmanuel Degrève', 'Achraf Mehamed', 'Sophie Laurent', 'Marie Durand', 'Jean Moreau'];

  // Fonctions pour l'édition
  const startEditing = () => {
    setEditedPlan({ ...generatedPlan });
    setIsEditing(true);
  };

  const saveEditing = () => {
    setGeneratedPlan({ ...editedPlan });
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditedPlan(null);
    setIsEditing(false);
  };

  const updateEditedField = (field: string, value: any) => {
    setEditedPlan((prev: any) => ({ ...prev, [field]: value }));
  };

  const addActivity = () => {
    const newActivity = `Nouvelle activité ${(editedPlan.activities?.length || 0) + 1}`;
    updateEditedField('activities', [...(editedPlan.activities || []), newActivity]);
  };

  const updateActivity = (index: number, value: string) => {
    const updatedActivities = [...(editedPlan.activities || [])];
    updatedActivities[index] = value;
    updateEditedField('activities', updatedActivities);
  };

  const removeActivity = (index: number) => {
    const updatedActivities = (editedPlan.activities || []).filter((_: any, i: number) => i !== index);
    updateEditedField('activities', updatedActivities);
  };

  // Simulation IA pour générer un plan intelligent
  const generatePlanWithAI = async () => {
    setIsGenerating(true);
    
    // Simulation d'appel IA (délai réaliste)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = templates.find(t => t.id === selectedTemplate);
    const assignee = responsibleOptions[Math.floor(Math.random() * responsibleOptions.length)];
    
    const plan = {
      title: template?.title || 'Plan de correction',
      client: client?.name || 'Client sélectionné',
      description: description || template?.description || '',
      priority: template?.priority || 'medium',
      assignee: assignee,
      deadline: new Date(Date.now() + (template?.estimatedDays || 3) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      activities: template?.activities || []
    };
    
    setGeneratedPlan(plan);
    setIsGenerating(false);
    setStep(3);
  };

  const handleSave = () => {
    if (generatedPlan) {
      try {
        // Convertir les activités au bon format
        const planActivities = generatedPlan.activities?.map((activity: string, index: number) => ({
          id: `activity-${index + 1}`,
          date: generatedPlan.deadline,
          time: '09:00',
          responsible: generatedPlan.assignee || generatedPlan.responsible,
          action: activity,
          status: 'pending' as const
        })) || [];

        // Générer les initiales du responsable
        const getInitials = (name: string) => {
          return name.split(' ').map(n => n[0]).join('').toUpperCase();
        };

        // Préparer les données du plan avec debug
        const planData = {
          title: generatedPlan.title,
          client: generatedPlan.client || client?.name || 'Client',
          priority: generatedPlan.priority || 'medium',
          progress: 0,
          deadline: generatedPlan.deadline,
          assignee: generatedPlan.assignee || generatedPlan.responsible,
          assigneeInitials: getInitials(generatedPlan.assignee || generatedPlan.responsible || 'XX'),
          status: 'todo' as const,
          description: description || generatedPlan.description || 'Plan de correction créé depuis la fiche client',
          errorType: selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.title : 'Correction',
          activities: planActivities,
          createdFrom: 'client-file' as const
        };

        console.log('🚀 Données du plan à créer:', planData);
        console.log('📋 Client passé au modal:', client);

        // Créer le plan dans le contexte global
        const planId = addPlan(planData);
        
        console.log('✅ Plan créé avec ID:', planId);

        // Afficher une notification de succès
        toast({
          title: "Plan créé avec succès !",
          description: `Le plan "${generatedPlan.title}" a été ajouté au module Développement.`,
          duration: 5000,
        });

        // Ajouter une notification système
        addNotification({
          title: 'Nouveau plan de correction',
          message: `Plan "${generatedPlan.title}" créé pour ${planData.client}`,
          type: 'success',
          module: 'Clients',
          priority: planData.priority === 'high' ? 'high' : 'medium'
        });

        console.log('Plan de correction créé:', { planId, generatedPlan });
        onClose();
        resetModal();
      } catch (error) {
        console.error('Erreur lors de la création du plan:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du plan.",
          variant: "destructive",
        });
      }
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
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
          <div>
                  <h2 className="text-2xl font-bold">Plan de Correction Express</h2>
                  <p className="text-white/90 text-sm">Client: {client?.name || 'Nouveau plan'}</p>
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
                    step >= stepNum ? 'bg-white text-emerald-600' : 'bg-white/20 text-white/70'
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
                <h3 className="text-xl font-semibold mb-2">Quel type de problème voulez-vous résoudre ?</h3>
                <p className="text-gray-600">Sélectionnez le template qui correspond le mieux à la situation</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg group ${
                      selectedTemplate === template.id 
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
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
                <h3 className="text-xl font-semibold mb-2">Décrivez la situation</h3>
                <p className="text-gray-600">En quelques mots, expliquez ce qui doit être corrigé</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Le client exprime son mécontentement concernant les délais de livraison et menace de partir..."
                    rows={4}
                    className="resize-none border-2 border-gray-200 rounded-xl focus:border-emerald-500 transition-colors"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {description.length}/500
                      </div>
                    </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Client:</span>
                    <span className="text-emerald-700">{client?.name || 'Client sélectionné'}</span>
                          </div>
                        </div>
              </div>
            </div>
          )}

          {/* Étape 3: Génération IA / Aperçu */}
          {step === 3 && (
            <div className="space-y-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">IA en cours de génération...</h3>
                  <p className="text-gray-600">Création automatique du plan optimal pour {client?.name}</p>
                </div>
              ) : generatedPlan ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2 text-emerald-600" />
                      Plan généré avec succès !
                </h3>
                    <p className="text-gray-600">Voici votre plan de correction optimisé</p>
              </div>

                  <Card className="border-2 border-emerald-200 bg-emerald-50/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {isEditing ? (
                            <div className="flex-1 mr-4">
                              <Input
                                value={editedPlan.title}
                                onChange={(e) => updateEditedField('title', e.target.value)}
                                className="font-semibold text-lg border-emerald-300 focus:border-emerald-500"
                                placeholder="Titre du plan"
                              />
                        </div>
                          ) : (
                            <h4 className="font-semibold text-lg">{generatedPlan.title}</h4>
                          )}
                          <div className="flex items-center space-x-2">
                            {!isEditing ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={startEditing}
                                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Modifier
                                </Button>
                                <Badge className="bg-emerald-100 text-emerald-700">
                                  {generatedPlan.priority === 'high' ? 'Urgent' : 
                                   generatedPlan.priority === 'medium' ? 'Normal' : 'Faible'}
                        </Badge>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                  className="text-gray-600 border-gray-300 hover:bg-gray-100"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Annuler
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={saveEditing}
                                  className="text-green-600 border-green-300 hover:bg-green-100"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Sauvegarder
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Client:</span>
                            {isEditing ? (
                              <Input
                                value={editedPlan.client}
                                onChange={(e) => updateEditedField('client', e.target.value)}
                                className="font-medium mt-1 border-emerald-300 focus:border-emerald-500"
                                placeholder="Nom du client"
                              />
                            ) : (
                              <div className="font-medium">{generatedPlan.client}</div>
                            )}
                            </div>
                          <div>
                            <span className="text-gray-600">Responsable:</span>
                            {isEditing ? (
                              <Select
                                value={editedPlan.assignee}
                                onValueChange={(value) => updateEditedField('assignee', value)}
                              >
                                <SelectTrigger className="font-medium mt-1 border-emerald-300 focus:border-emerald-500">
                                  <SelectValue placeholder="Sélectionner un responsable" />
                                </SelectTrigger>
                                <SelectContent>
                                  {responsibleOptions.map((responsible) => (
                                    <SelectItem key={responsible} value={responsible}>
                                      {responsible}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="font-medium">{generatedPlan.assignee}</div>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600">Échéance:</span>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={editedPlan.deadline}
                                onChange={(e) => updateEditedField('deadline', e.target.value)}
                                className="font-medium mt-1 border-emerald-300 focus:border-emerald-500"
                              />
                            ) : (
                              <div className="font-medium">{generatedPlan.deadline}</div>
                            )}
                            </div>
                          <div>
                            <span className="text-gray-600">Activités:</span>
                            <div className="font-medium">{(isEditing ? editedPlan : generatedPlan).activities?.length || 0} étapes</div>
                          </div>
                        </div>

                        {((isEditing ? editedPlan : generatedPlan).activities && (isEditing ? editedPlan : generatedPlan).activities.length > 0) && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm text-gray-600">Activités planifiées:</div>
                              {isEditing && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={addActivity}
                                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-100"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Ajouter
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {(isEditing ? editedPlan : generatedPlan).activities.map((activity: string, index: number) => (
                                <div key={index} className="flex items-center text-sm">
                                  <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                                  {index + 1}
                                  </div>
                                  {isEditing ? (
                                    <div className="flex items-center flex-1 gap-2">
                                      <Input
                                        value={activity}
                                        onChange={(e) => updateActivity(index, e.target.value)}
                                        className="flex-1 border-emerald-300 focus:border-emerald-500"
                                        placeholder={`Activité ${index + 1}`}
                                      />
                                      {editedPlan.activities.length > 1 && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeActivity(index)}
                                          className="text-red-600 border-red-300 hover:bg-red-100 px-2"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      )}
                                </div>
                                  ) : (
                                    <span className="flex-1">{activity}</span>
                                  )}
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
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                  Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              )}
              
              {step === 2 && (
                <Button 
                  onClick={generatePlanWithAI}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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