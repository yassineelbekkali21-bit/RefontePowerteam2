import React, { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientHeader } from '@/components/clients/ClientHeader';
import { ClientFilters } from '@/components/clients/ClientFilters';
import { ClientsList } from '@/components/clients/ClientsList';
import ClientDetailFinal from '@/components/clients/ClientDetailFinal';
import { BudgetModal } from '../components/clients/BudgetModal';
import SettingsModal from '../components/clients/SettingsModal';
import { BudgetTable } from '../components/clients/BudgetTable';
import { CorrectionPlanModal } from '../components/clients/CorrectionPlanModal';
import { PackageRevisionModal } from '../components/clients/PackageRevisionModal';
import { useClients } from '@/hooks/useClients';
import { useModal, useBudgetModal } from '@/hooks/useModal';
import { Client } from '@/types/client';
import CapacityPlanning from '@/components/clients/CapacityPlanning';
import SuiviPortefeuillesMetier from '@/components/clients/SuiviPortefeuillesMetier';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, Users, Eye, Settings, User, Plus } from 'lucide-react';

const ClientsModern = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [activeTab, setActiveTab] = useState('liste');
  
  const {
    filteredClients,
    filters,
    updateFilters,
    getUniqueGestionnaires,
    getUniqueTypes,
    getUniqueStatuses,
    totalClients,
    activeClients
  } = useClients();

  const budgetModal = useBudgetModal();
  const settingsModal = useModal();
  const correctionPlanModal = useModal();
  const packageRevisionModal = useModal();

  const handleClientSelect = useCallback((client: Client) => {
    setSelectedClient(client);
    setViewMode('detail');
  }, []);

  const handleViewModeChange = useCallback((mode: 'list' | 'detail') => {
    setViewMode(mode);
  }, []);

  const handleBudgetModalOpen = useCallback(() => {
    budgetModal.open();
    budgetModal.resetStep();
  }, [budgetModal]);

  const handleCorrectionPlanModalOpen = useCallback(() => {
    correctionPlanModal.open();
  }, [correctionPlanModal]);

  const handlePackageRevisionModalOpen = useCallback(() => {
    packageRevisionModal.open();
  }, [packageRevisionModal]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <ClientHeader
          viewMode={viewMode}
          selectedClient={selectedClient}
          totalClients={totalClients}
          activeClients={activeClients}
          onViewModeChange={handleViewModeChange}
          onBudgetModalOpen={handleBudgetModalOpen}
          onSettingsModalOpen={settingsModal.open}
        />

        {/* Navigation élégante avec onglets */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('liste')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'liste' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4" />
                Liste des Clients
              </button>
              
              <button
                onClick={() => setActiveTab('capacity')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'capacity' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Capacity Planning
              </button>
              
              <button
                onClick={() => setActiveTab('portefeuilles')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'portefeuilles' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <PieChart className="w-4 h-4" />
                Suivi des Portefeuilles
              </button>
            </div>
            
            {/* Actions contextuelles selon l'onglet */}
            <div className="flex items-center gap-3">
              {activeTab === 'liste' && (
                <>
                  {selectedClient && viewMode === 'list' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setViewMode('detail')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Fiche Client
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                        onClick={handleBudgetModalOpen}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Gestion Budget</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                        onClick={settingsModal.open}
                      >
                        <User className="h-4 w-4" />
                        <span>Paramétrage Client</span>
                      </Button>
                    </>
                  )}
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau Client
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'liste' && (
          <div className="space-y-6">
            <ClientFilters
              filters={filters}
              onFiltersChange={updateFilters}
              gestionnaires={getUniqueGestionnaires}
              types={getUniqueTypes}
              statuses={getUniqueStatuses}
            />

            {viewMode === 'list' && (
              <ClientsList
                clients={filteredClients}
                onClientSelect={handleClientSelect}
              />
            )}
          </div>
        )}

        {activeTab === 'capacity' && (
          <div className="animate-fadeIn">
            <CapacityPlanning />
          </div>
        )}

        {activeTab === 'portefeuilles' && (
          <div className="animate-fadeIn">
            <SuiviPortefeuillesMetier />
          </div>
        )}

        {viewMode === 'detail' && selectedClient && (
          <ClientDetailFinal
            client={selectedClient}
            onBack={() => handleViewModeChange('list')}
            onSettingsModalOpen={settingsModal.open}
            onBudgetModalOpen={budgetModal.open}
            onCorrectionPlanModalOpen={correctionPlanModal.open}
            onPackageRevisionModalOpen={packageRevisionModal.open}
          />
        )}

        <BudgetModal
          isOpen={budgetModal.isOpen}
          onClose={budgetModal.close}
          client={selectedClient}
        />

        <SettingsModal
          isOpen={settingsModal.isOpen}
          onClose={settingsModal.close}
          client={selectedClient}
        />

        <CorrectionPlanModal
          isOpen={correctionPlanModal.isOpen}
          onClose={correctionPlanModal.close}
          client={selectedClient}
        />

        <PackageRevisionModal
          isOpen={packageRevisionModal.isOpen}
          onClose={packageRevisionModal.close}
          client={selectedClient}
          onOpenBudgetModal={undefined}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientsModern;
