import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEvaluationScores } from '@/hooks/use-evaluation-scores';

const AuditStep2 = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [, setLocation] = useLocation();

  const {
    questions,
    updateQuestionResponse,
    getGlobalScore,
  } = useEvaluationScores('questionnaire'); // Spécifier 'questionnaire'

  const sections = [
    {
      title: "Infrastructure Électrique",
      questions: questions.filter(q => q.group === 'Infrastructure électrique'),
    },
    {
      title: "Système de Refroidissement",
      questions: questions.filter(q => q.group === 'Refroidissement'),
    },
    {
      title: "Sécurité Physique",
      questions: questions.filter(q => q.group === 'Sécurité physique'),
    },
    {
      title: "Architecture Réseau",
      questions: questions.filter(q => q.group === 'Infrastructure réseau'),
    },
    {
      title: "Gestion Opérationnelle",
      questions: questions.filter(q => q.group === 'Gestion opérationnelle'),
    }
  ];

  const handleNext = () => {
    if (activeTab < sections.length - 1) {
      setActiveTab(activeTab + 1);
    } else {
      setLocation('/operations/audit/client-info');
    }
  };

  const globalScore = getGlobalScore();

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Questionnaire d'Évaluation
        </h1>

        {/* Barres de progression globales */}
        <Card className="mb-6 p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Taux de réponse:</span>
                <span className="text-sm font-medium">{Math.round(globalScore.repondu)}%</span>
              </div>
              <Progress value={globalScore.repondu} className="mb-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score de conformité:</span>
                <span className="text-sm font-medium">{Math.round(globalScore.score)}%</span>
              </div>
              <Progress 
                value={globalScore.score} 
                className="bg-gray-200"
                style={{
                  '--progress-background': 'rgb(34, 197, 94)',
                } as React.CSSProperties}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg`}>
          <div className="flex border-b border-gray-200">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  flex-1 px-4 py-3 text-center font-medium transition-colors
                  ${activeTab === index 
                    ? isDarkMode 
                      ? 'bg-[#FF9900] text-white border-b-2 border-[#FF9900]' 
                      : 'bg-[#003366] text-white border-b-2 border-[#003366]'
                    : isDarkMode
                      ? 'text-[#E0E0E0] hover:bg-[#001F33]'
                      : 'text-[#003366] hover:bg-gray-50'
                  }
                `}
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
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                        {q.text}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant={q.response === 'conforme' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateQuestionResponse(q.id, 'conforme')}
                          className={q.response === 'conforme' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          Conforme
                        </Button>
                        <Button
                          variant={q.response === 'non-conforme' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateQuestionResponse(q.id, 'non-conforme')}
                          className={q.response === 'non-conforme' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          Non Conforme
                        </Button>
                      </div>
                    </div>
                    <div className={`text-sm p-3 rounded ${
                      isDarkMode ? 'bg-[#001F33] text-[#E0E0E0]' : 'bg-blue-50 text-[#003366]'
                    }`}>
                      <Info className="inline mr-2" size={16} />
                      {q.norm}
                    </div>
                  </div>

                  <textarea
                    placeholder="Commentaires et observations..."
                    className={`w-full p-3 rounded border ${
                      isDarkMode 
                        ? 'bg-[#001F33] border-[#334455] text-[#E0E0E0]' 
                        : 'bg-white border-gray-200 text-[#003366]'
                    }`}
                    rows={3}
                    value={q.comment || ''}
                    onChange={(e) => updateQuestionResponse(q.id, 'comment', e.target.value)}
                  />

                  <div className="flex items-center space-x-4">
                    <label className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded ${
                      isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'
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
            onClick={handleNext}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'
            } text-white`}
          >
            {activeTab === sections.length - 1 ? 'Informations Client' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditStep2;