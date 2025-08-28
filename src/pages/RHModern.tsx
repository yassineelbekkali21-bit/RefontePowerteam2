import React, { useState } from 'react';
import { Users, Calendar, Clock, TrendingUp, UserCheck, CalendarDays, Activity, Target, MapPin, Phone, Mail, Award, Coffee, Briefcase, CheckCircle, AlertCircle, XCircle, Filter, Search, Plus, Edit, Eye, ChevronLeft, ChevronRight, Gift, MessageSquare, Star, Euro, Send, Upload, Paperclip, Copy, Settings, Zap, Sparkles, BarChart3, FileText, Clipboard, History } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

const teamData = [
  { 
    id: 1, name: 'Alice Martin', role: 'Senior Developer', 
    email: 'alice.martin@company.com', phone: '+33 6 12 34 56 78',
    presence: 95, performance: 92, projects: 8, avatar: 'AM',
    status: 'active', location: 'Bruxelles', department: 'Développement',
    conges: { pris: 12, restants: 13 }, teleTravail: 15, heuresSupp: 8,
    // Données détaillées basées sur le modèle
    zone: 'France',
    bu: 'DEV',
    partner: 'Yousra Berradi',
    binome: 'Eric Schu Schuermans',
    niveau: 'Senior',
    regime: 'Temps Plein France',
    nfSpecialProject: 0,
    vacancesAnnuelles: 25,
    nombreSemaine: 45,
    heuresSemaine: 44,
    totalAnnuel: 1980,
    heuresParJour: {
      lundi: { bureau: 9, teletravail: 0 },
      mardi: { bureau: 9, teletravail: 0 },
      mercredi: { bureau: 0, teletravail: 9 },
      jeudi: { bureau: 9, teletravail: 0 },
      vendredi: { bureau: 0, teletravail: 8 }
    },
    congesDetailles: {
      annuelPaye: 13,
      maladie: 0,
      paternite: 0,
      mariage: 0,
      deces: 0,
      sanssolde: 0,
      exceptionnel: 0,
      recuperation: 5
    }
  },
  { 
    id: 2, name: 'Aachati Mohamed', role: 'Gestionnaire d\'encodage', 
    email: 'aachati.mohamed@company.com', phone: '+212 6 12 34 56 78',
    presence: 88, performance: 89, projects: 12, avatar: 'AM',
    status: 'active', location: 'Marrakech', department: 'Gestionnaire',
    conges: { pris: 0, restants: 18 }, teleTravail: 0, heuresSupp: 4,
    // Données détaillées d'Aachati Mohamed
    zone: 'Maroc',
    bu: 'OAM',
    partner: 'Yousra Berradi',
    binome: 'Eric Schu Schuermans',
    niveau: 'Junior',
    regime: 'Temps Plein Maroc',
    nfSpecialProject: 0,
    vacancesAnnuelles: 18,
    nombreSemaine: 45,
    heuresSemaine: 44,
    totalAnnuel: 1980,
    heuresParJour: {
      lundi: { bureau: 9, teletravail: 0 },
      mardi: { bureau: 9, teletravail: 0 },
      mercredi: { bureau: 9, teletravail: 0 },
      jeudi: { bureau: 9, teletravail: 0 },
      vendredi: { bureau: 8, teletravail: 0 }
    },
    congesDetailles: {
      annuelPaye: 18,
      maladie: 0,
      paternite: 0,
      mariage: 0,
      deces: 0,
      sanssolde: 0,
      exceptionnel: 0,
      recuperation: 0
    }
  },
  { 
    id: 3, name: 'Claire Leroy', role: 'Product Manager', 
    email: 'claire.leroy@company.com', phone: '+33 6 34 56 78 90',
    presence: 92, performance: 94, projects: 12, avatar: 'CL',
    status: 'active', location: 'Mons', department: 'Product',
    conges: { pris: 8, restants: 17 }, teleTravail: 12, heuresSupp: 12,
    zone: 'France',
    bu: 'PROD',
    partner: 'Marie Dupont',
    binome: 'Paul Martin',
    niveau: 'Confirmé',
    regime: 'Temps Plein France',
    nfSpecialProject: 2,
    vacancesAnnuelles: 25,
    nombreSemaine: 45,
    heuresSemaine: 38,
    totalAnnuel: 1710,
    heuresParJour: {
      lundi: { bureau: 8, teletravail: 0 },
      mardi: { bureau: 0, teletravail: 8 },
      mercredi: { bureau: 8, teletravail: 0 },
      jeudi: { bureau: 0, teletravail: 8 },
      vendredi: { bureau: 0, teletravail: 6 }
    },
    congesDetailles: {
      annuelPaye: 17,
      maladie: 1,
      paternite: 0,
      mariage: 0,
      deces: 0,
      sanssolde: 0,
      exceptionnel: 3,
      recuperation: 2
    }
  },
  { 
    id: 4, name: 'David Chen', role: 'Backend Developer', 
    email: 'david.chen@company.com', phone: '+33 6 45 67 89 01',
    presence: 90, performance: 89, projects: 9, avatar: 'DC',
    status: 'teletravail', location: 'Rochefort', department: 'Développement',
    conges: { pris: 15, restants: 10 }, teleTravail: 20, heuresSupp: 6,
    zone: 'France',
    bu: 'DEV',
    partner: 'Sophie Martin',
    binome: 'Lucas Dubois',
    niveau: 'Senior',
    regime: 'Temps Plein France',
    nfSpecialProject: 1,
    vacancesAnnuelles: 25,
    nombreSemaine: 45,
    heuresSemaine: 44,
    totalAnnuel: 1980,
    heuresParJour: {
      lundi: { bureau: 0, teletravail: 9 },
      mardi: { bureau: 0, teletravail: 9 },
      mercredi: { bureau: 0, teletravail: 9 },
      jeudi: { bureau: 0, teletravail: 9 },
      vendredi: { bureau: 0, teletravail: 8 }
    },
    congesDetailles: {
      annuelPaye: 10,
      maladie: 3,
      paternite: 11,
      mariage: 0,
      deces: 0,
      sanssolde: 0,
      exceptionnel: 0,
      recuperation: 0
    }
  },
  { 
    id: 5, name: 'Emma Wilson', role: 'Frontend Developer', 
    email: 'emma.wilson@company.com', phone: '+33 6 56 78 90 12',
    presence: 85, performance: 91, projects: 7, avatar: 'EW',
    status: 'conges', location: 'Gembloux', department: 'Développement',
    conges: { pris: 20, restants: 5 }, teleTravail: 8, heuresSupp: 10,
    zone: 'France',
    bu: 'DEV',
    partner: 'Thomas Garcia',
    binome: 'Julie Robert',
    niveau: 'Confirmé',
    regime: 'Temps Partiel',
    nfSpecialProject: 0,
    vacancesAnnuelles: 20,
    nombreSemaine: 45,
    heuresSemaine: 32,
    totalAnnuel: 1440,
    heuresParJour: {
      lundi: { bureau: 8, teletravail: 0 },
      mardi: { bureau: 8, teletravail: 0 },
      mercredi: { bureau: 0, teletravail: 0 },
      jeudi: { bureau: 8, teletravail: 0 },
      vendredi: { bureau: 8, teletravail: 0 }
    },
    congesDetailles: {
      annuelPaye: 5,
      maladie: 0,
      paternite: 0,
      mariage: 4,
      deces: 0,
      sanssolde: 0,
      exceptionnel: 0,
      recuperation: 0
    }
  }
];

