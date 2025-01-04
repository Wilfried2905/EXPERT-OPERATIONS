import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

function generatePrompt(input: any): string {
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
- Utilisez des listes à puces avec "-" pour les énumérations`;

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

async function generateDocumentHandler(req: any, res: any) {
  try {
    console.log('[Generate] Starting document generation');
    const input = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Clé API Anthropic manquante');
    }

    const prompt = generatePrompt(input);
    console.log('[Anthropic] Sending request to API');

    const result = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    if (!result.content || result.content.length === 0) {
      throw new Error('Réponse vide de l\'API Anthropic');
    }

    const content = result.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Format de réponse incorrect de l\'API Anthropic');
    }

    console.log('[Anthropic] Received response, length:', content.text.length);

    const documentTitle = `3R_${input.type}_${input.clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`;
    console.log('[Word] Starting Word document generation');
    const wordBuffer = await generateWordDocument(content.text, documentTitle);
    console.log('[Word] Document generated successfully');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
    res.send(wordBuffer);
  } catch (error) {
    console.error('[Error] Document generation failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue'
    });
  }
}

export async function generateRecommendations(req: any, res: any) {
  try {
    const auditData = req.body;
    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées conformes aux normes EN 50600 et ISO/IEC.

Données d'audit à analyser:
${JSON.stringify(auditData, null, 2)}

Instructions:
Génère une réponse STRICTEMENT au format JSON suivant ce schéma exact sans aucun texte additionnel:

{
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "normReference": {
        "code": "string",
        "description": "string",
        "requirement": "string"
      },
      "priority": "critical|high|medium|low",
      "timeFrame": "immediate|short_term|long_term",
      "impact": {
        "energyEfficiency": "number",
        "performance": "number",
        "compliance": "number",
        "details": {
          "energyEfficiency": "string",
          "performance": "string",
          "compliance": "string"
        }
      }
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ 
        role: "user", 
        content: prompt,
      }],
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    try {
      const recommendations = JSON.parse(response.content[0].text);
      res.json(recommendations);
    } catch (parseError) {
      console.error("Error parsing Anthropic response:", parseError);
      res.status(500).json({ 
        error: "Erreur lors du parsing de la réponse"
      });
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/profile-selected", (req, res) => {
    const { profileType, email } = req.body;
    console.log('Profile selected:', { profileType, email });
    res.json({ message: "Sélection de profil enregistrée" });
  });

  app.post("/api/anthropic/recommendations", generateRecommendations);
  app.post("/api/anthropic/document", generateDocumentHandler);

  const httpServer = createServer(app);
  return httpServer;
}