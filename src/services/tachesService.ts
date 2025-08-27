/**
 * Service pour gérer toutes les tâches disponibles dans l'application
 */

interface TacheComplete {
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
  dateCreation: string;
  description?: string;
  budget?: number;
  etapeActuelle?: string;
}

export class TachesService {
  private static instance: TachesService;

  static getInstance(): TachesService {
    if (!TachesService.instance) {
      TachesService.instance = new TachesService();
    }
    return TachesService.instance;
  }

  /**
   * Génère un ensemble diversifié de tâches pour les tests
   */
  genererTachesTest(): TacheComplete[] {
    const clients = [
      'SARL Dupont', 'SAS Martin', 'EURL Tech Solutions', 'SA Innovations',
      'SASU Digital', 'SARL Consulting', 'SNC Partenaires', 'EIRL Freelance',
      'SA Industrie', 'SARL Commerce', 'SAS Services', 'EURL Créative',
      'SASU StartUp', 'SARL Famille', 'SNC Associés', 'SA Holdings'
    ];

    const types = [
      'TVA', 'ISOC', 'IPP', 'CLÔTURE', 'SITUATION INTERMÉDIAIRE', 
      'VERSEMENTS ANTICIPÉS', 'COMPLÉMENTAIRE', 'AUDIT', 'CONSEIL'
    ];

    const responsables = ['BRUNO', 'MARIE', 'PAUL', 'SOPHIE', 'ALEX', 'JULIE'];

    const statuts = [
      'À commencer', 'En cours', 'En attente client', 'En révision', 
      'Terminé', 'Suspendu', 'Annulé'
    ];

    const taches: TacheComplete[] = [];

    // Générer 150 tâches diversifiées
    for (let i = 1; i <= 150; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const responsable = responsables[Math.floor(Math.random() * responsables.length)];
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      
      // Logique d'urgence basée sur la date d'échéance et le statut
      const joursAvantEcheance = Math.floor(Math.random() * 60) - 10; // -10 à +50 jours
      const dateEcheance = new Date();
      dateEcheance.setDate(dateEcheance.getDate() + joursAvantEcheance);

      let urgence: 'low' | 'medium' | 'high' | 'urgent';
      if (joursAvantEcheance < 0) {
        urgence = 'urgent'; // En retard
      } else if (joursAvantEcheance < 5) {
        urgence = 'high'; // Moins de 5 jours
      } else if (joursAvantEcheance < 15) {
        urgence = 'medium'; // Moins de 15 jours
      } else {
        urgence = 'low'; // Plus de 15 jours
      }

      // Progression basée sur le statut
      let progression: number;
      switch (statut) {
        case 'À commencer': progression = 0; break;
        case 'En cours': progression = Math.floor(Math.random() * 70) + 10; break;
        case 'En attente client': progression = Math.floor(Math.random() * 50) + 30; break;
        case 'En révision': progression = Math.floor(Math.random() * 20) + 80; break;
        case 'Terminé': progression = 100; break;
        case 'Suspendu': progression = Math.floor(Math.random() * 60) + 10; break;
        case 'Annulé': progression = Math.floor(Math.random() * 30); break;
        default: progression = Math.floor(Math.random() * 100);
      }

      // Durée estimée basée sur le type
      const dureeEstimee = this.getDureeEstimeeParType(type);

      // Date de création (entre 1 et 90 jours dans le passé)
      const dateCreation = new Date();
      dateCreation.setDate(dateCreation.getDate() - Math.floor(Math.random() * 90) - 1);

      const tache: TacheComplete = {
        id: `tache-${i.toString().padStart(3, '0')}`,
        nom: this.genererNomTache(type, client),
        clientNom: client,
        type,
        responsable,
        urgence,
        dateEcheance: dateEcheance.toISOString().split('T')[0],
        dureeEstimee,
        statut,
        progression,
        dateCreation: dateCreation.toISOString().split('T')[0],
        description: this.genererDescription(type, client),
        budget: this.calculerBudget(type, dureeEstimee),
        etapeActuelle: this.getEtapeActuelle(type, progression)
      };

      taches.push(tache);
    }

    return taches.sort((a, b) => {
      // Tri par urgence puis par échéance
      const urgenceOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const diffUrgence = urgenceOrder[b.urgence] - urgenceOrder[a.urgence];
      if (diffUrgence !== 0) return diffUrgence;

      return new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime();
    });
  }

