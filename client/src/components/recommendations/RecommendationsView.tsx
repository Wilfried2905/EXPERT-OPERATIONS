import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRecommendationsStore } from '@/store/useRecommendationsStore';
import { generateRecommendations, generateMatrixCompliance, generateGanttData } from '@/services/anthropic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToWord, exportToExcel } from '@/services/exports';
import { Download, ChevronLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function RecommendationsView() {
  const [, setLocation] = useLocation();
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
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

        const response = await generateRecommendations(auditData);
        console.log("API Response:", response);
        setRecommendations(response.recommendations || []);

        const matrix = await generateMatrixCompliance(auditData);
        setComplianceMatrix(matrix);

        const gantt = await generateGanttData(response.recommendations || []);
        setGanttData(gantt);

      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setLocation('/operations')}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Recommandations</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleExportWord}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            onClick={handleExportExcel}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            onClick={() => setShowReportModal(true)}
            className="bg-[#FF9900] hover:bg-[#e68a00] text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Générer un Rapport
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommendations">
        <TabsList>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="impacts">Impacts</TabsTrigger>
          <TabsTrigger value="equipment">Matériels Requis</TabsTrigger>
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
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Norme applicable:</strong> {rec.normReference.code}</p>
                    <p>{rec.normReference.description}</p>
                    <p className="mt-1"><strong>Exigence:</strong> {rec.normReference.requirement}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{rec.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Impact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm">Efficacité énergétique</span>
                        <Progress value={rec.impact.energyEfficiency * 100} />
                        <p className="text-sm mt-1">{rec.impact.details.energyEfficiency}</p>
                      </div>
                      <div>
                        <span className="text-sm">Performance</span>
                        <Progress value={rec.impact.performance * 100} />
                        <p className="text-sm mt-1">{rec.impact.details.performance}</p>
                      </div>
                      <div>
                        <span className="text-sm">Conformité</span>
                        <Progress value={rec.impact.compliance * 100} />
                        <p className="text-sm mt-1">{rec.impact.details.compliance}</p>
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
                          <p className="mt-2 text-sm">Efficacité estimée: {alt.estimatedEfficiency}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Progression</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={rec.progress ?? 0} />
                      <span className="text-sm">{(rec.progress ?? 0).toFixed(1)}%</span>
                    </div>
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
                  energyEfficiency: rec.impact.energyEfficiency * 100,
                  performance: rec.impact.performance * 100,
                  compliance: rec.impact.compliance * 100
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="energyEfficiency" fill="#22c55e" name="Efficacité énergétique" />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance" />
                  <Bar dataKey="compliance" fill="#f59e0b" name="Conformité" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <div className="grid gap-6">
            {Array.isArray(recommendations) && recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <h3 className="text-xl font-semibold">{rec.title}</h3>
                </CardHeader>
                <CardContent>
                  {rec.requiredEquipment.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="font-semibold mb-3">{category.category}</h4>
                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-4 bg-gray-50 rounded">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm mt-1">Spécifications: {item.specification}</p>
                            <p className="text-sm text-blue-600">Norme: {item.normReference}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="pt-6">
              {complianceMatrix && (
                <div className="grid gap-4">
                  {Object.entries(complianceMatrix).map(([category, data]: [string, any]) => (
                    <div key={category} className="border rounded p-4">
                      <h3 className="text-lg font-semibold mb-2">{category}</h3>
                      <p className="text-sm mb-4">{data.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm">Niveau de conformité</span>
                          <div className="flex items-center gap-2">
                            <Progress value={data.conformityLevel} />
                            <span className="text-sm">{data.conformityLevel}%</span>
                          </div>
                          <p className="text-sm mt-1">{data.details}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Actions requises</h4>
                          {data.requiredActions.map((action: any, index: number) => (
                            <div key={index} className="mb-2">
                              <p className="text-sm font-medium">{action.action}</p>
                              <p className="text-xs text-gray-600">Norme: {action.normReference}</p>
                              <p className="text-xs text-gray-600">Exigence: {action.requirement}</p>
                            </div>
                          ))}
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
                <div className="space-y-6">
                  {ganttData.tasks?.map((task: any, index: number) => (
                    <div key={index} className="border rounded p-4">
                      <h3 className="font-medium mb-2">{task.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{task.details?.description}</p>

                      <div className="space-y-4">
                        {task.details?.phases?.map((phase: any, phaseIndex: number) => (
                          <div key={phaseIndex} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{phase.name}</h4>
                              <span className="text-sm text-gray-600">Durée: {phase.duration}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium mb-1">Tâches:</h5>
                                <ul className="list-disc list-inside text-sm">
                                  {phase.tasks?.map((t: string, i: number) => (
                                    <li key={i}>{t}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-1">Livrables:</h5>
                                <ul className="list-disc list-inside text-sm">
                                  {phase.deliverables?.map((d: string, i: number) => (
                                    <li key={i}>{d}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Jalons importants:</h4>
                        {task.details?.milestones?.map((milestone: any, milestoneIndex: number) => (
                          <div key={milestoneIndex} className="mb-2">
                            <p className="font-medium text-sm">{milestone.name} - {milestone.date}</p>
                            <ul className="list-disc list-inside text-sm">
                              {milestone.requirements?.map((req: string, i: number) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
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