import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  Euro,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Prestations = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Prestations
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion et suivi des prestations clients
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Prestation
            </Button>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Prestations Actives</p>
                  <p className="text-3xl font-bold text-blue-900">247</p>
                </div>
                <Briefcase className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">CA Mensuel</p>
                  <p className="text-3xl font-bold text-green-900">€425K</p>
                </div>
                <Euro className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Heures Facturées</p>
                  <p className="text-3xl font-bold text-orange-900">1,842h</p>
                </div>
                <Clock className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Taux Marge</p>
                  <p className="text-3xl font-bold text-purple-900">87%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Prestations en Cours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "BELTEC SARL", service: "Comptabilité Générale", statut: "En cours", progress: 75 },
                    { client: "TECHNO SOLUTIONS", service: "Déclarations Fiscales", statut: "À valider", progress: 95 },
                    { client: "GARAGE MARTIN", service: "Bulletins de Paie", statut: "En cours", progress: 60 },
                  ].map((prestation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{prestation.client}</h4>
                        <p className="text-sm text-gray-600">{prestation.service}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={prestation.statut === "En cours" ? "default" : "secondary"}>
                          {prestation.statut}
                        </Badge>
                        <div className="w-20 text-right">
                          <p className="text-sm font-medium">{prestation.progress}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Catalogue de Services</h3>
                <p className="text-muted-foreground">Module en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Planning des Prestations</h3>
                <p className="text-muted-foreground">Module en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rapports de Performance</h3>
                <p className="text-muted-foreground">Module en cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Prestations;
