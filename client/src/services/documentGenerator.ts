import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageNumber, AlignmentType, WidthType, Header, Footer, TableOfContents, convertInchesToTwip } from 'docx';
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
            this.createTableOfContents(),
            ...sections
          ]
        }]
      });

      console.log('[DocumentGenerator] Document structure created, generating buffer');
      return await Packer.toBuffer(doc);
    } catch (error) {
      console.error('[DocumentGenerator] Error:', error);
      throw new Error('Erreur lors de la génération du document');
    }
  }

  private createTableOfContents(): TableOfContents {
    return new TableOfContents("Table des matières", {
      hyperlink: true,
      headingStyleRange: "1-5",
      stylesWithLevels: [
        { level: 1, paragraphStyle: "Heading1" },
        { level: 2, paragraphStyle: "Heading2" }
      ]
    });
  }

  private async getDocumentStructure(data: DocumentData): Promise<Paragraph[]> {
    const documentSections = this.getDefaultSections(data.type);
    const paragraphs: Paragraph[] = [];

    // Add page break before first section
    paragraphs.push(
      new Paragraph({
        text: "",
        pageBreakBefore: true
      })
    );

    for (const section of documentSections) {
      // Add section title
      paragraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
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
            ],
            subsections: [
              {
                title: "2.1. Évaluation de l'Architecture",
                items: [
                  "Configuration des salles",
                  "Systèmes de sécurité",
                  "Contrôle d'accès"
                ]
              },
              {
                title: "2.2. Infrastructure Électrique",
                items: [
                  "Alimentation principale",
                  "Systèmes de secours",
                  "Distribution électrique"
                ]
              }
            ]
          },
          {
            title: "3. Recommandations",
            items: [
              "Améliorations Prioritaires",
              "Plan d'Action Détaillé",
              "Estimations Budgétaires"
            ],
            subsections: [
              {
                title: "3.1. Actions Immédiates",
                items: [
                  "Corrections critiques",
                  "Mises à niveau urgentes"
                ]
              },
              {
                title: "3.2. Plan à Moyen Terme",
                items: [
                  "Optimisations recommandées",
                  "Améliorations de performance"
                ]
              }
            ]
          }
        ];
      case 'Offre Technique':
        return [
          {
            title: "1. Présentation",
            items: [
              "Présentation de 3R TECHNOLOGIE",
              "Notre expertise",
              "Références clients"
            ]
          },
          // Add more sections specific to Technical Offer
        ];
      case 'Cahier des Charges':
        return [
          {
            title: "1. Introduction",
            items: [
              "Contexte du projet",
              "Objectifs",
              "Périmètre"
            ]
          },
          // Add more sections specific to Specifications
        ];
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
}