import type { Request, Response } from 'express';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function exportToWord(req: Request, res: Response) {
  try {
    const { recommendations } = req.body;

    if (!Array.isArray(recommendations)) {
      return res.status(400).json({
        error: "Format de recommandations invalide"
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Rapport de Recommandations",
            heading: HeadingLevel.HEADING_1,
          }),
          ...recommendations.flatMap(rec => [
            new Paragraph({
              text: rec.title,
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Description : ",
                  bold: true
                }),
                new TextRun(rec.description)
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Priorité : ",
                  bold: true
                }),
                new TextRun(rec.priority)
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Impact : ",
                  bold: true
                })
              ]
            }),
            ...Object.entries(rec.impact || {}).map(([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun(`${key}: ${value}%`)
                ],
                indent: { left: 720 }
              })
            ),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Mise en œuvre : ",
                  bold: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun(`Difficulté : ${rec.implementation.difficulty}`),
              ],
              indent: { left: 720 }
            }),
            new Paragraph({
              children: [
                new TextRun(`Délai : ${rec.implementation.timeframe}`),
              ],
              indent: { left: 720 }
            })
          ])
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=recommendations.docx');

    res.send(buffer);
  } catch (error) {
    console.error('Error in exportToWord:', error);
    res.status(500).json({
      error: "Erreur lors de l'export Word"
    });
  }
}

export async function exportToExcel(req: Request, res: Response) {
  // À implémenter si nécessaire
  res.status(501).json({
    error: "Export Excel pas encore implémenté"
  });
}