import React, { useState, useEffect } from 'react';
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
}

export const RecommendationsView = () => {
  const [questions, setQuestions] = useState<Question[]>([
    // Groupe 1: Sécurité physique
    { id: '1.1', text: 'Contrôle d\'accès aux salles serveurs', group: 'Sécurité physique', response: null },
    { id: '1.2', text: 'Système de vidéosurveillance', group: 'Sécurité physique', response: null },
    { id: '1.3', text: 'Détection incendie', group: 'Sécurité physique', response: null },
    { id: '1.4', text: 'Système d\'extinction incendie', group: 'Sécurité physique', response: null },
    { id: '1.5', text: 'Procédures d\'urgence documentées', group: 'Sécurité physique', response: null },
    // Groupe 2: Infrastructure électrique
    { id: '2.1', text: 'Redondance alimentations', group: 'Infrastructure électrique', response: null },
    { id: '2.2', text: 'Systèmes UPS', group: 'Infrastructure électrique', response: null },
    { id: '2.3', text: 'Groupe électrogène', group: 'Infrastructure électrique', response: null },
    { id: '2.4', text: 'Maintenance préventive', group: 'Infrastructure électrique', response: null },
    { id: '2.5', text: 'Monitoring électrique', group: 'Infrastructure électrique', response: null },
    // Groupe 3: Refroidissement
    { id: '3.1', text: 'Capacité de refroidissement', group: 'Refroidissement', response: null },
    { id: '3.2', text: 'Redondance climatisation', group: 'Refroidissement', response: null },
    { id: '3.3', text: 'Gestion des flux d\'air', group: 'Refroidissement', response: null },
    { id: '3.4', text: 'Surveillance température', group: 'Refroidissement', response: null },
    { id: '3.5', text: 'Maintenance HVAC', group: 'Refroidissement', response: null },
    // Groupe 4: Infrastructure réseau
    { id: '4.1', text: 'Redondance réseau', group: 'Infrastructure réseau', response: null },
    { id: '4.2', text: 'Sécurité périmétrique', group: 'Infrastructure réseau', response: null },
    { id: '4.3', text: 'Monitoring réseau', group: 'Infrastructure réseau', response: null },
    { id: '4.4', text: 'Documentation réseau', group: 'Infrastructure réseau', response: null },
    { id: '4.5', text: 'Plans de continuité', group: 'Infrastructure réseau', response: null },
  ]);

  const [, setLocation] = useLocation();
  const { generateRecommendations, isLoading: apiIsLoading } = useAnthropic();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateGroupScore = (groupName: string) => {
    const groupQuestions = questions.filter(q => q.group === groupName);
    const repondues = groupQuestions.filter(q => q.response !== null);
    const conformes = repondues.filter(q => q.response === 'conforme');

    return {
      score: repondues.length === 0 ? 0 : (conformes.length / repondues.length) * 100,
      repondu: (repondues.length / groupQuestions.length) * 100,
      nom: groupName
    };
  };

  const getGlobalScore = () => {
    const repondues = questions.filter(q => q.response !== null);
    const conformes = repondues.filter(q => q.response === 'conforme');

    return {
      score: repondues.length === 0 ? 0 : (conformes.length / repondues.length) * 100,
      repondu: (repondues.length / questions.length) * 100,
      nom: 'Global'
    };
  };

  const handleGenerateRecommendations = async () => {
    try {
      console.log("Début de la génération des recommandations");
      setIsGenerating(true);

      // Vérifier si au moins une question a été répondue
      const hasResponses = questions.some(q => q.response !== null);
      if (!hasResponses) {
        toast({
          title: "Attention",
          description: "Veuillez répondre à au moins une question avant de générer les recommandations",
          variant: "destructive"
        });
        return;
      }

      // Préparer les données d'audit
      const auditData = {
        infrastructure: {
          questionnaire: {
            resultats: questions.reduce((acc, q) => ({
              ...acc,
              [q.group]: {
                ...acc[q.group],
                [q.text]: q.response
              }
            }), {} as Record<string, any>),
            scores: {
              global: getGlobalScore(),
              parGroupe: {
                'Sécurité physique': calculateGroupScore('Sécurité physique'),
                'Infrastructure électrique': calculateGroupScore('Infrastructure électrique'),
                'Refroidissement': calculateGroupScore('Refroidissement'),
                'Infrastructure réseau': calculateGroupScore('Infrastructure réseau')
              }
            }
          }
        }
      };

      console.log("Données d'audit préparées:", JSON.stringify(auditData, null, 2));

      const result = await generateRecommendations({ 
        auditData,
        options: {
          model: "claude-3-sonnet-20241022",
          temperature: 0.7,
          maxTokens: 2000
        }
      });

      console.log("Résultat reçu:", result);

      if (result?.text) {
        localStorage.setItem('recommendationsData', JSON.stringify({
          recommendations: result.text,
          auditData
        }));

        toast({
          title: "Succès",
          description: "Les recommandations ont été générées avec succès",
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

  const processRecommendations = (text: string) => {
    // Implémentation du système de priorité basé sur le code Python
    const priorities = {
      critical: (impact: number) => impact > 0.8,
      high: (impact: number) => 0.5 < impact && impact <= 0.8,
      medium: (impact: number) => 0.3 < impact && impact <= 0.5,
      low: (impact: number) => impact <= 0.3
    };

    //  This is a placeholder.  A robust implementation would require more sophisticated NLP techniques
    //  to extract impact scores and apply priorities.  This example simply returns the original text.
    return text;
  };

  const updateQuestionResponse = (id: string, response: 'conforme' | 'non-conforme') => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, response } : q
    ));
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
      <ProgressScoreCard
        title="Résultats de l'Évaluation"
        globalScore={getGlobalScore()}
        groupScores={[
          'Sécurité physique',
          'Infrastructure électrique',
          'Refroidissement',
          'Infrastructure réseau'
        ].map(group => calculateGroupScore(group))}
      />

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
                {questions
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
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsView;