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
          question: "Quels sont les principaux objectifs en matière de performance opérationnelle ?",
          norm: "Cette question permet de comprendre les priorités en matière d'efficacité et de performance."
        },
        {
          id: "obj2",
          question: "Avez-vous déjà réalisé un audit opérationnel ?",
          norm: "Permet de connaître l'historique des audits et des évaluations précédentes."
        }
      ]
    },
    {
      title: "Gestion des processus",
      questions: [
        {
          id: "proc1",
          question: "Les processus sont-ils régulièrement optimisés ?",
          norm: "Cette question évalue la maturité des processus d'amélioration continue."
        },
        {
          id: "proc2",
          question: "Avez-vous une documentation formalisée des processus ?",
          norm: "Permet d'évaluer le niveau de standardisation et de documentation des processus."
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

                  {/* Boutons Conforme/Non Conforme avant la zone de commentaires */}
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