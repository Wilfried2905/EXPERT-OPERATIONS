import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText } from 'lucide-react';
import { useAnthropic } from '@/hooks/use-anthropic';
import { useToast } from '@/hooks/use-toast';
import ProgressScoreCard from './ProgressScoreCard';

interface Question {
  id: string;
  text: string;
  group: string;
  response: 'conforme' | 'non-conforme' | null;
  comment?: string;
}

export const RecommendationsView = () => {
  const [, setLocation] = useLocation();
  const { generateRecommendations, isLoading: apiIsLoading } = useAnthropic();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecommendations = async () => {
    try {
      console.log("Début de la génération des recommandations");
      setIsGenerating(true);

      // Récupérer les données du questionnaire depuis le localStorage
      const storedData = localStorage.getItem('auditQuestionnaireData');
      if (!storedData) {
        toast({
          title: "Erreur",
          description: "Aucune donnée d'audit trouvée. Veuillez compléter le questionnaire.",
          variant: "destructive"
        });
        return;
      }

      const auditData = JSON.parse(storedData);
      console.log("Données d'audit récupérées:", auditData);

      // Structurer les données pour l'API
      const apiPayload = {
        auditData: {
          questionnaire: {
            responses: auditData.questions.reduce((acc: any, q: Question) => ({
              ...acc,
              [q.id]: {
                question: q.text,
                response: q.response,
                comment: q.comment,
                group: q.group
              }
            }), {}),
            scores: {
              global: auditData.globalScore,
              byGroup: auditData.groupScores
            }
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: "1.0"
          }
        }
      };

      console.log("Payload pour l'API:", apiPayload);

      const result = await generateRecommendations(apiPayload);
      console.log("Résultat reçu:", result);

      if (result?.text) {
        // Sauvegarder les recommandations pour l'affichage détaillé
        localStorage.setItem('recommendationsData', JSON.stringify({
          recommendations: result.text,
          auditData: apiPayload.auditData
        }));

        toast({
          title: "Succès",
          description: "Les recommandations ont été générées avec succès"
        });

        setLocation('/recommendations-detail');
      } else {
        throw new Error("Les données de recommandations sont invalides");
      }
    } catch (error) {
      console.error('Erreur lors de la génération des recommandations:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la génération des recommandations",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateQuestionResponse = (id: string, response: 'conforme' | 'non-conforme', comment?: string) => {
    // Assuming 'questions' is now fetched from localStorage.  This will need adjustment based on how your application manages state.
    const storedData = localStorage.getItem('auditQuestionnaireData');
    if (storedData) {
      const auditData = JSON.parse(storedData);
      const updatedQuestions = auditData.questions.map(q =>
          q.id === id ? { ...q, response, comment } : q
      );
      localStorage.setItem('auditQuestionnaireData', JSON.stringify({...auditData, questions: updatedQuestions}));
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analyse de l'Infrastructure</h2>
        <Button
          onClick={handleGenerateRecommendations}
          disabled={isGenerating || apiIsLoading}
          className="bg-[#003366] hover:bg-[#004488] text-white"
        >
          {isGenerating ? (
            <>
              <FileText className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Voir les Recommandations
            </>
          )}
        </Button>
      </div>

      {/* Affichage des scores */}
      {/* This section needs to be removed or adapted to use data from localStorage  */}


      {/* Questionnaire */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#003366]">
            <AlertCircle className="h-5 w-4" />
            Questionnaire d'Évaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {['Sécurité physique', 'Infrastructure électrique', 'Refroidissement', 'Infrastructure réseau'].map(group => (
              <div key={group} className="space-y-4">
                <h3 className="font-semibold text-lg">{group}</h3>
                {/* Questions section needs to be adapted to use data from localStorage */}
                {/* Example below assumes questions are fetched from localStorage */}
                { (() => {
                  const storedData = localStorage.getItem('auditQuestionnaireData');
                  if (storedData) {
                    const auditData = JSON.parse(storedData);
                    return auditData.questions
                      .filter(q => q.group === group)
                      .map(question => (
                        <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <span className="font-medium">{question.text}</span>
                          <div className="flex gap-2">
                            <Button
                              variant={question.response === 'conforme' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateQuestionResponse(question.id, 'conforme')}
                              className={question.response === 'conforme' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              Conforme
                            </Button>
                            <Button
                              variant={question.response === 'non-conforme' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateQuestionResponse(question.id, 'non-conforme')}
                              className={question.response === 'non-conforme' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              Non Conforme
                            </Button>
                          </div>
                        </div>
                      ));
                  } else {
                    return <p>Loading...</p>
                  }
                })() }
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsView;