import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  const navItems = [
    {
      href: '/dashboard',
      label: "Tableau de Bord",
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      href: '/operations',
      label: "Opérations",
      icon: <ClipboardList className="w-4 h-4" />
    },
    {
      href: '/admin',
      label: "Administration",
      icon: <Settings className="w-4 h-4" />,
      adminOnly: true
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-[#003366] dark:bg-[#001F33]">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">3R EXPERT OPERATIONS</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-white hover:text-white/90"
              >
                <Globe className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-white hover:text-white/90"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:text-white/90"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="text-white">Déconnexion</span>
              </Button>
            </div>
          </div>

          <nav className="mt-4">
            <div className="flex space-x-6">
              {navItems.map((item) => {
                if (item.adminOnly && user?.role !== 'admin') {
                  return null;
                }

                const isSelected = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200
                        ${isSelected 
                          ? 'bg-[#FF9900] hover:bg-[#FF9900]/90 text-white' 
                          : 'text-white hover:bg-white/10'}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}