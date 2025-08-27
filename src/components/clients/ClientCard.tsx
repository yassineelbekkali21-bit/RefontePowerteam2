import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, TrendingUp } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Actif': return 'bg-green-100 text-green-800';
    case 'En partance': return 'bg-red-100 text-red-800';
    case 'À suivre': return 'bg-yellow-100 text-yellow-800';
    case 'Récupéré': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getAvancementColor = (avancement: number): string => {
  if (avancement >= 90) return '#10B981';
  if (avancement >= 70) return '#F59E0B';
  return '#EF4444';
};

export const ClientCard = memo<ClientCardProps>(({ client, onClick }) => {
  return (
    <Card 
      className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
      onClick={() => onClick(client)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {client.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.type}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500">
                  <User className="w-3 h-3 inline mr-1" />
                  {client.gestionnaire}
                </span>
                <span className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {client.lastActivity}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium" style={{ color: getAvancementColor(client.avancement) }}>
                {client.avancement}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {client.realiseHoraire}h / {client.budgetHoraire}h
            </div>
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ClientCard.displayName = 'ClientCard';
