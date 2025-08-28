import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  X, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Euro, 
  Clock, 
  History, 
  Minus, 
  Target,
  Calendar
} from 'lucide-react';

interface PackageRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
  onOpenBudgetModal?: () => void;
  onNavigateToHistory?: () => void;
}

interface RevisionHistory {
  id: string;
  date: string;
  oldAmount: number;
  newAmount: number;
  reason: string;
  author: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'Acceptée par le client';
}

const mockImpactsData = {
  2025: { heuresRealisees: 22.7, heuresFacturees: 21.08, horaireMinimum: 90, horaireEffectif: 39.86, facturationMinimum: 1850.21, impactFacturation: 1734.90 },
  2024: { heuresRealisees: 67.30, heuresFacturees: 62.89, horaireMinimum: 80, horaireEffectif: 62.28, facturationMinimum: 0, impactFacturation: 4862.66 },
  2023: { heuresRealisees: 100.35, heuresFacturees: 85.52, horaireMinimum: 80, horaireEffectif: 62.23, facturationMinimum: 0, impactFacturation: 4978.79 },
  2022: { heuresRealisees: 59.12, heuresFacturees: 58.55, horaireMinimum: 80, horaireEffectif: 55.12, facturationMinimum: 0, impactFacturation: 4409.92 }
};

const mockVolumetrieData = {
  2025: { facturesAchat: 146, facturesVente: 38, banques: 215 },
  2024: { facturesAchat: 277, facturesVente: 68, banques: 410 },
  2023: { facturesAchat: 263, facturesVente: 125, banques: 484 },
  2022: { facturesAchat: 228, facturesVente: 115, banques: 363 }
};

const mockFacturationData = {
  2025: { facturationHonorairesHTVA: 3587.20, facturationHorsHonorairesHTVA: 0, facturationGlobaleHTVA: 3587.20, payeParClientTVAc: 3892.94, restePayerTVAc: 447.58 },
  2024: { facturationHonorairesHTVA: 4982.66, facturationHorsHonorairesHTVA: 0, facturationGlobaleHTVA: 4982.66, payeParClientTVAc: 3636.33, restePayerTVAc: 'N/A' },
  2023: { facturationHonorairesHTVA: 4978.79, facturationHorsHonorairesHTVA: 0, facturationGlobaleHTVA: 4978.79, payeParClientTVAc: 0.00, restePayerTVAc: 'N/A' },
  2022: { facturationHonorairesHTVA: 4409.92, facturationHorsHonorairesHTVA: 0, facturationGlobaleHTVA: 4409.92, payeParClientTVAc: 0.00, restePayerTVAc: 'N/A' }
};

const mockPrestationData = {
  2025: { creationMiseAJourDossier: '2h 16m', productionBudget: '0h 0m', scanEtAdmin: '4h 34m', organisationComptable: '0h 0m', encodageComptable: '6h 44m', prestationsTVA: '1h 13m', nettoyageVerificationComptabilite: '3h 5m', productionSituationIntermediaire: '0h 0m', productionBilan: '3h 0m', prestationsFiscales: '1h 20m' },
  2024: { creationMiseAJourDossier: '0h 0m', productionBudget: '0h 0m', scanEtAdmin: '4h 34m', organisationComptable: '0h 0m', encodageComptable: '1h 40m', prestationsTVA: '3h 45m', nettoyageVerificationComptabilite: '1h 30m', productionSituationIntermediaire: '0h 0m', productionBilan: '14h 0m', prestationsFiscales: '3h 9m' }
};

