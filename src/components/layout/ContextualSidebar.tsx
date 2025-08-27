import { X, TrendingUp, Users, DollarSign, Calendar, BarChart, User, Clock, Euro, FolderOpen, FileText, Target, Gift, Home, Factory, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ContextualData } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContextualSidebarProps {
  data: ContextualData | null;
  isOpen: boolean;
  onClose: () => void;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'kpi': return TrendingUp;
    case 'chart': return BarChart;
    case 'user': return User;
    case 'project': return Calendar;
    case 'collaborator': return Users;
    case 'budget': return DollarSign;
    case 'folder': return FolderOpen;
    case 'planning-item': return FileText;
    case 'financial-entity': return Euro;
    case 'time-sheet': return Clock;
    case 'task': return Target;
    default: return BarChart;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'kpi': return 'bg-gradient-primary';
    case 'chart': return 'bg-gradient-info';
    case 'user': return 'bg-gradient-success';
    case 'project': return 'bg-gradient-warning';
    case 'collaborator': return 'bg-gradient-success';
    case 'budget': return 'bg-gradient-primary';
    case 'folder': return 'bg-gradient-warning';
    case 'planning-item': return 'bg-gradient-info';
    case 'financial-entity': return 'bg-gradient-primary';
    case 'time-sheet': return 'bg-gradient-info';
    case 'task': return 'bg-gradient-warning';
    default: return 'bg-gradient-primary';
  }
};

