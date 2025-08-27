import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Timer, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Users, 
  ChevronDown, 
  ChevronRight,
  Target,
  Award,
  Zap,
  Trophy,
  Star,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, ComposedChart } from 'recharts';
import type { Collaborateur, SuiviTemps, CollaborateurSuiviTemps4Niveaux, CategorieTemps } from '@/types/production';

interface SuiviTempsProps {
  collaborateurs: Collaborateur[];
  suiviTemps: SuiviTemps[];
  periode: { debut: string; fin: string };
  collaborateursSuiviTemps?: CollaborateurSuiviTemps4Niveaux[];
  categoriesTemps?: CategorieTemps[];
}

const SuiviTemps: React.FC<SuiviTempsProps> = ({ 
  collaborateurs, 
  suiviTemps, 
  periode,
  collaborateursSuiviTemps = [],
  categoriesTemps = []
}) => {
  const [vueActive, setVueActive] = useState<'global' | 'individuel'>('global');
  const [collaborateurSelectionne, setCollaborateurSelectionne] = useState<string | null>(null);
  const [collaborateursExpanded, setCollaborateursExpanded] = useState<Set<string>>(new Set());
  const [groupesExpanded, setGroupesExpanded] = useState<Set<string>>(new Set());
  const [clientsExpanded, setClientsExpanded] = useState<Set<string>>(new Set());
  
  // Filtres temporels
  const [filtreTemporel, setFiltreTemporel] = useState<'mensuel' | 'trimestriel' | 'annuel' | 'plage'>('mensuel');
  const [dateDebut, setDateDebut] = useState<string>('2024-01-01');
  const [dateFin, setDateFin] = useState<string>('2024-01-31');
  const [moisSelectionne, setMoisSelectionne] = useState<string>('2024-01');
  const [trimestreSelectionne, setTrimestreSelectionne] = useState<string>('2024-Q1');
  const [anneeSelectionnee, setAnneeSelectionnee] = useState<string>('2024');

  const getCollaborateurSuivi = (collaborateurId: string) => {
    return suiviTemps.find(s => s.collaborateurId === collaborateurId);
  };

  const getStatsGlobales = () => {
    const totalAttendu = suiviTemps.reduce((sum, s) => sum + s.tempsAttendu, 0);
    const totalPreste = suiviTemps.reduce((sum, s) => sum + s.tempsPreste, 0);
    const totalPlanifie = suiviTemps.reduce((sum, s) => sum + s.tempsPlanifie, 0);
    const totalSupplementaires = suiviTemps.reduce((sum, s) => sum + s.heuresSupplementaires, 0);
    
    return {
      totalAttendu,
      totalPreste,
      totalPlanifie,
      totalSupplementaires,
      tauxRealisationGlobal: totalAttendu > 0 ? (totalPreste / totalAttendu) * 100 : 0,
      ecartTimesheetGlobal: totalPreste - totalAttendu,
      ecartPlanningGlobal: totalPlanifie - totalAttendu
    };
  };

  const getDataComparaison = () => {
    return collaborateurs.map(collab => {
      const suivi = getCollaborateurSuivi(collab.id);
      if (!suivi) return null;
      
      return {
        nom: collab.prenom,
        attendu: suivi.tempsAttendu,
        preste: suivi.tempsPreste,
        planifie: suivi.tempsPlanifie,
        tauxRealisation: suivi.tauxRealisation,
        ecartTimesheet: suivi.ecartTimesheet,
        ecartPlanning: suivi.ecartPlanning,
        capacityPlanning: Math.round((suivi.tempsPreste / suivi.tempsAttendu) * 100) || 0
      };
    }).filter(Boolean);
  };

  const getStatusColor = (ecart: number) => {
    if (Math.abs(ecart) <= 2) return 'text-green-600 bg-green-50 border-green-200';
    if (Math.abs(ecart) <= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (ecart: number) => {
    if (Math.abs(ecart) <= 2) return <CheckCircle2 className="w-4 h-4" />;
    if (Math.abs(ecart) <= 5) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const toggleCollaborateurExpansion = (collaborateurId: string) => {
    const newExpanded = new Set(collaborateursExpanded);
    if (newExpanded.has(collaborateurId)) {
      newExpanded.delete(collaborateurId);
    } else {
      newExpanded.add(collaborateurId);
    }
    setCollaborateursExpanded(newExpanded);
  };

  const toggleGroupeExpansion = (groupeId: string) => {
    const newExpanded = new Set(groupesExpanded);
    if (newExpanded.has(groupeId)) {
      newExpanded.delete(groupeId);
    } else {
      newExpanded.add(groupeId);
    }
    setGroupesExpanded(newExpanded);
  };

  const toggleClientExpansion = (clientId: string) => {
    const newExpanded = new Set(clientsExpanded);
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId);
    } else {
      newExpanded.add(clientId);
    }
    setClientsExpanded(newExpanded);
  };

  const getTotalHeuresBudgeteesDossier = (dossier: any) => {
    return Object.values(dossier.heuresBudgetees).reduce((sum: number, val: any) => sum + val, 0);
  };

  const getTotalHeuresRealiseesDossier = (dossier: any) => {
    return Object.values(dossier.heuresRealisees).reduce((sum: number, val: any) => sum + val, 0);
  };

  const getTotalEcartDossier = (dossier: any) => {
    return Object.values(dossier.ecartAvecBudget).reduce((sum: number, val: any) => sum + val, 0);
  };

  const getMockCollaborateursSuiviTemps4Niveaux = () => {
    return [
      {
        collaborateurId: '1',
        nom: 'Kamal',
        prenom: 'Guillaume',
        totalHeuresBudgetees: 160,
        totalHeuresRealisees: 143,
        totalHeuresNonFacturables: 0,
        totalEcart: -17,
        totalTempsSupplementaire: 0,
        groupesClients: [
          {
            type: 'attribues' as const,
            nom: 'Les clients attribués',
            totalHeuresBudgetees: 89,
            totalHeuresRealisees: 87,
            totalHeuresNonFacturables: 0,
            totalEcart: -2,
            totalTempsSupplementaire: 0,
            clients: [
              {
                id: '1',
                nom: 'SOHO',
                role: 'GD' as const,
                totalHeuresBudgetees: 22,
                totalHeuresRealisees: 6,
                totalHeuresNonFacturables: 0,
                totalEcart: -16,
                totalTempsSupplementaire: 0,
                categories: [
                  {
                    id: '1',
                    nom: '02. SCAN ET ADMIN',
                    heuresBudgetees: 7,
                    heuresRealisees: 2,
                    heuresNonFacturables: 0,
                    ecartAvecBudget: -5,
                    tempsSupplementaire: 0
                  },
                  {
                    id: '2',
                    nom: '04. ENCODAGE COMPTABLE',
                    heuresBudgetees: 15,
                    heuresRealisees: 4,
                    heuresNonFacturables: 0,
                    ecartAvecBudget: -11,
                    tempsSupplementaire: 0
                  }
                ]
              }
            ]
          },
          {
            type: 'non_attribues' as const,
            nom: 'Les clients non attribués',
            totalHeuresBudgetees: 81,
            totalHeuresRealisees: 81,
            totalHeuresNonFacturables: 0,
            totalEcart: 0,
            totalTempsSupplementaire: 0,
            clients: [
              {
                id: '2',
                nom: 'Clients difficiles',
                role: 'GD' as const,
                totalHeuresBudgetees: 81,
                totalHeuresRealisees: 81,
                totalHeuresNonFacturables: 0,
                totalEcart: 0,
                totalTempsSupplementaire: 0,
                categories: [
                  {
                    id: '3',
                    nom: '11. CONSEILS CLIENT',
                    heuresBudgetees: 41,
                    heuresRealisees: 41,
                    heuresNonFacturables: 0,
                    ecartAvecBudget: 0,
                    tempsSupplementaire: 0
                  },
                  {
                    id: '4',
                    nom: '13. VALIDATION - RELECTURE',
                    heuresBudgetees: 40,
                    heuresRealisees: 40,
                    heuresNonFacturables: 0,
                    ecartAvecBudget: 0,
                    tempsSupplementaire: 0
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        collaborateurId: '2',
        nom: 'Mohamed',
        prenom: 'Aachraf',
        totalHeuresBudgetees: 856,
        totalHeuresRealisees: 431,
        totalHeuresNonFacturables: 363,
        totalEcart: -62,
        totalTempsSupplementaire: 0,
        groupesClients: [
          {
            type: 'attribues' as const,
            nom: 'Les clients attribués',
            totalHeuresBudgetees: 1363,
            totalHeuresRealisees: 444,
            totalHeuresNonFacturables: 67,
            totalEcart: -852,
            totalTempsSupplementaire: 0,
            clients: [
              {
                id: '3',
                nom: 'Adelgaël Kimera',
                role: 'GE' as const,
                totalHeuresBudgetees: 1363,
                totalHeuresRealisees: 444,
                totalHeuresNonFacturables: 67,
                totalEcart: -852,
                totalTempsSupplementaire: 0,
                categories: [
                  {
                    id: '5',
                    nom: '04. ENCODAGE COMPTABLE',
                    heuresBudgetees: 683,
                    heuresRealisees: 222,
                    heuresNonFacturables: 33,
                    ecartAvecBudget: -428,
                    tempsSupplementaire: 0
                  },
                  {
                    id: '6',
                    nom: '06. NETTOYAGE ET VERIFICATION',
                    heuresBudgetees: 680,
                    heuresRealisees: 222,
                    heuresNonFacturables: 34,
                    ecartAvecBudget: -424,
                    tempsSupplementaire: 0
                  }
                ]
              }
            ]
          },
          {
            type: 'non_attribues' as const,
            nom: 'Les clients non attribués',
            totalHeuresBudgetees: 61,
            totalHeuresRealisees: 61,
            totalHeuresNonFacturables: 0,
            totalEcart: 0,
            totalTempsSupplementaire: 0,
            clients: [
              {
                id: '4',
                nom: 'Clients non attribués',
                role: 'GE' as const,
                totalHeuresBudgetees: 61,
                totalHeuresRealisees: 61,
                totalHeuresNonFacturables: 0,
                totalEcart: 0,
                totalTempsSupplementaire: 0,
                categories: [
                  {
                    id: '7',
                    nom: '04. ENCODAGE COMPTABLE',
                    heuresBudgetees: 61,
                    heuresRealisees: 61,
                    heuresNonFacturables: 0,
                    ecartAvecBudget: 0,
                    tempsSupplementaire: 0
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  };

  const getPeriodeLabel = () => {
    switch (filtreTemporel) {
      case 'mensuel':
        return new Date(moisSelectionne + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      case 'trimestriel':
        const [annee, trimestre] = trimestreSelectionne.split('-');
        return `${trimestre} ${annee}`;
      case 'annuel':
        return `Année ${anneeSelectionnee}`;
      case 'plage':
        return `${new Date(dateDebut).toLocaleDateString('fr-FR')} - ${new Date(dateFin).toLocaleDateString('fr-FR')}`;
      default:
        return 'Période sélectionnée';
    }
  };

  const statsGlobales = getStatsGlobales();
  const dataComparaison = getDataComparaison();

  return (
    <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200/60 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur-sm opacity-20"></div>
                  <div className="relative p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Suivi du Temps
                  </CardTitle>
                  <p className="text-sm text-slate-500 font-medium hidden sm:block">
                    Analyse comparative • Temps budgétés vs réalisés
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                {/* Filtres temporels modernisés */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Label des filtres avec style moderne */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-slate-700">Période</span>
                  </div>
                  
                  <div className="flex items-center bg-white/95 rounded-xl shadow-lg border border-slate-200/50 overflow-hidden backdrop-blur-md ring-1 ring-slate-900/5">
                    {/* Boutons de type de filtre modernisés */}
                    <div className="flex">
                      <Button
                        variant={filtreTemporel === 'mensuel' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFiltreTemporel('mensuel')}
                        className={`text-xs h-10 px-5 rounded-none border-r border-slate-200/40 transition-all duration-300 font-medium ${
                          filtreTemporel === 'mensuel' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-500/20' 
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                        }`}
                      >
                        Mensuel
                      </Button>
                      <Button
                        variant={filtreTemporel === 'trimestriel' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFiltreTemporel('trimestriel')}
                        className={`text-xs h-10 px-5 rounded-none border-r border-slate-200/40 transition-all duration-300 font-medium ${
                          filtreTemporel === 'trimestriel' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-500/20' 
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                        }`}
                      >
                        Trimestriel
                      </Button>
                      <Button
                        variant={filtreTemporel === 'annuel' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFiltreTemporel('annuel')}
                        className={`text-xs h-10 px-5 rounded-none border-r border-slate-200/40 transition-all duration-300 font-medium ${
                          filtreTemporel === 'annuel' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-500/20' 
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                        }`}
                      >
                        Annuel
                      </Button>
                      <Button
                        variant={filtreTemporel === 'plage' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFiltreTemporel('plage')}
                        className={`text-xs h-10 px-5 rounded-none transition-all duration-300 font-medium ${
                          filtreTemporel === 'plage' 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-500/20' 
                            : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                        }`}
                      >
                        Plage
                      </Button>
                    </div>
                    
                    {/* Séparateur vertical moderne */}
                    <div className="w-px h-8 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 mx-4"></div>
                    
                    {/* Sélecteurs spécifiques modernisés */}
                    <div className="pr-5">
                      {filtreTemporel === 'mensuel' && (
                        <input
                          type="month"
                          value={moisSelectionne}
                          onChange={(e) => setMoisSelectionne(e.target.value)}
                          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm h-10 w-44 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                        />
                      )}
                      
                      {filtreTemporel === 'trimestriel' && (
                        <select
                          value={trimestreSelectionne}
                          onChange={(e) => setTrimestreSelectionne(e.target.value)}
                          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm h-10 w-36 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                        >
                          <option value="2024-Q1">Q1 2024</option>
                          <option value="2024-Q2">Q2 2024</option>
                          <option value="2024-Q3">Q3 2024</option>
                          <option value="2024-Q4">Q4 2024</option>
                          <option value="2023-Q1">Q1 2023</option>
                          <option value="2023-Q2">Q2 2023</option>
                          <option value="2023-Q3">Q3 2023</option>
                          <option value="2023-Q4">Q4 2023</option>
                        </select>
                      )}
                      
                      {filtreTemporel === 'annuel' && (
                        <select
                          value={anneeSelectionnee}
                          onChange={(e) => setAnneeSelectionnee(e.target.value)}
                          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm h-10 w-32 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                        >
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      )}
                      
                      {filtreTemporel === 'plage' && (
                        <div className="flex items-center gap-4">
                          <input
                            type="date"
                            value={dateDebut}
                            onChange={(e) => setDateDebut(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm h-10 w-40 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                          />
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 ring-2 ring-blue-500/20">
                            <span className="text-sm text-blue-600 font-bold">→</span>
                          </div>
                          <input
                            type="date"
                            value={dateFin}
                            onChange={(e) => setDateFin(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm h-10 w-40 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Section droite modernisée : Badge de période et Toggle de vue */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Badge de période moderne */}
                  <Badge variant="outline" className="bg-gradient-to-r from-white to-slate-50 border-slate-200/60 text-slate-700 font-semibold px-5 py-2.5 shadow-lg backdrop-blur-sm ring-1 ring-slate-900/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">{getPeriodeLabel()}</span>
                    </div>
                  </Badge>
                  
                  {/* Toggle de vue moderne */}
                  <div className="flex bg-white/95 rounded-xl shadow-lg border border-slate-200/50 p-1.5 backdrop-blur-md ring-1 ring-slate-900/5">
                    <Button
                      variant={vueActive === 'global' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVueActive('global')}
                      className={`text-xs h-9 px-5 transition-all duration-300 font-medium rounded-lg ${
                        vueActive === 'global' 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-500/20' 
                          : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                      }`}
                    >
                      Vue Globale
                    </Button>
                    <Button
                      variant={vueActive === 'individuel' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setVueActive('individuel')}
                      className={`text-xs h-9 px-5 transition-all duration-300 font-medium rounded-lg ml-1 ${
                        vueActive === 'individuel' 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-500/20' 
                          : 'hover:bg-slate-50 hover:text-slate-700 text-slate-600'
                      }`}
                    >
                      Vue Individuelle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>



      {/* Section Gamification et Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Complétion Timesheet */}
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Timesheet</h3>
                  <p className="text-sm text-slate-600">Complétion quotidienne</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                <Star className="w-3 h-3 mr-1" />
                95%
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Temps saisi</span>
                <span className="font-medium text-slate-800">7.6h / 8h</span>
              </div>
              <Progress value={95} className="h-3 bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Série: 12 jours</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <Trophy className="w-3 h-3" />
                  <span className="text-xs font-medium">Expert</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planification */}
        <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Planification</h3>
                  <p className="text-sm text-slate-600">Respect du planning</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                <Target className="w-3 h-3 mr-1" />
                87%
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Heures planifiées</span>
                <span className="font-medium text-slate-800">6.9h / 8h</span>
              </div>
              <Progress value={87} className="h-3 bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Objectif: 90%</span>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">+3% sem.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temps Non-Facturables */}
        <Card className="bg-gradient-to-br from-amber-50 via-white to-yellow-50 border border-amber-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Non-Facturable</h3>
                  <p className="text-sm text-slate-600">Optimisation temps</p>
                </div>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                <TrendingDown className="w-3 h-3 mr-1" />
                -8%
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cette semaine</span>
                <span className="font-medium text-slate-800">1.2h / 8h</span>
              </div>
              <Progress value={15} className="h-3 bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Objectif: &lt;20%</span>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-xs font-medium">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Respect Budget */}
        <Card className="bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Budgets</h3>
                  <p className="text-sm text-slate-600">Respect des enveloppes</p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-700 border-red-300">
                <AlertTriangle className="w-3 h-3 mr-1" />
                2 alertes
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Dossiers conformes</span>
                <span className="font-medium text-slate-800">8 / 10</span>
              </div>
              <Progress value={80} className="h-3 bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Dépassements: 2</span>
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs font-medium">Attention</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights et Recommandations */}
      <Card className="bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border border-slate-200/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Insights & Recommandations</CardTitle>
                <p className="text-sm text-slate-600">Optimisez votre productivité</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Timesheet</span>
              </div>
              <p className="text-xs text-green-700">Excellente régularité ! Votre série de 12 jours vous place dans le top 10%. Continuez pour débloquer le badge "Maître du Temps".</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Planification</span>
              </div>
              <p className="text-xs text-blue-700">87% de respect du planning. Encore 3% pour atteindre l'objectif ! Planifiez vos créneaux de 2h minimum pour optimiser.</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Non-Facturable</span>
              </div>
              <p className="text-xs text-amber-700">Temps optimisé à 15% ! Réduction de 8% cette semaine. Maintenez cette discipline pour rester sous les 20%.</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Budgets</span>
              </div>
              <p className="text-xs text-red-700">2 dossiers en dépassement. Dossier "Audit XYZ" à 110% et "Conseil ABC" à 105%. Réajustez les estimations.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {vueActive === 'global' ? (
        <div className="space-y-6">
          {/* Graphique de comparaison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Comparaison Temps par Collaborateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dataComparaison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 150]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Capacity Planning') {
                          return [`${value}%`, name];
                        }
                        return [`${value}h`, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="attendu" fill="#94A3B8" name="Temps Attendu" />
                    <Bar yAxisId="left" dataKey="preste" fill="#10B981" name="Temps Presté" />
                    <Bar yAxisId="left" dataKey="planifie" fill="#8B5CF6" name="Temps Planifié" />
                    <Line yAxisId="right" type="monotone" dataKey="capacityPlanning" stroke="#F59E0B" strokeWidth={0} name="Capacity Planning" dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }} connectNulls={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* KPIs Globaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Cadran 1: Heures Budgétées */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Heures Budgétées</p>
                    <p className="text-2xl font-bold text-blue-800">164h</p>
                    <p className="text-xs text-blue-600">Total équipe</p>
                  </div>
                  <Timer className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* Cadran 2: Heures Réalisées Facturables */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Heures Réalisées Facturables</p>
                    <p className="text-2xl font-bold text-green-800">166.4h</p>
                    <p className="text-xs flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.4h vs attendu
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Cadran 3: Heures Réalisées Non-Facturables */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Heures Réalisées Non-Facturables</p>
                    <p className="text-2xl font-bold text-purple-800">166h</p>
                    <p className="text-xs flex items-center text-purple-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2h vs attendu
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            {/* Cadran 4: Heures Supplémentaires */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Heures Supplémentaires</p>
                    <p className="text-2xl font-bold text-orange-800">4.7h</p>
                    <p className="text-xs text-orange-600">
                      2.8% du presté
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableau hiérarchique collaborateurs/dossiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Suivi du Temps par Collaborateur et Dossier</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-3 font-medium min-w-[200px]">Synthétique</th>
                      <th className="text-center p-3 font-medium bg-blue-50">Heures Budgétées (H.)</th>
                      <th className="text-center p-3 font-medium bg-green-50">Réel Facturable (H.)</th>
                      <th className="text-center p-3 font-medium bg-orange-50">Réel Non-Facturable (H.)</th>
                      <th className="text-center p-3 font-medium bg-red-50">Écart avec le Budget</th>
                      <th className="text-center p-3 font-medium bg-purple-50">Temps Supplémentaire (H.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getMockCollaborateursSuiviTemps4Niveaux().map((collaborateur) => (
                      <React.Fragment key={collaborateur.collaborateurId}>
                        {/* Ligne collaborateur */}
                        <tr 
                          className="border-b hover:bg-gray-50 cursor-pointer font-medium bg-gray-50"
                          onClick={() => toggleCollaborateurExpansion(collaborateur.collaborateurId)}
                        >
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              {collaborateursExpanded.has(collaborateur.collaborateurId) ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {collaborateur.nom.charAt(0)}{collaborateur.prenom.charAt(0)}
                              </div>
                              <span>{collaborateur.prenom} {collaborateur.nom}</span>
                            </div>
                          </td>
                          <td className="text-center p-3 bg-blue-50 font-medium">{collaborateur.totalHeuresBudgetees}h</td>
                          <td className="text-center p-3 bg-green-50 font-medium">{collaborateur.totalHeuresRealisees}h</td>
                          <td className="text-center p-3 bg-orange-50 font-medium">{collaborateur.totalHeuresNonFacturables}h</td>
                          <td className="text-center p-3 bg-red-50">
                            <span className={`font-medium ${
                              collaborateur.totalEcart > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {collaborateur.totalEcart > 0 ? '+' : ''}{collaborateur.totalEcart}h
                            </span>
                          </td>
                          <td className="text-center p-3 bg-purple-50 font-medium">{collaborateur.totalTempsSupplementaire}h</td>
                        </tr>
                        
                        {/* Niveau 2: Groupes de clients */}
                        {collaborateursExpanded.has(collaborateur.collaborateurId) && 
                          collaborateur.groupesClients.map((groupe) => (
                            <React.Fragment key={`${collaborateur.collaborateurId}-${groupe.type}`}>
                              <tr 
                                className="border-b hover:bg-gray-50 cursor-pointer bg-gray-100"
                                onClick={() => toggleGroupeExpansion(`${collaborateur.collaborateurId}-${groupe.type}`)}
                              >
                                <td className="p-3 pl-8">
                                  <div className="flex items-center space-x-2">
                                    {groupesExpanded.has(`${collaborateur.collaborateurId}-${groupe.type}`) ? 
                                      <ChevronDown className="w-4 h-4" /> : 
                                      <ChevronRight className="w-4 h-4" />
                                    }
                                    <span className="font-medium text-gray-700">{groupe.nom}</span>
                                    <Badge variant="outline" className="text-xs bg-gray-200 text-gray-600">
                                      {groupe.clients.length} client{groupe.clients.length > 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="text-center p-3 bg-blue-50 font-medium">{groupe.totalHeuresBudgetees}h</td>
                                <td className="text-center p-3 bg-green-50 font-medium">{groupe.totalHeuresRealisees}h</td>
                                <td className="text-center p-3 bg-orange-50 font-medium">{groupe.totalHeuresNonFacturables}h</td>
                                <td className="text-center p-3 bg-red-50">
                                  <span className={`font-medium ${
                                    groupe.totalEcart > 0 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {groupe.totalEcart > 0 ? '+' : ''}{groupe.totalEcart}h
                                  </span>
                                </td>
                                <td className="text-center p-3 bg-purple-50 font-medium">{groupe.totalTempsSupplementaire}h</td>
                              </tr>
                              
                              {/* Niveau 3: Clients */}
                              {groupesExpanded.has(`${collaborateur.collaborateurId}-${groupe.type}`) &&
                                groupe.clients.map((client) => (
                                  <React.Fragment key={client.id}>
                                    <tr 
                                      className="border-b hover:bg-gray-50 cursor-pointer bg-gray-50"
                                      onClick={() => toggleClientExpansion(`${collaborateur.collaborateurId}-${client.id}`)}
                                    >
                                      <td className="p-3 pl-16">
                                        <div className="flex items-center space-x-2">
                                          {clientsExpanded.has(`${collaborateur.collaborateurId}-${client.id}`) ? 
                                            <ChevronDown className="w-4 h-4" /> : 
                                            <ChevronRight className="w-4 h-4" />
                                          }
                                          <span className="text-gray-700">{client.nom}</span>
                                          <Badge 
                                            variant="outline" 
                                            className={`text-xs ${
                                              client.role === 'GD' ? 'bg-blue-100 text-blue-700' :
                                              client.role === 'GE' ? 'bg-green-100 text-green-700' :
                                              'bg-purple-100 text-purple-700'
                                            }`}
                                          >
                                            {client.role}
                                          </Badge>
                                        </div>
                                      </td>
                                      <td className="text-center p-3 bg-blue-25">{client.totalHeuresBudgetees}h</td>
                                      <td className="text-center p-3 bg-green-25">{client.totalHeuresRealisees}h</td>
                                      <td className="text-center p-3 bg-orange-25">{client.totalHeuresNonFacturables}h</td>
                                      <td className="text-center p-3 bg-red-25">
                                        <span className={`text-xs ${
                                          client.totalEcart > 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                          {client.totalEcart > 0 ? '+' : ''}{client.totalEcart}h
                                        </span>
                                      </td>
                                      <td className="text-center p-3 bg-purple-25">{client.totalTempsSupplementaire}h</td>
                                    </tr>
                                    
                                    {/* Niveau 4: Catégories de prestations */}
                                    {clientsExpanded.has(`${collaborateur.collaborateurId}-${client.id}`) &&
                                      client.categories.map((categorie) => (
                                        <tr key={categorie.id} className="border-b hover:bg-gray-25">
                                          <td className="p-3 pl-24">
                                            <span className="text-sm text-gray-600">{categorie.nom}</span>
                                          </td>
                                          <td className="text-center p-3 bg-blue-25 text-sm">{categorie.heuresBudgetees}h</td>
                                          <td className="text-center p-3 bg-green-25 text-sm">{categorie.heuresRealisees}h</td>
                                          <td className="text-center p-3 bg-orange-25 text-sm">{categorie.heuresNonFacturables}h</td>
                                          <td className="text-center p-3 bg-red-25">
                                            <span className={`text-xs ${
                                              categorie.ecartAvecBudget > 0 ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                              {categorie.ecartAvecBudget > 0 ? '+' : ''}{categorie.ecartAvecBudget}h
                                            </span>
                                          </td>
                                          <td className="text-center p-3 bg-purple-25 text-sm">{categorie.tempsSupplementaire}h</td>
                                        </tr>
                                      ))
                                    }
                                  </React.Fragment>
                                ))
                              }
                            </React.Fragment>
                          ))
                        }
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sélection collaborateur pour vue individuelle */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {collaborateurs.map((collaborateur) => {
              const suivi = getCollaborateurSuivi(collaborateur.id);
              const isSelected = collaborateur.id === collaborateurSelectionne;
              
              return (
                <Card 
                  key={collaborateur.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCollaborateurSelectionne(collaborateur.id)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                        isSelected ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-400'
                      }`}>
                        {collaborateur.initiales}
                      </div>
                      <h3 className="font-medium text-sm">{collaborateur.prenom}</h3>
                      <p className="text-xs text-gray-500 mb-2">{collaborateur.role}</p>
                      {suivi && (
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="font-medium">{suivi.tauxRealisation.toFixed(0)}%</span>
                            <span className="text-gray-500 ml-1">réalisation</span>
                          </div>
                          <Progress value={suivi.tauxRealisation} className="h-1" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Détails collaborateur sélectionné */}
          {collaborateurSelectionne && (() => {
            const collaborateur = collaborateurs.find(c => c.id === collaborateurSelectionne);
            const suivi = getCollaborateurSuivi(collaborateurSelectionne);
            
            if (!collaborateur || !suivi) return null;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails Temps - {collaborateur.prenom} {collaborateur.nom}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{suivi.tempsAttendu}h</p>
                          <p className="text-sm text-blue-700">Attendu</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{suivi.tempsPreste}h</p>
                          <p className="text-sm text-green-700">Presté</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{suivi.tempsPlanifie}h</p>
                          <p className="text-sm text-purple-700">Planifié</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${getStatusColor(suivi.ecartTimesheet)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Écart Timesheet</span>
                            {getStatusIcon(suivi.ecartTimesheet)}
                          </div>
                          <div className="text-2xl font-bold">
                            {suivi.ecartTimesheet > 0 ? '+' : ''}{suivi.ecartTimesheet}h
                          </div>
                          <p className="text-sm mt-1">Presté vs Attendu</p>
                        </div>

                        <div className={`p-4 rounded-lg border ${getStatusColor(suivi.ecartPlanning)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Écart Planning</span>
                            {getStatusIcon(suivi.ecartPlanning)}
                          </div>
                          <div className="text-2xl font-bold">
                            {suivi.ecartPlanning > 0 ? '+' : ''}{suivi.ecartPlanning}h
                          </div>
                          <p className="text-sm mt-1">Planifié vs Attendu</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informations Complémentaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Taux de réalisation:</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={suivi.tauxRealisation} className="w-20" />
                          <span className="font-bold">{suivi.tauxRealisation.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Heures supplémentaires:</span>
                        <span className="font-bold text-orange-600">{suivi.heuresSupplementaires}h</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Congés utilisés:</span>
                        <span className="font-bold text-green-600">{suivi.congesUtilises}h</span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Régime de travail:</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {collaborateur.regime.replace('_', ' ')} - {collaborateur.tempsAttendu}h/sem
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SuiviTemps;
