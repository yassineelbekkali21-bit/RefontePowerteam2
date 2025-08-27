import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'donut';
  xKey?: string;
  yKey?: string;
  colors?: string[];
  className?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
}

const defaultColors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export const ChartCard = ({ 
  title, 
  data, 
  type, 
  xKey = 'name', 
  yKey = 'value',
  colors = defaultColors,
  className,
  description,
  height = 300,
  showLegend = true
}: ChartCardProps) => {
  const contextualData = {
    type: 'chart' as const,
    title,
    data: {
      value: data.length > 0 ? data[0][yKey] : 0,
      period: data.length > 0 ? data[0][xKey] : 'N/A',
      category: type,
      description: description || `Graphique ${type}`
    },
    details: {
      total_points: data.length,
      chart_type: type,
      data_keys: [xKey, yKey]
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey={yKey} 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                onClick={(data) => {
                  const event = new CustomEvent('chartClick', { 
                    detail: { ...contextualData, data: { ...contextualData.data, ...data } }
                  });
                  document.dispatchEvent(event);
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors[1] }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'donut':
      case 'pie':
        return (
          <div className="relative w-full" style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey={yKey}
                  nameKey={xKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={type === 'donut' ? '60%' : '0%'}
                  outerRadius="80%"
                  label={type === 'pie'}
                  className="cursor-pointer"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]}
                      onClick={() => {
                        const event = new CustomEvent('chartClick', { 
                          detail: { ...contextualData, data: { ...contextualData.data, ...entry } }
                        });
                        document.dispatchEvent(event);
                      }}
                    />
                  ))}
                </Pie>
                {showLegend && type === 'pie' && (
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
            {type === 'donut' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {data.reduce((sum, item) => sum + item[yKey], 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-dashboard-lg",
        className
      )}
      data-contextual={JSON.stringify(contextualData)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};