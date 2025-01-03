import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const SecurityAnalyseExistant = () => {
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
          question: "Quels outils ou logiciels de gestion de la sécurité utilisez-vous actuellement ?",
          norm: "Cela permet d'évaluer les solutions mises en place pour assurer la sécurité des infrastructures et données."
        }
      ]
    },
    {
      title: "Infrastructure de sécurité",
      questions: [
        {
          id: "infra1",
          question: "Quel est le niveau de protection des systèmes d'information (pare-feu, détection d'intrusion, etc.) ?",
          norm: "Évalue la sécurité des systèmes de défense en place contre les intrusions."
        },
        {
          id: "infra2",
          question: "Les contrôles d'accès aux systèmes sont-ils bien définis et mis à jour régulièrement ?",
          norm: "Permet de vérifier l'efficacité et la gestion des accès aux systèmes sensibles."
        },
        {
          id: "infra3",
          question: "Avez-vous des systèmes de gestion des identités et des accès (IAM) en place ?",
          norm: "Cela permet de vérifier si la gestion des identités est centralisée et sécurisée."
        },
        {
          id: "infra4",
          question: "Les périphériques et les terminaux des employés (ordinateurs, mobiles, etc.) sont-ils sécurisés et protégés contre les menaces externes ?",
          norm: "Cette question évalue la gestion de la sécurité des appareils utilisés par les employés."
        }
      ]
    },
    {
      title: "Gestion des risques et conformité",
      questions: [
        {
          id: "risk1",
          question: "Avez-vous une politique de gestion des risques et des menaces formalisée ?",
          norm: "Vérifie si le client a un cadre formel de gestion des risques de sécurité."
        },
        {
          id: "risk2",
          question: "Quelles sont les principales menaces identifiées dans votre environnement informatique ?",
          norm: "Cette question permet d'identifier les menaces prioritaires et la préparation à y faire face."
        },
        {
          id: "risk3",
          question: "Est-ce que des audits internes ou des tests de pénétration sont régulièrement effectués pour identifier des vulnérabilités ?",
          norm: "Cela permet de savoir si des tests proactifs sont réalisés pour détecter les faiblesses."
        },
        {
          id: "risk4",
          question: "Votre organisation est-elle conforme aux exigences légales et réglementaires en matière de protection des données (RGPD, etc.) ?",
          norm: "Permet de vérifier la conformité du client aux réglementations relatives à la sécurité des données."
        }
      ]
    },
    {
      title: "Réponse aux incidents et gestion des crises",
      questions: [
        {
          id: "inc1",
          question: "Avez-vous une procédure documentée pour la gestion des incidents de sécurité ?",
          norm: "Cela permet d'évaluer la réactivité et l'organisation du client en cas d'incident de sécurité."
        },
        {
          id: "inc2",
          question: "Les employés sont-ils formés et sensibilisés aux bonnes pratiques de sécurité ?",
          norm: "Cette question explore l'aspect humain de la sécurité, notamment la sensibilisation des employés."
        },
        {
          id: "inc3",
          question: "Disposez-vous d'un plan de réponse aux incidents de sécurité et de reprise après sinistre ?",
          norm: "Cela permet de s'assurer que le client est préparé en cas d'incident majeur."
        },
        {
          id: "inc4",
          question: "Avez-vous un suivi des incidents de sécurité (rapports, investigations, etc.) ?",
          norm: "Cette question permet d'évaluer la gestion post-incident et l'analyse des causes des failles de sécurité."
        }
      ]
    },
    {
      title: "Surveillance et contrôle continu",
      questions: [
        {
          id: "surv1",
          question: "Comment surveillez-vous actuellement les menaces et les vulnérabilités en temps réel ?",
          norm: "Cette question évalue les outils et processus utilisés pour la surveillance continue des menaces."
        },
        {
          id: "surv2",
          question: "Utilisez-vous des outils de gestion des événements et des informations de sécurité (SIEM) ?",
          norm: "Permet de comprendre comment les événements de sécurité sont collectés et analysés."
        },
        {
          id: "surv3",
          question: "Les systèmes de surveillance de la sécurité sont-ils suffisamment redondants pour éviter toute interruption ?",
          norm: "Vérifie si la surveillance continue est assurée, même en cas de défaillance de l'un des systèmes."
        },
        {
          id: "surv4",
          question: "Les activités de sécurité sont-elles auditées régulièrement pour évaluer l'efficacité des contrôles en place ?",
          norm: "Cela permet de vérifier que des évaluations continues de l'efficacité des contrôles de sécurité sont effectuées."
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

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Analyse de l'existant - Audit de Sécurité
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
            {sections[activeTab].title}
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
            {sections.map((section, index) => (
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
            onClick={() => setLocation('/operations/security/questionnaire')}
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

export default SecurityAnalyseExistant;