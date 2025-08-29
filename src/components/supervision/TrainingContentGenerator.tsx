import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Target, 
  Users, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Download,
  Share,
  Play,
  Edit,
  Plus,
  X
} from 'lucide-react';

import { errorCategories } from '@/data/supervisionTemplates';
import { TrainingContent, TrainingModule, ErrorCategory } from '@/types/supervision';

interface TrainingAnalysis {
  errorId: string;
  errorName: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedCollaborators: string[];
  suggestedContent: TrainingContent;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface TrainingContentGeneratorProps {
  supervisionData: any[];
  collaborators: any[];
  onGenerateContent: (content: TrainingContent) => void;
}

const TrainingContentGenerator: React.FC<TrainingContentGeneratorProps> = ({
  supervisionData,
  collaborators,
  onGenerateContent
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<TrainingAnalysis | null>(null);
  const [customContent, setCustomContent] = useState<Partial<TrainingContent>>({
    title: '',
    description: '',
    objectives: [],
    content: [],
    duration: 60,
    format: 'presentation',
    difficulty: 'intermediate'
  });
  const [activeTab, setActiveTab] = useState('analysis');

  // Analyse des erreurs pour générer du contenu de formation
  const errorAnalysis = useMemo(() => {
    const errorFrequency: Record<string, { count: number; collaborators: Set<string> }> = {};
    
    // Compter les erreurs par type et collaborateur
    supervisionData.forEach(session => {
      session.findings?.forEach((finding: any) => {
        if (finding.errorCategoryId) {
          if (!errorFrequency[finding.errorCategoryId]) {
            errorFrequency[finding.errorCategoryId] = { count: 0, collaborators: new Set() };
          }
          errorFrequency[finding.errorCategoryId].count++;
          errorFrequency[finding.errorCategoryId].collaborators.add(session.collaboratorName);
        }
      });
    });

    // Générer l'analyse avec contenu suggéré
    return Object.entries(errorFrequency).map(([errorId, data]) => {
      const errorCategory = errorCategories.find(e => e.id === errorId);
      if (!errorCategory) return null;

      const analysis: TrainingAnalysis = {
        errorId,
        errorName: errorCategory.name,
        frequency: data.count,
        severity: errorCategory.severity,
        affectedCollaborators: Array.from(data.collaborators),
        priority: data.count >= 5 ? 'urgent' : 
                  data.count >= 3 ? 'high' : 
                  data.count >= 2 ? 'medium' : 'low',
        suggestedContent: generateTrainingContent(errorCategory, data.count, Array.from(data.collaborators))
      };

      return analysis;
    }).filter(Boolean) as TrainingAnalysis[];
  }, [supervisionData]);

  // Génération automatique de contenu de formation
  const generateTrainingContent = (error: ErrorCategory, frequency: number, collaborators: string[]): TrainingContent => {
    const baseContent: TrainingContent = {
      id: `TRAIN_${error.id}_${Date.now()}`,
      title: `Formation: ${error.name}`,
      description: `Formation ciblée pour corriger les erreurs de type "${error.name}" identifiées lors des supervisions.`,
      objectives: [
        `Comprendre les causes des erreurs ${error.name.toLowerCase()}`,
        'Maîtriser les bonnes pratiques pour éviter ces erreurs',
        'Appliquer les mesures préventives appropriées'
      ],
      targetErrors: [error.id],
      content: generateModules(error),
      duration: calculateDuration(error.severity, frequency),
      format: selectOptimalFormat(error, collaborators.length),
      difficulty: error.severity === 'critical' ? 'advanced' : 
                  error.severity === 'high' ? 'intermediate' : 'beginner',
      resources: [
        {
          id: `RES_${error.id}_001`,
          name: 'Guide des bonnes pratiques',
          type: 'document',
          url: `/resources/guides/${error.id.toLowerCase()}.pdf`,
          description: `Guide complet sur ${error.name.toLowerCase()}`
        },
        {
          id: `RES_${error.id}_002`,
          name: 'Checklist de contrôle',
          type: 'template',
          url: `/resources/checklists/${error.id.toLowerCase()}.xlsx`,
          description: 'Checklist pour éviter les erreurs'
        }
      ]
    };

    return baseContent;
  };

  const generateModules = (error: ErrorCategory): TrainingModule[] => {
    const modules: TrainingModule[] = [
      {
        id: `MOD_${error.id}_001`,
        title: 'Introduction et contexte',
        content: `
## Contexte
Les erreurs de type "${error.name}" ont un impact ${error.impact} sur nos opérations.

## Objectifs de cette formation
- Identifier les causes racines
- Comprendre l'impact
- Maîtriser les solutions
        `,
        type: 'theory',
        duration: 15
      },
      {
        id: `MOD_${error.id}_002`,
        title: 'Causes communes et prévention',
        content: `
## Causes principales identifiées:
${error.commonCauses.map(cause => `- ${cause}`).join('\n')}

## Mesures préventives:
${error.preventiveMeasures.map(measure => `- ${measure}`).join('\n')}
        `,
        type: 'theory',
        duration: 20
      },
      {
        id: `MOD_${error.id}_003`,
        title: 'Cas pratiques',
        content: `
## Exercices pratiques
Application des concepts sur des cas réels similaires à ceux rencontrés.

## Objectifs:
- Identifier les erreurs potentielles
- Appliquer les bonnes pratiques
- Valider la compréhension
        `,
        type: 'exercise',
        duration: 25
      }
    ];

    // Ajouter un quiz pour les formations importantes
    if (error.severity === 'high' || error.severity === 'critical') {
      modules.push({
        id: `MOD_${error.id}_004`,
        title: 'Évaluation des connaissances',
        content: 'Quiz interactif pour valider l\'acquisition des compétences',
        type: 'quiz',
        duration: 10
      });
    }

    return modules;
  };

  const calculateDuration = (severity: string, frequency: number): number => {
    let baseDuration = 60; // 1 heure par défaut
    
    if (severity === 'critical') baseDuration = 120;
    else if (severity === 'high') baseDuration = 90;
    else if (severity === 'low') baseDuration = 45;
    
    // Ajuster selon la fréquence
    if (frequency > 5) baseDuration += 30;
    
    return baseDuration;
  };

  const selectOptimalFormat = (error: ErrorCategory, participantCount: number): 'presentation' | 'interactive' | 'hands-on' | 'case-study' => {
    if (error.severity === 'critical' || error.severity === 'high') {
      return 'hands-on'; // Formation pratique pour les erreurs critiques
    }
    
    if (participantCount <= 3) {
      return 'interactive'; // Formation interactive pour petits groupes
    }
    
    if (error.impact === 'compliance') {
      return 'case-study'; // Études de cas pour les aspects réglementaires
    }
    
    return 'presentation';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatFormatName = (format: string) => {
    switch (format) {
      case 'presentation': return 'Présentation';
      case 'interactive': return 'Interactif';
      case 'hands-on': return 'Pratique';
      case 'case-study': return 'Étude de cas';
      default: return format;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erreurs Analysées</p>
                <p className="text-2xl font-bold text-gray-900">{errorAnalysis.length}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Formations Urgentes</p>
                <p className="text-2xl font-bold text-red-600">
                  {errorAnalysis.filter(a => a.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collaborateurs Impactés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(errorAnalysis.flatMap(a => a.affectedCollaborators)).size}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps Formation Estimé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(errorAnalysis.reduce((sum, a) => sum + a.suggestedContent.duration, 0) / 60)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="analysis">Analyse Automatique</TabsTrigger>
          <TabsTrigger value="custom">Création Personnalisée</TabsTrigger>
          <TabsTrigger value="generated">Contenu Généré</TabsTrigger>
        </TabsList>

        {/* Analyse automatique */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Formations Recommandées par l'IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorAnalysis
                  .sort((a, b) => {
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                  })
                  .map(analysis => (
                  <div key={analysis.errorId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSeverityIcon(analysis.severity)}
                          <h3 className="font-semibold text-lg">{analysis.errorName}</h3>
                          <Badge className={getPriorityColor(analysis.priority)}>
                            {analysis.priority === 'urgent' ? 'Urgent' :
                             analysis.priority === 'high' ? 'Priorité élevée' :
                             analysis.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Fréquence:</span> {analysis.frequency} occurrences
                          </div>
                          <div>
                            <span className="font-medium">Collaborateurs:</span> {analysis.affectedCollaborators.length}
                          </div>
                          <div>
                            <span className="font-medium">Durée estimée:</span> {analysis.suggestedContent.duration} min
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <span className="font-medium">Collaborateurs impactés:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.affectedCollaborators.map(collab => (
                              <Badge key={collab} variant="outline" className="text-xs">
                                {collab}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedAnalysis(analysis)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir le contenu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onGenerateContent(analysis.suggestedContent)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Générer
                        </Button>
                      </div>
                    </div>

                    {/* Aperçu du contenu de formation */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Aperçu de la formation suggérée:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Format:</span> {formatFormatName(analysis.suggestedContent.format)}
                        </div>
                        <div>
                          <span className="font-medium">Niveau:</span> {
                            analysis.suggestedContent.difficulty === 'beginner' ? 'Débutant' :
                            analysis.suggestedContent.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'
                          }
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Objectifs:</span>
                          <ul className="mt-1 space-y-1">
                            {analysis.suggestedContent.objectives.slice(0, 2).map((obj, idx) => (
                              <li key={idx} className="text-gray-600">• {obj}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Création personnalisée */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Créer un Contenu de Formation Personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Titre de la formation</Label>
                    <Input
                      value={customContent.title}
                      onChange={(e) => setCustomContent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Formation TVA avancée"
                    />
                  </div>
                  
                  <div>
                    <Label>Durée (minutes)</Label>
                    <Input
                      type="number"
                      value={customContent.duration}
                      onChange={(e) => setCustomContent(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      placeholder="60"
                    />
                  </div>
                  
                  <div>
                    <Label>Format</Label>
                    <Select
                      value={customContent.format}
                      onValueChange={(value: any) => setCustomContent(prev => ({ ...prev, format: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presentation">Présentation</SelectItem>
                        <SelectItem value="interactive">Interactif</SelectItem>
                        <SelectItem value="hands-on">Pratique</SelectItem>
                        <SelectItem value="case-study">Étude de cas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Niveau de difficulté</Label>
                    <Select
                      value={customContent.difficulty}
                      onValueChange={(value: any) => setCustomContent(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={customContent.description}
                    onChange={(e) => setCustomContent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description détaillée de la formation..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder le brouillon
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la formation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenu généré */}
        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Formations Générées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Les formations générées apparaîtront ici.</p>
                <p className="text-sm">Utilisez l'analyse automatique pour commencer.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détail du contenu suggéré */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                Formation Suggérée: {selectedAnalysis.errorName}
              </h2>
              <Button variant="ghost" onClick={() => setSelectedAnalysis(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div>
                <h3 className="font-semibold mb-3">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Durée:</span> {selectedAnalysis.suggestedContent.duration} minutes
                  </div>
                  <div>
                    <span className="font-medium">Format:</span> {formatFormatName(selectedAnalysis.suggestedContent.format)}
                  </div>
                  <div>
                    <span className="font-medium">Niveau:</span> {
                      selectedAnalysis.suggestedContent.difficulty === 'beginner' ? 'Débutant' :
                      selectedAnalysis.suggestedContent.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'
                    }
                  </div>
                  <div>
                    <span className="font-medium">Participants:</span> {selectedAnalysis.affectedCollaborators.length}
                  </div>
                </div>
              </div>
              
              {/* Objectifs */}
              <div>
                <h3 className="font-semibold mb-3">Objectifs pédagogiques</h3>
                <ul className="space-y-2">
                  {selectedAnalysis.suggestedContent.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Modules */}
              <div>
                <h3 className="font-semibold mb-3">Structure de la formation</h3>
                <div className="space-y-3">
                  {selectedAnalysis.suggestedContent.content.map((module, idx) => (
                    <div key={module.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{idx + 1}. {module.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {module.type === 'theory' ? 'Théorie' :
                             module.type === 'exercise' ? 'Exercice' :
                             module.type === 'quiz' ? 'Quiz' : 'Exemple'}
                          </Badge>
                          <span className="text-sm text-gray-500">{module.duration} min</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-line">
                        {module.content.substring(0, 200)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ressources */}
              <div>
                <h3 className="font-semibold mb-3">Ressources incluses</h3>
                <div className="space-y-2">
                  {selectedAnalysis.suggestedContent.resources.map(resource => (
                    <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm">{resource.name}</div>
                          <div className="text-xs text-gray-500">{resource.description}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setSelectedAnalysis(null)}>
                Fermer
              </Button>
              <Button onClick={() => onGenerateContent(selectedAnalysis.suggestedContent)}>
                <Plus className="w-4 h-4 mr-2" />
                Générer cette formation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingContentGenerator;
