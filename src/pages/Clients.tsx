import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import CapacityPlanning from '@/components/clients/CapacityPlanning';
import SuiviPortefeuilles from '@/components/clients/SuiviPortefeuilles';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Settings, 
  Plus, 
  TrendingUp, 
  Clock, 
  DollarSign,
  FileText,
  Calendar,
  User,
  Building,
  UserPlus,
  UserMinus,
  UserX,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Save,
  UserCheck,
  Briefcase,
  Euro,
  Edit,
  BarChart3,
  PieChart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Mock data pour les clients
const mockClients = [
  {
    id: 1,
    name: 'Dr. Martin Dubois',
    type: 'Médecin',
    gestionnaire: 'Sophie Laurent',
    encodage: 'Marie Durand',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 120,
    budgetEconomique: 8500,
    budgetVolumetrique: 450,
    realiseHoraire: 98,
    realiseEconomique: 7200,
    realiseVolumetrique: 380,
    avancement: 75,
    lastActivity: '2025-01-15',
    phone: '+33 1 23 45 67 89',
    email: 'dr.dubois@cabinet-medical.fr',
    address: '15 rue de la Santé, 75014 Paris'
  },
  {
    id: 2,
    name: 'Cabinet Dentaire Smile',
    type: 'Dentiste',
    gestionnaire: 'Pierre Martin',
    encodage: 'Julie Bernard',
    superviseur: 'Jean Moreau',
    status: 'En partance',
    budgetHoraire: 85,
    budgetEconomique: 6200,
    budgetVolumetrique: 320,
    realiseHoraire: 92,
    realiseEconomique: 6800,
    realiseVolumetrique: 410,
    avancement: 85,
    lastActivity: '2025-01-10',
    phone: '+33 1 34 56 78 90',
    email: 'contact@cabinet-smile.fr',
    address: '8 avenue des Dents, 92100 Boulogne'
  },
  {
    id: 3,
    name: 'Kiné Plus Rééducation',
    type: 'Kinésithérapeute',
    gestionnaire: 'Sophie Laurent',
    encodage: 'Thomas Petit',
    superviseur: 'Anne Dubois',
    status: 'À suivre',
    budgetHoraire: 95,
    budgetEconomique: 7100,
    budgetVolumetrique: 280,
    realiseHoraire: 88,
    realiseEconomique: 6900,
    realiseVolumetrique: 275,
    avancement: 92,
    lastActivity: '2025-01-18',
    phone: '+33 1 45 67 89 01',
    email: 'info@kine-plus.fr',
    address: '22 rue du Mouvement, 75015 Paris'
  },
  {
    id: 4,
    name: 'Productions Créatives SARL',
    type: 'Production Cinéma',
    gestionnaire: 'Marie Durand',
    encodage: 'Sophie Laurent',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 180,
    budgetEconomique: 15000,
    budgetVolumetrique: 650,
    realiseHoraire: 165,
    realiseEconomique: 14200,
    realiseVolumetrique: 580,
    avancement: 68,
    lastActivity: '2025-01-20',
    phone: '+33 1 56 78 90 12',
    email: 'contact@prod-creatives.fr',
    address: '45 rue du Cinéma, 75011 Paris'
  },
  {
    id: 5,
    name: 'Artiste Peintre Léa Moreau',
    type: 'Artiste',
    gestionnaire: 'Pierre Martin',
    encodage: 'Marie Durand',
    superviseur: 'Anne Dubois',
    status: 'Récupéré',
    budgetHoraire: 65,
    budgetEconomique: 4800,
    budgetVolumetrique: 180,
    realiseHoraire: 58,
    realiseEconomique: 4200,
    realiseVolumetrique: 165,
    avancement: 88,
    lastActivity: '2025-01-12',
    phone: '+33 1 67 89 01 23',
    email: 'lea.moreau.art@gmail.com',
    address: '12 impasse des Artistes, 75018 Paris'
  }
];

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list');
  const [showBudgetManagement, setShowBudgetManagement] = useState(false);
  const [showClientSettings, setShowClientSettings] = useState(false);
  const [budgetStep, setBudgetStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('nouveau');
  const [activeTab, setActiveTab] = useState('liste');
  const [filters, setFilters] = useState({
    gestionnaire: '',
    type: '',
    status: '',
    search: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En partance': return 'bg-red-100 text-red-800';
      case 'À suivre': return 'bg-yellow-100 text-yellow-800';
      case 'Récupéré': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvancementColor = (avancement: number) => {
    if (avancement >= 90) return COLORS.success;
    if (avancement >= 70) return COLORS.warning;
    return COLORS.danger;
  };

  const filteredClients = mockClients.filter(client => {
    return (
      (filters.gestionnaire === '' || client.gestionnaire.includes(filters.gestionnaire)) &&
      (filters.type === '' || client.type === filters.type) &&
      (filters.status === '' || client.status === filters.status) &&
      (filters.search === '' || client.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        {/* Header moderne */}
        <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Gestion des Clients</h1>
                <p className="text-blue-100 text-lg">Cabinet comptable - Professions libérales</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{mockClients.length}</div>
                  <div className="text-sm text-blue-100">Clients total</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{mockClients.filter(c => c.status === 'Actif').length}</div>
                  <div className="text-sm text-blue-100">Actifs</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* ONGLETS DE NAVIGATION */}
        <div className="mb-8 bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
          <h2 className="text-lg font-bold mb-4 text-gray-800">NAVIGATION ONGLETS</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('liste')}
              className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                activeTab === 'liste' 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
              }`}
            >
              📋 Liste des Clients
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                activeTab === 'capacity' 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
              }`}
            >
              📊 Capacity Planning
            </button>
            <button
              onClick={() => setActiveTab('portefeuilles')}
              className={`px-6 py-3 rounded-lg font-semibold border-2 ${
                activeTab === 'portefeuilles' 
                  ? 'bg-blue-500 text-white border-blue-600' 
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
              }`}
            >
              📈 Suivi des Portefeuilles
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Onglet actuel: <strong>{activeTab}</strong>
          </p>
        </div>

        {/* Navigation avec boutons d'actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              {activeTab === 'liste' && selectedClient && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'detail' ? 'default' : 'outline'}
                    onClick={() => setViewMode('detail')}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Fiche Client
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    onClick={() => setShowBudgetManagement(true)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Gestion Budget</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                    onClick={() => setShowClientSettings(true)}
                  >
                    <User className="h-4 w-4" />
                    <span>Paramétrage Client</span>
                  </Button>
                </div>
              )}
              
              {activeTab === 'liste' && (
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Client
                </Button>
              )}
            </div>
          </div>

        </div>

        {/* Contenu des onglets */}
        {activeTab === 'liste' && (
          <div className="space-y-6">
            <div className="bg-green-100 p-3 rounded-lg border-2 border-green-300">
              <p className="text-green-800 font-semibold">✅ ONGLET ACTIF: Liste des Clients</p>
            </div>
            {/* Zone de filtres */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Nom du client..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gestionnaire</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.gestionnaire}
                      onChange={(e) => setFilters({...filters, gestionnaire: e.target.value})}
                    >
                      <option value="">Tous</option>
                      <option value="Sophie Laurent">Sophie Laurent</option>
                      <option value="Pierre Martin">Pierre Martin</option>
                      <option value="Marie Durand">Marie Durand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de client</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                      <option value="">Tous</option>
                      <option value="Médecin">Médecin</option>
                      <option value="Dentiste">Dentiste</option>
                      <option value="Kinésithérapeute">Kinésithérapeute</option>
                      <option value="Artiste">Artiste</option>
                      <option value="Production Cinéma">Production Cinéma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Statut</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="">Tous</option>
                      <option value="Actif">Actif</option>
                      <option value="En partance">En partance</option>
                      <option value="À suivre">À suivre</option>
                      <option value="Récupéré">Récupéré</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des clients */}
            {viewMode === 'list' && (
          <div className="grid gap-6">
            {filteredClients.map((client) => (
              <Card 
                key={client.id} 
                className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden relative"
                onClick={() => {
                  setSelectedClient(client);
                  setViewMode('detail');
                }}
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Bordure animée */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between">
                    {/* Section gauche - Infos client */}
                    <div className="flex items-center space-x-6">
                      {/* Avatar avec gradient animé */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                          {client.name.charAt(0)}
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Infos textuelles */}
                      <div className="space-y-1">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{client.name}</h3>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 font-medium px-3 py-1">
                            {client.type}
                          </Badge>
                          <span className="text-gray-600 text-sm">ID: #{client.id.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{client.gestionnaire}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{client.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section centrale - Métriques */}
                    <div className="flex items-center space-x-8">
                      {/* Budget Horaire */}
                      <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 min-w-[100px] group-hover:shadow-lg transition-shadow duration-300">
                        <div className="text-2xl font-bold text-blue-600">{client.budgetHoraire}h</div>
                        <div className="text-xs text-blue-500 font-medium">Budget H.</div>
                        <div className="text-xs text-gray-500 mt-1">{client.realiseHoraire}h réalisé</div>
                      </div>
                      
                      {/* Budget Économique */}
                      <div className="text-center bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 min-w-[120px] group-hover:shadow-lg transition-shadow duration-300">
                        <div className="text-2xl font-bold text-emerald-600">{(client.budgetEconomique / 1000).toFixed(1)}k€</div>
                        <div className="text-xs text-emerald-500 font-medium">Budget €</div>
                        <div className="text-xs text-gray-500 mt-1">{(client.realiseEconomique / 1000).toFixed(1)}k€ réalisé</div>
                      </div>
                      
                      {/* Volumétrie */}
                      <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 min-w-[100px] group-hover:shadow-lg transition-shadow duration-300">
                        <div className="text-2xl font-bold text-purple-600">{client.budgetVolumetrique}</div>
                        <div className="text-xs text-purple-500 font-medium">Volumétrie</div>
                        <div className="text-xs text-gray-500 mt-1">{client.realiseVolumetrique} réalisé</div>
                      </div>
                    </div>
                    
                    {/* Section droite - Statut et avancement */}
                    <div className="flex items-center space-x-6">
                      {/* Avancement moderne avec barre et métriques */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 min-w-[140px]">
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-slate-700">{client.avancement}%</div>
                          <div className="text-xs text-slate-500 font-medium">Avancement</div>
                        </div>
                        
                        {/* Barre de progression moderne */}
                        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${client.avancement}%` }}
                          ></div>
                          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                        
                        {/* Métriques rapides */}
                        <div className="flex justify-between mt-3 text-xs text-slate-600">
                          <span>{client.realiseHoraire}h</span>
                          <span>{(client.realiseEconomique / 1000).toFixed(1)}k€</span>
                        </div>
                      </div>
                      {/* Badge de statut avec animation */}
                      <div className="flex flex-col items-center space-y-2">
                        <Badge 
                          variant={client.status === 'Actif' ? 'default' : client.status === 'En partance' ? 'destructive' : 'secondary'}
                          className={`px-4 py-2 font-semibold text-sm rounded-xl shadow-lg transition-all duration-300 ${
                            client.status === 'Actif' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
                              : client.status === 'En partance'
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
                          }`}
                        >
                          {client.status}
                        </Badge>
                        
                        {/* Indicateur de budgétisation */}
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            client.status === 'Budgétisation complète' 
                              ? 'bg-green-500 animate-pulse' 
                              : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs text-gray-500">Budgétisation complète</span>
                        </div>
                      </div>
                      
                      {/* Avatars équipe */}
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                          {client.gestionnaire.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                          {client.encodage.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                          {client.superviseur.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
            )}

            {/* Fiche client détaillée */}
        {viewMode === 'detail' && selectedClient ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Informations client - Colonne gauche */}
            <div className="col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {selectedClient?.name?.charAt(0) || 'C'}
                    </div>
                    <h3 className="font-bold text-lg">{selectedClient?.name || 'Client'}</h3>
                    <p className="text-gray-600 text-sm">{selectedClient?.type || 'Type'}</p>
                    <Badge className={`${getStatusColor(selectedClient?.status || 'Actif')} mt-2`}>
                      {selectedClient?.status || 'Actif'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedClient?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-xs">{selectedClient?.address || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Gestionnaire:</span>
                      <div className="text-gray-800">{selectedClient?.gestionnaire || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Encodage:</span>
                      <div className="text-gray-800">{selectedClient?.encodage || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Superviseur:</span>
                      <div className="text-gray-800">{selectedClient?.superviseur || 'N/A'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section centrale - Budgets détaillés */}
            <div className="col-span-6 space-y-6">
              {/* Confrontation Budget vs Réalisé */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-sm">Budget vs Réalisé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Confrontation Horaire */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-800">Budget Horaire</h4>
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-700">{selectedClient?.budgetHoraire || 120}h</div>
                            <div className="text-xs text-blue-600">Budgété</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-700">{selectedClient?.realiseHoraire || 98}h</div>
                            <div className="text-xs text-green-600">Réalisé</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${
                              (selectedClient?.realiseHoraire || 98) <= (selectedClient?.budgetHoraire || 120) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {((selectedClient?.realiseHoraire || 98) - (selectedClient?.budgetHoraire || 120)) >= 0 ? '+' : ''}
                              {(selectedClient?.realiseHoraire || 98) - (selectedClient?.budgetHoraire || 120)}h
                            </div>
                            <div className="text-xs text-gray-600">Écart</div>
                          </div>
                        </div>
                        
                        {/* Barre de progression horaire */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-blue-600 mb-1">
                            <span>Progression</span>
                            <span>{Math.round(((selectedClient?.realiseHoraire || 98) / (selectedClient?.budgetHoraire || 120)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((selectedClient?.realiseHoraire || 98) / (selectedClient?.budgetHoraire || 120)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Confrontation Économique */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-emerald-800">Budget Économique</h4>
                          <Euro className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-emerald-700">{((selectedClient?.budgetEconomique || 8500) / 1000).toFixed(1)}k€</div>
                            <div className="text-xs text-emerald-600">Budgété</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-700">{((selectedClient?.realiseEconomique || 7200) / 1000).toFixed(1)}k€</div>
                            <div className="text-xs text-green-600">Réalisé</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${
                              (selectedClient?.realiseEconomique || 7200) <= (selectedClient?.budgetEconomique || 8500) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {((selectedClient?.realiseEconomique || 7200) - (selectedClient?.budgetEconomique || 8500)) >= 0 ? '+' : ''}
                              {(((selectedClient?.realiseEconomique || 7200) - (selectedClient?.budgetEconomique || 8500)) / 1000).toFixed(1)}k€
                            </div>
                            <div className="text-xs text-gray-600">Écart</div>
                          </div>
                        </div>
                        
                        {/* Barre de progression économique */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-emerald-600 mb-1">
                            <span>Progression</span>
                            <span>{Math.round(((selectedClient?.realiseEconomique || 7200) / (selectedClient?.budgetEconomique || 8500)) * 100)}%</span>
                          </div>
                          <div className="w-full bg-emerald-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(((selectedClient?.realiseEconomique || 7200) / (selectedClient?.budgetEconomique || 8500)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-sm">Volumétrie Budget vs Réalisé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-600 border-b pb-2">
                        <div>Type de document</div>
                        <div className="text-center">Budget</div>
                        <div className="text-center">Réalisé</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium">Achats</span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">180</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">165</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                            <div className="text-xs text-red-600 mt-1">-15 docs</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Ventes</span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">320</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">342</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '107%'}}></div>
                            </div>
                            <div className="text-xs text-orange-600 mt-1">+22 docs</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-medium">Banques CODA</span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">85</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">92</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: '108%'}}></div>
                            </div>
                            <div className="text-xs text-orange-600 mt-1">+7 docs</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium">Banques non CODA</span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">45</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">38</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-orange-500 h-2 rounded-full" style={{width: '84%'}}></div>
                            </div>
                            <div className="text-xs text-red-600 mt-1">-7 docs</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium">Rémunérations</span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-800">25</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">25</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-red-500 h-2 rounded-full" style={{width: '100%'}}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">±0 docs</div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-3 mt-4">
                        <div className="grid grid-cols-3 gap-4 font-bold text-gray-800">
                          <div>TOTAL</div>
                          <div className="text-center">655</div>
                          <div className="text-center">662</div>
                        </div>
                        <div className="text-center text-sm text-orange-600 mt-1">
                          Écart global: +7 documents (+1.1%)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar droite - Avancement et activités */}
              <div className="col-span-3 space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Avancement Global</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Réalisé', value: selectedClient.avancement },
                              { name: 'Restant', value: 100 - selectedClient.avancement }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                          >
                            <Cell fill={getAvancementColor(selectedClient.avancement)} />
                            <Cell fill="#E5E7EB" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-2xl font-bold mt-2" style={{ color: getAvancementColor(selectedClient.avancement) }}>
                        {selectedClient.avancement}%
                <CardHeader>
                  <CardTitle className="text-lg">Avancement Global</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Réalisé', value: selectedClient.avancement },
                            { name: 'Restant', value: 100 - selectedClient.avancement }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          startAngle={90}
                          endAngle={450}
                          dataKey="value"
                        >
                          <Cell fill={getAvancementColor(selectedClient.avancement)} />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-2xl font-bold mt-2" style={{ color: getAvancementColor(selectedClient.avancement) }}>
                      {selectedClient.avancement}%
                    </div>
                    <div className="text-sm text-gray-600">Avancement global</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Dernières Activités</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Comptabilité mise à jour</div>
                        <div className="text-gray-500 text-xs">Il y a 2h - Sophie Laurent</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Documents reçus</div>
                        <div className="text-gray-500 text-xs">Il y a 1j - Marie Durand</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Révision budget</div>
                        <div className="text-gray-500 text-xs">Il y a 3j - Jean Moreau</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Appel client</div>
                        <div className="text-gray-500 text-xs">Il y a 5j - Pierre Martin</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start text-sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier la fiche
                  </Button>
                  <Button className="w-full justify-start text-sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Gestion budget
                  </Button>
                  <Button className="w-full justify-start text-sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan de correction
                  </Button>
                  <Button className="w-full justify-start text-sm" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Recouvrement
                  </Button>
                  <Button className="w-full justify-start text-sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Planifier RDV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
            ) : null}
          </div>
        )}

        {/* Onglet Capacity Planning */}
        {activeTab === 'capacity' && (
          <div>
            <div className="bg-blue-100 p-3 rounded-lg border-2 border-blue-300 mb-6">
              <p className="text-blue-800 font-semibold">✅ ONGLET ACTIF: Capacity Planning</p>
            </div>
            <CapacityPlanning />
          </div>
        )}

        {/* Onglet Suivi des Portefeuilles */}
        {activeTab === 'portefeuilles' && (
          <div>
            <div className="bg-purple-100 p-3 rounded-lg border-2 border-purple-300 mb-6">
              <p className="text-purple-800 font-semibold">✅ ONGLET ACTIF: Suivi des Portefeuilles</p>
            </div>
            <SuiviPortefeuilles />
          </div>
        )}

        {/* Gestion du budget */}
        {viewMode === 'budget' && selectedClient ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Budgétisation Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Horaire (heures)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedClient.budgetHoraire}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Économique (€)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedClient.budgetEconomique}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Volumétrique</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedClient.budgetVolumetrique}
                  />
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Répartition Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Horaire', value: selectedClient.budgetHoraire },
                        { name: 'Économique', value: selectedClient.budgetEconomique / 100 },
                        { name: 'Volumétrique', value: selectedClient.budgetVolumetrique }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={COLORS.primary} />
                      <Cell fill={COLORS.success} />
                      <Cell fill={COLORS.warning} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Modal Gestion Budget - 4 étapes */}
        {showBudgetManagement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex h-full">
                {/* Sidebar navigation */}
                <div className="w-64 bg-gradient-to-b from-blue-50 to-blue-100 p-6 border-r">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Gestion Budget</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBudgetManagement(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { step: 1, title: 'Informations Client', icon: User },
                      { step: 2, title: 'Budget Global', icon: Euro },
                      { step: 3, title: 'Gestion des Tâches', icon: Briefcase },
                      { step: 4, title: 'Gestion des Rôles', icon: UserCheck }
                    ].map(({ step, title, icon: Icon }) => (
                      <button
                        key={step}
                        onClick={() => setBudgetStep(step)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                          budgetStep === step
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-blue-200'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {budgetStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800">Informations Client</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue={selectedClient?.name}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type Standard</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option>Médecin</option>
                              <option>Dentiste</option>
                              <option>Kinésithérapeute</option>
                              <option>Artiste</option>
                              <option>Construction</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultValue="Médecine générale"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Forme</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option>SELARL</option>
                              <option>SCP</option>
                              <option>EURL</option>
                              <option>SARL</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Volumétrie</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Budget</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="180" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="165" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Heures budgétées</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Budget</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="345" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="357" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget économique</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Budget</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="15750" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                                <input type="number" className="w-full p-2 border rounded" defaultValue="16420" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {budgetStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800">Budget Global</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Budget Économique 2024</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Budget 2024</span>
                                <span className="font-semibold">€15,750</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Budget 2025</span>
                                <span className="font-semibold">€16,800</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Budget Horaire</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total budgété</span>
                                <span className="font-semibold">345h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Réalisé</span>
                                <span className="font-semibold">357h</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Budget Volumétrique</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Documents budget</span>
                                <span className="font-semibold">655</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Documents réalisés</span>
                                <span className="font-semibold">662</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4">Temps budgétés par prestation</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: 'Services Hors Tenue', budget: 67.584, realise: 68.96 },
                            { name: 'Tenue Comptabilité', budget: 0, realise: 0 },
                            { name: 'Budget Fiscal', budget: 17.28, realise: 17.88 },
                            { name: 'Organisation Comptable', budget: 0, realise: 0 },
                            { name: 'Révision Comptable', budget: 14.144, realise: 14.56 },
                            { name: 'Prestations Cia', budget: 0, realise: 0 },
                            { name: 'Nettoyage et Vérifications Comptables', budget: 16, realise: 16.56 },
                            { name: 'Production Situation Intermédiaire', budget: 0, realise: 0 },
                            { name: 'Production Bilan', budget: 2.64, realise: 2.88 },
                            { name: 'Prestations Fiscales', budget: 7.92, realise: 8.16 },
                            { name: 'Vérifications Diverses', budget: 0, realise: 0 },
                            { name: 'Conseil Client', budget: 0, realise: 0 },
                            { name: 'Gestion Dossier', budget: 0, realise: 0 },
                            { name: 'Gestion Réglementaire', budget: 2.88, realise: 2.96 }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-sm text-gray-700">{item.name}</span>
                              <div className="text-right">
                                <div className="text-sm font-medium">{item.budget}h</div>
                                <div className="text-xs text-gray-500">Réalisé: {item.realise}h</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {budgetStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800">Gestion des Tâches</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4">Répartition des tâches par rôle</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Tâche</th>
                                <th className="text-center p-2">Comptable</th>
                                <th className="text-center p-2">H1</th>
                                <th className="text-center p-2">H2</th>
                                <th className="text-center p-2">H3</th>
                                <th className="text-center p-2">Qualité</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: 'Gestion Dossier Papier', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Production Budget', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Qualité Papier', comptable: 17.28, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Organisation Comptable', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Révision Comptable', comptable: 17.28, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Prestations Cia', comptable: 12.8, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Nettoyage et Vérifications Comptables', comptable: 16.64, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Production Situation Intermédiaire', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Production Bilan', comptable: 2.64, h1: 0, h2: 0, h3: 0, qualite: 0 },
                                { name: 'Prestations Fiscales', comptable: 7.92, h1: 0, h2: 0, h3: 0, qualite: 0 }
                              ].map((task, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                  <td className="p-2 font-medium">{task.name}</td>
                                  <td className="p-2 text-center">
                                    <input 
                                      type="number" 
                                      className="w-16 p-1 border rounded text-center" 
                                      defaultValue={task.comptable} 
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <input 
                                      type="number" 
                                      className="w-16 p-1 border rounded text-center" 
                                      defaultValue={task.h1} 
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <input 
                                      type="number" 
                                      className="w-16 p-1 border rounded text-center" 
                                      defaultValue={task.h2} 
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <input 
                                      type="number" 
                                      className="w-16 p-1 border rounded text-center" 
                                      defaultValue={task.h3} 
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <input 
                                      type="number" 
                                      className="w-16 p-1 border rounded text-center" 
                                      defaultValue={task.qualite} 
                                      step="0.01"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {budgetStep === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-800">Gestion des Rôles</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Rôles assignés</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">Mohamed Kadi</div>
                                <div className="text-sm text-gray-600">Collaborateur</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">8.17</div>
                                <div className="text-xs text-gray-500">Total Heures</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">Julien Lefebvre</div>
                                <div className="text-sm text-gray-600">Manager</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">6.08</div>
                                <div className="text-xs text-gray-500">Total Heures</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-4">Ajouter un rôle</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Collaborateur</label>
                              <select className="w-full p-3 border border-gray-300 rounded-lg">
                                <option>Sélectionner un collaborateur</option>
                                <option>Mohamed Kadi</option>
                                <option>Julien Lefebvre</option>
                                <option>Sarah Martin</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                              <select className="w-full p-3 border border-gray-300 rounded-lg">
                                <option>Collaborateur</option>
                                <option>Manager</option>
                                <option>Senior</option>
                                <option>Junior</option>
                              </select>
                            </div>
                            <Button className="w-full bg-blue-500 hover:bg-blue-600">
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter le rôle
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setBudgetStep(Math.max(1, budgetStep - 1))}
                      disabled={budgetStep === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                    
                    <div className="flex space-x-2">
                      {budgetStep < 4 ? (
                        <Button
                          onClick={() => setBudgetStep(Math.min(4, budgetStep + 1))}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Suivant
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button className="bg-green-500 hover:bg-green-600">
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Paramétrage Client */}
        {showClientSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Paramétrage Client</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowClientSettings(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-6">Statut Client</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Statut Nouveau */}
                        <div 
                          className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                            selectedStatus === 'nouveau' 
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105' 
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedStatus('nouveau')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedStatus === 'nouveau' 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              <UserPlus className="w-6 h-6" />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                selectedStatus === 'nouveau' ? 'text-blue-800' : 'text-gray-800'
                              }`}>
                                Nouveau
                              </div>
                              <div className="text-xs text-gray-600">Client récemment acquis</div>
                            </div>
                          </div>
                          {selectedStatus === 'nouveau' && (
                            <div className="absolute top-2 right-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>

                        {/* Statut A risque */}
                        <div 
                          className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                            selectedStatus === 'a-risque' 
                              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105' 
                              : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedStatus('a-risque')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedStatus === 'a-risque' 
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                selectedStatus === 'a-risque' ? 'text-orange-800' : 'text-gray-800'
                              }`}>
                                À risque
                              </div>
                              <div className="text-xs text-gray-600">Attention requise</div>
                            </div>
                          </div>
                          {selectedStatus === 'a-risque' && (
                            <div className="absolute top-2 right-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>

                        {/* Statut En partance */}
                        <div 
                          className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                            selectedStatus === 'en-partance' 
                              ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg scale-105' 
                              : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedStatus('en-partance')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedStatus === 'en-partance' 
                                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              <UserMinus className="w-6 h-6" />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                selectedStatus === 'en-partance' ? 'text-red-800' : 'text-gray-800'
                              }`}>
                                En partance
                              </div>
                              <div className="text-xs text-gray-600">Départ prévu</div>
                            </div>
                          </div>
                          {selectedStatus === 'en-partance' && (
                            <div className="absolute top-2 right-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>

                        {/* Statut Sorti */}
                        <div 
                          className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 ${
                            selectedStatus === 'sorti' 
                              ? 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg scale-105' 
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedStatus('sorti')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              selectedStatus === 'sorti' 
                                ? 'bg-gradient-to-br from-gray-500 to-gray-600 text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <UserX className="w-6 h-6" />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                selectedStatus === 'sorti' ? 'text-gray-800' : 'text-gray-800'
                              }`}>
                                Sorti
                              </div>
                              <div className="text-xs text-gray-600">Client parti</div>
                            </div>
                          </div>
                          {selectedStatus === 'sorti' && (
                            <div className="absolute top-2 right-2">
                              <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Champs contextuels selon le statut */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        {selectedStatus === 'nouveau' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Informations nouveau client
                            </label>
                            <textarea
                              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                              rows={3}
                              placeholder="Notes, informations importantes, contexte..."
                            />
                          </div>
                        )}

                        {selectedStatus === 'a-risque' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Raison du risque
                              </label>
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                rows={2}
                                placeholder="Détails sur les raisons du risque..."
                              />
                            </div>
                            <div className="flex items-center space-x-3">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Client récupéré (était en partance)</span>
                            </div>
                          </div>
                        )}

                        {selectedStatus === 'en-partance' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Raison du départ
                              </label>
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                rows={2}
                                placeholder="Motifs de départ, insatisfaction..."
                              />
                            </div>
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Marquer comme récupéré
                            </Button>
                          </div>
                        )}

                        {selectedStatus === 'sorti' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dernières prestations à effectuer
                              </label>
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                                rows={2}
                                placeholder="Liste des prestations restantes..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date de renon
                              </label>
                              <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Délai de facturation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Délai de prestation</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Seuil de facturation</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">&lt; 75%</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">75% - 90%</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">&gt; 90%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Catégories</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[
                        'Services Hors Tenue',
                        'Tenue Comptabilité',
                        'Budget Fiscal',
                        'Organisation Comptable',
                        'Révision Comptable',
                        'Prestations Cia',
                        'Nettoyage et Vérifications Comptables',
                        'Production Situation Intermédiaire',
                        'Production Bilan',
                        'Prestations Fiscales',
                        'Vérifications Diverses',
                        'Conseil Client',
                        'Gestion Dossier',
                        'Gestion Réglementaire',
                        'Vérifications Production'
                      ].map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">{category}</span>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowClientSettings(false)}>
                    Annuler
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Clients;
