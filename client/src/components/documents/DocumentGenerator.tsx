import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from 'lucide-react';
import { DocumentType, generateDocument } from '@/services/documentGeneration';
import { useRecommendationsStore } from '@/store/useRecommendationsStore';

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { recommendations } = useRecommendationsStore();

  const handleGenerate = async () => {
    if (!documentType) {
      toast({
        title: "Type de document requis",
        description: "Veuillez sélectionner un type de document à générer",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const toastId = 'document-generation';

    try {
      console.log(`[Generation] Starting document generation of type: ${documentType}`);

      const input = {
        type: documentType,
        clientInfo: {
          name: "Client Example",
          industry: "Technologie",
          size: "Grande entreprise"
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

      console.log('[Generation] Calling generateDocument with input:', JSON.stringify(input, null, 2));

      await generateDocument(input, {
        onStart: () => {
          toast({
            id: toastId,
            title: "Génération en cours",
            description: "Veuillez patienter pendant la génération du document...",
            duration: null,
          });
        },
        onSuccess: () => {
          toast({
            id: toastId,
            title: "Document généré",
            description: "Le document a été généré et téléchargé avec succès",
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            id: toastId,
            title: "Erreur",
            description: error.message,
            variant: "destructive",
            duration: 5000,
          });
        }
      });
    } catch (error) {
      console.error('[Error] Document generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
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
  );
}