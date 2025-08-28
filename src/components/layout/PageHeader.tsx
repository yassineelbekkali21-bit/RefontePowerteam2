import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  showSync?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  actions,
  showSync = true 
}) => {
  const formatSyncTime = () => {
    return new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 mb-6">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-1000"></div>
      
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon className="h-8 w-8" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-blue-100 opacity-90 mt-1">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {showSync && (
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatDate()}
                </div>
                <div className="text-blue-100 text-sm">
                  Dernière sync: {formatSyncTime()}
                </div>
              </div>
            )}
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
