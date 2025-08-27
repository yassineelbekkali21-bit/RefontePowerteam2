import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Target, Clock, Euro, FileText, BarChart3, Eye, Users, Zap, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Couleurs pour les graphiques
const COLORS = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6', '#F39C12'];

const ANALYSIS_COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Données financières modernes
const financeData = {
  budgets: {
    hourly: { current: 1250, target: 1500, percentage: 83.3 },
    economic: { current: 85000, target: 120000, percentage: 70.8 }
  },
  revenue2025: [
    { period: 'Q1', value: 45000, adjusted: 48500 },
    { period: 'Q2', value: 52000, adjusted: 49800 },
    { period: 'Q3', value: 48000, adjusted: 51200 }
  ],
  problematicFolders: [
    { name: 'Dossier Alpha', issue: 'Dépassement horaire', severity: 'high', amount: 2500 },
    { name: 'Projet Beta', issue: 'Dépassement volumétrie', severity: 'medium', amount: 1800 },
    { name: 'Client Gamma', issue: 'Rentabilité faible', severity: 'high', amount: 3200 },
    { name: 'Mission Delta', issue: 'Retard livraison', severity: 'low', amount: 950 }
  ],
  profitability: {
    topRentable: [
      { name: 'Projet Excellence', value: 15000 },
      { name: 'Mission Premium', value: 12500 },
      { name: 'Client VIP', value: 18000 }
    ],
    lessRentable: [
      { name: 'Projet Standard', value: 2500 },
      { name: 'Mission Basic', value: 1800 },
      { name: 'Client Regular', value: 3200 }
    ]
  }
};

// Données pour l'analyse financière par dossier
const mockClients = [
  {
    id: 1,
    name: 'SOJQ',
    suspect: true,
    severity: 'critical',
    budgetHoraire: 32,
    realiseHoraire: 18,
    pourcentageRealise: 30,
    chiffreAffaires: 2847,
    pourcentageCA: 66,
    facturationMin: 1500,
    ajustementRecommande: 35,
    tarifHoraire: 89,
    actions: ['Révision forfait urgente', 'Ajustement budget -35%']
  },
  {
    id: 2,
    name: 'MICHEL FRANCO',
    suspect: true,
    severity: 'warning',
    budgetHoraire: 45,
    realiseHoraire: 38,
    pourcentageRealise: 84,
    chiffreAffaires: 3200,
    pourcentageCA: 78,
    facturationMin: 2100,
    ajustementRecommande: 15,
    tarifHoraire: 95,
    actions: ['Ajustement budget +15h']
  },
  {
    id: 3,
    name: 'Othman Acco.',
    suspect: false,
    severity: 'stable',
    budgetHoraire: 28,
    realiseHoraire: 26,
    pourcentageRealise: 93,
    chiffreAffaires: 2400,
    pourcentageCA: 89,
    facturationMin: 1800,
    ajustementRecommande: 0,
    tarifHoraire: 85,
    actions: ['Performance conforme']
  }
];

const monthlyAnalysisData = [
  { month: 'Jan', budget: 3000, realise: 2800, facturation: 3200 },
  { month: 'Fév', budget: 3200, realise: 2900, facturation: 3100 },
  { month: 'Mar', budget: 3100, realise: 3300, facturation: 3400 },
  { month: 'Avr', budget: 3300, realise: 2700, facturation: 2900 },
  { month: 'Mai', budget: 3200, realise: 3100, facturation: 3350 },
  { month: 'Jun', budget: 3400, realise: 3200, facturation: 3500 }
];

const financeKPIs = [
  {
    title: "Budget Horaire",
    value: `${financeData.budgets.hourly.current.toLocaleString()} H`,
    trend: parseFloat((financeData.budgets.hourly.percentage - 70).toFixed(1)),
    description: `${financeData.budgets.hourly.percentage.toFixed(1)}% de l'objectif`,
    icon: Clock,
    variant: 'info' as const,
    details: { 
      current: financeData.budgets.hourly.current,
      target: financeData.budgets.hourly.target,
      percentage: financeData.budgets.hourly.percentage
    }
  },
  {
    title: "Budget Économique",
    value: `${(financeData.budgets.economic.current / 1000).toFixed(0)}K€`,
    trend: parseFloat((financeData.budgets.economic.percentage - 50).toFixed(1)),
    description: `${financeData.budgets.economic.percentage.toFixed(1)}% de l'objectif`,
    icon: Euro,
    variant: 'warning' as const,
    details: { 
      current: financeData.budgets.economic.current,
      target: financeData.budgets.economic.target,
      percentage: financeData.budgets.economic.percentage
    }
  },
  {
    title: "Dossiers Problématiques",
    value: financeData.problematicFolders.length.toString(),
    trend: -12.5,
    description: "dossiers à risque",
    icon: AlertTriangle,
    variant: 'warning' as const,
    details: { 
      total: financeData.problematicFolders.length,
      high_severity: financeData.problematicFolders.filter(f => f.severity === 'high').length,
      amount: financeData.problematicFolders.reduce((sum, f) => sum + f.amount, 0)
    }
  },
  {
    title: "Projets Rentables",
    value: financeData.profitability.topRentable.length.toString(),
    trend: 0,
    description: "top rentables",
    icon: TrendingUp,
    variant: 'success' as const,
    details: { 
      top_rentable: financeData.profitability.topRentable.length,
      less_rentable: financeData.profitability.lessRentable.length
    }
  }
];

// Données C.A 2025 adaptées
const revenueData = financeData.revenue2025.map(item => ({
  name: item.period,
  value: item.value,
  adjusted: item.adjusted
}));

// Données de rentabilité pour graphique
const profitabilityData = [
  { name: 'Top Rentables', value: financeData.profitability.topRentable.length },
  { name: 'Moins Rentables', value: financeData.profitability.lessRentable.length },
];

// Données des projets moins rentables
const lessRentableData = financeData.profitability.lessRentable.map((project, index) => ({
  id: `LR-${index + 1}`,
  name: project.name,
  value: `${project.value}€`,
  status: "Moins rentable",
  category: "Projet",
  profitability: "Faible"
}));

// Données des projets top rentables
const topRentableData = financeData.profitability.topRentable.map((project, index) => ({
  id: `TR-${index + 1}`,
  name: project.name,
  value: `${project.value.toLocaleString()}€`,
  status: "Top rentable",
  category: "Projet",
  profitability: "Élevée"
}));

const projectColumns = [
  { key: 'id', label: 'ID', type: 'text' as const },
  { key: 'name', label: 'Projet', type: 'text' as const },
  { key: 'value', label: 'Valeur', type: 'text' as const },
  { key: 'status', label: 'Statut', type: 'badge' as const, variant: 'default' },
  { key: 'profitability', label: 'Rentabilité', type: 'text' as const }
];

