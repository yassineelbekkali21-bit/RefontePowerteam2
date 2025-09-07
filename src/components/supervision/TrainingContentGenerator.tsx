import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, BookOpen, Users, Lightbulb, Download, Send, TrendingUp, Target, Clock, Award, Brain } from 'lucide-react';
import { TrainingContent, ErrorType, TrainingFormat } from '@/types/supervision';

interface TrainingAnalysis {
  errorId: string;
  errorName: string;
  frequency: number;
  severity: string;
  affectedCollaborators: string[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface ErrorCategory {
  id: string;
  name: string;
  category: ErrorType;
  severity: 'Critique' | 'Majeure' | 'Modérée' | 'Mineure';
}

interface TrainingContentGeneratorProps {
  supervisionData: Array<{
    id: string;
    collaboratorName: string;
    findings: Array<{
      errorCategoryId: string;
      description: string;
    }>;
  }>;
  collaborators: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
  }>;
  onGenerateContent: (content: TrainingContent) => void;
}

const TrainingContentGenerator: React.FC<TrainingContentGeneratorProps> = ({
  supervisionData,
  collaborators,
  onGenerateContent
}) => {
  // Catégories d'erreurs simplifiées
  const errorCategories: ErrorCategory[] = [
    { id: 'ERR_ENC_001', name: 'Erreur saisie comptable', category: 'Encodage', severity: 'Modérée' },
    { id: 'ERR_ENC_002', name: 'Taux TVA incorrect', category: 'TVA', severity: 'Majeure' },
    { id: 'ERR_ISOC_001', name: 'Classification incorrecte', category: 'Bilan', severity: 'Critique' },
    { id: 'ERR_IPP_001', name: 'Déduction non appliquée', category: 'IPP', severity: 'Modérée' },
    { id: 'ERR_IPM_001', name: 'Cotisation incorrecte', category: 'IPM', severity: 'Majeure' }
  ];

  const [generatedContent, setGeneratedContent] = useState<TrainingContent>({
    id: '',
    title: '',
    description: '',
    modules: [],
    generatedDate: '',
    sourceFindings: []
  });
  const [activeTab, setActiveTab] = useState('analysis');

  // Génération automatique de contenu de formation
  const generateTrainingContent = useCallback((errorCategory: ErrorCategory, frequency: number, collaborators: string[]): string => {
    const duration = frequency >= 5 ? 90 : frequency >= 3 ? 60 : 45;
    const format = frequency >= 4 ? 'Interactif' : 'Théorique';

    return `Formation ${format}: ${errorCategory.name} (${duration}min)\n\nContenu suggéré:\n1. Théorie de base\n2. Cas pratiques\n3. Exercices\n\nCollaborateurs concernés: ${collaborators.join(', ')}`;
  }, []);

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
                  data.count >= 2 ? 'medium' : 'low'
      };

      return analysis;
    }).filter(Boolean) as TrainingAnalysis[];
  }, [supervisionData, generateTrainingContent]);

  const handleGenerateContent = (analysis: TrainingAnalysis) => {
    const content: TrainingContent = {
      id: `TRAIN_${analysis.errorId}_${Date.now()}`,
      title: `Formation: ${analysis.errorName}`,
      description: `Formation ciblée pour corriger les erreurs de type ${analysis.errorName}`,
      modules: [{
        id: `MOD_${analysis.errorId}_1`,
        title: `Module ${analysis.errorName}`,
        description: 'Formation personnalisée',
        format: 'Théorique' as TrainingFormat,
        durationMinutes: 60,
        content: generateTrainingContent(
          errorCategories.find(e => e.id === analysis.errorId)!,
          analysis.frequency,
          analysis.affectedCollaborators
        ),
        relatedErrorTypes: ['Encodage' as ErrorType],
        targetCollaborators: analysis.affectedCollaborators
      }],
      generatedDate: new Date().toISOString(),
      sourceFindings: [analysis.errorId]
    };

    setGeneratedContent(content);
    onGenerateContent(content);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critique': return 'bg-red-500';
      case 'Majeure': return 'bg-orange-500';
      case 'Modérée': return 'bg-yellow-500';
      case 'Mineure': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Analyse Erreurs</TabsTrigger>
          <TabsTrigger value="generator">Générateur IA</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analyse des Erreurs
            </h3>
            
            {errorAnalysis.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Aucune donnée de supervision disponible</p>
              </div>
            ) : (
              <div className="space-y-3">
                {errorAnalysis.map((analysis) => (
                  <Card key={analysis.errorId} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(analysis.severity)}`}></div>
                        <h4 className="font-medium">{analysis.errorName}</h4>
                        <Badge variant="outline" className={getPriorityColor(analysis.priority)}>
                          {analysis.priority}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateContent(analysis)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Générer Formation
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Fréquence:</span>
                        <div className="font-semibold text-red-600">{analysis.frequency} fois</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Collaborateurs:</span>
                        <div className="font-semibold">{analysis.affectedCollaborators.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Sévérité:</span>
                        <div className="font-semibold">{analysis.severity}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Générateur de Formation IA
            </h3>

            {generatedContent.title ? (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold">{generatedContent.title}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="w-4 h-4 mr-1" />
                      Généré par IA
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600">{generatedContent.description}</p>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Contenu de la formation:</h5>
                    {generatedContent.modules.map((module) => (
                      <Card key={module.id} className="p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium">{module.title}</h6>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{module.durationMinutes}min</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {module.content}
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4 mr-2" />
                      Déployer Formation
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez une erreur dans l'onglet "Analyse" pour générer du contenu de formation</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingContentGenerator;