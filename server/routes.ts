import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateOperationalAuditPrompt } from '../client/src/services/audit-types/operational-audit';
import { exportToWord, exportToExcel } from './exports';

async function generateRecommendationSection(prompt: string, section: string) {
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
        content: `Analyse cette section des données d'audit (${section}) et génère une partie des recommandations en français:

${prompt}

Réponds uniquement avec un objet JSON contenant les recommandations pour cette section.`
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

export function registerRoutes(app: Express): Server {
  app.post("/api/recommendations", async (req, res) => {
    try {
      console.log('Anthropic service: Début de generateRecommendations');
      const { auditData, auditType } = req.body;

      if (!auditData) {
        return res.status(400).json({
          error: "Données d'audit manquantes",
          details: "Les données d'audit sont requises pour générer des recommandations"
        });
      }

      const prompt = generateOperationalAuditPrompt(auditData);

      // Diviser l'analyse en sections
      const sections = [
        { name: "Organisation", data: auditData.facilityInfo?.organization },
        { name: "Processus", data: auditData.facilityInfo?.processes },
        { name: "GestionIncidents", data: auditData.facilityInfo?.incidentManagement },
        { name: "Maintenance", data: auditData.facilityInfo?.maintenance }
      ];

      console.log('Anthropic service: Génération des recommandations par section');

      const sectionResults = await Promise.all(
        sections.map(section => 
          generateRecommendationSection(prompt, section.name)
            .catch(error => {
              console.error(`Erreur section ${section.name}:`, error);
              return null;
            })
        )
      );

      // Combiner les résultats
      const combinedRecommendations = sectionResults.reduce((acc, result) => {
        if (result && result.recommendations) {
          acc.recommendations.push(...result.recommendations);
        }
        return acc;
      }, { 
        recommendations: [],
        analyse: {
          resume: "",
          points_forts: [],
          points_amelioration: [],
          impacts: {
            description: "",
            analyse_efficacite: "",
            analyse_fiabilite: "",
            analyse_conformite: ""
          }
        }
      });

      // Générer l'analyse globale
      const analyseGlobale = await generateRecommendationSection(prompt, "analyse_globale");
      if (analyseGlobale && analyseGlobale.analyse) {
        combinedRecommendations.analyse = analyseGlobale.analyse;
      }

      console.log('Anthropic service: Réponse combinée:', JSON.stringify(combinedRecommendations, null, 2));
      res.json(combinedRecommendations);

    } catch (error) {
      console.error('Erreur dans generateRecommendations:', error);
      res.status(500).json({
        error: "Erreur lors de la génération des recommandations",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      });
    }
  });

  // Routes d'export
  app.post("/api/exports/word", exportToWord);
  app.post("/api/exports/excel", exportToExcel);

  // Route de la matrice de conformité
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