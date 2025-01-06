import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateDocument } from '@/services/documentGeneration';
import type { DocumentData } from '@/types/document';

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRecommendations = useCallback(async () => {
    try {
      console.log('[Recommendations] Starting request');
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Example audit data structure
          metrics: {
            pue: [1.8, 1.9, 1.7],
            availability: [99.9, 99.8, 99.95],
            tierLevel: 3
          },
          infrastructure: {
            totalArea: 1000,
            rooms: [],
            equipment: []
          }
        })
      });

      console.log('[Recommendations] Response status:', response.status);
      const responseText = await response.text();
      console.log('[Recommendations] Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Server error: ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        return data;
      } catch (parseError) {
        console.error('[Recommendations] Parse error:', parseError);
        console.error('[Recommendations] Response text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('[Recommendations] Error:', error);
      throw error;
    }
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('[Download] Starting process', { docKey, docTitle });

    if (isGenerating) {
      console.log('[Download] Generation already in progress');
      return;
    }

    const toastId = toast({
      title: "Génération en cours",
      description: "Préparation du document...",
      duration: 0
    });

    try {
      setIsGenerating(true);
      console.log('[Download] Preparing document data');

      const input: DocumentData = {
        title: docTitle,
        type: docKey,
        clientInfo: {
          name: 'Client Test',
          industry: 'Technologie',
          size: 'Grande entreprise'
        },
        metadata: {
          date: new Date().toISOString(),
          version: '1.0',
          author: '3R TECHNOLOGIE'
        },
        content: 'Contenu test du document'
      };

      console.log('[Download] Generating document with input:', input);
      const blob = await generateDocument(input);

      console.log('[Download] Document generated, starting download');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle}_${new Date().toISOString().split('T')[0]}.docx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast({
        title: "Succès",
        description: "Document généré avec succès",
        duration: 3000,
      });

    } catch (error: any) {
      console.error('[Download] Error details:', {
        error,
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      toast.dismiss(toastId);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération du document",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return { handleDownload, handleRecommendations };
}