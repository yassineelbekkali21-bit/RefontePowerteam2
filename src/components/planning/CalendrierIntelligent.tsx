/**
 * Calendrier Intelligent pour la Planification Automatique
 * Aide les comptables à s'organiser avec des suggestions intelligentes
 */

import React, { useState, useMemo } from 'react';
import { usePlanning } from '@/contexts/PlanningContext';
import { TachesService } from '@/services/tachesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalendrierHebdomadaire from './CalendrierHebdomadaire';
import RechercheAvanceeTaches from './RechercheAvanceeTaches';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import {
  Calendar,
  Clock,
  Brain,
  Zap,
  Target,
  User,
  Plus,
  Settings,
  Mail,
  Users,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Timer,
  ArrowRight,
  Lightbulb,
  Bot,
  Sparkles
} from 'lucide-react';

// Interface pour les tâches suggérées par l'IA
interface TacheSuggeree {
  id: string;
  titre: string;
  type: string;
  client: string;
  dureeEstimee: number; // en heures
  priorite: 'critique' | 'haute' | 'moyenne' | 'normale';
  dateProposee: string;
  heureDebut: string;
  heureFin: string;
  motif: string; // Pourquoi l'IA suggère cette date/heure
  collaborateur: string;
  dependances?: string[];
  actions: string[];
}

// Interface pour les événements libres
interface EvenementLibre {
  id: string;
  titre: string;
  type: 'interne' | 'client' | 'formation' | 'reunion';
  date: string;
  heureDebut: string;
  heureFin: string;
  participants: string[];
  lieu?: string;
  description?: string;
  envoyerClient: boolean;
  rappel: boolean;
}

const collaborateurs = ['BRUNO', 'OLIVIER', 'SARAH', 'MARIE', 'PIERRE', 'JULIE'];

// Génération de suggestions intelligentes
const genererSuggestionsIA = (): TacheSuggeree[] => {
  const suggestions: TacheSuggeree[] = [
    {
      id: '1',
      titre: 'Finaliser TVA SARL Martin',
      type: 'TVA',
      client: 'SARL Martin & Associés',
      dureeEstimee: 2,
      priorite: 'critique',
      dateProposee: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
      heureDebut: '09:00',
      heureFin: '11:00',
      motif: 'Échéance dans 3 jours, charge compatible avec planning',
      collaborateur: 'BRUNO',
      actions: ['Vérification + Solde', 'Mail client', 'Dépôt']
    },
    {
      id: '2',
      titre: 'Démarrer IPP Dupont',
      type: 'IPP',
      client: 'Dupont Jean-Claude',
      dureeEstimee: 1.5,
      priorite: 'haute',
      dateProposee: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0],
      heureDebut: '14:00',
      heureFin: '15:30',
      motif: 'Créneaux libres après-midi, expertise IPP disponible',
      collaborateur: 'OLIVIER',
      actions: ['Production (I)']
    },
    {
      id: '3',
      titre: 'Supervision Bilan TechnoVision',
      type: 'CLOTURE',
      client: 'SAS TechnoVision',
      dureeEstimee: 3,
      priorite: 'moyenne',
      dateProposee: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
      heureDebut: '08:30',
      heureFin: '11:30',
      motif: 'Bilan complexe, matinée recommandée pour concentration',
      collaborateur: 'MARIE',
      dependances: ['Historiques 08 BI2'],
      actions: ['Supervision 13 VA2', 'Présentation client']
    },
    {
      id: '4',
      titre: 'Mise à jour Compta Innovation',
      type: 'SITUATION_INTERMEDIAIRE',
      client: 'EURL Innovation Plus',
      dureeEstimee: 1,
      priorite: 'normale',
      dateProposee: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
      heureDebut: '16:00',
      heureFin: '17:00',
      motif: 'Tâche courte pour fin de journée, pas de dépendances',
      collaborateur: 'SARAH',
      actions: ['Mise à jour compta 04']
    }
  ];

  return suggestions;
};

