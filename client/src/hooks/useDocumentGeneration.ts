import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { DocumentType } from '@/types/document';

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

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
      console.log('[Download] Preparing request data');

      const requestData = {
        type: docKey,
        clientInfo: {
          name: 'Client Test',
          industry: 'Technologie',
          size: 'Grande entreprise'
        },
        content: 'Contenu test du document'
      };

      console.log('[Download] Request data:', requestData);

      console.log('[Download] Sending request to server');
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('[Download] Server response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Download] Server error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Erreur de génération');
      }

      console.log('[Download] Getting response blob');
      const blob = await response.blob();
      console.log('[Download] Blob received, size:', blob.size);

      const url = window.URL.createObjectURL(blob);
      console.log('[Download] Blob URL created:', url);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle}_${new Date().toISOString().split('T')[0]}.docx`;

      console.log('[Download] Starting file download');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('[Download] Download completed');

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
      console.log('[Download] Process completed');
    }
  }, [isGenerating]);

  return { handleDownload, isGenerating };
}