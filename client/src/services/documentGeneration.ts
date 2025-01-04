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
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`[Retry] Error on attempt ${retries + 1}:`, error);
      if (retries < maxRetries - 1) {
        const delayTime = initialDelay * Math.pow(2, retries);
        console.log(`[Retry] Waiting ${delayTime}ms before next attempt`);
        await delay(delayTime);
      }
      retries++;
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
Agissez en tant qu'expert en datacenters et infrastructure IT, génération d'un document professionnel basé sur ces informations :

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%

INSTRUCTIONS IMPORTANTES:
1. Rédigez le document en français
2. Utilisez un style professionnel mais accessible
3. Expliquez les termes techniques
4. Référencez systématiquement la norme TIA-942
5. Structurez le document avec des sections claires
6. Incluez des recommandations basées sur les données d'audit

FORMAT DU DOCUMENT:
- Démarrez chaque section principale par "# Titre"
- Utilisez "## Sous-titre" pour les sous-sections
- Utilisez des listes à puces avec "-" pour les énumérations
`;

  return baseContext;
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  try {
    console.log('[Word] Starting document generation with content length:', content.length);

    const sections = content.split('\n').reduce((acc, line) => {
      if (line.trim().startsWith('# ')) {
        acc.push({
          type: 'heading1',
          text: line.replace('# ', '').trim()
        });
      } else if (line.trim().startsWith('## ')) {
        acc.push({
          type: 'heading2',
          text: line.replace('## ', '').trim()
        });
      } else if (line.trim().startsWith('- ')) {
        acc.push({
          type: 'bullet',
          text: line.replace('- ', '').trim()
        });
      } else if (line.trim()) {
        acc.push({
          type: 'paragraph',
          text: line.trim()
        });
      }
      return acc;
    }, [] as Array<{type: string, text: string}>);

    console.log('[Word] Created', sections.length, 'document sections');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 400
            }
          }),
          ...sections.map(section => {
            switch (section.type) {
              case 'heading1':
                return new Paragraph({
                  text: section.text,
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 }
                });
              case 'heading2':
                return new Paragraph({
                  text: section.text,
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 200 }
                });
              case 'bullet':
                return new Paragraph({
                  children: [new TextRun({ text: section.text })],
                  bullet: { level: 0 },
                  spacing: { before: 100, after: 100 }
                });
              default:
                return new Paragraph({
                  children: [new TextRun({ text: section.text })],
                  spacing: { before: 100, after: 100 }
                });
            }
          })
        ],
      }],
    });

    console.log('[Word] Document object created, starting buffer generation');
    const buffer = await Packer.toBuffer(doc);
    console.log('[Word] Buffer generated successfully, size:', buffer.length);
    return buffer;
  } catch (error) {
    console.error('[Word] Error generating document:', error);
    throw new Error('Erreur lors de la génération du document Word');
  }
}

export async function generateDocument(input: DocumentGenerationInput): Promise<Buffer> {
  try {
    console.log('[Generation] Starting document generation process');

    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('Clé API Anthropic manquante');
    }

    const anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(input);
    console.log('[Anthropic] Sending request to API');

    const response = await retryWithExponentialBackoff(async () => {
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
        throw new Error('Réponse vide de l\'API Anthropic');
      }

      const content = result.content[0];
      if (!('text' in content)) {
        throw new Error('Format de réponse incorrect de l\'API Anthropic');
      }

      return content.text;
    });

    console.log('[Anthropic] Received response, length:', response.length);

    const documentTitle = `3R ${input.type} - ${input.clientInfo.name}`;
    console.log('[Word] Starting Word document generation');
    const wordBuffer = await generateWordDocument(response, documentTitle);
    console.log('[Word] Document generated successfully');

    return wordBuffer;
  } catch (error) {
    console.error('[Error] Document generation failed:', error);
    if (error instanceof Error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue');
  }
}