import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { GitCompareArrows, FileText, Save, RotateCcw } from 'lucide-react';

type Feature = {
  name: string;
  v1: boolean | null;
  v2: boolean | null;
  comment?: string;
};

type Module = {
  name: string;
  features: Feature[];
};

const modulesData: Module[] = [
  {
    name: "Dashboard (Vue d'ensemble)",
    features: [
      { name: "Affichage adaptatif Manager vs Collaborateur - Interface qui s'adapte selon le rôle (manager voit tous les clients, collaborateur voit ses clients)", v1: true, v2: true, comment: "Adaptatif" },
      { name: "KPIs principaux temps réel - Affichage des métriques clés (nombre de clients, CA, échéances urgentes) avec mise à jour automatique", v1: true, v2: true },
      { name: "Bloc Clients - Nombre total, nouveaux entrants, CA entrants/sortants avec navigation directe vers le module Clients", v1: true, v2: true },
      { name: "Bloc Échéances & Planning - Échéances à planifier, en cours, en retard avec redirection vers Production", v1: true, v2: true },
      { name: "Bloc Plans en attente - Compteur des plans de correction en attente de traitement avec accès direct au module Développement", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Bloc Prestations & Timesheet - Pourcentage de complétion des timesheets avec accès au module Prestations", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Bloc Congés & RH - Solde de congés restants, prochain congé personnel, congés équipe, jours fériés", v1: true, v2: true },
      { name: "Bloc Clients suspects - Compteur de clients nécessitant une attention (Finance) avec redirection vers analyse financière", v1: true, v2: true },
      { name: "Bloc CA vs Budget - Suivi du chiffre d'affaires réalisé vs budgété avec barre de progression", v1: true, v2: true },
      { name: "Bloc Capacité Planning - Pourcentage d'utilisation de l'équipe avec indicateur optimal/disponible", v1: true, v2: true },
      { name: "Bloc DEG Assistant - Accès rapide au chat intelligent avec bouton 'Démarrer chat'", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Bloc Meeting Builder - Construction de réunions et présentations avec accès aux outils de création", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Bloc Supervision - Sessions de supervision, formations IA avec accès au module Développement", v1: false, v2: true, comment: "Amélioré (V2)" },
    ],
  },
  {
    name: "Finance",
    features: [
      { name: "Vue d'ensemble financière - Dashboard avec KPIs financiers globaux, tendances et alertes", v1: true, v2: true },
      { name: "Analyse Financière Intelligente - Diagnostic automatique des clients avec cartes interactives et recommandations d'actions", v1: true, v2: true, comment: "Refonte UI/UX" },
      { name: "Cartes de diagnostic client - Dette prestation, rentabilité faible, sous-facturation, crédit prestation, équilibre financier", v1: true, v2: true },
      { name: "Filtres avancés - Sélection par période (mensuel, trimestriel, annuel), collaborateur, statut client", v1: true, v2: true },
      { name: "Gestion des Budgets - Module séparé pour budgets horaires (en heures) et budgets économiques (en euros)", v1: true, v2: true, comment: "Séparation Heures/€" },
      { name: "Suivi CA vs Budgété - Comparaison temps réel du chiffre d'affaires avec objectifs et projections", v1: true, v2: true },
      { name: "Navigation vers détail client - Accès direct à la fiche client depuis les analyses pour actions correctives", v1: true, v2: true },
      { name: "Configuration des règles d'analyse - Paramétrage des seuils et critères de diagnostic financier", v1: false, v2: true, comment: "Nouveau (V2)" },
    ],
  },
  {
    name: "Clients",
    features: [
      { name: "Liste clients avec recherche - Table complète avec filtres par nom, statut, rentabilité, type de client", v1: true, v2: true },
      { name: "Page détail client complète - Fiche client avec informations, contacts, historique, analyses financières", v1: true, v2: true },
      { name: "KPIs client temps réel - CA, rentabilité, heures prestées/budgétées, facturation, tendances mensuelles", v1: true, v2: true },
      { name: "Analyse budgétaire intégrée - Comparaison heures/budget, dépassements, sous-utilisation avec graphiques", v1: true, v2: true },
      { name: "Révision de forfaits - Interface de gestion et révision des forfaits clients avec historique des modifications", v1: true, v2: true, comment: "Amélioré (V2)" },
      { name: "Module recouvrement Recovr - Intégration avec plateforme Recovr pour gestion automatisée des impayés et relances", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Suivi avancement des tâches - Dashboard temps réel de progression des missions et échéances par client", v1: true, v2: true, comment: "Amélioré (V2)" },
      { name: "Gestion des encours - Suivi détaillé des factures en cours, délais de paiement, relances automatiques", v1: true, v2: true },
      { name: "Tracker activités multi-modules - Centralisation de toutes les activités client (Finance, RH, Production, Prestations)", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Capacity Planning avancé - Simulateur d'attribution avec analyse de charge et recommandations d'assignation", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Suivi des portefeuilles - Gestion et analytics des portefeuilles clients par collaborateur avec KPIs de performance", v1: true, v2: true, comment: "Amélioré (V2)" },
      { name: "Création plans de correction - Outil de génération de plans d'action basés sur les diagnostics financiers", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Historique actions et plans - Journal chronologique de toutes les actions menées sur le client", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Gestion contacts et infos - CRUD complet des informations client, contacts, coordonnées", v1: true, v2: true },
    ],
  },
  {
    name: "Production & Planning",
    features: [
      { name: "Suivi échéances réglementaires - TVA, ISOC, IPP, bilans avec dates limites et statuts", v1: true, v2: true },
      { name: "Calendrier production visuel - Vue mensuelle/hebdomadaire des tâches et échéances par collaborateur", v1: true, v2: true },
      { name: "Assignation tâches intelligente - Attribution automatique ou manuelle basée sur la charge et compétences", v1: true, v2: true },
      { name: "Dashboard charge de travail - Vue temps réel de la capacité de chaque collaborateur et de l'équipe", v1: true, v2: true },
      { name: "Workflow de statuts - Gestion des états 'à planifier', 'en cours', 'en retard', 'terminé' avec notifications", v1: true, v2: true },
    ],
  },
  {
    name: "Humain (RH)",
    features: [
      { name: "Dashboard RH complet - Vue d'ensemble équipe, congés, formations, évaluations, indicateurs RH", v1: true, v2: true },
      { name: "Processus demande de congé - Formulaire, validation workflow, notification, mise à jour automatique soldes", v1: true, v2: true, comment: "À fiabiliser" },
      { name: "Validation congés managers - Interface dédiée pour approuver/refuser avec historique et commentaires", v1: true, v2: true },
      { name: "Suivi soldes temps réel - CP, RTT, récupération avec calcul automatique et projections", v1: true, v2: true },
      { name: "Calendrier absences équipe - Vue consolidated des congés, formations, absences maladie de tous les collaborateurs", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Assistant décision validation - IA suggérant l'approbation/refus basée sur charge équipe et planning", v1: false, v2: true, comment: "Nouveau (V2)" },
    ],
  },
  {
    name: "Développement",
    features: [
      { name: "Gestion plans de correction - Centralisation des plans créés depuis les fiches clients avec suivi d'avancement", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Module Supervision intégré - Sessions de contrôle qualité avec observations, captures, annotations", v1: false, v2: true, comment: "Refonte majeure" },
      { name: "Création sessions supervision - Workflow complet de paramétrage et lancement de sessions de contrôle", v1: false, v2: true },
      { name: "Interface observations + captures - Saisie libre d'observations texte avec upload et annotation d'images", v1: false, v2: true },
      { name: "Outil annotation images - Surlignage jaune et contours rouges directement sur les captures d'écran", v1: false, v2: true },
      { name: "Rapports supervision avancés - Analytics des erreurs, performance par collaborateur, recommandations formation", v1: false, v2: true },
    ],
  },
  {
    name: "Prestations",
    features: [
      { name: "Dashboard analytics prestations - Vue d'ensemble des prestations avec KPIs de performance", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Vue hiérarchique 3 niveaux - Navigation Client > Collaborateur > Prestation avec drill-down", v1: false, v2: true },
      { name: "Filtres multi-critères - Filtrage par période, client, collaborateur, type de prestation", v1: false, v2: true },
      { name: "KPIs horaires détaillés - Heures attendues, facturables, non-facturables, taux de complétion", v1: false, v2: true },
      { name: "Suivi complétion Timesheets - Pourcentage de remplissage des feuilles de temps par collaborateur/période", v1: true, v2: true, comment: "Amélioré" },
      { name: "Suivi prestations OAM - Module spécialisé pour suivi et facturation des prestations Ordre des Avocats avec tarification spécifique", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Introduction Timesheet - Interface d'onboarding et formation pour la saisie des feuilles de temps par les collaborateurs", v1: false, v2: true, comment: "Nouveau (V2)" },
    ],
  },
  {
    name: "Meeting Builder",
    features: [
      { name: "Bibliothèque slides - Collection de modèles de diapositives pré-conçues par thématiques", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Constructeur présentations - Interface drag & drop pour assembler des présentations personnalisées", v1: false, v2: true },
      { name: "Mode prévisualisation - Aperçu temps réel des présentations avec navigation entre slides", v1: false, v2: true },
      { name: "Stockage centralisé - Sauvegarde et partage des présentations créées au niveau équipe", v1: false, v2: true },
    ],
  },
  {
    name: "DEG Assistant",
    features: [
      { name: "Interface chat intelligente - Conversation naturelle avec réponses contextuelles sur l'activité", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Widget flottant global - Accès permanent depuis toutes les pages avec interface minimisable", v1: false, v2: true },
      { name: "Logique réponse métier - Compréhension des questions sur échéances, TVA, planning, clients", v1: false, v2: true },
      { name: "Actions interactives - Boutons d'action directe depuis les réponses (ouvrir modals, rediriger)", v1: false, v2: true },
      { name: "Module emails TVA - Modal complet de préparation et envoi de rappels TVA aux clients", v1: false, v2: true },
    ],
  },
  {
    name: "Utilitaires",
    features: [
      { name: "Paramètres système - Configuration globale de l'application et préférences utilisateur", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Gestion accès et rôles - Attribution et configuration des permissions par rôle (SuperAdmin, Admin, Partner, etc.)", v1: false, v2: true },
      { name: "Configuration collaborateurs - Paramétrage détaillé (taux horaire, capacité, équipe, permissions)", v1: false, v2: true },
      { name: "Centre d'aide intégré - Documentation interactive avec guides d'utilisation par module", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Synchronisation données - Interface de gestion des imports/exports et connexions API externes", v1: false, v2: true, comment: "Nouveau (V2)" },
      { name: "Système notifications - Alertes temps réel, historique, paramétrage des préférences de notification", v1: true, v2: true },
      { name: "Outil comparatif V1/V2 - Tableau de bord de migration avec checkboxes configurables (cette page)", v1: false, v2: true, comment: "Nouveau (V2)" },
    ],
  },
];

const BasculementPage: React.FC = () => {
  const [data, setData] = useState<Module[]>(modulesData);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFeatureChange = (moduleIndex: number, featureIndex: number, field: 'v1' | 'v2', value: boolean) => {
    const newData = [...data];
    newData[moduleIndex].features[featureIndex][field] = value;
    setData(newData);
    setHasChanges(true);
  };

  const saveChanges = () => {
    localStorage.setItem('basculement-data', JSON.stringify(data));
    setHasChanges(false);
    alert('Modifications sauvegardées !');
  };

  const resetToOriginal = () => {
    setData(modulesData);
    setHasChanges(false);
    localStorage.removeItem('basculement-data');
  };

  useEffect(() => {
    const savedData = localStorage.getItem('basculement-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Vérifier si les données sauvegardées ont le même nombre de fonctionnalités
        // Si non, utiliser les nouvelles données par défaut
        const savedFeatureCount = parsedData.reduce((total, module) => total + module.features.length, 0);
        const defaultFeatureCount = modulesData.reduce((total, module) => total + module.features.length, 0);
        
        if (savedFeatureCount === defaultFeatureCount) {
          setData(parsedData);
        } else {
          console.log('Nouvelles fonctionnalités détectées, utilisation des données mises à jour');
          // Garder les nouvelles données par défaut
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  return (
    <div>
      <PageHeader
        title="Basculement V1 → V2"
        description="Tableau comparatif des fonctionnalités entre la V1 (existant) et la V2 (en développement)."
        icon={GitCompareArrows}
      />

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Modifications non sauvegardées
              </Badge>
            )}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {data.reduce((total, module) => total + module.features.length, 0)} fonctionnalités
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={resetToOriginal}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Voir nouvelles fonctionnalités</span>
            </Button>
            <Button 
              onClick={saveChanges}
              disabled={!hasChanges}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((module, moduleIndex) => (
            <Card key={module.name}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>{module.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-2/4">Fonctionnalité</TableHead>
                      <TableHead className="text-center">V1 (Existant)</TableHead>
                      <TableHead className="text-center">V2 (Nouvelle/Améliorée)</TableHead>
                      <TableHead>Commentaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {module.features.map((feature, featureIndex) => (
                      <TableRow key={feature.name} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>
                          {feature.v1 !== null && (
                            <div className="flex items-center justify-center">
                              <Checkbox 
                                checked={feature.v1} 
                                onCheckedChange={(checked) => 
                                  handleFeatureChange(moduleIndex, featureIndex, 'v1', checked as boolean)
                                }
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {feature.v2 !== null && (
                            <div className="flex items-center justify-center">
                              <Checkbox 
                                checked={feature.v2} 
                                onCheckedChange={(checked) => 
                                  handleFeatureChange(moduleIndex, featureIndex, 'v2', checked as boolean)
                                }
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {feature.comment && <Badge variant="outline">{feature.comment}</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ce tableau vous permet de suivre l'avancement de votre migration V1 → V2. 
                Cochez/décochez les cases selon l'état réel de vos fonctionnalités.
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                <li><span className="font-bold">V1 (Existant) :</span> Fonctionnalité présente dans l'ancienne version.</li>
                <li><span className="font-bold">V2 (Nouvelle/Améliorée) :</span> Fonctionnalité nouvelle ou significativement refactorisée dans la V2.</li>
                <li><span className="font-bold">Sauvegarde :</span> Vos modifications sont sauvegardées dans le navigateur.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasculementPage;
