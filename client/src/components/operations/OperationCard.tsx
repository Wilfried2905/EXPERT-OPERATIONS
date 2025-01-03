import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface OperationType {
  id: string;
  title: string;
  description: string;
  icon: string;
  subcategories: {
    id: string;
    title: string;
    description: string;
    icon: string;
    route?: string; // Ajout de la propriété route pour la navigation
  }[];
}

interface OperationCardProps {
  operation: OperationType;
  onSelect: (op: OperationType) => void;
}

export default function OperationCard({ operation, onSelect }: OperationCardProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const handleSubcategoryClick = (sub: OperationType['subcategories'][0]) => {
    if (operation.id === 'recommendations') {
      // Si c'est une recommandation, naviguer vers la route spécifique
      setLocation('/recommendations');
    } else {
      // Sinon, utiliser le comportement par défaut
      onSelect({ ...operation, subcategories: [sub] });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <img 
            src={operation.icon} 
            alt={operation.title}
            className="w-6 h-6"
          />
          {t(operation.title.toLowerCase())}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {t(operation.description)}
        </p>
        <div className="space-y-2">
          {operation.subcategories.map((sub) => (
            <div 
              key={sub.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
              onClick={() => handleSubcategoryClick(sub)}
            >
              <div className="flex items-center gap-2">
                <img 
                  src={sub.icon} 
                  alt={sub.title}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{t(sub.title)}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}