// Génération d'événements de démonstration
const genererEvenementsLibres = (): EvenementLibre[] => [
  {
    id: '1',
    titre: 'Formation Nouvelle Réglementation TVA',
    type: 'formation',
    date: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    heureDebut: '09:00',
    heureFin: '12:00',
    participants: ['BRUNO', 'OLIVIER', 'MARIE'],
    lieu: 'Salle de formation',
    description: 'Formation sur les nouvelles règles TVA 2024',
    envoyerClient: false,
    rappel: true
  },
  {
    id: '2',
    titre: 'Réunion Bilan Trimestriel',
    type: 'reunion',
    date: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
    heureDebut: '14:00',
    heureFin: '16:00',
    participants: ['TOUS'],
    lieu: 'Bureau direction',
    description: 'Point trimestriel équipe',
    envoyerClient: false,
    rappel: true
  },
  {
    id: '3',
    titre: 'Présentation Bilan - SAS TechnoVision',
    type: 'client',
    date: new Date(Date.now() + 12*24*60*60*1000).toISOString().split('T')[0],
    heureDebut: '10:00',
    heureFin: '11:30',
    participants: ['MARIE'],
    lieu: 'Chez le client',
    description: 'Présentation du bilan annuel 2023',
    envoyerClient: true,
    rappel: true
  }
];

