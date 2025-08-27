import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { usePlans } from '@/contexts/PlansContext';
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
  History,
  Star,
  Clock,
  AlertCircle,
  Calendar,
  ChevronDown,
  Flag,
  Sparkles,
  Zap,
  Minus,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  type: string;
  status: string;
  budgetHoraire: number;
  realiseHoraire: number;
  budgetEconomique: number;
  realiseEconomique: number;
}

interface ClientDetailFinalProps {
  client: Client;
  onBack: () => void;
  onSettingsModalOpen: () => void;
  onBudgetModalOpen?: () => void;
  onCorrectionPlanModalOpen?: () => void;
  onPackageRevisionModalOpen?: () => void;
}

const ClientDetailFinal: React.FC<ClientDetailFinalProps> = ({ 
  client, 
  onBack, 
  onSettingsModalOpen,
  onBudgetModalOpen,
  onCorrectionPlanModalOpen,
  onPackageRevisionModalOpen
}) => {
  const { plans } = usePlans();
  
  // Récupérer les plans de correction liés à ce client
  const clientPlans = plans.filter(plan => 
    plan.client === client.name || 
    plan.client.toLowerCase().includes(client.name.toLowerCase())
  );
  const [activeTab, setActiveTab] = useState<'categorie' | 'collaborateur' | 'entite'>('categorie');
  const { toast } = useToast();
  
  // États pour les priorités des tâches
  const [taskPriorities, setTaskPriorities] = useState<Record<string, 'low' | 'medium' | 'high' | 'critical'>>({
    'Q1': 'low',
    'Q2': 'low', 
    'Q3': 'high',
    'Q4': 'medium',
    'ISOC/IPM': 'low',
    'IPP': 'low',
    'Listings TVA': 'low',
    'Versements anticipées': 'critical'
  });
  
  // État pour le mode édition des priorités
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

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

  // Fonctions simplifiées pour les priorités (design minimaliste Web 3.0)
  const getPriorityDot = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'low': return 'bg-slate-400';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Normale';
      case 'high': return 'Élevée';
      case 'critical': return 'Critique';
    }
  };

  const updateTaskPriority = (taskName: string, newPriority: 'low' | 'medium' | 'high' | 'critical') => {
    setTaskPriorities(prev => ({
      ...prev,
      [taskName]: newPriority
    }));
    setEditingPriority(null);
    
    toast({
      title: "✨ Priorité mise à jour",
      description: `"${taskName}" → ${getPriorityLabel(newPriority)}`,
      duration: 2000,
    });
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
        
      </div>

      {/* Structure exacte demandée */}
      <div className="grid grid-cols-12 gap-6">
        {/* Colonne 1 - Informations client + Actions rapides + Encours */}
        <div className="col-span-3 space-y-6 sticky top-6 self-start">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <p className="text-gray-600">{client.type}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={`${getStatusColor(client.status)}`}>
                    {client.status}
                  </Badge>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-200">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-yellow-700">4.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
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
                  <div className="font-semibold">Adolphe Komeza</div>
                </div>
                <div>
                  <span className="text-gray-600">Superviseur :</span>
                  <div className="font-semibold">Julien Limborg</div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Additional Client Information */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">ID Client :</span>
                  <div className="font-semibold">7287</div>
                </div>
                <div>
                  <span className="text-gray-600">Software :</span>
                  <div className="font-semibold">Horus</div>
                </div>
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
                  <span className="text-gray-600">BU :</span>
                  <div className="font-semibold">AC</div>
                </div>
                <div>
                  <span className="text-gray-600">Recouv ID :</span>
                  <div className="font-semibold">5538</div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>contact@cabinet-medical.be</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>+32 2 123 45 67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Rue de la Santé 123, 1000 Bruxelles</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Score de Satisfaction */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                  Satisfaction Client
                </h4>
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-yellow-800">Score global</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-yellow-700">4.2</span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-600">
                    Dernière évaluation: 15/01/2025
                  </div>
                </div>
              </div>

              {/* Actions Rapides */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></div>
                  Actions Rapides
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8 hover:shadow-sm transition-all duration-200"
                    onClick={onSettingsModalOpen}
                  >
                    <Settings className="w-3 h-3 mr-1.5" />
                    Paramétrage
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:shadow-sm transition-all duration-200"
                    onClick={onBudgetModalOpen}
                  >
                    <TrendingUp className="w-3 h-3 mr-1.5" />
                    Gestion Budget
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs h-8 hover:shadow-sm transition-all duration-200">
                    <History className="w-3 h-3 mr-1.5" />
                    Historique
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                        className="w-full justify-between text-xs h-8 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:shadow-sm transition-all duration-200"
                  >
                        <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1.5" />
                    Plan Correction
                        </div>
                        <ChevronDown className="w-3 h-3" />
                  </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem 
                        onClick={onCorrectionPlanModalOpen}
                        className="cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
                        <div>
                          <div className="font-medium">Plan Express</div>
                          <div className="text-xs text-gray-500">Création rapide avec IA</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          // TODO: Implémenter l'ouverture du plan normal
                          console.log('Plan Normal');
                        }}
                        className="cursor-pointer"
                      >
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Plan Complet</div>
                          <div className="text-xs text-gray-500">Création détaillée</div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full justify-start text-xs h-8 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 hover:shadow-sm transition-all duration-200"
                    onClick={onPackageRevisionModalOpen}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1.5" />
                    Révision Forfait
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start text-xs h-8 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:shadow-sm transition-all duration-200">
                    <Mail className="w-3 h-3 mr-1.5" />
                    Recouvrement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encours */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Encours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Encours total :</div>
                <div className="text-2xl font-bold text-blue-700 mb-4">447.58 €</div>
                <div className="text-xs text-gray-500">
                  <div className="mb-2 font-medium">Détails par ancienneté :</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>+ De 90 Jours :</span>
                      <span className="font-medium">0.00 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ De 60 Jours :</span>
                      <span className="font-medium">0.00 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ De 30 Jours :</span>
                      <span className="font-medium">0.00 €</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Moins De 30 Jours :</span>
                      <span className="font-medium text-blue-700">447.58 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne 2 - Budget horaire + Budget économique + Liste prestations */}
        <div className="col-span-6 space-y-6">
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
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Budget: {client.budgetEconomique.toLocaleString()}€</span>
                  <span>Réalisé: {client.realiseEconomique.toLocaleString()}€</span>
                </div>
                <Progress value={(client.realiseEconomique / client.budgetEconomique) * 100} className="h-2" />
                <div className={`text-sm font-medium ${getVarianceColor(client.budgetEconomique, client.realiseEconomique)}`}>
                  Écart: {(client.realiseEconomique - client.budgetEconomique).toLocaleString()}€
                </div>
                
                {/* Rentabilité Versus */}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-green-800">Rentabilité (€/h)</h4>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Budgetée</div>
                      <div className="text-lg font-bold text-green-700">
                        {(client.budgetEconomique / client.budgetHoraire).toFixed(0)}€/h
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Réalisée</div>
                      <div className="text-lg font-bold text-green-700">
                        {client.realiseHoraire > 0 ? (client.realiseEconomique / client.realiseHoraire).toFixed(0) : '0'}€/h
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    {(() => {
                      const rentabiliteBudgetee = client.budgetEconomique / client.budgetHoraire;
                      const rentabiliteRealisee = client.realiseHoraire > 0 ? client.realiseEconomique / client.realiseHoraire : 0;
                      const ecartRentabilite = rentabiliteRealisee - rentabiliteBudgetee;
                      return (
                        <div className={`text-sm font-medium ${ecartRentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ecartRentabilite >= 0 ? '+' : ''}{ecartRentabilite.toFixed(0)}€/h vs budget
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Facturation Minimum */}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-green-800">Facturation Minimum</h4>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  {(() => {
                    const tarifMinimum = 90; // €/heure (seuil de rentabilité configurable)
                    const facturationMinimum = client.realiseHoraire * tarifMinimum;
                    const respecteMinimum = client.realiseEconomique >= facturationMinimum;
                    const pourcentageRespect = facturationMinimum > 0 ? (client.realiseEconomique / facturationMinimum) * 100 : 100;
                    
                    return (
                      <div className="space-y-3">
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-600">Minimum requis ({tarifMinimum}€/h)</span>
                            <span className="text-sm font-bold">€{facturationMinimum.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Facturé actuellement</span>
                            <span className="text-sm font-bold">€{client.realiseEconomique.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${
                          respecteMinimum 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {respecteMinimum ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Seuil de rentabilité respecté ({pourcentageRespect.toFixed(0)}%)
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Sous-facturation ({pourcentageRespect.toFixed(0)}% du minimum)
                            </>
                          )}
                        </div>
                        
                        {!respecteMinimum && (
                          <div className="text-center">
                            <div className="text-xs text-red-600 mb-1">Manque à facturer</div>
                            <div className="text-lg font-bold text-red-700">
                              €{(facturationMinimum - client.realiseEconomique).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

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
                      budgetTotal: 8.5,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 8.5, realise: 4.2 }
                      ]
                    },
                    { 
                      id: '08', 
                      name: 'PRODUCTION BILAN', 
                      budgetTotal: 15.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 10.0, realise: 8.5 },
                        { nom: 'ZEB', budgetAlloue: 5.0, realise: 2.1 }
                      ]
                    },
                    { 
                      id: '09', 
                      name: 'PRESTATIONS FISCALES', 
                      budgetTotal: 6.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 6.0, realise: 3.8 }
                      ]
                    },
                    { 
                      id: '11', 
                      name: 'CONSEILS CLIENT', 
                      budgetTotal: 4.0,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 4.0, realise: 2.5 }
                      ]
                    },
                    { 
                      id: '13', 
                      name: 'VALIDATION - RELECTURE', 
                      budgetTotal: 3.5,
                      collaborateurs: [
                        { nom: 'AO', budgetAlloue: 3.5, realise: 1.8 }
                      ]
                    },
                  ].map((prestation) => {
                    const totalRealise = prestation.collaborateurs.reduce((sum, collab) => sum + collab.realise, 0);
                    const percentageGlobal = prestation.budgetTotal > 0 ? (totalRealise / prestation.budgetTotal) * 100 : 0;
                    const isOverBudget = totalRealise > prestation.budgetTotal;
                    
                    return (
                      <div key={prestation.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${
                              isOverBudget ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {percentageGlobal.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <Progress 
                            value={Math.min(percentageGlobal, 100)} 
                            className={`h-2 ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}
                          />
                        </div>
                        <div className="space-y-2">
                          {prestation.collaborateurs.map((collab, index) => {
                            const collabPercentage = collab.budgetAlloue > 0 ? (collab.realise / collab.budgetAlloue) * 100 : 0;
                            const collabOverBudget = collab.realise > collab.budgetAlloue;
                            
                            return (
                              <div key={index} className="bg-gray-50 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-700">{collab.nom}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-600">
                                      {collab.realise.toFixed(1)}h / {collab.budgetAlloue.toFixed(1)}h
                                    </span>
                                    <span className={`text-xs font-medium ${
                                      collabOverBudget ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {collabPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <Progress 
                                  value={Math.min(collabPercentage, 100)} 
                                  className="h-1"
                                />
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
                <div className="space-y-4">
                  {[
                    { 
                      nom: 'AO', 
                      prestations: [
                        { id: '02', name: 'SCAN ET ADMIN', budgetAlloue: 7.0, realise: 3.2 },
                        { id: '04', name: 'ENCODAGE COMPTABLE', budgetAlloue: 13.0, realise: 6.74 },
                        { id: '05', name: 'PRESTATIONS TVA', budgetAlloue: 2.0, realise: 1.17 },
                        { id: '06', name: 'NETTOYAGE ET VERIFICATION COMPTABILITE', budgetAlloue: 8.5, realise: 4.2 },
                        { id: '08', name: 'PRODUCTION BILAN', budgetAlloue: 10.0, realise: 8.5 },
                        { id: '09', name: 'PRESTATIONS FISCALES', budgetAlloue: 6.0, realise: 3.8 },
                        { id: '11', name: 'CONSEILS CLIENT', budgetAlloue: 4.0, realise: 2.5 },
                        { id: '13', name: 'VALIDATION - RELECTURE', budgetAlloue: 3.5, realise: 1.8 }
                      ]
                    },
                    { 
                      nom: 'ZEB', 
                      prestations: [
                        { id: '02', name: 'SCAN ET ADMIN', budgetAlloue: 4.0, realise: 1.3 },
                        { id: '08', name: 'PRODUCTION BILAN', budgetAlloue: 5.0, realise: 2.1 }
                      ]
                    }
                  ].map((collaborateur) => {
                    const totalBudget = collaborateur.prestations.reduce((sum, prest) => sum + prest.budgetAlloue, 0);
                    const totalRealise = collaborateur.prestations.reduce((sum, prest) => sum + prest.realise, 0);
                    const percentageGlobal = totalBudget > 0 ? (totalRealise / totalBudget) * 100 : 0;
                    const isOverBudget = totalRealise > totalBudget;
                    
                    return (
                      <div key={collaborateur.nom} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {collaborateur.nom}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {collaborateur.nom}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Total Budget: {totalBudget.toFixed(1)}h
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isOverBudget 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                Réalisé: {totalRealise.toFixed(1)}h ({percentageGlobal.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress 
                          value={Math.min(percentageGlobal, 100)} 
                          className={`h-2 mb-3 ${isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                        />
                        <div className="space-y-2">
                          {collaborateur.prestations.map((prestation) => {
                            const prestationPercentage = prestation.budgetAlloue > 0 ? (prestation.realise / prestation.budgetAlloue) * 100 : 0;
                            const prestationOverBudget = prestation.realise > prestation.budgetAlloue;
                            
                            return (
                              <div key={prestation.id} className="bg-gray-50 rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-700">
                                    {prestation.id}. {prestation.name}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-600">
                                      {prestation.realise.toFixed(1)}h / {prestation.budgetAlloue.toFixed(1)}h
                                    </span>
                                    <span className={`text-xs font-medium ${
                                      prestationOverBudget ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {prestationPercentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <Progress 
                                  value={Math.min(prestationPercentage, 100)} 
                                  className="h-1"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {activeTab === 'entite' && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-900">Cabinet Principal</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Budget: 63.0h
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Réalisé: 37.1h (58.9%)
                        </span>
                      </div>
                    </div>
                    <Progress value={58.9} className="h-2 mb-3" />
                    <div className="text-xs text-gray-600">
                      Toutes les prestations sont regroupées sous cette entité principale
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne 3 - Avancement tâches + Volumétrie */}
        <div className="col-span-3 space-y-6">
          {/* Avancement Tâches Fiscales */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <span className="text-gray-900 font-medium">Tâches Fiscales</span>
                </div>
                {/* Indicateurs discrets */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>2 retards</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>3 terminées</span>
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">TVA</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { quarter: 'Q1', status: 'completed', deadline: '31/03/2025', daysLate: 0 },
                      { quarter: 'Q2', status: 'completed', deadline: '30/06/2025', daysLate: 0 },
                      { quarter: 'Q3', status: 'overdue', deadline: '30/09/2025', daysLate: 5 },
                      { quarter: 'Q4', status: 'pending', deadline: '31/12/2025', daysLate: 0 }
                    ].map((item) => {
                      return (
                        <div key={item.quarter} className={`flex flex-col space-y-1 p-2 rounded-lg border ${
                          item.status === 'overdue'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                              {/* Indicateur de priorité - point coloré */}
                              <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(taskPriorities[item.quarter] || 'medium')}`}></div>
                              <span className="text-sm font-medium text-gray-900">{item.quarter}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {/* Bouton d'édition priorité (apparaît au hover) */}
                              {editingPriority === item.quarter ? (
                                <div className="flex items-center space-x-1 bg-white rounded-lg border shadow-sm p-1">
                                  {(['low', 'medium', 'high', 'critical'] as const).map((priority) => (
                                    <button
                                      key={priority}
                                      onClick={() => updateTaskPriority(item.quarter, priority)}
                                      className={`w-6 h-6 rounded-full ${getPriorityDot(priority)} hover:scale-110 transition-transform`}
                                      title={getPriorityLabel(priority)}
                                    />
                                  ))}
                                  <button
                                    onClick={() => setEditingPriority(null)}
                                    className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEditingPriority(item.quarter)}
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-opacity"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              
                              {/* Statut minimaliste */}
                              {item.status === 'completed' ? (
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-green-600" />
                                </div>
                              ) : item.status === 'overdue' ? (
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                  <Clock className="w-3 h-3 text-red-600" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50"></div>
                              )}
                            </div>
                          </div>
                          {item.status === 'overdue' && (
                            <div className="flex items-center space-x-1 text-xs text-red-600">
                              <Clock className="w-3 h-3" />
                              <span>Retard {item.daysLate}j</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.deadline}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Autres Tâches</h4>
                  <div className="space-y-2">
                    {[
                      { 
                        name: 'ISOC/IPM', 
                        completed: true, 
                        status: 'completed',
                        deadline: '15/01/2025',
                        daysLate: 0
                      },
                      { 
                        name: 'IPP', 
                        completed: false, 
                        status: 'skip',
                        deadline: '20/01/2025',
                        daysLate: 0
                      },
                      { 
                        name: 'Listings TVA', 
                        completed: true, 
                        status: 'completed',
                        deadline: '10/01/2025',
                        daysLate: 0
                      },
                      { 
                        name: 'Versements anticipées', 
                        completed: false, 
                        status: 'overdue',
                        deadline: '05/01/2025',
                        daysLate: 18
                      }
                    ].map((task) => (
                      <div key={task.name} className={`flex flex-col space-y-1 p-2 rounded-lg border ${
                        task.status === 'overdue'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            {/* Indicateur de priorité - point coloré */}
                            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(taskPriorities[task.name] || 'medium')}`}></div>
                            <span className="text-sm font-medium text-gray-900">{task.name}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Bouton d'édition priorité (apparaît au hover) */}
                            {editingPriority === task.name ? (
                              <div className="flex items-center space-x-1 bg-white rounded-lg border shadow-sm p-1">
                                {(['low', 'medium', 'high', 'critical'] as const).map((priority) => (
                                  <button
                                    key={priority}
                                    onClick={() => updateTaskPriority(task.name, priority)}
                                    className={`w-6 h-6 rounded-full ${getPriorityDot(priority)} hover:scale-110 transition-transform`}
                                    title={getPriorityLabel(priority)}
                                  />
                                ))}
                                <button
                                  onClick={() => setEditingPriority(null)}
                                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingPriority(task.name)}
                                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-opacity"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            )}
                            
                            {/* Statut minimaliste */}
                            {task.status === 'completed' ? (
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600" />
                              </div>
                            ) : task.status === 'skip' ? (
                              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <Minus className="w-3 h-3 text-amber-600" />
                              </div>
                            ) : task.status === 'overdue' ? (
                              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                <Clock className="w-3 h-3 text-red-600" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Statut discret */}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-50 text-green-600' 
                              : task.status === 'skip'
                              ? 'bg-amber-50 text-amber-600'
                              : task.status === 'overdue'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            {task.status === 'completed' ? 'Terminé' : 
                             task.status === 'skip' ? 'Ignoré' : 
                             task.status === 'overdue' ? `Retard ${task.daysLate}j` :
                             'En attente'}
                          </span>
                            </div>
                        
                        {/* Informations d'échéance */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Échéance: {task.deadline}</span>
                          </div>
                          {task.status === 'overdue' && (
                            <div className="flex items-center space-x-1 text-red-600">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">En retard</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volumétrie par type de document */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Volumétrie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'Achats', budget: 150, realise: 142, couleur: 'blue' },
                  { type: 'Ventes', budget: 80, realise: 75, couleur: 'green' },
                  { type: 'Banques', budget: 45, realise: 48, couleur: 'orange' },
                  { type: 'Salaires', budget: 12, realise: 12, couleur: 'purple' }
                ].map((doc, index) => {
                  const percentage = doc.budget > 0 ? (doc.realise / doc.budget) * 100 : 0;
                  const isOverBudget = doc.realise > doc.budget;
                  
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                        <span className={`text-sm font-semibold ${
                          isOverBudget ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                        <span>Budget: {doc.budget}</span>
                        <span>Réalisé: {doc.realise}</span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className="h-2"
                      />
                      {isOverBudget && (
                        <div className="text-xs text-red-600 mt-1">
                          Dépassement: +{doc.realise - doc.budget}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Plans de Correction */}
        {clientPlans.length > 0 && (
          <div className="col-span-12 mt-6">
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-orange-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Plans de Correction ({clientPlans.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                          <Badge className={
                            plan.priority === 'high' ? 'bg-red-100 text-red-700' :
                            plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {plan.priority === 'high' ? 'Urgent' : 
                             plan.priority === 'medium' ? 'Moyen' : 'Faible'}
                          </Badge>
                          <Badge className={
                            plan.status === 'todo' ? 'bg-gray-100 text-gray-700' :
                            plan.status === 'inprogress' ? 'bg-blue-100 text-blue-700' :
                            plan.status === 'validation' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {plan.status === 'todo' ? 'À Faire' :
                             plan.status === 'inprogress' ? 'En Cours' :
                             plan.status === 'validation' ? 'Validation' : 'Terminé'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Échéance: {plan.deadline}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm">
                          <span className="text-gray-600">Responsable: </span>
                          <span className="font-medium">{plan.assignee}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Créé le: </span>
                          <span className="font-medium">{plan.createdDate}</span>
                        </div>
                      </div>

                      {plan.description && (
                        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      )}

                      {plan.status !== 'done' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{plan.progress}%</span>
                          </div>
                          <Progress value={plan.progress} className="h-2" />
                        </div>
                      )}

                      {plan.activities && plan.activities.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Activités ({plan.activities.length})</h5>
                          <div className="space-y-1">
                            {plan.activities.slice(0, 3).map((activity, index) => (
                              <div key={activity.id} className="flex items-center text-sm">
                                <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${
                                  activity.status === 'completed' ? 'bg-green-500' :
                                  activity.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                                }`}></div>
                                <span className="text-gray-600">{activity.action}</span>
                              </div>
                            ))}
                            {plan.activities.length > 3 && (
                              <div className="text-xs text-gray-500 ml-5">
                                +{plan.activities.length - 3} autres activités...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailFinal;
