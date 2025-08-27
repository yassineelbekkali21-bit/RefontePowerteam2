import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FolderStatus } from '@/types/dashboard';

interface FolderStatusTableProps {
  folders: FolderStatus[];
  type: 'exceeding' | 'compliant';
  title?: string;
}

export const FolderStatusTable = ({ 
  folders, 
  type, 
  title 
}: FolderStatusTableProps) => {
  const isExceeding = type === 'exceeding';
  
  const defaultTitle = isExceeding ? 'Dossiers en Dépassement' : 'Dossiers Conformes';
  const displayTitle = title || defaultTitle;

  const contextualData = {
    type: 'folder' as const,
    title: displayTitle,
    data: {
      total_folders: folders.length,
      type: type,
      average_percentage: folders.length > 0 
        ? folders.reduce((sum, folder) => sum + folder.percentage, 0) / folders.length 
        : 0
    },
    details: {
      type: type === 'exceeding' ? 'En dépassement' : 'Conformes',
      nombre_dossiers: folders.length,
      pourcentage_moyen: folders.length > 0 
        ? `${(folders.reduce((sum, folder) => sum + folder.percentage, 0) / folders.length).toFixed(1)}%`
        : '0%'
    }
  };

  const getStatusIcon = (folder: FolderStatus) => {
    if (folder.status === 'exceeding') {
      return <X className="h-4 w-4 text-destructive" />;
    }
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getPercentageColor = (percentage: number, status: 'exceeding' | 'compliant') => {
    if (status === 'exceeding') {
      if (percentage > 300) return 'text-destructive font-bold';
      if (percentage > 200) return 'text-destructive';
      return 'text-warning';
    }
    return 'text-success';
  };

  const getPercentageBadgeVariant = (percentage: number, status: 'exceeding' | 'compliant') => {
    if (status === 'exceeding') {
      if (percentage > 300) return 'destructive';
      if (percentage > 200) return 'destructive';
      return 'secondary';
    }
    return 'default';
  };

  return (
    <Card 
      className="transition-all duration-300 hover:shadow-dashboard-lg"
      data-contextual={JSON.stringify(contextualData)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              isExceeding ? "bg-destructive/10" : "bg-success/10"
            )}>
              {isExceeding ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{displayTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {folders.length} dossier{folders.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Badge variant={isExceeding ? 'destructive' : 'default'}>
            {folders.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {folders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun dossier {isExceeding ? 'en dépassement' : 'conforme'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder, index) => {
              const folderContextualData = {
                type: 'folder' as const,
                title: folder.name,
                data: {
                  name: folder.name,
                  time: folder.time,
                  percentage: folder.percentage,
                  status: folder.status
                },
                details: {
                  nom_dossier: folder.name,
                  temps_passe: folder.time,
                  pourcentage: `${folder.percentage}%`,
                  statut: folder.status === 'exceeding' ? 'En dépassement' : 'Conforme'
                }
              };

              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                  data-contextual={JSON.stringify(folderContextualData)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getStatusIcon(folder)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {folder.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Temps: {folder.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "text-sm font-semibold",
                      getPercentageColor(folder.percentage, folder.status)
                    )}>
                      {folder.percentage}%
                    </span>
                    <Badge variant={getPercentageBadgeVariant(folder.percentage, folder.status)}>
                      {folder.status === 'exceeding' ? 'Dépassement' : 'OK'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};