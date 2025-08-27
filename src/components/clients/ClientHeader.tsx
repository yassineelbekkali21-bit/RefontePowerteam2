import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Eye, Settings, User, Plus } from 'lucide-react';

interface ClientHeaderProps {
  viewMode: 'list' | 'detail';
  selectedClient: any;
  totalClients: number;
  activeClients: number;
  onViewModeChange: (mode: 'list' | 'detail') => void;
  onBudgetModalOpen: () => void;
  onSettingsModalOpen: () => void;
}

export const ClientHeader = memo<ClientHeaderProps>(({
  viewMode,
  selectedClient,
  totalClients,
  activeClients,
  onViewModeChange,
  onBudgetModalOpen,
  onSettingsModalOpen
}) => {
  return (
    <>
      {/* Header moderne */}
      <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">CLIENTS</h1>
              <p className="text-blue-100">Gestion et suivi de la clientèle</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">{totalClients}</div>
                <div className="text-sm text-blue-100">Clients total</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-2xl font-bold">{activeClients}</div>
                <div className="text-sm text-blue-100">Actifs</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>


    </>
  );
});

ClientHeader.displayName = 'ClientHeader';