const attendanceData = [
  { day: 'Lun', present: 24, absent: 2, teletravail: 3 },
  { day: 'Mar', present: 25, absent: 1, teletravail: 2 },
  { day: 'Mer', present: 23, absent: 3, teletravail: 4 },
  { day: 'Jeu', present: 26, absent: 0, teletravail: 2 },
  { day: 'Ven', present: 22, absent: 4, teletravail: 5 }
];

const performanceData = [
  { month: 'Avr', score: 85, satisfaction: 78 },
  { month: 'Mai', score: 88, satisfaction: 82 },
  { month: 'Jun', score: 92, satisfaction: 89 },
  { month: 'Jul', score: 87, satisfaction: 85 },
  { month: 'Aoû', score: 91, satisfaction: 88 }
];

// Données pour les bonus
const bonusData = [
  { 
    id: 1, 
    employee: 'Alice Martin', 
    type: 'Performance', 
    amount: 1500, 
    period: 'Q3 2025', 
    status: 'approved',
    reason: 'Excellent travail sur le projet Alpha'
  },
  { 
    id: 2, 
    employee: 'Claire Leroy', 
    type: 'Innovation', 
    amount: 2000, 
    period: 'Q3 2025', 
    status: 'pending',
    reason: 'Proposition d\'amélioration du processus'
  },
  { 
    id: 3, 
    employee: 'David Chen', 
    type: 'Ancienneté', 
    amount: 800, 
    period: 'Q3 2025', 
    status: 'paid',
    reason: '5 ans dans l\'entreprise'
  }
];

// Données pour l'enquête de satisfaction
const satisfactionData = {
  global: 4.2,
  responses: 24,
  total: 28,
  categories: [
    { name: 'Environnement de travail', score: 4.5, responses: 24 },
    { name: 'Management', score: 4.1, responses: 22 },
    { name: 'Équilibre vie pro/perso', score: 4.0, responses: 23 },
    { name: 'Développement carrière', score: 3.8, responses: 21 },
    { name: 'Rémunération', score: 4.3, responses: 20 }
  ],
  comments: [
    { employee: 'Anonyme', comment: 'Très bon environnement de travail, équipe soudée.', rating: 5 },
    { employee: 'Anonyme', comment: 'Possibilités d\'évolution à clarifier.', rating: 3 },
    { employee: 'Anonyme', comment: 'Télétravail bien organisé, bon équilibre.', rating: 4 }
  ]
};

// Interfaces pour les enquêtes
interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: SurveyQuestion[];
  estimatedTime: number;
  category: string;
}

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no';
  question: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  template: SurveyTemplate;
  status: 'draft' | 'active' | 'closed';
  createdDate: string;
  endDate: string;
  recipients: string[];
  responses: SurveyResponse[];
  anonymous: boolean;
}

interface SurveyResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  submittedDate: string;
  answers: Record<string, any>;
}

// Modèles d'enquêtes prédéfinis
const surveyTemplates: SurveyTemplate[] = [
  {
    id: 'satisfaction-generale',
    name: 'Satisfaction Générale',
    description: 'Enquête globale sur la satisfaction au travail',
    icon: '😊',
    category: 'Bien-être',
    estimatedTime: 5,
    questions: [
      {
        id: 'satisfaction-globale',
        type: 'rating',
        question: 'Comment évaluez-vous votre satisfaction globale au travail ?',
        required: true
      },
      {
        id: 'environnement',
        type: 'rating',
        question: 'Êtes-vous satisfait de votre environnement de travail ?',
        required: true
      },
      {
        id: 'management',
        type: 'rating',
        question: 'Comment évaluez-vous la qualité du management ?',
        required: true
      },
      {
        id: 'equilibre',
        type: 'rating',
        question: 'L\'équilibre vie professionnelle/vie privée vous convient-il ?',
        required: true
      },
      {
        id: 'commentaires',
        type: 'text',
        question: 'Avez-vous des commentaires ou suggestions ?',
        required: false
      }
    ]
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    description: 'Feedback sur le processus d\'intégration',
    icon: '🎯',
    category: 'Intégration',
    estimatedTime: 3,
    questions: [
      {
        id: 'preparation',
        type: 'rating',
        question: 'Votre intégration était-elle bien préparée ?',
        required: true
      },
      {
        id: 'accueil',
        type: 'rating',
        question: 'Comment évaluez-vous la qualité de l\'accueil ?',
        required: true
      },
      {
        id: 'formation',
        type: 'rating',
        question: 'Les formations initiales étaient-elles suffisantes ?',
        required: true
      },
      {
        id: 'recommandation',
        type: 'yes_no',
        question: 'Recommanderiez-vous l\'entreprise à un proche ?',
        required: true
      }
    ]
  },
  {
    id: 'formation',
    name: 'Formation',
    description: 'Évaluation des besoins en formation',
    icon: '📚',
    category: 'Développement',
    estimatedTime: 4,
    questions: [
      {
        id: 'formations-actuelles',
        type: 'rating',
        question: 'Les formations proposées répondent-elles à vos besoins ?',
        required: true
      },
      {
        id: 'types-formation',
        type: 'multiple_choice',
        question: 'Quels types de formation vous intéressent le plus ?',
        required: true,
        options: ['Technique', 'Management', 'Communication', 'Langues', 'Autre']
      },
      {
        id: 'frequence',
        type: 'multiple_choice',
        question: 'À quelle fréquence souhaiteriez-vous des formations ?',
        required: true,
        options: ['Mensuelle', 'Trimestrielle', 'Semestrielle', 'Annuelle']
      }
    ]
  },
  {
    id: 'teletravail',
    name: 'Télétravail',
    description: 'Retour d\'expérience sur le télétravail',
    icon: '🏠',
    category: 'Organisation',
    estimatedTime: 3,
    questions: [
      {
        id: 'satisfaction-teletravail',
        type: 'rating',
        question: 'Êtes-vous satisfait de votre expérience en télétravail ?',
        required: true
      },
      {
        id: 'frequence-souhaitee',
        type: 'multiple_choice',
        question: 'Combien de jours de télétravail par semaine souhaiteriez-vous ?',
        required: true,
        options: ['0 jour', '1 jour', '2 jours', '3 jours', '4 jours', '5 jours']
      },
      {
        id: 'outils',
        type: 'rating',
        question: 'Les outils de télétravail sont-ils adaptés ?',
        required: true
      }
    ]
  }
];

