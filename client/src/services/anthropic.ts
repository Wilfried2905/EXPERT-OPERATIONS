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

export async function generateRecommendations(auditData: AuditData) {
  try {
    const response = await fetch('/api/anthropic/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw error;
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate compliance matrix');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating compliance matrix:', error);
    throw error;
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate Gantt data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating Gantt data:', error);
    throw error;
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