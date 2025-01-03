import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

interface ScoreData {
  score: number;
  repondu: number;
  nom: string;
}

interface ProgressScoreCardProps {
  title: string;
  globalScore: ScoreData;
  groupScores: ScoreData[];
}

export const ProgressScoreCard: React.FC<ProgressScoreCardProps> = ({
  title,
  globalScore,
  groupScores
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#003366]">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score Global */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Score Global</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Taux de réponse:</span>
                  <span className="text-sm font-medium">{Math.round(globalScore.repondu)}%</span>
                </div>
                <Progress value={globalScore.repondu} className="mb-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Score de conformité:</span>
                  <span className="text-sm font-medium">{Math.round(globalScore.score)}%</span>
                </div>
                <Progress 
                  value={globalScore.score} 
                  className="bg-gray-200"
                  style={{
                    '--progress-background': 'rgb(34, 197, 94)',
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </div>

          {/* Scores par groupe */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium">Scores par Catégorie</h3>
            {groupScores.map((group, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm font-medium">{group.nom}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Taux de réponse:</span>
                    <span className="text-sm font-medium">{Math.round(group.repondu)}%</span>
                  </div>
                  <Progress value={group.repondu} className="mb-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Score de conformité:</span>
                    <span className="text-sm font-medium">{Math.round(group.score)}%</span>
                  </div>
                  <Progress 
                    value={group.score} 
                    className="bg-gray-200"
                    style={{
                      '--progress-background': 'rgb(34, 197, 94)',
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressScoreCard;