export const PackageRevisionModal: React.FC<PackageRevisionModalProps> = ({ isOpen, onClose, client, onOpenBudgetModal, onNavigateToHistory }) => {
  const [activeSection, setActiveSection] = useState('analysis');
  const [revisionDecision, setRevisionDecision] = useState<'none' | 'maintain' | 'increase'>('none');
  const [newAmount, setNewAmount] = useState('');
  const currentAmount = 2500;
  const [revisionReason, setRevisionReason] = useState('');
  const [showProfitabilitySidebar, setShowProfitabilitySidebar] = useState(false);
  const [customServices, setCustomServices] = useState<{id: string, name: string, amount: number}[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceAmount, setNewServiceAmount] = useState('');

  // Handlers pour les actions
  const handleCreateProposal = () => {
    if (revisionDecision === 'increase' && newAmount && Number(newAmount) > currentAmount) {
      console.log('🎯 Action "optimize" cliquée, fermeture du modal de révision');
      // Ici vous pouvez ajouter la logique pour créer la proposition
      // Par exemple : envoyer les données au backend, mettre à jour l'état, etc.
      alert(`Proposition créée : augmentation de ${currentAmount}€ à ${newAmount}€`);
      onClose();
      
      // Navigation vers l'onglet historique
      if (onNavigateToHistory) {
        setTimeout(() => {
          onNavigateToHistory();
        }, 100);
      }
    }
  };

  const handleConfirmMaintien = () => {
    if (revisionDecision === 'maintain') {
      console.log('📋 Confirmation maintien forfait');
      alert('Forfait maintenu à ' + currentAmount + '€');
      onClose();
    }
  };

  const mockRevisionHistory: RevisionHistory[] = [
    { id: '1', date: '15/01/2025', oldAmount: 2200, newAmount: 2500, reason: 'Augmentation volumétrie documents', author: 'Marie Dubois', status: 'Acceptée par le client' as const },
    { id: '2', date: '2022-03-10', oldAmount: 4500, newAmount: 4800, reason: 'Complexité accrue des prestations', author: 'Marie Durand', status: 'APPROVED' as const }
  ];

  // Données détaillées de rentabilité par année et catégorie
  const profitabilityHistory = {
    2024: {
      rentabilite: 76.4,
      montantFacture: 4862,
      heuresRealisees: 63.6,
      categories: [
        { nom: 'Création/MAJ Dossier', heures: 8.2, montant: 628, rentabilite: 76.6 },
        { nom: 'Encodage Comptable', heures: 18.5, montant: 1416, rentabilite: 76.5 },
        { nom: 'Production Bilan', heures: 12.8, montant: 979, rentabilite: 76.5 },
        { nom: 'Prestations TVA', heures: 6.4, montant: 489, rentabilite: 76.4 },
        { nom: 'Scan & Admin', heures: 9.2, montant: 703, rentabilite: 76.4 },
        { nom: 'Prestations Fiscales', heures: 8.5, montant: 647, rentabilite: 76.1 }
      ]
    },
    2023: {
      rentabilite: 82.1,
      montantFacture: 4978,
      heuresRealisees: 60.6,
      categories: [
        { nom: 'Création/MAJ Dossier', heures: 7.8, montant: 640, rentabilite: 82.1 },
        { nom: 'Encodage Comptable', heures: 16.2, montant: 1330, rentabilite: 82.1 },
        { nom: 'Production Bilan', heures: 11.5, montant: 944, rentabilite: 82.1 },
        { nom: 'Prestations TVA', heures: 6.8, montant: 558, rentabilite: 82.1 },
        { nom: 'Scan & Admin', heures: 9.8, montant: 804, rentabilite: 82.0 },
        { nom: 'Prestations Fiscales', heures: 8.5, montant: 697, rentabilite: 82.0 }
      ]
    },
    2022: {
      rentabilite: 84.2,
      montantFacture: 4409,
      heuresRealisees: 52.4,
      categories: [
        { nom: 'Création/MAJ Dossier', heures: 6.5, montant: 547, rentabilite: 84.2 },
        { nom: 'Encodage Comptable', heures: 14.8, montant: 1246, rentabilite: 84.2 },
        { nom: 'Production Bilan', heures: 9.8, montant: 825, rentabilite: 84.2 },
        { nom: 'Prestations TVA', heures: 5.2, montant: 438, rentabilite: 84.2 },
        { nom: 'Scan & Admin', heures: 8.4, montant: 707, rentabilite: 84.2 },
        { nom: 'Prestations Fiscales', heures: 7.7, montant: 648, rentabilite: 84.2 }
      ]
    }
  };

  if (!isOpen) return null;

  // Fonctions pour lier les actions stratégiques à la décision
  const handleActionClick = (actionType: 'increase' | 'optimize' | 'services', suggestedAmount?: string, reason?: string) => {
    if (actionType === 'optimize') {
      // Redirection vers gestion du budget pour ce client spécifique
      onClose();
      if (onOpenBudgetModal) {
        // Délai pour permettre la fermeture du modal avant d'ouvrir le suivant
        setTimeout(() => {
          onOpenBudgetModal();
        }, 100);
      }
      return;
    }
    
    setActiveSection('decision');
    setRevisionDecision(actionType);
    
    if (actionType === 'increase') {
      if (suggestedAmount) setNewAmount(suggestedAmount);
      if (reason) setRevisionReason(reason);
    }
  };

  // Fonctions pour gérer les services personnalisés
  const addCustomService = () => {
    if (newServiceName.trim() && newServiceAmount.trim()) {
      const service = {
        id: Date.now().toString(),
        name: newServiceName.trim(),
        amount: parseFloat(newServiceAmount)
      };
      setCustomServices([...customServices, service]);
      setNewServiceName('');
      setNewServiceAmount('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomService();
    }
  };

  const removeCustomService = (id: string) => {
    setCustomServices(customServices.filter(service => service.id !== id));
  };

  // Calcul du total des services personnalisés
  const customServicesTotal = customServices.reduce((total, service) => total + service.amount, 0);

  const sections = [
    { id: 'analysis', label: 'Analyse Intelligente', icon: TrendingUp },
    { id: 'decision', label: 'Décision', icon: Target },
    { id: 'history', label: 'Historique', icon: History }
  ];

  const renderDataTable = (data: any, headers: string[], years: string[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700"></th>
            {years.map(year => (
              <th key={year} className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">{year}</th>
            ))}
            <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">Lettre de Mission</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">{header}</td>
              {years.map(year => (
                <td key={year} className="border border-gray-200 px-4 py-3 text-center">
                  {data[year] ? String(Object.values(data[year])[index] || '0') : '0'}
                </td>
              ))}
              <td className="border border-gray-200 px-4 py-3 text-center">0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Révision des Forfaits</h2>
            <p className="text-sm text-gray-600 mt-1">
              Analyse des impacts réalisés vs facturés - {client?.name || 'Client'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex justify-center space-x-1 p-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all relative ${
                  activeSection === id
                    ? 'bg-white text-blue-600 shadow-md border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
                {/* Indicateur pour section Décision avec données pré-remplies */}
                {id === 'decision' && revisionDecision !== 'none' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeSection === 'analysis' && (
            <div className="space-y-6">
              {/* Analyse Intelligente basée sur Rentabilité et Volumétrie */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
                    Analyse de Révision
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">⚠️</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Status</div>
                      <div className="text-orange-600 font-medium">Révision Requise</div>
                    </div>
                  </div>
                </div>

                {/* Critère 1: Rentabilité €/h */}
                <div className="mb-6">
                  <div 
                    className="bg-white rounded-xl p-5 border border-orange-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-orange-300"
                    onClick={() => setShowProfitabilitySidebar(true)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Euro className="w-5 h-5 mr-2 text-orange-600" />
                        Critère 1: Rentabilité Horaire
                        <span className="ml-2 text-sm text-gray-500 hover:text-orange-600">
                          (cliquer pour détails)
                        </span>
                      </h4>
                      <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        CRITIQUE
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">76.4€/h</div>
                        <div className="text-sm text-gray-600">2024 (Actuel)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">82.1€/h</div>
                        <div className="text-sm text-gray-600">2023 (Précédent)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">90€/h</div>
                        <div className="text-sm text-gray-600">Seuil Minimum</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">-7%</div>
                        <div className="text-sm text-gray-600">Évolution</div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div>
                          <div className="font-medium text-red-900 mb-1">Dégradation de Rentabilité</div>
                          <div className="text-red-800 text-sm">
                            <span className="font-bold">-7% vs 2023</span> et <span className="font-bold">15% en dessous</span> du seuil minimum. 
                            <span className="font-medium"> Tendance préoccupante nécessitant action immédiate.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critère 2: Évolution Volumétrie par Type de Documents */}
                <div className="mb-6">
                  <div className="bg-white rounded-xl p-5 border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                        Critère 2: Évolution Volumétrie par Type
                      </h4>
                      <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        AUGMENTATION
                      </div>
                    </div>
                    
                    {/* Évolution par type de documents */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-center mb-3">
                          <div className="text-lg font-bold text-blue-700">Factures d'Achat</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2022:</span>
                            <span className="font-medium">142</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2023:</span>
                            <span className="font-medium">165</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-700">2024:</span>
                            <span className="font-bold text-blue-700">198</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <div className="text-center">
                              <span className="text-lg font-bold text-orange-600">+39%</span>
                              <div className="text-xs text-gray-600">évolution</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-center mb-3">
                          <div className="text-lg font-bold text-green-700">Factures de Vente</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2022:</span>
                            <span className="font-medium">67</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2023:</span>
                            <span className="font-medium">78</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">2024:</span>
                            <span className="font-bold text-green-700">89</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-green-200">
                            <div className="text-center">
                              <span className="text-lg font-bold text-orange-600">+33%</span>
                              <div className="text-xs text-gray-600">évolution</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-center mb-3">
                          <div className="text-lg font-bold text-purple-700">Extraits Bancaires</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2022:</span>
                            <span className="font-medium">26</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">2023:</span>
                            <span className="font-medium">42</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-700">2024:</span>
                            <span className="font-bold text-purple-700">56</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-purple-200">
                            <div className="text-center">
                              <span className="text-lg font-bold text-red-600">+115%</span>
                              <div className="text-xs text-gray-600">évolution</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="text-white w-3 h-3" />
                        </div>
            <div>
                          <div className="font-medium text-orange-900 mb-1">Croissance Significative par Type</div>
                          <div className="text-orange-800 text-sm">
                            <span className="font-bold">Extraits bancaires: +115%</span> | 
                            <span className="font-bold"> Factures achat: +39%</span> | 
                            <span className="font-bold"> Factures vente: +33%</span>.
                            <span className="font-medium"> Le forfait ne couvre plus la charge réelle.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualisations Pertinentes */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Évolution Heures/Facturation
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">2024</span>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-600">67.3h → 4862€</div>
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-gray-900 font-medium">2025</span>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-blue-700 font-medium">22.7h → 1734€</div>
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                  </div>
            </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Euro className="w-5 h-5 mr-2 text-green-600" />
                    Analyse Profitabilité
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Horaire Effectif</span>
                      <span className="font-medium text-gray-900">76.4€/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Objectif Minimum</span>
                      <span className="font-medium text-gray-900">90€/h</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-orange-500 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <div className="text-sm text-orange-600 font-medium">
                      Potentiel d'amélioration: +18%
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Stratégiques Basées sur l'Analyse */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Actions Stratégiques Recommandées
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Option 1: Augmenter le forfait */}
                  <div 
                    className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-5 cursor-pointer hover:from-orange-100 hover:to-red-100 transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleActionClick('increase', '2850', 'Justification basée sur double problématique: rentabilité critique (-15% vs seuil 90€/h) + explosion volumétrie (extraits bancaires +115%, factures +39%/+33%). Augmentation nécessaire pour retrouver équilibre 2022 et s\'aligner sur charge de travail réelle.')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-orange-900">Augmenter le Forfait</div>
                      <div className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        URGENT
                      </div>
                    </div>
                    <div className="text-sm text-orange-800 mb-3">
                      <div className="font-medium">+350€ → 2850€/mois</div>
                      <div>Atteindre 90€/h + volumétrie</div>
                    </div>
                    <div className="text-xs text-orange-700 bg-orange-100 rounded-lg p-2">
                      ✓ Résout les 2 problématiques<br/>
                      ✓ Impact immédiat sur rentabilité<br/>
                      ✓ Justification forte (données)<br/>
                      <div className="mt-2 text-orange-600 font-medium">
                        👆 Cliquer pour créer la proposition
                      </div>
                    </div>
            </div>
                  
                  {/* Option 2: Réduire les heures */}
                  <div 
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleActionClick('optimize')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-blue-900">Optimiser les Heures</div>
                      <div className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                        MOYEN
                      </div>
                    </div>
                    <div className="text-sm text-blue-800 mb-3">
                      <div className="font-medium">-5h/mois via automation</div>
                      <div>Atteindre 90€/h objectif</div>
                    </div>
                    <div className="text-xs text-blue-700 bg-blue-100 rounded-lg p-2">
                      ⚠️ Difficile avec +34% volumétrie<br/>
                      ✓ Améliore l'efficacité<br/>
                      ~ Investissement technologie requis<br/>
                      <div className="mt-2 text-blue-600 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ouvrir Gestion du Budget
                      </div>
              </div>
            </div>
                  
                  {/* Option 3: Services additionnels */}
                  <div 
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleActionClick('services')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-purple-900">Services Additionnels</div>
                      <div className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                        LONG TERME
                      </div>
                    </div>
                    <div className="text-sm text-purple-800 mb-3">
                      <div className="font-medium">+200-400€ prestations</div>
                      <div>Conseil, audit, formation</div>
                    </div>
                    <div className="text-xs text-purple-700 bg-purple-100 rounded-lg p-2">
                      ✓ Augmente la valeur ajoutée<br/>
                      ✓ Diversifie les revenus<br/>
                      ~ Nécessite accord client<br/>
                      <div className="mt-2 text-purple-600 font-medium">
                        👆 Cliquer pour explorer
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommandation finale */}
                <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 rounded-r-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">🎯</span>
                    </div>
            <div>
                      <div className="font-bold text-orange-900 mb-1">Stratégie Prioritaire</div>
                      <div className="text-orange-800 text-sm">
                        <span className="font-medium">Augmentation forfait immédiate</span> justifiée par double problématique: 
                        rentabilité critique (-15%) + explosion volumétrie (extraits bancaires +115%, factures +39%/+33%).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'decision' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Décision de Révision
            </h3>
              {revisionDecision !== 'none' && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">
                    {revisionDecision === 'increase' && 'Augmentation forfait'}
                    {revisionDecision === 'services' && 'Services additionnels'}
                  </span>
              </div>
              )}
            </div>
            
            {/* Contenu conditionnel selon le type de décision */}
            {revisionDecision === 'none' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une action stratégique</h4>
                <p className="text-gray-600 mb-6">
                  Retournez à l'analyse pour choisir une recommandation ou sélectionnez manuellement un type de révision.
                </p>
                
                {/* Options manuelles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  <button
                    onClick={() => setRevisionDecision('increase')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 transition-all"
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Augmenter le forfait</div>
                    <div className="text-sm text-gray-600">Réviser à la hausse</div>
                  </button>
                  <button
                    onClick={() => setRevisionDecision('services')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div className="font-medium">Services additionnels</div>
                    <div className="text-sm text-gray-600">Nouvelles prestations</div>
                  </button>
              <button
                onClick={() => setRevisionDecision('maintain')}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
              >
                <Minus className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Maintenir</div>
                    <div className="text-sm text-gray-600">Pas de changement</div>
              </button>
            </div>
              </div>
            )}

            {/* Écran Augmentation de Forfait */}
            {revisionDecision === 'increase' && (
              <div className="space-y-6">
                {/* Affichage Forfait Actuel */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Forfait actuel:</span>
                    <span className="text-xl font-bold text-gray-900">{currentAmount}€/mois</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-700 font-medium">Proposition de nouveau forfait:</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Actuel</div>
                      <div className="text-lg font-bold text-gray-900">{currentAmount}€</div>
                    </div>
                    <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
                    <div className="text-center">
                      <div className="text-sm text-green-600">Nouveau proposé</div>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-24 px-2 py-1 text-lg font-bold text-center border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={String(currentAmount)}
                      />
                      <span className="text-lg font-bold text-green-700 ml-1">€</span>
                    </div>
                  </div>
                  {newAmount && Number(newAmount) > currentAmount && (
                    <div className="mt-3 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{Number(newAmount) - currentAmount}€ (+{Math.round(((Number(newAmount) - currentAmount) / currentAmount) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justification de la proposition
                  </label>
                  <textarea
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    placeholder="Expliquez les raisons de cette proposition d'augmentation (volumétrie, complexité, prestations supplémentaires...)..."
                  />
                </div>
              </div>
            )}

            {/* Écran Services Additionnels */}
            {revisionDecision === 'services' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="text-lg font-semibold text-purple-900 mb-2">Proposition de Services Additionnels</h4>
                  <p className="text-purple-700">
                    Développez votre offre avec des services à haute valeur ajoutée pour augmenter la rentabilité sans modifier le forfait de base.
                  </p>
                </div>

                {/* Catalogue de services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Service 1: Conseil Stratégique */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">Conseil Stratégique</h5>
                      <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        +200-400€/mois
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Accompagnement stratégique mensuel, analyse de performance, recommandations d'optimisation.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Tableau de bord personnalisé (+150€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Réunion stratégique trimestrielle (+120€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Veille réglementaire personnalisée (+80€)</span>
                      </label>
                    </div>
                  </div>

                  {/* Service 2: Formation */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">Formation & Support</h5>
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        +100-250€/mois
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Formation de vos équipes, support technique avancé, optimisation des processus.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Formation équipe comptable (+180€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Support prioritaire 24h (+100€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Optimisation workflow (+150€)</span>
                      </label>
                    </div>
                  </div>

                  {/* Service 3: Audit & Contrôle */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">Audit & Contrôle</h5>
                      <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        +300-500€/mois
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Audits réguliers, contrôles qualité, certifications et conformité avancée.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Audit trimestriel (+250€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Contrôle qualité mensuel (+180€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Certification ISO/compliance (+300€)</span>
                      </label>
                    </div>
                  </div>

                  {/* Service 4: Digital & Innovation */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">Digital & Innovation</h5>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        +200-350€/mois
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Digitalisation des processus, automation, outils innovants, intégration API.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Automation workflows (+220€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Intégration API avancée (+180€)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded" />
                        <span className="text-sm">Dashboard BI personnalisé (+280€)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Services Personnalisés */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter un Service Personnalisé
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du service
                      </label>
                      <input
                        type="text"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ex: Conseil fiscal spécialisé, Audit extraordinaire..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant mensuel (€)
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          value={newServiceAmount}
                          onChange={(e) => setNewServiceAmount(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="150"
                        />
                        <button
                          onClick={addCustomService}
                          disabled={!newServiceName.trim() || !newServiceAmount.trim()}
                          className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Liste des services personnalisés */}
                  {customServices.length > 0 && (
                    <div className="space-y-2">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Services ajoutés:</h6>
                      {customServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{service.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-orange-600">+{service.amount}€/mois</span>
                            <button
                              onClick={() => removeCustomService(service.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Récapitulatif */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h5 className="font-semibold text-gray-900 mb-3">Récapitulatif de la Proposition</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Forfait actuel:</div>
                      <div className="text-lg font-bold text-gray-900">{currentAmount}€/mois</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Services packages estimés:</div>
                      <div className="text-lg font-bold text-purple-600">+400-800€/mois</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Services personnalisés:</div>
                      <div className="text-lg font-bold text-orange-600">
                        {customServicesTotal > 0 ? `+${customServicesTotal}€/mois` : 'Aucun'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Total estimé */}
                  {customServicesTotal > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-300">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total estimé avec services personnalisés:</span>
                        <span className="text-xl font-bold text-green-600">
                          {currentAmount + customServicesTotal + 600}€/mois
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Forfait actuel ({currentAmount}€) + Services packages (~600€) + Services personnalisés ({customServicesTotal}€)
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaires et ajustements
                    </label>
                    <textarea
                      value={revisionReason}
                      onChange={(e) => setRevisionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder="Précisez les services sélectionnés et les modalités de mise en œuvre..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Autres types de révision */}
            {revisionDecision === 'maintain' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Maintien du forfait actuel</h4>
                <p className="text-gray-600">
                  Le forfait de {currentAmount}€/mois sera maintenu. Aucune modification ne sera apportée.
                </p>
              </div>
            )}
          </div>
          )}

          {activeSection === 'history' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <History className="w-6 h-6 mr-3 text-purple-600" />
                Historique des révisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockRevisionHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Évolution</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Raison</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Auteur</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRevisionHistory.map((revision) => (
                        <tr key={revision.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{revision.date}</td>
                          <td className="px-4 py-3 text-sm font-medium">{revision.oldAmount}€ → {revision.newAmount}€</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{revision.reason}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{revision.author}</td>
                          <td className="px-4 py-3">
                            <Badge variant={revision.newAmount > revision.oldAmount ? 'default' : 'secondary'}>
                              +{revision.newAmount - revision.oldAmount}€
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune révision précédente</p>
                </div>
              )}
            </CardContent>
          </Card>
          )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          {revisionDecision === 'maintain' && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirmMaintien}
            >
              Confirmer le maintien
            </Button>
          )}
          {revisionDecision === 'increase' && newAmount && Number(newAmount) > currentAmount && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleCreateProposal}
            >
              Créer la proposition ({newAmount}€)
            </Button>
          )}
        </div>
        </div>

        {/* Sidebar Détail Rentabilité */}
        {showProfitabilitySidebar && (
          <div className="fixed inset-0 bg-black/20 z-60 flex justify-end">
            <div className="w-2/3 bg-white shadow-2xl h-full overflow-y-auto">
              {/* Header Sidebar */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Euro className="w-6 h-6 mr-3 text-orange-600" />
                      Analyse Détaillée de Rentabilité
                    </h3>
                    <p className="text-gray-600 mt-1">Historique 3 ans par catégorie de prestations</p>
                  </div>
                  <button
                    onClick={() => setShowProfitabilitySidebar(false)}
                    className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Contenu Sidebar */}
              <div className="p-6 space-y-6">
                {/* Évolution Globale */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📉 Évolution Globale</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-red-100">
                      <div className="text-2xl font-bold text-gray-900">84.2€/h</div>
                      <div className="text-sm text-gray-600">2022</div>
                      <div className="text-xs text-green-600 mt-1">▲ Objectif atteint</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-orange-100">
                      <div className="text-2xl font-bold text-orange-600">82.1€/h</div>
                      <div className="text-sm text-gray-600">2023</div>
                      <div className="text-xs text-orange-600 mt-1">▼ -2.5%</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">76.4€/h</div>
                      <div className="text-sm text-gray-600">2024</div>
                      <div className="text-xs text-red-600 mt-1">▼ -7.0%</div>
                    </div>
                  </div>
                </div>

                {/* Détail par Année */}
                {Object.entries(profitabilityHistory).reverse().map(([year, data]) => (
                  <div key={year} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">Année {year}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            data.rentabilite >= 90 ? 'text-green-600' : 
                            data.rentabilite >= 80 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {data.rentabilite}€/h
                          </div>
                          <div className="text-sm text-gray-600">Rentabilité</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{data.montantFacture}€</div>
                          <div className="text-sm text-gray-600">Facturé</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{data.heuresRealisees}h</div>
                          <div className="text-sm text-gray-600">Réalisées</div>
                        </div>
                      </div>
                    </div>

                    {/* Détail par Catégorie */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800 mb-3">Détail par Catégorie de Prestations</h5>
                      {data.categories.map((categorie, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{categorie.nom}</div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="font-bold text-gray-900">{categorie.heures}h</div>
                              <div className="text-gray-600">Temps</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-gray-900">{categorie.montant}€</div>
                              <div className="text-gray-600">Facturé</div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold ${
                                categorie.rentabilite >= 90 ? 'text-green-600' : 
                                categorie.rentabilite >= 80 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {categorie.rentabilite}€/h
                              </div>
                              <div className="text-gray-600">€/h</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Analyse et Recommandations */}
                <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                  <h4 className="text-lg font-semibold text-orange-900 mb-3">🎯 Analyse et Recommandations</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-red-900">Dégradation continue:</span> 
                        <span className="text-red-800"> Rentabilité en baisse depuis 2022 (-9.3% sur 2 ans)</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-orange-900">Toutes catégories touchées:</span> 
                        <span className="text-orange-800"> Aucune prestation n'atteint le seuil de 90€/h en 2024</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-blue-900">Action urgente:</span> 
                        <span className="text-blue-800"> Augmentation forfait nécessaire pour retrouver l'équilibre 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
