import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';

// Initialisation du client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateRecommendations(req: any, res: any) {
  try {
    console.log('[Recommendations] Starting recommendation generation');

    if (!req.body || !req.body.auditData) {
      return res.status(400).json({
        error: "Données d'audit requises manquantes"
      });
    }

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées en français.
    Ta réponse doit être un objet JSON valide avec la structure suivante:
    {
      "recommendations": [
        {
          "titre": "string",
          "description": "string",
          "priorite": "critique" | "haute" | "moyenne" | "basse",
          "impact": {
            "cout": number,
            "performance": number,
            "conformite": number
          },
          "delai": "immediat" | "court_terme" | "moyen_terme" | "long_terme",
          "actions": string[]
        }
      ]
    }

    Important: Ta réponse doit être uniquement le JSON demandé, sans texte supplémentaire.

    Données d'audit à analyser:
    ${JSON.stringify(req.body.auditData, null, 2)}`;

    console.log('[Recommendations] Sending request to Anthropic');

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      system: "Tu es un expert en audit de datacenters. Tu dois toujours répondre avec un JSON valide selon le format demandé."
    });

    if (!response.content || !response.content[0]) {
      throw new Error('Réponse invalide de l\'API Anthropic');
    }

    const content = response.content[0].text;
    if (!content) {
      throw new Error('Contenu de la réponse manquant');
    }

    console.log('[Recommendations] Parsing response');
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('[Recommendations] JSON parse error:', parseError);
      throw new Error('La réponse n\'est pas un JSON valide');
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({ text: JSON.stringify(jsonResponse) });

  } catch (error: any) {
    console.error('[Recommendations] Error:', error);
    res.status(500).json({
      error: "Erreur lors de la génération des recommandations",
      details: error.message
    });
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Route de génération des recommandations
  app.post("/api/anthropic/recommendations", generateRecommendations);

  const httpServer = createServer(app);
  return httpServer;
}