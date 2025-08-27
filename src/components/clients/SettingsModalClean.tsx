import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, User, AlertTriangle, UserMinus, UserX, UserPlus, UserCheck, Save, FileText } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
}

interface ClientSettings {
  statut: 'Nouveau' | 'A risque' | 'En partance' | 'Sorti';
  gestionnaire: string;
  superviseur: string;
  typeClient: string;

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

const gestionnaires = [
  'Marie Dubois',
  'Jean Martin', 
  'Sophie Laurent',
  'Pierre Moreau',
  'Anne Rousseau'
];

const typesClients = [
  'Médecin',
  'Dentiste', 
  'Kinésithérapeute',
  'Artiste',
  'Production cinéma',
  'Construction/Bâtiment',
  'Immobilier'
];

const prestationsFinales = [
  'Comptabilité générale',
  'Déclarations fiscales',
  'Paie et social',
  'Audit et révision',
  'Conseil juridique',
  'Gestion administrative'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, client }) => {
  const [settings, setSettings] = useState<ClientSettings>({
    statut: client?.statut || 'Nouveau',
    gestionnaire: client?.gestionnaire || '',
    superviseur: client?.superviseur || '',
    typeClient: client?.type || '',
    notes: '',
    contextualData: {}
  });

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'A risque': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En partance': return 'bg-red-100 text-red-800 border-red-200';
      case 'Sorti': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Nouveau': return <User className="w-4 h-4" />;
      case 'A risque': return <AlertTriangle className="w-4 h-4" />;
      case 'En partance': return <ArrowRight className="w-4 h-4" />;
      case 'Sorti': return <UserX className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const renderContextualFields = () => {
    switch (settings.statut) {
      case 'Nouveau':
        return (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informations Nouveau Client
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Date de création
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
                <label className="block text-sm font-medium text-blue-800 mb-2">
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
                  <option value="">Sélectionner</option>
                  <option value="Recommandation">Recommandation</option>
                  <option value="Site web">Site web</option>
                  <option value="Réseaux sociaux">Réseaux sociaux</option>
                  <option value="Démarchage">Démarchage</option>
                  <option value="Salon professionnel">Salon professionnel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Notes initiales
                </label>
                <textarea
                  value={settings.contextualData.notesInitiales || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, notesInitiales: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes sur le premier contact, besoins exprimés..."
                />
              </div>
            </div>
          </Card>
        );

      case 'A risque':
        return (
          <Card className="p-4 bg-orange-50 border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Gestion Client à Risque
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">
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
                  <option value="">Sélectionner</option>
                  <option value="Retard de paiement">Retard de paiement</option>
                  <option value="Mécontentement service">Mécontentement service</option>
                  <option value="Concurrence">Concurrence</option>
                  <option value="Difficultés financières">Difficultés financières</option>
                  <option value="Changement d'interlocuteur">Changement d'interlocuteur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  Plan d'action
                </label>
                <textarea
                  value={settings.contextualData.planAction || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, planAction: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Actions à mettre en place pour récupérer le client..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recupere"
                    checked={settings.contextualData.recupere || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      contextualData: { ...settings.contextualData, recupere: e.target.checked }
                    })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                  />
                  <label htmlFor="recupere" className="ml-2 text-sm font-medium text-orange-800">
                    Client récupéré
                  </label>
                </div>
                {settings.contextualData.recupere && (
                  <div>
                    <input
                      type="date"
                      value={settings.contextualData.dateRecuperation || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        contextualData: { ...settings.contextualData, dateRecuperation: e.target.value }
                      })}
                      className="px-3 py-1 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        );

      case 'En partance':
        return (
          <Card className="p-4 bg-red-50 border-red-200">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2" />
              Client en Partance
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
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
                  <option value="">Sélectionner</option>
                  <option value="Tarif trop élevé">Tarif trop élevé</option>
                  <option value="Service insatisfaisant">Service insatisfaisant</option>
                  <option value="Concurrence">Concurrence</option>
                  <option value="Internalisation">Internalisation</option>
                  <option value="Cessation d'activité">Cessation d'activité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="tentativeRecuperation"
                    checked={settings.contextualData.tentativeRecuperation || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      contextualData: { ...settings.contextualData, tentativeRecuperation: e.target.checked }
                    })}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
                  />
                  <label htmlFor="tentativeRecuperation" className="ml-2 text-sm font-medium text-red-800">
                    Tentative de récupération en cours
                  </label>
                </div>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Récupérer
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'Sorti':
        return (
          <Card className="p-4 bg-gray-50 border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <UserX className="w-4 h-4 mr-2" />
              Client Sorti
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de sortie
                </label>
                <input
                  type="date"
                  value={settings.contextualData.dateSortie || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, dateSortie: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de sortie
                </label>
                <select
                  value={settings.contextualData.motifSortie || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    contextualData: { ...settings.contextualData, motifSortie: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="Fin de contrat">Fin de contrat</option>
                  <option value="Résiliation client">Résiliation client</option>
                  <option value="Résiliation cabinet">Résiliation cabinet</option>
                  <option value="Cessation d'activité">Cessation d'activité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dernières prestations réalisées
                </label>
                <div className="space-y-2">
                  {prestationsFinales.map((prestation) => (
                    <div key={prestation} className="flex items-center">
                      <input
                        type="checkbox"
                        id={prestation}
                        checked={settings.contextualData.prestationsFinales?.includes(prestation) || false}
                        onChange={(e) => {
                          const current = settings.contextualData.prestationsFinales || [];
                          const updated = e.target.checked
                            ? [...current, prestation]
                            : current.filter(p => p !== prestation);
                          setSettings({
                            ...settings,
                            contextualData: { ...settings.contextualData, prestationsFinales: updated }
                          });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Paramétrage Client</h2>
            <p className="text-sm text-gray-600 mt-1">
              {client?.name || 'Configuration des paramètres client'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* Informations générales */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <User className="w-5 h-5 mr-2" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gestionnaire de dossiers
                  </label>
                  <select
                    value={settings.gestionnaire}
                    onChange={(e) => setSettings({...settings, gestionnaire: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Sophie Laurent">Sophie Laurent</option>
                    <option value="Marie Durand">Marie Durand</option>
                    <option value="Jean Moreau">Jean Moreau</option>
                    <option value="Pierre Martin">Pierre Martin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Superviseur
                  </label>
                  <select
                    value={settings.superviseur}
                    onChange={(e) => setSettings({...settings, superviseur: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Directeur Associé">Directeur Associé</option>
                    <option value="Manager Senior">Manager Senior</option>
                    <option value="Chef d'équipe">Chef d'équipe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de client
                  </label>
                  <select
                    value={settings.typeClient}
                    onChange={(e) => setSettings({...settings, typeClient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Médecin">Médecin</option>
                    <option value="Dentiste">Dentiste</option>
                    <option value="Kinésithérapeute">Kinésithérapeute</option>
                    <option value="Artiste">Artiste</option>
                    <option value="Construction">Construction</option>
                    <option value="Immobilier">Immobilier</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut client avec design de la version précédente */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Statut client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Statut Nouveau */}
                <div 
                  className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                    selectedStatus === 'nouveau' 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStatus('nouveau')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedStatus === 'nouveau' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        selectedStatus === 'nouveau' ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        Nouveau
                      </div>
                      <div className="text-xs text-gray-600">Client récemment acquis</div>
                    </div>
                  </div>
                  {selectedStatus === 'nouveau' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Statut A risque */}
                <div 
                  className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                    selectedStatus === 'a-risque' 
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStatus('a-risque')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedStatus === 'a-risque' 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        selectedStatus === 'a-risque' ? 'text-orange-800' : 'text-gray-800'
                      }`}>
                        À risque
                      </div>
                      <div className="text-xs text-gray-600">Attention requise</div>
                    </div>
                  </div>
                  {selectedStatus === 'a-risque' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Statut En partance */}
                <div 
                  className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                    selectedStatus === 'en-partance' 
                      ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStatus('en-partance')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedStatus === 'en-partance' 
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <UserMinus className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        selectedStatus === 'en-partance' ? 'text-red-800' : 'text-gray-800'
                      }`}>
                        En partance
                      </div>
                      <div className="text-xs text-gray-600">Départ prévu</div>
                    </div>
                  </div>
                  {selectedStatus === 'en-partance' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Statut Sorti */}
                <div 
                  className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                    selectedStatus === 'sorti' 
                      ? 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedStatus('sorti')}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedStatus === 'sorti' 
                        ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <UserX className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        selectedStatus === 'sorti' ? 'text-gray-800' : 'text-gray-800'
                      }`}>
                        Sorti
                      </div>
                      <div className="text-xs text-gray-600">Client parti</div>
                    </div>
                  </div>
                  {selectedStatus === 'sorti' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Champs contextuels selon le statut */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                {selectedStatus === 'nouveau' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations nouveau client
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      placeholder="Notes, informations importantes, contexte..."
                    />
                  </div>
                )}

                {selectedStatus === 'a-risque' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raison du risque
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={2}
                        placeholder="Détails sur les raisons du risque..."
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Client récupéré (était en partance)</span>
                    </div>
                  </div>
                )}

                {selectedStatus === 'en-partance' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raison du départ
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={2}
                        placeholder="Motifs de départ, insatisfaction..."
                      />
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Marquer comme récupéré
                    </Button>
                  </div>
                )}

                {selectedStatus === 'sorti' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dernières prestations à effectuer
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={2}
                        placeholder="Liste des prestations restantes..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de renon
                      </label>
                      <input
                        type="date"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Délai de prestation</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => {
            console.log('Settings saved:', settings);
            onClose();
          }} className="bg-blue-500 hover:bg-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
