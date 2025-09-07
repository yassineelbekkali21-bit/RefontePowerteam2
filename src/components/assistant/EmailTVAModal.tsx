import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Calendar, 
  User, 
  CheckCircle, 
  Send, 
  Eye, 
  FileText,
  AlertTriangle,
  Clock,
  X,
  Plus
} from 'lucide-react';

interface TVAClient {
  id: string;
  name: string;
  email: string;
  deadline: string;
  period: string;
  status: 'urgent' | 'soon' | 'ok';
  lastReminder?: string;
}

interface EmailTVAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailTVAModal: React.FC<EmailTVAModalProps> = ({ isOpen, onClose }) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('Rappel - Échéance déclaration TVA');
  const [emailTemplate, setEmailTemplate] = useState('standard');
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduleDate, setScheduleDate] = useState('');

  // Données d'exemple des clients TVA
  const tvaClients: TVAClient[] = [
    {
      id: '1',
      name: 'SARL MARIN',
      email: 'contact@sarl-marin.fr',
      deadline: '2024-01-25',
      period: 'Q4 2023',
      status: 'urgent',
      lastReminder: '2024-01-18'
    },
    {
      id: '2',
      name: 'TECH CORP',
      email: 'admin@techcorp.fr',
      deadline: '2024-01-30',
      period: 'Q4 2023',
      status: 'soon'
    },
    {
      id: '3',
      name: 'INNOV SRL',
      email: 'info@innov-srl.com',
      deadline: '2024-02-05',
      period: 'Q4 2023',
      status: 'ok'
    },
    {
      id: '4',
      name: 'CONSULTING PLUS',
      email: 'contact@consulting-plus.fr',
      deadline: '2024-01-28',
      period: 'Q4 2023',
      status: 'urgent'
    },
    {
      id: '5',
      name: 'DESIGN STUDIO',
      email: 'hello@design-studio.fr',
      deadline: '2024-02-02',
      period: 'Q4 2023',
      status: 'soon'
    }
  ];

  const emailTemplates = {
    standard: `Bonjour,

Nous vous rappelons que la déclaration TVA pour la période {{period}} doit être déposée avant le {{deadline}}.

Merci de nous faire parvenir les éléments nécessaires dans les meilleurs délais.

Cordialement,
L'équipe Powerteam`,
    urgent: `Bonjour,

URGENT - La déclaration TVA pour la période {{period}} doit être déposée avant le {{deadline}}.

Merci de nous transmettre les documents en priorité pour éviter tout retard.

Cordialement,
L'équipe Powerteam`,
    friendly: `Bonjour,

J'espère que vous allez bien. Je vous contacte concernant votre déclaration TVA pour la période {{period}}.

L'échéance approche ({{deadline}}), pourriez-vous nous transmettre les éléments nécessaires ?

Bonne journée,
L'équipe Powerteam`
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'soon': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'urgent': return 'Urgent';
      case 'soon': return 'Bientôt';
      default: return 'OK';
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === tvaClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(tvaClients.map(client => client.id));
    }
  };

  const handleSelectUrgent = () => {
    const urgentClients = tvaClients.filter(client => client.status === 'urgent');
    setSelectedClients(urgentClients.map(client => client.id));
  };

  const handlePreview = () => {
    alert('Aperçu des emails - Fonctionnalité à implémenter');
  };

  const handleSend = () => {
    if (selectedClients.length === 0) {
      alert('Veuillez sélectionner au moins un client');
      return;
    }

    const selectedClientsData = tvaClients.filter(client => 
      selectedClients.includes(client.id)
    );

    // Simulation d'envoi
    alert(`Emails envoyés avec succès à ${selectedClientsData.length} client(s) :\n${selectedClientsData.map(c => c.name).join(', ')}`);
    
    onClose();
  };

  const getEmailContent = () => {
    const template = emailTemplates[emailTemplate] || emailTemplates.standard;
    return template + (customMessage ? `\n\n${customMessage}` : '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Préparer Emails TVA</span>
            <Badge variant="secondary">{selectedClients.length} sélectionné(s)</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sélection des clients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Clients concernés</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectUrgent}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Urgents
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {selectedClients.length === tvaClients.length ? 'Désélectionner' : 'Tout sélectionner'}
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {tvaClients.map((client) => (
                <div key={client.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => handleClientToggle(client.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{client.name}</h4>
                      <Badge className={getStatusColor(client.status)}>
                        {getStatusLabel(client.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Échéance: {new Date(client.deadline).toLocaleDateString('fr-FR')}
                      </span>
                      <span>Période: {client.period}</span>
                    </div>
                    {client.lastReminder && (
                      <p className="text-xs text-gray-400 mt-1">
                        Dernier rappel: {new Date(client.lastReminder).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration de l'email */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration Email</h3>

            <div>
              <Label htmlFor="subject">Objet de l'email</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="template">Modèle d'email</Label>
              <Select value={emailTemplate} onValueChange={setEmailTemplate}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="friendly">Amical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preview">Aperçu du contenu</Label>
              <Textarea
                id="preview"
                value={getEmailContent()}
                readOnly
                className="mt-1 h-32 bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="custom">Message personnalisé (optionnel)</Label>
              <Textarea
                id="custom"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ajoutez un message personnalisé..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="schedule">Programmation</Label>
              <Select value={scheduleType} onValueChange={setScheduleType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Envoyer maintenant</SelectItem>
                  <SelectItem value="scheduled">Programmer l'envoi</SelectItem>
                </SelectContent>
              </Select>
              
              {scheduleType === 'scheduled' && (
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={handleSend} disabled={selectedClients.length === 0}>
              <Send className="w-4 h-4 mr-2" />
              {scheduleType === 'immediate' ? 'Envoyer' : 'Programmer'} ({selectedClients.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTVAModal;
