import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientsListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
    case 'En partance': return 'bg-red-100 text-red-800 border-red-200';
    case 'À suivre': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Récupéré': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getVarianceColor = (budget: number, realise: number): string => {
  const variance = ((realise - budget) / budget) * 100;
  if (variance > 10) return 'text-red-600';
  if (variance > 0) return 'text-orange-600';
  return 'text-green-600';
};

const getVarianceIcon = (budget: number, realise: number) => {
  const variance = ((realise - budget) / budget) * 100;
  if (variance > 10) return <TrendingUp className="w-4 h-4 text-red-600" />;
  if (variance > 0) return <TrendingUp className="w-4 h-4 text-orange-600" />;
  return <TrendingDown className="w-4 h-4 text-green-600" />;
};

export const ClientsList = memo<ClientsListProps>(({ clients, onClientSelect }) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Aucun client trouvé</div>
        <div className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {clients.map((client) => (
        <Card 
          key={client.id} 
          className="group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden relative"
          onClick={() => onClientSelect(client)}
        >
          {/* Effet de brillance au hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          {/* Bordure animée */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              {/* Section gauche - Infos client */}
              <div className="flex items-center space-x-6">
                {/* Avatar avec gradient animé */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                    {client.name.charAt(0)}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                </div>
                
                {/* Infos textuelles */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{client.name}</h3>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 font-medium px-3 py-1">
                      {client.type}
                    </Badge>
                    <span className="text-gray-600 text-sm">ID: #{client.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{client.gestionnaire}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{client.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section centrale - Métriques */}
              <div className="flex items-center space-x-8">
                {/* Budget Horaire */}
                <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 min-w-[100px] group-hover:shadow-lg transition-shadow duration-300">
                  <div className="text-2xl font-bold text-blue-600">{client.budgetHoraire}h</div>
                  <div className="text-xs text-blue-500 font-medium">Budget H.</div>
                  <div className="text-xs text-gray-500 mt-1">{client.realiseHoraire}h réalisé</div>
                </div>
                
                {/* Budget Économique */}
                <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 min-w-[100px] group-hover:shadow-lg transition-shadow duration-300">
                  <div className="text-2xl font-bold text-green-600">{(client.budgetEconomique / 1000).toFixed(1)}k€</div>
                  <div className="text-xs text-green-500 font-medium">Budget €</div>
                  <div className="text-xs text-gray-500 mt-1">{(client.realiseEconomique / 1000).toFixed(1)}k€ réalisé</div>
                </div>
                
                {/* Avancement */}
                <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 min-w-[100px] group-hover:shadow-lg transition-shadow duration-300">
                  <div className="text-2xl font-bold text-purple-600">{client.avancement}%</div>
                  <div className="text-xs text-purple-500 font-medium">Avancement</div>
                  <div className="flex items-center justify-center mt-1">
                    {getVarianceIcon(client.budgetHoraire, client.realiseHoraire)}
                  </div>
                </div>
              </div>
              
              {/* Section droite - Statut */}
              <div className="text-right space-y-3">
                <Badge className={`${getStatusColor(client.status)} font-medium px-4 py-2 text-sm`}>
                  {client.status}
                </Badge>
                <div className="text-xs text-gray-500">
                  Dernière activité
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {client.lastActivity}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

ClientsList.displayName = 'ClientsList';
