import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminPage() {
  const { t } = useTranslation();
  const { user } = useUser();

  if (user?.role !== 'admin') {
    return (
      <Card className="p-6">
        <p className="text-red-600">Accès réservé aux administrateurs</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#003366]">
        Administration
      </h2>
      <div className="grid gap-6">
        <UserManagement />
      </div>
    </div>
  );
}