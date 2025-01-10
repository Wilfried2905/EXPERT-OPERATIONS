import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Alert,
  AlertDescription 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Building2, User, Plus, Trash2, MessageSquarePlus } from 'lucide-react';

interface ClientSiteInfoProps {
  userEmail: string;
}

const ClientSiteInfo: React.FC<ClientSiteInfoProps> = ({ userEmail }) => {
  const [clients, setClients] = useState([{
    name: '',
    phone: '',
    email: ''
  }]);

  const [technicians, setTechnicians] = useState([{
    name: '',
    phone: '',
    email: userEmail
  }]);

  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    location: ''
  });

  // État pour les commentaires et leur visibilité
  const [showComments, setShowComments] = useState(false);
  const [equipmentComments, setEquipmentComments] = useState('');

  // Fonction de sauvegarde automatique des commentaires
  useEffect(() => {
    if (equipmentComments.trim()) {
      const saveTimeout = setTimeout(() => {
        // TODO: Implémenter la sauvegarde vers le backend
        console.log('Saving equipment comments:', equipmentComments);
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [equipmentComments]);

  // Date du jour automatique
  const today = new Date().toISOString().split('T')[0];

  const addPerson = (type: 'client' | 'technician') => {
    if (type === 'client' && clients.length < 5) {
      setClients([...clients, { name: '', phone: '', email: '' }]);
    } else if (type === 'technician' && technicians.length < 5) {
      setTechnicians([...technicians, { name: '', phone: '', email: userEmail }]);
    }
  };

  const removePerson = (type: 'client' | 'technician', index: number) => {
    if (type === 'client') {
      setClients(clients.filter((_, i) => i !== index));
    } else {
      setTechnicians(technicians.filter((_, i) => i !== index));
    }
  };

  const updatePerson = (type: 'client' | 'technician', index: number, field: string, value: string) => {
    if (type === 'client') {
      const newClients = [...clients];
      newClients[index] = { ...newClients[index], [field]: value };
      setClients(newClients);
    } else {
      const newTechnicians = [...technicians];
      newTechnicians[index] = { ...newTechnicians[index], [field]: value };
      setTechnicians(newTechnicians);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Informations Client et Site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date et Entreprise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Date du Survey:</span>
            <Input type="date" value={today} disabled className="bg-gray-100" />
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-gray-500" />
            <Input 
              placeholder="Nom de l'entreprise" 
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
            />
          </div>
        </div>

        {/* Section Équipements */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Équipements</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowComments(!showComments)}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>+ Ajouter un Commentaire</span>
              </Button>
              <Button 
                onClick={() => {/* TODO: Ajouter la logique pour l'équipement */}}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un équipement</span>
              </Button>
            </div>
          </div>

          {/* Zone de commentaires dépliable */}
          {showComments && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-md border">
              <Textarea
                placeholder="Ajoutez vos commentaires sur les équipements ici..."
                value={equipmentComments}
                onChange={(e) => setEquipmentComments(e.target.value)}
                className="min-h-[100px] bg-white"
              />
              <p className="text-sm text-gray-500 italic">
                Les commentaires sont sauvegardés automatiquement
              </p>
            </div>
          )}
        </div>

        {/* Section Clients */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Informations Clients</h3>
            {clients.length < 5 && (
              <Button 
                onClick={() => addPerson('client')}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Client</span>
              </Button>
            )}
          </div>

          {clients.map((client, index) => (
            <div key={`client-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Nom et prénom"
                  value={client.name}
                  onChange={(e) => updatePerson('client', index, 'name', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Téléphone"
                  value={client.phone}
                  onChange={(e) => updatePerson('client', index, 'phone', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <Input 
                  type="email"
                  placeholder="Email"
                  value={client.email}
                  onChange={(e) => updatePerson('client', index, 'email', e.target.value)}
                />
                {index > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePerson('client', index)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section Techniciens */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Techniciens 3RT</h3>
            {technicians.length < 5 && (
              <Button 
                onClick={() => addPerson('technician')}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Technicien</span>
              </Button>
            )}
          </div>

          {technicians.map((tech, index) => (
            <div key={`tech-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Nom et prénom"
                  value={tech.name}
                  onChange={(e) => updatePerson('technician', index, 'name', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <Input 
                  placeholder="Téléphone"
                  value={tech.phone}
                  onChange={(e) => updatePerson('technician', index, 'phone', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <Input 
                  type="email"
                  value={tech.email}
                  disabled
                  className="bg-gray-100"
                />
                {index > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePerson('technician', index)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Situation géographique */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <Input 
            placeholder="Situation géographique"
            value={companyInfo.location}
            onChange={(e) => setCompanyInfo({...companyInfo, location: e.target.value})}
            className="flex-1"
          />
        </div>

        {/* Messages d'alerte pour les limites */}
        {clients.length >= 5 && (
          <Alert>
            <AlertDescription>
              Limite de 5 clients atteinte
            </AlertDescription>
          </Alert>
        )}
        {technicians.length >= 5 && (
          <Alert>
            <AlertDescription>
              Limite de 5 techniciens atteinte
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSiteInfo;