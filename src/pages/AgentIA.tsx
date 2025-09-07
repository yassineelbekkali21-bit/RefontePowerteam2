import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Send, 
  Mic, 
  Settings,
  Brain,
  Zap,
  MessageSquare,
  Users,
  BarChart3,
  Shield,
  Play,
  Pause,
  Mail,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  History,
  Archive,
  Star,
  ExternalLink,
  Lightbulb,
  Target,
  Bell
} from 'lucide-react';

const AgentIA = () => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeConversation, setActiveConversation] = useState('general');
  const [selectedClient, setSelectedClient] = useState('');
  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Bonjour ! Je suis votre assistant Powerteam. Je peux vous aider avec la communication client, la supervision, l\'automatisation et bien plus. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toISOString(),
      actions: []
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Ajouter le message utilisateur
      const userMessage = {
        id: conversationHistory.length + 1,
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setConversationHistory(prev => [...prev, userMessage]);
      
      // Simuler une réponse IA
      setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        setConversationHistory(prev => [...prev, aiResponse]);
      }, 1000);
      
      setMessage('');
    }
  };

  const generateAIResponse = (userMessage) => {
    let response = "Je comprends votre demande. ";
    let actions = [];
    
    if (userMessage.toLowerCase().includes('échéance') || userMessage.toLowerCase().includes('urgent') || userMessage.toLowerCase().includes('deadline')) {
      response = "🚨 Vos échéances urgentes cette semaine :\n\n📋 Déclarations TVA - 3 clients (échéance 20/01)\n📊 Bilan annuel - SAS Durand (échéance 22/01)\n💼 Liasse fiscale - SARL Martin (échéance 25/01)\n\nVoulez-vous que je vous aide à organiser votre planning ?";
      actions = [
        { type: 'view-production', label: 'Voir module Production', icon: Calendar },
        { type: 'planning', label: 'Organiser planning', icon: Clock }
      ];
    } else if (userMessage.toLowerCase().includes('planning') || userMessage.toLowerCase().includes('agenda')) {
      response = "📅 Votre planning aujourd'hui :\n\n• 09h-11h : Révision comptable - Client Dubois\n• 14h-16h : Réunion supervision équipe\n• 16h30-17h30 : Préparation TVA - 3 dossiers\n\nSouhaitez-vous consulter ou modifier votre planning ?";
      actions = [
        { type: 'view-calendar', label: 'Voir calendrier complet', icon: Calendar },
        { type: 'modify-planning', label: 'Modifier créneaux', icon: Clock }
      ];
    } else if (userMessage.toLowerCase().includes('tva') || userMessage.toLowerCase().includes('rappel')) {
      response = "Je vais vous aider à envoyer des rappels TVA. J'ai identifié 23 clients assujettis à la TVA avec des échéances ce mois-ci. Voulez-vous que je prépare l'email de rappel ?";
      actions = [
        { type: 'email-tva', label: 'Préparer emails TVA', icon: Mail },
        { type: 'view-clients', label: 'Voir clients concernés', icon: Users }
      ];
    } else if (userMessage.toLowerCase().includes('congé') || userMessage.toLowerCase().includes('vacances')) {
      response = "Pour prendre des congés dans Powerteam : 1) Allez dans le module Humain, 2) Cliquez sur 'Demander un congé', 3) Sélectionnez les dates, 4) Ajoutez un motif, 5) Soumettez la demande. Votre manager recevra une notification.";
      actions = [
        { type: 'redirect-rh', label: 'Aller au module RH', icon: ExternalLink },
        { type: 'guide-conge', label: 'Guide détaillé', icon: FileText }
      ];
    } else if (userMessage.toLowerCase().includes('rapport') || userMessage.toLowerCase().includes('supervision')) {
      response = "Je peux vous aider à créer un rapport de supervision. Quel type de travail souhaitez-vous superviser ? Sélectionnez le client et je générerai un rapport structuré.";
      actions = [
        { type: 'create-report', label: 'Créer rapport', icon: FileText },
        { type: 'templates', label: 'Modèles disponibles', icon: Archive }
      ];
    } else if (userMessage.toLowerCase().includes('mail') || userMessage.toLowerCase().includes('email')) {
      response = "Je peux vous aider à envoyer un email. Sélectionnez le client destinataire et je vous proposerai des modèles adaptés à votre demande.";
      actions = [
        { type: 'compose-email', label: 'Composer email', icon: Mail },
        { type: 'templates-email', label: 'Modèles emails', icon: FileText }
      ];
    } else if (userMessage.toLowerCase().includes('équipe') || userMessage.toLowerCase().includes('collaborateur')) {
      response = "👥 Informations équipe :\n\n• Présents aujourd'hui : 8/10 collaborateurs\n• En congés : Marie (retour lundi), Pierre (retour jeudi)\n• Charge de travail : Équipe à 85% de capacité\n\nQue souhaitez-vous consulter ?";
      actions = [
        { type: 'team-planning', label: 'Planning équipe', icon: Users },
        { type: 'team-performance', label: 'Performances', icon: BarChart3 }
      ];
    } else {
      response += "Voici ce que je peux faire pour vous aujourd'hui :";
      actions = [
        { type: 'deadlines', label: 'Échéances urgentes', icon: AlertCircle },
        { type: 'planning', label: 'Planning du jour', icon: Calendar },
        { type: 'email-assistance', label: 'Gestion emails clients', icon: Mail },
        { type: 'supervision', label: 'Rapports supervision', icon: FileText }
      ];
    }
    
    return {
      id: conversationHistory.length + 2,
      type: 'ai',
      content: response,
      timestamp: new Date().toISOString(),
      actions: actions
    };
  };

  const clientsList = [
    { id: 'all-tva', name: 'Tous les clients TVA (23)', type: 'group' },
    { id: 'beltec', name: 'BELTEC SARL', type: 'individual', status: 'tva-due' },
    { id: 'techno', name: 'TECHNO SOLUTIONS', type: 'individual', status: 'ok' },
    { id: 'martin', name: 'GARAGE MARTIN', type: 'individual', status: 'tva-due' },
    { id: 'olivier', name: 'RESTAURANT L\'OLIVIER', type: 'individual', status: 'pending' }
  ];

  const quickActions = [
    { id: 'tva-reminder', label: 'Rappels TVA automatiques', icon: Mail, category: 'communication' },
    { id: 'client-follow', label: 'Suivi client personnalisé', icon: Users, category: 'communication' },
    { id: 'task-automation', label: 'Automatiser tâches récurrentes', icon: Zap, category: 'automation' },
    { id: 'report-generation', label: 'Générer rapport supervision', icon: FileText, category: 'supervision' },
    { id: 'platform-navigation', label: 'Aide navigation plateforme', icon: Lightbulb, category: 'assistance' },
    { id: 'deadline-alerts', label: 'Alertes échéances', icon: Bell, category: 'automation' }
  ];

  const conversationTemplates = [
    { id: 'tva-clients', name: 'Clients TVA', icon: Mail, description: 'Gestion rappels TVA' },
    { id: 'supervision', name: 'Supervision', icon: FileText, description: 'Rapports et suivis' },
    { id: 'client-direct', name: 'Client Direct', icon: Users, description: 'Communication client' },
    { id: 'platform-help', name: 'Aide Plateforme', icon: Lightbulb, description: 'Support utilisation' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="📋 DEG Assistant"
          description="Point d'entrée transversal • Collaboration • Automatisation • Support personnalisé"
          icon={Users}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>
              <Badge className="bg-green-100 text-green-700">
                ● Assistant Actif
              </Badge>
            </>
          }
        />

        {/* Stats Intelligentes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600">Emails automatisés</p>
                  <p className="text-2xl font-bold text-green-900">87</p>
                </div>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600">Rappels programmés</p>
                  <p className="text-2xl font-bold text-blue-900">23</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-600">Rapports générés</p>
                  <p className="text-2xl font-bold text-purple-900">14</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-600">Temps économisé</p>
                  <p className="text-2xl font-bold text-orange-900">6.5h</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-teal-600">Actions suggérées</p>
                  <p className="text-2xl font-bold text-teal-900">12</p>
                </div>
                <Target className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interface Chat Principale */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* Sélection contexte conversation */}
              <div className="xl:col-span-1">
                <Card className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <History className="w-4 h-4" />
                      <span>Contexte</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {conversationTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant={activeConversation === template.id ? "default" : "outline"}
                        className="w-full justify-start text-xs h-auto p-3"
                        onClick={() => setActiveConversation(template.id)}
                      >
                        <template.icon className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs opacity-70">{template.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Zone Chat */}
              <div className="xl:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5" />
                        <span>Assistant Powerteam</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {selectedClient && (
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            <Users className="w-3 h-3 mr-1" />
                            {clientsList.find(c => c.id === selectedClient)?.name}
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="text-white h-6 px-2">
                          <Archive className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                      {conversationHistory.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.type === 'user' 
                                  ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              }`}>
                                {msg.type === 'user' ? (
                                  <Users className="w-4 h-4 text-white" />
                                ) : (
                                  <MessageSquare className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div className={`p-4 rounded-lg shadow-sm ${
                                msg.type === 'user' 
                                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                                  : 'bg-white border'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                {msg.type === 'ai' && msg.actions && msg.actions.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {msg.actions.map((action, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() => {
                                          if (action.type === 'compose-email') {
                                            setMessage('Composer un email pour un client');
                                          } else if (action.type === 'create-report') {
                                            setMessage('Créer un rapport de supervision');
                                          }
                                        }}
                                      >
                                        <action.icon className="w-3 h-3 mr-1" />
                                        {action.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 px-11">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sélection client si pertinent */}
                    {(activeConversation === 'client-direct' || activeConversation === 'tva-clients') && (
                      <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Sélectionner un client..." />
                          </SelectTrigger>
                          <SelectContent>
                            {clientsList.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    client.status === 'tva-due' ? 'bg-red-500' :
                                    client.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'
                                  }`} />
                                  <span>{client.name}</span>
                                  {client.type === 'group' && <Badge variant="outline" className="text-xs">Groupe</Badge>}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Input de message */}
                    <div className="p-4 border-t bg-white">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center space-x-2">
                          <Input
                            placeholder={
                              activeConversation === 'tva-clients' ? "Ex: Envoyer rappels TVA à tous les clients concernés" :
                              activeConversation === 'supervision' ? "Ex: Créer un rapport de supervision pour BELTEC SARL" :
                              activeConversation === 'client-direct' ? "Ex: Envoyer un email de relance à ce client" :
                              activeConversation === 'platform-help' ? "Ex: Comment prendre un congé ?" :
                              "Tapez votre message..."
                            }
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 text-sm"
                          />
                          <Button
                            variant={isListening ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsListening(!isListening)}
                          >
                            <Mic className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Suggestions contextuelles */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeConversation === 'tva-clients' && [
                          "Rappels TVA automatiques",
                          "Liste clients en retard",
                          "Programmer envois"
                        ].map((suggestion, index) => (
                          <Button 
                            key={index} 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => setMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}

                        {activeConversation === 'supervision' && [
                          "Rapport mensuel",
                          "Analyse performance",
                          "Points d'attention"
                        ].map((suggestion, index) => (
                          <Button 
                            key={index} 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => setMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}

                        {activeConversation === 'platform-help' && [
                          "Comment prendre un congé ?",
                          "Où trouver les rapports ?",
                          "Comment ajouter un client ?"
                        ].map((suggestion, index) => (
                          <Button 
                            key={index} 
                            variant="ghost" 
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => setMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Panneau Actions Intelligentes */}
          <div className="space-y-6">
            {/* Actions Rapides Contextuelles */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Actions Intelligentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="w-full justify-start text-xs h-auto p-3"
                      onClick={() => setMessage(action.label)}
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs opacity-70 capitalize">{action.category}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique Récent */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>Récent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Emails TVA envoyés", time: "Il y a 2h", icon: Mail, status: "success" },
                    { action: "Rapport BELTEC généré", time: "Il y a 4h", icon: FileText, status: "success" },
                    { action: "Rappels programmés", time: "Hier", icon: Bell, status: "pending" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-4 h-4 ${
                          item.status === 'success' ? 'text-green-500' : 'text-orange-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'success' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions intelligentes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">TVA en retard</p>
                        <p className="text-xs text-amber-700">5 clients ont des échéances TVA dépassées</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-amber-800">
                          Traiter maintenant →
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Optimisation détectée</p>
                        <p className="text-xs text-blue-700">Automatiser 3 tâches récurrentes</p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-blue-800">
                          Voir détails →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentIA;
