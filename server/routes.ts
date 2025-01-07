import type { Express } from "express";
import { createServer, type Server } from "http";
import Anthropic from '@anthropic-ai/sdk';

// Initialisation du client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateRecommendations(req: any, res: any) {
  try {
    console.log("Received request body:", req.body);

    const { auditData } = req.body || {};

    // S'assurer que la réponse est toujours en JSON
    res.setHeader('Content-Type', 'application/json');

    // Validation basique avec réponse JSON
    if (!req.body) {
      return res.status(400).json({
        error: false,
        recommendations: [],
        message: "Aucune donnée fournie"
      });
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: "Génère des recommandations basées sur: " + JSON.stringify(auditData)
        }],
        temperature: 0.7
      });

      // Vérification de la réponse de l'API
      if (!response.content?.[0]?.text) {
        return res.status(500).json({
          error: true,
          message: "Réponse invalide de l'API"
        });
      }

      // Tentative de parse du JSON
      try {
        const recommendations = JSON.parse(response.content[0].text);
        return res.json({
          error: false,
          recommendations: recommendations
        });
      } catch (parseError) {
        console.error("Parse error:", parseError);
        // Si le parsing échoue, renvoyer le texte brut dans un format JSON valide
        return res.json({
          error: false,
          recommendations: [{
            id: "default",
            title: "Recommandation générale",
            description: response.content[0].text,
            priority: "medium"
          }]
        });
      }

    } catch (apiError) {
      console.error("API error:", apiError);
      return res.status(500).json({
        error: true,
        message: "Erreur lors de l'appel à l'API"
      });
    }

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: true,
      message: "Erreur serveur lors de la génération des recommandations"
    });
  }
}

export function registerRoutes(app: Express): Server {
  // Route de génération des recommandations
  app.post("/api/recommendations", generateRecommendations);

  const httpServer = createServer(app);
  return httpServer;
}