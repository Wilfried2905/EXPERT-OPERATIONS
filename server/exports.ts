import type { Request, Response } from 'express';
import { Document, Packer, Paragraph, TextRun } from 'docx';

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
            children: [
              new TextRun({
                text: "Rapport de Recommandations",
                bold: true,
                size: 32
              })
            ]
          }),
          ...recommendations.map(rec => [
            new Paragraph({
              children: [
                new TextRun({
                  text: rec.title,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: rec.description
                })
              ]
            })
          ]).flat()
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
