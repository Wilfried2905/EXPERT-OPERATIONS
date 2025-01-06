import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
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

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées.

    ${JSON.stringify(req.body.auditData, null, 2)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7
    });

    if (!response.content || !response.content[0]?.text) {
      throw new Error('Réponse invalide de l\'API');
    }

    res.setHeader('Content-Type', 'application/json');
    res.json({ text: response.content[0].text });

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
  app.post("/api/recommendations", generateRecommendations);

  // Autres routes...
  const httpServer = createServer(app);
  return httpServer;
}