import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { ClientFilters as ClientFiltersType } from '@/types/client';

interface ClientFiltersProps {
  filters: ClientFiltersType;
  onFiltersChange: (filters: Partial<ClientFiltersType>) => void;
  gestionnaires: string[];
  types: string[];
  statuses: string[];
}

export const ClientFilters = memo<ClientFiltersProps>(({ 
  filters, 
  onFiltersChange, 
  gestionnaires, 
  types, 
  statuses 
}) => {
  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nom du client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Gestionnaire</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.gestionnaire}
              onChange={(e) => onFiltersChange({ gestionnaire: e.target.value })}
            >
              <option value="">Tous</option>
              {gestionnaires.map(gestionnaire => (
                <option key={gestionnaire} value={gestionnaire}>
                  {gestionnaire}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Type de client</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type}
              onChange={(e) => onFiltersChange({ type: e.target.value })}
            >
              <option value="">Tous</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value })}
            >
              <option value="">Tous</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ClientFilters.displayName = 'ClientFilters';
