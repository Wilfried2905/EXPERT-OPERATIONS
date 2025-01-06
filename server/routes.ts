import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
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

    // Structurer le prompt pour une réponse JSON
    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées en te basant sur les standards TIA-942.

    DONNÉES D'ENTRÉE:
    ${JSON.stringify(req.body.auditData, null, 2)}

    IMPORTANT: Tu dois répondre UNIQUEMENT avec un objet JSON valide ayant cette structure exacte:
    {
      "recommendations": [
        {
          "id": string (unique identifier),
          "title": string (titre court et descriptif),
          "description": string (description détaillée),
          "priority": "critical" | "high" | "medium" | "low",
          "impact": {
            "description": string (description de l'impact),
            "metrics": {
              "efficiency": number (0-100),
              "reliability": number (0-100),
              "security": number (0-100)
            }
          },
          "implementation": {
            "steps": string[] (étapes d'implémentation),
            "timeframe": string (durée estimée),
            "resources": string[] (ressources nécessaires)
          }
        }
      ],
      "summary": {
        "criticalCount": number,
        "highCount": number,
        "mediumCount": number,
        "lowCount": number,
        "totalImpact": {
          "efficiency": number (0-100),
          "reliability": number (0-100),
          "security": number (0-100)
        }
      }
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
      // Parse et valider la réponse JSON
      const result = JSON.parse(response.content[0].text);

      // Validation de base de la structure
      if (!result.recommendations || !Array.isArray(result.recommendations)) {
        throw new Error('Structure de réponse invalide');
      }

      console.log('[Recommendations] Parsed response:', JSON.stringify(result, null, 2));

      // Définir les headers de réponse
      res.setHeader('Content-Type', 'application/json');
      return res.json({
        success: true,
        data: result
      });

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

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Route de génération des recommandations
  app.post("/api/recommendations", generateRecommendations);

  // Autres routes...

  const httpServer = createServer(app);
  return httpServer;
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