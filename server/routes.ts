import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';

// Initialisation du client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateRecommendations(req: any, res: any) {
  try {
    console.log('[Recommendations] Starting recommendation generation');
    const { auditData } = req.body;

    // Validation basique
    if (!req.body) {
      return res.status(400).json({
        error: "Aucune donnée fournie"
      });
    }

    // Analyse des données disponibles
    const availableData = {
      hasMetrics: !!auditData?.metrics,
      hasInfrastructure: !!auditData?.infrastructure,
      hasCompliance: !!auditData?.compliance,
    };

    console.log('Available data categories:', availableData);

    // Construction du prompt en fonction des données disponibles
    let promptContent = `En tant qu'expert en audit de datacenters, analyse les données disponibles suivantes et génère des recommandations adaptées.\n\n`;

    // Ajout des données disponibles au prompt
    if (auditData?.metrics) {
      promptContent += `Métriques actuelles:\n${JSON.stringify(auditData.metrics, null, 2)}\n\n`;
    }

    if (auditData?.infrastructure) {
      promptContent += `Infrastructure existante:\n${JSON.stringify(auditData.infrastructure, null, 2)}\n\n`;
    }

    if (auditData?.compliance) {
      promptContent += `Données de conformité:\n${JSON.stringify(auditData.compliance, null, 2)}\n\n`;
    }

    const prompt = `${promptContent}
    Instructions:
    1. Analyse les données fournies
    2. Génère des recommandations basées uniquement sur les informations disponibles
    3. Indique clairement si certaines recommandations nécessitent des données supplémentaires
    4. Priorise les recommandations en fonction de leur faisabilité avec les données actuelles

    Format de réponse attendu:
    {
      "recommendations": [
        {
          "id": string,
          "title": string,
          "description": string,
          "priority": "critical|high|medium|low",
          "confidence": "high|medium|low", // Niveau de confiance basé sur les données disponibles
          "impact": {
            "efficiency": number,
            "reliability": number,
            "compliance": number
          },
          "dataQuality": {
            "completeness": number, // Indique si plus de données seraient nécessaires
            "missingData": string[] // Liste des données supplémentaires qui seraient utiles
          }
        }
      ],
      "dataAnalysis": {
        "availableData": string[], // Liste des types de données analysées
        "missingCriticalData": string[], // Données importantes manquantes
        "confidenceLevel": string // Niveau de confiance global
      }
    }`;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      system: "Tu es un expert en audit de datacenters. Tu dois toujours répondre avec un JSON valide selon le format demandé."
    });

    if (!response.content?.[0]) {
      throw new Error('Réponse invalide de l\'API');
    }

    const content = response.content[0].text;
    if (!content) {
      throw new Error('Contenu de la réponse manquant');
    }

    try {
      const recommendations = JSON.parse(content);
      return res.json(recommendations);
    } catch (parseError) {
      console.error('[Recommendations] JSON parse error:', parseError);
      throw new Error('La réponse n\'est pas un JSON valide');
    }

  } catch (error) {
    console.error("Error generating recommendations:", error);
    return res.status(500).json({
      error: "Erreur lors de la génération des recommandations",
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

export function registerRoutes(app: Express): Server {
  // Route de génération des recommandations
  app.post("/api/recommendations", generateRecommendations);

  const httpServer = createServer(app);
  return httpServer;
}