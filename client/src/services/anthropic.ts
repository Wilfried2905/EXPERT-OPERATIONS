import Anthropic from '@anthropic-ai/sdk';
import type { Recommendation, Priority, TimeFrame } from '../store/useRecommendationsStore';
import crypto from 'crypto';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AuditData {
  metrics: {
    pue: number[];
    availability: number[];
    tierLevel: number | null;
    complianceGaps: string[];
  };
  responses: Record<string, { 
    status: string; 
    comments: string;
    attachments?: string[];
  }>;
  additionalData?: {
    images?: string[];
    documents?: string[];
    comments?: string[];
  };
}

export async function generateRecommendations(auditData: AuditData): Promise<Recommendation[]> {
  try {
    const prompt = `En tant qu'expert en audit de datacenters, analyse en détail toutes les données suivantes et génère des recommandations détaillées et approfondies.

Données d'audit complètes à analyser:
${JSON.stringify(auditData, null, 2)}

Instructions d'analyse:
1. Analyser les métriques quantitatives (PUE, disponibilité, TIER)
2. Évaluer les commentaires qualitatifs et observations
3. Examiner les images et documents fournis
4. Identifier les écarts par rapport aux normes ISO/IEC
5. Comparer avec les meilleures pratiques du secteur
6. Considérer les benchmarks industriels

Génère des recommandations structurées selon ce format:
1. Titre
2. Description détaillée incluant:
   - Contexte spécifique du datacenter
   - Justification basée sur les normes
   - Référence aux meilleures pratiques
3. Priorité (critique/haute/moyenne/faible) avec justification
4. Temporalité (immédiat/court terme/long terme) avec planning suggéré
5. Impact détaillé:
   - Coût (0-1) avec estimation budgétaire
   - Performance (0-1) avec métriques attendues
   - Conformité (0-1) avec normes concernées
6. Alternatives possibles:
   - Description
   - Avantages détaillés
   - Inconvénients potentiels
   - Estimation des coûts
7. Métriques impactées:
   - PUE cible
   - Disponibilité attendue
   - Niveau TIER visé
   - Points de conformité adressés

Format ta réponse en JSON pour faciliter le parsing.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    const parsedContent = JSON.parse(response.content[0].text);
    if (!Array.isArray(parsedContent)) {
      throw new Error('Invalid recommendations format: expected array');
    }

    return parsedContent.map((rec: any) => ({
      id: crypto.randomUUID(),
      title: rec.title,
      description: rec.description,
      priority: rec.priority as Priority,
      timeFrame: rec.timeFrame as TimeFrame,
      impact: {
        cost: rec.impact.cost,
        performance: rec.impact.performance,
        compliance: rec.impact.compliance
      },
      alternatives: rec.alternatives.map((alt: any) => ({
        description: alt.description,
        pros: alt.pros,
        cons: alt.cons,
        estimatedCost: alt.estimatedCost
      })),
      metrics: {
        pue: rec.metrics.pue,
        availability: rec.metrics.availability,
        tierLevel: rec.metrics.tierLevel,
        complianceGaps: rec.metrics.complianceGaps
      },
      progress: 0,
      implemented: false
    }));
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
  }
}

export async function generateMatrixCompliance(auditData: AuditData) {
  try {
    const prompt = `Génère une matrice de conformité détaillée basée sur ces données:
    ${JSON.stringify(auditData, null, 2)}

    Format ta réponse en JSON avec:
    - Catégories de conformité (ISO/IEC, normes sectorielles)
    - Niveau de conformité actuel (%)
    - Écarts détaillés
    - Actions requises priorisées
    - Références aux normes spécifiques
    - Impact business
    - Risques associés`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Error generating compliance matrix:', error);
    throw new Error('Failed to generate compliance matrix');
  }
}

export async function generateGanttData(recommendations: Recommendation[]) {
  try {
    const prompt = `Génère un planning Gantt détaillé pour ces recommandations:
    ${JSON.stringify(recommendations, null, 2)}

    Format ta réponse en JSON avec:
    - Tâches et sous-tâches
    - Durées estimées précises
    - Dépendances et chemins critiques
    - Ressources nécessaires
    - Jalons clés
    - Risques et contingences
    - Estimations de coûts`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Error generating Gantt data:', error);
    throw new Error('Failed to generate Gantt data');
  }
}

export async function exportToWord(recommendations: Recommendation[]) {
  // TODO: Implement Word export using a library like docx
  throw new Error('Not implemented');
}

export async function exportToExcel(recommendations: Recommendation[]) {
  // TODO: Implement Excel export using a library like xlsx
  throw new Error('Not implemented');
}