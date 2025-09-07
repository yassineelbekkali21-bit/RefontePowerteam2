import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  Database, 
  RefreshCw as Sync, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Download,
  Settings,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Users,
  Building,
  Euro,
  Calendar,
  Zap,
  ExternalLink,
  Eye,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Shield
} from 'lucide-react';

const Synchronization: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const dataSources = [
    {
      id: 'clients',
      name: 'Clients',
      icon: Users,
      status: 'connected',
      lastSync: '2024-01-15 14:30:00',
      recordCount: 156,
      syncMethod: 'api',
      health: 'good'
    },
    {
      id: 'employees',
      name: 'Employés',
      icon: Building,
      status: 'connected',
      lastSync: '2024-01-15 14:28:00',
      recordCount: 23,
      syncMethod: 'api',
      health: 'good'
    },
    {
      id: 'timesheet',
      name: 'TimeSheet',
      icon: Clock,
      status: 'warning',
      lastSync: '2024-01-15 12:15:00',
      recordCount: 2847,
      syncMethod: 'excel',
      health: 'warning'
    },
    {
      id: 'invoicing',
      name: 'Facturation',
      icon: Euro,
      status: 'connected',
      lastSync: '2024-01-15 14:25:00',
      recordCount: 892,
      syncMethod: 'api',
      health: 'good'
    },
    {
      id: 'accounting',
      name: 'Logiciel Comptable',
      icon: FileText,
      status: 'error',
      lastSync: '2024-01-14 18:45:00',
      recordCount: 0,
      syncMethod: 'api',
      health: 'error'
    },
    {
      id: 'tasks',
      name: 'Tâches',
      icon: Calendar,
      status: 'connected',
      lastSync: '2024-01-15 14:20:00',
      recordCount: 445,
      syncMethod: 'api',
      health: 'good'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const simulateSync = () => {
    setSyncInProgress(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncInProgress(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PageHeader
          title="Synchronisation des Données"
          description="Gérez vos sources de données et synchronisations"
          icon={Database}
          actions={
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                <Zap className="w-3 h-3 mr-1" />
                Auto-Sync Actif
              </Badge>
              <Button 
                onClick={simulateSync}
                disabled={syncInProgress}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {syncInProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <Sync className="w-4 h-4 mr-2" />
                    Synchroniser Maintenant
                  </>
                )}
              </Button>
            </div>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="sources">Sources de Données</TabsTrigger>
            <TabsTrigger value="mapping">Mapping</TabsTrigger>
            <TabsTrigger value="logs">Historique</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Status général */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Sources Connectées</p>
                      <p className="text-2xl font-bold text-green-700">
                        {dataSources.filter(s => s.status === 'connected').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Avertissements</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {dataSources.filter(s => s.status === 'warning').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Erreurs</p>
                      <p className="text-2xl font-bold text-red-700">
                        {dataSources.filter(s => s.status === 'error').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Enregistrements</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {dataSources.reduce((sum, s) => sum + s.recordCount, 0).toLocaleString()}
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progression si sync en cours */}
            {syncInProgress && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-800">Synchronisation en cours...</h3>
                      <span className="text-blue-700 font-medium">{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-3" />
                    <p className="text-sm text-blue-600">
                      Synchronisation des données depuis vos sources externes...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statut des sources */}
            <Card>
              <CardHeader>
                <CardTitle>État des Sources de Données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataSources.map((source) => {
                    const IconComponent = source.icon;
                    return (
                      <div key={source.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">{source.name}</span>
                          </div>
                          <Badge className={getStatusColor(source.status)}>
                            {getStatusIcon(source.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Enregistrements:</span>
                            <span className="font-medium">{source.recordCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Méthode:</span>
                            <span className="font-medium capitalize">{source.syncMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dernière sync:</span>
                            <span className="font-medium">{new Date(source.lastSync).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration des sources */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration ERP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                    API ERP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>URL de l'API</Label>
                    <Input defaultValue="https://api.erp-client.com/v1" />
                  </div>
                  <div>
                    <Label>Clé API</Label>
                    <div className="flex space-x-2">
                      <Input type="password" defaultValue="••••••••••••••••" className="flex-1" />
                      <Button variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Timeout (secondes)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Activer la synchronisation</Label>
                    <Switch defaultChecked />
                  </div>
                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Tester la Connexion
                  </Button>
                </CardContent>
              </Card>

              {/* Configuration Excel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-orange-600" />
                    Import Excel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Répertoire de surveillance</Label>
                    <Input defaultValue="/uploads/excel-imports/" />
                  </div>
                  <div>
                    <Label>Format de fichier</Label>
                    <Select defaultValue="xlsx">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="txt">Texte délimité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Import automatique</Label>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label>Derniers fichiers importés</Label>
                    <div className="space-y-1">
                      <div className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                        <span>timesheet_janvier.xlsx</span>
                        <span className="text-gray-500">14/01/2024</span>
                      </div>
                      <div className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                        <span>clients_2024.xlsx</span>
                        <span className="text-gray-500">10/01/2024</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer un Fichier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mapping des données */}
          <TabsContent value="mapping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Correspondance des Champs</CardTitle>
                <p className="text-sm text-gray-600">
                  Configurez la correspondance entre vos données sources et Powerteam
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Mapping Clients */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold mb-3">Module Clients</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom du client (Source)</Label>
                        <Select defaultValue="company_name">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company_name">company_name</SelectItem>
                            <SelectItem value="name">name</SelectItem>
                            <SelectItem value="client_name">client_name</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Email (Source)</Label>
                        <Select defaultValue="email">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">email</SelectItem>
                            <SelectItem value="mail">mail</SelectItem>
                            <SelectItem value="contact_email">contact_email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Téléphone (Source)</Label>
                        <Select defaultValue="phone">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">phone</SelectItem>
                            <SelectItem value="telephone">telephone</SelectItem>
                            <SelectItem value="contact_phone">contact_phone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Adresse (Source)</Label>
                        <Select defaultValue="address">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="address">address</SelectItem>
                            <SelectItem value="adresse">adresse</SelectItem>
                            <SelectItem value="full_address">full_address</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Mapping Employés */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-3">Module Employés</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Prénom (Source)</Label>
                        <Select defaultValue="first_name">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="first_name">first_name</SelectItem>
                            <SelectItem value="prenom">prenom</SelectItem>
                            <SelectItem value="firstname">firstname</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Nom (Source)</Label>
                        <Select defaultValue="last_name">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last_name">last_name</SelectItem>
                            <SelectItem value="nom">nom</SelectItem>
                            <SelectItem value="surname">surname</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Poste (Source)</Label>
                        <Select defaultValue="role">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="role">role</SelectItem>
                            <SelectItem value="position">position</SelectItem>
                            <SelectItem value="job_title">job_title</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Département (Source)</Label>
                        <Select defaultValue="department">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="department">department</SelectItem>
                            <SelectItem value="service">service</SelectItem>
                            <SelectItem value="team">team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sauvegarder la Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historique */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Synchronisations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15 14:30:00', source: 'API ERP', status: 'success', records: 156, duration: '2.3s' },
                    { date: '2024-01-15 14:28:00', source: 'Employés', status: 'success', records: 23, duration: '0.8s' },
                    { date: '2024-01-15 14:25:00', source: 'Facturation', status: 'success', records: 892, duration: '5.1s' },
                    { date: '2024-01-15 12:15:00', source: 'TimeSheet Excel', status: 'warning', records: 2847, duration: '12.3s' },
                    { date: '2024-01-14 18:45:00', source: 'Logiciel Comptable', status: 'error', records: 0, duration: '30.0s' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' :
                          log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{log.source}</p>
                          <p className="text-sm text-gray-600">{log.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{log.records} enregistrements</p>
                        <p className="text-sm text-gray-600">{log.duration}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Générale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Synchronisation Automatique</h3>
                    <div className="flex items-center justify-between">
                      <Label>Activer la synchronisation automatique</Label>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label>Fréquence de synchronisation</Label>
                      <Select defaultValue="1h">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">Toutes les 15 minutes</SelectItem>
                          <SelectItem value="30m">Toutes les 30 minutes</SelectItem>
                          <SelectItem value="1h">Toutes les heures</SelectItem>
                          <SelectItem value="4h">Toutes les 4 heures</SelectItem>
                          <SelectItem value="daily">Quotidienne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Heures d'arrêt</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="time" defaultValue="22:00" />
                        <Input type="time" defaultValue="06:00" />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Période pendant laquelle la synchronisation automatique est suspendue
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Gestion des Erreurs</h3>
                    <div>
                      <Label>Nombre de tentatives</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 tentative</SelectItem>
                          <SelectItem value="3">3 tentatives</SelectItem>
                          <SelectItem value="5">5 tentatives</SelectItem>
                          <SelectItem value="10">10 tentatives</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Notifications d'erreur</Label>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label>Email de notification</Label>
                      <Input type="email" defaultValue="admin@powerteam.com" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Sauvegarde et Restauration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Download className="w-6 h-6 mb-2" />
                      <span>Exporter la Configuration</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Upload className="w-6 h-6 mb-2" />
                      <span>Importer une Configuration</span>
                    </Button>
                  </div>
                </div>

                <Button className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegarder la Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Synchronization;
