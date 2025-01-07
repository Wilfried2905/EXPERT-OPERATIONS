import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download } from 'lucide-react';

interface StandardsDocsTabsProps {
  activeTab?: 'standards' | 'documentation';
}

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

export const StandardsDocsTabs: React.FC<StandardsDocsTabsProps> = ({ activeTab = 'standards' }) => {
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

  const documents = [
    {
      category: 'Procédures Opérationnelles',
      docs: [
        {
          title: 'Manuel des opérations',
          status: 'Complet',
          lastUpdate: '2024-01-15',
          requiredForTier: 'TIER 3',
          compliance: 100
        },
        {
          title: 'Procédures d\'urgence',
          status: 'En révision',
          lastUpdate: '2024-01-10',
          requiredForTier: 'TIER 3',
          compliance: 85
        }
      ]
    },
    {
      category: 'Documentation Technique',
      docs: [
        {
          title: 'Schémas électriques',
          status: 'À mettre à jour',
          lastUpdate: '2023-12-20',
          requiredForTier: 'TIER 3',
          compliance: 70
        },
        {
          title: 'Plans de maintenance',
          status: 'Complet',
          lastUpdate: '2024-01-05',
          requiredForTier: 'TIER 3',
          compliance: 95
        }
      ]
    }
  ];

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standards">Standards</TabsTrigger>
        <TabsTrigger value="documentation">Documentation</TabsTrigger>
      </TabsList>

      <TabsContent value="standards">
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
      </TabsContent>

      <TabsContent value="documentation">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Documentation Requise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {documents.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">{category.category}</h3>
                  <div className="space-y-4">
                    {category.docs.map((doc, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <h4 className="font-medium">{doc.title}</h4>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Dernière mise à jour: {doc.lastUpdate}
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {doc.requiredForTier}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <ComplianceStatus
                              status={doc.status}
                              percentage={doc.compliance}
                            />
                            <button className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              Télécharger
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StandardsDocsTabs;