import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: {
    description: string;
    metrics: {
      efficiency: number;
      reliability: number;
      security: number;
    };
  };
  implementation: {
    steps: string[];
    timeframe: string;
    resources: string[];
  };
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    totalImpact: {
      efficiency: number;
      reliability: number;
      security: number;
    };
  };
}

interface ApiResponse {
  success: boolean;
  data?: RecommendationsResponse;
  error?: string;
  details?: string;
}

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async (auditData: any): Promise<RecommendationsResponse> => {
    console.log('[useAnthropic] Starting generateRecommendations with data:', auditData);
    setIsLoading(true);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditData })
      });

      console.log('[useAnthropic] Response status:', response.status);

      const result: ApiResponse = await response.json();
      console.log('[useAnthropic] Response data:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.details || result.error || `Erreur ${response.status}`);
      }

      if (!result.data || !result.data.recommendations) {
        throw new Error('Réponse invalide - données manquantes');
      }

      return result.data;

    } catch (error) {
      console.error('[useAnthropic] Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      toast({
        title: "Erreur",
        description: `Erreur lors de la génération des recommandations: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateRecommendations
  };
}