const Finance = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [analysisViewMode, setAnalysisViewMode] = useState<'synthese' | 'detaillee' | 'actions'>('synthese');

  const suspectClients = mockClients.filter(client => client.suspect);
  const criticalClients = mockClients.filter(client => client.severity === 'critical');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return ANALYSIS_COLORS.danger;
      case 'warning': return ANALYSIS_COLORS.warning;
      default: return ANALYSIS_COLORS.success;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header avec gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 via-blue-500 to-teal-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Finance</h1>
            <p className="text-green-100 mb-4">Gestion financière et analyse de rentabilité</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Année 2025
              </Badge>
              <span className="text-sm text-green-100">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Navigation par onglets */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="budgets">Budgets & C.A</TabsTrigger>
            <TabsTrigger value="analysis">Analyse par Dossier</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financeKPIs.map((kpi, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    kpi.variant === 'success' ? 'bg-green-100 text-green-600' :
                    kpi.variant === 'info' ? 'bg-blue-100 text-blue-600' :
                    kpi.variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
                {kpi.trend !== 0 && (
                  <div className={`flex items-center mt-2 text-sm ${
                    kpi.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${kpi.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(kpi.trend)}%
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sections Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Budget Horaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Actuel</span>
                  <span className="font-semibold">{financeData.budgets.hourly.current}H</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Objectif</span>
                  <span className="font-semibold">{financeData.budgets.hourly.target}H</span>
                </div>
                <Progress value={financeData.budgets.hourly.percentage} className="h-3" />
                <div className="text-center">
                  <Badge variant="default">{financeData.budgets.hourly.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-green-500" />
                Budget Économique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Actuel</span>
                  <span className="font-semibold">{financeData.budgets.economic.current.toLocaleString()}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Objectif</span>
                  <span className="font-semibold">{financeData.budgets.economic.target.toLocaleString()}€</span>
                </div>
                <Progress value={financeData.budgets.economic.percentage} className="h-3" />
                <div className="text-center">
                  <Badge variant="secondary">{financeData.budgets.economic.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* C.A 2025 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Chiffre d'Affaires 2025</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financeData.revenue2025.map((revenue, index) => {
                const contextualData = {
                  type: 'financial-entity' as const,
                  title: `C.A ${revenue.period}`,
                  data: {
                    period: revenue.period,
                    value: revenue.value,
                    adjusted: revenue.adjusted
                  },
                  details: {
                    periode: revenue.period,
                    valeur_initiale: `${revenue.value.toLocaleString()}€`,
                    valeur_ajustee: `${revenue.adjusted.toLocaleString()}€`,
                    difference: `${(revenue.adjusted - revenue.value).toLocaleString()}€`
                  }
                };

                return (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border cursor-pointer hover:bg-muted/30 transition-colors"
                    data-contextual={JSON.stringify(contextualData)}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">{revenue.period}</div>
                      <div className="text-lg font-bold">{revenue.value.toLocaleString()}€</div>
                      <div className="text-sm text-muted-foreground">
                        Ajusté: {revenue.adjusted.toLocaleString()}€
                      </div>
                      <Badge variant={revenue.adjusted > revenue.value ? "default" : "destructive"} className="mt-2">
                        {revenue.adjusted > revenue.value ? '+' : ''}{(revenue.adjusted - revenue.value).toLocaleString()}€
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                C.A 2025 - Évolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4A90E2" name="Valeur initiale" />
                  <Bar dataKey="adjusted" fill="#50C878" name="Valeur ajustée" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Répartition Rentabilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitabilityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {profitabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Rentabilité - Onglets Rentabilité / Encours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-destructive" />
                  <span>Projets Moins Rentables</span>
                </span>
                <Badge variant="destructive">{financeData.profitability.lessRentable.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financeData.profitability.lessRentable.slice(0, 5).map((project, index) => {
                  const contextualData = {
                    type: 'financial-entity' as const,
                    title: project.name,
                    data: {
                      name: project.name,
                      value: project.value,
                      type: 'Moins rentable'
                    },
                    details: {
                      nom_projet: project.name,
                      valeur: `${project.value}€`,
                      rentabilite: 'Faible',
                      statut: 'Moins rentable'
                    }
                  };

                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition-colors"
                      data-contextual={JSON.stringify(contextualData)}
                    >
                      <span className="text-sm font-medium">{project.name}</span>
                      <Badge variant="destructive">{project.value}€</Badge>
                    </div>
                  );
                })}
                {financeData.profitability.lessRentable.length > 5 && (
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    + {financeData.profitability.lessRentable.length - 5} autres projets moins rentables
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>Projets Top Rentables</span>
                </span>
                <Badge variant="default">{financeData.profitability.topRentable.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financeData.profitability.topRentable.map((project, index) => {
                  const contextualData = {
                    type: 'financial-entity' as const,
                    title: project.name,
                    data: {
                      name: project.name,
                      value: project.value,
                      type: 'Top rentable'
                    },
                    details: {
                      nom_projet: project.name,
                      valeur: `${project.value.toLocaleString()}€`,
                      rentabilite: 'Élevée',
                      statut: 'Top rentable'
                    }
                  };

                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition-colors"
                      data-contextual={JSON.stringify(contextualData)}
                    >
                      <span className="text-sm font-medium">{project.name}</span>
                      <Badge variant="default">{project.value.toLocaleString()}€</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Projets Top Rentables
                </span>
                <Badge variant="default">{financeData.profitability.topRentable.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {financeData.profitability.topRentable.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge variant="default">{project.value.toLocaleString()}€</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          {/* Onglet Budgets & C.A */}
          <TabsContent value="budgets" className="space-y-6">
            {/* Sections Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Budget Horaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actuel</span>
                      <span className="font-semibold">{financeData.budgets.hourly.current}H</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Objectif</span>
                      <span className="font-semibold">{financeData.budgets.hourly.target}H</span>
                    </div>
                    <Progress value={financeData.budgets.hourly.percentage} className="h-3" />
                    <div className="text-center">
                      <Badge variant="default">{financeData.budgets.hourly.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-green-500" />
                    Budget Économique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actuel</span>
                      <span className="font-semibold">{financeData.budgets.economic.current.toLocaleString()}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Objectif</span>
                      <span className="font-semibold">{financeData.budgets.economic.target.toLocaleString()}€</span>
                    </div>
                    <Progress value={financeData.budgets.economic.percentage} className="h-3" />
                    <div className="text-center">
                      <Badge variant="secondary">{financeData.budgets.economic.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* C.A 2025 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Chiffre d'Affaires 2025</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {financeData.revenue2025.map((revenue, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">{revenue.period}</div>
                        <div className="text-lg font-bold">{revenue.value.toLocaleString()}€</div>
                        <div className="text-sm text-muted-foreground">
                          Ajusté: {revenue.adjusted.toLocaleString()}€
                        </div>
                        <Badge variant={revenue.adjusted > revenue.value ? "default" : "destructive"} className="mt-2">
                          {revenue.adjusted > revenue.value ? '+' : ''}{(revenue.adjusted - revenue.value).toLocaleString()}€
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    C.A 2025 - Évolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4A90E2" name="Valeur initiale" />
                      <Bar dataKey="adjusted" fill="#50C878" name="Valeur ajustée" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Répartition Rentabilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={profitabilityData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {profitabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Analyse par Dossier */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 rounded-xl">
              {/* Header de l'analyse */}
              <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Analyse Financière par Dossier</h2>
                      <p className="text-blue-100 text-lg">Suivi intelligent budget vs réalisé</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-2xl font-bold">{suspectClients.length}</div>
                        <div className="text-sm text-blue-100">Clients suspects</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-2xl font-bold">{criticalClients.length}</div>
                        <div className="text-sm text-blue-100">Critiques</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              {/* Filtres et Navigation de l'analyse */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={analysisViewMode === 'synthese' ? 'default' : 'outline'}
                    onClick={() => setAnalysisViewMode('synthese')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Vue Synthèse
                  </Button>
                  <Button
                    variant={analysisViewMode === 'detaillee' ? 'default' : 'outline'}
                    onClick={() => setAnalysisViewMode('detaillee')}
                  >
                    Vue Détaillée
                  </Button>
                  <Button
                    variant={analysisViewMode === 'actions' ? 'default' : 'outline'}
                    onClick={() => setAnalysisViewMode('actions')}
                  >
                    Plan d'Actions
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    2025
                  </Button>
                </div>
              </div>

              {analysisViewMode === 'synthese' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Zone d'Alerte */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
                      Clients Suspects - Actions Urgentes
                    </h3>
                    
                    {mockClients.filter(client => client.suspect).map((client) => (
                      <Card 
                        key={client.id}
                        className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4"
                        style={{ borderLeftColor: getSeverityColor(client.severity) }}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-5 h-5 text-red-500" />
                              <span className="font-bold text-lg">{client.name}</span>
                            </div>
                            <Badge 
                              variant="secondary"
                              className="text-white"
                              style={{ backgroundColor: getSeverityColor(client.severity) }}
                            >
                              {getSeverityIcon(client.severity)}
                              <span className="ml-1 capitalize">{client.severity}</span>
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Tarif horaire</div>
                            <div className="font-bold text-blue-600">{client.tarifHoraire}€/h</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">{client.pourcentageRealise}%</div>
                            <div className="text-sm text-gray-500">Réalisé</div>
                            <Progress value={client.pourcentageRealise} className="mt-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{client.pourcentageCA}%</div>
                            <div className="text-sm text-gray-500">CA Facturé</div>
                            <Progress value={client.pourcentageCA} className="mt-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{client.ajustementRecommande}%</div>
                            <div className="text-sm text-gray-500">Ajustement</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{client.chiffreAffaires}€</div>
                            <div className="text-sm text-gray-500">CA Total</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {client.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              {action}
                            </Button>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Zone de Métriques */}
                  <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <h4 className="text-lg font-bold mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Performance Globale
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Budget Total</span>
                          <span className="font-bold text-blue-600">€18,900</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Réalisé</span>
                          <span className="font-bold text-green-600">€12,447</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Écart</span>
                          <span className="font-bold text-red-600">-€6,453</span>
                        </div>
                        <Progress value={66} className="mt-2" />
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="text-lg font-bold mb-4">Évolution Mensuelle</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={monthlyAnalysisData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Line type="monotone" dataKey="budget" stroke={ANALYSIS_COLORS.primary} strokeWidth={2} />
                          <Line type="monotone" dataKey="realise" stroke={ANALYSIS_COLORS.success} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              )}

              {analysisViewMode === 'actions' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h4 className="text-xl font-bold mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-red-500" />
                      Actions Critiques
                    </h4>
                    <div className="space-y-4">
                      {criticalClients.map((client) => (
                        <div key={client.id} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                          <div className="font-bold text-red-800">{client.name}</div>
                          <div className="text-sm text-red-600 mt-1">
                            Révision forfait urgente - Rentabilité critique
                          </div>
                          <Button size="sm" className="mt-2 bg-red-500 hover:bg-red-600">
                            Traiter maintenant
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="text-xl font-bold mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      Recommandations
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="font-medium text-green-800">Optimisation budgétaire</div>
                        <div className="text-sm text-green-600">3 clients nécessitent un ajustement</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="font-medium text-blue-800">Révision tarifaire</div>
                        <div className="text-sm text-blue-600">2 forfaits à revoir</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Finance;