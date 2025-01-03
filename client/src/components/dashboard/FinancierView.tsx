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

// Métriques de performance financière
const metrics = [
  { title: "Revenus", value: "125M", trend: "+12%", icon: "📈" },
  { title: "Coûts", value: "45M", trend: "-5%", icon: "📉" },
  { title: "Marge", value: "64%", trend: "+8%", icon: "💰" },
  { title: "Budget Utilisé", value: "85%", trend: "-2%", icon: "📊" }
];

// Données des graphiques
const performanceData = [
  { name: 'Jan', revenus: 100, couts: 60, marge: 40, objectif: 45 },
  { name: 'Fév', revenus: 120, couts: 65, marge: 55, objectif: 50 },
  { name: 'Mar', revenus: 115, couts: 62, marge: 53, objectif: 52 },
  { name: 'Avr', revenus: 130, couts: 70, marge: 60, objectif: 55 },
  { name: 'Mai', revenus: 140, couts: 75, marge: 65, objectif: 58 },
  { name: 'Jun', revenus: 135, couts: 72, marge: 63, objectif: 60 }
];

const budgetData = [
  { name: 'Personnel', value: 45, color: COLORS.primary },
  { name: 'Équipement', value: 25, color: COLORS.secondary },
  { name: 'Marketing', value: 15, color: COLORS.lightBlue },
  { name: 'R&D', value: 15, color: COLORS.success }
];

const additionalCharts = [
  {
    title: "Évolution du ROI",
    data: [
      { month: 'Jan', roi: 15, target: 12 },
      { month: 'Fév', roi: 18, target: 14 },
      { month: 'Mar', roi: 16, target: 15 },
      { month: 'Avr', roi: 20, target: 16 }
    ]
  },
  {
    title: "Répartition des Investissements",
    data: [
      { category: 'Infrastructure', value: 40 },
      { category: 'Innovation', value: 30 },
      { category: 'Formation', value: 20 },
      { category: 'Marketing', value: 10 }
    ]
  }
];

// Assistant IA pour l'analyse financière
const FinanceAIAssistant = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    insights: string[];
    recommendations: string[];
    alerts: string[];
  }>(null);

  const suggestedAnalyses = [
    "Analyser les tendances de revenus",
    "Optimiser la structure des coûts",
    "Prédire les performances financières",
    "Identifier les opportunités d'investissement",
    "Évaluer les risques financiers"
  ];

  const handleAnalyze = () => {
    setAnalysis({
      insights: [
        "Croissance stable des revenus (+12%)",
        "Réduction significative des coûts opérationnels",
        "ROI en amélioration constante"
      ],
      recommendations: [
        "Augmenter les investissements en R&D",
        "Optimiser la gestion des coûts fixes",
        "Diversifier les sources de revenus"
      ],
      alerts: [
        "Pic de dépenses prévu le mois prochain",
        "2 postes budgétaires nécessitent une révision"
      ]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Assistant IA - Analyses Financières
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Posez votre question sur les finances..."
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

const FinancierView: React.FC = () => {
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
            <CardTitle className="text-[#003366]">Performance Financière</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="name" stroke={COLORS.primary} />
                <YAxis stroke={COLORS.primary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Bar dataKey="revenus" fill={COLORS.success} name="Revenus" />
                <Bar dataKey="couts" fill={COLORS.danger} name="Coûts" />
                <Line 
                  type="monotone" 
                  dataKey="marge" 
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: COLORS.white }}
                  name="Marge"
                />
                <Line 
                  type="monotone" 
                  dataKey="objectif" 
                  stroke={COLORS.secondary}
                  strokeDasharray="3 3"
                  name="Objectif"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Répartition du Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Évolution du ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={additionalCharts[0].data}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="month" stroke={COLORS.primary} />
                <YAxis stroke={COLORS.primary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  name="ROI"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke={COLORS.primary}
                  strokeDasharray="3 3"
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-[#003366]">Répartition des Investissements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={additionalCharts[1].data}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
                <XAxis dataKey="category" stroke={COLORS.primary} />
                <YAxis stroke={COLORS.primary} />
                <Tooltip contentStyle={{ backgroundColor: COLORS.white }} />
                <Legend />
                <Bar dataKey="value" fill={COLORS.secondary} name="Pourcentage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Assistant IA */}
      <FinanceAIAssistant />
    </div>
  );
};

export default FinancierView;