import React from 'react';
import { 
  Search, Clipboard, Users, Wrench, Box, Building, BarChart, 
  Map, Radio, Activity, RefreshCw, Shield, CheckSquare, Award, 
  Server, Lock, Settings, Leaf, Network, FileText, Folder, 
  GraduationCap, Share2, Heart, PackageCheck, List, LineChart,
  Zap, UserPlus, Lightbulb, Hammer, Scale
} from 'lucide-react';

export const categoryStyles = {
  survey: {
    primary: "#1E40AF",
    secondary: "#3B82F6",
    gradientAngle: "45"
  },
  audit: {
    primary: "#9333EA",
    secondary: "#A855F7",
    gradientAngle: "60"
  },
  conseil: {
    primary: "#059669",
    secondary: "#10B981",
    gradientAngle: "30"
  },
  support: {
    primary: "#0369A1",
    secondary: "#0EA5E9",
    gradientAngle: "15"
  },
  ngridd: {
    primary: "#BE123C",
    secondary: "#E11D48",
    gradientAngle: "75"
  }
};

export const CategoryIcon = ({ category }: { category: keyof typeof categoryStyles }) => {
  const style = categoryStyles[category];
  const iconSize = "w-20 h-20";

  const getIconComponent = (category: string) => {
    switch(category) {
      case 'survey': return Search;
      case 'audit': return Clipboard;
      case 'conseil': return Users;
      case 'support': return Wrench;
      case 'ngridd': return Box;
      default: return Search;
    }
  };

  const IconComponent = getIconComponent(category);

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <linearGradient id={`gradient-${category}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.primary} stopOpacity="0.9"/>
          <stop offset="50%" stopColor={style.secondary} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={style.primary} stopOpacity="0.9"/>
        </linearGradient>
        <filter id={`glow-${category}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id={`shadow-${category}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2"/>
        </filter>
      </defs>
      <rect 
        width="200" 
        height="160" 
        rx="16" 
        fill={`url(#gradient-${category})`} 
        filter={`url(#shadow-${category})`}
      />
      <g 
        transform="translate(80, 50)" 
        filter={`url(#glow-${category})`}
        className="transition-transform duration-300"
      >
        <IconComponent className={`text-white ${iconSize} opacity-95`}/>
      </g>
    </svg>
  );
};

interface SubcategoryIconProps {
  icon: React.FC<any>;
  category: keyof typeof categoryStyles;
}

export const SubcategoryIcon = ({ icon: Icon, category }: SubcategoryIconProps) => {
  const style = categoryStyles[category];
  
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <defs>
        <linearGradient id={`gradient-sub-${category}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.secondary} stopOpacity="0.9"/>
          <stop offset="50%" stopColor={style.primary} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={style.secondary} stopOpacity="0.9"/>
        </linearGradient>
        <pattern id={`pattern-${category}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="white" fillOpacity="0.1"/>
        </pattern>
        <filter id={`glow-sub-${category}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect 
        width="100" 
        height="80" 
        rx="10" 
        fill={`url(#gradient-sub-${category})`}
      />
      <rect 
        width="100" 
        height="80" 
        rx="10" 
        fill={`url(#pattern-${category})`}
        fillOpacity="0.4"
      />
      <g 
        transform="translate(38, 28)" 
        filter={`url(#glow-sub-${category})`}
        className="opacity-95"
      >
        <Icon className="text-white w-6 h-6"/>
      </g>
    </svg>
  );
};
