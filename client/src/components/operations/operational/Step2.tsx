import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const evaluationSections = [
  {
    title: "Structuration des processus opérationnels",
    questions: [
      {
        id: "eval-proc-1",
        question: "Les processus sont-ils régulièrement modifiés ou optimisés en fonction des retours des équipes et des résultats des audits ?",
        norm: "Référence : ISO 9001 - L'amélioration continue est essentielle pour l'efficacité des processus."
      },
      {
        id: "eval-proc-2",
        question: "Les processus opérationnels sont-ils alignés avec les objectifs stratégiques de l'entreprise ?",
        norm: "Référence : Balanced Scorecard - L'alignement des processus avec les objectifs stratégiques permet d'assurer une exécution cohérente de la stratégie."
      },
      {
        id: "eval-proc-3",
        question: "Les processus sont-ils documentés de manière à garantir leur transparence et leur suivi ?",
        norm: "Référence : ISO 9001 - Une documentation rigoureuse des processus permet une meilleure gestion et un suivi précis des opérations."
      },
      {
        id: "eval-proc-4",
        question: "Les processus sont-ils standardisés à travers l'organisation ou y a-t-il des variations selon les équipes ?",
        norm: "Référence : Lean Six Sigma - La standardisation des processus est clé pour assurer l'efficacité et la qualité dans toutes les équipes."
      }
    ]
  },
  {
    title: "Gestion des ressources humaines et de la performance",
    questions: [
      {
        id: "eval-rh-1",
        question: "Les rôles et responsabilités des équipes sont-ils clairement définis pour éviter les chevauchements et les lacunes ?",
        norm: "Référence : RACI Matrix - La clarification des responsabilités permet d'optimiser la gestion des ressources humaines."
      },
      {
        id: "eval-rh-2",
        question: "Les équipes opérationnelles disposent-elles des ressources nécessaires pour atteindre les objectifs ?",
        norm: "Référence : ISO 9001 - L'allocation appropriée des ressources est essentielle pour atteindre les objectifs de performance."
      },
      {
        id: "eval-rh-3",
        question: "Les performances des collaborateurs sont-elles évaluées régulièrement à l'aide d'indicateurs objectifs ?",
        norm: "Référence : OKRs, KPIs - Une évaluation continue de la performance permet de maintenir un haut niveau d'efficacité opérationnelle."
      },
      {
        id: "eval-rh-4",
        question: "Les formations et le développement des compétences sont-ils adaptés aux besoins des équipes ?",
        norm: "Référence : ISO 9001 - La formation continue est essentielle pour garantir que les équipes sont préparées."
      }
    ]
  },
  {
    title: "Gestion des risques opérationnels",
    questions: [
      {
        id: "eval-risk-1",
        question: "Les risques opérationnels sont-ils intégrés dans la stratégie globale de gestion des risques ?",
        norm: "Référence : ISO 31000 - Une gestion intégrée des risques garantit la résilience et la continuité des opérations."
      },
      {
        id: "eval-risk-2",
        question: "Existe-t-il un processus formalisé pour évaluer les risques associés aux nouveaux projets ?",
        norm: "Référence : Project Management Institute (PMI) - L'évaluation des risques avant le lancement de projets permet de minimiser les perturbations futures."
      },
      {
        id: "eval-risk-3",
        question: "Les plans de continuité des opérations (PCA) sont-ils testés régulièrement ?",
        norm: "Référence : ISO 22301 - Des tests réguliers du PCA permettent de garantir une réaction efficace en cas de crise."
      },
      {
        id: "eval-risk-4",
        question: "Les incidents et défaillances sont-ils documentés et analysés pour éviter leur récurrence ?",
        norm: "Référence : ISO 9001 - La documentation des incidents et l'analyse des causes permet d'améliorer continuellement les processus."
      }
    ]
  },
  {
    title: "Suivi de la performance et gestion des résultats",
    questions: [
      {
        id: "eval-perf-1",
        question: "Les indicateurs de performance (KPI) utilisés sont-ils mesurables, pertinents et alignés avec les objectifs ?",
        norm: "Référence : SMART Goals - L'utilisation d'indicateurs SMART assure la pertinence et l'efficacité du suivi de la performance."
      },
      {
        id: "eval-perf-2",
        question: "Des audits internes sont-ils régulièrement réalisés pour évaluer l'efficacité des processus ?",
        norm: "Référence : ISO 9001 - Les audits internes permettent d'identifier les lacunes et de proposer des améliorations."
      },
      {
        id: "eval-perf-3",
        question: "Les résultats des audits sont-ils suivis par des actions correctives et préventives ?",
        norm: "Référence : ISO 9001 - Un suivi rigoureux des audits permet de corriger les erreurs et de prévenir leur réapparition."
      },
      {
        id: "eval-perf-4",
        question: "Les performances des opérations sont-elles communiquées clairement à toutes les parties prenantes ?",
        norm: "Référence : Balanced Scorecard - La communication des performances est essentielle pour l'engagement des équipes."
      }
    ]
  },
  {
    title: "Gestion des projets et des initiatives opérationnelles",
    questions: [
      {
        id: "eval-proj-1",
        question: "Comment sont priorisés et sélectionnés les projets d'amélioration opérationnelle ?",
        norm: "Référence : PMI - La priorisation des projets doit être alignée avec les objectifs stratégiques."
      },
      {
        id: "eval-proj-2",
        question: "Existe-t-il une méthodologie standardisée de gestion de projet ?",
        norm: "Référence : PRINCE2/PMI - L'utilisation d'une méthodologie standard assure la cohérence dans l'exécution des projets."
      },
      {
        id: "eval-proj-3",
        question: "Comment est assuré le suivi de l'avancement des projets opérationnels ?",
        norm: "Référence : Agile/Scrum - Un suivi régulier permet d'identifier rapidement les écarts et d'ajuster le cap."
      },
      {
        id: "eval-proj-4",
        question: "Comment est évalué le retour sur investissement des projets opérationnels ?",
        norm: "Référence : ROI Analysis - L'évaluation du ROI permet de justifier et d'optimiser les investissements."
      }
    ]
  }
];

