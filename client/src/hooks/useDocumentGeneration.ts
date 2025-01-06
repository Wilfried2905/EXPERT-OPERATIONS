import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { withRetry, logError, handleAPIError } from '@/lib/errorHandling';
import { generateDocument } from '@/services/documentGeneration';
import type { DocumentData } from '@/types/document';

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.stopPropagation();
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Notification avec progress
      const toastId = toast({
        title: "Génération en cours",
        description: "Préparation des données...",
        duration: null,
      });

      // Collecte et validation des données
      const input: DocumentData = await withRetry(
        async () => ({
          type: docKey,
          title: docTitle,
          clientInfo: {
            name: "Client Test", // À remplacer par les vraies données
            industry: "Technology",
            size: "Enterprise"
          },
          metadata: {
            date: new Date().toISOString(),
            version: "1.0",
            author: "3R TECHNOLOGIE"
          }
        }),
        {
          context: 'DataCollection',
          maxRetries: 3,
          onError: (error, attempt) => {
            toast({
              title: "Erreur de collecte",
              description: `Tentative ${attempt}/3 - ${error.message}`,
              variant: "destructive",
            });
          }
        }
      );

      // Mise à jour du statut
      toast.update(toastId, {
        description: "Génération du document...",
      });

      // Génération du document avec retry
      const blob = await withRetry(
        () => generateDocument(input),
        {
          context: 'DocumentGeneration',
          maxRetries: 3
        }
      );

      // Téléchargement sécurisé
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle}.docx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Notification de succès
      toast.dismiss(toastId);
      toast({
        title: "Document généré",
        description: "Le document a été généré et téléchargé avec succès",
        duration: 3000,
      });

    } catch (error) {
      logError('DocumentGeneration', error);
      handleAPIError(error);
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return { handleDownload, isGenerating };
}
