import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateDocument } from '@/services/documentGeneration';
import type { DocumentData } from '@/types/document';

export function useDocumentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.stopPropagation();
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const toastId = toast({
        title: "Génération en cours",
        description: "Préparation du document...",
        duration: null,
      });

      // 1. Validation des entrées
      const input = {
        type: docKey === 'offreTechnique' 
          ? 'Offre Technique'
          : docKey === 'cahierCharges'
            ? 'Cahier des Charges'
            : 'Rapport d\'Audit',
        clientInfo: {
          name: 'Client Test',
          industry: "Technologie",
          size: "Grande entreprise"
        },
        content: "Contenu du document"
      };

      // 2. Génération du document avec timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout lors de la génération')), 30000)
      );

      const generationPromise = generateDocument(input);
      const blob = await Promise.race([generationPromise, timeoutPromise]) as Blob;

      if (!blob) {
        throw new Error('Aucun document généré');
      }

      // 3. Téléchargement sécurisé
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docTitle}_${new Date().toISOString().split('T')[0]}.docx`;

      try {
        document.body.appendChild(link);
        link.click();
      } finally {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      toast.dismiss(toastId);
      toast({
        title: "Succès",
        description: "Document généré et téléchargé avec succès",
        duration: 3000,
      });

    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error 
          ? `Erreur de génération : ${error.message}`
          : "Erreur lors de la génération du document",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return { handleDownload, isGenerating };
}