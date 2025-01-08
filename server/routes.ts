import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateOperationalAuditPrompt } from '../client/src/services/audit-types/operational-audit';
import { exportToWord, exportToExcel } from './exports';

export function registerRoutes(app: Express): Server {
  // Route de génération des recommandations
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

      console.log('Anthropic service: Préparation du prompt');
      const prompt = generateOperationalAuditPrompt(auditData);

      console.log('Anthropic service: Envoi de la requête à Claude');
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
            content: `Agis comme un expert en audit de datacenters. Analyse ces données d'audit et génère des recommandations détaillées en français. 

Données d'audit : ${prompt}

Format de réponse attendu :
{
  "recommendations": [
    {
      "titre": "string",
      "description": "string",
      "priorite": "critique|elevee|moyenne|faible",
      "impact": {
        "efficacite": "number",
        "fiabilite": "number",
        "conformite": "number"
      }
    }
  ],
  "analyse": {
    "resume": "string",
    "points_forts": ["string"],
    "points_amelioration": ["string"],
    "impacts": {
      "description": "string",
      "analyse_efficacite": "string",
      "analyse_fiabilite": "string",
      "analyse_conformite": "string"
    }
  }
}`
          }],
          temperature: 0.7,
          max_tokens: 100000
        })
      });

      console.log('Anthropic service: Réponse reçue de Claude');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API Anthropic:', errorText);
        throw new Error(`Erreur API Anthropic: ${response.status} - ${errorText}`);
      }

      const rawData = await response.json();
      console.log('Anthropic service: Réponse brute reçue:', JSON.stringify(rawData, null, 2));

      let parsedContent;
      try {
        // La réponse de Claude-3 est dans content[0].text
        parsedContent = JSON.parse(rawData.content[0].text);
        console.log('Anthropic service: Contenu parsé:', parsedContent);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        throw new Error('Erreur lors du parsing de la réponse de Claude');
      }

      // Vérification et formatage de la réponse
      const formattedResponse = {
        recommendations: Array.isArray(parsedContent.recommendations) ? parsedContent.recommendations : [],
        analyse: {
          resume: parsedContent.analyse?.resume || "",
          points_forts: Array.isArray(parsedContent.analyse?.points_forts) ? parsedContent.analyse.points_forts : [],
          points_amelioration: Array.isArray(parsedContent.analyse?.points_amelioration) ? parsedContent.analyse.points_amelioration : [],
          impacts: {
            description: parsedContent.analyse?.impacts?.description || "",
            analyse_efficacite: parsedContent.analyse?.impacts?.analyse_efficacite || "",
            analyse_fiabilite: parsedContent.analyse?.impacts?.analyse_fiabilite || "",
            analyse_conformite: parsedContent.analyse?.impacts?.analyse_conformite || ""
          }
        }
      };

      console.log('Anthropic service: Réponse formatée:', JSON.stringify(formattedResponse, null, 2));
      res.json(formattedResponse);
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