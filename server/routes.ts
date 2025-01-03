import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateRecommendations(req: any, res: any) {
  try {
    const auditData = req.body;
    const prompt = `En tant qu'expert en audit de datacenters, analyse en détail toutes les données suivantes et génère des recommandations détaillées et approfondies.

Données d'audit complètes à analyser:
${JSON.stringify(auditData, null, 2)}

Instructions d'analyse:
1. Analyser les métriques quantitatives (PUE, disponibilité, TIER)
2. Évaluer les commentaires qualitatifs et observations
3. Examiner les images et documents fournis
4. Identifier les écarts par rapport aux normes ISO/IEC
5. Comparer avec les meilleures pratiques du secteur
6. Considérer les benchmarks industriels

Génère des recommandations structurées selon ce format:
1. Titre
2. Description détaillée incluant:
   - Contexte spécifique du datacenter
   - Justification basée sur les normes
   - Référence aux meilleures pratiques
3. Priorité (critique/haute/moyenne/faible) avec justification
4. Temporalité (immédiat/court terme/long terme) avec planning suggéré
5. Impact détaillé:
   - Coût (0-1) avec estimation budgétaire
   - Performance (0-1) avec métriques attendues
   - Conformité (0-1) avec normes concernées
6. Alternatives possibles:
   - Description
   - Avantages détaillés
   - Inconvénients potentiels
   - Estimation des coûts
7. Métriques impactées:
   - PUE cible
   - Disponibilité attendue
   - Niveau TIER visé
   - Points de conformité adressés

Format ta réponse en JSON pour faciliter le parsing.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    const recommendations = JSON.parse(response.content[0].text);
    res.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: error.message });
  }
}

export function registerRoutes(app: Express): Server {
  // Configurer l'authentification en premier
  setupAuth(app);

  // Route de sélection de profil
  app.post("/api/profile-selected", (req, res) => {
    const { profileType, email } = req.body;
    console.log('Profile selected:', { profileType, email });
    res.json({ message: "Sélection de profil enregistrée" });
  });

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

  // Mock routes pour les autres endpoints
  app.post("/api/anthropic/compliance-matrix", (req, res) => {
    res.json({
      "Sécurité physique": {
        conformityLevel: 75,
        requiredActions: ["Mettre à jour le contrôle d'accès", "Renforcer la vidéosurveillance"]
      },
      "Infrastructure": {
        conformityLevel: 85,
        requiredActions: ["Optimiser la redondance électrique"]
      }
    });
  });

  app.post("/api/anthropic/gantt", (req, res) => {
    res.json({
      tasks: [
        {
          name: "Mise à niveau infrastructure",
          duration: 30,
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          dependencies: []
        },
        {
          name: "Optimisation système refroidissement",
          duration: 45,
          startDate: "2024-02-16",
          endDate: "2024-03-30",
          dependencies: ["Mise à niveau infrastructure"]
        }
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}