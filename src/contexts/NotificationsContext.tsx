import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  module?: string; // Module d'origine
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Notifications initiales pour démonstration
const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Nouveau plan de correction',
    message: 'Un plan de correction a été créé pour SARL MARTIN',
    type: 'info',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // Il y a 5 minutes
    read: false,
    module: 'Clients',
    priority: 'medium'
  },
  {
    id: 'notif-2',
    title: 'Échéance proche',
    message: '3 tâches arrivent à échéance dans les 48h',
    type: 'warning',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
    read: false,
    module: 'Planning',
    priority: 'high'
  },
  {
    id: 'notif-3',
    title: 'Demande de congé',
    message: 'Sophie Laurent a soumis une demande de congé',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
    read: true,
    module: 'RH',
    priority: 'low'
  }
];

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
