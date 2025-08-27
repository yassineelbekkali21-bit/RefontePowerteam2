import React, { useState } from 'react';
import { Bell, Filter, Search, Check, CheckCheck, Trash2, Eye, Calendar, Users, TrendingDown, FileText, Clock, AlertTriangle, UserCheck, Building, Phone, Mail, Target, Star, Settings, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');

  // Exemples de notifications complètes pour tous les cas d'usage
  const allNotifications = [
    ...notifications,
    // Clients & Croissance
    {
      id: 'notif-client-1',
      title: 'Nouveau client attribué',
      message: 'Le client SARL TECHNIPLUS vous a été assigné pour la gestion comptable',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      module: 'Clients',
      priority: 'medium' as const,
      action: {
        label: 'Voir le client',
        onClick: () => navigate('/clients')
      }
    },
    {
      id: 'notif-prospect-1',
      title: 'Nouveau prospect qualifié',
      message: 'SAS INNOVATION EXPRESS a été qualifié et nécessite un suivi commercial',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: false,
      module: 'Croissance',
      priority: 'high' as const,
      action: {
        label: 'Voir prospect',
        onClick: () => navigate('/croissance')
      }
    },
    {
      id: 'notif-client-departure',
      title: 'Client sur le départ',
      message: 'EURL MARTIN a manifesté son intention de quitter le cabinet',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      module: 'Croissance',
      priority: 'high' as const,
      action: {
        label: 'Plan de rétention',
        onClick: () => navigate('/croissance')
      }
    },
    {
      id: 'notif-client-follow',
      title: 'Client à suivre prioritaire',
      message: 'SCI IMMOBILIER PLUS nécessite un contact dans les 48h (suivi 9 mois)',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      module: 'Croissance',
      priority: 'high' as const
    },
    
    // RH & Congés
    {
      id: 'notif-leave-1',
      title: 'Demande de congé en attente',
      message: 'Sophie Laurent a demandé 5 jours de congé du 15 au 19 janvier',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      module: 'RH',
      priority: 'medium' as const,
      action: {
        label: 'Traiter demande',
        onClick: () => navigate('/rh')
      }
    },
    {
      id: 'notif-leave-approved',
      title: 'Congé approuvé',
      message: 'Votre demande de congé du 22 au 26 janvier a été approuvée',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      module: 'RH',
      priority: 'low' as const
    },
    {
      id: 'notif-sick-leave',
      title: 'Arrêt maladie déclaré',
      message: 'Marc Dubois a déclaré un arrêt maladie de 3 jours (certificat joint)',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      module: 'RH',
      priority: 'medium' as const
    },
    
    // Timesheet & Production
    {
      id: 'notif-timesheet-1',
      title: 'Timesheet non complété',
      message: 'Votre timesheet de la semaine 03/2025 est incomplet (3 jours manquants)',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
      module: 'Production',
      priority: 'high' as const,
      action: {
        label: 'Compléter timesheet',
        onClick: () => navigate('/production')
      }
    },
    {
      id: 'notif-timesheet-reminder',
      title: 'Rappel timesheet hebdomadaire',
      message: 'N\'oubliez pas de valider votre timesheet avant vendredi 17h',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
      module: 'Production',
      priority: 'low' as const
    },
    
    // Développement & Plans
    {
      id: 'notif-plan-assigned',
      title: 'Plan de correction assigné',
      message: 'Vous avez été assigné au plan "Optimisation TVA" pour SARL TECHNO',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
      module: 'Développement',
      priority: 'medium' as const,
      action: {
        label: 'Voir le plan',
        onClick: () => navigate('/developpement')
      }
    },
    {
      id: 'notif-plan-deadline',
      title: 'Échéance plan de correction',
      message: 'Le plan "Mise en conformité RGPD" arrive à échéance dans 2 jours',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      read: false,
      module: 'Développement',
      priority: 'high' as const
    },
    
    // Rendez-vous & Planning
    {
      id: 'notif-rdv-today',
      title: 'Rendez-vous du jour',
      message: 'RDV avec EURL BATIMENT+ à 14h30 - Bilan annuel et perspectives',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      module: 'Planning',
      priority: 'high' as const,
      action: {
        label: 'Voir planning',
        onClick: () => navigate('/planning')
      }
    },
    {
      id: 'notif-rdv-reminder',
      title: 'Rappel de planification',
      message: 'Pensez à planifier vos RDV clients pour la semaine prochaine',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      module: 'Planning',
      priority: 'low' as const
    },
    
    // Finance & Facturation
    {
      id: 'notif-invoice-overdue',
      title: 'Facture en retard',
      message: 'La facture F2025-001 de SAS COMMERCE est en retard de 15 jours',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      read: false,
      module: 'Finance',
      priority: 'high' as const
    },
    {
      id: 'notif-payment-received',
      title: 'Paiement reçu',
      message: 'Paiement de 2 450€ reçu de SARL DISTRIBUTION pour facture F2025-045',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
      module: 'Finance',
      priority: 'low' as const
    },
    
    // Système & Alertes
    {
      id: 'notif-system-maintenance',
      title: 'Maintenance système programmée',
      message: 'Maintenance du serveur prévue dimanche 26/01 de 2h à 6h du matin',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      read: true,
      module: 'Système',
      priority: 'medium' as const
    },
    {
      id: 'notif-backup-success',
      title: 'Sauvegarde réussie',
      message: 'Sauvegarde automatique des données effectuée avec succès',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      module: 'Système',
      priority: 'low' as const
    }
  ];

  // Filtrer les notifications
  const filteredNotifications = allNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesModule = filterModule === 'all' || notification.module === filterModule;
    
    return matchesSearch && matchesType && matchesModule;
  });

  // Grouper par statut
  const unreadNotifications = filteredNotifications.filter(n => !n.read);
  const readNotifications = filteredNotifications.filter(n => n.read);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-blue-500 bg-blue-50/50';
    }
  };

  const getModuleIcon = (module?: string) => {
    switch (module) {
      case 'Clients': return <Users className="w-4 h-4" />;
      case 'Croissance': return <TrendingUp className="w-4 h-4" />;
      case 'Développement': return <FileText className="w-4 h-4" />;
      case 'RH': return <UserCheck className="w-4 h-4" />;
      case 'Finance': return <Building className="w-4 h-4" />;
      case 'Production': return <Clock className="w-4 h-4" />;
      case 'Planning': return <Calendar className="w-4 h-4" />;
      case 'Système': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Gérez toutes vos notifications en un seul endroit
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {unreadNotifications.length} non lues
            </Badge>
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadNotifications.length === 0}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer lu
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher dans les notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="error">Erreur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les modules</SelectItem>
                  <SelectItem value="Clients">Clients</SelectItem>
                  <SelectItem value="Croissance">Croissance</SelectItem>
                  <SelectItem value="Développement">Développement</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Système">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Onglets par statut */}
        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              Non lues
              {unreadNotifications.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {unreadNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">
              Lues ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification non lue</h3>
                  <p className="text-muted-foreground">Toutes vos notifications sont à jour !</p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map((notification) => (
                <Card key={notification.id} className={`border-l-4 ${getPriorityColor(notification.priority)} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              {getModuleIcon(notification.module)}
                              <span>{notification.module}</span>
                            </div>
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            {notification.priority && (
                              <Badge variant="outline" className={
                                notification.priority === 'high' ? 'border-red-300 text-red-700' :
                                notification.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-green-300 text-green-700'
                              }>
                                {notification.priority === 'high' ? 'Urgent' : 
                                 notification.priority === 'medium' ? 'Moyen' : 'Faible'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={notification.action.onClick}
                            className="whitespace-nowrap"
                          >
                            {notification.action.label}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="p-2"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {readNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification lue</h3>
                  <p className="text-muted-foreground">Les notifications que vous avez lues apparaîtront ici.</p>
                </CardContent>
              </Card>
            ) : (
              readNotifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-gray-300 bg-gray-50/50 opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-700">{notification.title}</h3>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              {getModuleIcon(notification.module)}
                              <span>{notification.module}</span>
                            </div>
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.action && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={notification.action.onClick}
                            className="whitespace-nowrap"
                          >
                            {notification.action.label}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
