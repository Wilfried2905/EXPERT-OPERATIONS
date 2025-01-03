import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, TrendingUp, Users, Target } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area 
} from 'recharts';

const COLORS = {
  primary: "#003366",
  secondary: "#FF9900",
  success: "#28A745",
  warning: "#FFC107",
  danger: "#DC3545",
  info: "#4A90E2"
};

// Données pour les graphiques
const performanceData = {
  teamPerformance: [
    { metric: 'Rapidité', equipeA: 90, equipeB: 85, equipeC: 88 },
    { metric: 'Qualité', equipeA: 85, equipeB: 92, equipeC: 87 },
    { metric: 'Efficacité', equipeA: 88, equipeB: 86, equipeC: 90 },
    { metric: 'Satisfaction', equipeA: 92, equipeB: 90, equipeC: 89 }
  ],
  workloadTrend: [
    { day: 'Lun', charge: 85, capacity: 100 },
    { day: 'Mar', charge: 90, capacity: 100 },
    { day: 'Mer', charge: 95, capacity: 100 },
    { day: 'Jeu', charge: 88, capacity: 100 },
    { day: 'Ven', charge: 82, capacity: 100 }
  ],
  incidentTypes: [
    { type: 'Technique', count: 5, resolved: 4 },
    { type: 'Process', count: 3, resolved: 3 },
    { type: 'Resource', count: 4, resolved: 3 },
    { type: 'Client', count: 2, resolved: 2 }
  ],
  operationProgress: [
    { month: 'Jan', completed: 45, ongoing: 30, pending: 15 },
    { month: 'Fév', completed: 50, ongoing: 28, pending: 12 },
    { month: 'Mar', completed: 55, ongoing: 25, pending: 10 },
    { month: 'Avr', completed: 60, ongoing: 22, pending: 8 }
  ]
};

// Assistant IA pour les opérations
const OperationsAIAssistant = () => {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<null | {
    insights: string[];
    recommendations: string[];
    alerts: string[];
  }>(null);

  const suggestedAnalyses = [
    "Optimiser la répartition des charges de travail",
    "Identifier les risques de retard potentiels",
    "Analyser les tendances de performance par équipe",
    "Prédire les besoins en ressources",
    "Détecter les anomalies dans les processus"
  ];

  const handleAnalyze = () => {
    setAnalysis({
      insights: [
        "Performance des équipes au-dessus des objectifs",
        "Charge de travail optimale atteinte",
        "Baisse significative des incidents"
      ],
      recommendations: [
        "Renforcer la formation sur les nouveaux outils",
        "Optimiser la répartition des tâches",
        "Mettre en place un suivi préventif"
      ],
      alerts: [
        "Pic d'activité prévu la semaine prochaine",
        "3 opérations nécessitent une attention particulière"
      ]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Assistant IA - Analyses et Recommandations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Posez votre question sur les opérations..."
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

const OperationsView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Performance des équipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance par Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData.teamPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <Radar name="Équipe A" dataKey="equipeA" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.5} />
                <Radar name="Équipe B" dataKey="equipeB" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.5} />
                <Radar name="Équipe C" dataKey="equipeC" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.5} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution de la charge de travail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Charge de Travail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData.workloadTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="charge" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} name="Charge" />
                <Area type="monotone" dataKey="capacity" stroke={COLORS.danger} strokeDasharray="3 3" fill="none" name="Capacité" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Types d'incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Analyse des Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData.incidentTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.warning} name="Total" />
                <Bar dataKey="resolved" fill={COLORS.success} name="Résolus" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progression des opérations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression des Opérations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData.operationProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.5} name="Terminées" />
                <Area type="monotone" dataKey="ongoing" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.5} name="En cours" />
                <Area type="monotone" dataKey="pending" stackId="1" stroke={COLORS.warning} fill={COLORS.warning} fillOpacity={0.5} name="En attente" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Assistant IA */}
      <OperationsAIAssistant />
    </div>
  );
};

export default OperationsView;