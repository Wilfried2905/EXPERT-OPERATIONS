import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend } from 'recharts';

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

// Métriques principales
const metrics = [
  { title: "Nouveaux Clients", value: "12", trend: "+4", icon: "👥" },
  { title: "Fidélisation", value: "95%", trend: "+2%", icon: "🎯" },
  { title: "Score NPS", value: "72", trend: "+5", icon: "📈" },
  { title: "Satisfaction", value: "4.8/5", trend: "+0.3", icon: "⭐" }
];

// Données des graphiques
const satisfactionData = [
  { name: 'Jan', satisfaction: 4.5, nps: 65, fidelisation: 92 },
  { name: 'Fév', satisfaction: 4.6, nps: 68, fidelisation: 93 },
  { name: 'Mar', satisfaction: 4.7, nps: 70, fidelisation: 94 },
  { name: 'Avr', satisfaction: 4.8, nps: 72, fidelisation: 95 }
];

const segmentData = [
  { name: 'Grandes Entreprises', value: 45, color: COLORS.primary },
  { name: 'PME', value: 35, color: COLORS.secondary },
  { name: 'Startups', value: 20, color: COLORS.lightBlue }
];

// Assistant IA pour l'analyse client
const ClientAIAssistant = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    insights: string[];
    recommendations: string[];
    alerts: string[];
  }>(null);

  const suggestedAnalyses = [
    "Analyser les tendances de satisfaction client",
    "Identifier les opportunités de fidélisation",
    "Évaluer l'efficacité des programmes de rétention",
    "Segmenter la base client",
    "Prédire les risques de désabonnement"
  ];

  const handleAnalyze = () => {
    setAnalysis({
      insights: [
        "Hausse constante de la satisfaction client",
        "Forte progression du taux de fidélisation",
        "Amélioration significative du NPS"
      ],
      recommendations: [
        "Renforcer le programme de fidélisation",
        "Personnaliser davantage les services",
        "Mettre en place un suivi proactif"
      ],
      alerts: [
        "3 grands comptes nécessitent une attention particulière",
        "Baisse de satisfaction dans le segment PME"
      ]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Assistant IA - Analyses Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Posez votre question sur les clients..."
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

const ClientView = () => {
  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
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

      {/* Graphiques principaux */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Évolution de la Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="name" stroke={COLORS.primary} />
                <YAxis yAxisId="left" stroke={COLORS.primary} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.secondary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="satisfaction"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.white }}
                  name="Satisfaction"
                />
                <Bar yAxisId="right" dataKey="nps" fill={COLORS.secondary} name="NPS" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fidelisation"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: COLORS.white }}
                  name="Fidélisation"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Répartition par Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {segmentData.map((entry, index) => (
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
      <ClientAIAssistant />
    </div>
  );
};

export default ClientView;