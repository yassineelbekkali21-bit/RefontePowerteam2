import {
  OverviewData,
  ProductionData,
  FinanceData,
  HRData,
  PlanningData,
  CollaboratorPerformance,
  BudgetProgress,
  FinancialEntity,
  FolderStatus,
  TeamMember,
  TimeSheet,
  DocumentProduction,
  BonusPlan,
  DevelopmentPlan,
  RevisionStatus,
  Project,
  RevenueData,
  ProductionChartData,
  IndividualTask,
  PlanningItem,
  CalendarData
} from '@/types/dashboard';

export class DashboardDataService {
  
  static getOverviewData(): OverviewData {
    try {
      return {
        title: "Analytic: Yassine",
        mainIndicator: {
          label: "Followers",
          value: "32%",
          percentage: 32
        },
        budgets: {
          hourly: {
            current: 8400,
            target: 12500,
            unit: 'H',
            percentage: 67.2
          },
          economic: {
            current: 609500,
            target: 1500000,
            unit: '€',
            percentage: 40.6
          }
        },
        maxDeparture: {
          value: "13.9K €",
          percentage: 107
        },
        offshoring: {
          percentage: 39.9,
          horusFolders: 76.7
        },
        collaboratorPerformance: [
          {
            name: "Youssef B.",
            role: "GD",
            ca: 79,
            va: 100
          },
          {
            name: "Mohamed K.",
            role: "GD",
            cp: 100,
            va: 100
          },
          {
            name: "Vanessa A.",
            role: "GD",
            cp: 96,
            va: 100
          }
        ],
        financialEntities: [
          {
            name: "Radius",
            budget: 1280,
            actual: 814,
            forecast: 827,
            billable: 85
          },
          {
            name: "Atlantis",
            budget: 1380,
            actual: 0,
            forecast: 0,
            billable: 0
          }
        ],
        clientGrowth: {
          clientsIn: [
            "Bureau Audray",
            "Drosa",
            "ZOUKRI Azad",
            "Karin De Lee",
            "Cullen Ryan",
            "+ 2 Clients IN"
          ],
          clientsOut: [
            "Zupac",
            "Dadi",
            "Debu Maison Projects",
            "Concordia Coaching",
            "PICONI Fernando"
          ]
        }
      };
    } catch (error) {
      console.error('Error loading overview data:', error);
      return this.getOverviewFallbackData();
    }
  }

  static getProductionData(): ProductionData {
    try {
      return {
        teamTime: [
          { name: "Mohamed Kuda", time: "0m" },
          { name: "Youssef Bicheau", time: "0m" },
          { name: "Vanessa Amsot", time: "18h" },
          { name: "Ismah Abdelhacou", time: "24h 30m" }
        ],
        productionChart: [
          {
            period: "18 Août",
            worked: 0,
            result: 0,
            expected: 8
          },
          {
            period: "19 Août",
            worked: 0,
            result: 0,
            expected: 8
          },
          {
            period: "20 Août",
            worked: 0,
            result: 0,
            expected: 8
          },
          {
            period: "21 Août",
            worked: 0,
            result: 0,
            expected: 8
          },
          {
            period: "22 Août",
            worked: 0,
            result: 0,
            expected: 16
          }
        ],
        timeSheets: [
          {
            name: "Mohamed Kuda",
            hours: 21.8,
            target: 128,
            status: 'exceeded'
          },
          {
            name: "Zoukira Al Lamin",
            hours: 52,
            target: 157,
            status: 'exceeded'
          }
        ],
        folders: {
          exceeding: [
            { name: "Health C", time: "18h2", percentage: 493, status: 'exceeding' },
            { name: "De Bray Régine", time: "19h3", percentage: 353, status: 'exceeding' },
            { name: "BABEL ENGINEERING", time: "47h1", percentage: 364, status: 'exceeding' },
            { name: "LES VILLES DE SCHAERBEEK", time: "170h30", percentage: 332, status: 'exceeding' },
            { name: "Merquez Frye RR", time: "10h10", percentage: 333, status: 'exceeding' }
          ],
          compliant: [
            { name: "Cabinet médical du Docteur Pinart Jacques", time: "2h7", percentage: 100, status: 'compliant' },
            { name: "Taxis", time: "47h10", percentage: 98, status: 'compliant' }
          ]
        },
        individualTasks: [
          {
            name: "06 Open Teku",
            time: "16h 30m",
            details: "Congé, Total 0m pour les 23 et 24 Août"
          }
        ],
        documents: {
          idoc: {
            total: 51,
            status: 'unclassified'
          },
          quotes: {
            ipm: 2,
            status: 'treated',
            date: "21/12/2023"
          }
        }
      };
    } catch (error) {
      console.error('Error loading production data:', error);
      return this.getProductionFallbackData();
    }
  }

