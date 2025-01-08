import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateOperationalAuditPrompt } from '../client/src/services/audit-types/operational-audit';
import { exportToWord, exportToExcel } from './exports';

async function generateRecommendationSection(prompt: string, section: string, sectionIndex: number) {
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
        content: `Tu es un expert en audit de datacenters. Analyse la section ${section} (partie ${sectionIndex + 1}) des données d'audit et génère des recommandations détaillées en français pour cette section spécifique.

Les recommandations doivent être adaptées au contexte de ${section}.

Données d'audit pour cette section : ${prompt}

Format de réponse JSON attendu :
{
  "sectionId": "${sectionIndex + 1}",
  "sectionName": "${section}",
  "recommendations": [
    {
      "id": "REC_${sectionIndex + 1}_X",
      "titre": "string",
      "description": "string",
      "priorite": "critique|elevee|moyenne|faible",
      "impact": {
        "efficacite": number,
        "fiabilite": number,
        "conformite": number
      },
      "contexte": "string"
    }
  ]
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

async function generateAnalyseGlobale(allSectionData: any[], prompt: string) {
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
        content: `Analyse l'ensemble des données d'audit et génère une synthèse globale en français.
Utilise les recommandations déjà générées pour créer une analyse cohérente.

Données d'audit complètes : ${prompt}
Recommandations par section : ${JSON.stringify(allSectionData)}

Format de réponse JSON attendu :
{
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

      // Définition des sections avec leurs données spécifiques
      const sections = [
        { name: "Organisation", data: auditData.facilityInfo?.organization },
        { name: "Processus", data: auditData.facilityInfo?.processes },
        { name: "GestionIncidents", data: auditData.facilityInfo?.incidentManagement },
        { name: "Maintenance", data: auditData.facilityInfo?.maintenance }
      ];

      console.log('Anthropic service: Génération des recommandations par section');

      // Génération des recommandations pour chaque section
      const sectionResults = await Promise.all(
        sections.map((section, index) => 
          generateRecommendationSection(prompt, section.name, index)
            .catch(error => {
              console.error(`Erreur section ${section.name}:`, error);
              return null;
            })
        )
      );

      // Filtrer les sections valides et combiner les recommandations
      const validSectionResults = sectionResults.filter(result => result !== null);

      // Générer l'analyse globale avec toutes les recommandations
      const analyseGlobale = await generateAnalyseGlobale(validSectionResults, prompt);

      // Préparer la réponse finale
      const combinedResponse = {
        recommendations: validSectionResults.flatMap(section => 
          section.recommendations.map(rec => ({
            ...rec,
            section: section.sectionName
          }))
        ),
        analyse: analyseGlobale.analyse
      };

      console.log('Anthropic service: Réponse finale générée');
      res.json(combinedResponse);

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