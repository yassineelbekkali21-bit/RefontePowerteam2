/**
 * Composant Capacity Planning Métier
 * Gestion stratégique des capacités collaborateurs avec approche métier comptable
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Filter,
  Download,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  User,
  Building,
  Award,
  Briefcase,
  Eye,
  Trash2,
  Calculator,
  TrendingDown,
  UserCheck,
  Timer,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';

// Types métier pour le Capacity Planning
interface CollaborateurMetier {
  id: string;
  nom: string;
  role: string;
  regimeHebdo: number; // heures par semaine (35h, 38h, etc.)
  congesAnnuels: number; // jours de congés
  capaciteAnnuelle: number; // heures théoriques disponibles par an
  tauxHoraire: number;
  coefficientExperience: number; // multiplicateur qualité/expérience
  couleur: string;
}

interface CasquetteCollaborateur {
  collaborateurId: string;
  dossier: string;
  casquette: 'gestionnaire' | 'encodage' | 'superviseur' | 'personnalisee';
  nomPersonnalise?: string; // nom personnalisé pour la casquette personnalisée
  heuresBudgetees: number;
  heuresRealisees: number;
  coefficientValeurAjoutee: number; // selon la prestation
  periode: string; // pour la saisonnalité
}

interface DossierClient {
  id: string;
  nom: string;
  type: string;
  heuresBudgeteesTotal: number;
  valeurAjouteeTotal: number;
  casquettes: CasquetteCollaborateur[];
  periodicite: 'mensuel' | 'trimestriel' | 'annuel';
  periodesPic: string[]; // ex: ["Mars", "Juin", "Septembre", "Décembre"]
}

interface CapaciteAnalyse {
  collaborateur: CollaborateurMetier;
  chargeActuelle: number; // % de la capacité annuelle
  chargeParCasquette: {
    gestionnaire: number;
    encodage: number;
    superviseur: number;
    personnalisee: number;
  };
  valeurAjouteeGeneree: number;
  benchmarkValeurAjoutee: string; // Benchmark relatif vs équipe
  couleurBenchmark: string; // Couleur associée au benchmark
  pointsRelatifs: number; // Points relatifs (100 = moyenne équipe)
  disponibiliteRestante: number;
  alertesSurcharge: string[]; // périodes à risque
}

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316',
  teal: '#14B8A6',
  indigo: '#6366F1'
};

// Données métier réalistes
const collaborateursMetier: CollaborateurMetier[] = [
  {
    id: '1',
    nom: 'Sophie Laurent',
    role: 'Manager Senior',
    regimeHebdo: 35,
    congesAnnuels: 25,
    capaciteAnnuelle: 1640, // (35h × 52 semaines) - (25 jours × 7h) = 1820 - 175 = 1645h
    tauxHoraire: 85,
    coefficientExperience: 1.3,
    couleur: COLORS.primary
  },
  {
    id: '2',
    nom: 'Pierre Martin',
    role: 'Comptable Senior',
    regimeHebdo: 37,
    congesAnnuels: 25,
    capaciteAnnuelle: 1749, // (37h × 52) - (25 × 7h)
    tauxHoraire: 65,
    coefficientExperience: 1.2,
    couleur: COLORS.success
  },
  {
    id: '3',
    nom: 'Marie Durand',
    role: 'Comptable',
    regimeHebdo: 35,
    congesAnnuels: 25,
    capaciteAnnuelle: 1645,
    tauxHoraire: 45,
    coefficientExperience: 1.0,
    couleur: COLORS.warning
  },
  {
    id: '4',
    nom: 'Thomas Petit',
    role: 'Assistant Comptable',
    regimeHebdo: 35,
    congesAnnuels: 25,
    capaciteAnnuelle: 1645,
    tauxHoraire: 35,
    coefficientExperience: 0.8,
    couleur: COLORS.purple
  }
];

// Nouveaux clients sans gestionnaire attribué
interface NouveauClient {
  id: string;
  nom: string;
  type: string;
  budgetHoraire: number; // heures budgétées
  budgetEconomique: number; // budget en euros
  datePriseEnCharge: string;
  urgence: 'haute' | 'moyenne' | 'faible';
  besoinsSpecifiques: string[];
  statut: 'nouveau_sans_gestionnaire';
}

const nouveauxClients: NouveauClient[] = [
  {
    id: 'NC-001',
    nom: 'Dr. Benali Hassan',
    type: 'Médecin - BNC',
    budgetHoraire: 120,
    budgetEconomique: 8500,
    datePriseEnCharge: '2025-02-01',
    urgence: 'haute',
    besoinsSpecifiques: ['TVA', 'Déclarations sociales', 'Bilan comptable'],
    statut: 'nouveau_sans_gestionnaire'
  },
  {
    id: 'NC-002', 
    nom: 'Cabinet Dentaire Sourire',
    type: 'Dentiste - SELARL',
    budgetHoraire: 95,
    budgetEconomique: 6800,
    datePriseEnCharge: '2025-02-03',
    urgence: 'moyenne',
    besoinsSpecifiques: ['Comptabilité', 'Social', 'Gestion patrimoine'],
    statut: 'nouveau_sans_gestionnaire'
  },
  {
    id: 'NC-003',
    nom: 'Pharmacie Central',
    type: 'Pharmacie - SARL',
    budgetHoraire: 150,
    budgetEconomique: 12000,
    datePriseEnCharge: '2025-01-28',
    urgence: 'haute',
    besoinsSpecifiques: ['Comptabilité complexe', 'Stock valorisation', 'Optimisation fiscale'],
    statut: 'nouveau_sans_gestionnaire'
  },
  {
    id: 'NC-004',
    nom: 'Kinésithérapeute Dubois',
    type: 'Kinésithérapeute - BNC',
    budgetHoraire: 75,
    budgetEconomique: 4200,
    datePriseEnCharge: '2025-02-05',
    urgence: 'faible',
    besoinsSpecifiques: ['Déclarations', 'Conseil fiscal'],
    statut: 'nouveau_sans_gestionnaire'
  }
];

// Gestionnaires avec capacité disponible
interface GestionnaireCapacite {
  id: string;
  nom: string;
  role: string;
  capaciteHebdomadaire: number; // heures par semaine
  capaciteUtilisee: number; // pourcentage utilisé
  capaciteRestante: number; // heures disponibles
  specialites: string[];
  nombreClientsActuels: number;
  chargeMax: number;
  tauxHoraire: number;
}

const gestionnairesDisponibles: GestionnaireCapacite[] = [
  {
    id: 'G-001',
    nom: 'Sophie Laurent',
    role: 'Manager Senior',
    capaciteHebdomadaire: 35,
    capaciteUtilisee: 75,
    capaciteRestante: 8.75, // 25% de 35h
    specialites: ['Médecins', 'Professions libérales', 'Optimisation fiscale'],
    nombreClientsActuels: 12,
    chargeMax: 15,
    tauxHoraire: 85
  },
  {
    id: 'G-002',
    nom: 'Pierre Martin',
    role: 'Comptable Senior',
    capaciteHebdomadaire: 37,
    capaciteUtilisee: 65,
    capaciteRestante: 12.95, // 35% de 37h
    specialites: ['SELARL', 'Sociétés', 'Consolidation'],
    nombreClientsActuels: 10,
    chargeMax: 14,
    tauxHoraire: 65
  },
  {
    id: 'G-003',
    nom: 'Marie Durand',
    role: 'Comptable',
    capaciteHebdomadaire: 35,
    capaciteUtilisee: 55,
    capaciteRestante: 15.75, // 45% de 35h
    specialites: ['BNC', 'TPE', 'Déclarations courantes'],
    nombreClientsActuels: 8,
    chargeMax: 12,
    tauxHoraire: 45
  },
  {
    id: 'G-004',
    nom: 'Thomas Petit',
    role: 'Assistant Comptable',
    capaciteHebdomadaire: 35,
    capaciteUtilisee: 45,
    capaciteRestante: 19.25, // 55% de 35h
    specialites: ['Saisie comptable', 'Déclarations simples', 'Suivi TPE'],
    nombreClientsActuels: 6,
    chargeMax: 10,
    tauxHoraire: 35
  }
];

// Casquettes par dossier client (données métier avec exemples de chaque niveau)
const casquettesData: CasquetteCollaborateur[] = [
  // Sophie Laurent - OPTIMAL (75-95%) = 85%
  { collaborateurId: '1', dossier: 'Dr. Martin Dubois', casquette: 'gestionnaire', heuresBudgetees: 800, heuresRealisees: 650, coefficientValeurAjoutee: 1.4, periode: 'Q1-Q4' },
  { collaborateurId: '1', dossier: 'Cabinet Dentaire Smile', casquette: 'gestionnaire', heuresBudgetees: 600, heuresRealisees: 500, coefficientValeurAjoutee: 1.3, periode: 'Q1-Q4' },
  { collaborateurId: '1', dossier: 'Productions Créatives SARL', casquette: 'superviseur', heuresBudgetees: 50, heuresRealisees: 40, coefficientValeurAjoutee: 1.5, periode: 'Q1-Q4' },
  
  // Pierre Martin - SURCHARGE (>95%) = 98%
  { collaborateurId: '2', dossier: 'Cabinet Dentaire Smile', casquette: 'gestionnaire', heuresBudgetees: 900, heuresRealisees: 850, coefficientValeurAjoutee: 1.3, periode: 'Q1-Q4' },
  { collaborateurId: '2', dossier: 'Kiné Plus Rééducation', casquette: 'gestionnaire', heuresBudgetees: 700, heuresRealisees: 620, coefficientValeurAjoutee: 1.2, periode: 'Q1-Q4' },
  { collaborateurId: '2', dossier: 'Artiste Léa Moreau', casquette: 'gestionnaire', heuresBudgetees: 150, heuresRealisees: 130, coefficientValeurAjoutee: 1.1, periode: 'Q1-Q4' },
  
  // Marie Durand - MOYEN (65-75%) = 70%
  { collaborateurId: '3', dossier: 'Productions Créatives SARL', casquette: 'gestionnaire', heuresBudgetees: 800, heuresRealisees: 750, coefficientValeurAjoutee: 1.1, periode: 'Q1-Q4' },
  { collaborateurId: '3', dossier: 'Dr. Martin Dubois', casquette: 'encodage', heuresBudgetees: 350, heuresRealisees: 320, coefficientValeurAjoutee: 0.9, periode: 'Q1-Q4' },
  
  // Thomas Petit - BAS (0-65%) = 50%
  { collaborateurId: '4', dossier: 'Cabinet Dentaire Smile', casquette: 'encodage', heuresBudgetees: 400, heuresRealisees: 380, coefficientValeurAjoutee: 0.8, periode: 'Q1-Q4' },
  { collaborateurId: '4', dossier: 'Kiné Plus Rééducation', casquette: 'encodage', heuresBudgetees: 350, heuresRealisees: 340, coefficientValeurAjoutee: 0.8, periode: 'Q1-Q4' },
  { collaborateurId: '4', dossier: 'Productions Créatives SARL', casquette: 'encodage', heuresBudgetees: 100, heuresRealisees: 95, coefficientValeurAjoutee: 0.8, periode: 'Q1-Q4' },
  
  // Casquettes personnalisées - Exemples
  { collaborateurId: '1', dossier: 'Formation & Développement', casquette: 'personnalisee', nomPersonnalise: 'Formation', heuresBudgetees: 120, heuresRealisees: 100, coefficientValeurAjoutee: 1.2, periode: 'Q1-Q4' },
  { collaborateurId: '2', dossier: 'Support Technique', casquette: 'personnalisee', nomPersonnalise: 'Support IT', heuresBudgetees: 80, heuresRealisees: 75, coefficientValeurAjoutee: 1.0, periode: 'Q1-Q4' },
  { collaborateurId: '3', dossier: 'Relation Client', casquette: 'personnalisee', nomPersonnalise: 'Commercial', heuresBudgetees: 200, heuresRealisees: 180, coefficientValeurAjoutee: 1.3, periode: 'Q1-Q4' },
  { collaborateurId: '4', dossier: 'Administration', casquette: 'personnalisee', nomPersonnalise: 'Admin', heuresBudgetees: 150, heuresRealisees: 140, coefficientValeurAjoutee: 0.9, periode: 'Q1-Q4' }
];

const dossiersClients: DossierClient[] = [
  {
    id: '1',
    nom: 'Dr. Martin Dubois',
    type: 'Médecin - BNC',
    heuresBudgeteesTotal: 120,
    valeurAjouteeTotal: 0,
    casquettes: casquettesData.filter(c => c.dossier === 'Dr. Martin Dubois'),
    periodicite: 'trimestriel',
    periodesPic: ['Mars', 'Juin', 'Septembre', 'Décembre']
  },
  {
    id: '2',
    nom: 'Cabinet Dentaire Smile',
    type: 'Dentiste - SELARL',
    heuresBudgeteesTotal: 93,
    valeurAjouteeTotal: 0,
    casquettes: casquettesData.filter(c => c.dossier === 'Cabinet Dentaire Smile'),
    periodicite: 'mensuel',
    periodesPic: ['Janvier', 'Avril', 'Juillet', 'Octobre']
  },
  {
    id: '3',
    nom: 'Kiné Plus Rééducation',
    type: 'Kinésithérapeute - SARL',
    heuresBudgeteesTotal: 95,
    valeurAjouteeTotal: 0,
    casquettes: casquettesData.filter(c => c.dossier === 'Kiné Plus Rééducation'),
    periodicite: 'trimestriel',
    periodesPic: ['Mars', 'Juin', 'Septembre', 'Décembre']
  },
  {
    id: '4',
    nom: 'Productions Créatives SARL',
    type: 'Production Audiovisuelle',
    heuresBudgeteesTotal: 192,
    valeurAjouteeTotal: 0,
    casquettes: casquettesData.filter(c => c.dossier === 'Productions Créatives SARL'),
    periodicite: 'annuel',
    periodesPic: ['Février', 'Mai']
  },
  {
    id: '5',
    nom: 'Artiste Léa Moreau',
    type: 'Artiste - BNC',
    heuresBudgeteesTotal: 65,
    valeurAjouteeTotal: 0,
    casquettes: casquettesData.filter(c => c.dossier === 'Artiste Léa Moreau'),
    periodicite: 'annuel',
    periodesPic: ['Mai']
  }
];

// Calcul de la valeur ajoutée pour chaque dossier
dossiersClients.forEach(dossier => {
  dossier.valeurAjouteeTotal = dossier.casquettes.reduce((sum, casquette) => 
    sum + (casquette.heuresRealisees * casquette.coefficientValeurAjoutee), 0
  );
});

export default function CapacityPlanning() {
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState('annuel');
  const [clientsEnAttente, setClientsEnAttente] = useState<NouveauClient[]>(nouveauxClients);
  const [attributionEnCours, setAttributionEnCours] = useState<{clientId: string, gestionnaireId: string} | null>(null);
  const [collaborateurFiltre, setCollaborateurFiltre] = useState('all');
  const [vueActive, setVueActive] = useState<'capacites' | 'attribution'>('capacites');
  const [sidebarOuverte, setSidebarOuverte] = useState(false);
  const [collaborateurSelectionne, setCollaborateurSelectionne] = useState<CollaborateurMetier | null>(null);
  const [modalEditionOuverte, setModalEditionOuverte] = useState(false);

  // Fonction pour attribuer un client à un gestionnaire
  const handleAttribution = (clientId: string, gestionnaireId: string) => {
    const client = clientsEnAttente.find(c => c.id === clientId);
    const gestionnaire = gestionnairesDisponibles.find(g => g.id === gestionnaireId);
    
    if (client && gestionnaire) {
      // Vérifier si le gestionnaire a la capacité
      const heuresNecessairesParSemaine = client.budgetHoraire / 52; // répartition annuelle
      
      if (heuresNecessairesParSemaine <= gestionnaire.capaciteRestante) {
        // Effectuer l'attribution
        setClientsEnAttente(prev => prev.filter(c => c.id !== clientId));
        
        alert(`✅ Attribution réussie !

👤 Client: ${client.nom}
🏷️ Type: ${client.type}  
⏰ Budget: ${client.budgetHoraire}h (${heuresNecessairesParSemaine.toFixed(1)}h/semaine)
💰 Valeur: ${client.budgetEconomique.toLocaleString()}€

👨‍💼 Gestionnaire: ${gestionnaire.nom}
📊 Capacité restante: ${gestionnaire.capaciteRestante.toFixed(1)}h/semaine
📧 Notification envoyée automatiquement`);
      } else {
        alert(`❌ Attribution impossible !

⚠️ Capacité insuffisante:
- Nécessaire: ${heuresNecessairesParSemaine.toFixed(1)}h/semaine
- Disponible: ${gestionnaire.capaciteRestante.toFixed(1)}h/semaine

💡 Suggestion: Choisir un gestionnaire avec plus de capacité disponible`);
      }
    }
  };

  // Fonction pour calculer la compatibilité
  const getCompatibiliteScore = (client: NouveauClient, gestionnaire: GestionnaireCapacite): number => {
    let score = 0;
    
    // Vérifier les spécialités correspondantes
    const typeClient = client.type.toLowerCase();
    const specialitesGestionnaire = gestionnaire.specialites.map(s => s.toLowerCase());
    
    if (typeClient.includes('médecin') && specialitesGestionnaire.some(s => s.includes('médecin'))) score += 40;
    if (typeClient.includes('dentiste') && specialitesGestionnaire.some(s => s.includes('selarl'))) score += 40;
    if (typeClient.includes('bnc') && specialitesGestionnaire.some(s => s.includes('bnc'))) score += 30;
    if (typeClient.includes('sarl') && specialitesGestionnaire.some(s => s.includes('sociétés') || s.includes('sarl'))) score += 30;
    
    // Capacité disponible
    const heuresNecessaires = client.budgetHoraire / 52;
    if (heuresNecessaires <= gestionnaire.capaciteRestante) score += 20;
    else if (heuresNecessaires <= gestionnaire.capaciteRestante * 1.2) score += 10;
    
    // Charge actuelle vs max
    const ratioCharge = gestionnaire.nombreClientsActuels / gestionnaire.chargeMax;
    if (ratioCharge < 0.8) score += 10;
    else if (ratioCharge < 0.9) score += 5;
    
    return Math.min(score, 100);
  };
  const [casquetteEnEdition, setCasquetteEnEdition] = useState<CasquetteCollaborateur | null>(null);

  // Analyses métier des capacités
  const analysesCapacites = useMemo(() => {
    // Première passe : calcul des données brutes
    const analyses: (CapaciteAnalyse & { valeurAjouteeBrute: number })[] = collaborateursMetier.map(collaborateur => {
      const casquettesCollaborateur = casquettesData.filter(c => c.collaborateurId === collaborateur.id);
      
      const heuresBudgeteesTotales = casquettesCollaborateur.reduce((sum, c) => sum + c.heuresBudgetees, 0);
      const heuresRealiseesTotales = casquettesCollaborateur.reduce((sum, c) => sum + c.heuresRealisees, 0);
      
      const chargeActuelle = Math.round((heuresBudgeteesTotales / collaborateur.capaciteAnnuelle) * 100);
      
      const chargeParCasquette = {
        gestionnaire: casquettesCollaborateur
          .filter(c => c.casquette === 'gestionnaire')
          .reduce((sum, c) => sum + c.heuresBudgetees, 0),
        encodage: casquettesCollaborateur
          .filter(c => c.casquette === 'encodage')
          .reduce((sum, c) => sum + c.heuresBudgetees, 0),
        superviseur: casquettesCollaborateur
          .filter(c => c.casquette === 'superviseur')
          .reduce((sum, c) => sum + c.heuresBudgetees, 0),
        personnalisee: casquettesCollaborateur
          .filter(c => c.casquette === 'personnalisee')
          .reduce((sum, c) => sum + c.heuresBudgetees, 0)
      };
      
      const valeurAjouteeBrute = casquettesCollaborateur.reduce((sum, c) => 
        sum + (c.heuresRealisees * c.coefficientValeurAjoutee * collaborateur.coefficientExperience), 0
      );
      
      const disponibiliteRestante = collaborateur.capaciteAnnuelle - heuresBudgeteesTotales;
      
      const alertesSurcharge = chargeActuelle > 95 ? ['Surcharge détectée'] : 
                             chargeActuelle > 85 ? ['Vigilance requise'] : [];

      return {
        collaborateur,
        chargeActuelle,
        chargeParCasquette,
        valeurAjouteeGeneree: Math.round(valeurAjouteeBrute),
        valeurAjouteeBrute,
        disponibiliteRestante,
        alertesSurcharge
      };
    });

    // Calcul des benchmarks de valeur ajoutée
    const valeursAjoutees = analyses.map(a => a.valeurAjouteeBrute).filter(v => v > 0);
    const valeurMoyenne = valeursAjoutees.length > 0 ? valeursAjoutees.reduce((sum, v) => sum + v, 0) / valeursAjoutees.length : 0;
    const valeurMax = valeursAjoutees.length > 0 ? Math.max(...valeursAjoutees) : 0;
    
    // Deuxième passe : attribution des benchmarks avec points relatifs
    const analysesAvecBenchmark = analyses.map(analyse => {
      let benchmarkValeurAjoutee = 'Non évalué';
      let couleurBenchmark = 'gray';
      let pointsRelatifs = 0;
      
      if (analyse.valeurAjouteeBrute > 0 && valeurMoyenne > 0) {
        // Calcul des points relatifs (100 = moyenne)
        pointsRelatifs = Math.round((analyse.valeurAjouteeBrute / valeurMoyenne) * 100);
        
        const ratioVsMoyenne = analyse.valeurAjouteeBrute / valeurMoyenne;
        const ratioVsMax = valeurMax > 0 ? analyse.valeurAjouteeBrute / valeurMax : 0;
        
        if (ratioVsMax >= 0.9) {
          benchmarkValeurAjoutee = `Top Performer 🏆 (${pointsRelatifs}pts)`;
          couleurBenchmark = 'green';
        } else if (ratioVsMoyenne >= 1.2) {
          benchmarkValeurAjoutee = `Au-dessus moyenne ⬆️ (${pointsRelatifs}pts)`;
          couleurBenchmark = 'blue';
        } else if (ratioVsMoyenne >= 0.8) {
          benchmarkValeurAjoutee = `Dans la moyenne ➡️ (${pointsRelatifs}pts)`;
          couleurBenchmark = 'yellow';
        } else {
          benchmarkValeurAjoutee = `En-dessous moyenne ⬇️ (${pointsRelatifs}pts)`;
          couleurBenchmark = 'orange';
        }
      }

      return {
        collaborateur: analyse.collaborateur,
        chargeActuelle: analyse.chargeActuelle,
        chargeParCasquette: analyse.chargeParCasquette,
        valeurAjouteeGeneree: analyse.valeurAjouteeGeneree,
        benchmarkValeurAjoutee,
        couleurBenchmark,
        pointsRelatifs,
        disponibiliteRestante: analyse.disponibiliteRestante,
        alertesSurcharge: analyse.alertesSurcharge
      };
    });

    const capaciteTotaleEquipe = collaborateursMetier.reduce((sum, c) => sum + c.capaciteAnnuelle, 0);
    const heuresBudgeteesTotales = casquettesData.reduce((sum, c) => sum + c.heuresBudgetees, 0);
    const tauxUtilisationGlobal = Math.round((heuresBudgeteesTotales / capaciteTotaleEquipe) * 100);
    const valeurAjouteeGlobale = analysesAvecBenchmark.reduce((sum, a) => sum + a.valeurAjouteeGeneree, 0);

    return {
      analyses: analysesAvecBenchmark,
      capaciteTotaleEquipe,
      heuresBudgeteesTotales,
      tauxUtilisationGlobal,
      valeurAjouteeGlobale,
      collaborateursEnSurcharge: analysesAvecBenchmark.filter(a => a.chargeActuelle > 95).length
    };
  }, []);

  // Données pour les graphiques métier
  const donneesCapaciteCollaborateurs = analysesCapacites.analyses.map(analyse => ({
    nom: analyse.collaborateur.nom.split(' ')[0],
    capaciteAnnuelle: analyse.collaborateur.capaciteAnnuelle,
    heuresBudgetees: analyse.chargeParCasquette.gestionnaire + analyse.chargeParCasquette.encodage + analyse.chargeParCasquette.superviseur + analyse.chargeParCasquette.personnalisee,
    disponibilite: analyse.disponibiliteRestante,
    tauxCharge: analyse.chargeActuelle,
    valeurAjoutee: analyse.valeurAjouteeGeneree,
    couleur: analyse.collaborateur.couleur,
    gestionnaire: analyse.chargeParCasquette.gestionnaire,
    encodage: analyse.chargeParCasquette.encodage,
    superviseur: analyse.chargeParCasquette.superviseur,
    personnalisee: analyse.chargeParCasquette.personnalisee
  }));

  const donneesValeurAjouteeClients = dossiersClients.map(dossier => ({
    nom: dossier.nom.split(' ')[0] + (dossier.nom.includes('Dr.') ? ' ' + dossier.nom.split(' ')[1] : ''),
    valeurAjoutee: Math.round(dossier.valeurAjouteeTotal),
    heuresBudgetees: dossier.heuresBudgeteesTotal,
    type: dossier.type,
    rentabilite: Math.round(dossier.valeurAjouteeTotal / dossier.heuresBudgeteesTotal * 100) / 100
  }));

  const getCasquetteColor = (casquette: string) => {
    switch (casquette) {
      case 'gestionnaire': return COLORS.primary;
      case 'encodage': return COLORS.success;
      case 'superviseur': return COLORS.warning;
      case 'personnalisee': return COLORS.purple;
      default: return COLORS.teal;
    }
  };

  const getCasquetteIcon = (casquette: string) => {
    switch (casquette) {
      case 'gestionnaire': return <Briefcase className="w-4 h-4" />;
      case 'encodage': return <Calculator className="w-4 h-4" />;
      case 'superviseur': return <Eye className="w-4 h-4" />;
      case 'personnalisee': return <Settings className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  // Fonction pour ouvrir la sidebar saisonnalité
  const ouvrirSidebarSaisonnalite = (collaborateur: CollaborateurMetier) => {
    setCollaborateurSelectionne(collaborateur);
    setSidebarOuverte(true);
  };

  // Fonction pour ouvrir la modal d'édition
  const ouvrirModalEdition = (collaborateurId: string, casquette?: CasquetteCollaborateur) => {
    if (casquette) {
      setCasquetteEnEdition(casquette);
    } else {
      // Créer une nouvelle casquette personnalisée
      setCasquetteEnEdition({
        collaborateurId,
        dossier: 'Nouvelle Tâche',
        casquette: 'personnalisee',
        nomPersonnalise: '',
        heuresBudgetees: 0,
        heuresRealisees: 0,
        coefficientValeurAjoutee: 1.0,
        periode: 'Q1-Q4'
      });
    }
    setModalEditionOuverte(true);
  };

  // Fonction pour sauvegarder les modifications
  const sauvegarderCasquette = (casquetteModifiee: CasquetteCollaborateur) => {
    // Dans un vrai projet, ceci ferait un appel API
    // Ici, on simule la mise à jour des données
    const index = casquettesData.findIndex(c => 
      c.collaborateurId === casquetteModifiee.collaborateurId && 
      c.dossier === casquetteModifiee.dossier &&
      c.casquette === casquetteModifiee.casquette
    );
    
    if (index >= 0) {
      casquettesData[index] = casquetteModifiee;
    } else {
      casquettesData.push(casquetteModifiee);
    }
    
    setModalEditionOuverte(false);
    setCasquetteEnEdition(null);
    // Forcer le re-render en modifiant un state
    setCollaborateurFiltre(prev => prev);
  };

  // Fonction pour supprimer une casquette
  const supprimerCasquette = (casquetteASupprimer: CasquetteCollaborateur) => {
    // Dans un vrai projet, ceci ferait un appel API
    // Ici, on simule la suppression des données
    const index = casquettesData.findIndex(c => 
      c.collaborateurId === casquetteASupprimer.collaborateurId && 
      c.dossier === casquetteASupprimer.dossier &&
      c.casquette === casquetteASupprimer.casquette
    );
    
    if (index >= 0) {
      casquettesData.splice(index, 1);
    }
    
    setModalEditionOuverte(false);
    setCasquetteEnEdition(null);
    // Forcer le re-render en modifiant un state
    setCollaborateurFiltre(prev => prev);
  };

  // Génération des données saisonnières par collaborateur
  const getDonneesSaisonnieres = (collaborateur: CollaborateurMetier) => {
    const casquettesCollaborateur = casquettesData.filter(c => c.collaborateurId === collaborateur.id);
    const dossiersCollaborateur = dossiersClients.filter(d => 
      d.casquettes.some(c => c.collaborateurId === collaborateur.id)
    );

    // Simulation de données saisonnières par trimestre
    const trimestres = ['Q1', 'Q2', 'Q3', 'Q4'];
    const donneesTrimestrielles = trimestres.map(trimestre => {
      // Calcul de la charge par trimestre basé sur les périodes de pic des clients
      let chargeTrimestrielle = 0;
      dossiersCollaborateur.forEach(dossier => {
        const casquettesDuDossier = dossier.casquettes.filter(c => c.collaborateurId === collaborateur.id);
        const heuresParTrimestre = casquettesDuDossier.reduce((sum, c) => sum + c.heuresBudgetees, 0) / 4;
        
        // Augmentation si c'est une période de pic pour ce client
        const estPeriodePic = dossier.periodesPic.some(periode => {
          if (trimestre === 'Q1') return ['Janvier', 'Février', 'Mars'].includes(periode);
          if (trimestre === 'Q2') return ['Avril', 'Mai', 'Juin'].includes(periode);
          if (trimestre === 'Q3') return ['Juillet', 'Août', 'Septembre'].includes(periode);
          if (trimestre === 'Q4') return ['Octobre', 'Novembre', 'Décembre'].includes(periode);
          return false;
        });
        
        chargeTrimestrielle += estPeriodePic ? heuresParTrimestre * 1.5 : heuresParTrimestre;
      });

      const pourcentageCharge = Math.round((chargeTrimestrielle / (collaborateur.capaciteAnnuelle / 4)) * 100);
      
      return {
        trimestre,
        heures: Math.round(chargeTrimestrielle),
        pourcentage: Math.min(pourcentageCharge, 100), // Cap à 100%
        statut: pourcentageCharge > 90 ? 'critique' : pourcentageCharge > 70 ? 'elevee' : 'normale'
      };
    });

    return donneesTrimestrielles;
  };

  return (
    <div className="space-y-6">
      {/* Header avec métriques métier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Capacité Équipe</p>
                <p className="text-2xl font-bold text-blue-800">{analysesCapacites.capaciteTotaleEquipe}h</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Annuel disponible
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 ring-2 ring-green-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-lg font-semibold text-green-700 mb-2">📊 Utilisation Globale</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-green-800">{analysesCapacites.tauxUtilisationGlobal}</p>
                  <span className="text-3xl font-bold text-green-700">%</span>
                </div>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  {analysesCapacites.heuresBudgeteesTotales}h budgétées / {analysesCapacites.capaciteTotaleEquipe}h disponibles
                </p>
              </div>
              <div className="p-4 bg-green-500 rounded-full shadow-md">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Progress 
                value={analysesCapacites.tauxUtilisationGlobal} 
                className="h-4 bg-green-100" 
              />
              <div className="flex justify-between text-xs font-medium text-green-700">
                <span>0%</span>
                <span className="bg-green-200 px-2 py-1 rounded">
                  {analysesCapacites.tauxUtilisationGlobal}% - Charge Actuelle
                </span>
                <span>100%</span>
              </div>
              
              {/* Indicateur de santé */}
              <div className="flex items-center gap-2 mt-3">
                {analysesCapacites.tauxUtilisationGlobal < 65 ? (
                  <>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700">Charge basse</span>
                  </>
                ) : analysesCapacites.tauxUtilisationGlobal < 75 ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-700">Charge moyenne</span>
                  </>
                ) : analysesCapacites.tauxUtilisationGlobal < 95 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Charge optimale</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">Surcharge critique</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Performance Équipe</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-purple-800">100</p>
                  <span className="text-lg font-semibold text-purple-600">pts</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-2">
              Référence moyenne équipe
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Surcharges</p>
                <p className="text-2xl font-bold text-orange-800">{analysesCapacites.collaborateursEnSurcharge}</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-orange-600 mt-2">
              Collaborateurs &gt; 95%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation des vues métier */}
      <Tabs value={vueActive} onValueChange={(value) => setVueActive(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="capacites" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Capacités & Casquettes
          </TabsTrigger>
          <TabsTrigger value="attribution" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Attribution
          </TabsTrigger>
        </TabsList>

        {/* Onglet Capacités - Vue principale */}
        <TabsContent value="capacites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique Capacité vs Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Capacité vs Heures Budgétées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={donneesCapaciteCollaborateurs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}h`,
                        name === 'capaciteAnnuelle' ? 'Capacité annuelle' : 
                        name === 'heuresBudgetees' ? 'Heures budgétées' : 'Disponibilité'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="capaciteAnnuelle" fill="#E5E7EB" name="Capacité annuelle" />
                    <Bar dataKey="heuresBudgetees" fill="#3B82F6" name="Heures budgétées" />
                    <Line type="monotone" dataKey="tauxCharge" stroke="#EF4444" name="% Charge" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Valeur ajoutée par client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Valeur Ajoutée par Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donneesValeurAjouteeClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'rentabilite' ? `${value}` : `${value}`,
                        name === 'valeurAjoutee' ? 'Valeur ajoutée' : 
                        name === 'heuresBudgetees' ? 'Heures budgétées' : 'Rentabilité'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="valeurAjoutee" fill="#8B5CF6" name="Valeur ajoutée" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Analyse détaillée par collaborateur avec casquettes intégrées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Analyse Détaillée par Collaborateur & Casquettes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysesCapacites.analyses.map(analyse => {
                  const totalHeures = analyse.chargeParCasquette.gestionnaire + analyse.chargeParCasquette.encodage + analyse.chargeParCasquette.superviseur + analyse.chargeParCasquette.personnalisee;
                  const pourcentageGestionnaire = totalHeures > 0 ? (analyse.chargeParCasquette.gestionnaire / analyse.collaborateur.capaciteAnnuelle) * 100 : 0;
                  const pourcentageEncodage = totalHeures > 0 ? (analyse.chargeParCasquette.encodage / analyse.collaborateur.capaciteAnnuelle) * 100 : 0;
                  const pourcentageSuperviseur = totalHeures > 0 ? (analyse.chargeParCasquette.superviseur / analyse.collaborateur.capaciteAnnuelle) * 100 : 0;
                  const pourcentagePersonnalisee = totalHeures > 0 ? (analyse.chargeParCasquette.personnalisee / analyse.collaborateur.capaciteAnnuelle) * 100 : 0;
                  
                  // Récupérer les noms personnalisés des casquettes pour ce collaborateur
                  const casquettesPersonnalisees = casquettesData.filter(c => c.collaborateurId === analyse.collaborateur.id && c.casquette === 'personnalisee');
                  const nomsPersonnalises = casquettesPersonnalisees.map(c => c.nomPersonnalise).filter(Boolean).join(', ');
                  
                  return (
                    <div key={analyse.collaborateur.id} className="p-6 border rounded-lg hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-gray-50 to-white cursor-pointer group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: analyse.collaborateur.couleur }}
                          >
                            {analyse.collaborateur.nom.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                                {analyse.collaborateur.nom}
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  ouvrirSidebarSaisonnalite(analyse.collaborateur);
                                }}
                                className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Calendar className="w-4 h-4" />
                                Saisonnalité
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">{analyse.collaborateur.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl font-black text-gray-800">
                                {analyse.chargeActuelle}%
                              </span>
                              <Badge 
                                variant={analyse.chargeActuelle > 95 ? "destructive" : 
                                        analyse.chargeActuelle >= 75 ? "default" : 
                                        analyse.chargeActuelle >= 65 ? "secondary" : "outline"}
                                className="text-xs font-bold px-3 py-1"
                              >
                                {analyse.chargeActuelle > 95 ? "🔴 SURCHARGE" : 
                                 analyse.chargeActuelle >= 75 ? "🟢 OPTIMAL" : 
                                 analyse.chargeActuelle >= 65 ? "🟡 MOYEN" : "🔵 BAS"}
                              </Badge>
                            </div>
                          </div>
                          
                          {analyse.chargeActuelle > 95 && (
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Barre de progression segmentée par casquettes */}
                      <div className="mb-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Répartition par casquette</span>
                        </div>
                        
                        {/* Barre de progression multi-couleurs */}
                        <div className="relative">
                          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full flex">
                              {/* Gestionnaire - Bleu */}
                              <div 
                                className="bg-blue-500 h-full transition-all duration-500 ease-in-out"
                                style={{ width: `${pourcentageGestionnaire}%` }}
                              ></div>
                              {/* Encodage - Vert */}
                              <div 
                                className="bg-green-500 h-full transition-all duration-500 ease-in-out"
                                style={{ width: `${pourcentageEncodage}%` }}
                              ></div>
                              {/* Superviseur - Orange */}
                              <div 
                                className="bg-orange-500 h-full transition-all duration-500 ease-in-out"
                                style={{ width: `${pourcentageSuperviseur}%` }}
                              ></div>
                              {/* Personnalisée - Violet */}
                              <div 
                                className="bg-purple-500 h-full transition-all duration-500 ease-in-out"
                                style={{ width: `${pourcentagePersonnalisee}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Légende simplifiée */}
                          <div className="flex justify-center gap-4 mt-3 text-sm flex-wrap">
                            {analyse.chargeParCasquette.gestionnaire > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">GD {analyse.chargeParCasquette.gestionnaire}h</span>
                              </div>
                            )}
                            {analyse.chargeParCasquette.encodage > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">GE {analyse.chargeParCasquette.encodage}h</span>
                              </div>
                            )}
                            {analyse.chargeParCasquette.superviseur > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="font-medium">SUP {analyse.chargeParCasquette.superviseur}h</span>
                              </div>
                            )}
                            {analyse.chargeParCasquette.personnalisee > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="font-medium" title={nomsPersonnalises}>
                                  {nomsPersonnalises || 'PERSO'} {analyse.chargeParCasquette.personnalisee}h
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const casquettePersonnalisee = casquettesPersonnalisees[0];
                                    ouvrirModalEdition(analyse.collaborateur.id, casquettePersonnalisee);
                                  }}
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Settings className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Métriques supplémentaires */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-gray-600 mb-1 font-medium">Capacité annuelle:</p>
                          <p className="font-bold text-lg">{analyse.collaborateur.capaciteAnnuelle}h</p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1 font-medium">Disponibilité:</p>
                          <p className={`font-bold text-lg ${analyse.disponibiliteRestante < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {analyse.disponibiliteRestante > 0 ? '+' : ''}{analyse.disponibiliteRestante}h
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1 font-medium">Performance:</p>
                          <div className={`font-bold text-sm px-3 py-1 rounded-full border-2 ${
                            analyse.couleurBenchmark === 'green' ? 'bg-green-100 text-green-800 border-green-300' :
                            analyse.couleurBenchmark === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            analyse.couleurBenchmark === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            analyse.couleurBenchmark === 'orange' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                            'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {analyse.benchmarkValeurAjoutee}
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1 font-medium">Coefficient exp.:</p>
                          <p className="font-bold text-lg text-indigo-600">×{analyse.collaborateur.coefficientExperience}</p>
                        </div>
                      </div>

                      {/* Bouton d'ajout de casquette personnalisée */}
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            ouvrirModalEdition(analyse.collaborateur.id);
                          }}
                          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Settings className="w-4 h-4" />
                          Ajouter une casquette
                        </Button>
                      </div>

                      {analyse.alertesSurcharge.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-500 flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">
                            ⚠️ {analyse.alertesSurcharge.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>





        {/* Onglet Attribution - Simulateur nouveau client */}
        <TabsContent value="attribution" className="space-y-6">
          {/* Section Nouveaux Clients sans Gestionnaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Nouveaux Clients sans Gestionnaire ({clientsEnAttente.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientsEnAttente.map((client) => (
                  <div key={client.id} className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{client.nom}</h3>
                        <p className="text-sm text-gray-600">{client.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          client.urgence === 'haute' ? 'bg-red-100 text-red-700' :
                          client.urgence === 'moyenne' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {client.urgence.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {client.statut.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Budget Horaire</p>
                        <p className="text-lg font-bold text-blue-600">{client.budgetHoraire}h</p>
                        <p className="text-xs text-gray-500">{(client.budgetHoraire / 52).toFixed(1)}h/semaine</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Budget Économique</p>
                        <p className="text-lg font-bold text-green-600">{client.budgetEconomique.toLocaleString()}€</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Prise en Charge</p>
                        <p className="text-sm font-medium">{new Date(client.datePriseEnCharge).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Délai restant</p>
                        <p className="text-sm font-medium text-orange-600">
                          {Math.ceil((new Date(client.datePriseEnCharge).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Besoins spécifiques :</p>
                      <div className="flex flex-wrap gap-2">
                        {client.besoinsSpecifiques.map((besoin, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {besoin}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recommandations de gestionnaires */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Gestionnaires Recommandés :</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {gestionnairesDisponibles
                          .map(gestionnaire => ({
                            gestionnaire,
                            score: getCompatibiliteScore(client, gestionnaire)
                          }))
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 4)
                          .map(({ gestionnaire, score }) => (
                            <div key={gestionnaire.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium text-gray-900">{gestionnaire.nom}</p>
                                  <p className="text-xs text-gray-600">{gestionnaire.role}</p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-bold ${
                                    score >= 80 ? 'text-green-600' :
                                    score >= 60 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {score}% compatible
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 text-xs text-gray-600 mb-3">
                                <div className="flex justify-between">
                                  <span>Capacité restante:</span>
                                  <span className="font-medium">{gestionnaire.capaciteRestante.toFixed(1)}h/semaine</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Charge actuelle:</span>
                                  <span className="font-medium">{gestionnaire.nombreClientsActuels}/{gestionnaire.chargeMax} clients</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Taux horaire:</span>
                                  <span className="font-medium">{gestionnaire.tauxHoraire}€/h</span>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs text-gray-600 mb-1">Spécialités :</p>
                                <div className="flex flex-wrap gap-1">
                                  {gestionnaire.specialites.slice(0, 2).map((spec, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => handleAttribution(client.id, gestionnaire.id)}
                                disabled={(client.budgetHoraire / 52) > gestionnaire.capaciteRestante}
                              >
                                {(client.budgetHoraire / 52) > gestionnaire.capaciteRestante ? 
                                  'Capacité insuffisante' : 
                                  'Attribuer ce client'
                                }
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}

                {clientsEnAttente.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun nouveau client en attente</p>
                    <p className="text-sm">Tous les clients ont été attribués à un gestionnaire</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section Gestionnaires Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestionnaires Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gestionnairesDisponibles.map((gestionnaire) => (
                  <div key={gestionnaire.id} className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{gestionnaire.nom}</h4>
                        <p className="text-xs text-gray-600">{gestionnaire.role}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        gestionnaire.capaciteUtilisee < 70 ? 'bg-green-500' :
                        gestionnaire.capaciteUtilisee < 85 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Utilisation</span>
                          <span>{gestionnaire.capaciteUtilisee}%</span>
                        </div>
                        <Progress value={gestionnaire.capaciteUtilisee} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Disponible</p>
                          <p className="font-medium">{gestionnaire.capaciteRestante.toFixed(1)}h/sem</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Clients</p>
                          <p className="font-medium">{gestionnaire.nombreClientsActuels}/{gestionnaire.chargeMax}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">Spécialités</p>
                        <div className="flex flex-wrap gap-1">
                          {gestionnaire.specialites.slice(0, 2).map((spec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sidebar Saisonnalité Contextuelle */}
      {sidebarOuverte && collaborateurSelectionne && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOuverte(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              {/* Header de la sidebar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    style={{ backgroundColor: collaborateurSelectionne.couleur }}
                  >
                    {collaborateurSelectionne.nom.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{collaborateurSelectionne.nom}</h3>
                    <p className="text-sm text-gray-600">Analyse Saisonnière</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOuverte(false)}
                  className="rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* Contenu saisonnalité */}
              <div className="space-y-6">
                {/* Vue d'ensemble annuelle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Répartition Annuelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getDonneesSaisonnieres(collaborateurSelectionne).map(trimestre => (
                        <div key={trimestre.trimestre} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              trimestre.statut === 'critique' ? 'bg-red-500' :
                              trimestre.statut === 'elevee' ? 'bg-orange-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <p className="font-medium">{trimestre.trimestre}</p>
                              <p className="text-sm text-gray-600">{trimestre.heures}h budgétées</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{trimestre.pourcentage}%</p>
                            <Badge 
                              variant={trimestre.statut === 'critique' ? "destructive" : 
                                      trimestre.statut === 'elevee' ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {trimestre.statut === 'critique' ? 'CRITIQUE' : 
                               trimestre.statut === 'elevee' ? 'ÉLEVÉE' : 'NORMALE'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Graphique saisonnier */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Évolution Trimestrielle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={getDonneesSaisonnieres(collaborateurSelectionne)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="trimestre" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value}%`,
                            'Charge trimestrielle'
                          ]}
                        />
                        <Bar 
                          dataKey="pourcentage" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>



                {/* Recommandations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {getDonneesSaisonnieres(collaborateurSelectionne).some(t => t.statut === 'critique') ? (
                        <div className="p-2 bg-red-50 text-red-700 rounded flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Attention aux surcharges en période de pic</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-green-50 text-green-700 rounded flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Charge bien répartie sur l'année</span>
                        </div>
                      )}
                      
                      <div className="p-2 bg-blue-50 text-blue-700 rounded">
                        <p className="font-medium mb-1">💡 Optimisations possibles :</p>
                        <ul className="text-xs space-y-1 ml-4">
                          <li>• Anticiper les périodes de pic</li>
                          <li>• Répartir les tâches non-urgentes</li>
                          <li>• Planifier les congés hors périodes critiques</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des casquettes personnalisées */}
      {modalEditionOuverte && casquetteEnEdition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalEditionOuverte(false)}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-2xl w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">
                  {casquetteEnEdition.nomPersonnalise ? 'Modifier' : 'Ajouter'} Casquette Personnalisée
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalEditionOuverte(false)}
                  className="rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom de la casquette</label>
                  <input
                    type="text"
                    value={casquetteEnEdition.nomPersonnalise || ''}
                    onChange={(e) => setCasquetteEnEdition({
                      ...casquetteEnEdition,
                      nomPersonnalise: e.target.value
                    })}
                    placeholder="Ex: Formation, Support, Commercial..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heures budgétées</label>
                  <input
                    type="number"
                    value={casquetteEnEdition.heuresBudgetees}
                    onChange={(e) => setCasquetteEnEdition({
                      ...casquetteEnEdition,
                      heuresBudgetees: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Heures réalisées</label>
                  <input
                    type="number"
                    value={casquetteEnEdition.heuresRealisees}
                    onChange={(e) => setCasquetteEnEdition({
                      ...casquetteEnEdition,
                      heuresRealisees: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Coefficient de valeur ajoutée</label>
                  <input
                    type="number"
                    step="0.1"
                    value={casquetteEnEdition.coefficientValeurAjoutee}
                    onChange={(e) => setCasquetteEnEdition({
                      ...casquetteEnEdition,
                      coefficientValeurAjoutee: parseFloat(e.target.value) || 1.0
                    })}
                    min="0.1"
                    max="3.0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Multiplicateur de valeur (0.5 = faible, 1.0 = normale, 2.0 = élevée)
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setModalEditionOuverte(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                
                {/* Bouton Supprimer - visible seulement pour les casquettes existantes */}
                {casquetteEnEdition.nomPersonnalise && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm(`Êtes-vous sûr de vouloir supprimer la casquette "${casquetteEnEdition.nomPersonnalise}" ?`)) {
                        supprimerCasquette(casquetteEnEdition);
                      }
                    }}
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => sauvegarderCasquette(casquetteEnEdition)}
                  disabled={!casquetteEnEdition.nomPersonnalise?.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}