const generateEnvironmentalRecommendationsPrompt = (auditData: any) => `En tant qu'expert en audit environnemental de datacenters, analysez les données environnementales et générez des recommandations spécifiques.

DONNÉES ENVIRONNEMENTALES FOURNIES :
${JSON.stringify(auditData, null, 2)}

INSTRUCTIONS SPÉCIFIQUES ENVIRONNEMENTALES :
1. Analysez l'impact environnemental
2. Évaluez l'efficacité énergétique
3. Identifiez les opportunités d'amélioration
4. Proposez des solutions durables
5. Quantifiez les bénéfices environnementaux

FORMAT DE RÉPONSE ENVIRONNEMENTALE :
{
  "recommendations": [
    {
      "id": "ENV_001",
      "title": "Titre de la recommandation environnementale",
      "description": "Description détaillée de l'amélioration environnementale",
      "priority": "critical|high|medium|low",
      "environmentalImpact": {
        "energyEfficiency": 0-100,
        "carbonReduction": 0-100,
        "resourceOptimization": 0-100
      },
      "implementation": {
        "difficulty": "high|medium|low",
        "estimatedCost": "€€€|€€|€",
        "timeframe": "immediate|short_term|medium_term|long_term",
        "sustainabilityMetrics": ["Métriques de durabilité"]
      }
    }
  ],
  "environmentalAnalysis": {
    "summary": "Synthèse de l'impact environnemental",
    "currentPUE": "Valeur",
    "sustainabilityScore": 0-100,
    "keyMetrics": {
      "energy": ["Métriques énergétiques"],
      "water": ["Métriques eau"],
      "waste": ["Métriques déchets"]
    }
  }
}

CRITÈRES SPÉCIFIQUES :
- Focus sur l'optimisation environnementale
- Mesures d'efficacité énergétique
- Solutions écologiques innovantes
- ROI environnemental
- Conformité aux normes vertes

IMPORTANT :
- Concentrez-vous uniquement sur l'aspect environnemental
- Ne pas mélanger avec les autres types d'audit
- Quantifier l'impact environnemental de chaque recommandation`;

export default generateEnvironmentalRecommendationsPrompt;
