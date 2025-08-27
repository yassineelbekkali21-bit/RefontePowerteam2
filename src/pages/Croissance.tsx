/**
 * Module Croissance - Suivi de la croissance commerciale
 * Contient 6 tabs : Vue globale, Prospects, Clients Entrants, Clients à suivre, Clients en partance, Clients sortants
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationsContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  UserPlus, 
  Eye, 
  UserMinus, 
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Euro,
  Clock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Star,
  MessageSquare,
  FileText,
  RefreshCw,
  Archive, 
  Trash2, 
  Plus, 
  Send, 
  Edit, 
  Calendar as CalendarIcon, 
  DollarSign,
  ClipboardList,
  Target as TargetIcon,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';

// Interface pour les actions de contact
interface ContactAction {
  type: 'appel' | 'rdv' | 'mail' | 'note';
  titre: string;
  description?: string;
  contenu?: string;
  expediteur?: string;
  date: string;
  duree?: number;
  participant?: string;
  satisfaction?: number;
  status?: 'completed' | 'pending' | 'scheduled' | 'recu';
}

// Interface pour les plans d'action
interface PlanAction {
  id: string;
  clientId: string;
  clientNom: string;
  clientType: 'suivre' | 'partance';
  titre: string;
  description: string;
  objectif: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  responsable: string;
  dateCreation: string;
  dateEcheance: string;
  statut: 'brouillon' | 'en_cours' | 'termine' | 'suspendu';
  actions: Array<{
    id: string;
    description: string;
    responsable: string;
    dateEcheance: string;
    statut: 'a_faire' | 'en_cours' | 'termine';
  }>;
}

interface ProspectClient {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
  statut: string;
  remarque?: string;
  canal?: string;
  chiffreAffaires?: number;
  dateEcheance?: string;
  dateContact?: string;
  gestionnaire?: string;
  actions?: string[];
  // Nouveaux champs enrichis
  prenom?: string;
  entreprise?: string;
  secteur?: string;
  taille?: string;
  source?: string;
  score?: number;
  derniereActivite?: string;
  conversion?: string;
  pieceJointe?: string;
  // Historique des contacts
  contacts?: {
    appel?: ContactAction;
    rdv?: ContactAction;
    mail?: ContactAction;
    note?: ContactAction;
  };
}

interface EmailProspect {
  id: string;
  expediteur: string;
  objet: string;
  contenu: string;
  dateReception: string;
  statut: 'nouveau' | 'lu' | 'traite' | 'archive';
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
  pieces_jointes?: string[];
  tags?: string[];
  score_ia?: number; // Score IA de qualification
  prospect_extrait?: Partial<ProspectClient>;
}



// Génération des emails prospects simulés
const generateMockEmails = (): EmailProspect[] => {
  const emails = [
    {
      id: 'email-001',
      expediteur: 'grandjean.frand@gmail.com',
      objet: 'Demande de rdv - statut independant/socm4',
      contenu: 'Bonjour, nous nous permettons de vous relancer quant a notre demande ci-dessous. Est-ce possible d\'avoir un premier rdv prochainement ? Si oui, quelles sont vos disponibilites ?',
      dateReception: '25/08/2025 16:15',
      statut: 'nouveau' as const,
      priorite: 'haute' as const,
      pieces_jointes: ['statut_independant.pdf'],
      tags: ['independant', 'rdv'],
      score_ia: 85,
      prospect_extrait: {
        nom: 'Grandjean Frand',
        email: 'grandjean.frand@gmail.com',
        entreprise: 'Deg and Partners',
        statut: 'Prospect qualifie',
        secteur: 'Services',
        source: 'Email entrant'
      }
    },
    {
      id: 'email-002', 
      expediteur: 'lagmissmat@gmail.com',
      objet: 'Accompagnement concernant les demarches a entreprendre pour la declaration et la regularisation de mes activites',
      contenu: 'eu mme et lui ai explique la maniere dont sont repartis les droits d\'auteurs, est salariee et viendra vers nous pour sa decla employe',
      dateReception: '20/08/2025',
      statut: 'lu' as const,
      priorite: 'normale' as const,
      tags: ['declaration', 'regularisation'],
      score_ia: 72,
      prospect_extrait: {
        nom: 'Lagmiss Mat',
        email: 'lagmissmat@gmail.com',
        statut: 'En qualification',
        source: 'Email entrant'
      }
    },
    {
      id: 'email-003',
      expediteur: 'contact@entreprise-xyz.fr',
      objet: 'Consultation fiscale - Restructuration société',
      contenu: 'Nous envisageons une restructuration de notre groupe de sociétés et aurions besoin d\'un accompagnement fiscal complet...',
      dateReception: '18/08/2025 09:30',
      statut: 'traite' as const,
      priorite: 'haute' as const,
      tags: ['restructuration', 'fiscal', 'groupe'],
      score_ia: 92,
      prospect_extrait: {
        nom: 'Directeur Financier',
        email: 'contact@entreprise-xyz.fr',
        entreprise: 'Entreprise XYZ',
        statut: 'Prospect chaud',
        secteur: 'Industrie',
        taille: 'Grande entreprise',
        chiffreAffaires: 50000,
        source: 'Email entrant'
      }
    }
  ];
  
  return emails;
};

// Données simulées basées sur les captures d'écran
const generateMockData = () => {
  
  const statuts = {
    prospects: ['converti', 'non converti', 'en cours'],
    entrants: ['offre envoyée', 'offre signée', 'mandats activés', 'présentation GD', 'onboarding terminé'],
    suivre: ['Passage en Societes', 'Select', 'Adipiscing Mauris', 'Pas de planning'],
    partance: ['Client a risque', 'Preavis donne', 'En discussion'],
    sortants: ['Stop activite', 'Sans nouvelles', 'Changement de comptable', 'Liquidation', 'Pas d activite metier son dossier', 'Fait et/ou refuse metier son dossier']
  };

  const canaux = ['Mail', 'Telephone', 'Visite', 'Recommandation', 'Site web'];
  const canauxEntrants = ['Passage en société', 'Bouche à oreille', 'Evenements', 'Partenaire', 'Site web', 'Boite info'];
  
  const entreprises = [
    'ASMA LAIJIAI', 'CHARLOTTE BOISSON', 'FERAH DEFIQ', 'ISABELLE DETOURNAY', 
    'JEAN-FRANCOIS POELS', 'LUCIE GODEAU', 'MARIE GAYODO', 'MATHIEU STREIGNON', 
    'PETIT JACKY', 'AMADOU MOUNIA', 'DERINDAG DELANEY', 'LALLEMENT EMMANUELLE',
    'LAMBEAU ANNE JEANNINE', 'MAN184', 'AOL FORWARDING', 'JAGIL', 'SIMON BENJAMIN JEAN',
    'COLLECTIF LIBERTALIA', 'BUREAU ETUDES CONCEPT SA', 'SHELTING FEMME', 'GENRES PLURIELS',
    'CREPA', 'K554 REAL ESTATE', 'ELIANCE DELPHINE', 'JARIDIOR NICOLAS', 'NOEL GREGORY EDOUARD',
    'RADERMACHER FRANCOISE', 'DUGO', 'DENTAL MQK', 'LOIC SOMMERHAUSEN', 'COMMISSARIAT A LA MONNAIE ET AUX ORGANISATIONS INTERNATIONALES'
  ];

  return {
    prospects: Array.from({ length: 15 }, (_, i) => ({
      id: `P${i + 1}`,
      nom: entreprises[i % entreprises.length],
      email: `contact${i + 1}@example.com`,
      telephone: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
      statut: statuts.prospects[Math.floor(Math.random() * statuts.prospects.length)],
      remarque: i < 5 ? 'Photographe et realisatrice freelance' : undefined,
      canal: canaux[Math.floor(Math.random() * canaux.length)],
      chiffreAffaires: Math.floor(Math.random() * 5000),
      dateEcheance: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2025`,
      // Simulation de contacts pris pour certains prospects
      contacts: i % 3 === 0 ? {
        appel: {
          type: 'appel' as const,
          titre: `Appel avec ${entreprises[i % entreprises.length].split(' ')[0]}`,
          description: 'Premier contact téléphonique réalisé',
          date: '2025-01-15',
          satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
          status: 'completed' as const
        }
      } : i % 4 === 0 ? {
        mail: {
          type: 'mail' as const,
          titre: `Email initial de ${entreprises[i % entreprises.length].split(' ')[0]}`,
          contenu: `Bonjour,\n\nJe me permets de vous contacter suite à notre échange téléphonique.\n\nNous sommes intéressés par vos services en comptabilité et fiscalité pour notre entreprise ${entreprises[i % entreprises.length]}.\n\nPourriez-vous nous proposer un rendez-vous pour discuter de nos besoins ?\n\nCordialement,\n${entreprises[i % entreprises.length].split(' ')[0]}`,
          expediteur: `contact${i + 1}@example.com`,
          date: '2025-01-12',
          status: 'recu' as const
        }
      } : i % 5 === 0 ? {
        rdv: {
          type: 'rdv' as const,
          titre: `RDV avec ${entreprises[i % entreprises.length].split(' ')[0]}`,
          description: 'Rendez-vous de présentation planifié',
          date: '2025-01-20',
          satisfaction: 5, // Excellent RDV
          status: 'completed' as const
        }
      } : undefined,
    })),
    
    entrants: Array.from({ length: 8 }, (_, i) => {
      // Calcul budgétisation (volumétrie + horaire + économique)
      const hasVolumetrie = Math.random() > 0.3;
      const hasHoraire = Math.random() > 0.3;
      const hasEconomique = Math.random() > 0.3;
      const budgetCount = [hasVolumetrie, hasHoraire, hasEconomique].filter(Boolean).length;
      const budgetisation = Math.round((budgetCount / 3) * 100);
      
      // Génération des étapes avec progression logique
      const lmEnvoyee = Math.random() > 0.2; // 80% ont LM envoyée
      const rdvDate = lmEnvoyee && Math.random() > 0.4 ? `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 3) + 1}/2025` : null;
      const presentationGestionnaire = rdvDate && Math.random() > 0.5;
      const appDemo = presentationGestionnaire && Math.random() > 0.3;
      const miseEnPlace = appDemo && Math.random() > 0.5;
      
      // Calcul automatique du statut selon l'avancement
      let statut;
      if (miseEnPlace) {
        statut = 'onboarding terminé';
      } else if (appDemo) {
        statut = 'mandats activés';
      } else if (presentationGestionnaire) {
        statut = 'présentation GD';
      } else if (rdvDate) {
        statut = 'offre signée';
      } else {
        statut = 'offre envoyée';
      }
      
      // Calcul des dates de suivi (1 mois et 9 mois après l'arrivée)
      const dateArrivee = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const contact1Mois = new Date(dateArrivee);
      contact1Mois.setMonth(contact1Mois.getMonth() + 1);
      const contact9Mois = new Date(dateArrivee);
      contact9Mois.setMonth(contact9Mois.getMonth() + 9);
      
      const formatDate = (date: Date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      // Vérifier si les contacts ont été effectués
      const aujourdhui = new Date();
      const contact1MoisEffectue = contact1Mois < aujourdhui && Math.random() > 0.3; // 70% effectués
      const contact9MoisEffectue = contact9Mois < aujourdhui && Math.random() > 0.5; // 50% effectués
      
      return {
        id: `E${i + 1}`,
        idClient: `CLI-${(2024 + Math.floor(i/4)).toString()}-${(1000 + i * 37 + Math.floor(Math.random() * 100)).toString().padStart(4, '0')}`,
        nom: entreprises[(i + 15) % entreprises.length],
        statut: statut,
        dateContact: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2025`,
        dateArrivee: formatDate(dateArrivee),
        canal: canauxEntrants[Math.floor(Math.random() * canauxEntrants.length)],
        email: `contact${i + 15}@${entreprises[(i + 15) % entreprises.length].toLowerCase().replace(/\s+/g, '')}.com`,
        telephone: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
        secteur: ['Services', 'Industrie', 'Commerce', 'Immobilier', 'Finance'][i % 5],
        lmEnvoyee: lmEnvoyee,
        rdvDate: rdvDate,
        presentationGestionnaire: presentationGestionnaire,
        appDemo: appDemo,
        miseEnPlace: miseEnPlace,
        forfaitDemarrage: Math.floor(Math.random() * 1500) + 500, // 500€ à 2000€
        montantAnneeEnCours: Math.floor(Math.random() * 8000) + 2000, // 2000€ à 10000€
        montantAnneeProchaine: Math.floor(Math.random() * 12000) + 3000, // 3000€ à 15000€
        budgetisation: budgetisation,
        budgetDetails: {
          volumetrie: hasVolumetrie,
          horaire: hasHoraire,
          economique: hasEconomique
        },
        // Suivi des contacts planifiés
        suiviContacts: {
          contact1Mois: {
            datePrevue: formatDate(contact1Mois),
            effectue: contact1MoisEffectue,
            dateEffectuee: contact1MoisEffectue ? formatDate(new Date(contact1Mois.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)) : null
          },
          contact9Mois: {
            datePrevue: formatDate(contact9Mois),
            effectue: contact9MoisEffectue,
            dateEffectuee: contact9MoisEffectue ? formatDate(new Date(contact9Mois.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)) : null
          }
        },
        // Historique des contacts (similaire aux prospects)
        contacts: Math.random() > 0.6 ? {
          // Simulation d'un appel effectué pour certains clients
          ...(Math.random() > 0.5 ? {
            appel: {
              type: 'appel' as const,
              titre: `Appel de suivi`,
              description: `Appel commercial effectué`,
              participant: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
              status: 'completed' as const
            }
          } : {}),
          // Simulation d'un RDV effectué pour certains clients
          ...(Math.random() > 0.7 ? {
            rdv: {
              type: 'rdv' as const,
              titre: `RDV commercial`,
              description: `Rendez-vous de suivi`,
              participant: entreprises[(i + 15) % entreprises.length],
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              duree: 60,
              satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
              status: 'completed' as const
            }
          } : {}),
          // Simulation d'une note effectuée pour certains clients
          ...(Math.random() > 0.8 ? {
            note: {
              type: 'note' as const,
              titre: `Note de suivi`,
              description: `Note sur l'évolution du dossier`,
              date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
              status: 'completed' as const
            }
          } : {})
        } : undefined
      };
    }),
    
    suivre: Array.from({ length: 10 }, (_, i) => ({
      id: `S${i + 1}`,
      idClient: `CLI-${(2023 + Math.floor(i/3)).toString()}-${(2000 + i * 45 + Math.floor(Math.random() * 100)).toString().padStart(4, '0')}`,
      nom: entreprises[(i + 23) % entreprises.length],
      statut: ['Client a risque', 'Recupere'][Math.floor(Math.random() * 2)],
      secteur: ['Services', 'Industrie', 'Commerce', 'Immobilier', 'Finance', 'Santé'][i % 6],
      gestionnaire: ['Valentine Caprasse', 'Pauline Coster', 'Djamant Hysenaj', 'Pierrich Navarre', 'Soufiane Essebaly'][i % 5],
      dateContact: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2025`,
      rdvDate: Math.random() > 0.6 ? `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 3) + 2}/2025` : null,
      caBudgete: Math.floor(Math.random() * 15000) + 5000, // CA entre 5k€ et 20k€
      email: `contact${i + 23}@${entreprises[(i + 23) % entreprises.length].toLowerCase().replace(/\s+/g, '')}.com`,
      telephone: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
      commentaire: [
        'Pas content de l\'app et ne veut pas payer un logiciel. Souhaite passer par dossier',
        'Elle a revendu les actions de sa société à son fils qui va traffiquer dans les voitures',
        'décès du client',
        'Comme discuté, la cliente souhaite partir du regroupement au multiple GD dans son dossier',
        'J\'ai essayé de la rassurer sans trop forcer',
        'Elle doit me recontacter cette semaine soit call soit mail',
        'part car trop cher et n\'est pas d\'accord => a proposé un nouveau forfait avec fact. act déductible à 120% aussi',
        'Client parti par Soufiane. Problème de délai réaction, mails, tel, à déclarations en retard => amendes',
        'a essayé deux fois d\'appeler à mag vocal. l\'envoie un mail pour demander un rdv pour début avril comme ils demandé',
        'Client en suivi régulier'
      ][i] || 'Client en suivi régulier',
      remarque: i < 3 ? 'pas besoin de relance ni contact' : undefined,
      // Historique des contacts (similaire aux autres modules)
      contacts: Math.random() > 0.5 ? {
        // Simulation de contacts effectués
        ...(Math.random() > 0.6 ? {
          appel: {
            type: 'appel' as const,
            titre: `Appel de suivi`,
            description: `Appel de suivi client régulier`,
            participant: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
            date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.7 ? {
          rdv: {
            type: 'rdv' as const,
            titre: `RDV de suivi`,
            description: `Rendez-vous de suivi annuel`,
            participant: entreprises[(i + 23) % entreprises.length],
            date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duree: 90,
            satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.5 ? {
          mail: {
            type: 'mail' as const,
            titre: `Email de suivi`,
            description: `Email de contact mensuel`,
            participant: `contact${i + 23}@${entreprises[(i + 23) % entreprises.length].toLowerCase().replace(/\s+/g, '')}.com`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.8 ? {
          note: {
            type: 'note' as const,
            titre: `Note de suivi`,
            description: `Note sur l'évolution du dossier client`,
            date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
            status: 'completed' as const
          }
        } : {})
      } : undefined
    })),
    
    partance: Array.from({ length: 13 }, (_, i) => ({
      id: `PA${i + 1}`,
      idClient: `CLI-${(2022 + Math.floor(i/4)).toString()}-${(1500 + i * 35 + Math.floor(Math.random() * 50)).toString().padStart(4, '0')}`,
      nom: entreprises[i % entreprises.length],
      statut: statuts.partance[Math.floor(Math.random() * statuts.partance.length)],
      secteur: ['Services', 'Industrie', 'Commerce', 'Immobilier', 'Finance', 'Santé', 'Technologie'][i % 7],
      gestionnaire: ['Soufiane Essebaly', 'Adrien Pochet', 'Djamant Hysenaj', 'Pauline Coster', 'Valentine Caprasse'][i % 5],
      dateEcheance: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2025`,
      rdvDate: Math.random() > 0.7 ? `${Math.floor(Math.random() * 15) + 1}/${Math.floor(Math.random() * 2) + 2}/2025` : null,
      chiffreAffaires: Math.floor(Math.random() * 25000) + 5000, // Entre 5k et 30k€
      email: `contact${i}@${entreprises[i % entreprises.length].toLowerCase().replace(/\s+/g, '')}.com`,
      telephone: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
      recupere: Math.random() > 0.7, // 30% de clients déjà récupérés
      commentaire: [
        'Client mécontent des tarifs. Propose une offre commerciale adaptée.',
        'Problèmes de communication. Planifier un RDV face à face.',
        'Concurrent moins cher trouvé. Mettre en avant notre valeur ajoutée.',
        'Insatisfaction du service. Améliorer le suivi personnalisé.',
        'Charges trop élevées selon lui. Revoir la structure tarifaire.',
        'Veut partir pour raisons personnelles. Maintenir le contact.',
        'Service pas assez réactif. Améliorer nos délais de réponse.',
        'Facturation pas claire. Expliquer en détail nos prestations.',
        'Manque de conseils proactifs. Renforcer l\'accompagnement.',
        'Concurrent avec offre intégrée. Proposer package similaire.',
        'Problème de confiance. Organiser rencontre avec associé.',
        'Trop de changements d\'interlocuteurs. Stabiliser l\'équipe.',
        'Digitalisation insuffisante. Présenter nos nouveaux outils.'
      ][i] || 'Client en processus de départ - stratégie de récupération à définir',
      // Historique des contacts de récupération
      contacts: Math.random() > 0.4 ? {
        // Simulation de tentatives de récupération
        ...(Math.random() > 0.5 ? {
          appel: {
            type: 'appel' as const,
            titre: `Appel de récupération`,
            description: `Tentative de récupération téléphonique`,
            participant: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1, // Mix de succès/échecs
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.6 ? {
          rdv: {
            type: 'rdv' as const,
            titre: `RDV de récupération`,
            description: `Rendez-vous pour négocier le maintien`,
            participant: entreprises[i % entreprises.length],
            date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            duree: 90,
            satisfaction: Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1, // Mix de succès/échecs
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.4 ? {
          mail: {
            type: 'mail' as const,
            titre: `Email de récupération`,
            description: `Email de récupération commerciale`,
            participant: `contact${i}@${entreprises[i % entreprises.length].toLowerCase().replace(/\s+/g, '')}.com`,
            date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1, // Mix de succès/échecs
            status: 'completed' as const
          }
        } : {}),
        ...(Math.random() > 0.7 ? {
          note: {
            type: 'note' as const,
            titre: `Note stratégie récupération`,
            description: `Plan d'action pour récupérer le client`,
            date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            satisfaction: Math.floor(Math.random() * 2) + 4, // Notes généralement positives
            status: 'completed' as const
          }
        } : {})
      } : undefined
    })),
    
    sortants: Array.from({ length: 6 }, (_, i) => {
      const clients = [
        {
          nom: 'ZAJAC',
          secteur: 'Particuliers - DEG',
          rdv: 'Sele...',
          rdvDate: '2025-02-15',
          presta: '0m',
          typeFacturation: 'En régie',
          indemnites: '0,00€',
          dateDepart: '1/12/2025',
          causesDepart: 'Stop activité',
          anneeN1: 0,
          anneeN: 0,
          impactN: 0,
          annuelN1: 0,
          remarque: '',
          mandats: false,
          logiciels: false,
          backup: false,
          facturationCloturee: true,
          prestationsAFaire: false
        },
        {
          nom: 'NGAMBA HADASSA',
          secteur: 'Indépendants - DEG',
          rdv: 'Sele...',
          rdvDate: '',
          presta: '0m',
          typeFacturation: 'En régie',
          indemnites: '0,00€',
          dateDepart: '24/7/2025',
          causesDepart: 'Sans nouvelle',
          anneeN1: 1098.79,
          anneeN: 0,
          impactN: 1098.79,
          annuelN1: 0,
          remarque: '',
          mandats: true,
          logiciels: false,
          backup: false,
          facturationCloturee: false,
          prestationsAFaire: true
        },
        {
          nom: 'CIP ÉVÉNEMENTS',
          secteur: 'Sociétés - MNS',
          rdv: 'Sele...',
          rdvDate: '2025-01-30',
          presta: '39h 40m',
          typeFacturation: 'En régie',
          indemnites: '0,00€',
          dateDepart: '23/7/2025',
          causesDepart: 'Changement de comptable',
          anneeN1: 592.92,
          anneeN: 3552.50,
          impactN: -2959.58,
          annuelN1: 3552.50,
          remarque: '',
          mandats: true,
          logiciels: true,
          backup: true,
          facturationCloturee: true,
          prestationsAFaire: false
        },
        {
          nom: 'TRELEVEN BASIL',
          secteur: 'Indépendants - IFA',
          rdv: 'Sele...',
          rdvDate: '2025-03-10',
          presta: '45m',
          typeFacturation: 'En régie',
          indemnites: '0,00€',
          dateDepart: '17/7/2025',
          causesDepart: 'Changement de comptable',
          anneeN1: 0,
          anneeN: 0,
          impactN: 0,
          annuelN1: 0,
          remarque: '',
          mandats: false,
          logiciels: true,
          backup: false,
          facturationCloturee: true,
          prestationsAFaire: false
        },
        {
          nom: 'GRAND MARIE',
          secteur: 'Gérants - DEG',
          rdv: 'Sele...',
          rdvDate: '',
          presta: '0m',
          typeFacturation: 'Pas de planning',
          indemnites: '0,00€',
          dateDepart: '16/7/2025',
          causesDepart: 'Liquidation',
          anneeN1: 0,
          anneeN: 0,
          impactN: 0,
          annuelN1: 0,
          remarque: '',
          mandats: false,
          logiciels: false,
          backup: false,
          facturationCloturee: true,
          prestationsAFaire: false
        },
        {
          nom: 'SYNERGIE ET ACTIONS',
          secteur: 'Sociétés - IFA',
          rdv: 'Sele...',
          rdvDate: '2025-02-20',
          presta: '28h 14m',
          typeFacturation: 'Montant fixe annuel',
          indemnites: '0,00€',
          dateDepart: '15/7/2025',
          causesDepart: 'Changement de comptable',
          anneeN1: 4523.64,
          anneeN: 1513.90,
          impactN: 3009.74,
          annuelN1: 1513.90,
          remarque: '',
          mandats: true,
          logiciels: true,
          backup: false,
          facturationCloturee: false,
          prestationsAFaire: true
        }
      ];

      const client = clients[i];
      return {
        id: `SO${i + 1}`,
        nom: client.nom,
        idClient: `CLI-2025-${String(i + 1).padStart(4, '0')}`,
        secteur: client.secteur,
        statut: client.causesDepart,
        rdv: client.rdv,
        presta: client.presta,
        typeFacturation: client.typeFacturation,
        indemnites: client.indemnites,
        dateDepart: client.dateDepart,
        causesDepart: client.causesDepart,
        anneeN1: client.anneeN1,
        anneeN: client.anneeN,
        impactN: client.impactN,
        annuelN1: client.annuelN1,
        remarque: client.remarque,
        chiffreAffaires: Math.max(client.anneeN1, client.anneeN, client.impactN, client.annuelN1)
      };
    })
  };
};

const Croissance = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'globale' | 'prospects' | 'entrants' | 'suivre' | 'partance' | 'sortants'>('globale');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'ytd' | '1y' | 'all'>('ytd');
  
  // États pour la gestion des emails prospects
  const [showEmails, setShowEmails] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailProspect | null>(null);
  const [isEmailDetailOpen, setIsEmailDetailOpen] = useState(false);
  const [isCreateProspectOpen, setIsCreateProspectOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContactAction, setSelectedContactAction] = useState<ContactAction | null>(null);
  const [isCreateProspectDirectOpen, setIsCreateProspectDirectOpen] = useState(false);
  const [selectedProspectForEmail, setSelectedProspectForEmail] = useState<ProspectClient | null>(null);
  const [isProspectEmailModalOpen, setIsProspectEmailModalOpen] = useState(false);
  
  // État pour les clients entrants (déplacé au niveau principal)
  const [localEntrants, setLocalEntrants] = useState(() => {
    const mockData = generateMockData();
    console.log('🔄 Données clients entrants chargées:', mockData.entrants[0]?.suiviContacts ? 'avec suivi contacts' : 'SANS suivi contacts');
    return mockData.entrants;
  });
  
  // Fonction pour recharger les données avec le nouveau système de suivi
  const reloadEntrantsData = () => {
    const newMockData = generateMockData();
    setLocalEntrants(newMockData.entrants);
    console.log('🔄 Données rechargées avec suivi contacts');
  };
  
  // État pour les clients en partance (déplacé au niveau principal)
  const [localPartance, setLocalPartance] = useState(() => generateMockData().partance);
  
  // Fonction pour mettre à jour un client en partance (déplacée au niveau principal)
  const updateClientPartance = (clientId: string, updates: any) => {
    setLocalPartance(prev => 
      prev.map(client => 
        client.id === clientId ? { ...client, ...updates } : client
      )
    );
  };
  
  // États pour la gestion des plans d'action
  const [isPlanActionModalOpen, setIsPlanActionModalOpen] = useState(false);
  const [selectedClientForPlan, setSelectedClientForPlan] = useState<any>(null);
  const [clientType, setClientType] = useState<'suivre' | 'partance'>('suivre');
  
  // Fonction pour mettre à jour un client entrant (déplacée au niveau principal)
  const updateClientEntrant = (clientId: string, field: string, value: any) => {
    setLocalEntrants(prev => 
      prev.map(client => {
        if (client.id === clientId) {
          const updatedClient = { ...client, [field]: value };
          const oldStatus = calculateStatut(client);
          const newStatus = calculateStatut(updatedClient);
          
          // Affichage du changement de statut s'il y en a un
          if (oldStatus !== newStatus) {
            console.log(`🔄 Client ${client.nom}: ${oldStatus} → ${newStatus}`);
          }
          
          return updatedClient;
        }
        return client;
      })
    );
  };
  
  const mockData = generateMockData();
  const mockEmails = generateMockEmails();
  const [emailsToProcess, setEmailsToProcess] = useState(mockEmails);

  // Canaux spécifiques aux clients entrants
  const canauxEntrants = ['Passage en société', 'Bouche à oreille', 'Evenements', 'Partenaire', 'Site web', 'Boite info'];

  // Fonction pour calculer automatiquement le statut selon l'avancement
  const calculateStatut = (client: any) => {
    if (client.miseEnPlace) {
      return 'onboarding terminé';
    } else if (client.appDemo) {
      return 'mandats activés';
    } else if (client.presentationGestionnaire) {
      return 'présentation GD';
    } else if (client.rdvDate) {
      return 'offre signée';
    } else {
      return 'offre envoyée';
    }
  };

  // Fonction pour ajuster les données selon la période
  const getPeriodMultiplier = (period: string) => {
    switch (period) {
      case '7d': return 0.25; // 1 semaine
      case '30d': return 1; // 1 mois (référence)
      case '90d': return 3; // 3 mois
      case 'ytd': return new Date().getMonth() + 1; // Année en cours (mois écoulés)
      case '1y': return 12; // 1 an
      case 'all': return 18; // Historique complet
      default: return 1;
    }
  };

  const periodMultiplier = getPeriodMultiplier(selectedPeriod);

  // Génération des données pour le graphique selon la période
  const generateChartData = () => {
    const today = new Date();
    let dataPoints = [];
    
    switch (selectedPeriod) {
      case '7d':
        // 7 derniers jours
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const baseValue = 148 + Math.random() * 30 - 15; // Variation autour de 148k€
          dataPoints.push({
            name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
            fullDate: date.toLocaleDateString('fr-FR'),
            nouveauxClients: baseValue * 0.25,
            pipeline: (24 + Math.random() * 10 - 5) * 0.25,
            departsClients: (21 + Math.random() * 8 - 4) * 0.25,
          });
        }
        break;
        
      case '30d':
        // 30 derniers jours (par semaine)
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(today);
          weekStart.setDate(weekStart.getDate() - (i * 7));
          const baseValue = 148 + Math.random() * 40 - 20;
          dataPoints.push({
            name: `S${4-i}`,
            fullDate: `Semaine du ${weekStart.toLocaleDateString('fr-FR')}`,
            nouveauxClients: baseValue * 0.25,
            pipeline: (24 + Math.random() * 12 - 6) * 0.25,
            departsClients: (21 + Math.random() * 10 - 5) * 0.25,
          });
        }
        break;
        
      case '90d':
        // 3 derniers mois
        for (let i = 2; i >= 0; i--) {
          const month = new Date(today);
          month.setMonth(month.getMonth() - i);
          const baseValue = 148 + (Math.random() * 60 - 30);
          dataPoints.push({
            name: month.toLocaleDateString('fr-FR', { month: 'short' }),
            fullDate: month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            nouveauxClients: baseValue,
            pipeline: 24 + Math.random() * 15 - 7,
            departsClients: 21 + Math.random() * 12 - 6,
          });
        }
        break;
        
      case 'ytd':
        // Année en cours (par mois)
        const currentMonth = today.getMonth();
        for (let i = 0; i <= currentMonth; i++) {
          const month = new Date(2025, i, 1);
          const baseValue = 148 + (Math.random() * 50 - 25) + (i * 5); // Tendance croissante
          dataPoints.push({
            name: month.toLocaleDateString('fr-FR', { month: 'short' }),
            fullDate: month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            nouveauxClients: baseValue,
            pipeline: 24 + Math.random() * 20 - 10 + (i * 2),
            departsClients: 21 + Math.random() * 15 - 7,
          });
        }
        break;
        
      case '1y':
        // 12 derniers mois
        for (let i = 11; i >= 0; i--) {
          const month = new Date(today);
          month.setMonth(month.getMonth() - i);
          const baseValue = 148 + (Math.random() * 80 - 40) + ((11-i) * 8); // Tendance croissante
          dataPoints.push({
            name: month.toLocaleDateString('fr-FR', { month: 'short' }),
            fullDate: month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            nouveauxClients: baseValue,
            pipeline: 24 + Math.random() * 25 - 12 + ((11-i) * 3),
            departsClients: 21 + Math.random() * 18 - 9,
          });
        }
        break;
        
      default:
        // Historique (par trimestre)
        for (let i = 5; i >= 0; i--) {
          const quarter = new Date(today);
          quarter.setMonth(quarter.getMonth() - (i * 3));
          const baseValue = 148 + (Math.random() * 100 - 50) + ((5-i) * 15);
          dataPoints.push({
            name: `T${Math.ceil((quarter.getMonth() + 1) / 3)}`,
            fullDate: `T${Math.ceil((quarter.getMonth() + 1) / 3)} ${quarter.getFullYear()}`,
            nouveauxClients: baseValue,
            pipeline: 24 + Math.random() * 30 - 15 + ((5-i) * 5),
            departsClients: 21 + Math.random() * 20 - 10,
          });
        }
    }
    
    return dataPoints;
  };

  const chartData = generateChartData();

  // Génération des données pour le graphique Entrants vs Sortants
  const generateEntrantsSortantsData = () => {
    const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      // Logique basée sur la période sélectionnée
      let entrants = 0;
      let sortants = 0;
      
      if (selectedPeriod === 'ytd' && index <= currentMonth) {
        // Année en cours - données uniquement jusqu'au mois actuel
        entrants = Math.floor(Math.random() * 15) + 2; // 2-17 entrants
        sortants = index < 6 ? Math.floor(Math.random() * 70) + 10 : Math.floor(Math.random() * 25) + 5; // Plus de sortants en début d'année
      } else if (selectedPeriod === '1y' || selectedPeriod === 'all') {
        // 12 derniers mois ou historique
        entrants = Math.floor(Math.random() * 15) + 2;
        sortants = Math.floor(Math.random() * 70) + 5;
        
        // Saisonnalité : pics en mars et juin
        if (index === 2) { // Mars
          sortants = Math.floor(Math.random() * 20) + 50; // 50-70 sortants
        } else if (index === 5) { // Juin  
          sortants = Math.floor(Math.random() * 15) + 45; // 45-60 sortants
        }
      } else {
        // Périodes courtes - données proportionnelles
        const factor = selectedPeriod === '7d' ? 0.25 : selectedPeriod === '30d' ? 1 : 3;
        entrants = Math.floor((Math.random() * 10 + 3) * factor);
        sortants = Math.floor((Math.random() * 30 + 10) * factor);
      }
      
      // Conversion en CA (€) - valeur moyenne par client
      const valeurMoyenneEntrant = 45000; // 45k€ par nouveau client
      const valeurMoyenneSortant = 38000; // 38k€ par client qui part
      
      return {
        month,
        fullMonth: months[index],
        entrants: Math.max(entrants, 0),
        sortants: Math.max(sortants, 0),
        caEntrants: Math.max(entrants, 0) * valeurMoyenneEntrant,
        caSortants: Math.max(sortants, 0) * valeurMoyenneSortant,
        isCurrentOrFuture: selectedPeriod === 'ytd' && index > currentMonth
      };
    });
  };

  const entrantsSortantsData = generateEntrantsSortantsData();

  // Calculs basés sur les données réelles des tableaux
  const caProspectsReel = mockData.prospects.reduce((sum, p) => sum + (p.chiffreAffaires || 0), 0);
  const caPartanceReel = mockData.partance.reduce((sum, p) => sum + (p.chiffreAffaires || 0), 0);
  const caSortantsReel = mockData.sortants.reduce((sum, p) => sum + (p.chiffreAffaires || 0), 0);

  // Statistiques pour la vue globale avec données financières réelles
  const stats = {
    croissanceNette: (mockData.entrants.length - mockData.sortants.length * 0.1) * periodMultiplier,
    totalProspects: Math.floor(mockData.prospects.length * (periodMultiplier * 0.7)), // Prospects fluctuent moins
    clientsEntrants: Math.floor(mockData.entrants.length * periodMultiplier), 
    clientsSuivre: Math.floor(mockData.suivre.length * (periodMultiplier * 0.8)), // Changent moins vite
    clientsPartance: Math.floor(mockData.partance.length * periodMultiplier),
    clientsSortants: Math.floor(mockData.sortants.length * periodMultiplier),
    tauxConversion: Math.min(65 + (periodMultiplier - 1) * 2, 75), // S'améliore avec le temps
    
    // Données financières basées sur les vrais tableaux
    chiffreAffairesProspects: Math.floor(caProspectsReel * periodMultiplier * 0.7),
    caPartance: Math.floor(caPartanceReel * periodMultiplier), // CA réel des clients en partance
    caSortants: Math.floor(caSortantsReel * 0.1 * periodMultiplier), // 10% du CA sortants réellement perdu
    
    // Données financières complémentaires
    caAnnuelActuel: 2850000, // Reste constant
    caEntrants: Math.floor(mockData.entrants.length * 18500 * periodMultiplier), // Estimation pour nouveaux
    valeurMoyenneClient: 19200, // Reste constant
    margeOperationnelle: 0.35, // Reste constant
    coutAcquisition: 850, // Reste constant
  };

  const tabConfig = [
    { id: 'globale', label: 'Vue globale', icon: BarChart3, color: 'blue' },
    { id: 'prospects', label: 'Prospects', icon: Target, color: 'purple', count: stats.totalProspects },
    { id: 'entrants', label: 'Clients Entrants', icon: UserPlus, color: 'green', count: stats.clientsEntrants },
    { id: 'suivre', label: 'Clients à suivre', icon: Eye, color: 'orange', count: stats.clientsSuivre },
    { id: 'partance', label: 'Clients en partance', icon: UserMinus, color: 'amber', count: stats.clientsPartance },
    { id: 'sortants', label: 'Clients sortants', icon: UserX, color: 'red', count: stats.clientsSortants }
  ];

  const renderTabHeader = () => (
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Croissance</h1>
              <p className="text-gray-600">Suivi commercial et développement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filtre Temporel */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-36 bg-white border-gray-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">📅 7 derniers jours</SelectItem>
                  <SelectItem value="30d">📅 30 derniers jours</SelectItem>
                  <SelectItem value="90d">📅 3 derniers mois</SelectItem>
                  <SelectItem value="ytd">📅 Année en cours (2025)</SelectItem>
                  <SelectItem value="1y">📅 12 derniers mois</SelectItem>
                  <SelectItem value="all">📅 Historique complet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {activeTab === 'prospects' && (
              <>
                <Button 
                  variant={showEmails ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowEmails(!showEmails)}
                  className={showEmails ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {showEmails ? 'Voir Prospects' : 'Boîte Email'}
                  {!showEmails && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {mockEmails.filter(e => e.statut === 'nouveau').length}
                    </Badge>
                  )}
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
              </>
            )}

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

      {/* Navigation des tabs */}
      <div className="flex flex-wrap gap-2">
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100' 
                  : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="font-medium">{tab.label}</span>
              {tab.count !== undefined && (
                <Badge 
                  variant="secondary" 
                  className={`ml-1 text-xs ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderVueGlobale = () => {
    // Calculs dynamiques basés sur les données réelles des tableaux
    const velociteProspection = Math.round((stats.totalProspects / 30) * 10) / 10; // par jour
    const valeurMoyenneProspect = Math.round(caProspectsReel / mockData.prospects.length); // Vraie moyenne des prospects
    const scoreVitalite = Math.round((stats.clientsEntrants * 2 + stats.totalProspects - stats.clientsSortants * 0.1) / 10);
    const previsionChiffre = caProspectsReel * (stats.tauxConversion / 100); // Basé sur le vrai CA des prospects
    
    // Calculs financiers basés sur les données réelles
    const croissanceNetteCA = stats.caEntrants - stats.caSortants; // Impact financier net
    const roiAcquisition = ((stats.valeurMoyenneClient - stats.coutAcquisition) / stats.coutAcquisition * 100).toFixed(0);
    const margeCA = stats.caAnnuelActuel * stats.margeOperationnelle;
    const impactPartance = caPartanceReel; // CA réel en risque (pas la marge, le CA complet)
    const efficaciteCommerciale = ((stats.caEntrants / (stats.totalProspects * stats.coutAcquisition)) * 100).toFixed(0);
    
    // Debug: Affichage des montants réels calculés
    console.log('💰 Calculs basés sur données réelles:', {
      caProspectsTotal: `${caProspectsReel.toLocaleString()}€`,
      caPartanceTotal: `${caPartanceReel.toLocaleString()}€`,
      caSortantsTotal: `${caSortantsReel.toLocaleString()}€`,
      valeurMoyenneProspectReel: `${valeurMoyenneProspect.toLocaleString()}€`,
      previsionBaseeVraiCA: `${previsionChiffre.toLocaleString()}€`
    });

    return (
      <div className="space-y-8">
        {/* Dashboard Principal - Intelligence Business */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne 1: Métriques Clés */}
          <div className="lg:col-span-2 space-y-4">
            {/* KPIs Principaux avec données financières */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Croissance CA</p>
                      <p className="text-xl font-bold text-emerald-900">+{(croissanceNetteCA / 1000).toFixed(0)}k€</p>
                      <div className="flex items-center mt-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
                        <span className="text-xs text-emerald-600">
                          {selectedPeriod === '7d' ? 'cette semaine' :
                           selectedPeriod === '30d' ? 'ce mois' :
                           selectedPeriod === '90d' ? 'ce trimestre' :
                           selectedPeriod === 'ytd' ? 'depuis janvier 2025' :
                           selectedPeriod === '1y' ? 'cette année' : 'historique'}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Pipeline</p>
                      <p className="text-xl font-bold text-blue-900">{(previsionChiffre / 1000).toFixed(0)}k€</p>
                      <div className="flex items-center mt-1">
                        <Target className="w-3 h-3 text-blue-500 mr-1" />
                        <span className="text-xs text-blue-600">{stats.totalProspects} prospects</span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Marge Annuelle</p>
                      <p className="text-xl font-bold text-purple-900">{(margeCA / 1000000).toFixed(1)}M€</p>
                      <div className="flex items-center mt-1">
                        <Zap className="w-3 h-3 text-purple-500 mr-1" />
                        <span className="text-xs text-purple-600">{(stats.margeOperationnelle * 100).toFixed(0)}% marge</span>
                      </div>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Risque CA</p>
                      <p className="text-xl font-bold text-red-900">{(impactPartance / 1000).toFixed(0)}k€</p>
                      <div className="flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                        <span className="text-xs text-red-600">{stats.clientsPartance} à risque</span>
                      </div>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights Avancés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prévisions Concrètes */}
              <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-slate-600" />
                    </div>
                    <span>
                      Prévisions {
                        selectedPeriod === '7d' ? '1 Mois' :
                        selectedPeriod === '30d' ? '3 Mois' :
                        selectedPeriod === '90d' ? '6 Mois' :
                        selectedPeriod === 'ytd' ? 'Fin 2025' :
                        selectedPeriod === '1y' ? '18 Mois' : '2 Ans'
                      }
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-blue-700">Si je convertis mes prospects</span>
                      <span className="font-bold text-blue-900">+{(caProspectsReel / 1000).toFixed(0)}k€</span>
                    </div>
                    <p className="text-xs text-blue-600">{mockData.prospects.length} prospects × {stats.tauxConversion}% taux (CA réel: {caProspectsReel.toLocaleString()}€)</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-green-700">Si j'évite les départs en cours</span>
                      <span className="font-bold text-green-900">-{(caPartanceReel / 1000).toFixed(0)}k€ de perte évitée</span>
                    </div>
                    <p className="text-xs text-green-600">{mockData.partance.length} clients à risque (CA réel: {caPartanceReel.toLocaleString()}€)</p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-amber-700">Scenario optimal (conversion maximale)</span>
                      <span className="font-bold text-amber-900">+{(caProspectsReel / 1000).toFixed(0)}k€</span>
                    </div>
                    <p className="text-xs text-amber-600">Conversion complète du pipeline prospects • Croissance pure</p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-red-700">Scenario pessimiste</span>
                      <span className="font-bold text-red-900">-{(caPartanceReel / 1000).toFixed(0)}k€ de perte</span>
                    </div>
                    <p className="text-xs text-red-600">Départs confirmés + échec conversion prospects</p>
                  </div>

                  <div className="mt-4 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">📊 CA projeté fin {
                        selectedPeriod === 'ytd' ? '2025' :
                        selectedPeriod === '1y' ? 'année' : 'période'
                      }</p>
                      <p className="text-lg font-bold text-indigo-900">
                        {((stats.caAnnuelActuel + caProspectsReel * 0.7 + caPartanceReel * 0.8) / 1000000).toFixed(2)}M€
                      </p>
                      <p className="text-xs text-indigo-600">CA actuel + 70% pipeline prospects + 80% rétention</p>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-xs text-gray-600 text-center">
                      💡 <strong>Comment ça marche ?</strong><br/>
                      Pipeline valorisé = Prospects × Taux conversion historique<br/>
                      Valeur client = CA moyen sur 12 mois glissants
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Alertes & Actions Recommandées */}
              <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Alertes & Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">


                  {/* Actions Recommandées */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">⚡ Actions Prioritaires</h4>
                    
                    {/* Action 1: Clients en partance urgents */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-left hover:bg-red-50 hover:border-red-300"
                      onClick={() => setActiveTab('partance')}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                      <div className="text-left">
                        <div className="text-sm">
                          Créer plans récupération {mockData.partance.filter(c => c.chiffreAffaires > 15000 && !c.recupere).length} gros clients
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(mockData.partance.filter(c => c.chiffreAffaires > 15000 && !c.recupere).reduce((sum, c) => sum + c.chiffreAffaires, 0) / 1000)}k€ à sauver • Priorité 1
                        </div>
                      </div>
                    </Button>

                    {/* Action 2: Prospects convertissables */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-left hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => setActiveTab('prospects')}
                    >
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      <div className="text-left">
                        <div className="text-sm">
                          Contacter {mockData.prospects.filter(p => p.statut === 'en cours').length} prospects en cours
                        </div>
                        <div className="text-xs text-gray-500">
                          Pipeline actif • Taux conversion {Math.round((mockData.prospects.filter(p => p.statut === 'converti').length / mockData.prospects.length) * 100)}%
                        </div>
                      </div>
                    </Button>

                    {/* Action 3: Clients entrants sous-budgétisés */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-left hover:bg-green-50 hover:border-green-300"
                      onClick={() => setActiveTab('entrants')}
                    >
                      <ClipboardList className="w-4 h-4 mr-2 text-green-500" />
                      <div className="text-left">
                        <div className="text-sm">
                          Finaliser budgétisation {mockData.entrants.filter(e => e.budgetisation < 80).length} entrants
                        </div>
                        <div className="text-xs text-gray-500">
                          Manque volumétrie/horaire • Impact CA prévisible
                        </div>
                      </div>
                    </Button>

                    {/* Action 4: Clients à risque sans surveillance */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-left hover:bg-orange-50 hover:border-orange-300"
                      onClick={() => setActiveTab('suivre')}
                    >
                      <UserIcon className="w-4 h-4 mr-2 text-orange-500" />
                      <div className="text-left">
                        <div className="text-sm">
                          Surveiller {mockData.suivre.filter(s => s.statut === 'Client a risque').length} clients à risque
                        </div>
                        <div className="text-xs text-gray-500">
                          Prévention départs • {Math.round(mockData.suivre.filter(s => s.statut === 'Client a risque').reduce((sum, c) => sum + (c.caBudgete || 0), 0) / 1000)}k€ CA surveillé
                        </div>
                      </div>
                    </Button>

                    {/* Action 5: Transfert clients récupérés */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-left hover:bg-purple-50 hover:border-purple-300"
                      onClick={() => {
                        const clientsRecuperes = mockData.partance.filter(c => c.recupere).length;
                        if (clientsRecuperes > 0) {
                          setActiveTab('suivre');
                          alert(`${clientsRecuperes} clients récupérés à transférer vers "Clients à suivre" avec statut "Récupéré"`);
                        } else {
                          alert('Aucun client récupéré à transférer pour le moment.');
                        }
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" />
                      <div className="text-left">
                        <div className="text-sm">
                          Transférer {mockData.partance.filter(c => c.recupere).length} clients récupérés
                        </div>
                        <div className="text-xs text-gray-500">
                          Vers "Clients à suivre" • Statut "Récupéré"
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Colonne 2: Vue d'ensemble segments */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <PieChart className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span>Vue d'Ensemble</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Segments rapides */}
                <div className="space-y-2">
                  {tabConfig.slice(1).map((tab, index) => {
                    const TabIcon = tab.icon;
                    const evolution = Math.floor(Math.random() * 40) - 20; // -20 à +20
                    const isPositive = evolution >= 0;
                    
                    return (
                      <div 
                        key={tab.id} 
                        className="group p-2 bg-white rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => setActiveTab(tab.id as any)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg ${
                              tab.color === 'purple' ? 'bg-purple-100' :
                              tab.color === 'green' ? 'bg-green-100' :
                              tab.color === 'orange' ? 'bg-orange-100' :
                              tab.color === 'amber' ? 'bg-amber-100' :
                              'bg-red-100'
                            }`}>
                              <TabIcon className={`w-3 h-3 ${
                                tab.color === 'purple' ? 'text-purple-600' :
                                tab.color === 'green' ? 'text-green-600' :
                                tab.color === 'orange' ? 'text-orange-600' :
                                tab.color === 'amber' ? 'text-amber-600' :
                                'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-900">{tab.label}</p>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs px-1 py-0">{tab.count}</Badge>
                                <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isPositive ? '+' : ''}{evolution}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Graphique Entrants vs Sortants */}
                <div className="bg-white rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Impact Financier - Entrants vs Sortants</h4>
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-600">CA Entrants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">CA Sortants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={entrantsSortantsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#64748b' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          width={35}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                          }}
                          formatter={(value: any, name: string) => {
                            const label = name === 'caEntrants' ? 'CA Entrants' : 'CA Sortants';
                            return [`${(value / 1000).toFixed(0)}k€`, label];
                          }}
                          labelFormatter={(label) => {
                            const dataPoint = entrantsSortantsData.find(d => d.month === label);
                            return dataPoint?.fullMonth || label;
                          }}
                        />
                        <Bar 
                          dataKey="caEntrants" 
                          fill="#10b981" 
                          radius={[2, 2, 0, 0]}
                          name="caEntrants"
                        />
                        <Bar 
                          dataKey="caSortants" 
                          fill="#ef4444" 
                          radius={[2, 2, 0, 0]}
                          name="caSortants"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Tendances & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                <span>Tendances de Croissance</span>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedPeriod === '7d' ? '7 jours' :
                     selectedPeriod === '30d' ? '30 jours' :
                     selectedPeriod === '90d' ? '3 mois' :
                     selectedPeriod === 'ytd' ? '2025 YTD' :
                     selectedPeriod === '1y' ? '12 mois' : 'Historique'}
                  </Badge>
                  <Badge variant="secondary">Temps Réel</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+{(stats.caEntrants / 1000).toFixed(0)}k€</p>
                  <p className="text-sm text-gray-600">CA nouveaux clients</p>
                  <p className="text-xs text-green-600">↗ {stats.clientsEntrants} acquisitions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{(previsionChiffre / 1000).toFixed(0)}k€</p>
                  <p className="text-sm text-gray-600">Pipeline valorisé</p>
                  <p className="text-xs text-blue-600">→ {stats.totalProspects} prospects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">-{(stats.caSortants / 1000).toFixed(0)}k€</p>
                  <p className="text-sm text-gray-600">CA perdu ce mois</p>
                  <p className="text-xs text-red-600">↗ {Math.floor(stats.clientsSortants * 0.1)} départs</p>
                </div>
              </div>
              <div className="h-64 bg-white rounded-lg border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorNouveaux" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorDeparts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `${Math.round(value)}k€`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                      labelStyle={{ color: '#374151', fontWeight: '600' }}
                      formatter={(value: any, name: string) => {
                        const labels = {
                          nouveauxClients: 'CA Nouveaux clients',
                          pipeline: 'Pipeline valorisé', 
                          departsClients: 'CA Perdus'
                        };
                        return [`${Math.round(value)}k€`, labels[name as keyof typeof labels] || name];
                      }}
                      labelFormatter={(label) => {
                        const dataPoint = chartData.find(d => d.name === label);
                        return dataPoint?.fullDate || label;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="departsClients"
                      stackId="1"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorDeparts)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pipeline"
                      stackId="2"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPipeline)"
                    />
                    <Area
                      type="monotone"
                      dataKey="nouveauxClients"
                      stackId="3"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNouveaux)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analyse des Causes de Départ */}
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserX className="w-5 h-5 text-red-600" />
                <span>Causes de Départ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  // Calcul des causes de départ depuis les données clients sortants
                  const causesCount = mockData.sortants.reduce((acc, client) => {
                    const cause = (client as any).causesDepart || 'Autre';
                    acc[cause] = (acc[cause] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const causesArray = Object.entries(causesCount)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5); // Top 5 causes
                  
                  const totalSortants = mockData.sortants.length;
                  
                  return causesArray.map(([cause, count], index) => {
                    const percentage = ((count / totalSortants) * 100).toFixed(0);
                    const impactCA = (count * stats.valeurMoyenneClient * 0.1 / 1000).toFixed(0); // Impact estimé
                    
                    return (
                      <div key={cause} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-red-500' :
                              index === 1 ? 'bg-orange-500' :
                              index === 2 ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {cause.length > 25 ? `${cause.substring(0, 25)}...` : cause}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">{count} clients • {percentage}%</span>
                            <span className="text-xs font-medium text-red-600">-{impactCA}k€</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              
              <div className="mt-4 p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                <div className="text-center">
                  <p className="text-xs text-red-700 font-medium mb-1">💡 Insight Principal</p>
                  <p className="text-sm text-red-800">
                    {(() => {
                      const causesCount = mockData.sortants.reduce((acc, client) => {
                        const cause = (client as any).causesDepart || 'Autre';
                        acc[cause] = (acc[cause] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const topCause = Object.entries(causesCount)
                        .sort(([,a], [,b]) => b - a)[0];
                      
                      const percentage = ((topCause[1] / mockData.sortants.length) * 100).toFixed(0);
                      
                      return `${percentage}% des départs : ${topCause[0]}`;
                    })()}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Action prioritaire identifiée</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <span>Objectifs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">CA croissance mensuel</span>
                  <span className="text-sm font-medium">{(croissanceNetteCA / 1000).toFixed(0)}k€/50k€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((croissanceNetteCA / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Pipeline valorisé</span>
                  <span className="text-sm font-medium">{(previsionChiffre / 1000).toFixed(0)}k€/80k€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((previsionChiffre / 80000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Marge opérationnelle</span>
                  <span className="text-sm font-medium">{(stats.margeOperationnelle * 100).toFixed(0)}%/40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((stats.margeOperationnelle / 0.4) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">ROI acquisition</span>
                  <span className="text-sm font-medium">{roiAcquisition}%/2000%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((parseInt(roiAcquisition) / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Avis Google</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-400 text-xs">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm font-medium">4.8/5.0</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `96%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-1">Excellence maintenue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Composant de modal pour les détails de l'email
  const EmailDetailModal = ({ email, isOpen, onClose }: { email: EmailProspect | null, isOpen: boolean, onClose: () => void }) => {
    if (!email) return null;
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Détail de l'email</span>
              <Badge variant={email.priorite === 'haute' ? 'destructive' : 'secondary'}>
                {email.priorite}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Expéditeur</Label>
                <p className="text-sm">{email.expediteur}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Date de réception</Label>
                <p className="text-sm">{email.dateReception}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Objet</Label>
              <p className="text-sm font-medium">{email.objet}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Contenu</Label>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                {email.contenu}
              </div>
            </div>
            
            {email.pieces_jointes && email.pieces_jointes.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Pièces jointes</Label>
                <div className="flex space-x-2 mt-1">
                  {email.pieces_jointes.map((piece, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {piece}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {email.score_ia && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Score IA de qualification</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${email.score_ia >= 80 ? 'bg-green-500' : email.score_ia >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${email.score_ia}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{email.score_ia}/100</span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 pt-4 border-t">
              <Button 
                onClick={() => {
                  setSelectedEmail(email);
                  setIsCreateProspectOpen(true);
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Créer Prospect
              </Button>
              <Button variant="outline">
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Répondre
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Composant de modal pour visualiser l'email de contact d'un prospect
  const ProspectEmailModal = ({ prospect, isOpen, onClose }: { prospect: ProspectClient | null, isOpen: boolean, onClose: () => void }) => {
    if (!prospect?.contacts?.mail) return null;
    
    const email = prospect.contacts.mail;
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Email de contact - {prospect.nom}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Informations de l'email */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">De:</p>
                    <p className="text-sm text-gray-900">{email.expediteur}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Date:</p>
                    <p className="text-sm text-gray-900">{email.date}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Objet:</p>
                  <p className="text-sm text-gray-900">{email.titre}</p>
                </div>
              </div>
            </div>

            {/* Contenu de l'email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Contenu de l'email:</Label>
              <div className="p-4 bg-white border rounded-lg min-h-[200px]">
                <div className="text-sm text-gray-800 whitespace-pre-line">
                  {email.contenu}
                </div>
              </div>
            </div>

            {/* Statut et actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Badge variant={email.status === 'recu' ? 'default' : 'secondary'}>
                  {email.status === 'recu' ? 'Email reçu' : email.status}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Répondre
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Composant de modal pour créer un prospect directement
  const CreateProspectDirectModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      entreprise: '',
      secteur: '',
      chiffreAffaires: '',
      dateEcheance: '',
      remarque: '',
      canal: 'Prospection directe'
    });

    const handleSubmit = () => {
      // Ici on ajouterait le prospect aux données réelles
      console.log('Nouveau prospect créé:', formData);
      // Reset form
      setFormData({
        nom: '', prenom: '', email: '', telephone: '', entreprise: '', 
        secteur: '', chiffreAffaires: '', dateEcheance: '', remarque: '', 
        canal: 'Prospection directe'
      });
      onClose();
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Créer un nouveau prospect</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom*</Label>
                <Input 
                  id="nom" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input 
                  id="prenom" 
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  placeholder="Prénom du contact"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@entreprise.com"
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input 
                  id="telephone" 
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  placeholder="+32 XXX XX XX XX"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entreprise">Entreprise*</Label>
                <Input 
                  id="entreprise" 
                  value={formData.entreprise}
                  onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label htmlFor="secteur">Secteur d'activité</Label>
                <Select value={formData.secteur} onValueChange={(value) => setFormData({...formData, secteur: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="industrie">Industrie</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="immobilier">Immobilier</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="sante">Santé</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="technologie">Technologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ca">Chiffre d'affaires estimé (€)</Label>
                <Input 
                  id="ca" 
                  type="number" 
                  value={formData.chiffreAffaires}
                  onChange={(e) => setFormData({...formData, chiffreAffaires: e.target.value})}
                  placeholder="25000"
                />
              </div>
              <div>
                <Label htmlFor="echeance">Date d'échéance</Label>
                <Input 
                  id="echeance" 
                  type="date" 
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData({...formData, dateEcheance: e.target.value})}
                />
              </div>
            </div>
            

            
            <div>
              <Label htmlFor="remarque">Remarques / Notes</Label>
              <Textarea 
                id="remarque" 
                value={formData.remarque}
                onChange={(e) => setFormData({...formData, remarque: e.target.value})}
                placeholder="Informations complémentaires, contexte du contact..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={!formData.nom || !formData.email || !formData.entreprise}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Créer le prospect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Composant de modal pour créer un prospect depuis un email
  const CreateProspectModal = ({ email, isOpen, onClose }: { email: EmailProspect | null, isOpen: boolean, onClose: () => void }) => {
    const prospect = email?.prospect_extrait;
    
    const [formData, setFormData] = useState({
      nom: prospect?.nom || '',
      email: prospect?.email || email?.expediteur || '',
      telephone: prospect?.telephone || '',
      entreprise: prospect?.entreprise || '',
      secteur: prospect?.secteur || '',
      chiffreAffaires: prospect?.chiffreAffaires?.toString() || '',
      dateEcheance: '',
      remarque: email?.contenu || '',
      canal: 'Email entrant'
    });

    // Mettre à jour le formData quand l'email change
    React.useEffect(() => {
      if (email) {
        const p = email.prospect_extrait;
        setFormData({
          nom: p?.nom || '',
          email: p?.email || email.expediteur || '',
          telephone: p?.telephone || '',
          entreprise: p?.entreprise || '',
          secteur: p?.secteur || '',
          chiffreAffaires: p?.chiffreAffaires?.toString() || '',
          dateEcheance: '',
          remarque: email.contenu || '',
          canal: 'Email entrant'
        });
      }
    }, [email]);

    const handleSubmit = () => {
      // Créer le prospect
      console.log('Prospect créé depuis email:', formData);
      
      // Marquer l'email comme traité
      if (email) {
        const updatedEmails = emailsToProcess.map(e => 
          e.id === email.id ? {...e, statut: 'traite' as const} : e
        );
        setEmailsToProcess(updatedEmails);
      }
      
      onClose();
    };
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Créer un prospect depuis l'email</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700">📧 Email source:</p>
              <p className="text-sm text-blue-600">{email?.expediteur} - {email?.objet}</p>
              {email?.score_ia && (
                <p className="text-xs text-blue-500">Score IA: {email.score_ia}/100</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom complet*</Label>
                <Input 
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="Nom du contact"
                />
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@entreprise.com"
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input 
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  placeholder="+32 XXX XX XX XX"
                />
              </div>
              <div>
                <Label htmlFor="entreprise">Entreprise</Label>
                <Input 
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label htmlFor="secteur">Secteur d'activité</Label>
                <Select value={formData.secteur} onValueChange={(value) => setFormData({...formData, secteur: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="industrie">Industrie</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="immobilier">Immobilier</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="sante">Santé</SelectItem>
                    <SelectItem value="education">Éducation</SelectItem>
                    <SelectItem value="technologie">Technologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ca">Chiffre d'affaires estimé (€)</Label>
                <Input 
                  id="ca"
                  type="number"
                  value={formData.chiffreAffaires}
                  onChange={(e) => setFormData({...formData, chiffreAffaires: e.target.value})}
                  placeholder="25000"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="remarque">Contexte / Notes de l'email</Label>
              <Textarea 
                id="remarque"
                value={formData.remarque}
                onChange={(e) => setFormData({...formData, remarque: e.target.value})}
                placeholder="Contexte extrait de l'email..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={!formData.nom || !formData.email}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Créer le prospect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Composant de modal pour créer un plan d'action
  const PlanActionModal = ({ client, clientType, isOpen, onClose }: {
    client: any | null,
    clientType: 'suivre' | 'partance',
    isOpen: boolean,
    onClose: () => void
  }) => {
    const [formData, setFormData] = useState({
      titre: '',
      description: '',
      objectif: '',
      priorite: 'moyenne' as 'haute' | 'moyenne' | 'basse',
      responsable: '',
      dateEcheance: '',
      actions: [
        { id: '1', description: '', responsable: '', dateEcheance: '', statut: 'a_faire' as const }
      ]
    });

    const gestionnaires = ['Soufiane Essebaly', 'Adrien Pochet', 'Djamant Hysenaj', 'Pauline Coster', 'Valentine Caprasse'];

    const addAction = () => {
      setFormData(prev => ({
        ...prev,
        actions: [
          ...prev.actions,
          { 
            id: Date.now().toString(), 
            description: '', 
            responsable: '', 
            dateEcheance: '', 
            statut: 'a_faire' as const 
          }
        ]
      }));
    };

    const removeAction = (actionId: string) => {
      setFormData(prev => ({
        ...prev,
        actions: prev.actions.filter(action => action.id !== actionId)
      }));
    };

    const updateAction = (actionId: string, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        actions: prev.actions.map(action => 
          action.id === actionId ? { ...action, [field]: value } : action
        )
      }));
    };

    const handleSubmit = () => {
      const newPlan: PlanAction = {
        id: `PLAN-${Date.now()}`,
        clientId: client?.id || '',
        clientNom: client?.nom || '',
        clientType,
        titre: formData.titre,
        description: formData.description,
        objectif: formData.objectif,
        priorite: formData.priorite,
        responsable: formData.responsable,
        dateCreation: new Date().toISOString().split('T')[0],
        dateEcheance: formData.dateEcheance,
        statut: 'brouillon',
        actions: formData.actions.filter(action => action.description.trim() !== '')
      };

      console.log('🎯 Plan d\'action créé:', newPlan);
      alert(`Plan d'action créé pour ${client?.nom} !\n\nType: ${clientType === 'suivre' ? 'Client à suivre' : 'Client en partance'}\nTitre: ${formData.titre}\nActions: ${newPlan.actions.length}`);
      
      // Reset form
      setFormData({
        titre: '',
        description: '',
        objectif: '',
        priorite: 'moyenne',
        responsable: '',
        dateEcheance: '',
        actions: [{ id: '1', description: '', responsable: '', dateEcheance: '', statut: 'a_faire' }]
      });
      
      onClose();
    };

    const getPrioriteColor = (priorite: string) => {
      switch (priorite) {
        case 'haute': return 'bg-red-100 text-red-700 border-red-200';
        case 'moyenne': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'basse': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    if (!client) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              <div>
                <span>Créer un plan d'action</span>
                <p className="text-sm font-normal text-gray-600">
                  Pour {client.nom} • {clientType === 'suivre' ? 'Client à suivre' : 'Client en partance'}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titre">Titre du plan *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  placeholder={clientType === 'suivre' ? 'Plan de suivi renforcé' : 'Plan de récupération client'}
                />
              </div>
              <div>
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={formData.priorite} onValueChange={(value: 'haute' | 'moyenne' | 'basse') => 
                  setFormData(prev => ({ ...prev, priorite: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haute">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Haute priorité</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="moyenne">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Priorité moyenne</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="basse">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Basse priorité</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="objectif">Objectif du plan *</Label>
              <Textarea
                id="objectif"
                value={formData.objectif}
                onChange={(e) => setFormData(prev => ({ ...prev, objectif: e.target.value }))}
                placeholder={clientType === 'suivre' 
                  ? 'Maintenir la relation client et prévenir les risques de départ...'
                  : 'Récupérer le client et l\'empêcher de partir chez un concurrent...'
                }
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Description du contexte</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Contexte, enjeux, éléments importants à retenir..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsable">Responsable du plan *</Label>
                <Select value={formData.responsable} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, responsable: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {gestionnaires.map(gest => (
                      <SelectItem key={gest} value={gest}>{gest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateEcheance">Date d'échéance *</Label>
                <Input
                  id="dateEcheance"
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateEcheance: e.target.value }))}
                />
              </div>
            </div>

            {/* Actions du plan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <TargetIcon className="w-5 h-5 text-blue-600" />
                  <span>Actions à réaliser</span>
                </h3>
                <Button onClick={addAction} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une action
                </Button>
              </div>

              {formData.actions.map((action, index) => (
                <Card key={action.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Action {index + 1}</Label>
                      {formData.actions.length > 1 && (
                        <Button 
                          onClick={() => removeAction(action.id)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      value={action.description}
                      onChange={(e) => updateAction(action.id, 'description', e.target.value)}
                      placeholder="Décrire l'action à réaliser..."
                      rows={2}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Responsable</Label>
                        <Select value={action.responsable} onValueChange={(value) => 
                          updateAction(action.id, 'responsable', value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {gestionnaires.map(gest => (
                              <SelectItem key={gest} value={gest}>{gest}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Échéance</Label>
                        <Input
                          type="date"
                          value={action.dateEcheance}
                          onChange={(e) => updateAction(action.id, 'dateEcheance', e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Résumé */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">Résumé du plan</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Client :</span> 
                        <span className="ml-2 font-medium">{client.nom}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Type :</span> 
                        <span className="ml-2">{clientType === 'suivre' ? 'À suivre' : 'En partance'}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Actions :</span> 
                        <span className="ml-2">{formData.actions.filter(a => a.description.trim()).length}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Priorité :</span> 
                        <Badge className={`ml-2 ${getPrioriteColor(formData.priorite)}`}>
                          {formData.priorite.charAt(0).toUpperCase() + formData.priorite.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.titre || !formData.objectif || !formData.responsable || !formData.dateEcheance}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Créer le plan d'action
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Composant de modal pour les actions de contact
  const ContactActionModal = ({ action, isOpen, onClose, onSave }: { 
    action: ContactAction | null, 
    isOpen: boolean, 
    onClose: () => void,
    onSave?: (contactData: any) => void 
  }) => {
    const [satisfaction, setSatisfaction] = useState<number>(action?.satisfaction || 0);
    const [isCompleted, setIsCompleted] = useState(action?.status === 'completed' || false);
    
    const renderStarRating = () => {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Note de satisfaction</Label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSatisfaction(star)}
                className={`text-2xl transition-colors ${
                  star <= satisfaction 
                    ? 'text-yellow-400 hover:text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                ⭐
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {satisfaction > 0 ? `${satisfaction}/5` : 'Non évalué'}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="completed"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="completed" className="text-sm">
              Marquer comme terminé (permet d'activer l'indicateur vert)
            </Label>
          </div>
        </div>
      );
    };
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {action?.type === 'appel' && <Phone className="w-5 h-5 text-purple-600" />}
              {action?.type === 'rdv' && <CalendarIcon className="w-5 h-5 text-orange-600" />}
              {action?.type === 'mail' && <Mail className="w-5 h-5 text-green-600" />}
              {action?.type === 'note' && <FileText className="w-5 h-5 text-gray-600" />}
              <span>{action?.titre}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre de l'action</Label>
              <Input id="titre" defaultValue={action?.titre || ''} />
            </div>
            
            {action?.type === 'rdv' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="duree">Durée (min)</Label>
                  <Input id="duree" type="number" defaultValue="60" />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="description">Description / Contact</Label>
              <Textarea 
                id="description" 
                placeholder="eu mme et lui ai expliqué la manière dont sont répartis les droits d'auteurs, est salariée et viendra vers nous pour sa décla employé"
                defaultValue={action?.description || ''} 
                rows={4}
              />
            </div>
            
            {renderStarRating()}
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button 
                className={`${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => {
                  // Sauvegarder les données du contact
                  if (action && onSave && isCompleted) {
                    const contactData = {
                      ...action,
                      satisfaction: satisfaction,
                      status: 'completed' as const,
                      date: new Date().toISOString().split('T')[0]
                    };
                    onSave(contactData);
                  } else {
                    onClose();
                  }
                }}
              >
                {isCompleted ? '✅ Valider Contact' : '📝 Enregistrer Note'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Fonction pour rendre les prospects avec KPI et design Web 3.0
  const renderProspectsWithKPI = () => {
    // Calculs KPI dynamiques pour les prospects
    const prospects = mockData.prospects;
    const totalCA = prospects.reduce((sum, p) => sum + (p.chiffreAffaires || 0), 0);
    const moyenneCA = Math.round(totalCA / prospects.length);
    const topProspects = prospects.filter(p => (p.chiffreAffaires || 0) > moyenneCA * 1.5);
    const prospectsContactes = prospects.filter(p => p.contacts && Object.keys(p.contacts).length > 0);
    const tauxContact = Math.round((prospectsContactes.length / prospects.length) * 100);
    const prospectsConvertis = prospects.filter(p => p.statut === 'converti');
    const tauxConversion = Math.round((prospectsConvertis.length / prospects.length) * 100);
    const satisfactionMoyenne = prospectsContactes.reduce((sum, p) => {
      const contacts = Object.values(p.contacts || {});
      const satisfactions = contacts.map(c => c?.satisfaction || 0).filter(s => s > 0);
      return sum + (satisfactions.length > 0 ? satisfactions.reduce((a, b) => a + b, 0) / satisfactions.length : 0);
    }, 0) / (prospectsContactes.length || 1);

    const prospectsParStatut = prospects.reduce((acc, p) => {
      acc[p.statut] = (acc[p.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);



    return (
      <div className="space-y-4">
        {/* Header fonctionnel avec KPI essentiels seulement */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* KPI 1: Pipeline Value - essentiel pour prioriser */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Pipeline Total</p>
                  <p className="text-xl font-bold text-gray-900">{(totalCA / 1000).toFixed(0)}k€</p>
                  <p className="text-xs text-gray-500">{prospects.length} prospects actifs</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: Taux de Contact - essentiel pour le suivi */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Taux Contact</p>
                  <p className="text-xl font-bold text-gray-900">{tauxContact}%</p>
                  <p className="text-xs text-gray-500">{prospectsContactes.length} contactés / {prospects.length}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Taux de Conversion - essentiel pour la performance */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Taux Conversion</p>
                  <p className="text-xl font-bold text-gray-900">{tauxConversion}%</p>
                  <p className="text-xs text-gray-500">{prospectsConvertis.length} convertis / {prospects.length}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides - fonctionnel */}
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsCreateProspectDirectOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nouveau
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 relative"
                    onClick={() => setShowEmails(true)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Email
                    {emailsToProcess.filter(e => e.statut === 'nouveau').length > 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {emailsToProcess.filter(e => e.statut === 'nouveau').length}
                      </Badge>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {topProspects.length > 0 
                    ? `🎯 ${topProspects.length} prospects > ${(moyenneCA * 1.5 / 1000).toFixed(0)}k€`
                    : `✅ ${prospectsContactes.length} prospects contactés`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des prospects - focus principal */}
        {renderDataTable(mockData.prospects, 'prospects')}
        
        {/* Modal de création directe de prospect */}
        <CreateProspectDirectModal 
          isOpen={isCreateProspectDirectOpen} 
          onClose={() => setIsCreateProspectDirectOpen(false)} 
        />
      </div>
    );
  };

  const renderClientsEntrants = () => {
    // Calculs KPI pour les clients entrants avec statut calculé dynamiquement
    const dossiersNonAttribues = localEntrants.filter(e => !e.presentationGestionnaire).length;
    const montantTotalAnneeEnCours = localEntrants.reduce((sum, e) => sum + e.montantAnneeEnCours, 0);
    const montantTotalAnneeProchaine = localEntrants.reduce((sum, e) => sum + e.montantAnneeProchaine, 0);
    
    // Calcul des contacts en retard
    const aujourdhui = new Date();
    const contactsEnRetard = localEntrants.filter(client => {
      if (!client.suiviContacts) return false;
      
      const contact1MoisDue = new Date(client.suiviContacts.contact1Mois.datePrevue.split('/').reverse().join('-'));
      const contact9MoisDue = new Date(client.suiviContacts.contact9Mois.datePrevue.split('/').reverse().join('-'));
      
      const retard1Mois = contact1MoisDue < aujourdhui && !client.suiviContacts.contact1Mois.effectue;
      const retard9Mois = contact9MoisDue < aujourdhui && !client.suiviContacts.contact9Mois.effectue;
      
      return retard1Mois || retard9Mois;
    }).length;
    
    // Filtrage des clients selon la recherche
    const clientsFiltres = localEntrants.filter(client => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        client.nom.toLowerCase().includes(query) ||
        client.idClient.toLowerCase().includes(query) ||
        client.secteur?.toLowerCase().includes(query)
      );
    });
    
    // Statistiques par statut calculé (basées sur tous les clients, pas seulement filtrés)
    const statsParStatut = localEntrants.reduce((stats, client) => {
      const statut = calculateStatut(client);
      stats[statut] = (stats[statut] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    return (
      <div className="space-y-4">
        {/* Barre de recherche et actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher un client par nom ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
          <Button 
            onClick={reloadEntrantsData} 
            variant="outline" 
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            🔄 Recharger les données de suivi
          </Button>
        </div>
        
        {/* KPI Dashboard pour Clients Entrants */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* KPI 1: Dossiers Non-Attribués */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Dossiers Non-Attribués</p>
                  <p className="text-xl font-bold text-gray-900">{dossiersNonAttribues}</p>
                  <p className="text-xs text-gray-500">Sans gestionnaire assigné</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: Montant Année en Cours */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Année en Cours</p>
                  <p className="text-xl font-bold text-gray-900">{(montantTotalAnneeEnCours / 1000).toFixed(0)}k€</p>
                  <p className="text-xs text-gray-500">CA 2025 estimé</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Montant Année Prochaine */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Année Prochaine</p>
                  <p className="text-xl font-bold text-gray-900">{(montantTotalAnneeProchaine / 1000).toFixed(0)}k€</p>
                  <p className="text-xs text-gray-500">CA 2026 estimé</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 4: Contacts en Retard */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Contacts en Retard</p>
                  <p className="text-xl font-bold text-gray-900">{contactsEnRetard}</p>
                  <p className="text-xs text-gray-500">Suivi 1M/9M manqué</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau en deux parties */}
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  💡 <strong>Statut automatique :</strong> Calculé selon l'avancement - 
                  <span className="text-blue-600"> Offre envoyée</span> → 
                  <span className="text-blue-600"> Offre signée</span> (RDV) → 
                  <span className="text-orange-600"> Présentation GD</span> → 
                  <span className="text-purple-600"> Mandats activés</span> (APP Démo) → 
                  <span className="text-green-600"> Onboarding terminé</span> (Mise en place)
                </div>
                {searchQuery && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {clientsFiltres.length} résultat{clientsFiltres.length > 1 ? 's' : ''} trouvé{clientsFiltres.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <div>
                📞 <strong>Suivi automatique :</strong> Contact obligatoire à 
                <span className="text-blue-600">1 mois</span> et 
                <span className="text-purple-600">9 mois</span> après l'arrivée du client - 
                <span className="text-red-600">Rouge = en retard</span>, 
                <span className="text-blue-600">Bleu = à venir</span>, 
                <span className="text-green-600">Vert = effectué</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-700">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-700">Canal</th>
                    <th className="text-left p-4 font-medium text-gray-700">LM Envoyée</th>
                    <th className="text-left p-4 font-medium text-gray-700">RDV</th>
                    <th className="text-left p-4 font-medium text-gray-700">Présentation Gestionnaire</th>
                    <th className="text-left p-4 font-medium text-gray-700">APP Démo</th>
                    <th className="text-left p-4 font-medium text-gray-700">Mise en Place</th>
                    <th className="text-left p-4 font-medium text-gray-700">Suivi Contacts</th>
                    <th className="text-left p-4 font-medium text-gray-700">Forfait Démarrage</th>
                    <th className="text-left p-4 font-medium text-gray-700">Année en Cours</th>
                    <th className="text-left p-4 font-medium text-gray-700">Année Prochaine</th>
                    <th className="text-left p-4 font-medium text-gray-700">Budgétisation</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-gray-900">{item.nom}</p>
                            <p className="text-xs text-blue-600 font-mono">{item.idClient}</p>
                            <p className="text-sm text-gray-500">{item.secteur || 'Secteur non défini'}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              // Navigation vers la fiche client en utilisant React Router
                              navigate(`/clients/detail/${item.id}`);
                            }}
                            title="Accès à la fiche client"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        {(() => {
                          const calculatedStatus = calculateStatut(item);
                          return (
                            <Badge 
                              variant={
                                calculatedStatus === 'onboarding terminé' ? 'default' :
                                calculatedStatus === 'offre signée' ? 'default' :
                                calculatedStatus === 'mandats activés' ? 'secondary' :
                                calculatedStatus === 'présentation GD' ? 'outline' :
                                'secondary'
                              }
                              className={`text-xs ${
                                calculatedStatus === 'onboarding terminé' ? 'bg-green-100 text-green-700' :
                                calculatedStatus === 'offre signée' ? 'bg-blue-100 text-blue-700' :
                                calculatedStatus === 'mandats activés' ? 'bg-purple-100 text-purple-700' :
                                calculatedStatus === 'présentation GD' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {calculatedStatus}
                            </Badge>
                          );
                        })()}
                      </td>
                      <td className="p-4">
                        <Select 
                          value={item.canal}
                          onValueChange={(value) => updateClientEntrant(item.id, 'canal', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {canauxEntrants.map(canal => (
                              <SelectItem key={canal} value={canal}>{canal}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={item.lmEnvoyee}
                            onChange={(e) => updateClientEntrant(item.id, 'lmEnvoyee', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <Input 
                          type="date" 
                          className="w-32 text-xs"
                          value={item.rdvDate ? item.rdvDate.split('/').reverse().join('-') : ''}
                          onChange={(e) => {
                            const newDate = e.target.value ? e.target.value.split('-').reverse().join('/') : null;
                            updateClientEntrant(item.id, 'rdvDate', newDate);
                          }}
                          placeholder="Programmer RDV"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={item.presentationGestionnaire}
                            onChange={(e) => updateClientEntrant(item.id, 'presentationGestionnaire', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={item.appDemo}
                            onChange={(e) => updateClientEntrant(item.id, 'appDemo', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={item.miseEnPlace}
                            onChange={(e) => updateClientEntrant(item.id, 'miseEnPlace', e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        {item.suiviContacts && (
                          <div className="space-y-2">
                            {/* Contact 1 mois */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600">1M:</span>
                              {item.suiviContacts.contact1Mois.effectue ? (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                                  ✓ {item.suiviContacts.contact1Mois.dateEffectuee}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className={`text-xs ${
                                  new Date(item.suiviContacts.contact1Mois.datePrevue.split('/').reverse().join('-')) < new Date() 
                                    ? 'bg-red-100 text-red-700 border-red-200' 
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                }`}>
                                  ⏰ {item.suiviContacts.contact1Mois.datePrevue}
                                </Badge>
                              )}
                              {!item.suiviContacts.contact1Mois.effectue && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 p-1"
                                  onClick={() => {
                                    const updatedSuivi = {
                                      ...item.suiviContacts,
                                      contact1Mois: {
                                        ...item.suiviContacts.contact1Mois,
                                        effectue: true,
                                        dateEffectuee: new Date().toLocaleDateString('fr-FR')
                                      }
                                    };
                                    updateClientEntrant(item.id, 'suiviContacts', updatedSuivi);
                                  }}
                                  title="Marquer comme effectué"
                                >
                                  ✓
                                </Button>
                              )}
                            </div>
                            
                            {/* Contact 9 mois */}
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600">9M:</span>
                              {item.suiviContacts.contact9Mois.effectue ? (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                                  ✓ {item.suiviContacts.contact9Mois.dateEffectuee}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className={`text-xs ${
                                  new Date(item.suiviContacts.contact9Mois.datePrevue.split('/').reverse().join('-')) < new Date() 
                                    ? 'bg-red-100 text-red-700 border-red-200' 
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                }`}>
                                  ⏰ {item.suiviContacts.contact9Mois.datePrevue}
                                </Badge>
                              )}
                              {!item.suiviContacts.contact9Mois.effectue && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 p-1"
                                  onClick={() => {
                                    const updatedSuivi = {
                                      ...item.suiviContacts,
                                      contact9Mois: {
                                        ...item.suiviContacts.contact9Mois,
                                        effectue: true,
                                        dateEffectuee: new Date().toLocaleDateString('fr-FR')
                                      }
                                    };
                                    updateClientEntrant(item.id, 'suiviContacts', updatedSuivi);
                                  }}
                                  title="Marquer comme effectué"
                                >
                                  ✓
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.forfaitDemarrage.toLocaleString()}€
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.montantAnneeEnCours.toLocaleString()}€
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.montantAnneeProchaine.toLocaleString()}€
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`text-sm font-medium ${
                            item.budgetisation === 100 ? 'text-green-600' :
                            item.budgetisation >= 67 ? 'text-orange-600' :
                            item.budgetisation >= 33 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {item.budgetisation}%
                          </div>
                          <div className="flex space-x-1">
                            <div className={`w-2 h-2 rounded-full ${item.budgetDetails.volumetrie ? 'bg-green-400' : 'bg-gray-300'}`} title="Volumétrie"></div>
                            <div className={`w-2 h-2 rounded-full ${item.budgetDetails.horaire ? 'bg-green-400' : 'bg-gray-300'}`} title="Horaire"></div>
                            <div className={`w-2 h-2 rounded-full ${item.budgetDetails.economique ? 'bg-green-400' : 'bg-gray-300'}`} title="Économique"></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {/* Bouton Voir détails */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              console.log('Voir détails client entrant:', item);
                            }}
                            title="Voir détails du client"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {/* Bouton Email */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'mail',
                                titre: `Email à ${item.nom}`,
                                description: `Contact commercial avec ${item.nom}`,
                                participant: item.email,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: 0,
                                status: 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          
                                                     {/* Bouton Téléphone */}
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className={`${
                               item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4
                                 ? 'bg-green-600 text-white hover:bg-green-700'
                                 : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                             }`}
                             onClick={() => {
                               setSelectedContactAction({
                                 type: 'appel',
                                 titre: `Appel avec ${item.nom}`,
                                 description: `Appel commercial - ${item.telephone}`,
                                 participant: item.telephone,
                                 date: new Date().toISOString().split('T')[0],
                                 satisfaction: item.contacts?.appel?.satisfaction || 0,
                                 status: item.contacts?.appel?.status || 'pending'
                               });
                               setIsContactModalOpen(true);
                             }}
                           >
                             <Phone className="w-4 h-4" />
                             {item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4 && (
                               <span className="ml-1 text-xs">⭐{item.contacts.appel.satisfaction}</span>
                             )}
                           </Button>
                          
                          {/* Bouton RDV */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'rdv',
                                titre: `RDV avec ${item.nom}`,
                                description: `Rendez-vous commercial`,
                                participant: item.nom,
                                date: new Date().toISOString().split('T')[0],
                                duree: 60,
                                satisfaction: item.contacts?.rdv?.satisfaction || 0,
                                status: item.contacts?.rdv?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            {item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.rdv.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Note */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'note',
                                titre: `Note sur ${item.nom}`,
                                description: 'Ajouter une note...',
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.note?.satisfaction || 0,
                                status: item.contacts?.note?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.note.satisfaction}</span>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de contact */}
        <ContactActionModal 
          action={selectedContactAction} 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)}
          onSave={(contactData) => {
            // Trouver le client et mettre à jour ses contacts
            const currentClientId = clientsFiltres.find(client => 
              selectedContactAction?.participant === client.telephone || 
              selectedContactAction?.participant === client.nom
            )?.id;
            
            if (currentClientId && contactData.status === 'completed') {
              setLocalEntrants(prev => 
                prev.map(client => {
                  if (client.id === currentClientId) {
                    const updatedContacts = {
                      ...client.contacts,
                      [contactData.type]: contactData
                    };
                    console.log(`✅ Contact ${contactData.type} sauvegardé pour ${client.nom} avec satisfaction ${contactData.satisfaction}`);
                    return { ...client, contacts: updatedContacts };
                  }
                  return client;
                })
              );
            }
            setIsContactModalOpen(false);
          }}
        />
      </div>
    );
  };

  const renderClientsASuivre = () => {
    const clientsASuivre = mockData.suivre;
    
    // Filtrage des clients selon la recherche
    const clientsFiltres = clientsASuivre.filter(client => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        client.nom.toLowerCase().includes(query) ||
        client.idClient?.toLowerCase().includes(query) ||
        client.secteur?.toLowerCase().includes(query) ||
        client.statut.toLowerCase().includes(query)
      );
    });
    
    // Calculs KPI pour les clients à suivre
    const totalClients = clientsASuivre.length;
    const caBudgete = clientsASuivre.reduce((sum, client) => sum + (client.caBudgete || 0), 0);
    const contactsEffectues = clientsASuivre.filter(client => 
      client.contacts && Object.values(client.contacts).some(contact => contact.status === 'completed')
    ).length;
    
    return (
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher un client par nom ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
        </div>
        
        {/* KPI Dashboard pour Clients à Suivre */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* KPI 1: Nombre de Clients */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Nombre de Clients</p>
                  <p className="text-xl font-bold text-gray-900">{totalClients}</p>
                  <p className="text-xs text-gray-500">Clients à suivre</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: CA Budgété */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">CA Budgété</p>
                  <p className="text-xl font-bold text-gray-900">{(caBudgete / 1000).toFixed(0)}k€</p>
                  <p className="text-xs text-gray-500">Chiffre d'affaires total</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Contacts Effectués */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Contacts Effectués</p>
                  <p className="text-xl font-bold text-gray-900">{contactsEffectues}</p>
                  <p className="text-xs text-gray-500">{totalClients > 0 ? Math.round((contactsEffectues / totalClients) * 100) : 0}% du portefeuille</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des clients à suivre */}
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  📋 <strong>Clients à suivre :</strong> Clients paramêtrés "à risque" dans leur fiche OU clients "récupérés" après avoir été en partance
                </div>
                {searchQuery && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {clientsFiltres.length} résultat{clientsFiltres.length > 1 ? 's' : ''} trouvé{clientsFiltres.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-700">GD</th>
                    <th className="text-left p-4 font-medium text-gray-700">RDV Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Statut</th>
                    <th className="text-left p-4 font-medium text-gray-700">CA Budgété</th>
                    <th className="text-left p-4 font-medium text-gray-700">Commentaire</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-gray-900">{item.nom}</p>
                            <p className="text-xs text-blue-600 font-mono">{item.idClient}</p>
                            <p className="text-sm text-gray-500">{item.secteur || 'Secteur non défini'}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/clients/detail/${item.id}`)}
                            title="Accès à la fiche client"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">
                          {item.gestionnaire || 'Non assigné'}
                        </div>
                      </td>
                      <td className="p-4">
                        <Input 
                          type="date" 
                          className="w-32 text-xs"
                          value={item.rdvDate ? item.rdvDate.split('/').reverse().join('-') : ''}
                          onChange={(e) => {
                            const newDate = e.target.value ? e.target.value.split('-').reverse().join('/') : null;
                            // Ici on pourrait ajouter la logique de mise à jour
                            console.log(`RDV Date updated for ${item.nom}: ${newDate}`);
                          }}
                          placeholder="Programmer RDV"
                        />
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            item.statut === 'Client a risque' ? 'bg-red-100 text-red-700 border-red-200' :
                            item.statut === 'Recupere' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          {item.statut === 'Recupere' ? 'Récupéré' : item.statut}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900">
                          {(item.caBudgete || 0).toLocaleString()}€
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <Textarea 
                            className="text-xs resize-none"
                            rows={2}
                            value={item.commentaire || ''}
                            onChange={(e) => {
                              // Ici on pourrait ajouter la logique de mise à jour
                              console.log(`Comment updated for ${item.nom}: ${e.target.value}`);
                            }}
                            placeholder="Ajouter un commentaire..."
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {/* Bouton Email */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.mail?.status === 'completed' && item.contacts.mail.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'mail',
                                titre: `Email à ${item.nom}`,
                                description: `Contact par email`,
                                participant: item.email || `contact@${item.nom.toLowerCase().replace(/\s+/g, '')}.com`,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.mail?.satisfaction || 0,
                                status: item.contacts?.mail?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Mail className="w-4 h-4" />
                            {item.contacts?.mail?.status === 'completed' && item.contacts.mail.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.mail.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Téléphone */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'appel',
                                titre: `Appel avec ${item.nom}`,
                                description: `Appel de suivi`,
                                participant: item.telephone || `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.appel?.satisfaction || 0,
                                status: item.contacts?.appel?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Phone className="w-4 h-4" />
                            {item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.appel.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton RDV */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'rdv',
                                titre: `RDV avec ${item.nom}`,
                                description: `Rendez-vous de suivi`,
                                participant: item.nom,
                                date: new Date().toISOString().split('T')[0],
                                duree: 60,
                                satisfaction: item.contacts?.rdv?.satisfaction || 0,
                                status: item.contacts?.rdv?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            {item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.rdv.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Note */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'note',
                                titre: `Note sur ${item.nom}`,
                                description: 'Ajouter une note de suivi...',
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.note?.satisfaction || 0,
                                status: item.contacts?.note?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.note.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Plan d'action */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedClientForPlan(item);
                              setClientType('suivre');
                              setIsPlanActionModalOpen(true);
                            }}
                            title="Créer un plan d'action"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de contact */}
        <ContactActionModal 
          action={selectedContactAction} 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
        />
        
        {/* Modal de plan d'action */}
        <PlanActionModal 
          client={selectedClientForPlan}
          clientType={clientType}
          isOpen={isPlanActionModalOpen}
          onClose={() => {
            setIsPlanActionModalOpen(false);
            setSelectedClientForPlan(null);
          }}
        />
      </div>
    );
  };

  // État local pour les clients sortants
  const [localSortants, setLocalSortants] = useState(() => mockData.sortants);

  // Fonction pour mettre à jour un client sortant
  const updateClientSortant = (clientId: string, field: string, value: any) => {
    setLocalSortants(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, [field]: value }
        : client
    ));
  };

  // Fonction pour rendre le contenu des clients sortants
  const renderClientsSortants = () => {
    const clientsFiltres = localSortants.filter(client => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        client.nom.toLowerCase().includes(searchLower) ||
        (client.idClient && client.idClient.toLowerCase().includes(searchLower)) ||
        ((client as any).secteur && (client as any).secteur.toLowerCase().includes(searchLower))
      );
    });

    // Calcul des KPI
    const nombreClients = clientsFiltres.length;
    const caPerdu = clientsFiltres.reduce((sum, c) => sum + (c.chiffreAffaires || 0), 0);
    const causePrincipale = (() => {
      const causes = clientsFiltres.reduce((acc, client) => {
        const cause = (client as any).causesDepart || 'Non spécifiée';
        acc[cause] = (acc[cause] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(causes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Non spécifiée';
    })();
    const impactMoyen = nombreClients > 0 ? caPerdu / nombreClients : 0;

    return (
      <div className="space-y-6">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Clients Perdus</p>
                  <p className="text-xl font-bold text-gray-900">{nombreClients}</p>
                  <p className="text-xs text-gray-500">Total année</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">CA Perdu</p>
                  <p className="text-xl font-bold text-gray-900">{Math.round(caPerdu / 1000)}k€</p>
                  <p className="text-xs text-gray-500">Impact financier</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Cause Principale</p>
                  <p className="text-lg font-bold text-gray-900">{causePrincipale.substring(0, 15)}...</p>
                  <p className="text-xs text-gray-500">À analyser</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Impact Moyen</p>
                  <p className="text-xl font-bold text-gray-900">{Math.round(impactMoyen / 1000)}k€</p>
                  <p className="text-xs text-gray-500">Par client</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, ID, secteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <Badge variant="outline" className="text-xs">
              {clientsFiltres.length} résultat{clientsFiltres.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Tableau des clients sortants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Clients Sortants {selectedPeriod === 'ytd' ? '2025' : ''}</span>
              <Badge variant="outline">{clientsFiltres.length} clients</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Analyse des départs clients • Causes et impact financier • Leçons apprises
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700">Date Départ</th>
                    <th className="text-left p-3 font-medium text-gray-700">Nom</th>
                    <th className="text-left p-3 font-medium text-gray-700">RDV</th>
                    <th className="text-left p-3 font-medium text-gray-700">Presta</th>
                    <th className="text-left p-3 font-medium text-gray-700">Type Facturation</th>
                    <th className="text-left p-3 font-medium text-gray-700">Indemnités</th>
                    <th className="text-left p-3 font-medium text-gray-700">Cause Départ</th>
                    <th className="text-left p-3 font-medium text-gray-700">Année N-1</th>
                    <th className="text-left p-3 font-medium text-gray-700">Année N</th>
                    <th className="text-left p-3 font-medium text-gray-700">Impact N</th>
                    <th className="text-left p-3 font-medium text-gray-700">Annuel N+1</th>
                    <th className="text-left p-3 font-medium text-gray-700">Remarque</th>
                    <th className="text-center p-3 font-medium text-gray-700">Mandats</th>
                    <th className="text-center p-3 font-medium text-gray-700">Logiciels</th>
                    <th className="text-center p-3 font-medium text-gray-700">Back-up</th>
                    <th className="text-center p-3 font-medium text-gray-700">Facturation Clôturée</th>
                    <th className="text-center p-3 font-medium text-gray-700">Prestations à Faire</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.map((client, index) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">{(client as any).dateDepart?.substring(0, 10) || '--'}</td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{client.nom}</div>
                          <div className="text-xs text-gray-500">{client.idClient}</div>
                          <div className="text-xs text-gray-500">{(client as any).secteur}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Input
                          type="date"
                          value={(client as any).rdvDate || ''}
                          onChange={(e) => {
                            updateClientSortant(client.id, 'rdvDate', e.target.value);
                          }}
                          className="w-32 text-xs"
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-600">{(client as any).presta || '0m'}</td>
                      <td className="p-3 text-sm text-gray-600">{(client as any).typeFacturation || 'En régie'}</td>
                      <td className="p-3 text-sm text-gray-600">{(client as any).indemnites || '0,00€'}</td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-red-50 text-red-700 border-red-200"
                        >
                          {(client as any).causesDepart || 'Non spécifiée'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {((client as any).anneeN1 || 0).toLocaleString()}€
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900">
                        {((client as any).anneeN || 0).toLocaleString()}€
                      </td>
                      <td className="p-3 text-sm font-medium text-red-600">
                        -{((client as any).impactN || 0).toLocaleString()}€
                      </td>
                      <td className="p-3 text-sm font-medium text-red-600">
                        -{((client as any).annuelN1 || 0).toLocaleString()}€
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {(client as any).remarque || '--'}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(client as any).mandats || false}
                          onChange={(e) => {
                            updateClientSortant(client.id, 'mandats', e.target.checked);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(client as any).logiciels || false}
                          onChange={(e) => {
                            updateClientSortant(client.id, 'logiciels', e.target.checked);
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(client as any).backup || false}
                          onChange={(e) => {
                            updateClientSortant(client.id, 'backup', e.target.checked);
                          }}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={(client as any).facturationCloturee || false}
                          onChange={(e) => {
                            updateClientSortant(client.id, 'facturationCloturee', e.target.checked);
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <Switch 
                          checked={(client as any).prestationsAFaire || false}
                          onCheckedChange={(checked) => {
                            updateClientSortant(client.id, 'prestationsAFaire', checked);
                          }}
                          className="data-[state=checked]:bg-red-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Ligne de total */}
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-medium">
                    <td className="p-3 text-sm">--</td>
                    <td className="p-3 text-sm font-bold">TOTAL</td>
                    <td className="p-3 text-sm">--</td>
                    <td className="p-3 text-sm">
                      {clientsFiltres.reduce((sum, c) => {
                        const presta = (c as any).presta || '0m';
                        const match = presta.match(/(\d+)h?\s*(\d+)?m?/);
                        const hours = match ? parseInt(match[1]) || 0 : 0;
                        const minutes = match && match[2] ? parseInt(match[2]) : 0;
                        return sum + hours + (minutes / 60);
                      }, 0).toFixed(0)}h {Math.round(clientsFiltres.reduce((sum, c) => {
                        const presta = (c as any).presta || '0m';
                        const match = presta.match(/(\d+)h?\s*(\d+)?m?/);
                        const minutes = match && match[2] ? parseInt(match[2]) : 0;
                        return sum + minutes;
                      }, 0) % 60)}m
                    </td>
                    <td className="p-3 text-sm">--</td>
                    <td className="p-3 text-sm">
                      {clientsFiltres.reduce((sum, c) => {
                        const indemnites = (c as any).indemnites || '0,00€';
                        const amount = parseFloat(indemnites.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                        return sum + amount;
                      }, 0).toFixed(2)}€
                    </td>
                    <td className="p-3 text-sm">--</td>
                    <td className="p-3 text-sm font-bold text-gray-900">
                      {clientsFiltres.reduce((sum, c) => sum + ((c as any).anneeN1 || 0), 0).toLocaleString()}€
                    </td>
                    <td className="p-3 text-sm font-bold text-gray-900">
                      {clientsFiltres.reduce((sum, c) => sum + ((c as any).anneeN || 0), 0).toLocaleString()}€
                    </td>
                    <td className="p-3 text-sm font-bold text-red-600">
                      -{clientsFiltres.reduce((sum, c) => sum + ((c as any).impactN || 0), 0).toLocaleString()}€
                    </td>
                    <td className="p-3 text-sm font-bold text-red-600">
                      -{clientsFiltres.reduce((sum, c) => sum + ((c as any).annuelN1 || 0), 0).toLocaleString()}€
                    </td>
                    <td className="p-3 text-sm">--</td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {clientsFiltres.filter(c => (c as any).mandats).length}/{clientsFiltres.length}
                    </td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {clientsFiltres.filter(c => (c as any).logiciels).length}/{clientsFiltres.length}
                    </td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {clientsFiltres.filter(c => (c as any).backup).length}/{clientsFiltres.length}
                    </td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {clientsFiltres.filter(c => (c as any).facturationCloturee).length}/{clientsFiltres.length}
                    </td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {clientsFiltres.filter(c => (c as any).prestationsAFaire).length}/{clientsFiltres.length}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderClientsEnPartance = () => {
    // Filtrage des clients selon la recherche
    const clientsFiltres = localPartance.filter(client => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        client.nom.toLowerCase().includes(query) ||
        client.idClient?.toLowerCase().includes(query) ||
        client.secteur?.toLowerCase().includes(query) ||
        client.statut.toLowerCase().includes(query)
      );
    });
    
    // Calculs KPI pour les clients en partance
    const totalClients = localPartance.length;
    const caARisque = localPartance.reduce((sum, client) => sum + (client.chiffreAffaires || 0), 0);
    const clientsRecuperes = localPartance.filter(client => client.recupere === true).length;
    const tauxRecuperation = totalClients > 0 ? Math.round((clientsRecuperes / totalClients) * 100) : 0;
    
    return (
      <div className="space-y-4">
        {/* Barre de recherche et actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher un client par nom ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
          {/* Bouton temporaire pour recharger les données */}
          <Button
            onClick={() => {
              setLocalPartance(generateMockData().partance);
              console.log("🔄 Données des clients en partance rechargées");
            }}
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            🔄 Recharger les données
          </Button>
        </div>
        
        {/* KPI Dashboard pour Clients en Partance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* KPI 1: Nombre de Clients */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Clients en Partance</p>
                  <p className="text-xl font-bold text-gray-900">{totalClients}</p>
                  <p className="text-xs text-gray-500">À récupérer</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <UserMinus className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: CA à Risque */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">CA à Risque</p>
                  <p className="text-xl font-bold text-gray-900">{(caARisque / 1000).toFixed(0)}k€</p>
                  <p className="text-xs text-gray-500">Chiffre d'affaires menacé</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Clients Récupérés */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Clients Récupérés</p>
                  <p className="text-xl font-bold text-gray-900">{clientsRecuperes}</p>
                  <p className="text-xs text-gray-500">Succès de récupération</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI 4: Taux de Récupération */}
          <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Taux Récupération</p>
                  <p className="text-xl font-bold text-gray-900">{tauxRecuperation}%</p>
                  <p className="text-xs text-gray-500">Performance équipe</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des clients en partance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  ⚠️ <strong>Clients en partance :</strong> Clients qu'on essaie encore de récupérer avant leur départ définitif
                </div>
                {searchQuery && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {clientsFiltres.length} résultat{clientsFiltres.length > 1 ? 's' : ''} trouvé{clientsFiltres.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-700">GD</th>
                    <th className="text-left p-4 font-medium text-gray-700">RDV Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">CA à Risque</th>
                    <th className="text-left p-4 font-medium text-gray-700">Commentaire</th>
                    <th className="text-left p-4 font-medium text-gray-700">Client Récupéré</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsFiltres.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-gray-900">{item.nom}</p>
                            <p className="text-xs text-blue-600 font-mono">{item.idClient}</p>
                            <p className="text-sm text-gray-500">{item.secteur || 'Secteur non défini'}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/clients/detail/${item.id}`)}
                            title="Accès à la fiche client"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">
                          {item.gestionnaire || 'Non assigné'}
                        </div>
                      </td>
                      <td className="p-4">
                        <Input 
                          type="date" 
                          className="w-32 text-xs"
                          value={item.rdvDate ? item.rdvDate.split('/').reverse().join('-') : ''}
                          onChange={(e) => {
                            const newDate = e.target.value ? e.target.value.split('-').reverse().join('/') : null;
                            updateClientPartance(item.id, { rdvDate: newDate });
                            console.log(`📅 RDV programmé pour ${item.nom}: ${newDate}`);
                          }}
                          placeholder="Programmer RDV"
                        />
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-red-600">
                          {(item.chiffreAffaires || 0).toLocaleString()}€
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <Textarea 
                            className="text-xs resize-none"
                            rows={2}
                            value={item.commentaire || ''}
                            onChange={(e) => {
                              updateClientPartance(item.id, { commentaire: e.target.value });
                              console.log(`💬 Commentaire mis à jour pour ${item.nom}: ${e.target.value}`);
                            }}
                            placeholder="Stratégie de récupération..."
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`recupere-${item.id}`}
                            checked={item.recupere || false}
                            onChange={(e) => {
                              const isRecupere = e.target.checked;
                              
                              // Mettre à jour l'état local
                              updateClientPartance(item.id, { recupere: isRecupere });
                              
                              if (isRecupere) {
                                console.log(`✅ Client ${item.nom} marqué comme récupéré !`);
                                console.log(`📋 Créer une ligne dans "Clients à suivre" avec statut "Récupéré"`);
                                
                                // TODO: Ici on créerait automatiquement une ligne dans "Clients à suivre"
                                // avec le statut "Récupéré" pour ce client
                                alert(`Client ${item.nom} marqué comme récupéré !\n\nÀ implémenter : Création automatique d'une ligne dans "Clients à suivre" avec statut "Récupéré".`);
                              } else {
                                console.log(`❌ Client ${item.nom} marqué comme non récupéré`);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`recupere-${item.id}`} className="text-xs">
                            {item.recupere ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                ✅ Récupéré
                              </Badge>
                            ) : (
                              <span className="text-gray-600">Non récupéré</span>
                            )}
                          </Label>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {/* Bouton Email */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.mail?.status === 'completed' && item.contacts.mail.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'mail',
                                titre: `Email de récupération - ${item.nom}`,
                                description: `Tentative de récupération par email`,
                                participant: item.email || `contact@${item.nom.toLowerCase().replace(/\s+/g, '')}.com`,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.mail?.satisfaction || 0,
                                status: item.contacts?.mail?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Mail className="w-4 h-4" />
                            {item.contacts?.mail?.status === 'completed' && item.contacts.mail.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.mail.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Téléphone */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'appel',
                                titre: `Appel de récupération - ${item.nom}`,
                                description: `Appel pour tenter de récupérer le client`,
                                participant: item.telephone || `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.appel?.satisfaction || 0,
                                status: item.contacts?.appel?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Phone className="w-4 h-4" />
                            {item.contacts?.appel?.status === 'completed' && item.contacts.appel.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.appel.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton RDV */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'rdv',
                                titre: `RDV de récupération - ${item.nom}`,
                                description: `Rendez-vous pour négocier le maintien`,
                                participant: item.nom,
                                date: new Date().toISOString().split('T')[0],
                                duree: 60,
                                satisfaction: item.contacts?.rdv?.satisfaction || 0,
                                status: item.contacts?.rdv?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            {item.contacts?.rdv?.status === 'completed' && item.contacts.rdv.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.rdv.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Note */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${
                              item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'note',
                                titre: `Note de récupération - ${item.nom}`,
                                description: 'Stratégie de récupération...',
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.note?.satisfaction || 0,
                                status: item.contacts?.note?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {item.contacts?.note?.status === 'completed' && item.contacts.note.satisfaction >= 4 && (
                              <span className="ml-1 text-xs">⭐{item.contacts.note.satisfaction}</span>
                            )}
                          </Button>
                          
                          {/* Bouton Plan d'action */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedClientForPlan(item);
                              setClientType('partance');
                              setIsPlanActionModalOpen(true);
                            }}
                            title="Créer un plan de récupération"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal de contact */}
        <ContactActionModal 
          action={selectedContactAction} 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
        />
        
        {/* Modal de plan d'action */}
        <PlanActionModal 
          client={selectedClientForPlan}
          clientType={clientType}
          isOpen={isPlanActionModalOpen}
          onClose={() => {
            setIsPlanActionModalOpen(false);
            setSelectedClientForPlan(null);
          }}
        />
      </div>
    );
  };

  const renderProspectsWithEmails = () => {
    // Vue emails si activée
    if (showEmails) {
      return (
        <div className="space-y-4">
          {/* En-tête de la boîte email */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>E-mails en attente de traitement</span>
                  <Badge variant="destructive">{emailsToProcess.filter(e => e.statut === 'nouveau').length} à traiter</Badge>
                  <Badge variant="secondary">{emailsToProcess.length} total</Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmails(false)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir Prospects
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Actions de tri */}
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b">
                <Button 
                  size="sm" 
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                >
                  Tous ({emailsToProcess.length})
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedStatus === 'nouveau' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('nouveau')}
                >
                  À traiter ({emailsToProcess.filter(e => e.statut === 'nouveau').length})
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedStatus === 'traite' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('traite')}
                >
                  Traités ({emailsToProcess.filter(e => e.statut === 'traite').length})
                </Button>
              </div>

              {/* Liste des emails avec actions */}
              <div className="space-y-3">
                {emailsToProcess
                  .filter(email => selectedStatus === 'all' || email.statut === selectedStatus)
                  .map((email) => (
                  <div 
                    key={email.id}
                    className={`p-4 border rounded-lg transition-all ${
                      email.statut === 'nouveau' ? 'bg-orange-50 border-orange-200' :
                      email.statut === 'traite' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">De:</span>
                            <span className="font-medium text-sm">{email.expediteur}</span>
                          </div>
                          {email.score_ia && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{email.score_ia}/100</span>
                            </div>
                          )}
                          <Badge 
                            variant={email.priorite === 'haute' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {email.priorite}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            <span className="text-gray-600">Objet:</span> {email.objet}
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                          {email.contenu}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📅 {email.dateReception}</span>
                          {email.pieces_jointes && email.pieces_jointes.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{email.pieces_jointes.length} fichier(s)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {email.statut === 'nouveau' ? (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                console.log('Traitement email:', email);
                                setSelectedEmail(email);
                                setIsCreateProspectOpen(true);
                                // Marquer l'email comme en cours de traitement
                                const updatedEmails = emailsToProcess.map(e => 
                                  e.id === email.id ? {...e, statut: 'lu' as const} : e
                                );
                                setEmailsToProcess(updatedEmails);
                              }}
                            >
                              Traiter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const updatedEmails = emailsToProcess.map(e => 
                                  e.id === email.id ? {...e, statut: 'archive' as const} : e
                                );
                                setEmailsToProcess(updatedEmails);
                              }}
                            >
                              Ignorer
                            </Button>
                          </>
                        ) : (
                          <Badge 
                            variant={email.statut === 'traite' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              email.statut === 'traite' ? 'bg-green-600 text-white' : ''
                            }`}
                          >
                            {email.statut === 'traite' ? 'Traité' : 'Archivé'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Modales */}
          <EmailDetailModal 
            email={selectedEmail} 
            isOpen={isEmailDetailOpen} 
            onClose={() => setIsEmailDetailOpen(false)} 
          />
          <CreateProspectModal 
            email={selectedEmail} 
            isOpen={isCreateProspectOpen} 
            onClose={() => setIsCreateProspectOpen(false)} 
          />
        </div>
      );
    }

    // Vue prospects avec KPI et analytics
    return renderProspectsWithKPI();
  };

  const renderDataTable = (data: ProspectClient[], type: string) => {
    const filteredData = data.filter(item => {
      const searchMatch = searchQuery === '' || 
        item.nom.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = selectedStatus === 'all' || item.statut === selectedStatus;
      
      return searchMatch && statusMatch;
    });

    return (
      <div className="space-y-4">
        {/* Filtres */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Array.from(new Set(data.map(item => item.statut))).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''}
            </span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </div>

        {/* Tableau */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-700">Statut</th>
                    {type === 'prospects' && <th className="text-left p-4 font-medium text-gray-700">CA Potentiel</th>}
                    {(type === 'prospects' || type === 'partance') && <th className="text-left p-4 font-medium text-gray-700">Échéance</th>}
                    {type === 'entrants' && <th className="text-left p-4 font-medium text-gray-700">Canal</th>}
                    {type === 'sortants' && <th className="text-left p-4 font-medium text-gray-700">Cause départ</th>}
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.nom}</div>
                          {item.email && <div className="text-sm text-gray-500">{item.email}</div>}
                          {item.remarque && <div className="text-xs text-blue-600 mt-1">{item.remarque}</div>}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            item.statut.includes('signé') || item.statut.includes('Terminé') ? 'default' :
                            item.statut.includes('retard') || item.statut.includes('risque') ? 'destructive' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {item.statut}
                        </Badge>
                      </td>
                      {type === 'prospects' && (
                        <td className="p-4 text-sm font-medium">
                          {item.chiffreAffaires ? `${item.chiffreAffaires.toLocaleString()}€` : '-'}
                        </td>
                      )}
                      {(type === 'prospects' || type === 'partance') && (
                        <td className="p-4 text-sm text-gray-600">
                          {item.dateEcheance || '-'}
                        </td>
                      )}
                      {type === 'entrants' && (
                        <td className="p-4 text-sm text-gray-600">{item.canal}</td>
                      )}
                      {type === 'sortants' && (
                        <td className="p-4 text-sm text-gray-600">{(item as any).causesDepart}</td>
                      )}
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {/* Bouton Voir détails */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              if (item.contacts?.mail) {
                                setSelectedProspectForEmail(item);
                                setIsProspectEmailModalOpen(true);
                              } else {
                                // Ouvrir détails du prospect (à implémenter si besoin)
                                console.log('Voir détails prospect:', item);
                              }
                            }}
                            title={item.contacts?.mail ? 'Voir email de contact' : 'Voir détails du prospect'}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {/* Bouton Email */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'mail',
                                titre: `Email à ${item.nom}`,
                                description: `Contact commercial avec ${item.nom}`,
                                participant: item.email,
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.mail?.satisfaction || 0,
                                status: item.contacts?.mail?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          
                          {/* Bouton Téléphone */}
                          {item.telephone && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`relative ${
                                item.contacts?.appel?.status === 'completed' && item.contacts?.appel?.satisfaction && item.contacts?.appel?.satisfaction >= 4
                                  ? 'text-white bg-green-600 hover:bg-green-700' 
                                  : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                              }`}
                              onClick={() => {
                                setSelectedContactAction({
                                  type: 'appel',
                                  titre: `Appel avec ${item.nom}`,
                                  description: `Appel commercial - ${item.telephone}`,
                                  participant: item.telephone,
                                  date: new Date().toISOString().split('T')[0],
                                  satisfaction: item.contacts?.appel?.satisfaction || 0,
                                  status: item.contacts?.appel?.status || 'pending'
                                });
                                setIsContactModalOpen(true);
                              }}
                            >
                              <Phone className="w-4 h-4" />
                              {item.contacts?.appel?.satisfaction && item.contacts?.appel?.satisfaction >= 4 && (
                                <div className="absolute -top-1 -right-1 flex items-center">
                                  <span className="text-xs text-yellow-300">⭐</span>
                                  <span className="text-xs text-white">{item.contacts?.appel?.satisfaction}</span>
                                </div>
                              )}
                            </Button>
                          )}
                          
                          {/* Bouton RDV */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`relative ${
                              item.contacts?.rdv?.status === 'completed' && item.contacts?.rdv?.satisfaction && item.contacts?.rdv?.satisfaction >= 4
                                ? 'text-white bg-green-600 hover:bg-green-700' 
                                : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'rdv',
                                titre: `RDV avec ${item.nom}`,
                                description: `Rendez-vous commercial`,
                                participant: item.nom,
                                date: new Date().toISOString().split('T')[0],
                                duree: 60,
                                satisfaction: item.contacts?.rdv?.satisfaction || 0,
                                status: item.contacts?.rdv?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <CalendarIcon className="w-4 h-4" />
                            {item.contacts?.rdv?.satisfaction && item.contacts?.rdv?.satisfaction >= 4 && (
                              <div className="absolute -top-1 -right-1 flex items-center">
                                <span className="text-xs text-yellow-300">⭐</span>
                                <span className="text-xs text-white">{item.contacts?.rdv?.satisfaction}</span>
                              </div>
                            )}
                          </Button>
                          
                          {/* Bouton Note */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`relative ${
                              item.contacts?.note?.status === 'completed' && item.contacts?.note?.satisfaction && item.contacts?.note?.satisfaction >= 4
                                ? 'text-white bg-green-600 hover:bg-green-700' 
                                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setSelectedContactAction({
                                type: 'note',
                                titre: `Note sur ${item.nom}`,
                                description: 'Ajouter une note...',
                                date: new Date().toISOString().split('T')[0],
                                satisfaction: item.contacts?.note?.satisfaction || 0,
                                status: item.contacts?.note?.status || 'pending'
                              });
                              setIsContactModalOpen(true);
                            }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {item.contacts?.note?.satisfaction && item.contacts?.note?.satisfaction >= 4 && (
                              <div className="absolute -top-1 -right-1 flex items-center">
                                <span className="text-xs text-yellow-300">⭐</span>
                                <span className="text-xs text-white">{item.contacts?.note?.satisfaction}</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'globale':
        return renderVueGlobale();
      case 'prospects':
        return (
          <>
            {renderProspectsWithEmails()}
            <ContactActionModal 
              action={selectedContactAction} 
              isOpen={isContactModalOpen} 
              onClose={() => setIsContactModalOpen(false)} 
            />
            <ProspectEmailModal 
              prospect={selectedProspectForEmail} 
              isOpen={isProspectEmailModalOpen} 
              onClose={() => setIsProspectEmailModalOpen(false)} 
            />
          </>
        );
      case 'entrants':
        return renderClientsEntrants();
      case 'suivre':
        return renderClientsASuivre();
      case 'partance':
        return renderClientsEnPartance();
      case 'sortants':
        return renderClientsSortants();
      default:
        return renderVueGlobale();
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        {renderTabHeader()}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default Croissance;
