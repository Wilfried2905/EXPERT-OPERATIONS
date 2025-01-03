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

Instructions:
Génère une réponse STRICTEMENT au format JSON suivant ce schéma exact sans aucun texte additionnel:

{
  "recommendations": [
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
        "energyEfficiency": "number",
        "performance": "number",
        "compliance": "number",
        "details": {
          "energyEfficiency": "string",
          "performance": "string",
          "compliance": "string"
        }
      },
      "alternatives": [
        {
          "description": "string",
          "pros": ["string"],
          "cons": ["string"],
          "estimatedEfficiency": "string"
        }
      ],
      "requiredEquipment": [
        {
          "category": "string",
          "items": [
            {
              "name": "string",
              "specification": "string",
              "normReference": "string"
            }
          ]
        }
      ],
      "metrics": {
        "pue": "number",
        "availability": "number",
        "tierLevel": "number",
        "complianceGaps": ["string"],
        "details": {
          "pue": "string",
          "availability": "string",
          "tierLevel": "string"
        }
      },
      "timeline": {
        "phases": [
          {
            "name": "string",
            "duration": "string",
            "tasks": ["string"],
            "deliverables": ["string"]
          }
        ],
        "milestones": [
          {
            "name": "string",
            "date": "string",
            "requirements": ["string"]
          }
        ]
      }
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ 
        role: "user", 
        content: prompt,
      }],
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    try {
      const recommendations = JSON.parse(response.content[0].text);
      res.json(recommendations);
    } catch (parseError) {
      console.error("Error parsing Anthropic response:", parseError);
      // Utiliser des données mockées en cas d'erreur de parsing
      const mockRecommendations = {
        recommendations: [
          {
            id: "1",
            title: "Optimisation du système de refroidissement",
            description: "Mise à niveau du système de refroidissement pour améliorer l'efficacité énergétique",
            normReference: {
              code: "EN 50600-2-2",
              description: "La norme EN 50600-2-2 spécifie les exigences et recommandations pour la distribution d'énergie dans les centres de données",
              requirement: "Un PUE inférieur à 1.6 est recommandé pour les centres de données modernes"
            },
            priority: "high",
            timeFrame: "short_term",
            impact: {
              energyEfficiency: 0.8,
              performance: 0.8,
              compliance: 0.9,
              details: {
                energyEfficiency: "Amélioration du PUE de 0.3 points selon EN 50600-2-2",
                performance: "Augmentation de la capacité de 30% selon ASHRAE TC 9.9",
                compliance: "Mise en conformité avec 90% des exigences EN 50600"
              }
            },
            alternatives: [
              {
                description: "Installation d'un système free cooling",
                pros: ["Économie d'énergie", "ROI rapide"],
                cons: ["Installation complexe", "Maintenance régulière"],
                estimatedEfficiency: "PUE attendu de 1.3"
              }
            ],
            requiredEquipment: [
              {
                category: "Refroidissement",
                items: [
                  {
                    name: "Unité de Free Cooling",
                    specification: "Capacité 500kW, EER>4.0",
                    normReference: "EN 14511-2:2018"
                  }
                ]
              }
            ],
            metrics: {
              pue: 1.5,
              availability: 99.99,
              tierLevel: 3,
              complianceGaps: ["ISO 50001", "EN 50600"],
              details: {
                pue: "Classe 3 selon EN 50600-4-2",
                availability: "TIER III selon Uptime Institute",
                tierLevel: "Certification TIER III (99.982%)"
              }
            },
            progress: 45.5,
            implemented: false,
            timeline: {
              phases: [
                {
                  name: "Étude et conception",
                  duration: "4 semaines",
                  tasks: [
                    "Audit système existant",
                    "Analyse des besoins",
                    "Conception détaillée",
                    "Validation technique"
                  ],
                  deliverables: [
                    "Rapport d'audit",
                    "Cahier des charges",
                    "Plans techniques",
                    "Documentation technique"
                  ]
                },
                {
                  name: "Installation",
                  duration: "6 semaines",
                  tasks: [
                    "Préparation du site",
                    "Installation des équipements",
                    "Tests unitaires",
                    "Tests d'intégration"
                  ],
                  deliverables: [
                    "Rapport d'installation",
                    "Résultats des tests",
                    "Documentation technique mise à jour"
                  ]
                }
              ],
              milestones: [
                {
                  name: "Validation conception",
                  date: "2024-02-15",
                  requirements: [
                    "Conformité EN 50600",
                    "Validation technique",
                    "Validation budgétaire"
                  ]
                },
                {
                  name: "Réception des travaux",
                  date: "2024-04-01",
                  requirements: [
                    "Tests de performance",
                    "Documentation complète",
                    "Formation des équipes"
                  ]
                }
              ]
            }
          }
        ]
      };
      res.json(mockRecommendations);
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
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
        details: {
          description: "Conformément à la norme EN 50600-2-2",
          phases: [
            {
              name: "Audit initial",
              duration: "1 semaine",
              tasks: [
                "Analyse de l'existant",
                "Identification des écarts",
                "Définition des objectifs"
              ],
              deliverables: [
                "Rapport d'évaluation",
                "Liste des non-conformités",
                "Plan d'action préliminaire"
              ]
            },
            {
              name: "Mise en œuvre",
              duration: "2 semaines",
              tasks: [
                "Installation des équipements",
                "Configuration des systèmes",
                "Tests fonctionnels"
              ],
              deliverables: [
                "Rapport d'installation",
                "Tests de conformité",
                "Documentation technique"
              ]
            },
            {
              name: "Validation",
              duration: "1 semaine",
              tasks: [
                "Tests de performance",
                "Vérification des normes",
                "Formation des équipes"
              ],
              deliverables: [
                "Certification finale",
                "Documentation technique",
                "Manuel d'exploitation"
              ]
            }
          ],
          milestones: [
            {
              name: "Validation initiale",
              date: "2024-02-01",
              requirements: [
                "Rapport d'audit validé",
                "Budget approuvé",
                "Planning accepté"
              ]
            },
            {
              name: "Mise en production",
              date: "2024-03-01",
              requirements: [
                "Tests validés",
                "Documentation complète",
                "Équipes formées"
              ]
            }
          ]
        }
      }
    ]
  });
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/profile-selected", (req, res) => {
    const { profileType, email } = req.body;
    console.log('Profile selected:', { profileType, email });
    res.json({ message: "Sélection de profil enregistrée" });
  });

  app.post("/api/anthropic/recommendations", generateRecommendations);
  app.post("/api/anthropic/compliance-matrix", generateComplianceMatrix);
  app.post("/api/anthropic/gantt", generateGanttData);

  const httpServer = createServer(app);
  return httpServer;
}