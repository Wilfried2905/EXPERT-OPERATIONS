import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from 'react';
import GeneralView from './GeneralView';
import FinancierView from './FinancierView';
import ClientView from './ClientView';
import OperationsView from './OperationsView';
import PredictifView from './PredictifView';
import RecommendationsView from './RecommendationsView';

export default function DashboardView() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b mb-4">
          <TabsList className="w-full flex justify-between bg-white">
            <TabsTrigger 
              value="general" 
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Vue Générale
            </TabsTrigger>
            <TabsTrigger 
              value="financier"
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Vue Financière
            </TabsTrigger>
            <TabsTrigger 
              value="client"
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Vue Client
            </TabsTrigger>
            <TabsTrigger 
              value="operations"
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Vue Opérations
            </TabsTrigger>
            <TabsTrigger 
              value="predictif"
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Vue Analyses Prédictives
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className="flex-1 py-2 px-4 data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              Recommandations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="mt-6">
          <GeneralView />
        </TabsContent>

        <TabsContent value="financier" className="mt-6">
          <FinancierView />
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <ClientView />
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <OperationsView />
        </TabsContent>

        <TabsContent value="predictif" className="mt-6">
          <PredictifView />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <RecommendationsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}