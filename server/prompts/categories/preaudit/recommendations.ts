const generatePreAuditRecommendationsPrompt = (auditData: any) => `En tant qu'expert en pré-audit de datacenters, analysez les données spécifiques au pré-audit et générez des recommandations ciblées.

DONNÉES DE PRÉ-AUDIT FOURNIES :
${JSON.stringify(auditData, null, 2)}

INSTRUCTIONS SPÉCIFIQUES AU PRÉ-AUDIT :
1. Analysez la préparation à la certification
2. Évaluez la conformité initiale
3. Identifiez les écarts critiques
4. Proposez un plan de mise en conformité
5. Priorisez les actions pré-certification

FORMAT DE RÉPONSE PRÉ-AUDIT :
{
  "recommendations": [
    {
      "id": "PREAUDIT_001",
      "title": "Titre de la recommandation pré-audit",
      "description": "Description détaillée de l'action pré-certification",
      "priority": "critical|high|medium|low",
      "certificationImpact": {
        "readiness": 0-100,
        "compliance": 0-100,
        "documentation": 0-100
      },
      "implementation": {
        "difficulty": "high|medium|low",
        "estimatedCost": "€€€|€€|€",
        "timeframe": "immediate|short_term|medium_term|long_term",
        "prerequisites": ["Liste des prérequis"]
      }
    }
  ],
  "preAuditAnalysis": {
    "summary": "Synthèse de l'état de préparation",
    "readinessLevel": "high|medium|low",
    "majorGaps": ["Liste des écarts majeurs"],
    "documentationStatus": {
      "available": ["Documents disponibles"],
      "missing": ["Documents manquants"],
      "toUpdate": ["Documents à mettre à jour"]
    }
  }
}

CRITÈRES SPÉCIFIQUES :
- Focus sur la préparation à la certification
- Alignement avec les standards visés
- Priorisation des actions pré-certification
- Évaluation de la maturité documentaire
- Identification des prérequis critiques

IMPORTANT :
- Concentrez-vous uniquement sur les aspects pré-audit
- Ne pas mélanger avec les autres types d'audit
- Toujours lier les recommandations aux exigences de certification`;

export default generatePreAuditRecommendationsPrompt;
