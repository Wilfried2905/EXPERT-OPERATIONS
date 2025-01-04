import { Anthropic } from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

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
    additionalData?: {
      images?: string[];
      documents?: string[];
      comments?: string[];
    };
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      if (retries > 0) {
        const delayTime = initialDelay * Math.pow(2, retries - 1);
        await delay(delayTime);
        console.log(`[Retry] Attempt ${retries + 1}/${maxRetries} after ${delayTime}ms delay`);
      }
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`[Retry] Error on attempt ${retries + 1}:`, error);
      retries++;
      continue;
    }
  }

  throw lastError;
}

function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel et accessible aux non-experts basé sur les informations suivantes.
Utilisez un langage clair et précis, en expliquant les termes techniques lorsque nécessaire.

POINT PRIORITAIRE :
Il est IMPÉRATIF d'utiliser et de faire référence à la norme TIA-942 et ses normes affiliées tout au long de la rédaction.
Toutes les recommandations, analyses et spécifications techniques doivent être alignées avec les exigences de la norme TIA-942.

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%

Instructions spécifiques:
1. Rédigez de manière professionnelle tout en restant accessible aux lecteurs non-experts
2. Expliquez brièvement les termes techniques à leur première apparition
3. Utilisez des exemples concrets pour illustrer les concepts complexes
4. Pour chaque section technique, citez les exigences spécifiques de la norme TIA-942 applicables
5. Détaillez comment les solutions proposées répondent aux critères de la norme TIA-942
6. Incluez les références aux normes affiliées pertinentes (électrique, climatisation, sécurité, etc.)

Format de sortie souhaité :
- Formatez le texte en sections clairement identifiées
- Utilisez des titres et sous-titres pour la structure
- Insérez des paragraphes pour la lisibilité
- Incluez des puces pour les listes`;

  return baseContext;
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
        }),
        ...content.split('\n').map(line => {
          if (line.startsWith('#')) {
            return new Paragraph({
              text: line.replace(/^#+\s/, ''),
              heading: HeadingLevel.HEADING_1,
            });
          } else if (line.startsWith('-')) {
            return new Paragraph({
              text: line,
              bullet: {
                level: 0
              }
            });
          } else {
            return new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 24,
                })
              ]
            });
          }
        })
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function generateDocument(input: DocumentGenerationInput): Promise<Buffer> {
  try {
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('VITE_ANTHROPIC_API_KEY is not set');
    }

    const anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(input);
    console.log(`[Generation] Starting generation for ${input.type}`);

    const response = await retryWithExponentialBackoff(async () => {
      console.log('[API] Sending request to Anthropic API...');
      // the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
      const result = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      if (!result.content || result.content.length === 0) {
        throw new Error('Empty response from Anthropic API');
      }

      const content = result.content[0];
      if (!('text' in content)) {
        throw new Error('Unexpected response format from Anthropic API');
      }

      return content.text;
    });

    // Génération du document Word
    console.log('[Document] Generating Word document...');
    const documentTitle = `3R ${input.type} - ${input.clientInfo.name}`;
    const wordBuffer = await generateWordDocument(response, documentTitle);
    console.log('[Document] Word document generated successfully');

    return wordBuffer;
  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    throw new Error('Une erreur est survenue lors de la génération du document. Veuillez réessayer.');
  }
}