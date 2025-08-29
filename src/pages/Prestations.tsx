import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  Euro,
  TrendingUp,
  Calendar,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Download,
  Settings,
  Layers,
  Grid3X3,
  List,
  GripVertical,
  CheckCircle,
  AlertTriangle as AlertTriangleIcon,
  Timer,
  Percent,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

// Types pour le module Prestations
interface Prestation {
  id: string;
  clientId: string;
  clientName: string;
  collaborateurId: string;
  collaborateurName: string;
  categorieId: string;
  categorieName: string;
  description: string;
  heuresPassees: number;
  tauxHoraire: number;
  montantFacture: number;
  dateDebut: string;
  dateFin?: string;
  statut: 'en_cours' | 'termine' | 'facture' | 'en_attente';
  progression: number;
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
}

interface ViewConfig {
  niveau1: 'client' | 'collaborateur' | 'prestation';
  niveau2: 'client' | 'collaborateur' | 'prestation';
  niveau3: 'client' | 'collaborateur' | 'prestation';
}

// Données mock pour les prestations
const mockPrestations: Prestation[] = [
  {
    id: 'P001',
    clientId: 'C001',
    clientName: 'BELTEC SARL',
    collaborateurId: 'U001',
    collaborateurName: 'Sophie Martin',
    categorieId: 'CAT001',
    categorieName: 'Comptabilité Générale',
    description: 'Tenue comptable mensuelle',
    heuresPassees: 12.5,
    tauxHoraire: 95,
    montantFacture: 1187.50,
    dateDebut: '2024-01-01',
    dateFin: '2024-01-31',
    statut: 'facture',
    progression: 100,
    priorite: 'normale'
  },
  {
    id: 'P002',
    clientId: 'C002',
    clientName: 'TECHNO SOLUTIONS',
    collaborateurId: 'U002',
    collaborateurName: 'Marc Dupont',
    categorieId: 'CAT002',
    categorieName: 'Déclarations Fiscales',
    description: 'TVA trimestrielle',
    heuresPassees: 4.5,
    tauxHoraire: 120,
    montantFacture: 540,
    dateDebut: '2024-01-15',
    statut: 'en_cours',
    progression: 75,
    priorite: 'haute'
  },
  {
    id: 'P003',
    clientId: 'C003',
    clientName: 'SARL MARTIN',
    collaborateurId: 'U001',
    collaborateurName: 'Sophie Martin',
    categorieId: 'CAT003',
    categorieName: 'Paie & Social',
    description: 'Bulletins de paie janvier',
    heuresPassees: 6.0,
    tauxHoraire: 85,
    montantFacture: 510,
    dateDebut: '2024-01-20',
    statut: 'termine',
    progression: 100,
    priorite: 'normale'
  },
  {
    id: 'P004',
    clientId: 'C001',
    clientName: 'BELTEC SARL',
    collaborateurId: 'U003',
    collaborateurName: 'Julie Rousseau',
    categorieId: 'CAT004',
    categorieName: 'Audit & Conseil',
    description: 'Audit des comptes annuels',
    heuresPassees: 18.0,
    tauxHoraire: 150,
    montantFacture: 2700,
    dateDebut: '2024-01-10',
    statut: 'en_cours',
    progression: 60,
    priorite: 'urgente'
  },
  {
    id: 'P005',
    clientId: 'C004',
    clientName: 'RESTAURANT LE GOURMET',
    collaborateurId: 'U002',
    collaborateurName: 'Marc Dupont',
    categorieId: 'CAT001',
    categorieName: 'Comptabilité Générale',
    description: 'Rattrapage comptable',
    heuresPassees: 25.0,
    tauxHoraire: 95,
    montantFacture: 2375,
    dateDebut: '2024-01-05',
    statut: 'en_cours',
    progression: 40,
    priorite: 'haute'
  },
  {
    id: 'P006',
    clientId: 'C005',
    clientName: 'COIFFURE STYLE',
    collaborateurId: 'U001',
    collaborateurName: 'Sophie Martin',
    categorieId: 'CAT003',
    categorieName: 'Paie & Social',
    description: 'Gestion sociale mensuelle',
    heuresPassees: 3.5,
    tauxHoraire: 85,
    montantFacture: 297.50,
    dateDebut: '2024-01-25',
    statut: 'en_attente',
    progression: 20,
    priorite: 'faible'
  },
  {
    id: 'P007',
    clientId: 'C003',
    clientName: 'SARL MARTIN',
    collaborateurId: 'U002',
    collaborateurName: 'Marc Dupont',
    categorieId: 'CAT001',
    categorieName: 'Comptabilité Générale',
    description: 'Révision comptable Q4',
    heuresPassees: 15.5,
    tauxHoraire: 95,
    montantFacture: 1472.50,
    dateDebut: '2024-01-28',
    statut: 'en_cours',
    progression: 45,
    priorite: 'normale'
  },
  {
    id: 'P008',
    clientId: 'C003',
    clientName: 'SARL MARTIN',
    collaborateurId: 'U003',
    collaborateurName: 'Julie Rousseau',
    categorieId: 'CAT002',
    categorieName: 'Déclarations Fiscales',
    description: 'Préparation déclaration annuelle',
    heuresPassees: 8.0,
    tauxHoraire: 120,
    montantFacture: 960,
    dateDebut: '2024-01-22',
    statut: 'facture',
    progression: 100,
    priorite: 'haute'
  }
];

