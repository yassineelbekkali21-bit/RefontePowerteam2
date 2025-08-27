import React, { useState } from 'react';
import { Users, Calendar, Clock, TrendingUp, UserCheck, CalendarDays, Activity, Target, MapPin, Phone, Mail, Award, Coffee, Briefcase, CheckCircle, AlertCircle, XCircle, Filter, Search, Plus, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

// Données RH étendues basées sur les captures d'écran
const rhData = {
  team: [
    { 
      id: 1, name: 'Alice Martin', role: 'Senior Developer', 
      email: 'alice.martin@company.com', phone: '+33 6 12 34 56 78',
      presence: 95, performance: 92, projects: 8, avatar: 'AM',
      status: 'active', location: 'Paris', department: 'Développement',
      conges: { pris: 12, restants: 13 }, teleTravail: 2, heuresSupp: 8
    },
    { 
      id: 2, name: 'Bob Dupont', role: 'UI/UX Designer', 
      email: 'bob.dupont@company.com', phone: '+33 6 23 45 67 89',
      presence: 88, performance: 87, projects: 6, avatar: 'BD',
      status: 'conges', location: 'Lyon', department: 'Design',
      conges: { pris: 18, restants: 7 }, teleTravail: 3, heuresSupp: 4
    },
    { 
      id: 3, name: 'Claire Leroy', role: 'Product Manager', 
      email: 'claire.leroy@company.com', phone: '+33 6 34 56 78 90',
      presence: 92, performance: 94, projects: 12, avatar: 'CL',
      status: 'active', location: 'Paris', department: 'Product',
      conges: { pris: 8, restants: 17 }, teleTravail: 4, heuresSupp: 12
    },
    { 
      id: 4, name: 'David Chen', role: 'Backend Developer', 
      email: 'david.chen@company.com', phone: '+33 6 45 67 89 01',
      presence: 90, performance: 89, projects: 9, avatar: 'DC',
      status: 'teletravail', location: 'Remote', department: 'Développement',
      conges: { pris: 15, restants: 10 }, teleTravail: 5, heuresSupp: 6
    },
    { 
      id: 5, name: 'Emma Wilson', role: 'Frontend Developer', 
      email: 'emma.wilson@company.com', phone: '+33 6 56 78 90 12',
      presence: 85, performance: 91, projects: 7, avatar: 'EW',
      status: 'active', location: 'Marseille', department: 'Développement',
      conges: { pris: 20, restants: 5 }, teleTravail: 1, heuresSupp: 10
    }
  ],
  calendar: {
    currentMonth: 'Août 2025',
    workingDays: 22,
    holidays: 3,
    sickDays: 2,
    vacations: 5,
    teleTravail: 8
  },
  attendance: [
    { day: 'Lun', present: 24, absent: 2, teletravail: 3 },
    { day: 'Mar', present: 25, absent: 1, teletravail: 2 },
    { day: 'Mer', present: 23, absent: 3, teletravail: 4 },
    { day: 'Jeu', present: 26, absent: 0, teletravail: 2 },
    { day: 'Ven', present: 22, absent: 4, teletravail: 5 }
  ],
  performance: [
    { month: 'Avr', score: 85, satisfaction: 78 },
    { month: 'Mai', score: 88, satisfaction: 82 },
    { month: 'Jun', score: 92, satisfaction: 89 },
    { month: 'Jul', score: 87, satisfaction: 85 },
    { month: 'Aoû', score: 91, satisfaction: 88 }
  ]
};

const rhKPIs = [
  {
    title: "Équipe Active",
    value: rhData.team.length.toString(),
    trend: 8.5,
    description: "collaborateurs",
    icon: Users,
    variant: 'success' as const
  },
  {
    title: "Présence Moyenne",
    value: Math.round(rhData.team.reduce((sum, member) => sum + member.presence, 0) / rhData.team.length) + "%",
    trend: 2.3,
    description: "taux de présence",
    icon: UserCheck,
    variant: 'info' as const
  },
  {
    title: "Performance",
    value: Math.round(rhData.team.reduce((sum, member) => sum + member.performance, 0) / rhData.team.length) + "%",
    trend: 5.2,
    description: "score moyen",
    icon: TrendingUp,
    variant: 'warning' as const
  },
  {
    title: "Projets Actifs",
    value: rhData.team.reduce((sum, member) => sum + member.projects, 0).toString(),
    trend: -1.2,
    description: "projets en cours",
    icon: Target,
    variant: 'default' as const
  }
];

// Couleurs pour les graphiques
const CHART_COLORS = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6', '#F39C12'];

// Données pour les graphiques RH
const performanceData = rhData.team.map(member => ({
  name: member.name.split(' ')[0],
  performance: member.performance,
  presence: member.presence,
  projects: member.projects
}));

const roleDistribution = [
  { name: 'Développeurs', value: rhData.team.filter(m => m.role.includes('Dev')).length },
  { name: 'Designers', value: rhData.team.filter(m => m.role.includes('Designer')).length },
  { name: 'Managers', value: rhData.team.filter(m => m.role.includes('Manager')).length },
  { name: 'DevOps', value: rhData.team.filter(m => m.role.includes('DevOps')).length }
];

const RH = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Ressources Humaines</h1>
            <p className="text-blue-100 mb-4">Planning collaborateurs et suivi des performances</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {rhData.calendar.currentMonth}
              </Badge>
              <span className="text-sm text-blue-100">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rhKPIs.map((kpi, index) => (
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

        {/* Calendrier et Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Calendrier - {rhData.calendar.currentMonth}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <div
                    key={day}
                    className={`text-center p-2 text-sm rounded-lg cursor-pointer transition-colors ${
                      day === 15 ? 'bg-blue-500 text-white' :
                      [5, 12, 19, 26].includes(day) ? 'bg-red-100 text-red-600' :
                      [8, 22, 29].includes(day) ? 'bg-yellow-100 text-yellow-600' :
                      'hover:bg-muted'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Aujourd'hui</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>Congés</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>Formation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-500" />
                Statistiques Mensuel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Jours travaillés</span>
                <Badge variant="default">{rhData.calendar.workingDays}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Congés</span>
                <Badge variant="secondary">{rhData.calendar.holidays}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Arrêts maladie</span>
                <Badge variant="destructive">{rhData.calendar.sickDays}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vacances</span>
                <Badge variant="outline">{rhData.calendar.vacations}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques Performance et Présence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Performance par Collaborateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#4A90E2" name="Performance %" />
                  <Bar dataKey="presence" fill="#50C878" name="Présence %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Répartition par Rôle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Présence Hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Présence Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rhData.attendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  stackId="1"
                  stroke="#4A90E2"
                  fill="#4A90E2"
                  name="Présents"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stackId="1"
                  stroke="#FF6B6B"
                  fill="#FF6B6B"
                  name="Absents"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Liste des Collaborateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Équipe - Détails
              </span>
              <Badge variant="default">{rhData.team.length} membres</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rhData.team.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{member.presence}%</div>
                      <div className="text-xs text-muted-foreground">Présence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{member.performance}%</div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline">{member.projects} projets</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RH;