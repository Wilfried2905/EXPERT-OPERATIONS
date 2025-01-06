import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageNumber, AlignmentType, WidthType, Header, Footer, convertInchesToTwip } from 'docx';
import type { DocumentData } from '@/types/document';

export class DocumentGenerator {
  private styles = {
    heading1: { fontSize: '18pt', bold: true, spacing: { before: 24, after: 12 } },
    heading2: { fontSize: '16pt', bold: true, spacing: { before: 18, after: 9 } },
    normal: { fontSize: '11pt', spacing: { before: 6, after: 6 } },
    table: { fontSize: '10pt', alignment: 'center' }
  };

  async generateDocument(data: DocumentData): Promise<Buffer> {
    try {
      console.log('[DocumentGenerator] Starting document generation');

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
            }),
            first: new Header({
              children: [this.createCoverHeader(data)]
            })
          },
          footers: {
            default: new Footer({
              children: [this.createFooter(data)]
            }),
            first: new Footer({
              children: [this.createCoverFooter(data)]
            })
          },
          children: [
            ...this.createCoverPage(data),
            this.createVersionTable(data),
            this.createTableOfContents(data),
            ...this.createExecutiveSummary(data),
            ...this.createMainContent(data),
            this.createAnnexes(data)
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

  private createHeader(data: DocumentData): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: "3R TECHNOLOGIE",
          bold: true,
          size: 24,
        }),
        new TextRun({
          text: `  |  ${data.title}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.LEFT,
    });
  }

  private createCoverHeader(data: DocumentData): Paragraph {
    return new Paragraph({
      children: [],
      alignment: AlignmentType.CENTER,
    });
  }

  private createFooter(data: DocumentData): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: "Page ",
          size: 20,
        }),
        new TextRun({
          text: PageNumber.CURRENT,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
    });
  }

  private createCoverFooter(data: DocumentData): Paragraph {
    return new Paragraph({
      children: [
        new TextRun({
          text: "© 2025 3R TECHNOLOGIE - Confidentiel",
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
    });
  }

  private createCoverPage(data: DocumentData): Paragraph[] {
    return [
      new Paragraph({
        text: "3R TECHNOLOGIE",
        heading: HeadingLevel.TITLE,
        spacing: { before: 700, after: 400 },
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: data.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 400 },
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Client: ${data.clientInfo.name}`,
            bold: true,
            size: 28,
          }),
        ],
        spacing: { before: 200, after: 200 },
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: new Date().toLocaleDateString('fr-FR'),
        spacing: { before: 200, after: 400 },
        alignment: AlignmentType.CENTER,
      }),
    ];
  }

  private createVersionTable(data: DocumentData): Table {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Version")] }),
            new TableCell({ children: [new Paragraph("Date")] }),
            new TableCell({ children: [new Paragraph("Auteur")] }),
            new TableCell({ children: [new Paragraph("Description")] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("1.0")] }),
            new TableCell({ children: [new Paragraph(new Date().toLocaleDateString('fr-FR'))] }),
            new TableCell({ children: [new Paragraph("3R TECHNOLOGIE")] }),
            new TableCell({ children: [new Paragraph("Version initiale")] }),
          ],
        }),
      ],
    });
  }

  private createTableOfContents(data: DocumentData): Paragraph {
    return new Paragraph({
      text: "Table des matières",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
    });
  }

  private createExecutiveSummary(data: DocumentData): Paragraph[] {
    return [
      new Paragraph({
        text: "Résumé exécutif",
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
      new Paragraph({
        text: data.executiveSummary || "À compléter",
      }),
    ];
  }

  private createMainContent(data: DocumentData): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Ajout du contenu principal selon le type de document
    if (data.content) {
      paragraphs.push(new Paragraph({
        text: data.content,
        pageBreakBefore: true,
      }));
    }

    return paragraphs;
  }

  private createAnnexes(data: DocumentData): Paragraph {
    return new Paragraph({
      text: "Annexes",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
    });
  }
}