import Anthropic from '@anthropic-ai/sdk';
import type { Request, Response } from 'express';
import generateRecommendationsPrompt from './prompts/recommendations';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateRecommendations(req: Request, res: Response) {
  try {
    console.log('Anthropic service: Début de generateRecommendations');
    const { auditData } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic service: Clé API manquante');
      return res.status(500).json({ 
        error: "La clé API Anthropic n'est pas configurée"
      });
    }

    // Validation des données d'audit
    if (!auditData) {
      return res.status(400).json({ 
        error: "Les données d'audit sont requises"
      });
    }

    console.log('Anthropic service: Préparation du prompt');
    const prompt = generateRecommendationsPrompt(auditData);

    console.log('Anthropic service: Envoi de la requête à Claude');
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 4096
    });

    console.log('Anthropic service: Réponse reçue de Claude');
    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!content) {
      throw new Error('La réponse de l\'API est vide');
    }

    // Réponse par défaut si le parsing échoue
    const defaultResponse = {
      recommendations: [{
        id: "REC_001",
        title: "Recommandation générale",
        description: content,
        priority: "medium",
        impact: {
          efficiency: 50,
          reliability: 50,
          compliance: 50
        },
        implementation: {
          difficulty: "medium",
          timeframe: "medium_term",
          prerequisites: []
        },
        dataQuality: {
          completeness: 70,
          missingData: []
        }
      }],
      analysis: {
        summary: "Analyse basée sur les données fournies",
        strengths: [],
        weaknesses: [],
        dataQuality: {
          availableData: [],
          missingCriticalData: [],
          confidenceLevel: "medium"
        }
      },
      context: {
        standards: [],
        constraints: [],
        assumptions: []
      }
    };

    // Tentative de parse du JSON avec fallback sur la réponse par défaut
    try {
      console.log('Anthropic service: Tentative de parse JSON');
      const recommendations = JSON.parse(content);
      console.log('Anthropic service: Parse JSON réussi');
      res.setHeader('Content-Type', 'application/json');
      return res.json(recommendations);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.log('Anthropic service: Utilisation de la réponse par défaut');
      res.setHeader('Content-Type', 'application/json');
      return res.json(defaultResponse);
    }
  } catch (error: unknown) {
    console.error('Anthropic service: Erreur:', error);
    const err = error as Error;
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: `Erreur lors de la génération des recommandations: ${err.message}`
    });
  }
}