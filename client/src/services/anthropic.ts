import { useToast } from '@/hooks/use-toast';

interface AuditData {
  infrastructure: {
    questionnaire: {
      resultats: Record<string, Record<string, string | null>>;
      scores: {
        global: ScoreInfo;
        parGroupe: Record<string, ScoreInfo>;
      };
    };
  };
}

interface ScoreInfo {
  score: number;
  repondu: number;
  nom: string;
}

interface AnthropicOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface GenerateRecommendationsParams {
  auditData: AuditData;
  options?: AnthropicOptions;
}

export async function generateRecommendations({ auditData, options = {} }: GenerateRecommendationsParams) {
  try {
    const response = await fetch('/api/anthropic/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auditData, options })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Le serveur n'a pas renvoyé du JSON comme attendu");
    }

    return await response.json();
  } catch (error) {
    console.error('Error in generateRecommendations:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de la génération des recommandations');
  }
}

export async function generateMatrixCompliance(auditData: AuditData) {
  try {
    const response = await fetch('/api/anthropic/compliance-matrix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Le serveur n'a pas renvoyé du JSON comme attendu");
    }

    return await response.json();
  } catch (error) {
    console.error('Error in generateMatrixCompliance:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de la génération de la matrice de conformité');
  }
}

export async function generateGanttData(recommendations: any[]) {
  try {
    const response = await fetch('/api/anthropic/gantt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommendations })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Le serveur n'a pas renvoyé du JSON comme attendu");
    }

    return await response.json();
  } catch (error) {
    console.error('Error in generateGanttData:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de la génération des données Gantt');
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

interface Recommendation {
  // Add your Recommendation interface here if needed.
}