import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const Progress = ({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) => (
  <div className={`relative w-full h-4 bg-gray-200 rounded-full ${className}`}>
    <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${value}%`, ...style }} />
  </div>
);


const SecurityAuditStep2 = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Infrastructure de sécurité",
      questions: [
        {
          id: "infra1",
          question: "L'architecture de sécurité est-elle documentée et à jour ?",
          norm: "La documentation de l'architecture de sécurité doit être maintenue à jour et facilement accessible."
        },
        {
          id: "infra2",
          question: "Les systèmes de protection périmétrique sont-ils efficaces ?",
          norm: "Évaluation de l'efficacité des systèmes de protection périmétrique (pare-feu, IDS/IPS, etc.)."
        },
        {
          id: "infra3",
          question: "Comment est gérée la segmentation réseau ?",
          norm: "Vérification de la mise en place d'une segmentation réseau appropriée pour isoler les systèmes critiques."
        }
      ]
    },
    {
      title: "Gestion des vulnérabilités",
      questions: [
        {
          id: "vuln1",
          question: "Comment sont identifiées et gérées les vulnérabilités ?",
          norm: "Processus d'identification, d'évaluation et de correction des vulnérabilités de sécurité."
        },
        {
          id: "vuln2",
          question: "Quelle est la fréquence des tests de pénétration ?",
          norm: "Planification et exécution régulière des tests de pénétration pour identifier les failles de sécurité."
        },
        {
          id: "vuln3",
          question: "Comment sont priorisées les corrections de vulnérabilités ?",
          norm: "Méthodologie de priorisation et de traitement des vulnérabilités identifiées."
        }
      ]
    },
    {
      title: "Réponse aux incidents",
      questions: [
        {
          id: "incident1",
          question: "Le plan de réponse aux incidents est-il documenté et testé ?",
          norm: "Documentation et test régulier du plan de réponse aux incidents de sécurité."
        },
        {
          id: "incident2",
          question: "Les rôles et responsabilités sont-ils clairement définis ?",
          norm: "Définition claire des rôles et responsabilités dans la gestion des incidents de sécurité."
        },
        {
          id: "incident3",
          question: "Comment sont analysés les incidents de sécurité ?",
          norm: "Processus d'analyse et de documentation des incidents de sécurité pour amélioration continue."
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

  const calculateSectionStats = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const questions = section.questions;
    const answered = questions.filter(q => results[q.id]?.status).length;
    const conforme = questions.filter(q => results[q.id]?.status === 'conforme').length;

    return {
      progress: (answered / questions.length) * 100,
      conformity: answered > 0 ? (conforme / answered) * 100 : 0
    };
  };

  const handleAnswerChange = (questionId: string, status: 'conforme' | 'non-conforme' | null, comments: string) => {
    setResults(prev => ({
      ...prev,
      [questionId]: { status, comments }
    }));
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Questionnaire d'évaluation - Audit de Sécurité
        </h1>

        {/* Barres de progression globales */}
        <Card className="mb-6 p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression:</span>
                <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="mb-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conformité:</span>
                <span className="text-sm font-medium">{Math.round(calculateConformity())}%</span>
              </div>
              <Progress 
                value={calculateConformity()} 
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
                        {q.question}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2 rounded ${
                            results[q.id]?.status === 'conforme'
                              ? 'bg-green-500 text-white'
                              : isDarkMode
                                ? 'bg-[#002B47] text-[#E0E0E0]'
                                : 'bg-gray-100 text-[#003366]'
                          }`}
                          onClick={() => handleAnswerChange(q.id, 'conforme', results[q.id]?.comments || '')}
                        >
                          Conforme
                        </button>
                        <button
                          className={`px-4 py-2 rounded ${
                            results[q.id]?.status === 'non-conforme'
                              ? 'bg-red-500 text-white'
                              : isDarkMode
                                ? 'bg-[#002B47] text-[#E0E0E0]'
                                : 'bg-gray-100 text-[#003366]'
                          }`}
                          onClick={() => handleAnswerChange(q.id, 'non-conforme', results[q.id]?.comments || '')}
                        >
                          Non Conforme
                        </button>
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
                    value={results[q.id]?.comments || ''}
                    onChange={(e) => handleAnswerChange(q.id, results[q.id]?.status, e.target.value)}
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

        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setLocation('/operations/security/client-info')}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'
            } text-white`}
          >
            Informations Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditStep2;