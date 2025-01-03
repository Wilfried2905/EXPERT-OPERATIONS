import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardCheck,
  FileSearch,
  LightbulbIcon,
  Headphones,
  Box,
  ArrowLeft,
  Search,
  Scale,
  CheckSquare,
  Users,
  BarChart,
  ShieldCheck,
  Leaf,
  Building2,
  BatteryCharging,
  GraduationCap,
  LayoutGrid,
  WrenchIcon,
  FileText,
  HardDrive,
  Container,
  BoxSelect,
  Moon,
  Sun
} from 'lucide-react';
import PrivacyPolicy from '@/components/operations/PrivacyPolicy';

interface CategoryIcon {
  icon: React.ComponentType<any>;
  description: string;
  subcategories: {
    [key: string]: {
      icon: React.ComponentType<any>;
      description: string;
    };
  };
}

interface Categories {
  [key: string]: CategoryIcon;
}

const categories: Categories = {
  'Survey': {
    icon: FileSearch,
    description: "Évaluation complète des infrastructures et études de faisabilité",
    subcategories: {
      'Évaluation de l\'Infrastructure': { icon: Building2, description: "Analyse détaillée des installations existantes" },
      'Études de faisabilité': { icon: BarChart, description: "Analyse de viabilité des projets" },
      'Études de localisation': { icon: Search, description: "Analyse des emplacements potentiels" },
      'Évaluations spécialisées': { icon: ClipboardCheck, description: "Évaluations techniques spécifiques" },
      'Études comparatives': { icon: Scale, description: "Analyse comparative des solutions" },
      'Études de modernisation': { icon: LightbulbIcon, description: "Plans de mise à niveau des installations" },
      'Études de résilience': { icon: ShieldCheck, description: "Évaluation de la robustesse des systèmes" }
    }
  },
  'Audits': {
    icon: ClipboardCheck,
    description: "Évaluations approfondies selon les normes et standards",
    subcategories: {
      'Audit de conformité TIA 942': { icon: CheckSquare, description: "Vérification des normes TIA 942" },
      'Pré-audit de certification': { icon: FileSearch, description: "Préparation à la certification" },
      'Tier Certification Audit': { icon: Scale, description: "Évaluation des niveaux Tier" },
      'Audits de sécurité': { icon: ShieldCheck, description: "Contrôle des mesures de sécurité" },
      'Audits Opérationnels': { icon: WrenchIcon, description: "Évaluation des processus opérationnels" },
      'Audits Environnementaux': { icon: Leaf, description: "Impact environnemental" },
      'Audits multisites': { icon: LayoutGrid, description: "Évaluation de plusieurs sites" }
    }
  },
  'Conseil': {
    icon: LightbulbIcon,
    description: "Services de consultation et d'optimisation",
    subcategories: {
      'Optimisation Energétique': { icon: BatteryCharging, description: "Amélioration de l'efficacité énergétique" },
      'Formation des équipes': { icon: Users, description: "Formation du personnel" },
      'Planification stratégique': { icon: LayoutGrid, description: "Développement de stratégies" },
      'Consulting technique spécialisé': { icon: WrenchIcon, description: "Expertise technique approfondie" },
      'Consulting opérationnel': { icon: BarChart, description: "Optimisation des opérations" },
      'Consulting stratégique': { icon: LightbulbIcon, description: "Conseil en stratégie" },
      'Consulting réglementaire': { icon: Scale, description: "Conformité réglementaire" }
    }
  },
  'Support': {
    icon: Headphones,
    description: "Accompagnement et support technique continu",
    subcategories: {
      'Production Documentaire Technique': { icon: FileText, description: "Création de documentation technique" },
      'Gestion de la documentation': { icon: FileText, description: "Organisation des documents" },
      'Formation des équipes': { icon: GraduationCap, description: "Formation du personnel" },
      'Transfert de Compétences': { icon: Users, description: "Transmission des connaissances" },
      'Support Technique Continu': { icon: Headphones, description: "Assistance technique permanente" },
      'Accompagnement Projet': { icon: LightbulbIcon, description: "Suivi de projets" },
      'Suivi des Recommandations': { icon: ClipboardCheck, description: "Mise en œuvre des conseils" },
      'Évaluations Périodiques': { icon: BarChart, description: "Contrôles réguliers" }
    }
  },
  'NGRIDD': {
    icon: Box,
    description: "Solutions de datacenters modulaires et flexibles",
    subcategories: {
      'Micro Datacenter': { icon: HardDrive, description: "Espace optimal < 10m² - Déploiement rapide et flexible - Solutions de refroidissement intégrées" },
      'Modular Datacenter': { icon: BoxSelect, description: "Extensible de 10m² à 50m² - Architecture standardisée et modulaire - Haute efficacité énergétique" },
      'Container Datacenter': { icon: Container, description: "Mobilité et déploiement rapide - Configuration standardisée - Solutions clés en main" }
    }
  }
};

