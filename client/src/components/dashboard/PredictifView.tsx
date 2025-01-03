import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  primary: "#003366",
  secondary: "#FF9900",
  white: "#FFFFFF",
  gray: "#E5E5E5",
  lightBlue: "#4A90E2",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545",
  green: "#4CAF50",
  yellow: "#FFC107",
  red: "#F44336"
};

const metrics = [
  { title: "Prévisions", value: "+25%", trend: "+5%", icon: "📊" },
  { title: "Précision", value: "92%", trend: "+2%", icon: "🎯" },
  { title: "Alertes", value: "3", trend: "-2", icon: "⚠️" },
  { title: "Tendances", value: "↗", trend: "+4%", icon: "📈" }
];

const previsionsData = [
  { name: 'Jan', tendance: 100, prevision: 105, realise: 102, precision: 98 },
  { name: 'Fév', tendance: 105, prevision: 110, realise: 108, precision: 98 },
  { name: 'Mar', tendance: 110, prevision: 115, realise: 112, precision: 97 },
  { name: 'Avr', tendance: 115, prevision: 120, realise: 118, precision: 98 },
  { name: 'Mai', tendance: 120, prevision: 125, realise: 122, precision: 98 },
  { name: 'Jun', tendance: 125, prevision: 130, realise: 128, precision: 98 }
];

const riskData = [
  { name: 'Faible', value: 60, color: COLORS.success },
  { name: 'Moyen', value: 30, color: COLORS.warning },
  { name: 'Élevé', value: 10, color: COLORS.danger }
];

// Assistant IA pour l'analyse prédictive
const PredictifAIAssistant = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    insights: string[];
    recommendations: string[];
    alerts: string[];
  }>(null);

  const suggestedAnalyses = [
    "Analyser les tendances futures",
    "Identifier les risques potentiels",
    "Évaluer la précision des prévisions",
    "Optimiser les modèles prédictifs",
    "Détecter les anomalies émergentes"
  ];

  const handleAnalyze = () => {
    setAnalysis({
      insights: [
        "Tendance positive pour les 6 prochains mois",
        "Haute précision des modèles prédictifs",
        "Risques bien maîtrisés"
      ],
      recommendations: [
        "Affiner les modèles de prévision",
        "Renforcer la détection précoce",
        "Mettre à jour les seuils d'alerte"
      ],
      alerts: [
        "Risque de saturation dans 2 mois",
        "Tendance inhabituelle détectée"
      ]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Assistant IA - Analyses Prédictives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Posez votre question sur les prévisions..."
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
  );
};

const PredictifView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{metric.icon}</span>
                <div>
                  <div className="text-sm text-gray-500">{metric.title}</div>
                  <div className="text-2xl font-bold text-[#003366]">{metric.value}</div>
                  <div className={`text-sm ${
                    metric.trend.includes('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Prévisions vs Réalité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={previsionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="name" stroke={COLORS.primary} />
                <YAxis stroke={COLORS.primary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tendance"
                  stroke={COLORS.lightBlue}
                  strokeDasharray="3 3"
                  name="Tendance"
                />
                <Line
                  type="monotone"
                  dataKey="prevision"
                  stroke={COLORS.primary}
                  strokeDasharray="5 5"
                  name="Prévision"
                />
                <Line
                  type="monotone"
                  dataKey="realise"
                  stroke={COLORS.success}
                  name="Réalisé"
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  stroke={COLORS.secondary}
                  name="Précision"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Distribution des Risques</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {riskData.map((entry, index) => (
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
      <PredictifAIAssistant />
    </div>
  );
};

export default PredictifView;