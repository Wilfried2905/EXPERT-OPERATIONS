const generateRecommendationsPrompt = (auditData: any) => `En tant qu'expert en infrastructure datacenter, analysez les données d'audit suivantes et générez des recommandations détaillées.

DONNÉES D'AUDIT :
${JSON.stringify(auditData, null, 2)}

FORMAT DE SORTIE :
Structurez la réponse avec :

### Synthèse
[Résumé des points clés]  (Correspond à "analysis": {"summary": ...})

### Points Forts
- [Liste des aspects positifs identifiés] (Correspond à "analysis": {"strengths": ...})

### Points d'Amélioration
- [Liste des aspects nécessitant une amélioration] (Correspond à "analysis": {"weaknesses": ...})

### Recommandations Prioritaires
(Correspond à "recommendations": [...])
1. [Recommandation détaillée, incluant id, title, description, priority, impact, implementation, dataQuality comme dans le format JSON original]
   - Impact attendu (Correspond à impact)
   - Délai suggéré (Correspond à implementation.timeframe)
   - Estimation budgétaire (Correspond à implementation.estimatedCost)


### Plan d'Action
1. Court terme (0-3 mois)
2. Moyen terme (3-12 mois)
3. Long terme (>12 mois)

IMPORTANT : 
- Les recommandations doivent être concrètes et actionnables
- Chaque recommandation doit inclure une estimation de l'impact
- Priorisez les actions selon leur urgence et leur importance
- Basez les estimations sur les données disponibles`;

export default generateRecommendationsPrompt;