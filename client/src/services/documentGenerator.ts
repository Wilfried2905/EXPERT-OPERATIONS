import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, PageNumber, AlignmentType, WidthType, Header, Footer, TableOfContents, convertInchesToTwip } from 'docx';
import type { DocumentData } from '@/types/document';

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
            new Paragraph({ text: "", pageBreakBefore: true }), // Force new page
            new Paragraph({
              text: "Table des matières",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 240, after: 120 }
            }),
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
    return new TableOfContents("", {
      hyperlink: true,
      headingStyleRange: "1-3",
      stylesWithLevels: [
        { level: 1, style: "Heading1" },
        { level: 2, style: "Heading2" }
      ]
    });
  }

  private getDefaultSections(type: string) {
    switch (type) {
      case 'Offre Technique':
        return [
          {
            title: "1. Introduction",
            items: [
              "Présentation de 3R TECHNOLOGIE",
              "Expertise en datacenters",
              "Certifications TIA-942",
              "Équipe projet et qualifications",
              "Références projets similaires",
              "Méthodologie de gestion de projet",
              "Partenariats stratégiques"
            ]
          },
          {
            title: "2. Analyse des Besoins",
            items: [
              "Contexte et enjeux client",
              "Objectifs de conformité TIA-942",
              "Contraintes techniques et opérationnelles",
              "Exigences de performance",
              "Parties prenantes et organisation",
              "Critères de succès du projet"
            ]
          },
          {
            title: "3. Architecture Technique TIA-942",
            items: [
              "Classification Tier visée",
              "Architecture générale",
              "Redondance N+1/2N selon Tier",
              "Points de défaillance unique (SPOF)",
              "Évolutivité et scalabilité",
              "Indicateurs de performance (PUE, DCIE)",
              "Stratégie de maintenance"
            ]
          },
          {
            title: "4. Infrastructures Critiques",
            items: [
              "Alimentation électrique",
              "Système de refroidissement",
              "Sécurité physique",
              "Connectivité",
              "Plan de continuité d'activité",
              "Procédures d'exploitation"
            ]
          },
          {
            title: "5. Conformité et Certification",
            items: [
              "Analyse des écarts TIA-942",
              "Plan de mise en conformité",
              "Processus de certification",
              "Documentation requise",
              "Tests et validations"
            ]
          },
          {
            title: "6. Planification et Budget",
            items: [
              "Planning détaillé",
              "Budget prévisionnel",
              "Analyse des risques",
              "Plan de transition",
              "Plan de formation",
              "Conditions de garantie"
            ]
          }
        ];

      case 'Cahier des Charges':
        return [
          {
            title: "1. Présentation du Projet",
            items: [
              "Contexte général",
              "Objectifs du projet",
              "Périmètre d'intervention",
              "Classification Tier visée",
              "Parties prenantes",
              "Budget prévisionnel",
              "Critères de succès"
            ]
          },
          {
            title: "2. Exigences TIA-942",
            items: [
              "Conformité architecturale",
              "Conformité électrique",
              "Conformité climatisation",
              "Conformité sécurité",
              "Niveaux de redondance requis",
              "Métriques de performance attendues",
              "Exigences de monitoring"
            ]
          },
          {
            title: "3. Spécifications Techniques",
            items: [
              "Architecture physique",
              "Infrastructure électrique",
              "Système de refroidissement",
              "Sécurité et monitoring",
              "Infrastructure réseau",
              "Plan de continuité d'activité",
              "Évolutivité technique"
            ]
          },
          {
            title: "4. Exigences Opérationnelles",
            items: [
              "Disponibilité et SLA",
              "Maintenance préventive",
              "Documentation technique",
              "Formation du personnel",
              "Gestion des incidents",
              "Procédures d'exploitation",
              "Exigences de reporting"
            ]
          },
          {
            title: "5. Contraintes et Prérequis",
            items: [
              "Contraintes site et bâtiment",
              "Contraintes réglementaires",
              "Contraintes techniques spécifiques",
              "Prérequis d'installation",
              "Normes applicables"
            ]
          },
          {
            title: "6. Modalités de Réception",
            items: [
              "Critères d'acceptation",
              "Processus de validation",
              "Tests de réception",
              "Livrables attendus",
              "Conditions de garantie",
              "Conditions contractuelles"
            ]
          }
        ];

      case 'Rapport d\'Audit':
        return [
          {
            title: "1. Résumé Exécutif",
            items: [
              "Objectifs de l'audit",
              "Méthodologie d'évaluation",
              "Synthèse des conclusions majeures",
              "Recommandations prioritaires",
              "Impact financier des non-conformités",
              "Analyse des risques",
              "ROI des améliorations proposées"
            ]
          },
          {
            title: "2. Présentation du Site Audité",
            items: [
              "Informations client",
              "Description des installations",
              "Configuration des salles techniques",
              "Inventaire des équipements critiques",
              "Organisation opérationnelle",
              "Processus actuels",
              "Historique des incidents"
            ]
          },
          {
            title: "3. Analyse de Conformité TIA-942",
            items: [
              "Architecture et Structure",
              "Système Électrique",
              "Système de Refroidissement",
              "Sécurité et Contrôle d'Accès",
              "Conformité des Infrastructures",
              "Points d'Amélioration",
              "Comparaison avec les standards du marché",
              "Évaluation de la maturité opérationnelle",
              "Analyse des procédures"
            ]
          },
          {
            title: "4. Recommandations",
            items: [
              "Améliorations Prioritaires",
              "Plan d'Action Détaillé",
              "Estimations Budgétaires",
              "Calendrier de Mise en Œuvre",
              "Analyse coût-bénéfice",
              "Scénarios alternatifs",
              "Impact opérationnel",
              "Plan de formation",
              "Indicateurs de suivi"
            ]
          },
          {
            title: "5. Annexes",
            items: [
              "Rapports de Tests",
              "Documentation Technique",
              "Photos et Schémas",
              "Références Normatives",
              "Matrices de conformité",
              "Historique des mesures",
              "Fiches d'incidents",
              "Plans d'actions correctives"
            ]
          }
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
}