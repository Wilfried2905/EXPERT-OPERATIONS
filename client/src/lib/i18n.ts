import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "dashboard": "Tableau de Bord",
      "general_view": "Vue Générale",
      "financial_view": "Vue Financière",
      "client_view": "Vue Client",
      "operations_view": "Vue Opérations",
      "predictive_view": "Vue Analyses Prédictives",
      "operations": "Opérations",
      "administration": "Administration",
      "metrics": {
        "surveys": "Études Réalisées",
        "completion": "Taux de Complétion",
        "satisfaction": "Satisfaction Client",
        "roi": "ROI Global"
      },
      "charts": {
        "performance": "Performance Globale",
        "activities": "Répartition des Activités",
        "monthly": "Évolution Mensuelle",
        "comparison": "Comparaison par Service"
      }
    }
  },
  en: {
    translation: {
      "dashboard": "Dashboard",
      "general_view": "General View",
      "financial_view": "Financial View",
      "client_view": "Client View",
      "operations_view": "Operations View",
      "predictive_view": "Predictive Analysis",
      "operations": "Operations",
      "administration": "Administration",
      "metrics": {
        "surveys": "Completed Surveys",
        "completion": "Completion Rate",
        "satisfaction": "Client Satisfaction",
        "roi": "Global ROI"
      },
      "charts": {
        "performance": "Global Performance",
        "activities": "Activities Distribution",
        "monthly": "Monthly Evolution",
        "comparison": "Service Comparison"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    resources,
    lng: "fr", // Langue par défaut : français
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;