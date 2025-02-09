import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AuditOperationnel = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [conformityData, setConformityData] = useState<Record<string, string>>({});

  const sections = [
    {
      title: "Organisation des opérations",
      questions: [
        {
          question: "Les équipes opérationnelles sont-elles clairement structurées ?",
          norm: "Une structure organisationnelle claire avec des rôles et responsabilités bien définis",
          id: "org1"
        },
        {
          question: "Existe-t-il un organigramme à jour ?",
          norm: "Un organigramme actualisé montrant la hiérarchie et les relations fonctionnelles",
          id: "org2"
        },
        {
          question: "Les rôles et responsabilités sont-ils documentés ?",
          norm: "Documentation détaillée des rôles, responsabilités et compétences requises",
          id: "org3"
        }
      ]
    },
    {
      title: "Processus et procédures",
      questions: [
        {
          question: "Existe-t-il des procédures opérationnelles standardisées ?",
          norm: "Procédures documentées couvrant toutes les opérations critiques",
          id: "proc1"
        },
        {
          question: "Comment est géré le processus de changement ?",
          norm: "Processus formel de gestion des changements avec évaluation des risques",
          id: "proc2"
        },
        {
          question: "Les procédures d'urgence sont-elles à jour ?",
          norm: "Procédures d'urgence documentées et testées régulièrement",
          id: "proc3"
        }
      ]
    },
    {
      title: "Gestion des incidents",
      questions: [
        {
          question: "Existe-t-il un processus de gestion des incidents ?",
          norm: "Processus structuré de détection, classification et résolution des incidents",
          id: "inc1"
        },
        {
          question: "Comment sont tracés les incidents ?",
          norm: "Système de suivi des incidents avec historique et analyses",
          id: "inc2"
        },
        {
          question: "Les escalades sont-elles bien définies ?",
          norm: "Procédure d'escalade claire avec niveaux et responsables identifiés",
          id: "inc3"
        }
      ]
    },
    {
      title: "Maintenance et support",
      questions: [
        {
          question: "Existe-t-il un planning de maintenance préventive ?",
          norm: "Planning détaillé des maintenances préventives avec fréquences définies",
          id: "maint1"
        },
        {
          question: "Comment est organisé le support technique ?",
          norm: "Organisation du support avec niveaux de service définis",
          id: "maint2"
        },
        {
          question: "Les interventions sont-elles documentées ?",
          norm: "Documentation complète des interventions avec suivi des actions",
          id: "maint3"
        }
      ]
    },
    {
      title: "Performance opérationnelle",
      questions: [
        {
          question: "Les KPIs opérationnels sont-ils définis ?",
          norm: "Indicateurs clés de performance pertinents et mesurables",
          id: "perf1"
        },
        {
          question: "Comment sont suivis les objectifs de performance ?",
          norm: "Suivi régulier des KPIs avec tableaux de bord",
          id: "perf2"
        },
        {
          question: "Existe-t-il un processus d'amélioration continue ?",
          norm: "Processus d'analyse et d'amélioration basé sur les KPIs",
          id: "perf3"
        }
      ]
    },
    {
      title: "Amélioration continue",
      questions: [
        {
          question: "Comment sont identifiées les opportunités d'amélioration ?",
          norm: "Processus systématique d'identification des axes d'amélioration",
          id: "amelio1"
        },
        {
          question: "Les retours d'expérience sont-ils exploités ?",
          norm: "Capitalisation sur les retours d'expérience et leçons apprises",
          id: "amelio2"
        },
        {
          question: "Comment est mesuré l'impact des améliorations ?",
          norm: "Mesure et suivi de l'efficacité des actions d'amélioration",
          id: "amelio3"
        }
      ]
    }
  ];

  const calculateProgress = () => {
    const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
    const answeredQuestions = Object.keys(conformityData).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleSubmitAudit = async () => {
    try {
      const auditData = {
        facilityInfo: {
          organization: sections[0].title,
          processes: sections[1].title,
          incidentManagement: sections[2].title,
          maintenance: sections[3].title,
          performance: sections[4].title,
          improvement: sections[5].title
        },
        measurements: {
          organization: {
            structureScore: conformityData['org1'] === 'conforme' ? 1 : 0,
            organigramScore: conformityData['org2'] === 'conforme' ? 1 : 0,
            rolesScore: conformityData['org3'] === 'conforme' ? 1 : 0
          },
          processes: {
            sopScore: conformityData['proc1'] === 'conforme' ? 1 : 0,
            changeManagementScore: conformityData['proc2'] === 'conforme' ? 1 : 0,
            emergencyProceduresScore: conformityData['proc3'] === 'conforme' ? 1 : 0
          },
          incidents: {
            managementScore: conformityData['inc1'] === 'conforme' ? 1 : 0,
            trackingScore: conformityData['inc2'] === 'conforme' ? 1 : 0,
            escalationScore: conformityData['inc3'] === 'conforme' ? 1 : 0
          },
          maintenance: {
            preventiveScore: conformityData['maint1'] === 'conforme' ? 1 : 0,
            supportScore: conformityData['maint2'] === 'conforme' ? 1 : 0,
            documentationScore: conformityData['maint3'] === 'conforme' ? 1 : 0
          }
        },
        tierLevel: {
          current: 3,
          target: 3
        },
        compliance: {
          architectural: {
            compliance: calculateComplianceScore(['org1', 'org2', 'org3']),
            gaps: getComplianceGaps(['org1', 'org2', 'org3']),
            requirements: ['Structure organisationnelle claire', 'Organigramme à jour', 'Documentation des rôles'],
            criticalIssues: getCriticalIssues(['org1', 'org2', 'org3'])
          },
          electrical: {
            compliance: calculateComplianceScore(['proc1', 'proc2', 'proc3']),
            gaps: getComplianceGaps(['proc1', 'proc2', 'proc3']),
            requirements: ['Procédures standardisées', 'Gestion des changements', 'Procédures d\'urgence'],
            criticalIssues: getCriticalIssues(['proc1', 'proc2', 'proc3'])
          },
          mechanical: {
            compliance: calculateComplianceScore(['inc1', 'inc2', 'inc3']),
            gaps: getComplianceGaps(['inc1', 'inc2', 'inc3']),
            requirements: ['Gestion des incidents', 'Traçabilité', 'Procédures d\'escalade'],
            criticalIssues: getCriticalIssues(['inc1', 'inc2', 'inc3'])
          },
          telecommunications: {
            compliance: calculateComplianceScore(['maint1', 'maint2', 'maint3']),
            gaps: getComplianceGaps(['maint1', 'maint2', 'maint3']),
            requirements: ['Maintenance préventive', 'Support technique', 'Documentation des interventions'],
            criticalIssues: getCriticalIssues(['maint1', 'maint2', 'maint3'])
          }
        }
      };

      const response = await generateRecommendations(auditData);
      window.location.href = '/recommendations';
    } catch (error) {
      console.error('Error submitting audit data:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi des données d'audit",
        variant: "destructive"
      });
    }
  };

  const calculateComplianceScore = (questionIds: string[]) => {
    const conformCount = questionIds.filter(id => conformityData[id] === 'conforme').length;
    return (conformCount / questionIds.length) * 100;
  };

  const getComplianceGaps = (questionIds: string[]) => {
    return questionIds
      .filter(id => conformityData[id] !== 'conforme')
      .map(id => {
        const question = sections.find(s => 
          s.questions.some(q => q.id === id)
        )?.questions.find(q => q.id === id);
        return question?.norm || '';
      })
      .filter(gap => gap !== '');
  };

  const getCriticalIssues = (questionIds: string[]) => {
    return questionIds
      .filter(id => conformityData[id] === 'non-conforme')
      .map(id => {
        const question = sections.find(s => 
          s.questions.some(q => q.id === id)
        )?.questions.find(q => q.id === id);
        return question?.question || '';
      });
  };

  const generateRecommendations = async (auditData: any) => {
    // Replace this with your actual recommendation generation logic.  This is a placeholder.
    console.log("Audit data submitted:", auditData);
    return new Promise(resolve => setTimeout(resolve, 1000));
  };


  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          Analyse de l'existant - Audit Opérationnel
        </h1>
        <div className="bg-white rounded-lg p-4 shadow">
          <Progress value={calculateProgress()} className="w-full h-2" />
          <p className="text-sm mt-2">Progression : {calculateProgress().toFixed(2)}%</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className={`${isDarkMode ? 'bg-[#002B47]' : 'bg-white'} shadow-lg`}>
          <div className="flex border-b border-gray-200">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  flex-1 px-4 py-3 text-center font-medium transition-colors whitespace-nowrap
                  ${activeTab === index 
                    ? isDarkMode 
                      ? 'bg-[#CC7A00] text-white border-b-2 border-[#CC7A00]' 
                      : 'bg-[#FF9900] text-white border-b-2 border-[#FF9900]'
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
                      onClick={() => setConformityData(prev => ({...prev, [q.id]: 'conforme'}))}
                      className={`px-4 py-2 rounded transition-colors ${
                        conformityData[q.id] === 'conforme'
                          ? 'bg-green-500 text-white'
                          : isDarkMode
                            ? 'bg-[#002B47] text-[#E0E0E0]'
                            : 'bg-gray-100 text-[#003366]'
                      }`}
                    >
                      Conforme
                    </button>
                    <button
                      onClick={() => setConformityData(prev => ({...prev, [q.id]: 'non-conforme'}))}
                      className={`px-4 py-2 rounded transition-colors ${
                        conformityData[q.id] === 'non-conforme'
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
            className={`px-6 py-3 rounded font-medium ${
              isDarkMode 
                ? 'bg-[#002B47] text-white' 
                : 'bg-[#003366] text-white'
            }`}
            disabled={activeTab === 0}
            onClick={() => setActiveTab(prev => prev - 1)}
          >
            Précédent
          </button>
          {activeTab === sections.length - 1 ? (
            <button 
              className={`px-6 py-3 rounded font-medium ${
                isDarkMode ? 'bg-[#CC7A00]' : 'bg-[#FF9900]'
              } text-white`}
              onClick={handleSubmitAudit}
            >
              Générer les Recommandations
            </button>
          ) : (
            <button 
              className={`px-6 py-3 rounded font-medium ${
                isDarkMode ? 'bg-[#CC7A00]' : 'bg-[#FF9900]'
              } text-white`}
              onClick={() => setActiveTab(prev => prev + 1)}
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditOperationnel;