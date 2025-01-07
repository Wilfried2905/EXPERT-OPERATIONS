const generateMultisiteRecommendationsPrompt = (auditData: any) => `En tant qu'expert en audit multisite de datacenters, analysez les données multi-sites et générez des recommandations spécifiques.

DONNÉES MULTISITE FOURNIES :
${JSON.stringify(auditData, null, 2)}

INSTRUCTIONS SPÉCIFIQUES MULTISITE :
1. Analysez la coordination inter-sites
2. Évaluez la standardisation des pratiques
3. Identifiez les synergies potentielles
4. Proposez des optimisations multi-sites
5. Définir la gouvernance globale

FORMAT DE RÉPONSE MULTISITE :
{
  "recommendations": [
    {
      "id": "MULTI_001",
      "title": "Titre de la recommandation multisite",
      "description": "Description détaillée de l'amélioration multi-sites",
      "priority": "critical|high|medium|low",
      "multisiteImpact": {
        "coordination": 0-100,
        "standardization": 0-100,
        "efficiency": 0-100
      },
      "implementation": {
        "difficulty": "high|medium|low",
        "estimatedCost": "€€€|€€|€",
        "timeframe": "immediate|short_term|medium_term|long_term",
        "sitesConcerned": ["Sites concernés"]
      }
    }
  ],
  "multisiteAnalysis": {
    "summary": "Synthèse de l'analyse multisite",
    "coordinationLevel": "high|medium|low",
    "standardizationStatus": {
      "processes": ["Processus standardisés"],
      "tools": ["Outils communs"],
      "gaps": ["Écarts de standardisation"]
    },
    "siteInteractions": {
      "dependencies": ["Dépendances inter-sites"],
      "synergies": ["Synergies identifiées"],
      "conflicts": ["Conflits potentiels"]
    }
  }
}

CRITÈRES SPÉCIFIQUES :
- Focus sur la coordination multi-sites
- Harmonisation des pratiques
- Optimisation des ressources partagées
- Gouvernance commune
- Gestion des interdépendances

IMPORTANT :
- Concentrez-vous uniquement sur l'aspect multisite
- Ne pas mélanger avec les autres types d'audit
- Considérer l'impact sur tous les sites concernés`;

export default generateMultisiteRecommendationsPrompt;
