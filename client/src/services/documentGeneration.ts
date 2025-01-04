import type { Document } from 'docx';

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'TECHNICAL_OFFER',
  AUDIT_REPORT = 'AUDIT_REPORT',
  SPECIFICATIONS = 'SPECIFICATIONS'
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
  try {
    console.log('[Generation] Starting document generation process');

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
                    `3R_${input.type}_${input.clientInfo.name}_${new Date().toISOString().split('T')[0]}.docx`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Nettoyer
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log('[Generation] Document generated and download started');
  } catch (error) {
    console.error('[Error] Document generation failed:', error);
    if (error instanceof Error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue');
  }
}