import Anthropic from '@anthropic-ai/sdk';
import type { Request, Response } from 'express';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function analyzeData(req: Request, res: Response) {
  try {
    console.log('Anthropic service: Début de analyzeData'); //Added logging
    console.log('Received analyze request with body:', req.body);
    const { data, context } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic service: Clé API manquante');
      throw new Error('La clé API Anthropic n\'est pas configurée');
    }

    const prompt = `Analysez les informations suivantes et générez des recommandations détaillées pour l'infrastructure du datacenter. Incluez des visualisations et diagrammes pertinents.

ANALYSE DES ÉQUIPEMENTS EXISTANTS :
1. Pour chaque équipement listé :
   - État technique actuel et performance
   - Durée de vie restante estimée
   - Conformité aux normes actuelles
   - Risques identifiés
   - Coûts de maintenance actuels

2. Évaluation des systèmes critiques :
   - Capacité et utilisation actuelles
   - Points de saturation potentiels
   - Redondance et fiabilité
   - Efficacité énergétique

PROPOSITIONS D'ALTERNATIVES :
1. Pour chaque équipement nécessitant un remplacement :
   - Minimum 3 alternatives du marché
   - Comparaison détaillée (performances, coûts, ROI)
   - Compatibilité avec l'infrastructure existante
   - Impact sur les opérations

2. Analyse comparative :
   - Avantages et inconvénients de chaque option
   - Coûts d'acquisition et TCO
   - Gains en efficacité/performance
   - Évolutivité future

FORMAT DE SORTIE :
Structurez la réponse avec des titres ###, des listes à puces - et des paragraphes.
${context}

Données à analyser : ${JSON.stringify(data)}`;

    console.log('Anthropic service: Envoi de la requête à Claude'); //Added logging
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 4096  // Augmenté pour permettre des réponses plus détaillées
    });

    console.log('Anthropic service: Réponse reçue de Claude'); //Added logging
    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    
    if (!content) {
      throw new Error('La réponse de l\'API est vide');
    }

    console.log('Anthropic service: Envoi de la réponse au client'); //Added logging
    res.json({ text: content });
  } catch (error: unknown) {
    console.error('Anthropic service: Erreur:', error); //Improved error logging
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

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
    return res.json({ text: content });
  } catch (error: unknown) {
    console.error('Anthropic service: Erreur:', error);
    const err = error as Error;
    return res.status(500).json({ 
      error: `Erreur lors de la génération des recommandations: ${err.message}`
    });
  }
}