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
      category: "1. Objectifs et stratégie",
      items: [
        "Quels sont les principaux objectifs du client pour la certification ?",
        "Quelles sont les principales applications et services en production dans votre centre de données ?",
        "Avez-vous effectué des audits de sécurité ou de conformité précédemment ?",
        "Avez-vous des fournisseurs externes qui gèrent des parties de votre infrastructure ?"
      ]
    },
    {
      category: "2. Infrastructure et équipements",
      items: [
        "Quelle est la taille de l'infrastructure informatique actuelle ?",
        "Quels équipements sont actuellement utilisés pour les systèmes critiques ?",
        "Avez-vous une cartographie complète des infrastructures de votre centre de données ?",
        "Comment gérez-vous la capacité et l'évolution de l'infrastructure ?"
      ]
    },
    {
      category: "3. Sécurité et gestion des risques",
      items: [
        "Comment les accès au centre de données sont-ils contrôlés ?",
        "Comment les incidents sont-ils actuellement gérés ?",
        "Y a-t-il des processus de gestion des risques en place pour les systèmes critiques ?",
        "Les informations sensibles sont-elles protégées par des systèmes de chiffrement et de gestion des accès ?"
      ]
    },
    {
      category: "4. Continuité et résilience",
      items: [
        "Le centre de données dispose-t-il d'un plan de continuité des activités (PCA) et de reprise après sinistre (DRP) ?",
        "Quels types de solutions de sauvegarde et de récupération des données sont en place ?",
        "Les équipements sont-ils protégés contre les pannes, et existe-t-il une redondance pour les systèmes critiques ?",
        "Le centre de données dispose-t-il de procédures de reprise après sinistre et de continuité des services ?"
      ]
    },
    {
      category: "5. Surveillance et gestion des performances",
      items: [
        "Comment le centre de données est-il surveillé (en termes de performance et de sécurité) ?",
        "Comment les incidents sont-ils suivis et rapportés ?",
        "Quel est le niveau de compétence et de formation des équipes en charge de l'infrastructure ?",
        "Utilisez-vous des technologies de virtualisation ou de cloud dans votre infrastructure ?"
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