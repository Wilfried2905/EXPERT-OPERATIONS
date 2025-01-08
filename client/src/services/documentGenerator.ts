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
              "Conformité sécurité"
            ],
            subsections: [
              {
                title: "2.1. Spécifications Techniques",
                items: [
                  "Niveaux de redondance requis",
                  "Métriques de performance attendues",
                  "Exigences de monitoring"
                ]
              },
              {
                title: "2.2. Exigences Opérationnelles",
                items: [
                  "Disponibilité et SLA",
                  "Maintenance préventive",
                  "Gestion des incidents"
                ]
              }
            ]
          },
          {
            title: "3. Infrastructure Technique",
            items: [
              "Architecture physique",
              "Infrastructure électrique",
              "Système de refroidissement"
            ],
            subsections: [
              {
                title: "3.1. Sécurité et Monitoring",
                items: [
                  "Contrôle d'accès",
                  "Vidéosurveillance",
                  "Systèmes de détection"
                ]
              },
              {
                title: "3.2. Réseaux et Connectivité",
                items: [
                  "Architecture réseau",
                  "Redondance des liens",
                  "Sécurité périmétrique"
                ]
              }
            ]
          },
          {
            title: "4. Modalités de Réalisation",
            items: [
              "Planning de déploiement",
              "Organisation projet",
              "Plan de transition"
            ],
            subsections: [
              {
                title: "4.1. Tests et Recette",
                items: [
                  "Stratégie de test",
                  "Critères d'acceptation",
                  "Procédures de validation"
                ]
              },
              {
                title: "4.2. Documentation",
                items: [
                  "Livrables attendus",
                  "Documentation technique",
                  "Manuels d'exploitation"
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
              "Expertise en datacenters",
              "Certifications TIA-942",
              "Équipe projet et qualifications"
            ],
            subsections: [
              {
                title: "1.1. Notre Expertise",
                items: [
                  "Audits de conformité",
                  "Conseil en infrastructure",
                  "Optimisation énergétique"
                ]
              },
              {
                title: "1.2. Références Projets",
                items: [
                  "Projets similaires réalisés",
                  "Retours d'expérience",
                  "Témoignages clients"
                ]
              }
            ]
          },
          {
            title: "2. Solution Technique",
            items: [
              "Architecture proposée",
              "Conformité TIA-942",
              "Performances attendues"
            ],
            subsections: [
              {
                title: "2.1. Architecture Détaillée",
                items: [
                  "Infrastructure physique",
                  "Systèmes électriques",
                  "Climatisation"
                ]
              },
              {
                title: "2.2. Sécurité et Monitoring",
                items: [
                  "Contrôle d'accès",
                  "Surveillance",
                  "Alertes et notifications"
                ]
              }
            ]
          },
          {
            title: "3. Méthodologie",
            items: [
              "Approche projet",
              "Planning prévisionnel",
              "Organisation équipe"
            ],
            subsections: [
              {
                title: "3.1. Phases du Projet",
                items: [
                  "Étude et conception",
                  "Mise en œuvre",
                  "Tests et validation"
                ]
              },
              {
                title: "3.2. Gestion des Risques",
                items: [
                  "Identification des risques",
                  "Plan de mitigation",
                  "Plan de continuité"
                ]
              }
            ]
          },
          {
            title: "4. Conditions Commerciales",
            items: [
              "Budget détaillé",
              "Conditions de paiement",
              "Garanties"
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
              "Recommandations prioritaires"
            ],
            subsections: [
              {
                title: "1.1. Contexte",
                items: [
                  "Présentation du site",
                  "Périmètre de l'audit",
                  "Classification TIA-942 visée"
                ]
              },
              {
                title: "1.2. Points Clés",
                items: [
                  "Principaux constats",
                  "Risques identifiés",
                  "Opportunités d'amélioration"
                ]
              }
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
                title: "2.1. Infrastructure Physique",
                items: [
                  "Configuration des salles",
                  "Chemins de câbles",
                  "Systèmes de sécurité"
                ]
              },
              {
                title: "2.2. Systèmes Critiques",
                items: [
                  "Alimentation électrique",
                  "Climatisation",
                  "Protection incendie"
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
                  "Mises à niveau urgentes",
                  "Risques à traiter"
                ]
              },
              {
                title: "3.2. Améliorations",
                items: [
                  "Optimisations recommandées",
                  "Évolutions proposées",
                  "Gains attendus"
                ]
              }
            ]
          },
          {
            title: "4. Plan de Mise en Conformité",
            items: [
              "Calendrier de déploiement",
              "Priorisation des actions",
              "Budget prévisionnel"
            ],
            subsections: [
              {
                title: "4.1. Planning",
                items: [
                  "Court terme (0-6 mois)",
                  "Moyen terme (6-12 mois)",
                  "Long terme (12+ mois)"
                ]
              },
              {
                title: "4.2. Suivi",
                items: [
                  "Indicateurs de performance",
                  "Points de contrôle",
                  "Revues périodiques"
                ]
              }
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
}