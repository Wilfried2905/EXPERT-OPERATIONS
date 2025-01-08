import type { Express } from "express";
import { createServer, type Server } from "http";
import { DocumentGenerator } from '../client/src/services/documentGenerator';

export function registerRoutes(app: Express): Server {
  const documentGenerator = new DocumentGenerator();

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
        content: context?.content
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

  app.post("/api/exports/word", async (req, res) => {
    try {
      const { recommendations, clientInfo, auditType } = req.body;

      if (!recommendations || !clientInfo || !auditType) {
        return res.status(400).json({
          error: "Données manquantes pour l'export",
          details: "Les recommandations, les informations client et le type d'audit sont requis"
        });
      }

      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `3R_Recommandations_${auditType}_${clientInfo.name}_${currentDate}`;

      const wordBuffer = await exportToWord(recommendations, fileName);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
      res.send(wordBuffer);

    } catch (error) {
      console.error('Erreur dans l\'export Word:', error);
      res.status(500).json({
        error: "Erreur lors de l'export Word",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  app.post("/api/exports/excel", async (req, res) => {
    try {
      const { recommendations, clientInfo, auditType } = req.body;

      if (!recommendations || !clientInfo || !auditType) {
        return res.status(400).json({
          error: "Données manquantes pour l'export",
          details: "Les recommandations, les informations client et le type d'audit sont requis"
        });
      }

      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `3R_Recommandations_${auditType}_${clientInfo.name}_${currentDate}`;

      const excelBuffer = await exportToExcel(recommendations, fileName);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
      res.send(excelBuffer);

    } catch (error) {
      console.error('Erreur dans l\'export Excel:', error);
      res.status(500).json({
        error: "Erreur lors de l'export Excel",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  app.post("/api/anthropic/compliance-matrix", async (req, res) => {
    try {
      const { auditData } = req.body;
      res.json({
        compliance: {
          score: 85,
          matrix: {
            security: 0.8,
            documentation: 0.7,
            procedures: 0.9
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

  const httpServer = createServer(app);
  return httpServer;
}