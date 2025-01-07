import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  ClipboardCheck,
  ChevronRight,
} from 'lucide-react';
import { useLocation } from 'wouter';

interface OperationsWorkflowProps {
  onBack: () => void;
}

const OperationsWorkflow: React.FC<OperationsWorkflowProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    clientInfo: {},
    analysis: {},
    questionnaire: {}
  });
  const [globalScore, setGlobalScore] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Structuration des processus opérationnels",
      icon: BarChart3,
      score: 0
    },
    {
      id: 2,
      title: "Questionnaire d'Évaluation",
      icon: ClipboardCheck,
      score: 0
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLocation('/recommendations');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 border-[#003366]">
          <CardHeader className="bg-[#003366] text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">Collecte des Données</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg">Score Global:</span>
                <div className="w-32">
                  <Progress 
                    value={globalScore} 
                    className="h-3 bg-gray-200"
                  />
                  <span className="text-sm mt-1 block text-center">
                    {globalScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="text-center">
                    <div className={`
                      rounded-full w-8 h-8 mb-2 mx-auto flex items-center justify-center
                      ${currentStep >= index ? 'bg-[#FF9900] text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {index + 1}
                    </div>
                    <span className={`text-xs ${currentStep >= index ? 'text-[#003366]' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-[#003366]">
          <CardHeader className="bg-[#003366] text-white">
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          </CardHeader>
          <CardContent className="p-6">
            {currentStep === 0 && (
              <div>
                <p>Section en cours de développement...</p>
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <p>Section en cours de développement...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleNext}
            className="bg-[#003366] hover:bg-[#002347] text-white px-6 py-3 rounded font-medium"
          >
            {currentStep === steps.length - 1 ? 'Voir les Recommandations' : 'Suivant'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationsWorkflow;