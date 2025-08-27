import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  DollarSign,
  Clock,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Mock data pour la démonstration
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

const monthlyData = [
  { month: 'Jan', budget: 3000, realise: 2800, facturation: 3200 },
  { month: 'Fév', budget: 3200, realise: 2900, facturation: 3100 },
  { month: 'Mar', budget: 3100, realise: 3300, facturation: 3400 },
  { month: 'Avr', budget: 3300, realise: 2700, facturation: 2900 },
  { month: 'Mai', budget: 3200, realise: 3100, facturation: 3350 },
  { month: 'Jun', budget: 3400, realise: 3200, facturation: 3500 }
];

const FinancialAnalysis: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'synthese' | 'detaillee' | 'actions'>('synthese');

  const suspectClients = mockClients.filter(client => client.suspect);
  const criticalClients = mockClients.filter(client => client.severity === 'critical');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return COLORS.danger;
      case 'warning': return COLORS.warning;
      default: return COLORS.success;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header moderne */}
      <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analyse Financière par Dossier</h1>
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

      {/* Filtres et Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={viewMode === 'synthese' ? 'default' : 'outline'}
            onClick={() => setViewMode('synthese')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Vue Synthèse
          </Button>
          <Button
            variant={viewMode === 'detaillee' ? 'default' : 'outline'}
            onClick={() => setViewMode('detaillee')}
          >
            Vue Détaillée
          </Button>
          <Button
            variant={viewMode === 'actions' ? 'default' : 'outline'}
            onClick={() => setViewMode('actions')}
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

      {viewMode === 'synthese' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone d'Alerte */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
              Clients Suspects - Actions Urgentes
            </h2>
            
            {mockClients.filter(client => client.suspect).map((client) => (
              <Card 
                key={client.id}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4"
                style={{ borderLeftColor: getSeverityColor(client.severity) }}
                onClick={() => setSelectedClient(client)}
                data-contextual={JSON.stringify({
                  type: 'client_analysis',
                  title: `Analyse ${client.name}`,
                  data: client
                })}
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
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance Globale
              </h3>
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
              <h3 className="text-lg font-bold mb-4">Évolution Mensuelle</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line type="monotone" dataKey="budget" stroke={COLORS.primary} strokeWidth={2} />
                  <Line type="monotone" dataKey="realise" stroke={COLORS.success} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'actions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-red-500" />
              Actions Critiques
            </h3>
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
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Recommandations
            </h3>
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
    </DashboardLayout>
  );
};

export default FinancialAnalysis;
