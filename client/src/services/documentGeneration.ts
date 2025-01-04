import { Anthropic } from '@anthropic-ai/sdk';

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'TECHNICAL_OFFER',
  AUDIT_REPORT = 'AUDIT_REPORT',
  SPECIFICATIONS = 'SPECIFICATIONS'
}

// Interface pour les données d'entrée
interface DocumentGenerationInput {
  type: DocumentType;
  clientInfo: {
    name: string;
    industry: string;
    size: string;
  };
  auditData: {
    recommendations: any[];
    metrics: {
      pue: number[];
      availability: number[];
      tierLevel: number;
      complianceGaps: string[];
    };
    infrastructure: {
      rooms: any[];
      equipment: any[];
    };
    compliance: {
      matrix: any;
      score: number;
    };
  };
  additionalData?: {
    images?: string[];
    documents?: string[];
    comments?: string[];
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let lastError: any;

  while (retries < maxRetries) {
    try {
      if (retries > 0) {
        const delayTime = initialDelay * Math.pow(2, retries - 1);
        await delay(delayTime);
        console.log(`Retrying request... Attempt ${retries + 1}/${maxRetries}`);
      }
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.status === 529 || error?.error?.type === 'overloaded_error') {
        retries++;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

// Fonction pour générer le prompt en fonction du type de document
function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel et accessible aux non-experts basé sur les informations suivantes.
Utilisez un langage clair et précis, en expliquant les termes techniques lorsque nécessaire.

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%

Instructions spécifiques:
1. Rédigez de manière professionnelle tout en restant accessible aux lecteurs non-experts
2. Expliquez brièvement les termes techniques à leur première apparition
3. Utilisez des exemples concrets pour illustrer les concepts complexes
4. Intégrez les recommandations et données collectées de manière cohérente
`;

  switch (input.type) {
    case DocumentType.TECHNICAL_OFFER:
      return `${baseContext}
Générez une offre technique complète selon le plan suivant :

1. Introduction
   - Présentation de 3R TECHNOLOGIE
   - Expertise en datacenters
   - Certifications TIA-942
   - Équipe projet et qualifications
   - Références projets similaires
   - Méthodologie de gestion de projet
   - Partenariats stratégiques

2. Analyse des Besoins
   - Contexte et enjeux client
   - Objectifs de conformité TIA-942
   - Contraintes techniques et opérationnelles
   - Exigences de performance
   - Parties prenantes et organisation
   - Critères de succès du projet

3. Architecture Technique TIA-942
   - Classification Tier visée
   - Architecture générale
   - Redondance N+1/2N selon Tier
   - Points de défaillance unique (SPOF)
   - Évolutivité et scalabilité
   - Indicateurs de performance (PUE, DCIE)
   - Stratégie de maintenance

4. Infrastructures Critiques
   - Alimentation électrique
   - Système de refroidissement
   - Sécurité physique
   - Connectivité
   - Plan de continuité d'activité
   - Procédures d'exploitation

5. Conformité et Certification
   - Analyse des écarts TIA-942
   - Plan de mise en conformité
   - Processus de certification
   - Documentation requise
   - Tests et validations

6. Planification et Budget
   - Planning détaillé
   - Budget prévisionnel
   - Analyse des risques
   - Plan de transition
   - Plan de formation
   - Conditions de garantie`;

    case DocumentType.SPECIFICATIONS:
      return `${baseContext}
Générez un cahier des charges détaillé selon le plan suivant :

1. Présentation du Projet
   - Contexte général
   - Objectifs du projet
   - Périmètre d'intervention
   - Classification Tier visée
   - Parties prenantes
   - Budget prévisionnel
   - Critères de succès

2. Exigences TIA-942
   - Conformité architecturale
   - Conformité électrique
   - Conformité climatisation
   - Conformité sécurité
   - Niveaux de redondance requis
   - Métriques de performance attendues
   - Exigences de monitoring

3. Spécifications Techniques
   - Architecture physique
   - Infrastructure électrique
   - Système de refroidissement
   - Sécurité et monitoring
   - Infrastructure réseau
   - Plan de continuité d'activité
   - Évolutivité technique

4. Exigences Opérationnelles
   - Disponibilité et SLA
   - Maintenance préventive
   - Documentation technique
   - Formation du personnel
   - Gestion des incidents
   - Procédures d'exploitation
   - Exigences de reporting

5. Contraintes et Prérequis
   - Contraintes site et bâtiment
   - Contraintes réglementaires
   - Contraintes techniques spécifiques
   - Prérequis d'installation
   - Normes applicables

6. Modalités de Réception
   - Critères d'acceptation
   - Processus de validation
   - Tests de réception
   - Livrables attendus
   - Conditions de garantie
   - Conditions contractuelles`;

    case DocumentType.AUDIT_REPORT:
      return `${baseContext}
Générez un rapport d'audit détaillé selon le plan suivant :

1. Résumé Exécutif
   - Objectifs de l'audit
   - Méthodologie d'évaluation
   - Synthèse des conclusions majeures
   - Recommandations prioritaires
   - Impact financier des non-conformités
   - Analyse des risques
   - ROI des améliorations proposées

2. Présentation du Site Audité
   - Informations client
   - Description des installations
   - Configuration des salles techniques
   - Inventaire des équipements critiques
   - Organisation opérationnelle
   - Processus actuels
   - Historique des incidents

3. Analyse de Conformité TIA-942
   - Architecture et Structure
   - Système Électrique
   - Système de Refroidissement
   - Sécurité et Contrôle d'Accès
   - Conformité des Infrastructures
   - Points d'Amélioration
   - Comparaison avec les standards du marché
   - Évaluation de la maturité opérationnelle
   - Analyse des procédures

4. Recommandations
   - Améliorations Prioritaires
   - Plan d'Action Détaillé
   - Estimations Budgétaires
   - Calendrier de Mise en Œuvre
   - Analyse coût-bénéfice
   - Scénarios alternatifs
   - Impact opérationnel
   - Plan de formation
   - Indicateurs de suivi

5. Annexes
   - Rapports de Tests
   - Documentation Technique
   - Photos et Schémas
   - Références Normatives
   - Matrices de conformité
   - Historique des mesures
   - Fiches d'incidents
   - Plans d'actions correctives`;

    default:
      throw new Error('Type de document non supporté');
  }
}

export async function generateDocument(input: DocumentGenerationInput): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  });

  const prompt = generatePrompt(input);

  try {
    const response = await retryWithExponentialBackoff(async () => {
      return await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    if (error?.status === 529 || error?.error?.type === 'overloaded_error') {
      throw new Error('Le service est temporairement surchargé. Veuillez réessayer dans quelques instants.');
    }
    throw new Error('Une erreur est survenue lors de la génération du document. Veuillez réessayer.');
  }
}