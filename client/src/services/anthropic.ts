import { useToast } from '@/hooks/use-toast';
import { AuditData } from '@/types/audit';

interface RecommendationsResponse {
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    impact: {
      efficiency: number;
      reliability: number;
      compliance: number;
    };
    implementation: {
      difficulty: 'high' | 'medium' | 'low';
      timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
      prerequisites: string[];
    };
  }>;
}

export async function generateRecommendations(params: { auditData: AuditData; options?: any }): Promise<RecommendationsResponse> {
  try {
    const response = await fetch('/api/anthropic/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La réponse du serveur n'est pas au format JSON");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.recommendations)) {
      throw new Error("Format de réponse invalide");
    }

    return data;
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

export async function exportToWord(recommendations: any[]) {
  try {
    const response = await fetch('/api/exports/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommendations })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erreur lors de l'export Word: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recommendations.docx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error in exportToWord:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de l\'export Word');
  }
}

export async function exportToExcel(recommendations: any[]) {
  try {
    const response = await fetch('/api/exports/excel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommendations })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error in exportToExcel:', error);
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de l\'export Excel');
  }
}

interface Recommendation {
  // Add your Recommendation interface here if needed.
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