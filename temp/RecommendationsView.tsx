// client/src/components/dashboard/RecommendationsView.tsx
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
  console.log("RecommendationsView: Composant en cours de montage");

  useEffect(() => {
    console.log("RecommendationsView: Composant monté");
    return () => {
      console.log("RecommendationsView: Composant démonté");
    };
  }, []);

  const [questions, setQuestions] = useState<Question[]>([
    // Groupe 1: Sécurité physique
    { id: '1.1', text: 'Contrôle d\'accès aux salles serveurs', group: 'Sécurité physique', response: null },
    { id: '1.2', text: 'Système de vidéosurveillance', group: 'Sécurité physique', response: null },
    // ... autres questions
  ]);

  const [, setLocation] = useLocation();
  const { generateRecommendations, isLoading, setIsLoading } = useAnthropic();
  const { toast } = useToast();

  console.log("RecommendationsView: Hook useAnthropic chargé:", { isLoading });

  const handleGenerateRecommendations = async () => {
    console.log("RecommendationsView: Démarrage de handleGenerateRecommendations");

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
    console.log("RecommendationsView: Données d'audit préparées:", auditData);

    try {
      console.log("RecommendationsView: Tentative d'envoi des données");
      const result = await generateRecommendations({ auditData });
      console.log("RecommendationsView: Réponse reçue:", result);

      if (result.text) {
        localStorage.setItem('recommendationsData', JSON.stringify({
          recommendations: result.text,
          auditData
        }));
        console.log("RecommendationsView: Redirection vers /recommendations-detail");
        setLocation('/recommendations-detail');
      }
    } catch (error) {
      console.error("RecommendationsView: Erreur lors de la génération:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération des recommandations',
        variant: "destructive"
      });
    }
  };

  const onButtonClick = () => {
    console.log("RecommendationsView: Clic sur le bouton détecté");
    handleGenerateRecommendations();
  };

  // ... reste du code du composant (render, etc.)
};

export default RecommendationsView;
