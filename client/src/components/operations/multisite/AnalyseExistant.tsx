import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

interface Result {
  status: 'conforme' | 'non-conforme' | null;
  comments: string;
}

interface Question {
  id: string;
  question: string;
  norm: string;
}

interface Section {
  title: string;
  questions: Question[];
}

const AnalyseExistant: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});

  const sections: Section[] = [
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

  const handleConformityChange = (questionId: string, status: 'conforme' | 'non-conforme') => {
    setResults(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status, comments: prev[questionId]?.comments || '' }
    }));
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setResults(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], comments: comment }
    }));
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
              <Button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                  activeTab === index
                    ? 'bg-[#003366] text-white border-b-2 border-[#003366]'
                    : 'text-[#003366] hover:bg-gray-50'
                }`}
              >
                {section.title}
              </Button>
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

                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={() => handleConformityChange(q.id, 'conforme')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        results[q.id]?.status === 'conforme'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Conforme
                    </Button>
                    <Button
                      onClick={() => handleConformityChange(q.id, 'non-conforme')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        results[q.id]?.status === 'non-conforme'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Non Conforme
                    </Button>
                  </div>

                  <textarea
                    value={results[q.id]?.comments || ''}
                    onChange={(e) => handleCommentChange(q.id, e.target.value)}
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
          <Button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded font-medium bg-[#003366] text-white"
          >
            Précédent
          </Button>
          <Button
            onClick={() => setLocation('/operations/multisite/step2')}
            className="px-6 py-3 rounded font-medium bg-[#FF9900] text-white"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyseExistant;