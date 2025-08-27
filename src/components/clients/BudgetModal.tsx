import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, User, DollarSign, Clock, Users, Plus, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, client }) => {
  const [budgetStep, setBudgetStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar navigation */}
          <div className="w-64 bg-gradient-to-b from-blue-50 to-blue-100 p-6 border-r">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-blue-800">Gestion Budget</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {[
                { step: 1, title: 'Infos Client', icon: User },
                { step: 2, title: 'Budget Global', icon: DollarSign },
                { step: 3, title: 'Gestion Tâches', icon: Clock },
                { step: 4, title: 'Gestion Rôles', icon: Users }
              ].map(({ step, title, icon: Icon }) => (
                <button
                  key={step}
                  onClick={() => setBudgetStep(step)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                    budgetStep === step
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 overflow-y-auto">
            {budgetStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Informations Client</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={client?.nom}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type Standard</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Médecin</option>
                        <option>Dentiste</option>
                        <option>Kinésithérapeute</option>
                        <option>Artiste</option>
                        <option>Construction</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="Médecine générale"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forme</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>SELARL</option>
                        <option>SCP</option>
                        <option>EURL</option>
                        <option>SARL</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Volumétrie</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Budget</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="180" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="165" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Heures budgétées</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Budget</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="345" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="357" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget économique</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Budget</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="15750" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Réalisé</label>
                          <input type="number" className="w-full p-2 border rounded" defaultValue="16420" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {budgetStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Budget Global</h3>
                <div className="grid grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Budget Économique 2024</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Budget 2024</span>
                          <span className="font-semibold">€15,750</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Budget 2025</span>
                          <span className="font-semibold">€16,800</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Budget Horaire</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total budgété</span>
                          <span className="font-semibold">345h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Réalisé</span>
                          <span className="font-semibold">357h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Budget Volumétrique</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Documents budget</span>
                          <span className="font-semibold">655</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Documents réalisés</span>
                          <span className="font-semibold">662</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Temps budgétés par prestation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
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
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.budget}h</div>
                          <div className="text-xs text-gray-500">Réalisé: {item.realise}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Tarification */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Tarification</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Paramètres Tarifaires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              id="tarifPreferentiel"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="tarifPreferentiel" className="text-sm font-medium text-gray-700">
                              Tarif préférentiel
                            </label>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Remise (%)
                            </label>
                            <input
                              type="number"
                              defaultValue="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0.0"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Facturation Minimum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Seuil minimum</span>
                            <div className="text-right">
                              <div className="font-semibold">90€/h</div>
                              <div className="text-xs text-gray-500">Configurable</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Facturation actuelle</span>
                            <div className="text-right">
                              <div className="font-semibold">98€/h</div>
                              <div className="text-xs text-green-600">✓ Conforme</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '109%'}}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {budgetStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Gestion des Tâches</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Répartition des tâches par rôle</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Tâche</th>
                          <th className="text-center p-2">Comptable</th>
                          <th className="text-center p-2">H1</th>
                          <th className="text-center p-2">H2</th>
                          <th className="text-center p-2">H3</th>
                          <th className="text-center p-2">Qualité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Gestion Dossier Papier', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Production Budget', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Qualité Papier', comptable: 17.28, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Organisation Comptable', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Révision Comptable', comptable: 17.28, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Prestations Cia', comptable: 12.8, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Nettoyage et Vérifications Comptables', comptable: 16.64, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Production Situation Intermédiaire', comptable: 0, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Production Bilan', comptable: 2.64, h1: 0, h2: 0, h3: 0, qualite: 0 },
                          { name: 'Prestations Fiscales', comptable: 7.92, h1: 0, h2: 0, h3: 0, qualite: 0 }
                        ].map((task, index) => (
                          <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="p-2 font-medium">{task.name}</td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                className="w-16 p-1 border rounded text-center" 
                                defaultValue={task.comptable} 
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                className="w-16 p-1 border rounded text-center" 
                                defaultValue={task.h1} 
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                className="w-16 p-1 border rounded text-center" 
                                defaultValue={task.h2} 
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                className="w-16 p-1 border rounded text-center" 
                                defaultValue={task.h3} 
                                step="0.01"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                className="w-16 p-1 border rounded text-center" 
                                defaultValue={task.qualite} 
                                step="0.01"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {budgetStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Gestion des Rôles</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Rôles assignés</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Mohamed Kadi</div>
                          <div className="text-sm text-gray-600">Collaborateur</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">8.17</div>
                          <div className="text-xs text-gray-500">Total Heures</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Julien Lefebvre</div>
                          <div className="text-sm text-gray-600">Manager</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">6.08</div>
                          <div className="text-xs text-gray-500">Total Heures</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Ajouter un rôle</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Collaborateur</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg">
                          <option>Sélectionner un collaborateur</option>
                          <option>Mohamed Kadi</option>
                          <option>Julien Lefebvre</option>
                          <option>Sarah Martin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg">
                          <option>Collaborateur</option>
                          <option>Manager</option>
                          <option>Senior</option>
                          <option>Junior</option>
                        </select>
                      </div>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter le rôle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setBudgetStep(Math.max(1, budgetStep - 1))}
                disabled={budgetStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              <div className="flex space-x-2">
                {budgetStep < 4 ? (
                  <Button
                    onClick={() => setBudgetStep(Math.min(4, budgetStep + 1))}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
