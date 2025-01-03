import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText } from 'lucide-react';
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

    try {
      setIsGenerating(true);

      // Exemple de données - À adapter selon votre structure réelle
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

      const document = await generateDocument(input);

      // Créer un blob et déclencher le téléchargement
      const blob = new Blob([document], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `3R_${documentType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Document généré",
        description: "Le document a été généré avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document",
        variant: "destructive"
      });
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
                <SelectItem value={DocumentType.AUDIT_REPORT}>Rapport d'Audit</SelectItem>
                <SelectItem value={DocumentType.SPECIFICATIONS}>Cahier des Charges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!documentType || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>Génération en cours...</>
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