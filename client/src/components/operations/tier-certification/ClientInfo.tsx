import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from 'wouter';

export default function TierCertificationClientInfo() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [clientInfo, setClientInfo] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    siteLocation: '',
    businessType: '',
    tierObjective: '',
    currentInfrastructure: '',
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
      <h1 className="text-2xl font-bold">{t('tierCertification.clientInfo.title')}</h1>
      <p className="text-gray-600">{t('tierCertification.clientInfo.description')}</p>

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
              <label className="block font-medium">{t('clientInfo.siteLocation')}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={clientInfo.siteLocation}
                onChange={(e) => handleInputChange('siteLocation', e.target.value)}
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
              <label className="block font-medium">{t('tierCertification.clientInfo.tierObjective')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.tierObjective}
                onChange={(e) => handleInputChange('tierObjective', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">{t('tierCertification.clientInfo.currentInfrastructure')}</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={clientInfo.currentInfrastructure}
                onChange={(e) => handleInputChange('currentInfrastructure', e.target.value)}
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
