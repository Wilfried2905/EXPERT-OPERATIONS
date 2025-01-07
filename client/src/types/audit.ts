export interface TierLevel {
  current: 1 | 2 | 3 | 4;
  target: 1 | 2 | 3 | 4;
}

export interface DomainCompliance {
  compliance: number;
  gaps: string[];
  requirements: string[];
  criticalIssues: string[];
}

export interface TIA942Domains {
  architectural: DomainCompliance;
  electrical: DomainCompliance;
  mechanical: DomainCompliance;
  telecommunications: DomainCompliance;
}

export interface AuditData {
  facilityInfo: any;
  measurements: any;
  tierLevel: TierLevel;
  compliance: TIA942Domains;
}