export const ContextualSidebar = ({ data, isOpen, onClose }: ContextualSidebarProps) => {
  if (!data) return null;

  const Icon = getIconForType(data.type);

  return (
    <div className={cn(
      "fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-dashboard-xl z-50",
      "transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg text-white",
              getColorForType(data.type)
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{data.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{data.type}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main data display */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{data.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.type === 'kpi' && (
                <>
                  <div className="text-3xl font-bold text-primary">
                    {data.data.value}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={data.data.trend > 0 ? "default" : "destructive"}>
                      {data.data.trend > 0 ? '+' : ''}{data.data.trend}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">vs mois précédent</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {data.data.description}
                  </div>
                </>
              )}

              {data.type === 'user' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Poste:</strong> {data.data.position || 'N/A'}</div>
                    <div><strong>Département:</strong> {data.data.department || 'N/A'}</div>
                    <div><strong>Email:</strong> {data.data.email || 'N/A'}</div>
                    <div><strong>Téléphone:</strong> {data.data.phone || 'N/A'}</div>
                    {data.data.type && <div><strong>Type:</strong> {data.data.type}</div>}
                    {data.data.status && <div><strong>Statut:</strong> {data.data.status}</div>}
                  </div>
                </>
              )}

              {data.type === 'collaborator' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Rôle:</strong> {data.data.role}</div>
                    {data.data.ca && <div><strong>C.A.:</strong> {data.data.ca}%</div>}
                    {data.data.va && <div><strong>V.A.:</strong> {data.data.va}%</div>}
                    {data.data.cp && <div><strong>C.P.:</strong> {data.data.cp}%</div>}
                  </div>
                </>
              )}

              {data.type === 'budget' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Actuel:</strong> {data.data.current?.toLocaleString()} {data.data.unit}</div>
                    <div><strong>Objectif:</strong> {data.data.target?.toLocaleString()} {data.data.unit}</div>
                    <div><strong>Progression:</strong> {data.data.percentage?.toFixed(1)}%</div>
                  </div>
                </>
              )}

              {data.type === 'folder' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Temps passé:</strong> {data.data.time}</div>
                    <div><strong>Pourcentage:</strong> {data.data.percentage}%</div>
                    <div><strong>Statut:</strong> 
                      <Badge className="ml-2" variant={data.data.status === 'exceeding' ? 'destructive' : 'default'}>
                        {data.data.status === 'exceeding' ? 'Dépassement' : 'Conforme'}
                      </Badge>
                    </div>
                  </div>
                </>
              )}

              {data.type === 'planning-item' && (
                <>
                  <div className="space-y-2">
                    {data.data.count !== undefined && <div><strong>Nombre:</strong> {data.data.count}</div>}
                    {data.data.type && <div><strong>Type:</strong> {data.data.type}</div>}
                    {data.data.status && <div><strong>Statut:</strong> {data.data.status}</div>}
                  </div>
                </>
              )}

              {data.type === 'financial-entity' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Valeur:</strong> {data.data.value}</div>
                    {data.data.period && <div><strong>Période:</strong> {data.data.period}</div>}
                    {data.data.adjusted && <div><strong>Ajusté:</strong> {data.data.adjusted}</div>}
                    {data.data.type && <div><strong>Type:</strong> {data.data.type}</div>}
                  </div>
                </>
              )}

              {data.type === 'time-sheet' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Temps:</strong> {data.data.time}</div>
                    <div><strong>Statut:</strong> 
                      <Badge className="ml-2" variant={data.data.status === 'Actif' ? 'default' : 'secondary'}>
                        {data.data.status}
                      </Badge>
                    </div>
                  </div>
                </>
              )}

              {data.type === 'task' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Temps enregistré:</strong> {data.data.time}</div>
                    {data.data.details && <div><strong>Détails:</strong> {data.data.details}</div>}
                  </div>
                </>
              )}

              {data.type === 'project' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Statut:</strong> 
                      <Badge className="ml-2" variant={data.data.status === 'En cours' ? 'default' : 'secondary'}>
                        {data.data.status}
                      </Badge>
                    </div>
                    {data.data.budget && <div><strong>Budget:</strong> {data.data.budget}</div>}
                    {data.data.deadline && <div><strong>Échéance:</strong> {data.data.deadline}</div>}
                    {data.data.team && <div><strong>Équipe:</strong> {data.data.team}</div>}
                  </div>
                </>
              )}

              {data.type === 'chart' && (
                <>
                  <div className="space-y-2">
                    <div><strong>Valeur:</strong> {data.data.value}</div>
                    <div><strong>Période:</strong> {data.data.period}</div>
                    <div><strong>Catégorie:</strong> {data.data.category}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Additional details */}
          {data.details && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Détails supplémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace('_', ' ')}:
                    </span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Actions communes */}
              <Button variant="outline" size="sm" className="w-full justify-start">
                Voir le détail complet
              </Button>
              
              {/* Actions spécifiques par type */}
              {data.type === 'collaborator' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Modifier les performances
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Historique des évaluations
                  </Button>
                </>
              )}
              
              {data.type === 'budget' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Ajuster l'objectif
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Voir l'historique
                  </Button>
                </>
              )}
              
              {data.type === 'folder' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Analyser le dépassement
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Planifier des actions
                  </Button>
                </>
              )}
              
              {data.type === 'planning-item' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Modifier le planning
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Ajouter une échéance
                  </Button>
                </>
              )}
              
              {data.type === 'financial-entity' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Analyser la rentabilité
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Comparer les projets
                  </Button>
                </>
              )}
              
              {data.type === 'time-sheet' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Modifier les heures
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Voir le planning
                  </Button>
                </>
              )}
              
              {data.type === 'task' && (
                <>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Modifier la tâche
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Assigner à quelqu'un
                  </Button>
                </>
              )}
              
              {/* Actions communes de fin */}
              <Button variant="outline" size="sm" className="w-full justify-start">
                Exporter les données
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Partager
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Navigation vers les autres pages - En bas du sidebar */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Navigation rapide</h4>
            <div className="grid grid-cols-2 gap-2">
              <NavLink 
                to="/"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all duration-200 text-xs",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                )}
              >
                <Home className="h-4 w-4 mb-1" />
                <span>Accueil</span>
              </NavLink>

              <NavLink 
                to="/production"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all duration-200 text-xs",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                )}
              >
                <Factory className="h-4 w-4 mb-1" />
                <span>Production</span>
              </NavLink>

              <NavLink 
                to="/finance"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all duration-200 text-xs",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                )}
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span>Finance</span>
              </NavLink>

              <NavLink 
                to="/rh"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex flex-col items-center p-3 rounded-lg transition-all duration-200 text-xs",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                )}
              >
                <Users className="h-4 w-4 mb-1" />
                <span>RH</span>
              </NavLink>
            </div>

            <NavLink 
              to="/planning"
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-xs w-full",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
              )}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span>Planification</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};