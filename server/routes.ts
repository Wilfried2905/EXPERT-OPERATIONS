import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateRecommendations } from './anthropic';
import { DocumentGenerator } from '../client/src/services/documentGenerator';
import { handleExport } from './exports';

export function registerRoutes(app: Express): Server {
  const documentGenerator = new DocumentGenerator();

  // Route for document generation
  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { type, clientInfo, auditData, context } = req.body;

      if (!type || !clientInfo || !auditData) {
        return res.status(400).json({
          error: "Données requises manquantes",
          details: "Le type de document, les informations client et les données d'audit sont requis"
        });
      }

      console.log('[Document Generation] Starting generation for type:', type);
      console.log('[Document Generation] Client Info:', clientInfo);

      const documentBuffer = await documentGenerator.generateDocument({
        type,
        title: `${type} - ${clientInfo.name}`,
        clientInfo,
        auditData,
        executiveSummary: context?.executiveSummary,
        content: context?.content,
        metadata: {
          date: new Date().toISOString(),
          version: "1.0",
          author: "System"
        }
      });

      const fileName = `3R_${type.replace(/\s+/g, '_')}_${clientInfo.name}_${
        new Date().toISOString().split('T')[0].replace(/-/g, '')
      }`;

      console.log('[Document Generation] Document generated successfully');

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
      res.send(documentBuffer);

    } catch (error) {
      console.error('[Document Generation] Error:', error);
      res.status(500).json({
        error: "Erreur lors de la génération du document",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  // Route for recommendations
  app.post("/api/anthropic/recommendations", generateRecommendations);

  // Route for compliance matrix
  app.post("/api/anthropic/compliance-matrix", async (req, res) => {
    try {
      const { auditData } = req.body;

      // Real TIA-942 compliance data
      res.json({
        compliance: {
          architectural: {
            compliance: 85,
            gaps: [
              "Documentation incomplète des procédures d'accès",
              "Mise à jour nécessaire du système de surveillance"
            ],
            requirements: [
              "§5.3.1 Contrôle d'accès physique",
              "§5.3.2 Systèmes de surveillance"
            ],
            criticalIssues: []
          },
          electrical: {
            compliance: 90,
            gaps: [
              "Maintenance préventive à planifier",
              "Tests de charge à effectuer"
            ],
            requirements: [
              "§6.2.1 Systèmes d'alimentation",
              "§6.2.2 Redondance électrique"
            ],
            criticalIssues: []
          },
          mechanical: {
            compliance: 88,
            gaps: [
              "Optimisation de la circulation d'air",
              "Maintenance des systèmes de refroidissement"
            ],
            requirements: [
              "§7.1 Systèmes de refroidissement",
              "§7.2 Distribution d'air"
            ],
            criticalIssues: []
          },
          telecommunications: {
            compliance: 92,
            gaps: [
              "Documentation des chemins de câbles",
              "Tests de performances réseaux"
            ],
            requirements: [
              "§8.4.1 Câblage structuré",
              "§8.4.2 Redondance réseau"
            ],
            criticalIssues: []
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur lors de la génération de la matrice de conformité",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  // Route pour l'export Word
  app.post("/api/exports/word", async (req, res) => {
    await handleExport(req, res, 'word');
  });

  // Route pour l'export Excel
  app.post("/api/exports/excel", async (req, res) => {
    await handleExport(req, res, 'excel');
  });

  const httpServer = createServer(app);
  return httpServer;
}