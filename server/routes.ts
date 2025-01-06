import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

async function generateRecommendations(req: any, res: any) {
  try {
    console.log('[Recommendations] Request received');
    console.log('[Recommendations] Headers:', req.headers);
    console.log('[Recommendations] Body:', JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.auditData) {
      console.log('[Recommendations] Missing audit data');
      return res.status(400).json({
        error: "Données d'audit requises manquantes"
      });
    }

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées.

    ${JSON.stringify(req.body.auditData, null, 2)}

    IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide ayant cette structure exacte:
    {
      "recommendations": [
        {
          "id": string,
          "title": string,
          "description": string,
          "priority": "critical" | "high" | "medium" | "low",
          "impact": {
            "description": string,
            "metrics": object
          },
          "implementation": {
            "steps": string[],
            "timeframe": string,
            "resources": string[]
          }
        }
      ]
    }`;

    console.log('[Anthropic] Sending request with prompt length:', prompt.length);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" }
    });

    console.log('[Anthropic] Response received');

    if (!response.content || !response.content[0]?.text) {
      throw new Error('Réponse invalide de l\'API');
    }

    try {
      const result = JSON.parse(response.content[0].text);
      console.log('[Recommendations] Parsed response:', result);

      res.setHeader('Content-Type', 'application/json');
      return res.json(result);
    } catch (parseError: any) {
      console.error('[Parse] Error:', parseError);
      console.error('[Parse] Raw response:', response.content[0].text);
      return res.status(500).json({
        error: 'Erreur de parsing',
        details: parseError.message
      });
    }
  } catch (error: any) {
    console.error('[Recommendations] Error:', error);
    return res.status(500).json({
      error: "Erreur lors de la génération des recommandations",
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  try {
    console.log('[Word] Starting generation');
    console.log('[Word] Content length:', content?.length);
    console.log('[Word] Title:', title);

    if (!content) {
      throw new Error('Contenu du document manquant');
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          new Paragraph({
            text: "3R TECHNOLOGIE",
            heading: HeadingLevel.TITLE,
            spacing: { before: 700, after: 400 },
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            alignment: AlignmentType.CENTER
          }),
          ...content.split('\n').map(line => 
            new Paragraph({
              text: line,
              spacing: { before: 200, after: 200 }
            })
          )
        ]
      }]
    });

    console.log('[Word] Document object created, generating buffer');
    const buffer = await Packer.toBuffer(doc);
    console.log('[Word] Buffer generated, size:', buffer.length);
    return buffer;

  } catch (error) {
    console.error('[Word] Generation error:', error);
    throw error;
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/recommendations", generateRecommendations);

  app.post("/api/documents/generate", async (req, res) => {
    try {
      console.log('[Documents] Request received');
      console.log('[Documents] Headers:', req.headers);
      console.log('[Documents] Body:', JSON.stringify(req.body, null, 2));

      const { type, title, clientInfo, content, auditData } = req.body;

      if (!type || !clientInfo || !content || !auditData) {
        console.log('[Documents] Missing required data:', { type, clientInfo, content, auditData });
        return res.status(400).json({
          error: 'Données requises manquantes'
        });
      }

      const documentTitle = `3R_${type}_${clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '')}`;
      console.log('[Documents] Generating document:', documentTitle);

      const wordBuffer = await generateWordDocument(content, documentTitle);
      console.log('[Documents] Document generated, sending response');

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
      res.setHeader('Content-Length', wordBuffer.length);
      res.send(wordBuffer);

    } catch (error: any) {
      console.error('[Documents] Error:', error);
      res.status(500).json({
        error: 'Erreur de génération',
        details: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}