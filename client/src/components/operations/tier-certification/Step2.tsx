import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function TierCertificationStep2() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour le questionnaire d'évaluation de la Certification TIER
  const questions = [
    {
      category: "Exigences TIER",
      items: [
        "Les systèmes électriques répondent-ils aux critères du niveau visé ?",
        "Les systèmes de refroidissement sont-ils conformes aux exigences ?",
        "La redondance est-elle suffisante pour le niveau TIER visé ?",
        "Les chemins de distribution sont-ils correctement séparés ?"
      ]
    },
    {
      category: "Maintenance et opérations",
      items: [
        "Les procédures de maintenance sont-elles conformes aux standards ?",
        "Le personnel est-il formé aux exigences TIER ?",
        "Les tests de maintenance sont-ils régulièrement effectués ?",
        "Comment est assurée la continuité pendant la maintenance ?"
      ]
    },
    {
      category: "Topologie",
      items: [
        "L'architecture répond-elle aux exigences de concurrent maintainability ?",
        "Les systèmes critiques sont-ils correctement compartimentés ?",
        "La distribution électrique est-elle conforme aux exigences ?",
        "Les systèmes de backup sont-ils correctement dimensionnés ?"
      ]
    },
    {
      category: "Documentation",
      items: [
        "La documentation technique est-elle conforme aux exigences TIER ?",
        "Les procédures d'exploitation sont-elles documentées ?",
        "Les plans d'urgence sont-ils conformes aux standards ?",
        "Les rapports de test sont-ils disponibles et à jour ?"
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
    // Sauvegarder les réponses (à implémenter avec le state management)
    setLocation('/operations/tier-certification/client-info');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('tierCertification.questionnaire.title')}</h1>
      <p className="text-gray-600">{t('tierCertification.questionnaire.description')}</p>

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
