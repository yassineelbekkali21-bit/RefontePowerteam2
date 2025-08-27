import { TrendingUp, Target, Clock, Euro } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BudgetProgress } from '@/types/dashboard';

interface BudgetProgressCardProps {
  title: string;
  budget: BudgetProgress;
  compact?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export const BudgetProgressCard = ({ 
  title, 
  budget, 
  compact = false,
  variant = 'default'
}: BudgetProgressCardProps) => {
  const contextualData = {
    type: 'budget' as const,
    title,
    data: {
      current: budget.current,
      target: budget.target,
      unit: budget.unit,
      percentage: budget.percentage
    },
    details: {
      progression: `${budget.current.toLocaleString()} ${budget.unit} / ${budget.target.toLocaleString()} ${budget.unit}`,
      pourcentage: `${budget.percentage.toFixed(1)}%`,
      restant: `${(budget.target - budget.current).toLocaleString()} ${budget.unit}`,
      type: budget.unit === 'H' ? 'Heures' : 'Euros'
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success-light/10 to-success/5';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning-light/10 to-warning/5';
      case 'info':
        return 'border-info/20 bg-gradient-to-br from-info-light/10 to-info/5';
      default:
        return 'border-primary/20 bg-gradient-to-br from-primary-light/10 to-primary/5';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      default: return 'text-primary';
    }
  };

  const getProgressColor = () => {
    if (budget.percentage >= 80) return 'bg-success';
    if (budget.percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const Icon = budget.unit === 'H' ? Clock : Euro;

  if (compact) {
    return (
      <Card 
        className={cn(
          "transition-all duration-300 hover:shadow-dashboard-lg cursor-pointer",
          getVariantClasses()
        )}
        data-contextual={JSON.stringify(contextualData)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {budget.current.toLocaleString()} / {budget.target.toLocaleString()} {budget.unit}
              </p>
            </div>
            <Icon className={cn("h-5 w-5", getIconColor())} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {budget.percentage.toFixed(1)}%
              </span>
              <TrendingUp className={cn("h-4 w-4", getIconColor())} />
            </div>
            <Progress 
              value={budget.percentage} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-dashboard-lg cursor-pointer",
        getVariantClasses()
      )}
      data-contextual={JSON.stringify(contextualData)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", getIconColor().replace('text-', 'bg-') + '/10')}>
              <Icon className={cn("h-5 w-5", getIconColor())} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Progression budgétaire
              </p>
            </div>
          </div>
          <Target className={cn("h-5 w-5", getIconColor())} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              {budget.current.toLocaleString()} {budget.unit}
            </span>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">
                {budget.percentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                de l'objectif
              </div>
            </div>
          </div>
          
          <Progress 
            value={budget.percentage} 
            className="h-3"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Objectif: {budget.target.toLocaleString()} {budget.unit}
            </span>
            <span className="font-medium">
              Restant: {(budget.target - budget.current).toLocaleString()} {budget.unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};