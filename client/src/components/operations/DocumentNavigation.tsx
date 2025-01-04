import React, { useState, useCallback } from 'react';
import { FileText, ChevronDown, Eye, Download, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { generateDocument, DocumentType } from '@/services/documentGeneration';
import { useToast } from "@/hooks/use-toast";

interface DocumentNavigationProps {
  section: 'collecte' | 'recommandations' | 'documents';
  onBack: () => void;
}

interface DocumentSection {
  title: string;
  items: string[];
}

interface Document {
  title: string;
  icon: React.ComponentType;
  description: string;
  sections: DocumentSection[];
}

interface Documents {
  [key: string]: Document;
}

const documents: Documents = {
  offreTechnique: {
    title: "Offre Technique",
    icon: FileText,
    description: "Document détaillant l'offre technique et les solutions proposées",
    sections: [
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
    ]
  },
  cahierCharges: {
    title: "Cahier des Charges",
    icon: FileText,
    description: "Spécifications détaillées et exigences du projet",
    sections: [
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
    ]
  },
  rapportAudit: {
    title: "Rapport d'Audit",
    icon: FileText,
    description: "Rapport complet d'audit et recommandations",
    sections: [
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
    ]
  }
};

const DocumentNavigation: React.FC<DocumentNavigationProps> = ({ section, onBack }) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const clientName = "Nom_Client";

  const handleDocumentClick = useCallback((docKey: string) => {
    setSelectedDoc(prevDoc => prevDoc === docKey ? null : docKey);
  }, []);

  const generateFileName = useCallback((docTitle: string) => {
    const date = format(new Date(), 'yyyyMMdd');
    return `3R_${docTitle.replace(/\s+/g, '_')}_${clientName}_${date}.docx`;
  }, [clientName]);

  const handlePreview = useCallback((e: React.MouseEvent, docKey: string) => {
    e.stopPropagation();
    setPreviewContent(docKey);
    setShowPreview(true);
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent, docKey: string, docTitle: string) => {
    e.stopPropagation();

    if (isGenerating) {
      return;
    }

    try {
      setIsGenerating(true);
      const fileName = generateFileName(docTitle);
      console.log(`[Download] Starting document generation for ${fileName}`);

      const input = {
        type: docKey === 'offreTechnique'
          ? DocumentType.TECHNICAL_OFFER
          : docKey === 'cahierCharges'
            ? DocumentType.SPECIFICATIONS
            : DocumentType.AUDIT_REPORT,
        clientInfo: {
          name: clientName,
          industry: "Technologie",
          size: "Grande entreprise"
        },
        auditData: {
          recommendations: [],
          metrics: {
            pue: [1.8, 1.9, 1.7],
            availability: [99.9, 99.8, 99.95],
            tierLevel: 3,
            complianceGaps: ['Documentation incomplète', 'Processus non formalisés']
          },
          infrastructure: {
            rooms: [],
            equipment: []
          },
          compliance: {
            matrix: {},
            score: 85
          }
        }
      };

      console.log(`[Download] Calling generateDocument with type: ${input.type}`);
      const document = await generateDocument(input);
      console.log('[Download] Document generated successfully');

      const blob = new Blob([document], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;

      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Document généré",
        description: "Le document a été généré et téléchargé avec succès"
      });
    } catch (error) {
      console.error('[Download] Error during document generation/download:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error 
          ? `Erreur : ${error.message}`
          : "Une erreur est survenue lors de la génération du document",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [clientName, generateFileName, isGenerating, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-8">
          <CardHeader className="bg-[#003366] text-white">
            <div className="flex items-center space-x-4">
              <button onClick={onBack} className="text-white hover:text-[#FF9900]">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">Documents</h1>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(documents).map(([key, doc]) => {
                const IconComponent = doc.icon;
                const isSelected = selectedDoc === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleDocumentClick(key)}
                    className={`
                      p-6 rounded-lg border-2 cursor-pointer
                      transition-all duration-200 h-full
                      ${isSelected
                        ? 'border-[#003366] text-[#003366] md:col-span-3'
                        : 'border-gray-200 text-gray-400'}
                      hover:border-[#FF9900] hover:shadow-lg
                    `}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <IconComponent className="h-12 w-12" />
                      <h3 className="text-xl font-semibold">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>

                      {!isSelected && (
                        <Button
                          className="mt-4 bg-[#FF9900] hover:bg-[#e68a00] text-white"
                        >
                          Voir le détail
                        </Button>
                      )}

                      {isSelected && (
                        <div className="w-full mt-6">
                          <div className="border-t pt-4">
                            {doc.sections.map((section, idx) => (
                              <div key={idx} className="mb-6 text-left">
                                <h4 className="font-semibold text-[#003366] mb-2">
                                  {section.title}
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                  {section.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="text-gray-600 text-sm">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end space-x-4 mt-4">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={(e) => handlePreview(e, key)}
                            >
                              <Eye className="h-4 w-4" />
                              Prévisualiser
                            </Button>
                            <Button
                              className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#e68a00] text-white relative"
                              onClick={(e) => handleDownload(e, key, doc.title)}
                            >
                              <Download className="h-4 w-4" />
                              Télécharger
                              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                .docx
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {showPreview && previewContent && documents[previewContent] && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
              <CardHeader className="flex flex-row justify-between items-center bg-[#003366] text-white sticky top-0 z-10">
                <h2 className="text-xl font-bold">Prévisualisation du document</h2>
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#FF9900]"
                  onClick={() => setShowPreview(false)}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#003366] mb-2">
                      {documents[previewContent].title}
                    </h1>
                    <p className="text-gray-600">
                      {documents[previewContent].description}
                    </p>
                  </div>
                  {documents[previewContent].sections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <h2 className="text-xl font-semibold text-[#003366] mb-4">
                        {section.title}
                      </h2>
                      <ul className="list-disc pl-6 space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-gray-700">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentNavigation;