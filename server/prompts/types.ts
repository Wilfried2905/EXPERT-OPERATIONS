// Types communs pour les données d'audit
export interface BaseAuditData {
  clientInfo: {
    name: string;
    industry?: string;
    size?: string;
  };
  metrics: {
    [key: string]: any;
  };
  infrastructure: {
    rooms?: string[];
    equipment?: string[];
    [key: string]: any;
  };
  compliance: {
    score?: number;
    matrix?: Record<string, number>;
    [key: string]: any;
  };
}

// Types spécifiques pour chaque catégorie
export interface PreAuditData extends BaseAuditData {
  certificationLevel?: string;
  documentationStatus?: {
    available: string[];
    missing: string[];
    toUpdate: string[];
  };
}

export interface EnvironmentalAuditData extends BaseAuditData {
  energyMetrics?: {
    pue: number[];
    carbonFootprint?: number;
    renewableEnergy?: number;
  };
  wastageMetrics?: {
    recycling: number;
    hazardousWaste: number;
  };
}

export interface MultisiteAuditData extends BaseAuditData {
  sites: {
    id: string;
    name: string;
    location: string;
    metrics: Record<string, any>;
  }[];
  coordination?: {
    tools: string[];
    processes: string[];
    challenges: string[];
  };
}

// Type union pour toutes les données d'audit
export type AuditData = PreAuditData | EnvironmentalAuditData | MultisiteAuditData;
