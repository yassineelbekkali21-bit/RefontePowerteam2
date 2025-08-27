import { Calendar as CalendarIcon, Clock, CheckCircle, AlertTriangle, Target, TrendingUp, Users, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

// Données de planification modernes
const planningData = {
  tasks: [
    { id: 1, title: 'Développement Module Auth', status: 'in-progress', priority: 'high', deadline: '2024-01-15', assignee: 'Alice Martin', progress: 75 },
    { id: 2, title: 'Design Interface Admin', status: 'completed', priority: 'medium', deadline: '2024-01-10', assignee: 'Bob Dupont', progress: 100 },
    { id: 3, title: 'Tests Unitaires API', status: 'pending', priority: 'high', deadline: '2024-01-20', assignee: 'David Chen', progress: 0 },
    { id: 4, title: 'Documentation Technique', status: 'in-progress', priority: 'low', deadline: '2024-01-25', assignee: 'Emma Wilson', progress: 40 },
    { id: 5, title: 'Déploiement Production', status: 'pending', priority: 'high', deadline: '2024-01-30', assignee: 'Frank Miller', progress: 0 },
    { id: 6, title: 'Formation Équipe', status: 'completed', priority: 'medium', deadline: '2024-01-08', assignee: 'Claire Leroy', progress: 100 }
  ],
  calendar: {
    currentMonth: 'Janvier 2024',
    events: [
      { date: '2024-01-15', title: 'Deadline Module Auth', type: 'deadline' },
      { date: '2024-01-20', title: 'Tests API', type: 'milestone' },
      { date: '2024-01-25', title: 'Review Documentation', type: 'meeting' },
      { date: '2024-01-30', title: 'Go Live', type: 'deadline' }
    ]
  },
  timeline: [
    { week: 'S1', planned: 8, completed: 6, delayed: 2 },
    { week: 'S2', planned: 12, completed: 10, delayed: 1 },
    { week: 'S3', planned: 10, completed: 8, delayed: 3 },
    { week: 'S4', planned: 15, completed: 12, delayed: 2 }
  ]
};

const planningKPIs = [
  {
    title: "Tâches Totales",
    value: planningData.tasks.length.toString(),
    trend: 12.5,
    description: "projets actifs",
    icon: Target,
    variant: 'info' as const
  },
  {
    title: "En Cours",
    value: planningData.tasks.filter(t => t.status === 'in-progress').length.toString(),
    trend: 8.3,
    description: "tâches actives",
    icon: Activity,
    variant: 'success' as const
  },
  {
    title: "Terminées",
    value: planningData.tasks.filter(t => t.status === 'completed').length.toString(),
    trend: 15.2,
    description: "cette semaine",
    icon: CheckCircle,
    variant: 'warning' as const
  },
  {
    title: "Échéances",
    value: planningData.calendar.events.filter(e => e.type === 'deadline').length.toString(),
    trend: -2.1,
    description: "ce mois",
    icon: Clock,
    variant: 'default' as const
  }
];

// Couleurs pour les graphiques
const COLORS = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6', '#F39C12'];

// Données pour les graphiques de planification
const taskStatusData = [
  { name: 'En attente', value: planningData.tasks.filter(t => t.status === 'pending').length },
  { name: 'En cours', value: planningData.tasks.filter(t => t.status === 'in-progress').length },
  { name: 'Terminées', value: planningData.tasks.filter(t => t.status === 'completed').length }
];

const priorityData = [
  { name: 'Haute', value: planningData.tasks.filter(t => t.priority === 'high').length },
  { name: 'Moyenne', value: planningData.tasks.filter(t => t.priority === 'medium').length },
  { name: 'Basse', value: planningData.tasks.filter(t => t.priority === 'low').length }
];

const progressData = planningData.tasks.map(task => ({
  name: task.title.substring(0, 15) + '...',
  progress: task.progress,
  assignee: task.assignee.split(' ')[0]
}));

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Planification</h1>
            <p className="text-purple-100 mb-4">Gestion des tâches et calendrier interactif</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {planningData.calendar.currentMonth}
              </Badge>
              <span className="text-sm text-purple-100">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planningKPIs.map((kpi, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    kpi.variant === 'success' ? 'bg-green-100 text-green-600' :
                    kpi.variant === 'info' ? 'bg-blue-100 text-blue-600' :
                    kpi.variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
                {kpi.trend !== 0 && (
                  <div className={`flex items-center mt-2 text-sm ${
                    kpi.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${kpi.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(kpi.trend)}%
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline et Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Statut des Tâches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                Priorités des Tâches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4A90E2" name="Nombre de tâches" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Progression des Tâches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Progression des Tâches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#50C878" name="Progression %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Timeline Hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-500" />
              Timeline Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={planningData.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="planned"
                  stackId="1"
                  stroke="#4A90E2"
                  fill="#4A90E2"
                  name="Planifiées"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#50C878"
                  fill="#50C878"
                  name="Terminées"
                />
                <Area
                  type="monotone"
                  dataKey="delayed"
                  stackId="1"
                  stroke="#FF6B6B"
                  fill="#FF6B6B"
                  name="En retard"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Liste des Tâches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Tâches en Cours
              </span>
              <Badge variant="default">{planningData.tasks.length} tâches</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planningData.tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Assigné à {task.assignee} • Échéance: {new Date(task.deadline).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {task.priority === 'high' ? 'Haute' :
                       task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Badge>
                    <Badge variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'in-progress' ? 'secondary' :
                      'outline'
                    }>
                      {task.status === 'completed' ? 'Terminée' :
                       task.status === 'in-progress' ? 'En cours' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Événements à Venir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              Événements - {planningData.calendar.currentMonth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planningData.calendar.events.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'deadline' ? 'bg-red-500' :
                      event.type === 'milestone' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    event.type === 'deadline' ? 'destructive' :
                    event.type === 'milestone' ? 'default' :
                    'secondary'
                  }>
                    {event.type === 'deadline' ? 'Échéance' :
                     event.type === 'milestone' ? 'Jalon' : 'Réunion'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Planning;