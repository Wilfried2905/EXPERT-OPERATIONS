import { AuditData } from '@/types/audit';

export const generateOperationalAuditPrompt = (auditData: AuditData): string => `
En tant qu'expert en audit opérationnel de datacenters, analysez les données d'audit suivantes et générez un rapport détaillé sur l'efficacité opérationnelle de l'infrastructure.

DONNÉES D'AUDIT FOURNIES :
${JSON.stringify(auditData, null, 2)}

FORMAT DE RÉPONSE ATTENDU :
{
  "overview": {
    "operationalMaturity": {
      "score": 0-100,
      "level": "initial|managed|defined|measured|optimized",
      "keyFindings": ["string"]
    },
    "domainScores": {
      "processManagement": 0-100,
      "incidentResponse": 0-100,
      "changeManagement": 0-100,
      "capacityManagement": 0-100,
      "securityOperations": 0-100,
      "performanceMonitoring": 0-100
    },
    "criticalIssues": [
      {
        "domain": "string",
        "description": "string",
        "risk": "critical|high|medium|low",
        "businessImpact": "string"
      }
    ]
  }
}

DOMAINES D'ÉVALUATION :
1. Gestion des processus
   - Documentation des procédures
   - Maturité des processus
   - Efficacité des workflows

2. Réponse aux incidents
   - Procédures d'escalade
   - Temps de résolution
   - Communication de crise

3. Gestion des changements
   - Processus de validation
   - Tests et rollback
   - Impact assessment

4. Gestion de la capacité
   - Monitoring des ressources
   - Planification
   - Optimisation

5. Opérations de sécurité
   - Contrôles d'accès
   - Surveillance
   - Réponse aux incidents

6. Monitoring de performance
   - KPIs opérationnels
   - Reporting
   - Amélioration continue
`;

export default generateOperationalAuditPrompt;