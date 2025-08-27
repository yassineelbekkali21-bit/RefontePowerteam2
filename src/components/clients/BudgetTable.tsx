import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface BudgetPrestation {
  name: string;
  budget: number;
  realise: number;
}

interface BudgetTableProps {
  prestations?: BudgetPrestation[];
}

const defaultPrestations: BudgetPrestation[] = [
  { name: 'Services Hors Tenue', budget: 67.584, realise: 68.96 },
  { name: 'Tenue Comptabilité', budget: 0, realise: 0 },
  { name: 'Budget Fiscal', budget: 17.28, realise: 17.88 },
  { name: 'Organisation Comptable', budget: 0, realise: 0 },
  { name: 'Révision Comptable', budget: 14.144, realise: 14.56 },
  { name: 'Prestations Cia', budget: 0, realise: 0 },
  { name: 'Nettoyage et Vérifications Comptables', budget: 16, realise: 16.56 },
  { name: 'Production Situation Intermédiaire', budget: 0, realise: 0 },
  { name: 'Production Bilan', budget: 2.64, realise: 2.88 },
  { name: 'Prestations Fiscales', budget: 7.92, realise: 8.16 },
  { name: 'Vérifications Diverses', budget: 0, realise: 0 },
  { name: 'Conseil Client', budget: 0, realise: 0 },
  { name: 'Gestion Dossier', budget: 0, realise: 0 },
  { name: 'Gestion Réglementaire', budget: 2.88, realise: 2.96 }
];

const getEcartColor = (budget: number, realise: number) => {
  if (budget === 0 && realise === 0) return 'text-gray-500';
  const ecart = realise - budget;
  if (ecart > 0) return 'text-red-600';
  if (ecart < 0) return 'text-green-600';
  return 'text-gray-600';
};

const getEcartBgColor = (budget: number, realise: number) => {
  if (budget === 0 && realise === 0) return 'bg-gray-100';
  const ecart = realise - budget;
  if (ecart > 0) return 'bg-red-50';
  if (ecart < 0) return 'bg-green-50';
  return 'bg-gray-50';
};

export const BudgetTable: React.FC<BudgetTableProps> = ({ 
  prestations = defaultPrestations 
}) => {
  const totalBudget = prestations.reduce((sum, p) => sum + p.budget, 0);
  const totalRealise = prestations.reduce((sum, p) => sum + p.realise, 0);
  const totalEcart = totalRealise - totalBudget;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Budget par Prestation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">Prestation</th>
                <th className="text-center p-3 font-semibold text-gray-700">Budget H.</th>
                <th className="text-center p-3 font-semibold text-gray-700">Réalisé H.</th>
                <th className="text-center p-3 font-semibold text-gray-700">Écart</th>
              </tr>
            </thead>
            <tbody>
              {prestations.map((prestation, index) => {
                const ecart = prestation.realise - prestation.budget;
                return (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 ${getEcartBgColor(prestation.budget, prestation.realise)}`}
                  >
                    <td className="p-3 font-medium text-gray-800">{prestation.name}</td>
                    <td className="p-3 text-center text-gray-700">
                      {prestation.budget > 0 ? `${prestation.budget}h` : '-'}
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {prestation.realise > 0 ? `${prestation.realise}h` : '-'}
                    </td>
                    <td className={`p-3 text-center font-semibold ${getEcartColor(prestation.budget, prestation.realise)}`}>
                      {prestation.budget === 0 && prestation.realise === 0 
                        ? '-' 
                        : `${ecart >= 0 ? '+' : ''}${ecart.toFixed(2)}h`
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="p-3 font-bold text-gray-900">TOTAL</td>
                <td className="p-3 text-center font-bold text-gray-900">{totalBudget.toFixed(2)}h</td>
                <td className="p-3 text-center font-bold text-gray-900">{totalRealise.toFixed(2)}h</td>
                <td className={`p-3 text-center font-bold ${getEcartColor(totalBudget, totalRealise)}`}>
                  {totalEcart >= 0 ? '+' : ''}{totalEcart.toFixed(2)}h
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Summary indicators */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Taux de réalisation</div>
              <div className="text-lg font-bold text-blue-600">
                {totalBudget > 0 ? Math.round((totalRealise / totalBudget) * 100) : 0}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Prestations actives</div>
              <div className="text-lg font-bold text-indigo-600">
                {prestations.filter(p => p.budget > 0 || p.realise > 0).length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Dépassements</div>
              <div className="text-lg font-bold text-red-600">
                {prestations.filter(p => p.realise > p.budget && p.budget > 0).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
