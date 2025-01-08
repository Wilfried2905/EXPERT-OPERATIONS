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
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: "La clé API Anthropic n'est pas configurée"
      });
    }

    // Validation des données d'audit
    if (!auditData) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ 
        error: "Les données d'audit sont requises"
      });
    }

    console.log('Anthropic service: Préparation du prompt');
    const prompt = `Analysez les données d'audit suivantes et générez des recommandations au format JSON strict.

    DONNÉES D'AUDIT:
    ${JSON.stringify(auditData, null, 2)}

    FORMAT DE SORTIE REQUIS (Strictement JSON):
    {
      "recommendations": [{
        "id": "string",
        "title": "string",
        "description": "string",
        "priority": "high" | "medium" | "low",
        "impact": {
          "efficiency": number,
          "reliability": number,
          "compliance": number
        },
        "implementation": {
          "difficulty": "high" | "medium" | "low",
          "timeframe": "short_term" | "medium_term" | "long_term",
          "prerequisites": string[]
        },
        "dataQuality": {
          "completeness": number,
          "missingData": string[]
        }
      }],
      "analysis": {
        "summary": "string",
        "strengths": string[],
        "weaknesses": string[],
        "dataQuality": {
          "availableData": string[],
          "missingCriticalData": string[],
          "confidenceLevel": "high" | "medium" | "low"
        }
      },
      "context": {
        "standards": string[],
        "constraints": string[],
        "assumptions": string[]
      }
    }`;

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

    // Tentative de parse du JSON avec fallback sur la réponse par défaut
    try {
      console.log('Anthropic service: Tentative de parse JSON');
      const recommendations = JSON.parse(content);
      console.log('Anthropic service: Parse JSON réussi');
      res.setHeader('Content-Type', 'application/json');
      return res.json(recommendations);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      console.log('Contenu reçu:', content);
      throw new Error('La réponse de l\'API n\'est pas au format JSON valide');
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