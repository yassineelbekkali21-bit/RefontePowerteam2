import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Target,
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  FileText,
  Brain,
  Award,
  Clock,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Import des types et données
import { supervisionTemplates, errorCategories } from '@/data/supervisionTemplates';
import { SupervisionSession, SupervisionTemplate, ErrorCategory } from '@/types/supervision';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

// Données mock pour les sessions de supervision
const mockSupervisionSessions: SupervisionSession[] = [
  {
    id: 'SUP_001',
    templateId: 'TEMP_ENC_001',
    collaboratorId: 'COL_001',
    collaboratorName: 'Marie Dubois',
    supervisorId: 'SUP_001',
    supervisorName: 'Jean Martin',
    clientName: 'SARL MARTIN',
    dossierRef: 'DOS_2025_001',
    scheduledDate: '2025-01-15T10:00:00',
    completedDate: '2025-01-15T11:15:00',
    status: 'completed',
    duration: 75,
    overallScore: 85,
    findings: [
      {
        id: 'FIN_001',
        checklistItemId: 'CHK_ENC_002',
        errorCategoryId: 'ERR_ENC_002',
        description: 'Taux TVA incorrect sur facture n°2025-001',
        severity: 'medium',
        status: 'resolved',
        correctiveAction: 'Correction effectuée, formation TVA programmée',
        responsible: 'Marie Dubois',
        dueDate: '2025-01-20',
        actualResolutionDate: '2025-01-18'
      }
    ],
    recommendations: ['Formation complémentaire TVA', 'Utilisation checklist TVA'],
    followUpRequired: true,
    followUpDate: '2025-02-15',
    notes: 'Bonne progression globale, attention aux taux TVA'
  },
  {
    id: 'SUP_002',
    templateId: 'TEMP_ISOC_001',
    collaboratorId: 'COL_002',
    collaboratorName: 'Pierre Laurent',
    supervisorId: 'SUP_001',
    supervisorName: 'Jean Martin',
    clientName: 'GARAGE TECH',
    dossierRef: 'DOS_2025_002',
    scheduledDate: '2025-01-18T14:00:00',
    status: 'in-progress',
    duration: 0,
    overallScore: 0,
    findings: [],
    recommendations: [],
    followUpRequired: false,
    notes: ''
  }
];

interface SupervisionDashboardProps {
  className?: string;
}