// Configuration des vues possibles
const viewConfigurations: { label: string; config: ViewConfig }[] = [
  { label: 'Client › Collaborateur › Prestation', config: { niveau1: 'client', niveau2: 'collaborateur', niveau3: 'prestation' } },
  { label: 'Client › Prestation › Collaborateur', config: { niveau1: 'client', niveau2: 'prestation', niveau3: 'collaborateur' } },
  { label: 'Collaborateur › Client › Prestation', config: { niveau1: 'collaborateur', niveau2: 'client', niveau3: 'prestation' } },
  { label: 'Collaborateur › Prestation › Client', config: { niveau1: 'collaborateur', niveau2: 'prestation', niveau3: 'client' } },
  { label: 'Prestation › Client › Collaborateur', config: { niveau1: 'prestation', niveau2: 'client', niveau3: 'collaborateur' } },
  { label: 'Prestation › Collaborateur › Client', config: { niveau1: 'prestation', niveau2: 'collaborateur', niveau3: 'client' } }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

const Prestations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedView, setSelectedView] = useState<ViewConfig>(viewConfigurations[0].config);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [filterCollaborateur, setFilterCollaborateur] = useState<string>('all');
  const [filterCategorie, setFilterCategorie] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterTemporel, setFilterTemporel] = useState<string>('annee');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [draggedView, setDraggedView] = useState<number | null>(null);
  const [isCASheetOpen, setIsCASheetOpen] = useState(false);

  // Effet pour gérer les paramètres URL
  useEffect(() => {
    const clientParam = searchParams.get('client');
    if (clientParam) {
      // Décoder le paramètre URL au cas où il serait encodé
      const decodedClientParam = decodeURIComponent(clientParam);
      
      // Chercher le client exact dans nos données
      const matchingClient = mockPrestations.find(p => 
        p.clientName.toLowerCase() === decodedClientParam.toLowerCase() ||
        p.clientName.toLowerCase().includes(decodedClientParam.toLowerCase()) ||
        decodedClientParam.toLowerCase().includes(p.clientName.toLowerCase())
      );
      
      if (matchingClient) {
        setFilterClient(matchingClient.clientName);
      } else {
        setFilterClient(decodedClientParam);
      }
      
      // Si un client est spécifié, on peut aussi ajuster la vue pour mettre le client en premier
      setSelectedView(viewConfigurations[0].config); // Client › Collaborateur › Prestation
    }
  }, [searchParams]);

  // Calculs des métriques globales (sans euros dans l'affichage principal)
  const metrics = useMemo(() => {
    const totalHeures = mockPrestations.reduce((sum, p) => sum + p.heuresPassees, 0);
    const totalCA = mockPrestations.reduce((sum, p) => sum + p.montantFacture, 0);
    const prestationsActives = mockPrestations.filter(p => p.statut === 'en_cours').length;
    
    // Nouveaux métriques basés sur le temps
    const tempsAttendu = 180; // Heures attendues pour la période
    const tempsRealisé = totalHeures;
    const tempsFacturable = mockPrestations.filter(p => p.statut !== 'en_attente').reduce((sum, p) => sum + p.heuresPassees, 0);
    const tempsNonFacturable = tempsRealisé - tempsFacturable;
    const pourcentageFacturable = tempsRealisé > 0 ? (tempsFacturable / tempsRealisé) * 100 : 0;
    
    // Métrique Timesheet (simulation de complétude)
    const timesheetCompletude = 92; // Pourcentage de complétion des timesheets
    const timesheetMessage = timesheetCompletude >= 95 ? "Excellent suivi !" : "Effort requis";
    const timesheetStatus = timesheetCompletude >= 95 ? "excellent" : timesheetCompletude >= 85 ? "bon" : "effort";
    
    return {
      prestationsActives,
      totalCA, // Pour le sidebar contextuel uniquement
      tempsAttendu,
      tempsRealisé,
      tempsFacturable,
      tempsNonFacturable,
      pourcentageFacturable,
      timesheetCompletude,
      timesheetMessage,
      timesheetStatus
    };
  }, []);

  // Filtrage des prestations
  const filteredPrestations = useMemo(() => {
    return mockPrestations.filter(prestation => {
      const matchSearch = searchTerm === '' || 
        prestation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestation.collaborateurName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestation.categorieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestation.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatut = filterStatut === 'all' || prestation.statut === filterStatut;
      const matchCollaborateur = filterCollaborateur === 'all' || prestation.collaborateurId === filterCollaborateur;
      const matchCategorie = filterCategorie === 'all' || prestation.categorieId === filterCategorie;
      const matchClient = filterClient === 'all' || 
        prestation.clientName.toLowerCase() === filterClient.toLowerCase() ||
        prestation.clientName.toLowerCase().includes(filterClient.toLowerCase()) ||
        filterClient.toLowerCase().includes(prestation.clientName.toLowerCase());
      
      return matchSearch && matchStatut && matchCollaborateur && matchCategorie && matchClient;
    });
  }, [searchTerm, filterStatut, filterCollaborateur, filterCategorie, filterClient]);

  // Organisation des données selon la vue sélectionnée
  const organizedData = useMemo(() => {
    const grouped: any = {};
    
    filteredPrestations.forEach(prestation => {
      const niveau1Key = getKeyForLevel(prestation, selectedView.niveau1);
      const niveau2Key = getKeyForLevel(prestation, selectedView.niveau2);
      const niveau3Key = getKeyForLevel(prestation, selectedView.niveau3);
      
      if (!grouped[niveau1Key]) {
        grouped[niveau1Key] = {
          label: getLabelForLevel(prestation, selectedView.niveau1),
          type: selectedView.niveau1,
          items: {},
          stats: { heures: 0, ca: 0, count: 0 }
        };
      }
      
      if (!grouped[niveau1Key].items[niveau2Key]) {
        grouped[niveau1Key].items[niveau2Key] = {
          label: getLabelForLevel(prestation, selectedView.niveau2),
          type: selectedView.niveau2,
          items: {},
          stats: { heures: 0, ca: 0, count: 0 }
        };
      }
      
      if (!grouped[niveau1Key].items[niveau2Key].items[niveau3Key]) {
        grouped[niveau1Key].items[niveau2Key].items[niveau3Key] = {
          label: getLabelForLevel(prestation, selectedView.niveau3),
          type: selectedView.niveau3,
          prestations: [],
          stats: { heures: 0, ca: 0, count: 0 }
        };
      }
      
      grouped[niveau1Key].items[niveau2Key].items[niveau3Key].prestations.push(prestation);
      
      // Mise à jour des stats
      [grouped[niveau1Key], grouped[niveau1Key].items[niveau2Key], grouped[niveau1Key].items[niveau2Key].items[niveau3Key]].forEach(item => {
        item.stats.heures += prestation.heuresPassees;
        item.stats.ca += prestation.montantFacture;
        item.stats.count += 1;
      });
    });
    
    return grouped;
  }, [filteredPrestations, selectedView]);

  // Données pour les graphiques (basées sur le temps)
  const chartData = useMemo(() => {
    const caParCategorie = mockPrestations.reduce((acc, p) => {
      acc[p.categorieName] = (acc[p.categorieName] || 0) + p.montantFacture;
      return acc;
    }, {} as Record<string, number>);

    const heuresParCollaborateur = mockPrestations.reduce((acc, p) => {
      acc[p.collaborateurName] = (acc[p.collaborateurName] || 0) + p.heuresPassees;
      return acc;
    }, {} as Record<string, number>);

    const heuresParCategorie = mockPrestations.reduce((acc, p) => {
      acc[p.categorieName] = (acc[p.categorieName] || 0) + p.heuresPassees;
      return acc;
    }, {} as Record<string, number>);

    const repartitionTemps = [
      { name: 'Facturable', value: metrics.tempsFacturable, color: '#10b981' },
      { name: 'Non-Facturable', value: metrics.tempsNonFacturable, color: '#f59e0b' }
    ];

    return {
      caParCategorie: Object.entries(caParCategorie).map(([name, value]) => ({ name, value })),
      heuresParCollaborateur: Object.entries(heuresParCollaborateur).map(([name, value]) => ({ name, value })),
      heuresParCategorie: Object.entries(heuresParCategorie).map(([name, value]) => ({ name, value })),
      repartitionTemps
    };
  }, [metrics.tempsFacturable, metrics.tempsNonFacturable]);

  // Fonctions utilitaires
  function getKeyForLevel(prestation: Prestation, level: string): string {
    switch (level) {
      case 'client': return prestation.clientId;
      case 'collaborateur': return prestation.collaborateurId;
      case 'prestation': return prestation.categorieId;
      default: return '';
    }
  }

  function getLabelForLevel(prestation: Prestation, level: string): string {
    switch (level) {
      case 'client': return prestation.clientName;
      case 'collaborateur': return prestation.collaborateurName;
      case 'prestation': return prestation.categorieName;
      default: return '';
    }
  }

  function getIconForLevel(level: string) {
    switch (level) {
      case 'client': return Users;
      case 'collaborateur': return Users;
      case 'prestation': return Briefcase;
      default: return Activity;
    }
  }

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'termine': return 'bg-green-100 text-green-800';
      case 'facture': return 'bg-purple-100 text-purple-800';
      case 'en_attente': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'faible': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonctions Drag & Drop
  const handleDragStart = (index: number) => {
    setDraggedView(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedView !== null && draggedView !== targetIndex) {
      setSelectedView(viewConfigurations[targetIndex].config);
    }
    setDraggedView(null);
  };

  const getTimesheetStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'bon': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'effort': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimesheetIcon = (status: string) => {
    switch (status) {
      case 'excellent': return Star;
      case 'bon': return CheckCircle;
      case 'effort': return AlertTriangleIcon;
      default: return Timer;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="📊 Prestations Analytics"
          description="Analyse complète des prestations par clients, collaborateurs et catégories"
          icon={Briefcase}
          actions={
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    PDF Rapport
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Prestation
              </Button>
            </>
          }
        />

        {/* Nouveaux KPIs basés sur le temps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Temps Attendu</p>
                  <p className="text-3xl font-bold text-blue-900">{metrics.tempsAttendu}h</p>
                  <p className="text-xs text-blue-600 mt-1">Objectif période</p>
                </div>
                <Target className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Temps Facturable</p>
                  <p className="text-3xl font-bold text-green-900">{metrics.tempsFacturable}h</p>
                  <p className="text-xs text-green-600 mt-1">{metrics.pourcentageFacturable.toFixed(1)}% du total</p>
                </div>
                <Clock className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Temps Non-Facturable</p>
                  <p className="text-3xl font-bold text-orange-900">{metrics.tempsNonFacturable}h</p>
                  <p className="text-xs text-orange-600 mt-1">{(100 - metrics.pourcentageFacturable).toFixed(1)}% du total</p>
                </div>
                <Timer className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${getTimesheetStatusColor(metrics.timesheetStatus)} border`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Suivi Timesheet</p>
                  <p className="text-3xl font-bold">{metrics.timesheetCompletude}%</p>
                  <p className="text-xs mt-1">{metrics.timesheetMessage}</p>
                </div>
                {(() => {
                  const IconComponent = getTimesheetIcon(metrics.timesheetStatus);
                  return <IconComponent className="h-12 w-12" />;
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar contextuel pour CA */}
        <Sheet open={isCASheetOpen} onOpenChange={setIsCASheetOpen}>
          <SheetContent side="right" className="w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                CA Annuel Réalisé
              </SheetTitle>
              <SheetDescription>
                Détail du chiffre d'affaires par période
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CA Total Annuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    €{(metrics.totalCA * 12 / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Projection basée sur la période actuelle</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition par Catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.caParCategorie}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.caParCategorie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`€${value}`, 'CA']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </SheetContent>
        </Sheet>

        {/* Configuration de Vue et Filtres */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Configuration de Vue & Filtres</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCASheetOpen(true)}
                className="flex items-center gap-2"
              >
                <Euro className="w-4 h-4" />
                Voir CA Annuel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration Hiérarchique Drag & Drop */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Vues hiérarchiques (Drag & Drop) :</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {viewConfigurations.map((config, index) => {
                  const isSelected = 
                    config.config.niveau1 === selectedView.niveau1 && 
                    config.config.niveau2 === selectedView.niveau2 && 
                    config.config.niveau3 === selectedView.niveau3;
                  
                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => setSelectedView(config.config)}
                      className={`
                        p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                        }
                        ${draggedView === index ? 'opacity-50 scale-95' : ''}
                        hover:shadow-md flex items-center space-x-2
                      `}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Recherche</span>
                </label>
                <Input
                  placeholder="Client, collaborateur, prestation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Période</span>
                </label>
                <Select value={filterTemporel} onValueChange={setFilterTemporel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annee">Année en cours</SelectItem>
                    <SelectItem value="semestre">Semestriel</SelectItem>
                    <SelectItem value="trimestre">Trimestriel</SelectItem>
                    <SelectItem value="mois">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="facture">Facturé</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Collaborateur</label>
                <Select value={filterCollaborateur} onValueChange={setFilterCollaborateur}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les collaborateurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les collaborateurs</SelectItem>
                    <SelectItem value="U001">Sophie Martin</SelectItem>
                    <SelectItem value="U002">Marc Dupont</SelectItem>
                    <SelectItem value="U003">Julie Rousseau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="CAT001">Comptabilité Générale</SelectItem>
                    <SelectItem value="CAT002">Déclarations Fiscales</SelectItem>
                    <SelectItem value="CAT003">Paie & Social</SelectItem>
                    <SelectItem value="CAT004">Audit & Conseil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Client
                  {searchParams.get('client') && filterClient !== 'all' && (
                    <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Filtré via lien
                    </Badge>
                  )}
                </label>
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger className={searchParams.get('client') && filterClient !== 'all' ? "border-purple-300 bg-purple-50" : ""}>
                    <SelectValue placeholder="Tous les clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    <SelectItem value="BELTEC SARL">BELTEC SARL</SelectItem>
                    <SelectItem value="TECHNO SOLUTIONS">TECHNO SOLUTIONS</SelectItem>
                    <SelectItem value="SARL MARTIN">SARL MARTIN</SelectItem>
                    <SelectItem value="RESTAURANT LE GOURMET">RESTAURANT LE GOURMET</SelectItem>
                    <SelectItem value="COIFFURE STYLE">COIFFURE STYLE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Onglets Principaux */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analyse Détaillée</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center space-x-2">
              <PieChart className="w-4 h-4" />
              <span>Visualisations</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Analyse Détaillée */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Grid3X3 className="w-5 h-5" />
                    <span>Vue Hiérarchique : {viewConfigurations.find(v => 
                      v.config.niveau1 === selectedView.niveau1 && 
                      v.config.niveau2 === selectedView.niveau2 && 
                      v.config.niveau3 === selectedView.niveau3
                    )?.label}</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {Object.keys(organizedData).length} éléments niveau 1
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(organizedData).map(([niveau1Key, niveau1Data]: [string, any]) => {
                    const IconNiveau1 = getIconForLevel(niveau1Data.type);
                    const isExpanded1 = expandedItems.has(`niveau1-${niveau1Key}`);
                    
                    return (
                      <div key={niveau1Key} className="border rounded-lg p-4 bg-gray-50">
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                          onClick={() => toggleExpanded(`niveau1-${niveau1Key}`)}
                        >
                          <div className="flex items-center space-x-3">
                            {isExpanded1 ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            <IconNiveau1 className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-lg">{niveau1Data.label}</span>
                            <Badge variant="outline">
                              {Object.keys(niveau1Data.items).length} sous-éléments
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-right">
                              <p className="font-medium">{niveau1Data.stats.heures.toFixed(1)}h</p>
                              <p className="text-gray-500">Heures</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">€{niveau1Data.stats.ca.toLocaleString()}</p>
                              <p className="text-gray-500">CA</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{niveau1Data.stats.count}</p>
                              <p className="text-gray-500">Prestations</p>
                            </div>
                          </div>
                        </div>

                        {isExpanded1 && (
                          <div className="mt-4 ml-6 space-y-3">
                            {Object.entries(niveau1Data.items).map(([niveau2Key, niveau2Data]: [string, any]) => {
                              const IconNiveau2 = getIconForLevel(niveau2Data.type);
                              const isExpanded2 = expandedItems.has(`niveau2-${niveau1Key}-${niveau2Key}`);
                              
                              return (
                                <div key={niveau2Key} className="border-l-2 border-blue-200 pl-4">
                                  <div 
                                    className="flex items-center justify-between cursor-pointer hover:bg-white p-2 rounded"
                                    onClick={() => toggleExpanded(`niveau2-${niveau1Key}-${niveau2Key}`)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      {isExpanded2 ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                      <IconNiveau2 className="w-4 h-4 text-green-600" />
                                      <span className="font-medium">{niveau2Data.label}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {Object.keys(niveau2Data.items).length}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <div className="text-right">
                                        <p className="font-medium">{niveau2Data.stats.heures.toFixed(1)}h</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">€{niveau2Data.stats.ca.toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {isExpanded2 && (
                                    <div className="mt-2 ml-6 space-y-2">
                                      {Object.entries(niveau2Data.items).map(([niveau3Key, niveau3Data]: [string, any]) => {
                                        const IconNiveau3 = getIconForLevel(niveau3Data.type);
                                        const isExpanded3 = expandedItems.has(`niveau3-${niveau1Key}-${niveau2Key}-${niveau3Key}`);
                                        
                                        return (
                                          <div key={niveau3Key} className="border-l-2 border-green-200 pl-4">
                                            <div 
                                              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                                              onClick={() => toggleExpanded(`niveau3-${niveau1Key}-${niveau2Key}-${niveau3Key}`)}
                                            >
                                              <div className="flex items-center space-x-3">
                                                {isExpanded3 ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                <IconNiveau3 className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-medium">{niveau3Data.label}</span>
                                                <Badge variant="outline" className="text-xs">
                                                  {niveau3Data.prestations.length} prestations
                                                </Badge>
                                              </div>
                                              <div className="flex items-center space-x-4 text-xs">
                                                <span>{niveau3Data.stats.heures.toFixed(1)}h</span>
                                                <span>€{niveau3Data.stats.ca.toLocaleString()}</span>
                                              </div>
                                            </div>

                                            {isExpanded3 && (
                                              <div className="mt-2 ml-6 space-y-2">
                                                {niveau3Data.prestations.map((prestation: Prestation) => (
                                                  <div key={prestation.id} className="bg-white border rounded p-3 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                          <h4 className="font-medium text-sm">{prestation.description}</h4>
                                                          <Badge className={`text-xs ${getStatutColor(prestation.statut)}`}>
                                                            {prestation.statut.replace('_', ' ')}
                                                          </Badge>
                                                          <Badge className={`text-xs ${getPrioriteColor(prestation.priorite)}`}>
                                                            {prestation.priorite}
                                                          </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                                                          <div>
                                                            <span className="font-medium">Client:</span> {prestation.clientName}
                                                          </div>
                                                          <div>
                                                            <span className="font-medium">Collaborateur:</span> {prestation.collaborateurName}
                                                          </div>
                                                          <div>
                                                            <span className="font-medium">Heures:</span> {prestation.heuresPassees}h
                                                          </div>
                                                          <div>
                                                            <span className="font-medium">Montant:</span> €{prestation.montantFacture}
                                                          </div>
                                                        </div>
                                                        {prestation.statut === 'en_cours' && (
                                                          <div className="mt-2">
                                                            <div className="flex items-center justify-between mb-1">
                                                              <span className="text-xs text-gray-500">Progression</span>
                                                              <span className="text-xs font-medium">{prestation.progression}%</span>
                                                            </div>
                                                            <Progress value={prestation.progression} className="h-1" />
                                                          </div>
                                                        )}
                                                      </div>
                                                      <div className="flex items-center space-x-2 ml-4">
                                                        <Button variant="ghost" size="sm">
                                                          <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                          <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                              <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                          </DropdownMenuTrigger>
                                                          <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                            <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                                          </DropdownMenuContent>
                                                        </DropdownMenu>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Visualisations */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Répartition Temps Facturable/Non-Facturable</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.repartitionTemps}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.repartitionTemps.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}h`, 'Heures']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Heures par Collaborateur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.heuresParCollaborateur}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}h`, 'Heures']} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Heures par Catégorie de Prestation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.heuresParCategorie}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}h`, 'Heures']} />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Progression vs Objectif</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((metrics.tempsRealisé / metrics.tempsAttendu) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">de l'objectif atteint</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Temps réalisé</span>
                        <span className="font-medium">{metrics.tempsRealisé}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Objectif</span>
                        <span className="font-medium">{metrics.tempsAttendu}h</span>
                      </div>
                      <Progress 
                        value={(metrics.tempsRealisé / metrics.tempsAttendu) * 100} 
                        className="h-3 mt-3"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {metrics.tempsFacturable}h
                        </div>
                        <p className="text-xs text-gray-600">Facturable</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {metrics.tempsNonFacturable}h
                        </div>
                        <p className="text-xs text-gray-600">Non-Facturable</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Prestations;