interface CategoryCardProps {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  onClick: () => void;
  darkMode: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon: Icon, description, onClick, darkMode }) => (
  <div
    onClick={onClick}
    className={`${
      darkMode
        ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
        : 'bg-white hover:bg-gray-50'
    } rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 flex flex-col items-center text-center border border-[#003366]`}
  >
    <Icon className={`w-12 h-12 mb-4 ${darkMode ? 'text-[#FF9900]' : 'text-[#003366]'}`} />
    <h3 className="text-xl font-bold mb-2 font-sans">{title}</h3>
    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-sans`}>{description}</p>
  </div>
);

interface SubcategoryCardProps {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  darkMode: boolean;
  onClick: () => void;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ title, icon: Icon, description, darkMode, onClick }) => (
  <div
    onClick={onClick}
    className={`${
      darkMode
        ? 'bg-gray-800 text-gray-100 cursor-pointer hover:bg-gray-700'
        : 'bg-white cursor-pointer hover:bg-gray-50'
    } rounded-lg shadow p-4 flex flex-col items-center text-center transition-all duration-200`}
  >
    <Icon className={`w-8 h-8 mb-2 ${darkMode ? 'text-[#FF9900]' : 'text-[#003366]'}`} />
    <h4 className="text-lg font-bold mb-2 font-sans">{title}</h4>
    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-sans`}>{description}</p>
  </div>
);

export default function OperationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleSubcategoryClick = (subcategoryTitle: string) => {
    setSelectedSubcategory(subcategoryTitle);
    setShowPrivacyPolicy(true);
  };

  const handlePrivacyPolicyValidation = () => {
    setShowPrivacyPolicy(false);
    setLocation(`/operations/main`);
  };

  if (showPrivacyPolicy) {
    return (
      <PrivacyPolicy
        onValidate={handlePrivacyPolicyValidation}
        onBack={() => {
          setShowPrivacyPolicy(false);
          setSelectedSubcategory(null);
        }}
        isDarkMode={darkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen p-8 transition-colors duration-200 ${
      darkMode ? 'bg-[#001F33]' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center ${
                darkMode ? 'text-[#FF9900] hover:text-[#FF9900]/90' : 'text-[#FF9900] hover:text-[#cc7a00]'
              } font-sans`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux catégories
            </button>
          ) : (
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#003366]'} font-sans`}>
              Opérations
            </h1>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-800 text-[#FF9900]' : 'bg-gray-100 text-[#003366]'
            }`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categories[selectedCategory].subcategories).map(([title, { icon, description }]) => (
              <SubcategoryCard
                key={title}
                title={title}
                icon={icon}
                description={description}
                darkMode={darkMode}
                onClick={() => handleSubcategoryClick(title)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categories).map(([title, { icon, description }]) => (
              <CategoryCard
                key={title}
                title={title}
                icon={icon}
                description={description}
                onClick={() => setSelectedCategory(title)}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}