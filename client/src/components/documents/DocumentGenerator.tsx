import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2 } from 'lucide-react';
import { DocumentType, generateDocument } from '@/services/documentGeneration';
import { useRecommendationsStore } from '@/store/useRecommendationsStore';
import { CustomToast } from "@/components/ui/custom-toast";

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const { recommendations } = useRecommendationsStore();

  const handleGenerate = async () => {
    if (!documentType) {
      setToastConfig({
        show: true,
        message: "Veuillez sélectionner un type de document à générer",
        type: 'error'
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log(`[Generation] Starting document generation of type: ${documentType}`);

      const input = {
        type: documentType,
        title: `${documentType} - Client Example`,
        clientInfo: {
          name: "Client Example",
          industry: "Technologie",
          size: "Grande entreprise"
        },
        metadata: {
          date: new Date().toISOString(),
          version: "1.0",
          author: "3R TECHNOLOGIE"
        },
        auditData: {
          recommendations,
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

      const blob = await generateDocument(input);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `3R_${documentType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToastConfig({
        show: true,
        message: "Document généré et téléchargé avec succès",
        type: 'success'
      });

    } catch (error) {
      console.error('[Generation] Error:', error);
      setToastConfig({
        show: true,
        message: error instanceof Error ? error.message : "Une erreur est survenue lors de la génération",
        type: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Générateur de Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Document</label>
              <Select
                value={documentType}
                onValueChange={(value) => setDocumentType(value as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DocumentType.TECHNICAL_OFFER}>Offre Technique</SelectItem>
                  <SelectItem value={DocumentType.SPECIFICATIONS}>Cahier des Charges</SelectItem>
                  <SelectItem value={DocumentType.AUDIT_REPORT}>Rapport d'Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!documentType || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération en cours...</span>
                </div>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {toastConfig.show && (
        <CustomToast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))}
          duration={3000}
        />
      )}
    </>
  );
}