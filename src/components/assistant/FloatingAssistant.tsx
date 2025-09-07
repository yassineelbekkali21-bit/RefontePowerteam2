import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import EmailTVAModalSimple from './EmailTVAModalSimple';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline';
  }>;
}

const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isEmailTVAModalOpen, setIsEmailTVAModalOpen] = useState(false);
  
  // Debug - loguer les changements d'état du modal
  useEffect(() => {
    console.log("TVA Modal state changed:", isEmailTVAModalOpen);
  }, [isEmailTVAModalOpen]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString(),
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Ajouter message utilisateur
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Simuler réponse assistant
    const assistantResponse: Message = {
      id: messages.length + 2,
      type: 'assistant',
      content: getAssistantResponse(message),
      timestamp: new Date().toISOString(),
      actions: getMessageActions(message),
    };

    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setMessage('');
  };

  const getMessageActions = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    console.log("Checking message for actions:", lowerMessage);
    
    if (lowerMessage.includes('tva') || lowerMessage.includes('rappel')) {
      console.log("TVA actions detected, returning buttons");
      return [
        {
          label: "Préparer emails TVA",
          action: () => {
            console.log("Button clicked - opening TVA modal");
            setIsEmailTVAModalOpen(true);
          },
          variant: 'default' as const
        },
        {
          label: "Voir clients concernés",
          action: () => alert("Redirection vers la liste des clients TVA - À implémenter"),
          variant: 'outline' as const
        }
      ];
    }
    
    console.log("No actions for this message");
    return undefined;
  };

  const getAssistantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('échéance') || lowerMessage.includes('urgent') || lowerMessage.includes('deadline') || lowerMessage.includes('délai')) {
      return "🚨 Vos échéances urgentes pour cette semaine :\n\n📋 **Déclarations TVA** - 3 clients (échéance 20/01)\n📊 **Bilan annuel** - SAS Durand (échéance 22/01)\n💼 **Liasse fiscale** - SARL Martin (échéance 25/01)\n\n💡 Voulez-vous que je vous dirige vers le module Production pour voir le détail et organiser votre planning ?";
    } else if (lowerMessage.includes('tva') || lowerMessage.includes('rappel')) {
      return "📧 Je vais vous aider à envoyer des rappels TVA. J'ai identifié 5 clients assujettis à la TVA avec des échéances ce mois-ci.\n\n🔴 **Urgent** : 2 clients (échéance dans 5 jours)\n🟡 **Bientôt** : 2 clients (échéance dans 10 jours)\n🟢 **OK** : 1 client (échéance dans 15 jours)\n\nVoulez-vous que je prépare les emails de rappel ?";
    } else if (lowerMessage.includes('planning') || lowerMessage.includes('agenda') || lowerMessage.includes('emploi du temps')) {
      return "📅 Votre planning aujourd'hui :\n\n• 09h-11h : Révision comptable - Client Dubois\n• 14h-16h : Réunion supervision équipe\n• 16h30-17h30 : Préparation TVA - 3 dossiers\n\nSouhaitez-vous consulter votre planning complet ou modifier des créneaux ?";
    } else if (lowerMessage.includes('client') || lowerMessage.includes('contact')) {
      return "Je peux vous aider avec la gestion clients. Voulez-vous consulter la liste des clients, créer un nouveau contact, ou obtenir des informations sur un client spécifique ?";
    } else if (lowerMessage.includes('finance') || lowerMessage.includes('facture') || lowerMessage.includes('rentabilité')) {
      return "💰 Pour les questions financières :\n\n• **Tableau de bord** : Module Finance > Vue d'ensemble\n• **Analyse client** : Diagnostics automatiques disponibles\n• **Facturation** : Suivi des encours et relances\n\nQue souhaitez-vous consulter en priorité ?";
    } else if (lowerMessage.includes('congé') || lowerMessage.includes('vacances') || lowerMessage.includes('absence')) {
      return "🏖️ Gestion des congés :\n\n• **Faire une demande** : Module Humain > Demander un congé\n• **Consulter vos soldes** : 25 jours restants (CP), 8 jours (RTT)\n• **Voir l'équipe** : Planning des absences en cours\n\nVoulez-vous que je vous guide pour une action spécifique ?";
    } else if (lowerMessage.includes('rapport') || lowerMessage.includes('supervision') || lowerMessage.includes('contrôle')) {
      return "📊 Rapports et supervision :\n\n• **Nouvelle supervision** : Module Développement > Supervision\n• **Rapports mensuels** : Disponibles dans l'onglet Rapports\n• **Analyses d'erreurs** : Suivi des corrections en cours\n\nSouhaitez-vous accéder à un rapport spécifique ?";
    } else if (lowerMessage.includes('tâche') || lowerMessage.includes('todo') || lowerMessage.includes('à faire')) {
      return "✅ Vos tâches prioritaires :\n\n🔴 **Urgent** : Finaliser TVA SAS Durand\n🟡 **Aujourd'hui** : Valider 2 demandes de congés\n🟢 **Cette semaine** : Préparer réunion mensuelle\n\nVoulez-vous plus de détails sur une tâche ou accéder au module de gestion ?";
    } else if (lowerMessage.includes('équipe') || lowerMessage.includes('collaborateur') || lowerMessage.includes('collègue')) {
      return "👥 Informations équipe :\n\n• **Présents aujourd'hui** : 8/10 collaborateurs\n• **En congés** : Marie (retour lundi), Pierre (retour jeudi)\n• **Charge de travail** : Équipe à 85% de capacité\n\nSouhaitez-vous consulter le planning détaillé ou les performances individuelles ?";
    } else if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('comment')) {
      return "🎯 Je peux vous aider avec :\n\n📋 **Échéances et planning** - Suivi des deadlines\n💼 **Gestion clients** - Contacts et dossiers\n💰 **Finance** - Analyses et facturation\n👥 **Équipe** - Congés et planning\n📊 **Rapports** - Supervision et contrôles\n\nPosez-moi une question spécifique !";
    } else {
      return "Je suis là pour vous aider ! Vous pouvez me poser des questions sur :\n\n• Vos **échéances urgentes**\n• Votre **planning** du jour\n• La **gestion clients**\n• Les **finances** et la rentabilité\n• Les **congés** et absences\n• Les **rapports** de supervision\n• Votre **équipe**\n\nQue puis-je faire pour vous ?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 text-xs font-medium">
          DEG
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-lg transition-all duration-300",
        isMinimized ? "h-16" : "h-[500px]"
      )}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>DEG Assistant</span>
              <Badge className="bg-white/20 text-white text-xs">En ligne</Badge>
              {/* Bouton de test */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  console.log("Test button clicked");
                  setIsEmailTVAModalOpen(true);
                }}
                className="h-6 w-6 p-0 text-white hover:bg-white/20 ml-2"
              >
                <Mail className="h-3 w-3" />
              </Button>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[452px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] p-2 rounded-lg text-sm",
                      msg.type === 'user'
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {/* Debug: afficher les actions si elles existent */}
                    {msg.actions && (
                      <div className="mt-2 text-xs text-blue-600">
                        DEBUG: {msg.actions.length} actions disponibles
                      </div>
                    )}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || 'default'}
                            size="sm"
                            onClick={action.action}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Modal Email TVA */}
      <EmailTVAModalSimple 
        isOpen={isEmailTVAModalOpen}
        onClose={() => {
          console.log("Closing TVA modal");
          setIsEmailTVAModalOpen(false);
        }}
      />
    </div>
  );
};

export default FloatingAssistant;
