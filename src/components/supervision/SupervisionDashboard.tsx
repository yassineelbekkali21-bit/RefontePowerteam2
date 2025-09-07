import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, ClipboardList, TrendingUp, Users, FileText, AlertTriangle, 
  CheckCircle, Clock, Target, Search, Filter, Calendar, User,
  Brain, BookOpen, Download, BarChart3
} from 'lucide-react';
import { SupervisionSession } from '@/types/supervision';

// Données mock pour démonstration
const mockSessions: SupervisionSession[] = [
  {
    id: 'SUP_001',
    templateId: 'TEMP_ENC_001',
    templateName: 'Supervision Encodage Comptable',
    collaboratorId: 'COL_001',
    collaboratorName: 'Marie Dubois',
    supervisorId: 'SUP_001',
    supervisorName: 'Manager Principal',
    date: '2025-01-15T10:00:00Z',
    score: 85,
    status: 'Completed',
    findings: [
      {
        id: 'F001',
        sessionId: 'SUP_001',
        collaboratorId: 'COL_001',
        collaboratorName: 'Marie Dubois',
        errorType: 'TVA',
        severity: 'Modérée',
        description: 'Erreur taux TVA 21% au lieu de 6%',
        correctiveAction: 'Formation TVA alimentaire',
        dateIdentified: '2025-01-15T10:00:00Z',
        status: 'Open'
      }
    ],
    notes: 'Supervision encodage - Points d\'amélioration sur TVA et lettrage'
  },
  {
    id: 'SUP_002',
    templateId: 'TEMP_ISOC_001',
    templateName: 'Supervision Bilan ISOC',
    collaboratorId: 'COL_002',
    collaboratorName: 'Pierre Laurent',
    supervisorId: 'SUP_001',
    supervisorName: 'Manager Principal',
    date: '2025-01-14T14:00:00Z',
    score: 92,
    status: 'Completed',
    findings: [],
    notes: 'Excellent travail sur le bilan ISOC'
  }
];

const SupervisionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCollaborator, setFilterCollaborator] = useState('all');

  // Calculs KPIs
  const totalSessions = mockSessions.length;
  const averageScore = Math.round(mockSessions.reduce((sum, s) => sum + s.score, 0) / mockSessions.length);
  const openFindings = mockSessions.reduce((sum, s) => sum + s.findings.filter(f => f.status === 'Open').length, 0);
  const completedSessions = mockSessions.filter(s => s.status === 'Completed').length;

  // Sessions filtrées
  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.templateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesCollaborator = filterCollaborator === 'all' || session.collaboratorName === filterCollaborator;
    
    return matchesSearch && matchesStatus && matchesCollaborator;
  });

  // Analyse des erreurs
  const errorAnalysis = mockSessions.reduce((acc, session) => {
    session.findings.forEach(finding => {
      const key = finding.errorType;
      if (!acc[key]) {
        acc[key] = { count: 0, collaborators: new Set() };
      }
      acc[key].count++;
      acc[key].collaborators.add(finding.collaboratorName);
    });
    return acc;
  }, {} as Record<string, { count: number; collaborators: Set<string> }>);

  const collaborators = [...new Set(mockSessions.map(s => s.collaboratorName))];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Sessions Total</p>
                <p className="text-3xl font-bold text-blue-700">{totalSessions}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Score Moyen</p>
                <p className="text-3xl font-bold text-green-700">{averageScore}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Erreurs Ouvertes</p>
                <p className="text-3xl font-bold text-orange-700">{openFindings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Taux Complétion</p>
                <p className="text-3xl font-bold text-purple-700">{Math.round(completedSessions / totalSessions * 100)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et tendances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSessions.slice(-3).map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{session.collaboratorName}</p>
                      <p className="text-sm text-gray-600">{session.templateName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={session.score >= 90 ? 'default' : session.score >= 75 ? 'secondary' : 'destructive'}>
                      {session.score}%
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(session.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Erreurs par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(errorAnalysis).map(([errorType, data]) => (
                <div key={errorType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{errorType}</p>
                    <p className="text-sm text-gray-600">
                      {data.collaborators.size} collaborateur{data.collaborators.size > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {data.count} erreur{data.count > 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
              {Object.keys(errorAnalysis).length === 0 && (
                <p className="text-center text-gray-500 py-4">Aucune erreur identifiée</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par collaborateur ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Completed">Terminé</SelectItem>
                <SelectItem value="In Progress">En cours</SelectItem>
                <SelectItem value="Planned">Planifié</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCollaborator} onValueChange={setFilterCollaborator}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Collaborateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {collaborators.map(collab => (
                  <SelectItem key={collab} value={collab}>{collab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sessions */}
      <div className="space-y-4">
        {filteredSessions.map(session => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {session.collaboratorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{session.collaboratorName}</h3>
                    <p className="text-gray-600">{session.templateName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(session.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {session.supervisorName}
                      </span>
                      {session.findings.length > 0 && (
                        <span className="flex items-center text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {session.findings.length} erreur{session.findings.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <Badge 
                    variant={session.score >= 90 ? 'default' : session.score >= 75 ? 'secondary' : 'destructive'}
                    className="text-lg px-3 py-1"
                  >
                    {session.score}%
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    {session.findings.length > 0 && (
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                        <Target className="w-4 h-4 mr-1" />
                        Corriger
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {session.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalyses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Formation Automatique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Génération automatique de contenus de formation basés sur les erreurs identifiées.
            </p>
            <div className="space-y-3">
              {Object.entries(errorAnalysis).map(([errorType, data]) => (
                <div key={errorType} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{errorType}</p>
                    <p className="text-sm text-gray-600">{data.count} occurrences</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Générer Formation
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Plans de Correction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Création de plans de correction personnalisés pour chaque collaborateur.
            </p>
            <div className="space-y-3">
              {collaborators.map(collaborator => {
                const collaboratorFindings = mockSessions
                  .filter(s => s.collaboratorName === collaborator)
                  .reduce((sum, s) => sum + s.findings.length, 0);
                
                return (
                  <div key={collaborator} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{collaborator}</p>
                      <p className="text-sm text-gray-600">{collaboratorFindings} erreur{collaboratorFindings > 1 ? 's' : ''}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={collaboratorFindings > 0 ? 'default' : 'outline'}
                      disabled={collaboratorFindings === 0}
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Créer Plan
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => {
    // Données pour les graphiques et analyses
    const periodData = [
      { name: 'Jan', sessions: 12, erreurs: 8, score: 87 },
      { name: 'Fév', sessions: 15, erreurs: 6, score: 91 },
      { name: 'Mar', sessions: 18, erreurs: 4, score: 94 },
      { name: 'Avr', sessions: 20, erreurs: 3, score: 96 }
    ];

    const departmentStats = [
      { department: 'Comptabilité', collaborators: 8, sessions: 24, errors: 12, avgScore: 88 },
      { department: 'Fiscal', collaborators: 4, sessions: 16, errors: 6, avgScore: 92 },
      { department: 'Paie', collaborators: 3, sessions: 12, errors: 4, avgScore: 94 },
      { department: 'Audit', collaborators: 2, sessions: 8, errors: 2, avgScore: 96 }
    ];

    const topErrors = [
      { type: 'TVA', count: 8, trend: '+12%', severity: 'Haute' },
      { type: 'Encodage', count: 6, trend: '-5%', severity: 'Moyenne' },
      { type: 'Lettrage', count: 4, trend: '+8%', severity: 'Moyenne' },
      { type: 'Classification', count: 3, trend: '-15%', severity: 'Faible' }
    ];

    return (
      <div className="space-y-6">
        {/* KPIs Rapports */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Sessions Total</p>
                  <p className="text-2xl font-bold text-blue-700">65</p>
                  <p className="text-xs text-blue-500">+15% vs mois dernier</p>
                </div>
                <ClipboardList className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Erreurs Total</p>
                  <p className="text-2xl font-bold text-red-700">21</p>
                  <p className="text-xs text-red-500">-8% vs mois dernier</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Score Moyen</p>
                  <p className="text-2xl font-bold text-green-700">91%</p>
                  <p className="text-xs text-green-500">+3% vs mois dernier</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Formations Générées</p>
                  <p className="text-2xl font-bold text-purple-700">12</p>
                  <p className="text-xs text-purple-500">+4 ce mois</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {periodData.map((month, index) => (
                  <div key={month.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === periodData.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="font-medium">{month.name}</span>
                    </div>
                    <div className="flex space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{month.sessions}</div>
                        <div className="text-gray-500">Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{month.erreurs}</div>
                        <div className="text-gray-500">Erreurs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{month.score}%</div>
                        <div className="text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Erreurs */}
          <Card>
            <CardHeader>
              <CardTitle>Erreurs les Plus Fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topErrors.map((error, index) => (
                  <div key={error.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{error.type}</p>
                        <p className="text-sm text-gray-600">Sévérité: {error.severity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">{error.count}</div>
                      <div className={`text-xs ${error.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                        {error.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance par département */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Performance par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Département</th>
                    <th className="text-center p-3 font-semibold">Collaborateurs</th>
                    <th className="text-center p-3 font-semibold">Sessions</th>
                    <th className="text-center p-3 font-semibold">Erreurs</th>
                    <th className="text-center p-3 font-semibold">Score Moyen</th>
                    <th className="text-center p-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept) => (
                    <tr key={dept.department} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{dept.department}</td>
                      <td className="p-3 text-center">{dept.collaborators}</td>
                      <td className="p-3 text-center">{dept.sessions}</td>
                      <td className="p-3 text-center">
                        <span className="text-red-600 font-semibold">{dept.errors}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-semibold ${
                          dept.avgScore >= 95 ? 'text-green-600' :
                          dept.avgScore >= 90 ? 'text-blue-600' :
                          dept.avgScore >= 85 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {dept.avgScore}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={
                          dept.avgScore >= 95 ? 'default' :
                          dept.avgScore >= 90 ? 'secondary' :
                          dept.avgScore >= 85 ? 'outline' : 'destructive'
                        }>
                          {dept.avgScore >= 95 ? 'Excellent' :
                           dept.avgScore >= 90 ? 'Très Bien' :
                           dept.avgScore >= 85 ? 'Bien' : 'À Améliorer'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Actions et exports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions Recommandées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Formation TVA Urgente</p>
                    <p className="text-sm text-red-600">8 erreurs ce mois (+12%)</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Planifier
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-800">Audit Département Comptabilité</p>
                    <p className="text-sm text-orange-600">Score en baisse (88%)</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                    Programmer
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Reconnaissance Équipe Audit</p>
                    <p className="text-sm text-blue-600">Performance excellente (96%)</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                    Féliciter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exports et Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span className="text-sm">Export Excel</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-sm">Rapport PDF</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span className="text-sm">Graphiques</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-sm">Planning</span>
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Période d'analyse:</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Ce mois</Button>
                  <Button size="sm" variant="outline">Trimestre</Button>
                  <Button size="sm" variant="outline">Année</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="analyses" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Analyses</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Rapports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          {renderSessions()}
        </TabsContent>

        <TabsContent value="analyses" className="mt-6">
          {renderAnalyses()}
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          {renderReports()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisionDashboard;