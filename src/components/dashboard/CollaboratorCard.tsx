import { User, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CollaboratorPerformance } from '@/types/dashboard';

interface CollaboratorCardProps {
  collaborator: CollaboratorPerformance;
  compact?: boolean;
}

export const CollaboratorCard = ({ 
  collaborator, 
  compact = false 
}: CollaboratorCardProps) => {
  const contextualData = {
    type: 'collaborator' as const,
    title: collaborator.name,
    data: {
      name: collaborator.name,
      role: collaborator.role,
      ca: collaborator.ca,
      va: collaborator.va,
      cp: collaborator.cp
    },
    details: {
      role: collaborator.role,
      chiffre_affaires: collaborator.ca ? `${collaborator.ca}%` : 'N/A',
      valeur_ajoutee: collaborator.va ? `${collaborator.va}%` : 'N/A',
      cout_production: collaborator.cp ? `${collaborator.cp}%` : 'N/A'
    }
  };

  const getPerformanceColor = (value?: number) => {
    if (!value) return 'text-muted-foreground';
    if (value >= 100) return 'text-success';
    if (value >= 80) return 'text-warning';
    return 'text-destructive';
  };

  const getPerformanceBadgeVariant = (value?: number) => {
    if (!value) return 'secondary';
    if (value >= 100) return 'default';
    if (value >= 80) return 'secondary';
    return 'destructive';
  };

  if (compact) {
    return (
      <Card 
        className="transition-all duration-300 hover:shadow-dashboard-lg cursor-pointer"
        data-contextual={JSON.stringify(contextualData)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-semibold">{collaborator.name}</h3>
                <p className="text-xs text-muted-foreground">({collaborator.role})</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {collaborator.ca !== undefined && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">C.A.</div>
                <Badge variant={getPerformanceBadgeVariant(collaborator.ca)} className="text-xs">
                  {collaborator.ca}%
                </Badge>
              </div>
            )}
            
            {collaborator.va !== undefined && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">V.A.</div>
                <Badge variant={getPerformanceBadgeVariant(collaborator.va)} className="text-xs">
                  {collaborator.va}%
                </Badge>
              </div>
            )}
            
            {collaborator.cp !== undefined && (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">C.P.</div>
                <Badge variant={getPerformanceBadgeVariant(collaborator.cp)} className="text-xs">
                  {collaborator.cp}%
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-dashboard-lg cursor-pointer"
      data-contextual={JSON.stringify(contextualData)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{collaborator.name}</CardTitle>
              <p className="text-sm text-muted-foreground">({collaborator.role})</p>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-success" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {collaborator.ca !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Chiffre d'Affaires</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-lg font-bold", getPerformanceColor(collaborator.ca))}>
                  {collaborator.ca}%
                </span>
                <Badge variant={getPerformanceBadgeVariant(collaborator.ca)}>
                  C.A.
                </Badge>
              </div>
            </div>
          )}
          
          {collaborator.va !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Valeur Ajoutée</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-lg font-bold", getPerformanceColor(collaborator.va))}>
                  {collaborator.va}%
                </span>
                <Badge variant={getPerformanceBadgeVariant(collaborator.va)}>
                  V.A.
                </Badge>
              </div>
            </div>
          )}
          
          {collaborator.cp !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Coût de Production</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-lg font-bold", getPerformanceColor(collaborator.cp))}>
                  {collaborator.cp}%
                </span>
                <Badge variant={getPerformanceBadgeVariant(collaborator.cp)}>
                  C.P.
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};