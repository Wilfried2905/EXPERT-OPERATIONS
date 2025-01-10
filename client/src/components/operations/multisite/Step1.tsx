import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Upload } from 'lucide-react';
import { useLocation } from 'wouter';
import '@/styles/progress.css';

export default function MultisiteAuditStep1() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'conforme' | 'non-conforme' | null; comments: string }>>({});

  const sections = [
    {
      category: "Structure organisationnelle",
      items: [
        "Comment sont organisés les différents sites du centre de données ?",
        "Quelle est la hiérarchie de gestion entre les sites ?",
        "Comment sont répartis les rôles et responsabilités entre les sites ?",
        "Existe-t-il une documentation centralisée de l'organisation multisite ?"
      ]
    },
    {
      category: "Coordination et communication",
      items: [
        "Comment est assurée la communication entre les sites ?",
        "Quels outils de collaboration sont utilisés ?",
        "Comment sont coordonnées les opérations entre les sites ?",
        "Comment sont gérés les incidents impliquant plusieurs sites ?"
      ]
    }
    //Removed sections 3 and 4 as per edited code
  ];

  const calculateProgress = () => {
    const totalQuestions = sections.reduce((acc, section) => acc + section.items.length, 0);
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
              <Button
                key={index}
                onClick={() => setActiveTab(index)}
                variant="ghost"
                className={`flex-1 px-4 py-3 text-center font-medium transition-colors rounded-none ${
                  activeTab === index
                    ? 'bg-[#003366] text-white'
                    : 'text-[#003366] hover:bg-gray-50'
                }`}
              >
                {section.category}
              </Button>
            ))}
          </div>

          <div className="p-6">
            {sections[activeTab].items.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-8 last:mb-0">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium text-[#003366]">
                      {question}
                    </h3>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setResults(prev => ({
                        ...prev,
                        [question]: { ...prev[question], status: 'conforme', comments: prev[question]?.comments || '' }
                      }))}
                      variant="outline"
                      className={`px-4 py-2 ${
                        results[question]?.status === 'conforme'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Conforme
                    </Button>
                    <Button
                      onClick={() => setResults(prev => ({
                        ...prev,
                        [question]: { ...prev[question], status: 'non-conforme', comments: prev[question]?.comments || '' }
                      }))}
                      variant="outline"
                      className={`px-4 py-2 ${
                        results[question]?.status === 'non-conforme'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Non Conforme
                    </Button>
                  </div>

                  <textarea
                    value={results[question]?.comments || ''}
                    onChange={(e) => setResults(prev => ({
                      ...prev,
                      [question]: { ...prev[question], comments: e.target.value }
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

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => setLocation('/recommendations')}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}