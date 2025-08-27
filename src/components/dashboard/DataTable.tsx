import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'badge' | 'avatar' | 'date';
  variant?: string;
}

interface DataTableProps {
  title?: string;
  columns: Column[];
  data: any[];
  className?: string;
  description?: string;
  showHeader?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

const DataTable = ({ 
  title, 
  columns, 
  data, 
  className, 
  description, 
  showHeader = true,
  showPagination = false,
  pageSize = 10
}: DataTableProps) => {
  const renderCell = (item: any, column: Column, index: number) => {
    const value = item[column.key];
    
    const createContextualData = (rowData: any) => ({
      type: column.type === 'avatar' ? 'user' : 'table' as const,
      title: column.type === 'avatar' ? rowData.name || rowData[column.key] : `${column.label}: ${value}`,
      data: column.type === 'avatar' ? {
        name: rowData.name,
        position: rowData.position,
        department: rowData.department,
        email: rowData.email,
        phone: rowData.phone
      } : {
        value,
        row: rowData,
        column: column.label
      },
      details: rowData
    });

    switch (column.type) {
      case 'badge':
        return (
          <div 
            className="cursor-pointer"
            data-contextual={JSON.stringify(createContextualData(item))}
          >
            <Badge variant={column.variant as any || 'default'}>
              {value}
            </Badge>
          </div>
        );
        
      case 'avatar':
        return (
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            data-contextual={JSON.stringify(createContextualData(item))}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.avatar} />
              <AvatarFallback className="text-xs">
                {item.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || value?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{item.name || value}</div>
              {item.email && (
                <div className="text-xs text-muted-foreground truncate">{item.email}</div>
              )}
            </div>
          </div>
        );
        
      case 'number':
        return (
          <div 
            className="text-right font-mono cursor-pointer"
            data-contextual={JSON.stringify(createContextualData(item))}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        );
        
      case 'date':
        return (
          <div 
            className="text-sm cursor-pointer"
            data-contextual={JSON.stringify(createContextualData(item))}
          >
            {value instanceof Date ? value.toLocaleDateString() : value}
          </div>
        );
        
      default:
        return (
          <div 
            className="cursor-pointer"
            data-contextual={JSON.stringify(createContextualData(item))}
          >
            {value}
          </div>
        );
    }
  };

  const tableContextualData = {
    type: 'table' as const,
    title,
    data: {
      total_rows: data.length,
      columns: columns.length,
      description: description || `Tableau ${title}`
    },
    details: {
      columns: columns.map(c => c.label),
      sample_data: data.slice(0, 3)
    }
  };

  return (
    <div className={cn("w-full bg-white rounded-lg border shadow-sm overflow-hidden", className)}>
      {showHeader && (title || description) && (
        <div className="px-4 py-3 border-b">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-xs font-semibold uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.slice(0, pageSize).map((item, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="p-3 align-middle [&:has([role=checkbox])]:pr-0 text-sm"
                  >
                    {renderCell(item, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showPagination && data.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Affichage de 1 à {Math.min(pageSize, data.length)} sur {data.length} entrées
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 text-sm border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:pointer-events-none"
              disabled={true}
            >
              Précédent
            </button>
            <button 
              className="px-3 py-1 text-sm border rounded-md hover:bg-muted/50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DataTable };
export type { Column, DataTableProps };