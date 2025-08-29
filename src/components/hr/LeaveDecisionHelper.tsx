import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Users, 
  Calendar,
  TrendingDown,
  TrendingUp,
  Target
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeName: string;
  dates: number[];
  leaveType: string;
  leaveTypeName: string;
  status: string;
}

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

interface DecisionAnalysis {
  recommendation: 'approve' | 'reject' | 'conditional';
  risk: 'low' | 'medium' | 'high';
  impactScore: number;
  reasons: string[];
  alternatives?: string[];
}

interface LeaveDecisionHelperProps {
  request: LeaveRequest;
  teamLeaveData: TeamLeave[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onClose: () => void;
}

const LeaveDecisionHelper: React.FC<LeaveDecisionHelperProps> = ({
  request,
  teamLeaveData,
  onApprove,
  onReject,
  onClose
}) => {
  
  // Fonction d'analyse intelligente
  const analyzeLeaveImpact = (): DecisionAnalysis => {
    // Convertir les dates de la demande en format Date
    const requestDates = request.dates.map(day => new Date(2025, 7, day)); // Août 2025
    
    // Analyser les congés existants pendant cette période
    const conflictingLeaves = teamLeaveData.filter(leave => {
      if (leave.status !== 'approved') return false;
      
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      return requestDates.some(reqDate => 
        reqDate >= leaveStart && reqDate <= leaveEnd
      );
    });
    
    const totalTeam = 10; // Taille d'équipe
    const maxConcurrentLeaves = conflictingLeaves.length;
    const presencePercentage = ((totalTeam - maxConcurrentLeaves - 1) / totalTeam) * 100;
    
    // Calcul du score d'impact (0-100, plus c'est élevé, plus l'impact est fort)
    let impactScore = 0;
    const reasons: string[] = [];
    const alternatives: string[] = [];
    
    // Facteur 1: Pourcentage de présence
    if (presencePercentage < 40) {
      impactScore += 40;
      reasons.push(`Présence équipe critique: ${Math.round(presencePercentage)}%`);
    } else if (presencePercentage < 60) {
      impactScore += 25;
      reasons.push(`Présence équipe faible: ${Math.round(presencePercentage)}%`);
    } else if (presencePercentage < 80) {
      impactScore += 10;
      reasons.push(`Présence équipe réduite: ${Math.round(presencePercentage)}%`);
    }
    
    // Facteur 2: Nombre de personnes déjà en congé
    if (maxConcurrentLeaves >= 4) {
      impactScore += 30;
      reasons.push(`${maxConcurrentLeaves} personnes déjà en congé simultanément`);
    } else if (maxConcurrentLeaves >= 2) {
      impactScore += 15;
      reasons.push(`${maxConcurrentLeaves} personnes déjà en congé`);
    }
    
    // Facteur 3: Type de congé (priorité)
    if (request.leaveType === 'conge-maladie' || request.leaveType === 'conge-maternite') {
      impactScore -= 20; // Congés prioritaires
      reasons.push('Congé prioritaire (santé/famille)');
    }
    
    // Facteur 4: Durée du congé
    const leaveDuration = request.dates.length;
    if (leaveDuration >= 5) {
      impactScore += 15;
      reasons.push(`Congé long (${leaveDuration} jours)`);
    } else if (leaveDuration === 1) {
      impactScore -= 5;
      reasons.push('Congé court (1 jour)');
    }
    
    // Facteur 5: Période (vacances scolaires, fins de mois, etc.)
    const isEndOfMonth = request.dates.some(day => day > 25);
    if (isEndOfMonth) {
      impactScore += 10;
      reasons.push('Période sensible (fin de mois)');
    }
    
    // Générer des alternatives
    if (impactScore > 30) {
      alternatives.push('Reporter de quelques jours');
      alternatives.push('Réduire la durée du congé');
      alternatives.push('Proposer du télétravail partiel');
    }
    
    // Déterminer la recommandation
    let recommendation: 'approve' | 'reject' | 'conditional';
    let risk: 'low' | 'medium' | 'high';
    
    if (impactScore <= 20) {
      recommendation = 'approve';
      risk = 'low';
      reasons.push('Impact opérationnel minimal');
    } else if (impactScore <= 50) {
      recommendation = 'conditional';
      risk = 'medium';
      reasons.push('Impact modéré nécessitant des ajustements');
    } else {
      recommendation = 'reject';
      risk = 'high';
      reasons.push('Impact opérationnel trop élevé');
    }
    
    return { recommendation, risk, impactScore, reasons, alternatives };
  };
  
  const analysis = analyzeLeaveImpact();
  
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'approve': return 'text-green-600 bg-green-50 border-green-200';
      case 'conditional': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'reject': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'approve': return <CheckCircle className="w-5 h-5" />;
      case 'conditional': return <AlertTriangle className="w-5 h-5" />;
      case 'reject': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };
  
  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'approve': return 'Approuver';
      case 'conditional': return 'Approuver avec conditions';
      case 'reject': return 'Rejeter';
      default: return 'Analyser';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Aide à la Décision - Congé</span>
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Résumé de la demande */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Demande de congé</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Employé:</span>
                <span className="ml-2 font-medium">{request.employeeName}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{request.leaveTypeName}</span>
              </div>
              <div>
                <span className="text-gray-600">Dates:</span>
                <span className="ml-2 font-medium">{request.dates.join(', ')} Août 2025</span>
              </div>
              <div>
                <span className="text-gray-600">Durée:</span>
                <span className="ml-2 font-medium">{request.dates.length} jour(s)</span>
              </div>
            </div>
          </div>

          {/* Recommandation principale */}
          <div className={`p-4 rounded-lg border-2 ${getRecommendationColor(analysis.recommendation)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {getRecommendationIcon(analysis.recommendation)}
              <span className="font-semibold text-lg">
                Recommandation: {getRecommendationText(analysis.recommendation)}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={`${analysis.risk === 'high' ? 'border-red-300 text-red-700' : 
                analysis.risk === 'medium' ? 'border-orange-300 text-orange-700' : 
                'border-green-300 text-green-700'}`}>
                Risque {analysis.risk === 'high' ? 'Élevé' : analysis.risk === 'medium' ? 'Modéré' : 'Faible'}
              </Badge>
              <div className="text-sm">
                Score d'impact: <span className="font-medium">{analysis.impactScore}/100</span>
              </div>
            </div>
          </div>

          {/* Analyse détaillée */}
          <div>
            <h3 className="font-medium mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Analyse d'impact
            </h3>
            <div className="space-y-2">
              {analysis.reasons.map((reason, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives si nécessaire */}
          {analysis.alternatives && analysis.alternatives.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Alternatives suggérées
              </h3>
              <div className="space-y-2">
                {analysis.alternatives.map((alternative, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>{alternative}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact sur l'équipe */}
          <div>
            <h3 className="font-medium mb-3">Impact sur l'équipe pendant cette période</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {Math.max(0, 10 - teamLeaveData.filter(l => l.status === 'approved').length - 1)}
                </div>
                <div className="text-sm text-green-700">Présents estimés</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {teamLeaveData.filter(l => l.status === 'approved').length + 1}
                </div>
                <div className="text-sm text-red-700">En congé</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(((10 - teamLeaveData.filter(l => l.status === 'approved').length - 1) / 10) * 100)}%
                </div>
                <div className="text-sm text-blue-700">Taux présence</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                onReject(request.id);
                onClose();
              }}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rejeter
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onApprove(request.id);
                onClose();
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approuver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveDecisionHelper;