  static getFinanceData(): FinanceData {
    try {
      return {
        budgets: {
          hourly: {
            current: 8400,
            target: 12500,
            unit: 'H',
            percentage: 67.2
          },
          economic: {
            current: 609500,
            target: 1500000,
            unit: '€',
            percentage: 40.6
          }
        },
        maxDeparture: {
          value: "13.9K €",
          percentage: 107
        },
        revenue2025: [
          { period: "Q1", value: 64100, adjusted: 106100 },
          { period: "Q2", value: 73100, adjusted: 65900 },
          { period: "Q3", value: 7300, adjusted: 4400 }
        ],
        profitability: {
          lessRentable: [
            { name: "Philox", value: 89 },
            { name: "Solal MSD", value: 88 },
            { name: "AtomCare Nutrition Medicine", value: 88 },
            { name: "BAOG", value: 88 },
            { name: "HALENS Pierre", value: 89 }
          ],
          topRentable: [
            { name: "Simbio Kai Jonathan", value: 3090 },
            { name: "Bric", value: 1260 }
          ]
        }
      };
    } catch (error) {
      console.error('Error loading finance data:', error);
      return this.getFinanceFallbackData();
    }
  }

  static getHRData(): HRData {
    try {
      return {
        bonusPlans: [
          { name: "Ismah A.", role: "GD", bonusCount: 2 },
          { name: "Mohamed K.", role: "GD", bonusCount: 1 },
          { name: "Vanessa A.", role: "GD", bonusCount: 1 },
          { name: "Youssef B.", role: "GD", bonusCount: 1 }
        ],
        developmentPlans: [
          { name: "Youssef K.", role: "GD", planCount: 0 },
          { name: "Ali J.", role: "GD", planCount: 0 },
          { name: "Mohamed K.", role: "GD", planCount: 0 },
          { name: "Zoukira A.", role: "GD", planCount: 0 }
        ],
        projectTracking: {
          vpPaje: [
            "Bureau Audray",
            "Drosa",
            "ZOUKRI Azad",
            "Karin De Lee",
            "Cullen Ryan",
            "+ 2 VIP"
          ],
          revisionStatus: [
            { name: "QTAM.org", status: 'terminal' },
            { name: "A.COM interns", status: 'in-progress' },
            { name: "Crispeert", status: 'terminal' },
            { name: "Uberfill", status: 'in-progress' }
          ]
        }
      };
    } catch (error) {
      console.error('Error loading HR data:', error);
      return this.getHRFallbackData();
    }
  }

  static getPlanningData(): PlanningData {
    try {
      return {
        planning: [
          { id: "1", title: "Planification générale", status: 'in-progress', type: 'finalization' }
        ],
        deadlines: {
          finalization: 1,
          intermediate: 0,
          presentation: 0
        },
        planManagement: {
          todo: 1,
          inProgress: 0,
          completed: 1
        },
        calendar: {
          month: "Août",
          year: 2023,
          events: []
        },
        virtualAssistant: {
          errorReports: "Aucun rapport trouvé"
        }
      };
    } catch (error) {
      console.error('Error loading planning data:', error);
      return this.getPlanningFallbackData();
    }
  }

  // Données de fallback en cas d'erreur
  private static getOverviewFallbackData(): OverviewData {
    return {
      title: "Dashboard",
      mainIndicator: { label: "Indicateur", value: "0%", percentage: 0 },
      budgets: {
        hourly: { current: 0, target: 1, unit: 'H', percentage: 0 },
        economic: { current: 0, target: 1, unit: '€', percentage: 0 }
      },
      maxDeparture: { value: "0€", percentage: 0 },
      offshoring: { percentage: 0, horusFolders: 0 },
      collaboratorPerformance: [],
      financialEntities: [],
      clientGrowth: { clientsIn: [], clientsOut: [] }
    };
  }

  private static getProductionFallbackData(): ProductionData {
    return {
      teamTime: [],
      productionChart: [],
      timeSheets: [],
      folders: { exceeding: [], compliant: [] },
      individualTasks: [],
      documents: {
        idoc: { total: 0, status: 'unclassified' },
        quotes: { ipm: 0, status: 'untreated' }
      }
    };
  }

  private static getFinanceFallbackData(): FinanceData {
    return {
      budgets: {
        hourly: { current: 0, target: 1, unit: 'H', percentage: 0 },
        economic: { current: 0, target: 1, unit: '€', percentage: 0 }
      },
      maxDeparture: { value: "0€", percentage: 0 },
      revenue2025: [],
      profitability: { lessRentable: [], topRentable: [] }
    };
  }

  private static getHRFallbackData(): HRData {
    return {
      bonusPlans: [],
      developmentPlans: [],
      projectTracking: { vpPaje: [], revisionStatus: [] }
    };
  }

  private static getPlanningFallbackData(): PlanningData {
    return {
      planning: [],
      deadlines: { finalization: 0, intermediate: 0, presentation: 0 },
      planManagement: { todo: 0, inProgress: 0, completed: 0 },
      calendar: { month: "", year: 2023, events: [] },
      virtualAssistant: { errorReports: "Erreur de chargement" }
    };
  }
}