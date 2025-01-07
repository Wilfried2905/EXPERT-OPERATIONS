const generateRecommendationsPrompt = (auditData: any) => `En tant qu'expert en audit de datacenters, analysez les données d'audit suivantes et générez des recommandations détaillées.

DONNÉES D'AUDIT FOURNIES :
${JSON.stringify(auditData, null, 2)}

INSTRUCTIONS :
1. Analysez en profondeur les données fournies
2. Identifiez les points forts et les points d'amélioration 
3. Proposez des recommandations concrètes et actionnables
4. Priorisez les actions en fonction de leur impact et urgence
5. Indiquez clairement si des données supplémentaires sont nécessaires

FORMAT DE RÉPONSE ATTENDU :
{
  "recommendations": [
    {
      "id": "REC_001", // Identifiant unique de la recommandation
      "title": "Titre concis de la recommandation",
      "description": "Description détaillée expliquant le contexte, la problématique et la solution proposée",
      "priority": "critical|high|medium|low",
      "impact": {
        "efficiency": 0-100, // Impact sur l'efficacité opérationnelle
        "reliability": 0-100, // Impact sur la fiabilité
        "compliance": 0-100 // Impact sur la conformité aux normes
      },
      "implementation": {
        "difficulty": "high|medium|low",
        "estimatedCost": "€€€|€€|€", 
        "timeframe": "immediate|short_term|medium_term|long_term",
        "prerequisites": ["Liste des prérequis nécessaires"]
      },
      "dataQuality": {
        "completeness": 0-100, // Niveau de complétude des données pour cette recommandation
        "missingData": ["Liste des données manquantes importantes"]
      }
    }
  ],
  "analysis": {
    "summary": "Synthèse globale de l'analyse",
    "strengths": ["Points forts identifiés"],
    "weaknesses": ["Points d'amélioration identifiés"],
    "dataQuality": {
      "availableData": ["Liste des types de données analysées"],  
      "missingCriticalData": ["Données importantes manquantes"],
      "confidenceLevel": "high|medium|low"
    }
  },
  "context": {
    "standards": ["Normes et standards applicables"],
    "constraints": ["Contraintes identifiées"],
    "assumptions": ["Hypothèses prises en compte"]
  }
}

CRITÈRES D'ÉVALUATION :
- Pertinence : Les recommandations doivent être directement liées aux données d'audit
- Faisabilité : Chaque recommandation doit être réaliste et actionnable
- Priorisation : L'ordre des recommandations doit refléter leur importance relative
- Complétude : Toutes les dimensions critiques doivent être couvertes
- Précision : Les impacts et coûts doivent être justifiés par les données disponibles

IMPORTANT :
- La réponse doit être uniquement au format JSON spécifié
- Chaque recommandation doit être auto-suffisante et compréhensible
- Les estimations doivent être basées sur les données disponibles
- Indiquer clairement quand une recommandation nécessite des données supplémentaires`;

export default generateRecommendationsPrompt;