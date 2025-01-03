import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType } from 'docx';
import * as XLSX from 'xlsx';
import type { Recommendation } from '../store/useRecommendationsStore';

interface ExportData {
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
    progress: number;
    impact: {
      energyEfficiency: number;
      performance: number;
      compliance: number;
    };
  }>;
  impacts: Array<{
    title: string;
    impacts: {
      energyEfficiency: { value: number; details: string };
      performance: { value: number; details: string };
      compliance: { value: number; details: string };
    };
  }>;
  matrix: Array<{
    category: string;
    description: string;
    level: number;
    actions: Array<{
      name: string;
      requirement: string;
    }>;
  }>;
  planning: Array<{
    name: string;
    description: string;
    duration: string;
    phases: Array<{
      name: string;
      duration: string;
    }>;
  }>;
}

export async function exportToWord(data: ExportData): Promise<Blob> {
  const sections = [];

  // En-tête du document
  sections.push(
    new Paragraph({
      text: "Rapport de Recommandations",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
          size: 24
        })
      ],
      spacing: { after: 400 }
    })
  );

  // Section Recommandations
  sections.push(
    new Paragraph({
      text: "1. Recommandations",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  data.recommendations.forEach((rec, index) => {
    sections.push(
      new Paragraph({
        text: `${index + 1}. ${rec.title}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: rec.description,
        spacing: { after: 100 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Priorité")] }),
              new TableCell({ children: [new Paragraph(rec.priority)] }),
              new TableCell({ children: [new Paragraph("Progression")] }),
              new TableCell({ children: [new Paragraph(`${rec.progress}%`)] })
            ]
          })
        ]
      })
    );
  });

  // Section Impacts
  sections.push(
    new Paragraph({
      text: "2. Analyse des Impacts",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  data.impacts.forEach(impact => {
    sections.push(
      new Paragraph({
        text: impact.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Type d'impact")] }),
              new TableCell({ children: [new Paragraph("Valeur")] }),
              new TableCell({ children: [new Paragraph("Détails")] })
            ]
          }),
          ...Object.entries(impact.impacts).map(([type, data]) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(type)] }),
                new TableCell({ children: [new Paragraph(`${data.value}%`)] }),
                new TableCell({ children: [new Paragraph(data.details)] })
              ]
            })
          )
        ]
      })
    );
  });

  // Section Matrice de Conformité
  sections.push(
    new Paragraph({
      text: "3. Matrice de Conformité",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  data.matrix.forEach(item => {
    sections.push(
      new Paragraph({
        text: item.category,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: item.description,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Niveau de conformité: ${item.level}%`,
        spacing: { after: 100 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: item.actions.map(action =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(action.name)] }),
              new TableCell({ children: [new Paragraph(action.requirement)] })
            ]
          })
        )
      })
    );
  });

  // Section Planning
  sections.push(
    new Paragraph({
      text: "4. Planning d'Implémentation",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  data.planning.forEach(plan => {
    sections.push(
      new Paragraph({
        text: plan.name,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: plan.description,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Durée estimée: ${plan.duration}`,
        spacing: { after: 100 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Phase")] }),
              new TableCell({ children: [new Paragraph("Durée")] })
            ]
          }),
          ...plan.phases.map(phase =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(phase.name)] }),
                new TableCell({ children: [new Paragraph(phase.duration)] })
              ]
            })
          )
        ]
      })
    );
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });

  return Packer.toBlob(doc);
}

export async function exportToExcel(recommendations: Recommendation[]): Promise<Blob> {
  const workbook = XLSX.utils.book_new();
  const wsData = recommendations.map(rec => ({
    'Titre': rec.title,
    'Description': rec.description,
    'Priorité': rec.priority,
    'Impact Performance (%)': (rec.impact?.performance || 0) * 100,
    'Impact Conformité (%)': (rec.impact?.compliance || 0) * 100,
    'Progression (%)': rec.progress || 0
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, ws, "Recommandations");

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}