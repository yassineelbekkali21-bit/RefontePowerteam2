import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientDetailFinal from '@/components/clients/ClientDetailFinal';
import { BudgetModal } from '@/components/clients/BudgetModal';
import SettingsModal from '@/components/clients/SettingsModal';
import { CorrectionPlanModal } from '@/components/clients/CorrectionPlanModal';
import { PackageRevisionModal } from '@/components/clients/PackageRevisionModal';
import NotFound from '@/pages/NotFound';

// Mock data pour les clients (à remplacer par un appel API dans un vrai projet)
const mockClients = [
  {
    id: 'CLI-2024-001',
    name: 'SARL MARIN',
    type: 'Médecin Généraliste',
    status: 'Actif',
    budgetHoraire: 520,
    realiseHoraire: 385,
    budgetEconomique: 48000,
    realiseEconomique: 35200
  },
  {
    id: 'CLI-2024-002', 
    name: 'TECH CORP',
    type: 'Société de Technologie',
    status: 'Actif',
    budgetHoraire: 750,
    realiseHoraire: 680,
    budgetEconomique: 75000,
    realiseEconomique: 68000
  },
  {
    id: 'CLI-2024-003',
    name: 'INNOV SRL',
    type: 'Start-up Innovation',
    status: 'À suivre',
    budgetHoraire: 320,
    realiseHoraire: 295,
    budgetEconomique: 28800,
    realiseEconomique: 26550
  }
];

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // États pour les modales
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCorrectionPlanModal, setShowCorrectionPlanModal] = useState(false);
  const [showPackageRevisionModal, setShowPackageRevisionModal] = useState(false);
  
  // État pour l'onglet actuel du client detail
  const [currentTab, setCurrentTab] = useState<'overview' | 'historique' | 'prestations'>('overview');
  
  // Trouver le client par ID
  const client = mockClients.find(c => c.id === id);
  
  if (!client) {
    return <NotFound />;
  }
  
  const handleBack = () => {
    navigate('/clients');
  };
  
  const handleSettingsModalOpen = () => {
    setShowSettingsModal(true);
  };
  
  const handleBudgetModalOpen = () => {
    setShowBudgetModal(true);
  };
  
  const handleCorrectionPlanModalOpen = () => {
    setShowCorrectionPlanModal(true);
  };
  
  const handlePackageRevisionModalOpen = () => {
    setShowPackageRevisionModal(true);
  };
  
  const handleNavigateToHistory = () => {
    setCurrentTab('historique');
  };
  
  return (
    <>
      <ClientDetailFinal
        client={client}
        onBack={handleBack}
        onSettingsModalOpen={handleSettingsModalOpen}
        onBudgetModalOpen={handleBudgetModalOpen}
        onCorrectionPlanModalOpen={handleCorrectionPlanModalOpen}
        onPackageRevisionModalOpen={handlePackageRevisionModalOpen}
        initialTab={currentTab}
      />
      
      {/* Modales */}
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        client={client}
      />
      
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        client={client}
      />
      
      <CorrectionPlanModal
        isOpen={showCorrectionPlanModal}
        onClose={() => setShowCorrectionPlanModal(false)}
        client={client}
      />
      
      <PackageRevisionModal
        isOpen={showPackageRevisionModal}
        onClose={() => setShowPackageRevisionModal(false)}
        client={client}
        onOpenBudgetModal={handleBudgetModalOpen}
        onNavigateToHistory={handleNavigateToHistory}
      />
    </>
  );
};

export default ClientDetailPage;
