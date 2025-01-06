import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import Anthropic from '@anthropic-ai/sdk';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

// the newest Anthropic model is "claude-3-5-sonnet-20241022" which was released October 22, 2024
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export enum DocumentType {
  TECHNICAL_OFFER = 'Offre Technique',
  SPECIFICATIONS = 'Cahier des Charges',
  AUDIT_REPORT = 'Rapport d\'Audit'
}

async function generateRecommendations(data: any) {
  try {
    const { auditData, clientContext, constraints } = data;

    if (!auditData || !clientContext) {
      throw new Error("Données d'entrée manquantes");
    }

    const prompt = `En tant qu'expert en audit de datacenters, analyse les données suivantes et génère des recommandations détaillées conformes aux normes EN 50600, ISO/IEC, et TIA-942.

CONTEXTE CLIENT :
${JSON.stringify(clientContext, null, 2)}

DONNÉES D'AUDIT :
${JSON.stringify(auditData, null, 2)}

CONTRAINTES SPÉCIFIQUES :
${JSON.stringify(constraints, null, 2)}

INSTRUCTIONS DE GÉNÉRATION :
1. Pour chaque recommandation :
   - Analyser l'état actuel et son impact business
   - Évaluer les risques de non-implémentation
   - Proposer un plan d'implémentation détaillé
   - Calculer le ROI et le temps de retour sur investissement
   - Identifier les KPIs de suivi
   - Définir les critères de validation

FORMAT DE RÉPONSE :
Génère une réponse au format JSON uniquement, sans texte additionnel.`;

    console.log('[Anthropic] Sending request');

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: prompt,
      }],
    });

    if (!response.content || response.content.length === 0 || !response.content[0].text) {
      throw new Error('Réponse invalide de l\'API');
    }

    // Parse la réponse JSON
    let recommendations;
    try {
      recommendations = JSON.parse(response.content[0].text);
    } catch (parseError: any) {
      console.error('[Anthropic] Parse error:', parseError);
      throw new Error('Format de réponse invalide');
    }

    // Validation et enrichissement
    const validationResult = validateRecommendations(recommendations);
    if (!validationResult.isValid) {
      throw new Error(`Validation échouée: ${JSON.stringify(validationResult.errors)}`);
    }

    // Enrichissement des recommandations
    return enrichRecommendations(recommendations, {
      clientContext,
      benchmarks: auditData.benchmarks,
      regulations: auditData.regulations,
      costs: auditData.costs
    });

  } catch (error: any) {
    console.error('[Recommendations] Error:', error);
    throw error;
  }
}

function validateRecommendations(recommendations: any): { isValid: boolean; errors: string[] } {
  try {
    if (!Array.isArray(recommendations)) {
      return { isValid: false, errors: ['Format invalide: tableau attendu'] };
    }

    const errors: string[] = [];
    recommendations.forEach((rec, index) => {
      if (!rec.id) errors.push(`Recommandation ${index}: ID manquant`);
      if (!rec.title) errors.push(`Recommandation ${index}: Titre manquant`);
      if (!rec.description) errors.push(`Recommandation ${index}: Description manquante`);
    });

    return { isValid: errors.length === 0, errors };
  } catch (error) {
    return { isValid: false, errors: ['Erreur de validation'] };
  }
}

function enrichRecommendations(recommendations: any, context: any): any {
  return recommendations.map((rec: any) => ({
    ...rec,
    enrichedAt: new Date().toISOString(),
    context: context.clientContext,
    benchmarks: context.benchmarks,
    regulations: context.regulations,
    estimatedCosts: context.costs
  }));
}

