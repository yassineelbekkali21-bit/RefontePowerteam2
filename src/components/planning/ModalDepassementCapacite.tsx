/**
 * Modal de confirmation pour dépassement de capacité
 * Permet de valider l'ajout malgré le dépassement et de modifier la durée
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, User, Calendar } from 'lucide-react';

interface ModalDepassementCapaciteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nouvelleDuree: number) => void;
  tache: {
    nom: string;
    clientNom: string;
    type: string;
    responsable: string;
    dureeEstimee: number;
    urgence: 'low' | 'medium' | 'high' | 'urgent';
  };
  planning: {
    date: string;
    chargeActuelle: number;
    capaciteMax: number;
    nombreTaches: number;
  };
}

export default function ModalDepassementCapacite({
  isOpen,
  onClose,
  onConfirm,
  tache,
  planning
}: ModalDepassementCapaciteProps) {
  const [nouvelleDuree, setNouvelleDuree] = useState(tache.dureeEstimee);
  const [chargeApresAjout, setChargeApresAjout] = useState(0);
  const [tauxUtilisation, setTauxUtilisation] = useState(0);

  // Calcul en temps réel de la charge après ajout
  useEffect(() => {
    const charge = planning.chargeActuelle + nouvelleDuree;
    const taux = (charge / planning.capaciteMax) * 100;
    setChargeApresAjout(charge);
    setTauxUtilisation(taux);
  }, [nouvelleDuree, planning]);

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

  const getVariantProgress = (): "default" | "destructive" => {
    return tauxUtilisation > 100 ? "destructive" : "default";
  };

  const handleConfirm = () => {
    onConfirm(nouvelleDuree);
    onClose();
  };

  const handleCancel = () => {
    setNouvelleDuree(tache.dureeEstimee); // Reset à la valeur originale
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Capacité dépassée !
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(planning.date)}</span>
              </div>
            </div>
          </div>

          {/* Situation actuelle */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-3 text-gray-700">Situation actuelle</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Charge actuelle :</span>
                <span className="font-medium">{planning.chargeActuelle.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacité maximale :</span>
                <span className="font-medium">{planning.capaciteMax}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tâches planifiées :</span>
                <span className="font-medium">{planning.nombreTaches}</span>
              </div>
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

          {/* Aperçu après ajout */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm mb-3 text-blue-800">Après ajout</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Charge totale :</span>
                <span className="font-bold text-blue-900">
                  {chargeApresAjout.toFixed(1)}h / {planning.capaciteMax}h
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Taux d'utilisation :</span>
                  <Badge 
                    variant={tauxUtilisation > 100 ? 'destructive' : tauxUtilisation > 85 ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {Math.round(tauxUtilisation)}%
                  </Badge>
                </div>
                
                <Progress 
                  value={Math.min(tauxUtilisation, 100)} 
                  className="h-2"
                  // @ts-ignore - variant existe dans notre implémentation
                  variant={getVariantProgress()}
                />
              </div>

              {tauxUtilisation > 100 && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Dépassement de {(chargeApresAjout - planning.capaciteMax).toFixed(1)}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Recommandations */}
          {tauxUtilisation > 100 && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-sm mb-2 text-amber-800">💡 Recommandations</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Réduire la durée estimée si possible</li>
                <li>• Planifier sur un autre jour moins chargé</li>
                <li>• Vérifier si la tâche est vraiment urgente</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 ${tauxUtilisation > 100 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {tauxUtilisation > 100 ? 'Forcer l\'ajout' : 'Confirmer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
