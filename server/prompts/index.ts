import generatePreAuditRecommendationsPrompt from './categories/preaudit/recommendations';
import generateEnvironmentalRecommendationsPrompt from './categories/environmental/recommendations';
import generateMultisiteRecommendationsPrompt from './categories/multisite/recommendations';

export type AuditCategory = 'preaudit' | 'environmental' | 'multisite';

export const generateRecommendationsPrompt = (category: AuditCategory, auditData: any) => {
  // Sélectionner le prompt approprié en fonction de la catégorie
  switch (category) {
    case 'preaudit':
      return generatePreAuditRecommendationsPrompt(auditData);
    case 'environmental':
      return generateEnvironmentalRecommendationsPrompt(auditData);
    case 'multisite':
      return generateMultisiteRecommendationsPrompt(auditData);
    default:
      throw new Error(`Catégorie d'audit non supportée: ${category}`);
  }
};

// Format de réponse commun pour toutes les catégories
export const commonResponseFormat = {
  recommendations: [{
    id: "string", // Format: CATEGORY_001
    title: "string",
    description: "string",
    priority: "critical|high|medium|low",
    impact: {
      // Les impacts spécifiques varient selon la catégorie
      // Voir les prompts individuels pour les détails
    },
    implementation: {
      difficulty: "high|medium|low",
      estimatedCost: "€€€|€€|€",
      timeframe: "immediate|short_term|medium_term|long_term",
      prerequisites: ["string"]
    },
    dataQuality: {
      completeness: "number", // 0-100
      missingData: ["string"]
    }
  }],
  analysis: {
    summary: "string",
    strengths: ["string"],
    weaknesses: ["string"],
    dataQuality: {
      availableData: ["string"],
      missingCriticalData: ["string"],
      confidenceLevel: "high|medium|low"
    }
  },
  context: {
    standards: ["string"],
    constraints: ["string"],
    assumptions: ["string"]
  }
};

export default generateRecommendationsPrompt;
