import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from 'lucide-react';
import { generateRecommendations } from '@/services/anthropic';
import { useToast } from '@/hooks/use-toast';
import type { AuditData } from '@/types/audit';

export default function RecommendationsView() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    try {
      // Exemple de données d'audit (à adapter selon vos besoins)
      const auditData: AuditData = {
        infrastructure: {
          questionnaire: {
            resultats: {
              "Sécurité physique": {
                "Contrôle d'accès": "conforme",
                "Vidéosurveillance": "non-conforme"
              }
            },
            scores: {
              global: {
                score: 75,
                repondu: 80,
                nom: "Score Global"
              },
              parGroupe: {
                "Sécurité physique": {
                  score: 70,
                  repondu: 100,
                  nom: "Sécurité"
                }
              }
            }
          }
        }
      };

      const result = await generateRecommendations(auditData);
      setRecommendations(result);

      toast({
        title: "Succès",
        description: "Les recommandations ont été générées avec succès",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Génération des recommandations en cours...</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button 
                onClick={handleGenerateRecommendations}
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                Générer les recommandations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {recommendations.recommendations?.map((rec: any) => (
        <Card key={rec.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{rec.title}</CardTitle>
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
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficacité</span>
                      <span>{rec.impact.efficiency}%</span>
                    </div>
                    <Progress value={rec.impact.efficiency} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fiabilité</span>
                      <span>{rec.impact.reliability}%</span>
                    </div>
                    <Progress value={rec.impact.reliability} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conformité</span>
                      <span>{rec.impact.compliance}%</span>
                    </div>
                    <Progress value={rec.impact.compliance} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Mise en œuvre</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Difficulté</p>
                    <p className="text-sm">{rec.implementation.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Coût estimé</p>
                    <p className="text-sm">{rec.implementation.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Délai</p>
                    <p className="text-sm">{rec.implementation.timeframe}</p>
                  </div>
                </div>
              </div>

              {rec.implementation.prerequisites.length > 0 && (
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
  );
}