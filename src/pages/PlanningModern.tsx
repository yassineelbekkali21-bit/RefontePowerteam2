import React, { useState } from 'react';
import { Calendar, Clock, Users, Target, CheckCircle, AlertTriangle, Plus, Filter, ChevronLeft, ChevronRight, BarChart3, Zap, ArrowRight, Edit, Eye, MapPin, Bell } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  primary: '#4A90E2',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  orange: '#F97316'
};

const tasksData = [
  {
    id: 1,
    title: 'Développement API REST',
    client: 'TechCorp',
    assignee: 'Alice Martin',
    priority: 'high',
    status: 'in_progress',
    progress: 65,
    startDate: '2025-08-20',
    endDate: '2025-08-30',
    estimatedHours: 40,
    actualHours: 26,
    category: 'development'
  },
  {
    id: 2,
    title: 'Design System Update',
    client: 'StartupXYZ',
    assignee: 'Bob Dupont',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    startDate: '2025-08-25',
    endDate: '2025-09-05',
    estimatedHours: 32,
    actualHours: 0,
    category: 'design'
  },
  {
    id: 3,
    title: 'Migration Base de Données',
    client: 'Enterprise Ltd',
    assignee: 'David Chen',
    priority: 'critical',
    status: 'blocked',
    progress: 30,
    startDate: '2025-08-15',
    endDate: '2025-08-28',
    estimatedHours: 60,
    actualHours: 18,
    category: 'infrastructure'
  },
  {
    id: 4,
    title: 'Tests Automatisés',
    client: 'TechCorp',
    assignee: 'Emma Wilson',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    startDate: '2025-08-10',
    endDate: '2025-08-22',
    estimatedHours: 24,
    actualHours: 22,
    category: 'testing'
  }
];

const weeklyData = [
  { day: 'Lun', planned: 8, actual: 7.5, capacity: 8 },
  { day: 'Mar', planned: 8, actual: 8.5, capacity: 8 },
  { day: 'Mer', planned: 6, actual: 6, capacity: 8 },
  { day: 'Jeu', planned: 8, actual: 9, capacity: 8 },
  { day: 'Ven', planned: 7, actual: 6.5, capacity: 8 }
];

const PlanningModern: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'kanban' | 'timeline'>('calendar');
  const [currentWeek, setCurrentWeek] = useState('23-29 Août 2025');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return COLORS.danger;
      case 'high': return COLORS.orange;
      case 'medium': return COLORS.warning;
      default: return COLORS.success;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'in_progress': return COLORS.primary;
      case 'blocked': return COLORS.danger;
      default: return COLORS.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        {/* Header moderne */}
        <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Planification Intelligente</h1>
                <p className="text-purple-100 text-lg">Gestion automatisée des tâches et ressources</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{tasksData.length}</div>
                  <div className="text-sm text-purple-100">Tâches actives</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-sm text-purple-100">Capacité</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Navigation des vues */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              onClick={() => setViewMode('calendar')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Vue Calendrier
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              onClick={() => setViewMode('kanban')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
            >
              <Target className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Tâche
            </Button>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendrier principal */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Planning Hebdomadaire</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-medium px-4">{currentWeek}</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Vue hebdomadaire */}
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-1 space-y-2">
                    <div className="font-medium text-gray-600 p-2">Heures</div>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="p-2 text-sm text-gray-500">
                        {8 + i}:00
                      </div>
                    ))}
                  </div>

                  {['Lun 26', 'Mar 27', 'Mer 28', 'Jeu 29', 'Ven 30'].map((day, dayIndex) => (
                    <div key={day} className="space-y-2">
                      <div className="font-medium text-center p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded">
                        {day}
                      </div>
                      {Array.from({ length: 10 }, (_, hourIndex) => (
                        <div key={hourIndex} className="min-h-[40px] border border-gray-200 rounded p-1">
                          {/* Tâches programmées */}
                          {dayIndex === 0 && hourIndex === 2 && (
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded text-xs cursor-pointer hover:shadow-lg transition-all"
                              onClick={() => setSelectedTask(tasksData[0])}
                            >
                              <div className="font-medium">API REST</div>
                              <div className="text-blue-100">Alice M.</div>
                            </div>
                          )}
                          {dayIndex === 2 && hourIndex === 4 && (
                            <div 
                              className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-2 rounded text-xs cursor-pointer hover:shadow-lg transition-all"
                              onClick={() => setSelectedTask(tasksData[2])}
                            >
                              <div className="font-medium">Migration DB</div>
                              <div className="text-red-100">David C.</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar planning */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Charge de Travail</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="planned" fill={COLORS.primary} />
                    <Bar dataKey="actual" fill={COLORS.success} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Tâches Urgentes</h3>
                <div className="space-y-3">
                  {tasksData.filter(task => task.priority === 'critical' || task.status === 'blocked').map((task) => (
                    <div key={task.id} className="p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                      <div className="font-medium text-red-800">{task.title}</div>
                      <div className="text-sm text-red-600">{task.client} - {task.assignee}</div>
                      <Badge 
                        variant="secondary"
                        className="mt-1 text-white"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['pending', 'in_progress', 'blocked', 'completed'].map((status) => (
              <Card key={status} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold capitalize">{status.replace('_', ' ')}</h3>
                  <Badge variant="outline">
                    {tasksData.filter(task => task.status === status).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {tasksData.filter(task => task.status === status).map((task) => (
                    <Card 
                      key={task.id}
                      className="p-4 cursor-pointer hover:shadow-lg transition-all border-l-4"
                      style={{ borderLeftColor: getPriorityColor(task.priority) }}
                      onClick={() => setSelectedTask(task)}
                      data-contextual={JSON.stringify({
                        type: 'task',
                        title: `Tâche ${task.title}`,
                        data: task
                      })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="secondary"
                          className="text-white text-xs"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </Badge>
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <h4 className="font-medium mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.client}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{task.assignee}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progression</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{task.actualHours}h / {task.estimatedHours}h</span>
                        <span>{new Date(task.endDate).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'timeline' && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Timeline des Projets</h3>
            <div className="space-y-4">
              {tasksData.map((task, index) => (
                <div 
                  key={task.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                  data-contextual={JSON.stringify({
                    type: 'task_timeline',
                    title: `Timeline ${task.title}`,
                    data: task
                  })}
                >
                  <div className="w-2 h-16 rounded" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{task.title}</h4>
                      <Badge 
                        variant="secondary"
                        className="text-white"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Client: </span>
                        <span className="font-medium">{task.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Assigné: </span>
                        <span className="font-medium">{task.assignee}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Début: </span>
                        <span className="font-medium">{new Date(task.startDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Fin: </span>
                        <span className="font-medium">{new Date(task.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression: {task.progress}%</span>
                        <span>{task.actualHours}h / {task.estimatedHours}h</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlanningModern;
