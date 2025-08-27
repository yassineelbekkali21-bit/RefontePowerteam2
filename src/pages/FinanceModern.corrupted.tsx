import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, AlertTriangle, Target, Clock, Euro, FileText, BarChart3, 
  Eye, Users, Zap, CheckCircle, XCircle, Filter, Calendar, Globe, MapPin, 
  TrendingDown, Award, Star, Activity, ArrowUpCircle, ArrowDownCircle,
  Building, CreditCard, Wallet, PieChart, LineChart, Search, Settings,
  AlertCircle, ThumbsUp, ThumbsDown, Edit, RefreshCw, Mail,
  Phone, MessageSquare, Calculator, Percent, ChevronRight, ChevronDown,
  Shield, ShieldCheck, ShieldX, History, Wrench, Grid3X3, List,
  ChevronLeft, MoreHorizontal, X, Download,
  Plus
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

const GRADIENT_COLORS = [
  '#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6', '#F39C12', '#14B8A6', '#6366F1'
];

// Données financières complètes
const financeOverviewData = {
  // Métriques principales
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
  encours: 285000,
  
  // Budgets horaires annuels
  budgetHoraireTotal: 1850000,
  budgetHoraireMaroc: 320000,
  budgetHoraireBelgique: 1530000,
  budgetEconomiqueAnnuel: 2200000,
  
  // Réalisés horaires annuels  
  realiseHoraireTotal: 1650000,
  realiseHoraireMaroc: 290000,
  realiseHoraireBelgique: 1360000,
  realiseEconomiqueAnnuel: 1980000,
  
  // CA clients avec impact temporel
  caClientsSortants: {
    anneeEnCours: 180000,
    anneeProchaine: 220000, // Impact complet sur l'année suivante
    total: 400000
  },
  caClientsEntrants: {
    anneeEnCours: 420000,
    anneeProchaine: 580000, // Montée en puissance
    total: 1000000
  },
  
  // Réalisé économique par trimestre
  realiseEconomiqueTrimestriel: [
    { trimestre: 'Q1 2024', valeur: 510000, budget: 550000, evolution: 8.2 },
    { trimestre: 'Q2 2024', valeur: 495000, budget: 550000, evolution: -2.9 },
    { trimestre: 'Q3 2024', valeur: 520000, budget: 550000, evolution: 5.1 },
    { trimestre: 'Q4 2024', valeur: 455000, budget: 550000, evolution: -12.5 }
  ],
  
  // Dossiers les plus/moins rentables
  dossiersLesPlusRentables: [
    { nom: 'SARL EXCELLENCE TECH', ca: 85000, marge: 42000, rentabilite: 49.4, evolution: '+15%' },
    { nom: 'SAS INNOVATION PLUS', ca: 72000, marge: 38000, rentabilite: 52.8, evolution: '+22%' },
    { nom: 'EURL PREMIUM SERVICES', ca: 68000, marge: 35000, rentabilite: 51.5, evolution: '+8%' },
    { nom: 'SCI IMMOBILIER GOLD', ca: 55000, marge: 28000, rentabilite: 50.9, evolution: '+12%' },
    { nom: 'SARL DIGITAL POWER', ca: 48000, marge: 24000, rentabilite: 50.0, evolution: '+18%' }
  ],
  
  dossiersLesMoinsRentables: [
    { nom: 'EURL BASIC TRADE', ca: 25000, marge: 2500, rentabilite: 10.0, evolution: '-8%' },
    { nom: 'SAS STANDARD COM', ca: 32000, marge: 4800, rentabilite: 15.0, evolution: '-5%' },
    { nom: 'SARL SIMPLE BUSINESS', ca: 28000, marge: 4900, rentabilite: 17.5, evolution: '-12%' },
    { nom: 'EURL MINI SERVICES', ca: 18000, marge: 3600, rentabilite: 20.0, evolution: '-3%' },
    { nom: 'SCI PETIT PATRIMOINE', ca: 22000, marge: 4840, rentabilite: 22.0, evolution: '-7%' }
  ],
  
  // Répartition géographique des revenus
  repartitionGeographique: [
    { pays: 'Belgique', montant: 1360000, pourcentage: 82.4, couleur: COLORS.primary },
    { pays: 'Maroc', montant: 290000, pourcentage: 17.6, couleur: COLORS.success }
  ],
  
  // Evolution mensuelle du CA
  evolutionMensuelleCA: [
    { mois: 'Jan', budget: 183000, realise: 175000, ecart: -8000 },
    { mois: 'Fév', budget: 183000, realise: 188000, ecart: 5000 },
    { mois: 'Mar', budget: 183000, realise: 192000, ecart: 9000 },
    { mois: 'Avr', budget: 183000, realise: 178000, ecart: -5000 },
    { mois: 'Mai', budget: 183000, realise: 185000, ecart: 2000 },
    { mois: 'Jun', budget: 183000, realise: 190000, ecart: 7000 },
    { mois: 'Jul', budget: 183000, realise: 182000, ecart: -1000 },
    { mois: 'Aoû', budget: 183000, realise: 195000, ecart: 12000 },
    { mois: 'Sep', budget: 183000, realise: 187000, ecart: 4000 },
    { mois: 'Oct', budget: 183000, realise: 179000, ecart: -4000 },
    { mois: 'Nov', budget: 183000, realise: 186000, ecart: 3000 },
    { mois: 'Déc', budget: 183000, realise: 193000, ecart: 10000 }
  ],

  // Nouvelles données pour les améliorations
  encoursDetaille: {
    total: 425000,
    repartition: {
      '0-30j': { montant: 125000, pourcentage: 29.4, clients: 45 },
      '30-60j': { montant: 95000, pourcentage: 22.4, clients: 32 },
      '60-90j': { montant: 85000, pourcentage: 20.0, clients: 28 },
      '+90j': { montant: 120000, pourcentage: 28.2, clients: 38 }
    }
  },

  clientsARisque: {
    nombreClients: 15,
    caRisque: 485000, // CA total qu'on risque de perdre
    details: [
      { nom: 'SARL TECH INNOVATION', ca: 85000, risque: 'Très élevé', delaiPaiement: '120j' },
      { nom: 'EURL DIGITAL SERVICES', ca: 72000, risque: 'Élevé', delaiPaiement: '95j' },
      { nom: 'SAS PREMIUM CONSULTING', ca: 68000, risque: 'Moyen', delaiPaiement: '75j' }
    ]
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

// Génération des données de test (250 clients) avec distribution garantie
const analysesFinancieres = generateMockClients(250);
const overviewStats = generateOverviewStats(analysesFinancieres);

// Debug : compter les statuts réels
console.log('Distribution des statuts:', {
  suspects: analysesFinancieres.filter(c => c.statut === 'suspect').length,
  attention: analysesFinancieres.filter(c => c.statut === 'attention').length,
  sains: analysesFinancieres.filter(c => c.statut === 'bon').length,
  total: analysesFinancieres.length
});

const FinanceModern = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  
  // États pour l'analyse financière
  const [selectedFilters, setSelectedFilters] = useState({
    typeFacturation: 'tous',
    gestionnaire: 'tous',
    statut: 'tous',
    affichage: 'tous', // tous, suspects
    diagnostic: 'tous' // tous, dette_prestation, sous_facturation, rentabilite_faible, facturation_insuffisante, surveillance, equilibre
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [justificationDialog, setJustificationDialog] = useState<{open: boolean, client?: any}>({open: false});
  const [justificationText, setJustificationText] = useState('');
  const [showRulesConfig, setShowRulesConfig] = useState(false);
  const [editingRules, setEditingRules] = useState<{[key: string]: any}>({});
  const [sortBy, setSortBy] = useState<'nom' | 'statut' | 'diagnostic' | 'rentabilite'>('statut');
  const [showRealisePartnersSidebar, setShowRealisePartnersSidebar] = useState(false);
  
  // États pour la pagination et navigation
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'overview' | 'list'>('overview');

  // Calculs dynamiques
  const {
    clientsSuspects,
    encours,
    budgetHoraireTotal,
    budgetHoraireMaroc,
    budgetHoraireBelgique,
    budgetEconomiqueAnnuel,
    realiseHoraireTotal,
    realiseHoraireMaroc,
    realiseHoraireBelgique,
    realiseEconomiqueAnnuel,
    caClientsSortants,
    caClientsEntrants,
    realiseEconomiqueTrimestriel,
    dossiersLesPlusRentables,
    dossiersLesMoinsRentables,
    repartitionGeographique,
    evolutionMensuelleCA
  } = financeOverviewData;

  const tauxRealisationHoraire = ((realiseHoraireTotal / budgetHoraireTotal) * 100).toFixed(1);
  const tauxRealisationEconomique = ((realiseEconomiqueAnnuel / budgetEconomiqueAnnuel) * 100).toFixed(1);
  
  // Calculs d'impact clients sur année en cours et prochaine
  const impactSortantsAnneeEnCours = ((caClientsSortants.anneeEnCours / realiseEconomiqueAnnuel) * 100).toFixed(1);
  const impactSortantsAnneeProchaine = ((caClientsSortants.anneeProchaine / budgetEconomiqueAnnuel) * 100).toFixed(1);
  const apportEntrantsAnneeEnCours = ((caClientsEntrants.anneeEnCours / realiseEconomiqueAnnuel) * 100).toFixed(1);
  const apportEntrantsAnneeProchaine = ((caClientsEntrants.anneeProchaine / budgetEconomiqueAnnuel) * 100).toFixed(1);

  // Fonctions utilitaires pour l'analyse avec moteur de règles
  const analyzeClientWithRules = (client: any) => {
    const clientData = {
      id: client.id,
      nom: client.nom,
      gestionnaire: client.gestionnaire,
      typeFacturation: client.typeFacturation,
      objectifAnnuel: client.objectifAnnuel,
      realiseADate: client.realiseADate
    };
    
    const analysis = ruleEngine.analyzeClient(clientData);
    const justification = ruleEngine.getJustification(client.id);
    
    // NOUVELLE LOGIQUE MÉTIER : Détection des cas problématiques réels
    const seuilRentabilite = 90; // €/heure - seuil de rentabilité minimum
    const tarifHoraireReel = client.realiseADate.heures > 0 
      ? client.realiseADate.chiffreAffaires / client.realiseADate.heures 
      : 0;
    
    const facturationVsMinimum = client.realiseADate.chiffreAffaires / client.realiseADate.facturationMinimum;
    const ecartFacturationPrestation = client.realiseADate.pourcentageCA - client.realiseADate.pourcentageHeures;
    
    let displayDiagnostic;
    
    // CAS 1: Client payé beaucoup, peu presté (dette de prestation - À surveiller)
    if (ecartFacturationPrestation > 25 && client.realiseADate.pourcentageCA > 70) {
      displayDiagnostic = {
        type: 'dette_prestation' as const,
        alerte: `⚠️ Client payé à ${client.realiseADate.pourcentageCA.toFixed(1)}% mais seulement ${client.realiseADate.pourcentageHeures.toFixed(1)}% presté - À surveiller`,
        actionRecommandee: 'Analyser le planning et démarrer les prestations si nécessaire',
        urgence: 'low' as const
      };
    }
    // CAS 2: Beaucoup presté, peu payé (sous-facturation critique)
    else if (ecartFacturationPrestation < -25 && client.realiseADate.pourcentageHeures > 70) {
      displayDiagnostic = {
        type: 'sous_facturation' as const,
        alerte: `💸 ${client.realiseADate.pourcentageHeures.toFixed(1)}% presté mais seulement ${client.realiseADate.pourcentageCA.toFixed(1)}% facturé - Perte de rentabilité`,
        actionRecommandee: 'Analyser les causes du surcoût + réviser forfait si justifié',
        urgence: 'high' as const
      };
    }
    // CAS 3: Tarif horaire réel sous le seuil de rentabilité
    else if (tarifHoraireReel < seuilRentabilite && client.realiseADate.heures > 10) {
      displayDiagnostic = {
        type: 'rentabilite_faible' as const,
        alerte: `📉 Rentabilité ${tarifHoraireReel.toFixed(0)}€/h (< ${seuilRentabilite}€/h) - En dessous du seuil`,
        actionRecommandee: 'Révision urgente du forfait ou optimisation des prestations',
        urgence: 'high' as const
      };
    }
    // CAS 4: Facturation sous le minimum acceptable
    else if (facturationVsMinimum < 0.9 && client.realiseADate.heures > 5) {
      displayDiagnostic = {
        type: 'facturation_insuffisante' as const,
        alerte: `⚖️ Facturation ${(facturationVsMinimum * 100).toFixed(0)}% du minimum requis - Rentabilité compromise`,
        actionRecommandee: 'Négocier une revalorisation du forfait',
        urgence: 'high' as const
      };
    }
    // CAS 5: Déséquilibre modéré à surveiller
    else if (Math.abs(ecartFacturationPrestation) > 15) {
      displayDiagnostic = {
        type: 'surveillance' as const,
        alerte: `👁️ Écart modéré (${ecartFacturationPrestation.toFixed(1)}%) - À surveiller`,
        actionRecommandee: 'Surveillance rapprochée du dossier',
        urgence: 'low' as const
      };
    }
    // CAS 6: Situation saine
    else {
      displayDiagnostic = {
        type: 'equilibre' as const,
        alerte: `✅ Équilibre sain (${tarifHoraireReel.toFixed(0)}€/h) - Rentabilité ${tarifHoraireReel >= seuilRentabilite ? 'correcte' : 'acceptable'}`,
        actionRecommandee: 'Maintenir le rythme actuel',
        urgence: 'none' as const
      };
    }

    // Déterminer le statut selon la nouvelle logique métier
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
      statut: nouveauStatut, // Utilise le nouveau statut basé sur la logique métier
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

  // Comptes pour les filtres par diagnostic
  const diagnosticCounts = {
    dette_prestation: clientsAnalyzed.filter(c => c.diagnostic?.type === 'dette_prestation').length,
    sous_facturation: clientsAnalyzed.filter(c => c.diagnostic?.type === 'sous_facturation').length,
    rentabilite_faible: clientsAnalyzed.filter(c => c.diagnostic?.type === 'rentabilite_faible').length,
    facturation_insuffisante: clientsAnalyzed.filter(c => c.diagnostic?.type === 'facturation_insuffisante').length,
    surveillance: clientsAnalyzed.filter(c => c.diagnostic?.type === 'surveillance').length,
    equilibre: clientsAnalyzed.filter(c => c.diagnostic?.type === 'equilibre').length
  };

  // Tri des clients par type de diagnostic
  const sortClientsByDiagnostic = (clients: any[]) => {
    return [...clients].sort((a, b) => {
      if (sortBy === 'diagnostic') {
        const diagnosticOrder = {
          'sous_facturation': 1,
          'rentabilite_faible': 2,
          'facturation_insuffisante': 3,
          'dette_prestation': 4,
          'surveillance': 5,
          'equilibre': 6
        };
        return (diagnosticOrder[a.diagnostic.type] || 999) - (diagnosticOrder[b.diagnostic.type] || 999);
      } else if (sortBy === 'statut') {
        const statutOrder = { 'suspect': 1, 'attention': 2, 'bon': 3 };
        return (statutOrder[a.statut] || 999) - (statutOrder[b.statut] || 999);
      } else if (sortBy === 'rentabilite') {
        const rentabiliteA = a.realiseADate.heures > 0 ? a.realiseADate.chiffreAffaires / a.realiseADate.heures : 0;
        const rentabiliteB = b.realiseADate.heures > 0 ? b.realiseADate.chiffreAffaires / b.realiseADate.heures : 0;
        return rentabiliteA - rentabiliteB; // Croissant (plus problématiques en premier)
      } else {
        return a.nom.localeCompare(b.nom);
      }
    });
  };

  // Tri et pagination
  const clientsSorted = sortClientsByDiagnostic(clientsFiltres);
  const totalPages = Math.ceil(clientsSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientsPaginated = clientsSorted.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-600">
          Affichage de {startIndex + 1} à {Math.min(endIndex, clientsFiltres.length)} sur {clientsFiltres.length} clients
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <ChevronLeft className="w-4 h-4 -ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="bg-white/80 backdrop-blur-sm"
              >
                1
              </Button>
              {startPage > 2 && <MoreHorizontal className="w-4 h-4 text-gray-400" />}
            </>
          )}
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={page === currentPage 
                ? "bg-blue-500 text-white" 
                : "bg-white/80 backdrop-blur-sm"
              }
            >
              {page}
            </Button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <MoreHorizontal className="w-4 h-4 text-gray-400" />}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="bg-white/80 backdrop-blur-sm"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'suspect': return 'bg-red-100 text-red-700 border-red-300';
      case 'attention': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'bon': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getGraviteIcon = (gravite: string) => {
    switch(gravite) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getDiagnosticIcon = (type: string) => {
    switch(type) {
      case 'dette_prestation': return <TrendingDown className="w-5 h-5 text-blue-500" />;
      case 'sous_facturation': return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case 'rentabilite_faible': return <DollarSign className="w-5 h-5 text-red-500" />;
      case 'facturation_insuffisante': return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
      case 'surveillance': return <Eye className="w-5 h-5 text-blue-500" />;
      case 'equilibre': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch(type) {
      case 'dette_prestation': return <RefreshCw className="w-4 h-4" />;
      case 'sous_facturation': return <ArrowUpCircle className="w-4 h-4" />;
      case 'rentabilite_faible': return <DollarSign className="w-4 h-4" />;
      case 'facturation_insuffisante': return <TrendingUp className="w-4 h-4" />;
      case 'surveillance': return <Eye className="w-4 h-4" />;
      case 'equilibre': return <ThumbsUp className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  // Gestion de l'édition des règles
  const handleUpdateRule = (ruleId: string, field: string, value: any) => {
    setEditingRules(prev => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        [field]: value
      }
    }));
  };

  const handleSaveRule = (ruleId: string) => {
    const updates = editingRules[ruleId];
    if (updates) {
      ruleEngine.updateRule(ruleId, updates);
      setEditingRules(prev => {
        const { [ruleId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const parseRuleCondition = (condition: string) => {
    // Parse simple conditions like "RvB > 20%" to extract the value
    const match = condition.match(/([\w]+)\s*([><=≤≥]+)\s*(-?\d+(?:\.\d+)?)\s*%?/);
    if (match) {
      return {
        variable: match[1],
        operator: match[2],
        value: parseFloat(match[3])
      };
    }
    return null;
  };

  const formatRuleCondition = (variable: string, operator: string, value: number) => {
    return `${variable} ${operator} ${value}%`;
  };

  // Gestion des suspicions
  const handleNeutralizeSuspicion = (client: any) => {
    if (!justificationText.trim()) return;
    
    ruleEngine.neutralizeSuspicion(
      client.id,
      client.analysis.ruleTriggered?.id || 'unknown',
      justificationText,
      'current-user', // Dans un vrai système, récupérer l'utilisateur actuel
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Valide 30 jours
    );
    
    setJustificationText('');
    setJustificationDialog({open: false});
    // Force re-render en mettant à jour une state
    setSelectedFilters(prev => ({...prev}));
  };

  const handleReactivateSuspicion = (client: any) => {
    ruleEngine.reactivateSuspicion(client.id, client.analysis.ruleTriggered?.id || 'unknown');
    setSelectedFilters(prev => ({...prev}));
  };

  const getSuspicionStatusIcon = (client: any) => {
    if (client.justification?.status === 'neutralized') {
      return <ShieldCheck className="w-4 h-4 text-green-500" />;
    }
    if (client.justification?.status === 'justified') {
      return <Shield className="w-4 h-4 text-blue-500" />;
    }
    if (client.analysis?.isSuspect) {
      return <ShieldX className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  // Fonction de rendu du module Budgets - SUIVI UNIQUEMENT
  const renderBudgets = () => {
    // Données budgétaires réalistes avec métriques comptables - VERSION CORRIGÉE
    const budgetData = [
      {
        id: 'CLI-2024-001',
        client: 'SARL MARIN',
        gestionnaire: 'Mohamed',
        typeFacturation: 'Forfait Annuel',
        
        // Métriques horaires
        heuresBudgetees: 520,
        heuresRealisees: 385,
        progressionHeures: 74.0,
        
        // Métriques financières
        caBudgete: 48000,
        caRealise: 35200,
        progressionCA: 73.3,
        
        // Suivi client
        encours: 12800,
        echeancesRespectees: 8,
        echeancesTotales: 10,
        tauxRespectEcheances: 80.0,
        
        // Statut et évaluation
        statut: 'En cours',
        risqueLevel: 'faible',
        prochaineMilestone: '15 Jan 2025',
        notePerformance: 'B+',
        tendance: 'stable'
      },
      {
        id: 'CLI-2024-002', 
        client: 'TECH SOLUTIONS SRL',
        gestionnaire: 'Julien',
        typeFacturation: 'Mission Ponctuelle',
        
        // Métriques horaires  
        heuresBudgetees: 280,
        heuresRealisees: 320,
        progressionHeures: 114.3,
        
        // Métriques financières
        caBudgete: 25000,
        caRealise: 28700,
        progressionCA: 114.8,
        
        // Suivi client
        encours: -3700, // Négatif car dépassement
        echeancesRespectees: 12,
        echeancesTotales: 12,
        tauxRespectEcheances: 100.0,
        
        // Statut et évaluation
        statut: 'Dépassé',
        risqueLevel: 'moyen',
        prochaineMilestone: '10 Jan 2025',
        notePerformance: 'C',
        tendance: 'negative'
      },
      {
        id: 'CLI-2024-003',
        client: 'INNOVATION CORP',
        gestionnaire: 'Vincent',
        typeFacturation: 'Forfait Mensuel',
        
        // Métriques horaires
        heuresBudgetees: 680,
        heuresRealisees: 455,
        progressionHeures: 66.9,
        
        // Métriques financières
        caBudgete: 62000,
        caRealise: 41500,
        progressionCA: 66.9,
        
        // Suivi client
        encours: 20500,
        echeancesRespectees: 5,
        echeancesTotales: 9,
        tauxRespectEcheances: 55.6,
        
        // Statut et évaluation
        statut: 'En retard',
        risqueLevel: 'élevé',
        prochaineMilestone: '20 Déc 2024',
        notePerformance: 'D+',
        tendance: 'negative'
      },
      {
        id: 'CLI-2024-004',
        client: 'BELUX CONSULTING',
        gestionnaire: 'Pol',
        typeFacturation: 'Forfait Trimestriel',
        
        // Métriques horaires
        heuresBudgetees: 420,
        heuresRealisees: 410,
        progressionHeures: 97.6,
        
        // Métriques financières
        caBudgete: 38500,
        caRealise: 37200,
        progressionCA: 96.6,
        
        // Suivi client
        encours: 1300,
        echeancesRespectees: 11,
        echeancesTotales: 11,
        tauxRespectEcheances: 100.0,
        
        // Statut et évaluation
        statut: 'Excellent',
        risqueLevel: 'très faible',
        prochaineMilestone: '05 Jan 2025',
        notePerformance: 'A',
        tendance: 'positive'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Header avec KPIs et actions */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                📊 Suivi Budgétaire Intelligent
              </h2>
              <p className="text-slate-300 text-lg">Analyse de performance et suivi des budgets - Modifications via fiche client</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setActiveTab('analysis')}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 rounded-2xl px-6 py-3 shadow-xl"
              >
                <Eye className="w-5 h-5 mr-2" />
                Voir Analyse
              </Button>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 rounded-2xl px-6 py-3">
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPIs Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Budgeté Total</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caBudgete, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Réalisé</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caRealise, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Heures Budgetées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + item.heuresBudgetees, 0).toLocaleString()}h</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Échéances Manquées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + (item.echeancesTotales - item.echeancesRespectees), 0)}</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {budgetData.map((budget) => (
            <div key={budget.id} className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              {/* Header de la carte */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{budget.client}</h3>
                  <p className="text-sm text-slate-600">ID: {budget.id} • {budget.gestionnaire} • {budget.typeFacturation}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  budget.statut === 'En cours' ? 'bg-blue-100 text-blue-700' :
                  budget.statut === 'Dépassé' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {budget.statut}
                </div>
              </div>

              {/* Métriques principales */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* CA Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      Chiffre d'Affaires
                    </h4>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      budget.progressionCA >= 100 ? 'bg-red-100 text-red-700' :
                      budget.progressionCA >= 80 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {budget.progressionCA.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-800">
                      €{(budget.caRealise / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-slate-500">
                      / €{(budget.caBudgete / 1000).toFixed(0)}K budgeté
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(budget.progressionCA, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Heures Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      Heures
                    </h4>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      budget.progressionHeures >= 100 ? 'bg-red-100 text-red-700' :
                      budget.progressionHeures >= 80 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {budget.progressionHeures.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-800">
                      {budget.heuresRealisees}h
                    </p>
                    <p className="text-xs text-slate-500">
                      / {budget.heuresBudgetees}h budgeté
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(budget.progressionHeures, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métriques détaillées */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Encours */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-purple-500" />
                    Encours
                  </h4>
                  <p className={`text-lg font-bold ${
                    budget.encours >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {budget.encours >= 0 ? '+' : ''}€{(budget.encours / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-slate-500">
                    {budget.encours >= 0 ? 'Restant à facturer' : 'Dépassement budget'}
                  </p>
                </div>

                {/* Échéances */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                    Échéances 2024
                  </h4>
                  <p className="text-lg font-bold text-slate-800">
                    {budget.echeancesRespectees}/{budget.echeancesTotales}
                  </p>
                  <p className="text-xs text-slate-500">
                    {budget.tauxRespectEcheances.toFixed(0)}% respectées
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full"
                      style={{ width: `${budget.tauxRespectEcheances}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer avec actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    budget.risqueLevel === 'faible' ? 'bg-green-400' :
                    budget.risqueLevel === 'moyen' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-sm text-slate-600">Prochaine milestone: {budget.prochaineMilestone}</span>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Risque {budget.risqueLevel}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    onClick={() => navigate(`/clients/${budget.id}`)}
                    title="Accéder à la fiche client pour modifier le budget"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier Budget
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Module Finance</h1>
            <p className="text-gray-600 mt-1">Gestion financière et analyse de performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

          {/* KPIs Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Budgeté Total</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caBudgete, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Réalisé</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caRealise, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Heures Budgetées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + item.heuresBudgetees, 0)}H</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Échéances Manquées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + (item.echeancesTotales - item.echeancesRespectees), 0)}</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau budgétaire moderne */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-2xl border-b-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span>Portfolio Budgétaire 2024</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Input 
                  placeholder="Rechercher client, gestionnaire..." 
                  className="w-64 rounded-xl border-slate-200 bg-white/70"
                />
                <Select defaultValue="tous">
                  <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous statuts</SelectItem>
                    <SelectItem value="en-cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="depasse">Dépassé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
              {budgetData.map((budget, index) => (
                <div 
                  key={budget.id} 
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Indicateur de statut en haut */}
                  <div className={`h-1 ${
                    budget.statut === 'En cours' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                    budget.statut === 'Dépassé' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                    'bg-gradient-to-r from-yellow-400 to-orange-400'
                  }`} />
                  
                  <div className="p-6">
                    {/* Header de la ligne */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                          budget.statut === 'En cours' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          budget.statut === 'Dépassé' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                          'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}>
                          {budget.client.substring(0, 2)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {budget.client}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-slate-500">ID: {budget.id}</span>
                            <span className="text-sm text-slate-500">• {budget.gestionnaire}</span>
                            <Badge variant="outline" className="text-xs">
                              {budget.typeFacturation}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-800">
                            €{(budget.caRealise / 1000).toFixed(0)}K
                          </p>
                          <p className="text-sm text-slate-500">
                            / €{(budget.caBudgete / 1000).toFixed(0)}K budgeté
                          </p>
                        </div>
                        
                        <div className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          budget.progressionCA >= 100 ? 'bg-red-100 text-red-700' :
                          budget.progressionCA >= 80 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {budget.progressionCA.toFixed(1)}%
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-xl hover:bg-blue-50 hover:text-blue-600"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Barre de progression détaillée */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Progression budgétaire</span>
                        <span className={`font-medium ${budget.encours >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {budget.encours >= 0 ? '+' : ''}€{(budget.encours / 1000).toFixed(1)}K encours
                        </span>
                      </div>
                      
                      <div className="relative w-full bg-slate-100 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            budget.progressionCA >= 100 ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                            budget.progressionCA >= 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            'bg-gradient-to-r from-green-400 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(budget.progressionCA, 100)}%` }}
                        />
                        {budget.progressionCA > 100 && (
                          <div className="absolute top-0 right-0 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-r-full animate-pulse" style={{ width: `${Math.min(budget.progressionCA - 100, 20)}%` }} />
                        )}
                      </div>
                    </div>

                    {/* Métriques détaillées par client */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {/* Heures */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Heures</span>
                        </h4>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-slate-800">
                            {budget.heuresRealisees}H
                          </p>
                          <p className="text-xs text-slate-500">
                            / {budget.heuresBudgetees}H budgetées
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                budget.progressionHeures > 100 ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                                budget.progressionHeures > 90 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                'bg-gradient-to-r from-green-400 to-emerald-400'
                              }`}
                              style={{ width: `${Math.min(budget.progressionHeures, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chiffre d'Affaires */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Chiffre d'Affaires</span>
                        </h4>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-slate-800">
                            €{(budget.caRealise / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-slate-500">
                            / €{(budget.caBudgete / 1000).toFixed(0)}K budgeté
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                budget.progressionCA > 100 ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                                budget.progressionCA > 90 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                'bg-gradient-to-r from-green-400 to-emerald-400'
                              }`}
                              style={{ width: `${Math.min(budget.progressionCA, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Encours */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                          <Wallet className="w-4 h-4" />
                          <span>Encours</span>
                        </h4>
                        <div className="space-y-1">
                          <p className={`text-lg font-bold ${
                            budget.encours >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {budget.encours >= 0 ? '+' : ''}€{(budget.encours / 1000).toFixed(1)}K
                          </p>
                          <p className="text-xs text-slate-500">
                            {budget.encours >= 0 ? 'Restant à facturer' : 'Dépassement budget'}
                          </p>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            budget.encours >= 10000 ? 'bg-green-100 text-green-700' :
                            budget.encours >= 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {budget.encours >= 10000 ? 'Sain' :
                             budget.encours >= 0 ? 'Vigilance' : 'Critique'}
                          </div>
                        </div>
                      </div>

                      {/* Échéances */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Échéances 2024</span>
                        </h4>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-slate-800">
                            {budget.echeancesRespectees}/{budget.echeancesTotales}
                          </p>
                          <p className="text-xs text-slate-500">
                            {budget.tauxRespectEcheances.toFixed(0)}% respectées
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                budget.tauxRespectEcheances >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                                budget.tauxRespectEcheances >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                'bg-gradient-to-r from-red-400 to-pink-400'
                              }`}
                              style={{ width: `${budget.tauxRespectEcheances}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer avec actions et dates */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            Prochaine milestone: {budget.prochaineMilestone}
                          </span>
                        </div>
                        <div className={`flex items-center space-x-2 ${
                          budget.risqueLevel === 'faible' || budget.risqueLevel === 'très faible' ? 'text-green-600' :
                          budget.risqueLevel === 'moyen' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Risque {budget.risqueLevel}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                          onClick={() => navigate(`/clients/${budget.id}`)}
                          title="Accéder à la fiche client pour modifier le budget"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier Budget
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVueEnsemble = () => (
    <div className="space-y-8">
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
                <p className="text-xs text-gray-500 mt-1">{data.pourcentage.toFixed(1)}%</p>
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
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={repartitionGeographique}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="montant"
                  label={({ pays, pourcentage }) => `${pays} ${pourcentage}%`}
                >
                  {repartitionGeographique.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.couleur} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${(value / 1000).toFixed(0)}K€`} />
              </RechartsPieChart>
            </ResponsiveContainer>
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

      {/* Clients à Risque */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-6 h-6" />
            <span>Clients à Risque</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CA Total à Risque */}
            <div className="text-center p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl border border-red-200">
              <div className="mb-3">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700">CA à Risque</p>
              </div>
              <p className="text-4xl font-bold text-red-800 mb-2">
                {(financeOverviewData.clientsARisque.caRisque / 1000).toFixed(0)}K€
              </p>
              <p className="text-xs text-red-600">
                {financeOverviewData.clientsARisque.nombreClients} clients concernés
              </p>
            </div>



            {/* Top 3 Clients à Risque */}
            <div className="p-6 bg-white/50 rounded-2xl border border-red-100">
              <h4 className="font-semibold text-red-800 mb-4">Top 3 Clients Critiques</h4>
              <div className="space-y-3">
                {financeOverviewData.clientsARisque.details.slice(0, 3).map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{client.nom}</p>
                      <p className="text-xs text-gray-600">{client.delaiPaiement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{(client.ca / 1000).toFixed(0)}K€</p>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        client.risque === 'Très élevé' ? 'bg-red-100 text-red-700' :
                        client.risque === 'Élevé' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {client.risque}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolution mensuelle */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <LineChart className="w-6 h-6" />
            <span>Évolution Mensuelle du CA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={evolutionMensuelleCA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="mois" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K€`} />
              <Tooltip 
                formatter={(value: number, name: string) => [`${(value / 1000).toFixed(0)}K€`, name === 'budget' ? 'Budget' : name === 'realise' ? 'Réalisé' : 'Écart']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="budget" stroke={COLORS.warning} strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="realise" stroke={COLORS.primary} strokeWidth={3} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientDetail = (client: any) => (
    <div className="space-y-8">
      {/* Header Hero avec diagnostic intelligent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"></div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-xl ${
                client.statut === 'suspect' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                client.statut === 'attention' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                'bg-gradient-to-br from-green-400 to-emerald-600'
              }`}>
                {client.nom.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.nom}</h1>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {client.gestionnaire}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 rounded-full">
                    {client.typeFacturation}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {((client.realiseADate.pourcentageCA / client.realiseADate.pourcentageHeures) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500">Score de Performance</div>
            </div>
          </div>

          {/* Diagnostic IA */}
          <div className={`p-6 rounded-2xl ${
            client.diagnostic.urgence === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' :
            client.diagnostic.urgence === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
            'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl ${
                client.diagnostic.urgence === 'high' ? 'bg-red-100' :
                client.diagnostic.urgence === 'medium' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                {getDiagnosticIcon(client.diagnostic.type)}
              </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Budgeté Total</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caBudgete, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">CA Réalisé</p>
                  <p className="text-2xl font-bold text-white">€{(budgetData.reduce((sum, item) => sum + item.caRealise, 0) / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Heures Budgetées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + item.heuresBudgetees, 0).toLocaleString()}h</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Échéances Manquées</p>
                  <p className="text-2xl font-bold text-white">{budgetData.reduce((sum, item) => sum + (item.echeancesTotales - item.echeancesRespectees), 0)}</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {client.diagnostic.type === 'dette_prestation' && (
            <>
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 hover:shadow-lg transition-all cursor-pointer group">
                <RefreshCw className="w-8 h-8 text-red-500 mb-4 group-hover:rotate-180 transition-transform duration-500" />
                <h4 className="font-bold text-red-800 mb-2">Planifier Rattrapage</h4>
                <p className="text-sm text-red-600 mb-4">Établir un planning pour honorer l'engagement client</p>
                <Button className="w-full bg-red-500 hover:bg-red-600 rounded-xl">Planifier</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 hover:shadow-lg transition-all cursor-pointer group">
                <Search className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-orange-800 mb-2">Analyser Blocages</h4>
                <p className="text-sm text-orange-600 mb-4">Identifier pourquoi les prestations n'ont pas démarré</p>
                <Button variant="outline" className="w-full border-orange-300 text-orange-700 rounded-xl">Analyser</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-blue-800 mb-2">Rassurer Client</h4>
                <p className="text-sm text-blue-600 mb-4">Communication proactive sur la livraison</p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 rounded-xl">Contacter</Button>
              </div>
            </>
          )}
          
          {client.diagnostic.type === 'sous_facturation' && (
            <>
              <div className="p-6 rounded-2xl bg-green-50 border border-green-200 hover:shadow-lg transition-all cursor-pointer group">
                <ArrowUpCircle className="w-8 h-8 text-green-500 mb-4 group-hover:translate-y-[-4px] transition-transform" />
                <h4 className="font-bold text-green-800 mb-2">Revaloriser Forfait</h4>
                <p className="text-sm text-green-600 mb-4">Proposer une augmentation justifiée</p>
                <Button className="w-full bg-green-500 hover:bg-green-600 rounded-xl">Proposer</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200 hover:shadow-lg transition-all cursor-pointer group">
                <FileText className="w-8 h-8 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-yellow-800 mb-2">Analyser Prestations</h4>
                <p className="text-sm text-yellow-600 mb-4">Identifier les services sous-valorisés</p>
                <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 rounded-xl">Analyser</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
                <Phone className="w-8 h-8 text-purple-500 mb-4 group-hover:rotate-12 transition-transform" />
                <h4 className="font-bold text-purple-800 mb-2">Négociation</h4>
                <p className="text-sm text-purple-600 mb-4">Organiser un RDV de renégociation</p>
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 rounded-xl">Planifier RDV</Button>
              </div>
            </>
          )}
          
          {/* Actions pour Rentabilité Faible */}
          {client.diagnostic.type === 'rentabilite_faible' && (
            <>
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 hover:shadow-lg transition-all cursor-pointer group">
                <DollarSign className="w-8 h-8 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-red-800 mb-2">Réviser Forfait</h4>
                <p className="text-sm text-red-600 mb-4">Augmentation tarifaire urgente</p>
                <Button className="w-full bg-red-500 hover:bg-red-600 rounded-xl">Revaloriser</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 hover:shadow-lg transition-all cursor-pointer group">
                <Settings className="w-8 h-8 text-orange-500 mb-4 group-hover:rotate-45 transition-transform" />
                <h4 className="font-bold text-orange-800 mb-2">Optimiser Process</h4>
                <p className="text-sm text-orange-600 mb-4">Améliorer l'efficacité des prestations</p>
                <Button variant="outline" className="w-full border-orange-300 text-orange-700 rounded-xl">Optimiser</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                <FileText className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-blue-800 mb-2">Réduire Scope</h4>
                <p className="text-sm text-blue-600 mb-4">Ajuster le périmètre de prestation</p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 rounded-xl">Négocier</Button>
              </div>
            </>
          )}
          
          {/* Actions pour Facturation Insuffisante */}
          {client.diagnostic.type === 'facturation_insuffisante' && (
            <>
              <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200 hover:shadow-lg transition-all cursor-pointer group">
                <TrendingUp className="w-8 h-8 text-yellow-500 mb-4 group-hover:translate-y-[-4px] transition-transform" />
                <h4 className="font-bold text-yellow-800 mb-2">Négocier Revalorisation</h4>
                <p className="text-sm text-yellow-600 mb-4">Argumenter avec les coûts réels</p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 rounded-xl">Négocier</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-green-50 border border-green-200 hover:shadow-lg transition-all cursor-pointer group">
                <BarChart3 className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-green-800 mb-2">Benchmark Marché</h4>
                <p className="text-sm text-green-600 mb-4">Justifier les tarifs avec le marché</p>
                <Button variant="outline" className="w-full border-green-300 text-green-700 rounded-xl">Comparer</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
                <Calculator className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-purple-800 mb-2">Options Alternatives</h4>
                <p className="text-sm text-purple-600 mb-4">Proposer réduction scope ou étalement</p>
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 rounded-xl">Proposer</Button>
              </div>
            </>
          )}
          
          {/* Actions pour Surveillance */}
          {client.diagnostic.type === 'surveillance' && (
            <>
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                <Eye className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-blue-800 mb-2">Suivi Mensuel</h4>
                <p className="text-sm text-blue-600 mb-4">Point régulier sur l'évolution</p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl">Programmer</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
                <AlertCircle className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-indigo-800 mb-2">Alertes Automatiques</h4>
                <p className="text-sm text-indigo-600 mb-4">Configurer seuils d'alerte</p>
                <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 rounded-xl">Configurer</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 hover:shadow-lg transition-all cursor-pointer group">
                <Activity className="w-8 h-8 text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-teal-800 mb-2">Ajustements Légers</h4>
                <p className="text-sm text-teal-600 mb-4">Corrections mineures préventives</p>
                <Button variant="outline" className="w-full border-teal-300 text-teal-700 rounded-xl">Ajuster</Button>
              </div>
            </>
          )}
          
          {client.diagnostic.type === 'equilibre' && (
            <>
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group">
                <ThumbsUp className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-emerald-800 mb-2">Maintenir Rythme</h4>
                <p className="text-sm text-emerald-600 mb-4">Continuer sur cette excellente lancée</p>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl">Valider</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
                <Star className="w-8 h-8 text-indigo-500 mb-4 group-hover:rotate-12 transition-transform" />
                <h4 className="font-bold text-indigo-800 mb-2">Client Modèle</h4>
                <p className="text-sm text-indigo-600 mb-4">Identifier comme référence qualité</p>
                <Button variant="outline" className="w-full border-indigo-300 text-indigo-700 rounded-xl">Marquer</Button>
              </div>
              
              <div className="p-6 rounded-2xl bg-pink-50 border border-pink-200 hover:shadow-lg transition-all cursor-pointer group">
                <Award className="w-8 h-8 text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-pink-800 mb-2">Dupliquer Approche</h4>
                <p className="text-sm text-pink-600 mb-4">Appliquer cette méthode à d'autres clients</p>
                <Button variant="outline" className="w-full border-pink-300 text-pink-700 rounded-xl">Dupliquer</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalyseFinanciere = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header épuré avec recherche intelligente */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Intelligence Financière
            </h1>
            <p className="text-gray-600 mt-1">Diagnostic instantané • Actions recommandées • Performance temps réel</p>
          </div>
          
          {/* Barre de filtres compacte et organisée */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100 mb-6">
            
            {/* Ligne 1: Filtres de Statut + Compteur + Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* Filtres Statut */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedFilters(prev => ({
                      ...prev, 
                      statut: prev.statut === 'suspect' ? 'tous' : 'suspect',
                      affichage: prev.statut === 'suspect' ? 'tous' : 'suspects',
                      diagnostic: 'tous'
                    }))}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedFilters.statut === 'suspect' ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {overviewStats.counts.suspects} Suspects
                  </button>
                  
                  <button
                    onClick={() => setSelectedFilters(prev => ({
                      ...prev,
                      statut: prev.statut === 'attention' ? 'tous' : 'attention',
                      affichage: prev.statut === 'attention' ? 'tous' : 'a_surveiller',
                      diagnostic: 'tous'
                    }))}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedFilters.statut === 'attention' ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-300' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {clientsAnalyzed.filter(c => c.statut === 'attention' && !c.justification).length} À surveiller
                  </button>
                  
                  <button
                    onClick={() => setSelectedFilters(prev => ({
                      ...prev,
                      affichage: prev.affichage === 'neutralises' ? 'tous' : 'neutralises',
                      diagnostic: 'tous'
                    }))}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedFilters.affichage === 'neutralises' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300' : 'bg-gray-100 text-gray-700 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    {clientsFiltres.filter(c => c.justification?.status === 'neutralized').length} Neutralisés
                  </button>
                  
                  <button
                    onClick={() => setSelectedFilters(prev => ({
                      ...prev,
                      statut: prev.statut === 'bon' ? 'tous' : 'bon',
                      diagnostic: 'tous'
                    }))}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedFilters.statut === 'bon' ? 'bg-green-100 text-green-700 ring-2 ring-green-300' : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {overviewStats.counts.sains} Sains
                  </button>
                </div>
                
                {/* Séparateur */}
                <div className="h-6 w-px bg-gray-300"></div>
                
                {/* Compteur total */}
                <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                  Total: {clientsFiltres.length}
                </div>
              </div>
              
              {/* Actions à droite */}
              <div className="flex items-center space-x-2">
                {/* Reset filtres */}
                {(selectedFilters.statut !== 'tous' || selectedFilters.affichage !== 'tous' || selectedFilters.diagnostic !== 'tous') && (
                  <button
                    onClick={() => setSelectedFilters({
                      typeFacturation: 'tous',
                      gestionnaire: 'tous', 
                      statut: 'tous',
                      affichage: 'tous',
                      diagnostic: 'tous'
                    })}
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                  >
                    <XCircle className="w-4 h-4 text-gray-600" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Ligne 2: Filtres par Diagnostic */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Diagnostic</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {(() => {
                  // Définir les diagnostics disponibles selon le statut
                  let availableDiagnostics = [];
                  
                  if (selectedFilters.statut === 'suspect') {
                    // Suspects = urgence 'high'
                    availableDiagnostics = [
                      { key: 'sous_facturation', label: 'Sous-Facturation', icon: ArrowDownCircle, color: 'red' },
                      { key: 'rentabilite_faible', label: 'Rentabilité Faible', icon: DollarSign, color: 'red' },
                      { key: 'facturation_insuffisante', label: 'Facturation Insuf.', icon: ArrowDownCircle, color: 'red' }
                    ];
                  } else if (selectedFilters.statut === 'attention') {
                    // À surveiller = urgence 'medium' ou 'low' 
                    availableDiagnostics = [
                      { key: 'dette_prestation', label: 'Dette Prestation', icon: TrendingDown, color: 'orange' },
                      { key: 'surveillance', label: 'Surveillance', icon: Eye, color: 'orange' }
                    ];
                  } else if (selectedFilters.statut === 'bon') {
                    // Sains = urgence 'none' ou équilibre
                    availableDiagnostics = [
                      { key: 'equilibre', label: 'Équilibre', icon: CheckCircle, color: 'green' }
                    ];
                  } else {
                    // Tous = tous les diagnostics
                    availableDiagnostics = [
                      { key: 'sous_facturation', label: 'Sous-Facturation', icon: ArrowDownCircle, color: 'red' },
                      { key: 'rentabilite_faible', label: 'Rentabilité Faible', icon: DollarSign, color: 'red' },
                      { key: 'facturation_insuffisante', label: 'Facturation Insuf.', icon: ArrowDownCircle, color: 'red' },
                      { key: 'dette_prestation', label: 'Dette Prestation', icon: TrendingDown, color: 'orange' },
                      { key: 'surveillance', label: 'Surveillance', icon: Eye, color: 'orange' },
                      { key: 'equilibre', label: 'Équilibre', icon: CheckCircle, color: 'green' }
                    ];
                  }
                  
                  return availableDiagnostics;
                })().map((diagnostic) => {
                  const Icon = diagnostic.icon;
                  const isActive = selectedFilters.diagnostic === diagnostic.key;
                  const count = diagnosticCounts[diagnostic.key as keyof typeof diagnosticCounts];
                  
                  return (
                    <button
                      key={diagnostic.key}
                      onClick={() => setSelectedFilters(prev => ({
                        ...prev,
                        diagnostic: prev.diagnostic === diagnostic.key ? 'tous' : diagnostic.key
                      }))}
                      className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        isActive 
                          ? `bg-${diagnostic.color}-100 text-${diagnostic.color}-700 ring-2 ring-${diagnostic.color}-300` 
                          : `bg-gray-50 text-gray-600 hover:bg-${diagnostic.color}-50`
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? `text-${diagnostic.color}-600` : 'text-gray-500'}`} />
                      <span>{diagnostic.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        isActive ? `bg-${diagnostic.color}-200 text-${diagnostic.color}-800` : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
            
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              {/* Contrôles de vue */}
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm">
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className="rounded-xl h-8"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-xl h-8"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Sélecteur de tri */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm rounded-2xl border-gray-200 shadow-sm">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="statut">Statut</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="rentabilite">Rentabilité</SelectItem>
                  <SelectItem value="nom">Nom</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Bouton configuration des règles */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRulesConfig(true)}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Règles
              </Button>
            </div>
          </div>
        </div>

        {/* Recherche intelligente */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un client ou taper 'urgent' pour voir les alertes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
              onClick={() => setSearchTerm('')}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tableau de bord intelligent - Vue d'ensemble */}
      {!selectedClient && (
        <>
          <div className={`grid gap-6 mb-8 ${
            viewMode === 'overview' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {clientsPaginated.map((client, index) => (
              viewMode === 'overview' ? (
                // Vue grille (actuelle)
                <div
                  key={client.id}
                  className={`group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                    client.statut === 'suspect' 
                      ? 'ring-2 ring-red-200 hover:ring-red-300' 
                      : 'hover:ring-2 hover:ring-blue-200'
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Contenu de la carte existante */}
              {/* Indicateur de priorité */}
              <div className={`absolute top-0 left-0 w-full h-1 ${
                client.diagnostic.urgence === 'high' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                client.diagnostic.urgence === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                'bg-gradient-to-r from-green-400 to-emerald-400'
              }`} />
              
              <div className="p-6">
                {/* Header client */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                      client.statut === 'suspect' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                      client.statut === 'attention' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
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

                {/* Diagnostic en une ligne */}
                <div className={`p-4 rounded-2xl mb-4 ${
                  client.diagnostic.urgence === 'high' ? 'bg-red-50 border border-red-100' :
                  client.diagnostic.urgence === 'medium' ? 'bg-yellow-50 border border-yellow-100' :
                  'bg-green-50 border border-green-100'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getDiagnosticIcon(client.diagnostic.type)}
                    <span className={`text-sm font-medium ${
                      client.diagnostic.urgence === 'high' ? 'text-red-700' :
                      client.diagnostic.urgence === 'medium' ? 'text-yellow-700' :
                      client.diagnostic.urgence === 'low' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      {client.diagnostic.type === 'dette_prestation' ? 'Dette Prestation' :
                       client.diagnostic.type === 'sous_facturation' ? 'Sous-Facturation' :
                       client.diagnostic.type === 'rentabilite_faible' ? 'Rentabilité Faible' :
                       client.diagnostic.type === 'facturation_insuffisante' ? 'Facturation Insuffisante' :
                       client.diagnostic.type === 'surveillance' ? 'À Surveiller' :
                       'Équilibre Sain'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{client.diagnostic.alerte}</p>
                </div>

                {/* Métriques clés */}
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

                {/* Gestion suspicion et actions */}
                <div className="mt-4 space-y-2">
                  {/* Boutons de gestion de suspicion */}
                  {client.analysis?.isSuspect && client.analysis?.canBeNeutralized && !client.justification && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setJustificationDialog({open: true, client})}
                        className="flex-1 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Justifier
                      </Button>
                    </div>
                  )}
                  
                  {/* Statut neutralisé */}
                  {client.justification?.status === 'neutralized' && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700">Neutralisé</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReactivateSuspicion(client)}
                        className="h-6 px-2 text-xs text-green-700 hover:text-green-900"
                      >
                        Réactiver
                      </Button>
                    </div>
                  )}
                  
                  {/* Action suggestion */}
                  {client.diagnostic.urgence !== 'none' && !client.justification && (
                    <Button 
                      size="sm" 
                      className={`w-full rounded-xl text-xs ${
                        client.diagnostic.urgence === 'high' ? 'bg-red-500 hover:bg-red-600' :
                        client.diagnostic.urgence === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {getActionIcon(client.diagnostic.type)}
                      <span className="ml-2">
                        {client.diagnostic.type === 'dette_prestation' ? 'Planifier Rattrapage' :
                         client.diagnostic.type === 'sous_facturation' ? 'Revaloriser Forfait' :
                         client.diagnostic.type === 'rentabilite_faible' ? 'Réviser Forfait' :
                         client.diagnostic.type === 'facturation_insuffisante' ? 'Négocier' :
                         client.diagnostic.type === 'surveillance' ? 'Surveiller' :
                         'Maintenir'}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
                </div>
              ) : (
                // Vue liste dense
                <div
                  key={client.id}
                  className={`group p-4 bg-white/60 backdrop-blur-sm rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    client.statut === 'suspect' 
                      ? 'ring-2 ring-red-200 hover:ring-red-300' 
                      : 'hover:ring-2 hover:ring-blue-200'
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Identité client */}
                    <div className="md:col-span-3 flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                        client.statut === 'suspect' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                        client.statut === 'attention' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        'bg-gradient-to-br from-green-400 to-emerald-600'
                      }`}>
                        {client.nom.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {client.nom}
                        </h4>
                        <p className="text-xs text-gray-500">{client.id}</p>
                      </div>
                    </div>

                    {/* Gestionnaire */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">{client.gestionnaire}</p>
                      <Badge variant="outline" className="text-xs">
                        {client.typeFacturation}
                      </Badge>
                    </div>

                    {/* Métriques */}
                    <div className="md:col-span-2 text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {client.realiseADate.pourcentageHeures.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Prestation</div>
                    </div>

                    <div className="md:col-span-2 text-center">
                      <div className={`text-lg font-bold ${
                        client.realiseADate.pourcentageCA > 100 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {client.realiseADate.pourcentageCA.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Facturation</div>
                    </div>

                    {/* Statut et actions */}
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        {getSuspicionStatusIcon(client)}
                        <Badge className={getStatutColor(client.statut)} size="sm">
                          {client.statut}
                        </Badge>
                      </div>
                      
                      {/* Actions rapides */}
                      <div className="mt-2 flex space-x-1">
                        {client.analysis?.isSuspect && client.analysis?.canBeNeutralized && !client.justification && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setJustificationDialog({open: true, client});
                            }}
                            className="h-6 px-2 text-xs border-blue-300 text-blue-700"
                          >
                            <Shield className="w-3 h-3" />
                          </Button>
                        )}
                        
                        {client.justification?.status === 'neutralized' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactivateSuspicion(client);
                            }}
                            className="h-6 px-2 text-xs text-green-700"
                          >
                            <ShieldCheck className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Flèche */}
                    <div className="md:col-span-1 text-right">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}

      {/* Vue détaillée client */}
      {selectedClient && (
        <div className="space-y-6">
          {/* Bouton retour élégant */}
          <Button
            variant="ghost"
            onClick={() => setSelectedClient(null)}
            className="mb-6 text-gray-600 hover:text-gray-900 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
          >
            <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
            Retour à la vue d'ensemble
          </Button>

          {renderClientDetail(clientsFiltres.find(c => c.id === selectedClient))}
        </div>
      )}

      {/* Actions rapides flottantes */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300"
          onClick={() => setSelectedFilters(prev => ({...prev, affichage: prev.affichage === 'suspects' ? 'tous' : 'suspects'}))}
        >
          <AlertTriangle className="w-6 h-6" />
        </Button>
        
        <Button
          variant="outline"
          className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          onClick={() => window.print()}
        >
          <FileText className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal de justification de suspicion */}
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
              <p className="text-sm text-gray-600 mb-4">
                Règle déclenchée: <span className="font-medium">{justificationDialog.client?.analysis?.ruleTriggered?.nom}</span>
              </p>
            </div>
            
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                placeholder="Expliquez pourquoi cette suspicion est justifiée ou peut être neutralisée..."
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

      {/* Modal de configuration des règles */}
      <Dialog open={showRulesConfig} onOpenChange={setShowRulesConfig}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-gray-700" />
              <span>Configuration des Règles de Suspicion</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Variables explicatives */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Variables Disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-100 rounded px-3 py-2">
                  <span className="font-medium text-blue-800">RvB</span>
                  <p className="text-blue-600">Déséquilibre entre réalisé et facturé</p>
                </div>
                <div className="bg-blue-100 rounded px-3 py-2">
                  <span className="font-medium text-blue-800">HRvB</span>
                  <p className="text-blue-600">Proportion réalisé horaire à date vs budget à date</p>
                </div>
                <div className="bg-blue-100 rounded px-3 py-2">
                  <span className="font-medium text-blue-800">ERvB</span>
                  <p className="text-blue-600">Proportion réalisé économique à date vs budget à date</p>
                </div>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Exemples de Règles</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-orange-100 rounded px-3 py-2">
                  <span className="font-medium text-orange-800">Simple:</span>
                  <span className="text-orange-600 ml-2">{"RvB > 20%"}</span>
                </div>
                <div className="bg-orange-100 rounded px-3 py-2">
                  <span className="font-medium text-orange-800">Plage:</span>
                  <span className="text-orange-600 ml-2">{"5% < RvB ≤ 10%"}</span>
                </div>
                <div className="bg-orange-100 rounded px-3 py-2">
                  <span className="font-medium text-orange-800">Imbriquée:</span>
                  <span className="text-orange-600 ml-2">{"(0% < RvB ≤ 5%) AND (HRvB ≥ 10%) AND (ERvB ≥ 10%)"}</span>
                </div>
              </div>
            </div>

            {/* Liste des règles */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Règles Existantes</h4>
              <div className="space-y-3">
                {ruleEngine.getRules().map((rule) => {
                  const isEditing = editingRules[rule.id];
                  const parsed = parseRuleCondition(rule.condition);
                  
                  return (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => ruleEngine.toggleRule(rule.id)}
                          />
                          <h5 className="font-medium">{rule.nom}</h5>
                          <Badge variant={rule.gravite === 'high' ? 'destructive' : rule.gravite === 'medium' ? 'default' : 'secondary'}>
                            {rule.gravite}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{rule.type}</span>
                          {isEditing ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveRule(rule.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingRules(prev => ({ ...prev, [rule.id]: {} }))}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                      
                      {/* Condition éditable pour les règles simples */}
                      {parsed && rule.type === 'simple' ? (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono text-gray-700">{parsed.variable}</span>
                            <span className="text-sm font-mono text-gray-700">{parsed.operator}</span>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={isEditing.value ?? parsed.value}
                                onChange={(e) => handleUpdateRule(rule.id, 'condition', 
                                  formatRuleCondition(parsed.variable, parsed.operator, parseFloat(e.target.value))
                                )}
                                className="w-20 h-8 text-sm"
                                step="0.1"
                              />
                            ) : (
                              <span className="text-sm font-mono font-bold text-blue-600">{parsed.value}</span>
                            )}
                            <span className="text-sm font-mono text-gray-700">%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded px-3 py-2">
                          <code className="text-sm font-mono">{rule.condition}</code>
                        </div>
                      )}
                      
                      {/* Gravité éditable */}
                      {isEditing && (
                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Gravité:</span>
                          <Select
                            value={isEditing.gravite ?? rule.gravite}
                            onValueChange={(value) => handleUpdateRule(rule.id, 'gravite', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="budgets">Suivi Budgétaire</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderVueEnsemble()}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {renderAnalyseFinanciere()}
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            {renderBudgets()}
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
              {/* Total */}
              <div className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                <div className="text-center">
                  <p className="text-base font-medium text-emerald-700">Total Réalisé</p>
                  <p className="text-4xl font-bold text-emerald-800 mt-2">
                    {(financeOverviewData.realiseEconomiqueParPartner.total / 1000000).toFixed(2)}M€
                  </p>
                </div>
              </div>

              {/* Liste des Partners */}
              <div className="space-y-4">
                {financeOverviewData.realiseEconomiqueParPartner.partners.map((partner, index) => (
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

                    {/* Barre de progression */}
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

                    {/* Performance indicator */}
                    <div className="mt-4 flex items-center justify-center">
                      {partner.progression >= 98 ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Objectif atteint</span>
                        </div>
                      ) : partner.progression >= 95 ? (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Proche objectif</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="text-sm font-medium">Sous objectif</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200">
                <button className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium">
                  <Download className="w-5 h-5" />
                  <span>Exporter le rapport</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FinanceModern;
