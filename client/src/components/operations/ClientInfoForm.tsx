import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ClientInfo {
  surveyDate: string;
  companyName: string;
  contacts: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
  technicians: string[];
}

interface Props {
  onSave: (data: ClientInfo) => void;
}

const ClientInfoForm: React.FC<Props> = ({ onSave }) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    surveyDate: new Date().toISOString().split('T')[0],
    companyName: '',
    contacts: [{ name: '', phone: '', email: '' }],
    technicians: []
  });

  const addContact = () => {
    setClientInfo(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '' }]
    }));
  };

  const addTechnician = () => {
    setClientInfo(prev => ({
      ...prev,
      technicians: [...prev.technicians, '']
    }));
  };

  const updateContact = (index: number, field: keyof typeof clientInfo.contacts[0], value: string) => {
    setClientInfo(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const updateTechnician = (index: number, value: string) => {
    setClientInfo(prev => ({
      ...prev,
      technicians: prev.technicians.map((tech, i) => 
        i === index ? value : tech
      )
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#003366]">Informations Client et Site</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Input
            type="date"
            value={clientInfo.surveyDate}
            onChange={(e) => setClientInfo(prev => ({ ...prev, surveyDate: e.target.value }))}
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Input
          placeholder="Nom de l'entreprise"
          value={clientInfo.companyName}
          onChange={(e) => setClientInfo(prev => ({ ...prev, companyName: e.target.value }))}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Informations Clients</h3>
            <Button 
              onClick={addContact}
              variant="outline" 
              className="text-[#003366] border-[#003366]"
            >
              + Ajouter Client
            </Button>
          </div>
          
          {clientInfo.contacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Nom et prénom"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Téléphone"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#003366]">Techniciens 3RT</h3>
            <Button 
              onClick={addTechnician}
              variant="outline"
              className="text-[#003366] border-[#003366]"
            >
              + Ajouter Technicien
            </Button>
          </div>

          {clientInfo.technicians.map((tech, index) => (
            <div key={index} className="mb-4">
              <Input
                placeholder="Nom du technicien"
                value={tech}
                onChange={(e) => updateTechnician(index, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInfoForm;
