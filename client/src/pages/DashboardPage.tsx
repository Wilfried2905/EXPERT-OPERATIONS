import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '../hooks/use-user';
import GeneralView from '../components/dashboard/GeneralView';
import FinancierView from '../components/dashboard/FinancierView';
import ClientView from '../components/dashboard/ClientView';
import OperationsView from '../components/dashboard/OperationsView';
import PredictifView from '../components/dashboard/PredictifView';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('general');

  if (!user) {
    return (
      <Card className="p-6">
        <p>{t('access_denied')}</p>
      </Card>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'general':
        return <GeneralView />;
      case 'financier':
        return user?.role === 'admin' ? <FinancierView /> : null;
      case 'client':
        return user?.role === 'admin' ? <ClientView /> : null;
      case 'operations':
        return <OperationsView />;
      case 'predictif':
        return user?.role === 'admin' ? <PredictifView /> : null;
      default:
        return <GeneralView />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#003366]">
          {t('dashboard')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={currentView === 'general' ? 'default' : 'outline'}
            onClick={() => setCurrentView('general')}
          >
            Vue Générale
          </Button>
          {user?.role === 'admin' && (
            <>
              <Button
                variant={currentView === 'financier' ? 'default' : 'outline'}
                onClick={() => setCurrentView('financier')}
              >
                Vue Financière
              </Button>
              <Button
                variant={currentView === 'client' ? 'default' : 'outline'}
                onClick={() => setCurrentView('client')}
              >
                Vue Client
              </Button>
            </>
          )}
          <Button
            variant={currentView === 'operations' ? 'default' : 'outline'}
            onClick={() => setCurrentView('operations')}
          >
            Vue Opérations
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant={currentView === 'predictif' ? 'default' : 'outline'}
              onClick={() => setCurrentView('predictif')}
            >
              Vue Analyses Prédictives
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {renderView()}
      </div>
    </div>
  );
};

export default DashboardPage;