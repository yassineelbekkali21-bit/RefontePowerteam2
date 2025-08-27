import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, Users, DollarSign, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Données denses basées sur les captures d'écran
const projectsData = [
  {
    id: 1,
    collaborateur: 'Alice Martin',
    client: 'TechCorp SARL',
    tache: 'Développement API REST',
    heuresBudgetees: 40,
    heuresRealisees: 26,
    chargeAnnuelle: 1200,
    tauxRealisation: 65,
    budgetEconomique: 3500,
    chiffreAffaires: 2847,
    statut: 'En cours',
    rentabilite: 81,
    ecartBudget: -14,
    dateDebut: '2025-01-15',
    dateFin: '2025-02-28'
  },
  {
    id: 2,
    collaborateur: 'Bob Dupont',
    client: 'StartupXYZ',
    tache: 'Design System',
    heuresBudgetees: 32,
    heuresRealisees: 28,
    chargeAnnuelle: 960,
    tauxRealisation: 87,
    budgetEconomique: 2800,
    chiffreAffaires: 3100,
    statut: 'Terminé',
    rentabilite: 110,
    ecartBudget: +4,
    dateDebut: '2025-02-01',
    dateFin: '2025-02-20'
  },
  {
    id: 3,
    collaborateur: 'Claire Leroy',
    client: 'Enterprise Ltd',
    tache: 'Audit Sécurité',
    heuresBudgetees: 60,
    heuresRealisees: 18,
    chargeAnnuelle: 1800,
    tauxRealisation: 30,
    budgetEconomique: 5200,
    chiffreAffaires: 1560,
    statut: 'Suspendu',
    rentabilite: 30,
    ecartBudget: -42,
    dateDebut: '2025-01-10',
    dateFin: '2025-03-15'
  },
  {
    id: 4,
    collaborateur: 'David Chen',
    client: 'MegaCorp Inc',
    tache: 'Migration Cloud',
    heuresBudgetees: 80,
    heuresRealisees: 75,
    chargeAnnuelle: 2400,
    tauxRealisation: 94,
    budgetEconomique: 7000,
    chiffreAffaires: 6800,
    statut: 'En cours',
    rentabilite: 97,
    ecartBudget: -5,
    dateDebut: '2025-01-05',
    dateFin: '2025-03-30'
  },
  {
    id: 5,
    collaborateur: 'Emma Wilson',
    client: 'LocalBiz',
    tache: 'Site E-commerce',
    heuresBudgetees: 45,
    heuresRealisees: 48,
    chargeAnnuelle: 1350,
    tauxRealisation: 107,
    budgetEconomique: 3900,
    chiffreAffaires: 4200,
    statut: 'Terminé',
    rentabilite: 108,
    ecartBudget: +3,
    dateDebut: '2025-02-10',
    dateFin: '2025-03-05'
  }
];

const clientsData = [
  {
    id: 1,
    nom: 'TechCorp SARL',
    secteur: 'Technology',
    chiffreAffairesAnnuel: 45000,
    nombreProjets: 8,
    tauxSatisfaction: 92,
    derniereFacture: '2025-08-15',
    montantEnCours: 12500,
    statutPaiement: 'À jour',
    responsableCompte: 'Alice Martin',
    localisation: 'Paris'
  },
  {
    id: 2,
    nom: 'StartupXYZ',
    secteur: 'Fintech',
    chiffreAffairesAnnuel: 28000,
    nombreProjets: 5,
    tauxSatisfaction: 88,
    derniereFacture: '2025-08-20',
    montantEnCours: 8900,
    statutPaiement: 'En retard',
    responsableCompte: 'Bob Dupont',
    localisation: 'Lyon'
  },
  {
    id: 3,
    nom: 'Enterprise Ltd',
    secteur: 'Manufacturing',
    chiffreAffairesAnnuel: 67000,
    nombreProjets: 12,
    tauxSatisfaction: 95,
    derniereFacture: '2025-08-10',
    montantEnCours: 18700,
    statutPaiement: 'À jour',
    responsableCompte: 'Claire Leroy',
    localisation: 'Marseille'
  }
];

const DataTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'clients'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Terminé': return COLORS.success;
      case 'En cours': return COLORS.primary;
      case 'Suspendu': return COLORS.danger;
      default: return COLORS.warning;
    }
  };

  const getRentabiliteColor = (rentabilite: number) => {
    if (rentabilite >= 100) return COLORS.success;
    if (rentabilite >= 80) return COLORS.warning;
    return COLORS.danger;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6">
        {/* Header moderne */}
        <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-gray-800 via-slate-700 to-blue-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Tableaux de Données</h1>
                <p className="text-gray-200 text-lg">Interface moderne pour données denses</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{projectsData.length}</div>
                  <div className="text-sm text-gray-200">Projets</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{clientsData.length}</div>
                  <div className="text-sm text-gray-200">Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant={activeTab === 'projects' ? 'default' : 'outline'}
              onClick={() => setActiveTab('projects')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Projets & Budgets
            </Button>
            <Button
              variant={activeTab === 'clients' ? 'default' : 'outline'}
              onClick={() => setActiveTab('clients')}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestion Clients
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {activeTab === 'projects' && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Suivi Projets & Performance Financière
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('collaborateur')}>
                        <div className="flex items-center space-x-1">
                          <span>Collaborateur</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('client')}>
                        <div className="flex items-center space-x-1">
                          <span>Client</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Tâche</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">H. Budget</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">H. Réalisé</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Taux</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Budget €</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">CA €</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Rentabilité</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Statut</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsData.map((project, index) => (
                      <tr 
                        key={project.id} 
                        className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                        data-contextual={JSON.stringify({
                          type: 'project_detail',
                          title: `Projet ${project.tache}`,
                          data: project
                        })}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {project.collaborateur.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium">{project.collaborateur}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-900">{project.client}</td>
                        <td className="px-4 py-4 text-gray-600">{project.tache}</td>
                        <td className="px-4 py-4 text-center font-mono">{project.heuresBudgetees}h</td>
                        <td className="px-4 py-4 text-center font-mono">{project.heuresRealisees}h</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-medium">{project.tauxRealisation}%</span>
                            <Progress value={project.tauxRealisation} className="w-16 h-1" />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-blue-600">{project.budgetEconomique.toLocaleString()}€</td>
                        <td className="px-4 py-4 text-center font-mono text-green-600">{project.chiffreAffaires.toLocaleString()}€</td>
                        <td className="px-4 py-4 text-center">
                          <Badge 
                            variant="secondary"
                            className="text-white"
                            style={{ backgroundColor: getRentabiliteColor(project.rentabilite) }}
                          >
                            {project.rentabilite}%
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge 
                            variant="secondary"
                            className="text-white"
                            style={{ backgroundColor: getStatusColor(project.statut) }}
                          >
                            {project.statut}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'clients' && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Portefeuille Clients & Suivi Commercial
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Secteur</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">CA Annuel</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Projets</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Satisfaction</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Montant En Cours</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Statut Paiement</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Responsable</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsData.map((client, index) => (
                      <tr 
                        key={client.id} 
                        className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                        data-contextual={JSON.stringify({
                          type: 'client_detail',
                          title: `Client ${client.nom}`,
                          data: client
                        })}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {client.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium">{client.nom}</div>
                              <div className="text-sm text-gray-500">{client.localisation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{client.secteur}</td>
                        <td className="px-4 py-4 text-center font-mono text-green-600">{client.chiffreAffairesAnnuel.toLocaleString()}€</td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant="outline">{client.nombreProjets}</Badge>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-medium">{client.tauxSatisfaction}%</span>
                            <Progress value={client.tauxSatisfaction} className="w-16 h-1" />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-mono text-blue-600">{client.montantEnCours.toLocaleString()}€</td>
                        <td className="px-4 py-4 text-center">
                          <Badge 
                            variant="secondary"
                            className={`text-white ${client.statutPaiement === 'À jour' ? 'bg-green-500' : 'bg-red-500'}`}
                          >
                            {client.statutPaiement === 'En retard' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {client.statutPaiement}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{client.responsableCompte}</td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Affichage de 1 à {Math.min(itemsPerPage, projectsData.length)} sur {projectsData.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-500 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataTables;
