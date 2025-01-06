import type { Document } from 'docx';
import { DocumentGenerator } from './documentGenerator';
import type { DocumentData } from '@/types/document';

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

export async function generateDocument(input: DocumentData): Promise<Blob> {
  console.log('[Generation] Starting document generation process');

  try {
    const generator = new DocumentGenerator();
    const buffer = await generator.generateDocument(input);

    // Convertir le buffer en Blob
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  } catch (error) {
    console.error('[Generation] Error:', error);
    throw new Error('Erreur lors de la génération du document');
  }
}