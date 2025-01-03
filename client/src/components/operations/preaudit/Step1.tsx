import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function PreAuditStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Questions pour l'analyse de l'existant du Pré-Audit de Certification
  const questions = [
    {
      category: "1. État actuel et objectifs",
      items: [
        "Quel est le niveau de certification visé par le client ?",
        "Quels sont les principaux enjeux et motivations pour cette certification ?",
        "Y a-t-il eu des audits ou certifications précédents ?",
        "Quelles sont les contraintes temporelles pour l'obtention de la certification ?"
      ]
    },
    {
      category: "2. Infrastructure existante",
      items: [
        "Quelle est la configuration actuelle des salles IT (superficie, disposition, contraintes) ?",
        "Quels sont les systèmes critiques actuellement en production ?",
        "Comment est organisée la documentation technique de l'infrastructure ?",
        "Quelles sont les principales évolutions prévues de l'infrastructure ?"
      ]
    },
    {
      category: "3. Gestion opérationnelle",
      items: [
        "Comment sont organisées les équipes d'exploitation ?",
        "Quels sont les processus de gestion des incidents en place ?",
        "Comment est gérée la maintenance préventive et corrective ?",
        "Existe-t-il des procédures documentées pour les opérations critiques ?"
      ]
    },
    {
      category: "4. Conformité et sécurité",
      items: [
        "Quelles sont les normes et réglementations actuellement suivies ?",
        "Comment est gérée la sécurité physique et logique ?",
        "Existe-t-il un système de management de la qualité ?",
        "Comment sont gérés les accès et les habilitations ?"
      ]
    },
    {
      category: "5. Continuité d'activité",
      items: [
        "Existe-t-il un plan de continuité d'activité formalisé ?",
        "Comment sont réalisés les tests de continuité ?",
        "Quelles sont les procédures de sauvegarde et de restauration ?",
        "Comment est assurée la redondance des systèmes critiques ?"
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
    setLocation('/operations/preaudit/step2');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('preaudit.analysis.title')}</h1>
      <p className="text-gray-600">{t('preaudit.analysis.description')}</p>

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