const generateRecommendationsPrompt = (auditData: any) => `En tant qu'expert en audit de datacenters, analysez les données d'audit suivantes et générez des recommandations détaillées en français.

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
3. Long terme (>12 mois)

FORMAT JSON ATTENDU :
{
  "recommendations": [
    {
      "id": "REC_001",
      "titre": "Titre concis de la recommandation",
      "description": "Description détaillée expliquant le contexte, la problématique et la solution proposée",
      "priorite": "critique|élevée|moyenne|faible",
      "impact": {
        "efficacite": {
          "score": 0-100,
          "explication": "Explication détaillée de l'impact sur l'efficacité"
        },
        "fiabilite": {
          "score": 0-100,
          "explication": "Explication détaillée de l'impact sur la fiabilité"
        },
        "conformite": {
          "score": 0-100,
          "explication": "Explication détaillée de l'impact sur la conformité"
        }
      },
      "mise_en_oeuvre": {
        "difficulte": "élevée|moyenne|faible",
        "delai": "immediat|court_terme|moyen_terme|long_terme",
        "prerequis": ["Liste des prérequis nécessaires"],
        "benefices_client": ["Liste détaillée des bénéfices pour le client"]
      },
      "materiels": [
        {
          "nom": "Nom du matériel",
          "description": "Description détaillée",
          "specifications": ["Spécifications techniques"],
          "alternatives": [
            {
              "nom": "Nom de l'alternative",
              "description": "Description détaillée",
              "avantages": ["Liste des avantages"],
              "inconvenients": ["Liste des inconvénients"],
              "benefices_client": ["Bénéfices spécifiques pour le client"]
            }
          ],
          "delai_mise_en_place": "Estimation du délai"
        }
      ]
    }
  ],
  "analyse": {
    "resume": "Synthèse globale de l'analyse",
    "points_forts": [
      {
        "titre": "Titre du point fort",
        "description": "Explication détaillée"
      }
    ],
    "points_amelioration": [
      {
        "titre": "Titre du point d'amélioration",
        "description": "Explication détaillée"
      }
    ],
    "impacts": {
      "description_generale": "Explication détaillée du graphique d'impacts",
      "analyse_detaillee": {
        "efficacite": "Analyse approfondie de l'impact sur l'efficacité",
        "fiabilite": "Analyse approfondie de l'impact sur la fiabilité",
        "conformite": "Analyse approfondie de l'impact sur la conformité"
      },
      "recommandations_specifiques": ["Recommandations basées sur l'analyse d'impact"]
    }
  },
  "matrice_conformite": {
    "description": "Explication détaillée de la matrice de conformité",
    "methodologie": "Description de la méthodologie d'évaluation",
    "categories": [
      {
        "nom": "Nom de la catégorie",
        "niveau": 0-100,
        "explication": "Explication détaillée du niveau de conformité",
        "points_forts": ["Points forts identifiés"],
        "points_amelioration": ["Points à améliorer"],
        "actions_requises": ["Actions nécessaires avec justification"]
      }
    ],
    "synthese": "Synthèse globale de la conformité"
  },
  "planning": {
    "description": "Vue d'ensemble du planning",
    "objectifs": ["Objectifs principaux du planning"],
    "phases": [
      {
        "nom": "Nom de la phase",
        "description": "Description détaillée",
        "duree": "Durée estimée",
        "priorite": "haute|moyenne|basse",
        "taches": [
          {
            "nom": "Nom de la tâche",
            "description": "Description détaillée",
            "ressources_requises": ["Ressources nécessaires"],
            "dependances": ["Dépendances avec justification"],
            "impact_operations": "Impact sur les opérations courantes",
            "resultats_attendus": ["Résultats attendus"]
          }
        ],
        "jalons": ["Points de contrôle importants"]
      }
    ],
    "risques_mitigation": [
      {
        "risque": "Description du risque",
        "impact": "Impact potentiel",
        "mesures": ["Mesures de mitigation proposées"]
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
        "perimetre": "Périmètre d'application",
        "clauses": [
          {
            "id": "Identifiant de la clause",
            "titre": "Titre de la clause",
            "exigences": "Description des exigences",
            "niveau_conformite": 0-100,
            "evaluation": "Évaluation détaillée",
            "actions_requises": ["Actions requises pour la conformité"],
            "impact_business": "Impact sur l'activité"
          }
        ],
        "niveau_global": 0-100,
        "prochaines_etapes": ["Actions recommandées"]
      }
    ],
    "synthese_conformite": "Synthèse globale de la conformité aux standards"
  },
  "documentation": {
    "description": "Vue d'ensemble de la documentation",
    "categories": [
      {
        "nom": "Nom de la catégorie",
        "description": "Description de la catégorie",
        "importance": "Explication de l'importance",
        "documents": [
          {
            "titre": "Titre du document",
            "description": "Description détaillée",
            "statut": "Complet|En révision|À mettre à jour",
            "derniere_maj": "Date de dernière mise à jour",
            "niveau_requis": "Niveau de certification requis",
            "importance": "Explication de l'importance",
            "contenu_requis": ["Éléments requis"],
            "impact_conformite": "Impact sur la conformité"
          }
        ]
      }
    ],
    "recommandations": [
      {
        "titre": "Titre de la recommandation",
        "description": "Description détaillée",
        "priorite": "haute|moyenne|basse",
        "actions": ["Actions recommandées"]
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