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
      }
    ]
  },
  {
    title: "Gestion des ressources et performance",
    questions: [
      {
        id: "eval-res-1",
        question: "Les ressources nécessaires sont-elles correctement allouées aux différents processus ?",
        norm: "Référence : ISO 9001 - Une allocation efficace des ressources est cruciale pour la performance des processus."
      },
      {
        id: "eval-res-2",
        question: "Existe-t-il des indicateurs de performance (KPI) pertinents pour chaque processus ?",
        norm: "Référence : ITIL - Les KPIs doivent être alignés avec les objectifs opérationnels et stratégiques."
      },
      {
        id: "eval-res-3",
        question: "Les performances sont-elles régulièrement mesurées et analysées ?",
        norm: "Référence : Six Sigma - La mesure et l'analyse continues des performances sont essentielles pour l'amélioration."
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
          Questionnaire d'évaluation - Audit Opérationnel
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

        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setLocation('/recommendations')}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'
            } text-white`}
          >
            Voir les Recommandations
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireEvaluation;