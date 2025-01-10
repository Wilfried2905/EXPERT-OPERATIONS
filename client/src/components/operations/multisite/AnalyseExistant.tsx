import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Upload } from 'lucide-react';
import '@/styles/progress.css';

interface Section {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    info: string;
  }>;
}

interface Result {
  status: 'conforme' | 'non-conforme' | null;
  comments: string;
}

export default function AnalyseExistant() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});

  const sections: Section[] = [
    {
      id: "objectifs",
      title: "Objectifs et stratégie opérationnelle",
      questions: [
        {
          id: "obj1",
          question: "Quels sont les principaux objectifs du client en matière de performance opérationnelle ?",
          info: "Cette question permet de comprendre les priorités du client en matière d'efficacité et de performance dans ses opérations."
        }
      ]
    },
    {
      id: "processus",
      title: "Gestion des processus opérationnels",
      questions: []
    },
    {
      id: "ressources",
      title: "Gestion des ressources humaines",
      questions: []
    },
    {
      id: "risques",
      title: "Gestion des risques opérationnels",
      questions: []
    },
    {
      id: "performance",
      title: "Performance et contrôle",
      questions: []
    }
  ];

  const calculateProgress = () => {
    const totalQuestions = sections.reduce((acc, section) => 
      acc + section.questions.length, 0);
    const answeredQuestions = Object.keys(results).length;
    return totalQuestions === 0 ? 0 : (answeredQuestions / totalQuestions) * 100;
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
        <h1 className="text-2xl font-bold mb-4">
          Analyse de l'existant
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">
                Progression
              </h3>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <p className="text-sm mt-2 text-gray-600">
                {calculateProgress().toFixed(1)}% complété
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">
                Conformité
              </h3>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${calculateConformity()}%` }}
                />
              </div>
              <p className="text-sm mt-2 text-gray-600">
                {calculateConformity().toFixed(1)}% conforme
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex mb-6">
          {sections.map((section, index) => (
            <Button
              key={section.id}
              variant={activeTab === index ? "default" : "ghost"}
              onClick={() => setActiveTab(index)}
              className={`flex-1 px-4 py-2 rounded-none border-b-2 ${
                activeTab === index
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'text-gray-700 border-transparent hover:bg-gray-100'
              }`}
            >
              {section.title}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            {sections[activeTab].questions.map((question) => (
              <div key={question.id} className="mb-8 last:mb-0">
                <h3 className="text-lg font-medium mb-2">
                  {question.question}
                </h3>

                <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    {question.info}
                  </p>
                </div>

                <div className="flex gap-4 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setResults(prev => ({
                      ...prev,
                      [question.id]: {
                        status: 'conforme',
                        comments: prev[question.id]?.comments || ''
                      }
                    }))}
                    className={`${
                      results[question.id]?.status === 'conforme'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : ''
                    }`}
                  >
                    Conforme
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setResults(prev => ({
                      ...prev,
                      [question.id]: {
                        status: 'non-conforme',
                        comments: prev[question.id]?.comments || ''
                      }
                    }))}
                    className={`${
                      results[question.id]?.status === 'non-conforme'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : ''
                    }`}
                  >
                    Non Conforme
                  </Button>
                </div>

                <textarea
                  value={results[question.id]?.comments || ''}
                  onChange={(e) => setResults(prev => ({
                    ...prev,
                    [question.id]: {
                      ...prev[question.id],
                      status: prev[question.id]?.status || null,
                      comments: e.target.value
                    }
                  }))}
                  placeholder="Commentaires et observations..."
                  className="w-full p-3 rounded border border-gray-200 mb-4"
                  rows={3}
                />

                <div className="flex items-center">
                  <label className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600">
                    <Upload className="h-5 w-5" />
                    <span>Ajouter des fichiers</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="px-6"
          >
            Précédent
          </Button>
          <Button
            onClick={() => setLocation('/operations/multisite/step2')}
            className="px-6 bg-orange-500 hover:bg-orange-600"
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}