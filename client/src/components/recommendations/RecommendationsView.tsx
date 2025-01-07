import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronLeft, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';

// Services
async function generateRecommendations(data: any) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la génération des recommandations: ${response.statusText}`);
  }

  return response.json();
}

async function exportToWord(data: any) {
  const response = await fetch('/api/exports/word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'export Word: ${response.statusText}`);
  }

  return response.blob();
}

async function exportToExcel(data: any) {
  const response = await fetch('/api/exports/excel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'export Excel: ${response.statusText}`);
  }

  return response.blob();
}

export default function RecommendationsView() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => generateRecommendations({ /* données d'audit ici */ }),
    enabled: true
  });

  const handleExportWord = async () => {
    try {
      setIsExporting(true);
      if (!recommendations?.length) {
        toast({
          title: "Attention",
          description: "Aucune recommandation à exporter",
          variant: "destructive"
        });
        return;
      }

      const fileName = `Recommandations_${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.docx`;
      const blob = await exportToWord(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Word réussi"
      });
    } catch (error) {
      console.error('Erreur lors de l\'export Word:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Word",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const blob = await exportToExcel(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Recommandations_${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Excel réussi"
      });
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Excel",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Chargement des recommandations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 text-red-500">
              <AlertCircle className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Erreur</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Une erreur est survenue lors du chargement des recommandations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setLocation('/tableau-de-bord')}
          variant="outline"
          className="hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Recommandations</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportWord}
            variant="outline"
            className="hover:bg-gray-100"
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="hover:bg-gray-100"
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="impacts">Impacts</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <div className="grid gap-6">
            {recommendations.map((rec: any) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{rec.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority === 'critical' ? 'Critique' :
                       rec.priority === 'high' ? 'Élevée' :
                       rec.priority === 'medium' ? 'Moyenne' :
                       'Faible'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{rec.description}</p>

                  {rec.impact && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Impact</h4>
                        <div className="space-y-2">
                          {Object.entries(rec.impact).map(([key, value]: [string, any]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">
                                  {key === 'efficiency' ? 'Efficacité' :
                                   key === 'reliability' ? 'Fiabilité' :
                                   key === 'compliance' ? 'Conformité' : key}
                                </span>
                                <span>{value.score}%</span>
                              </div>
                              <Progress value={value.score} />
                              <p className="text-sm text-gray-600 mt-1">{value.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {rec.implementation && (
                        <div>
                          <h4 className="font-medium mb-2">Mise en œuvre</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Difficulté</p>
                              <p className="text-sm">
                                {rec.implementation.difficulty === 'high' ? 'Élevée' :
                                 rec.implementation.difficulty === 'medium' ? 'Moyenne' :
                                 rec.implementation.difficulty === 'low' ? 'Faible' : 'Non spécifiée'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Délai</p>
                              <p className="text-sm">
                                {rec.implementation.timeframe === 'immediate' ? 'Immédiat' :
                                 rec.implementation.timeframe === 'short_term' ? 'Court terme' :
                                 rec.implementation.timeframe === 'medium_term' ? 'Moyen terme' :
                                 rec.implementation.timeframe === 'long_term' ? 'Long terme' : 'Non spécifié'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {rec.implementation?.prerequisites?.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Prérequis</h4>
                          <ul className="list-disc list-inside text-sm">
                            {rec.implementation.prerequisites.map((prereq: string, index: number) => (
                              <li key={index}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impacts">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Analyse des Impacts</h3>
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={recommendations.map((rec: any) => ({
                      name: rec.title.substring(0, 20) + '...',
                      efficacite: rec.impact?.efficiency?.score || 0,
                      fiabilite: rec.impact?.reliability?.score || 0,
                      conformite: rec.impact?.compliance?.score || 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficacite" fill="#10b981" name="Efficacité" />
                      <Bar dataKey="fiabilite" fill="#3b82f6" name="Fiabilité" />
                      <Bar dataKey="conformite" fill="#f59e0b" name="Conformité" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-gray-600 mt-4">
                    Ce graphique montre l'impact de chaque recommandation sur trois aspects clés :
                    l'efficacité opérationnelle, la fiabilité des systèmes et la conformité aux normes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              {recommendations.map((rec: any) => (
                <div key={rec.id} className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{rec.title}</h3>
                  {rec.equipment?.map((eq: any, index: number) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">{eq.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{eq.description}</p>
                      {eq.specifications?.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1">Spécifications techniques</h5>
                            <ul className="list-disc list-inside text-sm">
                              {eq.specifications.map((spec: string, i: number) => (
                                <li key={i}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Délai de mise en place</h5>
                            <p className="text-sm">{eq.implementation_time}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Matrice de conformité</h3>
              {recommendations.length > 0 && recommendations[0].compliance_matrix && (
                Object.entries(recommendations[0].compliance_matrix.categories || {}).map(([category, data]: [string, any]) => (
                  <div key={category} className="mb-6">
                    <h4 className="font-medium mb-2">{category}</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Niveau de conformité</p>
                        <div className="flex items-center gap-2">
                          <Progress value={data.level} />
                          <span>{data.level}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{data.explanation}</p>
                      </div>
                      {data.required_actions?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Actions requises</p>
                          {data.required_actions.map((action: string, index: number) => (
                            <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
                              <p className="text-sm">{action}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Planning de mise en œuvre</h3>
              {recommendations.length > 0 && recommendations[0].planning?.phases?.map((phase: any, index: number) => (
                <div key={index} className="mb-6">
                  <h4 className="font-medium mb-2">{phase.name}</h4>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{phase.description}</p>
                    <div>
                      <p className="text-sm font-medium">Durée estimée: {phase.duration}</p>
                      <p className="text-sm font-medium">
                        Priorité: {
                          phase.priority === 'high' ? 'Élevée' :
                          phase.priority === 'medium' ? 'Moyenne' :
                          phase.priority === 'low' ? 'Faible' : 'Non spécifiée'
                        }
                      </p>
                    </div>
                    {phase.tasks?.map((task: any, taskIndex: number) => (
                      <div key={taskIndex} className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">{task.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Ressources requises</p>
                            <ul className="list-disc list-inside text-sm">
                              {task.required_resources?.map((resource: string, i: number) => (
                                <li key={i}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Impact sur les opérations</p>
                            <p className="text-sm">{task.operations_impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}