  /**
   * Génère un nom de tâche réaliste
   */
  private genererNomTache(type: string, client: string): string {
    const templates = {
      'TVA': [`Déclaration TVA ${client}`, `TVA trimestrielle ${client}`, `Régularisation TVA ${client}`],
      'ISOC': [`Déclaration ISOC ${client}`, `Impôt société ${client}`, `ISOC exercice ${client}`],
      'IPP': [`Déclaration IPP ${client}`, `Impôt personne physique ${client}`, `IPP dirigeant ${client}`],
      'CLÔTURE': [`Clôture comptable ${client}`, `Arrêté des comptes ${client}`, `Clôture exercice ${client}`],
      'SITUATION INTERMÉDIAIRE': [`Situation intermédiaire ${client}`, `Bilan provisoire ${client}`, `États financiers ${client}`],
      'VERSEMENTS ANTICIPÉS': [`Versements anticipés ${client}`, `Acomptes ${client}`, `Provisions ${client}`],
      'COMPLÉMENTAIRE': [`Mission complémentaire ${client}`, `Prestation hors forfait ${client}`, `Conseil spécialisé ${client}`],
      'AUDIT': [`Audit comptable ${client}`, `Révision ${client}`, `Contrôle ${client}`],
      'CONSEIL': [`Conseil fiscal ${client}`, `Accompagnement ${client}`, `Expertise ${client}`]
    };

    const options = templates[type as keyof typeof templates] || [`Tâche ${type} ${client}`];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Génère une description pour la tâche
   */
  private genererDescription(type: string, client: string): string {
    const descriptions = {
      'TVA': `Préparation et dépôt de la déclaration de TVA pour ${client}. Vérification des factures et calcul de la TVA due.`,
      'ISOC': `Établissement de la déclaration d'impôt des sociétés pour ${client}. Calcul du résultat fiscal et optimisations.`,
      'IPP': `Déclaration d'impôt des personnes physiques pour les dirigeants de ${client}. Revenus professionnels et optimisation.`,
      'CLÔTURE': `Clôture comptable de l'exercice pour ${client}. Inventaire, provisions et établissement du bilan.`,
      'SITUATION INTERMÉDIAIRE': `Établissement d'une situation comptable intermédiaire pour ${client}. États financiers provisoires.`,
      'VERSEMENTS ANTICIPÉS': `Calcul et déclaration des versements anticipés pour ${client}. Estimation des acomptes.`,
      'COMPLÉMENTAIRE': `Mission complémentaire pour ${client}. Prestation spécialisée hors forfait habituel.`,
      'AUDIT': `Mission d'audit comptable pour ${client}. Vérification des comptes et procédures.`,
      'CONSEIL': `Mission de conseil pour ${client}. Accompagnement et expertise spécialisée.`
    };

    return descriptions[type as keyof typeof descriptions] || `Tâche ${type} pour ${client}`;
  }

  /**
   * Calcule la durée estimée selon le type de tâche
   */
  private getDureeEstimeeParType(type: string): number {
    const durees = {
      'TVA': [1, 2, 3][Math.floor(Math.random() * 3)],
      'ISOC': [4, 6, 8][Math.floor(Math.random() * 3)],
      'IPP': [2, 3, 4][Math.floor(Math.random() * 3)],
      'CLÔTURE': [8, 12, 16][Math.floor(Math.random() * 3)],
      'SITUATION INTERMÉDIAIRE': [3, 4, 6][Math.floor(Math.random() * 3)],
      'VERSEMENTS ANTICIPÉS': [1, 2][Math.floor(Math.random() * 2)],
      'COMPLÉMENTAIRE': [2, 4, 6][Math.floor(Math.random() * 3)],
      'AUDIT': [12, 16, 20][Math.floor(Math.random() * 3)],
      'CONSEIL': [2, 4, 6][Math.floor(Math.random() * 3)]
    };

    return durees[type as keyof typeof durees] || 4;
  }

  /**
   * Calcule le budget basé sur le type et la durée
   */
  private calculerBudget(type: string, dureeEstimee: number): number {
    const tauxHoraires = {
      'TVA': 80,
      'ISOC': 120,
      'IPP': 100,
      'CLÔTURE': 110,
      'SITUATION INTERMÉDIAIRE': 90,
      'VERSEMENTS ANTICIPÉS': 80,
      'COMPLÉMENTAIRE': 150,
      'AUDIT': 140,
      'CONSEIL': 160
    };

    const taux = tauxHoraires[type as keyof typeof tauxHoraires] || 100;
    return dureeEstimee * taux;
  }

  /**
   * Détermine l'étape actuelle selon le type et la progression
   */
  private getEtapeActuelle(type: string, progression: number): string {
    const etapes = {
      'TVA': ['Collecte pièces', 'Saisie données', 'Calculs TVA', 'Contrôle', 'Dépôt'],
      'ISOC': ['Collecte pièces', 'Saisie', 'Calcul résultat', 'Optimisations', 'Déclaration', 'Dépôt'],
      'IPP': ['Collecte revenus', 'Saisie', 'Calculs', 'Optimisations', 'Déclaration'],
      'CLÔTURE': ['Inventaire', 'Saisie', 'Provisions', 'Contrôles', 'Bilan', 'Validation'],
      'SITUATION INTERMÉDIAIRE': ['Collecte', 'Saisie', 'Calculs', 'États financiers'],
      'VERSEMENTS ANTICIPÉS': ['Estimation', 'Calculs', 'Déclaration'],
      'COMPLÉMENTAIRE': ['Analyse besoin', 'Réalisation'],
      'AUDIT': ['Planification', 'Tests', 'Contrôles', 'Rapport', 'Présentation'],
      'CONSEIL': ['Analyse', 'Recommandations', 'Présentation']
    };

    const etapesType = etapes[type as keyof typeof etapes] || ['En cours'];
    const indexEtape = Math.floor((progression / 100) * etapesType.length);
    const indexFinal = Math.min(indexEtape, etapesType.length - 1);
    
    return etapesType[indexFinal];
  }

  /**
   * Filtre les tâches selon des critères
   */
  filtrerTaches(
    taches: TacheComplete[],
    criteres: {
      terme?: string;
      types?: string[];
      urgences?: string[];
      responsables?: string[];
      statuts?: string[];
      dateDebut?: string;
      dateFin?: string;
    }
  ): TacheComplete[] {
    return taches.filter(tache => {
      // Recherche textuelle
      if (criteres.terme) {
        const terme = criteres.terme.toLowerCase();
        const correspondance = 
          tache.nom.toLowerCase().includes(terme) ||
          tache.clientNom.toLowerCase().includes(terme) ||
          tache.type.toLowerCase().includes(terme) ||
          tache.responsable.toLowerCase().includes(terme) ||
          tache.statut.toLowerCase().includes(terme) ||
          (tache.description && tache.description.toLowerCase().includes(terme));
        
        if (!correspondance) return false;
      }

      // Filtres spécifiques
      if (criteres.types && criteres.types.length > 0 && !criteres.types.includes(tache.type)) return false;
      if (criteres.urgences && criteres.urgences.length > 0 && !criteres.urgences.includes(tache.urgence)) return false;
      if (criteres.responsables && criteres.responsables.length > 0 && !criteres.responsables.includes(tache.responsable)) return false;
      if (criteres.statuts && criteres.statuts.length > 0 && !criteres.statuts.includes(tache.statut)) return false;

      // Filtres de dates
      if (criteres.dateDebut && tache.dateEcheance < criteres.dateDebut) return false;
      if (criteres.dateFin && tache.dateEcheance > criteres.dateFin) return false;

      return true;
    });
  }

  /**
   * Obtient les statistiques des tâches
   */
  obtenirStatistiques(taches: TacheComplete[]) {
    const total = taches.length;
    const parUrgence = taches.reduce((acc, t) => {
      acc[t.urgence] = (acc[t.urgence] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parStatut = taches.reduce((acc, t) => {
      acc[t.statut] = (acc[t.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const parType = taches.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const enRetard = taches.filter(t => new Date(t.dateEcheance) < new Date()).length;
    const terminees = taches.filter(t => t.statut === 'Terminé').length;
    const enCours = taches.filter(t => t.statut === 'En cours').length;

    return {
      total,
      parUrgence,
      parStatut,
      parType,
      enRetard,
      terminees,
      enCours,
      tauxCompletion: Math.round((terminees / total) * 100)
    };
  }
}
