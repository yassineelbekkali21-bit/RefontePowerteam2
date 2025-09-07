import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, Trash2, Save, Eye, Calendar, User, ClipboardList, ImageIcon, Sparkles, Brain, Zap, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { SupervisionSession } from '@/types/supervision';
import { supervisionTemplates } from '@/data/supervisionTemplates';
import ImageAnnotator, { Annotation } from './ImageAnnotator';

interface SupervisionSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'conduct';
  session?: SupervisionSession | null;
  onSave: (session: SupervisionSession) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  annotations: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    type: 'highlight' | 'outline';
  }>;
  name: string;
}

const SupervisionSessionModal: React.FC<SupervisionSessionModalProps> = ({
  isOpen,
  onClose,
  mode,
  session,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour la création/édition
  const [formData, setFormData] = useState({
    templateId: session?.templateId || '',
    collaboratorName: session?.collaboratorName || '',
    observations: session?.notes || '',
    actionsCorrectives: '',
    score: session?.score || 0
  });
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [currentStep, setCurrentStep] = useState<'template' | 'collaborator' | 'observations' | 'review'>('template');

  // Collaborateurs disponibles
  const collaborators = [
    { id: 'COL_001', name: 'Marie Dubois', role: 'Comptable junior', department: 'Comptabilité' },
    { id: 'COL_002', name: 'Pierre Laurent', role: 'Comptable', department: 'Comptabilité' },
    { id: 'COL_003', name: 'Sophie Martin', role: 'Assistant fiscal', department: 'Fiscal' },
    { id: 'COL_004', name: 'Lucas Durand', role: 'Encodeur', department: 'Comptabilité' }
  ];

  const selectedTemplate = supervisionTemplates.find(t => t.id === formData.templateId);

  // Fonction pour calculer le score de manière cohérente
  const calculateSupervisionScore = () => {
    const errorAnnotations = uploadedImages.reduce((sum, img) => 
      sum + img.annotations.filter(ann => ann.type === 'outline').length, 0
    );
    const observationAnnotations = uploadedImages.reduce((sum, img) => 
      sum + img.annotations.filter(ann => ann.type === 'highlight').length, 0
    );
    
    let score = 100;
    
    // Déduction pour les erreurs détectées (rouge)
    score -= errorAnnotations * 15; // -15 points par erreur majeure
    
    // Déduction légère pour les observations (jaune) - points d'amélioration
    score -= observationAnnotations * 5; // -5 points par point d'amélioration
    
    // Bonus/malus selon la qualité des observations textuelles
    const observationLength = formData.observations.length;
    if (observationLength < 50) {
      score -= 10; // Observations trop courtes
    } else if (observationLength > 200) {
      score += 5; // Observations détaillées
    }
    
    // Malus si pas d'actions correctives définies
    if (!formData.actionsCorrectives || formData.actionsCorrectives.length < 20) {
      score -= 10;
    }
    
    // Score final entre 0 et 100
    return Math.max(0, Math.min(100, score));
  };

  // Réinitialiser l'étape quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && mode === 'create') {
      setCurrentStep('template');
      setFormData({
        templateId: '',
        collaboratorName: '',
        observations: '',
        actionsCorrectives: '',
        score: 0
      });
      setUploadedImages([]);
    }
  }, [isOpen, mode]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newImage: UploadedImage = {
          id: `img_${Date.now()}_${Math.random()}`,
          file,
          url,
          annotations: [],
          name: file.name
        };
        setUploadedImages(prev => [...prev, newImage]);
      }
    });

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleImageDelete = (imageId: string) => {
    setUploadedImages(prev => {
      const imageToDelete = prev.find(img => img.id === imageId);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleAnnotationsChange = (imageId: string, annotations: Annotation[]) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, annotations } : img
      )
    );
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'template':
        if (formData.templateId) setCurrentStep('collaborator');
        break;
      case 'collaborator':
        if (formData.collaboratorName) setCurrentStep('observations');
        break;
      case 'observations':
        setCurrentStep('review');
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'collaborator':
        setCurrentStep('template');
        break;
      case 'observations':
        setCurrentStep('collaborator');
        break;
      case 'review':
        setCurrentStep('observations');
        break;
    }
  };

  const handleSave = () => {
    const totalAnnotations = uploadedImages.reduce((sum, img) => sum + img.annotations.length, 0);
    const errorAnnotations = uploadedImages.reduce((sum, img) => 
      sum + img.annotations.filter(ann => ann.type === 'outline').length, 0
    ); // On considère les annotations "outline" (rouge) comme des erreurs importantes
    
    // Utiliser la fonction de calcul cohérente
    const calculatedScore = calculateSupervisionScore();

    const newSession: SupervisionSession = {
      id: session?.id || `SUP_${Date.now()}`,
      templateId: formData.templateId,
      templateName: selectedTemplate?.name || '',
      collaboratorId: collaborators.find(c => c.name === formData.collaboratorName)?.id || '',
      collaboratorName: formData.collaboratorName,
      supervisorId: 'SUP_001',
      supervisorName: 'Manager Principal',
      date: new Date().toISOString(),
      score: calculatedScore,
      status: 'Completed',
      findings: uploadedImages.flatMap(img => 
        img.annotations.filter(ann => ann.type === 'outline').map(ann => ({
          id: ann.id,
          sessionId: session?.id || `SUP_${Date.now()}`,
          collaboratorId: collaborators.find(c => c.name === formData.collaboratorName)?.id || '',
          collaboratorName: formData.collaboratorName,
          errorType: 'Autre' as any,
          severity: 'Modérée' as any,
          description: ann.comment,
          correctiveAction: formData.actionsCorrectives || 'À définir',
          dateIdentified: new Date().toISOString(),
          status: 'Open' as any
        }))
      ),
      notes: formData.observations,
      images: uploadedImages.map(img => ({
        id: img.id,
        name: img.name,
        url: img.url,
        annotations: img.annotations
      }))
    };

    onSave(newSession);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'template': return !!formData.templateId;
      case 'collaborator': return !!formData.collaboratorName;
      case 'observations': return formData.observations.length >= 10;
      case 'review': return true;
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'template': return 'Sélection du modèle';
      case 'collaborator': return 'Collaborateur supervisé';
      case 'observations': return 'Observations et captures d\'écran';
      case 'review': return 'Révision et validation';
      default: return 'Supervision';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 backdrop-blur-lg border border-white/20 shadow-2xl"
        aria-labelledby="supervision-modal-title"
        aria-describedby="supervision-modal-description"
        role="dialog"
      >
        <DialogHeader className="relative">
          {/* Glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-t-lg backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span 
                    id="supervision-modal-title"
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Session de Supervision IA
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className="bg-white/70 border-blue-200 text-blue-700 backdrop-blur-sm"
                    >
                      Étape {
                        currentStep === 'template' ? '1' :
                        currentStep === 'collaborator' ? '2' :
                        currentStep === 'observations' ? '3' : '4'
                      } / 4
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="bg-green-50/70 border-green-200 text-green-700 backdrop-blur-sm"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      Auto-Save Actif
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>En ligne</span>
                </div>
              </div>
            </DialogTitle>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 
                  id="supervision-modal-description"
                  className="text-lg font-semibold text-gray-800"
                >
                  {getStepTitle()}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>Dernière sauvegarde: maintenant</span>
                </div>
              </div>
              
              {/* Modern Progress bar */}
              <div id="step-progress" className="relative" role="progressbar" aria-valuenow={
                currentStep === 'template' ? 25 :
                currentStep === 'collaborator' ? 50 :
                currentStep === 'observations' ? 75 : 100
              } aria-valuemin={0} aria-valuemax={100}>
                <div className="w-full bg-gray-200/50 rounded-full h-3 backdrop-blur-sm shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                    style={{ 
                      width: `${
                        currentStep === 'template' ? '25%' :
                        currentStep === 'collaborator' ? '50%' :
                        currentStep === 'observations' ? '75%' : '100%'
                      }%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                  </div>
                </div>
                
                {/* Step indicators */}
                <div className="flex justify-between mt-2">
                  {['Modèle', 'Collaborateur', 'Observations', 'Révision'].map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        index < (currentStep === 'template' ? 1 : currentStep === 'collaborator' ? 2 : currentStep === 'observations' ? 3 : 4)
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index < (currentStep === 'template' ? 1 : currentStep === 'collaborator' ? 2 : currentStep === 'observations' ? 3 : 4) ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Étape 1: Sélection du modèle */}
          {currentStep === 'template' && (
            <div className="space-y-6">
              {/* AI-Powered Template Selection */}
              <div className="relative">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <Label className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Modèle de supervision intelligent
                  </Label>
                  <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                    <Zap className="w-3 h-3 mr-1" />
                    IA-Optimisé
                  </Badge>
                </div>
                
                <Select value={formData.templateId} onValueChange={(value) => setFormData(prev => ({ ...prev, templateId: value }))}>
                  <SelectTrigger className="h-12 bg-white/70 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm">
                    <SelectValue placeholder="🎯 Choisissez le modèle adapté à votre supervision..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-lg border border-purple-200 shadow-2xl">
                    {supervisionTemplates.map(template => (
                      <SelectItem 
                        key={template.id} 
                        value={template.id}
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 py-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                          >
                            {template.theme}
                          </Badge>
                          <span className="font-medium">{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <Card className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-200/50 shadow-xl backdrop-blur-sm">
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
                    <div className="relative z-10">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {selectedTemplate.name}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                              {selectedTemplate.theme}
                            </Badge>
                            <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Recommandé
                            </Badge>
                          </div>
                        </div>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{selectedTemplate.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                          <ClipboardList className="w-4 h-4 text-purple-600" />
                          <span>Points de contrôle</span>
                        </h4>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                          {selectedTemplate.checklistItems.length} points
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto pr-2">
                        {selectedTemplate.checklistItems.slice(0, 5).map((item, index) => (
                          <div 
                            key={item.id} 
                            className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg border border-purple-100 hover:bg-purple-50/50 transition-all duration-200"
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{item.description}</p>
                              {item.isRequired && (
                                <Badge variant="outline" className="text-xs mt-1 border-orange-200 text-orange-700 bg-orange-50">
                                  Obligatoire
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {selectedTemplate.checklistItems.length > 5 && (
                          <div className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                            <span className="text-sm text-purple-700 font-medium">
                              <ArrowRight className="w-4 h-4 inline mr-2" />
                              ... et {selectedTemplate.checklistItems.length - 5} autres points de contrôle
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Étape 2: Sélection du collaborateur */}
          {currentStep === 'collaborator' && (
            <div className="space-y-4">
              <div>
                <Label>Collaborateur à superviser</Label>
                <Select value={formData.collaboratorName} onValueChange={(value) => setFormData(prev => ({ ...prev, collaboratorName: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un collaborateur..." />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborators.map(collab => (
                      <SelectItem key={collab.id} value={collab.name}>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{collab.name}</div>
                            <div className="text-sm text-gray-500">{collab.role} - {collab.department}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.collaboratorName && selectedTemplate && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{formData.collaboratorName}</h3>
                        <p className="text-sm text-gray-600">
                          Supervision: <span className="font-medium">{selectedTemplate.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date().toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Étape 3: Observations */}
          {currentStep === 'observations' && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Observations de supervision</h3>
                <p className="text-sm text-gray-600">
                  Rédigez vos observations détaillées et ajoutez des captures d'écran pour documenter visuellement les erreurs.
                </p>
              </div>

              {/* Layout en 2 colonnes */}
              <div className="flex-1 grid grid-cols-2 gap-6 min-h-[500px]">
                {/* Colonne gauche : Texte */}
                <div className="flex flex-col space-y-4">
                  <div className="flex-1">
                    <Label className="text-base font-medium mb-2 block">Observations détaillées</Label>
                    <Textarea
                      value={formData.observations}
                      onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                      placeholder="Décrivez en détail vos observations sur le travail du collaborateur...

Exemples :
- Erreur de saisie TVA sur facture client XYZ
- Mauvaise imputation comptable sur compte 6xxxx
- Lettrage incomplet sur le compte client ABC
- Non-respect de la procédure de contrôle..."
                      className="h-64 font-mono text-sm resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${formData.observations.length >= 10 ? 'text-green-600' : 'text-red-500'}`}>
                        {formData.observations.length} caractères 
                        {formData.observations.length < 10 && ' (minimum 10 requis)'}
                      </span>
                      <Badge variant={formData.observations.length >= 100 ? 'default' : 'outline'}>
                        {formData.observations.length >= 100 ? 'Détaillé' : 'À développer'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Label className="text-base font-medium mb-2 block">Actions correctives recommandées</Label>
                    <Textarea
                      value={formData.actionsCorrectives}
                      onChange={(e) => setFormData(prev => ({ ...prev, actionsCorrectives: e.target.value }))}
                      placeholder="Décrivez les actions concrètes à mettre en place...

Exemples :
- Formation TVA à prévoir
- Revoir la procédure d'imputation
- Session de rappel sur le lettrage
- Validation par un senior avant validation"
                      className="h-32 resize-none"
                    />
                  </div>
                </div>

                {/* Colonne droite : Captures d'écran */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-base font-medium">Captures d'écran justificatives</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Ajoutez des images pour documenter visuellement les erreurs
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="flex-1 overflow-y-auto pr-2">
                    {uploadedImages.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center h-64 flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">
                          Aucune capture d'écran ajoutée
                        </p>
                        <p className="text-xs text-gray-400">
                          Cliquez sur "Ajouter" pour importer des images
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {uploadedImages.map((image) => (
                          <Card key={image.id} className="border border-gray-200">
                            <CardHeader className="pb-2 px-3 pt-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <FileImage className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-sm truncate max-w-[150px]" title={image.name}>
                                    {image.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {image.annotations.length}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleImageDelete(image.id)}
                                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <ImageAnnotator
                                imageUrl={image.url}
                                annotations={image.annotations}
                                onAnnotationsChange={(annotations) => handleAnnotationsChange(image.id, annotations)}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Étape 4: Révision */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la supervision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Modèle utilisé</Label>
                      <p className="font-medium">{selectedTemplate?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Collaborateur</Label>
                      <p className="font-medium">{formData.collaboratorName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Observations</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm max-h-32 overflow-y-auto">
                      {formData.observations}
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Images documentaires</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {uploadedImages.map(img => (
                          <Badge key={img.id} variant="outline" className="text-xs">
                            {img.name} ({img.annotations.length} annotations)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <Label className="text-sm font-medium text-gray-600">Score final</Label>
                        <div className={`text-2xl font-bold ${
                          calculateSupervisionScore() >= 80 ? 'text-green-600' :
                          calculateSupervisionScore() >= 60 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {calculateSupervisionScore()}%
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            calculateSupervisionScore() >= 80 ? 'border-green-300 text-green-700 bg-green-50' :
                            calculateSupervisionScore() >= 60 ? 'border-orange-300 text-orange-700 bg-orange-50' : 
                            'border-red-300 text-red-700 bg-red-50'
                          }`}
                        >
                          {calculateSupervisionScore() >= 80 ? 'Excellent' :
                           calculateSupervisionScore() >= 60 ? 'Satisfaisant' : 'À améliorer'}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Label className="text-sm font-medium text-gray-600">Erreurs majeures</Label>
                        <div className="text-2xl font-bold text-red-600">
                          {uploadedImages.reduce((sum, img) => 
                            sum + img.annotations.filter(ann => ann.type === 'outline').length, 0
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1 border-red-300 text-red-700 bg-red-50">
                          Contour rouge
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Label className="text-sm font-medium text-gray-600">Points d'amélioration</Label>
                        <div className="text-2xl font-bold text-yellow-600">
                          {uploadedImages.reduce((sum, img) => 
                            sum + img.annotations.filter(ann => ann.type === 'highlight').length, 0
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1 border-yellow-300 text-yellow-700 bg-yellow-50">
                          Surlignage jaune
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Explication du scoring */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Logique de calcul du score</h4>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p>• <strong>Base :</strong> 100 points</p>
                        <p>• <strong>Erreurs majeures (rouge) :</strong> -15 points chacune</p>
                        <p>• <strong>Points d'amélioration (jaune) :</strong> -5 points chacun</p>
                        <p>• <strong>Observations courtes (&lt;50 car) :</strong> -10 points</p>
                        <p>• <strong>Observations détaillées (&gt;200 car) :</strong> +5 points</p>
                        <p>• <strong>Actions correctives manquantes :</strong> -10 points</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200/50 bg-gradient-to-r from-white/80 via-blue-50/50 to-purple-50/50 backdrop-blur-lg">
          <div className="flex justify-between items-center w-full py-2">
            <Button 
              variant="outline" 
              onClick={currentStep === 'template' ? onClose : handlePrevious}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {currentStep === 'template' ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </>
              )}
            </Button>
            
            <div className="flex space-x-3">
              {currentStep === 'review' ? (
                <Button 
                  onClick={handleSave} 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Finaliser la supervision
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed()}
                  aria-label={canProceed() ? `Continuer vers l'étape suivante` : 'Complétez cette étape pour continuer'}
                  aria-describedby="step-progress"
                  className={`font-semibold px-6 py-2 shadow-lg transition-all duration-300 ${
                    canProceed() 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105 active:scale-95' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canProceed() ? (
                    <>
                      Continuer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Complétez cette étape
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupervisionSessionModal;