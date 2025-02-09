import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const AnalyseExistant = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Objectifs et stratégie opérationnelle",
      questions: [
        {
          id: "obj1",
          question: "Quels sont les principaux objectifs du client en matière de performance opérationnelle ?",
          norm: "Cette question permet de comprendre les priorités du client en matière d'efficacité et de performance dans ses opérations."
        },
        {
          id: "obj2",
          question: "Avez-vous déjà réalisé un audit opérationnel ou une évaluation de la performance des processus internes ?",
          norm: "Permet de connaître l'historique des audits et des évaluations précédentes réalisés sur les opérations internes."
        },
        {
          id: "obj3",
          question: "Quels sont les indicateurs de performance (KPI) actuellement suivis pour évaluer l'efficacité des opérations ?",
          norm: "Cela permet d'évaluer les mesures de performance utilisées et leur pertinence dans le cadre des objectifs du client."
        },
        {
          id: "obj4",
          question: "Quelles ressources ou outils utilisez-vous pour gérer vos opérations au quotidien (logiciels, ERP, etc.) ?",
          norm: "Cette question permet de comprendre les outils en place pour la gestion des processus opérationnels."
        }
      ]
    },
    {
      title: "Gestion des processus opérationnels",
      questions: [
        {
          id: "proc1",
          question: "Comment vos processus opérationnels sont-ils structurés et documentés ?",
          norm: "Permet d'évaluer la maturité des processus en place et leur capacité à être suivis et améliorés."
        },
        {
          id: "proc2",
          question: "Les processus sont-ils régulièrement évalués et améliorés pour garantir leur efficacité ?",
          norm: "Cette question permet de vérifier si des processus d'amélioration continue sont en place."
        },
        {
          id: "proc3",
          question: "Y a-t-il une gestion centralisée ou décentralisée des opérations au sein de l'organisation ?",
          norm: "Permet de déterminer si la gestion des opérations est centralisée ou déléguée à différentes équipes."
        },
        {
          id: "proc4",
          question: "Quelles méthodes de gestion de projet utilisez-vous pour garantir l'efficacité des projets opérationnels ?",
          norm: "Cette question évalue les approches et méthodes (Agile, Scrum, Lean, etc.) utilisées pour piloter les projets."
        }
      ]
    },
    {
      title: "Gestion des ressources humaines",
      questions: [
        {
          id: "rh1",
          question: "Le personnel est-il suffisamment formé et sensibilisé aux processus opérationnels ?",
          norm: "Permet d'évaluer la compétence du personnel dans la gestion des opérations quotidiennes."
        },
        {
          id: "rh2",
          question: "Comment la performance des équipes opérationnelles est-elle mesurée et suivie ?",
          norm: "Cette question permet de comprendre les mécanismes de suivi de la performance individuelle et collective."
        },
        {
          id: "rh3",
          question: "Avez-vous un système de gestion des talents pour assurer le développement des compétences des collaborateurs ?",
          norm: "Permet de déterminer si un système est en place pour gérer les compétences et favoriser la montée en compétence des équipes."
        },
        {
          id: "rh4",
          question: "Les équipes sont-elles structurées de manière à favoriser la collaboration et l'efficacité des processus ?",
          norm: "Évalue l'organisation des équipes et leur capacité à collaborer efficacement dans le cadre des opérations."
        }
      ]
    },
    {
      title: "Gestion des risques opérationnels",
      questions: [
        {
          id: "risk1",
          question: "Avez-vous une cartographie des risques opérationnels identifiés au sein de vos processus ?",
          norm: "Cette question permet de comprendre si le client a une vue claire des risques potentiels et leur gestion."
        },
        {
          id: "risk2",
          question: "Les risques identifiés sont-ils correctement gérés et atténués dans vos processus opérationnels ?",
          norm: "Permet d'évaluer la capacité de l'organisation à gérer et atténuer les risques."
        },
        {
          id: "risk3",
          question: "Existe-t-il un plan de gestion de crise pour faire face à des perturbations dans les opérations ?",
          norm: "Vérifie si l'organisation est préparée à réagir en cas de crise qui pourrait perturber ses opérations."
        },
        {
          id: "risk4",
          question: "Les processus de gestion des risques sont-ils régulièrement réévalués pour garantir leur pertinence ?",
          norm: "Évalue la capacité de l'organisation à ajuster ses processus face à des évolutions internes ou externes."
        }
      ]
    },
    {
      title: "Performance et contrôle",
      questions: [
        {
          id: "perf1",
          question: "Quelles sont les principales méthodes de suivi et de contrôle utilisées pour évaluer les performances opérationnelles ?",
          norm: "Permet de comprendre les mécanismes en place pour surveiller la performance des opérations."
        },
        {
          id: "perf2",
          question: "Les résultats des audits opérationnels sont-ils régulièrement analysés et partagés avec les équipes concernées ?",
          norm: "Cette question permet d'évaluer la réactivité de l'organisation face aux résultats d'audits et leur capacité à les mettre en œuvre."
        },
        {
          id: "perf3",
          question: "Les objectifs de performance sont-ils alignés avec les stratégies globales de l'entreprise ?",
          norm: "Permet de vérifier l'alignement des objectifs opérationnels avec les objectifs stratégiques de l'organisation."
        },
        {
          id: "perf4",
          question: "Des mesures correctives sont-elles prises lorsque les performances ne répondent pas aux attentes ?",
          norm: "Cette question permet d'évaluer l'efficacité du système de gestion de la performance et la capacité à réagir face aux écarts."
        }
      ]
    }
  ];

  const calculateProgress = () => {
    const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
    const answeredQuestions = Object.keys(results).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const calculateConformity = () => {
    const answeredQuestions = Object.values(results);
    if (answeredQuestions.length === 0) return 0;
    const conformeCount = answeredQuestions.filter(r => r.status === 'conforme').length;
    return (conformeCount / answeredQuestions.length) * 100;
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Analyse de l'existant
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className={`p-4 ${isDarkMode ? 'bg-[#002B47]' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Progression
            </h3>
            <div className="progress-bar">
              <div
                className="progress-bar-indicator green"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {calculateProgress().toFixed(1)}% complété
            </p>
          </Card>
          <Card className={`p-4 ${isDarkMode ? 'bg-[#002B47]' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Conformité
            </h3>
            <div className="progress-bar">
              <div
                className={`progress-bar-indicator ${
                  calculateConformity() >= 75 ? 'green' :
                    calculateConformity() >= 50 ? 'yellow' :
                      'red'
                }`}
                style={{ width: `${calculateConformity()}%` }}
              />
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {calculateConformity().toFixed(1)}% conforme
            </p>
          </Card>
        </div>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg`}>
          <div className="flex border-b border-gray-200">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors
                  ${activeTab === index
                    ? isDarkMode
                      ? 'bg-[#CC7A00] text-white border-b-2 border-[#CC7A00]'
                      : 'bg-[#FF9900] text-white border-b-2 border-[#FF9900]'
                    : isDarkMode
                      ? 'text-[#E0E0E0] hover:bg-[#001F33]'
                      : 'text-[#003366] hover:bg-gray-50'
                  }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="p-6">
            {sections[activeTab].questions.map((q) => (
              <div key={q.id} className="mb-8 last:mb-0">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                      {q.question}
                    </h3>
                    <div className={`text-sm p-3 rounded ${
                      isDarkMode ? 'bg-[#001F33] text-[#E0E0E0]' : 'bg-blue-50 text-[#003366]'
                    }`}>
                      <Info className="inline mr-2" size={16} />
                      {q.norm}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setResults(prev => ({
                        ...prev,
                        [q.id]: { ...prev[q.id], status: 'conforme', comments: prev[q.id]?.comments || '' }
                      }))}
                      className={`px-4 py-2 rounded transition-colors ${
                        results[q.id]?.status === 'conforme'
                          ? 'bg-green-500 text-white'
                          : isDarkMode
                            ? 'bg-[#002B47] text-[#E0E0E0]'
                            : 'bg-gray-100 text-[#003366]'
                      }`}
                    >
                      Conforme
                    </button>
                    <button
                      onClick={() => setResults(prev => ({
                        ...prev,
                        [q.id]: { ...prev[q.id], status: 'non-conforme', comments: prev[q.id]?.comments || '' }
                      }))}
                      className={`px-4 py-2 rounded transition-colors ${
                        results[q.id]?.status === 'non-conforme'
                          ? 'bg-red-500 text-white'
                          : isDarkMode
                            ? 'bg-[#002B47] text-[#E0E0E0]'
                            : 'bg-gray-100 text-[#003366]'
                      }`}
                    >
                      Non Conforme
                    </button>
                  </div>

                  <textarea
                    value={results[q.id]?.comments || ''}
                    onChange={(e) => setResults(prev => ({
                      ...prev,
                      [q.id]: { ...prev[q.id], comments: e.target.value }
                    }))}
                    placeholder="Commentaires et observations..."
                    className={`w-full p-3 rounded border ${
                      isDarkMode
                        ? 'bg-[#001F33] border-[#334455] text-[#E0E0E0]'
                        : 'bg-white border-gray-200 text-[#003366]'
                    }`}
                    rows={3}
                  />

                  <div className="flex items-center space-x-4">
                    <label className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded ${
                      isDarkMode ? 'bg-[#CC7A00]' : 'bg-[#FF9900]'
                    } text-white`}>
                      <Upload size={20} />
                      <span>Ajouter des fichiers</span>
                      <input type="file" multiple className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => window.history.back()}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode
                ? 'bg-[#002B47] text-white'
                : 'bg-[#003366] text-white'
            }`}
          >
            Précédent
          </button>
          <button
            onClick={() => setLocation('/operations/operational/questionnaire')}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#CC7A00]' : 'bg-[#FF9900]'
            } text-white`}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyseExistant;