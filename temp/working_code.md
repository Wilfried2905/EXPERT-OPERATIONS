# Codes fonctionnels pour les recommandations et le téléchargement

## 1. server/routes.ts - Partie API Recommandations
```typescript
async function generateRecommendations(req: any, res: any) {
  try {
    console.log('[Recommendations] Starting recommendation generation');

    if (!req.body || !req.body.auditData) {
      return res.status(400).json({
        error: "Données d'audit requises manquantes"
      });
    }

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées.

    ${JSON.stringify(req.body.auditData, null, 2)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7
    });

    if (!response.content || !response.content[0]?.text) {
      throw new Error('Réponse invalide de l\'API');
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({ text: response.content[0].text });

  } catch (error: any) {
    console.error('[Recommendations] Error:', error);
    res.status(500).json({
      error: "Erreur lors de la génération des recommandations",
      details: error.message
    });
  }
}
```

## 2. client/src/hooks/use-anthropic.ts - Hook pour les recommandations
```typescript
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
```

## 3. DocumentNavigation.tsx - Partie téléchargement
```typescript
const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.stopPropagation();
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const toastId = toast({
        title: "Génération en cours",
        description: "Veuillez patienter pendant la génération du document...",
        duration: null,
      });

      const input = {
        type: docKey === 'offreTechnique'
          ? DocumentType.TECHNICAL_OFFER
          : docKey === 'cahierCharges'
            ? DocumentType.SPECIFICATIONS
            : DocumentType.AUDIT_REPORT,
        clientInfo: {
          name: clientName,
          industry: "Technologie",
          size: "Grande entreprise"
        },
        auditData: {
          recommendations: [],
          metrics: {
            pue: [1.8, 1.9, 1.7],
            availability: [99.9, 99.8, 99.95],
            tierLevel: 3,
            complianceGaps: ['Documentation incomplète', 'Processus non formalisés']
          },
          infrastructure: {
            rooms: [],
            equipment: []
          },
          compliance: {
            matrix: {},
            score: 85
          }
        }
      };

      const blob = await generateDocument(input);
      const fileName = generateFileName(docTitle);
      await handleFileDownload(blob, fileName);

      toast.dismiss(toastId);
      toast({
        title: "Document généré",
        description: "Le document a été généré et téléchargé avec succès",
        duration: 3000,
      });

    } catch (error) {
      console.error('[Download] Error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
}, [clientName, generateFileName, isGenerating, toast]);
```
