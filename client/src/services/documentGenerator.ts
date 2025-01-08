import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageNumber, AlignmentType, WidthType, Header, Footer, convertInchesToTwip } from 'docx';
import type { DocumentData } from '@/types/document';
import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export class DocumentGenerator {
  private styles = {
    heading1: { fontSize: 24, bold: true, spacing: { before: 240, after: 120 } },
    heading2: { fontSize: 16, bold: true, spacing: { before: 240, after: 120 } },
    normal: { fontSize: 11, spacing: { before: 60, after: 60 } },
    table: { fontSize: 10 }
  };

  async generateDocument(data: DocumentData): Promise<Buffer> {
    try {
      console.log('[DocumentGenerator] Starting document generation');

      // Get document structure based on type
      const sections = await this.getDocumentStructure(data);

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                width: convertInchesToTwip(8.5),
                height: convertInchesToTwip(11)
              },
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1)
              }
            }
          },
          headers: {
            default: new Header({
              children: [this.createHeader(data)]
            })
          },
          footers: {
            default: new Footer({
              children: [this.createFooter()]
            })
          },
          children: [
            ...this.createCoverPage(data),
            ...sections
          ]
        }]
      });

      console.log('[DocumentGenerator] Document structure created, generating buffer');
      return await Packer.toBuffer(doc);
    } catch (error) {
      console.error('[DocumentGenerator] Error generating document:', error);
      throw new Error('Erreur lors de la génération du document');
    }
  }

  private async getDocumentStructure(data: DocumentData): Promise<Paragraph[]> {
    const documentSections = this.getDefaultSections(data.type);
    const paragraphs: Paragraph[] = [];

    for (const section of documentSections) {
      // Add section title
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
          pageBreakBefore: true
        })
      );

      // Add section content
      if (section.items && section.items.length > 0) {
        for (const item of section.items) {
          paragraphs.push(
            new Paragraph({
              text: `• ${item}`,
              spacing: { before: 100, after: 100 }
            })
          );
        }
      }

      // Add subsections if any
      if (section.subsections) {
        for (const subsection of section.subsections) {
          paragraphs.push(
            new Paragraph({
              text: subsection.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 }
            })
          );

          if (subsection.items) {
            for (const item of subsection.items) {
              paragraphs.push(
                new Paragraph({
                  text: `• ${item}`,
                  spacing: { before: 100, after: 100 }
                })
              );
            }
          }
        }
      }
    }

    return paragraphs;
  }

  private getDefaultSections(type: string) {
    // Define default sections based on document type
    switch (type) {
      case 'Rapport d\'Audit':
        return [
          {
            title: "1. Résumé Exécutif",
            items: [
              "Objectifs de l'audit",
              "Méthodologie d'évaluation",
              "Synthèse des conclusions majeures"
            ]
          },
          {
            title: "2. Analyse de Conformité TIA-942",
            items: [
              "Architecture et Structure",
              "Système Électrique",
              "Système de Refroidissement",
              "Sécurité et Contrôle d'Accès"
            ]
          },
          {
            title: "3. Recommandations",
            items: [
              "Améliorations Prioritaires",
              "Plan d'Action Détaillé",
              "Estimations Budgétaires"
            ]
          }
        ];
      // Add other document types here
      default:
        return [
          {
            title: "Section par défaut",
            items: ["Contenu à définir"]
          }
        ];
    }
  }

  private createHeader(data: DocumentData): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: "3R TECHNOLOGIE",
          bold: true,
          size: 24
        }),
        new TextRun({
          text: ` | ${data.type}`,
          size: 24
        })
      ],
      alignment: AlignmentType.LEFT
    });
  }

  private createFooter(): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: "Page ",
          size: 20
        }),
        new TextRun({
          children: [PageNumber.CURRENT],
          size: 20
        })
      ],
      alignment: AlignmentType.CENTER
    });
  }

  private createCoverPage(data: DocumentData): Paragraph[] {
    return [
      new Paragraph({
        text: "3R TECHNOLOGIE",
        heading: HeadingLevel.TITLE,
        spacing: { before: 700, after: 400 },
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: data.type,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 400 },
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Client: ${data.clientInfo.name}`,
            bold: true,
            size: 28
          })
        ],
        spacing: { before: 200, after: 200 },
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: new Date().toLocaleDateString('fr-FR'),
        spacing: { before: 200, after: 400 },
        alignment: AlignmentType.CENTER
      })
    ];
  }
  // Removed functions that were not modified or used:
  // createCoverHeader, createCoverFooter, createVersionTable, createTableOfContents, createExecutiveSummary, createAnnexes


}