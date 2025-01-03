import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRecommendationsStore } from '@/store/useRecommendationsStore';
import { generateRecommendations, generateMatrixCompliance, generateGanttData } from '@/services/anthropic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToWord, exportToExcel } from '@/services/exports';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecommendationsView() {
  const {
    recommendations,
    loading,
    error,
    setRecommendations,
    setLoading,
    setError
  } = useRecommendationsStore();

  const [complianceMatrix, setComplianceMatrix] = useState(null);
  const [ganttData, setGanttData] = useState(null);

  useEffect(() => {
    console.log("RecommendationsView: Component mounted");
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock audit data - À remplacer par les vraies données
        const auditData = {
          metrics: {
            pue: [1.8, 1.9, 1.7],
            availability: [99.9, 99.8, 99.95],
            tierLevel: 3,
            complianceGaps: ['Documentation incomplète', 'Processus non formalisés']
          },
          responses: {},
          additionalData: {
            images: [],
            documents: [],
            comments: []
          }
        };

        console.log("RecommendationsView: Fetching recommendations");
        const response = await generateRecommendations(auditData);
        console.log("API Response:", response);
        setRecommendations(response.recommendations || []);

        console.log("RecommendationsView: Fetching compliance matrix");
        const matrix = await generateMatrixCompliance(auditData);
        setComplianceMatrix(matrix);

        console.log("RecommendationsView: Fetching Gantt data");
        const gantt = await generateGanttData(response.recommendations || []);
        setGanttData(gantt);

      } catch (err) {
        console.error("RecommendationsView: Error fetching data", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportWord = async () => {
    try {
      const blob = await exportToWord(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recommendations_${new Date().toISOString()}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Word:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await exportToExcel(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recommendations_${new Date().toISOString()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Chargement des recommandations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  console.log("Current recommendations:", recommendations);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recommandations</h1>
        <div className="space-x-4">
          <Button
            onClick={handleExportWord}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="impacts">Impacts</TabsTrigger>
          <TabsTrigger value="compliance">Matrice de Conformité</TabsTrigger>
          <TabsTrigger value="gantt">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <div className="grid gap-6">
            {Array.isArray(recommendations) && recommendations.map((rec) => (
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
                      {rec.priority}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{rec.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Impact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm">Coût</span>
                        <Progress value={rec.impact.cost * 100} />
                      </div>
                      <div>
                        <span className="text-sm">Performance</span>
                        <Progress value={rec.impact.performance * 100} />
                      </div>
                      <div>
                        <span className="text-sm">Conformité</span>
                        <Progress value={rec.impact.compliance * 100} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Alternatives</h4>
                    <div className="space-y-2">
                      {rec.alternatives.map((alt, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <p className="font-medium">{alt.description}</p>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-green-600">Avantages</h5>
                              <ul className="list-disc list-inside text-sm">
                                {alt.pros.map((pro, i) => (
                                  <li key={i}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-red-600">Inconvénients</h5>
                              <ul className="list-disc list-inside text-sm">
                                {alt.cons.map((con, i) => (
                                  <li key={i}>{con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">Coût estimé: {alt.estimatedCost}€</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Progression</h4>
                    <Progress value={rec.progress} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impacts">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={recommendations?.map(rec => ({
                  name: rec.title.substring(0, 20) + '...',
                  cost: rec.impact.cost * 100,
                  performance: rec.impact.performance * 100,
                  compliance: rec.impact.compliance * 100
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#ef4444" name="Coût" />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance" />
                  <Bar dataKey="compliance" fill="#22c55e" name="Conformité" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="pt-6">
              {complianceMatrix && (
                <div className="grid gap-4">
                  {Object.entries(complianceMatrix).map(([category, data]: [string, any]) => (
                    <div key={category} className="border rounded p-4">
                      <h3 className="text-lg font-semibold mb-2">{category}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm">Niveau de conformité</span>
                          <Progress value={data.conformityLevel} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Actions requises</h4>
                          <ul className="list-disc list-inside text-sm">
                            {data.requiredActions.map((action: string, index: number) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt">
          <Card>
            <CardContent className="pt-6">
              {ganttData && (
                <div className="space-y-4">
                  {ganttData.tasks.map((task: any, index: number) => (
                    <div key={index} className="border rounded p-4">
                      <h3 className="font-medium">{task.name}</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <span className="text-sm">Durée: {task.duration} jours</span>
                        </div>
                        <div>
                          <span className="text-sm">Début: {task.startDate}</span>
                        </div>
                        <div>
                          <span className="text-sm">Fin: {task.endDate}</span>
                        </div>
                      </div>
                      {task.dependencies.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm">Dépendances: {task.dependencies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}