async function generateWordDocument(content: string, title: string): Promise<Buffer> {
  try {
    console.log('[Word] Starting document generation with content length:', content.length);

    // Extraction et numérotation des sections
    let sectionCounter = 0;
    let subSectionCounter = 0;
    let subSubSectionCounter = 0;

    const sections = content.split('\n').reduce((acc, line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return acc;

      if (trimmedLine.startsWith('# ')) {
        sectionCounter++;
        subSectionCounter = 0;
        subSubSectionCounter = 0;
        acc.push({
          type: 'heading1',
          text: `${sectionCounter}. ${trimmedLine.replace('# ', '')}`,
          number: `${sectionCounter}`
        });
      } else if (trimmedLine.startsWith('## ')) {
        subSectionCounter++;
        subSubSectionCounter = 0;
        acc.push({
          type: 'heading2',
          text: `${sectionCounter}.${subSectionCounter} ${trimmedLine.replace('## ', '')}`,
          number: `${sectionCounter}.${subSectionCounter}`
        });
      } else if (trimmedLine.startsWith('### ')) {
        subSubSectionCounter++;
        acc.push({
          type: 'heading3',
          text: `${sectionCounter}.${subSectionCounter}.${subSubSectionCounter} ${trimmedLine.replace('### ', '')}`,
          number: `${sectionCounter}.${subSectionCounter}.${subSubSectionCounter}`
        });
      } else if (trimmedLine.startsWith('- ')) {
        acc.push({
          type: 'bullet',
          text: trimmedLine.replace('- ', '')
        });
      } else {
        acc.push({
          type: 'paragraph',
          text: trimmedLine
        });
      }
      return acc;
    }, [] as Array<{
      type: string;
      text: string;
      number?: string;
    }>);

    // Création de la table des matières et du document Word
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
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
          // Contenu du document
          ...sections.map(section => {
            switch (section.type) {
              case 'heading1':
                return new Paragraph({
                  text: section.text,
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  pageBreakBefore: true,
                });
              case 'heading2':
                return new Paragraph({
                  text: section.text,
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 200 },
                });
              case 'heading3':
                return new Paragraph({
                  text: section.text,
                  heading: HeadingLevel.HEADING_3,
                  spacing: { before: 200, after: 100 },
                });
              case 'bullet':
                return new Paragraph({
                  text: section.text,
                  bullet: { level: 0 },
                  spacing: { before: 100, after: 100 },
                  indent: { left: 720 },
                });
              default:
                return new Paragraph({
                  text: section.text,
                  spacing: { before: 100, after: 100 },
                });
            }
          }),
        ],
      }],
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
            },
          },
        ],
      },
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

