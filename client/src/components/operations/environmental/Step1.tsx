import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function EnvironmentalAuditStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour l'analyse de l'existant de l'Audit Environnemental
  const questions = [
    {
      category: "Politique environnementale",
      items: [
        "Quelle est votre politique environnementale actuelle ?",
        "Comment les objectifs environnementaux sont-ils définis et suivis ?",
        "Existe-t-il un système de management environnemental ?",
        "Comment la conformité réglementaire est-elle assurée ?"
      ]
    },
    {
      category: "Consommation d'énergie",
      items: [
        "Comment surveillez-vous la consommation d'énergie ?",
        "Quelles mesures d'efficacité énergétique sont en place ?",
        "Utilisez-vous des énergies renouvelables ?",
        "Comment optimisez-vous l'utilisation de l'énergie ?"
      ]
    },
    {
      category: "Gestion des déchets",
      items: [
        "Comment sont gérés les déchets électroniques ?",
        "Existe-t-il un programme de recyclage ?",
        "Comment sont traités les déchets dangereux ?",
        "Quelles sont les mesures de réduction des déchets ?"
      ]
    },
    {
      category: "Impact environnemental",
      items: [
        "Comment mesurez-vous votre empreinte carbone ?",
        "Quelles actions sont prises pour réduire les émissions ?",
        "Comment gérez-vous l'utilisation de l'eau ?",
        "Avez-vous des objectifs de développement durable ?"
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
    // Rediriger vers les recommandations
    setLocation('/recommendations');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('environmental.analysis.title')}</h1>
      <p className="text-gray-600">{t('environmental.analysis.description')}</p>

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
        <Button onClick={handleNext}>
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
}