// Enquêtes existantes
const existingSurveys: Survey[] = [
  {
    id: 'survey-1',
    title: 'Satisfaction Q3 2025',
    description: 'Enquête trimestrielle de satisfaction',
    template: surveyTemplates[0],
    status: 'closed',
    createdDate: '2025-01-10',
    endDate: '2025-01-20',
    recipients: teamData.map(emp => emp.email),
    anonymous: true,
    responses: teamData.slice(0, 24).map((emp, index) => ({
      id: `response-${index}`,
      employeeId: emp.id.toString(),
      employeeName: emp.name,
      submittedDate: '2025-01-15',
      answers: {
        'satisfaction-globale': Math.floor(Math.random() * 5) + 1,
        'environnement': Math.floor(Math.random() * 5) + 1,
        'management': Math.floor(Math.random() * 5) + 1,
        'equilibre': Math.floor(Math.random() * 5) + 1,
        'commentaires': index < 3 ? satisfactionData.comments[index]?.comment : ''
      }
    }))
  },
  {
    id: 'survey-2',
    title: 'Onboarding nouveaux arrivants',
    description: 'Feedback sur le processus d\'intégration',
    template: surveyTemplates[1],
    status: 'active',
    createdDate: '2025-01-15',
    endDate: '2025-01-30',
    recipients: ['alice.martin@company.com', 'claire.leroy@company.com'],
    anonymous: false,
    responses: [
      {
        id: 'response-onb-1',
        employeeId: '1',
        employeeName: 'Alice Martin',
        submittedDate: '2025-01-16',
        answers: {
          'preparation': 4,
          'accueil': 5,
          'formation': 4,
          'recommandation': 'yes'
        }
      }
    ]
  }
];

// Types de congés disponibles basés sur l'interface
const leaveTypes = [
  { id: 'conge-annuel-paye', name: 'Congé Annuel Payé', color: 'bg-blue-500' },
  { id: 'conge-maladie', name: 'Congé Maladie', color: 'bg-red-500' },
  { id: 'conge-paternite', name: 'Congé Paternité (Papa)', color: 'bg-green-500' },
  { id: 'conge-mariage', name: 'Congé Mariage', color: 'bg-pink-500' },
  { id: 'conge-deces-conjoint', name: 'Congé Décès (Conjoint, Parent...)', color: 'bg-gray-600' },
  { id: 'conge-deces-proche', name: 'Congé Décès (Proche Parent...)', color: 'bg-gray-500' },
  { id: 'conge-circoncision', name: 'Congé Circoncision (Enfant)', color: 'bg-purple-500' },
  { id: 'conge-maternite', name: 'Congé Maternité (Maman)', color: 'bg-pink-600' },
  { id: 'conge-sans-solde', name: 'Congé Sans Solde', color: 'bg-orange-500' },
  { id: 'conge-exceptionnel', name: 'Congé Exceptionnel', color: 'bg-yellow-500' },
  { id: 'conge-recuperation', name: 'Congé Récupération Annuel', color: 'bg-green-600' }
];

// Événements annuels avec statuts
const annualEvents = {
  janvier: [
    { date: 1, type: 'ferie', name: 'Nouvel An', status: 'ferie' }
  ],
  avril: [
    { date: 21, type: 'ferie', name: 'Lundi de Pâques', status: 'ferie' },
    { date: 23, type: 'conge', name: 'Vacances annuelles', status: 'approved' }
  ],
  mai: [
    { date: 1, type: 'ferie', name: 'Fête du travail', status: 'ferie' },
    { date: 15, type: 'conge', name: 'Congé personnel', status: 'pending' },
    { date: 29, type: 'ferie', name: 'Ascension', status: 'ferie' },
    { date: 30, type: 'ferie', name: 'Pont de l\'Ascension', status: 'ferie' }
  ],
  juin: [
    { date: '2-6', type: 'conge', name: 'Absence autorisée', status: 'approved' },
    { date: 9, type: 'ferie', name: 'Lundi de Pentecôte', status: 'ferie' },
    { date: 20, type: 'conge', name: 'Congé formation', status: 'rejected' }
  ]
};

