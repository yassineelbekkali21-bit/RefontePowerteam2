/**
 * Modal universel pour modifier les tâches et créer des réunions
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, Calendar, Video, Mail, Users, MapPin, FileText } from 'lucide-react';

interface TacheModifiable {
  id: string;
  nom: string;
  clientNom: string;
  type: string;
  responsable: string;
  dureeEstimee: number;
  urgence: 'low' | 'medium' | 'high' | 'urgent';
  dateEcheance: string;
  jour?: string;
}

interface ReunionData {
  titre: string;
  description: string;
  duree: number;
  participants: string[];
  lieu: string;
  typeReunion: 'interne' | 'client' | 'externe';
  envoyerInvitation: boolean;
  clientEmail?: string;
}

interface ModalModificationTacheProps {
  isOpen: boolean;
  onClose: () => void;
  onModifierTache: (tacheId: string, nouvelleDuree: number) => void;
  onCreerReunion: (reunion: ReunionData, jour: string) => void;
  tache?: TacheModifiable;
  jour?: string;
  mode: 'modifier' | 'creer-reunion';
}

export default function ModalModificationTache({
  isOpen,
  onClose,
  onModifierTache,
  onCreerReunion,
  tache,
  jour,
  mode
}: ModalModificationTacheProps) {
  // États pour modification de tâche
  const [nouvelleDuree, setNouvelleDuree] = useState(tache?.dureeEstimee || 1);
  
  // États pour création de réunion
  const [reunionData, setReunionData] = useState<ReunionData>({
    titre: '',
    description: '',
    duree: 1,
    participants: [],
    lieu: '',
    typeReunion: 'client',
    envoyerInvitation: true,
    clientEmail: ''
  });

  const [nouveauParticipant, setNouveauParticipant] = useState('');

  // Reset des états à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (mode === 'modifier' && tache) {
        setNouvelleDuree(tache.dureeEstimee);
      } else if (mode === 'creer-reunion') {
        setReunionData({
          titre: '',
          description: '',
          duree: 1,
          participants: [],
          lieu: 'Teams',
          typeReunion: 'client',
          envoyerInvitation: true,
          clientEmail: ''
        });
      }
    }
  }, [isOpen, mode, tache]);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getCouleurUrgence = (urgence: string): string => {
    switch (urgence) {
      case 'urgent': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const ajouterParticipant = () => {
    if (nouveauParticipant.trim() && !reunionData.participants.includes(nouveauParticipant.trim())) {
      setReunionData(prev => ({
        ...prev,
        participants: [...prev.participants, nouveauParticipant.trim()]
      }));
      setNouveauParticipant('');
    }
  };

  const retirerParticipant = (participant: string) => {
    setReunionData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p !== participant)
    }));
  };

  const handleConfirmer = () => {
    if (mode === 'modifier' && tache) {
      onModifierTache(tache.id, nouvelleDuree);
    } else if (mode === 'creer-reunion' && jour) {
      onCreerReunion(reunionData, jour);
    }
    onClose();
  };

  const isFormValid = () => {
    if (mode === 'modifier') {
      return nouvelleDuree > 0 && nouvelleDuree <= 8;
    } else if (mode === 'creer-reunion') {
      return reunionData.titre.trim() !== '' && reunionData.duree > 0;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'modifier' ? (
              <>
                <Clock className="w-5 h-5 text-blue-600" />
                Modifier la tâche
              </>
            ) : (
              <>
                <Video className="w-5 h-5 text-green-600" />
                Créer une réunion
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode === 'modifier' && tache ? (
            <>
              {/* Informations sur la tâche */}
              <div className={`p-4 rounded-lg border-2 ${getCouleurUrgence(tache.urgence)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{tache.nom}</h3>
                  <Badge variant="outline" className="text-xs">{tache.type}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tache.clientNom}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{tache.responsable}</span>
                  </div>
                  {jour && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(jour)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modification de la durée */}
              <div className="space-y-3">
                <Label htmlFor="duree" className="text-sm font-medium">
                  Durée estimée (en heures)
                </Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <Input
                    id="duree"
                    type="number"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={nouvelleDuree}
                    onChange={(e) => setNouvelleDuree(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">heures</span>
                </div>
                <p className="text-xs text-gray-500">
                  Durée originale : {tache.dureeEstimee}h
                </p>
              </div>

              {/* Type de travail */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-blue-800">💼 Type de travail</h4>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <User className="w-4 h-4" />
                  <span>Travail individuel - {tache.responsable}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Création de réunion */}
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  {/* Informations de base */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="titre">Titre de la réunion *</Label>
                      <Input
                        id="titre"
                        placeholder="Ex: Point client SARL Dupont"
                        value={reunionData.titre}
                        onChange={(e) => setReunionData(prev => ({ ...prev, titre: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Ordre du jour, points à aborder..."
                        rows={3}
                        value={reunionData.description}
                        onChange={(e) => setReunionData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="duree-reunion">Durée (heures)</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <Input
                            id="duree-reunion"
                            type="number"
                            min="0.5"
                            max="4"
                            step="0.5"
                            value={reunionData.duree}
                            onChange={(e) => setReunionData(prev => ({ 
                              ...prev, 
                              duree: parseFloat(e.target.value) || 0 
                            }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="type-reunion">Type</Label>
                        <Select
                          value={reunionData.typeReunion}
                          onValueChange={(value: 'interne' | 'client' | 'externe') => 
                            setReunionData(prev => ({ ...prev, typeReunion: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">🤝 Réunion client</SelectItem>
                            <SelectItem value="interne">🏢 Réunion interne</SelectItem>
                            <SelectItem value="externe">🌐 Réunion externe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="lieu">Lieu</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <Input
                          id="lieu"
                          placeholder="Teams, Bureau, Chez le client..."
                          value={reunionData.lieu}
                          onChange={(e) => setReunionData(prev => ({ ...prev, lieu: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  {/* Gestion des participants */}
                  <div className="space-y-3">
                    <div>
                      <Label>Ajouter un participant</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Email ou nom"
                          value={nouveauParticipant}
                          onChange={(e) => setNouveauParticipant(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && ajouterParticipant()}
                        />
                        <Button type="button" onClick={ajouterParticipant} size="sm">
                          Ajouter
                        </Button>
                      </div>
                    </div>

                    {/* Liste des participants */}
                    {reunionData.participants.length > 0 && (
                      <div>
                        <Label>Participants ({reunionData.participants.length})</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {reunionData.participants.map((participant, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
                              onClick={() => retirerParticipant(participant)}
                            >
                              <Users className="w-3 h-3" />
                              {participant}
                              <span className="ml-1 text-red-500">×</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Options d'invitation */}
                    {reunionData.typeReunion === 'client' && (
                      <div className="bg-green-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="envoyer-invitation" className="text-green-800">
                            Envoyer invitation Teams
                          </Label>
                          <Switch
                            id="envoyer-invitation"
                            checked={reunionData.envoyerInvitation}
                            onCheckedChange={(checked) => 
                              setReunionData(prev => ({ ...prev, envoyerInvitation: checked }))
                            }
                          />
                        </div>

                        {reunionData.envoyerInvitation && (
                          <div>
                            <Label htmlFor="client-email">Email du client principal</Label>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <Input
                                id="client-email"
                                type="email"
                                placeholder="client@entreprise.com"
                                value={reunionData.clientEmail}
                                onChange={(e) => setReunionData(prev => ({ 
                                  ...prev, 
                                  clientEmail: e.target.value 
                                }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmer} 
            disabled={!isFormValid()}
            className="flex-1"
          >
            {mode === 'modifier' ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Modifier
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Créer réunion
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
