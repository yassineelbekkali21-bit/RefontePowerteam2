/**
 * Service pour gérer les intégrations Teams et Outlook
 */

interface InvitationTeams {
  titre: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  participants: string[];
  lieu: string;
  organisateur: string;
}

interface ResultatInvitation {
  success: boolean;
  message: string;
  lienReunion?: string;
  erreur?: string;
}

export class TeamsService {
  private static instance: TeamsService;

  static getInstance(): TeamsService {
    if (!TeamsService.instance) {
      TeamsService.instance = new TeamsService();
    }
    return TeamsService.instance;
  }

  /**
   * Génère un lien Teams pour une réunion
   */
  private genererLienTeams(): string {
    // Simulation d'un lien Teams généré
    const meetingId = Math.random().toString(36).substring(2, 15);
    return `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${meetingId}`;
  }

  /**
   * Formate la description de la réunion pour Outlook
   */
  private formaterDescription(invitation: InvitationTeams): string {
    const { description, lieu, participants } = invitation;
    
    let descriptionFormatee = '';
    
    if (description) {
      descriptionFormatee += `${description}\n\n`;
    }
    
    descriptionFormatee += `📍 Lieu: ${lieu}\n`;
    descriptionFormatee += `👥 Participants: ${participants.join(', ')}\n\n`;
    
    if (lieu.toLowerCase().includes('teams')) {
      const lienTeams = this.genererLienTeams();
      descriptionFormatee += `🎥 Rejoindre la réunion Teams:\n${lienTeams}\n\n`;
      descriptionFormatee += `📞 Numéro de conférence: +33 1 57 32 42 78\n`;
      descriptionFormatee += `🔢 ID de conférence: 123 456 789#\n\n`;
    }
    
    descriptionFormatee += `Organisé via YSN Dashboard - Planification Intelligente`;
    
    return descriptionFormatee;
  }

  /**
   * Génère un fichier ICS pour Outlook
   */
  private genererFichierICS(invitation: InvitationTeams): string {
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeText = (text: string): string => {
      return text.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YSN Dashboard//Planification Intelligente//FR',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${Math.random().toString(36).substring(2)}@ysn-dashboard.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(invitation.dateDebut)}`,
      `DTEND:${formatDate(invitation.dateFin)}`,
      `SUMMARY:${escapeText(invitation.titre)}`,
      `DESCRIPTION:${escapeText(this.formaterDescription(invitation))}`,
      `LOCATION:${escapeText(invitation.lieu)}`,
      `ORGANIZER:CN=${invitation.organisateur}:MAILTO:${invitation.organisateur}@cabinet.com`,
      ...invitation.participants.map(p => `ATTENDEE:CN=${p}:MAILTO:${p}`),
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  }

  /**
   * Télécharge le fichier ICS
   */
  private telechargerICS(contenu: string, nomFichier: string): void {
    const blob = new Blob([contenu], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nomFichier}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Envoie une invitation Teams/Outlook
   */
  async envoyerInvitation(invitation: InvitationTeams): Promise<ResultatInvitation> {
    try {
      // Validation des données
      if (!invitation.titre || !invitation.dateDebut || !invitation.dateFin) {
        return {
          success: false,
          message: 'Données d\'invitation incomplètes',
          erreur: 'Titre, date de début et date de fin sont requis'
        };
      }

      if (invitation.participants.length === 0) {
        return {
          success: false,
          message: 'Aucun participant spécifié',
          erreur: 'Au moins un participant est requis'
        };
      }

      // Génération du fichier ICS
      const contenuICS = this.genererFichierICS(invitation);
      const nomFichier = `reunion-${invitation.titre.toLowerCase().replace(/\s+/g, '-')}-${invitation.dateDebut.getDate()}-${invitation.dateDebut.getMonth() + 1}`;

      // Téléchargement automatique
      this.telechargerICS(contenuICS, nomFichier);

      // Génération du lien Teams si nécessaire
      let lienReunion: string | undefined;
      if (invitation.lieu.toLowerCase().includes('teams')) {
        lienReunion = this.genererLienTeams();
      }

      // Simulation d'envoi d'email (dans un vrai projet, intégration avec API)
      await this.simulerEnvoiEmail(invitation);

      return {
        success: true,
        message: `Invitation créée et fichier ICS téléchargé pour "${invitation.titre}"`,
        lienReunion
      };

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
      return {
        success: false,
        message: 'Erreur lors de la création de l\'invitation',
        erreur: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Simulation d'envoi d'email (à remplacer par une vraie API)
   */
  private async simulerEnvoiEmail(invitation: InvitationTeams): Promise<void> {
    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('📧 Simulation envoi email:', {
      destinataires: invitation.participants,
      sujet: `Invitation: ${invitation.titre}`,
      date: invitation.dateDebut.toLocaleString('fr-FR'),
      lieu: invitation.lieu
    });

    // Dans un vrai projet, ici on appellerait une API comme:
    // - Microsoft Graph API pour Outlook/Teams
    // - SendGrid, Mailgun, etc. pour l'envoi d'emails
    // - Webhook vers un service backend
  }

  /**
   * Génère un mailto: link pour ouvrir le client email par défaut
   */
  genererLienEmail(invitation: InvitationTeams): string {
    const sujet = encodeURIComponent(`Invitation: ${invitation.titre}`);
    const destinataires = invitation.participants.join(',');
    const corps = encodeURIComponent(this.formaterDescription(invitation));

    return `mailto:${destinataires}?subject=${sujet}&body=${corps}`;
  }

  /**
   * Ouvre le client email par défaut avec l'invitation pré-remplie
   */
  ouvrirClientEmail(invitation: InvitationTeams): void {
    const lienEmail = this.genererLienEmail(invitation);
    window.open(lienEmail, '_blank');
  }

  /**
   * Valide un format d'email
   */
  static validerEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Extrait les informations de disponibilité (simulation)
   */
  async verifierDisponibilites(participants: string[], dateDebut: Date, dateFin: Date): Promise<{
    participant: string;
    disponible: boolean;
    conflit?: string;
  }[]> {
    // Simulation de vérification de disponibilités
    return participants.map(participant => ({
      participant,
      disponible: Math.random() > 0.3, // 70% de chance d'être disponible
      conflit: Math.random() > 0.7 ? 'Réunion client prévue' : undefined
    }));
  }
}
