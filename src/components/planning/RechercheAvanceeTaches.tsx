/**
 * Composant de recherche avancée de tâches
 * Permet de rechercher et filtrer toutes les tâches pour les ajouter au planning
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';

// Types pour la recherche
interface TacheRecherchable {
  id: string;
  nom: string;
  clientNom: string;
  type: string;
  responsable: string;
  urgence: 'low' | 'medium' | 'high' | 'urgent';
  dateEcheance: string;
  dureeEstimee: number;
  statut: string;
  progression: number;
}

interface FiltresRecherche {
  types: string[];
  urgences: string[];
  responsables: string[];
  statuts: string[];
}

interface RechercheAvanceeTachesProps {
  tachesToutes: TacheRecherchable[]; // Toutes les tâches disponibles
  tachesDejaAjoutees: string[]; // IDs des tâches déjà dans le planning
  onAjouterTache: (tache: TacheRecherchable) => void;
  collaborateursSelectionnes: string[];
  className?: string;
}

export default function RechercheAvanceeTaches({
  tachesToutes,
  tachesDejaAjoutees,
  onAjouterTache,
  collaborateursSelectionnes,
  className = ""
}: RechercheAvanceeTachesProps) {
  // États de recherche
  const [termeRecherche, setTermeRecherche] = useState('');
  const [filtresActifs, setFiltresActifs] = useState<FiltresRecherche>({
    types: [],
    urgences: [],
    responsables: [],
    statuts: []
  });
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [limitAffichage, setLimitAffichage] = useState(6);

  // Options pour les filtres
  const optionsTypes = useMemo(() => {
    return Array.from(new Set(tachesToutes.map(t => t.type))).sort();
  }, [tachesToutes]);

  const optionsUrgences = [
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { value: 'high', label: 'Élevée', color: 'bg-orange-500' },
    { value: 'medium', label: 'Moyenne', color: 'bg-yellow-500' },
    { value: 'low', label: 'Faible', color: 'bg-green-500' }
  ];

  const optionsResponsables = useMemo(() => {
    return Array.from(new Set(tachesToutes.map(t => t.responsable))).sort();
  }, [tachesToutes]);

  const optionsStatuts = useMemo(() => {
    return Array.from(new Set(tachesToutes.map(t => t.statut))).sort();
  }, [tachesToutes]);

  // Logique de recherche avec debounce simulé
  const tachesFiltrees = useMemo(() => {
    let resultats = tachesToutes.filter(tache => {
      // Exclure les tâches déjà ajoutées au planning
      if (tachesDejaAjoutees.includes(tache.id)) return false;

      // Filtrage par collaborateurs sélectionnés
      if (!collaborateursSelectionnes.includes('all') && 
          !collaborateursSelectionnes.includes(tache.responsable)) {
        return false;
      }

      // Recherche textuelle
      const termeNormalise = termeRecherche.toLowerCase().trim();
      if (termeNormalise) {
        const correspondTexte = 
          tache.nom.toLowerCase().includes(termeNormalise) ||
          tache.clientNom.toLowerCase().includes(termeNormalise) ||
          tache.type.toLowerCase().includes(termeNormalise) ||
          tache.responsable.toLowerCase().includes(termeNormalise) ||
          tache.statut.toLowerCase().includes(termeNormalise);
        
        if (!correspondTexte) return false;
      }

      // Filtres spécifiques
      if (filtresActifs.types.length > 0 && !filtresActifs.types.includes(tache.type)) return false;
      if (filtresActifs.urgences.length > 0 && !filtresActifs.urgences.includes(tache.urgence)) return false;
      if (filtresActifs.responsables.length > 0 && !filtresActifs.responsables.includes(tache.responsable)) return false;
      if (filtresActifs.statuts.length > 0 && !filtresActifs.statuts.includes(tache.statut)) return false;

      return true;
    });

    // Tri par pertinence : urgent > échéance proche > progression faible
    resultats.sort((a, b) => {
      // Priorité 1: Urgence
      const urgenceOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const diffUrgence = urgenceOrder[b.urgence] - urgenceOrder[a.urgence];
      if (diffUrgence !== 0) return diffUrgence;

      // Priorité 2: Échéance
      const dateA = new Date(a.dateEcheance).getTime();
      const dateB = new Date(b.dateEcheance).getTime();
      const diffDate = dateA - dateB;
      if (diffDate !== 0) return diffDate;

      // Priorité 3: Progression (moins avancé en premier)
      return a.progression - b.progression;
    });

    return resultats;
  }, [tachesToutes, tachesDejaAjoutees, collaborateursSelectionnes, termeRecherche, filtresActifs]);

  // Gestion des filtres
  const toggleFiltre = useCallback((categorie: keyof FiltresRecherche, valeur: string) => {
    setFiltresActifs(prev => {
      const nouveauxFiltres = { ...prev };
      const index = nouveauxFiltres[categorie].indexOf(valeur);
      
      if (index === -1) {
        nouveauxFiltres[categorie] = [...nouveauxFiltres[categorie], valeur];
      } else {
        nouveauxFiltres[categorie] = nouveauxFiltres[categorie].filter(f => f !== valeur);
      }
      
      return nouveauxFiltres;
    });
  }, []);

  const viderFiltres = useCallback(() => {
    setFiltresActifs({
      types: [],
      urgences: [],
      responsables: [],
      statuts: []
    });
    setTermeRecherche('');
  }, []);

  // Nombre total de filtres actifs
  const nombreFiltresActifs = Object.values(filtresActifs).flat().length + (termeRecherche ? 1 : 0);

  // Rendu d'une tâche trouvée
  const renderTacheTrouvee = (tache: TacheRecherchable) => {
    const getCouleurUrgence = (urgence: string) => {
      switch (urgence) {
        case 'urgent': return 'border-l-red-500 bg-red-50';
        case 'high': return 'border-l-orange-500 bg-orange-50';
        case 'medium': return 'border-l-yellow-500 bg-yellow-50';
        default: return 'border-l-green-500 bg-green-50';
      }
    };

    const estEnRetard = new Date(tache.dateEcheance) < new Date();
    const estUrgent = tache.urgence === 'urgent' || estEnRetard;

    return (
      <div
        key={tache.id}
        className={`p-3 rounded-lg border-l-4 ${getCouleurUrgence(tache.urgence)} hover:shadow-md transition-shadow`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{tache.nom}</h4>
              <Badge variant="outline" className="text-xs shrink-0">
                {tache.type}
              </Badge>
              {estUrgent && (
                <Badge variant="destructive" className="text-xs shrink-0">
                  <Zap className="w-3 h-3 mr-1" />
                  {estEnRetard ? 'Retard' : 'Urgent'}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{tache.clientNom}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{tache.responsable}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{tache.dureeEstimee}h</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {tache.statut}
                </Badge>
                <span className="text-xs text-gray-500">
                  {tache.progression}% complété
                </span>
              </div>
            </div>
          </div>
          
          <Button
            size="sm"
            className="ml-3 shrink-0"
            onClick={() => onAjouterTache(tache)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5 text-blue-600" />
            Recherche de Tâches
            {nombreFiltresActifs > 0 && (
              <Badge variant="secondary" className="ml-2">
                {nombreFiltresActifs} filtre{nombreFiltresActifs > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {nombreFiltresActifs > 0 && (
              <Button variant="outline" size="sm" onClick={viderFiltres}>
                <X className="w-4 h-4 mr-1" />
                Vider
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAfficherFiltres(!afficherFiltres)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtres
              {afficherFiltres ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par nom, client, type, responsable..."
            value={termeRecherche}
            onChange={(e) => setTermeRecherche(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres avancés */}
        {afficherFiltres && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Types */}
            <div>
              <h5 className="font-medium text-sm mb-2">Types</h5>
              <div className="flex flex-wrap gap-2">
                {optionsTypes.map(type => (
                  <Badge
                    key={type}
                    variant={filtresActifs.types.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleFiltre('types', type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Urgences */}
            <div>
              <h5 className="font-medium text-sm mb-2">Urgences</h5>
              <div className="flex flex-wrap gap-2">
                {optionsUrgences.map(({ value, label, color }) => (
                  <Badge
                    key={value}
                    variant={filtresActifs.urgences.includes(value) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleFiltre('urgences', value)}
                  >
                    <div className={`w-2 h-2 rounded-full ${color} mr-1`}></div>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Responsables */}
            <div>
              <h5 className="font-medium text-sm mb-2">Responsables</h5>
              <div className="flex flex-wrap gap-2">
                {optionsResponsables.map(responsable => (
                  <Badge
                    key={responsable}
                    variant={filtresActifs.responsables.includes(responsable) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleFiltre('responsables', responsable)}
                  >
                    <User className="w-3 h-3 mr-1" />
                    {responsable}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Statuts */}
            <div>
              <h5 className="font-medium text-sm mb-2">Statuts</h5>
              <div className="flex flex-wrap gap-2">
                {optionsStatuts.map(statut => (
                  <Badge
                    key={statut}
                    variant={filtresActifs.statuts.includes(statut) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleFiltre('statuts', statut)}
                  >
                    {statut}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Résultats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-sm text-gray-700">
              Résultats ({tachesFiltrees.length} tâche{tachesFiltrees.length > 1 ? 's' : ''})
            </h5>
            {tachesFiltrees.length > limitAffichage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLimitAffichage(prev => prev + 6)}
              >
                Voir plus
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {tachesFiltrees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucune tâche trouvée</p>
                <p className="text-xs">
                  {nombreFiltresActifs > 0 
                    ? "Essayez de modifier vos filtres de recherche"
                    : "Commencez à taper pour rechercher des tâches"
                  }
                </p>
              </div>
            ) : (
              <>
                {tachesFiltrees.slice(0, limitAffichage).map(renderTacheTrouvee)}
                
                {tachesFiltrees.length > limitAffichage && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setLimitAffichage(prev => prev + 6)}
                    >
                      Afficher {Math.min(6, tachesFiltrees.length - limitAffichage)} tâche{Math.min(6, tachesFiltrees.length - limitAffichage) > 1 ? 's' : ''} de plus
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
