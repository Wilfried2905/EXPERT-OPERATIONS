import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  FileText,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import DocumentNavigation from './DocumentNavigation';
import DataCollectionWorkflow from './DataCollectionWorkflow';

const MainOperationsFlow = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [showCollectionWorkflow, setShowCollectionWorkflow] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documentSection, setDocumentSection] = useState<'collecte' | 'recommandations' | 'documents'>('collecte');

  const mainSteps = [
    {
      id: 0,
      title: "Collecte des Données",
      icon: ClipboardList,
      description: "Collecte et analyse des informations client"
    },
    {
      id: 1,
      title: "Recommandations",
      icon: BadgeCheck,
      description: "Générer des recommandations basées sur l'analyse"
    },
    {
      id: 2,
      title: "Documents",
      icon: FileText,
      description: "Produire les documents finaux"
    }
  ];

  const handleStepClick = (stepId: number) => {
    if (stepId === 0) {
      setShowCollectionWorkflow(true);
    } else if (stepId === 1) {
      setShowDocuments(true);
      setDocumentSection('recommandations');
    } else if (stepId === 2) {
      setShowDocuments(true);
      setDocumentSection('documents');
    }
    setCurrentStep(stepId);
  };

  if (showCollectionWorkflow) {
    return <DataCollectionWorkflow onBack={() => setShowCollectionWorkflow(false)} />;
  }

  if (showDocuments) {
    return (
      <DocumentNavigation 
        section={documentSection} 
        onBack={() => setShowDocuments(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-8">
          <CardHeader className="bg-[#003366] text-white">
            <h1 className="text-2xl font-bold">Workflow des Opérations</h1>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mainSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`
                      p-6 rounded-lg border-2 cursor-pointer
                      transition-all duration-200
                      ${currentStep === step.id 
                        ? 'border-[#003366] text-[#003366]' 
                        : 'border-gray-200 text-gray-400'}
                      hover:border-[#FF9900] hover:shadow-lg
                    `}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <StepIcon className="h-12 w-12" />
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      <Button 
                        className="mt-4 bg-[#FF9900] hover:bg-[#e68a00] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepClick(step.id);
                        }}
                      >
                        Commencer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainOperationsFlow;