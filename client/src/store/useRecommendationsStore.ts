import { create } from 'zustand';

export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TimeFrame = 'immediate' | 'short_term' | 'long_term';

export interface Impact {
  cost: number;
  performance: number;
  compliance: number;
}

export interface Alternative {
  description: string;
  pros: string[];
  cons: string[];
  estimatedCost: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  timeFrame: TimeFrame;
  impact: Impact;
  alternatives: Alternative[];
  metrics: {
    pue: number | null;
    availability: number | null;
    tierLevel: number | null;
    complianceGaps: string[];
  };
  progress: number;
  implemented: boolean;
}

interface RecommendationsState {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  setRecommendations: (recommendations: Recommendation[]) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
  recommendations: [],
  loading: false,
  error: null,
  setRecommendations: (recommendations) => set({ recommendations }),
  updateRecommendation: (id, updates) =>
    set((state) => ({
      recommendations: state.recommendations.map((rec) =>
        rec.id === id ? { ...rec, ...updates } : rec
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
