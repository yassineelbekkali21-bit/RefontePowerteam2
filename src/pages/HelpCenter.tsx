import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Calendar,
  FileText,
  Eye,
  TrendingUp,
  Building,
  Clock,
  Brain,
  Sparkles,
  Shield,
  Bell
} from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'clients',
      name: 'Clients',
      icon: Users,
      category: 'Fondations',
      color: 'bg-green-500',
      description: 'Votre centre de gestion client unifié',
      userBenefit: 'Accédez instantanément à toutes les informations de vos clients : coordonnées, historiques, budgets et prestations en cours.',
      features: [
        'Fiche client complète et interactive',
        'Historique des prestations et communications',
        'Gestion des budgets et tarifications',
        'Suivi des échéances et alertes automatiques'
      ],
      quickStart: 'Cliquez sur "Clients" dans la barre latérale pour voir la liste de vos clients. Utilisez la barre de recherche pour trouver rapidement un client spécifique.'
    },
    {
      id: 'equipe',
      name: 'Équipe',
      icon: Building,
      category: 'Fondations',
      color: 'bg-blue-500',
      description: 'Gérez efficacement votre équipe et leurs compétences',
      userBenefit: 'Optimisez la répartition des tâches grâce à une vue claire des capacités et disponibilités de chaque collaborateur.',
      features: [
        'Profils collaborateurs détaillés',
        'Capacity Planning intelligent',
        'Suivi des compétences et formations',
        'Gestion des congés et plannings'
      ],
      quickStart: 'Naviguez vers "Équipe" pour voir tous vos collaborateurs. Le Capacity Planning vous aide à attribuer les clients selon les disponibilités.'
    },
    {
      id: 'prestations',
      name: 'Prestations',
      icon: Clock,
      category: 'Fondations',
      color: 'bg-teal-500',
      description: 'Suivez précisément vos prestations et temps de travail',
      userBenefit: 'Maîtrisez votre rentabilité en analysant le temps réel passé sur chaque client et prestation.',
      features: [
        'Timesheet intelligent et intuitif',
        'Analyse des temps par client/collaborateur',
        'Indicateurs de complétion en temps réel',
        'Rapports de productivité détaillés'
      ],
      quickStart: 'Utilisez l\'onglet "Prestations" pour encoder vos heures ou analyser les temps de votre équipe. Les filtres vous permettent de cibler des périodes spécifiques.'
    },
    {
      id: 'production',
      name: 'Production',
      icon: Settings,
      category: 'Opérations',
      color: 'bg-emerald-500',
      description: 'Pilotez votre production avec intelligence',
      userBenefit: 'Anticipez les charges de travail et respectez vos délais grâce à une planification automatisée.',
      features: [
        'Planification intelligente des tâches',
        'Suivi des échéances en temps réel',
        'Optimisation automatique des charges',
        'Synchronisation avec vos outils (Outlook, etc.)'
      ],
      quickStart: 'Le module "Production" centralise toutes vos échéances. Utilisez la vue calendrier pour une vision temporelle de votre charge.'
    },
    {
      id: 'developpement',
      name: 'Développement',
      icon: Eye,
      category: 'Opérations',
      color: 'bg-purple-500',
      description: 'Accompagnez et développez vos collaborateurs',
      userBenefit: 'Améliorez continuellement la qualité de service en identifiant les besoins de formation et en suivant les progrès.',
      features: [
        'Sessions de supervision documentées',
        'Plans de développement personnalisés',
        'Génération automatique de formations',
        'Suivi des progrès et compétences'
      ],
      quickStart: 'Créez une "Nouvelle Session de Supervision" pour documenter vos observations. L\'IA vous propose automatiquement des plans de formation.'
    },
    {
      id: 'humain',
      name: 'Humain (RH)',
      icon: Users,
      category: 'Opérations',
      color: 'bg-orange-500',
      description: 'Centralisez la gestion RH de votre fiduciaire',
      userBenefit: 'Simplifiez la gestion administrative et améliorez le bien-être de vos collaborateurs.',
      features: [
        'Gestion des congés intelligente',
        'Système de bonus et récompenses',
        'Enquêtes de satisfaction',
        'Calendrier d\'équipe collaboratif'
      ],
      quickStart: 'Gérez les demandes de congés dans l\'onglet "Humain". Le calendrier d\'équipe vous aide à visualiser les absences et prendre des décisions éclairées.'
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: BarChart3,
      category: 'Stratégie',
      color: 'bg-indigo-500',
      description: 'Optimisez votre rentabilité et identifiez les risques',
      userBenefit: 'Prenez des décisions financières éclairées grâce à des analyses automatisées et des alertes proactives.',
      features: [
        'Analyse financière automatisée',
        'Détection des clients à risque',
        'Optimisation des tarifications',
        'Tableaux de bord personnalisables'
      ],
      quickStart: 'L\'onglet "Finance" vous donne une vue d\'ensemble de votre santé financière. Les cartes colorées identifient rapidement les clients nécessitant votre attention.'
    },
    {
      id: 'croissance',
      name: 'Croissance',
      icon: TrendingUp,
      category: 'Stratégie',
      color: 'bg-pink-500',
      description: 'Développez votre portefeuille client stratégiquement',
      userBenefit: 'Identifiez les opportunités de croissance et fidélisez vos clients existants.',
      features: [
        'Suivi des prospects et opportunités',
        'Analyse de la satisfaction client',
        'Stratégies de rétention personnalisées',
        'Indicateurs de performance commerciale'
      ],
      quickStart: 'Utilisez "Croissance" pour suivre vos prospects. Les indicateurs vous guident vers les actions prioritaires pour développer votre activité.'
    },
    {
      id: 'agent-ia',
      name: 'DEG Assistant',
      icon: Brain,
      category: 'Outils IA',
      color: 'bg-cyan-500',
      description: 'Votre assistant intelligent pour la communication client',
      userBenefit: 'Automatisez vos tâches répétitives et améliorez votre réactivité client grâce à l\'intelligence artificielle.',
      features: [
        'Chat conversationnel intelligent',
        'Automatisation des communications',
        'Rappels et alertes personnalisés',
        'Suggestions d\'actions contextuelles'
      ],
      quickStart: 'Ouvrez le DEG Assistant pour obtenir de l\'aide ou automatiser vos communications. Tapez votre question en langage naturel.'
    },
    {
      id: 'meeting-builder',
      name: 'Meeting Builder',
      icon: MessageSquare,
      category: 'Outils IA',
      color: 'bg-yellow-500',
      description: 'Préparez des réunions professionnelles percutantes',
      userBenefit: 'Gagnez du temps dans la préparation de vos réunions avec des présentations automatiquement générées.',
      features: [
        'Bibliothèque de slides personnalisable',
        'Génération automatique de présentations',
        'Intégration des données clients',
        'Mode présentation full-screen'
      ],
      quickStart: 'Créez une nouvelle présentation dans "Meeting Builder". Sélectionnez vos slides et l\'outil génère automatiquement une présentation cohérente.'
    }
  ];

  const categories = [
    { name: 'Fondations', description: 'Les modules essentiels pour démarrer', color: 'text-green-600' },
    { name: 'Opérations', description: 'Gérez efficacement vos opérations quotidiennes', color: 'text-blue-600' },
    { name: 'Stratégie', description: 'Pilotez votre croissance et rentabilité', color: 'text-purple-600' },
    { name: 'Outils IA', description: 'Tirez parti de l\'intelligence artificielle', color: 'text-cyan-600' }
  ];

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PageHeader
          title="Centre d'Aide"
          description="Découvrez comment tirer le meilleur parti de Powerteam"
          icon={HelpCircle}
          actions={
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          }
        />

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="getting-started">Démarrage</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {/* Vue d'ensemble des catégories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map((category) => (
                <Card key={category.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <h3 className={`text-lg font-semibold mb-2 ${category.color}`}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {modules.filter(m => m.category === category.name).length} modules
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Liste des modules */}
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryModules = filteredModules.filter(m => m.category === category.name);
                if (categoryModules.length === 0) return null;

                return (
                  <div key={category.name}>
                    <h2 className={`text-2xl font-bold mb-4 ${category.color}`}>
                      {category.name}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {categoryModules.map((module) => {
                        const IconComponent = module.icon;
                        return (
                          <Card 
                            key={module.id} 
                            className={`hover:shadow-xl transition-all duration-300 cursor-pointer ${
                              activeModule === module.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                          >
                            <CardHeader>
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 ${module.color} text-white rounded-lg`}>
                                  <IconComponent className="w-6 h-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{module.name}</CardTitle>
                                  <p className="text-gray-600 text-sm">{module.description}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm font-medium text-blue-800">
                                  💡 Bénéfice pour vous :
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                  {module.userBenefit}
                                </p>
                              </div>

                              {activeModule === module.id && (
                                <div className="space-y-4 animate-in slide-in-from-top-5 duration-200">
                                  <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Fonctionnalités principales :</h4>
                                    <ul className="space-y-1">
                                      {module.features.map((feature, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-start">
                                          <span className="text-green-500 mr-2">✓</span>
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <p className="text-sm font-medium text-green-800">
                                      🚀 Pour commencer :
                                    </p>
                                    <p className="text-sm text-green-700 mt-1">
                                      {module.quickStart}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="getting-started" className="space-y-6">
            {/* Guide de démarrage rapide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
                  Guide de Démarrage Rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Découvrez vos Modules</h3>
                    <p className="text-sm text-gray-600">
                      Explorez les modules disponibles selon votre forfait. Commencez par les "Fondations".
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Synchronisez vos Données</h3>
                    <p className="text-sm text-gray-600">
                      Connectez vos sources de données (ERP, Excel) pour alimenter Powerteam.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Configurez vos Préférences</h3>
                    <p className="text-sm text-gray-600">
                      Personnalisez l'interface et les notifications selon vos besoins.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;
