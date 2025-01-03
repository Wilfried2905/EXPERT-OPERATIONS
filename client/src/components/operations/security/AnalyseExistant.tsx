import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Upload } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const SecurityAnalyseExistant = () => {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { conformity: string; comment: string }>>({});

  const questions = [
    {
      title: "Objectifs et stratégie de sécurité",
      questions: [
        {
          question: "Quels sont les objectifs principaux du client en matière de sécurité ?",
          description: "Cette question permet de comprendre les priorités du client en matière de sécurité et les domaines qu'il considère comme critiques."
        },
        {
          question: "Avez-vous déjà réalisé un audit de sécurité ou une évaluation des risques par un tiers ?",
          description: "Permet de connaître l'historique des audits et évaluations déjà effectués."
        },
        {
          question: "Quelles normes ou cadres de sécurité suivez-vous actuellement (ISO 27001, NIST, etc.) ?",
          description: "Cela permet d'identifier les normes existantes et leur impact sur la sécurité du système."
        },
        {
          question: "Quels outils ou logiciels de gestion de la sécurité utilisez-vous actuellement ?",
          description: "Cela permet d'évaluer les solutions mises en place pour assurer la sécurité des infrastructures et données."
        }
      ]
    },
    {
      title: "Infrastructure de sécurité",
      questions: [
        {
          question: "Quel est le niveau de protection des systèmes d'information (pare-feu, détection d'intrusion, etc.) ?",
          description: "Évalue la sécurité des systèmes de défense en place contre les intrusions."
        },
        {
          question: "Les contrôles d'accès aux systèmes sont-ils bien définis et mis à jour régulièrement ?",
          description: "Permet de vérifier l'efficacité et la gestion des accès aux systèmes sensibles."
        },
        {
          question: "Avez-vous des systèmes de gestion des identités et des accès (IAM) en place ?",
          description: "Cela permet de vérifier si la gestion des identités est centralisée et sécurisée."
        },
        {
          question: "Les périphériques et les terminaux des employés (ordinateurs, mobiles, etc.) sont-ils sécurisés et protégés contre les menaces externes ?",
          description: "Cette question évalue la gestion de la sécurité des appareils utilisés par les employés."
        }
      ]
    },
    {
      title: "Gestion des risques et conformité",
      questions: [
        {
          question: "Avez-vous une politique de gestion des risques et des menaces formalisée ?",
          description: "Vérifie si le client a un cadre formel de gestion des risques de sécurité."
        },
        {
          question: "Quelles sont les principales menaces identifiées dans votre environnement informatique ?",
          description: "Cette question permet d'identifier les menaces prioritaires et la préparation à y faire face."
        },
        {
          question: "Est-ce que des audits internes ou des tests de pénétration sont régulièrement effectués pour identifier des vulnérabilités ?",
          description: "Cela permet de savoir si des tests proactifs sont réalisés pour détecter les faiblesses."
        },
        {
          question: "Votre organisation est-elle conforme aux exigences légales et réglementaires en matière de protection des données (RGPD, etc.) ?",
          description: "Permet de vérifier la conformité du client aux réglementations relatives à la sécurité des données."
        }
      ]
    },
    {
      title: "Réponse aux incidents et gestion des crises",
      questions: [
        {
          question: "Avez-vous une procédure documentée pour la gestion des incidents de sécurité ?",
          description: "Cela permet d'évaluer la réactivité et l'organisation du client en cas d'incident de sécurité."
        },
        {
          question: "Les employés sont-ils formés et sensibilisés aux bonnes pratiques de sécurité ?",
          description: "Cette question explore l'aspect humain de la sécurité, notamment la sensibilisation des employés."
        },
        {
          question: "Disposez-vous d'un plan de réponse aux incidents de sécurité et de reprise après sinistre ?",
          description: "Cela permet de s'assurer que le client est préparé en cas d'incident majeur."
        },
        {
          question: "Avez-vous un suivi des incidents de sécurité (rapports, investigations, etc.) ?",
          description: "Cette question permet d'évaluer la gestion post-incident et l'analyse des causes des failles de sécurité."
        }
      ]
    },
    {
      title: "Surveillance et contrôle continu",
      questions: [
        {
          question: "Comment surveillez-vous actuellement les menaces et les vulnérabilités en temps réel ?",
          description: "Cette question évalue les outils et processus utilisés pour la surveillance continue des menaces."
        },
        {
          question: "Utilisez-vous des outils de gestion des événements et des informations de sécurité (SIEM) ?",
          description: "Permet de comprendre comment les événements de sécurité sont collectés et analysés."
        },
        {
          question: "Les systèmes de surveillance de la sécurité sont-ils suffisamment redondants pour éviter toute interruption ?",
          description: "Vérifie si la surveillance continue est assurée, même en cas de défaillance de l'un des systèmes."
        },
        {
          question: "Les activités de sécurité sont-elles auditées régulièrement pour évaluer l'efficacité des contrôles en place ?",
          description: "Cela permet de vérifier que des évaluations continues de l'efficacité des contrôles de sécurité sont effectuées."
        }
      ]
    }
  ];

  const totalQuestions = questions.reduce((acc, section) => acc + section.questions.length, 0);
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const conformityCount = Object.values(answers).filter(a => a.conformity === 'conforme').length;
  const conformity = (conformityCount / totalQuestions) * 100;

  const handleAnswerChange = (questionIndex: number, data: { conformity?: string; comment?: string }) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex] || { conformity: '', comment: '' },
        ...data
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setLocation('/operations/security/questionnaire');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analyse de l'existant - Audit de Sécurité</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm font-medium mb-2">Progression</h2>
            <Progress value={progress} className="progress-bar" />
            <span className="text-sm text-gray-500">{Math.round(progress)}% complété</span>
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Conformité</h2>
            <Progress value={conformity} className="progress-bar" />
            <span className="text-sm text-gray-500">{Math.round(conformity)}% conforme</span>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            {questions.map((section, sectionIndex) => {
              const questionData = section.questions[currentQuestion - section.questions.length * sectionIndex];
              if (questionData) {
                return (
                  <div key={sectionIndex}>
                    <h2 className="text-xl font-semibold mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg mb-2">
                      {questionData.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {questionData.description}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={answers[currentQuestion]?.conformity === 'conforme' ? 'default' : 'outline'}
                onClick={() => handleAnswerChange(currentQuestion, { conformity: 'conforme' })}
              >
                Conforme
              </Button>
              <Button
                variant={answers[currentQuestion]?.conformity === 'non-conforme' ? 'default' : 'outline'}
                onClick={() => handleAnswerChange(currentQuestion, { conformity: 'non-conforme' })}
              >
                Non Conforme
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Commentaires et observations
              </label>
              <Textarea
                value={answers[currentQuestion]?.comment || ''}
                onChange={(e) => handleAnswerChange(currentQuestion, { comment: e.target.value })}
                rows={4}
              />
            </div>

          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentQuestion === totalQuestions - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SecurityAnalyseExistant;