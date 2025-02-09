// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateRecommendations } from "./anthropic";

export function registerRoutes(app: Express): Server {
  // Anthropic API routes
  app.post("/api/anthropic/recommendations", async (req, res) => {
    console.log("=== Nouvelle requête de recommandations ===");
    console.log("Corps de la requête:", JSON.stringify(req.body, null, 2));
    console.log("URL:", req.url);
    console.log("Méthode:", req.method);

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("Erreur: Clé API Anthropic manquante");
      return res.status(500).json({ error: "Configuration Anthropic manquante" });
    }

    try {
      await generateRecommendations(req, res);
    } catch (error) {
      console.error("Erreur lors de la génération des recommandations:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération des recommandations' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
