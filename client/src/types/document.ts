export interface CollectedData {
  documents: Document[];
  images?: ImageData[];
  metrics: AuditMetrics;
  infrastructure: InfrastructureData;
  comments: Comment[];
}

export interface Document {
  type: string;
  content: string;
  metadata: {
    date: string;
    version: string;
    author: string;
  };
}

export interface AnalyzedData {
  keyFindings: Finding[];
  metrics: ProcessedMetrics;
  recommendations: RecommendationSchema; // Changed to use the new schema
  risks: Risk[];
  timeline: TimelineEvent[];
}

export interface Finding {
  id: string;
  category: string;
  description: string;
  impact: string;
}

export interface ProcessedMetrics {
  pue: number[];
  availability: number[];
  compliance: {
    score: number;
    details: Record<string, any>;
  };
  trends: Record<string, any>;
}

export interface RecommendationSchema {
  recommendations: RecommendationDetail[];
}

export interface RecommendationDetail {
  id: string;
  title: string;
  description: string;
  context: {
    currentState: string;
    businessImpact: string;
    risks: string[];
  };
  implementation: {
    steps: ImplementationStep[];
    prerequisites: string[];
    constraints: string[];
    estimatedCost: CostEstimate;
  };
  benefits: {
    quantitative: {
      roi: number;
      paybackPeriod: string;
      energySavings: number;
      capacityImprovement: number;
    };
    qualitative: string[];
  };
  risks: RiskAssessment[];
  alternatives: Alternative[];
  kpis: KPI[];
  validation: {
    criteria: string[];
    testingProcedure: string;
    acceptanceCriteria: string[];
  };
}

interface ImplementationStep {
  order: number;
  description: string;
  duration: string;
  dependencies: string[];
  resources: string[];
}

interface CostEstimate {
  min: number;
  max: number;
  currency: string;
  breakdown: {
    category: string;
    amount: number;
  }[];
}

interface RiskAssessment {
  category: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
}

interface Alternative {
  description: string;
  pros: string[];
  cons: string[];
}

interface KPI {
  metric: string;
  current: number;
  target: number;
  unit: string;
}


export interface Risk {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface TimelineEvent {
  date: string;
  description: string;
  type: string;
}