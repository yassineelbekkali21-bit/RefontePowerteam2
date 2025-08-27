import React, { memo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  Settings, 
  Calculator, 
  FileText, 
  TrendingUp, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Euro,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  UserCheck,
  RefreshCw,
  DollarSign,
  History,
  AlertCircle,
  Users
} from 'lucide-react';
import { Client } from '@/types/client';
import { echeancesFiscales } from '@/data/productionData';
import type { EcheanceFiscale } from '@/types/production';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
  onBudgetModalOpen: () => void;
  onSettingsModalOpen: () => void;
  onCorrectionPlanModalOpen: () => void;
  onPackageRevisionModalOpen: () => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
    case 'En partance': return 'bg-red-100 text-red-800 border-red-200';
    case 'À suivre': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Récupéré': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getVarianceColor = (budget: number, realise: number): string => {
  const variance = ((realise - budget) / budget) * 100;
  if (variance > 10) return 'text-red-600';
  if (variance > 0) return 'text-orange-600';
  return 'text-green-600';
};

const getVarianceIcon = (budget: number, realise: number) => {
  const variance = ((realise - budget) / budget) * 100;
  if (variance > 10) return <TrendingUp className="w-4 h-4 text-red-600" />;
  if (variance > 0) return <AlertTriangle className="w-4 h-4 text-orange-600" />;
  return <CheckCircle className="w-4 h-4 text-green-600" />;
};

// Données des tâches avec progression réaliste
const mockTaskData = [
  { id: '02', name: 'SCAN ET ADMIN', realise: 4.5, budget: 11.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '04', name: 'ENCODAGE COMPTABLE', realise: 6.74, budget: 13.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '05', name: 'PRESTATIONS TVA', realise: 1.17, budget: 2.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '06', name: 'NETTOYAGE ET VERIFICATION COMPTABILITE', realise: 3.0, budget: 10.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '08', name: 'PRODUCTION BILAN', realise: 3.0, budget: 9.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '09', name: 'PRESTATIONS FISCALES', realise: 1.5, budget: 8.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '11', name: 'CONSEILS CLIENT', realise: 0.0, budget: 1.0, collaborateur: 'AO', color: 'bg-gray-300' },
  { id: '13', name: 'VALIDATION - RELECTURE', realise: 1.0, budget: 7.0, collaborateur: 'AO', color: 'bg-emerald-500' },
  { id: '14', name: 'COMPENSATION PRODUCTION', realise: 0.17, budget: 0.0, collaborateur: 'ZEB', color: 'bg-gray-300' },
  { id: '15', name: 'NON FACTURABLE', realise: 0.92, budget: 0.0, collaborateur: 'ZEB', color: 'bg-gray-300' }
];

// Données de volumétrie
const mockVolumetrie = [
  { type: 'Factures d\u0027achat', budget: 200, realise: 146 },
  { type: 'Factures de vente', budget: 50, realise: 38 },
  { type: 'Banques', budget: 300, realise: 215 },
  { type: 'Notes de frais', budget: 25, realise: 18 }
];

// Données pour la vue collaborateur
const mockCollaborateursData = {
  collaborateurs: [
    { id: 'superviseur', nom: 'Superviseur', initiales: 'A', avatar: '👤' },
    { id: 'gd', nom: 'GD', initiales: 'AK', avatar: '👤' },
    { id: 'se', nom: 'SE', initiales: 'AK', avatar: '👤' },
    { id: 'ge', nom: 'GE', initiales: 'AO', avatar: '👤' }
  ],
  prestations: [
    {
      id: '02',
      nom: 'SCAN ET ADMIN',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 2.0, realise: 2.0 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 2.0, realise: 2.0 }
      }
    },
    {
      id: '04',
      nom: 'ENCODAGE COMPTABLE',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 0, realise: 0 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 13.0, realise: 5.15 }
      }
    },
    {
      id: '05',
      nom: 'PRESTATIONS TVA',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 2.0, realise: 1.17 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 0, realise: 0 }
      }
    },
    {
      id: '06',
      nom: 'NETTOYAGE ET VERIFICATION COMPTABILITE',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 3.0, realise: 1.0 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 7.0, realise: 2.0 }
      }
    },
    {
      id: '08',
      nom: 'PRODUCTION BILAN',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 9.1, realise: 3.0 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 0, realise: 0 }
      }
    },
    {
      id: '09',
      nom: 'PRESTATIONS FISCALES',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 8.0, realise: 1.5 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 0, realise: 0 }
      }
    },
    {
      id: '11',
      nom: 'CONSEILS CLIENT',
      repartition: {
        superviseur: { budget: 0, realise: 0 },
        gd: { budget: 1.0, realise: 0 },
        se: { budget: 0, realise: 0 },
        ge: { budget: 0, realise: 0 }
      }
    },
    {
      id: '13',
      nom: 'VALIDATION - RELECTURE',
      repartition: {
        superviseur: { budget: 2.0, realise: 0 },
        gd: { budget: 5.0, realise: 1.0 },
        se: { budget: 5.0, realise: 0 },
        ge: { budget: 5.0, realise: 0 }
      }
    }
  ]
};

