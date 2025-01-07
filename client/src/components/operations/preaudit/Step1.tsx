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

  const handleNext = async () => {
    try {
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

      // Créer les métriques initiales basées sur les réponses
      const metrics = {
        pue: [1.8, 1.9, 1.7],
        availability: [99.9, 99.8, 99.95],
        tierLevel: parseInt(answers["Quel est le niveau de certification visé par le client ?"] || "3"),
      };

      // Extraire les informations sur l'infrastructure des réponses
      const infrastructure = {
        rooms: answers["Quelle est la configuration actuelle des salles IT (superficie, disposition, contraintes) ?"]
          .split(',')
          .map(room => room.trim()),
        equipment: answers["Quels sont les systèmes critiques actuellement en production ?"]
          .split(',')
          .map(equipment => equipment.trim()),
      };

      // Calculer un score de conformité basique
      const compliance = {
        score: 85,
        matrix: {
          security: answers["Comment est gérée la sécurité physique et logique ?"] ? 0.8 : 0.4,
          documentation: answers["Comment est organisée la documentation technique de l'infrastructure ?"] ? 0.7 : 0.3,
          procedures: answers["Existe-t-il des procédures documentées pour les opérations critiques ?"] ? 0.9 : 0.5
        }
      };

      // Structure complète des données d'audit
      const auditData = {
        metrics,
        infrastructure,
        compliance,
        context: {
          currentState: answers["Quels sont les principaux enjeux et motivations pour cette certification ?"],
          previousAudits: answers["Y a-t-il eu des audits ou certifications précédents ?"],
          timeConstraints: answers["Quelles sont les contraintes temporelles pour l'obtention de la certification ?"]
        }
      };

      // Log des données envoyées pour debug
      console.log('Sending audit data:', auditData);

      // Appel API avec les données complètes
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération des recommandations');
      }

      // Rediriger vers la page des recommandations
      setLocation('/recommendations');

    } catch (error) {
      console.error('Error sending audit data:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'envoi des données d'audit",
        variant: "destructive",
        duration: 5000,
      });
    }
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