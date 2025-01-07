const generateRecommendationsPrompt = (auditData: any) => `En tant qu'expert en audit de datacenters, analysez les données d'audit suivantes et générez des recommandations détaillées en français.

DONNÉES D'AUDIT FOURNIES :
${JSON.stringify(auditData, null, 2)}

INSTRUCTIONS :
1. Analysez en profondeur les données fournies
2. Identifiez les points forts et les points d'amélioration
3. Proposez des recommandations concrètes et actionnables
4. Priorisez les actions en fonction de leur impact et urgence
5. Fournissez des explications détaillées pour chaque aspect

FORMAT DE RÉPONSE ATTENDU :
{
  "recommendations": [
    {
      "id": "REC_001",
      "title": "Titre concis de la recommandation",
      "description": "Description détaillée expliquant le contexte, la problématique et la solution proposée",
      "priority": "critique|élevée|moyenne|faible",
      "impact": {
        "efficacite": 0-100, // Impact sur l'efficacité opérationnelle avec explication détaillée
        "fiabilite": 0-100, // Impact sur la fiabilité avec explication détaillée
        "conformite": 0-100 // Impact sur la conformité aux normes avec explication détaillée
      },
      "implementation": {
        "difficulte": "élevée|moyenne|faible",
        "delai": "immediat|court_terme|moyen_terme|long_terme",
        "prerequis": ["Liste des prérequis nécessaires"],
        "benefices": ["Liste détaillée des bénéfices pour le client"]
      },
      "materiels": [
        {
          "nom": "Nom du matériel",
          "description": "Description détaillée",
          "specifications": ["Spécifications techniques"],
          "alternatives": [
            {
              "nom": "Nom de l'alternative",
              "description": "Description de l'alternative",
              "avantages": ["Liste des avantages"],
              "inconvenients": ["Liste des inconvénients"]
            }
          ],
          "delai_mise_en_place": "Estimation du délai",
          "benefices_client": ["Bénéfices spécifiques pour le client"]
        }
      ]
    }
  ],
  "analyse": {
    "resume": "Synthèse globale de l'analyse",
    "points_forts": ["Points forts identifiés avec explications"],
    "points_amelioration": ["Points d'amélioration identifiés avec explications"],
    "impacts": {
      "description": "Explication détaillée du graphique d'impacts",
      "analyse_efficacite": "Analyse détaillée de l'impact sur l'efficacité",
      "analyse_fiabilite": "Analyse détaillée de l'impact sur la fiabilité",
      "analyse_conformite": "Analyse détaillée de l'impact sur la conformité"
    }
  },
  "conformite": {
    "matrice": {
      "description": "Explication détaillée de la matrice de conformité",
      "niveaux": [
        {
          "categorie": "Nom de la catégorie",
          "niveau": 0-100,
          "explication": "Explication détaillée du niveau de conformité",
          "actions_requises": ["Actions nécessaires avec justification"]
        }
      ]
    }
  },
  "planning": {
    "description": "Vue d'ensemble du planning",
    "phases": [
      {
        "nom": "Nom de la phase",
        "description": "Description détaillée de la phase",
        "duree": "Durée estimée",
        "taches": [
          {
            "nom": "Nom de la tâche",
            "description": "Description détaillée",
            "ressources": ["Ressources nécessaires"],
            "dependances": ["Dépendances avec justification"],
            "impact_business": "Impact sur l'activité"
          }
        ]
      }
    ]
  },
  "standards": {
    "description": "Vue d'ensemble des standards applicables",
    "normes": [
      {
        "nom": "Nom de la norme",
        "version": "Version applicable",
        "description": "Description détaillée",
        "clauses": [
          {
            "id": "Identifiant de la clause",
            "titre": "Titre de la clause",
            "exigences": "Description des exigences",
            "niveau_conformite": 0-100,
            "actions_necessaires": ["Actions requises pour la conformité"]
          }
        ]
      }
    ]
  },
  "documentation": {
    "categories": [
      {
        "nom": "Nom de la catégorie",
        "description": "Description de la catégorie de documents",
        "documents": [
          {
            "titre": "Titre du document",
            "description": "Description détaillée",
            "statut": "Complet|En révision|À mettre à jour",
            "derniere_maj": "Date de dernière mise à jour",
            "niveau_requis": "Niveau de certification requis",
            "importance": "Explication de l'importance du document"
          }
        ]
      }
    ]
  }
}

CRITÈRES D'ÉVALUATION :
- Pertinence : Les recommandations doivent être directement liées aux données d'audit
- Faisabilité : Chaque recommandation doit être réaliste et actionnable
- Priorisation : L'ordre des recommandations doit refléter leur importance relative
- Complétude : Toutes les dimensions critiques doivent être couvertes
- Clarté : Les explications doivent être compréhensibles par des non-experts

IMPORTANT :
- La réponse doit être uniquement au format JSON spécifié
- Toutes les explications doivent être en français
- Chaque section doit inclure des explications détaillées pour les non-experts
- Ne pas inclure de références aux coûts monétaires
- Mettre l'accent sur les bénéfices pour le client`;

export default generateRecommendationsPrompt;