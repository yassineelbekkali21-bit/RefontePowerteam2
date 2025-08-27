import { DollarSign, Users, TrendingUp, Factory, Calendar, Target, Clock, Euro } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { CollaboratorCard } from '@/components/dashboard/CollaboratorCard';
import { BudgetProgressCard } from '@/components/dashboard/BudgetProgressCard';
import { DashboardDataService } from '@/services/dashboardData';

// Récupération des données du dashboard de Yassine
const overviewData = DashboardDataService.getOverviewData();

const kpis = [
  {
    title: "Clients",
    value: overviewData.mainIndicator.value,
    trend: overviewData.mainIndicator.percentage - 30, // Simulation d'une tendance
    description: "indicateur principal",
    icon: TrendingUp,
    variant: 'success' as const,
    details: { 
      label: overviewData.mainIndicator.label,
      percentage: overviewData.mainIndicator.percentage,
      type: "Indicateur principal"
    }
  },
  {
    title: "Max. Départ",
    value: overviewData.maxDeparture.value,
    trend: overviewData.maxDeparture.percentage - 100,
    description: `${overviewData.maxDeparture.percentage}%`,
    icon: Target,
    variant: 'success' as const,
    details: { 
      value: overviewData.maxDeparture.value,
      percentage: overviewData.maxDeparture.percentage,
      status: "Dépassé"
    }
  },
  {
    title: "Offshoring",
    value: `${overviewData.offshoring.percentage}%`,
    trend: 0,
    description: "taux global",
    icon: Factory,
    variant: 'info' as const,
    details: { 
      offshoring: overviewData.offshoring.percentage,
      horus_folders: overviewData.offshoring.horusFolders,
      type: "Répartition"
    }
  },
  {
    title: "Dossiers Horus",
    value: `${overviewData.offshoring.horusFolders}%`,
    trend: 0,
    description: "couverture",
    icon: Calendar,
    variant: 'default' as const,
    details: { 
      percentage: overviewData.offshoring.horusFolders,
      type: "Dossiers Horus"
    }
  }
];

// Données pour les graphiques adaptées au contenu de Yassine
const budgetEvolutionData = [
  { name: 'Jan', hourly: 1200, economic: 85000 },
  { name: 'Fév', hourly: 2400, economic: 125000 },
  { name: 'Mar', hourly: 3800, economic: 185000 },
  { name: 'Avr', hourly: 5200, economic: 265000 },
  { name: 'Mai', hourly: 6800, economic: 385000 },
  { name: 'Juin', hourly: 8400, economic: 609500 },
];

const entityData = [
  { name: 'Radius', value: overviewData.financialEntities[0]?.actual || 814 },
  { name: 'Atlantis', value: overviewData.financialEntities[1]?.actual || 1380 },
  { name: 'Autres', value: 450 },
];

// Données des entités financières
const entitiesData = overviewData.financialEntities.map(entity => ({
  name: entity.name,
  budget: `${entity.budget}K`,
  actual: `${entity.actual}K`,
  forecast: `${entity.forecast}K`,
  billable: `${entity.billable}K`,
  status: entity.actual > 0 ? "Actif" : "Inactif"
}));

// Colonnes du tableau des entités
const entityColumns = [
  { key: 'name', label: 'Entité', type: 'text' as const },
  { key: 'budget', label: 'Budget', type: 'text' as const },
  { key: 'actual', label: 'Réel', type: 'text' as const },
  { key: 'forecast', label: 'Prévisible', type: 'text' as const },
  { key: 'billable', label: 'Facturable', type: 'text' as const },
  { key: 'status', label: 'Statut', type: 'badge' as const, variant: 'default' }
];

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{overviewData.title}</h1>
          <p className="text-sm text-muted-foreground">Vue d'ensemble des indicateurs clés</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Dernière mise à jour</div>
          <div className="text-sm font-medium">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      {/* KPIs Grid - 4 colonnes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            description={kpi.description}
            icon={kpi.icon}
            variant={kpi.variant}
            details={kpi.details}
            compact={true}
          />
        ))}
      </div>

      {/* Sections Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgressCard
          title="Budget Horaire"
          budget={overviewData.budgets.hourly}
          variant="info"
        />
        <BudgetProgressCard
          title="Budget Économique"
          budget={overviewData.budgets.economic}
          variant="success"
        />
      </div>

      {/* Performance des Collaborateurs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Performance des Collaborateurs</h2>
          <p className="text-sm text-muted-foreground">Indicateurs de performance par collaborateur</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewData.collaboratorPerformance.map((collaborator, index) => (
            <CollaboratorCard
              key={index}
              collaborator={collaborator}
              compact={true}
            />
          ))}
        </div>
      </div>

      {/* Graphiques en 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Évolution Budgétaire"
          data={budgetEvolutionData}
          type="line"
          xKey="name"
          yKey="economic"
          height={300}
          showLegend={false}
          description="Progression du budget économique"
        />
        
        <ChartCard
          title="Répartition par Entité"
          data={entityData}
          type="donut"
          xKey="name"
          yKey="value"
          height={300}
          showLegend={true}
          description="Répartition des montants par entité"
        />
      </div>

      {/* Croissance Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-success">Clients "IN"</h2>
            <p className="text-sm text-muted-foreground">Nouveaux clients acquis</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {overviewData.clientGrowth.clientsIn.map((client, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/20 cursor-pointer hover:bg-success/10 transition-colors"
                  data-contextual={JSON.stringify({
                    type: 'user',
                    title: client,
                    data: { name: client, type: 'Client IN', status: 'Nouveau' },
                    details: { type: 'Nouveau client', statut: 'Actif' }
                  })}
                >
                  <span className="text-sm font-medium">{client}</span>
                  <span className="text-xs text-success font-semibold">IN</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-destructive">Clients "OUT"</h2>
            <p className="text-sm text-muted-foreground">Clients perdus</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {overviewData.clientGrowth.clientsOut.map((client, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-destructive/5 border border-destructive/20 cursor-pointer hover:bg-destructive/10 transition-colors"
                  data-contextual={JSON.stringify({
                    type: 'user',
                    title: client,
                    data: { name: client, type: 'Client OUT', status: 'Perdu' },
                    details: { type: 'Client perdu', statut: 'Inactif' }
                  })}
                >
                  <span className="text-sm font-medium">{client}</span>
                  <span className="text-xs text-destructive font-semibold">OUT</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des entités financières */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Données Financières par Entité</h2>
          <p className="text-sm text-muted-foreground">Suivi budgétaire par entité</p>
        </div>
        <DataTable
          columns={entityColumns}
          data={entitiesData}
          className="border-0"
          showHeader={true}
          showPagination={false}
        />
      </div>
    </div>
  );
};

export default Overview;