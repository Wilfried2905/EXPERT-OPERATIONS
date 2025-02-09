import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function MultisiteAuditClientInfo() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [clientInfo, setClientInfo] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    siteLocations: '',
    businessType: '',
    multisiteScope: '',
    existingSiteManagement: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setClientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Sauvegarder les informations client (à implémenter avec le state management)
    setLocation('/operations');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('multisite.clientInfo.title')}</h1>
      <p className="text-gray-600">{t('multisite.clientInfo.description')}</p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium">{t('clientInfo.companyName')}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={clientInfo.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">{t('clientInfo.contactName')}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={clientInfo.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">{t('clientInfo.email')}</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={clientInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">{t('clientInfo.phone')}</label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-md"
                  value={clientInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('clientInfo.address')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('multisite.clientInfo.siteLocations')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.siteLocations}
                onChange={(e) => handleInputChange('siteLocations', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('clientInfo.businessType')}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={clientInfo.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('multisite.clientInfo.multisiteScope')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.multisiteScope}
                onChange={(e) => handleInputChange('multisiteScope', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('multisite.clientInfo.existingSiteManagement')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.existingSiteManagement}
                onChange={(e) => handleInputChange('existingSiteManagement', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('clientInfo.additionalNotes')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSubmit}>
              {t('common.submit')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
