import type { Document } from 'docx';
import type { DocumentData } from '@/types/document';

export async function generateDocument(input: DocumentData): Promise<Blob> {
  console.log('[Generation] Starting document generation process', input);

  try {
    console.log('[Generation] Sending request to /api/documents/generate');
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });

    console.log('[Generation] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Generation] Error response:', errorData);

      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(parsedError.details || parsedError.error || 'Erreur lors de la génération du document');
      } catch (parseError) {
        console.error('[Generation] Error parsing error response:', parseError);
        throw new Error(`Erreur serveur: ${errorData}`);
      }
    }

    console.log('[Generation] Getting response blob');
    const blob = await response.blob();
    console.log('[Generation] Blob size:', blob.size);

    return blob;
  } catch (error) {
    console.error('[Generation] Error:', error);
    throw error;
  }
}

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