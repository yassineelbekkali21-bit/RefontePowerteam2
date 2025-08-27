/**
 * Composant Suivi des Portefeuilles
 * Analyse et suivi des portefeuilles clients par gestionnaire
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Award,
  AlertTriangle,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Eye,
  Filter,
  Download,
  RefreshCw,
  User,
  Building,
  Star,
  Zap,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Briefcase,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Types pour le Suivi des Portefeuilles
interface Gestionnaire {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  dateEmbauche: Date;
  specialites: string[];
  couleur: string;
}

interface ClientPortefeuille {
  id: string;
  nom: string;
  type: string;
  gestionnaire: string;
  chiffreAffaires: number;
  marge: number;
  satisfaction: number; // 1-5
  anciennete: number; // en années
  risqueAttrition: 'low' | 'medium' | 'high';
  dernierContact: Date;
  prochainRendezVous?: Date;
  statut: 'actif' | 'inactif' | 'prospect' | 'perdu';
  tendance: 'up' | 'down' | 'stable';
}

interface MetriquesPortefeuille {
  nombreClients: number;
  chiffreAffairesTotal: number;
  margeTotal: number;
  satisfactionMoyenne: number;
  tauxAttrition: number;
  croissance: number;
}

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316',
  teal: '#14B8A6',
  indigo: '#6366F1',
  pink: '#EC4899',
  cyan: '#06B6D4'
};

// Mock data
const gestionnaires: Gestionnaire[] = [
  {
    id: '1',
    nom: 'Sophie Laurent',
    email: 'sophie.laurent@cabinet.com',
    telephone: '+33 1 23 45 67 89',
    role: 'Senior Manager',
    dateEmbauche: new Date('2020-01-15'),
    specialites: ['Professions médicales', 'TVA complexe', 'Optimisation fiscale'],
    couleur: COLORS.primary
  },
  {
    id: '2',
    nom: 'Pierre Martin',
    email: 'pierre.martin@cabinet.com',
    telephone: '+33 1 34 56 78 90',
    role: 'Manager',
    dateEmbauche: new Date('2021-03-10'),
    specialites: ['Artistes', 'Production audiovisuelle', 'Droits d\'auteur'],
    couleur: COLORS.success
  },
  {
    id: '3',
    nom: 'Marie Durand',
    email: 'marie.durand@cabinet.com',
    telephone: '+33 1 45 67 89 01',
    role: 'Comptable Senior',
    dateEmbauche: new Date('2019-09-01'),
    specialites: ['PME/TPE', 'Comptabilité générale', 'Déclarations fiscales'],
    couleur: COLORS.warning
  },
  {
    id: '4',
    nom: 'Jean Moreau',
    email: 'jean.moreau@cabinet.com',
    telephone: '+33 1 56 78 90 12',
    role: 'Superviseur',
    dateEmbauche: new Date('2018-05-20'),
    specialites: ['Audit', 'Contrôle de gestion', 'Formation équipes'],
    couleur: COLORS.purple
  }
];

const clientsPortefeuille: ClientPortefeuille[] = [
  {
    id: '1',
    nom: 'Dr. Martin Dubois',
    type: 'Médecin',
    gestionnaire: 'Sophie Laurent',
    chiffreAffaires: 15750,
    marge: 4200,
    satisfaction: 5,
    anciennete: 3.2,
    risqueAttrition: 'low',
    dernierContact: new Date('2025-01-20'),
    prochainRendezVous: new Date('2025-02-15'),
    statut: 'actif',
    tendance: 'up'
  },
  {
    id: '2',
    nom: 'Cabinet Dentaire Smile',
    type: 'Dentiste',
    gestionnaire: 'Pierre Martin',
    chiffreAffaires: 12300,
    marge: 2800,
    satisfaction: 3,
    anciennete: 1.8,
    risqueAttrition: 'high',
    dernierContact: new Date('2025-01-05'),
    statut: 'actif',
    tendance: 'down'
  },
  {
    id: '3',
    nom: 'Kiné Plus Rééducation',
    type: 'Kinésithérapeute',
    gestionnaire: 'Sophie Laurent',
    chiffreAffaires: 8900,
    marge: 2400,
    satisfaction: 4,
    anciennete: 2.5,
    risqueAttrition: 'low',
    dernierContact: new Date('2025-01-18'),
    prochainRendezVous: new Date('2025-03-10'),
    statut: 'actif',
    tendance: 'stable'
  },
  {
    id: '4',
    nom: 'Productions Créatives SARL',
    type: 'Production',
    gestionnaire: 'Pierre Martin',
    chiffreAffaires: 22400,
    marge: 6100,
    satisfaction: 4,
    anciennete: 4.1,
    risqueAttrition: 'medium',
    dernierContact: new Date('2025-01-22'),
    statut: 'actif',
    tendance: 'up'
  },
  {
    id: '5',
    nom: 'Artiste Léa Moreau',
    type: 'Artiste',
    gestionnaire: 'Marie Durand',
    chiffreAffaires: 6800,
    marge: 1900,
    satisfaction: 5,
    anciennete: 1.2,
    risqueAttrition: 'low',
    dernierContact: new Date('2025-01-15'),
    statut: 'actif',
    tendance: 'up'
  },
  {
    id: '6',
    nom: 'Restaurant Le Gourmet',
    type: 'Restauration',
    gestionnaire: 'Marie Durand',
    chiffreAffaires: 0,
    marge: 0,
    satisfaction: 2,
    anciennete: 0.5,
    risqueAttrition: 'high',
    dernierContact: new Date('2024-12-10'),
    statut: 'perdu',
    tendance: 'down'
  }
];

export default function SuiviPortefeuilles() {
  const [gestionnaireSelectionne, setGestionnaireSelectionne] = useState('all');
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('annee');
  const [vueActive, setVueActive] = useState<'overview' | 'gestionnaires' | 'clients' | 'analytics'>('overview');

  // Calculs des métriques par gestionnaire
  const metriquesParGestionnaire = useMemo(() => {
    return gestionnaires.map(gestionnaire => {
      const clientsGestionnaire = clientsPortefeuille.filter(c => c.gestionnaire === gestionnaire.nom);
      const clientsActifs = clientsGestionnaire.filter(c => c.statut === 'actif');
      
      const metriques: MetriquesPortefeuille = {
        nombreClients: clientsActifs.length,
        chiffreAffairesTotal: clientsActifs.reduce((sum, c) => sum + c.chiffreAffaires, 0),
        margeTotal: clientsActifs.reduce((sum, c) => sum + c.marge, 0),
        satisfactionMoyenne: clientsActifs.length > 0 
          ? clientsActifs.reduce((sum, c) => sum + c.satisfaction, 0) / clientsActifs.length 
          : 0,
        tauxAttrition: clientsGestionnaire.filter(c => c.statut === 'perdu').length / Math.max(clientsGestionnaire.length, 1) * 100,
        croissance: Math.random() * 20 - 5 // Mock data
      };

      return {
        gestionnaire,
        metriques,
        clientsActifs
      };
    });
  }, []);

  // Métriques globales
  const metriquesGlobales = useMemo(() => {
    const clientsActifs = clientsPortefeuille.filter(c => c.statut === 'actif');
    return {
      nombreClientsTotal: clientsActifs.length,
      chiffreAffairesTotal: clientsActifs.reduce((sum, c) => sum + c.chiffreAffaires, 0),
      margeTotal: clientsActifs.reduce((sum, c) => sum + c.marge, 0),
      satisfactionMoyenne: clientsActifs.reduce((sum, c) => sum + c.satisfaction, 0) / clientsActifs.length,
      clientsRisque: clientsActifs.filter(c => c.risqueAttrition === 'high').length,
      croissanceMoyenne: metriquesParGestionnaire.reduce((sum, m) => sum + m.metriques.croissance, 0) / metriquesParGestionnaire.length
    };
  }, [metriquesParGestionnaire]);

  // Données pour les graphiques
  const donneesChiffreAffaires = metriquesParGestionnaire.map(m => ({
    nom: m.gestionnaire.nom.split(' ')[0],
    ca: Math.round(m.metriques.chiffreAffairesTotal / 1000),
    marge: Math.round(m.metriques.margeTotal / 1000),
    clients: m.metriques.nombreClients,
    couleur: m.gestionnaire.couleur
  }));

  const donneesRadar = metriquesParGestionnaire.map(m => ({
    gestionnaire: m.gestionnaire.nom.split(' ')[0],
    'Chiffre d\'affaires': Math.min(m.metriques.chiffreAffairesTotal / 1000, 100),
    'Satisfaction': m.metriques.satisfactionMoyenne * 20,
    'Nombre clients': m.metriques.nombreClients * 10,
    'Marge': Math.min(m.metriques.margeTotal / 100, 100),
    'Rétention': Math.max(100 - m.metriques.tauxAttrition * 10, 0)
  }));

  const getTendanceIcon = (tendance: string) => {
    switch (tendance) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <ArrowUp className="w-4 h-4 text-gray-500 rotate-90" />;
    }
  };

  const getRisqueColor = (risque: string) => {
    switch (risque) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'perdu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-blue-800">{metriquesGlobales.nombreClientsTotal}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">CA Total</p>
                <p className="text-2xl font-bold text-green-800">
                  {Math.round(metriquesGlobales.chiffreAffairesTotal / 1000)}k€
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Marge Totale</p>
                <p className="text-2xl font-bold text-purple-800">
                  {Math.round(metriquesGlobales.margeTotal / 1000)}k€
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {metriquesGlobales.satisfactionMoyenne.toFixed(1)}/5
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Clients à Risque</p>
                <p className="text-2xl font-bold text-red-800">{metriquesGlobales.clientsRisque}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation des vues */}
      <div className="flex items-center justify-between">
        <Tabs value={vueActive} onValueChange={(value) => setVueActive(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="gestionnaires" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gestionnaires
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytiques
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Select value={periodeSelectionnee} onValueChange={setPeriodeSelectionnee}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Contenu selon la vue active */}
      <Tabs value={vueActive} className="space-y-6">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance par gestionnaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance par Gestionnaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donneesChiffreAffaires}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'ca' ? `${value}k€` : name === 'marge' ? `${value}k€` : `${value}`,
                        name === 'ca' ? 'Chiffre d\'affaires' : name === 'marge' ? 'Marge' : 'Clients'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="ca" fill={COLORS.primary} name="CA (k€)" />
                    <Bar dataKey="marge" fill={COLORS.success} name="Marge (k€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition du portefeuille */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Répartition du CA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={donneesChiffreAffaires}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nom, ca }) => `${nom}: ${ca}k€`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="ca"
                    >
                      {donneesChiffreAffaires.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.couleur} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gestionnaires" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {metriquesParGestionnaire.map(({ gestionnaire, metriques, clientsActifs }) => (
              <Card key={gestionnaire.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: gestionnaire.couleur }}
                    >
                      {gestionnaire.nom.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{gestionnaire.nom}</CardTitle>
                      <p className="text-sm text-gray-600">{gestionnaire.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Métriques clés */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{metriques.nombreClients}</p>
                      <p className="text-xs text-blue-500">Clients</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round(metriques.chiffreAffairesTotal / 1000)}k€
                      </p>
                      <p className="text-xs text-green-500">CA</p>
                    </div>
                  </div>

                  {/* Satisfaction et croissance */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Satisfaction</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{metriques.satisfactionMoyenne.toFixed(1)}/5</span>
                      </div>
                    </div>
                    <Progress value={(metriques.satisfactionMoyenne / 5) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Croissance</span>
                      <div className="flex items-center gap-1">
                        {metriques.croissance > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          metriques.croissance > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metriques.croissance > 0 ? '+' : ''}{metriques.croissance.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spécialités */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Spécialités:</p>
                    <div className="flex flex-wrap gap-1">
                      {gestionnaire.specialites.map(specialite => (
                        <Badge key={specialite} variant="secondary" className="text-xs">
                          {specialite}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{gestionnaire.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{gestionnaire.telephone}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le portefeuille
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Liste des Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientsPortefeuille.map(client => (
                  <div key={client.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {client.nom}
                            {getTendanceIcon(client.tendance)}
                          </h4>
                          <p className="text-sm text-gray-600">{client.type}</p>
                        </div>
                        <Badge className={getStatutColor(client.statut)}>
                          {client.statut}
                        </Badge>
                        <Badge className={getRisqueColor(client.risqueAttrition)}>
                          {client.risqueAttrition} risk
                        </Badge>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {(client.chiffreAffaires / 1000).toFixed(1)}k€
                        </p>
                        <p className="text-sm text-gray-600">
                          Marge: {(client.marge / 1000).toFixed(1)}k€
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Gestionnaire:</p>
                        <p className="font-medium">{client.gestionnaire}</p>
                      </div>

                      <div>
                        <p className="text-gray-600 mb-1">Satisfaction:</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < client.satisfaction 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 mb-1">Ancienneté:</p>
                        <p className="font-medium">{client.anciennete.toFixed(1)} ans</p>
                      </div>

                      <div>
                        <p className="text-gray-600 mb-1">Dernier contact:</p>
                        <p className="font-medium">
                          {client.dernierContact.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {client.prochainRendezVous && (
                      <div className="mt-3 p-2 bg-blue-50 rounded flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700">
                          Prochain RDV: {client.prochainRendezVous.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar de performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Multi-critères</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={donneesRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="gestionnaire" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {metriquesParGestionnaire.map((m, index) => (
                      <Radar
                        key={m.gestionnaire.id}
                        name={m.gestionnaire.nom.split(' ')[0]}
                        dataKey={`${m.gestionnaire.nom.split(' ')[0]}`}
                        stroke={m.gestionnaire.couleur}
                        fill={m.gestionnaire.couleur}
                        fillOpacity={0.1}
                      />
                    ))}
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Évolution temporelle */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution du CA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={[
                    { mois: 'Jan', ca: 45 },
                    { mois: 'Fév', ca: 52 },
                    { mois: 'Mar', ca: 48 },
                    { mois: 'Avr', ca: 58 },
                    { mois: 'Mai', ca: 62 },
                    { mois: 'Jun', ca: 66 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}k€`, 'Chiffre d\'affaires']} />
                    <Area 
                      type="monotone" 
                      dataKey="ca" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
