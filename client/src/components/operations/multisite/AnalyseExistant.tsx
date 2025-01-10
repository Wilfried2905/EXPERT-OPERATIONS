import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

const AnalyseExistant = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "Structure organisationnelle",
      questions: [
        {
          id: "struct1",
          question: "Comment sont organisés les différents sites du centre de données ?",
          norm: "Cette question permet d'évaluer l'organisation et la hiérarchie entre les sites."
        },
        {
          id: "struct2",
          question: "Quelle est la hiérarchie de gestion entre les sites ?",
          norm: "Permet de comprendre les relations hiérarchiques et la structure de management."
        },
        {
          id: "struct3",
          question: "Comment sont répartis les rôles et responsabilités entre les sites ?",
          norm: "Évalue la distribution des responsabilités et la coordination entre les sites."
        },
        {
          id: "struct4",
          question: "Existe-t-il une documentation centralisée de l'organisation multisite ?",
          norm: "Vérifie l'existence et la qualité de la documentation de l'organisation."
        }
      ]
    },
    {
      title: "Coordination et communication",
      questions: [
        {
          id: "coord1",
          question: "Comment est assurée la communication entre les sites ?",
          norm: "Évalue les processus et outils de communication inter-sites."
        },
        {
          id: "coord2",
          question: "Quels outils de collaboration sont utilisés ?",
          norm: "Identifie les outils et plateformes utilisés pour la collaboration."
        },
        {
          id: "coord3",
          question: "Comment sont coordonnées les opérations entre les sites ?",
          norm: "Évalue les mécanismes de coordination opérationnelle."
        },
        {
          id: "coord4",
          question: "Comment sont gérés les incidents impliquant plusieurs sites ?",
          norm: "Vérifie les procédures de gestion d'incidents multi-sites."
        }
      ]
    },
    {
      title: "Standardisation et cohérence",
      questions: [
        {
          id: "std1",
          question: "Les procédures sont-elles standardisées entre les sites ?",
          norm: "Évalue le niveau de standardisation des procédures."
        },
        {
          id: "std2",
          question: "Comment est assurée la cohérence des pratiques ?",
          norm: "Vérifie les mécanismes d'harmonisation des pratiques."
        },
        {
          id: "std3",
          question: "Existe-t-il des référentiels communs ?",
          norm: "Identifie l'existence et l'utilisation de référentiels partagés."
        },
        {
          id: "std4",
          question: "Comment sont gérées les spécificités locales ?",
          norm: "Évalue la gestion des particularités de chaque site."
        }
      ]
    },
    {
      title: "Surveillance et reporting",
      questions: [
        {
          id: "surv1",
          question: "Comment est effectué le monitoring des différents sites ?",
          norm: "Évalue les systèmes et processus de surveillance."
        },
        {
          id: "surv2",
          question: "Quels sont les indicateurs de performance utilisés ?",
          norm: "Identifie les KPIs et métriques de performance."
        },
        {
          id: "surv3",
          question: "Comment sont consolidés les rapports multisite ?",
          norm: "Vérifie les processus de consolidation des rapports."
        },
        {
          id: "surv4",
          question: "Existe-t-il un tableau de bord centralisé ?",
          norm: "Évalue les outils de reporting centralisé."
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold mb-4 text-[#003366]">
          Analyse de l'existant - Audit Multisite
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-2 text-[#003366]">
              Progression
            </h3>
            <div className="progress-bar">
              <div
                className="progress-bar-indicator green"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-gray-600">
              {calculateProgress().toFixed(1)}% complété
            </p>
          </Card>

          <Card className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-2 text-[#003366]">
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
            <p className="text-sm mt-2 text-gray-600">
              {calculateConformity().toFixed(1)}% conforme
            </p>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <div className="flex border-b border-gray-200">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                  activeTab === index
                    ? 'bg-[#003366] text-white border-b-2 border-[#003366]'
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
                    <h3 className="font-medium text-[#003366]">
                      {q.question}
                    </h3>
                    <div className="text-sm p-3 rounded bg-blue-50 text-[#003366]">
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
                    className="w-full p-3 rounded border bg-white border-gray-200 text-[#003366]"
                    rows={3}
                  />

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 rounded bg-[#003366] text-white">
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
            className="px-6 py-3 rounded font-medium bg-[#003366] text-white"
          >
            Précédent
          </button>
          <button
            onClick={() => setLocation('/operations/multisite/step2')}
            className="px-6 py-3 rounded font-medium bg-[#FF9900] text-white"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyseExistant;