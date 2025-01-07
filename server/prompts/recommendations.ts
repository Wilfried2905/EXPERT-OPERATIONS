const generateRecommendationsPrompt = (auditData: any) => `As a datacenter audit expert, analyze the following audit data and generate detailed recommendations.

AUDIT DATA:
${JSON.stringify(auditData, null, 2)}

EXPECTED JSON OUTPUT FORMAT:
{
  "recommendations": [
    {
      "id": "REC_001",
      "title": "Concise recommendation title",
      "description": "Detailed description explaining context, issue and proposed solution",
      "priority": "critical|high|medium|low",
      "impact": {
        "efficiency": {
          "score": 0-100,
          "explanation": "Detailed explanation of efficiency impact"
        },
        "reliability": {
          "score": 0-100,
          "explanation": "Detailed explanation of reliability impact"
        },
        "compliance": {
          "score": 0-100,
          "explanation": "Detailed explanation of compliance impact"
        }
      },
      "implementation": {
        "difficulty": "high|medium|low",
        "timeframe": "immediate|short_term|medium_term|long_term",
        "prerequisites": ["List of required prerequisites"],
        "benefits": ["Detailed list of benefits for the client"]
      },
      "equipment": [
        {
          "name": "Equipment name",
          "description": "Detailed description",
          "specifications": ["Technical specifications"],
          "alternatives": [
            {
              "name": "Alternative name",
              "description": "Detailed description",
              "pros": ["List of advantages"],
              "cons": ["List of disadvantages"],
              "benefits": ["Specific client benefits"]
            }
          ],
          "implementation_time": "Time estimate"
        }
      ]
    }
  ],
  "analysis": {
    "summary": "Global analysis summary",
    "strengths": [
      {
        "title": "Strength title",
        "description": "Detailed explanation"
      }
    ],
    "weaknesses": [
      {
        "title": "Weakness title",
        "description": "Detailed explanation"
      }
    ],
    "impacts": {
      "overview": "Detailed explanation of impact chart",
      "detailed_analysis": {
        "efficiency": "In-depth efficiency impact analysis",
        "reliability": "In-depth reliability impact analysis",
        "compliance": "In-depth compliance impact analysis"
      },
      "specific_recommendations": ["Recommendations based on impact analysis"]
    }
  },
  "compliance_matrix": {
    "description": "Detailed explanation of compliance matrix",
    "methodology": "Description of evaluation methodology",
    "categories": [
      {
        "name": "Category name",
        "level": 0-100,
        "explanation": "Detailed compliance level explanation",
        "strengths": ["Identified strengths"],
        "weaknesses": ["Areas to improve"],
        "required_actions": ["Required actions with justification"]
      }
    ],
    "summary": "Global compliance summary"
  },
  "planning": {
    "description": "Planning overview",
    "objectives": ["Main planning objectives"],
    "phases": [
      {
        "name": "Phase name",
        "description": "Detailed description",
        "duration": "Estimated duration",
        "priority": "high|medium|low",
        "tasks": [
          {
            "name": "Task name",
            "description": "Detailed description",
            "required_resources": ["Required resources"],
            "dependencies": ["Dependencies with justification"],
            "operations_impact": "Impact on current operations",
            "expected_results": ["Expected results"]
          }
        ],
        "milestones": ["Important checkpoints"]
      }
    ],
    "risks_mitigation": [
      {
        "risk": "Risk description",
        "impact": "Potential impact",
        "measures": ["Proposed mitigation measures"]
      }
    ]
  }
}

EVALUATION CRITERIA:
- Relevance: Recommendations must be directly related to audit data
- Feasibility: Each recommendation must be realistic and actionable
- Prioritization: Order recommendations by their relative importance
- Completeness: Cover all critical dimensions
- Clarity: Explanations must be understandable by non-experts

IMPORTANT:
- Response must be in the specified JSON format only
- Focus on actionable recommendations
- Include detailed explanations for non-experts`;

export default generateRecommendationsPrompt;