function generatePrompt(input: any): string {
  // Sélectionner le plan selon le type de document
  let documentStructure = '';

  switch (input.type) {
    case DocumentType.TECHNICAL_OFFER:
      documentStructure = `
# 1. Introduction
- Présentation de 3R TECHNOLOGIE
- Expertise en datacenters
- Certifications TIA-942
- Équipe projet et qualifications
- Références projets similaires
- Méthodologie de gestion de projet
- Partenariats stratégiques

# 2. Analyse des Besoins
- Contexte et enjeux client
- Objectifs de conformité TIA-942
- Contraintes techniques et opérationnelles
- Exigences de performance
- Parties prenantes et organisation
- Critères de succès du projet

# 3. Architecture Technique TIA-942
- Classification Tier visée
- Architecture générale
- Redondance N+1/2N selon Tier
- Points de défaillance unique (SPOF)
- Évolutivité et scalabilité
- Indicateurs de performance (PUE, DCIE)
- Stratégie de maintenance

# 4. Infrastructures Critiques
- Alimentation électrique
- Système de refroidissement
- Sécurité physique
- Connectivité
- Plan de continuité d'activité
- Procédures d'exploitation

# 5. Conformité et Certification
- Analyse des écarts TIA-942
- Plan de mise en conformité
- Processus de certification
- Documentation requise
- Tests et validations

# 6. Planification et Budget
- Planning détaillé
- Budget prévisionnel
- Analyse des risques
- Plan de transition
- Plan de formation
- Conditions de garantie`;
      break;

    case DocumentType.SPECIFICATIONS:
      documentStructure = `
# 1. Présentation du Projet
- Contexte général
- Objectifs du projet
- Périmètre d'intervention
- Classification Tier visée
- Parties prenantes
- Budget prévisionnel
- Critères de succès

# 2. Exigences TIA-942
- Conformité architecturale
- Conformité électrique
- Conformité climatisation
- Conformité sécurité
- Niveaux de redondance requis
- Métriques de performance attendues
- Exigences de monitoring

# 3. Spécifications Techniques
- Architecture physique
- Infrastructure électrique
- Système de refroidissement
- Sécurité et monitoring
- Infrastructure réseau
- Plan de continuité d'activité
- Évolutivité technique

# 4. Exigences Opérationnelles
- Disponibilité et SLA
- Maintenance préventive
- Documentation technique
- Formation du personnel
- Gestion des incidents
- Procédures d'exploitation
- Exigences de reporting

# 5. Contraintes et Prérequis
- Contraintes site et bâtiment
- Contraintes réglementaires
- Contraintes techniques spécifiques
- Prérequis d'installation
- Normes applicables

# 6. Modalités de Réception
- Critères d'acceptation
- Processus de validation
- Tests de réception
- Livrables attendus
- Conditions de garantie
- Conditions contractuelles`;
      break;

    case DocumentType.AUDIT_REPORT:
      documentStructure = `
# 1. Résumé Exécutif
- Objectifs de l'audit
- Méthodologie d'évaluation
- Synthèse des conclusions majeures
- Recommandations prioritaires
- Impact financier des non-conformités
- Analyse des risques
- ROI des améliorations proposées

# 2. Présentation du Site Audité
- Informations client
- Description des installations
- Configuration des salles techniques
- Inventaire des équipements critiques
- Organisation opérationnelle
- Processus actuels
- Historique des incidents

# 3. Analyse de Conformité TIA-942
- Architecture et Structure
- Système Électrique
- Système de Refroidissement
- Sécurité et Contrôle d'Accès
- Conformité des Infrastructures
- Points d'Amélioration
- Comparaison avec les standards du marché
- Évaluation de la maturité opérationnelle
- Analyse des procédures

# 4. Recommandations
- Améliorations Prioritaires
- Plan d'Action Détaillé
- Estimations Budgétaires
- Calendrier de Mise en Œuvre
- Analyse coût-bénéfice
- Scénarios alternatifs
- Impact opérationnel
- Plan de formation
- Indicateurs de suivi

# 5. Annexes
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
En tant qu'expert en datacenters et infrastructure IT, générez un document professionnel détaillé de type "${input.type}" en suivant strictement la structure ci-dessous.

IMPORTANT: Pour chaque section du document:
1. Commencez par une introduction détaillée qui présente les objectifs et le contexte
2. Développez chaque point avec au moins 2-3 paragraphes explicatifs
3. Incluez des exemples concrets et des références aux normes TIA-942
4. Ajoutez des données chiffrées et des métriques spécifiques
5. Terminez par une conclusion et des recommandations

FORMAT DU DOCUMENT:
${documentStructure}

CONTEXTE CLIENT:
- Nom: ${input.clientInfo.name}
- Secteur: ${input.clientInfo.industry}
- Taille: ${input.clientInfo.size}

MÉTRIQUES ACTUELLES:
- PUE moyen: ${input.auditData.metrics.pue.join(', ')}
- Disponibilité: ${input.auditData.metrics.availability.join(', ')}%
- Niveau TIER: ${input.auditData.metrics.tierLevel}
- Écarts de conformité: ${input.auditData.metrics.complianceGaps.join(', ')}
- Score de conformité: ${input.auditData.compliance.score}%`;

  return baseContext;
}

async function generateDocumentHandler(req: any, res: any) {
  try {
    console.log('[Generate] Starting document generation');
    const input = req.body;

    // Validation des données d'entrée
    if (!input || !input.type || !input.clientInfo) {
      return res.status(400).json({ error: 'Données d\'entrée invalides' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Configuration API manquante' });
    }

    const prompt = generatePrompt(input);
    console.log('[Anthropic] Sending request to API');

    try {
      const result = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        temperature: 0.7,
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

      const documentTitle = `3R_${input.type}_${input.clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '')}`;
      console.log('[Word] Starting Word document generation');

      const wordBuffer = await generateWordDocument(content.text, documentTitle);
      console.log('[Word] Document generated successfully');

      // Définition correcte des headers pour le téléchargement
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
      res.setHeader('Content-Length', wordBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      res.send(wordBuffer);

    } catch (apiError: any) {
      console.error('[Anthropic] API Error:', apiError);
      res.status(500).json({
        error: 'Erreur lors de la communication avec l\'API',
        details: apiError.message
      });
    }
  } catch (error: any) {
    console.error('[Generate] Error:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du document',
      details: error.message
    });
  }
}


export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Endpoint pour les recommandations
  app.post("/api/recommendations", async (req, res) => {
    try {
      console.log('[API] Received recommendations request');
      const result = await generateRecommendations(req.body);
      res.json(result);
    } catch (error: any) {
      console.error('[API] Recommendations error:', error);
      res.status(500).json({
        error: 'Erreur lors de la génération des recommandations',
        details: error.message
      });
    }
  });

  // Endpoint pour la génération de documents
  app.post("/api/documents/generate", async (req, res) => {
    try {
      console.log('[Documents] Starting generation');
      const { type, clientInfo, content } = req.body;

      if (!type || !clientInfo) {
        return res.status(400).json({ error: 'Données requises manquantes' });
      }

      const documentTitle = `3R_${type}_${clientInfo.name}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '')}`;
      const wordBuffer = await generateWordDocument(content || '', documentTitle);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${documentTitle}.docx"`);
      res.setHeader('Content-Length', wordBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      res.send(wordBuffer);

    } catch (error: any) {
      console.error('[Documents] Generation error:', error);
      res.status(500).json({
        error: 'Erreur lors de la génération du document',
        details: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}