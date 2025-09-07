import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Factory, 
  CreditCard, 
  Users, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  Database,
  Code,
  TrendingUp,
  Briefcase,
  Bot,
  Video,
  HelpCircle,
  Settings,
  RefreshCw,
  GitCompareArrows
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import NotificationDropdown from './NotificationDropdown';

  const navigationItems = [
    {
      title: "Vue d'Ensemble",
      url: "/",
      icon: Home,
      description: "Dashboard principal"
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
      description: "Gestion des clients"
    },
    {
      title: "Prestations",
      url: "/prestations",
      icon: Briefcase,
      description: "Gestion des prestations"
    },
    {
      title: "Production",
      url: "/production",
      icon: Factory,
      description: "Suivi de production"
    },
    {
      title: "Développement",
      url: "/developpement",
      icon: Code,
      description: "Gestion du développement"
    },
    {
      title: "Humain",
      url: "/rh",
      icon: Users,
      description: "Gestion du personnel"
    },
    {
      title: "Finance",
      url: "/finance",
      icon: CreditCard,
      description: "Gestion financière"
    },
    {
      title: "Croissance",
      url: "/croissance",
      icon: TrendingUp,
      description: "Suivi de la croissance"
    },
    {
      title: "DEG Assistant",
      url: "/agent-ia",
      icon: Users,
      description: "Support et assistance"
    },
    {
      title: "Meeting Builder",
      url: "/meeting-builder",
      icon: Video,
      description: "Générateur de réunions"
    }
  ];

  const utilityItems = [
    {
      title: "Centre d'Aide",
      url: "/help",
      icon: HelpCircle,
      description: "Guide et documentation"
    },
    {
      title: "Synchronisation",
      url: "/synchronization",
      icon: RefreshCw,
      description: "Gestion des données"
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
      description: "Configuration"
    },
    {
      title: "Basculement V1/V2",
      url: "/basculement",
      icon: GitCompareArrows,
      description: "Comparatif fonctionnalités"
    },
  ];

export const DashboardSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={cn(
      "transition-all duration-300 border-r border-border bg-card",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Powerteam</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <NotificationDropdown />
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground mb-2",
            collapsed && "sr-only"
          )}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          active && "bg-primary text-primary-foreground font-medium shadow-sm"
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Utilitaires */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-medium text-muted-foreground mb-2 mt-4",
            collapsed && "sr-only"
          )}>
            Utilitaires
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {utilityItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          active && "bg-primary text-primary-foreground font-medium shadow-sm"
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </div>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Keep a clickable rail visible when sidebar is off-canvas so it can be reopened */}
      <SidebarRail />
    </Sidebar>
  );
};