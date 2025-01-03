import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function MultisiteAuditStep2() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour le questionnaire d'évaluation de l'Audit Multisite
  const questions = [
    {
      category: "Processus de gestion multisite",
      items: [
        "Les processus de gestion multisite sont-ils documentés ?",
        "Comment est assurée la cohérence des pratiques ?",
        "Existe-t-il une politique de gouvernance multisite ?",
        "Comment sont gérés les changements à l'échelle multisite ?"
      ]
    },
    {
      category: "Infrastructure et connectivité",
      items: [
        "Comment est assurée la connectivité entre les sites ?",
        "Les infrastructures sont-elles standardisées ?",
        "Comment est gérée la redondance inter-sites ?",
        "Existe-t-il une architecture réseau documentée ?"
      ]
    },
    {
      category: "Conformité et sécurité",
      items: [
        "Comment est assurée la conformité sur tous les sites ?",
        "Les politiques de sécurité sont-elles harmonisées ?",
        "Comment sont gérés les audits multisite ?",
        "Existe-t-il une gestion centralisée des accès ?"
      ]
    },
    {
      category: "Continuité d'activité",
      items: [
        "Les plans de continuité sont-ils coordonnés entre les sites ?",
        "Comment sont testés les scénarios de reprise ?",
        "Existe-t-il une stratégie de backup inter-sites ?",
        "Comment est assurée la résilience globale ?"
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
    setLocation('/operations/multisite/client-info');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('multisite.questionnaire.title')}</h1>
      <p className="text-gray-600">{t('multisite.questionnaire.description')}</p>

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