const QuestionnaireEvaluation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const calculateProgress = () => {
    const totalQuestions = evaluationSections.reduce((acc, section) => acc + section.questions.length, 0);
    const answeredQuestions = Object.keys(results).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const calculateConformity = () => {
    const answeredQuestions = Object.values(results);
    if (answeredQuestions.length === 0) return 0;
    const conformeCount = answeredQuestions.filter(r => r.status === 'conforme').length;
    return (conformeCount / answeredQuestions.length) * 100;
  };

  const calculateSectionStats = (sectionIndex: number) => {
    const section = evaluationSections[sectionIndex];
    const questions = section.questions;
    const answered = questions.filter(q => results[q.id]?.status).length;
    const conforme = questions.filter(q => results[q.id]?.status === 'conforme').length;

    return {
      progress: (answered / questions.length) * 100,
      conformity: answered > 0 ? (conforme / answered) * 100 : 0
    };
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Questionnaire d'évaluation
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className={`p-4 ${isDarkMode ? 'bg-[#002B47]' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Progression globale
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
              Conformité globale
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

        <Card className={`p-4 mb-6 ${isDarkMode ? 'bg-[#002B47]' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
            {evaluationSections[activeTab].title}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Progression de la section</p>
              <div className="progress-bar">
                <div className="progress-bar-indicator green" style={{ width: `${calculateSectionStats(activeTab).progress}%` }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Conformité de la section</p>
              <div className="progress-bar">
                <div 
                  className={`progress-bar-indicator ${calculateSectionStats(activeTab).conformity >= 75 ? 'green' : 
                    calculateSectionStats(activeTab).conformity >= 50 ? 'yellow' : 'red'}`} 
                  style={{ width: `${calculateSectionStats(activeTab).conformity}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg`}>
          <div className="flex border-b border-gray-200">
            {evaluationSections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors truncate
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
            {evaluationSections[activeTab].questions.map((q) => (
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
            onClick={() => setLocation('/operations/operational/client-info')}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#CC7A00]' : 'bg-[#FF9900]'
            } text-white`}
          >
            Informations Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireEvaluation;