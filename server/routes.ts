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
    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées conformes aux normes EN 50600 et ISO/IEC.

Données d'audit à analyser:
${JSON.stringify(auditData, null, 2)}

Instructions d'analyse approfondie:
1. Évaluation des métriques selon les normes:
   - PUE selon EN 50600-4-2
   - Disponibilité selon TIER Standards
   - Classification TIER selon Uptime Institute
2. Identification des écarts de conformité:
   - EN 50600 (toutes les parties)
   - ISO/IEC 22237
   - ASHRAE TC 9.9
3. Analyse des meilleures pratiques sectorielles
4. Benchmarking avec les standards internationaux

Génère des recommandations structurées incluant:
1. Titre et Description
2. Référence normative détaillée:
   - Code de la norme applicable
   - Section spécifique
   - Exigences précises
   - Justification détaillée
3. Priorité (critique/haute/moyenne/faible):
   - Basée sur l'impact sur la conformité
   - Justifiée par les exigences normatives
4. Temporalité (immédiat/court terme/long terme):
   - Planning détaillé par phases
   - Jalons clés avec livrables
5. Impact détaillé avec justifications normatives:
   - Efficacité énergétique (0-1) selon EN 50600-4-2
   - Performance (0-1) selon standards ASHRAE
   - Conformité (0-1) avec détail des normes impactées
6. Alternatives techniques:
   - Description technique détaillée
   - Avantages selon les normes
   - Inconvénients potentiels
   - Impact sur l'efficacité énergétique
7. Matériels requis:
   - Spécifications techniques précises
   - Références aux normes applicables
   - Certifications requises
8. Métriques cibles détaillées:
   - PUE cible avec classe EN 50600-4-2
   - Disponibilité selon niveau TIER
   - Conformité détaillée par norme
9. Planning d'implémentation:
   - Phases détaillées avec durées
   - Livrables par phase
   - Points de contrôle normatifs
   - Jalons de certification

Format attendu pour chaque recommandation:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "normReference": {
    "code": "string",
    "description": "string",
    "requirement": "string"
  },
  "priority": "critical|high|medium|low",
  "timeFrame": "immediate|short_term|long_term",
  "impact": {
    "energyEfficiency": number,
    "performance": number,
    "compliance": number,
    "details": {
      "energyEfficiency": "string",
      "performance": "string",
      "compliance": "string"
    }
  },
  "alternatives": [{
    "description": "string",
    "pros": ["string"],
    "cons": ["string"],
    "estimatedEfficiency": "string"
  }],
  "requiredEquipment": [{
    "category": "string",
    "items": [{
      "name": "string",
      "specification": "string",
      "normReference": "string"
    }]
  }],
  "metrics": {
    "pue": number,
    "availability": number,
    "tierLevel": number,
    "complianceGaps": ["string"],
    "details": {
      "pue": "string",
      "availability": "string",
      "tierLevel": "string"
    }
  },
  "timeline": {
    "phases": [{
      "name": "string",
      "duration": "string",
      "tasks": ["string"],
      "deliverables": ["string"]
    }],
    "milestones": [{
      "name": "string",
      "date": "string",
      "requirements": ["string"]
    }]
  }
}

Retourne un tableau de recommandations au format JSON spécifié.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    const recommendations = JSON.parse(response.content[0].text);
    res.json({ recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Une erreur est survenue' });
  }
}

export async function generateComplianceMatrix(req: any, res: any) {
  res.json({
    "Sécurité physique": {
      conformityLevel: 75,
      normReference: "EN 50600-2-5",
      description: "Sécurité physique des centres de données",
      details: "Le niveau 75% correspond à une conformité partielle de niveau 3 selon la norme EN 50600-2-5",
      requiredActions: [
        {
          action: "Mettre à jour le contrôle d'accès",
          normReference: "Section 6.2 de EN 50600-2-5",
          requirement: "Système de contrôle d'accès multi-facteurs requis"
        }
      ]
    }
  });
}

export async function generateGanttData(req: any, res: any) {
  res.json({
    tasks: [
      {
        name: "Mise à niveau infrastructure",
        duration: "4 semaines",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        dependencies: [],
        details: {
          description: "Conformément à la norme EN 50600-2-2",
          phases: [
            {
              name: "Audit initial",
              duration: "1 semaine",
              deliverables: ["Rapport d'évaluation", "Liste des non-conformités"]
            },
            {
              name: "Mise en œuvre",
              duration: "2 semaines",
              deliverables: ["Rapport d'installation", "Tests de conformité"]
            },
            {
              name: "Validation",
              duration: "1 semaine",
              deliverables: ["Certification finale", "Documentation technique"]
            }
          ]
        }
      }
    ]
  });
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
  app.post("/api/anthropic/recommendations", generateRecommendations);
  app.post("/api/anthropic/compliance-matrix", generateComplianceMatrix);
  app.post("/api/anthropic/gantt", generateGanttData);

  const httpServer = createServer(app);
  return httpServer;
}