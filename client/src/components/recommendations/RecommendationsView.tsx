import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateRecommendations, generateMatrixCompliance, generateGanttData } from '@/services/anthropic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportToWord, exportToExcel } from '@/services/exports';
import { Download, ChevronLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import StandardsTabs from './StandardsTabs';
import DocumentationTabs from './DocumentationTabs';

export default function RecommendationsView() {
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [complianceMatrix, setComplianceMatrix] = useState<any>(null);
  const [ganttData, setGanttData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupérer les données du localStorage
        const storedData = localStorage.getItem('auditData');
        if (!storedData) {
          throw new Error("Aucune donnée d'audit trouvée");
        }

        const auditData = JSON.parse(storedData);
        const response = await generateRecommendations({
          auditData,
          options: {
            model: "claude-3-sonnet-20241022",
            temperature: 0.7,
            maxTokens: 2000
          }
        });

        if (!response || !Array.isArray(response.recommendations)) {
          throw new Error("Format de réponse invalide");
        }

        setRecommendations(response.recommendations);

        const matrix = await generateMatrixCompliance(auditData);
        setComplianceMatrix(matrix);

        const gantt = await generateGanttData(response.recommendations);
        setGanttData(gantt);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportWord = async () => {
    try {
      if (!recommendations?.length) {
        toast({
          title: "Erreur",
          description: "Aucune recommandation à exporter",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les informations du client depuis le localStorage
      const clientInfo = JSON.parse(localStorage.getItem('clientInfo') || '{}');
      const auditType = localStorage.getItem('auditType') || 'standard';

      const exportData = {
        recommendations: recommendations.map(rec => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          impact: {
            efficiency: rec.impact?.efficiency || 0,
            reliability: rec.impact?.reliability || 0,
            compliance: rec.impact?.compliance || 0
          }
        })),
        clientInfo,
        metadata: {
          auditType,
          date: format(new Date(), 'yyyy-MM-dd')
        }
      };

      const blob = await exportToWord(exportData);
      const fileName = `3R_Recommandations_${auditType}_${clientInfo.name}_${format(new Date(), 'yyyyMMdd')}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Word réussi"
      });
    } catch (error) {
      console.error('Error exporting to Word:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Word",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      if (!recommendations?.length) {
        toast({
          title: "Erreur",
          description: "Aucune recommandation à exporter",
          variant: "destructive"
        });
        return;
      }

      // Récupérer les informations du client depuis le localStorage
      const clientInfo = JSON.parse(localStorage.getItem('clientInfo') || '{}');
      const auditType = localStorage.getItem('auditType') || 'standard';

      const exportData = {
        recommendations: recommendations.map(rec => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          impact: {
            efficiency: rec.impact?.efficiency || 0,
            reliability: rec.impact?.reliability || 0,
            compliance: rec.impact?.compliance || 0
          }
        })),
        clientInfo,
        metadata: {
          auditType,
          date: format(new Date(), 'yyyy-MM-dd')
        }
      };

      const blob = await exportToExcel(exportData);
      const fileName = `3R_Recommandations_${auditType}_${clientInfo.name}_${format(new Date(), 'yyyyMMdd')}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Excel réussi"
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Excel",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Chargement des recommandations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setLocation('/dashboard')}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Recommandations</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportWord}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            onClick={handleExportExcel}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            onClick={() => setLocation('/documents')}
            className="bg-primary hover:bg-primary/90"
          >
            <FileText className="w-4 h-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="impacts">Impacts</TabsTrigger>
          <TabsTrigger value="equipment">Matériels Requis</TabsTrigger>
          <TabsTrigger value="compliance">Matrice de Conformité</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <div className="grid gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index}>
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

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Impact</h4>
                      <div className="space-y-2">
                        {Object.entries(rec.impact || {}).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{key}</span>
                              <span>{value}%</span>
                            </div>
                            <Progress value={Number(value)} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Mise en œuvre</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Difficulté</p>
                          <p className="text-sm">{rec.implementation?.difficulty || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Coût estimé</p>
                          <p className="text-sm">{rec.implementation?.estimatedCost || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Délai</p>
                          <p className="text-sm">{rec.implementation?.timeframe || 'Non spécifié'}</p>
                        </div>
                      </div>
                    </div>

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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impacts">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Analyse des Impacts</h3>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={recommendations.map(rec => ({
                    name: rec.title?.substring(0, 20) + '...',
                    ...rec.impact
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="efficiency" fill="#10b981" name="Efficacité" />
                    <Bar dataKey="reliability" fill="#3b82f6" name="Fiabilité" />
                    <Bar dataKey="compliance" fill="#f59e0b" name="Conformité" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{rec.title}</h3>
                  {rec.equipment?.map((eq: any, eqIndex: number) => (
                    <div key={eqIndex} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">{eq.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{eq.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Spécifications</h5>
                          <ul className="list-disc list-inside text-sm">
                            {eq.specifications?.map((spec: string, specIndex: number) => (
                              <li key={specIndex}>{spec}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-1">Estimation</h5>
                          <p className="text-sm">Coût: {eq.cost}</p>
                          <p className="text-sm">Délai: {eq.deliveryTime}</p>
                        </div>
                      </div>
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
              {complianceMatrix && Object.entries(complianceMatrix).map(([category, data]: [string, any]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{category}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Niveau de Conformité</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={data.level} className="h-2" />
                        <span>{data.level}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Actions Requises</h4>
                      {data.actions?.map((action: any, index: number) => (
                        <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardContent className="pt-6">
              {ganttData && ganttData.phases?.map((phase: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">{phase.name}</h3>
                  <div className="space-y-4">
                    {phase.tasks?.map((task: any, taskIndex: number) => (
                      <div key={taskIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{task.name}</h4>
                          <span className="text-sm text-gray-600">
                            Durée: {task.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-1">Ressources</h5>
                            <ul className="list-disc list-inside text-sm">
                              {task.resources?.map((resource: string, i: number) => (
                                <li key={i}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-1">Dépendances</h5>
                            <ul className="list-disc list-inside text-sm">
                              {task.dependencies?.map((dep: string, i: number) => (
                                <li key={i}>{dep}</li>
                              ))}
                            </ul>
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

        <TabsContent value="standards">
          <StandardsTabs />
        </TabsContent>

        <TabsContent value="documentation">
          <DocumentationTabs />
        </TabsContent>
      </Tabs>
    </div>
  );
}