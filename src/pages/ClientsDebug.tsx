import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const ClientsDebug = () => {
  const [activeTab, setActiveTab] = useState('liste');

  console.log('ClientsDebug rendu avec activeTab:', activeTab);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        {/* Header */}
        <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <h1 className="text-4xl font-bold">CLIENTS - DEBUG</h1>
          <p className="text-blue-100 text-lg">Test des onglets</p>
        </div>

        {/* ONGLETS - VERSION DEBUG ULTRA VISIBLE */}
        <div className="mb-8 bg-red-200 p-8 border-4 border-red-500 rounded-xl">
          <h2 className="text-2xl font-black mb-6 text-red-800">🚨 ONGLETS DE NAVIGATION - DEBUG 🚨</h2>
          
          <div className="flex space-x-6 mb-4">
            <button
              onClick={() => {
                console.log('Clic sur Liste des Clients');
                setActiveTab('liste');
              }}
              className={`px-8 py-4 text-xl font-bold rounded-xl border-4 transition-all ${
                activeTab === 'liste' 
                  ? 'bg-green-500 text-white border-green-700 shadow-lg transform scale-105' 
                  : 'bg-white text-black border-gray-400 hover:bg-gray-100'
              }`}
            >
              📋 LISTE DES CLIENTS
            </button>
            
            <button
              onClick={() => {
                console.log('Clic sur Capacity Planning');
                setActiveTab('capacity');
              }}
              className={`px-8 py-4 text-xl font-bold rounded-xl border-4 transition-all ${
                activeTab === 'capacity' 
                  ? 'bg-blue-500 text-white border-blue-700 shadow-lg transform scale-105' 
                  : 'bg-white text-black border-gray-400 hover:bg-gray-100'
              }`}
            >
              📊 CAPACITY PLANNING
            </button>
            
            <button
              onClick={() => {
                console.log('Clic sur Suivi Portefeuilles');
                setActiveTab('portefeuilles');
              }}
              className={`px-8 py-4 text-xl font-bold rounded-xl border-4 transition-all ${
                activeTab === 'portefeuilles' 
                  ? 'bg-purple-500 text-white border-purple-700 shadow-lg transform scale-105' 
                  : 'bg-white text-black border-gray-400 hover:bg-gray-100'
              }`}
            >
              📈 SUIVI PORTEFEUILLES
            </button>
          </div>
          
          <div className="bg-yellow-300 p-4 rounded-lg border-2 border-yellow-500">
            <p className="text-xl font-bold text-yellow-900">
              🎯 ONGLET ACTUEL: <span className="text-2xl">{activeTab}</span>
            </p>
          </div>
        </div>

        {/* CONTENU DES ONGLETS */}
        <div className="space-y-6">
          {activeTab === 'liste' && (
            <div className="bg-green-100 p-8 rounded-xl border-4 border-green-500">
              <h2 className="text-3xl font-bold text-green-800 mb-4">✅ CONTENU: LISTE DES CLIENTS</h2>
              <p className="text-xl text-green-700">Ici sera affichée la liste des clients...</p>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p>• Client 1: Dr. Martin Dubois</p>
                <p>• Client 2: Cabinet Dentaire Smile</p>
                <p>• Client 3: Kiné Plus Rééducation</p>
              </div>
            </div>
          )}

          {activeTab === 'capacity' && (
            <div className="bg-blue-100 p-8 rounded-xl border-4 border-blue-500">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">✅ CONTENU: CAPACITY PLANNING</h2>
              <p className="text-xl text-blue-700">Ici sera affichée la gestion des capacités...</p>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p>• Utilisation globale: 87%</p>
                <p>• Capacité disponible: 15h</p>
                <p>• Collaborateurs surchargés: 2</p>
              </div>
            </div>
          )}

          {activeTab === 'portefeuilles' && (
            <div className="bg-purple-100 p-8 rounded-xl border-4 border-purple-500">
              <h2 className="text-3xl font-bold text-purple-800 mb-4">✅ CONTENU: SUIVI DES PORTEFEUILLES</h2>
              <p className="text-xl text-purple-700">Ici sera affiché le suivi des portefeuilles...</p>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p>• Clients actifs: 5</p>
                <p>• CA total: 66k€</p>
                <p>• Satisfaction moyenne: 4.2/5</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsDebug;
