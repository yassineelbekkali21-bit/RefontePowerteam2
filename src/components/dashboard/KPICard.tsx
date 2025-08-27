import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'success' | 'warning' | 'info';
  details?: any;
  compact?: boolean;
}

export const KPICard = ({ 
  title, 
  value, 
  trend, 
  description, 
  icon: Icon,
  variant = 'default',
  details,
  compact = false
}: KPICardProps) => {
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

  const contextualData = {
    type: 'kpi' as const,
    title,
    data: {
      value,
      trend: trend || 0,
      description: description || '',
      variant
    },
    details
  };

  if (compact) {
    return (
      <Card 
        className={cn(
          "transition-all duration-300 hover:shadow-dashboard-lg",
          getVariantClasses(),
          "p-3"
        )}
        data-contextual={JSON.stringify(contextualData)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-foreground">{value}</span>
              {trend !== undefined && (
                <span className={cn(
                  "text-xs font-medium flex items-center",
                  trend > 0 ? "text-success" : "text-destructive"
                )}>
                  {trend > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-0.5" />
                  )}
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          </div>
          {Icon && <Icon className={cn("h-5 w-5 opacity-70", getIconColor())} />}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-dashboard-lg",
        getVariantClasses(),
        "p-4"
      )}
      data-contextual={JSON.stringify(contextualData)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className={cn("h-4 w-4 opacity-70", getIconColor())} />}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      {(trend !== undefined || description) && (
        <div className="flex items-center justify-between">
          {trend !== undefined && (
            <div className="flex items-center space-x-1">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={cn(
                "text-xs font-medium",
                trend > 0 ? "text-success" : "text-destructive"
              )}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </Card>
  );
};