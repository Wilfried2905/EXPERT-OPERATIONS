import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ComplianceStatus = ({ status, percentage }: { status: string; percentage: number }) => {
  const getColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <Progress value={percentage} className="w-24" />
      <span className={`font-medium ${getColor()}`}>{percentage}%</span>
      <Badge variant={percentage >= 80 ? 'default' : 'destructive'}>
        {status}
      </Badge>
    </div>
  );
};

const StandardsTabs = () => {
  const standards = [
    {
      name: 'TIA-942-B',
      version: '2022',
      description: 'Telecommunications Infrastructure Standard for Data Centers',
      compliance: 85,
      status: 'Conforme',
      clauses: [
        { id: '5.3', title: 'Architecture', compliance: 90 },
        { id: '6.2', title: 'Electrical Installation', compliance: 85 },
        { id: '7.1', title: 'Mechanical Systems', compliance: 80 },
        { id: '8.4', title: 'Telecommunications', compliance: 85 }
      ]
    },
    {
      name: 'TIA-942-A-1',
      version: '2019',
      description: 'Addenda 1 - Telecommunications Infrastructure Standard',
      compliance: 75,
      status: 'Partiel',
      clauses: [
        { id: 'A1.1', title: 'Additional Requirements', compliance: 75 }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Conformité aux Standards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {standards.map((standard, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{standard.name}</h3>
                  <p className="text-sm text-gray-500">Version {standard.version}</p>
                  <p className="text-sm text-gray-600 mt-1">{standard.description}</p>
                </div>
                <ComplianceStatus status={standard.status} percentage={standard.compliance} />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {standard.clauses.map((clause, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">§{clause.id}</span>
                        <p className="text-sm text-gray-600">{clause.title}</p>
                      </div>
                      <Progress value={clause.compliance} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardsTabs;
