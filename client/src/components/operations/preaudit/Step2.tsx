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
      category: "Infrastructure physique (Composants et équipements)",
      items: [
        "Votre centre de données est-il conçu pour résister à des événements naturels (séismes, incendies, etc.) ?",
        "L'alimentation électrique est-elle redondée ?",
        "Les équipements sont-ils situés dans des zones adaptées aux risques physiques et climatiques ?",
        "Les installations disposent-elles de moyens de protection contre les incendies ?"
      ]
    },
    {
      category: "Alimentation et refroidissement",
      items: [
        "Votre centre de données utilise-t-il des systèmes de refroidissement redondants ?",
        "Avez-vous des générateurs de secours pour assurer la continuité de l'alimentation électrique ?",
        "L'alimentation en énergie est-elle mesurée et monitorée ?",
        "Avez-vous un système de gestion pour réguler la température et l'humidité du centre de données ?"
      ]
    },
    {
      category: "Réseaux et communication",
      items: [
        "Votre centre de données dispose-t-il de multiples connexions réseau ?",
        "Les réseaux internes sont-ils protégés par des dispositifs de sécurité (pare-feu, systèmes de détection d'intrusion) ?",
        "Le câblage réseau respecte-t-il les meilleures pratiques pour la gestion de la bande passante et des pannes ?",
        "Les interconnexions entre les différents sites sont-elles sécurisées et redondantes ?"
      ]
    },
    {
      category: "Sécurité physique et logique",
      items: [
        "Les accès physiques au centre de données sont-ils contrôlés et limités aux personnes autorisées ?",
        "Des systèmes de surveillance vidéo et d'alarme sont-ils installés pour la sécurité physique ?",
        "Les serveurs sont-ils situés dans des armoires sécurisées ?",
        "Les informations sensibles sont-elles protégées par des systèmes de chiffrement et de gestion des accès ?"
      ]
    },
    {
      category: "Gestion des risques et résilience",
      items: [
        "Avez-vous un plan documenté pour la gestion des risques dans le centre de données ?",
        "Le centre de données dispose-t-il de procédures de reprise après sinistre et de continuité des services ?",
        "Avez-vous un plan d'audit et de réévaluation des risques régulièrement ?",
        "Les mises à jour et la maintenance des systèmes sont-elles programmées de manière à ne pas affecter la disponibilité des services ?"
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