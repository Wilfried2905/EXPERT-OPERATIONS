import { useToast } from '@/hooks/use-toast';
import { AuditData } from '@/types/audit';

interface RecommendationsResponse {
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'critique' | 'élevée' | 'moyenne' | 'faible';
    impact: {
      efficacite: number;
      fiabilite: number;
      conformite: number;
    };
    implementation: {
      difficulte: 'élevée' | 'moyenne' | 'faible';
      delai: 'immediat' | 'court_terme' | 'moyen_terme' | 'long_terme';
      prerequis: string[];
      benefices: string[];
    };
  }>;
  analyse: {
    resume: string;
    points_forts: string[];
    points_amelioration: string[];
    impacts: {
      description: string;
      analyse_efficacite: string;
      analyse_fiabilite: string;
      analyse_conformite: string;
    };
  };
}

export async function generateRecommendations(auditData: AuditData): Promise<RecommendationsResponse> {
  try {
    console.log('Service client - generateRecommendations:', { auditData });

    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ auditData })
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

    // Vérification et transformation des données
    if (!data || typeof data !== 'object') {
      throw new Error("Format de réponse invalide");
    }

    // Construction d'une réponse valide même si certaines données sont manquantes
    return {
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      analyse: {
        resume: data.analyse?.resume || "",
        points_forts: Array.isArray(data.analyse?.points_forts) ? data.analyse.points_forts : [],
        points_amelioration: Array.isArray(data.analyse?.points_amelioration) ? data.analyse.points_amelioration : [],
        impacts: {
          description: data.analyse?.impacts?.description || "",
          analyse_efficacite: data.analyse?.impacts?.analyse_efficacite || "",
          analyse_fiabilite: data.analyse?.impacts?.analyse_fiabilite || "",
          analyse_conformite: data.analyse?.impacts?.analyse_conformite || ""
        }
      }
    };
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