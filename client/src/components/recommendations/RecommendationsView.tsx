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
import { format } from 'date-fns';

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
        setRecommendations(response.recommendations || []);

        const matrix = await generateMatrixCompliance(auditData);
        setComplianceMatrix(matrix);

        const gantt = await generateGanttData(response.recommendations || []);
        setGanttData(gantt);

      } catch (err) {
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
      const clientName = "Client"; // À remplacer par le vrai nom du client
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const fileName = `3R_Recommandations_${clientName}_${currentDate}.docx`;

      const exportData = {
        recommendations,
        complianceMatrix,
        ganttData,
        impacts: recommendations?.map(rec => ({
          name: rec.title,
          energyEfficiency: rec.impact.energyEfficiency * 100,
          performance: rec.impact.performance * 100,
          compliance: rec.impact.compliance * 100,
          explanation: rec.impact.explanation
        }))
      };

      const blob = await exportToWord(exportData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
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
      a.download = `3R_Recommandations_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const handleGenerateReport = () => {
    setLocation('/operations/documents');
  };

  const renderImpactExplanation = (type: string, value: number) => {
    const getExplanation = () => {
      switch (type) {
        case 'energyEfficiency':
          return `L'amélioration de l'efficacité énergétique de ${value.toFixed(1)}% sera obtenue grâce à l'optimisation des systèmes de refroidissement et à une meilleure gestion de la charge thermique. Cela se traduit par une réduction significative de la consommation d'énergie et une amélioration du PUE (Power Usage Effectiveness).`;
        case 'performance':
          return `L'augmentation de la performance de ${value.toFixed(1)}% sera réalisée par la modernisation des équipements et l'optimisation des processus opérationnels. Cela permettra une meilleure disponibilité des services et une réduction des temps d'arrêt.`;
        case 'compliance':
          return `L'amélioration de la conformité de ${value.toFixed(1)}% sera atteinte en alignant les installations sur les normes en vigueur, notamment EN 50600 pour les datacenters. Cela renforcera la sécurité et la fiabilité de l'infrastructure.`;
        default:
          return '';
      }
    };

    return (
      <div className="mt-2 text-sm text-gray-600">
        {getExplanation()}
      </div>
    );
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
            onClick={handleGenerateReport}
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
                    <p><strong>Norme applicable:</strong> {rec.normReference?.code}</p>
                    <p>{rec.normReference?.description}</p>
                    <p className="mt-1"><strong>Exigence:</strong> {rec.normReference?.requirement}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="mb-2">{rec.description}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Explication technique simplifiée :</h4>
                      <p className="text-sm text-gray-700">{rec.technicalExplanation}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Impact</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {['energyEfficiency', 'performance', 'compliance'].map((impactType) => (
                        <div key={impactType}>
                          <span className="text-sm capitalize">{impactType.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={rec.impact[impactType] * 100} />
                            <span className="text-sm">{(rec.impact[impactType] * 100).toFixed(1)}%</span>
                          </div>
                          {renderImpactExplanation(impactType, rec.impact[impactType] * 100)}
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
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Vue d'ensemble des impacts</h3>
                <p className="text-gray-700 mb-4">
                  Ce graphique présente une visualisation comparative des impacts de chaque recommandation selon trois axes principaux :
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li className="text-gray-700">
                    <span className="font-semibold">Efficacité énergétique (vert)</span> : Mesure l'amélioration de la consommation d'énergie et du PUE
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Performance (bleu)</span> : Évalue l'amélioration des performances opérationnelles
                  </li>
                  <li className="text-gray-700">
                    <span className="font-semibold">Conformité (orange)</span> : Indique le niveau de mise en conformité avec les normes
                  </li>
                </ul>
              </div>

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

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Analyse détaillée des impacts</h4>
                {recommendations?.map((rec) => (
                  <div key={rec.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-2">{rec.title}</h5>
                    <div className="space-y-2">
                      {Object.entries(rec.impact).map(([key, value]) => (
                        key !== 'details' && (
                          <div key={key}>
                            {renderImpactExplanation(key, value * 100)}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                  {rec.requiredEquipment?.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="font-semibold mb-3">{category.category}</h4>
                      <div className="space-y-4">
                        {category.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-4 bg-gray-50 rounded">
                            <p className="font-medium">{item.name}</p>
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">Description technique :</h5>
                              <p className="text-sm text-gray-600 mb-2">{item.technicalDescription}</p>

                              <h5 className="text-sm font-medium mb-1">Bénéfices pour le client :</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                                {item.benefits?.map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>

                              <h5 className="text-sm font-medium mb-1">Alternatives disponibles :</h5>
                              {item.alternatives?.map((alt, i) => (
                                <div key={i} className="mb-2 p-2 bg-white rounded">
                                  <p className="text-sm font-medium">{alt.name}</p>
                                  <p className="text-sm text-gray-600">{alt.description}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div>
                                      <p className="text-xs font-medium text-green-600">Avantages :</p>
                                      <ul className="list-disc list-inside text-xs text-gray-600">
                                        {alt.pros?.map((pro, j) => (
                                          <li key={j}>{pro}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-red-600">Inconvénients :</p>
                                      <ul className="list-disc list-inside text-xs text-gray-600">
                                        {alt.cons?.map((con, j) => (
                                          <li key={j}>{con}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
                          {data.requiredActions?.map((action: any, index: number) => (
                            <div key={index} className="mb-2">
                              <p className="text-sm font-medium">{action.action}</p>
                              <div className="ml-4">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Norme :</span> {action.normReference}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Exigence :</span> {action.requirement}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  <span className="font-medium">Explication :</span> {action.explanation}
                                </p>
                              </div>
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