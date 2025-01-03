import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function EnvironmentalAuditStep2() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour le questionnaire d'évaluation de l'Audit Environnemental
  const questions = [
    {
      category: "Conformité environnementale",
      items: [
        "Les certifications environnementales sont-elles à jour ?",
        "Les rapports environnementaux sont-ils régulièrement produits ?",
        "Comment sont suivis les indicateurs environnementaux ?",
        "Les audits environnementaux sont-ils planifiés régulièrement ?"
      ]
    },
    {
      category: "Performance énergétique",
      items: [
        "Les systèmes de refroidissement sont-ils optimisés ?",
        "Comment est mesurée l'efficacité énergétique ?",
        "Existe-t-il des objectifs de réduction de consommation ?",
        "Les équipements sont-ils économes en énergie ?"
      ]
    },
    {
      category: "Gestion des ressources",
      items: [
        "Comment est optimisée l'utilisation des ressources ?",
        "Les processus de recyclage sont-ils efficaces ?",
        "Existe-t-il une politique d'achat responsable ?",
        "Comment est gérée la fin de vie des équipements ?"
      ]
    },
    {
      category: "Innovation environnementale",
      items: [
        "Quelles technologies vertes sont utilisées ?",
        "Comment l'innovation contribue-t-elle à la durabilité ?",
        "Existe-t-il des projets d'amélioration environnementale ?",
        "Comment sont évalués les nouveaux équipements ?"
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
    setLocation('/operations/environmental/client-info');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('environmental.questionnaire.title')}</h1>
      <p className="text-gray-600">{t('environmental.questionnaire.description')}</p>

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
