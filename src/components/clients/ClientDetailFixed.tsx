import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  History
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: string;
  status: string;
  budgetHoraire: number;
  realiseHoraire: number;
  budgetEconomique: number;
  realiseEconomique: number;
}

interface ClientDetailFixedProps {
  client: Client;
  onBack: () => void;
  onSettingsModalOpen: () => void;
}

const ClientDetailFixed: React.FC<ClientDetailFixedProps> = ({ 
  client, 
  onBack, 
  onSettingsModalOpen 
}) => {
  const [activeTab, setActiveTab] = useState<'categorie' | 'collaborateur' | 'entite'>('categorie');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En partance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Récupéré':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVarianceColor = (budget: number, realise: number) => {
    const variance = ((realise - budget) / budget) * 100;
    if (variance > 10) return 'text-red-600';
    if (variance > 0) return 'text-orange-600';
    return 'text-green-600';
  };

  const getVarianceIcon = (budget: number, realise: number) => {
    const variance = ((realise - budget) / budget) * 100;
    if (variance > 10) return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (variance > 0) return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    return <TrendingDown className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2 bg-white/80 hover:bg-white border-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Fiche Client Détaillée</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
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
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* Colonne gauche - Informations client (réduite) */}
        <div className="col-span-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <p className="text-sm text-gray-600">{client.type}</p>
                  <Badge className={`mt-1 text-xs ${getStatusColor(client.status)}`}>
                    {client.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {/* Team Information */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Partner :</span>
                  <span className="font-semibold">Julien Limborg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GD :</span>
                  <span className="font-semibold">Adolphe Komeza</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GE :</span>
                  <span className="font-semibold">Adolphe Komeza</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Superviseur :</span>
                  <span className="font-semibold">Julien Limborg</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Additional Client Information */}
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Client :</span>
                  <span className="font-semibold">7287</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Software :</span>
                  <span className="font-semibold">Horus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type TVA :</span>
                  <span className="font-semibold">Trimestre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Groupe :</span>
                  <span className="font-semibold">Sociétés</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clôture :</span>
                  <span className="font-semibold">31/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BU :</span>
                  <span className="font-semibold">AC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recouv ID :</span>
                  <span className="font-semibold">5538</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Contact Information */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-gray-500" />
                  <span className="text-xs">contact@cabinet-medical.be</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-gray-500" />
                  <span className="text-xs">+32 2 123 45 67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-xs">Rue de la Santé 123, 1000 Bruxelles</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2">
                <div className="grid grid-cols-1 gap-1">
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                    <Settings className="w-3 h-3 mr-1" />
                    Paramètres
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs h-7">
                    <History className="w-3 h-3 mr-1" />
                    Historique
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne centrale - Budgets et Encours */}
        <div className="col-span-5 space-y-4">
          {/* Budget Horaire */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800 text-sm">Budget Horaire</h3>
                {getVarianceIcon(client.budgetHoraire, client.realiseHoraire)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Budget: {client.budgetHoraire}h</span>
                  <span>Réalisé: {client.realiseHoraire}h</span>
                </div>
                <Progress value={(client.realiseHoraire / client.budgetHoraire) * 100} className="h-2" />
                <div className={`text-xs font-medium ${getVarianceColor(client.budgetHoraire, client.realiseHoraire)}`}>
                  Écart: {client.realiseHoraire - client.budgetHoraire}h
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Économique */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800 text-sm">Budget Économique</h3>
                {getVarianceIcon(client.budgetEconomique, client.realiseEconomique)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Budget: {client.budgetEconomique.toLocaleString()}€</span>
                  <span>Réalisé: {client.realiseEconomique.toLocaleString()}€</span>
                </div>
                <Progress value={(client.realiseEconomique / client.budgetEconomique) * 100} className="h-2" />
                <div className={`text-xs font-medium ${getVarianceColor(client.budgetEconomique, client.realiseEconomique)}`}>
                  Écart: {(client.realiseEconomique - client.budgetEconomique).toLocaleString()}€
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Encours (réduit) */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Encours total :</span>
                  <span className="text-lg font-bold text-blue-700">447.58 €</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Moins de 30j :</span>
                    <span className="font-medium text-blue-700">447.58 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autres :</span>
                    <span className="font-medium">0.00 €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Avancement Tâches Fiscales */}
        <div className="col-span-3">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>Avancement Tâches Fiscales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* TVA Quarters */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-gray-700 mb-1">TVA</h4>
                <div className="grid grid-cols-2 gap-1">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => {
                    const isCompleted = index < 2;
                    return (
                      <div key={quarter} className={`flex items-center justify-between p-1.5 rounded border ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <span className="text-xs font-medium">{quarter}</span>
                        {isCompleted ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Other fiscal tasks */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-gray-700 mb-1">Autres Tâches</h4>
                <div className="space-y-1">
                  {[
                    { name: 'ISOC/IPM', completed: true },
                    { name: 'IPP', completed: false },
                    { name: 'Listings TVA', completed: true },
                    { name: 'Versements anticipées', completed: false }
                  ].map((task) => (
                    <div key={task.name} className={`flex items-center justify-between p-1.5 rounded border ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="text-xs font-medium">{task.name}</span>
                      {task.completed ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section inférieure - 2 colonnes */}
      <div className="grid grid-cols-12 gap-6">
        {/* Colonne gauche - Liste des prestations */}
        <div className="col-span-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
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
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  {/* En-tête avec avatars des collaborateurs */}
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-700 border-b border-gray-200 w-80">
                        <div className="text-sm font-medium text-gray-900">Liste des tâches</div>
                      </th>
                      {/* Superviseur */}
                      <th className="text-center p-4 border-b border-gray-200 min-w-32">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
                            👤
                          </div>
                          <span className="text-sm font-medium text-gray-700">Superviseur</span>
                        </div>
                      </th>
                      {/* GD */}
                      <th className="text-center p-4 border-b border-gray-200 min-w-32">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                            AK
                          </div>
                          <span className="text-sm font-medium text-gray-700">GD</span>
                        </div>
                      </th>
                      {/* SE */}
                      <th className="text-center p-4 border-b border-gray-200 min-w-32">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium text-sm">
                            A
                          </div>
                          <span className="text-sm font-medium text-gray-700">SE</span>
                        </div>
                      </th>
                      {/* GE */}
                      <th className="text-center p-4 border-b border-gray-200 min-w-32">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-medium text-sm">
                            AO
                          </div>
                          <span className="text-sm font-medium text-gray-700">GE</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Ligne Total */}
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <td className="p-4 font-semibold text-gray-900">Total</td>
                      {/* Superviseur Total */}
                      <td className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">2.00 h</div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: '0%' }}></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">0.00h</div>
                          <div className="text-xs text-gray-600">0%</div>
                        </div>
                      </td>
                      {/* GD Total */}
                      <td className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">30.10 h</div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: '32%' }}></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-emerald-600">9.67h</div>
                          <div className="text-xs text-gray-600">32%</div>
                        </div>
                      </td>
                      {/* SE Total */}
                      <td className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">5.00 h</div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: '0%' }}></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">0.00h</div>
                          <div className="text-xs text-gray-600">0%</div>
                        </div>
                      </td>
                      {/* GE Total */}
                      <td className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-600">32.90 h</div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-emerald-600">11.32h</div>
                          <div className="text-xs text-gray-600">34%</div>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Prestations */}
                    {[
                      {
                        id: '02',
                        nom: 'SCAN ET ADMIN',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 2.0, realise: 2.0 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 2.0, realise: 2.0 }
                      },
                      {
                        id: '04',
                        nom: 'ENCODAGE COMPTABLE',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 0, realise: 0 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 13.0, realise: 5.15 }
                      },
                      {
                        id: '05',
                        nom: 'PRESTATIONS TVA',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 2.0, realise: 1.17 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 0, realise: 0 }
                      },
                      {
                        id: '06',
                        nom: 'NETTOYAGE ET VERIFICATION COMPTABILITE',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 3.0, realise: 1.0 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 7.0, realise: 2.0 }
                      },
                      {
                        id: '08',
                        nom: 'PRODUCTION BILAN',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 9.1, realise: 3.0 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 0, realise: 0 }
                      },
                      {
                        id: '09',
                        nom: 'PRESTATIONS FISCALES',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 8.0, realise: 1.5 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 0, realise: 0 }
                      },
                      {
                        id: '11',
                        nom: 'CONSEILS CLIENT',
                        superviseur: { budget: 0, realise: 0 },
                        gd: { budget: 1.0, realise: 0 },
                        se: { budget: 0, realise: 0 },
                        ge: { budget: 0, realise: 0 }
                      },
                      {
                        id: '13',
                        nom: 'VALIDATION - RELECTURE',
                        superviseur: { budget: 2.0, realise: 0 },
                        gd: { budget: 5.0, realise: 1.0 },
                        se: { budget: 5.0, realise: 0 },
                        ge: { budget: 5.0, realise: 0 }
                      }
                    ].map((prestation) => (
                      <tr key={prestation.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">
                            {prestation.id}. {prestation.nom}
                          </span>
                        </td>
                        
                        {/* Superviseur */}
                        <td className="p-4 text-center">
                          {prestation.superviseur.budget > 0 || prestation.superviseur.realise > 0 ? (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600">{prestation.superviseur.budget.toFixed(1)}h</div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${prestation.superviseur.budget > 0 ? Math.min((prestation.superviseur.realise / prestation.superviseur.budget) * 100, 100) : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-emerald-600">{prestation.superviseur.realise.toFixed(2)}h</div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">-</div>
                          )}
                        </td>
                        
                        {/* GD */}
                        <td className="p-4 text-center">
                          {prestation.gd.budget > 0 || prestation.gd.realise > 0 ? (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600">{prestation.gd.budget.toFixed(1)}h</div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${prestation.gd.budget > 0 ? Math.min((prestation.gd.realise / prestation.gd.budget) * 100, 100) : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-emerald-600">{prestation.gd.realise.toFixed(2)}h</div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">-</div>
                          )}
                        </td>
                        
                        {/* SE */}
                        <td className="p-4 text-center">
                          {prestation.se.budget > 0 || prestation.se.realise > 0 ? (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600">{prestation.se.budget.toFixed(1)}h</div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${prestation.se.budget > 0 ? Math.min((prestation.se.realise / prestation.se.budget) * 100, 100) : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-emerald-600">{prestation.se.realise.toFixed(2)}h</div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">-</div>
                          )}
                        </td>
                        
                        {/* GE */}
                        <td className="p-4 text-center">
                          {prestation.ge.budget > 0 || prestation.ge.realise > 0 ? (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600">{prestation.ge.budget.toFixed(1)}h</div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${prestation.ge.budget > 0 ? Math.min((prestation.ge.realise / prestation.ge.budget) * 100, 100) : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-emerald-600">{prestation.ge.realise.toFixed(2)}h</div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">-</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

ClientDetail.displayName = 'ClientDetail';

export default ClientDetail;
