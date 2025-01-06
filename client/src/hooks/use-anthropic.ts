import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AnthropicResponse {
  text: string;
  error?: string;
}

export function useAnthropic() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async (context: any): Promise<AnthropicResponse> => {
    console.log('useAnthropic: Démarrage de generateRecommendations avec context:', context);
    setIsLoading(true);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Erreur ${response.status}`);
      }

      if (!result.text && !result.error) {
        throw new Error('Réponse invalide du serveur');
      }

      return result;

    } catch (error) {
      console.error('useAnthropic: Erreur:', error);
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