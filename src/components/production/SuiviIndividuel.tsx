import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Clock, Target, Users, Calendar, Filter, User, BarChart3, Activity, CheckCircle, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Collaborateur, MetriqueProduction } from '@/types/production';
import { donneesEncodage, donneesNettoyage, suiviTemps, type ClientEncodage, type LigneEncodage, type ClientNettoyage } from '@/data/productionData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SuiviIndividuelProps {
  collaborateurs: Collaborateur[];
  metriques: MetriqueProduction[];
  periode: { debut: string; fin: string };
}

type SortField = 'nom' | 'volumetrie' | 'theorique' | 'realise' | 'ecart' | 'productionParPiece' | 'compensationProd';
type SortDirection = 'asc' | 'desc' | null;

const TableauEncodageComponent: React.FC = () => {
  const [clientsExpanded, setClientsExpanded] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const toggleClient = (clientId: string) => {
    setClientsExpanded(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 text-blue-600" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4 text-blue-600" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-gray-400 opacity-50" />;
  };

  const sortedClients = React.useMemo(() => {
    if (!sortField || !sortDirection) return donneesEncodage.clients;

    return [...donneesEncodage.clients].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'nom':
          aValue = a.nom;
          bValue = b.nom;
          break;
        case 'volumetrie':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.volumetrie.realise, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.volumetrie.realise, 0);
          break;
        case 'theorique':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.timesheet.theorique, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.timesheet.theorique, 0);
          break;
        case 'realise':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.timesheet.realise, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.timesheet.realise, 0);
          break;
        case 'ecart':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0);
          break;
        case 'productionParPiece':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.timesheet.productionParPiece, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.timesheet.productionParPiece, 0);
          break;
        case 'compensationProd':
          aValue = a.lignes.reduce((sum, ligne) => sum + ligne.timesheet.compensationProd, 0);
          bValue = b.lignes.reduce((sum, ligne) => sum + ligne.timesheet.compensationProd, 0);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [sortField, sortDirection]);

  const getEcartColor = (ecart: number) => {
    if (ecart > 0) return 'text-red-600';
    if (ecart < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getRegimeTVAColor = (regime: string) => {
    switch (regime) {
      case 'Mensuel': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Trimestriel': return 'bg-green-100 text-green-800 border-green-300';
      case 'Annuel': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-blue-200/50 overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tableau d'Encodage</h3>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Données filtrées selon la période sélectionnée
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                <button 
                  onClick={() => handleSort('nom')}
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <span>CLIENT</span>
                  {getSortIcon('nom')}
                </button>
              </th>
              <th className="px-4 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider border-l-2 border-blue-300/50 bg-blue-50/50">
                <div className="flex flex-col items-center">
                  <span>VOLUMÉTRIE</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">Réalisé</span>
                </div>
              </th>
              <th className="px-4 py-4 text-center text-sm font-bold text-emerald-700 uppercase tracking-wider border-l-2 border-emerald-300/50 bg-emerald-50/50" colSpan={5}>
                <div className="flex items-center justify-center">
                  <span>TIMESHEET</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </th>
            </tr>
            <tr className="bg-gradient-to-r from-slate-100/50 to-slate-50 border-b border-slate-200">
              <th className="px-6 py-3"></th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase bg-blue-50/70">
                <button 
                  onClick={() => handleSort('volumetrie')}
                  className="flex items-center justify-center space-x-1 hover:text-blue-800 transition-colors"
                >
                  <span>Réalisé</span>
                  {getSortIcon('volumetrie')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-700 uppercase border-l-2 border-emerald-300/50 bg-emerald-50/70">
                <button 
                  onClick={() => handleSort('theorique')}
                  className="flex items-center justify-center space-x-1 hover:text-emerald-800 transition-colors"
                >
                  <span>Théorique</span>
                  {getSortIcon('theorique')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">
                <button 
                  onClick={() => handleSort('realise')}
                  className="flex items-center justify-center space-x-1 hover:text-emerald-800 transition-colors"
                >
                  <span>Réalisé</span>
                  {getSortIcon('realise')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-amber-700 uppercase bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300/50 shadow-sm">
                <button 
                  onClick={() => handleSort('ecart')}
                  className="flex items-center justify-center space-x-1 hover:text-amber-800 transition-colors"
                >
                  <span>⚡ ÉCART</span>
                  <div className="w-1 h-1 bg-amber-500 rounded-full ml-1 animate-ping"></div>
                  {getSortIcon('ecart')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">
                <button 
                  onClick={() => handleSort('productionParPiece')}
                  className="flex items-center justify-center space-x-1 hover:text-emerald-800 transition-colors"
                >
                  <span>Prod/Pièce</span>
                  {getSortIcon('productionParPiece')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">
                <button 
                  onClick={() => handleSort('compensationProd')}
                  className="flex items-center justify-center space-x-1 hover:text-emerald-800 transition-colors"
                >
                  <span>Compensation</span>
                  {getSortIcon('compensationProd')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gradient-to-b from-white to-slate-50/30 divide-y divide-slate-200/50">
            {sortedClients.map((client) => (
              <React.Fragment key={client.id}>
                {/* Ligne client principal */}
                <tr 
                  className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 cursor-pointer border-l-4 border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                  onClick={() => toggleClient(client.id)}
                >
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    <div className="flex items-center">
                      {clientsExpanded[client.id] ? 
                        <ChevronDown className="h-5 w-5 mr-3 text-blue-600 transition-transform duration-200" /> : 
                        <ChevronRight className="h-5 w-5 mr-3 text-blue-600 transition-transform duration-200" />
                      }
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 shadow-sm"></div>
                        {client.nom}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-blue-700 bg-blue-50/50">
                    <div className="flex flex-col items-center">
                      <span>{client.lignes.reduce((sum, ligne) => sum + ligne.volumetrie.realise, 0)}</span>
                      <div className="w-8 h-1 bg-blue-400 rounded-full mt-1"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-emerald-700 border-l-2 border-emerald-300/50 bg-emerald-50/50">
                    {client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.theorique, 0).toFixed(1)}h
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-emerald-700 bg-emerald-50/50">
                    {client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.realise, 0).toFixed(1)}h
                  </td>
                  <td className="px-4 py-4 text-center bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300/50 shadow-lg">
                    <div className="flex flex-col items-center">
                      <span className={`text-xl font-black ${getEcartColor(client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0))} drop-shadow-sm`}>
                        {client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0) > 0 ? '+' : ''}
                        {client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0).toFixed(1)}h
                      </span>
                      <div className={`w-12 h-2 rounded-full mt-2 ${
                        client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.ecart, 0) > 0 
                          ? 'bg-gradient-to-r from-red-400 to-red-600' 
                          : 'bg-gradient-to-r from-green-400 to-green-600'
                      }`}></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-purple-700 bg-emerald-50/50">
                    {(client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.productionParPiece, 0) / client.lignes.length).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-orange-700 bg-emerald-50/50">
                    {client.lignes.reduce((sum, ligne) => sum + ligne.timesheet.compensationProd, 0).toFixed(2)}
                  </td>
                </tr>

                {/* Lignes détaillées par type */}
                {clientsExpanded[client.id] && client.lignes.map((ligne) => (
                  <tr key={`${client.id}-${ligne.type}`} className="bg-gradient-to-r from-slate-50/50 to-white hover:from-blue-50/30 hover:to-indigo-50/20 transition-all duration-200 border-l-4 border-slate-300">
                    <td className="px-8 py-3 text-sm text-slate-700">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-sm border border-slate-300/50">
                        {ligne.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-blue-700 bg-blue-50/30">
                      <div className="flex flex-col items-center">
                        <span>{ligne.volumetrie.realise}</span>
                        <div className="w-6 h-0.5 bg-blue-400 rounded-full mt-1"></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-emerald-700 border-l-2 border-emerald-300/50 bg-emerald-50/30">
                      {ligne.timesheet.theorique}h
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-emerald-700 bg-emerald-50/30">
                      {ligne.timesheet.realise}h
                    </td>
                    <td className="px-4 py-3 text-center bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 shadow-sm">
                      <div className="flex flex-col items-center">
                        <span className={`text-base font-black ${getEcartColor(ligne.timesheet.ecart)} drop-shadow-sm`}>
                          {ligne.timesheet.ecart > 0 ? '+' : ''}{ligne.timesheet.ecart}h
                        </span>
                        <div className={`w-8 h-1 rounded-full mt-1 ${
                          ligne.timesheet.ecart > 0 
                            ? 'bg-gradient-to-r from-red-300 to-red-500' 
                            : 'bg-gradient-to-r from-green-300 to-green-500'
                        }`}></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-purple-700 bg-emerald-50/30">
                      {ligne.timesheet.productionParPiece}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-orange-700 bg-emerald-50/30">
                      {ligne.timesheet.compensationProd > 0 ? '+' : ''}{ligne.timesheet.compensationProd}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant pour le tableau Nettoyage avec clients
type SortFieldNettoyage = 'nom' | 'volumetrie' | 'budgetAnnuel' | 'budgetPeriodique' | 'rapportComptable' | 'rapportBilan' | 'situationsIntermediaires';

const TableauNettoyageComponent: React.FC = () => {
  const [sortField, setSortField] = useState<SortFieldNettoyage | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  console.log('TableauNettoyageComponent rendering...', { donneesNettoyage });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-BE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRegimeTVAColor = (regime: string) => {
    switch (regime) {
      case 'Mensuel': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Trimestriel': return 'bg-green-100 text-green-800 border-green-300';
      case 'Annuel': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSortNettoyage = (field: SortFieldNettoyage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIconNettoyage = (field: SortFieldNettoyage) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  const sortedClientsNettoyage = React.useMemo(() => {
    if (!sortField || !sortDirection) return donneesNettoyage.clients;
    
    return [...donneesNettoyage.clients].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'nom':
          aValue = a.nom;
          bValue = b.nom;
          break;
        case 'volumetrie':
          aValue = a.volumetrie.realise;
          bValue = b.volumetrie.realise;
          break;
        case 'budgetAnnuel':
          aValue = a.budget.annuel;
          bValue = b.budget.annuel;
          break;
        case 'budgetPeriodique':
          aValue = a.budget.periodique;
          bValue = b.budget.periodique;
          break;
        case 'rapportComptable':
          aValue = a.operations.rapportComptable;
          bValue = b.operations.rapportComptable;
          break;
        case 'rapportBilan':
          aValue = a.operations.rapportBilan;
          bValue = b.operations.rapportBilan;
          break;
        case 'situationsIntermediaires':
          aValue = a.situations.situationsIntermediaires;
          bValue = b.situations.situationsIntermediaires;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [sortField, sortDirection]);

  console.log('Rendering TableauNettoyage with clients:', sortedClientsNettoyage);
  
  return (
    <div className="mt-4 bg-gradient-to-br from-white to-emerald-50/30 rounded-xl border border-emerald-200/50 overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">
            Tableau Nettoyage et Vérification - Clients traités
          </h4>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Données filtrées selon la période sélectionnée
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                <button 
                  onClick={() => handleSortNettoyage('nom')}
                  className="flex items-center space-x-2 hover:text-emerald-600 transition-colors"
                >
                  <span>CLIENT</span>
                  {getSortIconNettoyage('nom')}
                </button>
              </th>
              {/* Bloc 1: Volumétrie */}
              <th className="px-4 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider border-l-2 border-blue-300/50 bg-blue-50/50">
                <div className="flex flex-col items-center">
                  <span>VOLUMÉTRIE</span>
                  <span className="text-xs text-slate-500 font-normal mt-1">Réalisé</span>
                </div>
              </th>
              {/* Bloc 2: Budget */}
              <th className="px-4 py-4 text-center text-sm font-bold text-orange-700 uppercase tracking-wider border-l-2 border-orange-300/50 bg-orange-50/50" colSpan={2}>
                <div className="flex items-center justify-center">
                  <span>BUDGET</span>
                  <div className="w-2 h-2 bg-orange-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </th>
              {/* Bloc 3: Opérations */}
              <th className="px-4 py-4 text-center text-sm font-bold text-emerald-700 uppercase tracking-wider border-l-2 border-emerald-300/50 bg-emerald-50/50" colSpan={7}>
                <div className="flex items-center justify-center">
                  <span>OPÉRATIONS</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </th>
              {/* Bloc 4: Situations */}
              <th className="px-4 py-4 text-center text-sm font-bold text-purple-700 uppercase tracking-wider border-l-2 border-purple-300/50 bg-purple-50/50" colSpan={2}>
                <div className="flex items-center justify-center">
                  <span>SITUATIONS</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </th>
            </tr>
            <tr className="bg-gradient-to-r from-slate-100/50 to-slate-50 border-b border-slate-200">
              <th className="px-6 py-3"></th>
              {/* Bloc 1 */}
              <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase bg-blue-50/70">
                <button 
                  onClick={() => handleSortNettoyage('volumetrie')}
                  className="flex items-center justify-center space-x-1 hover:text-blue-800 transition-colors"
                >
                  <span>Réalisé</span>
                  {getSortIconNettoyage('volumetrie')}
                </button>
              </th>
              {/* Bloc 2 */}
              <th className="px-4 py-3 text-center text-xs font-semibold text-orange-700 uppercase border-l-2 border-orange-300/50 bg-orange-50/70">
                <button 
                  onClick={() => handleSortNettoyage('budgetAnnuel')}
                  className="flex items-center justify-center space-x-1 hover:text-orange-800 transition-colors"
                >
                  <span>Annuel</span>
                  {getSortIconNettoyage('budgetAnnuel')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-orange-700 uppercase bg-orange-50/70">
                <button 
                  onClick={() => handleSortNettoyage('budgetPeriodique')}
                  className="flex items-center justify-center space-x-1 hover:text-orange-800 transition-colors"
                >
                  <span>Périodique</span>
                  {getSortIconNettoyage('budgetPeriodique')}
                </button>
              </th>
              {/* Bloc 3 */}
              <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase border-l-2 border-emerald-300/50 bg-emerald-50/70">Encodage Réalisé</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">Nettoyage Comptable</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">Nettoyage Bilan</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">Bilan Réalisé</th>
              <th className="px-3 py-3 text-center text-xs font-bold text-rose-700 uppercase bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300/50 shadow-sm">
                <button 
                  onClick={() => handleSortNettoyage('rapportComptable')}
                  className="flex items-center justify-center space-x-1 hover:text-rose-800 transition-colors"
                >
                  <span>💼 RAPPORT COMPTABLE</span>
                  <div className="w-1 h-1 bg-rose-500 rounded-full ml-1 animate-ping"></div>
                  {getSortIconNettoyage('rapportComptable')}
                </button>
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold text-violet-700 uppercase bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-300/50 shadow-sm">
                <button 
                  onClick={() => handleSortNettoyage('rapportBilan')}
                  className="flex items-center justify-center space-x-1 hover:text-violet-800 transition-colors"
                >
                  <span>📊 RAPPORT BILAN</span>
                  <div className="w-1 h-1 bg-violet-500 rounded-full ml-1 animate-ping"></div>
                  {getSortIconNettoyage('rapportBilan')}
                </button>
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-emerald-700 uppercase bg-emerald-50/70">Séquences</th>
              {/* Bloc 4 */}
              <th className="px-4 py-3 text-center text-xs font-semibold text-purple-700 uppercase border-l-2 border-purple-300/50 bg-purple-50/70">
                <button 
                  onClick={() => handleSortNettoyage('situationsIntermediaires')}
                  className="flex items-center justify-center space-x-1 hover:text-purple-800 transition-colors"
                >
                  <span>Situations Intermédiaires</span>
                  {getSortIconNettoyage('situationsIntermediaires')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-purple-700 uppercase bg-purple-50/70">Régime TVA</th>
            </tr>
          </thead>
          <tbody className="bg-gradient-to-b from-white to-slate-50/30 divide-y divide-slate-200/50">
            {sortedClientsNettoyage && sortedClientsNettoyage.length > 0 ? (
              sortedClientsNettoyage.map((client) => (
                <tr key={client.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/30 border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 shadow-sm"></div>
                      {client.nom}
                    </div>
                  </td>
                  {/* Bloc 1: Volumétrie */}
                  <td className="px-4 py-4 text-center text-lg font-bold text-blue-700 bg-blue-50/50">
                    <div className="flex flex-col items-center">
                      <span>{client.volumetrie?.realise || 0}</span>
                      <div className="w-8 h-1 bg-blue-400 rounded-full mt-1"></div>
                    </div>
                  </td>
                  {/* Bloc 2: Budget */}
                  <td className="px-4 py-4 text-center text-lg font-bold text-orange-700 border-l-2 border-orange-300/50 bg-orange-50/50">
                    {formatCurrency(client.budget?.annuel || 0)}
                  </td>
                  <td className="px-4 py-4 text-center text-lg font-bold text-orange-700 bg-orange-50/50">
                    {formatCurrency(client.budget?.periodique || 0)}
                  </td>
                  {/* Bloc 3: Opérations */}
                  <td className="px-3 py-4 text-center text-sm font-bold text-emerald-700 border-l-2 border-emerald-300/50 bg-emerald-50/50">
                    {client.operations?.encodageRealise || 0}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-bold text-emerald-700 bg-emerald-50/50">
                    {client.operations?.nettoyageComptable || 0}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-bold text-emerald-700 bg-emerald-50/50">
                    {client.operations?.nettoyageBilan || 0}
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-bold text-emerald-700 bg-emerald-50/50">
                    {client.operations?.bilanRealise || 0}
                  </td>
                  <td className="px-3 py-4 text-center text-lg font-bold text-violet-700 bg-emerald-50/50">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-violet-700 drop-shadow-sm">
                        {client.operations?.rapportComptable || 0}
                      </span>
                      <div className="w-10 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2"></div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center text-lg font-bold text-violet-700 bg-emerald-50/50">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-black text-violet-700 drop-shadow-sm">
                        {client.operations?.rapportBilan || 0}
                      </span>
                      <div className="w-10 h-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full mt-2"></div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center text-sm font-bold text-emerald-700 bg-emerald-50/50">
                    {client.operations?.sequences || 0}
                  </td>
                  {/* Bloc 4: Situations */}
                  <td className="px-4 py-4 text-center text-lg font-bold text-purple-700 border-l-2 border-purple-300/50 bg-purple-50/50">
                    <div className="flex flex-col items-center">
                      <span>{client.situations?.situationsIntermediaires || 0}</span>
                      <div className="w-8 h-1 bg-purple-400 rounded-full mt-1"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center bg-purple-50/50">
                    <span className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold shadow-sm border-2 ${getRegimeTVAColor(client.situations?.regimeTVA || 'Mensuel')} transition-all hover:scale-105`}>
                      {client.situations?.regimeTVA || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SuiviIndividuel: React.FC<SuiviIndividuelProps> = ({ collaborateurs, metriques, periode }) => {
  const [collaborateurSelectionne, setCollaborateurSelectionne] = useState<string | null>(null);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string | null>(null);
  const [periodeType, setPeriodeType] = useState<'mensuel' | 'trimestriel' | 'annuel' | 'personnalise'>('mensuel');
  const [dateDebut, setDateDebut] = useState<string>('2024-01-01');
  const [dateFin, setDateFin] = useState<string>('2024-01-31');

  // Fonctions utilitaires
  const getCollaborateurStats = (collaborateurId: string) => {
    const metriquesCollab = metriques.filter(m => m.collaborateurId === collaborateurId);
    if (metriquesCollab.length === 0) return null;

    const totalTempsPreste = metriquesCollab.reduce((sum, m) => sum + m.heuresTravaillees, 0);
    const moyenneEfficacite = metriquesCollab.reduce((sum, m) => sum + m.efficacite, 0) / metriquesCollab.length;
    const moyenneQualite = metriquesCollab.reduce((sum, m) => sum + m.qualite, 0) / metriquesCollab.length;
    const totalPrestations = metriquesCollab.reduce((sum, m) => sum + m.prestationsRealisees.length, 0);
    
    return {
      totalTempsPreste,
      moyenneEfficacite,
      moyenneQualite,
      totalPrestations,
      tauxRealisation: 85 // Valeur par défaut
    };
  };

  const getPerformanceData = (collaborateurId: string) => {
    const metriquesCollab = metriques.filter(m => m.collaborateurId === collaborateurId);
    return metriquesCollab.map(m => ({
      date: new Date(m.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      preste: m.heuresTravaillees,
      attendu: 8,
      planifie: 8,
      efficacite: m.efficacite,
      qualite: m.qualite
    }));
  };

  // Variables pour le rendu
  const collaborateurActuel = collaborateurs.find(c => c.id === collaborateurSelectionne);
  const metriquesCollaborateur = metriques.find(m => m.collaborateurId === collaborateurSelectionne);
  const statsActuelles = collaborateurSelectionne ? getCollaborateurStats(collaborateurSelectionne) : null;
  const performanceData = collaborateurSelectionne ? getPerformanceData(collaborateurSelectionne) : [];

  const getStatusColor = (valeur: number, seuils: { bon: number; moyen: number }) => {
    if (valeur >= seuils.bon) return 'text-green-600 bg-green-50 border-green-200';
    if (valeur >= seuils.moyen) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header avec sélection collaborateur */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Suivi Individuel</CardTitle>
                <p className="text-sm text-gray-600">Métriques de production par collaborateur</p>
              </div>
            </div>
            
            {/* Sélecteur de période */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select 
                  value={periodeType}
                  onChange={(e) => setPeriodeType(e.target.value as 'mensuel' | 'trimestriel' | 'annuel' | 'personnalise')}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mensuel">Mensuel</option>
                  <option value="trimestriel">Trimestriel</option>
                  <option value="annuel">Annuel</option>
                  <option value="personnalise">Personnalisé</option>
                </select>
              </div>
              
              {periodeType === 'personnalise' ? (
                <div className="flex items-center space-x-2">
                  <input 
                    type="date" 
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">à</span>
                  <input 
                    type="date" 
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <Badge variant="outline" className="bg-white/60">
                  {periodeType === 'mensuel' ? 'Janvier 2024' :
                   periodeType === 'trimestriel' ? 'Q1 2024' :
                   periodeType === 'annuel' ? '2024' : 
                   `${new Date(dateDebut).toLocaleDateString('fr-FR')} - ${new Date(dateFin).toLocaleDateString('fr-FR')}`}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sélection collaborateur */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {collaborateurs.map((collaborateur) => {
          const stats = getCollaborateurStats(collaborateur.id);
          const isSelected = collaborateur.id === collaborateurSelectionne;
          
          return (
            <Card 
              key={collaborateur.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setCollaborateurSelectionne(collaborateur.id)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                    isSelected ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-400'
                  }`}>
                    {collaborateur.initiales}
                  </div>
                  <h3 className="font-medium text-sm">{collaborateur.prenom}</h3>
                  <p className="text-xs text-gray-500 mb-2">{collaborateur.role}</p>
                  {stats && (
                    <div className="space-y-1">
                      {(() => {
                        // Trouver les données de suivi temps pour ce collaborateur
                        const suiviCollaborateur = suiviTemps.find(s => s.collaborateurId === collaborateur.id);
                        if (suiviCollaborateur) {
                          const pourcentageRealisation = (suiviCollaborateur.tempsPreste / suiviCollaborateur.tempsAttendu) * 100;
                          const isOverTime = suiviCollaborateur.tempsPreste > suiviCollaborateur.tempsAttendu;
                          return (
                            <>
                              <div className="text-xs">
                                <span className="font-medium">{pourcentageRealisation.toFixed(0)}%</span>
                                <span className="text-gray-500 ml-1">réalisé</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {suiviCollaborateur.tempsPreste}h / {suiviCollaborateur.tempsAttendu}h
                              </div>
                              <Progress 
                                value={Math.min(pourcentageRealisation, 100)} 
                                className={`h-1 ${isOverTime ? 'bg-red-100' : 'bg-green-100'}`}
                              />
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div className="text-xs">
                                <span className="font-medium">{stats.moyenneEfficacite.toFixed(0)}%</span>
                                <span className="text-gray-500 ml-1">efficacité</span>
                              </div>
                              <Progress value={stats.moyenneEfficacite} className="h-1" />
                            </>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Détails du collaborateur sélectionné */}
      {collaborateurActuel && statsActuelles && (
        <div className="space-y-6">
          {/* KPIs et Profil collaborateur en ligne */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* KPIs dynamiques selon la catégorie */}
            {categorieSelectionnee ? (
              <>
                {categorieSelectionnee === '04' ? (
                  // KPIs pour Encodage Comptable
                  <>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-700 font-medium">Écart Total</p>
                            <p className="text-3xl font-bold text-blue-800">
                              {donneesEncodage.clients.reduce((sum, client) => 
                                sum + client.lignes.reduce((ligneSum, ligne) => ligneSum + ligne.timesheet.ecart, 0), 0
                              )}h
                            </p>
                            <p className="text-xs text-blue-600">Réalisé vs Théorique</p>
                          </div>
                          <div className="p-3 bg-blue-600 rounded-full">
                            <TrendingDown className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-emerald-700 font-medium">%Compensation</p>
                            <p className="text-3xl font-bold text-emerald-800">
                              {(donneesEncodage.clients.reduce((sum, client) => 
                                sum + client.lignes.reduce((ligneSum, ligne) => ligneSum + (ligne.compensation?.pourcentage || 0), 0), 0
                              ) / donneesEncodage.clients.length / 6).toFixed(1)}%
                            </p>
                            <p className="text-xs text-emerald-600">Taux de compensation</p>
                          </div>
                          <div className="p-3 bg-emerald-600 rounded-full">
                            <Activity className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-emerald-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-amber-700 font-medium">Productivité</p>
                            <p className="text-3xl font-bold text-amber-800">
                              {(donneesEncodage.clients.reduce((sum, client) => 
                                sum + client.lignes.reduce((ligneSum, ligne) => ligneSum + ligne.timesheet.productionParPiece, 0), 0
                              ) / donneesEncodage.clients.length / 6).toFixed(1)}
                            </p>
                            <p className="text-xs text-amber-600">Pièces/heure moyenne</p>
                          </div>
                          <div className="p-3 bg-amber-600 rounded-full">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-amber-200 rounded-full h-2">
                          <div className="bg-amber-600 h-2 rounded-full" style={{width: '88%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : categorieSelectionnee === '06' ? (
                  // KPIs pour Nettoyage et Vérification
                  <>
                    <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-rose-700 font-medium">Rapports Comptables</p>
                            <p className="text-3xl font-bold text-rose-800">
                              {donneesNettoyage.clients.reduce((sum, client) => sum + client.operations.rapportComptable, 0)}
                            </p>
                            <p className="text-xs text-rose-600">Total réalisés</p>
                          </div>
                          <div className="p-3 bg-rose-600 rounded-full">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-rose-200 rounded-full h-2">
                          <div className="bg-rose-600 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-violet-700 font-medium">Rapports Bilan</p>
                            <p className="text-3xl font-bold text-violet-800">
                              {donneesNettoyage.clients.reduce((sum, client) => sum + client.operations.rapportBilan, 0)}
                            </p>
                            <p className="text-xs text-violet-600">Total réalisés</p>
                          </div>
                          <div className="p-3 bg-violet-600 rounded-full">
                            <BarChart3 className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-violet-200 rounded-full h-2">
                          <div className="bg-violet-600 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-teal-700 font-medium">Budget Utilisé</p>
                            <p className="text-3xl font-bold text-teal-800">
                              {((donneesNettoyage.clients.reduce((sum, client) => sum + client.budget.periodique, 0) / 
                                donneesNettoyage.clients.reduce((sum, client) => sum + client.budget.annuel, 0)) * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-teal-600">Périodique/Annuel</p>
                          </div>
                          <div className="p-3 bg-teal-600 rounded-full">
                            <TrendingUp className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-teal-200 rounded-full h-2">
                          <div className="bg-teal-600 h-2 rounded-full" style={{width: '73%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  // KPIs génériques pour autres catégories
                  <>
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Prestations</p>
                            <p className="text-3xl font-bold text-gray-800">-</p>
                            <p className="text-xs text-gray-600">Données non disponibles</p>
                          </div>
                          <div className="p-3 bg-gray-400 rounded-full">
                            <Activity className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Performance</p>
                            <p className="text-3xl font-bold text-gray-800">-</p>
                            <p className="text-xs text-gray-600">Tableau spécialisé requis</p>
                          </div>
                          <div className="p-3 bg-gray-400 rounded-full">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Qualité</p>
                            <p className="text-3xl font-bold text-gray-800">-</p>
                            <p className="text-xs text-gray-600">Sélectionnez cat. 04 ou 06</p>
                          </div>
                          <div className="p-3 bg-gray-400 rounded-full">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-gray-400 h-2 rounded-full" style={{width: '0%'}}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            ) : (
              // KPIs par défaut quand aucune catégorie n'est sélectionnée
              <>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Temps Presté</p>
                        <p className="text-2xl font-bold text-blue-800">{statsActuelles.totalTempsPreste}h</p>
                        <p className="text-xs text-blue-600">{statsActuelles.tauxRealisation.toFixed(0)}% du prévu</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Efficacité</p>
                        <p className="text-2xl font-bold text-green-800">{statsActuelles.moyenneEfficacite.toFixed(0)}%</p>
                        <p className="text-xs text-green-600">Moyenne période</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 h-[200px] flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium">Qualité</p>
                        <p className="text-2xl font-bold text-purple-800">{statsActuelles.moyenneQualite.toFixed(0)}/100</p>
                        <p className="text-xs text-purple-600">Score moyen</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Profil collaborateur */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-4 h-[200px] flex flex-col justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2">
                    {collaborateurActuel.initiales}
                  </div>
                  <h3 className="font-bold text-sm truncate">{collaborateurActuel.prenom} {collaborateurActuel.nom}</h3>
                  <p className="text-gray-600 text-xs mb-2 truncate">{collaborateurActuel.role}</p>
                  <Badge 
                    variant="outline" 
                    className={`mb-3 text-xs ${
                      collaborateurActuel.regime === 'temps_plein' ? 'bg-green-50 text-green-700' :
                      collaborateurActuel.regime === 'temps_partiel' ? 'bg-blue-50 text-blue-700' :
                      'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {collaborateurActuel.regime.replace('_', ' ')}
                  </Badge>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 truncate">Temps attendu/semaine:</span>
                      <span className="font-medium ml-1">{collaborateurActuel.tempsAttendu}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Statut:</span>
                      <Badge variant={collaborateurActuel.actif ? "default" : "secondary"} className="text-xs">
                        {collaborateurActuel.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableau des catégories de prestations en pleine largeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Catégories de Prestations</span>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={categorieSelectionnee || ''}
                    onChange={(e) => setCategorieSelectionnee(e.target.value || null)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {metriquesCollaborateur?.categoriesPrestations?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.id}. {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categorieSelectionnee && metriquesCollaborateur?.categoriesPrestations ? (
                  metriquesCollaborateur.categoriesPrestations
                    .filter(c => c.id === categorieSelectionnee)
                    .map((categorie) => {
                  const percentageRealise = categorie.budgetAlloue > 0 ? (categorie.heuresRealisees / categorie.budgetAlloue) * 100 : 0;
                  const isOverBudget = categorie.heuresRealisees > categorie.budgetAlloue;
                  const statusColor = categorie.statut === 'termine' ? 'green' : categorie.statut === 'en_retard' ? 'red' : 'blue';
                  
                  return (
                    <div key={categorie.id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                      {/* Header de la catégorie */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                            statusColor === 'green' ? 'from-green-400 to-green-600' :
                            statusColor === 'red' ? 'from-red-400 to-red-600' :
                            'from-blue-400 to-blue-600'
                          } flex items-center justify-center text-white font-bold text-sm`}>
                            {categorie.id}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{categorie.nom}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Budget: {categorie.budgetAlloue}h
                              </Badge>
                              <Badge className={`text-xs ${isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                Réalisé: {categorie.heuresRealisees}h
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                            {percentageRealise.toFixed(1)}%
                          </div>
                          <Badge className={`text-xs ${
                            categorie.statut === 'termine' ? 'bg-green-100 text-green-700' :
                            categorie.statut === 'en_retard' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {categorie.statut === 'termine' ? 'Terminé' : 
                             categorie.statut === 'en_retard' ? 'En retard' : 'En cours'}
                          </Badge>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mb-4">
                        <Progress 
                          value={Math.min(percentageRealise, 100)} 
                          className={`h-3 ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}
                        />
                      </div>

                      {/* Tableau spécialisé pour Encodage (04) */}
                      {categorie.id === '04' ? (
                        <TableauEncodageComponent />
                      ) : categorie.id === '06' ? (
                        <TableauNettoyageComponent />
                      ) : categorie.details ? (
                        <div className="mt-4 bg-white rounded-lg border overflow-hidden shadow-sm">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                            <h4 className="font-medium text-gray-900">Détails de la catégorie</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÉTRIQUE</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">VALEUR</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ÉVOLUTION</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">Documents traités</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-xl font-bold text-blue-600">{categorie.details.documentsTraites}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Bon
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-green-600">+8%</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">Documents en attente</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-xl font-bold text-orange-600">{categorie.details.documentsEnAttente}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Moyen
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-orange-600">-3%</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">Documents rejetés</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-xl font-bold text-red-600">{categorie.details.documentsRejetes}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Très bon
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-green-600">-12%</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">Score qualité</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-xl font-bold text-green-600">{categorie.details.qualiteScore}%</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Excellent
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-green-600">+5%</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-900">Temps moyen/document</td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-xl font-bold text-purple-600">{categorie.tempsMoyenParDocument?.toFixed(1)} min</span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Standard
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-green-600">-4%</span>
                                  </td>
                                </tr>
                                {categorie.tauxErreur && (
                                  <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">Taux d'erreur</td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="text-xl font-bold text-yellow-600">{categorie.tauxErreur}%</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Très bon
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                      <span className="text-sm font-medium text-green-600">-18%</span>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                          <div className="text-center text-gray-600">
                            <p className="text-lg font-medium">Tableau détaillé disponible uniquement pour :</p>
                            <div className="flex justify-center space-x-4 mt-3">
                              <Badge className="bg-blue-100 text-blue-700 px-3 py-2">04. Encodage Comptable</Badge>
                              <Badge className="bg-green-100 text-green-700 px-3 py-2">06. Nettoyage et Vérification</Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sélectionnez une catégorie</h3>
                    <p className="text-gray-600 mb-4">
                      Choisissez une catégorie de prestations pour voir les données détaillées.
                    </p>
                    <p className="text-sm text-gray-500">
                      Tableaux spécialisés disponibles pour les catégories <strong>04 (Encodage)</strong> et <strong>06 (Nettoyage)</strong>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SuiviIndividuel;
