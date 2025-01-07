import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function PreAuditStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

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
    // Vérifier que toutes les questions obligatoires ont une réponse
    const unansweredQuestions = questions.flatMap(section => 
      section.items.filter(question => !answers[question] || answers[question].trim() === '')
    );

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez répondre à toutes les questions avant de continuer",
        variant: "destructive"
      });
      return;
    }

    // Formater les données pour correspondre à la structure attendue
    const formattedData = {
      infrastructure: {
        questionnaire: {
          resultats: questions.reduce((acc, section) => {
            acc[section.category] = section.items.reduce((items, question) => {
              items[question] = answers[question];
              return items;
            }, {} as Record<string, string>);
            return acc;
          }, {} as Record<string, Record<string, string>>),
          scores: {
            global: {
              score: 0,
              repondu: Object.keys(answers).length,
              nom: "Pré-audit"
            },
            parGroupe: questions.reduce((acc, section) => {
              acc[section.category] = {
                score: 0,
                repondu: section.items.filter(q => answers[q] && answers[q].trim() !== '').length,
                nom: section.category
              };
              return acc;
            }, {} as Record<string, { score: number; repondu: number; nom: string; }>)
          }
        }
      }
    };

    // Stocker les données formatées (à implémenter avec le state management)
    console.log('Données formatées:', formattedData);

    // Rediriger vers la page des recommandations
    setLocation('/recommendations');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
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
          Voir les Recommandations
        </Button>
      </div>
    </div>
  );
}