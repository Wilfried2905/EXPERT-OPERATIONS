import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  primary: "#003366",
  secondary: "#FF9900",
  white: "#FFFFFF",
  gray: "#E5E5E5",
  lightBlue: "#4A90E2",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545"
};

const GeneralView = () => {
  const { t } = useTranslation();

  const performanceMetrics = [
    { title: "Surveys Réalisés", value: "45/50", trend: "+5", icon: "📋" },
    { title: "Taux de Complétion", value: "92%", trend: "+3%", icon: "✅" },
    { title: "Satisfaction Client", value: "4.8/5", trend: "+0.2", icon: "⭐" },
    { title: "ROI Global", value: "185%", trend: "+15%", icon: "📈" }
  ];

  const performanceData = [
    { month: 'Jan', surveys: 42, satisfaction: 4.5, completion: 88 },
    { month: 'Fév', surveys: 45, satisfaction: 4.6, completion: 90 },
    { month: 'Mar', surveys: 48, satisfaction: 4.7, completion: 92 },
    { month: 'Avr', surveys: 50, satisfaction: 4.8, completion: 95 },
    { month: 'Mai', surveys: 52, satisfaction: 4.8, completion: 94 },
    { month: 'Jun', surveys: 55, satisfaction: 4.9, completion: 96 }
  ];

  const activitiesData = [
    { name: 'Surveys', value: 35, color: COLORS.primary },
    { name: 'Analyses', value: 30, color: COLORS.secondary },
    { name: 'Support', value: 20, color: COLORS.success },
    { name: 'Formation', value: 15, color: COLORS.lightBlue }
  ];

  // Assistant IA pour l'analyse générale
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    insights: string[];
    recommendations: string[];
    alerts: string[];
  }>(null);

  const suggestedAnalyses = [
    "Analyser la progression globale",
    "Évaluer l'efficacité des processus",
    "Identifier les axes d'amélioration",
    "Optimiser la répartition des ressources",
    "Prédire les tendances générales"
  ];

  const handleAnalyze = () => {
    setAnalysis({
      insights: [
        "Performance globale en hausse constante",
        "Forte amélioration de la satisfaction client",
        "Productivité des équipes optimale"
      ],
      recommendations: [
        "Renforcer la formation continue",
        "Optimiser les processus clés",
        "Développer de nouvelles métriques"
      ],
      alerts: [
        "Pic d'activité prévu le mois prochain",
        "2 processus nécessitent une optimisation"
      ]
    });
  };

  return (
    <div className="space-y-8">
      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{metric.icon}</span>
                <div>
                  <div className="text-sm text-gray-500">{metric.title}</div>
                  <div className="text-2xl font-bold text-[#003366]">{metric.value}</div>
                  <div className={`text-sm ${metric.trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Globale */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Performance Globale</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="month" stroke={COLORS.primary} />
                <YAxis stroke={COLORS.primary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="surveys" 
                  name="Surveys"
                  stroke={COLORS.primary} 
                  strokeWidth={2}
                  dot={{ fill: COLORS.white, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  name="Satisfaction"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: COLORS.white, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  name="Complétion"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.white, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des Activités */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Répartition des Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activitiesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {activitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Assistant IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Assistant IA - Analyses Générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Posez votre question sur la performance globale..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAnalyze}>Analyser</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Analyses suggérées :</h4>
              <ul className="list-disc pl-4 space-y-1">
                {suggestedAnalyses.map((suggestion, index) => (
                  <li key={index} className="text-sm cursor-pointer hover:text-blue-600">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {analysis && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Insights :</h4>
                  <ul className="list-disc pl-4">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="text-sm">{insight}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Recommandations :</h4>
                  <ul className="list-disc pl-4">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Alertes :</h4>
                  <ul className="list-disc pl-4">
                    {analysis.alerts.map((alert, index) => (
                      <li key={index} className="text-sm text-orange-600">{alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralView;