import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateRecommendations } from './anthropic';

export function registerRoutes(app: Express): Server {
  // Route de génération des recommandations
  app.post("/api/recommendations", generateRecommendations);

  const httpServer = createServer(app);
  return httpServer;
}