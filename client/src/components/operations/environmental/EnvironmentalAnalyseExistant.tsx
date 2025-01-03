import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Upload } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const EnvironmentalAnalyseExistant = () => {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { conformity: string; comment: string }>>({});

  const questions = [
    {
      title: "Objectifs et stratégie environnementale",
      questions: [
        {
          question: "Quels sont les objectifs du client en matière de durabilité et de réduction de l'impact environnemental ?",
          description: "Cette question permet de comprendre les priorités du client en matière de gestion environnementale."
        },
        {
          question: "Avez-vous déjà réalisé un audit environnemental ou une évaluation de vos impacts environnementaux ?",
          description: "Permet de connaître les initiatives précédentes prises par l'entreprise concernant la gestion environnementale."
        },
        {
          question: "Quelles normes ou certifications environnementales suivez-vous actuellement (ISO 14001, EMAS, etc.) ?",
          description: "Permet de comprendre les référentiels existants qui orientent les actions environnementales de l'entreprise."
        },
        {
          question: "Quel est le niveau d'engagement des parties prenantes (employés, clients, fournisseurs) dans les actions environnementales ?",
          description: "Cela permet d'évaluer l'implication des différentes parties prenantes dans la gestion environnementale."
        }
      ]
    },
    {
      title: "Gestion des ressources et des déchets",
      questions: [
        {
          question: "Disposez-vous d'une politique de gestion des ressources naturelles et des matières premières ?",
          description: "Cela permet d'évaluer l'approche du client en matière de gestion durable des ressources."
        },
        {
          question: "Quels types de déchets générez-vous (déchets solides, liquides, dangereux) et comment sont-ils traités ?",
          description: "Permet de comprendre la gestion des déchets, un aspect clé de l'audit environnemental."
        },
        {
          question: "Avez-vous mis en place des initiatives pour réduire votre consommation d'énergie, d'eau et d'autres ressources ?",
          description: "Évalue les efforts du client pour optimiser l'utilisation des ressources."
        },
        {
          question: "Comment le recyclage et la réutilisation des matériaux sont-ils intégrés dans vos opérations ?",
          description: "Cela permet de vérifier si le client met en œuvre des pratiques de recyclage et de réutilisation."
        }
      ]
    },
    {
      title: "Emissions et impact carbone",
      questions: [
        {
          question: "Avez-vous une stratégie de réduction des émissions de gaz à effet de serre (GES) ?",
          description: "Cette question permet d'évaluer les efforts de réduction de l'empreinte carbone de l'entreprise."
        },
        {
          question: "Disposez-vous de systèmes de suivi des émissions de GES et des autres polluants ?",
          description: "Permet de vérifier si des outils de suivi sont en place pour mesurer les émissions et les impacts environnementaux."
        },
        {
          question: "Avez-vous un objectif de neutralité carbone et une feuille de route pour y parvenir ?",
          description: "Cela permet de comprendre les objectifs à long terme de l'entreprise en matière de réduction de son empreinte carbone."
        },
        {
          question: "Quels sont vos principaux leviers pour réduire vos émissions de GES (efficacité énergétique, changement d'énergies, etc.) ?",
          description: "Cette question permet d'identifier les actions concrètes prises par le client pour réduire ses émissions."
        }
      ]
    },
    {
      title: "Conformité réglementaire et risques environnementaux",
      questions: [
        {
          question: "Êtes-vous en conformité avec la législation environnementale locale, nationale et internationale ?",
          description: "Vérifie la conformité de l'entreprise avec les obligations légales et réglementaires en matière d'environnement."
        },
        {
          question: "Avez-vous identifié des risques environnementaux spécifiques à votre activité (pollution, dégradation des écosystèmes, etc.) ?",
          description: "Cette question explore les risques que l'entreprise prend en compte dans sa gestion environnementale."
        },
        {
          question: "Quel est le processus mis en place pour gérer les incidents environnementaux (fuites, pollutions, etc.) ?",
          description: "Permet de comprendre comment l'entreprise gère les incidents environnementaux et si un plan d'action est en place."
        },
        {
          question: "Est-ce que des audits environnementaux internes ou externes sont réalisés régulièrement pour évaluer votre performance environnementale ?",
          description: "Cela permet de vérifier la fréquence et l'impact des audits environnementaux dans l'organisation."
        }
      ]
    },
    {
      title: "Performance et communication",
      questions: [
        {
          question: "Comment mesurez-vous l'impact environnemental de vos opérations (indicateurs, rapports, etc.) ?",
          description: "Permet de comprendre comment l'entreprise évalue l'impact environnemental de ses activités."
        },
        {
          question: "Les résultats des audits environnementaux sont-ils communiqués aux parties prenantes (internes et externes) ?",
          description: "Évalue la transparence et l'implication des parties prenantes dans la gestion des performances environnementales."
        },
        {
          question: "Quel est le processus de révision et d'amélioration continue de votre stratégie environnementale ?",
          description: "Cette question permet de vérifier si l'entreprise met en place des processus d'amélioration continue."
        },
        {
          question: "Disposez-vous d'une équipe ou d'un responsable dédié à la gestion environnementale ?",
          description: "Permet de vérifier si une gouvernance claire et responsable est mise en place pour la gestion de l'environnement."
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
      setLocation('/operations/environmental/questionnaire');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analyse de l'existant - Audit Environnemental</h1>

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

export default EnvironmentalAnalyseExistant;
