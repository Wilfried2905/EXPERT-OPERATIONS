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

// Fonction pour générer le prompt en fonction du type de document
function generatePrompt(input: DocumentGenerationInput): string {
  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel détaillé basé sur les informations suivantes :

Client: ${input.clientInfo.name}
Secteur: ${input.clientInfo.industry}
Taille: ${input.clientInfo.size}

Métriques clés:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Principaux écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}

Score de conformité global: ${input.auditData.compliance.score}%
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

2. Analyse des Besoins
   - Contexte et enjeux client
   - Objectifs de conformité TIA-942
   - Contraintes techniques et opérationnelles
   - Exigences de performance

3. Architecture Technique TIA-942
   - Classification Tier visée
   - Architecture générale
   - Redondance N+1/2N selon Tier
   - Points de défaillance unique (SPOF)

4. Infrastructures Critiques
   - Alimentation électrique
   - Système de refroidissement
   - Sécurité physique
   - Connectivité`;

    case DocumentType.AUDIT_REPORT:
      return `${baseContext}
Générez un rapport d'audit détaillé selon le plan suivant :
1. Résumé Exécutif
   - Objectifs de l'audit
   - Méthodologie d'évaluation
   - Synthèse des conclusions majeures
   - Recommandations prioritaires

2. Analyse de Conformité TIA-942
   - Architecture et Structure
   - Système Électrique
   - Système de Refroidissement
   - Sécurité et Contrôle d'Accès
   - Conformité des Infrastructures
   - Points d'Amélioration

3. Recommandations
   - Améliorations Prioritaires
   - Plan d'Action Détaillé
   - Estimations Budgétaires
   - Calendrier de Mise en Œuvre`;

    case DocumentType.SPECIFICATIONS:
      return `${baseContext}
Générez un cahier des charges détaillé selon le plan suivant :
1. Présentation du Projet
   - Contexte général
   - Objectifs du projet
   - Périmètre d'intervention
   - Classification Tier visée

2. Exigences TIA-942
   - Conformité architecturale
   - Conformité électrique
   - Conformité climatisation
   - Conformité sécurité
   - Niveaux de redondance requis

3. Spécifications Techniques
   - Architecture physique
   - Infrastructure électrique
   - Système de refroidissement
   - Sécurité et monitoring
   - Infrastructure réseau`;

    default:
      throw new Error('Type de document non supporté');
  }
}

export async function generateDocument(input: DocumentGenerationInput): Promise<string> {
  try {
    const anthropic = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    });

    const prompt = generatePrompt(input);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    throw error;
  }
}