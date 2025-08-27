import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, AlertTriangle, Target, Clock, Euro, FileText, BarChart3, 
  Eye, Users, Zap, CheckCircle, XCircle, Filter, Calendar, Globe, MapPin, 
  TrendingDown, Award, Star, Activity, ArrowUpCircle, ArrowDownCircle,
  Building, CreditCard, Wallet, PieChart, LineChart, Search, Settings,
  AlertCircle, ThumbsUp, ThumbsDown, Edit, RefreshCw, Mail,
  Phone, MessageSquare, Calculator, Percent, ChevronRight, ChevronDown,
  Shield, ShieldCheck, ShieldX, History, Wrench, Grid3X3, List,
  ChevronLeft, MoreHorizontal, X, Download, Plus
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ruleEngine, type SuspicionJustification } from '@/utils/ruleEngine';
import { generateMockClients, generateOverviewStats, type MockClient } from '@/utils/mockDataGenerator';
import { 
  LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Couleurs modernes pour les graphiques
const COLORS = {
  primary: '#4A90E2',
  success: '#10B981', 
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316',
  teal: '#14B8A6',
  indigo: '#6366F1',
  pink: '#EC4899'
};

// Données financières complètes
const financeOverviewData = {
  clientsSuspects: {
    nombre: 8,
    liste: [
      { nom: 'SARL RETARD PAYMENT', probleme: 'Factures impayées +90j', montant: 15000, gravite: 'high' },
      { nom: 'EURL DIFFICILE CONTACT', probleme: 'Perte de contact depuis 6 mois', montant: 8500, gravite: 'high' },
      { nom: 'SAS BUDGET DEPASSÉ', probleme: 'Dépassement budget +50%', montant: 12000, gravite: 'medium' },
      { nom: 'SCI RENTABILITÉ FAIBLE', probleme: 'Marge < 15% sur 2 ans', montant: 6200, gravite: 'medium' },
      { nom: 'SARL DEMANDES MULTIPLES', probleme: 'Demandes hors budget répétées', montant: 9800, gravite: 'low' }
    ]
  },
  budgetHoraireTotal: 1850000,
  budgetHoraireMaroc: 320000,
  budgetHoraireBelgique: 1530000,
  budgetEconomiqueAnnuel: 2200000,
  realiseHoraireTotal: 1650000,
  realiseHoraireMaroc: 290000,
  realiseHoraireBelgique: 1360000,
  realiseEconomiqueAnnuel: 1980000,
  realiseEconomiqueTrimestriel: [
    { trimestre: 'Q1 2024', valeur: 510000, budget: 550000, evolution: 8.2 },
    { trimestre: 'Q2 2024', valeur: 495000, budget: 550000, evolution: -2.9 },
    { trimestre: 'Q3 2024', valeur: 520000, budget: 550000, evolution: 5.1 },
    { trimestre: 'Q4 2024', valeur: 455000, budget: 550000, evolution: -12.5 }
  ],
  encoursDetaille: {
    total: 425000,
    repartition: {
      '0-30j': { montant: 125000, pourcentage: 29.4, clients: 45 },
      '30-60j': { montant: 95000, pourcentage: 22.4, clients: 32 },
      '60-90j': { montant: 85000, pourcentage: 20.0, clients: 28 },
      '+90j': { montant: 120000, pourcentage: 28.2, clients: 38 }
    }
  },
  realiseEconomiqueParPartner: {
    total: 1850000,
    partners: [
      { nom: 'Mohamed', ca: 385000, pourcentage: 20.8, objectif: 400000, progression: 96.3 },
      { nom: 'Julien', ca: 342000, pourcentage: 18.5, objectif: 360000, progression: 95.0 },
      { nom: 'Vincent', ca: 298000, pourcentage: 16.1, objectif: 320000, progression: 93.1 },
      { nom: 'Pol', ca: 275000, pourcentage: 14.9, objectif: 280000, progression: 98.2 },
      { nom: 'Ingrid', ca: 285000, pourcentage: 15.4, objectif: 290000, progression: 98.3 },
      { nom: 'Pierre', ca: 265000, pourcentage: 14.3, objectif: 270000, progression: 98.1 }
    ]
  }
};

// Génération des données de test
const analysesFinancieres = generateMockClients(250);
const overviewStats = generateOverviewStats(analysesFinancieres);

const FinanceModern = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  
  // États pour l'analyse financière
  const [selectedFilters, setSelectedFilters] = useState({
    typeFacturation: 'tous',
    gestionnaire: 'tous',
    statut: 'tous',
    affichage: 'tous',
    diagnostic: 'tous'
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [justificationDialog, setJustificationDialog] = useState<{open: boolean, client?: any}>({open: false});
  const [justificationText, setJustificationText] = useState('');
  const [showRulesConfig, setShowRulesConfig] = useState(false);
  const [sortBy, setSortBy] = useState<'nom' | 'statut' | 'diagnostic' | 'rentabilite'>('statut');
  const [showRealisePartnersSidebar, setShowRealisePartnersSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'overview' | 'list'>('overview');

  // Calculs dynamiques
  const {
    clientsSuspects,
    budgetHoraireTotal,
    budgetHoraireMaroc,
    budgetHoraireBelgique,
    budgetEconomiqueAnnuel,
    realiseHoraireTotal,
    realiseHoraireMaroc,
    realiseHoraireBelgique,
    realiseEconomiqueAnnuel,
    realiseEconomiqueTrimestriel,
    encoursDetaille,
    realiseEconomiqueParPartner
  } = financeOverviewData;

  // Impact des clients
  const impactClientsEntrants = {
    caAnneeEnCours: 265000,
    caAnneeSuivante: 420000,
    nombreClients: 18
  };

  const impactClientsSortants = {
    caAnneeEnCours: 145000,
    caAnneeSuivante: 180000,
    nombreClients: 12
  };

  const caClientsRisque = 285000;
  const nombreClientsRisque = 15;

  // Révisions de forfaits en cours
  const revisionsForfaits = [
    {
      client: "TECHNO SOLUTIONS",
      motif: "Augmentation volume",
      forfaitActuel: 850,
      forfaitPropose: 1200,
      priorite: "haute" as const
    },
    {
      client: "GARAGE MARTIN",
      motif: "Services additionnels",
      forfaitActuel: 450,
      forfaitPropose: 650,
      priorite: "moyenne" as const
    },
    {
      client: "RESTAURANT L'OLIVIER",
      motif: "Complexité accrue",
      forfaitActuel: 380,
      forfaitPropose: 520,
      priorite: "faible" as const
    },
    {
      client: "BOUTIQUE MODE",
      motif: "Multi-sociétés",
      forfaitActuel: 290,
      forfaitPropose: 450,
      priorite: "moyenne" as const
    },
    {
      client: "COIFFURE ELEGANCE",
      motif: "Nouvelle réglementation",
      forfaitActuel: 220,
      forfaitPropose: 320,
      priorite: "faible" as const
    }
  ];

  const tauxRealisationHoraire = ((realiseHoraireTotal / budgetHoraireTotal) * 100).toFixed(1);
  const tauxRealisationEconomique = ((realiseEconomiqueAnnuel / budgetEconomiqueAnnuel) * 100).toFixed(1);

  // Analyse des clients avec le moteur de règles
  const analyzeClientWithRules = (client: any) => {
    const analysis = ruleEngine.analyzeClient(client);
    const justification = ruleEngine.getJustification(client.id);
    
    const seuilRentabilite = 90;
    const tarifHoraireReel = client.realiseADate.heures > 0 
      ? client.realiseADate.chiffreAffaires / client.realiseADate.heures 
      : 0;
    
    const ecartFacturationPrestation = client.realiseADate.pourcentageCA - client.realiseADate.pourcentageHeures;
    
    let displayDiagnostic;
    
    if (ecartFacturationPrestation > 25 && client.realiseADate.pourcentageCA > 70) {
      displayDiagnostic = {
        type: 'dette_prestation' as const,
        alerte: `⚠️ Client payé à ${client.realiseADate.pourcentageCA.toFixed(1)}% mais seulement ${client.realiseADate.pourcentageHeures.toFixed(1)}% presté`,
        actionRecommandee: 'Analyser le planning et démarrer les prestations',
        urgence: 'low' as const
      };
    } else if (ecartFacturationPrestation < -25 && client.realiseADate.pourcentageHeures > 70) {
      displayDiagnostic = {
        type: 'sous_facturation' as const,
        alerte: `💸 ${client.realiseADate.pourcentageHeures.toFixed(1)}% presté mais seulement ${client.realiseADate.pourcentageCA.toFixed(1)}% facturé`,
        actionRecommandee: 'Analyser les causes du surcoût + réviser forfait',
        urgence: 'high' as const
      };
    } else if (tarifHoraireReel < seuilRentabilite && client.realiseADate.heures > 10) {
      displayDiagnostic = {
        type: 'rentabilite_faible' as const,
        alerte: `📉 Rentabilité ${tarifHoraireReel.toFixed(0)}€/h (< ${seuilRentabilite}€/h)`,
        actionRecommandee: 'Révision urgente du forfait',
        urgence: 'high' as const
      };
    } else {
      displayDiagnostic = {
        type: 'equilibre' as const,
        alerte: `✅ Équilibre sain (${tarifHoraireReel.toFixed(0)}€/h)`,
        actionRecommandee: 'Maintenir le rythme actuel',
        urgence: 'none' as const
      };
    }

    let nouveauStatut: 'suspect' | 'attention' | 'bon';
    if (displayDiagnostic.urgence === 'high') {
      nouveauStatut = 'suspect';
    } else if (displayDiagnostic.urgence === 'medium' || displayDiagnostic.urgence === 'low') {
      nouveauStatut = 'attention';
    } else {
      nouveauStatut = 'bon';
    }

    return {
      ...client,
      analysis,
      justification,
      statut: nouveauStatut,
      diagnostic: displayDiagnostic
    };
  };

  const clientsAnalyzed = analysesFinancieres.map(analyzeClientWithRules);
  
  const clientsFiltres = clientsAnalyzed.filter(client => {
    const matchSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.gestionnaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedFilters.typeFacturation === 'tous' || client.typeFacturation === selectedFilters.typeFacturation;
    const matchGest = selectedFilters.gestionnaire === 'tous' || client.gestionnaire === selectedFilters.gestionnaire;
    const matchStatut = selectedFilters.statut === 'tous' || client.statut === selectedFilters.statut;
    
    let matchAffichage = true;
    if (selectedFilters.affichage === 'suspects') {
      matchAffichage = client.statut === 'suspect' && !client.justification;
    } else if (selectedFilters.affichage === 'a_surveiller') {
      matchAffichage = client.statut === 'attention' && !client.justification;
    } else if (selectedFilters.affichage === 'neutralises') {
      matchAffichage = client.justification?.status === 'neutralized';
    }
    
    const matchDiagnostic = selectedFilters.diagnostic === 'tous' || client.diagnostic?.type === selectedFilters.diagnostic;
    
    return matchSearch && matchType && matchGest && matchStatut && matchAffichage && matchDiagnostic;
  });

  // Tri et pagination
  const sortClientsByDiagnostic = (clients: any[]) => {
    return [...clients].sort((a, b) => {
      if (sortBy === 'statut') {
        const statutOrder = { 'suspect': 1, 'attention': 2, 'bon': 3 };
        return (statutOrder[a.statut] || 999) - (statutOrder[b.statut] || 999);
      } else {
        return a.nom.localeCompare(b.nom);
      }
    });
  };

  const clientsSorted = sortClientsByDiagnostic(clientsFiltres);
  const totalPages = Math.ceil(clientsSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientsPaginated = clientsSorted.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  // Fonctions utilitaires
  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'suspect': return 'bg-red-100 text-red-700 border-red-300';
      case 'attention': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'bon': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDiagnosticIcon = (type: string) => {
    switch(type) {
      case 'dette_prestation': return <TrendingDown className="w-5 h-5 text-blue-500" />;
      case 'sous_facturation': return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case 'rentabilite_faible': return <DollarSign className="w-5 h-5 text-red-500" />;
      case 'equilibre': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSuspicionStatusIcon = (client: any) => {
    if (client.justification?.status === 'neutralized') {
      return <ShieldCheck className="w-4 h-4 text-green-500" />;
    }
    if (client.analysis?.isSuspect) {
      return <ShieldX className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const handleNeutralizeSuspicion = (client: any) => {
    if (!justificationText.trim()) return;
    
    ruleEngine.neutralizeSuspicion(
      client.id,
      client.analysis.ruleTriggered?.id || 'unknown',
      justificationText,
      'current-user',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
    
    setJustificationText('');
    setJustificationDialog({open: false});
    setSelectedFilters(prev => ({...prev}));
  };

  const handleReactivateSuspicion = (client: any) => {
    ruleEngine.reactivateSuspicion(client.id, client.analysis.ruleTriggered?.id || 'unknown');
    setSelectedFilters(prev => ({...prev}));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finance
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyse financière complète et suivi de la rentabilité
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Année {selectedPeriod}
            </Badge>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Vue d'ensemble avec métriques principales */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Vue d'Ensemble Financière</h2>
                <p className="text-blue-100 mb-6">Analyse complète de la performance financière {selectedPeriod}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-8 h-8 text-green-300" />
                      <div>
                        <p className="text-sm text-blue-100">Encours Total</p>
                        <p className="text-2xl font-bold">{(encoursDetaille.total / 1000).toFixed(0)}K€</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <Target className="w-8 h-8 text-purple-300" />
                      <div>
                        <p className="text-sm text-blue-100">Taux Réalisation</p>
                        <p className="text-2xl font-bold">{tauxRealisationEconomique}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-white/30 transition-all duration-200 group"
                    onClick={() => setShowRealisePartnersSidebar(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-emerald-300 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="text-sm text-blue-100">CA Réalisé</p>
                          <p className="text-2xl font-bold">{(realiseEconomiqueAnnuel / 1000000).toFixed(2)}M€</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-200 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-blue-200 mt-2 group-hover:text-blue-100">Cliquer pour voir par partner</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budgets vs Réalisés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Budgets Annuels */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Target className="w-6 h-6" />
                    <span>Budgets Annuels</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Budget Économique - priorité */}
                  <div 
                    className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border border-purple-200 cursor-pointer hover:bg-gradient-to-r hover:from-purple-200 hover:to-indigo-200 transition-all duration-200"
                    onClick={() => setShowRealisePartnersSidebar(true)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Euro className="w-6 h-6 text-purple-600" />
                        <span className="font-bold text-purple-800">Budget Économique</span>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-800">{(budgetEconomiqueAnnuel / 1000000).toFixed(2)}M€</p>
                        <Badge className="bg-purple-100 text-purple-700">Priorité</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">Cliquer pour voir par partner</p>
                  </div>

                  {/* Budgets Horaires par zone */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Budgets Horaires</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Total Horaire</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-800">{(budgetHoraireTotal / 1000000).toFixed(2)}M€</p>
                        <Badge className="bg-blue-100 text-blue-700">100%</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Belgique</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-800">{(budgetHoraireBelgique / 1000000).toFixed(2)}M€</p>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          {((budgetHoraireBelgique / budgetHoraireTotal) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Maroc</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-800">{(budgetHoraireMaroc / 1000).toFixed(0)}K€</p>
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {((budgetHoraireMaroc / budgetHoraireTotal) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Réalisés Annuels */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Activity className="w-6 h-6" />
                    <span>Réalisés Annuels</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Réalisé Économique - priorité */}
                  <div 
                    className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 cursor-pointer hover:bg-gradient-to-r hover:from-green-200 hover:to-emerald-200 transition-all duration-200"
                    onClick={() => setShowRealisePartnersSidebar(true)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Euro className="w-6 h-6 text-green-600" />
                        <span className="font-bold text-green-800">Réalisé Économique</span>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-800">{(realiseEconomiqueAnnuel / 1000000).toFixed(2)}M€</p>
                        <Badge className={`${parseFloat(tauxRealisationEconomique) >= 85 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {tauxRealisationEconomique}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={parseFloat(tauxRealisationEconomique)} className="h-3" />
                    <p className="text-xs text-green-600 mt-2">Cliquer pour voir par partner</p>
                  </div>

                  {/* Réalisés Horaires par zone */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Réalisés Horaires</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Total Horaire</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-800">{(realiseHoraireTotal / 1000000).toFixed(2)}M€</p>
                        <Badge className={`${parseFloat(tauxRealisationHoraire) >= 85 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {tauxRealisationHoraire}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Belgique</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-800">{(realiseHoraireBelgique / 1000000).toFixed(2)}M€</p>
                        <Badge variant="outline" className="border-green-300 text-green-700">
                          {((realiseHoraireBelgique / budgetHoraireBelgique) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Maroc</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-800">{(realiseHoraireMaroc / 1000).toFixed(0)}K€</p>
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          {((realiseHoraireMaroc / budgetHoraireMaroc) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Réalisé Économique par Trimestre - 4 blocs */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <BarChart3 className="w-6 h-6" />
                  <span>Réalisé Économique par Trimestre</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {realiseEconomiqueTrimestriel.map((trimestre, index) => {
                    const isPositif = trimestre.evolution > 0;
                    const tauxRealisation = ((trimestre.valeur / trimestre.budget) * 100).toFixed(1);
                    
                    return (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                        <div className="text-center space-y-4">
                          <div>
                            <h4 className="font-bold text-purple-800 text-lg">{trimestre.trimestre}</h4>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                              {(trimestre.valeur / 1000).toFixed(0)}K€
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Budget:</span>
                              <span className="font-medium">{(trimestre.budget / 1000).toFixed(0)}K€</span>
                            </div>
                            <Progress value={parseFloat(tauxRealisation)} className="h-2" />
                            <div className="text-xs text-gray-500">{tauxRealisation}% réalisé</div>
                          </div>
                          
                          <div className="pt-2 border-t border-purple-100">
                            <Badge 
                              className={`${isPositif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                              {isPositif ? '+' : ''}{trimestre.evolution}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Détail Encours par Âge */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Clock className="w-6 h-6" />
                  <span>Répartition Encours par Âge</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Object.entries(encoursDetaille.repartition).map(([periode, data]) => (
                    <div key={periode} className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <div className="mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          periode === '+90j' ? 'bg-red-100 text-red-600' :
                          periode === '60-90j' ? 'bg-orange-100 text-orange-600' :
                          periode === '30-60j' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">{periode}</p>
                      </div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">
                        {(data.montant / 1000).toFixed(0)}K€
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {data.clients} clients
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            periode === '+90j' ? 'bg-red-400' :
                            periode === '60-90j' ? 'bg-orange-400' :
                            periode === '30-60j' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${data.pourcentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{data.pourcentage.toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clients Suspects */}
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-800">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-6 h-6" />
                    <span>Clients Suspects</span>
                  </div>
                  <Badge variant="destructive">{clientsSuspects.nombre}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientsSuspects.liste.slice(0, 3).map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          client.gravite === 'high' ? 'bg-red-500' :
                          client.gravite === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}>
                          {client.nom.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{client.nom}</p>
                          <p className="text-sm text-gray-600">{client.probleme}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={client.gravite === 'high' ? 'destructive' : client.gravite === 'medium' ? 'secondary' : 'outline'}>
                          {client.gravite === 'high' ? 'Critique' : client.gravite === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                        <p className="text-sm font-bold text-red-600 mt-1">
                          €{(client.montant / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('analysis')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir l'analyse complète
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Impact Clients */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Clients Entrants */}
              <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <ArrowUpCircle className="w-6 h-6" />
                    <span>Clients Entrants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600 mb-2">
                        +{(impactClientsEntrants.caAnneeEnCours / 1000).toFixed(0)}K€
                      </p>
                      <p className="text-sm text-gray-600">CA 2024</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CA 2025 prévu:</span>
                        <span className="font-bold text-green-700">+{(impactClientsEntrants.caAnneeSuivante / 1000).toFixed(0)}K€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nouveaux clients:</span>
                        <Badge className="bg-green-100 text-green-700">{impactClientsEntrants.nombreClients}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CA moyen/client:</span>
                        <span className="font-medium">{(impactClientsEntrants.caAnneeEnCours / impactClientsEntrants.nombreClients / 1000).toFixed(1)}K€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clients Sortants */}
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <ArrowDownCircle className="w-6 h-6" />
                    <span>Clients Sortants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-red-600 mb-2">
                        -{(impactClientsSortants.caAnneeEnCours / 1000).toFixed(0)}K€
                      </p>
                      <p className="text-sm text-gray-600">Perte CA 2024</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Impact 2025:</span>
                        <span className="font-bold text-red-700">-{(impactClientsSortants.caAnneeSuivante / 1000).toFixed(0)}K€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Clients perdus:</span>
                        <Badge variant="destructive">{impactClientsSortants.nombreClients}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Perte moy/client:</span>
                        <span className="font-medium">{(impactClientsSortants.caAnneeEnCours / impactClientsSortants.nombreClients / 1000).toFixed(1)}K€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clients à Risque */}
              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle className="w-6 h-6" />
                    <span>Clients à Risque</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-orange-600 mb-2">
                        {(caClientsRisque / 1000).toFixed(0)}K€
                      </p>
                      <p className="text-sm text-gray-600">CA à risque</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Clients à risque:</span>
                        <Badge className="bg-orange-100 text-orange-700">{nombreClientsRisque}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CA moyen/client:</span>
                        <span className="font-medium">{(caClientsRisque / nombreClientsRisque / 1000).toFixed(1)}K€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">% du CA total:</span>
                        <span className="font-bold text-orange-700">{((caClientsRisque / realiseEconomiqueAnnuel) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Révisions de Forfaits en Cours */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-amber-800">
                  <div className="flex items-center space-x-2">
                    <Edit className="w-6 h-6" />
                    <span>Révisions de Forfaits en Cours</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700">{revisionsForfaits.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revisionsForfaits.slice(0, 4).map((revision, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          revision.priorite === 'haute' ? 'bg-red-500' :
                          revision.priorite === 'moyenne' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}>
                          {revision.client.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{revision.client}</p>
                          <p className="text-sm text-gray-600">{revision.motif}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-600">
                          {revision.forfaitActuel}€ → {revision.forfaitPropose}€
                        </p>
                        <Badge variant={revision.priorite === 'haute' ? 'destructive' : revision.priorite === 'moyenne' ? 'secondary' : 'outline'}>
                          {revision.priorite}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {revisionsForfaits.length > 4 && (
                    <Button variant="outline" className="w-full">
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      Voir {revisionsForfaits.length - 4} autres révisions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Analyse Financière Intelligente */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Intelligence Financière
                    </h1>
                    <p className="text-gray-600 mt-1">Diagnostic instantané • Actions recommandées • Performance temps réel</p>
                  </div>
                </div>

                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl"
                  />
                </div>
              </div>

              {/* Section Filtres Moderne et Compacte */}
              <div className="bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-100/50 mb-6">
                
                {/* Ligne 1: Filtres de Statut avec Explications et Diagnostics */}
                <div className="flex items-start justify-between mb-6">
                  {/* Section Gauche: Filtres Statut + Diagnostics */}
                  <div className="flex flex-col space-y-4">
                    
                    {/* Filtres Statut avec explications claires */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
                        <button
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev, 
                            statut: prev.statut === 'suspect' ? 'tous' : 'suspect',
                            affichage: prev.statut === 'suspect' ? 'tous' : 'suspects',
                            diagnostic: 'tous'
                          }))}
                          className={`group flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            selectedFilters.statut === 'suspect' 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105' 
                              : 'text-red-600 hover:bg-red-50 hover:scale-105'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-all ${
                            selectedFilters.statut === 'suspect' ? 'bg-white' : 'bg-red-500'
                          }`}></div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{overviewStats.counts.suspects}</span>
                            <span>Suspects</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            statut: prev.statut === 'attention' ? 'tous' : 'attention',
                            affichage: prev.statut === 'attention' ? 'tous' : 'a_surveiller',
                            diagnostic: 'tous'
                          }))}
                          className={`group flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            selectedFilters.statut === 'attention' 
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105' 
                              : 'text-orange-600 hover:bg-orange-50 hover:scale-105'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-all ${
                            selectedFilters.statut === 'attention' ? 'bg-white' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{clientsAnalyzed.filter(c => c.statut === 'attention' && !c.justification).length}</span>
                            <span>À surveiller</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            affichage: prev.affichage === 'neutralises' ? 'tous' : 'neutralises',
                            diagnostic: 'tous'
                          }))}
                          className={`group flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            selectedFilters.affichage === 'neutralises' 
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105' 
                              : 'text-yellow-600 hover:bg-yellow-50 hover:scale-105'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-all ${
                            selectedFilters.affichage === 'neutralises' ? 'bg-white' : 'bg-yellow-500'
                          }`}></div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{clientsFiltres.filter(c => c.justification?.status === 'neutralized').length}</span>
                            <span>Neutralisés</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev,
                            statut: prev.statut === 'bon' ? 'tous' : 'bon',
                            diagnostic: 'tous'
                          }))}
                          className={`group flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            selectedFilters.statut === 'bon' 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105' 
                              : 'text-green-600 hover:bg-green-50 hover:scale-105'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-all ${
                            selectedFilters.statut === 'bon' ? 'bg-white' : 'bg-green-500'
                          }`}></div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{overviewStats.counts.sains}</span>
                            <span>Sains</span>
                          </div>
                        </button>
                      </div>
                      
                      {/* Compteur total */}
                      <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-sm font-bold text-gray-700">Total:</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {clientsFiltres.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Filtres Diagnostics - Directement liés aux statuts */}
                    {(selectedFilters.statut !== 'tous' || selectedFilters.affichage !== 'tous') && (
                      <div className="ml-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Diagnostics spécifiques</span>
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>
                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                          {(() => {
                            let availableDiagnostics = [];
                            
                            if (selectedFilters.statut === 'suspect') {
                              availableDiagnostics = [
                                { key: 'sous_facturation', label: 'Sous-Facturation', icon: ArrowDownCircle, color: 'red' },
                                { key: 'rentabilite_faible', label: 'Rentabilité Faible', icon: DollarSign, color: 'red' }
                              ];
                            } else if (selectedFilters.statut === 'attention') {
                              availableDiagnostics = [
                                { key: 'dette_prestation', label: 'Dette Prestation', icon: TrendingDown, color: 'orange' }
                              ];
                            } else if (selectedFilters.statut === 'bon') {
                              availableDiagnostics = [
                                { key: 'equilibre', label: 'Équilibre', icon: CheckCircle, color: 'green' }
                              ];
                            } else if (selectedFilters.affichage === 'neutralises') {
                              availableDiagnostics = [
                                { key: 'neutralise', label: 'Neutralisé', icon: Shield, color: 'yellow' }
                              ];
                            } else {
                              availableDiagnostics = [
                                { key: 'sous_facturation', label: 'Sous-Facturation', icon: ArrowDownCircle, color: 'red' },
                                { key: 'rentabilite_faible', label: 'Rentabilité Faible', icon: DollarSign, color: 'red' },
                                { key: 'dette_prestation', label: 'Dette Prestation', icon: TrendingDown, color: 'orange' },
                                { key: 'equilibre', label: 'Équilibre', icon: CheckCircle, color: 'green' }
                              ];
                            }
                            
                            return availableDiagnostics;
                          })().map((diagnostic) => {
                            const Icon = diagnostic.icon;
                            const isActive = selectedFilters.diagnostic === diagnostic.key;
                            const count = clientsAnalyzed.filter(c => c.diagnostic?.type === diagnostic.key).length;
                            
                            return (
                              <button
                                key={diagnostic.key}
                                onClick={() => setSelectedFilters(prev => ({
                                  ...prev,
                                  diagnostic: prev.diagnostic === diagnostic.key ? 'tous' : diagnostic.key
                                }))}
                                className={`group flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                                  isActive 
                                    ? `bg-gradient-to-r from-${diagnostic.color}-500 to-${diagnostic.color}-600 text-white shadow-${diagnostic.color}-500/40` 
                                    : `bg-white/80 backdrop-blur-sm text-${diagnostic.color}-600 hover:bg-${diagnostic.color}-50 border border-white/40`
                                }`}
                              >
                                <Icon className={`w-4 h-4 transition-all ${isActive ? 'text-white' : `text-${diagnostic.color}-500`}`} />
                                <span>{diagnostic.label}</span>
                                <div className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold transition-all ${
                                  isActive ? `bg-white/20 text-white` : `bg-${diagnostic.color}-100 text-${diagnostic.color}-700`
                                }`}>
                                  {count}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions Principales */}
                  <div className="flex items-center space-x-3">
                    {/* Toggle Vue */}
                    <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
                      <Button
                        variant={viewMode === 'overview' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('overview')}
                        className={`rounded-xl h-9 px-3 transition-all duration-300 ${
                          viewMode === 'overview' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'hover:bg-blue-50 text-blue-600'
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={`rounded-xl h-9 px-3 transition-all duration-300 ${
                          viewMode === 'list' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'hover:bg-blue-50 text-blue-600'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Bouton Règles */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRulesConfig(true)}
                      className="bg-white/70 backdrop-blur-sm border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl h-9"
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Règles</span>
                    </Button>
                    
                    {/* Reset Filtres */}
                    {(selectedFilters.statut !== 'tous' || selectedFilters.affichage !== 'tous' || selectedFilters.diagnostic !== 'tous') && (
                      <Button
                        onClick={() => setSelectedFilters({
                          typeFacturation: 'tous',
                          gestionnaire: 'tous', 
                          statut: 'tous',
                          affichage: 'tous',
                          diagnostic: 'tous'
                        })}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-2xl h-9 px-3"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Reset</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Ligne 2: Filtres Secondaires - Layout plus compact */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Type facturation</label>
                    <Select value={selectedFilters.typeFacturation} onValueChange={(value) => setSelectedFilters({...selectedFilters, typeFacturation: value})}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les types</SelectItem>
                        <SelectItem value="Forfait Mensuel">Forfait Mensuel</SelectItem>
                        <SelectItem value="Forfait Annuel">Forfait Annuel</SelectItem>
                        <SelectItem value="Forfait Trimestriel">Forfait Trimestriel</SelectItem>
                        <SelectItem value="Mission Ponctuelle">Mission Ponctuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Gestionnaire</label>
                    <Select value={selectedFilters.gestionnaire} onValueChange={(value) => setSelectedFilters({...selectedFilters, gestionnaire: value})}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les gestionnaires</SelectItem>
                        <SelectItem value="Mohamed">Mohamed</SelectItem>
                        <SelectItem value="Julien">Julien</SelectItem>
                        <SelectItem value="Vincent">Vincent</SelectItem>
                        <SelectItem value="Pol">Pol</SelectItem>
                        <SelectItem value="Ingrid">Ingrid</SelectItem>
                        <SelectItem value="Pierre">Pierre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tri</label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="statut">Statut</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="rentabilite">Rentabilité</SelectItem>
                        <SelectItem value="nom">Nom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Résultats</label>
                    <Select value={itemsPerPage.toString()} onValueChange={() => {}}>
                      <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 par page</SelectItem>
                        <SelectItem value="24">24 par page</SelectItem>
                        <SelectItem value="48">48 par page</SelectItem>
                        <SelectItem value="100">100 par page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </div>

              {/* Grille des clients */}
              <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {clientsPaginated.map((client, index) => (
                  <div
                    key={client.id}
                    className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${
                      client.statut === 'suspect' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                      client.statut === 'attention' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                      client.justification?.status === 'neutralized' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                      'bg-gradient-to-r from-green-400 to-emerald-400'
                    }`} />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                            client.statut === 'suspect' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                            client.statut === 'attention' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            client.justification?.status === 'neutralized' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-br from-green-400 to-emerald-600'
                          }`}>
                            {client.nom.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {client.nom}
                            </h3>
                            <p className="text-sm text-gray-500">{client.gestionnaire}</p>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className={`p-4 rounded-2xl mb-4 ${
                        client.statut === 'suspect' ? 'bg-red-50 border border-red-100' :
                        client.statut === 'attention' ? 'bg-orange-50 border border-orange-100' :
                        client.justification?.status === 'neutralized' ? 'bg-yellow-50 border border-yellow-100' :
                        'bg-green-50 border border-green-100'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {getDiagnosticIcon(client.diagnostic.type)}
                          <span className={`text-sm font-medium ${
                            client.statut === 'suspect' ? 'text-red-700' :
                            client.statut === 'attention' ? 'text-orange-700' :
                            client.justification?.status === 'neutralized' ? 'text-yellow-700' :
                            'text-green-700'
                          }`}>
                            {client.diagnostic.type === 'dette_prestation' ? 'Dette Prestation' :
                             client.diagnostic.type === 'sous_facturation' ? 'Sous-Facturation' :
                             client.diagnostic.type === 'rentabilite_faible' ? 'Rentabilité Faible' :
                             'Équilibre Sain'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{client.diagnostic.alerte}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {client.realiseADate.pourcentageHeures.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Prestation</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${
                            client.realiseADate.pourcentageCA > 100 ? 'text-orange-600' : 'text-blue-600'
                          }`}>
                            {client.realiseADate.pourcentageCA.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Facturation</div>
                        </div>
                        <div className="text-center">
                          {(() => {
                            const tarifReel = client.realiseADate.heures > 0 
                              ? client.realiseADate.chiffreAffaires / client.realiseADate.heures 
                              : 0;
                            return (
                              <>
                                <div className={`text-xl font-bold ${
                                  tarifReel >= 90 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {tarifReel.toFixed(0)}€
                                </div>
                                <div className="text-xs text-gray-500">/heure</div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Actions pour suspects */}
                      {client.analysis?.isSuspect && client.analysis?.canBeNeutralized && !client.justification && (
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setJustificationDialog({open: true, client});
                            }}
                            className="w-full text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            Justifier
                          </Button>
                        </div>
                      )}
                      
                      {/* Statut neutralisé */}
                      {client.justification?.status === 'neutralized' && (
                        <div className="mt-4 flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700">Neutralisé</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactivateSuspicion(client);
                            }}
                            className="h-6 px-2 text-xs text-green-700 hover:text-green-900"
                          >
                            Réactiver
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Suivi Budgétaire Intelligent</h3>
                <p className="text-muted-foreground">Module en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Sidebar Réalisé par Partner */}
      {showRealisePartnersSidebar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-[580px] h-full shadow-2xl overflow-y-auto">
            <div className="p-8 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800">Réalisé Économique par Partner</h3>
                  <p className="text-base text-emerald-600">Performance 2024</p>
                </div>
                <button
                  onClick={() => setShowRealisePartnersSidebar(false)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-emerald-600" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                <div className="text-center">
                  <p className="text-base font-medium text-emerald-700">Total Réalisé</p>
                  <p className="text-4xl font-bold text-emerald-800 mt-2">
                    {(realiseEconomiqueParPartner.total / 1000000).toFixed(2)}M€
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {realiseEconomiqueParPartner.partners.map((partner, index) => (
                  <div key={partner.nom} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          index === 0 ? 'bg-emerald-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' :
                          index === 4 ? 'bg-pink-500' : 'bg-indigo-500'
                        }`}>
                          {partner.nom.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">{partner.nom}</p>
                          <p className="text-sm text-gray-500">{partner.pourcentage}% du total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{(partner.ca / 1000).toFixed(0)}K€</p>
                        <div className={`text-sm px-3 py-1 rounded-full font-medium ${
                          partner.progression >= 98 ? 'bg-green-100 text-green-700' :
                          partner.progression >= 95 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {partner.progression.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Objectif: {(partner.objectif / 1000).toFixed(0)}K€</span>
                        <span className="text-gray-600">Écart: {((partner.ca - partner.objectif) / 1000).toFixed(0)}K€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            partner.progression >= 98 ? 'bg-green-500' :
                            partner.progression >= 95 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(partner.progression, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de justification */}
      <Dialog open={justificationDialog.open} onOpenChange={(open) => setJustificationDialog({open})}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Justifier la Suspicion</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Client: <span className="font-medium">{justificationDialog.client?.nom}</span>
              </p>
            </div>
            
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                placeholder="Expliquez pourquoi cette suspicion peut être neutralisée..."
                value={justificationText}
                onChange={(e) => setJustificationText(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setJustificationDialog({open: false})}
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleNeutralizeSuspicion(justificationDialog.client)}
                disabled={!justificationText.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Neutraliser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FinanceModern;
