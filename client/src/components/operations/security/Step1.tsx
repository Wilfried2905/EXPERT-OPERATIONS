import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const SecurityAuditStep1 = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Objectifs et stratégie de sécurité",
      questions: [
        {
          id: "obj1",
          question: "Quels sont les objectifs principaux du client en matière de sécurité ?",
          norm: "Cette question permet de comprendre les priorités du client en matière de sécurité et les domaines qu'il considère comme critiques."
        },
        {
          id: "obj2",
          question: "Avez-vous déjà réalisé un audit de sécurité ou une évaluation des risques par un tiers ?",
          norm: "Permet de connaître l'historique des audits et évaluations déjà effectués."
        },
        {
          id: "obj3",
          question: "Quelles normes ou cadres de sécurité suivez-vous actuellement (ISO 27001, NIST, etc.) ?",
          norm: "Cela permet d'identifier les normes existantes et leur impact sur la sécurité du système."
        },
        {
          id: "obj4",
          question: "Comment assurez-vous la conformité avec ces normes ?",
          norm: "Évaluation des processus de conformité et de leur efficacité."
        }
      ]
    },
    {
      title: "Infrastructure et sécurité physique",
      questions: [
        {
          id: "infra1",
          question: "Comment sont sécurisés les accès physiques à vos infrastructures critiques ?",
          norm: "Évaluation des mesures de sécurité physique pour protéger les équipements sensibles."
        },
        {
          id: "infra2",
          question: "Quelles sont les mesures de surveillance et de contrôle d'accès en place ?",
          norm: "Identification des systèmes de surveillance et des processus de contrôle d'accès."
        },
        {
          id: "infra3",
          question: "Comment gérez-vous la sécurité des zones sensibles ?",
          norm: "Évaluation de la gestion et de la protection des zones critiques."
        },
        {
          id: "infra4",
          question: "Quels sont les protocoles d'accès aux zones sécurisées ?",
          norm: "Vérification des procédures d'accès et de leur application."
        }
      ]
    },
    {
      title: "Protection des données",
      questions: [
        {
          id: "data1",
          question: "Comment sont protégées les données sensibles ?",
          norm: "Évaluation des mesures de protection des données critiques et confidentielles."
        },
        {
          id: "data2",
          question: "Quelles sont vos politiques de sauvegarde et de restauration ?",
          norm: "Analyse des processus de sauvegarde et de récupération des données."
        },
        {
          id: "data3",
          question: "Comment gérez-vous les accès aux données sensibles ?",
          norm: "Évaluation des contrôles d'accès aux informations critiques."
        },
        {
          id: "data4",
          question: "Quelles sont les procédures de chiffrement des données ?",
          norm: "Vérification des méthodes de chiffrement et de leur application."
        }
      ]
    },
    {
      title: "Gestion des incidents",
      questions: [
        {
          id: "incident1",
          question: "Quel est votre plan de réponse aux incidents de sécurité ?",
          norm: "Évaluation du plan de réponse et de sa pertinence."
        },
        {
          id: "incident2",
          question: "Comment sont détectés les incidents de sécurité ?",
          norm: "Analyse des mécanismes de détection des incidents."
        },
        {
          id: "incident3",
          question: "Comment sont gérés les incidents une fois détectés ?",
          norm: "Évaluation des procédures de gestion des incidents."
        },
        {
          id: "incident4",
          question: "Comment assurez-vous la continuité des activités en cas d'incident ?",
          norm: "Vérification des plans de continuité d'activité."
        }
      ]
    },
    {
      title: "Formation et sensibilisation",
      questions: [
        {
          id: "form1",
          question: "Comment formez-vous le personnel à la sécurité ?",
          norm: "Évaluation des programmes de formation à la sécurité."
        },
        {
          id: "form2",
          question: "Quelle est la fréquence des formations à la sécurité ?",
          norm: "Analyse de la régularité des formations."
        },
        {
          id: "form3",
          question: "Comment mesurez-vous l'efficacité des formations ?",
          norm: "Évaluation des méthodes de mesure de l'efficacité des formations."
        },
        {
          id: "form4",
          question: "Comment sont communiquées les politiques de sécurité ?",
          norm: "Vérification des processus de communication des politiques."
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
          Analyse de l'existant - Audit de Sécurité
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
                      ? 'bg-[#FF9900] text-white border-b-2 border-[#FF9900]'
                      : 'bg-[#003366] text-white border-b-2 border-[#003366]'
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
            onClick={() => setLocation('/operations/security/step2')}
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode ? 'bg-[#FF9900]' : 'bg-[#003366]'
            } text-white`}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditStep1;