import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnalyseExistant from './operational/Step1';
import QuestionnaireEvaluation from './operational/Step2';
import ClientInfo from './operational/ClientInfo';

interface DataCollectionWorkflowProps {
  onBack: () => void;
  onNext?: () => void;
}

const DataCollectionWorkflow: React.FC<DataCollectionWorkflowProps> = ({ onBack, onNext }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const steps = [
    { id: 0, title: "Informations Client et Sites", component: ClientInfo },
    { id: 1, title: "Analyse de l'Existant", component: AnalyseExistant },
    { id: 2, title: "Questionnaire d'Évaluation", component: QuestionnaireEvaluation }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Si c'est la dernière étape, naviguer vers les recommandations
      if (onNext) {
        onNext();
      } else {
        setLocation('/recommendations');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Barre de progression des étapes */}
        <div className="mb-8">
          <Progress
            value={progress}
            className="h-2 mb-4"
          />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`text-center flex-1 ${
                  currentStep === index 
                    ? 'text-[#003366] font-semibold' 
                    : currentStep > index 
                    ? 'text-[#FF9900]' 
                    : 'text-gray-400'
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center
                  ${currentStep >= index ? 'bg-[#FF9900] text-white' : 'bg-gray-200'}
                `}>
                  {index + 1}
                </div>
                <span className="text-sm">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenu de l'étape actuelle */}
        <Card className="mb-6">
          <CardHeader className="bg-[#003366] text-white">
            <h2 className="text-xl font-semibold">
              {steps[currentStep].title}
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <CurrentStepComponent />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-[#003366] text-white hover:bg-[#002347]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            className="bg-[#003366] text-white hover:bg-[#002347]"
          >
            {currentStep === steps.length - 1 ? 'Voir les Recommandations' : 'Suivant'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionWorkflow;