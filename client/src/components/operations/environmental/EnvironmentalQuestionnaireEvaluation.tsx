import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Upload } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

const EnvironmentalQuestionnaireEvaluation = () => {
  const [, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { conformity: string; comment: string }>>({});

  const sections = [
    {
      title: "Gestion des ressources naturelles",
      questions: [
        {
          question: "Les pratiques de gestion des ressources naturelles sont-elles basées sur le principe de durabilité ?",
          reference: "ISO 14001 - La gestion durable des ressources naturelles est une composante clé de la gestion environnementale."
        },
        {
          question: "Avez-vous mis en place une politique d'approvisionnement responsable et éthique concernant les matières premières ?",
          reference: "ISO 14001 - L'approvisionnement responsable contribue à une réduction de l'empreinte écologique tout au long de la chaîne de valeur."
        },
        {
          question: "Les processus de fabrication ou d'exploitation sont-ils optimisés pour minimiser la consommation de ressources (énergie, eau, matières premières) ?",
          reference: "ISO 14001 - L'efficacité des ressources doit être une priorité dans le processus de production."
        },
        {
          question: "Avez-vous mis en œuvre des systèmes de gestion de l'eau et de l'énergie pour réduire les consommations ?",
          reference: "ISO 50001 - La gestion de l'eau et de l'énergie est essentielle pour limiter les impacts environnementaux."
        }
      ]
    },
    {
      title: "Gestion des déchets et du recyclage",
      questions: [
        {
          question: "Les déchets sont-ils triés à la source et envoyés à des centres de recyclage certifiés ?",
          reference: "ISO 14001 - La gestion des déchets est un aspect important de la gestion environnementale pour éviter leur impact négatif."
        },
        {
          question: "Les déchets dangereux sont-ils stockés et éliminés selon des normes strictes ?",
          reference: "ISO 14001 - Le stockage et l'élimination des déchets dangereux doivent respecter des normes pour éviter toute contamination."
        },
        {
          question: "Avez-vous mis en place des initiatives pour réduire la production de déchets à la source ?",
          reference: "ISO 14001 - Réduire la production de déchets à la source permet de diminuer les impacts environnementaux."
        },
        {
          question: "Les déchets recyclables sont-ils utilisés pour créer de nouveaux produits ou matériaux ?",
          reference: "ISO 14001 - Le recyclage et la réutilisation des matériaux permettent de réduire la demande de nouvelles ressources naturelles."
        }
      ]
    },
    {
      title: "Réduction des émissions et gestion du carbone",
      questions: [
        {
          question: "Avez-vous mis en place une politique d'efficacité énergétique pour réduire la consommation d'énergie dans vos installations ?",
          reference: "ISO 50001 - La gestion de l'énergie est un levier essentiel pour la réduction des émissions de gaz à effet de serre (GES)."
        },
        {
          question: "Les émissions de gaz à effet de serre (GES) sont-elles mesurées et suivies de manière régulière ?",
          reference: "ISO 14064 - La mesure et le suivi des émissions sont des outils clés pour les entreprises cherchant à réduire leur impact carbone."
        },
        {
          question: "Des initiatives sont-elles mises en place pour utiliser des sources d'énergie renouvelable dans vos activités ?",
          reference: "ISO 50001 - L'utilisation d'énergies renouvelables contribue à réduire l'empreinte carbone de l'entreprise."
        },
        {
          question: "Avez-vous une stratégie pour réduire l'empreinte carbone de vos produits ou services ?",
          reference: "ISO 14067 - Réduire l'empreinte carbone des produits permet de contribuer à un environnement plus sain."
        }
      ]
    },
    {
      title: "Conformité réglementaire et gestion des risques environnementaux",
      questions: [
        {
          question: "Êtes-vous conforme à toutes les réglementations environnementales locales, nationales et internationales ?",
          reference: "ISO 14001 - La conformité réglementaire est une exigence fondamentale pour les entreprises cherchant à minimiser leur impact environnemental."
        },
        {
          question: "Avez-vous évalué les risques environnementaux liés à vos activités et mis en place des actions pour les atténuer ?",
          reference: "ISO 14001 - L'évaluation et l'atténuation des risques sont essentielles pour éviter les impacts négatifs sur l'environnement."
        },
        {
          question: "Les processus d'audit et de contrôle sont-ils régulièrement effectués pour vérifier la conformité environnementale ?",
          reference: "ISO 14001 - Les audits environnementaux internes et externes permettent de garantir que l'entreprise respecte les normes environnementales."
        },
        {
          question: "Avez-vous un plan d'urgence en cas de catastrophe environnementale (pollution, fuite, etc.) ?",
          reference: "ISO 14001 - Un plan d'urgence est essentiel pour une réaction rapide et efficace en cas de situation critique."
        }
      ]
    },
    {
      title: "Communication et engagement des parties prenantes",
      questions: [
        {
          question: "Les résultats environnementaux sont-ils partagés avec les parties prenantes (employés, clients, investisseurs) ?",
          reference: "ISO 14001 - La transparence vis-à-vis des parties prenantes est un élément clé pour renforcer l'engagement environnemental."
        },
        {
          question: "L'engagement environnemental est-il intégré dans la culture d'entreprise et communiqué régulièrement aux employés ?",
          reference: "ISO 14001 - L'implication des employés dans les initiatives environnementales renforce la durabilité des actions."
        },
        {
          question: "Les fournisseurs sont-ils évalués en fonction de leur performance environnementale ?",
          reference: "ISO 14001 - Évaluer les fournisseurs en fonction de leur performance environnementale permet de s'assurer qu'ils respectent les mêmes normes que l'entreprise."
        },
        {
          question: "Avez-vous mis en place des partenariats avec des organisations environnementales ou des autorités locales pour promouvoir la durabilité ?",
          reference: "ISO 14001 - Les partenariats externes permettent de renforcer l'impact positif sur l'environnement à l'échelle locale ou globale."
        }
      ]
    }
  ];

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const conformityCount = Object.values(answers).filter(a => a.conformity === 'conforme').length;
  const conformity = (conformityCount / totalQuestions) * 100;

  const handleAnswerChange = (questionIndex: number, data: { conformity?: string; comment?: string }) => {
    const key = `${currentSection}-${questionIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: {
        ...prev[key] || { conformity: '', comment: '' },
        ...data
      }
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setLocation('/operations/environmental/client-info');
    }
  };

  const handlePrevious = () => setCurrentSection(prev => Math.max(0, prev - 1));

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Questionnaire d'évaluation - Audit Environnemental</h1>

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
          <h2 className="text-xl font-semibold mb-6">{sections[currentSection].title}</h2>

          <div className="space-y-8">
            {sections[currentSection].questions.map((question, idx) => (
              <div key={idx} className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                  <p className="text-sm text-gray-600 italic">{question.reference}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={answers[`${currentSection}-${idx}`]?.conformity === 'conforme' ? 'default' : 'outline'}
                    onClick={() => handleAnswerChange(idx, { conformity: 'conforme' })}
                  >
                    Conforme
                  </Button>
                  <Button
                    variant={answers[`${currentSection}-${idx}`]?.conformity === 'non-conforme' ? 'default' : 'outline'}
                    onClick={() => handleAnswerChange(idx, { conformity: 'non-conforme' })}
                  >
                    Non Conforme
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Commentaires et observations
                  </label>
                  <Textarea
                    value={answers[`${currentSection}-${idx}`]?.comment || ''}
                    onChange={(e) => handleAnswerChange(idx, { comment: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button className="w-full justify-center" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter des fichiers
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              {currentSection === sections.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnvironmentalQuestionnaireEvaluation;
