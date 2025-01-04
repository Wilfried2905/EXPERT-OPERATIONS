import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

function generatePrompt(input: any): string {
  // Sélectionner le plan selon le type de document
  let documentStructure = '';

  switch (input.type) {
    case DocumentType.TECHNICAL_OFFER:
      documentStructure = `
1. Introduction
   - Présentation de 3R TECHNOLOGIE
   - Expertise en datacenters
   - Certifications TIA-942
   - Équipe projet et qualifications
   - Références projets similaires
   - Méthodologie de gestion de projet
   - Partenariats stratégiques

2. Analyse des Besoins
   - Contexte et enjeux client
   - Objectifs de conformité TIA-942
   - Contraintes techniques et opérationnelles
   - Exigences de performance
   - Parties prenantes et organisation
   - Critères de succès du projet

3. Architecture Technique TIA-942
   - Classification Tier visée
   - Architecture générale
   - Redondance N+1/2N selon Tier
   - Points de défaillance unique (SPOF)
   - Évolutivité et scalabilité
   - Indicateurs de performance (PUE, DCIE)
   - Stratégie de maintenance

4. Infrastructures Critiques
   - Alimentation électrique
   - Système de refroidissement
   - Sécurité physique
   - Connectivité
   - Plan de continuité d'activité
   - Procédures d'exploitation

5. Conformité et Certification
   - Analyse des écarts TIA-942
   - Plan de mise en conformité
   - Processus de certification
   - Documentation requise
   - Tests et validations

6. Planification et Budget
   - Planning détaillé
   - Budget prévisionnel
   - Analyse des risques
   - Plan de transition
   - Plan de formation
   - Conditions de garantie`;
      break;

    case DocumentType.SPECIFICATIONS:
      documentStructure = `
1. Présentation du Projet
   - Contexte général
   - Objectifs du projet
   - Périmètre d'intervention
   - Classification Tier visée
   - Parties prenantes
   - Budget prévisionnel
   - Critères de succès

2. Exigences TIA-942
   - Conformité architecturale
   - Conformité électrique
   - Conformité climatisation
   - Conformité sécurité
   - Niveaux de redondance requis
   - Métriques de performance attendues
   - Exigences de monitoring

3. Spécifications Techniques
   - Architecture physique
   - Infrastructure électrique
   - Système de refroidissement
   - Sécurité et monitoring
   - Infrastructure réseau
   - Plan de continuité d'activité
   - Évolutivité technique

4. Exigences Opérationnelles
   - Disponibilité et SLA
   - Maintenance préventive
   - Documentation technique
   - Formation du personnel
   - Gestion des incidents
   - Procédures d'exploitation
   - Exigences de reporting

5. Contraintes et Prérequis
   - Contraintes site et bâtiment
   - Contraintes réglementaires
   - Contraintes techniques spécifiques
   - Prérequis d'installation
   - Normes applicables

6. Modalités de Réception
   - Critères d'acceptation
   - Processus de validation
   - Tests de réception
   - Livrables attendus
   - Conditions de garantie
   - Conditions contractuelles`;
      break;

    case DocumentType.AUDIT_REPORT:
      documentStructure = `
1. Résumé Exécutif
   - Objectifs de l'audit
   - Méthodologie d'évaluation
   - Synthèse des conclusions majeures
   - Recommandations prioritaires
   - Impact financier des non-conformités
   - Analyse des risques
   - ROI des améliorations proposées

2. Présentation du Site Audité
   - Informations client
   - Description des installations
   - Configuration des salles techniques
   - Inventaire des équipements critiques
   - Organisation opérationnelle
   - Processus actuels
   - Historique des incidents

3. Analyse de Conformité TIA-942
   - Architecture et Structure
   - Système Électrique
   - Système de Refroidissement
   - Sécurité et Contrôle d'Accès
   - Conformité des Infrastructures
   - Points d'Amélioration
   - Comparaison avec les standards du marché
   - Évaluation de la maturité opérationnelle
   - Analyse des procédures

4. Recommandations
   - Améliorations Prioritaires
   - Plan d'Action Détaillé
   - Estimations Budgétaires
   - Calendrier de Mise en Œuvre
   - Analyse coût-bénéfice
   - Scénarios alternatifs
   - Impact opérationnel
   - Plan de formation
   - Indicateurs de suivi

5. Annexes
   - Rapports de Tests
   - Documentation Technique
   - Photos et Schémas
   - Références Normatives
   - Matrices de conformité
   - Historique des mesures
   - Fiches d'incidents
   - Plans d'actions correctives`;
      break;
  }

  const baseContext = `
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel détaillé de type "${input.type}" en suivant strictement cette structure.

INSTRUCTIONS DÉTAILLÉES:

1. Format du Document:
   - Page de garde professionnelle avec logo et nom "3R TECHNOLOGIE"
   - Titre : "${input.type}"
   - Client : ${input.clientInfo.name}
   - Date : ${new Date().toLocaleDateString('fr-FR')}
   - Table des matières détaillée
   - Sections numérotées (1., 1.1, 1.1.1, etc.)

2. Style de Rédaction:
   - Français professionnel et technique
   - Citations et références aux normes TIA-942
   - Explications détaillées pour chaque point
   - Exemples concrets et chiffrés
   - Minimum 2-3 paragraphes par section
   - Utilisation de listes à puces pour les énumérations

3. Contenu Technique:
   - Références précises aux standards TIA-942
   - Métriques et KPIs spécifiques
   - Recommandations basées sur les meilleures pratiques
   - Solutions techniques détaillées
   - Analyse des impacts et risques

4. Structure du Contenu:
   ${documentStructure}

5. Contexte Client:
   - Nom: ${input.clientInfo.name}
   - Secteur: ${input.clientInfo.industry}
   - Taille: ${input.clientInfo.size}

   Métriques:
   - PUE moyen: ${input.auditData.metrics.pue.join(', ')}
   - Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
   - Niveau TIER: ${input.auditData.metrics.tierLevel}
   - Écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}
   - Score de conformité: ${input.auditData.compliance.score}%

FORMAT DU TEXTE:
- Utilisez "# " pour les titres principaux (1.)
- Utilisez "## " pour les sous-titres (1.1)
- Utilisez "### " pour les sous-sections (1.1.1)
- Utilisez "- " pour les listes à puces
- Séparez les sections par des sauts de ligne

IMPORTANT: Pour chaque section:
1. Commencez par une introduction
2. Développez en détail chaque point
3. Ajoutez des exemples concrets
4. Citez les normes pertinentes
5. Concluez avec des recommandations`;

  return baseContext;
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  try {
    console.log('[Word] Starting document generation with content length:', content.length);

    // Extraction des titres pour la table des matières
    const headings = content.split('\n').reduce((acc, line) => {
      if (line.trim().startsWith('# ')) {
        acc.push({ level: 1, text: line.replace('# ', '').trim() });
      } else if (line.trim().startsWith('## ')) {
        acc.push({ level: 2, text: line.replace('## ', '').trim() });
      } else if (line.trim().startsWith('### ')) {
        acc.push({ level: 3, text: line.replace('### ', '').trim() });
      }
      return acc;
    }, [] as Array<{ level: number; text: string }>);

    // Création de la table des matières statique avec numérotation
    const tocRows = headings.map((heading, index) => {
      const indent = '  '.repeat(heading.level - 1);
      const number = `${index + 1}.${heading.level > 1 ? '1' : ''}${heading.level > 2 ? '.1' : ''}`;

      return new TableRow({
        children: [
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: number,
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${indent}${heading.text}`,
                    bold: heading.level === 1,
                    size: 24,
                  }),
                ],
                indent: { left: (heading.level - 1) * 360 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}`,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        ],
      });
    });

    const tocTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: tocRows,
    });

    // Création du document avec des styles améliorés
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 44,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: { before: 340, after: 340 },
              alignment: AlignmentType.CENTER,
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 36,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
              outlineLevel: 0,
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
              outlineLevel: 1,
            },
          },
          {
            id: "Heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
              outlineLevel: 2,
            },
          },
        ],
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top: 2800,
              right: 2000,
              bottom: 2000,
              left: 2000,
            },
          },
        },
        children: [
          // Page de garde
          new Paragraph({
            text: "3R TECHNOLOGIE",
            heading: HeadingLevel.TITLE,
            spacing: { before: 700, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: new Date().toLocaleDateString('fr-FR'),
            spacing: { before: 200, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          // Saut de page après la page de garde
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),
          // Table des matières statique
          new Paragraph({
            text: "Table des matières",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          tocTable,
          // Saut de page après la table des matières
          new Paragraph({
            text: "",
            pageBreakBefore: true,
          }),
          // Contenu du document
          ...content.split('\n').map((line, index) => {
            let headingNumber = "";
            if (line.trim().startsWith('# ')) {
              const headingIndex = headings.findIndex(h => h.text === line.replace('# ', '').trim());
              headingNumber = `${headingIndex + 1}. `;
              return new Paragraph({
                text: `${headingNumber}${line.replace('# ', '').trim()}`,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
                pageBreakBefore: true,
              });
            } else if (line.trim().startsWith('## ')) {
              const parentHeading = Math.floor(index / 10) + 1;
              const subHeading = (index % 10) + 1;
              headingNumber = `${parentHeading}.${subHeading} `;
              return new Paragraph({
                text: `${headingNumber}${line.replace('## ', '').trim()}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              });
            } else if (line.trim().startsWith('### ')) {
              const parentHeading = Math.floor(index / 100) + 1;
              const subHeading = Math.floor((index % 100) / 10) + 1;
              const subSubHeading = (index % 10) + 1;
              headingNumber = `${parentHeading}.${subHeading}.${subSubHeading} `;
              return new Paragraph({
                text: `${headingNumber}${line.replace('### ', '').trim()}`,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 100 },
              });
            } else if (line.trim().startsWith('- ')) {
              return new Paragraph({
                text: line.replace('- ', '').trim(),
                bullet: { level: 0 },
                spacing: { before: 100, after: 100 },
                indent: { left: 720 },
              });
            } else if (line.trim()) {
              return new Paragraph({
                text: line.trim(),
                spacing: { before: 100, after: 100 },
              });
            }
            return null;
          }).filter(Boolean),
        ],
      }],
    });

    console.log('[Word] Document object created, starting buffer generation');
    const buffer = await Packer.toBuffer(doc);
    console.log('[Word] Buffer generated successfully, size:', buffer.length);
    return buffer;
  } catch (error) {
    console.error('[Word] Error generating document:', error);
    throw new Error('Erreur lors de la génération du document Word');
  }
}

export async function generateRecommendations(req: any, res: any) {
  try {
    const auditData = req.body;
    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées conformes aux normes EN 50600 et ISO/IEC.

Données d'audit à analyser:
${JSON.stringify(auditData, null, 2)}

Instructions:
Génère une réponse STRICTEMENT au format JSON suivant ce schéma exact sans aucun texte additionnel:

{
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "normReference": {
        "code": "string",
        "description": "string",
        "requirement": "string"
      },
      "priority": "critical|high|medium|low",
      "timeFrame": "immediate|short_term|long_term",
      "impact": {
        "energyEfficiency": "number",
        "performance": "number",
        "compliance": "number",
        "details": {
          "energyEfficiency": "string",
          "performance": "string",
          "compliance": "string"
        }
      }
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{ 
        role: "user", 
        content: prompt,
      }],
    });

    if (!response.content?.[0]?.text) {
      throw new Error('Invalid response format from Anthropic API');
    }

    try {
      const recommendations = JSON.parse(response.content[0].text);
      res.json(recommendations);
    } catch (parseError) {
      console.error("Error parsing Anthropic response:", parseError);
      res.status(500).json({ 
        error: "Erreur lors du parsing de la réponse"
      });
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Une erreur est survenue' 
    });
  }
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  app.post("/api/profile-selected", (req, res) => {
    const { profileType, email } = req.body;
    console.log('Profile selected:', { profileType, email });
    res.json({ message: "Sélection de profil enregistrée" });
  });

  app.post("/api/anthropic/recommendations", generateRecommendations);
  app.post("/api/anthropic/document", generateDocumentHandler);

  const httpServer = createServer(app);
  return httpServer;
}

// Types de documents supportés
export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

async function generateDocumentHandler(req: any, res: any) {
  try {
    console.log('[Generate] Starting document generation');
    const input = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Clé API Anthropic manquante');
    }

    const prompt = generatePrompt(input);
    console.log('[Anthropic] Sending request to API');

    const result = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    if (!result.content || result.content.length === 0) {
      throw new Error('Réponse vide de l\'API Anthropic');
    }

    const content = result.content[0];
    if (!content || content.type !== 'text') {
      throw new Error('Format de réponse incorrect de l\'API Anthropic');
    }

    console.log('[Anthropic] Received response, length:', content.text.length);

    const documentTitle = `3R_${input.type}_${input.clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}`;
    console.log('[Word] Starting Word document generation');
    const wordBuffer = await generateWordDocument(content.text, documentTitle);
    console.log('[Word] Document generated successfully');

    // Définir les en-têtes pour forcer le téléchargement
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
    res.setHeader('Content-Length', wordBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Envoyer le buffer
    res.send(wordBuffer);
  } catch (error) {
    console.error('[Error] Document generation failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue'
    });
  }
}