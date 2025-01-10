import type { Request, Response } from 'express';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExportValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ExportData {
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
    impact: {
      efficiency: number;
      reliability: number;
      compliance: number;
    };
  }>;
  clientInfo: {
    name: string;
    type: string;
  };
  metadata: {
    auditType: string;
    date: string;
  };
}

function validateExportData(data: any): ExportValidationResult {
  const errors: string[] = [];

  if (!data.recommendations || !Array.isArray(data.recommendations)) {
    errors.push("Les recommandations sont requises et doivent être un tableau");
  }

  if (!data.clientInfo?.name) {
    errors.push("Le nom du client est requis");
  }

  if (!data.metadata?.auditType) {
    errors.push("Le type d'audit est requis");
  }

  if (data.recommendations?.length === 0) {
    errors.push("Au moins une recommandation est requise");
  }

  data.recommendations?.forEach((rec: any, index: number) => {
    if (!rec.title) {
      errors.push(`La recommandation #${index + 1} doit avoir un titre`);
    }
    if (!rec.description) {
      errors.push(`La recommandation #${index + 1} doit avoir une description`);
    }
    if (!rec.priority) {
      errors.push(`La recommandation #${index + 1} doit avoir une priorité définie`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function exportToWord(data: ExportData): Promise<Buffer> {
  const validation = validateExportData(data);
  if (!validation.isValid) {
    throw new Error(`Validation des données échouée: ${validation.errors.join(", ")}`);
  }

  try {
    const formattedDate = format(new Date(), 'ddMMyyyy', { locale: fr });
    const fileName = `3R_Recommandations_${data.metadata.auditType}_${data.clientInfo.name}_${formattedDate}`;

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
          ...data.recommendations.flatMap(rec => [
            new Paragraph({
              text: rec.title,
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
                new TextRun(rec.priority)
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
            ...Object.entries(rec.impact).map(([key, value]) =>
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
            )
          ])
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  } catch (error) {
    console.error('Error in exportToWord:', error);
    throw new Error(`Erreur lors de la génération du document Word: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

export async function handleExport(req: Request, res: Response, exportType: 'word' | 'excel') {
  try {
    const { recommendations, clientInfo, metadata } = req.body;

    const validation = validateExportData({ recommendations, clientInfo, metadata });
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation des données échouée",
        details: validation.errors
      });
    }

    if (exportType === 'word') {
      const buffer = await exportToWord({ recommendations, clientInfo, metadata });
      const formattedDate = format(new Date(), 'ddMMyyyy', { locale: fr });
      const fileName = `3R_Recommandations_${metadata.auditType}_${clientInfo.name}_${formattedDate}`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
      res.send(buffer);
    } else {
      throw new Error("Export Excel pas encore implémenté côté serveur");
    }
  } catch (error) {
    console.error(`Error in ${exportType} export:`, error);
    res.status(500).json({
      error: `Erreur lors de l'export ${exportType}`,
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}