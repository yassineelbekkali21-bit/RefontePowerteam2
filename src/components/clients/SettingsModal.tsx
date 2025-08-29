import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, User, AlertTriangle, UserMinus, UserX, UserPlus, UserCheck, Save } from 'lucide-react';
import { useClients } from '@/contexts/ClientsContext';
import { useToast } from '@/components/ui/use-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
}

interface ClientSettings {
  statut: 'Nouveau' | 'A risque' | 'En partance' | 'Sorti';
  notes: string;
  contextualData: {
    // Pour "Nouveau"
    dateCreation?: string;
    sourceProspection?: string;
    notesInitiales?: string;
    // Pour "A risque"
    raisonRisque?: string;
    planAction?: string;
    dateRecuperation?: string;
    recupere?: boolean;
    // Pour "En partance"
    raisonDepart?: string;
    datePrevisionnelle?: string;
    tentativeRecuperation?: boolean;
    // Pour "Sorti"
    prestationsFinales?: string[];
    dateSortie?: string;
    motifSortie?: string;
  };
}



export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, client }) => {
  const { addClientRisque, removeClientRisque, getClientRisqueByName } = useClients();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ClientSettings>({
    statut: client?.statut || 'Nouveau',
    notes: '',
    contextualData: {}
  });

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    const previousStatus = client?.statut;
    const newStatus = settings.statut;

    // Si le statut change vers "A risque", ajouter le client dans le contexte
    if (newStatus === 'A risque' && previousStatus !== 'A risque') {
      const clientRisque = {
        id: client?.id || `R${Date.now()}`,
        nom: client?.name || 'Client Inconnu',
        idClient: client?.id || `CLI-${Date.now()}`,
        statut: 'A risque' as const,
        secteur: client?.type || 'Non défini',
        gestionnaire: client?.gestionnaire || 'Non assigné',
        dateContact: new Date().toLocaleDateString('fr-FR'),
        rdvDate: null,
        caBudgete: client?.budgetEconomique || 0,
        email: client?.email || '',
        telephone: client?.phone || '',
        commentaire: settings.contextualData.raisonRisque || 'Statut modifié via paramétrage',
        raisonRisque: settings.contextualData.raisonRisque || '',
        planAction: settings.contextualData.planAction || '',
        dateRecuperation: settings.contextualData.dateRecuperation || '',
        recupere: false
      };

      addClientRisque(clientRisque);
      
      toast({
        title: "Client ajouté aux clients à risque",
        description: `${client?.name} a été ajouté au tableau des clients à risque dans le module Croissance.`,
        duration: 4000,
      });
    }

    // Si le statut change depuis "A risque" vers autre chose, supprimer du contexte
    if (previousStatus === 'A risque' && newStatus !== 'A risque') {
      const existingClient = getClientRisqueByName(client?.name || '');
      if (existingClient) {
        removeClientRisque(existingClient.id);
        
        toast({
          title: "Client retiré des clients à risque",
          description: `${client?.name} a été retiré du tableau des clients à risque.`,
          duration: 4000,
        });
      }
    }

    // Sauvegarder les autres paramètres (ici on pourrait appeler une API)
    console.log('Paramètres sauvegardés:', { client: client?.name, settings });
    
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été enregistrées avec succès.",
      duration: 3000,
    });

    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-500';
      case 'A risque': return 'bg-orange-500';
      case 'En partance': return 'bg-red-500';
      case 'Sorti': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Nouveau': return <User className="w-4 h-4" />;
      case 'A risque': return <AlertTriangle className="w-4 h-4" />;
      case 'En partance': return <UserMinus className="w-4 h-4" />;
      case 'Sorti': return <UserX className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const renderContextualSection = () => {
    switch (settings.statut) {
      case 'Nouveau':
        return (
          <Card className="bg-blue-50/50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <UserPlus className="w-5 h-5 mr-2" />
                Client Récemment Acquis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Date de création du dossier
                </label>
                <input
                  type="date"
                  value={settings.contextualData.dateCreation || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, dateCreation: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Source de prospection
                </label>
                <select
                  value={settings.contextualData.sourceProspection || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, sourceProspection: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une source</option>
                  <option value="Recommandation">Recommandation</option>
                  <option value="Site web">Site web</option>
                  <option value="Réseaux sociaux">Réseaux sociaux</option>
                  <option value="Salon professionnel">Salon professionnel</option>
                  <option value="Prospection directe">Prospection directe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Notes initiales
                </label>
                <textarea
                  value={settings.contextualData.notesInitiales || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, notesInitiales: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Premières impressions, attentes du client..."
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'A risque':
        return (
          <Card className="bg-orange-50/50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Attention Requise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Raison du risque
                </label>
                <select
                  value={settings.contextualData.raisonRisque || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, raisonRisque: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une raison</option>
                  <option value="Retard de paiement">Retard de paiement</option>
                  <option value="Insatisfaction service">Insatisfaction service</option>
                  <option value="Concurrence">Concurrence</option>
                  <option value="Difficultés financières">Difficultés financières</option>
                  <option value="Changement d'interlocuteur">Changement d'interlocuteur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Plan d'action mis en place
                </label>
                <textarea
                  value={settings.contextualData.planAction || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, planAction: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Actions entreprises pour résoudre le problème..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Date de récupération prévue
                  </label>
                    <input
                      type="date"
                      value={settings.contextualData.dateRecuperation || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contextualData: { ...settings.contextualData, dateRecuperation: e.target.value }
                      })}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.contextualData.recupere || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, recupere: e.target.checked }
                  })}
                  className="rounded"
                />
                <label className="text-sm font-medium text-orange-700">
                  Client récupéré
                </label>
              </div>
            </CardContent>
          </Card>
        );

      case 'En partance':
        return (
          <Card className="bg-red-50/50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <UserMinus className="w-5 h-5 mr-2" />
                Départ Prévu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Raison du départ
                </label>
                <select
                  value={settings.contextualData.raisonDepart || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, raisonDepart: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une raison</option>
                  <option value="Tarifs trop élevés">Tarifs trop élevés</option>
                  <option value="Service insatisfaisant">Service insatisfaisant</option>
                  <option value="Changement de stratégie">Changement de stratégie</option>
                  <option value="Internalisation">Internalisation</option>
                  <option value="Fermeture d'activité">Fermeture d'activité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Date prévisionnelle de départ
                </label>
                <input
                  type="date"
                  value={settings.contextualData.datePrevisionnelle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, datePrevisionnelle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.contextualData.tentativeRecuperation || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      contextualData: { ...settings.contextualData, tentativeRecuperation: e.target.checked }
                    })}
                  className="rounded"
                  />
                <label className="text-sm font-medium text-red-700">
                    Tentative de récupération en cours
                  </label>
              </div>
            </CardContent>
          </Card>
        );

      case 'Sorti':
        return (
          <Card className="bg-gray-50/50 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <UserX className="w-5 h-5 mr-2" />
                Client Parti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prestations finales à réaliser
                </label>
                <div className="space-y-2">
                  {['Clôture comptable', 'Remise des documents', 'Facturation finale', 'Archivage dossier'].map((prestation, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.contextualData.prestationsFinales?.includes(prestation) || false}
                        onChange={(e) => {
                          const currentPrestations = settings.contextualData.prestationsFinales || [];
                          const newPrestations = e.target.checked
                            ? [...currentPrestations, prestation]
                            : currentPrestations.filter(p => p !== prestation);
                          setSettings({
                            ...settings,
                            contextualData: { ...settings.contextualData, prestationsFinales: newPrestations }
                          });
                        }}
                        className="rounded"
                      />
                      <label className="text-sm text-gray-700">{prestation}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date effective de sortie
                </label>
                <input
                  type="date"
                  value={settings.contextualData.dateSortie || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, dateSortie: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de sortie
                </label>
                <textarea
                  value={settings.contextualData.motifSortie || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, motifSortie: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Raison détaillée du départ..."
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getStatusColor(settings.statut)} text-white`}>
              {getStatusIcon(settings.statut)}
            </div>
          <div>
              <h2 className="text-xl font-semibold text-gray-900">Paramétrage Client</h2>
              <p className="text-sm text-gray-500">Configuration et suivi du dossier client</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statut Client */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Statut Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {(['Nouveau', 'A risque', 'En partance', 'Sorti'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSettings({...settings, statut: status, contextualData: {}})}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.statut === status
                        ? `${getStatusColor(status)} text-white border-transparent`
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(status)}
                    </div>
                    <div className="text-sm font-medium">{status}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section Contextuelle */}
          {renderContextualSection()}

          {/* Notes */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Save className="w-5 h-5 mr-2" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={settings.notes}
                onChange={(e) => setSettings({...settings, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Notes générales sur le client..."
                  />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSaveSettings} className="bg-blue-500 hover:bg-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
