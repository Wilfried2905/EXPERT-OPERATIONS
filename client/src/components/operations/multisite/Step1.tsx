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
  const [isDarkMode] = useState(false);
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
    },
    {
      category: "Standardisation et cohérence",
      items: [
        "Les procédures sont-elles standardisées entre les sites ?",
        "Comment est assurée la cohérence des pratiques ?",
        "Existe-t-il des référentiels communs ?",
        "Comment sont gérées les spécificités locales ?"
      ]
    },
    {
      category: "Surveillance et reporting",
      items: [
        "Comment est effectué le monitoring des différents sites ?",
        "Quels sont les indicateurs de performance utilisés ?",
        "Comment sont consolidés les rapports multisite ?",
        "Existe-t-il un tableau de bord centralisé ?"
      ]
    }
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
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#001F33]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          {t('multisite.analysis.title')}
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
                {section.category}
              </button>
            ))}
          </div>

          <div className="p-6">
            {sections[activeTab].items.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-8 last:mb-0">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                      {question}
                    </h3>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setResults(prev => ({
                        ...prev,
                        [question]: { ...prev[question], status: 'conforme', comments: prev[question]?.comments || '' }
                      }))}
                      className={`px-4 py-2 rounded transition-colors ${
                        results[question]?.status === 'conforme'
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
                        [question]: { ...prev[question], status: 'non-conforme', comments: prev[question]?.comments || '' }
                      }))}
                      className={`px-4 py-2 rounded transition-colors ${
                        results[question]?.status === 'non-conforme'
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
                    value={results[question]?.comments || ''}
                    onChange={(e) => setResults(prev => ({
                      ...prev,
                      [question]: { ...prev[question], comments: e.target.value }
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