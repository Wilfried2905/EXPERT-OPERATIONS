import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateOperationalAuditPrompt } from '../client/src/services/audit-types/operational-audit';
import { exportToWord, exportToExcel } from './exports';

// Added helper function
async function generateDocumentContent(type: string, section: string, context: any) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.ANTHROPIC_API_KEY || ''
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      messages: [{
        role: "user",
        content: `En tant qu'expert en audit de datacenters, génère le contenu de la section "${section}" pour un document de type "${type}".

Contexte :
${JSON.stringify(context, null, 2)}

Le contenu doit être pertinent, professionnel et aligné avec les standards du secteur.
Utilise les données d'audit et les recommandations pour enrichir le contenu.

Format de sortie attendu :
{
  "content": string, // Le contenu formaté de la section
  "key_points": string[], // Points clés à retenir
  "references": string[] // Références aux standards/normes si applicable
}`
      }],
      temperature: 0.7,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API Anthropic: ${response.status} - ${errorText}`);
  }

  const rawData = await response.json();
  return JSON.parse(rawData.content[0].text);
}


//Helper functions -  inferred based on context.  Replace with actual implementations.
function getDocumentSections(type: string): { title: string }[] {
  switch (type) {
    case "Operational Audit":
      return [
        { title: "Executive Summary" },
        { title: "Introduction" },
        { title: "Findings" },
        { title: "Recommendations" },
        { title: "Conclusion" }
      ];
    default:
      return [];
  }
}

async function generateWordDocument(data: any): Promise<Buffer> {
  //Replace with actual Word document generation logic
  return Buffer.from("This is a placeholder Word document.");
}

export function registerRoutes(app: Express): Server {
  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { type, clientInfo, auditData, context } = req.body;

      if (!type || !clientInfo || !auditData) {
        return res.status(400).json({
          error: "Données requises manquantes",
          details: "Le type de document, les informations client et les données d'audit sont requis"
        });
      }

      const documentSections = getDocumentSections(type);
      const sectionContents = await Promise.all(
        documentSections.map(async section => ({
          title: section.title,
          content: await generateDocumentContent(type, section.title, {
            clientInfo,
            auditData,
            section: section,
            ...context
          })
        }))
      );

      const wordBuffer = await generateWordDocument({
        type,
        clientInfo,
        sections: sectionContents,
        metadata: {
          generated: new Date().toISOString(),
          version: "1.0"
        }
      });

      const fileName = `3R_${type.replace(/\s+/g, '_')}_${clientInfo.name}_${
        new Date().toISOString().split('T')[0].replace(/-/g, '')
      }`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
      res.send(wordBuffer);

    } catch (error) {
      console.error('Erreur dans la génération du document:', error);
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