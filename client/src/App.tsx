import { Switch, Route, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "./hooks/use-user";
import { useTranslation } from 'react-i18next';
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import OperationsPage from "./pages/OperationsPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import MainOperationsFlow from "./components/operations/MainOperationsFlow";
import GithubTokenInput from "./components/settings/GithubTokenInput";
import RecommendationsView from "@/components/recommendations/RecommendationsView";
import DocumentGenerator from "@/components/documents/DocumentGenerator";
import DocumentNavigation from "@/components/operations/DocumentNavigation";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

function App() {
  const { user, isLoading } = useUser();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, on ne montre que la page d'authentification
  if (!user) {
    return (
      <Switch>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route>
          <AuthPage />
        </Route>
      </Switch>
    );
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>

        <Route path="/">
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Route>

        <Route path="/settings/github">
          <ProtectedRoute>
            <GithubTokenInput />
          </ProtectedRoute>
        </Route>

        <Route path="/operations/main">
          <ProtectedRoute>
            <MainOperationsFlow />
          </ProtectedRoute>
        </Route>

        <Route path="/operations">
          <ProtectedRoute>
            <OperationsPage />
          </ProtectedRoute>
        </Route>

        <Route path="/recommendations">
          <ProtectedRoute>
            <RecommendationsView />
          </ProtectedRoute>
        </Route>

        <Route path="/documents/generate">
          <ProtectedRoute>
            <DocumentGenerator />
          </ProtectedRoute>
        </Route>

        <Route path="/documents">
          <ProtectedRoute>
            <DocumentNavigation section="recommandations" onBack={() => window.history.back()} />
          </ProtectedRoute>
        </Route>

        <Route path="/admin">
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        </Route>

        <Route>
          <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="pt-6">
                <div className="flex mb-4 gap-2">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900">{t('errors.pageNotFound')}</h1>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {t('errors.pageNotFoundDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </Route>
      </Switch>
      <Toaster />
    </MainLayout>
  );
}

export default App;