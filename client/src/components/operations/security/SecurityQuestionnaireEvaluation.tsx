import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const SecurityQuestionnaireEvaluation = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Sécurisation de l'infrastructure",
      questions: [
        {
          id: "infra1",
          question: "Les pare-feu et les systèmes de détection d'intrusion sont-ils configurés pour bloquer les menaces connues et détecter les anomalies ?",
          norm: "Référence : Meilleures pratiques de sécurité - Utilisation de pare-feu et IDS pour empêcher les attaques et détecter les intrusions."
        },
        {
          id: "infra2",
          question: "Avez-vous mis en place des politiques de chiffrement pour protéger les données sensibles en transit et au repos ?",
          norm: "Référence : ISO 27001, NIST - Le chiffrement des données est une mesure essentielle pour protéger les informations sensibles."
        },
        {
          id: "infra3",
          question: "Les dispositifs d'accès physique aux centres de données sont-ils contrôlés et sécurisés ?",
          norm: "Référence : ISO 27001 - Assurer que l'accès physique aux infrastructures critiques soit restreint."
        },
        {
          id: "infra4",
          question: "Les systèmes de contrôle d'accès au réseau (firewall, VPN) sont-ils configurés pour limiter l'accès aux ressources sensibles ?",
          norm: "Référence : NIST, CIS - Utilisation de mécanismes de sécurité réseau pour restreindre l'accès aux ressources sensibles."
        }
      ]
    },
    {
      title: "Gestion des identités et des accès",
      questions: [
        {
          id: "iam1",
          question: "Utilisez-vous une solution de gestion des identités pour contrôler et suivre l'accès des utilisateurs aux ressources sensibles ?",
          norm: "Référence : ISO 27001 - La gestion des identités (IAM) est cruciale pour limiter les accès non autorisés."
        },
        {
          id: "iam2",
          question: "Les mots de passe et autres moyens d'authentification respectent-ils des critères de complexité et de renouvellement réguliers ?",
          norm: "Référence : NIST - Les bonnes pratiques incluent des politiques strictes de gestion des mots de passe."
        },
        {
          id: "iam3",
          question: "Les utilisateurs ont-ils un accès strictement limité aux systèmes et ressources dont ils ont besoin pour leur travail ?",
          norm: "Référence : ISO 27001 - Limiter l'accès selon le principe du moindre privilège pour renforcer la sécurité."
        },
        {
          id: "iam4",
          question: "Les droits d'accès sont-ils réévalués régulièrement pour s'assurer qu'ils sont toujours appropriés ?",
          norm: "Référence : CIS, NIST - Réévaluation périodique des accès pour éviter des accès non autorisés ou obsolètes."
        }
      ]
    },
    {
      title: "Sécurité des données",
      questions: [
        {
          id: "data1",
          question: "Des sauvegardes régulières des données sensibles sont-elles effectuées et stockées de manière sécurisée ?",
          norm: "Référence : ISO 27001 - Les données doivent être régulièrement sauvegardées et chiffrées pour leur protection."
        },
        {
          id: "data2",
          question: "Avez-vous mis en place des mesures de protection contre la perte ou le vol de données sensibles ?",
          norm: "Référence : NIST - La protection des données contre les fuites ou les vols est essentielle pour éviter des violations."
        },
        {
          id: "data3",
          question: "Les dispositifs de stockage de données sont-ils sécurisés contre les accès non autorisés ?",
          norm: "Référence : ISO 27001 - Les supports de données doivent être protégés par des moyens physiques et logiques."
        },
        {
          id: "data4",
          question: "Les données sensibles sont-elles stockées de manière sécurisée dans des bases de données protégées ?",
          norm: "Référence : ISO 27001 - Les bases de données contenant des informations sensibles doivent être protégées par des mécanismes de sécurité."
        }
      ]
    },
    {
      title: "Réponse aux incidents et gestion des crises",
      questions: [
        {
          id: "incident1",
          question: "Avez-vous un plan d'intervention d'urgence et de reprise après sinistre pour les incidents de sécurité ?",
          norm: "Référence : ISO 27001 - Plan de continuité des activités et de reprise après sinistre pour garantir la résilience."
        },
        {
          id: "incident2",
          question: "Les employés sont-ils formés pour réagir en cas d'incident de sécurité ?",
          norm: "Référence : ISO 27001 - Formation continue des employés pour assurer une gestion efficace des incidents."
        },
        {
          id: "incident3",
          question: "Avez-vous un processus pour évaluer les impacts d'un incident de sécurité sur les opérations ?",
          norm: "Référence : NIST - Évaluation des impacts pour gérer les conséquences d'un incident."
        },
        {
          id: "incident4",
          question: "Les incidents de sécurité sont-ils suivis, analysés et rapportés de manière à en tirer des enseignements ?",
          norm: "Référence : NIST - Analyse post-incident pour prévenir les futurs incidents et améliorer les mesures de sécurité."
        }
      ]
    },
    {
      title: "Surveillance continue et gestion des vulnérabilités",
      questions: [
        {
          id: "monitor1",
          question: "Utilisez-vous des outils de surveillance continue pour détecter les vulnérabilités et menaces en temps réel ?",
          norm: "Référence : NIST, CIS - La surveillance continue est cruciale pour détecter les menaces à un stade précoce."
        },
        {
          id: "monitor2",
          question: "Les vulnérabilités détectées sont-elles corrigées dans un délai raisonnable ?",
          norm: "Référence : ISO 27001 - Processus de gestion des vulnérabilités pour assurer la mise à jour et la sécurisation continue des systèmes."
        },
        {
          id: "monitor3",
          question: "Les journaux d'activités sont-ils conservés de manière sécurisée et analysés régulièrement ?",
          norm: "Référence : ISO 27001 - Les journaux d'audit doivent être surveillés pour détecter les comportements suspects."
        },
        {
          id: "monitor4",
          question: "Les mises à jour de sécurité sont-elles appliquées en temps opportun pour corriger les vulnérabilités découvertes ?",
          norm: "Référence : NIST - Maintenir les systèmes à jour est crucial pour la gestion des risques."
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
          Questionnaire d'évaluation - Audit de Sécurité
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
            onClick={() => setLocation('/operations/security/client-info')}
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

export default SecurityQuestionnaireEvaluation;