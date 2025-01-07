import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateRecommendations } from './anthropic';
import { exportToWord, exportToExcel } from './exports';

export function registerRoutes(app: Express): Server {
  // Route de génération des recommandations
  app.post("/api/recommendations", generateRecommendations);

  // Routes d'export
  app.post("/api/exports/word", exportToWord);
  app.post("/api/exports/excel", exportToExcel);

  const httpServer = createServer(app);
  return httpServer;
}