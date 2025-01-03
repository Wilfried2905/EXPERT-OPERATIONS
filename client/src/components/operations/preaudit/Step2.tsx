import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function PreAuditStep2() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour le questionnaire d'évaluation du Pré-Audit de Certification
  const questions = [
    {
      category: "Infrastructure physique et environnement",
      items: [
        "L'infrastructure physique est-elle conçue selon les normes de certification visées ?",
        "Les systèmes de protection contre les risques environnementaux sont-ils conformes aux exigences ?",
        "La séparation des zones critiques est-elle conforme aux standards ?",
        "Les systèmes de contrôle environnemental répondent-ils aux critères de certification ?"
      ]
    },
    {
      category: "Systèmes électriques et mécaniques",
      items: [
        "Les systèmes électriques respectent-ils les exigences de redondance ?",
        "La distribution électrique est-elle conforme aux standards de certification ?",
        "Les systèmes mécaniques sont-ils dimensionnés selon les normes ?",
        "La maintenance des équipements critiques suit-elle les recommandations ?"
      ]
    },
    {
      category: "Sécurité et contrôle d'accès",
      items: [
        "Le système de contrôle d'accès répond-il aux exigences de certification ?",
        "Les procédures de sécurité sont-elles documentées selon les standards ?",
        "La surveillance des zones sensibles est-elle conforme aux normes ?",
        "La gestion des incidents de sécurité suit-elle les bonnes pratiques ?"
      ]
    },
    {
      category: "Documentation et procédures",
      items: [
        "La documentation technique est-elle conforme aux exigences de certification ?",
        "Les procédures opérationnelles sont-elles standardisées et documentées ?",
        "Les plans de maintenance sont-ils alignés avec les recommandations ?",
        "Le système de gestion documentaire répond-il aux critères ?"
      ]
    },
    {
      category: "Organisation et processus",
      items: [
        "L'organisation des équipes est-elle conforme aux exigences ?",
        "Les processus de gestion des changements suivent-ils les standards ?",
        "Les procédures d'urgence sont-elles conformes aux normes ?",
        "La formation du personnel répond-elle aux critères de certification ?"
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
    setLocation('/operations/preaudit/client-info');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('preaudit.questionnaire.title')}</h1>
      <p className="text-gray-600">{t('preaudit.questionnaire.description')}</p>

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