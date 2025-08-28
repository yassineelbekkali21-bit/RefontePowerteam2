import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  DollarSign, TrendingUp, AlertTriangle, Target, Clock, Euro, FileText, BarChart3, 
  Users, Search, Filter, Settings, Eye, EyeOff, RotateCcw, Wallet, PieChart, Calendar,
  CheckCircle, XCircle, AlertCircle, TrendingDown, Edit, Trash2, ChevronRight, Activity,
  Globe, MapPin, Award, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { generateMockClients, generateOverviewStats, type MockClient } from '@/utils/mockDataGenerator';
import { ruleEngine } from '@/utils/ruleEngine';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const FinanceModern = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    typeFacturation: 'tous',
    gestionnaire: 'tous',
    statut: 'tous',
    affichage: 'tous',
    diagnostic: 'tous',
    tri: 'nom'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [viewMode, setViewMode] = useState<'overview' | 'list'>('overview');
  const [justificationDialog, setJustificationDialog] = useState({open: false, client: null});
  const [justificationText, setJustificationText] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [showRealisePartnersSidebar, setShowRealisePartnersSidebar] = useState(false);

  // Données financières spécifiques pour la vue d'ensemble
  const budgetEconomiqueAnnuel = 3200000; // 3.2M€
  const realiseEconomiqueAnnuel = 2450000; // 2.45M€
  const tauxRealisationEconomique = ((realiseEconomiqueAnnuel / budgetEconomiqueAnnuel) * 100).toFixed(1);
  
  const budgetHoraireTotal = 35000; // 35,000 heures
  const budgetHoraireBelgique = 31500; // 90% en Belgique (31,500h)
  const budgetHoraireMaroc = 3500; // 10% au Maroc (3,500h)
  
  const realiseHoraireTotal = 26250; // 26,250 heures réalisées
  const realiseHoraireBelgique = 23625; // 90% en Belgique (23,625h)
  const realiseHoraireMaroc = 2625; // 10% au Maroc (2,625h)
  const tauxRealisationHoraire = ((realiseHoraireTotal / budgetHoraireTotal) * 100).toFixed(1);

  // Données trimestrielles
  const realiseEconomiqueTrimestriel = [
    { trimestre: 'T1 2024', valeur: 680000, budget: 800000, evolution: 12.5 },
    { trimestre: 'T2 2024', valeur: 720000, budget: 800000, evolution: 8.3 },
    { trimestre: 'T3 2024', valeur: 610000, budget: 800000, evolution: -5.2 },
    { trimestre: 'T4 2024', valeur: 440000, budget: 800000, evolution: -15.8 }
  ];

  // Données complètes pour la vue d'ensemble
  const financeOverviewData = {
    encoursDetaille: {
      total: 485000,
      repartition: {
        '0-30j': { montant: 315750, clients: 45, pourcentage: 65 },
        '30-60j': { montant: 135800, clients: 28, pourcentage: 28 },
        '60-90j': { montant: 24250, clients: 8, pourcentage: 5 },
        '+90j': { montant: 9700, clients: 4, pourcentage: 2 }
      }
    }
  };

  // Clients Suspects
  const clientsSuspects = {
    nombre: 8,
    liste: [
      { nom: 'SARL TECH INNOVATION', probleme: 'Retards de paiement récurrents', montant: 85000, gravite: 'high' },
      { nom: 'EURL DIGITAL SERVICES', probleme: 'Facturation insuffisante vs heures', montant: 72000, gravite: 'medium' },
      { nom: 'SAS PREMIUM CONSULTING', probleme: 'Déséquilibre factu/prestation', montant: 68000, gravite: 'medium' },
      { nom: 'SARL MODERN BUSINESS', probleme: 'CA en baisse constante', montant: 45000, gravite: 'high' },
      { nom: 'EURL QUICK SERVICES', probleme: 'Rentabilité < 70€/h', montant: 38000, gravite: 'low' }
    ]
  };

  // Dossiers plus/moins rentables
  const dossiersLesPlusRentables = [
    { nom: 'SARL EXCELLENCE TECH', ca: 85000, marge: 42000, rentabilite: 49.4, evolution: '+15%' },
    { nom: 'SAS INNOVATION PLUS', ca: 72000, marge: 38000, rentabilite: 52.8, evolution: '+22%' },
    { nom: 'EURL PREMIUM SERVICES', ca: 68000, marge: 35000, rentabilite: 51.5, evolution: '+8%' },
    { nom: 'SCI IMMOBILIER GOLD', ca: 55000, marge: 28000, rentabilite: 50.9, evolution: '+12%' },
    { nom: 'SARL DIGITAL POWER', ca: 48000, marge: 24000, rentabilite: 50.0, evolution: '+18%' }
  ];
  
  const dossiersLesMoinsRentables = [
    { nom: 'EURL BASIC TRADE', ca: 25000, marge: 2500, rentabilite: 10.0, evolution: '-8%' },
    { nom: 'SAS STANDARD COM', ca: 32000, marge: 4800, rentabilite: 15.0, evolution: '-5%' },
    { nom: 'SARL SIMPLE BUSINESS', ca: 28000, marge: 4900, rentabilite: 17.5, evolution: '-12%' },
    { nom: 'EURL MINI SERVICES', ca: 18000, marge: 3600, rentabilite: 20.0, evolution: '-3%' },
    { nom: 'SCI PETIT PATRIMOINE', ca: 22000, marge: 4840, rentabilite: 22.0, evolution: '-7%' }
  ];

  // Répartition géographique
  const repartitionGeographique = [
    { pays: 'Belgique', montant: 2016500, pourcentage: 82.4, couleur: '#3B82F6' },
    { pays: 'Maroc', montant: 433500, pourcentage: 17.6, couleur: '#10B981' }
  ];

  // Impact clients entrants/sortants
  const caClientsSortants = {
    anneeEnCours: 165000, // 2024
    anneeProchaine: 285000, // 2025  
    total: 450000
  };
  
  const caClientsEntrants = {
    anneeEnCours: 245000, // 2024
    anneeProchaine: 380000, // 2025
    total: 625000
  };

  // Calculs d'impact
  const impactSortantsAnneeEnCours = ((caClientsSortants.anneeEnCours / realiseEconomiqueAnnuel) * 100).toFixed(1);
  const impactSortantsAnneeProchaine = ((caClientsSortants.anneeProchaine / budgetEconomiqueAnnuel) * 100).toFixed(1);
  const apportEntrantsAnneeEnCours = ((caClientsEntrants.anneeEnCours / realiseEconomiqueAnnuel) * 100).toFixed(1);
  const apportEntrantsAnneeProchaine = ((caClientsEntrants.anneeProchaine / budgetEconomiqueAnnuel) * 100).toFixed(1);

  // Génération optimisée des données - limite à 100 clients pour la performance
  const analysesFinancieres = useMemo(() => generateMockClients(250), []);
  const overviewStats = useMemo(() => generateOverviewStats(analysesFinancieres), [analysesFinancieres]);

  // Analyse des clients avec optimisation
  const clientsAnalyzed = useMemo(() => {
    return analysesFinancieres.map(client => {
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
          actionRecommandee: 'Analyser le planning et rattraper les heures',
          urgence: 'medium' as const // À surveiller
        };
      } else if (ecartFacturationPrestation < -20) {
        displayDiagnostic = {
          type: 'sous_facturation' as const,
          alerte: `📉 Sous-facturation de ${Math.abs(ecartFacturationPrestation).toFixed(1)}%`,
          actionRecommandee: 'Réviser les tarifs ou augmenter la facturation',
          urgence: 'high' as const // Suspects
        };
      } else if (tarifHoraireReel < seuilRentabilite) {
        displayDiagnostic = {
          type: 'rentabilite_faible' as const,
          alerte: `💰 Rentabilité ${tarifHoraireReel.toFixed(0)}€/h < ${seuilRentabilite}€/h`,
          actionRecommandee: 'Optimiser l\'efficacité ou revoir les tarifs',
          urgence: 'high' as const // Suspects
        };
      } else {
        displayDiagnostic = {
          type: 'equilibre' as const,
          alerte: '✅ Équilibre financier satisfaisant',
          actionRecommandee: 'Maintenir la performance actuelle',
          urgence: 'none' as const // Sains
        };
      }

      // Déterminer le statut final basé DIRECTEMENT sur le diagnostic
      let statutFinal;
      if (justification?.status === 'neutralized') {
        statutFinal = 'neutralized';
      } else {
        // Le statut est déterminé par le type de diagnostic
        switch (displayDiagnostic.type) {
          case 'dette_prestation':
            statutFinal = 'attention'; // À surveiller
            break;
          case 'sous_facturation':
          case 'rentabilite_faible':
            statutFinal = 'suspect'; // Suspects
            break;
          case 'equilibre':
            statutFinal = 'sain'; // Sains
            break;
          default:
            // Fallback sur les règles de suspicion existantes
            statutFinal = analysis.isSuspect ? 'suspect' : 'sain';
        }
      }

      return {
        ...client,
        analysis,
        justification,
        diagnostic: displayDiagnostic,
        statut: statutFinal
      };
    });
  }, [analysesFinancieres]);

  // Filtrage optimisé
  const clientsFiltres = useMemo(() => {
    return clientsAnalyzed.filter(client => {
      const matchSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.gestionnaire.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = selectedFilters.typeFacturation === 'tous' || client.typeFacturation === selectedFilters.typeFacturation;
      const matchGest = selectedFilters.gestionnaire === 'tous' || client.gestionnaire === selectedFilters.gestionnaire;
      
      const matchStatut = selectedFilters.statut === 'tous' || 
                         (selectedFilters.statut === 'suspects' && client.statut === 'suspect') ||
                         (selectedFilters.statut === 'attention' && client.statut === 'attention') ||
                         (selectedFilters.statut === 'neutralises' && client.statut === 'neutralized') ||
                         (selectedFilters.statut === 'sains' && client.statut === 'sain');
      
      const matchAffichage = selectedFilters.affichage === 'tous' ||
                            (selectedFilters.affichage === 'suspects_seulement' && client.statut === 'suspect') ||
                            (selectedFilters.affichage === 'non_suspects' && client.statut !== 'suspect');
      
      const matchDiagnostic = selectedFilters.diagnostic === 'tous' || client.diagnostic?.type === selectedFilters.diagnostic;
      
      return matchSearch && matchType && matchGest && matchStatut && matchAffichage && matchDiagnostic;
    });
  }, [clientsAnalyzed, searchTerm, selectedFilters]);

  // Tri et pagination optimisés
  const { clientsPaginated, totalPages } = useMemo(() => {
    const clientsSorted = [...clientsFiltres].sort((a, b) => {
      switch (selectedFilters.tri) {
        case 'nom': return a.nom.localeCompare(b.nom);
        case 'gestionnaire': return a.gestionnaire.localeCompare(b.gestionnaire);
        case 'ca_desc': return b.realiseADate.chiffreAffaires - a.realiseADate.chiffreAffaires;
        case 'ca_asc': return a.realiseADate.chiffreAffaires - b.realiseADate.chiffreAffaires;
        case 'statut': return a.statut.localeCompare(b.statut);
        default: return 0;
      }
    });
    
    const totalPages = Math.ceil(clientsSorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const clientsPaginated = clientsSorted.slice(startIndex, endIndex);
    
    return { clientsPaginated, totalPages };
  }, [clientsFiltres, selectedFilters.tri, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters.typeFacturation, selectedFilters.gestionnaire, selectedFilters.statut, selectedFilters.affichage, selectedFilters.diagnostic]);

  // Fonctions d'interaction
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
    setJustificationDialog({open: false, client: null});
  };

  const handleReactivateSuspicion = (client: any) => {
    ruleEngine.reactivateSuspicion(client.id, client.analysis.ruleTriggered?.id || 'unknown');
  };

  const resetFilters = () => {
    setSelectedFilters({
      typeFacturation: 'tous',
      gestionnaire: 'tous',
      statut: 'tous',
      affichage: 'tous',
      diagnostic: 'tous',
      tri: 'nom'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getDiagnosticIcon = (type: string) => {
    switch (type) {
      case 'dette_prestation': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'sous_facturation': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'rentabilite_faible': return <Euro className="w-4 h-4 text-purple-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Finance"
        description="Gestion financière et analyse de performance"
        icon={DollarSign}
      />

      <div className="w-full max-w-none px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="analysis">Analyse Financière</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">

            {/* Header avec métriques principales */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Vue d'Ensemble Financière</h2>
                <p className="text-blue-100 mb-6">Analyse complète de la performance financière {selectedPeriod}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Encours Total */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <Wallet className="w-8 h-8 text-green-300" />
                      <div>
                        <p className="text-sm text-blue-100">Encours Total</p>
                        <p className="text-2xl font-bold">{(financeOverviewData.encoursDetaille.total / 1000).toFixed(0)}K€</p>
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
                        <p className="text-2xl font-bold text-blue-800">{(budgetHoraireTotal / 1000).toFixed(0)}K h</p>
                        <Badge className="bg-blue-100 text-blue-700">100%</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Belgique</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-800">{(budgetHoraireBelgique / 1000).toFixed(1)}K h</p>
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
                        <p className="text-xl font-bold text-orange-800">{(budgetHoraireMaroc / 1000).toFixed(1)}K h</p>
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
                        <p className="text-2xl font-bold text-green-800">{(realiseHoraireTotal / 1000).toFixed(1)}K h</p>
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
                        <p className="text-xl font-bold text-green-800">{(realiseHoraireBelgique / 1000).toFixed(1)}K h</p>
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
                        <p className="text-xl font-bold text-orange-800">{(realiseHoraireMaroc / 1000).toFixed(1)}K h</p>
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
                  {Object.entries(financeOverviewData.encoursDetaille.repartition).map(([periode, data]) => (
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
                      <p className="text-xs text-gray-500 mt-1">{data.pourcentage}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clients Suspects et Répartition Géographique */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clients Suspects */}
              <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <span>Clients Suspects ({clientsSuspects.nombre})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clientsSuspects.liste.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          client.gravite === 'high' ? 'bg-red-500' :
                          client.gravite === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{client.nom}</p>
                          <p className="text-sm text-gray-600">{client.probleme}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{(client.montant / 1000).toFixed(0)}K€</p>
                        <Badge 
                          className={`${
                            client.gravite === 'high' ? 'bg-red-100 text-red-700' :
                            client.gravite === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {client.gravite === 'high' ? 'Urgent' : 
                           client.gravite === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-orange-200">
                    <Button 
                      variant="outline" 
                      className="w-full text-orange-700 border-orange-300 hover:bg-orange-50"
                      onClick={() => setActiveTab('analysis')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'analyse financière complète
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Répartition géographique */}
              <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-teal-800">
                    <PieChart className="w-6 h-6" />
                    <span>Répartition Géographique</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {repartitionGeographique.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: region.couleur }}
                          ></div>
                          <span className="font-medium text-gray-700">{region.pays}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{(region.montant / 1000000).toFixed(2)}M€</p>
                          <p className="text-sm text-gray-600">{region.pourcentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex space-x-2">
                      {repartitionGeographique.map((region, index) => (
                        <div 
                          key={index}
                          className="h-3 rounded-full first:rounded-l-full last:rounded-r-full"
                          style={{ 
                            backgroundColor: region.couleur,
                            width: `${region.pourcentage}%`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dossiers les plus/moins rentables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dossiers les plus rentables */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Award className="w-6 h-6" />
                    <span>Dossiers les Plus Rentables</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dossiersLesPlusRentables.map((dossier, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-green-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{dossier.nom}</p>
                            <p className="text-sm text-gray-500">CA: {(dossier.ca / 1000).toFixed(0)}K€ • Marge: {(dossier.marge / 1000).toFixed(0)}K€</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700">{dossier.rentabilite}%</Badge>
                            <Badge variant="outline" className="border-green-300 text-green-700">
                              {dossier.evolution}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dossiers les moins rentables */}
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <TrendingDown className="w-6 h-6" />
                    <span>Dossiers les Moins Rentables</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dossiersLesMoinsRentables.map((dossier, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-red-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{dossier.nom}</p>
                            <p className="text-sm text-gray-500">CA: {(dossier.ca / 1000).toFixed(0)}K€ • Marge: {(dossier.marge / 1000).toFixed(0)}K€</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-red-100 text-red-700">{dossier.rentabilite}%</Badge>
                            <Badge variant="outline" className="border-red-300 text-red-700">
                              {dossier.evolution}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Impact Clients Entrants/Sortants sur 2 ans */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <ArrowDownCircle className="w-6 h-6" />
                    <span>Impact Clients Sortants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Impact année en cours */}
                  <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Année en cours (2024)</p>
                        <p className="text-3xl font-bold text-orange-800">{(caClientsSortants.anneeEnCours / 1000).toFixed(0)}K€</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">{impactSortantsAnneeEnCours}% du CA</Badge>
                    </div>
                    <Progress value={parseFloat(impactSortantsAnneeEnCours)} className="h-2" />
                  </div>

                  {/* Impact année prochaine */}
                  <div className="p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-red-700">Année prochaine (2025)</p>
                        <p className="text-3xl font-bold text-red-800">{(caClientsSortants.anneeProchaine / 1000).toFixed(0)}K€</p>
                      </div>
                      <Badge className="bg-red-100 text-red-700">{impactSortantsAnneeProchaine}% du budget</Badge>
                    </div>
                    <Progress value={parseFloat(impactSortantsAnneeProchaine)} className="h-2" />
                  </div>

                  {/* Total impact */}
                  <div className="pt-4 border-t border-orange-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Impact total sur 2 ans</span>
                      <span className="font-bold text-orange-600">{(caClientsSortants.total / 1000).toFixed(0)}K€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <ArrowUpCircle className="w-6 h-6" />
                    <span>Apport Clients Entrants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Apport année en cours */}
                  <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-green-700">Année en cours (2024)</p>
                        <p className="text-3xl font-bold text-green-800">{(caClientsEntrants.anneeEnCours / 1000).toFixed(0)}K€</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{apportEntrantsAnneeEnCours}% du CA</Badge>
                    </div>
                    <Progress value={parseFloat(apportEntrantsAnneeEnCours)} className="h-2" />
                  </div>

                  {/* Apport année prochaine */}
                  <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-emerald-700">Année prochaine (2025)</p>
                        <p className="text-3xl font-bold text-emerald-800">{(caClientsEntrants.anneeProchaine / 1000).toFixed(0)}K€</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">{apportEntrantsAnneeProchaine}% du budget</Badge>
                    </div>
                    <Progress value={parseFloat(apportEntrantsAnneeProchaine)} className="h-2" />
                  </div>

                  {/* Total apport */}
                  <div className="pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">Apport total sur 2 ans</span>
                      <span className="font-bold text-green-600">{(caClientsEntrants.total / 1000).toFixed(0)}K€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Analyse Financière Intelligente */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <div className="w-full px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Intelligence Financière
                    </h1>
                    <p className="text-gray-600 mt-1">Diagnostic instantané • Actions recommandées • Performance temps réel</p>
                  </div>
                </div>

                {/* Filtres modernisés */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
                  {/* Ligne 1: Filtres de Statut avec Explications et Diagnostics */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Section Gauche: Filtres Statut + Diagnostics */}
                    <div className="flex flex-col space-y-4">
                      {/* Filtres Statut avec explications claires */}
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant={selectedFilters.statut === 'suspects' ? 'default' : 'outline'}
                          size="sm"
                          className={`${selectedFilters.statut === 'suspects' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50'} transition-all duration-200`}
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev, 
                            statut: prev.statut === 'suspects' ? 'tous' : 'suspects',
                            diagnostic: 'tous' // Réinitialiser le filtre diagnostic
                          }))}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspects
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {overviewStats.counts.suspects}
                          </span>
                        </Button>
                        <Button 
                          variant={selectedFilters.statut === 'attention' ? 'default' : 'outline'}
                          size="sm"
                          className={`${selectedFilters.statut === 'attention' ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-orange-50'} transition-all duration-200`}
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev, 
                            statut: prev.statut === 'attention' ? 'tous' : 'attention',
                            diagnostic: 'tous'
                          }))}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          À surveiller
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {clientsAnalyzed.filter(c => c.statut === 'attention' && !c.justification).length}
                          </span>
                        </Button>
                        <Button 
                          variant={selectedFilters.statut === 'neutralises' ? 'default' : 'outline'}
                          size="sm"
                          className={`${selectedFilters.statut === 'neutralises' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-yellow-50'} transition-all duration-200`}
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev, 
                            statut: prev.statut === 'neutralises' ? 'tous' : 'neutralises',
                            diagnostic: 'tous'
                          }))}
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Neutralisés
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {clientsFiltres.filter(c => c.justification?.status === 'neutralized').length}
                          </span>
                        </Button>
                        <Button 
                          variant={selectedFilters.statut === 'sains' ? 'default' : 'outline'}
                          size="sm"
                          className={`${selectedFilters.statut === 'sains' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50'} transition-all duration-200`}
                          onClick={() => setSelectedFilters(prev => ({
                            ...prev, 
                            statut: prev.statut === 'sains' ? 'tous' : 'sains',
                            diagnostic: 'tous'
                          }))}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Sains
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            {clientsAnalyzed.filter(c => c.statut === 'sain').length}
                          </span>
                        </Button>
                      </div>
                      
                      {/* Compteur total */}
                      <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-white/20">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700">Total filtré:</span>
                          <span className="font-bold text-blue-600">{clientsFiltres.length}</span>
                          <span className="text-xs text-gray-500">/ {clientsAnalyzed.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Filtres Diagnostics - Toujours visibles */}
                    <div className="ml-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Diagnostics contextuels:</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: 'dette_prestation', label: 'Dette prestation', icon: AlertCircle, color: 'orange', statut: 'attention' },
                            { key: 'sous_facturation', label: 'Sous-facturation', icon: TrendingDown, color: 'red', statut: 'suspect' },
                            { key: 'rentabilite_faible', label: 'Rentabilité faible', icon: Euro, color: 'red', statut: 'suspect' },
                            { key: 'equilibre', label: 'Équilibre', icon: CheckCircle, color: 'green', statut: 'sain' }
                          ].filter((diagnostic) => {
                            // Filtrer les diagnostics selon le statut sélectionné
                            if (selectedFilters.statut === 'tous') return true;
                            if (selectedFilters.statut === 'suspects') return diagnostic.statut === 'suspect';
                            if (selectedFilters.statut === 'attention') return diagnostic.statut === 'attention';
                            if (selectedFilters.statut === 'sains') return diagnostic.statut === 'sain';
                            if (selectedFilters.statut === 'neutralises') return true; // Tous diagnostics possibles pour neutralisés
                            return true;
                          }).map((diagnostic) => {
                            const count = clientsAnalyzed.filter(c => c.diagnostic?.type === diagnostic.key).length;
                            const Icon = diagnostic.icon;
                            return (
                              <Button
                                key={diagnostic.key}
                                variant={selectedFilters.diagnostic === diagnostic.key ? 'default' : 'outline'}
                                size="sm"
                                className={`h-8 text-xs ${selectedFilters.diagnostic === diagnostic.key ? `bg-${diagnostic.color}-500` : `hover:bg-${diagnostic.color}-50`}`}
                                onClick={() => setSelectedFilters(prev => ({
                                  ...prev,
                                  diagnostic: prev.diagnostic === diagnostic.key ? 'tous' : diagnostic.key
                                }))}
                              >
                                <Icon className="w-3 h-3 mr-1.5" />
                                {diagnostic.label}
                                <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                                  {count}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                    </div>

                    {/* Actions Principales */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'overview' ? 'list' : 'overview')}
                        className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-lg transition-all duration-200"
                      >
                        {viewMode === 'overview' ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                        Vue {viewMode === 'overview' ? 'Liste' : 'Aperçu'}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-lg">
                            <Settings className="w-4 h-4 mr-2" />
                            Règles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Configuration des Règles d'Analyse</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4">
                            {ruleEngine.getRules().map((rule) => (
                              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">{rule.nom}</h4>
                                  <p className="text-sm text-gray-600">{rule.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">Condition: {rule.condition}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={rule.gravite === 'high' ? 'destructive' : rule.gravite === 'medium' ? 'default' : 'secondary'}>
                                    {rule.gravite}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => ruleEngine.toggleRule(rule.id)}
                                    className={rule.enabled ? 'text-green-600' : 'text-gray-400'}
                                  >
                                    {rule.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={resetFilters}
                        className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-lg transition-all duration-200"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Filtres
                      </Button>
                    </div>
                  </div>

                  {/* Ligne 2: Filtres Secondaires - Layout aéré */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <Select value={selectedFilters.typeFacturation} onValueChange={(value) => setSelectedFilters(prev => ({...prev, typeFacturation: value}))}>
                      <SelectTrigger className="bg-white/60 border-white/30 focus:border-blue-300">
                        <SelectValue placeholder="Type facturation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les types</SelectItem>
                        <SelectItem value="Forfait Mensuel">Forfait Mensuel</SelectItem>
                        <SelectItem value="Forfait Annuel">Forfait Annuel</SelectItem>
                        <SelectItem value="Mission Ponctuelle">Mission Ponctuelle</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedFilters.gestionnaire} onValueChange={(value) => setSelectedFilters(prev => ({...prev, gestionnaire: value}))}>
                      <SelectTrigger className="bg-white/60 border-white/30 focus:border-blue-300">
                        <SelectValue placeholder="Gestionnaire" />
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

                    <Select value={selectedFilters.tri} onValueChange={(value) => setSelectedFilters(prev => ({...prev, tri: value}))}>
                      <SelectTrigger className="bg-white/60 border-white/30 focus:border-blue-300">
                        <SelectValue placeholder="Tri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nom">Nom (A-Z)</SelectItem>
                        <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                        <SelectItem value="ca_desc">CA (DESC)</SelectItem>
                        <SelectItem value="ca_asc">CA (ASC)</SelectItem>
                        <SelectItem value="statut">Statut</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/60 border-white/30 focus:border-blue-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Grille des clients avec design Web 3.0 moderne */}
                <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {clientsPaginated.map((client, index) => {
                    // Définir les couleurs et styles selon le statut
                    const getStatusConfig = (statut: string) => {
                      switch (statut) {
                        case 'suspect':
                          return {
                            gradient: 'from-red-500/20 via-pink-500/10 to-red-400/20',
                            border: 'border-red-200/50',
                            glow: 'shadow-red-500/20',
                            label: 'Suspect',
                            labelColor: 'bg-red-100 text-red-700 border-red-200',
                            accentColor: 'red'
                          };
                        case 'attention':
                          return {
                            gradient: 'from-orange-500/20 via-amber-500/10 to-orange-400/20',
                            border: 'border-orange-200/50',
                            glow: 'shadow-orange-500/20',
                            label: 'À surveiller',
                            labelColor: 'bg-orange-100 text-orange-700 border-orange-200',
                            accentColor: 'orange'
                          };
                        case 'neutralized':
                          return {
                            gradient: 'from-yellow-500/20 via-amber-500/10 to-yellow-400/20',
                            border: 'border-yellow-200/50',
                            glow: 'shadow-yellow-500/20',
                            label: 'Neutralisé',
                            labelColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                            accentColor: 'yellow'
                          };
                        default: // 'sain'
                          return {
                            gradient: 'from-emerald-500/20 via-green-500/10 to-emerald-400/20',
                            border: 'border-emerald-200/50',
                            glow: 'shadow-emerald-500/20',
                            label: 'Sain',
                            labelColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                            accentColor: 'emerald'
                          };
                      }
                    };

                    const statusConfig = getStatusConfig(client.statut);

                    return (
                      <Card
                        key={client.id}
                        className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${statusConfig.gradient} border ${statusConfig.border} shadow-lg hover:shadow-xl ${statusConfig.glow} hover:scale-[1.02] transition-all duration-700 cursor-pointer min-h-[480px] w-full hover:border-white/30`}
                        onClick={() => {
                          setSelectedClient(client.id);
                          setShowClientDetail(true);
                        }}
                      >
                        {/* Accent bar top avec animation */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${statusConfig.accentColor}-400 to-${statusConfig.accentColor}-600 opacity-80`} />
                        
                        {/* Élément décoratif Web 3.0 */}
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all duration-500" />
                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-lg group-hover:bg-white/10 transition-all duration-500" />
                        
                        <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                          {/* Header avec nom et statut */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-gray-900 mb-1 truncate group-hover:text-gray-800 transition-colors">
                                {client.nom}
                              </h3>
                              <p className="text-sm font-medium text-gray-600">{client.gestionnaire}</p>
                            </div>
                            <Badge variant="outline" className={`${statusConfig.labelColor} font-medium px-3 py-1 text-xs rounded-full`}>
                              {statusConfig.label}
                            </Badge>
                          </div>

                          {/* Diagnostic central avec design futuriste */}
                          <div className={`relative p-4 rounded-2xl mb-4 text-center min-h-[120px] flex flex-col justify-center backdrop-blur-sm bg-white/40 border border-white/30 group-hover:bg-white/50 transition-all duration-500`}>
                            {/* Élément décoratif */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                            
                            <div className="relative z-10">
                              <div className="flex items-center justify-center mb-2">
                                <div className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm`}>
                                  {getDiagnosticIcon(client.diagnostic?.type || 'equilibre')}
                                </div>
                              </div>
                              <div className={`font-semibold text-sm mb-1 text-gray-800`}>
                                {client.diagnostic?.type === 'dette_prestation' ? 'Dette Prestation' :
                                 client.diagnostic?.type === 'sous_facturation' ? 'Sous-Facturation' :
                                 client.diagnostic?.type === 'rentabilite_faible' ? 'Rentabilité Faible' :
                                 'Équilibre Sain'}
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed px-1">
                                {client.diagnostic?.alerte || '✅ Équilibre financier satisfaisant'}
                              </p>
                            </div>
                          </div>

                          {/* Métriques avec design glassmorphism */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-300">
                              <div className="text-lg font-bold text-blue-900 mb-1">
                                {client.realiseADate.pourcentageCA.toFixed(0)}%
                              </div>
                              <div className="text-xs font-medium text-blue-700">CA Réalisé</div>
                            </div>
                            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-300">
                              <div className="text-lg font-bold text-green-900 mb-1">
                                {(client.realiseADate.heures > 0 ? client.realiseADate.chiffreAffaires / client.realiseADate.heures : 0).toFixed(0)}€/h
                              </div>
                              <div className="text-xs font-medium text-green-700">Rentabilité</div>
                            </div>
                            <div className="text-center p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/40 transition-all duration-300">
                              <div className="text-lg font-bold text-purple-900 mb-1">
                                {(client.realiseADate.chiffreAffaires / 1000).toFixed(0)}K€
                              </div>
                              <div className="text-xs font-medium text-purple-700">CA</div>
                            </div>
                          </div>

                          {/* Footer avec actions */}
                          <div className="pt-3 border-t border-white/20">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-gray-600 bg-white/30 px-2 py-1 rounded-full">
                                {client.typeFacturation}
                              </span>
                              <div className="flex space-x-1">
                                {client.justification?.status === 'neutralized' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2 bg-white/40 hover:bg-white/60 border-white/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReactivateSuspicion(client);
                                    }}
                                  >
                                    Réactiver
                                  </Button>
                                ) : client.statut === 'suspect' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7 px-2 bg-white/40 hover:bg-white/60 border-white/30"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setJustificationDialog({open: true, client});
                                    }}
                                  >
                                    Neutraliser
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Indicateur interactif */}
                            <div className="flex items-center justify-center">
                              <div className="flex items-center space-x-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                                <span className="text-xs font-medium">Analyser en détail</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            {/* Budgets complets restaurés */}
            <div className="space-y-6">
              {/* En-tête des budgets */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestion des Budgets</h2>
                  <p className="text-gray-600">Suivi et analyse des budgets clients</p>
                </div>
                <div className="flex space-x-3">
                  <Select defaultValue="2024">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* KPIs Budgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Target className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Budget Total</p>
                        <p className="text-2xl font-bold">2.4M€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Réalisé</p>
                        <p className="text-2xl font-bold">1.8M€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">En cours</p>
                        <p className="text-2xl font-bold">450K€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">À risque</p>
                        <p className="text-2xl font-bold">150K€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Liste des budgets clients */}
              <Card>
                <CardHeader>
                  <CardTitle>Budgets par Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysesFinancieres.slice(0, 10).map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium">{client.nom}</h4>
                          <p className="text-sm text-gray-600">{client.gestionnaire}</p>
                        </div>
                        <div className="text-right mr-6">
                          <p className="font-medium">{client.objectifAnnuel.economique.toLocaleString()}€</p>
                          <p className="text-sm text-gray-600">Budget annuel</p>
                        </div>
                        <div className="text-right mr-6">
                          <p className="font-medium text-green-600">{client.realiseADate.chiffreAffaires.toLocaleString()}€</p>
                          <p className="text-sm text-gray-600">Réalisé</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{client.realiseADate.pourcentageCA.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Avancement</p>
                        </div>
                        <div className="ml-4">
                          <Badge variant={
                            client.realiseADate.pourcentageCA >= 90 ? 'default' :
                            client.realiseADate.pourcentageCA >= 70 ? 'secondary' : 'destructive'
                          }>
                            {client.realiseADate.pourcentageCA >= 90 ? 'Excellent' :
                             client.realiseADate.pourcentageCA >= 70 ? 'Bon' : 'À risque'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de justification */}
      <Dialog open={justificationDialog.open} onOpenChange={(open) => setJustificationDialog({...justificationDialog, open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier la neutralisation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Expliquez pourquoi ce client ne doit pas être considéré comme suspect..."
              value={justificationText}
              onChange={(e) => setJustificationText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setJustificationDialog({open: false, client: null})}>
                Annuler
              </Button>
              <Button onClick={() => handleNeutralizeSuspicion(justificationDialog.client)}>
                Neutraliser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sidebar pour les partenaires */}
      <Sheet open={showRealisePartnersSidebar} onOpenChange={setShowRealisePartnersSidebar}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Réalisé Économique par Partenaire</span>
            </SheetTitle>
            <SheetDescription>
              Détail des performances économiques individuelles pour {selectedPeriod}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Résumé global */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Réalisé</p>
                  <p className="text-2xl font-bold text-blue-800">{(realiseEconomiqueAnnuel / 1000000).toFixed(2)}M€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Objectif</p>
                  <p className="text-xl font-bold text-purple-800">{(budgetEconomiqueAnnuel / 1000000).toFixed(2)}M€</p>
                </div>
              </div>
              <Progress value={parseFloat(tauxRealisationEconomique)} className="h-3 mt-3" />
              <p className="text-xs text-center text-gray-600 mt-2">{tauxRealisationEconomique}% de l'objectif atteint</p>
            </div>

            {/* Détail par partenaire */}
            <div className="space-y-4">
              {[
                { nom: 'Mohamed', realise: 480000, objectif: 640000, evolution: 8.5 },
                { nom: 'Julien', realise: 410000, objectif: 480000, evolution: 12.3 },
                { nom: 'Vincent', realise: 395000, objectif: 450000, evolution: -2.1 },
                { nom: 'Pol', realise: 320000, objectif: 380000, evolution: 15.2 },
                { nom: 'Ingrid', realise: 485000, objectif: 550000, evolution: 6.8 },
                { nom: 'Pierre', realise: 360000, objectif: 400000, evolution: -1.5 }
              ].map((partner, index) => {
                const tauxRealisation = ((partner.realise / partner.objectif) * 100).toFixed(1);
                const isGoodPerformance = parseFloat(tauxRealisation) >= 85;
                const isPositiveEvolution = partner.evolution > 0;
                
                return (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{partner.nom}</h4>
                          <p className="text-sm text-gray-600">Partenaire Senior</p>
                        </div>
                        <Badge className={isGoodPerformance ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                          {tauxRealisation}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Réalisé:</span>
                          <span className="font-medium">{(partner.realise / 1000).toFixed(0)}K€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Objectif:</span>
                          <span className="font-medium">{(partner.objectif / 1000).toFixed(0)}K€</span>
                        </div>
                        <Progress value={parseFloat(tauxRealisation)} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Évolution vs N-1:</span>
                          <span className={`text-xs font-medium ${isPositiveEvolution ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositiveEvolution ? '+' : ''}{partner.evolution}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Exporter Détail
                </Button>
                <Button className="flex-1">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyse Mensuelle
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Écran détaillé d'analyse client */}
      <Dialog open={showClientDetail} onOpenChange={setShowClientDetail}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-hidden p-0">
          {selectedClient && (() => {
            const client = clientsAnalyzed.find(c => c.id === selectedClient);
            if (!client) return null;

            const diagnosticDetails = {
              'dette_prestation': {
                title: 'Analyse: Dette de Prestation Détectée',
                icon: AlertCircle,
                color: 'orange',
                background: 'from-orange-50 to-red-50',
                border: 'border-orange-200',
                description: 'Le client a été facturé mais les prestations correspondantes n\'ont pas été entièrement réalisées.',
                recommendations: [
                  'Vérifier le planning et rattraper les heures manquantes',
                  'Contacter le client pour planifier les prestations restantes',
                  'Ajuster la facturation si nécessaire',
                  'Mettre en place un suivi renforcé'
                ],
                risks: [
                  'Insatisfaction client due à des prestations non réalisées',
                  'Risque de litige ou de demande de remboursement',
                  'Impact sur la relation commerciale',
                  'Problème de trésorerie à terme'
                ]
              },
              'sous_facturation': {
                title: 'Analyse: Sous-Facturation Identifiée',
                icon: TrendingDown,
                color: 'red',
                background: 'from-red-50 to-pink-50',
                border: 'border-red-200',
                description: 'Les heures prestées dépassent significativement la facturation émise (Facturation insuffisante).',
                recommendations: [
                  'Émettre une facturation complémentaire immédiatement',
                  'Réviser les tarifs appliqués',
                  'Améliorer le suivi temps/facturation',
                  'Former l\'équipe sur le tracking des heures'
                ],
                risks: [
                  'Perte de marge directe',
                  'Déséquilibre financier du dossier',
                  'Impact sur la rentabilité globale',
                  'Mauvaise valorisation du temps'
                ]
              },
              'rentabilite_faible': {
                title: 'Analyse: Rentabilité Inférieure aux Standards',
                icon: Euro,
                color: 'purple',
                background: 'from-purple-50 to-violet-50',
                border: 'border-purple-200',
                description: 'Le taux horaire effectif est en dessous du seuil de rentabilité fixé.',
                recommendations: [
                  'Réviser la structure tarifaire',
                  'Optimiser l\'efficacité opérationnelle',
                  'Négocier de nouveaux tarifs avec le client',
                  'Évaluer la complexité réelle du dossier'
                ],
                risks: [
                  'Rentabilité insuffisante du cabinet',
                  'Difficultés à couvrir les coûts',
                  'Impact sur la viabilité long terme',
                  'Déséquilibre du portefeuille client'
                ]
              },
              'equilibre': {
                title: 'Analyse: Équilibre Financier Optimal',
                icon: CheckCircle,
                color: 'green',
                background: 'from-green-50 to-emerald-50',
                border: 'border-green-200',
                description: 'Le client présente un bon équilibre entre facturation et prestations.',
                recommendations: [
                  'Maintenir la qualité de service actuelle',
                  'Identifier les bonnes pratiques à répliquer',
                  'Evaluer les opportunités d\'expansion',
                  'Utiliser comme référence pour d\'autres clients'
                ],
                risks: []
              }
            };

            const currentDiagnostic = diagnosticDetails[client.diagnostic?.type || 'equilibre'];
            const Icon = currentDiagnostic.icon;

            return (
              <div className="h-full flex flex-col">
                {/* Header fixe */}
                <div className={`bg-gradient-to-r ${currentDiagnostic.background} p-6 border-b ${currentDiagnostic.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-white rounded-2xl shadow-lg border-2 ${currentDiagnostic.border}`}>
                        <Icon className={`w-8 h-8 text-${currentDiagnostic.color}-600`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{client.nom}</h2>
                        <p className="text-lg text-gray-700">{currentDiagnostic.title}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className={`border-${currentDiagnostic.color}-300 text-${currentDiagnostic.color}-700 bg-${currentDiagnostic.color}-50`}>
                            {client.gestionnaire}
                          </Badge>
                          <Badge variant="outline" className={`border-${currentDiagnostic.color}-300 text-${currentDiagnostic.color}-700 bg-${currentDiagnostic.color}-50`}>
                            {client.typeFacturation}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowClientDetail(false)}
                      className="bg-white/80 hover:bg-white"
                    >
                      ✕ Fermer
                    </Button>
                  </div>
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Métriques principales */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {(client.realiseADate.chiffreAffaires / 1000).toFixed(0)}K€
                        </div>
                        <div className="text-sm font-medium text-gray-700">Chiffre d'Affaires</div>
                        <div className="text-xs text-gray-500 mt-1">Réalisé à date</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {client.realiseADate.heures}h
                        </div>
                        <div className="text-sm font-medium text-gray-700">Heures Prestées</div>
                        <div className="text-xs text-gray-500 mt-1">Total cumulé</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {(client.realiseADate.heures > 0 ? client.realiseADate.chiffreAffaires / client.realiseADate.heures : 0).toFixed(0)}€/h
                        </div>
                        <div className="text-sm font-medium text-gray-700">Taux Horaire</div>
                        <div className="text-xs text-gray-500 mt-1">Effectif moyen</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {client.realiseADate.pourcentageCA.toFixed(1)}%
                        </div>
                        <div className="text-sm font-medium text-gray-700">Avancement Budget</div>
                        <div className="text-xs text-gray-500 mt-1">vs objectif annuel</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description du diagnostic */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 text-${currentDiagnostic.color}-600`} />
                        <span>Diagnostic Détaillé</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{currentDiagnostic.description}</p>
                      
                      {client.diagnostic?.alerte && (
                        <div className={`mt-4 p-4 bg-${currentDiagnostic.color}-50 border-l-4 border-${currentDiagnostic.color}-400 rounded-r-lg`}>
                          <p className={`text-${currentDiagnostic.color}-800 font-medium`}>
                            🔍 {client.diagnostic.alerte}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Analyse comparative */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Évolution Temporelle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">CA Facturation:</span>
                            <span className="font-medium">{client.realiseADate.pourcentageCA.toFixed(1)}%</span>
                          </div>
                          <Progress value={client.realiseADate.pourcentageCA} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Heures Prestées:</span>
                            <span className="font-medium">{client.realiseADate.pourcentageHeures.toFixed(1)}%</span>
                          </div>
                          <Progress value={client.realiseADate.pourcentageHeures} className="h-2" />

                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Écart Factu/Prestation:</span>
                              <span className={`font-bold ${
                                (client.realiseADate.pourcentageCA - client.realiseADate.pourcentageHeures) > 15 ? 'text-orange-600' :
                                (client.realiseADate.pourcentageCA - client.realiseADate.pourcentageHeures) < -15 ? 'text-red-600' :
                                'text-green-600'
                              }`}>
                                {(client.realiseADate.pourcentageCA - client.realiseADate.pourcentageHeures).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Objectifs vs Réalisations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Objectif Économique:</span>
                              <span className="font-medium">{(client.objectifAnnuel.economique / 1000).toFixed(0)}K€</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Réalisé:</span>
                              <span className="font-medium">{(client.realiseADate.chiffreAffaires / 1000).toFixed(0)}K€</span>
                            </div>
                            <Progress value={client.realiseADate.pourcentageCA} className="h-2" />
                          </div>
                          
                          <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Objectif Horaire:</span>
                              <span className="font-medium">{client.objectifAnnuel.heures}h</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Réalisé:</span>
                              <span className="font-medium">{client.realiseADate.heures}h</span>
                            </div>
                            <Progress value={client.realiseADate.pourcentageHeures} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommandations et risques */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          <span>Actions Recommandées</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentDiagnostic.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                              </div>
                              <p className="text-sm text-gray-700">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {currentDiagnostic.risks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span>Risques Identifiés</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {currentDiagnostic.risks.map((risk, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-sm text-gray-700">{risk}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Actions rapides */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {client.justification?.status === 'neutralized' ? (
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => {
                              handleReactivateSuspicion(client);
                              setShowClientDetail(false);
                            }}
                          >
                            <RotateCcw className="w-6 h-6 text-orange-600" />
                            <span className="text-sm font-medium">Réactiver Surveillance</span>
                            <span className="text-xs text-gray-500">Remettre en surveillance active</span>
                          </Button>
                        ) : client.statut === 'suspect' && (
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => {
                              setJustificationDialog({open: true, client});
                              setShowClientDetail(false);
                            }}
                          >
                            <EyeOff className="w-6 h-6 text-yellow-600" />
                            <span className="text-sm font-medium">Neutraliser Suspicion</span>
                            <span className="text-xs text-gray-500">Justifier la situation</span>
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center space-y-2"
                        >
                          <FileText className="w-6 h-6 text-blue-600" />
                          <span className="text-sm font-medium">Générer Rapport</span>
                          <span className="text-xs text-gray-500">Export PDF détaillé</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center space-y-2"
                        >
                          <Calendar className="w-6 h-6 text-green-600" />
                          <span className="text-sm font-medium">Planifier Suivi</span>
                          <span className="text-xs text-gray-500">Programmer une révision</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historique des règles (si disponible) */}
                  {client.analysis.ruleTriggered && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Détail de la Règle Déclenchée</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">{client.analysis.ruleTriggered.nom}</h4>
                          <p className="text-sm text-gray-700 mb-3">{client.analysis.ruleTriggered.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Condition: {client.analysis.ruleTriggered.condition}</span>
                            <Badge variant={
                              client.analysis.ruleTriggered.gravite === 'high' ? 'destructive' :
                              client.analysis.ruleTriggered.gravite === 'medium' ? 'default' : 'secondary'
                            }>
                              {client.analysis.ruleTriggered.gravite}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FinanceModern;
