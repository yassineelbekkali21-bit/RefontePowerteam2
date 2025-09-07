import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  RefreshCw as Sync, 
  Mail, 
  Clock,
  Globe,
  Download,
  Upload,
  Key,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  UserCheck,
  UserX,
  Crown,
  Edit,
  Briefcase,
  Search,
  Building,
  Euro
} from 'lucide-react';

type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  hourlyRate: number;
  weeklyCapacity: number;
  team: string;
  avatarUrl?: string;
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    deadlines: true,
    reports: true,
    supervision: true
  });
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    frequency: '1h',
    lastSync: '2024-01-15 14:30:00'
  });

  const [userRoles, setUserRoles] = useState([
    {
      id: 1,
      name: 'SuperAdmin',
      description: 'Accès complet système, gestion des admins et configuration globale',
      permissions: {
        clients: { read: true, write: true, delete: true },
        finance: { read: true, write: true, delete: true },
        rh: { read: true, write: true, delete: true },
        prestations: { read: true, write: true, delete: true },
        supervision: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        userManagement: { read: true, write: true, delete: true },
        systemConfig: { read: true, write: true, delete: true }
      },
      users: ['superadmin@powerteam.fr'],
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administration complète des modules opérationnels',
      permissions: {
        clients: { read: true, write: true, delete: true },
        finance: { read: true, write: true, delete: true },
        rh: { read: true, write: true, delete: true },
        prestations: { read: true, write: true, delete: true },
        supervision: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: false },
        userManagement: { read: true, write: true, delete: false },
        systemConfig: { read: true, write: false, delete: false }
      },
      users: ['admin@powerteam.fr', 'admin2@powerteam.fr'],
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 3,
      name: 'Partner',
      description: 'Accès étendu aux données clients et supervision',
      permissions: {
        clients: { read: true, write: true, delete: false },
        finance: { read: true, write: true, delete: false },
        rh: { read: true, write: false, delete: false },
        prestations: { read: true, write: true, delete: false },
        supervision: { read: true, write: true, delete: false },
        settings: { read: true, write: false, delete: false },
        userManagement: { read: false, write: false, delete: false },
        systemConfig: { read: false, write: false, delete: false }
      },
      users: ['partner1@powerteam.fr', 'partner2@powerteam.fr'],
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 4,
      name: 'Superviseurs',
      description: 'Supervision d\'équipe et validation des processus',
      permissions: {
        clients: { read: true, write: true, delete: false },
        finance: { read: true, write: false, delete: false },
        rh: { read: true, write: true, delete: false },
        prestations: { read: true, write: true, delete: false },
        supervision: { read: true, write: true, delete: false },
        settings: { read: true, write: false, delete: false },
        userManagement: { read: false, write: false, delete: false },
        systemConfig: { read: false, write: false, delete: false }
      },
      users: ['supervisor1@powerteam.fr', 'supervisor2@powerteam.fr', 'supervisor3@powerteam.fr'],
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 5,
      name: 'Collaborateurs',
      description: 'Accès opérationnel aux tâches quotidiennes',
      permissions: {
        clients: { read: true, write: false, delete: false },
        finance: { read: true, write: false, delete: false },
        rh: { read: true, write: false, delete: false },
        prestations: { read: true, write: true, delete: false },
        supervision: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false },
        userManagement: { read: false, write: false, delete: false },
        systemConfig: { read: false, write: false, delete: false }
      },
      users: ['collab1@powerteam.fr', 'collab2@powerteam.fr', 'collab3@powerteam.fr', 'collab4@powerteam.fr'],
      color: 'text-gray-600 bg-gray-100'
    }
  ]);

  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [isUserConfigModalOpen, setIsUserConfigModalOpen] = useState(false);
  const [currentUserConfig, setCurrentUserConfig] = useState<UserData | null>(null);

  const [users, setUsers] = useState<UserData[]>([
    { email: 'superadmin@powerteam.fr', firstName: 'Super', lastName: 'Admin', hourlyRate: 120, weeklyCapacity: 40, team: 'Direction', avatarUrl: '/avatars/sa.png' },
    { email: 'admin@powerteam.fr', firstName: 'Alex', lastName: 'Dupont', hourlyRate: 90, weeklyCapacity: 35, team: 'Administration', avatarUrl: '/avatars/admin1.png' },
    { email: 'admin2@powerteam.fr', firstName: 'Marie', lastName: 'Lefebvre', hourlyRate: 90, weeklyCapacity: 35, team: 'Administration', avatarUrl: '/avatars/admin2.png' },
    { email: 'partner1@powerteam.fr', firstName: 'Julien', lastName: 'Lambert', hourlyRate: 110, weeklyCapacity: 45, team: 'Partenaires', avatarUrl: '/avatars/partner1.png' },
    { email: 'partner2@powerteam.fr', firstName: 'Carole', lastName: 'Martin', hourlyRate: 115, weeklyCapacity: 45, team: 'Partenaires', avatarUrl: '/avatars/partner2.png' },
    { email: 'supervisor1@powerteam.fr', firstName: 'Nathalie', lastName: 'Durand', hourlyRate: 85, weeklyCapacity: 38, team: 'Supervision', avatarUrl: '/avatars/sup1.png' },
    { email: 'supervisor2@powerteam.fr', firstName: 'Pierre', lastName: 'Moreau', hourlyRate: 85, weeklyCapacity: 38, team: 'Supervision', avatarUrl: '/avatars/sup2.png' },
    { email: 'supervisor3@powerteam.fr', firstName: 'Sophie', lastName: 'Richard', hourlyRate: 82, weeklyCapacity: 38, team: 'Supervision', avatarUrl: '/avatars/sup3.png' },
    { email: 'collab1@powerteam.fr', firstName: 'Lucas', lastName: 'Petit', hourlyRate: 60, weeklyCapacity: 35, team: 'Production', avatarUrl: '/avatars/collab1.png' },
    { email: 'collab2@powerteam.fr', firstName: 'Emma', lastName: 'Robert', hourlyRate: 62, weeklyCapacity: 35, team: 'Production', avatarUrl: '/avatars/collab2.png' },
    { email: 'collab3@powerteam.fr', firstName: 'Gabriel', lastName: 'Bernard', hourlyRate: 58, weeklyCapacity: 35, team: 'Production', avatarUrl: '/avatars/collab3.png' },
    { email: 'collab4@powerteam.fr', firstName: 'Chloé', lastName: 'Simon', hourlyRate: 65, weeklyCapacity: 35, team: 'Production', avatarUrl: '/avatars/collab4.png' }
  ]);

  // Liste de tous les utilisateurs disponibles
  const allUsers = users.map(u => u.email);

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) return;

    // Retirer l'utilisateur de son ancien rôle
    setUserRoles(prevRoles => 
      prevRoles.map(role => ({
        ...role,
        users: role.users.filter(user => user !== selectedUser)
      }))
    );

    // Ajouter l'utilisateur au nouveau rôle
    setUserRoles(prevRoles => 
      prevRoles.map(role => 
        role.id.toString() === selectedRole
          ? { ...role, users: [...role.users, selectedUser] }
          : role
      )
    );

    setIsAssignRoleOpen(false);
    setSelectedUser('');
    setSelectedRole('');
  };

  const handleAddNewUser = () => {
    if (!newUserEmail || !selectedRole) return;

    // Ajouter le nouvel utilisateur au rôle sélectionné
    setUserRoles(prevRoles => 
      prevRoles.map(role => 
        role.id.toString() === selectedRole
          ? { ...role, users: [...role.users, newUserEmail] }
          : role
      )
    );

    setNewUserEmail('');
    setSelectedRole('');
    setIsAssignRoleOpen(false);
  };

  const handleRemoveUserFromRole = (userEmail: string, roleId: number) => {
    setUserRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === roleId
          ? { ...role, users: role.users.filter(user => user !== userEmail) }
          : role
      )
    );
  };

  const handleSaveUserConfig = (updatedUser: UserData) => {
    setUsers(prevUsers => prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u));
    setIsUserConfigModalOpen(false);
    setCurrentUserConfig(null);
  };

  const userListWithRoles = useMemo(() => {
    const userDetails = [];
    userRoles.forEach(role => {
        role.users.forEach(userEmail => {
            const user = users.find(u => u.email === userEmail);
            if (user) {
                userDetails.push({
                    email: userEmail,
                    role: {
                        id: role.id,
                        name: role.name,
                        color: role.color
                    }
                });
            }
        });
    });
    return userDetails.sort((a, b) => a.email.localeCompare(b.email));
  }, [userRoles, users]);

  const filteredUsers = userListWithRoles.filter(user => 
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PageHeader
          title="Paramètres"
          description="Configurez Powerteam selon vos préférences"
          icon={SettingsIcon}
          actions={
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Synchronisé
              </Badge>
            </div>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="sync">Synchronisation</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="access">Accès</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom</Label>
                    <Input defaultValue="Yassine" />
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input defaultValue="Elbekka" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue="yassine@powerteam.com" type="email" />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input defaultValue="+33 6 12 34 56 78" />
                  </div>
                </div>
                <div>
                  <Label>Fiduciaire</Label>
                  <Input defaultValue="Cabinet Comptable Powerteam" />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="collaborator">Collaborateur</SelectItem>
                      <SelectItem value="viewer">Lecteur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegarder le Profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Préférences de Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Notifications par Email</Label>
                      <p className="text-sm text-gray-600">Recevez les alertes importantes par email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Notifications Push</Label>
                      <p className="text-sm text-gray-600">Alertes en temps réel dans le navigateur</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Échéances Clients</Label>
                      <p className="text-sm text-gray-600">Rappels pour les deadlines importantes</p>
                    </div>
                    <Switch 
                      checked={notifications.deadlines}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, deadlines: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Rapports Hebdomadaires</Label>
                      <p className="text-sm text-gray-600">Synthèse de votre activité chaque semaine</p>
                    </div>
                    <Switch 
                      checked={notifications.reports}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Supervisions en Attente</Label>
                      <p className="text-sm text-gray-600">Rappels pour les supervisions à effectuer</p>
                    </div>
                    <Switch 
                      checked={notifications.supervision}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, supervision: checked }))}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-base font-medium">Heures de Notification</Label>
                  <p className="text-sm text-gray-600 mb-3">Définissez quand recevoir les notifications</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Début</Label>
                      <Input type="time" defaultValue="08:00" />
                    </div>
                    <div>
                      <Label>Fin</Label>
                      <Input type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegarder les Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Synchronisation */}
          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Sources de Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Synchronisation ERP */}
                  <Card className="border-2 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Sync className="w-5 h-5 mr-2 text-blue-600" />
                        ERP Connecté
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Statut</span>
                        <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type</span>
                        <span className="text-sm text-gray-600">API REST</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Dernière sync</span>
                        <span className="text-sm text-gray-600">{syncSettings.lastSync}</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Import Excel */}
                  <Card className="border-2 border-orange-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Upload className="w-5 h-5 mr-2 text-orange-600" />
                        Import Excel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Statut</span>
                        <Badge variant="outline">Manuel</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Dernier import</span>
                        <span className="text-sm text-gray-600">14/01/2024</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Importer Fichier
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Paramètres de Synchronisation */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Paramètres de Synchronisation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Synchronisation Automatique</Label>
                        <p className="text-sm text-gray-600">Synchronise automatiquement les données</p>
                      </div>
                      <Switch 
                        checked={syncSettings.autoSync}
                        onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, autoSync: checked }))}
                      />
                    </div>

                    {syncSettings.autoSync && (
                      <div>
                        <Label>Fréquence de Synchronisation</Label>
                        <Select 
                          value={syncSettings.frequency} 
                          onValueChange={(value) => setSyncSettings(prev => ({ ...prev, frequency: value }))}
                        >
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
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Synchroniser Maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sécurité et Accès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Changement de mot de passe */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mot de Passe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Mot de passe actuel</Label>
                      <Input type="password" />
                    </div>
                    <div>
                      <Label>Nouveau mot de passe</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <div>
                    <Label>Confirmer le nouveau mot de passe</Label>
                    <Input type="password" />
                  </div>
                  <Button>
                    <Key className="w-4 h-4 mr-2" />
                    Changer le Mot de Passe
                  </Button>
                </div>

                {/* Clé API */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Clé API</h3>
                  <p className="text-sm text-gray-600">
                    Utilisée pour les intégrations et synchronisations automatiques
                  </p>
                  <div className="flex space-x-2">
                    <Input 
                      type={showApiKey ? "text" : "password"}
                      value="pk_live_51234567890abcdef"
                      readOnly
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Connexions actives */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Sessions Actives</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Session Actuelle</p>
                        <p className="text-sm text-gray-600">Chrome • Paris • Il y a 5 minutes</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Actuel</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">iPhone Safari</p>
                        <p className="text-sm text-gray-600">Mobile • Lyon • Il y a 2 heures</p>
                      </div>
                      <Button variant="outline" size="sm">Déconnecter</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Accès */}
          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Gestion des Accès par Rôles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vue d'ensemble des rôles */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {userRoles.map((role) => (
                    <Card key={role.id} className="border-l-4" style={{borderLeftColor: role.color.includes('red') ? '#dc2626' : role.color.includes('purple') ? '#9333ea' : role.color.includes('blue') ? '#2563eb' : role.color.includes('green') ? '#16a34a' : '#6b7280'}}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {role.name === 'SuperAdmin' && <Crown className="w-5 h-5 text-red-600" />}
                            {role.name === 'Admin' && <Shield className="w-5 h-5 text-purple-600" />}
                            {role.name === 'Partner' && <Briefcase className="w-5 h-5 text-blue-600" />}
                            {role.name === 'Superviseurs' && <UserCheck className="w-5 h-5 text-green-600" />}
                            {role.name === 'Collaborateurs' && <User className="w-5 h-5 text-gray-600" />}
                            <h3 className="font-semibold">{role.name}</h3>
                          </div>
                          <Badge className={role.color}>
                            {role.users.length} user{role.users.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{role.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* Aperçu des permissions */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Modules autorisés :</h4>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(role.permissions).map(([module, perms]) => {
                              if (module === 'userManagement' || module === 'systemConfig') return null;
                              const hasAccess = perms.read || perms.write || perms.delete;
                              if (!hasAccess) return null;
                              return (
                                <Badge 
                                  key={module} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {module}
                                  {perms.write && ' ✏️'}
                                  {perms.delete && ' 🗑️'}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        {/* Liste des utilisateurs */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Utilisateurs :</h4>
                          <div className="space-y-1">
                            {role.users.slice(0, 3).map((user, index) => (
                              <div key={index} className="text-xs text-gray-500 flex items-center justify-between">
                                <span>{user}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveUserFromRole(user, role.id)}
                                >
                                  <UserX className="w-3 h-3 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            {role.users.length > 3 && (
                              <p className="text-xs text-gray-400">+{role.users.length - 3} autres...</p>
                            )}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full mt-4">
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier les Permissions
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Matrice des permissions détaillée */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matrice des Permissions Détaillée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Module</th>
                            {userRoles.map((role) => (
                              <th key={role.id} className="text-center py-3 px-2 font-medium">
                                <div className="flex flex-col items-center">
                                  <span>{role.name}</span>
                                  <Badge className={`${role.color} text-xs mt-1`}>
                                    {role.users.length}
                                  </Badge>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {['clients', 'finance', 'rh', 'prestations', 'supervision', 'settings'].map((module) => (
                            <tr key={module} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2 font-medium capitalize">{module}</td>
                              {userRoles.map((role) => (
                                <td key={role.id} className="py-3 px-2 text-center">
                                  <div className="flex justify-center space-x-1">
                                    {role.permissions[module]?.read && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-600">L</Badge>
                                    )}
                                    {role.permissions[module]?.write && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">E</Badge>
                                    )}
                                    {role.permissions[module]?.delete && (
                                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600">S</Badge>
                                    )}
                                    {!role.permissions[module]?.read && !role.permissions[module]?.write && !role.permissions[module]?.delete && (
                                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-400">❌</Badge>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                      <p>L = Lecture | E = Écriture | S = Suppression</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter la Matrice
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dialog open={isAssignRoleOpen} onOpenChange={setIsAssignRoleOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Attribuer un Rôle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <UserCheck className="w-5 h-5 mr-2" />
                          Attribution de Rôle
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Tabs defaultValue="existing" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="existing">Utilisateur Existant</TabsTrigger>
                            <TabsTrigger value="new">Nouvel Utilisateur</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="existing" className="space-y-4">
                            <div>
                              <Label>Sélectionner un utilisateur</Label>
                              <Select value={selectedUser} onValueChange={setSelectedUser}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                  {allUsers.map((user) => (
                                    <SelectItem key={user} value={user}>
                                      {user}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Attribuer le rôle</Label>
                              <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                      <div className="flex items-center space-x-2">
                                        {role.name === 'SuperAdmin' && <Crown className="w-4 h-4 text-red-600" />}
                                        {role.name === 'Admin' && <Shield className="w-4 h-4 text-purple-600" />}
                                        {role.name === 'Partner' && <Briefcase className="w-4 h-4 text-blue-600" />}
                                        {role.name === 'Superviseurs' && <UserCheck className="w-4 h-4 text-green-600" />}
                                        {role.name === 'Collaborateurs' && <User className="w-4 h-4 text-gray-600" />}
                                        <span>{role.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={handleAssignRole} 
                              className="w-full"
                              disabled={!selectedUser || !selectedRole}
                            >
                              Attribuer le Rôle
                            </Button>
                          </TabsContent>
                          
                          <TabsContent value="new" className="space-y-4">
                            <div>
                              <Label>Email du nouvel utilisateur</Label>
                              <Input
                                type="email"
                                placeholder="utilisateur@powerteam.fr"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Attribuer le rôle</Label>
                              <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choisir un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                      <div className="flex items-center space-x-2">
                                        {role.name === 'SuperAdmin' && <Crown className="w-4 h-4 text-red-600" />}
                                        {role.name === 'Admin' && <Shield className="w-4 h-4 text-purple-600" />}
                                        {role.name === 'Partner' && <Briefcase className="w-4 h-4 text-blue-600" />}
                                        {role.name === 'Superviseurs' && <UserCheck className="w-4 h-4 text-green-600" />}
                                        {role.name === 'Collaborateurs' && <User className="w-4 h-4 text-gray-600" />}
                                        <span>{role.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              onClick={handleAddNewUser} 
                              className="w-full"
                              disabled={!newUserEmail || !selectedRole}
                            >
                              Créer et Attribuer
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline">
                    <Crown className="w-4 h-4 mr-2" />
                    Créer un Rôle Custom
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Synchroniser les Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Liste des Utilisateurs ({userListWithRoles.length})</span>
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Rechercher un collaborateur..."
                      className="pl-9"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Collaborateur</th>
                        <th className="text-left py-3 px-2 font-medium">Rôle Assigné</th>
                        <th className="text-right py-3 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.email} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{user.email}</td>
                          <td className="py-3 px-2">
                            <Badge className={user.role.color}>
                              {user.role.name}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const userToConfig = users.find(u => u.email === user.email);
                                if (userToConfig) {
                                  setCurrentUserConfig(userToConfig);
                                  setIsUserConfigModalOpen(true);
                                }
                              }}
                            >
                              <Edit className="w-3 h-3 mr-2" />
                              Modifier
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun utilisateur trouvé.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Personnalisation de l'Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Thème</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <Card className="cursor-pointer border-2 border-blue-500">
                      <CardContent className="p-4 text-center">
                        <div className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-2"></div>
                        <p className="text-sm font-medium">Powerteam (Actuel)</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer border-2 border-transparent hover:border-gray-400">
                      <CardContent className="p-4 text-center">
                        <div className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded mb-2"></div>
                        <p className="text-sm font-medium">Sombre</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer border-2 border-transparent hover:border-gray-400">
                      <CardContent className="p-4 text-center">
                        <div className="w-full h-12 bg-gradient-to-r from-white to-gray-100 rounded mb-2 border"></div>
                        <p className="text-sm font-medium">Clair</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Fuseau Horaire</Label>
                  <Select defaultValue="europe/paris">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe/paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="europe/london">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="america/newyork">America/New_York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Appliquer les Modifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Avancé */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Paramètres Avancés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export de données */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Export de Données</h3>
                  <p className="text-sm text-gray-600">
                    Exportez toutes vos données Powerteam pour sauvegarde ou migration
                  </p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter mes Données
                  </Button>
                </div>

                {/* Logs et debug */}
                <div className="border-t pt-6 space-y-3">
                  <h3 className="text-lg font-semibold">Logs et Débogage</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir les Logs de Synchronisation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Rapporter un Bug
                    </Button>
                  </div>
                </div>

                {/* Zone de danger */}
                <div className="border-t pt-6 space-y-3">
                  <h3 className="text-lg font-semibold text-red-600">Zone de Danger</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-red-800">Réinitialiser les Données</h4>
                      <p className="text-sm text-red-600">
                        Supprime toutes les données locales et remet l'application à zéro
                      </p>
                    </div>
                    <Button variant="destructive">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {currentUserConfig && (
          <Dialog open={isUserConfigModalOpen} onOpenChange={setIsUserConfigModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Configurer {currentUserConfig.firstName} {currentUserConfig.lastName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom</Label>
                    <Input 
                      value={currentUserConfig.firstName}
                      onChange={(e) => setCurrentUserConfig({...currentUserConfig, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input 
                      value={currentUserConfig.lastName}
                      onChange={(e) => setCurrentUserConfig({...currentUserConfig, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={currentUserConfig.email} disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Taux Horaire (€/h)</Label>
                    <div className="relative">
                      <Input 
                        id="hourlyRate"
                        type="number"
                        value={currentUserConfig.hourlyRate}
                        onChange={(e) => setCurrentUserConfig({...currentUserConfig, hourlyRate: parseInt(e.target.value) || 0})}
                        className="pl-8"
                      />
                      <Euro className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="weeklyCapacity">Capacité Hebdomadaire (h)</Label>
                    <div className="relative">
                      <Input 
                        id="weeklyCapacity"
                        type="number"
                        value={currentUserConfig.weeklyCapacity}
                        onChange={(e) => setCurrentUserConfig({...currentUserConfig, weeklyCapacity: parseInt(e.target.value) || 0})}
                        className="pl-8"
                      />
                       <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Équipe</Label>
                  <Select 
                    value={currentUserConfig.team}
                    onValueChange={(value) => setCurrentUserConfig({...currentUserConfig, team: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direction">Direction</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Partenaires">Partenaires</SelectItem>
                      <SelectItem value="Supervision">Supervision</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSaveUserConfig(currentUserConfig)} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sauvegarder les Modifications
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Settings;
