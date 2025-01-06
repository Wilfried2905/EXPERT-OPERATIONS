import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

export async function generateRecommendations(req: any, res: any) {
  try {
    const auditData = req.body;

    // 1. Validation des données d'entrée
    if (!auditData) {
      throw new Error('Données d\'audit manquantes');
    }

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées conformes aux normes EN 50600, ISO/IEC, et TIA-942.

DONNÉES D'AUDIT :
${JSON.stringify(auditData, null, 2)}

FORMAT DE RÉPONSE :
Génère une réponse au format JSON uniquement, sans texte additionnel.
La réponse doit contenir un tableau de recommandations avec les champs suivants :
- id: string (identifiant unique)
- title: string (titre de la recommandation)
- description: string (description détaillée)
- priority: "critical" | "high" | "medium" | "low"
- impact: object (impact sur différents aspects)
- implementation: object (étapes de mise en œuvre)`;

    // 2. Configuration correcte de l'appel à l'API Anthropic
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt,
      }],
      temperature: 0.7
    });

    // 3. Validation de la réponse
    if (!response.content?.[0]?.text) {
      throw new Error('Format de réponse invalide de l\'API Anthropic');
    }

    // 4. Parsing avec gestion d'erreur détaillée
    try {
      const recommendations = JSON.parse(response.content[0].text);

      // 5. Validation du format des recommandations
      if (!Array.isArray(recommendations?.recommendations)) {
        throw new Error('Format des recommandations invalide');
      }

      res.json(recommendations);
    } catch (parseError: any) {
      console.error("Erreur de parsing:", parseError, "Response:", response.content[0].text);
      res.status(500).json({
        error: "Erreur lors du parsing des recommandations",
        details: parseError.message
      });
    }
  } catch (error: any) {
    console.error("Erreur complète:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erreur lors de la génération des recommandations',
      type: 'RECOMMENDATION_GENERATION_ERROR'
    });
  }
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  try {
    console.log('[Word] Starting document generation with content length:', content.length);

    // Create document with basic structure
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          new Paragraph({
            text: "3R TECHNOLOGIE",
            heading: HeadingLevel.TITLE,
            spacing: { before: 700, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: new Date().toLocaleDateString('fr-FR'),
            spacing: { before: 200, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          // Content sections
          ...content.split('\n').map(line => 
            new Paragraph({
              text: line,
              spacing: { before: 200, after: 200 },
            })
          )
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

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Endpoint pour les recommandations
  app.post("/api/recommendations", generateRecommendations);

  // Endpoint pour la génération de documents
  app.post("/api/documents/generate", async (req, res) => {
    try {
      console.log('[Documents] Starting generation');
      const { type, clientInfo, content } = req.body;

      if (!type || !clientInfo) {
        return res.status(400).json({ error: 'Données requises manquantes' });
      }

      const documentTitle = `3R_${type}_${clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '')}`;

      // Add timeout for document generation
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout lors de la génération')), 30000)
      );

      const generationPromise = generateWordDocument(content || '', documentTitle);
      const wordBuffer = await Promise.race([generationPromise, timeoutPromise]);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
      res.setHeader('Content-Length', wordBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      res.send(wordBuffer);

    } catch (error: any) {
      console.error('[Documents] Generation error:', error);
      res.status(500).json({
        error: 'Erreur lors de la génération du document',
        details: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}