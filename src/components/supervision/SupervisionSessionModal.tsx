import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Plus,
  Save,
  Calendar,
  User,
  FileText,
  Target,
  Clock,
  Star
} from 'lucide-react';

import { supervisionTemplates, errorCategories } from '@/data/supervisionTemplates';
import { SupervisionSession, SupervisionTemplate, Finding, ChecklistItem } from '@/types/supervision';

interface SupervisionSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: SupervisionSession;
  mode: 'create' | 'edit' | 'conduct';
  onSave: (session: SupervisionSession) => void;
}

const SupervisionSessionModal: React.FC<SupervisionSessionModalProps> = ({
  isOpen,
  onClose,
  session,
  mode,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<SupervisionSession>>(
    session || {
      templateId: '',
      collaboratorName: '',
      supervisorName: '',
      clientName: '',
      dossierRef: '',
      scheduledDate: '',
      status: 'planned',
      findings: [],
      recommendations: [],
      followUpRequired: false,
      notes: ''
    }
  );

  const [selectedTemplate, setSelectedTemplate] = useState<SupervisionTemplate | null>(
    session ? supervisionTemplates.find(t => t.id === session.templateId) || null : null
  );

  const [checklistProgress, setChecklistProgress] = useState<Record<string, { completed: boolean; score: number; notes: string }>>({});
  const [newFinding, setNewFinding] = useState<Partial<Finding>>({});
  const [showAddFinding, setShowAddFinding] = useState(false);

  if (!isOpen) return null;

  const handleTemplateChange = (templateId: string) => {
    const template = supervisionTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setFormData(prev => ({ ...prev, templateId }));
    
    // Initialiser le progress de la checklist
    if (template) {
      const progress: Record<string, { completed: boolean; score: number; notes: string }> = {};
      template.checklistItems.forEach(item => {
        progress[item.id] = { completed: false, score: 0, notes: '' };
      });
      setChecklistProgress(progress);
    }
  };

  const handleChecklistItemUpdate = (itemId: string, field: 'completed' | 'score' | 'notes', value: any) => {
    setChecklistProgress(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const calculateOverallScore = () => {
    if (!selectedTemplate) return 0;
    
    const items = selectedTemplate.checklistItems;
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const weightedScore = items.reduce((sum, item) => {
      const progress = checklistProgress[item.id];
      if (progress && progress.completed) {
        return sum + (progress.score * item.weight);
      }
      return sum;
    }, 0);
    
    return totalWeight > 0 ? Math.round((weightedScore / (totalWeight * 5)) * 100) : 0;
  };

  const addFinding = () => {
    if (!newFinding.description) return;
    
    const finding: Finding = {
      id: `FIN_${Date.now()}`,
      checklistItemId: newFinding.checklistItemId || '',
      errorCategoryId: newFinding.errorCategoryId,
      description: newFinding.description,
      severity: newFinding.severity || 'medium',
      status: 'open',
      correctiveAction: newFinding.correctiveAction || '',
      responsible: newFinding.responsible || formData.collaboratorName || '',
      dueDate: newFinding.dueDate || ''
    };
    
    setFormData(prev => ({
      ...prev,
      findings: [...(prev.findings || []), finding]
    }));
    
    setNewFinding({});
    setShowAddFinding(false);
  };

  const handleSave = () => {
    const overallScore = calculateOverallScore();
    
    const sessionData: SupervisionSession = {
      id: session?.id || `SUP_${Date.now()}`,
      templateId: formData.templateId!,
      collaboratorId: session?.collaboratorId || `COL_${Date.now()}`,
      collaboratorName: formData.collaboratorName!,
      supervisorId: session?.supervisorId || `SUP_${Date.now()}`,
      supervisorName: formData.supervisorName!,
      clientName: formData.clientName,
      dossierRef: formData.dossierRef,
      scheduledDate: formData.scheduledDate!,
      completedDate: mode === 'conduct' ? new Date().toISOString() : session?.completedDate,
      status: mode === 'conduct' ? 'completed' : formData.status!,
      duration: session?.duration || 0,
      overallScore,
      findings: formData.findings || [],
      recommendations: formData.recommendations || [],
      followUpRequired: formData.followUpRequired!,
      followUpDate: formData.followUpDate,
      notes: formData.notes!
    };
    
    onSave(sessionData);
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Nouvelle Session de Supervision' :
               mode === 'edit' ? 'Modifier la Session' :
               'Conduire la Supervision'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedTemplate?.name || 'Sélectionnez un modèle de supervision'}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Modèle de supervision</Label>
                  <Select value={formData.templateId} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisionTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Collaborateur</Label>
                  <Input
                    value={formData.collaboratorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, collaboratorName: e.target.value }))}
                    placeholder="Nom du collaborateur"
                  />
                </div>
                
                <div>
                  <Label>Superviseur</Label>
                  <Input
                    value={formData.supervisorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, supervisorName: e.target.value }))}
                    placeholder="Nom du superviseur"
                  />
                </div>
                
                <div>
                  <Label>Date planifiée</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Client (optionnel)</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Nom du client"
                  />
                </div>
                
                <div>
                  <Label>Référence dossier (optionnel)</Label>
                  <Input
                    value={formData.dossierRef}
                    onChange={(e) => setFormData(prev => ({ ...prev, dossierRef: e.target.value }))}
                    placeholder="Référence du dossier"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist de supervision */}
          {selectedTemplate && mode === 'conduct' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Checklist de Supervision
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Progression: {Object.values(checklistProgress).filter(p => p.completed).length}/{selectedTemplate.checklistItems.length}
                    </span>
                    <div className="text-lg font-semibold text-blue-600">
                      Score: {calculateOverallScore()}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(Object.values(checklistProgress).filter(p => p.completed).length / selectedTemplate.checklistItems.length) * 100} 
                  className="mt-2"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTemplate.checklistItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Checkbox
                              checked={checklistProgress[item.id]?.completed || false}
                              onCheckedChange={(checked) => 
                                handleChecklistItemUpdate(item.id, 'completed', checked)
                              }
                            />
                            <h4 className="font-medium">{item.description}</h4>
                            <Badge variant="outline">
                              Poids: {item.weight}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Catégorie: {item.category}
                          </p>
                        </div>
                        
                        {checklistProgress[item.id]?.completed && (
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Score (1-5):</Label>
                            <Select
                              value={String(checklistProgress[item.id]?.score || 0)}
                              onValueChange={(value) => 
                                handleChecklistItemUpdate(item.id, 'score', Number(value))
                              }
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map(score => (
                                  <SelectItem key={score} value={String(score)}>
                                    {score}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      
                      {checklistProgress[item.id]?.completed && (
                        <div className="mt-3">
                          <Label className="text-sm">Notes</Label>
                          <Textarea
                            value={checklistProgress[item.id]?.notes || ''}
                            onChange={(e) => 
                              handleChecklistItemUpdate(item.id, 'notes', e.target.value)
                            }
                            placeholder="Observations, remarques..."
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observations et erreurs */}
          {mode === 'conduct' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Observations et Erreurs
                  </CardTitle>
                  <Button onClick={() => setShowAddFinding(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une observation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddFinding && (
                  <div className="p-4 border rounded-lg mb-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Nouvelle observation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newFinding.description}
                          onChange={(e) => setNewFinding(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de l'observation..."
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Sévérité</Label>
                          <Select
                            value={newFinding.severity}
                            onValueChange={(value: any) => setNewFinding(prev => ({ ...prev, severity: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la sévérité" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Faible</SelectItem>
                              <SelectItem value="medium">Modérée</SelectItem>
                              <SelectItem value="high">Élevée</SelectItem>
                              <SelectItem value="critical">Critique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Catégorie d'erreur</Label>
                          <Select
                            value={newFinding.errorCategoryId}
                            onValueChange={(value) => setNewFinding(prev => ({ ...prev, errorCategoryId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {errorCategories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Action corrective</Label>
                          <Input
                            value={newFinding.correctiveAction}
                            onChange={(e) => setNewFinding(prev => ({ ...prev, correctiveAction: e.target.value }))}
                            placeholder="Action à entreprendre..."
                          />
                        </div>
                        
                        <div>
                          <Label>Date limite</Label>
                          <Input
                            type="date"
                            value={newFinding.dueDate}
                            onChange={(e) => setNewFinding(prev => ({ ...prev, dueDate: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddFinding(false)}>
                        Annuler
                      </Button>
                      <Button onClick={addFinding}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Liste des observations existantes */}
                <div className="space-y-3">
                  {formData.findings?.map(finding => (
                    <div key={finding.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getSeverityColor(finding.severity)}>
                              {finding.severity === 'critical' ? 'Critique' :
                               finding.severity === 'high' ? 'Élevée' :
                               finding.severity === 'medium' ? 'Modérée' : 'Faible'}
                            </Badge>
                            {finding.errorCategoryId && (
                              <Badge variant="outline">
                                {errorCategories.find(c => c.id === finding.errorCategoryId)?.name}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium mb-1">{finding.description}</p>
                          {finding.correctiveAction && (
                            <p className="text-sm text-gray-600">
                              Action: {finding.correctiveAction}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Échéance: {new Date(finding.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes et recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes et Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Notes de supervision</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observations générales, points forts, axes d'amélioration..."
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.followUpRequired}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, followUpRequired: checked as boolean }))
                    }
                  />
                  <Label>Suivi requis</Label>
                </div>
                
                {formData.followUpRequired && (
                  <div>
                    <Label>Date de suivi</Label>
                    <Input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {mode === 'conduct' && (
            <div className="flex items-center space-x-2 mr-auto">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">
                Score final: {calculateOverallScore()}%
              </span>
            </div>
          )}
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {mode === 'create' ? 'Créer' : mode === 'edit' ? 'Modifier' : 'Terminer la supervision'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupervisionSessionModal;
