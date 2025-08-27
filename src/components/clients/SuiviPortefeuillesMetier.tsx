/**
 * Composant Suivi des Portefeuilles Métier
 * Basé sur l'interface réelle du cabinet comptable
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Clock,
  BarChart3,
  PieChart,
  Eye,
  Filter,
  Download,
  RefreshCw,
  User,
  Building,
  Briefcase,
  UserPlus,
  UserMinus,
  Calculator,
  Euro,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Star,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, ComposedChart, Line, Area } from 'recharts';

// Types métier pour le Suivi des Portefeuilles
interface PortefeuilleMetier {
  id: string;
  nom: string; // Ex: "PORTFEUILLE - YASSINE EL BEKKALI"
  partner: string;
  gestionnaire: string;
  nombreDossiers: number;
  
  // Budgets vs Réalisé
  budgetHoraire: number; // heures budgétées
  budgetEconomique: number; // euros budgétés
  heuresRealisees: number; // heures réellement passées
  caRealise: number; // chiffre d'affaires réalisé
  
  // Mouvements clients
  departs: {
    nombre: number;
    impactEuros: number; // CA perdu
    tempsRestant: string; // Ex: "4h"
    details: Array<{
      client: string;
      date: string;
      motif: string;
      caPerdu: number;
    }>;
  };
  
  arrivees: {
    nombre: number;
    impactEuros: number; // CA gagné
    details: Array<{
      client: string;
      date: string;
      origine: string;
      caGagne: number;
    }>;
  };
  
  // Intervenants
  intervenants: Array<{
    initiales: string;
    nom: string;
    role: 'partner' | 'gestionnaire' | 'collaborateur' | 'stagiaire';
    heuresBudgetees: number;
    heuresRealisees: number;
    tauxHoraire: number;
    couleur: string;
  }>;
  
  // Métriques de performance
  tauxRealisationHoraire: number; // %
  tauxRealisationCA: number; // %
  satisfactionClient: number; // Note sur 5 étoiles
  couleurStatut: string;
}

// Données de démonstration basées sur l'interface réelle
const portefeuillesMetier: PortefeuilleMetier[] = [
  {
    id: '1',
    nom: 'PORTFEUILLE - ADOLPHE KOMEZA',
    partner: 'Julien',
    gestionnaire: 'Julien',
    nombreDossiers: 80,
    budgetHoraire: 2537,
    budgetEconomique: 218395,
    heuresRealisees: 1042,
    caRealise: 119685,
    departs: {
      nombre: 2,
      impactEuros: 15995,
      tempsRestant: '169h',
      details: [
        { client: 'SAS TechStart', date: '2024-01-15', motif: 'Changement cabinet', caPerdu: 8500 },
        { client: 'SARL Innovation', date: '2024-02-20', motif: 'Cessation activité', caPerdu: 7495 }
      ]
    },
    arrivees: {
      nombre: 1,
      impactEuros: 12500,
      details: [
        { client: 'EURL Digital', date: '2024-03-10', origine: 'Recommandation', caGagne: 12500 }
      ]
    },
    intervenants: [
      { initiales: 'AK', nom: 'Adolphe Komeza', role: 'partner', heuresBudgetees: 200, heuresRealisees: 85, tauxHoraire: 120, couleur: 'bg-blue-500' },
      { initiales: 'PG', nom: 'Pierre Garcia', role: 'gestionnaire', heuresBudgetees: 150, heuresRealisees: 120, tauxHoraire: 80, couleur: 'bg-green-500' },
      { initiales: 'AM', nom: 'Anne Martin', role: 'collaborateur', heuresBudgetees: 100, heuresRealisees: 95, tauxHoraire: 60, couleur: 'bg-purple-500' }
    ],
    tauxRealisationHoraire: 75,
    tauxRealisationCA: 50,
    satisfactionClient: 4.2,
    couleurStatut: 'text-green-600'
  },
  {
    id: '2',
    nom: 'PORTFEUILLE - VANISET ANISET',
    partner: 'Mohamed',
    gestionnaire: 'Mohamed',
    nombreDossiers: 67,
    budgetHoraire: 1394,
    budgetEconomique: 116637,
    heuresRealisees: 1962,
    caRealise: 117103,
    departs: {
      nombre: 3,
      impactEuros: 12170,
      tempsRestant: '138h',
      details: [
        { client: 'SARL Commerce', date: '2024-01-20', motif: 'Prix trop élevé', caPerdu: 5000 },
        { client: 'SCI Immobilier', date: '2024-02-15', motif: 'Restructuration', caPerdu: 4170 },
        { client: 'Auto Entreprise', date: '2024-03-05', motif: 'Changement activité', caPerdu: 3000 }
      ]
    },
    arrivees: {
      nombre: 2,
      impactEuros: 18500,
      details: [
        { client: 'SAS NewTech', date: '2024-02-28', origine: 'Prospection', caGagne: 12000 },
        { client: 'SARL Services', date: '2024-03-15', origine: 'Partenaire', caGagne: 6500 }
      ]
    },
    intervenants: [
      { initiales: 'VA', nom: 'Vaniset Aniset', role: 'partner', heuresBudgetees: 180, heuresRealisees: 165, tauxHoraire: 115, couleur: 'bg-orange-500' },
      { initiales: 'LM', nom: 'Louis Martin', role: 'gestionnaire', heuresBudgetees: 140, heuresRealisees: 135, tauxHoraire: 75, couleur: 'bg-cyan-500' },
      { initiales: 'SB', nom: 'Sophie Bernard', role: 'collaborateur', heuresBudgetees: 90, heuresRealisees: 88, tauxHoraire: 55, couleur: 'bg-pink-500' }
    ],
    tauxRealisationHoraire: 67,
    tauxRealisationCA: 35,
    satisfactionClient: 3.8,
    couleurStatut: 'text-orange-600'
  },
  {
    id: '3',
    nom: 'PORTFEUILLE - YASSINE EL BEKKALI',
    partner: 'Yassine',
    gestionnaire: 'Yassine',
    nombreDossiers: 52,
    budgetHoraire: 137,
    budgetEconomique: 9176,
    heuresRealisees: 155,
    caRealise: 5106,
    departs: {
      nombre: 5,
      impactEuros: 8500,
      tempsRestant: '4h',
      details: [
        { client: 'SARL Consulting', date: '2024-01-10', motif: 'Insatisfaction service', caPerdu: 2500 },
        { client: 'EURL Web', date: '2024-01-25', motif: 'Déménagement', caPerdu: 1800 },
        { client: 'SAS Digital', date: '2024-02-10', motif: 'Réduction coûts', caPerdu: 2200 },
        { client: 'SARL Export', date: '2024-02-28', motif: 'Changement stratégie', caPerdu: 1500 },
        { client: 'Auto Entrepreneur', date: '2024-03-12', motif: 'Cessation', caPerdu: 500 }
      ]
    },
    arrivees: {
      nombre: 0,
      impactEuros: 0,
      details: []
    },
    intervenants: [
      { initiales: 'YB', nom: 'Yassine El Bekkali', role: 'partner', heuresBudgetees: 50, heuresRealisees: 45, tauxHoraire: 100, couleur: 'bg-red-500' },
      { initiales: 'OT', nom: 'Omar Tahiri', role: 'gestionnaire', heuresBudgetees: 40, heuresRealisees: 35, tauxHoraire: 70, couleur: 'bg-yellow-500' },
      { initiales: 'EST', nom: 'Estelle Sanchez', role: 'collaborateur', heuresBudgetees: 30, heuresRealisees: 28, tauxHoraire: 50, couleur: 'bg-indigo-500' },
      { initiales: 'AK', nom: 'Amal Khoury', role: 'collaborateur', heuresBudgetees: 25, heuresRealisees: 22, tauxHoraire: 50, couleur: 'bg-teal-500' },
      { initiales: 'ET', nom: 'Emma Torres', role: 'stagiaire', heuresBudgetees: 20, heuresRealisees: 18, tauxHoraire: 25, couleur: 'bg-gray-500' },
      { initiales: 'MM', nom: 'Marc Moreau', role: 'collaborateur', heuresBudgetees: 15, heuresRealisees: 12, tauxHoraire: 45, couleur: 'bg-violet-500' }
    ],
    tauxRealisationHoraire: 38,
    tauxRealisationCA: 1,
    satisfactionClient: 2.5,
    couleurStatut: 'text-red-600'
  }
];

export default function SuiviPortefeuillesMetier() {
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('2024');
  const [partnerFiltre, setPartnerFiltre] = useState('all');
  const [vueActive, setVueActive] = useState<'overview' | 'details'>('overview');
  const [sidebarMouvements, setSidebarMouvements] = useState({
    isOpen: false,
    portefeuille: null as PortefeuilleMetier | null
  });

  // Filtrage des portefeuilles
  const portefeuillesFiltres = useMemo(() => {
    let filtered = portefeuillesMetier;
    
    if (partnerFiltre !== 'all') {
      filtered = filtered.filter(p => p.partner === partnerFiltre);
    }
    
    return filtered;
  }, [partnerFiltre]);

  // Métriques globales
  const metriquesGlobales = useMemo(() => {
    const totalBudgetHoraire = portefeuillesFiltres.reduce((sum, p) => sum + p.budgetHoraire, 0);
    const totalHeuresRealisees = portefeuillesFiltres.reduce((sum, p) => sum + p.heuresRealisees, 0);
    const totalBudgetEconomique = portefeuillesFiltres.reduce((sum, p) => sum + p.budgetEconomique, 0);
    const totalCARealise = portefeuillesFiltres.reduce((sum, p) => sum + p.caRealise, 0);
    const totalDeparts = portefeuillesFiltres.reduce((sum, p) => sum + p.departs.nombre, 0);
    const totalArrivees = portefeuillesFiltres.reduce((sum, p) => sum + p.arrivees.nombre, 0);
    const impactDeparts = portefeuillesFiltres.reduce((sum, p) => sum + p.departs.impactEuros, 0);
    const impactArrivees = portefeuillesFiltres.reduce((sum, p) => sum + p.arrivees.impactEuros, 0);
    
    return {
      totalBudgetHoraire,
      totalHeuresRealisees,
      tauxRealisationHoraire: totalBudgetHoraire > 0 ? Math.round((totalHeuresRealisees / totalBudgetHoraire) * 100) : 0,
      totalBudgetEconomique,
      totalCARealise,
      tauxRealisationCA: totalBudgetEconomique > 0 ? Math.round((totalCARealise / totalBudgetEconomique) * 100) : 0,
      totalDeparts,
      totalArrivees,
      soldeClients: totalArrivees - totalDeparts,
      impactDeparts,
      impactArrivees,
      soldeMouvement: impactArrivees - impactDeparts
    };
  }, [portefeuillesFiltres]);

  // Données pour les graphiques
  const donneesGraphique = useMemo(() => {
    return portefeuillesFiltres.map(p => ({
      nom: p.nom.replace('PORTFEUILLE - ', ''),
      budgetHoraire: p.budgetHoraire,
      heuresRealisees: p.heuresRealisees,
      budgetEconomique: p.budgetEconomique / 1000, // en milliers
      caRealise: p.caRealise / 1000,
      departs: p.departs.nombre,
      arrivees: p.arrivees.nombre,
      tauxRealisation: p.tauxRealisationCA
    }));
  }, [portefeuillesFiltres]);

  // Couleurs pour les graphiques
  const COULEURS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  // Fonction pour ouvrir la sidebar des mouvements
  const ouvrirSidebarMouvements = (portefeuille: PortefeuilleMetier) => {
    console.log('🔍 Ouverture sidebar pour:', portefeuille.nom);
    setSidebarMouvements({
      isOpen: true,
      portefeuille
    });
  };

  // Fonction pour fermer la sidebar
  const fermerSidebarMouvements = () => {
    setSidebarMouvements({
      isOpen: false,
      portefeuille: null
    });
  };

  // Fonction pour rendre les étoiles de satisfaction
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  // Rendu d'une carte portefeuille (refactorisée pour mettre l'accent sur les métriques importantes)
  const renderPortefeuilleCard = (portefeuille: PortefeuilleMetier) => (
    <Card key={portefeuille.id} className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-bold text-gray-900 mb-2">
              {portefeuille.nom}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Partner: {portefeuille.partner}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {portefeuille.nombreDossiers} dossiers
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* BUDGET ÉCONOMIQUE - Métrique principale */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-700">Budget Économique</span>
            <span className="text-2xl font-bold text-blue-800">{portefeuille.budgetEconomique.toLocaleString()}€</span>
          </div>
          <Progress value={portefeuille.tauxRealisationCA} className="h-3 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">Réalisé: {portefeuille.caRealise.toLocaleString()}€</span>
            <span className={`text-lg font-bold ${portefeuille.tauxRealisationCA >= 75 ? 'text-green-700' : portefeuille.tauxRealisationCA >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
              {portefeuille.tauxRealisationCA}%
            </span>
          </div>
        </div>

        {/* MOUVEMENTS CLIENTS - Métriques importantes (Cliquables) */}
        <div 
          className="grid grid-cols-2 gap-4 cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => ouvrirSidebarMouvements(portefeuille)}
          title="Cliquez pour voir le détail des mouvements"
        >
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserMinus className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-700">CA Perdu</span>
            </div>
            <div className="text-3xl font-bold text-red-800 mb-1">-{(portefeuille.departs.impactEuros / 1000).toFixed(0)}k€</div>
            <div className="text-sm font-medium text-red-600">{portefeuille.departs.nombre} départ{portefeuille.departs.nombre > 1 ? 's' : ''}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">CA Gagné</span>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-1">+{(portefeuille.arrivees.impactEuros / 1000).toFixed(0)}k€</div>
            <div className="text-sm font-medium text-green-600">{portefeuille.arrivees.nombre} arrivée{portefeuille.arrivees.nombre > 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* SATISFACTION CLIENT */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-yellow-700">Satisfaction Client</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(portefeuille.satisfactionClient)}
              </div>
              <span className="text-lg font-bold text-yellow-800">{portefeuille.satisfactionClient}/5</span>
            </div>
          </div>
        </div>

        {/* Budget horaire - Métrique secondaire */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Budget Horaire</span>
            <span className="text-lg font-bold text-blue-600">{portefeuille.budgetHoraire}h</span>
          </div>
          <Progress value={portefeuille.tauxRealisationHoraire} className="h-2 mb-1" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Réalisé: {portefeuille.heuresRealisees}h</span>
            <span className={`font-medium ${portefeuille.tauxRealisationHoraire >= 75 ? 'text-green-600' : portefeuille.tauxRealisationHoraire >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
              {portefeuille.tauxRealisationHoraire}%
            </span>
          </div>
        </div>

        {/* Intervenants - Information complémentaire */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Intervenants ({portefeuille.intervenants.length})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {portefeuille.intervenants.map((intervenant, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full ${intervenant.couleur} text-white text-sm font-medium flex items-center justify-center shadow-sm`}
                title={`${intervenant.nom} - ${intervenant.role} - ${intervenant.heuresRealisees}/${intervenant.heuresBudgetees}h`}
              >
                {intervenant.initiales}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi des Portefeuilles</h1>
          <p className="text-gray-600">Analyse des performances par gestionnaire</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={partnerFiltre} onValueChange={setPartnerFiltre}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Partner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les partners</SelectItem>
              <SelectItem value="Julien">Julien</SelectItem>
              <SelectItem value="Mohamed">Mohamed</SelectItem>
              <SelectItem value="Yassine">Yassine</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={periodeSelectionnee} onValueChange={setPeriodeSelectionnee}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="Q4-2024">Q4 2024</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs Globaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA Budgété</p>
                <p className="text-2xl font-bold text-blue-600">{(metriquesGlobales.totalBudgetEconomique / 1000).toFixed(0)}k€</p>
                <p className="text-xs text-gray-500">Budget total portefeuilles</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CA Réalisé</p>
                <p className="text-2xl font-bold text-green-600">{(metriquesGlobales.totalCARealise / 1000).toFixed(0)}k€</p>
                <p className="text-xs text-gray-500">Réalisation totale ({metriquesGlobales.tauxRealisationCA}%)</p>
              </div>
              <Euro className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde Clients</p>
                <p className={`text-2xl font-bold ${metriquesGlobales.soldeClients >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metriquesGlobales.soldeClients >= 0 ? '+' : ''}{metriquesGlobales.soldeClients}
                </p>
                <p className="text-xs text-gray-500">{metriquesGlobales.totalArrivees} arrivées, {metriquesGlobales.totalDeparts} départs</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Financier</p>
                <p className={`text-2xl font-bold ${metriquesGlobales.soldeMouvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metriquesGlobales.soldeMouvement >= 0 ? '+' : ''}{(metriquesGlobales.soldeMouvement / 1000).toFixed(0)}k€
                </p>
                <p className="text-xs text-gray-500">Mouvements clients</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation des vues */}
      <Tabs value={vueActive} onValueChange={(value) => setVueActive(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails par portefeuille</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Graphiques de performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Budgets vs Réalisé (Heures)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donneesGraphique}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budgetHoraire" fill="#3B82F6" name="Budget (h)" />
                    <Bar dataKey="heuresRealisees" fill="#10B981" name="Réalisé (h)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Répartition CA par Portefeuille
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={donneesGraphique}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="caRealise"
                      nameKey="nom"
                    >
                      {donneesGraphique.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COULEURS[index % COULEURS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}k€`} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {portefeuillesFiltres.map(renderPortefeuilleCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Sidebar contextuelle des mouvements */}
      {sidebarMouvements.isOpen && sidebarMouvements.portefeuille && (
        <div className="fixed inset-0 z-[9999] flex" style={{ zIndex: 9999 }}>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={fermerSidebarMouvements}
          ></div>
          
                {/* Sidebar */}
      <div className="ml-auto w-96 max-w-[90vw] bg-white shadow-2xl h-full overflow-y-auto relative z-[10000]">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mouvements Clients</h3>
                  <p className="text-sm text-gray-600 mt-1">{sidebarMouvements.portefeuille.nom}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fermerSidebarMouvements}
                  className="rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* Résumé des mouvements */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                  <div className="text-2xl font-bold text-red-800 mb-1">
                    -{(sidebarMouvements.portefeuille.departs.impactEuros / 1000).toFixed(0)}k€
                  </div>
                  <div className="text-sm text-red-600">
                    {sidebarMouvements.portefeuille.departs.nombre} départ{sidebarMouvements.portefeuille.departs.nombre > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <div className="text-2xl font-bold text-green-800 mb-1">
                    +{(sidebarMouvements.portefeuille.arrivees.impactEuros / 1000).toFixed(0)}k€
                  </div>
                  <div className="text-sm text-green-600">
                    {sidebarMouvements.portefeuille.arrivees.nombre} arrivée{sidebarMouvements.portefeuille.arrivees.nombre > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Détail des départs */}
              {sidebarMouvements.portefeuille.departs.details.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <UserMinus className="w-4 h-4" />
                    Départs ({sidebarMouvements.portefeuille.departs.nombre})
                  </h4>
                  <div className="space-y-3">
                    {sidebarMouvements.portefeuille.departs.details.map((depart, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">{depart.client}</div>
                          <div className="text-sm font-bold text-red-600">-{depart.caPerdu.toLocaleString()}€</div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{depart.motif}</div>
                        <div className="text-xs text-gray-500">{new Date(depart.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Détail des arrivées */}
              {sidebarMouvements.portefeuille.arrivees.details.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Arrivées ({sidebarMouvements.portefeuille.arrivees.nombre})
                  </h4>
                  <div className="space-y-3">
                    {sidebarMouvements.portefeuille.arrivees.details.map((arrivee, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900">{arrivee.client}</div>
                          <div className="text-sm font-bold text-green-600">+{arrivee.caGagne.toLocaleString()}€</div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{arrivee.origine}</div>
                        <div className="text-xs text-gray-500">{new Date(arrivee.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message si pas de mouvements */}
              {sidebarMouvements.portefeuille.departs.details.length === 0 && 
               sidebarMouvements.portefeuille.arrivees.details.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun mouvement client pour cette période</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
