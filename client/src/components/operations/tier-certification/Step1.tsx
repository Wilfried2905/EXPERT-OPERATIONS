import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function TierCertificationStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour l'analyse de l'existant de l'Audit de Certification TIER
  const questions = [
    {
      category: "Infrastructure critique",
      items: [
        "Comment est organisée l'infrastructure électrique ?",
        "Quels sont les systèmes de refroidissement en place ?",
        "Comment est gérée la redondance des équipements critiques ?",
        "Quelles sont les mesures de protection contre les pannes ?"
      ]
    },
    {
      category: "Disponibilité et résilience",
      items: [
        "Quel est le niveau de disponibilité actuel ?",
        "Comment sont gérées les maintenances sans interruption ?",
        "Quels sont les mécanismes de failover en place ?",
        "Comment est assurée la continuité des services ?"
      ]
    },
    {
      category: "Monitoring et contrôle",
      items: [
        "Quels systèmes de surveillance sont en place ?",
        "Comment sont détectées les anomalies ?",
        "Quels sont les processus d'intervention ?",
        "Comment est assurée la supervision 24/7 ?"
      ]
    },
    {
      category: "Documentation technique",
      items: [
        "Les schémas d'architecture sont-ils à jour ?",
        "Comment est documentée la maintenance ?",
        "Existe-t-il des procédures d'urgence documentées ?",
        "Comment sont tracées les interventions ?"
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
    setLocation('/operations/tier-certification/step2');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('tierCertification.analysis.title')}</h1>
      <p className="text-gray-600">{t('tierCertification.analysis.description')}</p>

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