export default function CalendrierIntelligent() {
  // Contexte de planification
  const { tachesPlanifiees, evenementsPlanifies, ajouterTaches, ajouterEvenements, supprimerTache, viderPlanning } = usePlanning();
  
  const [suggestions] = useState<TacheSuggeree[]>(genererSuggestionsIA());
  const [evenements] = useState<EvenementLibre[]>(genererEvenementsLibres());
  const [collaborateurSelectionne, setCollaborateurSelectionne] = useState('all');
  const [modeAffichage, setModeAffichage] = useState<'taches' | 'evenements' | 'calendrier'>('taches');
  const [modeIntelligent, setModeIntelligent] = useState(true);

  // Service des tâches et données complètes
  const tachesService = useMemo(() => TachesService.getInstance(), []);
  const toutesLesTaches = useMemo(() => tachesService.genererTachesTest(), [tachesService]);

  // Génération de suggestions intelligentes basées sur les tâches urgentes non planifiées
  const suggestionsIntelligentes = useMemo(() => {
    // IDs des tâches déjà planifiées
    const tachesDejaPlanifeesIds = new Set(tachesPlanifiees.map(t => t.id));
    
    // Générer des suggestions basées sur des tâches urgentes fictives
    const suggestionsBase: TacheSuggeree[] = [
      {
        id: 'sugg-1',
        titre: 'TVA SARL Dupont - Échéance critique',
        type: 'TVA',
        client: 'SARL Dupont & Fils',
        dureeEstimee: 1.5,
        priorite: 'critique',
        dateProposee: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
        heureDebut: '09:00',
        heureFin: '10:30',
        motif: 'Échéance dans 2 jours, risque de pénalités',
        collaborateur: 'BRUNO',
        actions: ['Vérification', 'Dépôt urgent']
      },
      {
        id: 'sugg-2',
        titre: 'IPP Martin - Retard détecté',
        type: 'IPP',
        client: 'Martin Jean-Pierre',
        dureeEstimee: 2,
        priorite: 'haute',
        dateProposee: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
        heureDebut: '14:00',
        heureFin: '16:00',
        motif: 'Déjà 3 jours de retard, client prioritaire',
        collaborateur: 'OLIVIER',
        actions: ['Production (I)', 'Validation']
      },
      {
        id: 'sugg-3',
        titre: 'Clôture SAS Innovation - Planification optimale',
        type: 'CLOTURE',
        client: 'SAS Innovation Tech',
        dureeEstimee: 4,
        priorite: 'moyenne',
        dateProposee: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0],
        heureDebut: '08:00',
        heureFin: '12:00',
        motif: 'Créneaux matinaux libres, dossier complexe',
        collaborateur: 'MARIE',
        actions: ['Supervision', 'Révision', 'Présentation']
      }
    ];

    // Filtrer les suggestions qui ne sont pas déjà planifiées
    const suggestionsNonPlanifiees = suggestionsBase.filter(s => !tachesDejaPlanifeesIds.has(s.id));
    
    // Filtrer par collaborateur si nécessaire
    if (collaborateurSelectionne === 'all') return suggestionsNonPlanifiees;
    return suggestionsNonPlanifiees.filter(s => s.collaborateur === collaborateurSelectionne);
  }, [tachesPlanifiees, collaborateurSelectionne]);

  // Garder l'ancien système pour compatibilité
  const suggestionsFiltrees = suggestionsIntelligentes;

  // Statistiques intelligentes
  const statsIA = useMemo(() => {
    const totalSuggestions = suggestionsFiltrees.length;
    const critiques = suggestionsFiltrees.filter(s => s.priorite === 'critique').length;
    const chargeTotal = suggestionsFiltrees.reduce((acc, s) => acc + s.dureeEstimee, 0);
    const prochaine24h = suggestionsFiltrees.filter(s => {
      const demain = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
      return s.dateProposee <= demain;
    }).length;

    return { totalSuggestions, critiques, chargeTotal, prochaine24h };
  }, [suggestionsFiltrees]);

  // Couleurs par priorité
  const getCouleurPriorite = (priorite: string) => {
    switch (priorite) {
      case 'critique': return 'border-red-500 bg-red-50 text-red-700';
      case 'haute': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'moyenne': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  // Fonction pour ajouter une suggestion aux tâches planifiées
  const ajouterSuggestionAuPlanning = (suggestion: TacheSuggeree) => {
    const nouvelleTache = {
      id: suggestion.id,
      nom: suggestion.titre,
      type: suggestion.type,
      clientNom: suggestion.client,
      dateEcheance: suggestion.dateProposee,
      responsable: suggestion.collaborateur,
      etapeActuelle: suggestion.actions[0] || 'À démarrer',
      urgence: suggestion.priorite === 'critique' ? 'urgent' as const : 
               suggestion.priorite === 'haute' ? 'high' as const :
               suggestion.priorite === 'moyenne' ? 'medium' as const : 'low' as const,
      dateAjout: new Date().toISOString(),
      dureeEstimee: suggestion.dureeEstimee
    };

    ajouterTaches([nouvelleTache]);
  };

  // Fonction pour calculer la durée d'un événement
  const calculerDureeEvenement = (heureDebut: string, heureFin: string): number => {
    const [heureD, minuteD] = heureDebut.split(':').map(Number);
    const [heureF, minuteF] = heureFin.split(':').map(Number);
    
    const minutesDebut = heureD * 60 + minuteD;
    const minutesFin = heureF * 60 + minuteF;
    
    return (minutesFin - minutesDebut) / 60; // Retourne en heures
  };

  // Fonction pour ajouter un événement au planning
  const ajouterEvenementAuPlanning = (evenement: EvenementLibre) => {
    const nouvelEvenement = {
      id: evenement.id,
      titre: evenement.titre,
      type: evenement.type,
      date: evenement.date,
      heureDebut: evenement.heureDebut,
      heureFin: evenement.heureFin,
      participants: evenement.participants,
      lieu: evenement.lieu,
      description: evenement.description,
      dureeEstimee: calculerDureeEvenement(evenement.heureDebut, evenement.heureFin)
    };

    ajouterEvenements([nouvelEvenement]);
  };

  // Fonction pour ajouter une tâche trouvée par la recherche au planning
  const ajouterTacheDepuisRecherche = (tache: any) => {
    const nouvelleTachePlanifiee = {
      id: tache.id,
      nom: tache.nom,
      type: tache.type,
      clientNom: tache.clientNom,
      dateEcheance: tache.dateEcheance,
      responsable: tache.responsable,
      etapeActuelle: tache.etapeActuelle || 'En cours',
      urgence: tache.urgence,
      dateAjout: new Date().toISOString(),
      dureeEstimee: tache.dureeEstimee
    };

    ajouterTaches([nouvelleTachePlanifiee]);
  };

  // Rendu d'une suggestion IA
  const renderSuggestion = (suggestion: TacheSuggeree) => (
    <Card key={suggestion.id} className={`border-l-4 ${getCouleurPriorite(suggestion.priorite)} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Bot className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{suggestion.titre}</h3>
                <Badge variant="outline" className="text-xs">{suggestion.type}</Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{suggestion.client}</p>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(suggestion.dateProposee).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {suggestion.heureDebut} - {suggestion.heureFin}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {suggestion.dureeEstimee}h
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {suggestion.collaborateur}
                </span>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3 h-3" />
                  <span className="font-medium">Suggestion IA :</span>
                </div>
                {suggestion.motif}
              </div>

              <div className="flex flex-wrap gap-1">
                {suggestion.actions.map((action, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Badge className={`text-xs ${getCouleurPriorite(suggestion.priorite)}`}>
              {suggestion.priorite === 'critique' ? '🚨 Critique' :
               suggestion.priorite === 'haute' ? '⚡ Haute' :
               suggestion.priorite === 'moyenne' ? '⏳ Moyenne' : '📋 Normale'}
            </Badge>
            
            <Button 
              size="sm" 
              className="text-xs h-6 px-2 bg-green-600 hover:bg-green-700"
              onClick={() => ajouterSuggestionAuPlanning(suggestion)}
            >
              ✅ Accepter
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-6 px-2">
              ⏰ Reporter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Rendu d'une tâche planifiée
  const renderTachePlanifiee = (tache: any) => {
    const getCouleurUrgence = (urgence: string) => {
      switch (urgence) {
        case 'urgent': return 'border-red-500 bg-red-50';
        case 'high': return 'border-orange-500 bg-orange-50';
        case 'medium': return 'border-yellow-500 bg-yellow-50';
        default: return 'border-gray-500 bg-gray-50';
      }
    };

    return (
      <Card key={tache.id} className={`border-l-4 ${getCouleurUrgence(tache.urgence)} transition-all hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CheckCircle className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{tache.nom}</h3>
                  <Badge variant="outline" className="text-xs">{tache.type}</Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{tache.clientNom}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Échéance: {new Date(tache.dateEcheance).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {tache.responsable}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Ajouté: {new Date(tache.dateAjout).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-700 mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3" />
                    <span className="font-medium">Étape actuelle :</span>
                  </div>
                  {tache.etapeActuelle}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Badge className={`text-xs ${getCouleurUrgence(tache.urgence)}`}>
                {tache.urgence === 'urgent' ? '🚨 Urgent' :
                 tache.urgence === 'high' ? '⚡ Haute' :
                 tache.urgence === 'medium' ? '⏳ Moyenne' : '📋 Normale'}
              </Badge>
              
              <Button 
                size="sm" 
                className="text-xs h-6 px-2 bg-green-600 hover:bg-green-700"
              >
                📅 Planifier
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                onClick={() => supprimerTache(tache.id)}
              >
                🗑️ Retirer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Rendu d'un événement libre
  const renderEvenement = (evenement: EvenementLibre) => (
    <Card key={evenement.id} className="border-l-4 border-l-purple-400 bg-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
              {evenement.type === 'client' ? <Users className="w-4 h-4" /> :
               evenement.type === 'formation' ? <Target className="w-4 h-4" /> :
               <Calendar className="w-4 h-4" />}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{evenement.titre}</h3>
                <Badge variant="outline" className="text-xs capitalize">{evenement.type}</Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(evenement.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {evenement.heureDebut} - {evenement.heureFin}
                </span>
                {evenement.lieu && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {evenement.lieu}
                  </span>
                )}
              </div>

              {evenement.description && (
                <p className="text-xs text-gray-600 mb-2">{evenement.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Participants:</span>
                {evenement.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {participant}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {evenement.envoyerClient && (
              <Badge className="text-xs bg-green-100 text-green-800">
                <Mail className="w-3 h-3 mr-1" />
                Client
              </Badge>
            )}
            {evenement.rappel && (
              <Badge variant="outline" className="text-xs">
                🔔 Rappel
              </Badge>
            )}
            <Button 
              size="sm" 
              className="text-xs h-6 px-2 bg-purple-600 hover:bg-purple-700 mr-1"
              onClick={() => ajouterEvenementAuPlanning(evenement)}
            >
              📅 Ajouter
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-6 px-2">
              ✏️ Modifier
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête Planification Intelligente */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border border-purple-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Planification Intelligente</h1>
              <p className="text-gray-600">IA qui aide les comptables à s'organiser efficacement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              IA Activée
            </Badge>
            <Switch checked={modeIntelligent} onCheckedChange={setModeIntelligent} />
          </div>
        </div>
      </div>

      {/* Navigation des modes */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 w-fit">
        <Button
          size="sm"
          variant={modeAffichage === 'taches' ? 'default' : 'ghost'}
          onClick={() => setModeAffichage('taches')}
          className="gap-2"
        >
          <Brain className="w-4 h-4" />
          Tâches à Planifier
          {tachesPlanifiees.length > 0 && (
            <Badge className="ml-1 bg-indigo-500 text-white text-xs">
              {tachesPlanifiees.length}
            </Badge>
          )}
        </Button>
        <Button
          size="sm"
          variant={modeAffichage === 'evenements' ? 'default' : 'ghost'}
          onClick={() => setModeAffichage('evenements')}
          className="gap-2"
        >
          <Calendar className="w-4 h-4" />
          Événements
        </Button>
        <Button
          size="sm"
          variant={modeAffichage === 'calendrier' ? 'default' : 'ghost'}
          onClick={() => setModeAffichage('calendrier')}
          className="gap-2"
        >
          <Target className="w-4 h-4" />
          Vue Calendrier
        </Button>
      </div>

      {/* Statistiques IA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Suggestions</p>
                <p className="text-xl font-bold text-blue-900">{statsIA.totalSuggestions}</p>
              </div>
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Critiques</p>
                <p className="text-xl font-bold text-red-900">{statsIA.critiques}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Charge Total</p>
                <p className="text-xl font-bold text-green-900">{statsIA.chargeTotal}h</p>
              </div>
              <Timer className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Prochaines 24h</p>
                <p className="text-xl font-bold text-orange-900">{statsIA.prochaine24h}</p>
              </div>
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtre collaborateur pour tâches à planifier */}
      {modeAffichage === 'taches' && (
        <div className="flex items-center gap-4">
          <Select value={collaborateurSelectionne} onValueChange={setCollaborateurSelectionne}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Collaborateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les collaborateurs</SelectItem>
              {collaborateurs.map(collab => (
                <SelectItem key={collab} value={collab}>{collab}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Créer Événement
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configurer IA
          </Button>
        </div>
      )}

      {/* Contenu selon le mode */}
      <div className="space-y-4">
        {modeAffichage === 'taches' && (
          <div className="space-y-8">
            {/* Section 1: Tâches Ajoutées au Planning IA */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Tâches Ajoutées au Planning IA</h2>
                    <p className="text-sm text-gray-600">Tâches sélectionnées depuis les échéances</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {tachesPlanifiees.length} tâches ajoutées
                  </Badge>
                  {tachesPlanifiees.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={viderPlanning}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️ Vider tout
                    </Button>
                  )}
                </div>
              </div>
              
              {tachesPlanifiees.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-600 mb-2">Aucune tâche ajoutée</h3>
                    <p className="text-sm text-gray-500">
                      Sélectionnez des tâches depuis l'onglet "Échéances" → Vue Individuelle
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {tachesPlanifiees.map(renderTachePlanifiee)}
                </div>
              )}
            </div>

            {/* Séparateur */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 px-4 text-gray-500 font-medium">Suggestions Complémentaires</span>
              </div>
            </div>

            {/* Section 2: Suggestions Intelligentes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Suggestions Intelligentes</h2>
                    <p className="text-sm text-gray-600">
                      Tâches urgentes détectées automatiquement par l'IA
                      {collaborateurSelectionne !== 'all' && ` pour ${collaborateurSelectionne}`}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {suggestionsFiltrees.length} suggestions
                </Badge>
              </div>
              
              {suggestionsFiltrees.length === 0 ? (
                <Card className="border-dashed border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-8 text-center">
                    <Bot className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-blue-700 mb-2">Aucune suggestion</h3>
                    <p className="text-sm text-blue-600">L'IA analyse votre charge de travail...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {suggestionsFiltrees.map(renderSuggestion)}
                </div>
              )}
            </div>

            {/* Section 3: Recherche Avancée de Tâches */}
            <div className="space-y-4">
              <RechercheAvanceeTaches
                tachesToutes={toutesLesTaches}
                tachesDejaAjoutees={tachesPlanifiees.map(t => t.id)}
                onAjouterTache={ajouterTacheDepuisRecherche}
                collaborateursSelectionnes={collaborateurSelectionne === 'all' ? ['all'] : [collaborateurSelectionne]}
              />
            </div>
          </div>
        )}

        {modeAffichage === 'evenements' && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Événements et Réunions</h2>
              <Badge variant="secondary">{evenements.length} événements</Badge>
            </div>
            
            <div className="grid gap-4">
              {evenements.map(renderEvenement)}
            </div>
          </>
        )}

        {modeAffichage === 'calendrier' && (
          <CalendrierHebdomadaire />
        )}
      </div>
    </div>
  );
}
