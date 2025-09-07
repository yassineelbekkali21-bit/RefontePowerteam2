import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Presentation, 
  Plus, 
  FolderOpen, 
  Layers,
  Users,
  Settings,
  Play,
  Edit,
  Copy,
  Download,
  Share,
  FileText,
  Archive,
  Search,
  Filter,
  BookOpen,
  Target,
  BarChart3,
  TrendingUp,
  Building,
  Zap,
  Eye,
  Star,
  Clock,
  Check,
  X,
  Bot,
  Bell,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Video
} from 'lucide-react';

const MeetingBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('tous');
  
  // États pour la prévisualisation et présentation
  const [previewSlide, setPreviewSlide] = useState(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Bibliothèque de slides organisée par catégories - ENRICHIE avec toutes les données Powerteam
  const slidesLibrary = {
    // 📊 PERFORMANCE & FINANCE
    performance: [
      // KPIs généraux
      { id: 'vue-ensemble', title: 'Vue d\'Ensemble Powerteam', description: 'Dashboard global avec tous les indicateurs', type: 'dashboard', dataSource: 'vue-ensemble', category: 'Direction' },
      { id: 'kpi-mensuel', title: 'KPIs Mensuels', description: 'Tableau de bord performance mensuel', type: 'dashboard', dataSource: 'finance', category: 'Direction' },
      
      // Finance
      { id: 'ca-evolution', title: 'Évolution CA', description: 'Graphique progression CA', type: 'chart', dataSource: 'finance', category: 'Direction' },
      { id: 'budgets-annuels', title: 'Budgets Annuels', description: 'Budget horaire & économique total', type: 'metrics', dataSource: 'finance', category: 'Direction' },
      { id: 'realises-annuels', title: 'Réalisés Annuels', description: 'Réalisé horaire & économique par région', type: 'metrics', dataSource: 'finance', category: 'Direction' },
      { id: 'realise-trimestriel', title: 'Réalisé Économique Trimestriel', description: 'Performance par trimestre', type: 'chart', dataSource: 'finance', category: 'Direction' },
      { id: 'encours-age', title: 'Répartition Encours par Âge', description: 'Encours détaillé 0-30j, 30-60j, +90j', type: 'breakdown', dataSource: 'finance', category: 'Direction' },
      { id: 'clients-suspects', title: 'Clients Suspects', description: 'Liste et analyses financières', type: 'table', dataSource: 'finance', category: 'Direction' },
      { id: 'rentabilite', title: 'Analyse Rentabilité', description: 'Rentabilité par service et client', type: 'analysis', dataSource: 'finance', category: 'Direction' },
      { id: 'rentabilite-partners', title: 'Rentabilité par Partenaire', description: 'Performance économique Mohamed, Julien, Vincent, Pol, Ingrid, Pierre', type: 'partners', dataSource: 'finance', category: 'Direction' },
      { id: 'impact-clients', title: 'Impact Clients', description: 'CA clients entrants/sortants/à risque', type: 'impact', dataSource: 'finance', category: 'Direction' },
      { id: 'revisions-forfaits', title: 'Révisions de Forfaits', description: 'Forfaits en cours de révision', type: 'list', dataSource: 'finance', category: 'Direction' },
      { id: 'intelligence-financiere', title: 'Intelligence Financière', description: 'Analyse prédictive et suspicions', type: 'ai-analysis', dataSource: 'finance', category: 'Direction' }
    ],
    
    // 👥 ÉQUIPE & RH
    equipe: [
      // Production individuelle
      { id: 'production-team', title: 'Production Équipe', description: 'Métriques individuelles par collaborateur', type: 'dashboard', dataSource: 'production', category: 'Management' },
      { id: 'timesheet-suivi', title: 'Suivi Timesheet', description: 'Heures réalisées vs budgetées', type: 'tracking', dataSource: 'production', category: 'Management' },
      { id: 'encodage-performance', title: 'Performance Encodage', description: 'Volumétrie et efficacité par type', type: 'metrics', dataSource: 'production', category: 'Management' },
      { id: 'nettoyage-operations', title: 'Opérations Nettoyage', description: 'Suivi des opérations comptables', type: 'operations', dataSource: 'production', category: 'Management' },
      { id: 'echeances-fiscales', title: 'Échéances Fiscales', description: 'Planning et suivi des échéances', type: 'calendar', dataSource: 'production', category: 'Management' },
      
      // RH & Congés
      { id: 'conges-planning', title: 'Planning Congés', description: 'Vue d\'ensemble congés équipe', type: 'calendar', dataSource: 'rh', category: 'Management' },
      { id: 'conges-statuts', title: 'Statuts Demandes Congés', description: 'Approuvées, en attente, refusées', type: 'status', dataSource: 'rh', category: 'Management' },
      { id: 'conges-types', title: 'Types de Congés', description: 'Répartition par type (maladie, annuel, etc.)', type: 'breakdown', dataSource: 'rh', category: 'Management' },
      { id: 'collaborateurs-performance', title: 'Performance Collaborateurs', description: 'CA et VA par collaborateur', type: 'performance', dataSource: 'rh', category: 'Management' },
      
      // Formation & Développement
      { id: 'formation-suivi', title: 'Suivi Formations', description: 'Progression formations par collaborateur', type: 'progress', dataSource: 'rh', category: 'Management' },
      { id: 'formation-besoins', title: 'Besoins Formation', description: 'Analyse des besoins exprimés', type: 'needs', dataSource: 'rh', category: 'Management' },
      { id: 'satisfaction-equipe', title: 'Satisfaction Équipe', description: 'Résultats enquêtes satisfaction', type: 'survey', dataSource: 'rh', category: 'Management' },
      { id: 'bonus-plans', title: 'Plans Bonus', description: 'Suivi des plans de bonus', type: 'incentives', dataSource: 'rh', category: 'Management' },
      { id: 'objectifs-equipe', title: 'Objectifs Équipe', description: 'Suivi objectifs mensuels/trimestriels', type: 'targets', dataSource: 'production', category: 'Management' }
    ],
    
    // 🚀 COMMERCIAL & CROISSANCE
    commercial: [
      // Prospects
      { id: 'pipeline-commercial', title: 'Pipeline Commercial', description: 'Prospects en cours par statut', type: 'funnel', dataSource: 'croissance', category: 'Commercial' },
      { id: 'prospects-kpis', title: 'KPIs Prospects', description: 'Taux conversion, CA moyen, satisfaction', type: 'kpis', dataSource: 'croissance', category: 'Commercial' },
      { id: 'prospects-par-statut', title: 'Prospects par Statut', description: 'Converti, non converti, en cours', type: 'status', dataSource: 'croissance', category: 'Commercial' },
      { id: 'prospects-par-canal', title: 'Prospects par Canal', description: 'Mail, téléphone, visite, recommandation', type: 'channels', dataSource: 'croissance', category: 'Commercial' },
      { id: 'emails-prospects', title: 'Emails Prospects', description: 'Gestion emails entrants prospects', type: 'emails', dataSource: 'croissance', category: 'Commercial' },
      
      // Clients entrants
      { id: 'nouveaux-clients', title: 'Clients Entrants', description: 'Nouveaux clients par statut', type: 'list', dataSource: 'croissance', category: 'Commercial' },
      { id: 'clients-entrants-budget', title: 'Budget Clients Entrants', description: 'CA budgeté vs réalisé nouveaux clients', type: 'budget', dataSource: 'croissance', category: 'Commercial' },
      { id: 'clients-entrants-suivi', title: 'Suivi Contacts Clients Entrants', description: 'Contacts 1 mois et 9 mois', type: 'tracking', dataSource: 'croissance', category: 'Commercial' },
      { id: 'onboarding-progress', title: 'Progression Onboarding', description: 'Offre signée → Mandats activés', type: 'progress', dataSource: 'croissance', category: 'Commercial' },
      
      // Clients à suivre et en partance
      { id: 'clients-suivre', title: 'Clients à Suivre', description: 'Clients à risque et récupérés', type: 'monitoring', dataSource: 'croissance', category: 'Commercial' },
      { id: 'clients-partance', title: 'Clients en Partance', description: 'Clients à risque de partir', type: 'risk', dataSource: 'croissance', category: 'Commercial' },
      { id: 'taux-recuperation', title: 'Taux Récupération', description: 'Clients récupérés vs perdus', type: 'recovery', dataSource: 'croissance', category: 'Commercial' },
      { id: 'clients-sortants', title: 'Clients Sortants', description: 'Clients perdus avec raisons', type: 'departure', dataSource: 'croissance', category: 'Commercial' },
      
      // Satisfaction & fidélisation
      { id: 'satisfaction-client', title: 'Satisfaction Client', description: 'Enquêtes et feedback clients', type: 'survey', dataSource: 'clients', category: 'Commercial' },
      { id: 'retention-client', title: 'Rétention Clients', description: 'Analyse fidélisation et churn', type: 'analysis', dataSource: 'clients', category: 'Commercial' }
    ],
    
    // 🔧 PROJETS & DÉVELOPPEMENT
    projets: [
      { id: 'projets-actifs', title: 'Projets Actifs', description: 'État d\'avancement projets', type: 'kanban', dataSource: 'developpement', category: 'Technique' },
      { id: 'corrections-plans', title: 'Plans Correction', description: 'Express et Complets en cours', type: 'progress', dataSource: 'developpement', category: 'Technique' },
      { id: 'plans-par-client', title: 'Plans par Client', description: 'Historique corrections par client', type: 'client-plans', dataSource: 'developpement', category: 'Technique' },
      { id: 'roadmap-tech', title: 'Roadmap Technique', description: 'Évolutions prévues plateforme', type: 'timeline', dataSource: 'developpement', category: 'Technique' },
      { id: 'innovations', title: 'Innovations', description: 'Nouvelles fonctionnalités', type: 'gallery', dataSource: 'developpement', category: 'Technique' },
      { id: 'ia-suggestions', title: 'Suggestions IA', description: 'Recommandations automatiques', type: 'ai-insights', dataSource: 'agent-ia', category: 'Technique' }
    ],
    
    // 📋 ENTRETIENS ANNUELS
    entretiens: [
      { id: 'bilan-individuel', title: 'Bilan Individuel', description: 'Performance annuelle collaborateur', type: 'individual', dataSource: 'rh', category: 'Entretien' },
      { id: 'objectifs-atteints', title: 'Objectifs Atteints', description: 'Réalisation objectifs vs prévus', type: 'achievements', dataSource: 'rh', category: 'Entretien' },
      { id: 'competences-evolution', title: 'Évolution Compétences', description: 'Progression compétences techniques', type: 'skills', dataSource: 'rh', category: 'Entretien' },
      { id: 'formation-plan', title: 'Plan Formation', description: 'Besoins formation identifiés', type: 'training-plan', dataSource: 'rh', category: 'Entretien' },
      { id: 'objectifs-futurs', title: 'Objectifs Futurs', description: 'Définition objectifs année suivante', type: 'future-goals', dataSource: 'rh', category: 'Entretien' },
      { id: 'satisfaction-poste', title: 'Satisfaction Poste', description: 'Feedback sur le poste actuel', type: 'job-satisfaction', dataSource: 'rh', category: 'Entretien' },
      { id: 'evolution-carriere', title: 'Évolution Carrière', description: 'Perspectives d\'évolution', type: 'career', dataSource: 'rh', category: 'Entretien' },
      { id: 'feedback-management', title: 'Feedback Management', description: 'Retours sur le management', type: 'feedback', dataSource: 'rh', category: 'Entretien' }
    ],
    
    // 💼 OPÉRATIONNEL QUOTIDIEN
    operationnel: [
      { id: 'planning-semaine', title: 'Planning Semaine', description: 'Organisation hebdomadaire équipe', type: 'weekly-planning', dataSource: 'production', category: 'Opérationnel' },
      { id: 'urgences-jour', title: 'Urgences du Jour', description: 'Tâches prioritaires immédiates', type: 'urgent', dataSource: 'production', category: 'Opérationnel' },
      { id: 'blocages-equipe', title: 'Blocages Équipe', description: 'Difficultés rencontrées', type: 'blockers', dataSource: 'production', category: 'Opérationnel' },
      { id: 'nouvelles-demandes', title: 'Nouvelles Demandes', description: 'Demandes clients récentes', type: 'requests', dataSource: 'clients', category: 'Opérationnel' },
      { id: 'alertes-systeme', title: 'Alertes Système', description: 'Notifications importantes', type: 'alerts', dataSource: 'notifications', category: 'Opérationnel' },
      { id: 'actions-recommandees', title: 'Actions Recommandées', description: 'Suggestions IA contextuelles', type: 'recommendations', dataSource: 'agent-ia', category: 'Opérationnel' }
    ],
    
    // 🎯 STRATÉGIQUE
    strategique: [
      { id: 'vision-annuelle', title: 'Vision Annuelle', description: 'Objectifs stratégiques année', type: 'vision', dataSource: 'vue-ensemble', category: 'Stratégique' },
      { id: 'marche-analyse', title: 'Analyse Marché', description: 'Positionnement concurrentiel', type: 'market', dataSource: 'croissance', category: 'Stratégique' },
      { id: 'croissance-previsions', title: 'Prévisions Croissance', description: 'Projections CA et développement', type: 'forecast', dataSource: 'finance', category: 'Stratégique' },
      { id: 'investissements', title: 'Investissements', description: 'ROI projets et ressources', type: 'investments', dataSource: 'finance', category: 'Stratégique' },
      { id: 'partenariats', title: 'Partenariats', description: 'Collaborations stratégiques', type: 'partnerships', dataSource: 'croissance', category: 'Stratégique' },
      { id: 'digital-transformation', title: 'Transformation Digitale', description: 'Évolution technologique', type: 'digital', dataSource: 'developpement', category: 'Stratégique' }
    ]
  };

  // Templates de réunions pré-configurés - ENRICHIS pour tous types de réunions
  const meetingTemplates = [
    // Direction & Management
    { 
      id: 'reunion-direction', 
      name: 'Réunion Direction', 
      description: 'Point stratégique mensuel complet',
      defaultSlides: ['vue-ensemble', 'ca-evolution', 'intelligence-financiere', 'pipeline-commercial', 'projets-actifs', 'vision-annuelle'],
      duration: '120min',
      frequency: 'Mensuel',
      category: 'Direction'
    },
    { 
      id: 'comite-strategique', 
      name: 'Comité Stratégique', 
      description: 'Orientations et investissements',
      defaultSlides: ['vision-annuelle', 'croissance-previsions', 'investissements', 'marche-analyse', 'digital-transformation'],
      duration: '180min',
      frequency: 'Trimestriel',
      category: 'Direction'
    },
    
    // Management d'équipe
    { 
      id: 'point-equipe', 
      name: 'Point Équipe', 
      description: 'Suivi hebdomadaire opérationnel',
      defaultSlides: ['planning-semaine', 'urgences-jour', 'production-team', 'blocages-equipe', 'alertes-systeme'],
      duration: '45min',
      frequency: 'Hebdomadaire',
      category: 'Management'
    },
    { 
      id: 'management-review', 
      name: 'Management Review', 
      description: 'Revue mensuelle performance équipe',
      defaultSlides: ['production-team', 'objectifs-equipe', 'satisfaction-equipe', 'formation-besoins', 'conges-planning'],
      duration: '90min',
      frequency: 'Mensuel',
      category: 'Management'
    },
    
    // Commercial
    { 
      id: 'revue-commerciale', 
      name: 'Revue Commerciale', 
      description: 'Suivi pipeline et prospection',
      defaultSlides: ['pipeline-commercial', 'prospects-kpis', 'nouveaux-clients', 'clients-entrants-suivi', 'taux-recuperation'],
      duration: '75min',
      frequency: 'Bi-mensuel',
      category: 'Commercial'
    },
    { 
      id: 'suivi-clients', 
      name: 'Suivi Clients', 
      description: 'Gestion portefeuille et satisfaction',
      defaultSlides: ['satisfaction-client', 'clients-suivre', 'clients-partance', 'retention-client', 'nouvelles-demandes'],
      duration: '60min',
      frequency: 'Mensuel',
      category: 'Commercial'
    },
    
    // Performance & Finance
    { 
      id: 'revue-performance', 
      name: 'Revue Performance', 
      description: 'Analyse financière trimestrielle',
      defaultSlides: ['budgets-annuels', 'realises-annuels', 'rentabilite', 'clients-suspects', 'encours-age'],
      duration: '120min',
      frequency: 'Trimestriel',
      category: 'Direction'
    },
    { 
      id: 'suivi-financier', 
      name: 'Suivi Financier', 
      description: 'Point mensuel indicateurs clés',
      defaultSlides: ['kpi-mensuel', 'realise-trimestriel', 'rentabilite-partners', 'impact-clients'],
      duration: '60min',
      frequency: 'Mensuel',
      category: 'Direction'
    },
    
    // Technique & Projets
    { 
      id: 'suivi-projets', 
      name: 'Suivi Projets', 
      description: 'Avancement développement et corrections',
      defaultSlides: ['projets-actifs', 'corrections-plans', 'plans-par-client', 'roadmap-tech', 'ia-suggestions'],
      duration: '60min',
      frequency: 'Bi-mensuel',
      category: 'Technique'
    },
    
    // Entretiens annuels
    { 
      id: 'entretien-annuel', 
      name: 'Entretien Annuel', 
      description: 'Évaluation individuelle complète',
      defaultSlides: ['bilan-individuel', 'objectifs-atteints', 'competences-evolution', 'satisfaction-poste', 'objectifs-futurs', 'evolution-carriere'],
      duration: '90min',
      frequency: 'Annuel',
      category: 'RH'
    },
    { 
      id: 'entretien-formation', 
      name: 'Entretien Formation', 
      description: 'Plan de développement individuel',
      defaultSlides: ['competences-evolution', 'formation-plan', 'formation-besoins', 'objectifs-futurs'],
      duration: '45min',
      frequency: 'Semestriel',
      category: 'RH'
    },
    
    // Réunions ponctuelles
    { 
      id: 'reunion-urgence', 
      name: 'Réunion Urgence', 
      description: 'Gestion de crise ou urgence',
      defaultSlides: ['urgences-jour', 'blocages-equipe', 'actions-recommandees', 'alertes-systeme'],
      duration: '30min',
      frequency: 'Ponctuel',
      category: 'Opérationnel'
    },
    { 
      id: 'presentation-client', 
      name: 'Présentation Client', 
      description: 'Présentation externe ou partenaire',
      defaultSlides: ['vue-ensemble', 'ca-evolution', 'innovations', 'satisfaction-client', 'partenariats'],
      duration: '45min',
      frequency: 'Ponctuel',
      category: 'Commercial'
    }
  ];

  // Réunions sauvegardées
  const savedMeetings = [
    { id: '1', name: 'Direction Janvier 2024', template: 'reunion-direction', slides: 6, lastModified: '2024-01-15', status: 'draft' },
    { id: '2', name: 'Point Équipe S03', template: 'point-equipe', slides: 4, lastModified: '2024-01-12', status: 'ready' },
    { id: '3', name: 'Revue Q4 2023', template: 'revue-performance', slides: 8, lastModified: '2024-01-10', status: 'archived' }
  ];

  const allSlides = Object.values(slidesLibrary).flat();
  const filteredSlides = allSlides.filter(slide => {
    const matchesSearch = slide.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         slide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slide.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'tous' || Object.keys(slidesLibrary).find(cat => 
                           slidesLibrary[cat].includes(slide)) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSlideSelect = (slide) => {
    if (selectedSlides.find(s => s.id === slide.id)) {
      setSelectedSlides(selectedSlides.filter(s => s.id !== slide.id));
    } else {
      setSelectedSlides([...selectedSlides, slide]);
    }
  };

  const handleTemplateLoad = (template) => {
    const templateSlides = allSlides.filter(slide => template.defaultSlides.includes(slide.id));
    setSelectedSlides(templateSlides);
    setSelectedTemplate(template.id);
  };

  // Fonctions pour la prévisualisation
  const handlePreviewSlide = (slide) => {
    setPreviewSlide(slide);
    setIsPreviewModalOpen(true);
  };

  const handleStartPresentation = () => {
    if (selectedSlides.length > 0) {
      setCurrentSlideIndex(0);
      setIsPresentationMode(true);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < selectedSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleExitPresentation = () => {
    setIsPresentationMode(false);
    setCurrentSlideIndex(0);
  };

  // Fonction pour générer le contenu de prévisualisation d'une slide
  const generateSlidePreview = (slide) => {
    const mockData = {
      // Finance
      'vue-ensemble': {
        title: 'Vue d\'Ensemble Powerteam',
        content: [
          { label: 'CA Réalisé', value: '€1.98M', trend: '+8.2%' },
          { label: 'Clients Actifs', value: '145', trend: '+12' },
          { label: 'Collaborateurs', value: '28', trend: '+3' },
          { label: 'Projets Actifs', value: '15', trend: '+2' }
        ]
      },
      'kpi-mensuel': {
        title: 'KPIs Mensuels',
        content: [
          { label: 'Budget Horaire', value: '67.2%', trend: '+5.1%' },
          { label: 'Budget Économique', value: '40.6%', trend: '+2.3%' },
          { label: 'Satisfaction Client', value: '96%', trend: '+1%' },
          { label: 'Productivité', value: '85%', trend: '+7%' }
        ]
      },
      'ca-evolution': {
        title: 'Évolution CA',
        content: [
          { period: 'Q1 2024', value: 510000 },
          { period: 'Q2 2024', value: 495000 },
          { period: 'Q3 2024', value: 520000 },
          { period: 'Q4 2024', value: 455000 }
        ]
      },
      // Production
      'production-team': {
        title: 'Production Équipe',
        content: [
          { name: 'Mohamed K.', ca: 100, va: 100, efficiency: '95%' },
          { name: 'Youssef B.', ca: 79, va: 100, efficiency: '87%' },
          { name: 'Vanessa A.', ca: 96, va: 100, efficiency: '92%' }
        ]
      },
      // RH
      'conges-planning': {
        title: 'Planning Congés',
        content: [
          { name: 'Marie D.', type: 'Congé Annuel', dates: '15-19 Jan', status: 'Approuvé' },
          { name: 'Pierre L.', type: 'Formation', dates: '22-24 Jan', status: 'En attente' },
          { name: 'Sophie M.', type: 'Maladie', dates: '18 Jan', status: 'Justifié' }
        ]
      },
      // Commercial
      'pipeline-commercial': {
        title: 'Pipeline Commercial',
        content: [
          { stage: 'Prospects', count: 45, value: '€180K' },
          { stage: 'Qualification', count: 23, value: '€95K' },
          { stage: 'Proposition', count: 12, value: '€78K' },
          { stage: 'Négociation', count: 8, value: '€52K' }
        ]
      }
    };

    return mockData[slide.id] || {
      title: slide.title,
      content: [
        { label: 'Données', value: 'En cours de chargement...' },
        { label: 'Source', value: slide.dataSource },
        { label: 'Type', value: slide.type },
        { label: 'Catégorie', value: slide.category }
      ]
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="🎥 Meeting Builder"
          description="Préparation intelligente • Construction sur mesure • Communication alignée"
          icon={Video}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Bibliothèque
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Présentation
              </Button>
            </>
          }
        />

        {/* Stats du Builder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Slides disponibles</p>
                  <p className="text-3xl font-bold text-purple-900">{allSlides.length}</p>
                </div>
                <Layers className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Templates prêts</p>
                  <p className="text-3xl font-bold text-blue-900">{meetingTemplates.length}</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Présentations</p>
                  <p className="text-3xl font-bold text-green-900">{savedMeetings.length}</p>
                </div>
                <Archive className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Slides sélectionnées</p>
                  <p className="text-3xl font-bold text-orange-900">{selectedSlides.length}</p>
                </div>
                <Target className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Constructeur Principal */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="builder" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="builder">Constructeur</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="storage">Stockage</TabsTrigger>
              </TabsList>

              {/* Constructeur de présentation */}
              <TabsContent value="builder" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Bibliothèque de slides */}
                  <div className="xl:col-span-2">
                    <Card>
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5" />
                            <span>Bibliothèque de Slides</span>
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                              <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 w-48"
                              />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* Filtres par catégorie */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          {['tous', 'performance', 'equipe', 'commercial', 'projets', 'entretiens', 'operationnel', 'strategique'].map((category) => (
                            <Button
                              key={category}
                              variant={activeCategory === category ? "default" : "outline"}
                              size="sm"
                              onClick={() => setActiveCategory(category)}
                              className="capitalize"
                            >
                              {category === 'tous' ? 'Toutes' : 
                               category === 'equipe' ? 'Équipe' :
                               category === 'operationnel' ? 'Opérationnel' :
                               category === 'strategique' ? 'Stratégique' :
                               category}
                            </Button>
                          ))}
                        </div>

                        {/* Grille des slides */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                          {filteredSlides.map((slide) => {
                            const isSelected = selectedSlides.find(s => s.id === slide.id);
                            return (
                              <div
                                key={slide.id}
                                onClick={() => handleSlideSelect(slide)}
                                className={`group p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                  isSelected 
                                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{slide.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{slide.description}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {slide.type}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {slide.dataSource}
                                      </Badge>
                                      <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
                                        {slide.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewSlide(slide);
                                      }}
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    {isSelected && (
                                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Prévisualisation construction */}
                  <div>
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <Presentation className="w-4 h-4" />
                          <span>Construction ({selectedSlides.length})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedSlides.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">Sélectionnez des slides pour commencer</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedSlides.map((slide, index) => (
                              <div key={slide.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium">{slide.title}</p>
                                    <p className="text-xs text-gray-500">{slide.type}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSlideSelect(slide)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            
                            <div className="pt-4 border-t space-y-2">
                              <Button 
                                className="w-full"
                                onClick={handleStartPresentation}
                                disabled={selectedSlides.length === 0}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Présentation ({selectedSlides.length})
                              </Button>
                              <Button variant="outline" className="w-full">
                                <Archive className="w-4 h-4 mr-2" />
                                Sauvegarder
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Templates prêts */}
              <TabsContent value="templates" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {meetingTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                                                  <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{template.frequency}</Badge>
                              <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Durée suggérée:</span>
                            <span className="font-medium">{template.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Slides incluses:</span>
                            <span className="font-medium">{template.defaultSlides.length}</span>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h4 className="font-medium text-sm mb-2">Slides par défaut:</h4>
                            <div className="space-y-1">
                              {template.defaultSlides.slice(0, 3).map((slideId) => {
                                const slide = allSlides.find(s => s.id === slideId);
                                return slide ? (
                                  <div key={slideId} className="text-xs text-gray-600 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span>{slide.title}</span>
                                  </div>
                                ) : null;
                              })}
                              {template.defaultSlides.length > 3 && (
                                <div className="text-xs text-gray-500">+ {template.defaultSlides.length - 3} autres...</div>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full mt-4"
                            onClick={() => handleTemplateLoad(template)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Utiliser ce Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Stockage centralisé */}
              <TabsContent value="storage" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5" />
                      <span>Présentations Sauvegardées</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedMeetings.map((meeting) => (
                        <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              meeting.status === 'ready' ? 'bg-green-500' :
                              meeting.status === 'draft' ? 'bg-orange-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <h4 className="font-medium">{meeting.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{meeting.slides} slides</span>
                                <span>Modifié: {meeting.lastModified}</span>
                                <Badge variant="outline" className="text-xs">
                                  {meeting.template}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panneau Données Opérationnelles */}
          <div className="space-y-6">
            {/* Sources de données */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Sources Données</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { module: 'Vue d\'ensemble', slides: 1, icon: BarChart3, color: 'blue' },
                    { module: 'Finance', slides: 12, icon: TrendingUp, color: 'green' },
                    { module: 'Production', slides: 5, icon: Building, color: 'blue' },
                    { module: 'RH', slides: 9, icon: Users, color: 'purple' },
                    { module: 'Croissance', slides: 14, icon: Target, color: 'orange' },
                    { module: 'Clients', slides: 2, icon: Users, color: 'blue' },
                    { module: 'Développement', slides: 6, icon: Zap, color: 'indigo' },
                    { module: 'DEG Assistant', slides: 2, icon: Users, color: 'purple' },
                    { module: 'Notifications', slides: 1, icon: Bell, color: 'red' }
                  ].map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <source.icon className={`w-4 h-4 text-${source.color}-500`} />
                        <span className="text-sm font-medium">{source.module}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {source.slides} slides
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Slide personnalisée
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Dupliquer template
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Share className="w-4 h-4 mr-2" />
                    Partager bibliothèque
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dernières activités */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Récent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Présentation Direction créée", time: "Il y a 2h", icon: Presentation },
                    { action: "Template équipe modifié", time: "Hier", icon: Edit },
                    { action: "Slides performance ajoutées", time: "2 jours", icon: Plus }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation d'une slide */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Prévisualisation - {previewSlide?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {previewSlide && (
            <div className="space-y-6">
              {/* Header slide */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{generateSlidePreview(previewSlide).title}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {previewSlide.dataSource}
                    </Badge>
                    <Badge variant="outline" className="border-white/50 text-white">
                      {previewSlide.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contenu slide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generateSlidePreview(previewSlide).content.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    {item.label && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{item.value}</span>
                          {item.trend && (
                            <span className={`text-sm font-medium ${
                              item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {item.name && (
                      <div className="space-y-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(item).filter(([key]) => key !== 'name').map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.stage && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.stage}</span>
                        <div className="text-right">
                          <div className="font-bold">{item.count}</div>
                          <div className="text-sm text-gray-600">{item.value}</div>
                        </div>
                      </div>
                    )}
                    {item.period && (
                      <div className="text-center">
                        <div className="text-sm text-gray-600">{item.period}</div>
                        <div className="text-lg font-bold">€{(item.value / 1000).toFixed(0)}K</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  handleSlideSelect(previewSlide);
                  setIsPreviewModalOpen(false);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter à la présentation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mode présentation plein écran */}
      {isPresentationMode && selectedSlides.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header de navigation */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitPresentation}
                className="text-white hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Quitter
              </Button>
              <span className="text-sm">
                Slide {currentSlideIndex + 1} sur {selectedSlides.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="text-white hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextSlide}
                disabled={currentSlideIndex === selectedSlides.length - 1}
                className="text-white hover:bg-gray-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Contenu de la slide actuelle */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {(() => {
                const currentSlide = selectedSlides[currentSlideIndex];
                const slideData = generateSlidePreview(currentSlide);
                
                return (
                  <div className="bg-white rounded-lg p-8 min-h-full">
                    {/* Header slide */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg mb-8">
                      <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold">{slideData.title}</h1>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-white/20 text-white text-sm px-3 py-1">
                            {currentSlide.dataSource}
                          </Badge>
                          <Badge variant="outline" className="border-white/50 text-white text-sm px-3 py-1">
                            {currentSlide.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Contenu slide */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {slideData.content.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                          {item.label && (
                            <div className="space-y-3">
                              <div className="text-lg font-medium text-gray-600">{item.label}</div>
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900">{item.value}</span>
                                {item.trend && (
                                  <span className={`text-lg font-medium px-3 py-1 rounded-full ${
                                    item.trend.startsWith('+') 
                                      ? 'text-green-700 bg-green-100' 
                                      : 'text-red-700 bg-red-100'
                                  }`}>
                                    {item.trend}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {item.name && (
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                              <div className="space-y-2">
                                {Object.entries(item).filter(([key]) => key !== 'name').map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between text-base">
                                    <span className="text-gray-600 capitalize">{key}:</span>
                                    <span className="font-semibold text-gray-900">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.stage && (
                            <div className="text-center space-y-3">
                              <h3 className="text-xl font-bold text-gray-900">{item.stage}</h3>
                              <div className="text-3xl font-bold text-purple-600">{item.count}</div>
                              <div className="text-lg text-gray-600">{item.value}</div>
                            </div>
                          )}
                          {item.period && (
                            <div className="text-center space-y-3">
                              <div className="text-lg text-gray-600">{item.period}</div>
                              <div className="text-3xl font-bold text-blue-600">€{(item.value / 1000).toFixed(0)}K</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Navigation en bas */}
          <div className="bg-gray-900 p-4">
            <div className="flex items-center justify-center space-x-2">
              {selectedSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlideIndex ? 'bg-purple-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MeetingBuilder;
