import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  User, 
  FileText, 
  Euro, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

interface Activity {
  id: string;
  timestamp: string;
  module: 'Finance' | 'RH' | 'Prestations' | 'Production' | 'Clients' | 'Supervision' | 'System';
  type: string;
  action: string;
  details: string;
  user: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
}

interface ActivityTrackerProps {
  clientId: string;
  clientName: string;
}

const ActivityTracker: React.FC<ActivityTrackerProps> = ({ clientId, clientName }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');

  // Données d'exemple d'activités pour un client
  const activities: Activity[] = [
    {
      id: '1',
      timestamp: '2024-01-20T14:30:00Z',
      module: 'Finance',
      type: 'Facturation',
      action: 'Facture créée',
      details: 'Facture #2024-001 pour prestation comptable - 1,250€',
      user: 'Marie Dupont',
      status: 'success',
      metadata: { amount: 1250, invoiceNumber: '2024-001' }
    },
    {
      id: '2',
      timestamp: '2024-01-20T11:15:00Z',
      module: 'Prestations',
      type: 'Timesheet',
      action: 'Heures saisies',
      details: '3.5h de travail comptable par Lucas Petit',
      user: 'Lucas Petit',
      status: 'info',
      metadata: { hours: 3.5, taskType: 'comptabilité' }
    },
    {
      id: '3',
      timestamp: '2024-01-19T16:45:00Z',
      module: 'Clients',
      type: 'Communication',
      action: 'Email envoyé',
      details: 'Rappel échéance TVA envoyé via DEG Assistant',
      user: 'DEG Assistant',
      status: 'info',
      metadata: { emailType: 'reminder', subject: 'Échéance TVA' }
    },
    {
      id: '4',
      timestamp: '2024-01-19T14:20:00Z',
      module: 'Production',
      type: 'Tâche',
      action: 'Tâche assignée',
      details: 'Préparation déclaration TVA Q4 assignée à Pierre Martin',
      user: 'Sophie Richard',
      status: 'info',
      metadata: { assignee: 'Pierre Martin', taskType: 'TVA Q4' }
    },
    {
      id: '5',
      timestamp: '2024-01-18T10:30:00Z',
      module: 'Finance',
      type: 'Analyse',
      action: 'Diagnostic généré',
      details: 'Analyse automatique : Rentabilité faible détectée',
      user: 'Système Powerteam',
      status: 'warning',
      metadata: { diagnostic: 'rentabilité_faible', score: 72 }
    },
    {
      id: '6',
      timestamp: '2024-01-17T09:00:00Z',
      module: 'Clients',
      type: 'Mise à jour',
      action: 'Profil modifié',
      details: 'Mise à jour des informations de contact',
      user: 'Alex Dupont',
      status: 'success',
      metadata: { field: 'contact_info' }
    },
    {
      id: '7',
      timestamp: '2024-01-16T15:20:00Z',
      module: 'Supervision',
      type: 'Contrôle',
      action: 'Session supervision',
      details: 'Supervision qualité - Score: 88/100',
      user: 'Nathalie Durand',
      status: 'success',
      metadata: { score: 88, errors: 2 }
    }
  ];

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Finance': return <Euro className="w-4 h-4" />;
      case 'RH': return <User className="w-4 h-4" />;
      case 'Prestations': return <Clock className="w-4 h-4" />;
      case 'Production': return <FileText className="w-4 h-4" />;
      case 'Clients': return <User className="w-4 h-4" />;
      case 'Supervision': return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'Finance': return 'bg-green-100 text-green-700 border-green-200';
      case 'RH': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Prestations': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Production': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Clients': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Supervision': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filtre par module
    if (filter !== 'all') {
      filtered = filtered.filter(activity => activity.module === filter);
    }

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(activity => 
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par date (simulation)
    const now = new Date();
    const daysAgo = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    filtered = filtered.filter(activity => 
      new Date(activity.timestamp) >= cutoffDate
    );

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filter, searchQuery, dateRange]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Activités Client - {clientName}</span>
            <Badge variant="secondary">{filteredActivities.length}</Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous modules</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Prestations">Prestations</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Clients">Clients</SelectItem>
                <SelectItem value="Supervision">Supervision</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="365days">Toute l'année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Rechercher activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Aucune activité trouvée pour les critères sélectionnés.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {/* Icône du module */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${getModuleColor(activity.module)}`}>
                  {getModuleIcon(activity.module)}
                </div>

                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{activity.action}</h4>
                      {getStatusIcon(activity.status)}
                    </div>
                    <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.module}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      par {activity.user}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
