import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType } from 'docx';
import * as XLSX from 'xlsx';
import type { Recommendation } from '../store/useRecommendationsStore';

export async function exportToWord(recommendations: Recommendation[]): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "Rapport de Recommandations",
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 200
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
              size: 24
            })
          ],
          spacing: {
            after: 400
          }
        }),
        ...recommendations.flatMap(rec => [
          new Paragraph({
            text: rec.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: rec.description,
            spacing: { after: 200 }
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Priorité" })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: rec.priority })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Temporalité" })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: rec.timeFrame })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  })
                ]
              })
            ]
          }),
          new Paragraph({
            text: "Impact",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Coût" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${(rec.impact.cost * 100).toFixed(1)}%` })] }),
                  new TableCell({ children: [new Paragraph({ text: "Performance" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${(rec.impact.performance * 100).toFixed(1)}%` })] }),
                  new TableCell({ children: [new Paragraph({ text: "Conformité" })] }),
                  new TableCell({ children: [new Paragraph({ text: `${(rec.impact.compliance * 100).toFixed(1)}%` })] })
                ]
              })
            ]
          }),
          ...rec.alternatives.map(alt => [
            new Paragraph({
              text: "Alternative",
              heading: HeadingLevel.HEADING_4,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({ text: alt.description }),
            new Paragraph({
              text: "Avantages:",
              spacing: { before: 100 }
            }),
            ...alt.pros.map(pro => 
              new Paragraph({
                text: `• ${pro}`,
                indent: { left: 400 }
              })
            ),
            new Paragraph({
              text: "Inconvénients:",
              spacing: { before: 100 }
            }),
            ...alt.cons.map(con =>
              new Paragraph({
                text: `• ${con}`,
                indent: { left: 400 }
              })
            ),
            new Paragraph({
              text: `Coût estimé: ${alt.estimatedCost}€`,
              spacing: { before: 100, after: 200 }
            })
          ]).flat()
        ])
      ]
    }]
  });

  return Packer.toBlob(doc);
}

export async function exportToExcel(recommendations: Recommendation[]): Promise<Blob> {
  const workbook = XLSX.utils.book_new();

  // Feuille principale des recommandations
  const wsData = recommendations.map(rec => ({
    'Titre': rec.title,
    'Description': rec.description,
    'Priorité': rec.priority,
    'Temporalité': rec.timeFrame,
    'Impact Coût (%)': (rec.impact.cost * 100).toFixed(1),
    'Impact Performance (%)': (rec.impact.performance * 100).toFixed(1),
    'Impact Conformité (%)': (rec.impact.compliance * 100).toFixed(1),
    'Progression (%)': rec.progress,
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
      'Coût Estimé (€)': alt.estimatedCost
    }))
  );
  const wsAlternatives = XLSX.utils.json_to_sheet(alternativesData);
  XLSX.utils.book_append_sheet(workbook, wsAlternatives, "Alternatives");

  // Feuille des métriques
  const metricsData = recommendations.map(rec => ({
    'Recommandation': rec.title,
    'PUE': rec.metrics.pue,
    'Disponibilité (%)': rec.metrics.availability,
    'Niveau TIER': rec.metrics.tierLevel,
    'Écarts de Conformité': rec.metrics.complianceGaps.join(", ")
  }));
  const wsMetrics = XLSX.utils.json_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(workbook, wsMetrics, "Métriques");

  // Génération du fichier Excel
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}