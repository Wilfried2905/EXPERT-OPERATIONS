import type { Request, Response } from 'express';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, StyleLevel } from 'docx';

export async function exportToWord(recommendations: any[], fileName: string) {
  try {
    const doc = new Document({
      title: fileName,
      description: "Rapport de recommandations d'audit",
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 24
            }
          }
        ]
      },
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Rapport de Recommandations",
            heading: HeadingLevel.HEADING_1,
            spacing: {
              before: 240,
              after: 120
            }
          }),
          ...recommendations.flatMap(rec => [
            new Paragraph({
              text: rec.titre,
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 240,
                after: 120
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Description : ",
                  bold: true
                }),
                new TextRun(rec.description)
              ],
              spacing: {
                before: 120,
                after: 120
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Priorité : ",
                  bold: true
                }),
                new TextRun(rec.priorite)
              ],
              spacing: {
                before: 120,
                after: 120
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Section : ",
                  bold: true
                }),
                new TextRun(rec.section || "Non spécifiée")
              ],
              spacing: {
                before: 120,
                after: 120
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Impact : ",
                  bold: true
                })
              ],
              spacing: {
                before: 120,
                after: 60
              }
            }),
            ...Object.entries(rec.impact || {}).map(([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun(`${key}: ${value}%`)
                ],
                indent: { left: 720 },
                spacing: {
                  before: 60,
                  after: 60
                }
              })
            ),
            new Paragraph({
              text: "",
              spacing: {
                before: 120,
                after: 120
              }
            })
          ])
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  } catch (error) {
    console.error('Error in exportToWord:', error);
    throw error;
  }
}

export async function exportToExcel(req: Request, res: Response) {
  try{
    throw new Error("Export Excel pas encore implémenté");
  } catch (error) {
    console.error('Error in exportToExcel:', error);
    res.status(501).json({
      error: "Export Excel pas encore implémenté"
    });
  }
}