const RHModern: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'calendar' | 'team' | 'bonus' | 'satisfaction'>('overview');
  
  // États pour les enquêtes
  const [satisfactionView, setSatisfactionView] = useState<'results' | 'surveys' | 'create'>('results');
  const [surveys, setSurveys] = useState<Survey[]>(existingSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [currentMonth, setCurrentMonth] = useState('Août 2025');
  const [selectedLeaveType, setSelectedLeaveType] = useState('conge-annuel-paye');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  // Demandes de congé d'exemple pour tester le processus
  const [leaveRequests, setLeaveRequests] = useState<any[]>([
    {
      id: 'req-1',
      employeeName: 'Sophie Laurent',
      dates: [15, 16, 17],
      leaveType: 'conge-annuel-paye',
      leaveTypeName: 'Congé Annuel Payé',
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
      attachedFile: null
    },
    {
      id: 'req-2', 
      employeeName: 'Marc Dubois',
      dates: [22, 23],
      leaveType: 'conge-maladie',
      leaveTypeName: 'Congé Maladie',
      status: 'pending',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hier
      attachedFile: 'certificat_medical_marc.pdf'
    },
    {
      id: 'req-3',
      employeeName: 'Alice Martin',
      dates: [25, 26, 27],
      leaveType: 'conge-annuel-paye',
      leaveTypeName: 'Congé Annuel Payé',
      status: 'approved',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
      attachedFile: null
    }
  ]);

  // Fonction pour soumettre une demande de congé
  const handleSubmitLeaveRequest = () => {
    if (selectedDates.length === 0 || !selectedLeaveType) {
      alert('Veuillez sélectionner des dates et un type de congé');
      return;
    }

    if (selectedLeaveType === 'conge-maladie' && !attachedFile) {
      alert('Un certificat médical est requis pour un congé maladie');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      employeeName: 'Utilisateur Actuel', // À remplacer par l'utilisateur connecté
      dates: selectedDates.sort(),
      leaveType: selectedLeaveType,
      leaveTypeName: leaveTypes.find(t => t.id === selectedLeaveType)?.name,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      attachedFile: attachedFile?.name || null
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    
    // Réinitialiser le formulaire
    setSelectedDates([]);
    setSelectedLeaveType('conge-annuel-paye');
    setAttachedFile(null);
    
    alert(`✅ Demande de congé soumise avec succès !

📅 Dates: ${selectedDates.sort().join(', ')} Août 2025
🏷️ Type: ${leaveTypes.find(t => t.id === selectedLeaveType)?.name}
📋 Statut: En attente d'approbation
🔔 Votre manager sera notifié automatiquement`);
  };

  // Fonction pour approuver une demande de congé
  const handleApproveLeaveRequest = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', approvedAt: new Date().toISOString() }
          : request
      )
    );

    // Mettre à jour les compteurs de congés de l'employé concerné
    const request = leaveRequests.find(r => r.id === requestId);
    if (request) {
      // Ici on mettrait à jour les compteurs dans une vraie application
      updateEmployeeLeaveCounters(request);
      
      alert(`✅ Demande de congé APPROUVÉE !

👤 Employé: ${request.employeeName}
📅 Dates: ${request.dates.join(', ')} Août 2025
🏷️ Type: ${request.leaveTypeName}
🏖️ Compteurs mis à jour automatiquement
📧 Notification envoyée à l'employé`);
    }
  };

  // Fonction pour rejeter une demande de congé
  const handleRejectLeaveRequest = (requestId: string) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', rejectedAt: new Date().toISOString() }
          : request
      )
    );
    
    const request = leaveRequests.find(r => r.id === requestId);
    alert(`❌ Demande de congé REJETÉE !

👤 Employé: ${request?.employeeName}
📅 Dates: ${request?.dates.join(', ')} Août 2025
🏷️ Type: ${request?.leaveTypeName}
📧 Notification de rejet envoyée à l'employé`);
  };

  // Fonction pour mettre à jour les compteurs de congés
  const updateEmployeeLeaveCounters = (request: any) => {
    const daysCount = request.dates.length;
    
    // Mettre à jour les compteurs dans les données d'employés
    // Note: Dans une vraie application, cela mettrait à jour la base de données
    
    // Simuler la mise à jour des compteurs pour l'affichage
    const leaveTypeKey = request.leaveType.replace('conge-', '').replace('-', '');
    
    console.log(`🏖️ Mise à jour compteurs congés:
- Employé: ${request.employeeName}
- Jours pris: +${daysCount}
- Jours restants: -${daysCount}
- Type: ${request.leaveTypeName}
- Compteurs mis à jour dans teamData[employé].congesDetailles.${leaveTypeKey}`);
    
    // Ajouter le congé dans les événements annuels pour l'affichage dans le calendrier
    const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' });
    const newLeaveEvent = {
      date: request.dates.join('-'),
      type: 'conge',
      name: `${request.leaveTypeName} (${request.employeeName})`,
      status: 'approved'
    };
    
    console.log(`📅 Ajout dans le calendrier: ${currentMonth} - ${newLeaveEvent.name}`);
  };

  // Fonction pour filtrer les événements par statut
  const getFilteredEvents = () => {
    const allEvents: any[] = [];
    Object.entries(annualEvents).forEach(([month, events]) => {
      events.forEach(event => allEvents.push({ ...event, month }));
    });

    if (selectedEventFilter === 'all') {
      return allEvents;
    }
    
    return allEvents.filter(event => event.status === selectedEventFilter);
  };

  // Calculer les comptes pour chaque statut
  const getEventCounts = () => {
    const allEvents: any[] = [];
    Object.entries(annualEvents).forEach(([month, events]) => {
      events.forEach(event => allEvents.push(event));
    });

    return {
      all: allEvents.length,
      approved: allEvents.filter(e => e.status === 'approved').length,
      pending: allEvents.filter(e => e.status === 'pending').length,
      rejected: allEvents.filter(e => e.status === 'rejected').length
    };
  };

  const eventCounts = getEventCounts();
  const filteredEvents = getFilteredEvents();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'conges': return COLORS.warning;
      case 'teletravail': return COLORS.primary;
      default: return COLORS.danger;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'conges': return <Coffee className="w-4 h-4" />;
      case 'teletravail': return <Briefcase className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PageHeader
          title="👥 Humain"
          description="Gestion d'équipes et calendrier partagé"
          icon={Users}
          actions={
              <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-900">{teamData.length}</div>
                <div className="text-sm text-blue-600">Collaborateurs</div>
                </div>
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-900">91%</div>
                <div className="text-sm text-green-600">Performance</div>
                </div>
              </div>
          }
        />

        {/* Navigation des vues */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              onClick={() => setViewMode('overview')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Activity className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendrier RH
            </Button>
            <Button
              variant={viewMode === 'team' ? 'default' : 'outline'}
              onClick={() => setViewMode('team')}
            >
              <Users className="w-4 h-4 mr-2" />
              Gestion Équipe
            </Button>
            <Button
              variant={viewMode === 'bonus' ? 'default' : 'outline'}
              onClick={() => setViewMode('bonus')}
            >
              <Gift className="w-4 h-4 mr-2" />
              Bonus
            </Button>
            <Button
              variant={viewMode === 'satisfaction' ? 'default' : 'outline'}
              onClick={() => setViewMode('satisfaction')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Enquête de satisfaction
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>
        </div>

        {viewMode === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPIs RH */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 mb-6">
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Présence Moyenne</p>
                    <p className="text-3xl font-bold text-green-700">90%</p>
                    <p className="text-xs text-green-500 mt-1">+5% vs mois dernier</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Télétravail</p>
                    <p className="text-3xl font-bold text-blue-700">17 jours</p>
                    <p className="text-xs text-blue-500 mt-1">Ce mois</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Congés Restants</p>
                    <p className="text-3xl font-bold text-orange-700">52 jours</p>
                    <p className="text-xs text-orange-500 mt-1">Total équipe</p>
                  </div>
                  <Coffee className="w-8 h-8 text-orange-500" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Heures Sup</p>
                    <p className="text-3xl font-bold text-purple-700">40h</p>
                    <p className="text-xs text-purple-500 mt-1">Ce mois</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </Card>
            </div>

            {/* Graphique Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Performance Équipe</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke={COLORS.primary} strokeWidth={2} />
                  <Line type="monotone" dataKey="satisfaction" stroke={COLORS.success} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {viewMode === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {teamData.map((employee) => (
              <Card 
                key={employee.id}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4"
                style={{ borderLeftColor: getStatusColor(employee.status) }}
                onClick={() => setSelectedEmployee(employee)}
                data-contextual={JSON.stringify({
                  type: 'employee',
                  title: `Profil ${employee.name}`,
                  data: employee
                })}
              >
                {/* Header avec statut en haut à droite */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                  >
                    {employee.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{employee.name}</h3>
                    <p className="text-gray-600 text-sm">{employee.role}</p>
                  </div>
                  </div>
                  
                  {/* Statut en haut à droite */}
                  <Badge 
                    variant="secondary"
                    className="text-white"
                    style={{ backgroundColor: getStatusColor(employee.status) }}
                  >
                    {getStatusIcon(employee.status)}
                    <span className="ml-1">
                      {employee.status === 'active' ? 'Au Bureau' : 
                       employee.status === 'conges' ? 'En Congé' : 
                       employee.status === 'teletravail' ? 'Télétravail' : 'Inactif'}
                    </span>
                  </Badge>
                </div>



                {/* Informations détaillées */}
                <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Localisation
                    </span>
                    <span className="font-medium text-blue-600">{employee.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      Régime
                    </span>
                    <span className="font-medium text-xs">{employee.regime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Télétravail
                    </span>
                    <span className="font-medium text-purple-600">{employee.teleTravail} j/mois</span>
                </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Coffee className="w-4 h-4 mr-1" />
                      Congés restants
                    </span>
                    <span className="font-medium text-orange-600">{employee.conges.restants} jours</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Partner
                    </span>
                    <span className="font-medium text-xs text-green-600">{employee.partner}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Projets actifs
                    </span>
                    <span className="font-medium">{employee.projects}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-3 h-3 mr-1" />
                    Voir détails complets
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="space-y-6">
            {/* Header avec statistiques de congés */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Fériés</p>
                    <p className="text-2xl font-bold">10 j.</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Congé annuel</p>
                    <p className="text-2xl font-bold">10 j.</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full">
                    <Coffee className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Mes congés</p>
                    <p className="text-2xl font-bold">17/20 j.</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Autres</p>
                    <p className="text-2xl font-bold">7 j.</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-full">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Layout principal avec calendrier et sidebar événements */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Calendrier principal - 3/4 de l'écran */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">GESTION DE CALENDRIER</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-medium px-4">{currentMonth}</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                    onClick={() => setShowLeaveModal(true)}
                  >
                    Associer Outlook
                    </Button>
                  </div>
                </div>

              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

              {/* Calendrier avec jours */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div 
                      key={day} 
                    className={`p-2 border rounded text-center cursor-pointer min-h-[60px] transition-colors ${
                      selectedDates.includes(day) ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (selectedDates.includes(day)) {
                        setSelectedDates(selectedDates.filter(d => d !== day));
                      } else {
                        setSelectedDates([...selectedDates, day]);
                      }
                    }}
                    >
                      <div className="font-medium text-sm">{day}</div>
                    {/* Indicateurs de congés existants */}
                    {[11, 12, 13, 14].includes(day) && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                    )}
                    {[18, 19, 26, 27].includes(day) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                    )}
                    {day === 31 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Légende */}
              <div className="flex items-center justify-center space-x-6 mb-6 pb-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">CONGÉ PAYÉ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">AUTRES CONGÉS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">CONGÉ PARTIEL</span>
                </div>
              </div>

              {/* Section Types de congés et Demande côte à côte */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Types de congés */}
                <div>
                  <h4 className="font-bold mb-4">Type de congé</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {leaveTypes.map(type => (
                      <div 
                        key={type.id}
                        className={`p-3 rounded cursor-pointer text-sm font-medium transition-colors ${
                          selectedLeaveType === type.id 
                            ? `${type.color} text-white` 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedLeaveType(type.id)}
                      >
                        {type.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demande de congé */}
                <div>
                  <h4 className="font-bold mb-4">Demande de congé</h4>
                  {selectedDates.length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm">
                          <strong>Dates sélectionnées:</strong> {selectedDates.sort().join(', ')}
                        </div>
                        <div className="text-sm mt-2">
                          <strong>Type:</strong> {leaveTypes.find(t => t.id === selectedLeaveType)?.name}
                        </div>
                      </div>
                      
                      {/* Pièce jointe pour congé maladie */}
                      {selectedLeaveType === 'conge-maladie' && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-medium text-yellow-800 mb-3">Pièce jointe requise</h5>
                          <div className="space-y-3">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              id="medical-certificate"
                              onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                            />
                            <label
                              htmlFor="medical-certificate"
                              className="flex items-center justify-center w-full p-3 border-2 border-dashed border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                            >
                              <Upload className="w-5 h-5 mr-2 text-yellow-600" />
                              <span className="text-sm text-yellow-700">
                                {attachedFile ? attachedFile.name : 'Cliquer pour joindre le certificat médical'}
                              </span>
                            </label>
                            {attachedFile && (
                              <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center">
                                  <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                                  <span className="text-sm text-gray-700">{attachedFile.name}</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setAttachedFile(null)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                        </div>
                      )}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={selectedLeaveType === 'conge-maladie' && !attachedFile}
                        onClick={handleSubmitLeaveRequest}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Soumettre la demande
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      Sélectionnez des dates dans le calendrier pour faire une demande
                    </div>
                  )}
                </div>
                </div>
              </Card>
            </div>

              {/* Sidebar droite - Événements à venir */}
              <div className="lg:col-span-1 space-y-4">
                {/* Filtres par statut - fonctionnels */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedEventFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedEventFilter === 'all'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    TOUS <span className="ml-1">{eventCounts.all}</span>
                  </button>
                  <button
                    onClick={() => setSelectedEventFilter('approved')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedEventFilter === 'approved'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-cyan-100 text-cyan-700 border border-cyan-300 hover:bg-cyan-200'
                    }`}
                  >
                    APPROUVÉS <span className="ml-1">{eventCounts.approved}</span>
                  </button>
                  <button
                    onClick={() => setSelectedEventFilter('pending')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedEventFilter === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    EN ATTENTE <span className="ml-1">{eventCounts.pending}</span>
                  </button>
                  <button
                    onClick={() => setSelectedEventFilter('rejected')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedEventFilter === 'rejected'
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200'
                    }`}
                  >
                    REJETÉS <span className="ml-1">{eventCounts.rejected}</span>
                  </button>
                </div>

                {/* Liste des événements filtrés */}
                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">
                        <Filter className="w-8 h-8 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Aucun événement {selectedEventFilter !== 'all' ? 
                          (selectedEventFilter === 'approved' ? 'approuvé' :
                           selectedEventFilter === 'pending' ? 'en attente' : 'rejeté') : ''
                        }
                      </p>
                    </div>
                  ) : (
                    // Grouper les événements filtrés par mois
                    Object.entries(
                      filteredEvents.reduce((acc: any, event) => {
                        if (!acc[event.month]) acc[event.month] = [];
                        acc[event.month].push(event);
                        return acc;
                      }, {})
                    ).map(([month, events]: [string, any[]]) => (
                      <div key={month} className="space-y-3">
                        <h4 className="font-medium text-sm uppercase text-gray-600 border-b pb-1">{month} :</h4>
                        {events.map((event, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                event.status === 'ferie' ? 'bg-gray-400' :
                                event.status === 'approved' ? 'bg-cyan-500' :
                                event.status === 'pending' ? 'bg-amber-500' :
                                event.status === 'rejected' ? 'bg-rose-500' :
                                'bg-gray-400'
                              }`}></div>
                              <span className="text-sm text-gray-700">{event.name} <strong>{event.date}</strong></span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {event.status === 'approved' && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                  APPROUVÉ
                                </span>
                              )}
                              {event.status === 'pending' && (
                                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                                  EN ATTENTE
                                </span>
                              )}
                              {event.status === 'rejected' && (
                                <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-medium">
                                  REJETÉ
                                </span>
                              )}
                              <button className="text-gray-400 hover:text-gray-600">
                                👤
                              </button>
                            </div>
                    </div>
                  ))}
                </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Section Gestion des demandes de congé */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clipboard className="w-5 h-5 mr-2" />
                  Demandes de congé en attente ({leaveRequests.filter(r => r.status === 'pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    {leaveRequests
                      .filter(request => request.status === 'pending')
                      .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{request.employeeName}</h4>
                            <p className="text-sm text-gray-600">
                              {request.leaveTypeName} • {request.dates.length} jour(s)
                            </p>
                            <p className="text-xs text-gray-500">
                              Dates: {request.dates.join(', ')} Août 2025 • Soumis le {new Date(request.submittedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-blue-600 font-medium mt-1">
                              ⏰ En attente depuis {Math.ceil((Date.now() - new Date(request.submittedAt).getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                            </p>
                            {request.attachedFile && (
                              <p className="text-xs text-blue-600 mt-1">
                                📎 Pièce jointe: {request.attachedFile}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveLeaveRequest(request.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleRejectLeaveRequest(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {leaveRequests.filter(r => r.status === 'pending').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Clipboard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>Aucune demande de congé en attente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            {/* Historique des demandes traitées */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Historique des demandes traitées
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {leaveRequests
                      .filter(request => request.status !== 'pending')
                      .map((request) => (
                      <div key={request.id} className={`border rounded-lg p-3 ${
                        request.status === 'approved' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{request.employeeName}</h5>
                            <p className="text-xs text-gray-600">
                              {request.leaveTypeName} • {request.dates.join(', ')}
                            </p>
            </div>
                          <div className="text-right">
                            <Badge className={
                              request.status === 'approved' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }>
                              {request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                request.status === 'approved' 
                                  ? request.approvedAt 
                                  : request.rejectedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
          </div>
        )}

        {viewMode === 'bonus' && (
            <div className="space-y-6">
            {/* Header avec profil employé */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <h2 className="text-xl font-bold">Aachati Mohamed</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">2023</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">ANNUEL</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">TRIMESTRIEL</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Eligible</div>
                  <div className="font-bold">0/5</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Montant total de la prime</div>
                  <div className="font-bold">500 DH</div>
                </div>
                <Button variant="outline" size="sm">
                  FILTRE
                </Button>
              </div>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Respect des délais de traitement */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">35,29%</h3>
                  <span className="text-xs text-gray-500">35 sur 101</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Respect des délais de traitement</p>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-800">2511</div>
                  <div className="text-sm text-gray-500">Nbr de factures retardées</div>
                </div>

                {/* Tableau des détails */}
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Respect des délais de traitement des documents comptables</div>
                  
                  {/* En-têtes */}
                  <div className="grid grid-cols-6 gap-2 text-xs text-gray-600 border-b pb-1">
                    <div>ID client</div>
                    <div>Client</div>
                    <div>Date dépôt</div>
                    <div>Date limite</div>
                    <div>Nbr de docs</div>
                    <div>Statut</div>
                  </div>

                  {/* Données */}
                  {[
                    { id: 'D5051', client: 'GEMBES SA COTE', depot: '17/07/23', limite: '14/08/23', docs: 173, status: 'danger' },
                    { id: 'D5052', client: 'GEMBES SA COTE', depot: '26/07/23', limite: '27/08/23', docs: 8, status: 'success' },
                    { id: 'D5053', client: 'GEMBES SA COTE', depot: '01/08/23', limite: '29/08/23', docs: 35, status: 'danger' },
                    { id: 'D5054', client: 'GEMBES SA COTE', depot: '03/08/23', limite: '06/09/23', docs: 2, status: 'danger' },
                    { id: 'D5055', client: 'GEMBES SA COTE', depot: '02/07/23', limite: '30/07/23', docs: 39, status: 'danger' }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 text-xs py-1">
                      <div>{item.id}</div>
                      <div>{item.client}</div>
                      <div>{item.depot}</div>
                      <div>{item.limite}</div>
                      <div>{item.docs}</div>
                      <div>
                        <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 text-center pt-2">1 sur 1/5</div>
                </div>
              </Card>

              {/* Respect du temps de traitement par type */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">16,00%</h3>
                  <span className="text-xs text-gray-500">35 sur 101</span>
                  </div>
                <p className="text-sm text-gray-600 mb-4">Respect du temps de traitement par type de documents comptables</p>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-800">+35h 15min</div>
                  <div className="text-sm text-gray-500">Le temps de dépassement total</div>
                  </div>

                {/* Tableau des temps */}
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Respect du temps de traitement par type de documents comptables</div>
                  
                  {/* En-têtes */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 border-b pb-1">
                    <div>Client</div>
                    <div>Temps minimal</div>
                    <div>Dépassements de temps</div>
                  </div>

                  {/* Données */}
                  {[
                    { client: 'The Louise Company', minimal: '', depassement: '-1h 35min' },
                    { client: 'La Page Blanche', minimal: '', depassement: '+35min' },
                    { client: 'Animore', minimal: '', depassement: '+25min' },
                    { client: 'StylePro Design', minimal: '', depassement: '+24min' },
                    { client: 'WEB AUDITER', minimal: '', depassement: '+17min' },
                    { client: 'Ludical Food', minimal: '', depassement: '+16min' }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1">
                      <div>{item.client}</div>
                      <div>{item.minimal}</div>
                      <div className={item.depassement.startsWith('+') ? 'text-red-500' : 'text-green-500'}>
                        {item.depassement}
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 text-center pt-2">1 sur 2</div>
                </div>
              </Card>
            </div>

            {/* Métriques inférieures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ratios */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">0,00%</h3>
                  <span className="text-xs text-gray-500">35 sur 101</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Ratios</p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-xs text-gray-500">Encodage/Nettoyage</div>
                    <div className="text-xs text-red-500">2:1</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-xs text-gray-500">Nettoyage/Bilan</div>
                    <div className="text-xs text-red-500">4:1</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-xs text-gray-500">Nettoyage/Classif</div>
                    <div className="text-xs text-red-500">4:1</div>
                  </div>
                </div>

                {/* Tableau des ratios */}
                <div className="mt-4 space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 border-b pb-1">
                    <div>Client</div>
                    <div>Encodage</div>
                    <div>Nettoyage</div>
                    <div>Ratio</div>
                  </div>
                  {[
                    { client: 'DA PAZ EMILIA', encodage: '5h 35min', nettoyage: '6h 5min', ratio: '0,90' },
                    { client: 'GEMBES SA COTE', encodage: '5h 35min', nettoyage: '1h 25min', ratio: '3,93' },
                    { client: 'PICKET', encodage: '5h 25min', nettoyage: '1h 15min', ratio: '4,33' },
                    { client: 'MAISON VERT COB JAUNE MADEBA', encodage: '5h 35min', nettoyage: '1h 15min', ratio: '4,47' },
                    { client: 'CLASSIC CIVIL MEXIM', encodage: '5h 25min', nettoyage: '5h 5min', ratio: '1,07' }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 text-xs py-1">
                      <div>{item.client}</div>
                      <div>{item.encodage}</div>
                      <div>{item.nettoyage}</div>
                      <div>{item.ratio}</div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 text-center pt-2">1 sur 15</div>
                </div>
              </Card>

              {/* Qualité des dossiers */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">100,00%</h3>
                  <span className="text-xs text-gray-500">35 sur 101</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Qualité des dossiers</p>
                
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold">0</div>
                  <div className="text-sm text-gray-500">Nbr d'erreur</div>
                </div>

                {/* Tableau qualité */}
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 border-b pb-1">
                    <div>Client</div>
                    <div>Nbr de rapport</div>
                    <div>Nbr erreurs graves</div>
                  </div>
                  {[
                    { client: 'CLASSIC CIVIL MEXIM', rapport: '', erreurs: 'Err. Grave' }
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-xs py-1">
                      <div>{item.client}</div>
                      <div>{item.rapport}</div>
                      <div>{item.erreurs}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Boutons d'action en bas */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm">
                Encodage/Nettoyage
              </Button>
            </div>
          </div>
        )}

        {viewMode === 'satisfaction' && (
          <div className="space-y-6">
            {/* Navigation des sous-onglets */}
            <div className="flex items-center justify-between">
              <Tabs value={satisfactionView} onValueChange={(value: any) => setSatisfactionView(value)} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="grid w-fit grid-cols-3">
                    <TabsTrigger value="results" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Résultats
                    </TabsTrigger>
                    <TabsTrigger value="surveys" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Gestion
                    </TabsTrigger>
                    <TabsTrigger value="create" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Créer
                    </TabsTrigger>
                  </TabsList>
                  
                  {satisfactionView === 'surveys' && (
                    <Button
                      onClick={() => setSatisfactionView('create')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle enquête
                    </Button>
                  )}
                </div>

                {/* Onglet Résultats (contenu existant) */}
                <TabsContent value="results" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Score Global</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-yellow-700">{satisfactionData.global}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.floor(satisfactionData.global) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-yellow-500 mt-1">sur 5</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Participation</p>
                    <p className="text-3xl font-bold text-green-700">{Math.round((satisfactionData.responses / satisfactionData.total) * 100)}%</p>
                    <p className="text-xs text-green-500 mt-1">{satisfactionData.responses}/{satisfactionData.total} réponses</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Commentaires</p>
                    <p className="text-3xl font-bold text-blue-700">{satisfactionData.comments.length}</p>
                    <p className="text-xs text-blue-500 mt-1">retours qualitatifs</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-purple-500" />
                    Satisfaction par Catégorie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {satisfactionData.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{category.score}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(category.score) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(category.score / 5) * 100} className="flex-1" />
                          <span className="text-xs text-gray-500">{category.responses} réponses</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    Commentaires Récents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {satisfactionData.comments.map((comment, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">{comment.employee}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
                  </div>
                </TabsContent>

                {/* Onglet Gestion des enquêtes */}
                <TabsContent value="surveys" className="mt-6">
                  <div className="space-y-6">
                    {/* Stats des enquêtes */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Total Enquêtes</p>
                            <p className="text-2xl font-bold text-purple-700">{surveys.length}</p>
                          </div>
                          <FileText className="w-6 h-6 text-purple-500" />
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Actives</p>
                            <p className="text-2xl font-bold text-green-700">{surveys.filter(s => s.status === 'active').length}</p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-600">Brouillons</p>
                            <p className="text-2xl font-bold text-orange-700">{surveys.filter(s => s.status === 'draft').length}</p>
                          </div>
                          <Edit className="w-6 h-6 text-orange-500" />
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Terminées</p>
                            <p className="text-2xl font-bold text-gray-700">{surveys.filter(s => s.status === 'closed').length}</p>
                          </div>
                          <XCircle className="w-6 h-6 text-gray-500" />
                        </div>
                      </Card>
                    </div>

                    {/* Liste des enquêtes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5 text-blue-500" />
                          Mes Enquêtes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {surveys.map((survey) => (
                            <div key={survey.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                                    <Badge 
                                      className={
                                        survey.status === 'active' ? 'bg-green-100 text-green-700' :
                                        survey.status === 'draft' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                      }
                                    >
                                      {survey.status === 'active' ? 'Active' : 
                                       survey.status === 'draft' ? 'Brouillon' : 'Terminée'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      Créée le {survey.createdDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Fin le {survey.endDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {survey.responses.length}/{survey.recipients.length} réponses
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Voir
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Send className="w-4 h-4 mr-1" />
                                    Envoyer
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Copy className="w-4 h-4 mr-1" />
                                    Dupliquer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Onglet Création d'enquête */}
                <TabsContent value="create" className="mt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Créer une nouvelle enquête</h3>
                      <p className="text-gray-600">Choisissez un modèle ou créez votre enquête personnalisée</p>
                    </div>

                    {/* Modèles d'enquêtes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {surveyTemplates.map((template) => (
                        <Card 
                          key={template.id} 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="text-4xl mb-3">{template.icon}</div>
                            <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <Badge variant="outline">{template.category}</Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {template.estimatedTime}min
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedTemplate && (
                      <Card className="border-2 border-purple-200 bg-purple-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{selectedTemplate.icon}</span>
                            Aperçu : {selectedTemplate.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="survey-title">Titre de l'enquête</Label>
                                <Input 
                                  id="survey-title" 
                                  placeholder={`${selectedTemplate.name} - ${new Date().toLocaleDateString('fr-FR')}`}
                                />
                              </div>
                              <div>
                                <Label htmlFor="survey-description">Description</Label>
                                <Input 
                                  id="survey-description" 
                                  placeholder={selectedTemplate.description}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="end-date">Date de fin</Label>
                                <Input 
                                  id="end-date" 
                                  type="date" 
                                  defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <Label htmlFor="recipients">Destinataires</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">Toute l'équipe</SelectItem>
                                    <SelectItem value="managers">Managers uniquement</SelectItem>
                                    <SelectItem value="developers">Développeurs</SelectItem>
                                    <SelectItem value="custom">Personnalisé</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                                  <Switch id="anonymous" />
                                  <Label htmlFor="anonymous">Anonyme</Label>
                  </div>
                </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Questions incluses :</h5>
                              <div className="space-y-2">
                                {selectedTemplate.questions.map((question, index) => (
                                  <div key={question.id} className="flex items-center gap-2 text-sm p-2 bg-white rounded border">
                                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                                      {index + 1}
                                    </span>
                                    <span className="flex-1">{question.question}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {question.type === 'rating' ? 'Note' : 
                                       question.type === 'multiple_choice' ? 'Choix' :
                                       question.type === 'yes_no' ? 'Oui/Non' : 'Texte'}
                                    </Badge>
                                    {question.required && (
                                      <Badge variant="secondary" className="text-xs">Obligatoire</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                                Annuler
                              </Button>
                              <div className="flex gap-2">
                                <Button variant="outline">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Personnaliser
                                </Button>
                                <Button 
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                  onClick={() => {
                                    // Créer l'enquête
                                    const newSurvey: Survey = {
                                      id: `survey-${Date.now()}`,
                                      title: `${selectedTemplate.name} - ${new Date().toLocaleDateString('fr-FR')}`,
                                      description: selectedTemplate.description,
                                      template: selectedTemplate,
                                      status: 'draft',
                                      createdDate: new Date().toLocaleDateString('fr-FR'),
                                      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
                                      recipients: teamData.map(emp => emp.email),
                                      responses: [],
                                      anonymous: true
                                    };
                                    setSurveys([...surveys, newSurvey]);
                                    setSelectedTemplate(null);
                                    setSatisfactionView('surveys');
                                  }}
                                >
                                  <Zap className="w-4 h-4 mr-2" />
                                  Créer l'enquête
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
              </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Modal de détails collaborateur */}
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedEmployee(null)}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: getStatusColor(selectedEmployee.status) }}
                    >
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Gestion des paramètres collaborateur</h2>
                      <p className="text-lg text-gray-600">PROFIL DU COLLABORATEUR : {selectedEmployee.name.toUpperCase()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEmployee(null)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date D'arrivée</label>
                      <input type="date" className="w-full p-2 border rounded" placeholder="sélectionner une date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date De Départ</label>
                      <input type="date" className="w-full p-2 border rounded" placeholder="sélectionner une date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveau De Séniorité</label>
                      <select className="w-full p-2 border rounded">
                        <option value={selectedEmployee.niveau}>{selectedEmployee.niveau}</option>
                        <option value="Junior">Junior</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                      <select className="w-full p-2 border rounded">
                        <option value={selectedEmployee.zone}>{selectedEmployee.zone}</option>
                        <option value="France">France</option>
                        <option value="Maroc">Maroc</option>
                        <option value="Belgique">Belgique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BU</label>
                      <select className="w-full p-2 border rounded">
                        <option value={selectedEmployee.bu}>{selectedEmployee.bu}</option>
                        <option value="DEV">DEV</option>
                        <option value="OAM">OAM</option>
                        <option value="PROD">PROD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
                      <select className="w-full p-2 border rounded">
                        <option value={selectedEmployee.partner}>{selectedEmployee.partner}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                      <select className="w-full p-2 border rounded">
                        <option value={selectedEmployee.role}>{selectedEmployee.role}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Binôme</label>
                      <div className="flex items-center space-x-2">
                        <select className="flex-1 p-2 border rounded">
                          <option value={selectedEmployee.binome}>{selectedEmployee.binome}</option>
                        </select>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Régime et NF Special Project */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Régime</label>
                    <select className="w-full p-2 border rounded">
                      <option value={selectedEmployee.regime}>{selectedEmployee.regime}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NF Special Project</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      value={selectedEmployee.nfSpecialProject}
                      placeholder="saisir le special project"
                    />
                  </div>
                </div>

                {/* Heures de travail par jour */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Heures de travail par jour</h3>
                  <p className="text-sm text-gray-600 mb-4">(Nombre d'heures restantes à affecter: 01H00)</p>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].map(day => (
                      <div key={day} className="space-y-2">
                        <h4 className="font-medium text-center capitalize">{day}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            <input 
                              type="number" 
                              className="w-12 h-8 text-center border rounded text-sm"
                              value={selectedEmployee.heuresParJour[day].bureau}
                              readOnly
                            />
                            <span className="text-xs">H</span>
                            <input 
                              type="number" 
                              className="w-12 h-8 text-center border rounded text-sm"
                              value="00"
                              readOnly
                            />
                          </div>
                          <div className="text-xs text-center">Bureau</div>
                          
                          <div className="flex items-center space-x-1">
                            <input 
                              type="number" 
                              className="w-12 h-8 text-center border rounded text-sm"
                              value={selectedEmployee.heuresParJour[day].teletravail}
                              readOnly
                            />
                            <span className="text-xs">H</span>
                            <input 
                              type="number" 
                              className="w-12 h-8 text-center border rounded text-sm"
                              value="00"
                              readOnly
                            />
                          </div>
                          <div className="text-xs text-center">Télétravail</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Types de congés */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">Types de congés</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedEmployee.congesDetailles).map(([type, jours]) => (
                      <div key={type} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded text-center"
                          value={String(jours)}
                          placeholder="Nombre de jours"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Résumé */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Vacances annuelles:</strong> {selectedEmployee.vacancesAnnuelles}j
                    </div>
                    <div>
                      <strong>Heures/semaine:</strong> {selectedEmployee.heuresSemaine}H
                    </div>
                    <div>
                      <strong>Nombre de semaine:</strong> {selectedEmployee.nombreSemaine}
                    </div>
                    <div>
                      <strong>NF Spécial project:</strong> {selectedEmployee.nfSpecialProject}
                    </div>
                    <div>
                      <strong>Total:</strong> {selectedEmployee.totalAnnuel}H
                    </div>
                    <div>
                      <strong>Heures NF annuelle:</strong> 194
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Congé Fixe - RTT :</span> 5j | <span className="font-medium">Fériés :</span> 15j
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RHModern;

