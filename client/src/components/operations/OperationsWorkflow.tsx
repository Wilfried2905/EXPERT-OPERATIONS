import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  BarChart3,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';
import ClientSiteInfo from './ClientSiteInfo';
import RoomManagement from './RoomManagement';

interface OperationsWorkflowProps {
  onBack: () => void;
}

const OperationsWorkflow: React.FC<OperationsWorkflowProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    clientInfo: {},
    analysis: {},
    questionnaire: {}
  });
  const [globalScore, setGlobalScore] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Informations Client et Sites",
      icon: Building2,
      score: 0
    },
    {
      id: 1,
      title: "Analyse de l'Existant",
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
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving form data:', formData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-[#FF9900]';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 border-[#003366]">
          <CardHeader className="bg-[#003366] text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#FF9900]"
                  onClick={onBack}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-3xl font-bold">Collecte des Données</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg">Score Global:</span>
                <div className="w-32">
                  <Progress 
                    value={globalScore} 
                    className={`h-3 ${getScoreColor(globalScore)}`}
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
              <div className="space-y-6">
                <ClientSiteInfo userEmail="" />
                <RoomManagement />
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <p>Section en cours de développement...</p>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <p>Section en cours de développement...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>

          <Button
            onClick={handleSave}
            className="bg-[#FF9900] hover:bg-[#e68a00] text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="bg-[#003366] hover:bg-[#002347] text-white"
          >
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationsWorkflow;