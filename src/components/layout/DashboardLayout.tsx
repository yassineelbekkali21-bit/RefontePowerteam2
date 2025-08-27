import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { ContextualSidebar } from './ContextualSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface ContextualData {
  type: 'kpi' | 'chart' | 'table' | 'project' | 'user' | 'task' | 'collaborator' | 'budget' | 'folder' | 'planning-item' | 'financial-entity' | 'time-sheet';
  title: string;
  data: any;
  details?: any;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [contextualData, setContextualData] = useState<ContextualData | null>(null);

  const handleElementClick = (data: ContextualData) => {
    setContextualData(data);
  };

  const closeContextualSidebar = () => {
    setContextualData(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 flex">
          <div 
            className={`flex-1 transition-all duration-300 ${
              contextualData ? 'mr-80' : 'mr-0'
            }`}
          >
            <div className="p-6">
              {/* Always-visible sidebar trigger */}
              <div className="mb-4">
                <SidebarTrigger />
              </div>
              {/* Pass the click handler down through context */}
              <div onClick={(e) => {
                const target = e.target as HTMLElement;
                const clickableElement = target.closest('[data-contextual]');
                if (clickableElement) {
                  const contextualData = JSON.parse(clickableElement.getAttribute('data-contextual') || '{}');
                  handleElementClick(contextualData);
                }
              }}>
                {children}
              </div>
            </div>
          </div>

          <ContextualSidebar 
            data={contextualData}
            isOpen={!!contextualData}
            onClose={closeContextualSidebar}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};