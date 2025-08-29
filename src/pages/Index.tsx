import { 
  BarChart3, TrendingUp, DollarSign, Users, Calendar, Factory, ArrowRight, Clock, 
  Target, Code, CreditCard, Bell, FileText, AlertCircle, CheckCircle, Bot, Video,
  Shield, Briefcase, Zap, Activity, AlertTriangle, CalendarDays, PiggyBank,
  TrendingDown, Gauge, MapPin, Plane, Coffee, Home, Sparkles, Eye, BookOpen
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationsContext';
import { usePlans } from '@/contexts/PlansContext';

const Index = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();
  const { plans } = usePlans();

  // Simuler les rôles utilisateur (à remplacer par contexte auth réel)
  const userRole: 'manager' | 'collaborateur' = 'manager';
  const userName = 'Yassine Elbekkal';

  // Statistiques réelles des plans
  const activePlans = plans.filter(p => p.status === 'inprogress').length;
  const completedPlans = plans.filter(p => p.status === 'done').length;
  const pendingPlans = plans.filter(p => p.status === 'todo').length;

  // Mock data basée sur les vraies données Powerteam
  const dashboardData = {
    // Bloc Clients
    clients: {
      total: userRole === 'manager' ? 145 : 23,
      entrants: { count: 12, ca: 180000 },
      sortants: { count: 8, ca: 95000 }
    },
    
    // Bloc Échéances  
    echeances: {
      urgentesAPlanifier: 8,
      urgentesEnCours: 15,
      enRetard: 3
    },
    
    // Bloc Plans en attente
    plansEnAttente: pendingPlans,
    
    // Bloc Congés
    conges: {
      restants: 18,
      prochainCongePersonnel: { date: '2024-02-15', type: 'Congé Annuel', duree: 5 },
      prochainsCongesEquipe: [
        { nom: 'Marie D.', date: '2024-02-12', type: 'Formation' },
        { nom: 'Pierre L.', date: '2024-02-20', type: 'Congé Maladie' }
      ],
      prochainJourFerie: { date: '2024-04-01', nom: 'Lundi de Pâques' }
    },
    
    // Bloc Clients suspects
    clientsSuspects: 8,
    
    // Bloc CA Réalisé vs Budgété
    ca: {
      realise: 285000,
      budgete: 350000,
      pourcentage: 81.4
    },
    
    // Bloc Capacité Planning
    capacitePlanning: 73.5,
    
    // Bloc Planning (bribes)
    planning: {
      aujourd_hui: [
        { heure: '09:00', titre: 'RDV Client SARL Dupont', type: 'client' },
        { heure: '14:30', titre: 'Point équipe hebdo', type: 'interne' },
        { heure: '16:00', titre: 'Formation TVA', type: 'formation' }
      ],
      demain: [
        { heure: '10:00', titre: 'Analyse financière Q1', type: 'analyse' },
        { heure: '15:00', titre: 'Entretien candidat', type: 'rh' }
      ]
    }
  };

  // Fonction utilitaire pour formater les montants
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Powerteam"
          description={`Bonjour ${userName} • ${userRole === 'manager' ? 'Manager' : 'Collaborateur'}`}
          icon={Sparkles}
        />

        {/* Grille de blocs modulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Bloc Clients */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/clients')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Clients</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData.clients.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    {userRole === 'manager' ? 'Total' : 'Mes clients'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    +{dashboardData.clients.entrants.count}
                  </div>
                  <div className="text-sm text-gray-600">Entrants</div>
                </div>
            </div>
            
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CA Entrants</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(dashboardData.clients.entrants.ca)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CA Sortants</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(dashboardData.clients.sortants.ca)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Échéances */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/production')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Échéances</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">À planifier</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {dashboardData.echeances.urgentesAPlanifier}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En cours</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {dashboardData.echeances.urgentesEnCours}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En retard</span>
                <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                  {dashboardData.echeances.enRetard}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Planning */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/production')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
                  <CardTitle className="text-lg">Planning</CardTitle>
          </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </div>
            </CardHeader>
            <CardContent className="space-y-3">
            <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Aujourd'hui</div>
                <div className="space-y-1">
                  {dashboardData.planning.aujourd_hui.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-600">{item.heure}</span>
                      <span className="text-gray-900 font-medium truncate">{item.titre}</span>
                    </div>
                  ))}
                  {dashboardData.planning.aujourd_hui.length > 2 && (
                    <div className="text-xs text-gray-500 pl-4">
                      +{dashboardData.planning.aujourd_hui.length - 2} autres...
            </div>
                  )}
            </div>
          </div>
            </CardContent>
          </Card>

          {/* Bloc Plans en attente */}
                <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/developpement')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Plans en attente</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                            </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {dashboardData.plansEnAttente}
                          </div>
                <div className="text-sm text-gray-600 mt-1">Plans à traiter</div>
                {dashboardData.plansEnAttente > 0 && (
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Action requise
                    </Badge>
                          </div>
                )}
                        </div>
            </CardContent>
          </Card>

          {/* Bloc Prestations */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
            onClick={() => navigate('/prestations')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Prestations
                  </CardTitle>
                        </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                      </div>
                    </CardHeader>
                        <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    87.3%
                  </div>
                  <div className="text-sm text-gray-600">
                    Complétion Timesheet
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: '87.3%' }}
                  ></div>
                        </div>
                        
                <div className="text-xs text-gray-500">
                  Mise à jour: il y a 2h
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Congés & Jours fériés */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/rh')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plane className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Congés</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Restants</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {dashboardData.conges.restants} jours
                          </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Prochain congé</div>
                <div className="flex items-center gap-2 text-sm">
                  <Coffee className="h-3 w-3 text-green-600" />
                  <span className="font-medium">
                    {formatDate(dashboardData.conges.prochainCongePersonnel.date)}
                  </span>
                  <span className="text-gray-600">
                    ({dashboardData.conges.prochainCongePersonnel.duree}j)
                  </span>
                        </div>
                      </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">Prochain férié</div>
                <div className="text-sm font-medium">
                  {dashboardData.conges.prochainJourFerie.nom} • {formatDate(dashboardData.conges.prochainJourFerie.date)}
                        </div>
                      </div>
                    </CardContent>
          </Card>

          {/* Bloc Clients suspects */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/finance?tab=analysis')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Clients suspects</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {dashboardData.clientsSuspects}
                </div>
                <div className="text-sm text-gray-600 mt-1">Clients identifiés</div>
                {dashboardData.clientsSuspects > 0 && (
                  <div className="mt-3">
                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                      Attention requise
                    </Badge>
          </div>
                )}
        </div>
            </CardContent>
          </Card>

          {/* Bloc CA Réalisé vs Budgété */}
              <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/finance?tab=budgets')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">CA vs Budget</CardTitle>
                        </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
            </CardHeader>
            <CardContent className="space-y-4">
                      <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Réalisé</span>
                  <span className="font-medium">{formatCurrency(dashboardData.ca.realise)}</span>
                        </div>
                <div className="flex justify-between text-sm">
                  <span>Budgété</span>
                  <span className="font-medium">{formatCurrency(dashboardData.ca.budgete)}</span>
                      </div>
                    </div>
                    
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span className={`font-medium ${dashboardData.ca.pourcentage >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {dashboardData.ca.pourcentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={dashboardData.ca.pourcentage} className="h-2" />
                      </div>
            </CardContent>
          </Card>

          {/* Bloc Capacité Planning */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            onClick={() => navigate('/production')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Gauge className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Capacité Planning</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-3xl font-bold text-blue-600">
                  {dashboardData.capacitePlanning}%
                </div>
                <div className="text-sm text-gray-600">Utilisation actuelle</div>
                
                <Progress value={dashboardData.capacitePlanning} className="h-3" />
                
                <div className="text-xs text-gray-500">
                  Capacité {dashboardData.capacitePlanning >= 80 ? 'optimale' : 'disponible'}
                </div>
                  </div>
                </CardContent>
              </Card>

          {/* Bloc Accès rapide IA */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
            onClick={() => navigate('/agent-ia')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Agent IA
                  </CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </div>
          </CardHeader>
          <CardContent>
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-600 mb-3">
                  Assistant intelligent Powerteam
                </div>
              <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/agent-ia');
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Démarrer chat
              </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Accès Construction Réunion */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-50 to-teal-50 border-green-200"
            onClick={() => navigate('/meeting-builder')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg">
                    <Video className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Meeting Builder
                  </CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-600 mb-3">
                  Créer présentations et supports
                </div>
              <Button 
                variant="outline" 
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/meeting-builder');
                  }}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Construire réunion
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Bloc Supervision */}
          <Card 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
            onClick={() => navigate('/supervision')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-lg">
                    <Eye className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Supervision
                  </CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/70 rounded-lg p-2 border border-purple-100">
                    <div className="text-lg font-bold text-purple-600">12</div>
                    <div className="text-xs text-purple-700">Sessions</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2 border border-purple-100">
                    <div className="text-lg font-bold text-orange-600">6</div>
                    <div className="text-xs text-orange-700">Formations IA</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/supervision');
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Accéder aux supervisions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
