import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import SupervisionDashboard from '@/components/supervision/SupervisionDashboard';
import SupervisionSessionModal from '@/components/supervision/SupervisionSessionModal';
import TrainingContentGenerator from '@/components/supervision/TrainingContentGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Brain, Target, Users } from 'lucide-react';

import { SupervisionSession, TrainingContent } from '@/types/supervision';

const Supervision: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionModalMode, setSessionModalMode] = useState<'create' | 'edit' | 'conduct'>('create');
  const [selectedSession, setSelectedSession] = useState<SupervisionSession | null>(null);
  const [sessions, setSessions] = useState<SupervisionSession[]>([]);

  // Données mock pour les collaborateurs
  const mockCollaborators = [
    { id: 'COL_001', name: 'Marie Dubois', role: 'Comptable junior', department: 'Comptabilité' },
    { id: 'COL_002', name: 'Pierre Laurent', role: 'Comptable', department: 'Comptabilité' },
    { id: 'COL_003', name: 'Sophie Martin', role: 'Assistant fiscal', department: 'Fiscal' },
    { id: 'COL_004', name: 'Lucas Durand', role: 'Encodeur', department: 'Comptabilité' }
  ];

  // Données mock des supervisions pour l'analyse
  const mockSupervisionData = [
    {
      id: 'SUP_001',
      collaboratorName: 'Marie Dubois',
      findings: [
        { errorCategoryId: 'ERR_ENC_002', description: 'Taux TVA incorrect' },
        { errorCategoryId: 'ERR_ENC_001', description: 'Erreur saisie comptable' }
      ]
    },
    {
      id: 'SUP_002',
      collaboratorName: 'Pierre Laurent',
      findings: [
        { errorCategoryId: 'ERR_ISOC_001', description: 'Classification incorrecte' }
      ]
    },
    {
      id: 'SUP_003',
      collaboratorName: 'Sophie Martin',
      findings: [
        { errorCategoryId: 'ERR_IPP_001', description: 'Déduction non appliquée' },
        { errorCategoryId: 'ERR_ENC_002', description: 'Erreur TVA' }
      ]
    }
  ];

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

  const handleGenerateTrainingContent = (content: TrainingContent) => {
    console.log('Formation générée:', content);
    // Ici on pourrait sauvegarder le contenu généré ou l'envoyer vers un système de gestion de formation
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <PageHeader
          title="Système de Supervision"
          subtitle="Gestion intelligente des supervisions et génération de formations"
          actions={
            <Button onClick={handleCreateSession}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Supervision
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Formation IA</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Analyses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SupervisionDashboard />
          </TabsContent>

          <TabsContent value="training">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Générateur de Formation IA</h2>
                  <p className="text-gray-600">
                    Analyse automatique des erreurs de supervision pour générer du contenu de formation personnalisé.
                  </p>
                </div>
                
                <TrainingContentGenerator
                  supervisionData={mockSupervisionData}
                  collaborators={mockCollaborators}
                  onGenerateContent={handleGenerateTrainingContent}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analyses par collaborateur */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Analyse par Collaborateur</h3>
                <div className="space-y-4">
                  {mockCollaborators.map(collab => {
                    const collaboratorFindings = mockSupervisionData
                      .filter(s => s.collaboratorName === collab.name)
                      .flatMap(s => s.findings);
                    
                    return (
                      <div key={collab.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{collab.name}</h4>
                            <p className="text-sm text-gray-600">{collab.role} - {collab.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-red-600">
                              {collaboratorFindings.length}
                            </div>
                            <div className="text-xs text-gray-500">erreurs</div>
                          </div>
                        </div>
                        
                        {collaboratorFindings.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm text-gray-600">Types d'erreurs fréquentes:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {[...new Set(collaboratorFindings.map(f => f.errorCategoryId))].map(errorId => (
                                <span key={errorId} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  {errorId}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Analyses par type d'erreur */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Analyse par Type d'Erreur</h3>
                <div className="space-y-4">
                  {(() => {
                    const errorCounts: Record<string, { count: number; collaborators: Set<string> }> = {};
                    
                    mockSupervisionData.forEach(session => {
                      session.findings.forEach(finding => {
                        if (!errorCounts[finding.errorCategoryId]) {
                          errorCounts[finding.errorCategoryId] = { count: 0, collaborators: new Set() };
                        }
                        errorCounts[finding.errorCategoryId].count++;
                        errorCounts[finding.errorCategoryId].collaborators.add(session.collaboratorName);
                      });
                    });

                    return Object.entries(errorCounts)
                      .sort(([,a], [,b]) => b.count - a.count)
                      .map(([errorId, data]) => (
                        <div key={errorId} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{errorId}</h4>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-orange-600">
                                {data.count}
                              </div>
                              <div className="text-xs text-gray-500">occurrences</div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            Affecte {data.collaborators.size} collaborateur{data.collaborators.size > 1 ? 's' : ''}
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-xs text-gray-500">Collaborateurs concernés:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Array.from(data.collaborators).map(name => (
                                <span key={name} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  {name.split(' ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de session de supervision */}
        <SupervisionSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          session={selectedSession}
          mode={sessionModalMode}
          onSave={handleSaveSession}
        />
      </div>
    </DashboardLayout>
  );
};

export default Supervision;