const ClientDetail: React.FC<ClientDetailProps> = ({ 
  client, 
  onBack, 
  onBudgetModalOpen, 
  onSettingsModalOpen,
  onCorrectionPlanModalOpen,
  onPackageRevisionModalOpen 
}) => {
  const [activeTab, setActiveTab] = useState<'categorie' | 'collaborateur' | 'entite'>('categorie');
  return (
    <div className="space-y-6">
      {/* Header avec retour */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            onClick={onBudgetModalOpen}
          >
            <Settings className="h-4 w-4" />
            <span>Gestion Budget</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
            onClick={onSettingsModalOpen}
          >
            <User className="h-4 w-4" />
            <span>Paramétrage</span>
          </Button>
        </div>
      </div>


      {/* Section supérieure - 3 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Colonne gauche - Infos client */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl">{client.name}</CardTitle>
                <p className="text-gray-600">{client.type}</p>
                <Badge className={`mt-2 ${getStatusColor(client.status)}`}>
                  {client.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Encours Section */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Encours :</div>
              <div className="text-xl font-bold text-blue-700">447.58 €</div>
              <div className="text-xs text-gray-500 mt-2">
                <div className="mb-1">Détails Encours :</div>
                <div className="space-y-1">
                  <div>+ De 90 Jours : 0.00 €</div>
                  <div>+ De 60 Jours : 0.00 €</div>
                  <div>+ De 30 Jours : 0.00 €</div>
                  <div>Moins De 30 Jours : 447.58 €</div>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Partner :</span>
                <div className="font-semibold">Julien Limborg</div>
              </div>
              <div>
                <span className="text-gray-600">GD :</span>
                <div className="font-semibold">Adolphe Komeza</div>
              </div>
              <div>
                <span className="text-gray-600">GE :</span>
                <div className="font-semibold">Abdelghani Ouyhya</div>
              </div>
              <div>
                <span className="text-gray-600">Type de facturation :</span>
                <div className="font-semibold">Montant Fixe Annuel</div>
              </div>
            </div>

            {/* Client Details */}
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div>
                <span className="text-gray-600">ID Client :</span>
                <div className="font-semibold">7287</div>
              </div>
              <div>
                <span className="text-gray-600">Software :</span>
                <div className="font-semibold">Horus</div>
              </div>
              <div>
                <span className="text-gray-600">Pack :</span>
                <div className="font-semibold">Type Standard</div>
              </div>
              <div>
                <span className="text-gray-600">Grille Tarifaire appliquée :</span>
                <div className="font-semibold">----</div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div>
                <span className="text-gray-600">Type de TVA :</span>
                <div className="font-semibold">Trimestre</div>
              </div>
              <div>
                <span className="text-gray-600">Groupe de société :</span>
                <div className="font-semibold">Sociétés</div>
              </div>
              <div>
                <span className="text-gray-600">Date de clôture :</span>
                <div className="font-semibold">31/12</div>
              </div>
              <div>
                <span className="text-gray-600">Squad :</span>
                <div className="font-semibold">----</div>
              </div>
            </div>

            {/* Final Details */}
            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div>
                <span className="text-gray-600">BU :</span>
                <div className="font-semibold">AC</div>
              </div>
              <div>
                <span className="text-gray-600">Cluster :</span>
                <div className="font-semibold">----</div>
              </div>
              <div>
                <span className="text-gray-600">Recouv ID :</span>
                <div className="font-semibold">5538</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{client.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Dernière activité: {client.lastActivity}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-semibold mb-3">Actions Rapides</h4>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Recouvrement
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" onClick={onCorrectionPlanModalOpen}>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Plan de correction
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Contacter le client
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" onClick={onPackageRevisionModalOpen}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Révision de forfait
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Analyse financière
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <History className="w-4 h-4 mr-2" />
                  Historique des prestations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colonne centrale - Budgets */}
        <div className="space-y-4">
          {/* Budget Horaire */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-800">Budget Horaire</h3>
                {getVarianceIcon(client.budgetHoraire, client.realiseHoraire)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget: {client.budgetHoraire}h</span>
                  <span>Réalisé: {client.realiseHoraire}h</span>
                </div>
                <Progress value={(client.realiseHoraire / client.budgetHoraire) * 100} className="h-2" />
                <div className={`text-sm font-medium ${getVarianceColor(client.budgetHoraire, client.realiseHoraire)}`}>
                  Écart: {client.realiseHoraire - client.budgetHoraire}h
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Économique */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-green-800">Budget Économique</h3>
                {getVarianceIcon(client.budgetEconomique, client.realiseEconomique)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget: {client.budgetEconomique.toLocaleString()}€</span>
                  <span>Réalisé: {client.realiseEconomique.toLocaleString()}€</span>
                </div>
                <Progress value={(client.realiseEconomique / client.budgetEconomique) * 100} className="h-2" />
                <div className={`text-sm font-medium ${getVarianceColor(client.budgetEconomique, client.realiseEconomique)}`}>
                  Écart: {(client.realiseEconomique - client.budgetEconomique).toLocaleString()}€
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Avancement Tâches Fiscales */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Avancement Tâches Fiscales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              // Récupérer les échéances de ce client
              const clientEcheances = echeancesFiscales.filter(e => e.clientId === client.id.toString());
              
              if (clientEcheances.length === 0) {
                return (
                  <div className="text-center py-4 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucune échéance en cours</p>
                  </div>
                );
              }

              const getJoursRestants = (dateEcheance: string) => {
                const echeance = new Date(dateEcheance);
                const maintenant = new Date();
                const diffTime = echeance.getTime() - maintenant.getTime();
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              };

              const getTypeColor = (type: string) => {
                const colors = {
                  'TVA': 'bg-blue-100 text-blue-800 border-blue-200',
                  'ISOC': 'bg-green-100 text-green-800 border-green-200', 
                  'IPP': 'bg-orange-100 text-orange-800 border-orange-200',
                  'BILAN': 'bg-purple-100 text-purple-800 border-purple-200'
                };
                return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
              };

              const getStatutColor = (statut: string) => {
                switch (statut) {
                  case 'termine': return 'bg-green-100 text-green-800';
                  case 'en_cours': return 'bg-blue-100 text-blue-800';
                  case 'en_revision': return 'bg-orange-100 text-orange-800';
                  case 'non_commence': return 'bg-gray-100 text-gray-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };

              return (
                <div className="space-y-3">
                  {clientEcheances.map((echeance) => {
                    const joursRestants = getJoursRestants(echeance.dateEcheance);
                    const isEnRetard = joursRestants < 0 && echeance.statut !== 'termine';
                    const isUrgent = joursRestants <= 7 && joursRestants >= 0;

                    return (
                      <div key={echeance.id} className={`p-3 rounded-lg border transition-all ${
                        isEnRetard ? 'bg-red-50 border-red-200' :
                        isUrgent ? 'bg-orange-50 border-orange-200' :
                        'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-xs ${getTypeColor(echeance.type)}`}>
                            {echeance.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatutColor(echeance.statut)}`}>
                            {echeance.statut === 'termine' ? 'Terminé' :
                             echeance.statut === 'en_cours' ? 'En cours' :
                             echeance.statut === 'en_revision' ? 'En révision' :
                             'Non commencé'}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-sm mb-2">{echeance.nom}</h4>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className={`font-medium ${
                            isEnRetard ? 'text-red-600' :
                            isUrgent ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {isEnRetard ? `${Math.abs(joursRestants)}j de retard` :
                             joursRestants === 0 ? 'Aujourd\'hui' :
                             joursRestants === 1 ? 'Demain' :
                             `${joursRestants}j restants`}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  echeance.avancement === 100 ? 'bg-green-500' :
                                  echeance.avancement >= 50 ? 'bg-blue-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${echeance.avancement}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{echeance.avancement}%</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {echeance.tempsRealise}h / {echeance.tempsEstime}h
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Lien vers le module Production */}
                  <div className="pt-2 border-t">
                    <Button size="sm" variant="outline" className="w-full justify-center text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      Voir toutes les échéances
                    </Button>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Section inférieure - Liste des prestations */}
      <div className="space-y-6">
        {/* Liste des prestations */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Liste des prestations
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <button
                    onClick={() => setActiveTab('categorie')}
                    className={`font-medium pb-1 transition-colors ${
                      activeTab === 'categorie'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    catégorie
                  </button>
                  <button
                    onClick={() => setActiveTab('collaborateur')}
                    className={`font-medium pb-1 transition-colors ${
                      activeTab === 'collaborateur'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    collaborateur
                  </button>
                  <button
                    onClick={() => setActiveTab('entite')}
                    className={`font-medium pb-1 transition-colors ${
                      activeTab === 'entite'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    entité
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'categorie' && (
                <div className="space-y-4">
                  {[
                    { 
                      id: '02', 
                      name: 'SCAN ET ADMIN', 
                      budgetTotal: 11.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 7.0, realise: 3.2 },
                        { nom: 'ZEB', budgetAlloue: 4.0, realise: 1.3 }
                      ]
                    },
                    { 
                      id: '04', 
                      name: 'ENCODAGE COMPTABLE', 
                      budgetTotal: 13.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 13.0, realise: 6.74 }
                      ]
                    },
                    { 
                      id: '05', 
                      name: 'PRESTATIONS TVA', 
                      budgetTotal: 2.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 2.0, realise: 1.17 }
                      ]
                    },
                    { 
                      id: '06', 
                      name: 'NETTOYAGE ET VERIFICATION COMPTABILITE', 
                      budgetTotal: 10.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 6.0, realise: 2.1 },
                        { nom: 'ZEB', budgetAlloue: 4.0, realise: 0.9 }
                      ]
                    },
                    { 
                      id: '08', 
                      name: 'PRODUCTION BILAN', 
                      budgetTotal: 9.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 9.0, realise: 3.0 }
                      ]
                    },
                    { 
                      id: '09', 
                      name: 'PRESTATIONS FISCALES', 
                      budgetTotal: 8.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 5.0, realise: 1.0 },
                        { nom: 'MD', budgetAlloue: 3.0, realise: 0.5 }
                      ]
                    },
                    { 
                      id: '11', 
                      name: 'CONSEILS CLIENT', 
                      budgetTotal: 1.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 1.0, realise: 0.0 }
                      ]
                    },
                    { 
                      id: '13', 
                      name: 'VALIDATION - RELECTURE', 
                      budgetTotal: 7.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 4.0, realise: 0.7 },
                        { nom: 'MD', budgetAlloue: 3.0, realise: 0.3 }
                      ]
                    }
                  ].map((prestation) => {
                    const totalRealise = prestation.collaborateurs.reduce((sum, collab) => sum + collab.realise, 0);
                    const percentageGlobal = prestation.budgetTotal > 0 ? (totalRealise / prestation.budgetTotal) * 100 : 0;
                    const isOverBudget = totalRealise > prestation.budgetTotal;
                    
                    return (
                      <div key={prestation.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {/* En-tête de la prestation */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-gray-900">
                              {prestation.id}. {prestation.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Budget: {prestation.budgetTotal.toFixed(1)}h
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}>
                                Réalisé: {totalRealise.toFixed(1)}h
                              </span>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${
                            isOverBudget ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {percentageGlobal.toFixed(0)}%
                          </span>
                        </div>

                        {/* Barre de progression globale */}
                        <div className="relative mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(percentageGlobal, 100)}%` }}
                            ></div>
                          </div>
                          {isOverBudget && (
                            <div className="absolute top-0 right-0 w-1 h-2 bg-red-600 rounded-r-full"></div>
                          )}
                        </div>

                        {/* Détail par collaborateur */}
                        <div className="space-y-2">
                          {prestation.collaborateurs.map((collab, index) => {
                            const collabPercentage = collab.budgetAlloue > 0 ? (collab.realise / collab.budgetAlloue) * 100 : 0;
                            const collabOverBudget = collab.realise > collab.budgetAlloue;
                            
                            return (
                              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium text-xs">
                                    {collab.nom}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                      <span>Budget: {collab.budgetAlloue.toFixed(1)}h</span>
                                      <span>•</span>
                                      <span className={collabOverBudget ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                        Réalisé: {collab.realise.toFixed(1)}h
                                      </span>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-1 mt-1">
                                      <div 
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                          collabOverBudget ? 'bg-red-400' : 'bg-blue-400'
                                        }`}
                                        style={{ width: `${Math.min(collabPercentage, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <span className={`text-xs font-medium ${
                                  collabOverBudget ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {collabPercentage.toFixed(0)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'collaborateur' && (
                <div className="overflow-x-auto">
                  {/* Calcul des totaux par collaborateur */}
                  {(() => {
                    const totauxParCollaborateur = mockCollaborateursData.collaborateurs.reduce((acc, collab) => {
                      acc[collab.id] = mockCollaborateursData.prestations.reduce((sum, prestation) => {
                        const data = prestation.repartition[collab.id];
                        return {
                          budget: sum.budget + data.budget,
                          realise: sum.realise + data.realise
                        };
                      }, { budget: 0, realise: 0 });
                      return acc;
                    }, {} as Record<string, { budget: number; realise: number }>);

                    return (
                      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        {/* En-tête avec avatars des collaborateurs */}
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-4 font-medium text-gray-700 border-b border-gray-200 w-80">
                              Prestation
                            </th>
                            {mockCollaborateursData.collaborateurs.map((collab) => (
                              <th key={collab.id} className="text-center p-4 border-b border-gray-200 min-w-32">
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                    {collab.initiales}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{collab.nom}</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Ligne Total */}
                          <tr className="bg-blue-50 border-b border-gray-200">
                            <td className="p-4 font-semibold text-gray-900">Total</td>
                            {mockCollaborateursData.collaborateurs.map((collab) => {
                              const total = totauxParCollaborateur[collab.id];
                              const percentage = total.budget > 0 ? (total.realise / total.budget) * 100 : 0;
                              const isOverBudget = total.realise > total.budget;
                              
                              return (
                                <td key={collab.id} className="p-4 text-center">
                                  <div className="space-y-2">
                                    <div className="text-xs text-gray-600">
                                      {total.budget.toFixed(1)}h
                                    </div>
                                    <div className="relative">
                                      <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                          className={`h-3 rounded-full transition-all duration-300 ${
                                            isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                                          }`}
                                          style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
                                      </div>
                                      {isOverBudget && (
                                        <div className="absolute top-0 right-0 w-1 h-3 bg-red-600 rounded-r-full"></div>
                                      )}
                                    </div>
                                    <div className={`text-xs font-medium ${
                                      isOverBudget ? 'text-red-600' : 'text-emerald-600'
                                    }`}>
                                      {total.realise.toFixed(1)}h
                                    </div>
                                    <div className={`text-xs ${
                                      isOverBudget ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {percentage.toFixed(0)}%
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                          
                          {/* Lignes des prestations */}
                          {mockCollaborateursData.prestations.map((prestation) => (
                            <tr key={prestation.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-4">
                                <span className="text-sm font-medium text-gray-900">
                                  {prestation.id}. {prestation.nom}
                                </span>
                              </td>
                              {mockCollaborateursData.collaborateurs.map((collab) => {
                                const data = prestation.repartition[collab.id];
                                const percentage = data.budget > 0 ? (data.realise / data.budget) * 100 : 0;
                                const isOverBudget = data.realise > data.budget && data.budget > 0;
                                const hasData = data.budget > 0 || data.realise > 0;
                                
                                return (
                                  <td key={collab.id} className="p-4 text-center">
                                    {hasData ? (
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-600">
                                          {data.budget.toFixed(1)}h
                                        </div>
                                        <div className="relative">
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full transition-all duration-300 ${
                                                data.realise === 0 ? 'bg-gray-300' : 
                                                isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                                              }`}
                                              style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                          </div>
                                          {isOverBudget && (
                                            <div className="absolute top-0 right-0 w-1 h-2 bg-red-600 rounded-r-full"></div>
                                          )}
                                        </div>
                                        <div className={`text-xs font-medium ${
                                          isOverBudget ? 'text-red-600' : 
                                          data.realise > 0 ? 'text-emerald-600' : 'text-gray-500'
                                        }`}>
                                          {data.realise.toFixed(1)}h
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-gray-400">-</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'entite' && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Vue par entité - En cours de développement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tableau Volumétrie */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Volumétrie par Type de Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockVolumetrie.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.type}</span>
                    {getVarianceIcon(item.budget, item.realise)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Budget: {item.budget}</span>
                    <span>Réalisé: {item.realise}</span>
                  </div>
                  <Progress value={Math.min((item.realise / item.budget) * 100, 100)} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetail;
