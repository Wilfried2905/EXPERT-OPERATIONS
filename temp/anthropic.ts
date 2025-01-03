// server/anthropic.ts
import Anthropic from '@anthropic-ai/sdk';
import type { Request, Response } from 'express';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateRecommendations(req: Request, res: Response) {
  try {
    console.log('Anthropic service: Début de generateRecommendations');
    const { auditData } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic service: Clé API manquante');
      throw new Error('La clé API Anthropic n\'est pas configurée');
    }

    if (!auditData || !auditData.infrastructure || !auditData.infrastructure.questionnaire) {
      console.log('Anthropic service: Données d\'audit invalides ou manquantes');
      return res.status(400).json({ 
        error: "Les données d'audit sont invalides ou manquantes. Veuillez compléter le questionnaire."
      });
    }

    console.log('Anthropic service: Préparation de la requête à l\'API');
    const prompt = `En tant qu'expert en infrastructure datacenter, analysez les données d'audit suivantes et générez des recommandations détaillées.

DONNÉES D'AUDIT :
${JSON.stringify(auditData, null, 2)}

FORMAT DE SORTIE :
Structurez la réponse avec :
### Synthèse
[Résumé des points clés]

### Points Forts
- [Liste des aspects positifs identifiés]

### Points d'Amélioration
- [Liste des aspects nécessitant une amélioration]

### Recommandations Prioritaires
1. [Recommandation détaillée]
   - Impact attendu
   - Délai suggéré
   - Estimation budgétaire

### Plan d'Action
1. Court terme (0-3 mois)
2. Moyen terme (3-12 mois)
3. Long terme (>12 mois)`;

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

    console.log('Anthropic service: Envoi de la réponse au client');
    res.json({ text: content });
  } catch (error: unknown) {
    console.error('Anthropic service: Erreur:', error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}
