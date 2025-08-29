import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ClientRisque {
  id: string;
  nom: string;
  idClient: string;
  statut: 'A risque' | 'Récupéré';
  secteur?: string;
  gestionnaire?: string;
  dateContact?: string;
  rdvDate?: string | null;
  caBudgete?: number;
  email?: string;
  telephone?: string;
  commentaire?: string;
  planAction?: string;
  dateRecuperation?: string;
  recupere?: boolean;
  raisonRisque?: string;
}

interface ClientsContextType {
  clientsRisque: ClientRisque[];
  addClientRisque: (client: ClientRisque) => void;
  updateClientRisque: (clientId: string, updates: Partial<ClientRisque>) => void;
  removeClientRisque: (clientId: string) => void;
  getClientRisqueByName: (nom: string) => ClientRisque | undefined;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};

interface ClientsProviderProps {
  children: ReactNode;
}

export const ClientsProvider: React.FC<ClientsProviderProps> = ({ children }) => {
  // Initialisation avec quelques clients à risque existants
  const [clientsRisque, setClientsRisque] = useState<ClientRisque[]>([
    {
      id: 'S1',
      nom: 'CABINET DENTAIRE MARTIN',
      idClient: 'CLI-2024-2045',
      statut: 'A risque',
      secteur: 'Santé',
      gestionnaire: 'Valentine Caprasse',
      dateContact: '15/12/2024',
      rdvDate: null,
      caBudgete: 12500,
      email: 'contact@cabinet-martin.fr',
      telephone: '+33123456789',
      commentaire: 'Pas content de l\'augmentation des tarifs',
      raisonRisque: 'Mécontentement tarifs',
      recupere: false
    },
    {
      id: 'S2',
      nom: 'GARAGE ROUSSEAU',
      idClient: 'CLI-2024-2090',
      statut: 'A risque',
      secteur: 'Services',
      gestionnaire: 'Pauline Coster',
      dateContact: '20/12/2024',
      rdvDate: '15/02/2025',
      caBudgete: 8900,
      email: 'contact@garage-rousseau.fr',
      telephone: '+33198765432',
      commentaire: 'Retards répétés dans les prestations',
      raisonRisque: 'Qualité service',
      recupere: false
    }
  ]);

  const addClientRisque = useCallback((client: ClientRisque) => {
    setClientsRisque(prev => {
      // Vérifier si le client existe déjà
      const existingIndex = prev.findIndex(c => c.nom === client.nom || c.idClient === client.idClient);
      if (existingIndex >= 0) {
        // Mettre à jour le client existant
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...client };
        console.log(`🔄 Client à risque mis à jour: ${client.nom}`);
        return updated;
      } else {
        // Ajouter un nouveau client
        console.log(`➕ Nouveau client à risque ajouté: ${client.nom}`);
        return [...prev, client];
      }
    });
  }, []);

  const updateClientRisque = useCallback((clientId: string, updates: Partial<ClientRisque>) => {
    setClientsRisque(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, ...updates } : client
      )
    );
    console.log(`🔄 Client à risque modifié: ${clientId}`, updates);
  }, []);

  const removeClientRisque = useCallback((clientId: string) => {
    setClientsRisque(prev => {
      const client = prev.find(c => c.id === clientId);
      if (client) {
        console.log(`➖ Client à risque supprimé: ${client.nom}`);
      }
      return prev.filter(c => c.id !== clientId);
    });
  }, []);

  const getClientRisqueByName = useCallback((nom: string) => {
    return clientsRisque.find(client => 
      client.nom.toLowerCase().includes(nom.toLowerCase()) ||
      nom.toLowerCase().includes(client.nom.toLowerCase())
    );
  }, [clientsRisque]);

  const value: ClientsContextType = {
    clientsRisque,
    addClientRisque,
    updateClientRisque,
    removeClientRisque,
    getClientRisqueByName
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
};
