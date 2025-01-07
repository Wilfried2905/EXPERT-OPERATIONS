import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function MultisiteAuditStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour l'analyse de l'existant de l'Audit Multisite
  const questions = [
    {
      category: "Structure organisationnelle",
      items: [
        "Comment sont organisés les différents sites du centre de données ?",
        "Quelle est la hiérarchie de gestion entre les sites ?",
        "Comment sont répartis les rôles et responsabilités entre les sites ?",
        "Existe-t-il une documentation centralisée de l'organisation multisite ?"
      ]
    },
    {
      category: "Coordination et communication",
      items: [
        "Comment est assurée la communication entre les sites ?",
        "Quels outils de collaboration sont utilisés ?",
        "Comment sont coordonnées les opérations entre les sites ?",
        "Comment sont gérés les incidents impliquant plusieurs sites ?"
      ]
    },
    {
      category: "Standardisation et cohérence",
      items: [
        "Les procédures sont-elles standardisées entre les sites ?",
        "Comment est assurée la cohérence des pratiques ?",
        "Existe-t-il des référentiels communs ?",
        "Comment sont gérées les spécificités locales ?"
      ]
    },
    {
      category: "Surveillance et reporting",
      items: [
        "Comment est effectué le monitoring des différents sites ?",
        "Quels sont les indicateurs de performance utilisés ?",
        "Comment sont consolidés les rapports multisite ?",
        "Existe-t-il un tableau de bord centralisé ?"
      ]
    }
  ];

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleNext = () => {
    // Sauvegarder les réponses et rediriger vers les recommandations
    setLocation('/recommendations');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('multisite.analysis.title')}</h1>
      <p className="text-gray-600">{t('multisite.analysis.description')}</p>

      {questions.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-2">
                  <label className="block font-medium">{question}</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={answers[question] || ''}
                    onChange={(e) => handleAnswerChange(question, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={handleNext}
          className="bg-[#003366] hover:bg-[#002347] text-white"
        >
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
}