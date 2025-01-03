// client/src/hooks/use-anthropic.ts
import { useState } from 'react';
import { useToast } from './use-toast';

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
      console.log('useAnthropic: Préparation de la requête');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context)
      };
      console.log('useAnthropic: Options de la requête:', requestOptions);

      console.log('useAnthropic: Envoi de la requête à /api/anthropic/recommendations');
      const response = await fetch('/api/anthropic/recommendations', requestOptions);

      console.log('useAnthropic: Status de la réponse:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('useAnthropic: Erreur de la réponse:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('useAnthropic: Réponse reçue:', result);

      if (!result.text && !result.error) {
        console.error('useAnthropic: Réponse invalide - pas de texte ni d\'erreur');
        throw new Error('Réponse invalide du serveur');
      }

      if (result.error) {
        console.error('useAnthropic: Erreur dans la réponse:', result.error);
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('useAnthropic: Erreur détaillée:', error);
      throw error;
    } finally {
      console.log('useAnthropic: Fin de generateRecommendations');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    generateRecommendations
  };
}
