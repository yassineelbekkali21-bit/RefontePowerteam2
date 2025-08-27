export interface MockClient {
  id: string;
  nom: string;
  gestionnaire: string;
  typeFacturation: string;
  objectifAnnuel: {
    heures: number;
    economique: number;
    tarifHoraire: number;
  };
  realiseADate: {
    heures: number;
    chiffreAffaires: number;
    pourcentageHeures: number;
    pourcentageCA: number;
    facturationMinimum: number;
  };
  ecarts: {
    heuresCumulees: number;
    economiqueCumule: number;
  };
  statut: 'suspect' | 'attention' | 'bon';
}

export interface OverviewStats {
  counts: {
    suspects: number;
    attention: number;
    sains: number;
    total: number;
  };
}

const gestionnaires = ['Mohamed', 'Julien', 'Vincent', 'Pol', 'Ingrid', 'Pierre'];
const typesFacturation = ['Forfait Mensuel', 'Forfait Annuel', 'Forfait Trimestriel', 'Mission Ponctuelle'];

const nomsEntreprises = [
  'SARL MARIN', 'TECH CORP', 'INNOV SRL', 'AGRO BELUX', 'METAL WORKS', 'STARTUP TECH',
  'DIGITAL SERVICES', 'SMART SOLUTIONS', 'FUTURE TECH', 'PREMIUM CONSULTING', 'EXCELLENCE BUSINESS',
  'INNOVATION PLUS', 'GLOBAL TRADE', 'MODERN CORP', 'DYNAMIC SRL', 'EXPERT SOLUTIONS',
  'ADVANCE TECH', 'QUALITY SERVICES', 'OPTIMAL BUSINESS', 'STRATEGIC CONSULTING'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomClient(index: number): MockClient {
  const objectifHeures = 200 + Math.random() * 800; // 200-1000h
  const tarifHoraire = 80 + Math.random() * 60; // 80-140€/h
  const objectifEconomique = objectifHeures * tarifHoraire;
  
  // Réalisé avec variabilité
  const facteurRealiseHeures = 0.3 + Math.random() * 1.2; // 30% à 150%
  const facteurRealiseCA = 0.4 + Math.random() * 1.1; // 40% à 150%
  
  const realiseHeures = objectifHeures * facteurRealiseHeures;
  const realiseCA = objectifEconomique * facteurRealiseCA;
  
  const pourcentageHeures = (realiseHeures / objectifHeures) * 100;
  const pourcentageCA = (realiseCA / objectifEconomique) * 100;
  
  // Déterminer le statut basé sur les déséquilibres
  const ecartFacturationPrestation = pourcentageCA - pourcentageHeures;
  const rentabiliteReelle = realiseHeures > 0 ? realiseCA / realiseHeures : 0;
  
  let statut: 'suspect' | 'attention' | 'bon' = 'bon';
  
  // Logique de statut
  if (Math.abs(ecartFacturationPrestation) > 25 || rentabiliteReelle < 80) {
    statut = 'suspect';
  } else if (Math.abs(ecartFacturationPrestation) > 15 || rentabiliteReelle < 90) {
    statut = 'attention';
  }
  
  return {
    id: `CLI-2024-${String(index + 1).padStart(3, '0')}`,
    nom: getRandomElement(nomsEntreprises) + ` ${index + 1}`,
    gestionnaire: getRandomElement(gestionnaires),
    typeFacturation: getRandomElement(typesFacturation),
    objectifAnnuel: {
      heures: Math.round(objectifHeures),
      economique: Math.round(objectifEconomique),
      tarifHoraire: Math.round(tarifHoraire)
    },
    realiseADate: {
      heures: Math.round(realiseHeures),
      chiffreAffaires: Math.round(realiseCA),
      pourcentageHeures: Math.round(pourcentageHeures * 10) / 10,
      pourcentageCA: Math.round(pourcentageCA * 10) / 10,
      facturationMinimum: Math.round(objectifEconomique * 0.8)
    },
    ecarts: {
      heuresCumulees: Math.round(realiseHeures - objectifHeures),
      economiqueCumule: Math.round(realiseCA - objectifEconomique)
    },
    statut
  };
}

export function generateMockClients(count: number): MockClient[] {
  const clients = [];
  
  for (let i = 0; i < count; i++) {
    clients.push(generateRandomClient(i));
  }
  
  // Assurer une distribution minimum
  const suspects = clients.filter(c => c.statut === 'suspect');
  const attention = clients.filter(c => c.statut === 'attention');
  
  // Forcer au moins 10 suspects et 15 attention si pas assez
  while (suspects.length < Math.max(10, count * 0.05)) {
    const randomIndex = Math.floor(Math.random() * count);
    if (clients[randomIndex].statut !== 'suspect') {
      clients[randomIndex].statut = 'suspect';
      suspects.push(clients[randomIndex]);
    }
  }
  
  while (attention.length < Math.max(15, count * 0.08)) {
    const randomIndex = Math.floor(Math.random() * count);
    if (clients[randomIndex].statut === 'bon') {
      clients[randomIndex].statut = 'attention';
      attention.push(clients[randomIndex]);
    }
  }
  
  return clients;
}

export function generateOverviewStats(clients: MockClient[]): OverviewStats {
  return {
    counts: {
      suspects: clients.filter(c => c.statut === 'suspect').length,
      attention: clients.filter(c => c.statut === 'attention').length,
      sains: clients.filter(c => c.statut === 'bon').length,
      total: clients.length
    }
  };
}