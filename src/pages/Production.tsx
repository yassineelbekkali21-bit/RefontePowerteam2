import React, { useState } from 'react';
import { Users, BarChart3, Clock, Calendar, Brain } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { PlanningProvider } from '@/contexts/PlanningContext';
import SuiviIndividuel from '@/components/production/SuiviIndividuel';
import SuiviTemps from '@/components/production/SuiviTemps';
import SuiviEcheancesWorking from '@/components/planning/SuiviEcheancesWorking';
import CalendrierIntelligent from '@/components/planning/CalendrierIntelligent';
import { dashboardProduction, collaborateurs, metriquesProduction, echeancesFiscales, suiviTemps } from '@/data/productionData';

type VueActive = 'individuel' | 'temps' | 'echeances' | 'planification';

const Production = () => {
  const [vueActive, setVueActive] = useState<VueActive>('individuel');

  const vues = [
    { id: 'individuel' as const, label: 'Suivi Performance', icon: Users },
    { id: 'temps' as const, label: 'Suivi du Temps', icon: Clock },
    { id: 'echeances' as const, label: 'Échéances', icon: Calendar },
    { id: 'planification' as const, label: 'Planification IA', icon: Brain }
  ];

  return (
    <PlanningProvider>
      <DashboardLayout>
        <div className="space-y-6">
        <PageHeader
          title="⚡ Production & Planification"
          description="Performance, échéances et planification intelligente"
          icon={BarChart3}
          actions={
            /* Dashboard KPIs rapides */
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{dashboardProduction.indicateurs.length}</div>
                <div className="text-gray-500">Collaborateurs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">24</div>
                <div className="text-gray-500">Échéances</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">2</div>
                <div className="text-gray-500">Retard moyen</div>
              </div>
            </div>
          }
        />

        {/* Navigation par onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {vues.map((vue) => {
              const Icon = vue.icon;
              return (
                <Button
                  key={vue.id}
                  variant={vueActive === vue.id ? "default" : "ghost"}
                  onClick={() => setVueActive(vue.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    vueActive === vue.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {vue.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Contenu dynamique selon la vue active */}
        <div className="min-h-[600px]">
          {vueActive === 'individuel' && (
            <SuiviIndividuel 
              collaborateurs={collaborateurs}
              metriques={metriquesProduction}
              periode={{ debut: "2024-01-01", fin: "2024-01-31" }}
            />
          )}
          {vueActive === 'temps' && (
            <SuiviTemps 
              collaborateurs={collaborateurs}
              suiviTemps={suiviTemps}
              periode={{ debut: "2024-01-01", fin: "2024-01-31" }}
            />
          )}
          {vueActive === 'echeances' && (
            <SuiviEcheancesWorking />
          )}
          {vueActive === 'planification' && (
            <CalendrierIntelligent />
          )}
        </div>
        </div>
      </DashboardLayout>
    </PlanningProvider>
  );
};

export default Production;