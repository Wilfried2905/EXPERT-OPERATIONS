import { Anthropic } from '@anthropic-ai/sdk';

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'TECHNICAL_OFFER',
  AUDIT_REPORT = 'AUDIT_REPORT',
  SPECIFICATIONS = 'SPECIFICATIONS'
}

// Interface pour les données d'entrée
interface DocumentGenerationInput {
  type: DocumentType;
  clientInfo: {
    name: string;
    industry: string;
    size: string;
  };
  auditData: {
    recommendations: any[];
    metrics: {
      pue: number[];
      availability: number[];
      tierLevel: number;
      complianceGaps: string[];
    };
    infrastructure: {
      rooms: any[];
      equipment: any[];
    };
    compliance: {
      matrix: any;
      score: number;
    };
  };
  additionalData?: {
    images?: string[];
    documents?: string[];
    comments?: string[];
  };
}

// Fonction pour générer le prompt en fonction du type de document
function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel détaillé basé sur les informations suivantes :

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%
`;

  switch (input.type) {
    case DocumentType.TECHNICAL_OFFER:
      return `${baseContext}
Générez une offre technique complète incluant :
1. Présentation de l'entreprise et expertise
2. Compréhension du besoin client
3. Solution technique proposée
4. Méthodologie d'intervention
5. Planning et organisation
6. Équipe et références
7. Annexes techniques`;

    case DocumentType.AUDIT_REPORT:
      return `${baseContext}
Générez un rapport d'audit détaillé incluant :
1. Résumé exécutif
2. Méthodologie d'audit
3. État des lieux de l'infrastructure
4. Analyse des performances
5. Évaluation des risques
6. Conformité aux normes
7. Recommandations détaillées
8. Plan d'action
9. Annexes`;

    case DocumentType.SPECIFICATIONS:
      return `${baseContext}
Générez un cahier des charges détaillé incluant :
1. Contexte et objectifs
2. Spécifications fonctionnelles
3. Exigences techniques
4. Contraintes et normes
5. Livrables attendus
6. Planning prévisionnel
7. Modalités de réalisation
8. Critères de réception
9. Annexes techniques`;

    default:
      throw new Error('Type de document non supporté');
  }
}

export async function generateDocument(input: DocumentGenerationInput): Promise<string> {
  try {
    const anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(input);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    throw error;
  }
}
