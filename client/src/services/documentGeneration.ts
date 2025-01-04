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
    additionalData?: {
      images?: string[];
      documents?: string[];
      comments?: string[];
    };
  };
}

// Interface pour le tracking des logs
interface GenerationLog {
  timestamp: string;
  documentType: DocumentType;
  clientName: string;
  status: 'started' | 'completed' | 'failed';
  error?: string;
  duration?: number;
}

const generationLogs: GenerationLog[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function logGeneration(log: GenerationLog) {
  generationLogs.push(log);
  console.log(`[Document Generation] ${log.timestamp} - ${log.status} - ${log.documentType} for ${log.clientName}${log.error ? ` - Error: ${log.error}` : ''}`);
}

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      if (retries > 0) {
        const delayTime = initialDelay * Math.pow(2, retries - 1);
        await delay(delayTime);
        console.log(`[Retry] Attempt ${retries + 1}/${maxRetries} after ${delayTime}ms delay`);
      }
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`[Retry] Error on attempt ${retries + 1}:`, error);
      if (error instanceof Error && (error.message.includes('overloaded') || error.message.includes('529'))) {
        retries++;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel et accessible aux non-experts basé sur les informations suivantes.
Utilisez un langage clair et précis, en expliquant les termes techniques lorsque nécessaire.

POINT PRIORITAIRE :
Il est IMPÉRATIF d'utiliser et de faire référence à la norme TIA-942 et ses normes affiliées tout au long de la rédaction.
Toutes les recommandations, analyses et spécifications techniques doivent être alignées avec les exigences de la norme TIA-942.

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%

Instructions pour les éléments visuels :
1. Insérez des graphiques pour illustrer les métriques clés (PUE, disponibilité)
2. Ajoutez des diagrammes d'architecture pour les sections techniques
3. Incluez des schémas explicatifs pour les concepts complexes
4. Utilisez des tableaux de comparaison pour les analyses
5. Ajoutez des photos ou schémas pertinents des installations

Instructions spécifiques:
1. Rédigez de manière professionnelle tout en restant accessible aux lecteurs non-experts
2. Expliquez brièvement les termes techniques à leur première apparition
3. Utilisez des exemples concrets pour illustrer les concepts complexes
4. Intégrez les recommandations et données collectées de manière cohérente
5. Pour chaque section technique, citez les exigences spécifiques de la norme TIA-942 applicables
6. Détaillez comment les solutions proposées répondent aux critères de la norme TIA-942
7. Incluez les références aux normes affiliées pertinentes (électrique, climatisation, sécurité, etc.)`;

  const documentTypePrompts = {
    [DocumentType.TECHNICAL_OFFER]: `${baseContext}
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
   - Conditions de garantie`,
    [DocumentType.SPECIFICATIONS]: `${baseContext}
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
   - Conditions contractuelles`,
    [DocumentType.AUDIT_REPORT]: `${baseContext}
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
   - Plans d'actions correctives`
  };

  return documentTypePrompts[input.type];
}

export async function generateDocument(input: DocumentGenerationInput): Promise<string> {
  const startTime = Date.now();

  // Log generation start
  logGeneration({
    timestamp: new Date().toISOString(),
    documentType: input.type,
    clientName: input.clientInfo.name,
    status: 'started'
  });

  try {
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('VITE_ANTHROPIC_API_KEY is not set. Please check your environment variables.');
    }

    const anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(input);
    console.log(`[Generation] Starting generation for ${input.type} - Client: ${input.clientInfo.name}`);

    const response = await retryWithExponentialBackoff(async () => {
      console.log('[API] Sending request to Anthropic API...');
      const result = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      if (!result.content || result.content.length === 0) {
        throw new Error('Empty response from Anthropic API');
      }

      const content = result.content[0];
      if (!('text' in content)) {
        throw new Error('Unexpected response format from Anthropic API');
      }

      return content.text;
    });

    // Log successful completion
    logGeneration({
      timestamp: new Date().toISOString(),
      documentType: input.type,
      clientName: input.clientInfo.name,
      status: 'completed',
      duration: Date.now() - startTime
    });

    return response;
  } catch (error) {
    // Log failure
    logGeneration({
      timestamp: new Date().toISOString(),
      documentType: input.type,
      clientName: input.clientInfo.name,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    });

    console.error('Erreur lors de la génération du document:', error);
    throw new Error('Une erreur est survenue lors de la génération du document. Veuillez réessayer.');
  }
}

// Nouvelle fonction pour récupérer les logs de génération
export function getGenerationLogs(): GenerationLog[] {
  return generationLogs;
}

// Fonction pour analyser les logs
export function analyzeGenerationLogs() {
  const totalAttempts = generationLogs.length;
  const failures = generationLogs.filter(log => log.status === 'failed').length;
  const successes = generationLogs.filter(log => log.status === 'completed').length;
  const averageDuration = generationLogs
    .filter(log => log.duration)
    .reduce((acc, log) => acc + (log.duration || 0), 0) / successes;

  return {
    totalAttempts,
    failures,
    successes,
    successRate: (successes / totalAttempts) * 100,
    averageDuration
  };
}