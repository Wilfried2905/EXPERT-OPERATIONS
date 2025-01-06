import { z } from 'zod';
import type { Recommendation } from '@/types/document';

// Schéma de validation Zod pour les recommandations
export const recommendationSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  normReference: z.object({
    code: z.string(),
    description: z.string(),
    requirement: z.string()
  }),
  priority: z.enum(["critical", "high", "medium", "low"]),
  timeFrame: z.enum(["immediate", "short_term", "long_term"]),
  impact: z.object({
    energyEfficiency: z.number().min(0).max(100),
    performance: z.number().min(0).max(100),
    compliance: z.number().min(0).max(100),
    details: z.object({
      energyEfficiency: z.string(),
      performance: z.string(),
      compliance: z.string()
    })
  })
});

export class RecommendationValidator {
  constructor(private schema: z.ZodType<any>) {}

  validate(recommendations: any) {
    try {
      if (Array.isArray(recommendations)) {
        recommendations.forEach(rec => this.schema.parse(rec));
        return { isValid: true, errors: [] };
      } else {
        this.schema.parse(recommendations);
        return { isValid: true, errors: [] };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        };
      }
      return {
        isValid: false,
        errors: [{ path: 'unknown', message: 'Erreur de validation inconnue' }]
      };
    }
  }
}

export class BusinessRulesValidator {
  validate(recommendations: Recommendation[]) {
    const errors = [];
    
    // Vérification des règles métier
    for (const rec of recommendations) {
      // Vérifier la cohérence entre priorité et délai
      if (rec.priority === 'critical' && rec.timeFrame !== 'immediate') {
        errors.push({
          path: `${rec.id}.timeFrame`,
          message: 'Les recommandations critiques doivent avoir un délai immédiat'
        });
      }

      // Vérifier que l'impact est cohérent
      if (rec.impact.energyEfficiency > 0 && !rec.impact.details.energyEfficiency) {
        errors.push({
          path: `${rec.id}.impact.details.energyEfficiency`,
          message: 'Les détails d\'impact énergétique sont requis'
        });
      }

      // Autres règles métier...
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class RecommendationEnricher {
  enrich(recommendations: Recommendation[], context: any) {
    return recommendations.map(rec => ({
      ...rec,
      // Enrichir avec le contexte client
      clientContext: {
        industryBenchmarks: this.getIndustryBenchmarks(context.industryBenchmarks, rec),
        regulatoryImpact: this.getComplianceImpact(context.regulatoryRequirements, rec),
        estimatedCosts: this.calculateCosts(context.costDatabase, rec)
      },
      // Ajouter des métriques et KPIs
      metrics: {
        roi: this.calculateROI(rec, context),
        implementationComplexity: this.assessComplexity(rec),
        riskLevel: this.assessRisk(rec)
      }
    }));
  }

  private getIndustryBenchmarks(benchmarks: any, recommendation: Recommendation) {
    // Logique pour obtenir les benchmarks pertinents
    return {};
  }

  private getComplianceImpact(requirements: any, recommendation: Recommendation) {
    // Évaluer l'impact sur la conformité
    return {};
  }

  private calculateCosts(costDb: any, recommendation: Recommendation) {
    // Estimation des coûts
    return {};
  }

  private calculateROI(recommendation: Recommendation, context: any) {
    // Calcul du ROI
    return 0;
  }

  private assessComplexity(recommendation: Recommendation) {
    // Évaluation de la complexité
    return 'medium';
  }

  private assessRisk(recommendation: Recommendation) {
    // Évaluation des risques
    return 'low';
  }
}

export class RecommendationPrioritizer {
  constructor(private criteria: any) {}

  prioritize(recommendations: Recommendation[]) {
    return recommendations.sort((a, b) => {
      // Calcul du score de priorité
      const scoreA = this.calculatePriorityScore(a);
      const scoreB = this.calculatePriorityScore(b);
      return scoreB - scoreA;
    });
  }

  private calculatePriorityScore(recommendation: Recommendation) {
    const weights = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    };

    const priorityScore = weights[recommendation.priority] || 1;
    const impactScore = (
      recommendation.impact.energyEfficiency +
      recommendation.impact.performance +
      recommendation.impact.compliance
    ) / 3;

    return priorityScore * impactScore;
  }
}
