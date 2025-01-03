import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const RecommendationsDetail = () => {
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données du localStorage
    const storedData = localStorage.getItem('recommendationsData');
    if (storedData) {
      const { recommendations, auditData } = JSON.parse(storedData);
      setRecommendations(recommendations);
      setAuditData(auditData);
    }
  }, []);

  const formatRecommendations = (text: string) => {
    if (!text) return '';
    const withBullets = text.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    const withHeadings = withBullets.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold my-4 text-[#003366]">$1</h3>');
    const withParagraphs = withHeadings.replace(/([^\n<>]+)\n/g, '<p class="my-2">$1</p>');
    return withParagraphs.replace(/<li>(.+?)<\/li>/g, '<ul class="list-disc pl-6 my-4"><li>$1</li></ul>');
  };

  if (!recommendations) {
    return (
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              Aucune recommandation disponible. Veuillez générer des recommandations depuis la page d'analyse.
            </p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => setLocation('/analysis')} className="bg-[#003366]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'analyse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => setLocation('/analysis')}
            className="bg-[#003366]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'analyse
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003366]">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recommandations Détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formatRecommendations(recommendations) 
              }} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsDetail;