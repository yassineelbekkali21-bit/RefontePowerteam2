export interface SuspicionJustification {
  id: string;
  clientId: string;
  ruleId: string;
  justification: string;
  createdBy: string;
  createdAt: Date;
  validUntil: Date;
  status: 'neutralized' | 'justified' | 'expired';
}

interface Rule {
  id: string;
  nom: string;
  description: string;
  condition: string;
  type: 'simple' | 'complex';
  gravite: 'low' | 'medium' | 'high';
  enabled: boolean;
}

interface ClientAnalysis {
  isSuspect: boolean;
  canBeNeutralized: boolean;
  ruleTriggered?: Rule;
  confidence: number;
}

class RuleEngine {
  private rules: Rule[] = [
    {
      id: 'rule-1',
      nom: 'Déséquilibre Facturation/Prestation',
      description: 'Détecte un déséquilibre entre facturation et prestation',
      condition: 'RvB > 20',
      type: 'simple',
      gravite: 'medium',
      enabled: true
    },
    {
      id: 'rule-2', 
      nom: 'Sous-facturation Critique',
      description: 'Détecte une sous-facturation critique',
      condition: 'RvB < -25',
      type: 'simple',
      gravite: 'high',
      enabled: true
    },
    {
      id: 'rule-3',
      nom: 'Rentabilité Insuffisante',
      description: 'Détecte une rentabilité insuffisante',
      condition: 'rentabilite < 90',
      type: 'simple',
      gravite: 'high',
      enabled: true
    }
  ];

  private justifications: Map<string, SuspicionJustification> = new Map();

  analyzeClient(client: any): ClientAnalysis {
    // Logique d'analyse simplifiée
    const ecart = client.realiseADate?.pourcentageCA - client.realiseADate?.pourcentageHeures || 0;
    
    let triggeredRule = null;
    if (Math.abs(ecart) > 20) {
      triggeredRule = this.rules.find(r => r.id === 'rule-1');
    }

    return {
      isSuspect: Math.abs(ecart) > 15,
      canBeNeutralized: true,
      ruleTriggered: triggeredRule || undefined,
      confidence: 0.8
    };
  }

  neutralizeSuspicion(clientId: string, ruleId: string, justification: string, userId: string, validUntil: Date) {
    const id = `${clientId}-${ruleId}`;
    this.justifications.set(id, {
      id,
      clientId,
      ruleId,
      justification,
      createdBy: userId,
      createdAt: new Date(),
      validUntil,
      status: 'neutralized'
    });
  }

  reactivateSuspicion(clientId: string, ruleId: string) {
    const id = `${clientId}-${ruleId}`;
    this.justifications.delete(id);
  }

  getJustification(clientId: string): SuspicionJustification | undefined {
    for (const [key, justification] of this.justifications) {
      if (justification.clientId === clientId) {
        return justification;
      }
    }
    return undefined;
  }

  getRules(): Rule[] {
    return this.rules;
  }

  updateRule(ruleId: string, updates: Partial<Rule>) {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  toggleRule(ruleId: string) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
    }
  }
}

export const ruleEngine = new RuleEngine();