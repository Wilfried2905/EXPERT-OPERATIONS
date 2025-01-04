import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, AlertCircle } from 'lucide-react';
import { DocumentType, generateDocument, getGenerationLogs, analyzeGenerationLogs } from '@/services/documentGeneration';
import { useRecommendationsStore } from '@/store/useRecommendationsStore';

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStats, setGenerationStats] = useState<{
    totalAttempts: number;
    failures: number;
    successes: number;
    successRate: number;
    averageDuration: number;
  } | null>(null);
  const { toast } = useToast();
  const { recommendations } = useRecommendationsStore();

  useEffect(() => {
    const stats = analyzeGenerationLogs();
    setGenerationStats(stats);
  }, [isGenerating]);

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
      const document = await generateDocument(input);
      console.log('[Generation] Document generated successfully');

      // Créer un blob et déclencher le téléchargement
      console.log('[Download] Preparing document for download');
      const blob = new Blob([document], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `3R_${documentType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.docx`;

      console.log('[Download] Triggering download');
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log('[Download] Download completed');

      toast({
        title: "Document généré",
        description: "Le document a été généré et téléchargé avec succès"
      });
    } catch (error) {
      console.error('[Error] Document generation failed:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la génération du document",
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

          {generationStats && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <h3 className="font-medium">Statistiques de génération</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Tentatives totales: {generationStats.totalAttempts}</p>
                  <p>Taux de succès: {generationStats.successRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p>Succès: {generationStats.successes}</p>
                  <p>Échecs: {generationStats.failures}</p>
                </div>
              </div>
              {generationStats.failures > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <p>Des erreurs ont été détectées dans les générations précédentes</p>
                </div>
              )}
            </div>
          )}

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