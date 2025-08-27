/**
 * Composant de sélection multiple de collaborateurs
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Users, ChevronDown, X, CheckCircle2 } from 'lucide-react';

interface Collaborateur {
  id: string;
  nom: string;
  couleur: string;
  capaciteJour: number;
}

interface SelecteurCollaborateursProps {
  collaborateurs: Collaborateur[];
  collaborateursSelectionnes: string[];
  onSelectionChange: (collaborateurs: string[]) => void;
  className?: string;
}

export default function SelecteurCollaborateurs({
  collaborateurs,
  collaborateursSelectionnes,
  onSelectionChange,
  className = ""
}: SelecteurCollaborateursProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollaborateur = (collaborateurId: string) => {
    if (collaborateurId === 'all') {
      // Si on clique sur "Tous", on sélectionne/désélectionne tout
      if (collaborateursSelectionnes.includes('all')) {
        onSelectionChange([]);
      } else {
        onSelectionChange(['all']);
      }
    } else {
      // Gestion de la sélection individuelle
      let nouvelleSelection = [...collaborateursSelectionnes.filter(id => id !== 'all')];
      
      if (nouvelleSelection.includes(collaborateurId)) {
        nouvelleSelection = nouvelleSelection.filter(id => id !== collaborateurId);
      } else {
        nouvelleSelection.push(collaborateurId);
      }

      // Si tous les collaborateurs sont sélectionnés individuellement, on passe à "all"
      if (nouvelleSelection.length === collaborateurs.length) {
        nouvelleSelection = ['all'];
      }

      onSelectionChange(nouvelleSelection);
    }
  };

  const retirerCollaborateur = (collaborateurId: string) => {
    if (collaborateurId === 'all') {
      onSelectionChange([]);
    } else {
      const nouvelleSelection = collaborateursSelectionnes.filter(id => id !== collaborateurId);
      onSelectionChange(nouvelleSelection);
    }
  };

  const obtenirTexteSelection = (): string => {
    if (collaborateursSelectionnes.length === 0) {
      return "Aucun collaborateur";
    }
    
    if (collaborateursSelectionnes.includes('all')) {
      return "Tous les collaborateurs";
    }

    if (collaborateursSelectionnes.length === 1) {
      const collaborateur = collaborateurs.find(c => c.id === collaborateursSelectionnes[0]);
      return collaborateur?.nom || "Collaborateur inconnu";
    }

    return `${collaborateursSelectionnes.length} collaborateurs`;
  };

  const obtenirCollaborateur = (id: string) => {
    return collaborateurs.find(c => c.id === id);
  };

  const estTousSelectionne = collaborateursSelectionnes.includes('all');
  const estTousIndividuellementSelectionnes = collaborateursSelectionnes.length === collaborateurs.length && !estTousSelectionne;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Sélecteur principal */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{obtenirTexteSelection()}</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Sélectionner les collaborateurs</h4>
              <Badge variant="secondary" className="text-xs">
                {collaborateursSelectionnes.length === 0 ? 0 : 
                 estTousSelectionne ? collaborateurs.length : 
                 collaborateursSelectionnes.length} / {collaborateurs.length + 1}
              </Badge>
            </div>

            <Separator />

            {/* Option "Tous" */}
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
              <Checkbox
                id="all"
                checked={estTousSelectionne || estTousIndividuellementSelectionnes}
                onCheckedChange={() => toggleCollaborateur('all')}
                className="data-[state=checked]:bg-blue-600"
              />
              <label
                htmlFor="all"
                className="flex-1 text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                Tous les collaborateurs
                {(estTousSelectionne || estTousIndividuellementSelectionnes) && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </label>
            </div>

            <Separator />

            {/* Liste des collaborateurs individuels */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {collaborateurs.map(collaborateur => {
                const estSelectionne = collaborateursSelectionnes.includes(collaborateur.id) || estTousSelectionne;
                
                return (
                  <div
                    key={collaborateur.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      id={collaborateur.id}
                      checked={estSelectionne}
                      onCheckedChange={() => toggleCollaborateur(collaborateur.id)}
                      disabled={estTousSelectionne}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <label
                      htmlFor={collaborateur.id}
                      className="flex-1 text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div 
                        className={`w-3 h-3 rounded-full ${collaborateur.couleur}`}
                      ></div>
                      <span>{collaborateur.nom}</span>
                      <span className="text-xs text-gray-500">
                        ({collaborateur.capaciteJour}h/jour)
                      </span>
                      {estSelectionne && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <Separator />
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="flex-1"
              >
                Tout désélectionner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectionChange(['all'])}
                className="flex-1"
              >
                Tout sélectionner
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Badges des collaborateurs sélectionnés */}
      {collaborateursSelectionnes.length > 0 && !estTousSelectionne && (
        <div className="flex flex-wrap gap-1">
          {collaborateursSelectionnes.map(id => {
            const collaborateur = obtenirCollaborateur(id);
            if (!collaborateur) return null;

            return (
              <Badge
                key={id}
                variant="secondary"
                className="flex items-center gap-1 pr-1 text-xs"
              >
                <div className={`w-2 h-2 rounded-full ${collaborateur.couleur}`}></div>
                <span>{collaborateur.nom}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => retirerCollaborateur(id)}
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Badge "Tous" si sélectionné */}
      {estTousSelectionne && (
        <div className="flex flex-wrap gap-1">
          <Badge
            variant="default"
            className="flex items-center gap-1 pr-1 text-xs bg-blue-600"
          >
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span>Tous les collaborateurs</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-blue-700"
              onClick={() => retirerCollaborateur('all')}
            >
              <X className="w-3 h-3 text-white" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Résumé de capacité */}
      {collaborateursSelectionnes.length > 0 && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex items-center justify-between">
            <span>Capacité totale :</span>
            <span className="font-medium">
              {estTousSelectionne 
                ? collaborateurs.reduce((total, c) => total + c.capaciteJour, 0)
                : collaborateursSelectionnes.reduce((total, id) => {
                    const collab = obtenirCollaborateur(id);
                    return total + (collab?.capaciteJour || 0);
                  }, 0)
              }h/jour
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
