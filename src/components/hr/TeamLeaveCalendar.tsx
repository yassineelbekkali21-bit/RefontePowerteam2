import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  UserCheck
} from 'lucide-react';

interface TeamLeave {
  id: string;
  employeeName: string;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: string;
  typeName: string;
  status: 'approved' | 'pending' | 'rejected';
  color: string;
}

interface TeamLeaveCalendarProps {
  teamLeaveData: TeamLeave[];
  pendingRequests?: any[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const TeamLeaveCalendar: React.FC<TeamLeaveCalendarProps> = ({
  teamLeaveData,
  pendingRequests = [],
  onApprove,
  onReject
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fonctions utilitaires
  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const getTeamPresenceForDate = (date: Date) => {
    const onLeave = teamLeaveData.filter(leave => 
      leave.status === 'approved' && isDateInRange(date, leave.startDate, leave.endDate)
    );
    
    const totalTeam = 10; // Taille d'équipe fixe pour l'exemple
    const present = totalTeam - onLeave.length;
    
    return {
      total: totalTeam,
      present: present,
      onLeave: onLeave.length,
      absentEmployees: onLeave,
      presencePercentage: Math.round((present / totalTeam) * 100)
    };
  };

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const firstDay = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours du mois précédent
    for (let i = startOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, monthNum, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Ajouter les jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, monthNum, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Compléter la semaine
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, monthNum + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getPresenceColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const calendarDays = generateCalendarDays(currentMonth);

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Vue Calendrier d'Équipe</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[200px] text-center">
                {formatMonthYear(currentMonth)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendrier */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, index) => {
              const presence = getTeamPresenceForDate(day.date);
              const isToday = new Date().toDateString() === day.date.toDateString();
              const isSelected = selectedDate?.toDateString() === day.date.toDateString();
              
              return (
                <div
                  key={index}
                  className={`
                    relative min-h-[60px] p-1 border rounded cursor-pointer transition-all duration-200
                    ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                    hover:bg-gray-50
                  `}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="font-medium text-sm">{day.date.getDate()}</div>
                  
                  {day.isCurrentMonth && (
                    <div className="mt-1 space-y-1">
                      {/* Indicateur de présence */}
                      <div className={`text-xs px-1 py-0.5 rounded text-center ${getPresenceColor(presence.presencePercentage)}`}>
                        {presence.present}/{presence.total}
                      </div>
                      
                      {/* Congés du jour */}
                      {presence.absentEmployees.map(leave => (
                        <div key={leave.id} className={`text-xs px-1 py-0.5 rounded text-white ${leave.color} truncate`}>
                          {leave.employeeName.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Légende */}
          <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span className="text-sm">≥ 80% présence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 rounded"></div>
              <span className="text-sm">60-79% présence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-100 rounded"></div>
              <span className="text-sm">40-59% présence</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm">&lt; 40% présence</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails du jour sélectionné */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Détails du {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayPresence = getTeamPresenceForDate(selectedDate);
              return (
                <div className="space-y-4">
                  {/* Résumé de présence */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{dayPresence.present}</div>
                      <div className="text-sm text-green-700">Présents</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{dayPresence.onLeave}</div>
                      <div className="text-sm text-red-700">En congé</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{dayPresence.presencePercentage}%</div>
                      <div className="text-sm text-blue-700">Taux présence</div>
                    </div>
                  </div>

                  {/* Employés en congé */}
                  {dayPresence.absentEmployees.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Employés en congé :</h4>
                      <div className="space-y-2">
                        {dayPresence.absentEmployees.map(leave => (
                          <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${leave.color}`}></div>
                              <div>
                                <div className="font-medium">{leave.employeeName}</div>
                                <div className="text-sm text-gray-600">{leave.typeName}</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(leave.startDate).toLocaleDateString('fr-FR')} - {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alerte si taux de présence faible */}
                  {dayPresence.presencePercentage < 60 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-orange-800">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Attention: Faible taux de présence</span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Avec seulement {dayPresence.presencePercentage}% de l'équipe présente, 
                        considérez l'impact sur les opérations avant d'approuver de nouveaux congés.
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5" />
              <span>Demandes en Attente ({pendingRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-medium">{request.employeeName}</div>
                      <div className="text-sm text-gray-600">{request.leaveTypeName}</div>
                      <div className="text-sm text-gray-500">
                        Dates: {request.dates.join(', ')} Août 2025
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => onApprove?.(request.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onReject?.(request.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamLeaveCalendar;