const SupervisionDashboard: React.FC<SupervisionDashboardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Données calculées
  const supervisionStats = useMemo(() => {
    const completed = mockSupervisionSessions.filter(s => s.status === 'completed');
    const totalScore = completed.reduce((sum, s) => sum + s.overallScore, 0);
    const averageScore = completed.length > 0 ? totalScore / completed.length : 0;
    
    const errorsByCategory = errorCategories.map(cat => ({
      category: cat.name,
      count: completed.reduce((count, session) => 
        count + session.findings.filter(f => f.errorCategoryId === cat.id).length, 0
      ),
      severity: cat.severity
    }));

    return {
      totalSupervisions: mockSupervisionSessions.length,
      completedSupervisions: completed.length,
      averageScore: Math.round(averageScore),
      pendingSupervisions: mockSupervisionSessions.filter(s => s.status === 'planned').length,
      errorsByCategory: errorsByCategory.filter(e => e.count > 0)
    };
  }, []);

  // Données pour les graphiques
  const scoreEvolutionData = [
    { month: 'Oct', score: 78 },
    { month: 'Nov', score: 82 },
    { month: 'Déc', score: 85 },
    { month: 'Jan', score: 88 }
  ];

  const errorDistributionData = supervisionStats.errorsByCategory.map((error, index) => ({
    name: error.category,
    value: error.count,
    color: COLORS[index % COLORS.length]
  }));

  const collaboratorPerformanceData = [
    { name: 'Marie Dubois', score: 85, supervisions: 3 },
    { name: 'Pierre Laurent', score: 92, supervisions: 2 },
    { name: 'Sophie Martin', score: 78, supervisions: 4 },
    { name: 'Lucas Durand', score: 88, supervisions: 3 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Supervisions</p>
                <p className="text-2xl font-bold text-gray-900">{supervisionStats.totalSupervisions}</p>
                <p className="text-xs text-green-600 mt-1">+12% vs mois dernier</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{supervisionStats.averageScore}%</p>
                <p className="text-xs text-green-600 mt-1">+3% vs mois dernier</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{supervisionStats.pendingSupervisions}</p>
                <p className="text-xs text-orange-600 mt-1">À planifier</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erreurs Identifiées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {supervisionStats.errorsByCategory.reduce((sum, e) => sum + e.count, 0)}
                </p>
                <p className="text-xs text-red-600 mt-1">-8% vs mois dernier</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="training">Formation</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Évolution des Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={scoreEvolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution des erreurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Distribution des Erreurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={errorDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {errorDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance par collaborateur */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Performance par Collaborateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={collaboratorPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions de supervision */}
        <TabsContent value="sessions" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Rechercher une session..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Type de supervision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {supervisionTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Collaborateur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="COL_001">Marie Dubois</SelectItem>
                    <SelectItem value="COL_002">Pierre Laurent</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des sessions */}
          <div className="space-y-4">
            {mockSupervisionSessions.map(session => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg">{session.collaboratorName}</h3>
                        <p className="text-sm text-gray-600">
                          {supervisionTemplates.find(t => t.id === session.templateId)?.name}
                        </p>
                      </div>
                      <Badge variant={
                        session.status === 'completed' ? 'default' :
                        session.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {session.status === 'completed' ? 'Terminé' :
                         session.status === 'in-progress' ? 'En cours' :
                         'Planifié'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      {session.status === 'completed' && (
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getScoreColor(session.overallScore)}`}>
                          Score: {session.overallScore}%
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {new Date(session.scheduledDate).toLocaleDateString('fr-FR')}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                  </div>
                  
                  {session.findings.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Observations ({session.findings.length})</h4>
                      <div className="space-y-2">
                        {session.findings.map(finding => (
                          <div key={finding.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${getSeverityColor(finding.severity)}`}></div>
                              <span className="text-sm">{finding.description}</span>
                            </div>
                            <Badge variant={
                              finding.status === 'resolved' ? 'default' :
                              finding.status === 'in-progress' ? 'secondary' :
                              'destructive'
                            }>
                              {finding.status === 'resolved' ? 'Résolu' :
                               finding.status === 'in-progress' ? 'En cours' :
                               'Ouvert'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analyse des erreurs */}
        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top erreurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Erreurs les Plus Fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supervisionStats.errorsByCategory
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((error, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(error.severity)}`}></div>
                        <span className="text-sm font-medium">{error.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{error.count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(error.count / Math.max(...supervisionStats.errorsByCategory.map(e => e.count))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions recommandées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Actions Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Formation TVA urgente</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      3 collaborateurs ont des erreurs récurrentes sur l'application des taux de TVA
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Mise à jour procédures</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Les erreurs de classification ISOC suggèrent une révision des procédures
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Renforcement positif</span>
                    </div>
                    <p className="text-sm text-green-700">
                      L'équipe IPP montre une amélioration constante, continuer les bonnes pratiques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Formation */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Contenus de Formation Générés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Formations Recommandées</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Formation TVA Approfondie</h4>
                        <Badge variant="destructive">Urgente</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Basée sur 8 erreurs identifiées lors des supervisions
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">3 participants • 2h</span>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Planifier
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Classification Bilan ISOC</h4>
                        <Badge variant="outline">Recommandée</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Mise à jour sur les nouvelles règles de classification
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">5 participants • 1h30</span>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Suivi des Formations</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">Plan Comptable - Base</h4>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-green-700">
                        Terminée le 15/01/2025 • 4 participants
                      </p>
                      <div className="mt-2">
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-800">Cotisations Sociales IPM</h4>
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-700">
                        En cours • 2 participants
                      </p>
                      <div className="mt-2">
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rapports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Rapports Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Rapport Mensuel de Supervision</h4>
                      <p className="text-sm text-gray-600">Janvier 2025 • Toutes équipes</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger PDF
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Analyse des Erreurs par Collaborateur</h4>
                      <p className="text-sm text-gray-600">Q4 2024 • Équipe comptable</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir en ligne
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Plan de Formation 2025</h4>
                      <p className="text-sm text-gray-600">Généré automatiquement</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-blue-700">Taux de conformité</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+15%</div>
                    <div className="text-sm text-green-700">Amélioration scores</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">6</div>
                    <div className="text-sm text-orange-700">Formations requises</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisionDashboard;
