import { useState, useMemo, useCallback } from 'react';
import { Client, ClientFilters } from '@/types/client';

// Mock data - in real app, this would come from API
// IDs synchronisés avec les échéances fiscales du module Production
const mockClients: Client[] = [
  {
    id: 1,
    name: 'SARL MARTIN',
    type: 'SARL',
    gestionnaire: 'Sophie Laurent',
    encodage: 'Marie Durand',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 120,
    budgetEconomique: 8500,
    budgetVolumetrique: 450,
    realiseHoraire: 98,
    realiseEconomique: 7200,
    realiseVolumetrique: 380,
    avancement: 75,
    lastActivity: '2025-01-15',
    phone: '+33 1 23 45 67 89',
    email: 'contact@sarl-martin.fr',
    address: '15 rue du Commerce, 75014 Paris',
    echeancesActives: ['TVA Mensuelle', 'Bilan Annuel', 'IPP Gérant'],
    prochaineDateEcheance: '2024-08-31'
  },
  {
    id: 2,
    name: 'SPRL COMMERCE PLUS',
    type: 'SPRL',
    gestionnaire: 'Pierre Martin',
    encodage: 'Julie Bernard',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 85,
    budgetEconomique: 6200,
    budgetVolumetrique: 320,
    realiseHoraire: 92,
    realiseEconomique: 6800,
    realiseVolumetrique: 340,
    avancement: 82,
    lastActivity: '2025-01-14',
    phone: '+33 1 34 56 78 90',
    email: 'contact@commerce-plus.be',
    address: '8 avenue du Commerce, 1000 Bruxelles',
    echeancesActives: ['TVA Trimestrielle'],
    prochaineDateEcheance: '2024-10-20'
  },
  {
    id: 3,
    name: 'EURL TECH',
    type: 'EURL',
    gestionnaire: 'Sophie Laurent',
    encodage: 'Marc Petit',
    superviseur: 'Jean Moreau',
    status: 'À suivre',
    budgetHoraire: 95,
    budgetEconomique: 7100,
    budgetVolumetrique: 280,
    realiseHoraire: 88,
    realiseEconomique: 6900,
    realiseVolumetrique: 275,
    avancement: 91,
    lastActivity: '2025-01-13',
    phone: '+33 1 45 67 89 01',
    email: 'info@eurl-tech.fr',
    address: '22 rue de la Technologie, 75015 Paris',
    echeancesActives: ['Bilan Annuel', 'TVA Trimestrielle'],
    prochaineDateEcheance: '2024-08-31'
  },
  {
    id: 4,
    name: 'SA INDUSTRIE',
    type: 'SA',
    gestionnaire: 'Pierre Martin',
    encodage: 'Julie Bernard',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 140,
    budgetEconomique: 12000,
    budgetVolumetrique: 180,
    realiseHoraire: 125,
    realiseEconomique: 11200,
    realiseVolumetrique: 165,
    avancement: 68,
    lastActivity: '2025-01-12',
    phone: '+33 1 56 78 90 12',
    email: 'contact@sa-industrie.fr',
    address: '45 rue de l\'Industrie, 75011 Paris',
    echeancesActives: ['ISOC Annuelle', 'TVA Mensuelle'],
    prochaineDateEcheance: '2024-09-20'
  },
  {
    id: 5,
    name: 'HOLDING INVEST',
    type: 'Holding',
    gestionnaire: 'Sophie Laurent',
    encodage: 'Marie Durand',
    superviseur: 'Jean Moreau',
    status: 'Actif',
    budgetHoraire: 65,
    budgetEconomique: 4800,
    budgetVolumetrique: 220,
    realiseHoraire: 72,
    realiseEconomique: 5200,
    realiseVolumetrique: 165,
    avancement: 88,
    lastActivity: '2025-01-12',
    phone: '+33 1 67 89 01 23',
    email: 'contact@holding-invest.fr',
    address: '12 avenue des Investisseurs, 75008 Paris',
    echeancesActives: ['TVA Consolidée Groupe'],
    prochaineDateEcheance: '2024-08-25'
  }
];

export const useClients = () => {
  const [clients] = useState<Client[]>(mockClients);
  const [filters, setFilters] = useState<ClientFilters>({
    gestionnaire: '',
    type: '',
    status: '',
    search: ''
  });

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      return (
        (filters.gestionnaire === '' || client.gestionnaire === filters.gestionnaire) &&
        (filters.type === '' || client.type === filters.type) &&
        (filters.status === '' || client.status === filters.status) &&
        (filters.search === '' || client.name.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
  }, [clients, filters]);

  const updateFilters = useCallback((newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getClientById = useCallback((id: number | string): Client | undefined => {
    const numericId = typeof id === 'string' ? parseInt(id.replace('client-', '')) : id;
    return clients.find(client => client.id === numericId);
  }, [clients]);

  const getClientByStringId = useCallback((stringId: string): Client | undefined => {
    const numericId = parseInt(stringId.replace('client-', ''));
    return clients.find(client => client.id === numericId);
  }, [clients]);

  const getUniqueGestionnaires = useMemo(() => {
    return [...new Set(clients.map(client => client.gestionnaire))];
  }, [clients]);

  const getUniqueTypes = useMemo(() => {
    return [...new Set(clients.map(client => client.type))];
  }, [clients]);

  const getUniqueStatuses = useMemo(() => {
    return [...new Set(clients.map(client => client.status))];
  }, [clients]);

  return {
    clients,
    filteredClients,
    filters,
    updateFilters,
    getClientById,
    getUniqueGestionnaires,
    getUniqueTypes,
    getUniqueStatuses,
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Actif').length
  };
};
