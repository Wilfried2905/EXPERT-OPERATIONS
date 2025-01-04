import type { Document } from 'docx';
import { useToast } from '@/hooks/use-toast';

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

// Interface pour les données d'entrée
interface DocumentGenerationInput {
  type: DocumentType;
  clientInfo: {
    name: string;
    industry: string;
    size: string;
  };
  auditData: {
    recommendations: any[];
    metrics: {
      pue: number[];
      availability: number[];
      tierLevel: number;
      complianceGaps: string[];
    };
    infrastructure: {
      rooms: any[];
      equipment: any[];
    };
    compliance: {
      matrix: any;
      score: number;
    };
  };
}

export async function generateDocument(input: DocumentGenerationInput): Promise<void> {
  const { toast } = useToast();
  const toastId = 'document-generation';

  try {
    console.log('[Generation] Starting document generation process');

    // Afficher le toast de chargement
    toast({
      id: toastId,
      title: 'Génération du document en cours',
      description: 'Veuillez patienter pendant la génération du document...',
      duration: null, // Le toast restera affiché jusqu'à ce qu'on le ferme
    });

    const response = await fetch('/api/anthropic/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la génération du document');
    }

    // Créer un blob à partir de la réponse
    const blob = await response.blob();

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = response.headers.get('content-disposition')?.split('filename=')[1].replace(/"/g, '') || 
                    `3R_${input.type}_${input.clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.docx`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Nettoyer
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Mettre à jour le toast pour indiquer le succès
    toast({
      id: toastId,
      title: 'Document généré avec succès',
      description: 'Le téléchargement devrait commencer automatiquement.',
      duration: 3000,
    });

    console.log('[Generation] Document generated and download started');
  } catch (error) {
    console.error('[Error] Document generation failed:', error);

    // Mettre à jour le toast pour indiquer l'erreur
    toast({
      id: toastId,
      title: 'Erreur de génération',
      description: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
      variant: 'destructive',
      duration: 5000,
    });

    throw error;
  }
}