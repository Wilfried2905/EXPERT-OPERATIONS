import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';
import type { Recommendation } from '../store/useRecommendationsStore';

export async function exportToWord(recommendations: Recommendation[]): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun("Recommandations d'Audit"),
            new TextRun({
              text: `Généré le ${new Date().toLocaleDateString()}`,
              break: 1
            })
          ]
        }),
        ...recommendations.map(rec => [
          new Paragraph({
            children: [new TextRun({ text: rec.title, bold: true, size: 28 })]
          }),
          new Paragraph({
            children: [new TextRun({ text: rec.description })]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Priorité: ${rec.priority}`, bold: true }),
              new TextRun({ text: ` | Temporalité: ${rec.timeFrame}` })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ 
                text: `Impact: Coût (${rec.impact.cost}), Performance (${rec.impact.performance}), Conformité (${rec.impact.compliance})`
              })
            ]
          }),
          new Paragraph({ text: "Alternatives:" }),
          ...rec.alternatives.map(alt => [
            new Paragraph({ text: alt.description }),
            new Paragraph({ text: `Avantages: ${alt.pros.join(", ")}` }),
            new Paragraph({ text: `Inconvénients: ${alt.cons.join(", ")}` }),
            new Paragraph({ text: `Coût estimé: ${alt.estimatedCost}€` })
          ]).flat()
        ]).flat()
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function exportToExcel(recommendations: Recommendation[]): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // Feuille principale des recommandations
  const wsData = recommendations.map(rec => ({
    'Titre': rec.title,
    'Description': rec.description,
    'Priorité': rec.priority,
    'Temporalité': rec.timeFrame,
    'Impact Coût': rec.impact.cost,
    'Impact Performance': rec.impact.performance,
    'Impact Conformité': rec.impact.compliance,
    'Progression': rec.progress,
    'Implémenté': rec.implemented ? 'Oui' : 'Non'
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, ws, "Recommandations");

  // Feuille des alternatives
  const alternativesData = recommendations.flatMap(rec => 
    rec.alternatives.map(alt => ({
      'Recommandation': rec.title,
      'Alternative': alt.description,
      'Avantages': alt.pros.join(", "),
      'Inconvénients': alt.cons.join(", "),
      'Coût Estimé': alt.estimatedCost
    }))
  );
  const wsAlternatives = XLSX.utils.json_to_sheet(alternativesData);
  XLSX.utils.book_append_sheet(workbook, wsAlternatives, "Alternatives");

  // Feuille des métriques
  const metricsData = recommendations.map(rec => ({
    'Recommandation': rec.title,
    'PUE': rec.metrics.pue,
    'Disponibilité': rec.metrics.availability,
    'Niveau TIER': rec.metrics.tierLevel,
    'Écarts de Conformité': rec.metrics.complianceGaps.join(", ")
  }));
  const wsMetrics = XLSX.utils.json_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(workbook, wsMetrics, "Métriques");

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
