import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Services
async function exportToWord(data: any) {
  const response = await fetch('/api/exports/word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'export Word: ${response.statusText}`);
  }

  return response.blob();
}

async function exportToExcel(data: any) {
  const response = await fetch('/api/exports/excel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de l'export Excel: ${response.statusText}`);
  }

  return response.blob();
}

export default function RecommendationsView() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const recommendations = []; // Ceci sera remplacé par les vraies données

  const handleExportWord = async () => {
    try {
      if (!recommendations?.length) {
        toast({
          title: "Attention",
          description: "Aucune recommandation à exporter",
          variant: "destructive"
        });
        return;
      }

      const fileName = `Recommandations_${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.docx`;
      const blob = await exportToWord(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Word réussi"
      });
    } catch (error) {
      console.error('Erreur lors de l\'export Word:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Word",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await exportToExcel(recommendations);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Recommandations_${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export Excel réussi"
      });
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export Excel",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setLocation('/tableau-de-bord')}
          variant="outline"
          className="hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Recommandations</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportWord}
            variant="outline"
            className="hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="hover:bg-gray-100"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="impacts">Impacts</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Aucune recommandation disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les recommandations seront affichées ici une fois générées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impacts">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Analyse des Impacts</h3>
              <p className="text-gray-600">
                Le graphique des impacts sera affiché ici une fois les recommandations générées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Équipements</h3>
              <p className="text-gray-600">
                La liste des équipements sera affichée ici une fois les recommandations générées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Matrice de conformité</h3>
              <p className="text-gray-600">
                La matrice de conformité sera affichée ici une fois les recommandations générées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Planning de mise en œuvre</h3>
              <p className="text-gray-600">
                Le planning sera affiché ici une fois les recommandations générées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}